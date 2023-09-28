/**
 * A wrapper that watch the current position and updates
 *
 * @module navigator
 *
 * @param {IntersectionObserverEntry} entry - the navigation container
 */
import { isPartiallyVisible } from '../../utils/utils';
import { windowProps } from '../_ssc';

function navigator(entry) {
	const wrapper = entry.target;
	const navigationSteps = {};
	let lastY = 0;

	function createNavigation(childrens) {
		const header = document.createElement('div');

		header.innerHTML = '';
		header.id = 'navigator-header';
		header.classList.add('navigator-header');

		const headerData = {
			labels: [],
			data: [],
			html: '',
		};

		if (childrens) {
			// contain the list of steps
			const headerLabels = document.createElement('div');
			headerLabels.id = 'navigator-labels';
			// append the steps list to the header
			header.append(headerLabels);

			// the progress bar wrapper
			const progressBarContainer = document.createElement('div');
			progressBarContainer.id = 'navigator-progress-container';

			// contains the dots
			const headerDotWrapper = document.createElement('div');
			headerDotWrapper.id = 'navigator-progress';

			Object.values(childrens).forEach((child, key) => {
				const c = {};
				const lastScrollPosition = window.scrollY;

				c.id = key;
				c.slug = 'step-' + c.id;
				c.title = 'step-' + key;
				c.scrollY =
					lastScrollPosition + child.getBoundingClientRect().top;

				// store the step Y position
				navigationSteps[c.id] = c.scrollY;

				// store the navigation data (id, title)
				headerData.data[key] = c;

				const labelContainer = document.createElement('p');
				labelContainer.classList.add('label-' + c.id);
				labelContainer.textContent = c.title;

				headerLabels.append(labelContainer);

				const dot = document.createElement('div');
				dot.classList.add('dot-' + c.id);
				headerDotWrapper.append(dot);
			});

			// append the steps titles list
			progressBarContainer.append(headerDotWrapper);

			// the progress bar
			const progressBar = document.createElement('progress');
			progressBar.id = 'navigator-progress-bar';
			progressBar.value = 0;
			progressBar.max = 100;
			progressBar.style = 'width: 100%; transition:100ms';

			// ally
			const progressBarLabel = document.createElement('label');
			progressBarLabel.htmlFor = 'navigator-progress-bar';
			progressBarLabel.style.display = 'none';
			progressBarLabel.textContent = 'navigations step progress';

			// append the progress bar
			progressBarContainer.append(progressBar);
			progressBarContainer.append(progressBarLabel);

			header.append(progressBarContainer);

			headerData.html = header;

			return headerData;
		}

		return false;
	}

	function navigationDestroy() {
		header = null;
	}

	function observeNavigation() {
		const progress = document.getElementById('navigator-progress-bar');

		if (isPartiallyVisible(wrapper)) {
			if (lastY === windowProps.lastScrollPosition) {
				return window.requestAnimationFrame(observeNavigation);
			}

			lastY = windowProps.lastScrollPosition;

			progress.value = lastY * 0.01;

			console.log(lastY);

			return window.requestAnimationFrame(observeNavigation);
		}
		navigationDestroy();
	}

	let header = document.getElementById('navigator-header') || false;

	if (!header) {
		const childrens = wrapper.children;
		header = createNavigation(childrens);
	}

	if (header) {
		wrapper.prepend(header.html);

		wrapper.sscData = header.data;
		wrapper.dataset.steps = header.data;

		if (navigationSteps) observeNavigation();
	}
}

export default navigator;
