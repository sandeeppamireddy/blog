var bodyParser = require('body-parser');
var User = require('../models/user');
var Post = require('../models/post');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var superSecret = config.secret;
var Sequelize = require('sequelize');
var multer = require('multer');


module.exports = function(app,express){
	var apiRouter = express.Router();
	
	//route for authenticating users
	apiRouter.post('/register',function(req,res){
				var user =new User();
				user.name=req.body.name;
				user.username=req.body.username;
				user.password=req.body.password;
				user.save(function(err){
					if(err){
						if (err.code == 11000)
							return res.json({ success: false, message: 'A user with that username already exists. '});
						else				
							return res.send(err);
					}		
						res.json({success: true, message:'User Created'});
				});	
	});
	apiRouter.post('/authenticate',function(req,res){

		User.findOne({
			username:req.body.username
		}).select('_id name username password').exec(function(err,user){
			if(err) throw err;

			if(!user){
				res.json({
					success:false,
					message:'Authentication Falied. User not found'
				});
			}else if(user){
				var validPassword = user.comparePassword(req.body.password);
				if(!validPassword){
					res.json({
						success: false,
						message: 'Authentication Failed. Wrong Password'
					});
				}else{
					var token = jwt.sign({
						_id:user._id,
						name:user.name,
						username:user.username
						},superSecret,{
							expiresInMinutes:1440
						});

					res.json({
						success: true,
						message: 'Good Luck with your token !',
						token:token
					});
				}
			}
		});
	});

	//middleware
	apiRouter.use(function(req,res,next){
		console.log("Handling all requests");
		var token =req.body.token || req.param('token') || req.headers['x-access-token'];
		if(token){
			jwt.verify(token,superSecret,function(err,decoded){
				if(err){
					return res.status(403).send({
						success:false,
						message:'Failed to Authenticate token'
					});
				}

				else{
					req.decoded=decoded;
					next();
				}
			});
		}
		else{
			return res.status(403).send({
				success:false,
				message:'No token provided'
			});
		}	
	});

	apiRouter.get('/', function(req, res) {
			res.json({ message: 'hooray! welcome to our api!' });
	});


/*	apiRouter.route('/users')
		.post(function(req,res){
				var user =new User();
				user.name=req.body.name;
				user.username=req.body.username;
				user.password=req.body.password;
				user.save(function(err){
					if(err){
						if (err.code == 11000)
							return res.json({ success: false, message: 'A user with that username already exists. '});
						else				
							return res.send(err);
					}		
						res.json({message:'User Created'});
				});	
		})


		.get(function(req,res){
				console.log("calling today2");
				User.find({},function(err, users) {
					console.log("calling node today");
					if (err) res.send(err);
					res.json(users);
			});	
		});*/


/*	apiRouter.route('/users/:user_id')
		.get(function(req,res){
			User.findById(req.params.user_id,function(err,user){
				if(err) res.send(err);
				res.json(user);
			});
		})

		.put(function(req,res){
			User.findById(req.params.user_id,function(err,user){
				if(err) res.send(err);

				if(req.body.name) user.name =req.body.name;
				if(req.body.username) user.username=req.body.username;
				if(req.body.password) user.password=req.body.password;

				user.save(function(err){
					if(err) res.send(err);
					res.json({message:'User Updated'});
				});
			});
		})	

		.delete(function(req, res) {
				User.remove({_id: req.params.user_id}, function(err, user) {
					if (err) return res.send(err);
					res.json({ message: 'Successfully deleted' });
				});
		});	
*/
	//route for getting all username
	apiRouter.route('/users')
		.get(function(req,res){
				console.log("calling today2");
				User.find({}).select('username').sort('username').exec(function(err,users) {
					if (err) res.send(err);
					res.json(users);
			});	
		});

	//route for getting and updating single user
	apiRouter.route('/users/:user_id')
		.get(function(req,res){
			User.findById(req.params.user_id,function(err,user){
				if(err) res.send(err);
				res.json(user);
			});
		})
		.put(function(req,res){
			User.findById(req.params.user_id,function(err,user){
				if(err) res.send(err);
				console.log(req.body)
				console.log(user)
				if(req.body.name) user.name =req.body.name;
				if(req.body.password) user.password=req.body.password;

				user.save(function(err,user){
					if(err) res.send(err);
					res.json({message:'User Updated',updatedname:user.name});
				});
			});
		});	

    // route for creating posts
 	apiRouter.route('/createBlogpost')
 		.post(function(req,res){	
 			console.log(req.body)
 			var post = new Post();
 			post.title=req.body.title;
 			post.body=req.body.body;
 			post.postedBy=req.body.postedBy;
 			post.uploadedAt=req.body.uploadedAt;
 			//post.fileName=req.body.fileName;
 			post.views=0;
 			if(req.body.postedBy=='admin'){
 				post.status="Approved";
 			}
 			post.save(function (err) {
			  if (err) {
					return err;
			  }
			  else {
			  	console.log("Post saved");
			  }
			  res.json({message:'Post Created'});

			});		
 		});
 	//route for fetching popular posts
 	apiRouter.route("/getPopularPosts")
 		.get(function(req,res){
 		 	Post.find({}).sort('-views').limit(5).exec(function(err, popularPosts) {
				if (err) res.send(err);
				res.json(popularPosts);

			});
 		});
    // route for fetching approved posts
	apiRouter.route('/getApprovedBlogposts')
 		.get(function(req,res){	
 			console.log('Getting approved blogposts ');
		Post.find({status:"Approved"}).sort('-postedOn').exec(function(err, sortedPosts) {
			if (err) res.send(err);
				res.json(sortedPosts);

			});
	});

    // route for fetching posts
	apiRouter.route('/getAllBlogposts')
 		.get(function(req,res){	
 			console.log('Getting all blogposts ');
		Post.find({}).sort('-postedOn').exec(function(err, sortedPosts) {
			if (err) res.send(err);
				res.json(sortedPosts);

			});
	});
 	//route for fetching individual post
	apiRouter.route('/getIndvdlBlogpost/:post_id')
 		.get(function(req,res){
 			console.log("getting individual post")
 			Post.findById(req.params.post_id,function(err,post){
				if(err) res.send(err);
				res.json(post);
			});
 		})

 		.put(function(req,res){
 			Post.findById(req.params.post_id,function(err,post){
				if(err) res.send(err);
				if(req.body.title) post.title =req.body.title;
				if(req.body.body) post.body=req.body.body;
				if(req.body.uploadedAt) post.uploadedAt=req.body.uploadedAt;
				if(post.postedBy!='admin'){
					post.status="pending";
				}
				post.save(function(err){
					if(err) res.send(err);
					res.json({message:'post Updated'});
				});
			});
		})

		.delete(function(req, res) {
				Post.remove({_id: req.params.post_id}, function(err, post) {
					console.log('inside delete')
					if (err) return res.send(err);
					res.json({ message: 'Post deleted' });
				});
		});	

 	//route for fetching single user posts			
	apiRouter.route('/getUserBlogposts/:username')
		.get(function(req,res){
			Post.find({postedBy:req.params.username}).sort('-postedOn').exec(function(err, posts) {
				console.log("getting individual user posts");
					if (err) res.send(err);
					res.json(posts);
 			});
		});

	//route for approving post
	apiRouter.route('/approveBlogpost/:post_id')
		.put(function(req,res){
			Post.findById(req.params.post_id,function(err,post){
				if(err) res.send(err);
				post.status="Approved";
				post.save(function(err){
					if(err) res.send(err);
					res.json({message:'post approved'});
				});

			});
		});

	//route for incrementing views
	apiRouter.route('/IncrmntBlogpostViews/:post_id')
		.put(function(req,res){
			Post.findById(req.params.post_id,function(err,post){
				if(err) res.send(err);
				post.views=post.views+1;
				post.save(function(err){
					if(err) res.send(err);
					res.json({message:'views increased'});
				});
			});
		});


	//route for saving comments
	apiRouter.route('/saveComment/:post_id')
		.post(function(req,res){
			
			Post.findById(req.params.post_id,function(err,post){
				if(err) res.send(err);
				post.comments.push(req.body);
				post.save(function (err,post) {
				  if (err) {
						return err;
				  }
				  else {
				  	console.log("Comment saved");
				  }
				  res.json(post);
				});		

			});
		});

	var storage = multer.diskStorage({ //multers disk storage settings
	    destination: function (req, file, cb) {
	        cb(null, './public/uploads/')
	    },
	    filename: function (req, file, cb) {
	    	console.log(file)
	        var datetimestamp = Date.now();
	        //cb(null, file.originalname)
	        cb(null,file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
	    }
	});


	var upload = multer({ //multer settings
	    storage: storage
	}).single('file');

	/** API path that will upload the files */
	apiRouter.post('/upload', function(req, res) {
		console.log("upload api called")
	    upload(req,res,function(err){
	        if(err){
	             res.json({error_code:1,err_desc:err});
	             return;
	        }
	        console.log(req.file.path)
	         res.json({error_code:0,err_desc:null,modifiedName:req.file.filename});
	    })
	});

	apiRouter.get('/self',function(req,res){
		res.send(req.decoded);
	});

	return apiRouter;
};