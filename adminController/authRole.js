
const Users=require("../controller/mongodb/schemas/userSchema");
const users2=require("../controller/mongodb/schemas/registered")
const merger=require("../controller/mongodb/schemas/merges");
let mainData2Array=[];
//const { find } = require("../controller/mongodb/schemas/userSchema");


function authRole(req,res,next){
    users2.find(async(err,data)=>{
        
        if(err){
            console.log("error emmitted when trying to fetch all user to display datas in dashboard")
            console.log(err)
        }
        else{
            Users.findById(req.params.id,async(err,user)=>{
                if(err){ 
                    console.log("error when checking if the user can access the admin dashboard")
                    console.log(err)
                }
                else if(await user.tel==process.env.AdminPhoneNO){
                   
                    merger.find(async(err,data2)=>{
                            if(err){
                                console.log("error retriving merge files at the authrole file")
                            }
                            else{
                                data2.forEach((data2Array)=>{
                                    mainData2Array=data2Array.merges
                                 })
                                 res.render("pages/adminDashboard",{
                                    style:"adminDashboard.css",
                                    data:await data,
                                    data2:await mainData2Array,
                                    phone:await user,
                                    id:req.params.id
                                })
                            }
                            


                    })
                   
                }
                else{
                    res.render("pages/dashBoard",{
                        style:"dashBoard.css", 
                        data:await data
                    })
                }
              next();
            })
        }
    })
}

module.exports={authRole}