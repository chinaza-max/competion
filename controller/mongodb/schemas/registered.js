const mongoose=require('mongoose')


let registeredSchema= new mongoose.Schema({
    name:{
        type:String,
        required:'this field is required',
        trim:true
    },
    email:{
        type:String,
        required:"this field is required",
        trim:true
    },
    state:{
        type:String,
        required:"this field is required",
        trim:true
    },
    mainId:{
        type:String
    },
    gamePlayered:{
        type:Number
    }
});

module.exports=mongoose.model("user2",registeredSchema);