'use strict';
require.config({
	paths: {
		'angular': "../libs/angular/angular",
		'uiRouter': "../libs/angular-ui-router/release/angular-ui-router",
		'angularAnimate': "../libs/angular-animate/angular-animate",
		'angularToastr': "../libs/angular-toastr/dist/angular-toastr.tpls",
		'domReady': "../libs/requirejs-domready/domReady",
		'flow': "../libs/ng-flow/dist/ng-flow-standalone"
	},
	shim: {
		'angular': {
			'exports': 'angular'
		},
		'uiRouter': {
			deps: ['angular']
		},
		'flow': {
			deps: ['angular']
		},
		'angularAnimate': {
			deps: ['angular']
		},
		'angularToastr': {
			deps: ['angular']
		}
	},
	deps: ['./bootstrap']
});