const mongoose=require('mongoose')


module.exports=mongoose.connect("mongodb://localhost:27017/BrightMindDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false 
  },
  err=>{
      if(!err){
          console.log('connection succeeded')
      }
      else{
          console.log('error in connection '+ err)
      }
    }
)

require("./schemas/userSchema");
