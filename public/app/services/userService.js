angular.module('userService',[])
	.factory('Users',function($http){
		var userFactory={};
		userFactory.upload=function(){                
            return $http.post('/api/upload');
        };
		userFactory.register=function(user){
			return $http.post('/api/register',user)
		};
		userFactory.getAllUsers=function(){
			return $http.get('/api/users');
		};
		userFactory.getUser=function(user_id){
			return $http.get('/api/users/'+user_id);
		};
		userFactory.update=function(user_id,userDetails){
			return $http.put('/api/users/'+user_id,userDetails);
		};
		return userFactory;
	});
