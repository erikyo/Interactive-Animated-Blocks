<?php

// WordPress media gallery support for video with encoding and preview gif

/**
 * Util function
 * Given an attachment id returns the path, filename and extension into an array
 *
 * @param $attachment_id
 * @param $metadata
 *
 * @return array
 */
function get_attachment_path( $attachment_id, $metadata ) {

	$upload_dir = wp_upload_dir();

	$attachment_path     = get_attached_file( $attachment_id );
	$attachment_filename = wp_basename( $attachment_path, "." . $metadata['fileformat'] );
	$file_path           = str_replace( $attachment_filename . "." . $metadata['fileformat'], "", $attachment_path );
	$uploads_path        = str_replace( $upload_dir['basedir'] . "/", "", $file_path );

	return array(
		$attachment_path, // /srv/www/wordpress-one/public_html/wp-content/uploads/2022/07/mov_bbb-1.mp4
		$file_path, // /srv/www/wordpress-one/public_html/wp-content/uploads/2022/07/
		$attachment_filename, // mov_bbb-1
		$uploads_path // 2022/07/
	);
}

/**
 * Encode video in different formats
 * Create the preview image and saves video metadata
 *
 * @param $metadata
 * @param $attachment_id
 *
 * @return array|false
 */
function save_video_formats( $metadata, $attachment_id ) {
	$mime_type = $metadata['mime_type'];

	if ( substr( $mime_type, 0, strlen( 'video/' ) ) === 'video/' ) {

		list( $attachment_path, $file_path, $attachment_filename, $uploads_path ) = get_attachment_path( $attachment_id, $metadata );

		$metadata['video'][ $metadata['fileformat'] ] = array(
			'file'      => $attachment_filename . "." . $metadata['fileformat'],
			'mime-type' => 'video/' . $metadata['fileformat']
		);

		/**
		 * Enabled video formats
		 *
		 * An array of video format that will be processed with ffmped
		 * in order to create an array similar to images resizes.
		 *
		 * @return array the array of enabled formats.
		 */
		$enabled_formats = apply_filters( 'video_enabled_formats', array( 'mp4', 'webm' ) );
		// remove the already available format
		$enabled_formats = array_diff( $enabled_formats, array( $metadata['fileformat'] ) );

		// check if ffmpeg is available
		exec( 'ffmpeg -v', $output, $retval );

		// maybe ffmpeg is missing
		if ( $retval !== 1 ) {
			error_log( 'ffmpeg missing. please read the documentation and install ffmpeg. ' . print_r( $metadata, true ) );
			return false;
		}

		foreach ( $enabled_formats as $ext ) {
			$filename      = wp_unique_filename( $file_path, $attachment_filename . "." . $ext );

			/**
			 * Enable audio in compressed video
			 *
			 * set to false to disable audio
			 *
			 * @return bool audio enabled
			 */
			$audio_enabled = apply_filters( 'video_enabled_audio', true );
			$audio_options = $audio_enabled ? '-ar 48000 -b:a 128k' : '-an';

			/**
			 * Video Output quality
			 *
			 * This is a very important parameter for internet videos since and high bitrate
			 * could introduce frame-skipping also after the video has partially buffered.
			 * check ffmpeg docs for more info: https://ffmpeg.org/ffmpeg.html
			 *
			 * @return array - the video maximum bitrate
			 */
			$video_quality = apply_filters( 'video_enabled_audio', '800k' );

			switch ( $ext ) {
				case 'webm' :
					exec( "ffmpeg -i $attachment_path  -c:v libvpx-vp9 -b:v $video_quality  -qmin 10 -qmax 40 -crf 40 -deadline best -c:a libvorbis $audio_options -g 10 " . $file_path . $filename, $output, $retval );
					if ( $retval === 0 ) {
						$metadata['video'][ $ext ] = array(
							'file'      => $filename,
							'width'     => $metadata['width'],
							'height'    => $metadata['height'],
							'mime-type' => 'video/' . $ext
						);
					}

					// todo this could be used to check if the video has been encoded
					$filesize = filesize($file_path . $filename);
					$metadata['filesize'] = $filesize;
					// replace the original video with the webm version
					update_post_meta( $attachment_id, '_wp_attached_file', $uploads_path . $filename );

					break;
				case 'mp4' :
					exec( "ffmpeg -i $attachment_path -c:v libx264 -b:v $video_quality -qmin 10 -qmax 40 -crf 40 -c:a aac $audio_options -g 10 " . $file_path . $filename, $output, $retval );
					if ( $retval === 0 ) {
						$metadata['video'][ $ext ] = array(
							'file'      => $filename,
							'width'     => $metadata['width'],
							'height'    => $metadata['height'],
							'mime-type' => 'video/' . $ext
						);
					}
					break;
				case 'ogv' :
					exec( "ffmpeg -i $attachment_path -c:v libtheora -b:v $video_quality -c:a libvorbis $audio_options -g 10 " . $file_path . $filename, $output, $retval );
					if ( $retval === 0 ) {
						$metadata['video'][ $ext ] = array(
							'file'      => $filename,
							'width'     => $metadata['width'],
							'height'    => $metadata['height'],
							'mime-type' => 'video/' . $ext
						);
					}
					break;
				default:
					return false;
			}

			// create a gif as thumbnail
			// -ss 3 | position: skip the first 3 seconds
			// -t 3 | duration: create a 3 seconds output
			// todo: gif size is wrong
			exec( "ffmpeg -ss 3 -t 3 -i $attachment_path -vf \"fps=10,scale=280:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse\" -loop 0  " . $file_path . $attachment_filename . ".gif", $output, $retval );
			if ( $retval === 0 ) {
				$thumb_data = array(
					'file'      => $attachment_filename . ".gif",
					'width'     => 280,
					'height'    => 280,
					'mime-type' => 'image/gif',
				);
				$metadata['sizes']['full'] = $thumb_data;
			}
		}
	}

	return $metadata;
}
add_filter( 'wp_generate_attachment_metadata', 'save_video_formats', 30, 2 );


/**
 * Delete video copies created with the previous function
 *
 * @param $attachment_id
 *
 * @return mixed
 */
function delete_video_formats( $attachment_id ) {

	// get the file path for the image being deleted
	$metadata = wp_get_attachment_metadata( $attachment_id );
	list( $attachment_path, $file_path, $attachment_filename, $uploads_path ) = get_attachment_path( $attachment_id, $metadata );

	// remove the video copies using the metadata video as iterator
	foreach ( $metadata["video"] as $attachment ) {
		if ( file_exists( $file_path . $attachment['file'] ) ) {
			wp_delete_file( $file_path . $attachment['file'] );
		} else {
			error_log( 'Unable to delete ' . $file_path . $attachment['file'] );
		}
	}

	return $attachment_id;
}
add_filter( 'delete_attachment', 'delete_video_formats' );


/**
 * Get a video of the given format
 *
 * @param $id
 * @param $format
 *
 * @return void
 */
function wp_get_attachment_video($id, $format = 'mp4') {

}

/**
 * Get the video url of the given format
 *
 * @param $id
 * @param $format
 *
 * @return void
 */
function wp_get_attachment_video_url($id, $format = 'mp4') {

}


