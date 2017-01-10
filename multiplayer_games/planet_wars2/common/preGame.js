var PreGameClass=function(ajaxLoop,host)
{
	var thisObject=this;
	
	this._ajaxLoop=ajaxLoop;
	//is this player the host?
	this._host=host;
	this._kickArray=new Array();
	this._banArray=new Array();
	
	this.sendGeneralRequest=function(thisJSON)
	{
	    thisJSON.pregame_general_request=new Object();
	}
	
	//request general stuff
	new this._ajaxLoop.wantRequest(this.sendGeneralRequest,1);
	
	
	
	this.startGame=function()
	{
	   new this._ajaxLoop.wantRequest(function(thisJSON){thisJSON.gamestart_request=new Object();},0);
	}
	
	
	
	this.kick=function(userId,reason)
	{
		var tempObj=new Object();
		tempObj.userId=userId;
		if (typeof reason != 'undefined') 
		{
			tempObj.reason = reason;
		}
		this._kickArray.push(tempObj);
		
		new this._ajaxLoop.wantRequest(this.sendKicks,0);
	}
	
	
	this.sendKicks=function(thisJSON)
	{
		if(typeof thisJSON.kick_player =='undefined')
		{
			thisJSON.kick_player=new Array();
		}
		
		thisJSON.kick_player=thisJSON.kick_player.concat(tempObject._kickArray);
		
		tempObject._kickArray=new Array();
	}
	
	
	this.ban=function(userId,reason,period_sec)
	{
		var tempObj=new Object();
		tempObj.userId=userId;
		if (typeof reason != 'undefined') 
		{
			tempObj.reason = reason;
		}
		if (typeof period_sec != 'undefined') 
		{
			tempObj.period_sec = period_sec;
		}
		
		this._banArray.push(tempObj);
		
		new this._ajaxLoop.wantRequest(this.sendBans,0);
	}
	
	
	this.sendBans=function(thisJSON)
	{
		if(typeof thisJSON.ban_player =='undefined')
		{
			thisJSON.ban_player=new Array();
		}
		
		thisJSON.ban_player=thisJSON.ban_player.concat(tempObject._banArray);
		
		tempObject._banArray=new Array();
	}
	
	this._startGameCount=0;
	
	//game started command come through, shuffle over to room
	ActOnJSONClass.prototype.parse_gameStart=function(data)
	{
		switch(thisObject._startGameCount)
		{
			case 0:
				chat.fakeChat("5");
				break;
			case 1:
				chat.fakeChat("4");
				break;
			case 2:
				chat.fakeChat("3");
				break;
			case 3:
				chat.fakeChat("2");
				break;
			case 4:
				chat.fakeChat("1");
				break;
			case 5:
				location.href="../play/"+parseInt(data.roomId);
				break;
		}
		thisObject._startGameCount++;	
	}
	
	ActOnJSONClass.prototype.parse_kick=function(data)
	{
	    location.href="../../lobby?kickReason="+stripslashes(data.reason);//?kickReason="+stripslashes(data.reason);
	}
	
	ActOnJSONClass.prototype.parse_promotion=function(data)
	{
	    location.href="../host/"+data.roomId;
	}
}
