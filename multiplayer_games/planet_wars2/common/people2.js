//people class

//requires ActOnJSONClass to be defined already
//is handed an instance of ajaxLoop

var PeopleClass = function(requestPeopleThisOften,thisRoom,peopleBox,ajaxLoop)
{
	this._requestPeopleThisOften = requestPeopleThisOften;
	this._ajaxLoop=ajaxLoop;
	this._peopleBox=document.getElementById(peopleBox);
	
	//to store list of people on server
	this.rooms = new Array();
	
	this.numPlayersInRoom = 0;
	
	if(typeof(thisRoom)=="undefined")
	{
		thisRoom=null;
	}
	
	//which room to request the list of people for? default=false for all rooms
	this.thisRoom = thisRoom;
	
	
	var tempThis=this;
	
	//produces a list of players to go on the left
	//var parse_users 
	ActOnJSONClass.prototype.parse_users = function(players)
	{
		tempThis._peopleBox.innerHTML = players.html;
		tempThis.numPlayersInRoom = players.numPlayersInRoom;
	}
	
	//this._ajaxLoop.addParse('users',parse_users);
	
	this.requestPeople = function(thisJSON)
	{
		//if there was an old request, override it.  if there wasn't a request, add one.
		thisJSON.users_request = new Object();
		thisJSON.users_request.roomId = this.thisRoom;
	}
	
	this.load=function()
	{
		//request people list every 10 loops - RE-ENABLE THIS SOON
		new this._ajaxLoop.wantRequest(this.requestPeople, this._requestPeopleThisOften);
	}
	
	this.load();
	
}
