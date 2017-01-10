/*

chat.js - the lobby system and games chat module!

Javascript libraries requires:

ajaxLoop
  (which needs:
   actOnJSON
   ajax)

HTML required:

chat_messages - for the chat log to be stored in
users_main - for the list of people
*/


var chat=new Object();

chat.requestPeopleThisOften=10;

//to store list of people on server
chat.rooms=new Array();

chat.numPlayersInRoom=0;

//which room to request the list of people for? default=false for all rooms
chat.thisRoom=null;

//last message sent to PHP (position in messages array)
chat.lastJSMessage=0;

//index of last message received
chat.lastPHPMessageIndex=0;

//stored messages to be said.
chat.sentMessages=new Array();
chat.PHPMessages=new Array();

//same format as JSON spec requires
chat.sentMessage=function(messageType,destination,content)
{
	this.messageType=urlencode(messageType);
	//room or user, depending on messageType
	switch(messageType)
		{
			case "inter_room":
				this.destinationRoom = urlencode(destination);
				break;
			case "private":
				this.destinationUser = urlencode(destination);
				break;
		}
		
	//this.content=urlencode(content);
	this.content=content;
	
	chat.sentMessages.push(this);
}


chat.sendPrivate=function(theirName)
{
	document.getElementById('chat_input_box_'+rand).focus();
	document.getElementById('chat_input_box_'+rand).value="/prv "+theirName+" ";
}
chat.sendAtRoom=function(theRoom) {
	document.getElementById('chat_input_box_'+rand).focus();
	document.getElementById('chat_input_box_'+rand).value="/atroom "+theRoom+" ";
}

// the parse_functions are called by actOnXML.dishOutStuff() upon receving xml from the ajax functions

chat.getRoom=function(thisRoom)
{
    for(var i=0;i<chat.rooms.length;i++)
    {
        if(chat.rooms[i].id==thisRoom)
        {
            return chat.rooms[i];
        }
    }
}

//produces a list of players to go on the left
actOnJSON.parse_users=function(players)
{
    document.getElementById('users_main').innerHTML=htmlspecialchars_decode(players.html);
	chat.numPlayersInRoom=players.numPlayersInRoom;
}

actOnJSON.parse_chat=function(chat_data)
{
    var oldLength=chat.PHPMessages.length;
   	
	for(var m in chat_data)
	{
		if(parseInt(m) > chat.lastPHPMessageIndex)
        {
            chat.PHPMessages.push(chat_data[m]);
            chat.lastPHPMessageIndex = parseInt(m);
        }
	}
    
    //if new messages, then add them to the html
    if(oldLength!==chat.PHPMessages.length)
    {
        //new messages!
        html='';
        
        for(var i=0; i<chat.PHPMessages.length; i++)
        {
			
            //cycle through last 10 messages
            
            //system for working out if a messages needs YourName : or whatever
            
            msg_prestart = "<span class='msg "+chat.PHPMessages[i].messageType+"'><span class='pre_msg'>";
            msg_time = "<span class='time'>["+chat.PHPMessages[i].time+"]</span>";
            msg_user = "<span class='user_id'><a href='javascript:chat.sendPrivate(\""+chat.PHPMessages[i].from+"\");'>"+chat.PHPMessages[i].from+"</a></span>";	
            msg_preend = '</span>';
            msg_post = "</span><br />";
            msg_content ='<span class="msg_text">'+chat.PHPMessages[i].content+"</span>";
            
            switch(chat.PHPMessages[i].messageType)
            {
                case "third_person":
                    html+= msg_prestart+msg_time+msg_preend+msg_user+' '+msg_content+msg_post;
                    break;
                case "announce":
                    html+= msg_prestart+msg_preend+'** '+msg_content+msg_post;
                    break;
                case "private":
                    if (chat.PHPMessages[i].from == username)
                    {
                        html+= msg_prestart+msg_time+"Private to <span class='userId'><a href='javascript:chat.sendPrivate(\""+chat.PHPMessages[i].destinationUser+"\");'>"+chat.PHPMessages[i].destinationUser+"</a></span>: "+msg_preend+msg_content+msg_post;
                    }
                    else
                    {
                        html+= msg_prestart+msg_time+"Private from "+msg_user+": "+msg_preend+msg_content+msg_post;
                    }
                    break;
                case "inter_room":
                    if (typeof chat.PHPMessages[i].originatingRoom != "undefined") //not sent from this room
                    {
                        html+= msg_prestart+msg_time+'Inter-room from <a href="javascript:chat.sendAtRoom(\''+chat.PHPMessages[i].originatingRoom+'\')">'+chat.PHPMessages[i].originatingRoom+"</a>: "+msg_preend+msg_content+msg_post;
                    }
                    else
                    {
                        html+= msg_prestart+msg_time+'Inter-room to <a href="javascript:chat.sendAtRoom(\''+chat.PHPMessages[i].destinationRoom+'\')">'+chat.PHPMessages[i].destinationRoom+"</a>: "+msg_preend+msg_content+msg_post
                    }
                    break;
                default:
                    html+= msg_prestart+msg_time+" &lt;"+msg_user+"&gt; "+msg_preend+msg_content+msg_post;
                    break;
            }
            
        }
        
        document.getElementById('chat_messages').innerHTML=html;
        document.getElementById('chat_messages').scrollTop=1000000;
    }
    
    if(chat.PHPMessages.length==0)
    {
        document.getElementById('chat_messages').innerHTML="Nothing said yet."
    }
}

//called after all the parse_ functions have been called
chat.JSON_parsed=function()
{
}


chat.speak = function(rand){
    message = htmlspecialchars(document.getElementById('chat_input_box_' + rand).value)
    if (message.length > 0) {
    
        destinationUser = false;
        destinationRoom = false;
         
        if (message.substring(0, 1) == "/") {
            exploded = message.split(" ", 2);
            command = exploded.length >= 1 ? exploded[0].toLowerCase() : null;
            param = exploded.length >= 2 ? exploded[1] : null;
            switch (command) {
                case '/me':
                    messageType = "third_person";
                    content = message.substring(4);
                    break;
                case '/prv':
                case '/private':
                    messageType = "private";
                    destinationUser = param;
                    content = message.substring(exploded[0].length + exploded[1].length + 2);
                    break;
                case '/atroom':
                    messageType = "inter_room";
                    destinationRoom = param;
                    content = message.substring(exploded[0].length + exploded[1].length + 2);
                    break;
                default:
                    messageType = "normal";
                    content = message;
                    break;
            }
        }
        else {
            messageType = "normal";
            //for some reason IE insists on having 'var' here :S
	    var content = message;
        }
        if (!content) return;
        new chat.sentMessage(messageType, destinationUser ? destinationUser : destinationRoom, content)
        
        document.getElementById('chat_input_box_' + rand).value = '';
    }
}

//functions to be registered with ajaxLoop to send messages to the server
chat.sendMessages=function(thisJSON)
{
    if(chat.lastJSMessage < chat.sentMessages.length)
    {
        //user has spoken - send messages
        //xml+='<data type="chat">';
		if(typeof (thisJSON.chat) == "undefined")
		{
			thisJSON.chat=new Array();
		}
        		
		//add the new messages to the end of the (potential) array of old messages.
		thisJSON.chat = thisJSON.chat.concat(chat.sentMessages.slice(chat.lastJSMessage));
		
        chat.lastJSMessage=chat.sentMessages.length;
    }
}

chat.requestMessages=function(thisJSON)
{
	if(typeof (thisJSON.chat_request) == "undefined")
	{
		//if there isn't already a request for messages, add one.  IF there is a request, leave it be because it will be older
		thisJSON.chat_request = new Object();
		thisJSON.chat_request.lastIndex = chat.lastPHPMessageIndex;
	}
    //return '<data type="chat_request"><lastIndex>'+(chat.lastPHPMessage)+'</lastIndex></data>';
}

chat.requestPeople=function(thisJSON)
{
	//if there was an old request, override it.  if there wasn't a request, add one.
	thisJSON.users_request = new Object();
	thisJSON.users_request.roomId=chat.thisRoom;
}

chat.load=function()
{
    //send any messages collected every loop
    new ajaxLoop.wantRequest(chat.sendMessages,1);
    //get new messages every loop
    new ajaxLoop.wantRequest(chat.requestMessages,1);
    //request people list every 10 loops - RE-ENABLE THIS SOON
    new ajaxLoop.wantRequest(chat.requestPeople,chat.requestPeopleThisOften);
    
	
	
    //chat needs to be informed an ajax request has been made
    ajaxLoop.classesToLetKnow.push(chat);
}

addLoadEvent(chat.load);

function chat_input_box_onload() {
	//hacky, but needed because this is before rand declared
	myAddEvent(document.getElementById('chat_input_box_'+rand),'onfocus',chat_input_box_focus);
	myAddEvent(document.getElementById('chat_input_box_'+rand),'onblur',chat_input_box_blur);
}
function chat_input_box_focus() {
        var box = document.getElementById('chat_input_box_'+rand);
        if (box.value == 'Say...') box.value = '';
	document.getElementById('chat_input_box_'+rand).style.color = '#000';
}
function chat_input_box_blur(){
	var box = document.getElementById('chat_input_box_'+rand);
	if (!box.value) box.value = 'Say...';
        document.getElementById('chat_input_box_'+rand).style.color = '#666';
}

myAddEvent(window,'onload',chat_input_box_onload);
