const express =require('express');
const router=express.Router();
const path=require('path');
const app=express();
const Users=require("./mongodb/schemas/userSchema");
const Users2=require("./mongodb/schemas/registered");
const merger=require("./mongodb/schemas/merges")
 /*these required modules handles passport usage*/

const bcrypt=require('bcrypt');
const passport=require('passport')
const mongoConnection=require('mongoose')
require("./mongodb/db")
const connection=mongoConnection.connection;
// this code gets the list of collection;
let isUser2Available=false;
connection.once("open",()=>{
    console.log("mongodb connected using mongoose")
    connection.db.listCollections().toArray((err,names)=>{
    
        if(err){
            console.log(err)
        }
        else{
            for(i=0;i<names.length; i++){
                //mongoConnection.connection.db.dropCollection("users", function (err, result) {})
                   console.log("avalable collection        "+names[i].name)
            }
        }
    })
})
const {authRole}=require("../adminController/authRole");
const {checkNotAuthenticated}=require("./routeAuthentication/checkNotAuthenticated");
const {checkAuthenticated}=require("./routeAuthentication/checkAuthenticated");
const {formValidation}=require("./routeAuthentication/formValidation");
const { assert } = require('console');
const { resolve } = require('path');


app.use(express.urlencoded({extended:false}))

router.get('/',checkNotAuthenticated,function(req,res){
   res.render("pages/signup",{
       style:"signup.css",
       message:"",
       userName:"user-name",
       password:"password",
       Email:"Email",
       State:"State",
       PhoneNO:"Phone No"
   });

});
    
router.get('/login',checkNotAuthenticated,function(req,res){
    res.render("pages/login",{
        style:"login.css"
    });
});
router.get("/resetLostPassword",(req,res)=>{
    res.render("Password/resetLostPassword",{
    style:"resetLostPassword.css"})
})

router.get("/code",(req,res)=>{
    res.render("Password/phoneNo",{
    style:"phoneNo.css",
    message:""})
})
router.get("/code/changePassword",(req,res)=>{
    res.render("Password/changePassword",{
    style:"changePassword.css"})
})

router.get('/home/game/:id',function(req,res){
    
    Users.findById(req.params.id,async(err,data)=>{ 
        if(err){
            console.log("error emitted trying to get name of gamer check route '/home/game/:id'")
            console.log(err)
        }
        else if(data){
            res.render("pages/game",{
                style:"game.css",
                id:req.params.id,
                name:await data.name
            })
        }
    })
    
});
     
router.get('/home/:id',checkAuthenticated,(req,res)=>{
    let  opponnets='';
    let  opponnets2='';
    let  promise=null;
   /* Users.findOneAndUpdate({_id:"5fa5b758f03ae98b94ddca1b"},{reservedPlayer:"NO"},(err,data)=>{
        if(data){
            console.log(data);
            return;
        }
        else{
            console.log("this error arrive when updating reservedPlayer to yes form middleware(checkForReservedPlayer) ")
            console.log(err)
        }
    })*/
    Users.find((err,d)=>{
       // console.log(d)
    })
    Users.findById(req.params.id,async(err,user)=>{
        //this condition helps to check if merges(players opponent) exit and  and successfully check if user 
        //register for the game and display their opponent name and theirs
        if(err){
            console.log("error arrive due to home page trying to access one of the nav bars route('/home/:id')")

            console.log(err)

        } 
      else{
        
        connection.db.listCollections().toArray((err,names)=>{
            if(err){console.log(err)}
            else{
               
                for(i=0;i<names.length; i++){
                  
                    if(names[i].name=="mergers"){
                        merger.find(async(err,mergeDatas)=>{
                            let mainmergeData=[];
                            if(err){
                                console.log("error when getting already merge user")
                            }
                            else{
                                mergeDatas.forEach((mergeData)=>{
                                    mainmergeData=mergeData.merges
                                 })
                            }  
                            opponnets=mainmergeData.find(merge=>merge.id1==req.params.id)
                            opponnets2=mainmergeData.find(merge=>merge.id2==req.params.id)
                            if(opponnets){
                                  promise= new Promise((resolve,reject)=>{
                                resolve(opponnets)
                               })
                            }
                            else if(opponnets2){
                                promise= new Promise((resolve,reject)=>{
                                    resolve(opponnets2)
                                   })
                            }   
                            else{
                                promise= new Promise((resolve,reject)=>{
                                    resolve("nonRegistered")
                                })
                            }
                                    
                       })
                    }
                    else{
                        promise= new Promise((resolve,reject)=>{
                            resolve("nonRegistered")
                        })
                    }
                
                }
            }
        })
       
           function  page (){
               try{
                    promise.then((update)=>{
                        if(update=="nonRegistered"){
                            res.render("pages/homepage",{
                                style:"home.css",   
                                user:user,
                            })
                        }
                        else{
                            let opponnet1=update.user1
                            let opponnet2=update.user2
                            res.render("pages/homepage",{
                                style:"home.css",   
                                user:user,
                                player1: opponnet1,
                                player2: opponnet2,
                                link:req.params.id,
                                click:"click",
                                vs:"vs"
                            })
                        }
                    })
                    
               }
               catch(err){console.log(err),console.log('this error was "catch" trying to send page with opponent')
            }

        }
        
       if(promise==null){
              setTimeout(page,1000)
       }
       else{
        page()
       }
      }
    })
})

router.get('/home/dashBoard/:id',authRole,(req,res)=>{
       
})

router.get('/home/settings',(req,res)=>{
    res.render("pages/settings")
})

router.get('/home/practice',(req,res)=>{
    res.render("pages/practice")
})

router.get('/home/openBet',(req,res)=>{
    res.render("bets/openBet")
})

router.get('/home/createBet',(req,res)=>{
    res.render("bets/createBet")
})

router.post("/register/:id",(req,res)=>{
    Users.findById(req.params.id,async(err,user)=>{
        if(err){
          console.log("error arrive when registering user for the game")
          console.log(err)
        }
        else{
          try{
            let users2=new Users2()
            users2.name=user.name,
            users2.email=user.email,
            users2.state=user.state,
            users2.mainId=user._id
            users2.save(function(err,data){
                if(err){

                    console.log("error emitted while trying to save registered gamers route('/register/:id')")
                    console.log(err)
                }
           
            })
          }
          catch{

          }
        }
      })
})


router.post("/changedPassword",(req,res)=>{
    
           if(req.body.tel){
            Users.findOne({tel:req.body.tel},async(err,user)=>{
            /*    Users.find((err,data)=>{
                })*/
                if(user){
                    const hashedPassword=await bcrypt.hash(req.body.password,10)
                    Users.findOneAndUpdate({tel:user.tel},{password:hashedPassword},(err,data)=>{
                        if(data){
                            res.redirect("/login");
                        }
                        else{
                            console.log(err)
                        }
                    })
                }
                else{
                    res.render("Password/phoneNo",{
                        style:"phoneNo.css",
                        message:"number not found"
                    })
                }
                
            })
           }
           else{
                res.redirect("/code");
           }
})
router.post("/home/dashBoard/:id/resetCollection",()=>{
    console.log("deletion route")
    connection.db.listCollections().toArray((err,names)=>{
        if(err){
            console.log(err)
        }
        else{
            for(i=0;i<names.length; i++){
                console.log("current collection "+names[i].name)
                if(names[i].name=="mergers"){
                    mongoConnection.connection.db.dropCollection("mergers", function (err, result) {
                        if (err) {
                            console.log(err)
                            console.log("error delete collection check post route '/home/dashBoard/:id/resetCollection' ");
                        }
                        else{
                            console.log("delete collection 'mergers' success");
                            console.log(result)
                        }
                    })
                }
                if(names[i].name=="user2"){
                    console.log("ran2")
                    mongoConnection.connection.db.dropCollection("user2", function (err, result) {
                        if (err) {
                            console.log("error delete collection check post route '/home/dashBoard/:id/resetCollection'  ");
                            console.log(err)
                        }
                        else{
                            console.log("delete collection 'mergers' success");
                            console.log(result)
                        }
                    })
                }
               // else{return}
            }
        }
    })

    Users.find((err,datas)=>{
        if(err){console.log("check the middleware 'updateWinnerReserveredPlayer' ");console.log(err)}
        else{
            datas.forEach(userData=>{
                if(userData.reservedPlayer=="YES"){
                    Users.findOneAndUpdate({_id:userData._id},{reservedPlayer:"NO"},(err,data)=>{
                        if(data){
                            console.log(data);
                        }
                        else{
                            console.log("this error arrive when updating reservedPlayer to yes form middleware(checkForReservedPlayer) ")
                            console.log(err)
                        }
                    })
                }

            })
        }
    })

})
router.post("/merge/:id",validateAdim,deleteMerge,checkForUser2,checkForReservedPlayer,(req,res)=>{
    console.log("merging route")
    console.log(isUser2Available)
    if(isUser2Available){
        let  mergeHolder={
            "mergeArray":[]
        }
        let num=1;
        let Merger=new merger();
        Users2.find((err,datas)=>{
            if(err){
                console.log("error trying to get registered user for merging process")
                console.log(err)
            }
            else{
                
                datas.forEach((data,indx)=>{
                    if(indx==num){
                        mergeHolder.mergeArray.push({"user1":datas[indx-1].name,"user2":data.name,"id1":datas[indx-1].mainId,"id2":data.mainId})
                        num+=2;
                    }
              })
              Merger.merges=mergeHolder.mergeArray
              Merger.save((err,data)=>{
                    if(err){
                        console.log("error while trying to save merges");
                        console.log(err)
                    }
                    else if(data){
                        console.log("merging completed and saved");
                        deleteUsers2()
                    }
                    else{
                        console.log(data)
                        console.log("check merging it has no data  check post route '/merge/:id' ")
                    }
              })
            }
        })
    }
})

router.post("/winner/:id",updateWinnerReserveredPlayer,(req,res)=>{
    req.body.num_played=req.body.num_played+1
    Users.findById(req.params.id,async(err,user)=>{
        if(err){
          console.log("check winning route")
          console.log(err)
        }
        else{
            try{

                let users2=new Users2()
                users2.name=user.name,
                users2.email=user.email,
                users2.state=user.state,
                users2.mainId=user._id
                users2.gamePlayered=req.body.num_played

                users2.save(function(err,data){
                    if(err){
                        console.log("error emitted while trying to save winners  check winning route")
                    }
                    else{
                        console.log("redirect             route")
                      
                    }
                })
            }
            catch(e){
                    console.log('check winners route')
                    console.log(e)
            }
        }
    })
    res.redirect("/home/"+req.params.id);
})

router.post('/signup',formValidation,checkNotAuthenticated,async(req,res)=>{
    let users=new Users();
    
       Users.find((err,data)=>{
        console.log(data)
        })

    if(req.body.tel.length>=11){   
        try{
            const hashedPassword=await bcrypt.hash(req.body.password,10)
            users.name=req.body.name,
            users.password=hashedPassword,
            users.email=req.body.email,
            users.state=req.body.state,
            users.tel=req.body.tel
           
            users.save(function(err,data){
                if(err){
                    
                    res.render("pages/signup",{
                        style:"signup.css",
                        message:"invalid phone number",
                        userName:req.body.name,
                        password:req.body.password,
                        Email:req.body.email,
                        State:req.body.state,
                        PhoneNO:req.body.tel
                    });
                   
                }
                else{
                    res.redirect("/login");
                }
            })
           
        }
        catch{
            console.log("error trying to register users")
        }
    }
    else{
        res.render("pages/signup",{
            style:"signup.css",
            message:"check your phone no ",
            userName:req.body.name,
            password:req.body.password,
            Email:req.body.email,
            State:req.body.state,
            PhoneNO:req.body.tel
        });
    }  
});
    
router.post('/login',checkNotAuthenticated,
    passport.authenticate('local',{
                        failureRedirect:'/login',
                        failureFlash:true}
    ),(req,res)=>{
        Users.findOne({email:req.body.email},async(err,user)=>{
            res.redirect("/home/"+user._id)
        })
       
    }
  )


router.delete('/logout',(req,res)=>{
    req.logout()
    res.redirect('/login')
})

function updateWinnerReserveredPlayer(req,res,next){
    Users.find((err,datas)=>{
        if(err){console.log("check the middleware 'updateWinnerReserveredPlayer' ");console.log(err)}
        else{
            datas.forEach(userData=>{
            if(userData.reservedPlayer=="YES"){
                let users2=new Users2()
                users2.name=userData.name,
                users2.email=userData.email,
                users2.state=userData.state,
                users2.mainId=userData._id
                users2.gamePlayered=0

                users2.save(function(err,data){
                    if(err){
                        console.log("error emitted while trying to save reservePlayer  check winning route")
                        console.log(err)
                    }
                    else{
                        Users.findOneAndUpdate({_id:userData._id},{reservedPlayer:"NO"},(err,data)=>{
                            if(data){
                                console.log(data);
                            }
                            else{
                                console.log("this error arrive when updating reservedPlayer to yes form middleware(checkForReservedPlayer) ")
                                console.log(err)
                            }
                        })
                    }
                })

                
            }
            })
        }
    })
    next()
}

function checkForReservedPlayer(req,res,next){
    Users2.estimatedDocumentCount((err,count)=>{
        if(err){
            console.log("this error arrive before updating reservedPlayer to yes from middleware(checkForReservedPlayer) ")
            console.log(err)
        }
        else if(count%2==0){
             next()
        }
        else if(count==1){
            console.log("the end   just remaining one player " +count)
             next()
        }
        else if(count){
            Users2.find((err,data)=>{
               if(err){
                     console.log("this error came when finding data form 'User2' check the middleware 'checkForReservedPlayer'")
                     console.log(err)
               }
               else{
                
                Users.findOneAndUpdate({_id:data[count-1].mainId},{reservedPlayer:"YES"},(err,data)=>{
                    if(data){
                        //console.log(data);
                    }
                    else{
                        console.log("this error arrive when updating reservedPlayer to yes form middleware(checkForReservedPlayer) ")
                        console.log(err)
                    }
                })
               }

            })
             next();
        }
        else{
             next()
        }
    })
}

function checkForUser2(req,res,next){
    connection.db.listCollections().toArray((err,names)=>{
        if(err){
            console.log(err)
        }
        else{
            for(i=0;i<names.length; i++){
                console.log(names[i].name)
                if(names[i].name=="user2"){
                    isUser2Available=true;
                    break;
                }
            }
            if(isUser2Available==false){
                isUser2Available=false;
            }
            next();
        }
    })
}

function deleteMerge(req,res,next){
    connection.db.listCollections().toArray((err,names)=>{
        if(err){
            console.log("error listing collection at a middleware 'deleteMerge' ")
            console.log(err)
        }
        else{
            for(i=0;i<names.length; i++){
                if(names[i].name=="mergers"){
                    mongoConnection.connection.db.dropCollection("mergers", function (err, result) {
                        if (err) {
                            console.log(err)
                            console.log("error delete collection");
                        }
                        else{
                            console.log("delete collection 'mergers' success");
                        }
                    })
                }
            }
        }
    })
    next()
}
function deleteUsers2(){
    connection.db.listCollections().toArray((err,names)=>{
        if(err){
            console.log(err)
        }
        else{
            for(i=0;i<names.length; i++){
                
                if(names[i].name=="user2"){
                    mongoConnection.connection.db.dropCollection("user2", function (err, result) {
                        if (err) {
                            console.log(err)
                            console.log("error delete collection");
                        }
                        else{
                            console.log("delete user2 collection  success");
                        }
                    })
                }
                
            }
        }
    })
}


function validateAdim(req,res,next){
    next();
}
router.get("*",(req,res)=>{
    res.send("page not found")
})




module.exports=router;  