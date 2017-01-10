// online version of planet wars - extends planet_wars.js

//  non-PW stuff

//modrewrite thinks were somewhere else
//ajaxLoop.callFile='../ajax.php';

//ask for map, one off on page load in case of refresh
//new ajaxLoop.wantRequest(function(){return '<data type="map_request"><lastIndex>0</lastIndex></data>';},0);

//should only be called once, near page loading
ActOnJSONClass.prototype.parse_map=function(map)
{   
    //map from db, load it!
    planet_wars.loadJSONMap(map);
    Render.renderViewport(0);	
}

ActOnJSONClass.prototype.parse_events=function(events)
{
	//planet_wars.events=planet_wars.events.concat(events.event);
	
	for(var e in events)
	{
		planet_wars.events.push(events[e]);
		planet_wars.events[planet_wars.events.length-1].id=parseInt(e);
	}
	
	planet_wars.lastAJAXEvent=planet_wars.events[planet_wars.events.length-1].id;
}

ActOnJSONClass.prototype.parse_ingame_players=function(players)
{
	//on map load player's names are set to the player's refId
	//this gets the player's refId with a bunch of info like their name
	
	for(var i in players)
	{
		for(var r=0;r<planet_wars.players.length;r++)
		{
			if(i==planet_wars.players[r].name)
			{
				//find player with this refId 
				planet_wars.customPlayerNames[r]=players[i].username;
				continue;
			}
		}
	}
	
	for(var i=0;i<planet_wars.players.length;i++)
	{
		planet_wars.players[i].refId=planet_wars.players[i].name;
		planet_wars.players[i].name=planet_wars.customPlayerNames[i];
	}
	
}

ActOnJSONClass.prototype.parse_promotion=function(data)
	{
	    //nothing atm
	}
	
ActOnJSONClass.prototype.parse_game_settings = function(settings)
	{
		//update settings to what is on the server
		planet_wars.anonymousPowerups = settings.anonymousPowerups;
		planet_wars.rounds = settings.rounds;
		
		planet_wars.tournamentMode = (planet_wars.rounds > 1 );

		planet_wars.ranked = settings.ranked;
	}

planet_wars.catchingUpRate=15;
planet_wars.defaultFrameSkip=1;

var chat;
var sounds;
planet_wars.load2=function()
{
	
	if(planet_wars.chrome)
	{
		planet_wars.defaultFrameSkip=2;
		planet_wars.frameSkip=planet_wars.defaultFrameSkip;
	}
	
    planet_wars.canvasTag2=document.getElementById('planet_wars_canvas2');
    planet_wars.div2=document.getElementById('planet_wars_div');
    
    planet_wars.canvasTag2.style.cursor="pointer";
    planet_wars.canvasTag2.style.position="absolute";
    
    planet_wars.fireAngleBox=document.getElementById('planet_wars_angle_input_box');
    planet_wars.fireSpeedBox=document.getElementById('planet_wars_speed_input_box');
    planet_wars.whosGoSpan=document.getElementById('planet_wars_whosego');
    planet_wars.fireFormSpan=document.getElementById('planet_wars_input_form');
    //new Render.viewport('planet_wars_canvas2',0,0,planet_wars.worldWidth,planet_wars.worldHeight,planet_wars.zoom,true);
    
    //create players
    for(var i=0;i<planet_wars.numberOfPlayers;i++)
    {
    	new planet_wars.player("Player "+(i+1),i);
    }
    
    planet_wars.fireAngleBox.value=0;
    planet_wars.fireSpeedBox.value=100;
    
    //set up physics engine for PW
    Physics.timeperloop=0.02;
    Physics.gravityY=0;
    Physics.friction=0;
    //reduce strength of charge (so we can deal with nice numbers)
    Physics.k=899;
    
    //create borders
    //left
    new Shapes.oldRectangle(true,false,[-planet_wars.worldWidth/4,planet_wars.worldHeight/2],planet_wars.worldWidth/2,planet_wars.worldHeight*2,50,0,[0,0,0],[0,0,0],true,true,false,false,0);
    //bottom
    new Shapes.oldRectangle(true,false,[planet_wars.worldWidth/2,planet_wars.worldHeight*1.25],planet_wars.worldWidth*2,planet_wars.worldHeight/2,50,0,[0,0,0],[0,0,0],true,true,false,false,0);
    //right
    new Shapes.oldRectangle(true,false,[planet_wars.worldWidth*1.25,planet_wars.worldHeight/2],planet_wars.worldWidth/2,planet_wars.worldHeight*2,50,0,[0,0,0],[0,0,0],true,true,false,false,0);
    //top
    new Shapes.oldRectangle(true,false,[planet_wars.worldWidth/2,-planet_wars.worldHeight/4],planet_wars.worldWidth*2,planet_wars.worldHeight/2,50,0,[0,0,0],[0,0,0],true,true,false,false,0);
  
    
    planet_wars.div.onmousedown = planet_wars.mouseDown;
    document.onmouseup   = planet_wars.mouseUp;
    document.onmousemove = planet_wars.getMouseXY;

	planet_wars.endGameContainerDiv=document.getElementById("endgame_display_container");
	planet_wars.endGameDiv=document.getElementById("endgame_display");
	
	
	
	
	
	planet_wars.ajaxLoop = new AjaxLoopClass('../ajax.php',1000);
	planet_wars.players = new PlayersClass(5,false,'users_main',false,false,false,false,false,planet_wars.ajaxLoop);
	//pre-game options and stuff like starting
	//planet_wars.preGame = new PreGameClass(planet_wars.ajaxLoop,true);
	planet_wars.userPrefs = new UserPrefsClass();
	chat = new ChatClass('chat_input_box_'+rand, 'chat_messages' ,planet_wars.ajaxLoop, planet_wars.userPrefs);
	sounds = new sounds('play');
	
	//planet_wars wants to know when each ajax request has finished
	planet_wars.ajaxLoop.letClassKnow(planet_wars);
	
	planet_wars.ajaxLoop.loadInitialAJAX(planet_wars.ajaxLoop.classesToLetKnow);
	
	
	planet_wars.actOnEvents();
	
	
	//might want to restore the following functionality for killing ajax at end of game sometime:
	//planet_wars.eventsRequestArrayPos=ajaxLoop.wantPeroidic.length;
	//request events every go
	planet_wars.ajaxLoop.wantRequest(planet_wars.requestEvents,1);
	
	//actOnJSON.loadIntialAjax();
}

// ----------------------- variables ----------------------- 

//array of events in-game
planet_wars.events=new Array();
//id of the last event used
planet_wars.lastEventId=0;
//position in planet_wars.events array of last even used
planet_wars.lastEvent=-1;
//last event got from server
planet_wars.lastAJAXEvent=0;
//current go id
planet_wars.goId=false;

//did a user just fire?
planet_wars.IJustFiredThisGo=false;

//currently running an event (eg a missile is flying)
planet_wars.inEvent=false;

//array of consequences
planet_wars.consequences=new Array();

//have we just refreshed and are miles behind?
planet_wars.catchingUp=false;

// ----------------------- class definitions -----------------------

planet_wars.consequence=function(goId,type,info,who)
{
	this.goId=goId;
	this.type=type;
	this.info=info;
	this.who=who;
	
	planet_wars.consequences.push(this);
}

// ----------------------- ajaxy functions ----------------------- 

//ajax has finished
planet_wars.JSON_parsed=function()
{
	planet_wars.actOnEvents();
}

planet_wars.requestEvents=function(thisJSON)
{
	//return '<data type="events_request"><lastIndex>'+planet_wars.lastXMLEvent+'</lastIndex></data>';	
	thisJSON.events_request=new Object();
	thisJSON.events_request.lastIndex=planet_wars.lastAJAXEvent;
}

planet_wars.sendConsequences=function(thisJSON)
{
	if(planet_wars.consequences.length==0)
	{
		return;
	}
	if(typeof(thisJSON.vote)=="undefined")
	{
		thisJSON.vote=new Object();
	}
	
	//thisJSON.vote.push(new Object());
	
	//var tempObj=new Object();
	
	var goId=planet_wars.consequences[planet_wars.consequences.length-1].goId;
	
	thisJSON.vote.goId=goId;
	
	//thisJSON.vote.consequences=planet_wars.consequences;
	thisJSON.vote.consequences=new Array();
		
	for(var i=0;i<planet_wars.consequences.length;i++)
	{
		if (planet_wars.consequences[i].type !== false && planet_wars.consequences[i].goId == goId)
		{
			thisJSON.vote.consequences.push(new Object());
			for (var c in planet_wars.consequences[i])
			{
				if (c !== "goId" && thisJSON.vote.consequences[thisJSON.vote.consequences.length - 1][c] !== false)
				{
					thisJSON.vote.consequences[thisJSON.vote.consequences.length - 1][c] = planet_wars.consequences[i][c];
				}
			}
		}
	}
		
	
	//sent off consequences, clear them.
	planet_wars.consequences=new Array();
	
	//thisJSON.vote=tempObj;
}

planet_wars.physicsLoopMe = function()
{
	var thisMany = planet_wars.catchingUp ? planet_wars.catchingUpRate : 1;
	
	for(var i=0;i<thisMany;i++)
	{
		Physics.replotentities();
		var vp=(Render.viewports.length>2) ? 2 : 0;
//		vp=0;
		Render.drawMissile(vp);
	}

	
}

//run through events array

planet_wars.actOnEvents=function()
{
	if(!planet_wars.inEvent && ( ( planet_wars.lastEvent==-1 && planet_wars.events.length > 0) || planet_wars.lastAJAXEvent > planet_wars.lastEventId))//planet_wars.lastEvent < planet_wars.events.length-1)
	{
		planet_wars.lastEvent++;
		if(planet_wars.lastEvent < planet_wars.events.length - 2)
		{
			planet_wars.catchingUp=true;
			planet_wars.frameSkip=planet_wars.catchingUpRate;
		}
		else
		{
			planet_wars.catchingUp=false;
			planet_wars.frameSkip=planet_wars.defaultFrameSkip;
		}
		
		//not currently running an event, and still events yet to happen
		switch(planet_wars.events[planet_wars.lastEvent].type)
		{
			case 'go':
				//alert(planet_wars.IJustFiredThisGo)
				if(!planet_wars.IJustFiredThisGo)
				{
					planet_wars.inEvent=true;
					//this is not the last event in the table - therefore it's not the shot you've just fired
					planet_wars.fireMissile(planet_wars.idToNumber(planet_wars.events[planet_wars.lastEvent].userId),planet_wars.baringToRadian(parseFloat(planet_wars.events[planet_wars.lastEvent].properties.angle)),parseFloat(planet_wars.events[planet_wars.lastEvent].properties.velocity));
				}
				break;
			case 'goChange':
				planet_wars.IJustFiredThisGo=false;
				//.userId
				planet_wars.changeGo(planet_wars.events[planet_wars.lastEvent].newGoId,planet_wars.events[planet_wars.lastEvent].userId);
				//go chaning is instant, so check for more events after this
				//planet_wars.finishedEvent();
				break;
			case 'actions':
				//array of actions, with type and info.
				for(var i=0;i<planet_wars.events[planet_wars.lastEvent].action.length;i++)
				{
					switch(planet_wars.events[planet_wars.lastEvent].action[i].type)
					{
						case 'death':
							planet_wars.killPlayer(planet_wars.events[planet_wars.lastEvent].action[i].who);
							break;
					}
				}
			break;
			case 'endGame':
				//alert('game over!  nyer');
				planet_wars.endGameDiv.innerHTML=planet_wars.events[planet_wars.lastEvent].html;
				setTimeout(function(){planet_wars.endGameContainerDiv.style.display="block";},3000);
				
				//kill off events request
				//ajaxLoop.wantPeroidic.splice(planet_wars.eventsRequestArrayPos,1);
				break;
			}
			planet_wars.lastEventId=parseInt(planet_wars.events[planet_wars.lastEvent].id);
			
			if(planet_wars.catchingUp)
			{
				//plain recursion throws up an error I've never seen before and can't find anything about, so hack!
				setTimeout(planet_wars.actOnEvents,1);
			}
	}
}

planet_wars.finishedEvent=function()
{	
	planet_wars.lastEventId=planet_wars.events[planet_wars.lastEvent].id;
	planet_wars.actOnEvents();
}

//missile has hit a planet or another ship
Response.collideascircles=function(misslePhysics,circlePhysics)
{
	clearInterval(planet_wars.physicsLoop);
	
    if(circlePhysics.gameType!==false && planet_wars.objects[circlePhysics.gameType].type==1 && planet_wars.objects[circlePhysics.gameType].physics.alive)
    {
        //if the missile hit a ship
		new planet_wars.consequence(planet_wars.goId,'death',planet_wars.players[planet_wars.whosGo].refId,planet_wars.players[planet_wars.objects[circlePhysics.gameType].player].refId);
		
		var blackOutShip = function()
		{
			Render.drawShip(planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos, Render.colourToRGB(Render.colourToDark(planet_wars.players[planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].player].colour)), planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].graphic, 0, planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].angle);
		}
		
		//need these to black out the ship
		planet_wars.afterEndGoAnimationDo="killPlayer";
		planet_wars.afterEndGoAnimationInfo=[circlePhysics.gameType,planet_wars.whosGo];
		
		//if catching up, skip animation.
		if(!planet_wars.catchingUp)
		{
			//make the ship explode
			
			var tempPos=[(planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos[0]-Render.viewports[1].x)*Render.viewports[1].zoom , (planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos[1]-Render.viewports[1].y)*Render.viewports[1].zoom];
			planet_wars.endGoAnimation.MakeExplosion2(tempPos,planet_wars.shipRadius);
			//black out ship
			setTimeout(blackOutShip,150);
		}
		else
		{
			//catching up, skip animation
			blackOutShip();
			var tempColour=Render.colourToRGB(Render.colourToBright(planet_wars.players[planet_wars.afterEndGoAnimationInfo[1]].colour));
			Render.drawCross(planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos,tempColour,planet_wars.shipRadius*1.5,0);
			planet_wars.endShot();
		}
		
    }
	else
	{
		if (!planet_wars.catchingUp && circlePhysics.gameType !== false && planet_wars.objects[circlePhysics.gameType].type !== 2)
		{
			//not a black hole
			planet_wars.afterEndGoAnimationDo = "mushroomCloud";
			var r = circlePhysics.dimensions;
			var tempAngle = Math.atan2(misslePhysics.pos[1] - circlePhysics.pos[1], misslePhysics.pos[0] - circlePhysics.pos[0])
			//always have the mushroom cloud centred on the edge of the planet - the missile may stop a bit before that due to the awesomeness of the physics engine.
			var tempPos = [(circlePhysics.pos[0] + Math.cos(tempAngle) * r - Render.viewports[1].x) * Render.viewports[1].zoom, (circlePhysics.pos[1] + Math.sin(tempAngle) * r - Render.viewports[1].y) * Render.viewports[1].zoom];
			planet_wars.endGoAnimation.MakeMushroomCloud(tempPos, r / 2, tempAngle, 20, (planet_wars.graphicsLevel < 2))
		}
		else
		{
			//no animation, just end the shot
			planet_wars.endShot();
		}
		
		//no ship hit atm no consequences, send a blank consequence (type==false), sp that the correct goId has no consequenes sent off to xml
		new planet_wars.consequence(planet_wars.goId,false,false,false);
	}
	
	//let server know of consequences
	planet_wars.ajaxLoop.wantRequest(planet_wars.sendConsequences,0);
    misslePhysics.kill();
    //planet_wars.endShot();
}

//missile has hit a border
Response.collideassquares=function(missilePhysics,borderPhysics)
{
	clearInterval(planet_wars.physicsLoop);
	planet_wars.inEvent=false;
	new planet_wars.consequence(planet_wars.goId,false,false,false);
	//let server know of consequences
	planet_wars.ajaxLoop.wantRequest(planet_wars.sendConsequences,0);
    missilePhysics.kill();
    planet_wars.endShot();
}

//turn a player's name into their position in the players array
planet_wars.nameToNumber=function(playerName)
{
	for (var i = 0; i < planet_wars.players.length; i++)
	{
		if (planet_wars.players[i].name == playerName)
		{
			return i;
		}
	}
	return false;
}

planet_wars.idToNumber=function(refId)
{
	for (var i = 0; i < planet_wars.players.length; i++)
	{
		if (planet_wars.players[i].refId == refId)
		{
			return i;
		}
	}
	return false;
}

planet_wars.changeGo=function(newGoId,refId)
{
	planet_wars.goId=newGoId;
	
	planet_wars.whosGo=planet_wars.idToNumber(refId);
	if(planet_wars.whosGo===false)
	{
		alert("FATAL ERROR: tried to change go to a player without a ship!")
	}
	
  	if(refId==userId && planet_wars.lastEvent == planet_wars.events.length-1)
	{
		//if the player whos go it is is in fact us AND we can fire
		//set up detection of typing in box
		planet_wars.aimLoop=setInterval(planet_wars.aimLoopMe , 25);
		
		planet_wars.fireFormSpan.style.visibility='visible';
		
		Render.drawAim();
		
		//set up aiming inputs, either to last shot, or iuf there was no last shot, then to defaults.
		if(planet_wars.players[planet_wars.whosGo].goes.length > 0)
	 	{
			planet_wars.fireAngleBox.value=roundNumber(planet_wars.radianToBaring(planet_wars.players[planet_wars.whosGo].goes[planet_wars.players[planet_wars.whosGo].goes.length-1][0]),planet_wars.roundFireStuffTo);
			planet_wars.fireSpeedBox.value=roundNumber(planet_wars.players[planet_wars.whosGo].goes[planet_wars.players[planet_wars.whosGo].goes.length-1][1],planet_wars.roundFireStuffTo);
		}
		else
		{
			planet_wars.fireAngleBox.value=0;
			planet_wars.fireSpeedBox.value=100;
		}
	}
	
  
 	
	planet_wars.santiseFireBox(false);

	planet_wars.updateWhosGo();

}

planet_wars.ourGo=function()
{
	return (planet_wars.lastEvent == planet_wars.events.length-1 && userId==planet_wars.players[planet_wars.whosGo].name);
}

//an animation has finished, what do we do?
planet_wars.finishEndGoAnimation=function()
{
	switch(planet_wars.afterEndGoAnimationDo)
	{
		case 'killPlayer':
			//just finished explosion of player			
			//planet_wars.afterEndGoAnimationInfo = [dead ship object arraypos, player who killed them's arraypos]

			var tempPos=[(planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos[0]-Render.viewports[1].x)*Render.viewports[1].zoom , (planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos[1]-Render.viewports[1].y)*Render.viewports[1].zoom];
			var tempColour=Render.colourToRGB(Render.colourToBright(planet_wars.players[planet_wars.afterEndGoAnimationInfo[1]].colour));
			planet_wars.endGoAnimation.MakeDrawCross(tempPos,planet_wars.shipRadius*1.5,10,tempColour);
			
			planet_wars.afterEndGoAnimationDo='killPlayer2';
			break;
		case 'killPlayer2':
		
			var tempPos=[(planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos[0]-Render.viewports[1].x)*Render.viewports[1].zoom , (planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos[1]-Render.viewports[1].y)*Render.viewports[1].zoom];
			
			var tempColour=Render.colourToRGB(Render.colourToBright(planet_wars.players[planet_wars.afterEndGoAnimationInfo[1]].colour));
			
			Render.drawCross(planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos,tempColour,planet_wars.shipRadius*1.5,0);
		
			planet_wars.endShot();
			planet_wars.afterEndGoAnimationDo=false;
			
			if (planet_wars.ourGo())
			{
				//if our go, draw the aim doobree
				//Render.drawAim();
			}
			
			break;
		case 'mushroomCloud':
			planet_wars.endShot();
			planet_wars.afterEndGoAnimationDo=false;
			
			
			if (planet_wars.ourGo())
			{
				//if our go, draw the aim doobree
				//Render.drawAim();
			}
			break;
	}
}


//missile has hit something
planet_wars.endShot=function()
{
	planet_wars.inEvent=false;
	//kill physics loop - now killed on collision
	//clearInterval(planet_wars.physicsLoop);
	//clear missile blob from top canvas
	Render.viewports[1].canvas.clearRect(0,0,Render.viewports[1].width,Render.viewports[1].height);
	
	planet_wars.missileFlying=false;
	
	//planet_wars.changeGo();
	planet_wars.actOnEvents();
}

//angle in radians!
planet_wars.fireMissile=function(player,angle,speed)
{
	planet_wars.missileFlying=true;
	
	var multiplier=planet_wars.catchingUp ? 0.25 : 1;
	
	planet_wars.physicsLoop=setInterval(planet_wars.physicsLoopMe,Physics.refreshrate*multiplier);

	//set which missile is currently flying
	planet_wars.liveMissile=planet_wars.objects.length;
	new planet_wars.missile(player,angle,speed);
	//planet_wars.players[player].goes.push([parseFloat(planet_wars.fireAngleBox.value),parseFloat(planet_wars.fireSpeedBox.value)]);

	planet_wars.fireFormSpan.style.visibility = 'hidden';
	if (planet_wars.players[player].refId == userId && !planet_wars.catchingUp)
	{
		planet_wars.whosGoSpan.innerHTML = 'Missile Flying!';
		planet_wars.whosGoSpan.style.color = '#000';
	}
	
	//draw a smoke puff from the ship
	if(planet_wars.graphicsLevel > 1 && !planet_wars.catchingUp)
	{
		var tempPos=[(planet_wars.objects[planet_wars.players[player].ship].pos[0]+Math.cos(angle)*planet_wars.shipRadius-Render.viewports[1].x)*Render.viewports[1].zoom , (planet_wars.objects[planet_wars.players[player].ship].pos[1]+Math.sin(angle)*planet_wars.shipRadius-Render.viewports[1].y)*Render.viewports[1].zoom];
		planet_wars.anyTimeAnimation.MakeSmokePuff(tempPos,angle,planet_wars.shipRadius/2,10);
	}
}

planet_wars.submitFireBox=function()
{
//	alert(planet_wars.fireAngleBox.value)
	planet_wars.santiseFireBox(false);
	
	//angles as barings, 0=up, 90=right, clockwise.
	var tempAngle=planet_wars.baringToRadian(planet_wars.fireAngleBox.value);
	var tempSpeed=planet_wars.humanSpeedToReal(planet_wars.fireSpeedBox.value);
	var tempAngleBox=parseFloat(planet_wars.fireAngleBox.value);
	var tempSpeedBox=parseFloat(planet_wars.fireSpeedBox.value);
  
	clearInterval(planet_wars.aimLoop);

	planet_wars.fireMissile(planet_wars.whosGo,tempAngle,tempSpeed);
	
	var tempWhosGo=planet_wars.whosGo;
	var tempGoId=planet_wars.goId
	
	planet_wars.IJustFiredThisGo=true
	
	//send this go to server
	//new ajaxLoop.wantRequest(function(){return '<data type="go"><go id="'+tempGoId+'"><properties><angle>'+tempAngleBox+'</angle><velocity>'+tempSpeedBox+'</velocity></properties></go></data>';},0);
	//new ajaxLoop.wantRequest(function(thisJSON){thisJSON.go=new Object();thisJSON.go.goId=tempGoId;thisJSON.go.properties=new Object();thisJSON.go.properties.angle=tempAngleBox;thisJSON.go.properties.velocity=tempSpeedBox;},0);
	planet_wars.ajaxLoop.wantRequest(function(thisJSON){thisJSON.go=new Object();thisJSON.go.goId=tempGoId;thisJSON.go.properties=new Object();thisJSON.go.properties.angle=tempAngleBox;thisJSON.go.properties.velocity=tempSpeedBox;},0);
//	alert('<data type="go"><go id="'+tempGoId+'"><properties><angle>'+tempAngleBox+'</angle><velocity>'+tempSpeedBox+'</velocity></properties></go></data>');
	
}

myAddEvent(window, 'onload', planet_wars.load);