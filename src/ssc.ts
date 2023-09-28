import './styles/ssc.scss';
import _ssc from './frontend/_ssc';
import { sscOptionsDefault } from './frontend/constants';
import { SscOptions } from './types';

/**
 * this is for further customization of the default options
 */
export const options: SscOptions = { ...sscOptionsDefault };

/**
 * On page scripts load trigger immediately ssc using sscOptions
 */
window.addEventListener('load', () => {
	if (typeof window.screenControl) {
		window.screenControl = new _ssc(options);
	} else {
		throw new Error('SSC ERROR: multiple instances loaded');
	}
});
