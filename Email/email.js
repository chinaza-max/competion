require('dotenv').config(); 
const nodemailer=require('nodemailer');

const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.PASSWORD,
        pass: process.env.EMAIL
    }
});


const sendMail=(email,subject,text,cb)=>{
    const mailOptions={
        from:email,
        to:"brightmind.lmt@gmail.com",
        subject,
        text
    }
    
    transporter.sendMail(mailOptions,function(err,data){
            if(err){
                cb(err,null)
            }
            else{
                cb(null,data)
            }
    });
}

module.exports=sendMail;


