angular.module('userCtrl',['userService'])
		.controller('createUserController',function($rootScope,$scope,$location,Users){
			var vm=this;
			vm.doSignUp=function(){
				Users.register(vm.user)
					.success(function(data){
						if(data.success){
							$location.path('/login');
						}
						else{
							vm.error=data.message;
						}
				});
			}

		})

		.controller('editUserController',function($rootScope,$scope,Users){
			$scope.user={};

			Users.getUser($rootScope.userDetails._id)
				.success(function(userData){
					$scope.user.name=userData.name;
					$scope.user.username=userData.username;
					$scope.password="";
				});

			$scope.saveUser =function(){
				Users.update($rootScope.userDetails._id,$scope.user)
						.success(function(data){
							console.log(data)
							$scope.message = data.message;
						});
			};

		});
