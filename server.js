require("./controller/mongodb/db")
if(process.env.NODE_ENV !=='production'){
    require('dotenv').config()
}
const http=require('http');
const express=require('express');
const path=require('path');
const socketio=require('socket.io');
//const { text } = require('express');
const interactive_game=require('./public/script/game.js');
const app=express();
const port=process.env.PORT||3000;
const bodyparser = require('body-parser')
app.use(bodyparser.json())

//const passport=require('passport')
const passportContol=require("./controller/passport-config")
const session=require('express-session')
const flash=require('express-flash')
const methodOverride=require('method-override');
const routers=require('./controller/controllerRoute')
const sendMail=require("./Email/email")

const server=http.createServer(app);
const io=socketio(server);
/*this passport config needs to be here so it can be called before express router(app.use("/",routers) which is below)*/

app.use(flash())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))


/* this set of code has to be blow this "app.use(flash())"  "app.use(session({})"*/
app.use(passportContol.initialize());
app.use(passportContol.session());
app.use(methodOverride('_method'))
/*requirement for templating engine handlebars*/
const handlebars=require('handlebars');
const exphbs=require('express-handlebars');
const {allowInsecurePrototypeAccess}=require("@handlebars/allow-prototype-access");



/*for maiking app look in to public folder  to look up  files*/
//app.use('/static',express.static('public'))
app.use(express.static("public"))

/*this code below allows you to get data in json format*/
app.use(bodyparser.urlencoded({extended:false}));

app.use(bodyparser.json());
app.use(express.json())

/* allows you to look up views directory*/
app.set('views',path.join(__dirname,'/views/')) 
/* handle bars settings*/
app.engine('hbs',exphbs({ 
    handlebars:allowInsecurePrototypeAccess(handlebars),
    extname:"hbs",
    defaultLayout:"mainLayout",
    layoutsDir:__dirname+"/views/layouts/"
}))
app.set('view engine', 'hbs');





let users={};
let  host_name=null;
let  host_sock=null;
io.on('connection',(sock)=>{

console.log('some one connected')

// A listener to collect name of connected people */
sock.on('message2',(text2)=>{
    io.emit('message2',text2);
    users[text2]=sock;
}) 

//To remove selected li element 
sock.on('remove',(text)=>{
    io.emit('remove',text)
})    
//  to clear play box after win

sock.on('message',(text,hosterName)=>{
    host_sock=sock;
    let second_player=text;
    host_name=hosterName;
    let nameArray=[host_name,second_player]
  
    new interactive_game(host_sock,users[second_player],nameArray);
    users[second_player].emit('tester','you are connected with '+host_name);
    host_sock.emit('DisplayName',host_name+' (x)',second_player+' (o)','x');
    users[second_player].emit('DisplayName',host_name+' (x)',second_player+' (o)','o');
    host_name=null;
    nameArray=null;
    second_player=null;
})     
                                             
});                  
server.on('error',(err)=>{
    console.error('server error:',err);
});

app.post('/email',(req,res)=>{
    const email="text@gmail.com"
    const {message}=req.body
    const subject="competition complain";

    sendMail(email,subject,message,(err,data)=>{
        if(err){
            res.status(500).json({message:"internal error"})
        }
        else{
            res.json({message:"Email sent"})
        }
    })

})

server.listen(port,()=>{
    console.log('Started on 3000');
});                       

/*this code notifys the app that we are using express Route and also giving it the location("routers") and base root ("/")*/
app.use("/",routers);


/*
HOW TO UPDATE AN EXITING REPO
* connect the remote repo with this sample
git remote set-url origin https://github.com/chinaza-max/victor--project


*git remote -v
*add changes 
git add .

git commit -am "second message"
*push 
git push  origin master

sample url
git remote set-url origin https://github.com/chinaza-max/competition-tic-tac-toe.git*/