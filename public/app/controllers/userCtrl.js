angular.module('userCtrl',['userService','ngSanitize', 'ui.bootstrap'])
		.controller('createUserController',function($rootScope,$scope,$location,Users,Upload){
			var vm=this;
			vm.user={};
			$rootScope.pageLoading = false;
			vm.user.profilePic="assets/img/default_profile_pic.png";
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
			};

		})

		.controller('editUserController',function($rootScope,$scope,Users,Upload){
			$scope.user={};
			$scope.profilePic="";
			$rootScope.$on('$routeChangeStart',function(){									
				$rootScope.pageLoading = true;
		    });
			Users.getUser($rootScope.userDetails._id)
				.success(function(userData){
					$rootScope.pageLoading = false;
					$scope.user.firstname=userData.firstname;
					$scope.user.lastname=userData.lastname;
					$scope.user.email=userData.email;
					$scope.user.username=userData.username;
					$scope.password="";
					$scope.user.profilePic=userData.profilePic;
				});

			$scope.saveUser =function(){
				Users.update($rootScope.userDetails._id,$scope.user)
						.success(function(data){
							$scope.message = data.message;
							$scope.alerts = [
								{ type: 'success', msg: $scope.message }
							];
						});
			};
			$scope.upload = function (file_name) {
				if(file_name){
					 Upload.upload({
                    url: 'api/upload', //webAPI exposed to upload the file
                    data:{file:file_name} //pass file as data, should be user ng-model
                	}).then(function (resp) { //upload function returns a promise
	                if(resp.data.error_code === 0){ //validate success
						$scope.user.profilePic="uploads/"+resp.data.modifiedName;//storing timestamped file name
	                    //console.log('Success' + resp.config.data.file.name + ' uploaded. Response: ');
	                } else {
	                    console.log('an error occured');
	                }
	            });
            }
	    };
		   	$scope.closeAlert = function(index) {
		    	$scope.alerts.splice(index, 1);
		  	};

		});
