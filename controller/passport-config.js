const { authenticate, serializeUser, deserializeUser } = require('passport')
const passport=require('passport')
const LocalStrategy=require('passport-local').Strategy
const bcrypt=require('bcrypt')
const User=require("./mongodb/schemas/userSchema")
  
//function initialize(passport,getUserByEmail,getUserById){
    const  authenticateUser=(email,password,done)=>{
    // const user =getUserByEmail(email)
        User.findOne({email:email},async(err,user)=>{
            if(user==null){
                return done(null,false,{message:'No user with that email'})
            }
            try{
                if(await bcrypt.compare(password,user.password)){
                    return done(null,user)
                } else{
                    return done(null,false,{message:'password incorrect'})
                }
            } catch(e){
                    return done(e)
            }
        })
    }
/*this method below is use for collecting the data on the input field
using the name attribute"name=email";*/
    passport.use(new LocalStrategy({usernameField:'email'},authenticateUser))

    passport.serializeUser((user,done)=>done(null,user.id))
    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
            if(err){return done(err)}
            done(null,user)
        })
        //return done(null,getUserById(id))
    })
 //}
 module.exports=passport