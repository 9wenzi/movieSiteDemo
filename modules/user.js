var UserSchema=require("../schemas/userSchema");
var mongoose=require("mongoose")

var User=mongoose.model("User",UserSchema)

module.exports=User