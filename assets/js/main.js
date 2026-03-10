/*
	Massively by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function ($) {
	$(function () {
		// 1. Get the current filename (e.g., 'work.html' or 'index.html')
		var currentPath = window.location.pathname.split('/').pop() || 'index.html';

		// 2. Set the Active Navigation Class
		$('#nav .links li').removeClass('active');
		$('#nav .links li a').each(function () {
			// Split the href by '#' to only compare the HTML file name
			var targetPage = $(this).attr('href').split('#')[0];

			if (targetPage === currentPath) {
				$(this).parent('li').addClass('active');
			}
		});

		// --- NEW: Helper function to determine the scroll target ---
		function getScrollTarget(hash) {
			var target = $(hash);
			// If the target doesn't exist on this page, and we are looking for #nav, fallback to #main
			if (!target.length && hash === '#nav') {
				target = $('#main');
			}
			return target;
		}

		// 3. Smooth scroll on Cross-Page Load
		if (window.location.hash) {
			// Wait for full page load (images, CSS) so offset().top is 100% accurate
			$(window).on('load', function () {
				var target = getScrollTarget(window.location.hash);

				// --- DEBUGGING ---
				console.log("1. The URL Hash is:", window.location.hash);
				console.log("2. Did we find a target?:", target.length > 0 ? "Yes, ID: " + target.attr('id') : "No");
				if (target.length) {
					console.log("3. Target's distance from top is:", target.offset().top);
				}
				// -----------------

				if (target.length) {
					// A slightly longer delay (50ms) to ensure we beat the browser's native jump
					setTimeout(function () {
						// Snap to the top of the page first
						$('html, body').scrollTop(0);

						// Smoothly animate down to the target
						$('html, body').animate({
							scrollTop: target.offset().top
						}, 1500, 'swing');
					}, 50);
				}
			});
		}

		// 4. Smooth scroll on Same-Page Click
		$('#nav .links a').on('click', function (e) {
			var fullHref = $(this).attr('href');
			var targetPage = fullHref.split('#')[0];
			var targetHash = '#' + fullHref.split('#')[1];

			// If the link clicked belongs to the page we are CURRENTLY on
			if (targetPage === currentPath && targetHash !== '#undefined') {
				e.preventDefault(); // Stop the browser from reloading the page

				var targetElement = getScrollTarget(targetHash);

				if (targetElement.length) {
					// Smoothly scroll to the target
					$('html, body').animate({
						scrollTop: targetElement.offset().top
					}, 1000, 'swing');

					// Update the URL in the browser without causing a jump
					if (history.pushState) {
						history.pushState(null, null, targetHash);
					}
				}
			}
		});
	});

	var $window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$nav = $('#nav'),
		$main = $('#main'),
		$navPanelToggle, $navPanel, $navPanelInner;

	// Breakpoints.
	breakpoints({
		default: ['1681px', null],
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: ['361px', '480px'],
		xxsmall: [null, '360px']
	});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = function (intensity) {

		var $window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i = 0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function () {

			var $t = $(this),
				$bg = $('<div class="bg"></div>').appendTo($t),
				on, off;

			on = function () {

				$bg
					.removeClass('fixed')
					.css('transform', 'matrix(1,0,0,1,0,0)');

				$window
					.on('scroll._parallax', function () {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$bg.css('transform', 'matrix(1,0,0,1,0,' + (pos * intensity) + ')');

					});

			};

			off = function () {

				$bg
					.addClass('fixed')
					.css('transform', 'none');

				$window
					.off('scroll._parallax');

			};

			// Disable parallax on ..
			if (browser.name == 'ie'			// IE
				|| browser.name == 'edge'			// Edge
				|| window.devicePixelRatio > 1		// Retina/HiDPI (= poor performance)
				|| browser.mobile)					// Mobile devices
				off();

			// Enable everywhere else.
			else {

				breakpoints.on('>large', on);
				breakpoints.on('<=large', off);

			}

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function () {
				$window.trigger('scroll');
			});

		return $(this);

	};

	// Play initial animations on page load.
	$window.on('load', function () {
		window.setTimeout(function () {
			$body.removeClass('is-preload');
		}, 100);
	});

	// Scrolly.
	$('.scrolly').scrolly();

	// Background.
	$wrapper._parallax(0.925);

	// Nav Panel.

	// Toggle.
	$navPanelToggle = $(
		'<a href="#navPanel" id="navPanelToggle">Menu</a>'
	)
		.appendTo($wrapper);

	// Change toggle styling once we've scrolled past the header.
	$header.scrollex({
		bottom: '5vh',
		enter: function () {
			$navPanelToggle.removeClass('alt');
		},
		leave: function () {
			$navPanelToggle.addClass('alt');
		}
	});

	// Panel.
	$navPanel = $(
		'<div id="navPanel">' +
		'<nav>' +
		'</nav>' +
		'<a href="#navPanel" class="close"></a>' +
		'</div>'
	)
		.appendTo($body)
		.panel({
			delay: 500,
			hideOnClick: true,
			hideOnSwipe: true,
			resetScroll: true,
			resetForms: true,
			side: 'right',
			target: $body,
			visibleClass: 'is-navPanel-visible'
		});

	// Get inner.
	$navPanelInner = $navPanel.children('nav');

	// Move nav content on breakpoint change.
	var $navContent = $nav.children();

	breakpoints.on('>medium', function () {

		// NavPanel -> Nav.
		$navContent.appendTo($nav);

		// Flip icon classes.
		$nav.find('.icons, .icon')
			.removeClass('alt');

	});

	breakpoints.on('<=medium', function () {

		// Nav -> NavPanel.
		$navContent.appendTo($navPanelInner);

		// Flip icon classes.
		$navPanelInner.find('.icons, .icon')
			.addClass('alt');

	});

	// Hack: Disable transitions on WP.
	if (browser.os == 'wp'
		&& browser.osVersion < 10)
		$navPanel
			.css('transition', 'none');

	// Intro.
	var $intro = $('#intro');

	if ($intro.length > 0) {

		// Hack: Fix flex min-height on IE.
		if (browser.name == 'ie') {
			$window.on('resize.ie-intro-fix', function () {

				var h = $intro.height();

				if (h > $window.height())
					$intro.css('height', 'auto');
				else
					$intro.css('height', h);

			}).trigger('resize.ie-intro-fix');
		}

		// Hide intro on scroll (> small).
		breakpoints.on('>small', function () {

			$main.unscrollex();

			$main.scrollex({
				mode: 'bottom',
				top: '25vh',
				bottom: '-50vh',
				enter: function () {
					$intro.addClass('hidden');
				},
				leave: function () {
					$intro.removeClass('hidden');
				}
			});

		});

		// Hide intro on scroll (<= small).
		breakpoints.on('<=small', function () {

			$main.unscrollex();

			$main.scrollex({
				mode: 'middle',
				top: '15vh',
				bottom: '-15vh',
				enter: function () {
					$intro.addClass('hidden');
				},
				leave: function () {
					$intro.removeClass('hidden');
				}
			});

		});

	}

})(jQuery);