/*

chat.js - the lobby system and games chat module!

Javascript libraries requires:

-ActOnJSONClass
	(
	 -AjaxClass
	 -ActOnJSONClass
	 )
	

HTML required:

chat_messages - for the chat log to be stored in
users_main - for the list of people
*/
var ChatClass = function(chatInputBox,chatMessagesBox,ajaxLoop,userPrefs)
{

	
	this._chatInputBox=document.getElementById(chatInputBox);
	this._chatMessagesBox=document.getElementById(chatMessagesBox);
	
	this._ajaxLoop=ajaxLoop;
	
	/**
	 * Local copy of the user preferences, since it's globally stored as lobby.userPrefs, etc.... :S
	 * @var userPrefs
	 */
	this._userPrefs = userPrefs;
	
	//last message sent to PHP (position in messages array)
	this.lastJSMessage = 0;
	
	//index of last message received
	this.lastPHPMessageIndex = 0;
	
	//stored messages to be said.
	this.sentMessages = new Array();
	this.PHPMessages = new Array();
	
	var tempThis=this;
	
	//same format as JSON spec requires
	this.SentMessageClass = function(messageType, destination, content)
	{
		this.messageType = messageType;
		//room or user, depending on messageType
		switch (messageType)
		{
			case "inter_room":
				this.destinationRoom = destination;
				break;
			case "private":
				this.destinationUser = destination;
				break;
		}
		
		this.content = content;
		
		tempThis.sentMessages.push(this);
	}
	
	
	this.sendPrivate = function(theirName)
	{
		this._chatInputBox.focus();
		this._chatInputBox.value = "/prv " + theirName + " ";
	}
	
	this.sendAtRoom = function(theRoom)
	{
		this._chatInputBox.focus();
		this._chatInputBox.value = "/atroom " + theRoom + " ";
	}
	
	// the parse_functions are called by actOnXML.dishOutStuff() upon receving xml from the ajax functions
	
	this.getRoom = function(thisRoom)
	{
		for (var i = 0; i < this.rooms.length; i++) 
		{
			if (this.rooms[i].id == thisRoom) 
			{
				return this.rooms[i];
			}
		}
	}
	
	this.fakeChat=function(sayThis)
	{
		this._chatMessagesBox.innerHTML+='<span class="announce">'+sayThis+'</span><br/>';
		//plus that scrolly thing
		tempThis._chatMessagesBox.scrollTop = 1000000;
	}
	
		
	ActOnJSONClass.prototype.parse_chat = function(chat_data)
	{
		var html = '';
		//first we need to order the messages that just came down. so get the keys and sort them
		var keys = [];
		var msgFromSomeoneElse = false; //whether we've got a message from someone else
		for (var i in chat_data)
			keys.push(parseInt(i));
		//first chance to find out if there aren't any new messages!
		
		if (!keys.length) return;
		keys.sort(sortA);
		//now add the messages
		for (var key in keys)
		{
			html+= chat_data[keys[key]].html+'<br />';
			if (chat_data[keys[key]].from != username)
			{
				msgFromSomeoneElse = true;
			}
		}
		
		
		//if this is the first message, clear the box first
		if (tempThis.lastPHPMessageIndex == 0) 
		{
			tempThis._chatMessagesBox.innerHTML = html;
		}
		else 
		{
			tempThis._chatMessagesBox.innerHTML += html;
		}
		//and make a record of the highest index
		tempThis.lastPHPMessageIndex = keys[keys.length-1];
		//plus that scrolly thing
		tempThis._chatMessagesBox.scrollTop = 1000000;
		//and the alert
		//it's important that tempThis._userPrefs comes last, as it won't be set yet (probably) if tempThis._ajaxLoop.doingInitialAjax() is true
		if (msgFromSomeoneElse && !tempThis._ajaxLoop.doingInitialAjax() && tempThis._userPrefs.chatSounds)
		{
			sounds.play('newmsg');
		}
		
	}
	
	//called after all the parse_ functions have been called
	this.JSON_parsed = function()
	{
	}
	
	
	this.speak = function()
	{
		message = htmlspecialchars(this._chatInputBox.value)
		if (message.length > 0) 
		{
		
			destinationUser = false;
			destinationRoom = false;
			
			if (message.substring(0, 1) == "/") 
			{
				exploded = message.split(" ", 2);
				command = exploded.length >= 1 ? exploded[0].toLowerCase() : null;
				param = exploded.length >= 2 ? exploded[1] : null;
				switch (command)
				{
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
			else 
			{
				messageType = "normal";
				//for some reason IE insists on having 'var' here :S
				var content = message;
			}
			if (!content) 
				return;
			new tempThis.SentMessageClass(messageType, destinationUser ? destinationUser : destinationRoom, content)
			
			this._chatInputBox.value = '';
		}
	}
	
	//functions to be registered with ajaxLoop to send messages to the server
	this.sendMessages = function(thisJSON)
	{
		if (tempThis.sentMessages.length > 0) 
		{
			//user has spoken - send messages
			if (typeof(thisJSON.chat) == "undefined") 
			{
				thisJSON.chat = new Array();
			}
			
			//add the new messages to the end of the (potential) array of old messages.
			thisJSON.chat = thisJSON.chat.concat(tempThis.sentMessages);
			
			tempThis.sentMessages = new Array();
		}
	}
	
	this.requestMessages = function(thisJSON)
	{
		if (typeof(thisJSON.chat_request) == "undefined") 
		{
			//if there isn't already a request for messages, add one.  IF there is a request, leave it be because it will be older
			thisJSON.chat_request = new Object();
			thisJSON.chat_request.lastIndex = tempThis.lastPHPMessageIndex;
		}
	}
	
	
	this.load = function()
	{
		//send any messages collected every loop
		new this._ajaxLoop.wantRequest(this.sendMessages, 1);
		//get new messages every loop
		new this._ajaxLoop.wantRequest(this.requestMessages, 1);
		
		//chat needs to be informed an ajax request has been made
		this._ajaxLoop.letClassKnowOnce(this);
		
			//hacky, but needed because this is before rand declared
		myAddEvent(this._chatInputBox, 'onfocus', function(){tempThis.chat_input_box_focus(tempThis)});
		myAddEvent(this._chatInputBox, 'onblur', function(){tempThis.chat_input_box_blur(tempThis)});
	}
	
	this.load();


	this.chat_input_box_focus=function(who)
	{
		var box = document.getElementById('chat_input_box_' + rand);
		if (box.value == 'Say...') 
			box.value = '';
		who._chatInputBox.style.color = '#000';
	}
	this.chat_input_box_blur=function(who)
	{
		var box = document.getElementById('chat_input_box_' + rand);
		if (!box.value) 
			box.value = 'Say...';
		who._chatInputBox.style.color = '#666';
	}
}

//myAddEvent(window,'onload',chat_input_box_onload);
