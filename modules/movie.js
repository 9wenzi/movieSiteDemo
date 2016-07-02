var MovieSchema=require("../schemas/movieSchema");
var mongoose=require("mongoose")

var Movie=mongoose.model("Movie",MovieSchema)

module.exports=Movie

