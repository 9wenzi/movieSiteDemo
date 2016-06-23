var express = require('express');
var router = express.Router();

var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/mymovie")
var Movie=require("../modules/movie");
var _=require("underscore");

/* GET home page. */
router.get('/', function(req, res, next) {
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}
	  	res.render('index', { 
		  	title: 'Movie 首页',
		  	movies:movies
	  	});
	})
});

router.get("/movie/:id",function(req,res,next){
	var id=req.params.id
	
	Movie.findById(id,function(err,movie){
		if (err) {
			console.log(err)
		}
		console.log(movie)
		res.render('detail', { 
			title: movie.title+' 详情页',
			movie:movie
		});
	})
})
router.get("/admin/movie",function(req,res,next){
	res.render('admin', { title: 'Movie后台录入',
		movie:{
			title:"",
			director:'',
			country:'',
			language:'',
			year:'',
			summary:'',
			poster:'',
			flash:''
		} 
	});
})
//admin update movie
router.get("/admin/update/:id",function(req,res,next){
	var id=req.params.id
	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			res.render("admin",{
				title:"movie 后台更新",
				movie:movie
			})
		})
	}
})
//admin post new movie
router.post("/admin/movie/new",function(req,res,next){
	var id=req.body.movieId;
	
	var movieObj={
		title:req.body.movieTitle,
		director:req.body.movieDirector,
		country:req.body.movieCountry,
		language:req.body.movieLanguage,
		year:req.body.movieYear,
		summary:req.body.movieSummary,
		flash:req.body.movieFlash,
		poster:req.body.moviePoster
	}

	var _movie={};
	//修改操作
	if(id!=="undefined"){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}

			movie=_.extend(movie,movieObj)
			//save 操纵是要由模型中构造的entity进行
			movie.save(function(err,movie){
				if (err) {
					console.log(err)
				}
				res.redirect("/movie/"+movie._id)
			})
		})
	}
	///保存新的数据
	else{
		_movie=new Movie(movieObj)
		_movie.save(function(err,movie){
			if (err) {
				console.log(err)
			}
			//console.log("this is: "+movie)
			res.redirect("/movie/"+movie._id)
		})
	}
	
	
})

router.get("/admin/list",function(req,res,next){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}

		res.render('list', { 
			title: 'Movie列表页',
			movies:movies
		});
	})
})

//admin delete movie
router.delete("/admin/list",function(req,res,next){
	var id=req.query.id;
	
	if(id){
		Movie.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}
			else{
				res.json({success:1})
			}
		})
	}
})
module.exports = router;
