const { text } = require("express");

class interactive_game{
    constructor(p1,p2,nameArray){
        this.players=[p1,p2];
        this.values=['x','o'];
        this.boxOf_PlayIds=['a','b','c','d','e','f','g','h','i'];
        this.turns='x';
        this.change_player=1;
        this.hosterName=nameArray[0];
        this.joinerName=nameArray[1];
        this.count_down_func_for_display();
        this.nextround();
        this.Disconnect();
        this.change_number=6;
        this.interval_for_countDown=null;
        this.sendToPlayer();
        
        //to alert player that they are conected 
        this.sendToPlayers('connected');
        this.players.forEach((player,indx)=>{    
                    player.on('value_transporter',(valueToDisplay,playBoxId)=>{
                        let boolenValue= this.boxOf_PlayIds.includes(playBoxId);
                        if(boolenValue==true){ 
                            this.sendToPlayers_2(valueToDisplay,playBoxId,indx);
                        }
                    });
        });   
    }
    //this function show or display count down for both connected player ;
    count_down_func_for_display(){
        this.players.forEach((player,indx)=>{
            player.on('count',(change_number2)=>{
                if(change_number2){
                    this.players[indx].emit('count',change_number2);
                }
            });
        })
    }
//this method handles the chats text TransformStream;
    sendToPlayer(){                                        
        //this.players[playerIndex].emit('message',msg);

        this.players.forEach((player,indx)=>{
            player.on('chats',(text)=>{
                if(text){
                    if(indx==0){
                        this.players[indx+1].emit('chats',text)
                    }
                    else if(indx==1){
                        this.players[indx-1].emit('chats',text)
                    }
                }
            })
        })
    }
    sendToPlayers(msg){
        this.players.forEach((player)=>{
            player.emit('connected',msg);
        })
    
        this.players.forEach((player,indx)=>{
            player.on('connected2',(message)=>{
                if(message){
                    this.players[indx].emit('connected',message);
                }
            });
            
        })
//for updating selected box on the person who join the game;

        this.players[0].on('selectBox',(text)=>{   
            this.players.forEach((player)=>{
                player.emit('selectBox',text);
            })
        })
        let container=0;
        this.players.forEach((player)=>{
            player.on('reset_playBOXIdContainer',(text)=>{
                this.boxOf_PlayIds=text;
                container++;
                if(container==2){
                    container=0;
                    if(this.change_player%2){
                        this.turns='o';
                        this.players[1].emit('playerToStart',this.joinerName)
                        
                        this.players[0].emit('removeplayerToStart','START')
                        this.change_player++;
                    }
                    else{
                        this.turns='x';
                        this.players[0].emit('playerToStart',this.hosterName)
                    
                        this.players[1].emit('removeplayerToStart','START')
                        this.change_player++;
                    }
                    
                   
                }
    
            });
        })

    }
    //to display 'x' or 'o' in playbox 
    sendToPlayers_2(valueToDisplay,playBoxId,indx){
        if(indx==0){
            indx+=1
        }
        else if(indx==1){
            indx-=1
        }

        if(valueToDisplay==this.turns){
            //to clear the count down upon play box selection 
            this.players.forEach((player)=>{
                player.emit('refreshCount_Down',6);
            })
            
            this.turns=this.values[indx]; 
            this.players.forEach((player)=>{
                player.emit('value_transporter',valueToDisplay,playBoxId);
            })

            this.boxOf_PlayIds= this.boxOf_PlayIds.filter((boxOf_PlayId)=>{
                return boxOf_PlayId!=playBoxId;
            });
        }


        //this logic below send an updated list of vailable play box id to both players and the next player value('x' or "o")
        this.players.forEach((player)=>{
            player.emit('value_transporter2',this.boxOf_PlayIds,this.turns);
        })
    }
    check_win(){

    }
    //this the method allows you to play again after game over 
    nextround(){
     
        let decisionToRestart=[];
        this.players.forEach((player,indx)=>{
            player.on('nextround',(text)=>{
               //this condition allows both user to agree to play again
                if(indx==0){
                    decisionToRestart.push('x');
                }
                else if(indx==1){
                     decisionToRestart.push('o');
                }

                if((decisionToRestart.includes('x'))&&(decisionToRestart.includes('o'))){
                  this.boxOf_PlayIds=['a','b','c','d','e','f','g','h','i'];

                  this.players.forEach((player)=>{
                        player.emit('nextRoundReset',text);
                    })
                    /*this listener below  is for updating the play box id on the
                    client*/
                    this.players.forEach((player)=>{
                        player.emit('updateClient_playBoxId',this.boxOf_PlayIds);
                    }) 
                    decisionToRestart=[];
                    /*this helps to redisplay connected if the awaiting player joins the other player who is 
                    ready to play*/
                  this.players.forEach((player)=>{
                     player.emit('connected','connected');
                  })
                }
                    
            })

        })

    }
    Disconnect(){
      
        this.players.forEach((player)=>{
            player.on('disconnect',()=>{
                this.players.forEach((player)=>{
                    player.emit('connected','Disconnected');
                    this.players.forEach((player)=>{
                        player.emit('display_reloadPage','');
                    })
                    this.boxOf_PlayIds=[];

                })
            })    
         })
    }
}
module.exports=interactive_game;
