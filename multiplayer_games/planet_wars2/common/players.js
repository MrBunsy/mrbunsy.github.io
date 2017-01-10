//people class

//requires ActOnJSONClass to be defined already
//is handed an instance of ajaxLoop

var PlayersClass = function(requestPlayersThisOften,gamesBox,PlayersHereBox,PlayersEverywhereBox,numJoinableGames,numPlayableGames,numPlayersHereBox,numPlayersLobbyBox,ajaxLoop)
{
	this._requestPlayersThisOften = requestPlayersThisOften;
	this._ajaxLoop=ajaxLoop;
	if (gamesBox !== false) 
	{
		this._gamesBox = document.getElementById(gamesBox);
	}
	else
	{
		this._gamesBox=false;
	}
	if (PlayersHereBox !== false) 
	{
		this._PlayersHereBox = document.getElementById(PlayersHereBox);
	}
	else
	{
		this._PlayersHereBox=false;
	}
	
	if (PlayersEverywhereBox !== false) 
	{
		this._PlayersEverywhereBox = document.getElementById(PlayersEverywhereBox);
	}
	else
	{
		this._PlayersEverywhereBox=false;
	}
	
	if(numJoinableGames !== false)
	{
		//only in lobby
		this._numJoinableGames=document.getElementById(numJoinableGames);
	}
	else
	{
		this._numJoinableGames=false;
	}
	
	if(numPlayableGames !== false)
	{
		//only in lobby
		this._numPlayableGames=document.getElementById(numPlayableGames);
	}
	else
	{
		this._numPlayableGames=false;
	}
	
	
	if(numPlayersHereBox !==false)
	{
		this._numPlayersHereBox=document.getElementById(numPlayersHereBox);
	}
	else
	{
		this._numPlayersHereBox=false;
	}
	
	if(numPlayersLobbyBox !==false)
	{
		this._numPlayersLobbyBox=document.getElementById(numPlayersLobbyBox);
	}
	else
	{
		this._numPlayersLobbyBox=false;
	}
	
	this.numPlayersHere = 0;
	
	if(typeof(thisRoom)=="undefined")
	{
		thisRoom=null;
	}
	
	var tempThis=this;
	
	//produces a list of players to go on the left
	//var parse_users 
	ActOnJSONClass.prototype.parse_players_games = function(playersGames)
	{
		//alert(JSON.stringify(playersGames))
		//list of people just in this room
		if (tempThis._PlayersHereBox !== false) 
		{
			tempThis._PlayersHereBox.innerHTML = playersGames.playersHereHTML;
		}
		
		//general list of people everywhere
		if (tempThis._PlayersEverywhereBox !== false) 
		{
			tempThis._PlayersEverywhereBox.innerHTML = playersGames.playersEverywhereHTML;
		}
		
		if (tempThis._gamesBox !== false) 
		{
			tempThis._gamesBox.innerHTML = playersGames.gamesHTML;
		}
		tempThis.numPlayersHere = playersGames.numPlayersHere;
		
		if(tempThis._numPlayersHereBox !==false)
		{
			tempThis._numPlayersHereBox.innerHTML=playersGames.numPlayersHere;
		}
		
		if(tempThis._numPlayersLobbyBox !==false)
		{
			tempThis._numPlayersLobbyBox.innerHTML=playersGames.numPlayersLobby;
		}
		
		if (tempThis._numJoinableGames !== false)
		{
			tempThis._numJoinableGames.innerHTML = playersGames.numGamesJoinable;
		}
		
		if (tempThis._numPlayableGames !== false)
		{
			tempThis._numPlayableGames.innerHTML = playersGames.numGamesPlaying;
		}
	}
	
	//this._ajaxLoop.addParse('users',parse_users);
	
	this.requestPlayers = function(thisJSON)
	{
		//if there was an old request, override it.  if there wasn't a request, add one.
		//thisJSON.users_request = new Object();
		//thisJSON.users_request.roomId = this.thisRoom;
		thisJSON.players_games_request=new Object();
	}
	
	this.load=function()
	{
		//request Players list every 10 loops - RE-ENABLE THIS SOON
		new this._ajaxLoop.wantRequest(this.requestPlayers, this._requestPlayersThisOften);
	}
	
	this.load();
	
}
