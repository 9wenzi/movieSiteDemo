var CategorySchema=require("../schemas/categorySchema");
var mongoose=require("mongoose")

var Category=mongoose.model("Category",CategorySchema)

module.exports=Category