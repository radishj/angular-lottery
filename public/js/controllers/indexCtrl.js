define(['./module'], function (controllers) {
	'use strict';
	controllers.controller('IndexCtrl', ['$scope' , 'NotifyService',
		function ($scope, notify) {
			notify.success('Loading completed.', 'node-angular-lottery');
		}
	]);
});