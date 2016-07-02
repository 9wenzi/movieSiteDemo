var CommentSchema=require("../schemas/commentSchema");
var mongoose=require("mongoose")

var Comment=mongoose.model("Comment",CommentSchema)

module.exports=Comment