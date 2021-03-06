var express = require('express');
var router = express.Router();

var Movie=require("./movie");
var User=require("./user");
var Comment=require('./comment');
var Category=require('./categoryAdmin')

/* GET home page. */
router.get('/', Movie.home);

//User
router.post("/user/signup",User.signup)
router.get("/admin/user/list",User.signinRequired,User.adminRequired,User.userlist)
router.post("/user/signin",User.signin)
router.get("/signin",User.showSignin)
router.get("/signup",User.showSignup)
router.get("/logout",User.logout)

//movie
router.get("/movie/:id",Movie.detail)
router.get("/admin/movie",User.signinRequired,User.adminRequired,Movie.new)
router.post("/admin/movie/new",User.signinRequired,User.adminRequired,Movie.savePoster,Movie.save)
router.get("/admin/movie/update/:id",User.signinRequired,User.adminRequired,Movie.update)
router.get("/admin/movie/list",User.signinRequired,User.adminRequired,Movie.list)
router.delete("/admin/movie/list",User.signinRequired,User.adminRequired,Movie.delete)

//comment
router.post('/user/comment',User.signinRequired,Comment.save)

//category
router.get("/admin/category/new",User.signinRequired,User.adminRequired,Category.new)
router.post("/admin/category",User.signinRequired,User.adminRequired,Category.save)
router.get("/admin/category/list",User.signinRequired,User.adminRequired,Category.list)

//result
router.get("/results",Movie.search)




module.exports = router;
