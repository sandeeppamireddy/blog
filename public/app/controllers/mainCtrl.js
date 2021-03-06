angular.module('mainCtrl',[])
		.controller('mainController',function($rootScope,$location,Auth){
			$rootScope.pageLoading  = false;
			var vm = this;
			vm.loggedIn = Auth.isLoggedIn();
			$rootScope.$on('$routeChangeStart',function(){
				vm.loggedIn= Auth.isLoggedIn();
				Auth.getUser()
					.then(function(data){
						$rootScope.userDetails=data.data;
				});
			});
			vm.doLogin = function(){
				vm.processing =true;
				vm.error='';
				Auth.login(vm.loginData.username,vm.loginData.password)
					.success(function(data){
						vm.processing=false;
						if(data.success){
							$location.path('/posts');
						}
						
						else
							vm.error=data.message;	
					});
			};
			vm.doLogout =function(){
				Auth.logout();
				vm.user={};
				$location.path('/login');
			};

		});