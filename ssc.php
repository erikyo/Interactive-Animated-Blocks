<?php
/**
 * Plugin Name: SSC
 *
 */
if ( ! defined( 'SSC_PLUGIN_DIR_URL' ) ) {
	define( 'SSC_PLUGIN_DIR_URL', plugin_dir_url( __FILE__ ) );
}

function ssc_editor_scripts() {
	wp_enqueue_script(
		'ssc-gutenberg',
		SSC_PLUGIN_DIR_URL . '/build/ssc-editor.js',
		[ 'wp-i18n', 'wp-element', 'wp-blocks', 'wp-components', 'wp-editor' ]
	);
}
add_action( 'enqueue_block_editor_assets', 'ssc_editor_scripts' );


function ssc_script() {
	wp_enqueue_script(
		'ssc',
		SSC_PLUGIN_DIR_URL . '/build/ssc.js'
	);
}
add_action( 'wp_enqueue_scripts', 'ssc_script' );

function ssc_style() {
	wp_enqueue_style(
		'ssc_animate',
		'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css'
	);
}
add_action( 'wp_enqueue_scripts', 'ssc_style' );

/**
 * Register and enqueue a custom stylesheet in the WordPress admin.
 */
function ssc_editor_style() {
	wp_register_style( 'ssc_admin_css', SSC_PLUGIN_DIR_URL . '/build/ssc-editor.css');
	wp_enqueue_style( 'ssc_admin_css' );
}
add_action( 'admin_enqueue_scripts', 'ssc_editor_style' );
