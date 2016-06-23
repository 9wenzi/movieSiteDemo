var MovieSchema=require("../schemas/MovieSchema");
var mongoose=require("mongoose")

var Movie=mongoose.model("Movie",MovieSchema)

module.exports=Movie

