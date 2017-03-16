var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var postSchema = new Schema(
  {
	title:String,
	body:String,
	postedBy:String,
	postedOn:{ type: Date, default: Date.now },
	status:{type:String,default:"pending"},
	views : {type:Number,default:0},
	approvedBy:String,
	uploadedAt:String,
	comments: [
	  { 
	  	commentedBy:String,
	  	body: String, 
	  	date: {type :Date,default:Date.now },
	  }
	   ]
});

module.exports = mongoose.model('Post',postSchema);