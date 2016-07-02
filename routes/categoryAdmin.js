var Movie=require("../modules/movie");
var _=require("underscore");
var Category=require('../modules/category')

//category page
exports.new=function(req,res,next){
	res.render('categoryAdmin', { title: 'Movie后台分类录入',
		category:{}
	});
}

//admin post new 
exports.save=function(req,res,next){
	var categoryObj={
		name:req.body.categoryName,
	}

	var category=new Category(categoryObj)
	category.save(function(err,category){
		if (err) {
			console.log(err)
		}
		//console.log("this is: "+movie)
		console.log(category)
		res.redirect('/admin/category/list')
	})
	
}
// lists
exports.list=function(req,res,next){
	Category.fetch(function(err,categories){
		if(err){
			console.log(err)
		}
		// console.log("this from categoryAdmin list:")
		// console.log(categories)
		res.render('categorylist', { 
			title: 'Movie分类列表页',
			categories:categories
		});
	})
}

//admin delete movie
exports.delete=function(req,res,next){
	var id=req.query.id;
	
	if(id){
		Category.remove({_id:id},function(err,movie){
			if(err){
				console.log(err)
			}
			else{
				res.json({success:1})
			}
		})
	}
}

