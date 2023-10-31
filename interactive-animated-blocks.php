<?php
/**
 * Plugin Name: Interactive Animated Blocks
 * Plugin URI: https://github.com/erikyo/ssc
 * Description: This plugin provides an additional panel to Wordpress block editor that enables object interactivity and complex animations.
 * Version: 0.0.1
 * Author: codekraft
 */
function ssc_editor_scripts() {
	$asset = include __DIR__ . '/build/ssc-editor.asset.php';
	wp_enqueue_script( 'ssc-gutenberg', plugin_dir_url( __FILE__ ) . 'build/ssc-editor.js', $asset['dependencies'] );
}

add_action( 'enqueue_block_editor_assets', 'ssc_editor_scripts' );


function ssc_script() {
	$asset = include __DIR__ . '/build/ssc.asset.php';
	wp_enqueue_script( 'ssc', plugin_dir_url( __FILE__ ) . 'build/ssc.js', $asset['dependencies'], false, true );
}

add_action( 'wp_enqueue_scripts', 'ssc_script' );

/**
 * Register and enqueue a custom stylesheet in the WordPress admin.
 */
function ssc_editor_style() {
	wp_register_style( 'ssc_css_editor', plugin_dir_url( __FILE__ ) . 'build/ssc-editor.css' );
	wp_enqueue_style( 'ssc_css_editor' );
}
// add_action( 'enqueue_block_editor_assets', 'ssc_editor_style' );

/**
 * Register and enqueue the ssc stylesheet
 */
function ssc_style() {
	wp_register_style( 'ssc_css', plugin_dir_url( __FILE__ ) . 'build/ssc.css' );
	wp_enqueue_style( 'ssc_css' );
}

// add_action( 'wp_enqueue_scripts', 'ssc_style' );
