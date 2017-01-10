var host=new Object();

//modrewrite thinks were somewhere else
ajaxLoop.callFile='../ajax.php';

//curerntly requesting everyone, set to 0 for people in this room only
//chat.thisRoom=false;
//RE-ENABLE THESE
//chat.requestPeopleThisOften=5;

host.load=function()
{
    host.gotMap=false;
    
    //ask for general requests (game started, kick, etc) every ajax call
    new ajaxLoop.wantRequest(host.sendGeneralRequest,1);
    

    //ask for map, one off on page load in case of refresh
	//now handled by initial_ajax
    //new ajaxLoop.wantRequest(function(thisJSON){thisJSON.map_request=new Object();thisJSON.map_request.lastIndex=0;},0);
    
    ajaxLoop.classesToLetKnow.push(host);
    
	actOnJSON.loadIntialAjax();
    //generate a random map, but don't upload it yet
   // planet_wars.newMap(true);
}

host.sendGeneralRequest=function(thisJSON)
{
    thisJSON.pregame_general_request=new Object();
	//return '<data type="pregame_general_request"></data>';
}


hostStartPWGame=function()
{

   new ajaxLoop.wantRequest(function(thisJSON){thisJSON.gamestart_request=new Object();},0);
}

// ------------ planet_Wars extending fuynctions =-------------

//another strange bug, host. doesn't work, this function does.
hostopenEditor=function()
{
	planet_wars.openEditor(1,[],['planet_wars_editor','planet_wars_editor_container']);
}

//set up one off ajax to upload map
host.startMapUpload=function()
{
    //no map on server - upload our auto-generated one
    planet_wars.uploadedNewMap=false;
    //one off ajax.
    new ajaxLoop.wantRequest(planet_wars.uploadNewMap,0);
}

planet_wars.newMap=function(noUpload)
{
    //(planets,players,planetsize,blackholes,spaceStations,wormholes)
    planet_wars.generateMap(3+planet_wars.numberOfPlayers,parseInt(document.getElementById('optionPlayers').value),1,1,1,0);
	planet_wars.editorTidyUpShips();
    
	Render.renderViewport(0);
    
    //don't auto-upload this map if told not to.
    if(noUpload!==true)
    {
        host.startMapUpload();
    }

}

//one-off function ajaxloop calls.
planet_wars.uploadNewMap=function(thisJSON)
{
    //this is needed in case map changes before old one could be sent off
    if(!planet_wars.uploadedNewMap)
    {
		/*thisJSON.map=new Object();
        planet_wars.uploadedNewMap=true;
		thisJSON.map.objects=planet_wars.objects;
		thisJSON.map.grav_multiplier=roundNumber(0.9+Math.random()*0.2);
		thisJSON.map.seed=planet_wars.seed;
		*/
		planet_wars.mapToJSON(thisJSON);
        //return planet_wars.mapToXML();
    }
    else
    {
        //return '';
    }
}



// ---------- act on xml functions ------------- (respond to server xml)

//game started command come through, shuffle over to room
actOnJSON.parse_gameStart=function(data)
{
	//parseing as int so nothing nasty should be able to happen.
    location.href="../play/"+parseInt(data.roomId);
}

actOnJSON.parse_kick=function(data)
{
    location.href="../../";//?kickReason="+stripslashes(data.reason);
}

//should only be called once, near page loading
actOnJSON.parse_map=function(map)
{   
	
    //no map in db, upload one generated just now
    if(typeof map.mapId == 'undefined')
    {
		planet_wars.newMap(true);
        host.startMapUpload();
		Render.renderViewport(0);
    }
    else
    {
        //was already a map before loading this map, load it up.
        planet_wars.loadJSONMap(map);

		Render.renderViewport(0);
        selectValue('optionPlayers',planet_wars.players.length);
    }
}

host.JSON_parsed=function()
{
    //check to see if there are too many people in this room for the map

    if(chat.numPlayersInRoom > planet_wars.players.length)
    {
  //      alert('too many people for map!')
    }
    
    for(var i=0;i<document.getElementById('optionPlayers').options.length;i++)
    {
        if(document.getElementById('optionPlayers').options[i].value < chat.numPlayersInRoom)
        {
            document.getElementById('optionPlayers').options[i].disabled="disabled";
        }
        else
        {
            document.getElementById('optionPlayers').options[i].removeAttribute('disabled');
        }
    }
    
    if(chat.numPlayersInRoom == planet_wars.players.length)
    {
        document.getElementById('startGameLink').style.visibility="visible";
    }
    else
    {
        document.getElementById('startGameLink').style.visibility="hidden";
    }
    
}

myAddEvent(window,'onload',host.load);