angular.module('blogApp',['ngAnimate','app.routes','authService','mainCtrl','postCtrl','postService','userCtrl','userService','textAngular','ui.grid','ui.grid.pagination','ui.grid.resizeColumns','ngSanitize','ui.bootstrap','ngFileUpload'])
		.config(function($httpProvider){
			$httpProvider.interceptors.push('AuthInterceptor');	
		})
		
//'ngAnimate','app.routes','authService','mainCtrl','userCtrl','userService'		