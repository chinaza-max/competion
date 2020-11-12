const Users=require("../mongodb/schemas/userSchema");

function formValidation(req,res,next){
    if(req.body.password.length<=6){
        res.render("pages/signup",{
            style:"signup.css",
            message1:"increase the length of your password",
            userName:req.body.name,
            password:req.body.password,
            Email:req.body.email,
            State:req.body.state,
            PhoneNO:req.body.tel
        });
    }
    else if(req.body.password.match(/\d+/g)===null){
        res.render("pages/signup",{
            style:"signup.css",
            message1:"you must include number to make it stronger",
            userName:req.body.name,
            password:req.body.password,
            Email:req.body.email,
            State:req.body.state,
            PhoneNO:req.body.tel
        });
    }
    else if(/[a-zA-Z]/g.test(req.body.password)===false){
        res.render("pages/signup",{
            style:"signup.css",
            message1:"you must include letter to your password to make it stronger",
            userName:req.body.name,
            password:req.body.password,
            Email:req.body.email,
            State:req.body.state,
            PhoneNO:req.body.tel
        });
    }
    else{
        Users.findOne({tel:req.body.tel},async(err,user)=>{
    
            if(user){
                res.render("pages/signup",{
                    style:"signup.css",
                    message:"use another number this has been taken",
                    userName:req.body.name,
                    password:req.body.password,
                    Email:req.body.email,
                    State:req.body.state,
                    PhoneNO:req.body.tel
                });
            }
            else{
                Users.findOne({tel:req.body.tel},async(err,user)=>{
                    if(user){
                        res.render("pages/signup",{
                            style:"signup.css",
                            message:"use another email this has been taken",
                            userName:req.body.name,
                            password:req.body.password,
                            Email:req.body.email,
                            State:req.body.state,
                            PhoneNO:req.body.tel
                        });
                    }
                    else{
                        next();
                    }
                })
            
            }
        })
    }
       
}
module.exports={formValidation}