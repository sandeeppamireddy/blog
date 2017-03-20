angular.module('postCtrl',['postService','textAngular','userService','ngSanitize', 'ui.bootstrap'])
	.controller('createPostController',function($rootScope,$scope,Posts,Upload){
		$scope.type="create";
		$scope.upload = function (file_name) {
			if(file_name){
	             Upload.upload({
                    url: 'api/upload', //webAPI exposed to upload the file
                    data:{file:file_name} //pass file as data, should be user ng-model
                }).then(function (resp) { //upload function returns a promise
	                if(resp.data.error_code === 0){ //validate success
						$scope.post.uploadedAt='uploads/'+resp.data.modifiedName;//storing timestamped file name
	                    console.log('Success' + resp.config.data.file.name + ' uploaded. Response: ');
	                    $scope.savePost();
	                } else {
	                    console.log('an error occured');
	                }
	            });
            }
            else{
            	$scope.post.uploadedAt='assets/img/default.png';
            	$scope.savePost();
            }
	    };

		$scope.savePost=function(){
			$scope.post.postedBy=$rootScope.userDetails.username;
			if(($scope.post.body).trim()!=""){
				Posts.create($scope.post)
			      .success(function (data){
			      	$scope.post={};
			      	$scope.message=data.message;
			      		  $scope.alerts = [
						    { type: 'success', msg: $scope.message }
						 ];
			      });
			}
			else{
				$scope.message="Body should not be empty";
				$scope.alerts = [
					{ type: 'danger', msg: $scope.message }
				];
			}

		};
		$scope.closeAlert = function(index) {
	    	$scope.alerts.splice(index, 1);
	  	};
	})

	.controller('getAllPostsController',function($rootScope,$scope,Posts,Users){	
		$scope.myInterval = 5000;
		$scope.noWrapSlides = false;
		$scope.active = 0;
		var slides = $scope.slides = [];
		var currIndex = 0;
		$scope.posts=[];
		$scope.options=[];
		$scope.options.push({label:"All",value:"all"});
		$rootScope.profilePic=$rootScope.userDetails.profilePic;
		Posts.getPopularPosts()
			.success(function(popularPosts){
				for (var i = 0; i < popularPosts.length; i++) {
		   			slides.push({
		   				post_id:popularPosts[i]._id,
						image: 'assets/img/big_thumb_76e6072165fa149641131ad024f87c03.jpg',
						text:popularPosts[i].title,
						id: currIndex++
					});

		  		}
			});

		Users.getAllUsers()
			.success(function(users){
				$scope.usersList=users;
				for(var i=0;i<$scope.usersList.length;i++){
					$scope.options.push({label:$scope.usersList[i].username,value:$scope.usersList[i].username});
				}
			});
		Posts.getApprovedPosts()
			.success(function(blogposts){
				$scope.posts = blogposts;
				$scope.totalItems = $scope.posts.length;
				$scope.currentPage = 1;
				$scope.pageChanged();								
			});

		$scope.valueChanged=function(selected){
			if(selected.value=="all"){
				console.log("displaying all posts")
				Posts.getApprovedPosts()
					.success(function(blogposts){
						$scope.posts = blogposts;
						$scope.totalItems = $scope.posts.length;
						$scope.currentPage = 1;
						$scope.pageChanged();
					});
			}
			else{
				console.log("displaying posts created by selected user")
				Posts.getUserPosts(selected.value)
					.success(function(data){
						$scope.posts=data;
						$scope.totalItems = $scope.posts.length;
						$scope.currentPage = 1;
						$scope.pageChanged();
					});
			}
		}
		///pagination
			  $scope.maxSize = 5;
			  $scope.currentPage = 1;
			  $scope.numPostsPerPage=3;
			  $scope.pageChanged = function() {
			   	    var begin = (($scope.currentPage - 1) * $scope.numPostsPerPage)
				    , end = begin + $scope.numPostsPerPage;
				    $scope.filteredPosts = $scope.posts.slice(begin, end);
			  };
		//

  	})

	.controller('getIndvdlPostsController',function($rootScope,$scope,$routeParams,Posts){		
		$scope.comment={};
		$scope.pageSize = 5;
		Posts.getPost($routeParams.post_id)
				.success(function(data){
					$scope.post=data;
					Posts.IncrementViews($routeParams.post_id)
						.success(function(data){
							console.log('views incremented')
						});
				});
		$scope.postComment=function(){
			$scope.comment.commentedBy=$rootScope.userDetails.username;
			$scope.comment.commentedUserPic=$rootScope.userDetails.profilePic;
			Posts.saveComment($routeParams.post_id,$scope.comment)
				.success(function(data){
					$scope.post.comments=data.comments;	
					$scope.comment={};
				});			
		}
	})

	.controller('managePostController',function($rootScope,$scope,Posts,$filter,$uibModal){
	   $scope.posts={};
	   $scope.isAdmin=false;
	   //grid configuration
	   $scope.gridOptions = { 
	   	paginationPageSizes: [10,20,30], 
	   	paginationPageSize: 10,
	   	rowHeight: 45, 
	    enableColumnResizing: true, 
	    enableFiltering: true, 
	    enableGridMenu: true, 
	    enableRowSelection: true, 
	    enableRowHeaderSelection: false ,
	   	columnDefs : [
	   		 { name:'_id',visible:false},
	         { name: 'title', cellClass:'customFont',cellTemplate:'<div style="margin-left:5px;margin-top:5px;"><a href="/posts/{{row.entity._id}}">{{row.entity.title}}</a></div>',width: "40%"},
	         { name: 'postedBy', cellClass:'customFont'},
	         { name: 'status', cellClass:'customFont'},
	         { name: 'postedOn',enableFiltering:false, cellClass:'customFont',
	         	cellTemplate:'<div style="margin-left:5px;"margin-top:5px;">{{row.entity.postedOn | date:yyyy/mm/dd}}</div>'},
	         { name: 'Actions',enableFiltering:false,width: "18%",
	         	cellTemplate:'<div align="center" style="margin-top:5px;">'+
	         	'<a class="btn btn-primary customBtnSize" href="/editPost/{{row.entity._id}}" ng-hide="grid.appScope.isAdmin && row.entity.postedBy!=\'admin\'" style="margin-right:10px;"><i class="fa fa-edit" style="margin-right:4px;"></i>Edit</a>'+
	         	'<a class="btn btn-success customBtnSize" href="" ng-click="grid.appScope.approvePost(row.entity._id,row)"   ng-disabled="row.entity.status==\'Approved\'" ng-hide="!grid.appScope.isAdmin || row.entity.postedBy==\'admin\'" style="margin-right:10px;"><i class="fa fa-check-circle" style="margin-right:4px;"></i>Approve</a>'+
	         	'<a class="btn btn-danger customBtnSize" href="" ng-click="grid.appScope.open(row.entity._id,row)"><i class="fa fa-trash-o" style="margin-right:4px;"></i>Delete</a>'+
	         	'</div>'
	         }
	       ]};
/**/
	    /*getting posts based on the user  ng-click="grid.appScope.deletePost(row.entity._id,row)"*/
	    //if admin
		if($rootScope.userDetails.username=='admin'){
			$scope.isAdmin=true;
			Posts.getAll()
				.success(function(blogposts){
					$scope.posts = blogposts;								 
					$scope.gridOptions.data=$scope.posts;
				});
		}

		//if normal user
		else{
			Posts.getUserPosts($rootScope.userDetails.username)
				.success(function(data){
					$scope.posts=data;
					$scope.gridOptions.data=$scope.posts;
					});
		}
		/* */
		//Deleting post
		$scope.deletePost=function(id,row){
			Posts.delete(id)
				.success(function(data){
					console.log('deleted')
					 var index = $scope.gridOptions.data.indexOf(row.entity);
	  		  		 $scope.gridOptions.data.splice(index, 1);

				});
		};
		//Approving post
		$scope.approvePost=function(id,row){
			Posts.approve(id)
				.success(function(data){
					var index = $scope.gridOptions.data.indexOf(row.entity);
					$scope.gridOptions.data[index].status="Approved";
				});
		};

		//modal
		  $scope.open = function (id,row) {
			    var modalInstance = $uibModal.open({
			      animation: $scope.animationsEnabled,
			      templateUrl: 'myModalContent.html',
			      controller: 'ModalInstanceCtrl',
			      resolve: {
			        items: function () {
			          return $scope.items;
			        }
			      }
			    });

			    modalInstance.result.then(function () {
					$scope.deletePost(id,row);
			    });    
		  };

	})

	.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

	  $scope.ok = function () {
	    $uibModalInstance.close('OK');
	  };

	  $scope.cancel = function () {
	    $uibModalInstance.dismiss('cancel');
	  };
	})

	.controller('editPostController',function($scope,$routeParams,Posts,Upload){
		$scope.type="edit";
		Posts.getPost($routeParams.id)
			.success(function(data){
				$scope.post=data;
		});
		$scope.upload = function (file_name) {
			if(file_name){
	             Upload.upload({
                    url: 'api/upload', //webAPI exposed to upload the file
                    data:{file:file_name} //pass file as data, should be user ng-model
                }).then(function (resp) { //upload function returns a promise
	                if(resp.data.error_code === 0){ //validate success
						$scope.post.uploadedAt='uploads/'+resp.data.modifiedName;//storing timestamped file name
	                    //console.log('Success' + resp.config.data.file.name + ' uploaded. Response: ');
	                    $scope.savePost();
	                } else {
	                    console.log('an error occured');
	                }
	            });
            }
            else{
            	$scope.savePost();
            }
	    };

		$scope.savePost=function(){
			if($scope.post.body!=""){
				Posts.update($routeParams.id,$scope.post)
				.success(function(data){
					$scope.message=data.message;
					$scope.alerts = [
						{ type: 'success', msg: $scope.message }
					];
				});
			}
			else{
				$scope.message="Body should not be empty";
				$scope.alerts = [
					{ type: 'danger', msg: $scope.message }
				];
			}	
		};
		$scope.closeAlert = function(index) {
	    	$scope.alerts.splice(index, 1);
	  	};
	});