angular.module('postService',[])
	.factory('Posts',function($http){
		var postFactory={};
		postFactory.upload=function(){                
            return $http.post('/api/upload');
        };
		postFactory.create=function(post){
			return $http.post('/api/createBlogpost',post);
		};
		postFactory.getPopularPosts=function(){
			return $http.get('/api/getPopularPosts');
		}
		postFactory.getApprovedPosts=function(){
			return $http.get('/api/getApprovedBlogposts');
		};
		postFactory.getAll=function(){
			return $http.get('/api/getAllBlogposts');
		};
		postFactory.getPost=function(post_id){
			return $http.get('/api/getIndvdlBlogpost/'+post_id);
		};
		postFactory.getUserPosts=function(username){
			return $http.get('/api/getUserBlogposts/'+username);
		};
		postFactory.update=function(post_id,post){
			return $http.put('/api/getIndvdlBlogpost/'+post_id,post);
		};
		postFactory.approve=function(post_id){
			return $http.put('/api/approveBlogpost/'+post_id);
		};
		postFactory.delete=function(post_id){
			return $http.delete('/api/getIndvdlBlogpost/'+post_id);
		};
		postFactory.IncrementViews=function(post_id){
			return $http.put('/api/IncrmntBlogpostViews/'+post_id);
		};
		postFactory.saveComment=function(post_id,comment){
			return $http.post('/api/saveComment/'+post_id,comment);
		};

		return postFactory;
	});
