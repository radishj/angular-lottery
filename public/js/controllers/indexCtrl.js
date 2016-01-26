define(['./module'], function (controllers) {
	'use strict';
	controllers.config(function (localStorageServiceProvider) {
		localStorageServiceProvider
			.setPrefix('node-angular-lottery')
			.setStorageType('sessionStorage')
			.setNotify(true, true)
	});
	controllers.controller('IndexCtrl', ['$scope', '$uibModal', 'NotifyService', 'SocketService', 'localStorageService',
		function ($scope, $uibModal, notify, socket, localStorageService) {
            // 初始化
			$scope.userInfo = {};
            $scope.workNo = "";
            $scope.open = function (size) {

                var modalInstance = $uibModal.open({
                    templateUrl: 'myModalContent.html',
                    backdrop: 'static',
                    controller: 'ModalInstanceCtrl',
                    size: size,
                    resolve: {
                        workNo: function () {
                            return $scope.workNo;
                        }
                    }
                });

                modalInstance.result.then(function (workNo) {
                    $scope.workNo = workNo;
                    socket.emit('user.info', workNo);
                }, function () {
                    notify.info('Modal dismissed at: ' + new Date());
                });
            };

			$scope.hasSendList = [];
			$scope.userCache = [];

			// 读取用户信息
			if(!localStorageService.isSupported) {
				notify.info("不支持sessionStorage，无法保存用户信息");
			} else {
				var userInfo = localStorageService.get('UserInfo');
				if(userInfo) {
					$scope.userInfo = userInfo;
				} else {
					$scope.open('sm');
				}
			}

			// 用户信息
			//socket.emit('user.info', '');
			socket.on('user.info.repley', function (result) {
				if(result.status == 'success') {
					$scope.userInfo = result.data;
					// 将用户信息保存到本地
					if(localStorageService.isSupported) {
						localStorageService.set('UserInfo', $scope.userInfo);
					}
				} else {
					$scope.open('sm');
					notify.warn(result.data);
				}
			});

			// 抽奖
			$scope.lottery = function (id) {
				socket.emit('user.lottery', id);
			}

			// 最新抽奖信息
			socket.on('user.lottery.new', function (user) {
				notify.success("抽奖信息" + user.name + " -> " + user.sendPeo.name);
			});
			// 所有用户
			socket.emit('user.getAll');
			socket.on('user.getAll.repley', function (data) {
				console.log(data);
			});
            // 已送礼物列表
			socket.emit('user.hasSendList');
            socket.on('user.hasSendList.repley', function (data) {
                console.log(data);
            });

			// 送礼物消息
			socket.on('user.lottery.repley', function (data) {
				//notify.success("1111抽奖信息" + reult.user.name + " -> " + reult.user.sendPeo.name);
				notify.warn(data.msg);

				$scope.userInfo = data.user;
				// 将用户信息保存到本地
				if(localStorageService.isSupported) {
					localStorageService.set('UserInfo', $scope.userInfo);
				}
			});


			// Success
			socket.on('system.success', function (data) {
				notify.success(data.msg);
			});
			// Info
			socket.on('system.info', function (data) {
				notify.info(data.msg);
			});
			// 错误信息
			socket.on('system.error', function (data) {
				notify.error(data.msg);
			});
			notify.success('Loading completed.', 'node-angular-lottery');

			// 事件绑定
			$(".red-packet").click(function(){
				$(this).addClass("shake");
				setTimeout(function(){
					$(".red-packet").removeClass("shake");
					$(".windows").fadeIn();
					$(".mask").fadeIn();
					$scope.lottery($scope.userInfo._id);
				},2000);
			});
			$(".close").click(function(){$(this).parent().fadeOut();$(".mask").fadeOut()});
		}
	]);
	// model controller
	controllers.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, workNo) {
        $scope.workNo = workNo;
		$scope.ok = function () {
			$uibModalInstance.close($scope.workNo);
		};

		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
	});
});