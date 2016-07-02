var User=require("../modules/user");

exports.showSignup=function(req,res,next){
	res.render('signup',{
		title:'注册页面',
	})
}
exports.showSignin=function(req,res,next){
	res.render('signin',{
		title:'登录页面',	
	})
}
//sign up 注册
exports.signup=function(req,res,next){
	var _user={
		name:req.body.userName,
		password:req.body.userPassword
	}

	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(ere)
		}
		if(user){
			res.redirect("/signin")
		}
		else{
			var user=new User(_user)
			user.save(function(err,user){
				if(err){
					console.log(err)
				}
				res.session.user=user;
				res.redirect("/")
			})	
		}
	})
}
//user list
exports.userlist=function(req,res,next){
	User.fetch(function(err,users){
		if(err){
			console.log(err)
		}
		res.render('userlist', { 
			title: '用户列表页',
			users:users
		});
	})	
}
//user required
exports.signinRequired=function(req,res,next){
	var user=req.session.user;

	if (!user) {
		return res.redirect('/signin')
	}
	next()
}
exports.adminRequired=function(req,res,next){
	var user=req.session.user;
	if (user.role<=10) {
		return res.redirect('/signin')
	}
	next()
}

//sign in 登录
exports.signin=function(req,res,next){
	var _user={
		name:req.body.userName,
		password:req.body.userPassword
	}

	User.findOne({name:_user.name},function(err,user){
		if(err){
			console.log(err)
		}
		if(!user){
			return res.redirect("/signup")
		}

		user.comparePassword(_user.password,function(err,isMatch){
			if(err){
				console.log(err)
			}
			if(isMatch){
				req.session.user=user
				return res.redirect("/")
			}
			else{
				return res.redirect("/signin")
			}
		})
	})
}
//logout
exports.logout=function(req,res,next){
	delete req.session.user;
	delete res.locals.user
	res.redirect('/')
}