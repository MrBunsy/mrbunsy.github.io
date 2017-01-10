var joinGame=new Object();

joinGame.lastMap=0;

//modrewrite thinks were somewhere else
ajaxLoop.callFile='../ajax.php';

//curerntly requesting everyone, set to 0 for people in this room only
chat.thisRoom=false;


joinGame.load=function()
{
    //ask for general requests (game started, kick, etc) every ajax call
    new ajaxLoop.wantRequest(joinGame.sendGeneralRequest,1);
	actOnJSON.loadIntialAjax();
}

joinGame.sendGeneralRequest=function(thisJSON)
{
    //return '<data type="pregame_general_request"></data><data type="map_request"><lastIndex>'+joinGame.lastMap+'</lastIndex></data>';
	thisJSON.pregame_general_request=new Object();
	thisJSON.map_request=new Object();
	thisJSON.map_request.lastIndex=joinGame.lastMap;
}


// ---------- act on xml functions ------------- (respond to server xml)

//game started command come through, shuffle over to room
actOnJSON.parse_gameStart=function(data)
{
    //data.roomId
    location.href="../play/"+parseInt(data.roomId);
}

actOnJSON.parse_kick=function(data)
{
    location.href="../../";//?kickReason="+stripslashes(data.reason);
}

//if pre-game lobby admin leaves, someone else can be premoted to take over.  Shuffle said person to admin page.
actOnJSON.parse_promotion=function(data)
{
	//alert(data[0]);
    location.href="../host/"+data.roomId;
}

actOnJSON.parse_map=function(map)
{
	
    if(typeof map.mapId != 'undefined')
    {
		joinGame.lastMap=map.mapId;
		planet_wars.loadJSONMap(map);
		Render.renderViewport(0);
    }
}

myAddEvent(window,'onload',joinGame.load);