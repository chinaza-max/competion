// this section handles the UI interface  for online players 
const username_form=document.querySelector('#slide');
const conection_container=document.querySelector('#conection-container');
const join_container=document.querySelector('#join-container');
const nameOf_xPlayer=document.querySelector('#name1');
const nameOf_oPlayer=document.querySelector('#name2');
const playBoxs=document.querySelectorAll('.id1');
const online=document.querySelector('#online');
const nxt_player=document.getElementById('nxt_player');
const nameOfgamer=document.querySelector(".class-id2").id
let value_x='';
let value_o='';
let x_string='';
let o_string='';
let user1='';
let user2="";
let hosterName=null;
let id=0;
let valueToDisplay='x';
let string_holder='';
let timeToCheckWin_1=0;
let timeToCheckWin_2=0;
let intervalBeforeClear=800;
let host_n='';
let join_n='';
let num=1;
let playOnce=''; 
let num_played=0;
let interval_for_countDown =null;
let ClearAllCountDown=null;
let clearRefreshJoiner=null;
let change_number2=6;
let boxOf_PlayId=null;
let gameover_checker=2;  
let checker_winner1=0;
let checker_winner2=0;
let playersNameId='';
  //this variable make sure that both player are connected before starting the count
let connection_status=null;
//this varaible helps to regulate box selection;
let box_id_holder2=null;
// list of possible wins;
let win_a=["abc","def","ghi","adg","beh","cfi","aei","ceg"];
let win_b=['abcd','abce','abcf','abcg','abch','abci','adef',
'bdef','cdef','defg','defh','defi','aghi','bghi','cghi',
'dghi','eghi','fghi','abdg','acdg','adeg','adfg','adgh',
'adgi','abeh','bceh','bdeh','befh','begh','behi','acfi',
'bcfi','cdfi','cefi','cfgi','cfhi','abei','acei','adei',
'aefi','aegi','aehi','aceg','bceg','cdeg','cefg','cegh','cegi'];
let win_c=['abcde','abcdf','abcdg','abcdh','abcdi','abcef','abceg','abceh','abcei','abcfg','abcfh','abcfi',
'abcgh','abcgi','abchi','abdef','acdef','adefg','adefh','adefi','bcdef','bdefg','bdefh','bdefi','cdefg','cdefh','cdefi',
'defgh','defgi','defhi','abghi','acghi','adghi','aeghi','afghi','bcghi','bdghi','beghi','bfghi','cdghi','ceghi','cfghi',
'deghi','dfghi','efghi','abcdg','abdeg','abdfg','abdgh','abdgi','acdeg','acdfg','acdgh','acdgi','adefg','adegh','adegi',
'adfgh','adfgi','adghi','abceh','abdeh','abefh','abegh','abehi','bcdeh','bcefh','bcegh','bcehi','bdefh','bdegh','bdehi',
'befgh','befhi','beghi','abcfi','acdfi','acefi','acfgi','acfhi','bcdfi','bcefi','bcfgi','bcfhi','cdefi','cdfgi','cdfhi',
'cefgi','cefhi','cfghi','abcei','abdei','abefi','abegi','abehi','acdei','acefi','acegi','acehi','adefi','adegi','adehi',
'aefgi','aefhi','aeghi','abceg','acdeg','acefg','acegh','acegi','bcdeg','bcefg','bcegh','bcegi','cdefg','cdegh','cdegi',
'cefgh','cefgi','ceghi'];
let boxOf_PlayIds_arr=['a','b','c','d','e','f','g','h','i'];
let x_or_o='x'

//this holds the id of the play box;
let boxOf_PlayIds=['a','b','c','d','e','f','g','h','i'];

function refreshJoiner(){
    connectionAlert("reconnect please!!!")
    console.log(playersNameId)
    sock.emit('remove',playersNameId);
    document.getElementById(playersNameId).remove()
    window.setInterval(()=>location.reload(),4000)
}

function empty_playBox(){
    let boxOf_PlayId=['a','b','c','d','e','f','g','h','i'];
    boxOf_PlayId.forEach((boxId)=>{document.getElementById(boxId).innerHTML='';})
    x_string='';
    o_string='';
    timeToCheckWin_1=0;
    timeToCheckWin_2=0;
    clearInterval(ClearAllCountDown);
  
   /* if(connection_status=="connected"){
        count_down_func();  console.log("not suppose")
    }*/
}
window.addEventListener('load',()=>{
    const preload=document.querySelector('.preload');
    
    preload.classList.add('preload-finish');
})
/*this function is a temporal solution */
//this function help to clear the browser if count down persist after been clear;
function clearAllCountDown(){
    document.getElementById('display_count').innerHTML='';
}
function removeOnclick(){
    conection_container.style.display='none'; 
    join_container.style.display='none';
}
function reset_playBOXIdContainer(){ 
    sock.emit('reset_playBOXIdContainer',boxOf_PlayIds);
    boxOf_PlayIds_arr=boxOf_PlayIds;
}
function displaycount(num){
    document.getElementById("display_count").innerHTML=num;
}

function func_for_countDown(){
    interval_for_countDown=window.setInterval(()=>{
       document.getElementById('count_down').innerHTML=change_number;
        change_number-=1; 
        if(change_number==-1){
            window.clearInterval(interval_for_countDown)
            gameover_checker=0;
            num=0
            gameOver();
        }},countDown_time);
}
function  increase_speed(){
    window.clearInterval(interval_for_countDown);
    document.getElementById('count_down').innerHTML='';
    countDown_time-=500;
    change_number=6;
    func_for_countDown();
    console.log(response_timer)
    if(countDown_time==4000){
        response_timer=600;
    }
    else if(countDown_time==3000){
        response_timer=600;
    }
    else if(countDown_time==3000){
        response_timer=500;
    }
    else if(countDown_time==3000){
        response_timer=400;
    }
    else{
        return;
    }
}

function  count_down_func(){
    
    interval_for_countDown=window.setInterval(()=>{
    if((change_number2==0)&&(valueToDisplay==x_or_o)){
        automate_play();
        }
    sock.emit('count',change_number2);
    change_number2-=1;
    
    },3000)
}
function refreshCount_Down(value){
    document.getElementById('display_count').innerHTML='';
    window.clearInterval(interval_for_countDown);
    change_number2=value;
    if(connection_status=="connected"){
        count_down_func()
    }
    else{
        return;
    }
}
function update(value1,value2){
    boxOf_PlayIds_arr=value1;
    x_or_o=value2;
}
function automate_play(){
    boxOf_PlayId=boxOf_PlayIds_arr[0];
    valueToDisplay=x_or_o;
    sock.emit('value_transporter',valueToDisplay,boxOf_PlayId);
}




//this function stops computer play
function stopper(){
    one_attempt=1;two_attempt=1;three_attempt=1;four_attempt=1;
    five_attempt=1;six_attempt=1;seven_attempt=1;eight_attempt=1;
    nine_attempt=1;
}

//functions for selecting number of box player want to fill
function change_box(){
    convert_letterTo_number2(this.id)
    console.log(box_id_holder2+1>num2)
     if(box_id_holder2+1>num2){
        sock.emit('selectBox',this.id);
     }
}

/*const boxs=document.querySelectorAll('.box')
   boxs.forEach((box)=>{box.addEventListener('click',change_box)});
   page_reload.addEventListener('click',()=>{location.reload(); })
*/



//the function below is use to collect data on the hoster form;
const  onFormSubmitted1=(e)=>{
    e.preventDefault();
    //if(nameOfgamer==text){
        username_form.style.transition='transform .13s ease-in-out';
        username_form.style.transform='translateY('+-163+'px)';
        const input=document.querySelector('#UserName')
        //const text=input.value;
        hosterName=nameOfgamer
        input.value='';
        console.log(nameOfgamer+"           nameOfgamer")
  //  }
}

//the function below is use to collect data on the joiner form;
const  onFormSubmitted2=(e)=>{
    e.preventDefault();
    const input=document.querySelector('#second-userName')
    const text=input.value;
    joinerName=nameOfgamer;
    input.value='';
    sock.emit('message2',joinerName);
    join_container.style.display='none';
    online.style.display='none';
    connectionAlert('Awaiting opponent.....');
    namesFunc();
    clearRefreshJoiner=window.setTimeout(refreshJoiner,6000);
}

const UsersList=(text)=>{
    const parent=document.querySelector('#orderList');
    const el=document.createElement('li');
    el.classList.add('li-name');
    el.setAttribute('id','id'+id);
    playersNameId='id'+id;
    id++;                      
    el.innerHTML=text;
    parent.appendChild(el);
    namesFunc();
}

//for collecting and removing the name of the second palyer;
function fetchOnline(){
    const second_player= document.getElementById(this.id).innerText;
    console.log(second_player,this.id)
    sock.emit('message',second_player,hosterName);
    sock.emit('remove',this.id);
    conection_container.style.display='none'; 
    online.style.display='none';
    if(hosterName!==null){
        stopper();
    }
    playerToStart(hosterName);  
}


function display_chat(text){
    display_chats.innerHTML=text;
    setTimeout(()=>display_chats.innerHTML=" ",5000)
}

function chats(e){
    e.preventDefault();
    const text=chats_text.value;
    chats_text.value='';
    sock.emit("chats",text)
}

function namesFunc(){  
    let names =document.querySelectorAll('.li-name');
    names.forEach((name)=>name.addEventListener('click',fetchOnline))
//event listner for sending chat across connected user;
}

//eventlistener on form submission for hoster 
document.querySelector('#username-form')
.addEventListener('submit',onFormSubmitted1);

//eventlistener on form submission for joiner
document.querySelector('#second-userName-form')
.addEventListener('submit',onFormSubmitted2);

//this handles music 
let myMusic=document.getElementById('music');
document.getElementById('on').addEventListener("click",()=>myMusic.play());
document.getElementById('off').addEventListener("click",()=>myMusic.pause());
    

//this allows the div container visible for connection for the right choice(host or join);
 document.querySelector('#host')
 .addEventListener('click',()=>{
    conection_container.style.display='inline'; 
    join_container.style.display='none';
})
document.querySelector('#join')
    .addEventListener('click',()=>{
        join_container.style.display='inline';
        conection_container.style.display='none'; 
})




/*this function display the name of each player on the screen
and also listen to play boxs*/
function displayName(host_name,join_name,letter){
        nameOf_xPlayer.innerHTML=host_name;
        nameOf_oPlayer.innerHTML=join_name;
        host_n=  nameOf_xPlayer.innerText;
        join_n= nameOf_oPlayer.innerText;
        valueToDisplay=letter;
        playBoxs.forEach((playBox)=>{
             playBox.addEventListener('click',()=>{
             sock.emit('value_transporter',valueToDisplay,playBox.id);
             })
        })
}




function connectionAlert(text){
    document.querySelector('#display').innerHTML=text;
    connection_status=text; 
    window.clearTimeout(clearRefreshJoiner)
}

function remove_selectedPlayer(text){
    if(document.querySelector('#'+text)){
        document.querySelector('#'+text).remove();
        document.getElementById('display_count').innerHTML='';
        if(connection_status=="connected"){
            count_down_func();
        }
        else{
            return;
        }
    }
}


function clearfunc(){
    empty_playBox();
    reset_playBOXIdContainer();
    count_number_played();
}
  /*function To display the number of  games played ;this function 
  is declared twice because the first one in the tic tac toe file is not 
  callable reason it is inside another function*/
function count_number_played(){
num_played++;
document.getElementById('num_played').innerHTML=num_played+' Game played';
}

function playerToStart(text){
    console.log(text+"next player")
    text= text+"'s"+" turn";
    document.getElementById('nxt_player').innerText=text;
}

//responsible for calling the page reset method;
function display_reloadPage(){
    nxt_player.style.display="none";
    setTimeout(()=>{document.getElementById('display_count').innerHTML=null},3000)
    window.clearInterval(interval_for_countDown);
}

function removeplayerToStart(){
    document.getElementById('nxt_player').innerText='';
    
}

function updateClient_playBoxId(text){
    boxOf_PlayIds=text;
    boxOf_PlayIds_arr=['a','b','c','d','e','f','g','h','i'];
    count_down_func();
}

function playBox_selector(value_x_or_o,selected_id){
    document.getElementById(selected_id).innerHTML=value_x_or_o;
    if(value_x_or_o=='x'){
        x_string+=selected_id;
        timeToCheckWin_1++;
        value_x=value_x_or_o;
        if(timeToCheckWin_1>=3){check_Players_win();}
    }
    else if(value_x_or_o=='o'){
        o_string+=selected_id;
        timeToCheckWin_2++;
        value_o=value_x_or_o;
        if(timeToCheckWin_2>=3){check_Players_win();}
    }
    removeplayerToStart();

}

function check_Players_win(){
    console.log('it checked if player is about to win')
    console.log(gameover_checker+' gameover')
    x_string= x_string.split('').sort().join("");
    o_string= o_string.split('').sort().join("");
    if(win_a.includes(x_string)){
        document.getElementById("point1").innerHTML=2;
        document.getElementById("point2").innerHTML=0;
        checker_winner1++;
        num++;
        setTimeout(clearfunc,intervalBeforeClear);
       
        
     }
     else if(win_a.includes(o_string)){
        document.getElementById("point1").innerHTML=0;
        document.getElementById("point2").innerHTML=2;
        checker_winner2++;
        num++;
        setTimeout(clearfunc,intervalBeforeClear);
      
     
     }
    else if(win_b.includes(x_string)||win_c.includes(x_string)){
        document.getElementById("point1").innerHTML=2;
        document.getElementById("point2").innerHTML=0;
        checker_winner1++;
        num++;
        setTimeout(clearfunc,intervalBeforeClear);
       
     
    }
    else if(win_b.includes(o_string)||win_c.includes(o_string)){
        document.getElementById("point1").innerHTML=0;
        document.getElementById("point2").innerHTML=2;
        checker_winner2++;
        num++;
        setTimeout(clearfunc,intervalBeforeClear);
     
      
    }
    else if((x_string.length==5)||(o_string.length==5&&((num==gameover_checker)==false))){
        setTimeout(clearfunc,intervalBeforeClear);
       
     }
    if(num==gameover_checker){
        document.getElementById('game_over').innerHTML='GAME OVER';
        window.clearInterval(interval_for_countDown);
        document.getElementById('display_count').innerHTML='';
        ClearAllCountDown=setInterval(clearAllCountDown,500)
        boxOf_PlayIds=[];
        sock.emit('removeplayerToStart','')
        

        // the conditional statements(if, else if,else )are to check if a particular player won
        if(checker_winner1>checker_winner2){
            user1=host_n+" won  </br>points:"+2;
            document.getElementById('display_winner').style.color='white';
            document.getElementById('display_winner').style.display="block";
            document.getElementById('display_winner').innerHTML=user1;
            if(valueToDisplay=="x"){
                let id=document.getElementsByClassName("class-id")[0].id
                let datas={
                    num_played
                }
                $.post({
                    url: '/winner/'+id,
                     type: "POST",
                     data: JSON.stringify(datas),
                     contentType: "application/json",
                     success: function (result) {
                        
                     }
                 })
            }
        }
        else if(checker_winner1<checker_winner2){
            user2=join_n+" won </br>points:"+2;
            document.getElementById('display_winner').style.color='white';
            document.getElementById('display_winner').style.display="block";
            document.getElementById('display_winner').innerHTML=user2;
            if(valueToDisplay=="o"){
                let id=document.getElementsByClassName("class-id")[0].id
                let datas={
                    num_played
                }
                   $.post({
                    url: '/winner/'+id,
                     type: "POST",
                     data: JSON.stringify(datas),
                     contentType: "application/json",
                     success: function (result) {
                         alert("success" + result);
                     }
                 })
            }
        }
        else{
            document.getElementById('display_winner').style.color='white';
            document.getElementById('display_winner').innerHTML='NO PLAYER WON(scratch)';
        }

    }
    
}
    const sock=io();
//for alerting both player that they are connected to each other
    sock.on('connected',connectionAlert);
//for making the correct value(x or o)appear in the play box;
    sock.on('value_transporter',playBox_selector);
    sock.on('DisplayName',displayName);
// for displaying user name of those who want to join the hoster;
    sock.on('message2',UsersList);
//for removing a particular connected player;
    sock.on('remove',remove_selectedPlayer); 
//the sock make sure that plabox is clear properly before nextRound;
    sock.on('nextRoundReset',empty_playBox)
//this calls a function to choose the right player to start;
   sock.on('playerToStart',playerToStart)
//this calls a function to remove start display on the wrong player ;
   sock.on('removeplayerToStart',removeplayerToStart);
//for updating client play box id for new round;
   sock.on('updateClient_playBoxId',updateClient_playBoxId);
//for calling page reload method upon disconnection of player;
    sock.on('display_reloadPage',display_reloadPage);
//for displaying countdown number;
    sock.on("count",displaycount);
//for refreshing count down upon selection of play box
    sock.on('refreshCount_Down',refreshCount_Down);
//this collect  the updated list of vailable play box id to for both  players and the next player value('x' or "o")
    sock.on('value_transporter2',update);
//for receiving chat(text);
    sock.on("chats",display_chat);

/*let socket=io.connect()

console.log(sock.connect())
socket.on("error",()=>{
    console.log(sock.sock.connect())
    socket.socket.connect()
})*/