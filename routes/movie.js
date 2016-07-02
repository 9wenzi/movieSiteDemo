var Movie=require("../modules/movie");
var _=require("underscore");
var Comment=require('../modules/comment')
var Category=require('../modules/category')

var fs=require('fs');
var path=require('path');

//movie home
exports.home=function(req, res, next) {
	Category
		.find({})
		.populate({
			path: 'movies',
			select: 'title poster',
			options: { limit: 6 },
			model:'Movie'
		})
		.exec(function(err,categories){
				if(err){
					console.log(err)
				}

			  	res.render('index', { 
				  	title: 'Movie 首页',
				  	categories:categories
			  	});
		})
};

//movie detail
exports.detail=function(req,res,next){
	var id=req.params.id
	Movie.update({_id:id},{$inc:{pv:1}},function(err){
		if (err) {
			console.log(err)
		}
	});
	Movie.findById(id,function(err,movie){
		if (err) {
			console.log(err)
		}
		Comment
			.find({movie:id})
			.populate('from',"name")
			.populate('reply.from reply.to',"name")
			.exec(function(err,comments){
			if(err){
				console.log(err)
			}
			res.render('detail', { 
				title: movie.title+' 详情页',
				movie:movie,
				comments:comments
			});
		})
	})
}

//admin   
//admin update movie
exports.new=function(req,res,next){
	Category.find({},function(err,categories){
		res.render('admin', {
			title: 'Movie后台录入',
			categories:categories,
			movie:{} 
		});	
	})
}
//admin update movie
exports.update=function(req,res,next){
	var id=req.params.id
	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			Category.find({},function(err,categories){
				res.render("admin",{
					title:"movie 后台更新",
					movie:movie,
					categories:categories
				})
			})	
		})
	}
}
// admin   savePoster
exports.savePoster=function(req,res,next){
	var posterData = req.files.uploadPoster;
	// console.log('this from movie savePoster:')
	// console.log(posterData );
	var filePath =posterData.path;
	var originalFilename = posterData.originalFilename;

	if(originalFilename){
		fs.readFile(filePath,function(err,data){
			var timeStamp=Date.now();
			var type = posterData.type.split("/")[1];
			var poster=timeStamp+'.'+type
			var newPath=path.join(__dirname,"../","public/upload/"+poster)
			//console.log(newPath)
			fs.writeFile(newPath,data,function(err){
				req.poster=poster;
				next()
			})
		})
	}else{
		next()
	}
}
//admin post new movie
exports.save=function(req,res,next){
	var id=req.body.movieId;
	var movieObj={
		category:req.body.movieCategory,
		title:req.body.movieTitle,
		director:req.body.movieDirector,
		country:req.body.movieCountry,
		language:req.body.movieLanguage,
		year:req.body.movieYear,
		summary:req.body.movieSummary,
		flash:req.body.movieFlash,
		poster:req.body.moviePoster
	}

	if (req.poster) {
		movieObj.poster=req.poster
	}

	var _movie
	// console.log("this form movie save:")
	// console.log(movieObj)
	//修改操作
	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err)
			}
			_movie=_.extend(movie,movieObj)
			//save 操纵是要由模型中构造的entity进行
			_movie.save(function(err,movie){
				if (err) {
					console.log(err)
				}
				res.redirect("/movie/"+movie._id)
			})
		})
	}
	///保存新一条数据
	else{
		_movie=new Movie(movieObj)
		var categoryId=movieObj.category
		var categoryName=req.body.movieCategoryName
		//console.log("categoryId:")
		//console.log(categoryId);
		_movie.save(function(err,movie){
			if (err) {
				console.log(err)
			}
			if(categoryId){
				Category.findById(categoryId,function(err,category){
					category.movies.push(movie._id)
					category.save(function(err,category){
						res.redirect("/movie/"+movie._id)
					})
				})
			}else if(categoryName){
				var category=new Category({
					name:categoryName,
					movies:[movie._id]
				})
				category.save(function(err,category){
					movie.category=category._id;
					movie.save(function(err,movie){
						res.redirect("/movie/"+movie._id)	
					})
				})
			}
		})
	}
}
// admin movie lists
exports.list=function(req,res,next){
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err)
		}

		res.render('list', { 
			title: 'Movie列表页',
			movies:movies
		});
	})
}

//admin delete movie
exports.delete=function(req,res,next){
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
}

//movie search
exports.search=function(req,res,next){
	var catId=req.query.cat
	var q=req.query.q
	var page=parseInt(req.query.p,10)||0
	var count=2
	var index= page*count
	if (catId) {
		Category
				.find({_id:catId})
				.populate({
					path: 'movies',
					select: 'title poster',
					//options: { limit: 2 ,skip:index},//设置搜索结果数量--分页
					model:'Movie'
				})
				.exec(function(err,categories){
						if(err){
							console.log(err)
						}
						var category=categories[0]||{};
						var movies = category.movies || []
						// console.log("this is from movie search")
						// console.log(movies)

						var results = movies.slice(index, index + count)
					  	res.render('results', { 
						  	title: 'Movie 结果列表页',
						  	keywords:category.name,
						  	currentPage:(page+1),
						  	query:'cat='+catId,
						  	totalPage:Math.ceil(movies.length/count),
						  	movies:results
					  	});
				})
	}else{
		Movie
			.find({title:new RegExp(q+'.*','i')})
			.exec(function(err,movies){
					if(err){
						console.log(err)
					}

					var results = movies.slice(index, index + count)
				  	res.render('results', { 
					  	title: 'Movie 结果列表页',
					  	keywords:q,
					  	currentPage:(page+1),
					  	query:'q='+q,
					  	totalPage:Math.ceil(movies.length/count),
					  	movies:results
					})
			})
	}
}

