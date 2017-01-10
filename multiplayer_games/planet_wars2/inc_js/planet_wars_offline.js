// offline version of planet wars - extends planet_wars.js

//FEATURES WANTED - delete all in editor
//save and load maps
//tournament / best of 3 system
//re-play map / carry on playing options

planet_wars.editorBigCanvasId="planet_wars_canvas2";


//score tally for tournament


planet_wars.load2=function()
{
    
    planet_wars.fireAngleBox=document.getElementById('planet_wars_angle_input_box');
    planet_wars.fireSpeedBox=document.getElementById('planet_wars_speed_input_box');
    planet_wars.whosGoSpan=document.getElementById('planet_wars_whosgo');
	planet_wars.fireFormSpan=document.getElementById('planet_wars_input_form');

	planet_wars.whoWonSpan=document.getElementById('planet_wars_who_won');
	
	//planet_wars.midGameOptionsDiv=document.getElementById('planet_wars_mid_game_options');
	//input player names for a tournament
	//planet_wars.namesDiv=document.getElementById("planet_wars_names_div");
	
	//div which holds the scores for a tournament
	planet_wars.matchScoreDiv=document.getElementById("planet_wars_match_scores");
	
	planet_wars.menus['preGame']=new planet_wars.menu('planet_wars_pregame');
	planet_wars.menus['midGame']=new planet_wars.menu('planet_wars_mid_game');
	planet_wars.menus['endGame']=new planet_wars.menu('planet_wars_end_game');
	planet_wars.menus['midGameOptions']=new planet_wars.menu('planet_wars_mid_game_options');
	planet_wars.menus['names']=new planet_wars.menu('planet_wars_names_div',planet_wars.openNames);
	planet_wars.menus['scores']=new planet_wars.menu(planet_wars.matchScoreDiv);
	planet_wars.menus['midMatch']=new planet_wars.menu('planet_wars_mid_match');
	planet_wars.menus['nextRound']=new planet_wars.menu('planet_wars_next_round');
	
	
	
	
	// ------------ also fire up editor -----
	
	//full sized canvas for editing the map
    planet_wars.editorCanvasTag=document.getElementById(planet_wars.editorBigCanvasId);
	
	planet_wars.editorWarningDiv=document.getElementById("planet_wars_editor_impossible_warning");
	
    //planet_wars.editor = document.getElementById('planet_wars_editor');
    //planet_wars.editor_container = document.getElementById('planet_wars_editor_container');
    
	//planet_wars.canvasTag2.onmousedown=planet_wars.editorMouseDown;
	planet_wars.canvasTag2.onmousedown=planet_wars.offlineMouseDown;
	
	document.onmouseup   = planet_wars.offlineMouseUp;
    document.onmousemove = planet_wars.getMouseXY;
	
	// ------------------------------------------
	
	/*
	//create players
    for(var i=0;i<planet_wars.numberOfPlayers;i++)
    {
    new planet_wars.player("Player "+(i+1),i);
    }
    
    
    
    planet_wars.generateMap(2+planet_wars.numberOfPlayers*2,planet_wars.numberOfPlayers,0,1,1,0);
    
    
    Render.renderViewport(0);
	*/
	//planet_wars.startGame();
	
	planet_wars.newMap();
}

//an animation has finished, what do we do?
planet_wars.finishEndGoAnimation=function()
{
	switch(planet_wars.afterEndGoAnimationDo)
	{
		case 'killPlayer':
			
			//planet_wars.afterEndGoAnimationInfo = [dead ship object arraypos, player who killed them's arraypos]
			
			//just finished explosion of player
			planet_wars.killPlayer(planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].player);
			
			planet_wars.afterEndGoAnimationDo='killPlayer2';
			
			var tempPos=[(planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos[0]-Render.viewports[1].x)*Render.viewports[1].zoom , (planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos[1]-Render.viewports[1].y)*Render.viewports[1].zoom];
			
			var tempColour=Render.colourToRGB(planet_wars.players[planet_wars.afterEndGoAnimationInfo[1]].colour);
						
			planet_wars.endGoAnimation.MakeDrawCross(tempPos,planet_wars.shipRadius*1.5,10,tempColour);
			
			break;
		case 'killPlayer2':
		
			var tempPos=[(planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos[0]-Render.viewports[1].x)*Render.viewports[1].zoom , (planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos[1]-Render.viewports[1].y)*Render.viewports[1].zoom];
			
			var tempColour=Render.colourToRGB(planet_wars.players[planet_wars.afterEndGoAnimationInfo[1]].colour);
			
			Render.drawCross(planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos,tempColour,planet_wars.shipRadius*1.5,2);
		
			planet_wars.endShot();
			planet_wars.afterEndGoAnimationDo=false;
			break;
		case 'endGo':
			planet_wars.endShot();
			break;
	}
}

planet_wars.offlineMouseDown=function()
{
	planet_wars.mouseDown();
	if (planet_wars.editorOpen) 
	{
		planet_wars.editorMouseDown();
	}
}

planet_wars.offlineMouseUp=function()
{
	planet_wars.mouseUp();
	if (planet_wars.editorOpen)
	{
		planet_wars.editorMouseUp();
	}
}

planet_wars.cleanUpMouse=function()
{
	//default + editor cleanUpMouse combined.  very very hacky, and I'm not too happy, but should work.
	planet_wars.divPos=[findPosX(planet_wars.div) , findPosY(planet_wars.div) ];
	
    //adjust mousepos to the simulation
    planet_wars.mouseX=(planet_wars.mouseX-planet_wars.divPos[0]-Render.viewports[0].x)*Render.viewports[0].zoom;
    planet_wars.mouseY=(planet_wars.mouseY-planet_wars.divPos[1]-Render.viewports[0].y)*Render.viewports[0].zoom;
	
	planet_wars.editorMousePos=[planet_wars.mouseX,planet_wars.mouseY];
}

planet_wars.menus=new Object();

planet_wars.menu=function(div,onOpen,onClose)
{
	if(typeof(div)=="string")
	{
		this.div=document.getElementById(div);
	}
	else
	{
		this.div=div;
	}
	if(typeof(onOpen)=="function")
	{
		this.onOpen=onOpen;		
	}else{
		this.onOpen=function(){}
	}

	if(typeof(onClose)=="function")
	{
		this.onClose=onClose;
	}else{
		this.onClose=function(){}
	}
	
	this.close=function()
	{
		this.div.style.display="none";
		this.onClose();
	}
	
	//closes everything except what's in keepOpen
	this.open=function(keepOpen)
	{
		if(typeof(keepOpen)=="undefined")
		{
			keepOpen=false
		}
		
		for(var i in planet_wars.menus)
		{
			if(keepOpen===false || !in_array(i,keepOpen))
			{
				planet_wars.menus[i].close();
			}
			else
			{
				//planet_wars.menus[i].div.style.display="block";
			}
		}
		this.div.style.display="block";
		this.onOpen();
	}
}


planet_wars.openNames=function()
{
	for(var i=0;i<planet_wars.maxPlayers;i++)
	{
		document.getElementById("planet_wars_names_form_player"+i).value=planet_wars.customPlayerNames[i];
		if(i< parseInt(document.getElementById("optionPlayers").value))
		{
			document.getElementById("planet_wars_names_list_player"+i).style.display="block";
		}
		else
		{
			document.getElementById("planet_wars_names_list_player"+i).style.display="none";
		}
	}
}

planet_wars.offlineCloseNameOptions=function()
{
	planet_wars.namesDiv.style.display="none";
}

planet_wars.savePlayerNames=function()
{
	planet_wars.customPlayerNames=new Array(planet_wars.maxPlayers);
	for (var i = 0; i < planet_wars.maxPlayers; i++)
	{
		planet_wars.customPlayerNames[i]=document.getElementById("planet_wars_names_form_player"+i).value;
	}
}

//leave the match - revert to the default page
planet_wars.abandonMatch=function()
{
	planet_wars.tournamentMode=false;
	planet_wars.offlineNewMatch();
}

planet_wars.nextRound=function()
{
	document.getElementById('optionPlayers').value=planet_wars.players.length;
	planet_wars.menus['nextRound'].open(['scores']);
	document.getElementById('planet_wars_options_form').submit();
}

planet_wars.offlineCloseEditor=function()
{
	planet_wars.closeEditor(0);
	if(planet_wars.tournamentMode)
	{
		planet_wars.menus['nextRound'].open(['scores']);
		planet_wars.editorAllowShipsEdited=true;
	}
	else
	{
		planet_wars.menus['preGame'].open();
	}
	
	Render.viewports[1].clear();
	
	var centres=planet_wars.findCentres();
    
	if(!planet_wars.checkMapPossible(centres[0] , centres[1] , centres[3] , centres[4]))
	{
		//some sort of warning to tell user map is probably impossible
	}
	
}

//generate new map before game starts
planet_wars.newMap=function()
{
	planet_wars.numberOfPlayers=parseInt(document.getElementById('optionPlayers').value);
	planet_wars.generateMap(3+planet_wars.numberOfPlayers,planet_wars.numberOfPlayers,1,1,1,0,1);
	Render.renderViewport(0);
	if(Render.viewports.length>2)
	{
		Render.viewports[2].clear();
	}
}

planet_wars.offlineNewMatch=function()
{
	document.getElementById('planet_wars_options_form').submit();
	planet_wars.menus['preGame'].open();
	
}

//launch into a game
planet_wars.startGame=function()
{
	if(planet_wars.tournamentMode)
	{
		planet_wars.round++;
		planet_wars.updateScores();
	}
	//dealing with aftermath of tidyUpShips from map editor
	planet_wars.numberOfPlayers=planet_wars.players.length;
	
	for(var i=0;i<planet_wars.players.length;i++)
	{
		planet_wars.players[i].name=planet_wars.customPlayerNames[i];
	}
	
	planet_wars.whosGo=Math.floor(Math.random()*planet_wars.numberOfPlayers);
	
	var keepScores=planet_wars.tournamentMode ? ['scores'] : [];
	
	planet_wars.menus['midGame'].open(keepScores);
	
    planet_wars.fireAngleBox.value=0;
    planet_wars.fireSpeedBox.value=100;

    //start stuff
    planet_wars.changeGo();
	
	planet_wars.reBuildPhysics();
}

planet_wars.startMatch=function(rounds)
{
	planet_wars.rounds=rounds;
	planet_wars.round=0;
	planet_wars.tournamentMode=true;
	
	planet_wars.scores=new Array();
	
	for(var i=0;i<planet_wars.players.length;i++)
	{
		planet_wars.scores[i]=0;
	}
	
	planet_wars.menus['scores'].open();
	
	planet_wars.startGame();
	
	planet_wars.updateScores();
	
}

planet_wars.updateScores=function(endOf)
{
	var endOfText=endOf ? "End Of " : "";
	var tempHTML="<b>"+endOfText+"Round "+planet_wars.round+"</b><br><ul>";
	
	for(var i=0;i<planet_wars.players.length;i++)
	{
		tempHTML+="<li style='color:#"+planet_wars.players[i].colour+";'>"+planet_wars.customPlayerNames[i]+": "+planet_wars.scores[i]+"</li>";
	}
	tempHTML+="</ul>";
	
	planet_wars.matchScoreDiv.innerHTML=tempHTML;
}

planet_wars.fireMissile=function(player,angle,speed,missileType)
{
    planet_wars.missileFlying=true;
    
    planet_wars.physicsLoop=setInterval(planet_wars.physicsLoopMe,Physics.refreshrate);
    
    //set which missile is currently flying
    planet_wars.liveMissile=planet_wars.objects.length;
    
    new planet_wars.missile(player,angle,speed,missileType);
    //planet_wars.players[player].goes.push([parseFloat(planet_wars.fireAngleBox.value),parseFloat(planet_wars.fireSpeedBox.value)]);
    
    planet_wars.fireFormSpan.style.visibility='hidden';
	

}

/*
Physics.noCollisionOccured=function()
{
	if(planet_wars.missileNearBlackHole)
	{
		planet_wars.missileNearBlackHole=false;
		Physics.timeperloop=0.02;
		Physics.friction=0;
		//alert('left');
	}
}
*/

planet_wars.mushroomAfterShot=function(misslePhysics,circlePhysics)
{
	//not a black hole - shroom animation
	planet_wars.afterEndGoAnimationDo = "endGo";
	var r = circlePhysics.dimensions;
	var tempAngle = Math.atan2(misslePhysics.pos[1] - circlePhysics.pos[1], misslePhysics.pos[0] - circlePhysics.pos[0]);
	//always have the mushroom cloud centred on the edge of the planet - the missile may stop a bit before that due to the awesomeness of the physics engine.
	var tempPos = [(circlePhysics.pos[0] + Math.cos(tempAngle) * r - Render.viewports[1].x) * Render.viewports[1].zoom, (circlePhysics.pos[1] + Math.sin(tempAngle) * r - Render.viewports[1].y) * Render.viewports[1].zoom];
	planet_wars.endGoAnimation.MakeMushroomCloud(tempPos, r / 2, tempAngle, 20, planet_wars.simple);
}

//missile has hit a planet or another ship
Response.collideascircles=function(misslePhysics,circlePhysics)
{
	
	misslePhysics.kill();
	//kill physics loop
	clearInterval(planet_wars.physicsLoop);
	planet_wars.gameDoing="endShotAnimation";
	
	switch(planet_wars.objects[circlePhysics.gameType].type)
	{
		case 1:
			//ship
			if(planet_wars.players[planet_wars.objects[circlePhysics.gameType].player].alive)
			{
				//ship is alive!
				var blackOutShip = function()
				{
					Render.drawShip(planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos, Render.colourToRGB(Render.colourToDark(planet_wars.players[planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].player].colour)), planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].graphic, 0, planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].angle);
				}
				
				planet_wars.afterEndGoAnimationDo="killPlayer";
				planet_wars.afterEndGoAnimationInfo=[circlePhysics.gameType,planet_wars.whosGo];
				
				
				if(planet_wars.graphicsLevel>2)
				{
					//make the ship explode
					var tempPos=[(planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos[0]-Render.viewports[1].x)*Render.viewports[1].zoom , (planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos[1]-Render.viewports[1].y)*Render.viewports[1].zoom];
					planet_wars.endGoAnimation.MakeExplosion2(tempPos,planet_wars.shipRadius);
					//black out ship
					setTimeout(blackOutShip,150);
				}
				else
				{
					//if low settings, skip animation.
					planet_wars.killPlayer(planet_wars.objects[circlePhysics.gameType].player);
					blackOutShip();
					Render.drawCross(planet_wars.objects[planet_wars.afterEndGoAnimationInfo[0]].pos,Render.colourToRGB(planet_wars.players[planet_wars.whosGo].colour),planet_wars.shipRadius*1.5,2);
					planet_wars.endShot();
				}
				
			}
			else
			{
				//not alive shroom!
				planet_wars.mushroomAfterShot(misslePhysics,circlePhysics);
			}
			break;
		case 0:
		case 3:
			//planet or space station
			
			if(planet_wars.objects[misslePhysics.gameType].missileType===0)
			{
				//red matter missile and hit a planet or space station
				if(planet_wars.graphicsLevel>0)
				{
					//simple animation, so even IE can handle it (although it gets the shading wrong)
					planet_wars.afterEndGoAnimationDo="endGo";
				
					var tempPos=[(planet_wars.objects[circlePhysics.gameType].pos[0]-Render.viewports[1].x)*Render.viewports[1].zoom , (planet_wars.objects[circlePhysics.gameType].pos[1]-Render.viewports[1].y)*Render.viewports[1].zoom]
					
					planet_wars.endGoAnimation.MakePlanetImplode(tempPos,planet_wars.objects[circlePhysics.gameType].r*Render.viewports[1].zoom,planet_wars.endGoAnimation)
					setTimeout(function(){planet_wars.turnIntoBlackHole(circlePhysics.gameType);},500);
				}
				else
				{
					planet_wars.turnIntoBlackHole(circlePhysics.gameType);
					planet_wars.endShot();
				}
			}
			else
			{
				//just hit a planet or black hole
				if(planet_wars.graphicsLevel > 2)
				{
					//if graphics, shroom cloud!
					planet_wars.mushroomAfterShot(misslePhysics,circlePhysics);
				}
				else
				{
					//no graphics, just end
					planet_wars.endShot();
				}
			}
			
			break;
		default:
			//black holes, anything else
			planet_wars.endShot();
			break;
	}
}

//missile has hit a border
Response.collideassquares=function(missilePhysics,squarePhysics)
{
	
	if(squarePhysics.gameType!==false  && planet_wars.objects[squarePhysics.gameType].type==6)
	{
		//hit a powerup!
		planet_wars.objects[squarePhysics.gameType].use(missilePhysics);
		
		/*
		Response.newvx=missilePhysics.v[0];
		Response.newvy=missilePhysics.v[1];
		Response.newx=missilePhysics.pos[0];
		Response.newy=missilePhysics.pos[1];
		*/
	}
	else
	{
		missilePhysics.kill();
		clearInterval(planet_wars.physicsLoop);
    	planet_wars.endShot();
	}
}

planet_wars.changeGo=function(first)
{
//change go
	
	planet_wars.gameDoing="aiming";
	
	//don't go to someone who is dead
	do {
		planet_wars.whosGo++;
		planet_wars.whosGo %= planet_wars.numberOfPlayers;
	}
	while (!planet_wars.players[planet_wars.whosGo].alive)
	
	//set up detection of typing in box
	planet_wars.aimLoop=setInterval(planet_wars.aimLoopMe , 50);
	
	if(planet_wars.players[planet_wars.whosGo].goes.length > 0)
	{
		planet_wars.fireAngleBox.value=roundNumber(planet_wars.radianToBaring(planet_wars.players[planet_wars.whosGo].goes[planet_wars.players[planet_wars.whosGo].goes.length-1][0]),planet_wars.roundFireStuffTo);
		planet_wars.fireSpeedBox.value=roundNumber(planet_wars.players[planet_wars.whosGo].goes[planet_wars.players[planet_wars.whosGo].goes.length-1][1],planet_wars.roundFireStuffTo);
	}
	else
	{
		//planet_wars.fireAngleBox.value=0;
		planet_wars.fireAngleBox.value=roundNumber(planet_wars.radianToBaring(planet_wars.objects[planet_wars.players[planet_wars.whosGo].ship].angle));
		planet_wars.fireSpeedBox.value=100;
	}
	planet_wars.santiseFireBox(false);
	planet_wars.fireFormSpan.style.visibility='visible';
	planet_wars.updateWhosGo();
	Render.drawAim();
	//black out ship
	//Render.drawShip(planet_wars.objects[planet_wars.players[planet_wars.whosGo].ship].pos,"rgb(0,0,0)",false,0,0)
	
	//whether to randomly send off a little animation in the background
	planet_wars.chanceOfRobot();
	
	//get powerups for this go running
	planet_wars.runPowerups();
	//get missile selectyions for this player up
	planet_wars.sortArsenal();
}

//missile has hit something
planet_wars.endShot=function()
{
	//clear missile blob from top canvas
	//Render.viewports[1].canvas.clearRect(0,0,Render.viewports[1].width,Render.viewports[1].height);
	
	planet_wars.gameDoing="waiting";
	
	planet_wars.missileFlying=false;
	
	
	var alive=0;
	var winner=false;
	for(var i=0;i<planet_wars.players.length;i++)
	{
		if(planet_wars.players[i].alive)
		{
			alive++;
			winner=i;
		}
	}
	
	if(alive == 1)
	{
		//only one person left - end game!
		planet_wars.endGame(winner);
	}
	else
	{
		planet_wars.fireFormSpan.style.visibility='visible';
		planet_wars.changeGo();
	}

}

planet_wars.endGame=function(winner)
{
	planet_wars.gameDoing="notInGame";
	//winner==false for stalemate, int for that player's win
	clearInterval(planet_wars.aimLoop);
	
	
	//black out ship and re-draw it at the new angle
	/*if(planet_wars.graphicsLevel>1)
	{
		Render.drawShip(planet_wars.objects[planet_wars.players[planet_wars.whosGo].ship].pos,"rgb(0,0,0)",false,0,0);
		Render.drawShip(planet_wars.objects[planet_wars.players[planet_wars.whosGo].ship].pos,Render.colourToRGB(planet_wars.players[planet_wars.whosGo].colour),planet_wars.objects[planet_wars.players[planet_wars.whosGo].ship].graphic,0,planet_wars.objects[planet_wars.players[planet_wars.whosGo].ship].angle);
	}
	*/
	
	Render.viewports[1].clear();
	
	var roundOrGame="Game"
	
	if(planet_wars.tournamentMode)
	{
		if(winner!==false)
		{
			planet_wars.scores[winner]++;			
		}

		
		//planet_wars.offlineCloseMidGame();
		planet_wars.updateScores(true);
		
		if(winner !==false && planet_wars.scores[winner]>=planet_wars.rounds)
		{
			//match over
			planet_wars.menus['endGame'].open(['scores']);
			roundOrGame="Match";
			planet_wars.tournamentMode=false;
		}
		else
		{
			//round over
			planet_wars.menus['midMatch'].open(['scores']);
			roundOrGame="Round";
		}

	}
	else
	{
		planet_wars.menus['endGame'].open();
	}
	
	
	
	if(typeof(winner)=="boolean")
	{
		planet_wars.whoWonSpan.innerHTML=roundOrGame+" over, stalemate";
		
	}
	else
	{
		planet_wars.whoWonSpan.innerHTML=roundOrGame+" over, "+planet_wars.players[winner].name+" wins!";
		planet_wars.whoWonSpan.style.color="#"+planet_wars.players[winner].colour
	}
}

planet_wars.submitFireBox=function()
{
	
	planet_wars.gameDoing="missileFlying";
	
	if(parseFloat(planet_wars.fireAngleBox.value) > 9000 || parseFloat(planet_wars.fireSpeedBox.value) > 9000 )
	{
		var tempPos=[findPosX(planet_wars.canvasTag)+planet_wars.divWidth*0.2,planet_wars.divHeight*0.7+findPosY(planet_wars.canvasTag)];
		planet_wars.anyTimeAnimation.MakeTextFadeUp(tempPos,[tempPos[0],tempPos[1]-planet_wars.divHeight/2],1,0,"IT'S OVER 9000!!",planet_wars.divHeight*0.1,"#40FF40",30)
	}
	
	planet_wars.santiseFireBox(false);
	
	//angles as barings, 0=up, 90=right, clockwise.
	var tempAngle=planet_wars.baringToRadian(planet_wars.fireAngleBox.value);
	var tempSpeed=planet_wars.humanSpeedToReal(planet_wars.fireSpeedBox.value);
	
	clearInterval(planet_wars.aimLoop);
	
	var missileType=parseInt(planet_wars.missileSelect.value);
	
	if(missileType==0)
	{
		missileType=false;
	}
	else
	{
		missileType--;
	}
	
	planet_wars.fireMissile(planet_wars.whosGo,tempAngle,tempSpeed,missileType);
	
	
	
	//draw a smoke puff from the ship
	if(planet_wars.graphicsLevel > 1)
	{
		var tempPos=[(planet_wars.objects[planet_wars.players[planet_wars.whosGo].ship].pos[0]+Math.cos(tempAngle)*planet_wars.shipRadius-Render.viewports[1].x)*Render.viewports[1].zoom , (planet_wars.objects[planet_wars.players[planet_wars.whosGo].ship].pos[1]+Math.sin(tempAngle)*planet_wars.shipRadius-Render.viewports[1].y)*Render.viewports[1].zoom];
		planet_wars.anyTimeAnimation.MakeSmokePuff(tempPos,tempAngle,planet_wars.shipRadius/2,10);
	}
	
  
}

myAddEvent(window, 'onload', planet_wars.load);