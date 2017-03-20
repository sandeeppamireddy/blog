angular.module('blogApp',['ngAnimate','app.routes','authService','mainCtrl','postCtrl','postService','userCtrl','userService','textAngular','ui.grid','ui.grid.pagination','ui.grid.resizeColumns','ngSanitize','ui.bootstrap','ngFileUpload'])
		.config(function($httpProvider){
			$httpProvider.interceptors.push('AuthInterceptor');	
		})
		.directive('file', function() {
		  return {
		    scope: {
		      file: '='
		    },
		    link: function(scope, el, attrs) {
		      el.bind('change', function(event) {
		        var files = event.target.files;
		        var file = files[0];
		        scope.file = 'New file name';
		        scope.$apply();
		      });
		    }
		  };
		})

		.filter('removeHTMLTags', function() {
			return function(text) {
				return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
			};
		});
		
//'ngAnimate','app.routes','authService','mainCtrl','userCtrl','userService'		