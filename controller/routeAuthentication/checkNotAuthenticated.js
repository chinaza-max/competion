function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
       return  res.redirect('/home/'+req.user._id)
    }
    next(); 
}

module.exports={checkNotAuthenticated}