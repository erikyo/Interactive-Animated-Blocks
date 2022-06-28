<?php
/**
 * Plugin Name: SSC
 */
function ssc_editor_scripts() {
	$asset = include __DIR__ .'/build/ssc-editor.asset.php';
	wp_enqueue_script(
		'ssc-gutenberg',
		plugin_dir_url( __FILE__ ) . 'build/ssc-editor.js',
		$asset['dependencies']
	);
}
add_action( 'enqueue_block_editor_assets', 'ssc_editor_scripts' );


function ssc_script() {
	$asset = include __DIR__ . '/build/ssc.asset.php';
	wp_enqueue_script(
		'ssc',
		plugin_dir_url( __FILE__ ) . 'build/ssc.js',
		$asset['dependencies']
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
	wp_register_style( 'ssc_admin_css', plugin_dir_url( __FILE__ ) . '/build/ssc-editor.css');
	wp_enqueue_style( 'ssc_admin_css' );
}
add_action( 'admin_enqueue_scripts', 'ssc_editor_style' );
