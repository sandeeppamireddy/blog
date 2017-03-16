angular.module('app.routes',['ngRoute'])
		.config(function($routeProvider,$locationProvider){
			$routeProvider
				.when('/', {
					templateUrl : 'app/views/pages/posts.html',
					controller   : 'getAllPostsController'
				})

				.when('/login', {
					templateUrl : 'app/views/pages/login.html',
					controller : 'mainController',
					controllerAs: 'login'
				})
				.when('/register', {
					templateUrl : 'app/views/pages/register.html',
					controller :  'createUserController',
					controllerAs: 'register'
				})

				.when('/posts/:post_id', {
					templateUrl : 'app/views/pages/singlepost.html',
					controller  : 'getIndvdlPostsController'
				})
				.when('/manageposts', {
					templateUrl : 'app/views/pages/managepost.html',
					controller  : 'managePostController'
				})
				.when('/newpost', {
					templateUrl : 'app/views/pages/newpost.html',
					controller  : 'createPostController'
				})
				.when('/editPost/:id', {
					templateUrl : 'app/views/pages/newpost.html',
					controller  : 'editPostController'
				})
				.when('/edituser', {
					templateUrl : 'app/views/pages/edituser.html',
					controller  : 'editUserController'
				});

			$locationProvider.html5Mode(true);	
		});