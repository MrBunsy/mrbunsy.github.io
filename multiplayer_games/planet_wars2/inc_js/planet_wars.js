var planet_wars = new Object();

/* define stuff */
// size of simulated world:
planet_wars.worldWidth = 800;
planet_wars.worldHeight = 800;
planet_wars.shipRadius = 10;
planet_wars.missileRadius = 1;
planet_wars.powerUpRadius = 15;
//size of missile as rendered
planet_wars.missileImageRadius = 3;
planet_wars.blackHoleRadius = 5;
planet_wars.numberOfShipGraphics = 1;
planet_wars.numberOfSpaceStationGraphics = 1;
planet_wars.numerOfPowerUps = 2;
planet_wars.numberOfExtraMissileTypes=1;

//how many dp to round angle and speed
planet_wars.roundFireStuffTo=4;

//planet_wars.useOldStylePlanets=false;
planet_wars.canUseRadialGrads=true;

planet_wars.maxPlayers = 4;

planet_wars.seed = randomInt();
planet_wars.debug = false;
planet_wars.IE = false;
planet_wars.chrome=navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
//planet_wars.simple=false;
//0=nothing fancy at ALL (lower than normal IE), 1=simple graphics, no trail (IE can handle this), 2=simple graphics + trail, 3=everything
planet_wars.graphicsLevel = 3;
//how many physics loops to draw a frame, 1=every loop, 2=every second, etc
planet_wars.frameSkip=1;
//used for increasing accuracy near a black hole
planet_wars.missileNearBlackHole=false;

//max simulated speed, to the user the max will always be 100
planet_wars.maxSpeed = 100;
//how much to multiply charge by
planet_wars.chargeMultiplier = 1;

planet_wars.blackHoleCharge = 30000;

planet_wars.liveMissile = false;
planet_wars.isMouseDown = false;

planet_wars.oldFireBox = [0, 100];
planet_wars.fireBox = [0, 100];

//array of minRs and maxRs [avg size num][minR,maxR]
planet_wars.planetSizes = [[20, 50], [40, 55], [80, 200], [20, 200]];

planet_wars.minPlanetR = 10;

//how many times the radius the green line comes into play
planet_wars.spaceStationLineRatio = 4;

/* player stuff */
//how many players
planet_wars.numberOfPlayers = 3;
planet_wars.missileFlying = false;
//list of players
planet_wars.players = new Array();
//list of ship spawn locations
planet_wars.shipRegions = new Array();

//minimum distance a ship must be from the edge of a map.
planet_wars.minEdgeDistance = 50;

planet_wars.whosGo = Math.floor(Math.random() * planet_wars.numberOfPlayers);

planet_wars.playerColours = ["ff0000", "00ff00", "ffff00", "0000ff"];
//custom player names!
planet_wars.customPlayerNames = ["Player 1", "Player 2", "Player 3", "Player 4"];


// planet_wars.objectsJSONname[object.type] == name required by json
planet_wars.objectsJSONname = ["planet", "ship", "black_hole", "space_station", "", "worm_hole", "powerup"];

//list of game objects (planets,ships,etc)
planet_wars.objects = new Array();

//are we playing a best of match?
planet_wars.tournamentMode=false;
planet_wars.rounds=false;
planet_wars.round=0;
planet_wars.scores=[0,0,0,0];

//ranked match?
planet_wars.ranked=false;

//for animation system, what happens when animation has finished?
planet_wars.afterEndGoAnimationDo = false;
planet_wars.afterEndGoAnimationInfo = false;

planet_wars.planetImages = new Array();

planet_wars.planetImages.push(new Image());
planet_wars.planetImages[0].src = "inc_images/blue_planet.png";

planet_wars.planetImages.push(new Image());
planet_wars.planetImages[1].src = "inc_images/brown_planet.png";

planet_wars.usePlanetImages = false;

//planet_wars.planetImages.push(new Image());
//planet_wars.planetImages[2].src="inc_images/yellow_planet.png";

//----------powerup stuff-----------------

//colours of different powerups
planet_wars.powerupColours=["FF8800","00FF00"];
//do the boxes say what's in them before you hit them?
planet_wars.anonymousPowerups=false;
//if a ship has a shield or is heavy, what is the charge simulated?
//3000 is too strong, with no other gravity ship is impossible to hit
//1000 is too weak - barely any effect
//2000 seems to be nice balance, can be killed by a straight on hit but deflects most
planet_wars.shipCharge=2000;
//list of active powerups
planet_wars.activePowerups=new Array();
//how many stages to text animation?
planet_wars.powerupTextStages=50;
//planet_wars.redMatterActive=false;


//what's currently happening?
//"notInGame", "waiting", "aiming", "missileFlying", "endShotAnimation"
planet_wars.gameDoing = "notInGame";

/* on loading: */

planet_wars.load = function()
{
	if (planet_wars.IE) 
	{
		planet_wars.graphicsLevel = 1;
	}
	
	//hopefully temporry work around:
	if(planet_wars.chrome || planet_wars.IE)
	{
		planet_wars.canUseRadialGrads=false;
		
	}
	
	planet_wars.div = document.getElementById('planet_wars_div');
	
	//get width and height of div (should be 4:3)
	planet_wars.divWidth = parseInt(planet_wars.div.style.width);
	planet_wars.divHeight = parseInt(planet_wars.div.style.height);
	planet_wars.canvasTag = document.getElementById('planet_wars_canvas1');
	planet_wars.missileSelect = document.getElementById("planet_wars_choose_missile_box");
	planet_wars.missileSelectSpan = document.getElementById("planet_wars_choose_missile_span");
	
	//adjust height of simulated world to ratio of div - this might be a bad idea?
	planet_wars.worldHeight = planet_wars.worldWidth * (planet_wars.divHeight / planet_wars.divWidth);
	
	planet_wars.zoom = planet_wars.divWidth / planet_wars.worldWidth;
	
	//set up canvas as a 2D engine viewport
	new Render.viewport('planet_wars_canvas1', 0, 0, planet_wars.divWidth, planet_wars.divHeight, planet_wars.zoom, true);
	
	//set up physics engine for PW
	Physics.timeperloop = 0.02;
	Physics.gravityY = 0;
	Physics.friction = 0;
	//reduce strength of charge (so we can deal with nice numbers)
	Physics.k = 899;
	
	Physics.maxDistPerLoop=20;
	
	Physics.collisionPositionStuff=false;
	
	//create borders
	//left
	new Shapes.oldRectangle(true, false, [-planet_wars.worldWidth / 4, planet_wars.worldHeight / 2], planet_wars.worldWidth / 2, planet_wars.worldHeight * 2, 50, 0, [0, 0, 0], [0, 0, 0], true, true, false, false, 0);
	//bottom
	new Shapes.oldRectangle(true, false, [planet_wars.worldWidth / 2, planet_wars.worldHeight * 1.25], planet_wars.worldWidth * 2, planet_wars.worldHeight / 2, 50, 0, [0, 0, 0], [0, 0, 0], true, true, false, false, 0);
	//right
	new Shapes.oldRectangle(true, false, [planet_wars.worldWidth * 1.25, planet_wars.worldHeight / 2], planet_wars.worldWidth / 2, planet_wars.worldHeight * 2, 50, 0, [0, 0, 0], [0, 0, 0], true, true, false, false, 0);
	//top
	new Shapes.oldRectangle(true, false, [planet_wars.worldWidth / 2, -planet_wars.worldHeight / 4], planet_wars.worldWidth * 2, planet_wars.worldHeight / 2, 50, 0, [0, 0, 0], [0, 0, 0], true, true, false, false, 0);
	
	//planet_wars.generateMap(2+planet_wars.numberOfPlayers*2,planet_wars.numberOfPlayers,1,1,1,0);
	
	
	
	if (document.getElementById('planet_wars_canvas2') !== null) 
	{
		planet_wars.canvasTag2 = document.getElementById('planet_wars_canvas2');
		
		
		var canvasTag2Width = parseInt(planet_wars.canvasTag2.width);
		var canvasTag2Height = parseInt(planet_wars.canvasTag2.height);
		
		planet_wars.canvasTag2.style.cursor = "pointer";
		planet_wars.canvasTag2.style.position = "absolute";
		
		var diffWidth = (canvasTag2Width - planet_wars.worldWidth) / 2;
		var diffHeight = (canvasTag2Width - planet_wars.worldWidth) / 2;
		
		planet_wars.canvasTag2.style.top = -diffHeight+"px";
		planet_wars.canvasTag2.style.left = -diffWidth+"px";
		
		new Render.viewport('planet_wars_canvas2', -diffWidth, -diffHeight, canvasTag2Width, canvasTag2Height, planet_wars.zoom, true);
	}
	
	if (document.getElementById('planet_wars_canvas3') !== null) 
	{
		//extra one just for missile trails
		planet_wars.canvasTag3 = document.getElementById('planet_wars_canvas3');
		var canvasTag3Width = parseInt(planet_wars.canvasTag3.width);
		var canvasTag3Height = parseInt(planet_wars.canvasTag3.height);
		
		diffWidth = (canvasTag3Width - planet_wars.worldWidth) / 2;
		diffHeight = (canvasTag3Width - planet_wars.worldWidth) / 2;
		
		planet_wars.canvasTag3.style.top = -diffHeight;
		planet_wars.canvasTag3.style.left = -diffWidth;
		
		new Render.viewport('planet_wars_canvas3', -diffWidth, -diffHeight, canvasTag3Width, canvasTag3Height, planet_wars.zoom, true);
	}
	
	
	planet_wars.load2();
	
	if (typeof(Animation) == "function") 
	{
		//animation class exists
		
		//animation which can be run at any time
		planet_wars.anyTimeAnimation = new Animation(planet_wars.anyTimeAnimationClearCanvas, planet_wars.anyTimeAnimationFinished, Render.viewports[1].canvas, false);
		
		//animations at end of a shot
		planet_wars.endGoAnimation = new Animation(Render.viewports[1].clear, planet_wars.finishEndGoAnimation, Render.viewports[1].canvas, true, function()
		{
			planet_wars.anyTimeAnimation.loop(planet_wars.anyTimeAnimation);
		});
		//aniations while missing is flying
		planet_wars.missileAnimation = new Animation(function()
		{
		}, function()
		{
		}, Render.viewports[1].canvas, false);
		
		planet_wars.missileDrawCount = 0;
		planet_wars.missileDrawAnimation = Math.floor(planet_wars.anyTimeAnimation.framePeriod / Physics.refreshrate);

	}
}

planet_wars.load2 = function()
{
	//re-defined depending on what the PW engine is being used for
}

/*  classes: */

//region of the map a ship can be spawned in,
planet_wars.shipRegion = function(pos, r)
{
	//[x,y]
	this.pos = pos;
	//max distance from pos
	this.r = r;
	planet_wars.shipRegions.push(this);
}

planet_wars.planetCharge = function(r)
{
	return 0.5 * Math.pow(r, 3) * planet_wars.chargeMultiplier;
}

planet_wars.activePowerUp=function(powerup_type,affects,goesLeft,alwaysActive,turnOn,turnOff)
{
	this.powerup_type=powerup_type;
	//who is it related to?
	this.affects=affects;
	//decremented by 1 each of affectee's go
	this.goesLeft=goesLeft;
	//start this on next go change? if false then will only start on affect's go
	this.alwaysActive=alwaysActive;
	
	//currently running?
	this.active=false;
	
	this.turnOn=turnOn;
	this.turnOff=turnOff;
	
	planet_wars.activePowerups.push(this);
}
/*
//sort of hook thing, these are created to control when powerups are turned on and off
planet_wars.powerupControl=function(affects,goesLeft,doThis)
{
	//who is it related to?
	this.affects=affects;
	//decremented by 1 each of affectee's go
	this.goesLeft=goesLeft;
	
	//function to run when goesLeft runs out
	this.doThis=doThis;
	
	planet_wars.activePowerups.push(this);
}*/
/* game object types:
 0 = Planet
 1 = Ship
 2 = Black Hole
 3 = Space Station
 4 = Missile
 5 = Wormhole ?
 6 = Powerup ?
 */
planet_wars.planet = function(pos, r, density, colour, ring, angle)
{
	//[x,y] - INTs
	this.pos = pos;
	//radius - INT
	this.r = r;
	//multiplier (1=normal, 0.5 = less dense, 2=more, etc) - FLOAT
	this.density = density;
	//0=green, 1=brown, 2=blue;
	this.colour = colour;
	
	//idea is green is less dense, brown is normal and blue is more dense
	
	// BOOL
	this.ring = ring;
	//angle of ring - float
	this.angle = roundNumber(angle, 4);
	
	this.type = 0;
	
	this.arrayPos = planet_wars.objects.length;
	//create 2D engine physics object - gametype == this.arrayPos
	
	this.buildPhysics = function()
	{
		this.physics = new Shapes.circle(true, false, this.pos, this.angle, this.r, 50, this.colour, [0, 0, 0], [0, 0, 0], true, true, true, this.arrayPos, 1);
		this.physics.makeCharged(planet_wars.planetCharge(this.r) * this.density);
	}
	
	this.buildPhysics();
	
	//add to array of game objects
	planet_wars.objects.push(this);
}

planet_wars.ship = function(pos, player, graphic, angle)
{
	this.pos = pos;
	this.player = player;
	
	
	this.angle = roundNumber(angle, 4);
	//type of ship image
	this.graphic = graphic;
	
	this.type = 1;
	
	this.arrayPos = planet_wars.objects.length;
	
	this.buildPhysics = function()
	{
		//create 2D engine physics object - gametype == this.arrayPos
		this.physics = new Shapes.circle(true, false, this.pos, this.angle, planet_wars.shipRadius, 50, planet_wars.players[this.player].colour, [0, 0, 0], [0, 0, 0], true, true, true, this.arrayPos, 1);
	}
	this.buildPhysics();
	
	//add to array of game objects
	planet_wars.objects.push(this);
}

planet_wars.blackHole = function(pos)
{
	//[x,y]
	this.pos = pos;
	
	this.type = 2;
	
	this.arrayPos = planet_wars.objects.length;
	//create 2D engine physics object - gametype == this.arrayPos
	this.buildPhysics = function()
	{
		this.physics = new Shapes.circle(true, false, this.pos, 0, planet_wars.blackHoleRadius, 50, 0, [0, 0, 0], [0, 0, 0], true, true, false, this.arrayPos, 1);
		
		//extra circle around black hole - when missile enters this the physics engine will calculate more accurately
		//this.extraPhysics = new Shapes.circle(true, false, this.pos, 0, planet_wars.blackHoleRadius*3, 50, 0, [0, 0, 0], [0, 0, 0], true, true, false, false, 1);
		
		this.physics.makeCharged(planet_wars.blackHoleCharge);
	}
	this.buildPhysics();
	//add to array of game objects
	planet_wars.objects.push(this);
}

planet_wars.spaceStation = function(pos, r, density, graphic, angle)
{
	//[x,y]
	this.pos = pos;
	//radius
	this.r = r;
	//should always be 2 for death star
	this.density = density;
	//0=death star
	this.graphic = graphic;
	//angle of image
	this.angle = roundNumber(angle, 4);
	
	this.type = 3;
	
	this.arrayPos = planet_wars.objects.length;
	
	this.buildPhysics = function()
	{
		//create 2D engine physics object - gametype == this.arrayPos
		this.physics = new Shapes.circle(true, false, this.pos, this.angle, this.r, 50, this.graphic, [0, 0, 0], [0, 0, 0], true, true, true, this.arrayPos, 1);
		this.physics.makeCharged(-planet_wars.planetCharge(this.r) * this.density);
	}
	this.buildPhysics();
	//add to array of game objects
	planet_wars.objects.push(this);
}

planet_wars.missile = function(player, angle, speed, missileType)
{
	
	if(typeof(missileType)=="undefined")
	{
		missileType=false;
	}
	//false==normal, 0=red matter
	this.missileType=missileType;
	
	//start at shipRadius + missileRadius distance from the player's ship at angle.
	this.pos = [planet_wars.objects[planet_wars.players[player].ship].pos[0] + Math.cos(angle) * (planet_wars.shipRadius + planet_wars.missileRadius + 1), planet_wars.objects[planet_wars.players[player].ship].pos[1] + Math.sin(angle) * (planet_wars.shipRadius + planet_wars.missileRadius + 1)];
	this.oldPos = this.pos;
	this.positions = new Array();
	this.lastPosDrawn=0;
	
	this.player = player;
	this.startAngle = angle;
	this.startSpeed = speed;
	
	this.type = 4;
	
	this.arrayPos = planet_wars.objects.length;
	//create 2D engine physics object - gametype == this.arrayPos
	this.physics = new Shapes.circle(true, true, this.pos, angle, planet_wars.missileRadius, 50, planet_wars.players[player].colour, [Math.cos(angle) * speed, Math.sin(angle) * speed, 0], [0, 0, 0], true, true, true, this.arrayPos, 1);
	this.physics.makeCharged(-1 * planet_wars.chargeMultiplier);
	//add to array of game objects
	planet_wars.objects.push(this);
	
	
	planet_wars.players[player].goes.push([angle, speed]);
	
	
	if(this.missileType!==false)
	{
		//if a special missile, remove from arsenal
		planet_wars.players[player].arsenal[this.missileType]--;
	}
	
	
	//update ship with new angle
	planet_wars.objects[planet_wars.players[planet_wars.whosGo].ship].angle = angle;
	
	//black out ship and re-draw it at the new angle
	if (planet_wars.graphicsLevel > 1) 
	{
		Render.drawShip(planet_wars.objects[planet_wars.players[player].ship].pos, "rgb(0,0,0)", false, 0, 0);
		Render.drawShip(planet_wars.objects[planet_wars.players[player].ship].pos, Render.colourToRGB(planet_wars.players[player].colour), planet_wars.objects[planet_wars.players[player].ship].graphic, 0, planet_wars.objects[planet_wars.players[player].ship].angle);
	}
	
}


//powerup types:
/*
 * 0 = Red Matter (missile turns planets into black holes)
 * 1 = Shield - your ships get a small amount of negative gravity
 */
planet_wars.powerup = function(pos, powerup_type)
{
	this.pos = pos;
	this.powerup_type = powerup_type;
	
	switch (this.powerup_type)
	{
		case 0: //red matter
			this.use2=function()
			{
				//give the player a red matter missile
				planet_wars.players[planet_wars.whosGo].arsenal[0]++;
				
				var tempPos=[this.pos[0]+findPosX(planet_wars.canvasTag)-planet_wars.powerUpRadius*4 , this.pos[1]+findPosY(planet_wars.canvasTag)]
				
				planet_wars.anyTimeAnimation.MakeTextFadeUp(tempPos,[tempPos[0],tempPos[1]-planet_wars.powerUpRadius*4],1.5,0,"+1 Red Matter Missile",planet_wars.powerUpRadius,"#"+planet_wars.powerupColours[0],planet_wars.powerupTextStages);
			}
			break;
		case 1://shield
			this.use2=function()
			{
				var tempPos=[this.pos[0]+findPosX(planet_wars.canvasTag)-planet_wars.powerUpRadius , this.pos[1]+findPosY(planet_wars.canvasTag)]
				
				planet_wars.anyTimeAnimation.MakeTextFadeUp(tempPos,[tempPos[0],tempPos[1]-planet_wars.powerUpRadius*4],1.5,0,"Shield!",planet_wars.powerUpRadius,"#"+planet_wars.powerupColours[1],planet_wars.powerupTextStages);
				
				var tempPlayer=planet_wars.whosGo;
				var turnOn = function()
				{
					planet_wars.turnShieldOn(tempPlayer);
				}
				
				var turnOff = function()
				{
					planet_wars.turnShieldOff(tempPlayer);
				}
				
				new planet_wars.activePowerUp(this.powerup_type,planet_wars.whosGo,5,true,turnOn,turnOff);
			}
			break;
	}
	
	this.type = 6;
	
	this.used=false;
	
	this.arrayPos = planet_wars.objects.length;
	
	this.kill=function()
	{
		this.physics.kill();
		//black it out
		Render.drawPowerUp(this.pos,false,0);
	}
	
	this.use=function(thisMissilePhysics)
	{
		
		if(planet_wars.graphicsLevel>2)
		{
			var colour=Render.colourToRGBArray(planet_wars.powerupColours[this.powerup_type]);
			var startColour=colour.concat([1]);
			var endColour=colour.concat([0]);
			
			var tempPos=[(this.pos[0]-Render.viewports[1].x)*Render.viewports[1].zoom , (this.pos[1]-Render.viewports[1].y)*Render.viewports[1].zoom];
			
			var impactPos=[thisMissilePhysics.pos[0]-this.pos[0] , thisMissilePhysics.pos[1]-this.pos[1]];
			
			planet_wars.anyTimeAnimation.MakeBoxShattering(tempPos,impactPos,planet_wars.powerUpRadius * 2 *Render.viewports[1].zoom  ,planet_wars.powerUpRadius * 2*Render.viewports[1].zoom ,planet_wars.anyTimeAnimation,startColour,endColour);
		}
		
		this.used=true;
		this.kill();
		this.use2();
	}
	
	this.buildPhysics = function()
	{
		//create 2D engine physics object - gametype == this.arrayPos
		this.physics = new Shapes.oldRectangle(true, false, this.pos, planet_wars.powerUpRadius * 2, planet_wars.powerUpRadius * 2, 50, false, [0, 0, 0], [0, 0, 0], true, true, true, this.arrayPos, 1);
	}
	
	this.buildPhysics();
	
	planet_wars.objects.push(this);
}

planet_wars.player = function(name, colour)
{
	this.name = name;
	this.colour = colour;
	
	this.alive = true;
	
	//list of goes [angle,speed]
	this.goes = [];
	
	this.playerNum = planet_wars.players.length;
	
	//for powerups:
	this.shield=false;
	this.heavy=false;
	
	//(for extra missiles, normal missiles are always present)
	//0== red matter
	this.arsenal=new Array(planet_wars.numberOfExtraMissileTypes)
	
	for(var i=0;i<this.arsenal.length;i++)
	{
		this.arsenal[i]=0;
	}
	
	planet_wars.players.push(this);
}

/* ---------------------------------- general functions ---------------------------------- */

planet_wars.turnShieldOn=function(thisPlayer)
{
	if(planet_wars.players[thisPlayer].shield)
	{
		return;
	}
	
	//turn on a shield
	planet_wars.players[thisPlayer].shield=true;
	
	var tempCharge = planet_wars.players[thisPlayer].heavy ? 0 : -planet_wars.shipCharge;
	
	planet_wars.objects[planet_wars.players[thisPlayer].ship].physics.makeCharged(tempCharge);
	
	Render.renderViewport(0);
}

planet_wars.turnShieldOff=function(thisPlayer)
{
	//turn off a shield
	planet_wars.players[thisPlayer].shield=false;
	
	//if also heavy, just become that
	var tempCharge = planet_wars.players[thisPlayer].heavy ? planet_wars.shipCharge : 0;
	
	planet_wars.objects[planet_wars.players[thisPlayer].ship].physics.makeCharged(tempCharge);
	Render.renderViewport(0);
}

planet_wars.turnOffPowerup=function(me)
{
	//kill off all powerups running
	//planet_wars.redMatterActive=false;
	switch(planet_wars.activePowerups[me].powerup_type)
	{
		case 1://sheild
			
			break;
	}
}

//run after go change
planet_wars.runPowerups=function()
{
	//planet_wars.turnOffPowerups();
	for(var i=0;i<planet_wars.activePowerups.length;i++)
	{
		if(planet_wars.activePowerups[i].goesLeft<=0)
		{
			//turn off powerups which have run out
			planet_wars.activePowerups[i].turnOff();
			planet_wars.activePowerups.splice(i,1);
			i--;
		}
		else
		{
			if(planet_wars.whosGo==planet_wars.activePowerups[i].affects)
			{
				planet_wars.activePowerups[i].goesLeft--;
				
				if(!planet_wars.activePowerups[i].alwaysActive && !planet_wars.activePowerups[i].active)
				{
					//only turns on for one player's go
					planet_wars.activePowerups[i].turnOn();
				}
			}
			
			if(planet_wars.activePowerups[i].alwaysActive && !planet_wars.activePowerups[i].active)
				{
					//runs all the time, but not currently turned on!
					planet_wars.activePowerups[i].turnOn();
				}
		}
		
	}
}

planet_wars.sortArsenal=function()
{
	//check through arsenal, and if anything other than the defualt missile is avaliable, enable the drop down menu
	
	var needShow=false;
	
	for(var i=0;i<planet_wars.players[planet_wars.whosGo].arsenal.length;i++)
	{
		//enable the selection for missile avaliable
		if(planet_wars.players[planet_wars.whosGo].arsenal[i]>0)
		{
			needShow=true;
			planet_wars.missileSelect.options[i+1].removeAttribute('disabled');
		}
		else
		{
			planet_wars.missileSelect.options[i+1].disabled="disabled";
		}
	}
	if(needShow)
	{
		planet_wars.missileSelectSpan.style.display="block";
	}
	else
	{
		planet_wars.missileSelectSpan.style.display="none";
	}
	
	//select default by default
	planet_wars.missileSelect.options[0].selected="selected";
}

//turn a circular object into a black hole, intended for space stations and planets
planet_wars.turnIntoBlackHole=function(me)
{
	if(Render.viewports.length<3)
	{
		//blot out
		Render.viewports[0].canvas.beginPath();
		Render.viewports[0].canvas.fillStyle="rgb(0,0,0)";
		Render.viewports[0].canvas.arc(planet_wars.objects[me].pos[0] , planet_wars.objects[me].pos[1] , planet_wars.objects[me].r+1 , 0, Math.PI*2 , true);
		Render.viewports[0].canvas.fill();
		
		if(planet_wars.objects[me].ring)
		{
			//not sure whether to leave rings or not.
			Render.drawRings1(me,0,"rgb(192,192,192)");
			Render.drawRings2(me,0,"rgb(192,192,192)");
		}
	}
	
	
	
	
	planet_wars.objects[me].type=2;
	planet_wars.objects[me].r=planet_wars.blackHoleRadius;//*(planet_wars.planetCharge(planet_wars.objects[me].r)/planet_wars.blackHoleCharge);
	planet_wars.objects[me].physics.dimensions=planet_wars.blackHoleRadius;//*(planet_wars.planetCharge(planet_wars.objects[me].r)/planet_wars.blackHoleCharge);
	
	if(Render.viewports.length>2)
	{
		Render.renderViewport(0);
	}
}

planet_wars.lowGraphicsMode = function()
{
	planet_wars.graphicsLevel = 0;
}

planet_wars.anyTimeAnimationFinished = function()
{
	//need detection for when this has finished and the aim thing is up - if the mouse isn't moved then it will stay unless this wipes it!
	switch (planet_wars.gameDoing)
	{
		case 'aiming':
			Render.drawAim();
			break;
	}
}

planet_wars.anyTimeAnimationClearCanvas = function()
{
	if (!planet_wars.missileFlying)// && !planet_wars.game)
	{
		//Render.drawAim();
	}
}

//possibly animate a robot around a planet
planet_wars.chanceOfRobot = function()
{
	if (planet_wars.graphicsLevel > 2 && Math.random() < 0.005) 
	{
		planet_wars.animateFridgeRobot();
	}
}

planet_wars.animateFridgeRobot = function()
{
	var planets = new Array();
	
	for (var i = 0; i < planet_wars.objects.length; i++) 
	{
		if ((planet_wars.objects[i].type == 0 && !planet_wars.objects[i].ring) || planet_wars.objects[i].type == 3) 
		{
			//space station or planet
			planets.push(i);
		}
	}
	if (planets.length > 0) 
	{
		var randomPlanet = planets[Math.floor(Math.random() * planets.length)];
		
		var tempPos = [(planet_wars.objects[randomPlanet].pos[0] - Render.viewports[1].x) * Render.viewports[1].zoom, (planet_wars.objects[randomPlanet].pos[1] - Render.viewports[1].y) * Render.viewports[1].zoom]
		
		setTimeout(function()
		{
			planet_wars.anyTimeAnimation.MakeSkiingRobot(tempPos, planet_wars.objects[randomPlanet].r * Render.viewports[1].zoom, 200, Math.random() * Math.PI * 2);
		}, Math.round(Math.random() * 5000));
	}
}

//kills a player and croses out their ship
planet_wars.killPlayer = function(thisPlayer)
{
	planet_wars.players[thisPlayer].alive = false;
	
	var shipPos = planet_wars.objects[planet_wars.players[thisPlayer].ship].pos;
	var r = planet_wars.shipRadius * 1.5;
}



planet_wars.updateWhosGo = function()
{	
	if (typeof userId == "undefined" || planet_wars.players[planet_wars.whosGo].refId != userId || planet_wars.catchingUp)
	{
		planet_wars.whosGoSpan.innerHTML = planet_wars.players[planet_wars.whosGo].name + "'s go";
	}
	else
	{
		planet_wars.whosGoSpan.innerHTML = '';
	}
	planet_wars.whosGoSpan.style.color = "#" + planet_wars.players[planet_wars.whosGo].colour;
}

//function run every x ms to run physics
planet_wars.physicsLoopMe = function()
{
	Physics.replotentities();
	var vp=(Render.viewports.length>2) ? 2 : 0;
	Render.drawMissile(vp);
}

//function to loop when the mouse is being held down.
planet_wars.aimLoopMe = function()
{
	if (planet_wars.isMouseDown) 
	{
		planet_wars.updateAimWithMouse();
	}
	
	//see what is currently in the fire box
	planet_wars.fireBox = [parseFloat(planet_wars.fireAngleBox.value), parseFloat(planet_wars.fireSpeedBox.value)];
	
	//if it's changed, re-draw the aiming thingy
	if (planet_wars.anyTimeAnimation.AnimationsRunning() || (planet_wars.fireBox[0] != planet_wars.oldFireBox[0] || planet_wars.fireBox[1] != planet_wars.oldFireBox[1])) 
	{
		Render.drawAim();
		if (planet_wars.anyTimeAnimation.AnimationsRunning()) 
		{
			planet_wars.anyTimeAnimation.loop(planet_wars.anyTimeAnimation);
		}
	}
	//record firebox values for next loop
	planet_wars.oldFireBox = planet_wars.fireBox;
}



//returns false if no overlap, returns wholeworld array pos if overlap.  Ignores objects in ignoreArray
Detect.checkCircleOverlap = function(pos, r, ignoreArray)
{
	if (!isArray(ignoreArray)) 
	{
		ignoreArray = new Array();
	}
	
	for (var p = 0; p < Shapes.wholeworld.length; p++) 
	{
		if (!in_array(p, ignoreArray) && Shapes.wholeworld[p].alive && Detect.checkcollide(pos, r, true, 0, 0, Shapes.wholeworld[p].pos, Shapes.wholeworld[p].dimensions, Shapes.wholeworld[p].filled, Shapes.wholeworld[p].angle, Shapes.wholeworld[p].shape)) 
		{
			return p;
		}
	}
	return false;
}


//gets the shortest distance between a point and the ships
Detect.distFromShips = function(pos)
{
	var smallestDist = planet_wars.worldWidth;
	
	for (var i = 0; i < planet_wars.objects.length; i++) 
	{
		if (planet_wars.objects[i].type == 1) 
		{
			//a ship
			var testDist = Math.sqrt(Math.pow(planet_wars.objects[i].pos[0] - pos[0], 2) + Math.pow(planet_wars.objects[i].pos[1] - pos[1], 2));
			if (testDist < smallestDist) 
			{
				smallestDist = testDist;
			}
		}
	}
	return smallestDist;
}

//checks that circle at this position won't overlap with a planet that has a ring
Detect.farFromRings = function(pos, r)
{
	for (var i = 0; i < planet_wars.objects.length; i++) 
	{
		if (planet_wars.objects[i].type == 0 && planet_wars.objects[i].ring) 
		{
			//planet with a ring
			var testDist = Math.sqrt(Math.pow(planet_wars.objects[i].pos[0] - pos[0], 2) + Math.pow(planet_wars.objects[i].pos[1] - pos[1], 2));
			if (testDist < planet_wars.objects[i].r * 1.5 + r) 
			{
				// too close to a planet with a ring - could overlap
				return false;
			}
		}
	}
	return true
}

//place a planet at rougly this position, returns whether it succeeded
//wibble = multiplier by how far off it can be from [x,y]
planet_wars.plonkPlanet = function(x, y, minR, maxR, wibble)
{
	var midR = (minR + maxR) / 2;
	
	x += Math.random() * midR * 2 * wibble - midR * 1 * wibble;
	
	y += Math.random() * midR * 2 * wibble - midR * 1 * wibble;
	
	var tempR = roundNumber(minR + Math.round(Math.random() * (maxR - minR)));
	
	//this can't override planet pos if wibble==0 (stops planets getting to close to ship, hopefully)
	if (wibble > 0 && y - tempR < 0) 
	{
		y = tempR * 2;
	}
	else if (wibble > 0 && y + tempR > planet_wars.worldHeight) 
	{
		y = planet_wars.worldHeight - tempR * 2;
	}
	
	if (wibble > 0 && x - tempR < 0) 
	{
		x = tempR * 2;
	}
	else if (wibble > 0 && x + tempR > planet_wars.worldWidth) 
	{
		x = planet_wars.worldHeight - tempR * 2;
	}
	
	switch (Math.floor(Math.random() * 3))
	{
		case 0://low density - green
			var tempD = 0.5;
			var tempC = "008000";
			break;
		case 1://normal density - brown
			var tempD = 1.0;
			var tempC = "A5502A";
			break;
		case 2://high density - blue
			var tempD = 2.0;
			var tempC = "0000C8";
			break;
	}
	
	x = roundNumber(x);
	y = roundNumber(y);
	
	if (Detect.checkCircleOverlap([x, y], tempR * 2) === false)// && Detect.farFromRings([x,y],tempR))
	{
		var tempAngle = Math.random() * Math.PI - Math.PI / 2;
		if (tempAngle < 0) 
		{
			//db doesn't seem to like -ve angles
			tempAngle += Math.PI * 2;
		}
		
		//0.1 ish chance of ring
		new planet_wars.planet([x, y], tempR, tempD, tempC, (Math.random() < 0.1) ? true : false, tempAngle)
		return true;
	}
	return false;
}

//checks black hole is safe to be placed here
planet_wars.blackHoleSafe = function(tempX, tempY)
{
	return (Detect.distFromShips([tempX, tempY]) > planet_wars.shipRadius * 20 && Detect.checkCircleOverlap([tempX, tempY], 50) === false);
}

planet_wars.spaceStationSafe = function(tempX, tempY, tempR)
{
	return (Detect.distFromShips([tempX, tempY]) > planet_wars.shipRadius * 20 && Detect.checkCircleOverlap([tempX, tempY], tempR * 1.5) === false);
}


planet_wars.powerupSafe=function(tempX,tempY)
{
	//same as black hole atm
	return (Detect.distFromShips([tempX, tempY]) > planet_wars.shipRadius * 20 && Detect.checkCircleOverlap([tempX, tempY], 50) === false);
}

planet_wars.killOldMap = function()
{
	//clear planet wars old objects
	planet_wars.objects = new Array();
	
	//clear physics engine old objects (but keep borders)
	var wholeworld2 = Shapes.wholeworld.slice(0, 4);
	Shapes.wholeworld = new Array();
	Physics.chargedobjects = new Array();
	Shapes.wholeworld = wholeworld2;
	
	//kill off players array
	planet_wars.players = new Array();
	//kill off powerups
	planet_wars.activePowerups=new Array();
}

//will be replaced by ajax at some point.
planet_wars.generateMap = function(planets, players, planetsize, blackholes, spaceStations, wormholes, powerups)
{
	planet_wars.killOldMap();
	
	planet_wars.numberOfPlayers = players;
	
	//create players
	for (var i = 0; i < planet_wars.numberOfPlayers; i++) 
	{
	
		new planet_wars.player("Player " + (i + 1), planet_wars.playerColours[i]);
	}
	
	//create new seed and random object.  Seed is only used for stars to get consistant stars for every player (saves sending lots of data)
	planet_wars.seed = randomInt();
	planet_wars.random = new sRand(planet_wars.seed);
	
	var planetsMade = 0;
	var blackholesMade = 0;
	var spaceStationsMade = 0;
	var powerupsMade = 0;
	
	//build up array of objects of where the ships can spawn.
	planet_wars.buildShipRegions();
	
	var minR = 35;
	var maxR = 50;
	
	var midR = (maxR + minR) / 2;
	
	//implements idea for ship locations - that the number of players defines certain regions of the map where the ships can be spawned in.
	
	var validRegion = Math.floor(Math.random() * planet_wars.shipRegions.length);
	//assume regions are declared in a circle, choose points on circle as far apart from each other as possible
	var regionSpacing = Math.floor(planet_wars.shipRegions.length / players)
	
	
	
	for (var p = 0; p < players; p++) 
	{
	
		validRegion = (validRegion + regionSpacing) % planet_wars.shipRegions.length;
		
		//x coord +- radius
		var tempX = planet_wars.shipRegions[validRegion].pos[0] + (planet_wars.shipRegions[validRegion].r - Math.random() * 2 * planet_wars.shipRegions[validRegion].r);
		
		if (tempX < planet_wars.minEdgeDistance) 
		{
			tempX = planet_wars.minEdgeDistance;
		}
		else if (tempX > planet_wars.worldWidth - planet_wars.minEdgeDistance) 
		{
			tempX = planet_wars.worldWidth - planet_wars.minEdgeDistance;
		}
		
		//y coord +- radius
		var tempY = planet_wars.shipRegions[validRegion].pos[1] + (planet_wars.shipRegions[validRegion].r - Math.random() * 2 * planet_wars.shipRegions[validRegion].r);
		
		if (tempY < planet_wars.minEdgeDistance) 
		{
			tempY = planet_wars.minEdgeDistance;
		}
		else if (tempY > planet_wars.worldHeight - planet_wars.minEdgeDistance) 
		{
			tempY = planet_wars.worldHeight - planet_wars.minEdgeDistance;
		}
		
		//this actually results in a square, unlike a circle which is usally implied by radius, but who cares?
		
		var dx = planet_wars.worldWidth / 2 - tempX;
		var dy = planet_wars.worldHeight / 2 - tempY;
		
		tempX = roundNumber(tempX);
		tempY = roundNumber(tempY);
		
		var tempAngle = Math.atan2(dy, dx) - Math.PI * 0.2 + Math.random() * Math.PI * 0.4;
		
		//create a ship object
		new planet_wars.ship([tempX, tempY], p, Math.floor(Math.random() * planet_wars.numberOfShipGraphics), tempAngle);
		//set player object to have reference to array pos of this ship
		planet_wars.players[p].ship = planet_wars.objects.length - 1;
	}
	
	
	// ----------- MAKING PLANETS -------------
	
	var totalShipX = 0;
	var totalShipY = 0;
	
	//plonk a planet roughly between each consequtive player, and then one in the middle of all of them
	//old system used to place a planet between each and every pair of players - results in too many planets!
	for (var i = 0; i < (players == 2 ? 1 : players); i++) 
	{
		i2 = (i + 1) % players;
		
		totalShipX += planet_wars.objects[planet_wars.players[i].ship].pos[0];
		totalShipY += planet_wars.objects[planet_wars.players[i].ship].pos[1];
		
		var tempX = (planet_wars.objects[planet_wars.players[i].ship].pos[0] + planet_wars.objects[planet_wars.players[i2].ship].pos[0]) / 2;
		var tempY = (planet_wars.objects[planet_wars.players[i].ship].pos[1] + planet_wars.objects[planet_wars.players[i2].ship].pos[1]) / 2;
		
		if (planet_wars.debug) 
		{
			//draw lines between ships
			Render.viewports[0].canvas.beginPath();
			Render.viewports[0].canvas.strokeStyle = "rgb(255,255,0)";
			Render.viewports[0].canvas.moveTo(planet_wars.objects[planet_wars.players[i].ship].pos[0], planet_wars.objects[planet_wars.players[i].ship].pos[1]);
			Render.viewports[0].canvas.lineTo(tempX, tempY);
			Render.viewports[0].canvas.lineTo(planet_wars.objects[planet_wars.players[i2].ship].pos[0], planet_wars.objects[planet_wars.players[i2].ship].pos[1])
			Render.viewports[0].canvas.stroke();
		}
		//always place this planet with 2 players, but can not be there with more
		if ((Math.random() < 0.9 || players <= 2) && planet_wars.plonkPlanet(tempX, tempY, minR, maxR, 1)) 
		{
			planetsMade++;
		}
		
	}
	
	if (players > 2) 
	{
		//plonk planet in centre of players
		tempX = totalShipX / players;
		tempY = totalShipY / players;
		
		if (Math.random() < 0.9 && planet_wars.plonkPlanet(tempX, tempY, minR, maxR, 2)) 
		{
			planetsMade++;
		}
	}
	
	var loopLimit = 0;
	
	while (planetsMade < planets && loopLimit < 50) 
	{
		if (planetsMade == 4) 
		{
			minR /= 1.2;
			if (minR < planet_wars.minPlanetR) 
			{
				minR = planet_wars.minPlanetR;
			}
			maxR /= 2;
			if (maxR < minR) 
			{
				maxR = minR;
			}
			midR = (minR + maxR) / 2;
		}
		var tempX = Math.random() * planet_wars.worldWidth;
		var tempY = Math.random() * planet_wars.worldHeight;
		
		if (Detect.distFromShips([tempX, tempY]) > planet_wars.shipRadius * 15 + maxR) 
		{
			if (planet_wars.plonkPlanet(tempX, tempY, minR, maxR, 0)) 
			{
				planetsMade++;
			}
		}
		loopLimit++
	}
	
	loopLimit = 0;
	// - making black holes - 
	while (blackholesMade < blackholes && loopLimit < 50) 
	{
		var tempX = roundNumber(Math.random() * planet_wars.worldWidth);
		var tempY = roundNumber(Math.random() * planet_wars.worldHeight);
		
		if (planet_wars.blackHoleSafe(tempX, tempY)) 
		{
			//far from ships and quite far from other planets
			new planet_wars.blackHole([tempX, tempY]);
			blackholesMade++;
			if (planet_wars.debug) 
			{
				Render.viewports[0].canvas.beginPath();
				Render.viewports[0].canvas.strokeStyle = "rgb(255,0,0)";
				Render.viewports[0].canvas.moveTo((tempX - 50 - Render.viewports[0].x) * Render.viewports[0].zoom, (tempY - 50 - Render.viewports[0].y) * Render.viewports[0].zoom);
				Render.viewports[0].canvas.lineTo((tempX + 50 - Render.viewports[0].x) * Render.viewports[0].zoom, (tempY + 50 - Render.viewports[0].y) * Render.viewports[0].zoom);
				Render.viewports[0].canvas.moveTo((tempX + 50 - Render.viewports[0].x) * Render.viewports[0].zoom, (tempY - 50 - Render.viewports[0].y) * Render.viewports[0].zoom);
				Render.viewports[0].canvas.lineTo((tempX - 50 - Render.viewports[0].x) * Render.viewports[0].zoom, (tempY + 50 - Render.viewports[0].y) * Render.viewports[0].zoom);
				Render.viewports[0].canvas.stroke();
			}
		}
	}
	
	minR = 20;
	maxR = 50;
	// - making space stations - 
	loopLimit = 0;
	while (spaceStationsMade < spaceStations && loopLimit < 50) 
	{
		var tempX = roundNumber(Math.random() * planet_wars.worldWidth);
		var tempY = roundNumber(Math.random() * planet_wars.worldHeight);
		var tempR = roundNumber(minR + Math.round(Math.random() * (maxR - minR)));
		var tempGraphic = Math.floor(Math.random() * planet_wars.numberOfSpaceStationGraphics);
		
		if (planet_wars.spaceStationSafe(tempX, tempY, tempR)) 
		{
			//far from ships and quite far from other planets
			new planet_wars.spaceStation([tempX, tempY], tempR, 2, tempGraphic, 0);
			spaceStationsMade++;
			if (planet_wars.debug) 
			{
				Render.viewports[0].canvas.beginPath();
				Render.viewports[0].canvas.strokeStyle = "rgb(255,0,255)";
				Render.viewports[0].canvas.moveTo((tempX - 50 - Render.viewports[0].x) * Render.viewports[0].zoom, (tempY - 50 - Render.viewports[0].y) * Render.viewports[0].zoom);
				Render.viewports[0].canvas.lineTo((tempX + 50 - Render.viewports[0].x) * Render.viewports[0].zoom, (tempY + 50 - Render.viewports[0].y) * Render.viewports[0].zoom);
				Render.viewports[0].canvas.moveTo((tempX + 50 - Render.viewports[0].x) * Render.viewports[0].zoom, (tempY - 50 - Render.viewports[0].y) * Render.viewports[0].zoom);
				Render.viewports[0].canvas.lineTo((tempX - 50 - Render.viewports[0].x) * Render.viewports[0].zoom, (tempY + 50 - Render.viewports[0].y) * Render.viewports[0].zoom);
				Render.viewports[0].canvas.stroke();
			}
		}
	}
	
	// - adding powerups - 
	loopLimit = 0;
	while (powerupsMade < powerups && loopLimit < 50) 
	{
		var tempX = roundNumber(Math.random() * planet_wars.worldWidth);
		var tempY = roundNumber(Math.random() * planet_wars.worldHeight);
		var tempPowerupType=Math.floor(Math.random()*planet_wars.numerOfPowerUps);
		
		if(planet_wars.powerupSafe(tempX, tempY))
		{
			new planet_wars.powerup([tempX,tempY],tempPowerupType);
			powerupsMade++;
		}
		
	}
	
	//[COC , avgPos, mostChargedObject]
	
	
	if (!planet_wars.checkMapPossible()) 
	{
		//if map is likely to be impossible, try again.
		if (planet_wars.debug) 
		{
			Render.renderViewport(0);
			alert('impossible!');
		}
		
		
		planet_wars.generateMap(planets, players, planetsize, blackholes, wormholes);
		return false;
	}
	
	
	if (planet_wars.debug) 
	{
		var centres = planet_wars.findCentres();
		var mostChargedObject = centres[2];
		
		//draw cross for centre of charge
		Render.viewports[0].canvas.beginPath();
		Render.viewports[0].canvas.strokeStyle = "rgb(255,0,0)";
		Render.viewports[0].canvas.moveTo((centres[0][0] - 50 - Render.viewports[0].x) * Render.viewports[0].zoom, (centres[0][1] - 50 - Render.viewports[0].y) * Render.viewports[0].zoom);
		Render.viewports[0].canvas.lineTo((centres[0][0] + 50 - Render.viewports[0].x) * Render.viewports[0].zoom, (centres[0][1] + 50 - Render.viewports[0].y) * Render.viewports[0].zoom);
		Render.viewports[0].canvas.moveTo((centres[0][0] + 50 - Render.viewports[0].x) * Render.viewports[0].zoom, (centres[0][1] - 50 - Render.viewports[0].y) * Render.viewports[0].zoom);
		Render.viewports[0].canvas.lineTo((centres[0][0] - 50 - Render.viewports[0].x) * Render.viewports[0].zoom, (centres[0][1] + 50 - Render.viewports[0].y) * Render.viewports[0].zoom);
		Render.viewports[0].canvas.stroke();
		//draw cross for avgPos
		Render.viewports[0].canvas.beginPath();
		Render.viewports[0].canvas.strokeStyle = "rgb(0,255,0)";
		Render.viewports[0].canvas.moveTo((centres[1][0] - 50 - Render.viewports[0].x) * Render.viewports[0].zoom, (centres[1][1] - 50 - Render.viewports[0].y) * Render.viewports[0].zoom);
		Render.viewports[0].canvas.lineTo((centres[1][0] + 50 - Render.viewports[0].x) * Render.viewports[0].zoom, (centres[1][1] + 50 - Render.viewports[0].y) * Render.viewports[0].zoom);
		Render.viewports[0].canvas.moveTo((centres[1][0] + 50 - Render.viewports[0].x) * Render.viewports[0].zoom, (centres[1][1] - 50 - Render.viewports[0].y) * Render.viewports[0].zoom);
		Render.viewports[0].canvas.lineTo((centres[1][0] - 50 - Render.viewports[0].x) * Render.viewports[0].zoom, (centres[1][1] + 50 - Render.viewports[0].y) * Render.viewports[0].zoom);
		Render.viewports[0].canvas.stroke();
	}
	
}

//check using centre of charge that the map is likely to be impossible
planet_wars.checkMapPossible = function()
{
	/*
	var centres = planet_wars.findCentres();
	var COC=centres[0];
	var avgPos=centres[1];
	var avgShipPos=centres[3];
	var totalCharge=centres[4];
	
	if (Math.sqrt(Math.pow(COC[0] - avgShipPos[0], 2) + Math.pow(COC[1] - avgShipPos[1], 2)) > planet_wars.worldWidth / 4 && totalCharge > 100000) 
	{
		//if the centre of charge is off-centre, and the total charge is large
		return false;
	}
	*/
	var potentials = new Array();
	//build up array of potentials at each ship
	for (var i = 0; i < planet_wars.players.length; i++) 
	{
		potentials.push(Physics.electricPotential(planet_wars.objects[planet_wars.players[i].ship].pos));
	}
	//checking voltage between ships, if this is less than -160,000 it seems to be impossible to hit.
	for (var i = 0; i < potentials.length; i++) 
	{
		for (var j = 0; j < potentials.length; j++) 
		{
			//-160000
			//-100000 - less seems to be better as this technique doesn't take into account paths
			if (potentials[i] - potentials[j] < -90000) 
			{
				return false;
			}
		}
	}
	
	
	return true;
}

//finds centre of charge and average position of charged objects
//returns [COC, avgPos , mostChargedObject , avgShipPos ,totalCharge]
planet_wars.findCentres = function()
{
	// SUM(x*m) = XM   for centre of mass
	//using c for charge:
	var sumxc = 0;
	var sumyc = 0;
	var X = 0;
	var Y = 0;
	var C = 0;
	var chargedStuff = 0;
	var mostCharge = 0;
	var mostChargedObject = false;
	var shipX = 0;
	var shipY = 0;
	var numShips = 0;
	
	//find 'centre of charge' to check that map isn't likely to be impossible
	for (var i = 0; i < planet_wars.objects.length; i++) 
	{
		if (planet_wars.objects[i].physics.charged) 
		{
			//not a ship :. charged
			sumxc += planet_wars.objects[i].pos[0] * planet_wars.objects[i].physics.charge;
			sumyc += planet_wars.objects[i].pos[1] * planet_wars.objects[i].physics.charge;
			X += planet_wars.objects[i].pos[0];
			Y += planet_wars.objects[i].pos[1];
			C += planet_wars.objects[i].physics.charge;
			if (planet_wars.objects[i].physics.charge > mostCharge) 
			{
				mostCharge = planet_wars.objects[i].physics.charge;
				mostChargedObject = i;
			}
			chargedStuff++;
		}
		if (planet_wars.objects[i].type == 1) 
		{
			//ship
			shipX += planet_wars.objects[i].pos[0];
			shipY += planet_wars.objects[i].pos[1];
			numShips++;
		}
	}
	//centre of charge!
	var COC = [sumxc / C, sumyc / C];
	//average coords (I'm sure this can be useful for something)
	var avgPos = [X / chargedStuff, Y / chargedStuff];
	//average ship position
	var avgShipPos = [shipX / numShips, shipY / numShips];
	
	return [COC, avgPos, mostChargedObject, avgShipPos, C];
}

//if returnOnly is true, then this doesn't alter the current values of the box, but returns the sanatised [angle,speed]
planet_wars.santiseFireBox = function(returnOnly)
{
	var safeAngle = parseFloat(roundNumber(planet_wars.fireAngleBox.value, 4));
	var safeSpeed = parseFloat(roundNumber(planet_wars.fireSpeedBox.value, 4));
	
	//sanitise values
	var kae;
	
	
	//check angle is a number
	if (isNaN(parseFloat(planet_wars.fireAngleBox.value))) 
	{
		returnOnly ? safeAngle = 0 : planet_wars.fireAngleBox.value = 0;
	}
	
	//check speed is a number
	if (isNaN(parseFloat(planet_wars.fireSpeedBox.value))) 
	{
		returnOnly ? safeSpeed = 100 : planet_wars.fireSpeedBox.value = 100;
	}
	
	if (!returnOnly) 
	{
		planet_wars.fireSpeedBox.value = parseFloat(planet_wars.fireSpeedBox.value);
		planet_wars.fireAngleBox.value = parseFloat(planet_wars.fireAngleBox.value);
	}
	
	//change range of speed :
	if (parseFloat(planet_wars.fireSpeedBox.value) > 100) 
	{
		returnOnly ? safeSpeed = 100 : planet_wars.fireSpeedBox.value = 100;
	}
	
	if (parseFloat(planet_wars.fireSpeedBox.value) < 0) 
	{
		returnOnly ? safeSpeed = 0 : planet_wars.fireSpeedBox.value = 0;
	}
	
	while (!returnOnly && parseFloat(planet_wars.fireAngleBox.value) < 0) 
	{
		planet_wars.fireAngleBox.value = parseFloat(planet_wars.fireAngleBox.value) + 360;
	}
	
	while (!returnOnly && parseFloat(planet_wars.fireAngleBox.value) > 360) 
	{
		planet_wars.fireAngleBox.value = parseFloat(planet_wars.fireAngleBox.value) - 360;
	}
	
	if (!returnOnly && parseFloat(planet_wars.fireAngleBox.value) < 10) 
	{
		planet_wars.fireAngleBox.value = '0' + planet_wars.fireAngleBox.value;
	}
	
	if (!returnOnly && parseFloat(planet_wars.fireAngleBox.value) < 100) 
	{
		planet_wars.fireAngleBox.value = '0' + planet_wars.fireAngleBox.value;
	}
	
	if (returnOnly) 
	{
		return [safeAngle, safeSpeed];
	}
}

planet_wars.baringToRadian = function(baring)
{
	return Math.PI * (parseFloat(baring) - 90) / 180;
}

planet_wars.radianToBaring = function(r)
{
	return 180 * r / Math.PI + 90;
}

planet_wars.humanSpeedToReal = function(speed)
{
	return planet_wars.maxSpeed * parseFloat(speed) / 100;
}

planet_wars.updateAimWithMouse = function()
{
	var tempX = planet_wars.objects[planet_wars.players[planet_wars.whosGo].ship].pos[0];
	var tempY = planet_wars.objects[planet_wars.players[planet_wars.whosGo].ship].pos[1];
	
	var tempSpeed = Math.round(Math.sqrt(Math.pow(tempX - planet_wars.mouseX, 2) + Math.pow(tempY - planet_wars.mouseY, 2)));
	var tempAngle = Math.round(planet_wars.radianToBaring(Math.atan2(planet_wars.mouseY - tempY, planet_wars.mouseX - tempX)));
	
	if (tempSpeed > 100) 
	{
		tempSpeed = 100;
	}
	
	while (tempAngle > 360) 
	{
		tempAngle -= 360;
	}
	
	while (tempAngle < 0) 
	{
		tempAngle += 360;
	}
	
	if (tempAngle < 10) 
	{
		tempAngle = '00' + tempAngle;
	}
	else if (tempAngle < 100) 
	{
		tempAngle = '0' + tempAngle;
	}
	
	planet_wars.fireAngleBox.value = tempAngle;
	planet_wars.fireSpeedBox.value = tempSpeed;
	
	//planet_wars.santiseFireBox(false);
}

planet_wars.loadJSONMap = function(mapJSON)
{
	planet_wars.killOldMap();
	planet_wars.seed = mapJSON.seed;
	planet_wars.random = new sRand(planet_wars.seed);
	
	var numOfShips = 0;
	
	for (var i = 0; i < mapJSON.objects.length; i++) 
	{
		switch (mapJSON.objects[i].type)
		{
			case 'planet':
				new planet_wars.planet([parseInt(mapJSON.objects[i].pos[0]), parseInt(mapJSON.objects[i].pos[1])], parseInt(mapJSON.objects[i].radius), parseFloat(mapJSON.objects[i].density), mapJSON.objects[i].colour, (mapJSON.objects[i].rings == "1"), parseFloat(mapJSON.objects[i].angle));
				break;
			case 'ship':
				//planet_wars.playerColours[numOfShips]
				
				var tempColour = typeof(mapJSON.objects[i].colour) == "undefined" ? planet_wars.playerColours[numOfShips] : mapJSON.objects[i].colour;
				
				new planet_wars.player(parseInt(mapJSON.objects[i].refId), tempColour);
				new planet_wars.ship([parseInt(mapJSON.objects[i].pos[0]), parseInt(mapJSON.objects[i].pos[1])], numOfShips, parseInt(mapJSON.objects[i].graphic), parseFloat(mapJSON.objects[i].angle));
				//set player objects to have reference to array pos of this ship
				planet_wars.players[planet_wars.players.length - 1].ship = planet_wars.objects.length - 1;
				numOfShips++;
				break;
			case 'black_hole':
				new planet_wars.blackHole([parseInt(mapJSON.objects[i].pos[0]), parseInt(mapJSON.objects[i].pos[1])]);
				break;
			case 'space_station':
				new planet_wars.spaceStation([parseInt(mapJSON.objects[i].pos[0]), parseInt(mapJSON.objects[i].pos[1])], parseInt(mapJSON.objects[i].radius), parseFloat(mapJSON.objects[i].density), parseInt(mapJSON.objects[i].graphic), parseFloat(mapJSON.objects[i].angle))
				break;
			//will add more types as they exist.
		}
	}
}



planet_wars.mapToJSON = function(thisJSON)
{
	thisJSON.map = new Object();
	
	thisJSON.map.grav_multiplier = roundNumber(0.9 + Math.random() * 0.2);
	thisJSON.map.seed = planet_wars.seed;
	
	thisJSON.map.possible=planet_wars.checkMapPossible() ? 1 : 0;
	thisJSON.map.objects = new Array();
	
	for (var i = 0; i < planet_wars.objects.length; i++) 
	{
		thisJSON.map.objects[i] = new Object();
		for (var p in planet_wars.objects[i]) 
		{
			//most of how I store stuff in my objects is the same as the spec, however a few bits aren't and this deals with them
			switch (p)
			{
				case 'physics':
				case 'arrayPos':
					//don't send these
					break;
				case 'player':
					//the spec has a different name
					thisJSON.map.objects[i].refId = planet_wars.objects[i][p];
					break;
				case 'r':
					thisJSON.map.objects[i].radius = planet_wars.objects[i][p];
					break;
				case 'ring':
					thisJSON.map.objects[i].rings = planet_wars.objects[i][p];
					break;
				case 'type':
					thisJSON.map.objects[i][p] = planet_wars.objectsJSONname[planet_wars.objects[i][p]];
					if (planet_wars.objects[i][p] == 1) 
					{
						//ship
						thisJSON.map.objects[i].radius = planet_wars.shipRadius;
					}
					break;
				default:
					thisJSON.map.objects[i][p] = planet_wars.objects[i][p];
					break;
			}
		}
	}
}

planet_wars.mouseDown = function()
{
	planet_wars.isMouseDown = true;
}

planet_wars.mouseUp = function()
{
	planet_wars.isMouseDown = false;
}

//for use with   document.onmousemove = getMouseXY;  (or whatever :P)
planet_wars.getMouseXY = function(e)
{
	if (planet_wars.IE) 
	{
		//grab the x-y pos.s if browser is IE
		planet_wars.mouseX = event.clientX + document.body.scrollLeft
		planet_wars.mouseY = event.clientY + document.body.scrollTop
	}
	else 
	{
		//grab the x-y pos.s if browser is NS
		planet_wars.mouseX = e.pageX
		planet_wars.mouseY = e.pageY
	}
	//catch possible negative values in NS4
	if (planet_wars.mouseX < 0) 
	{
		planet_wars.mouseX = 0;
	}
	if (planet_wars.mouseY < 0) 
	{
		planet_wars.mouseY = 0;
	}
	
	planet_wars.cleanUpMouse();
	
	
}

planet_wars.cleanUpMouse = function()
{
	planet_wars.divPos = [findPosX(planet_wars.div), findPosY(planet_wars.div)];
	
	//adjust mousepos to the simulation
	planet_wars.mouseX = (planet_wars.mouseX - planet_wars.divPos[0] - Render.viewports[0].x) * Render.viewports[0].zoom;
	planet_wars.mouseY = (planet_wars.mouseY - planet_wars.divPos[1] - Render.viewports[0].y) * Render.viewports[0].zoom;
}


//myAddEvent(window, 'onload', planet_wars.load);
