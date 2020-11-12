const mongoose=require('mongoose')


let mergerSchema= new mongoose.Schema({
    merges:{}
});

module.exports=mongoose.model("merger",mergerSchema);