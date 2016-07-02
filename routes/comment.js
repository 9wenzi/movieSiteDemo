var Comment=require("../modules/comment");

exports.save=function(req,res,next){
	var _comment={
		movie:req.body.commentMovie,
		from:req.body.commentFrom,
		content:req.body.commentContent,
	}
	var movieId=_comment.movie

	if(req.body.commentCid){
		Comment.findById(req.body.commentCid,function(err,comment){
			if (err) {
				console.log(err)
			}

			reply={
				from:req.body.commentFrom,
				to:req.body.commentTid,
				content:req.body.commentContent
			}

			comment.reply.push(reply);
			comment.save(function(err,comment){
				if (err) {
					console.log(err)
				}
				res.redirect("/movie/"+movieId)
			})
		})
	}else{
		var comment=new Comment(_comment)
		comment.save(function(err,comment){
			if (err) {
				console.log(err)
			}
			res.redirect("/movie/"+movieId)
		})
	}	
}