// planet wars map editor - extends planet_wars.js

planet_wars.editorSmallestPlanet=10;

//time in ms for each update of mouse position when resizing/dragging, etc
planet_wars.editorLoopTime=100;
planet_wars.editorLoopMe=false;
planet_wars.editorMoveThis=false;
planet_wars.editorMouseFromCentre=[0,0];

planet_wars.editorAllowShipsEdited=true;

planet_wars.editorOpen=false;

//currently selected tool
planet_wars.selectedTool="move";
planet_wars.selectedObject=false;

//canvas to tie mouse stuff to
planet_wars.editorBigCanvasId='planet_wars_canvas_big';

//the viewport to use for the editor
planet_wars.editorViewPort;
//divs shown and hidden when editor is opened
planet_wars.editorShown;
planet_wars.editorHidden;

planet_wars.editorWarningDiv;

planet_wars.load2=function()
{
    //full sized canvas for editing the map
    planet_wars.editorCanvasTag=document.getElementById(planet_wars.editorBigCanvasId);
	
	planet_wars.editorWarningDiv=document.getElementById("planet_wars_editor_impossible_warning");

	
    //planet_wars.editor = document.getElementById('planet_wars_editor');
    //planet_wars.editor_container = document.getElementById('planet_wars_editor_container');
    
	planet_wars.editorCanvasTag.onmousedown=planet_wars.editorMouseDown;
	document.onmouseup   = planet_wars.editorMouseUp;
    document.onmousemove = planet_wars.getMouseXY;
	
	
	
    new Render.viewport('planet_wars_canvas_big',0,0,planet_wars.worldWidth,planet_wars.worldHeight,1,true);
    
    //Render.renderViewport(0);
    
    
    
    
    //Render.renderViewport(planet_wars.editorViewPort);
    
    
    /*
    planet_wars.div.onmousedown = planet_wars.mouseDown;
    document.onmouseup   = planet_wars.mouseUp;
    document.onmousemove = planet_wars.getMouseXY;
    */
    /*
    //set up detection of typing in box
    planet_wars.aimLoop=setInterval(planet_wars.aimLoopMe , 25);
    */
    //start stuff
    //planet_wars.changeGo();
}


//we don't want the normal mouse stuff interfering, override usual cleanUpMouse
planet_wars.cleanUpMouse=function()
{
	//set last bit to true if the div containing the editor doesn't scroll with the page
	var posCanvasTagX=findPosX(planet_wars.editorCanvasTag,false);
	var posCanvasTagY=findPosY(planet_wars.editorCanvasTag,false);
	
	
	
	planet_wars.editorMousePos=[planet_wars.mouseX-posCanvasTagX , planet_wars.mouseY-posCanvasTagY];
}

//editor wasn't designed to deal with the physics engine and all its design flaws, so re-build all the physics before the game starts
planet_wars.reBuildPhysics=function()
{
	Shapes.wholeworld=Shapes.wholeworld.slice(0,4);
	Physics.chargedobjects=new Array();
	
	for(var i=0;i<planet_wars.objects.length;i++)
	{
		planet_wars.objects[i].arrayPos=i;
		planet_wars.objects[i].buildPhysics();
	}
	
}

//leaves behind two ships, but kills everyting else
planet_wars.editorClearMap=function()
{
	var ships=0;
	
	var newObjects=new Array();
	
	for(var i=0;i<planet_wars.objects.length;i++)
	{
		if(planet_wars.objects[i].type==1)// && ships<2)
		{
			//don't delete if a ship and we don't have enough left
			planet_wars.objects[i].arrayPos=ships;
			newObjects.push(planet_wars.objects[i]);
			ships++;
		}

	}
	
	planet_wars.objects=newObjects;
	
	planet_wars.editorTidyUpShips();
	planet_wars.reBuildPhysics();
	Render.renderViewport(planet_wars.editorViewPort, true, true);
}

planet_wars.editorDeleteObject=function(selected)
{
	//kill off physics stuff
	planet_wars.objects[selected].physics.kill();
	
	//so long as there are at least 2 ships, we can delete it.
	Shapes.wholeworld.splice(selected + 4, 1);
	planet_wars.objects.splice(selected, 1);
}

//when the mouse goes down on the planet_wars.editorCanvasTag
planet_wars.editorMouseDown=function()
{
	var selected=Detect.checkCircleOverlap(planet_wars.editorMousePos,2);
	
	if (selected !== false && selected >= 4) 
	{
		//clicked on something
		//ignore borders
		selected-=4;
		
		switch (planet_wars.selectedTool) 
		{

			case 'move':
				planet_wars.editorSelected = selected;
				planet_wars.editorMouseFromCentre = [planet_wars.editorMousePos[0] - planet_wars.objects[selected].pos[0], planet_wars.editorMousePos[1] - planet_wars.objects[selected].pos[1]];
				if(planet_wars.editorLoopMe===false)
					{
						planet_wars.editorLoopMe = setInterval(planet_wars.editorLoop, planet_wars.editorLoopTime);						
					}
				break;
			case 'resize':
				if (planet_wars.objects[selected].type == 0 || planet_wars.objects[selected].type == 3 )
				{
					//if a planet or spacestation
					
					planet_wars.editorSelected = selected;
					
					planet_wars.editorOldR = planet_wars.objects[selected].r;
					planet_wars.editorMouseFromCentre = [planet_wars.editorMousePos[0] - planet_wars.objects[selected].pos[0], planet_wars.editorMousePos[1] - planet_wars.objects[selected].pos[1]];
					
					planet_wars.editorOldDistance = Math.sqrt(Math.pow(planet_wars.editorMouseFromCentre[0], 2) + Math.pow(planet_wars.editorMouseFromCentre[1], 2));
					
					if(planet_wars.editorLoopMe===false)
					{
						planet_wars.editorLoopMe = setInterval(planet_wars.editorLoop, planet_wars.editorLoopTime);						
					}

					
				}
				break;
			case 'delete':
				//only allow ships to be deleted if there are more than 2
				if (planet_wars.objects[selected].type !== 1 || (planet_wars.players.length>2 && planet_wars.editorAllowShipsEdited))
				{
					planet_wars.editorDeleteObject(selected);
					planet_wars.editorTidyUpShips();
					Render.renderViewport(planet_wars.editorViewPort, true, true);
				}
				break;
			case 'potential':
				alert(Math.round(Physics.electricPotential(planet_wars.editorMousePos)));
				break;
			
		}
	}
	else
	{
		//nothing clicked on
		switch (planet_wars.selectedTool) 
		{
			case 'potential':
				alert(Math.round(Physics.electricPotential(planet_wars.editorMousePos)));
				break;
			case 'addPlanet':
				var r=50;
				if (planet_wars.plonkPlanet(planet_wars.editorMousePos[0], planet_wars.editorMousePos[1], r, r, 0))
				{
					//placed planet successfully
					Render.renderViewport(planet_wars.editorViewPort, true, true);
				}
				else
				{
					planet_wars.editorFlashCircle(planet_wars.editorMousePos,r)
				}
				break;
			case 'addSpaceStation':
				var r=30;
				//if(planet_wars.spaceStationSafe(planet_wars.editorMousePos[0], planet_wars.editorMousePos[1],r))
				if(Detect.checkCircleOverlap(planet_wars.editorMousePos,r)===false)
				{
					//safe to put space station here
					var tempGraphic = Math.round(Math.random()*planet_wars.numberOfSpaceStationGraphics);
        
		            new planet_wars.spaceStation(planet_wars.editorMousePos,r,2,tempGraphic,0);
					
					Render.renderViewport(planet_wars.editorViewPort, true, true);
				}
				else
				{
					planet_wars.editorFlashCircle(planet_wars.editorMousePos,r);
				}
				break;
			case 'addBlackHole':
				//if(planet_wars.blackHoleSafe(planet_wars.editorMousePos[0], planet_wars.editorMousePos[1]))
				if(Detect.checkCircleOverlap(planet_wars.editorMousePos,planet_wars.blackHoleRadius)===false)
				{
					//safe to put black hole here
					new planet_wars.blackHole(planet_wars.editorMousePos);
					Render.renderViewport(planet_wars.editorViewPort, true, true);
				}
				else
				{
					planet_wars.editorFlashCircle(planet_wars.editorMousePos,20);
				}
				break;
			case 'addShip':
				if(planet_wars.editorAllowShipsEdited && planet_wars.players.length < planet_wars.maxPlayers && Detect.checkCircleOverlap(planet_wars.editorMousePos,planet_wars.shipRadius)===false)
				{
					new planet_wars.ship(planet_wars.editorMousePos,0,Math.floor(Math.random()*planet_wars.numberOfShipGraphics) , Math.random()*Math.PI*2);
					planet_wars.editorTidyUpShips();
					Render.renderViewport(planet_wars.editorViewPort, true, true);
				}
				break;
		}
	}
}

//flash a circle for a short while on the editor canvas
planet_wars.editorFlashCircle=function(pos,r)
{
	//collides with something else on the map, flash up a red circle.
	Render.viewports[1].canvas.save();
	Render.viewports[1].canvas.strokeStyle="rgb(255,0,0)";
	Render.viewports[1].canvas.lineWidth=2;
	Render.viewports[1].canvas.beginPath();
	Render.viewports[1].canvas.moveTo((pos[0]+r-Render.viewports[1].x)*Render.viewports[1].zoom,(pos[1]-Render.viewports[1].y)*Render.viewports[1].zoom);
	Render.viewports[1].canvas.arc((pos[0]-Render.viewports[1].x)*Render.viewports[1].zoom,(pos[1]-Render.viewports[1].y)*Render.viewports[1].zoom,r,0,Math.PI*2,true);
	Render.viewports[1].canvas.stroke();
	Render.viewports[1].canvas.restore();
	
	setTimeout(function(){Render.renderViewport(planet_wars.editorViewPort, true, true);},250);
}

//tie up the number of players to ships
planet_wars.editorTidyUpShips=function()
{
	planet_wars.players=new Array();
	
	var p=0;
	
	for(var i=0;i<planet_wars.objects.length;i++)
	{
		if(planet_wars.objects[i].type==1)
		{
			//deleting stuff messes this up, should really have used a proper reference, but this works for now (gametype contains the planet_wars.objects position)
			planet_wars.objects[i].physics.gameType=i;
			//ship
			new planet_wars.player("Player "+(p+1),planet_wars.playerColours[p]);
			planet_wars.objects[i].player=p;
			planet_wars.players[p].ship=i;
			p++;
		}
	}
	document.getElementById("optionPlayers").value=p;
}

//function to be looped when stuff is being dragged, resized, etc
planet_wars.editorLoop=function()
{
	switch(planet_wars.selectedTool)
	{
		case "move":
			
			var tryPos = [planet_wars.editorMousePos[0]-planet_wars.editorMouseFromCentre[0] , planet_wars.editorMousePos[1]-planet_wars.editorMouseFromCentre[1]];
			
			
			/*
			var checkCollide=Detect.checkCircleOverlap(tryPos, planet_wars.objects[planet_wars.editorSelected].r, [planet_wars.editorSelected + 4]);						

			if (checkCollide === false) 
			{
				planet_wars.objects[planet_wars.editorSelected].pos = tryPos;
				planet_wars.objects[planet_wars.editorSelected].physics.pos=tryPos;
			}
			
			else
			{
			*/
				var dx = planet_wars.objects[planet_wars.editorSelected].pos[0] - tryPos[0]
				var dy = planet_wars.objects[planet_wars.editorSelected].pos[1] - tryPos[1]
				var loopLimit=0;
				
				var tempR=planet_wars.objects[planet_wars.editorSelected].physics.dimensions;
				
				if(isArray(tempR))
				{
					//square
					tempR=tempR[0]*0.707;
				}
				
				//need idea here for moving stuff as close to wanted position as possible
				while(loopLimit < 100 && Detect.checkCircleOverlap(tryPos, tempR, [planet_wars.editorSelected + 4]) !== false)
				{
					tryPos[0]+=dx/100;
					tryPos[1]+=dy/100;
					loopLimit++;
				}
				if(loopLimit<100 && tryPos[0]>0 && tryPos[1]>0 && tryPos[0] < planet_wars.worldWidth && tryPos[1] < planet_wars.worldHeight)
				{
					//and in-screen!
					planet_wars.objects[planet_wars.editorSelected].pos = tryPos;
					planet_wars.objects[planet_wars.editorSelected].physics.pos=tryPos;
				}
			//}
			
			
			break;
		case "resize":
			
			var newDistance =Math.sqrt(Math.pow(planet_wars.objects[planet_wars.editorSelected].pos[0] - planet_wars.editorMousePos[0] ,2) + Math.pow(planet_wars.objects[planet_wars.editorSelected].pos[1] - planet_wars.editorMousePos[1],2));
			var testR=Math.abs(Math.round(planet_wars.editorOldR + (newDistance - planet_wars.editorOldDistance)));
			
			if(testR<planet_wars.editorSmallestPlanet)
			
			var checkCollide=Detect.checkCircleOverlap(planet_wars.objects[planet_wars.editorSelected].pos, testR, [planet_wars.editorSelected + 4]);						
			if (checkCollide === false && testR>planet_wars.editorSmallestPlanet) 
			{
				planet_wars.objects[planet_wars.editorSelected].r = testR;
				planet_wars.objects[planet_wars.editorSelected].physics.dimensions = testR;
				
			}
			else
			{
				do
				{
					testR--;
				}
				while(Detect.checkCircleOverlap(planet_wars.objects[planet_wars.editorSelected].pos, testR, [planet_wars.editorSelected + 4]) !== false && testR>planet_wars.editorSmallestPlanet)
				
				
				if(testR>planet_wars.editorSmallestPlanet)
				{
					planet_wars.objects[planet_wars.editorSelected].r = testR;
					planet_wars.objects[planet_wars.editorSelected].physics.dimensions = testR;
				}
			}
			break;
	}
	Render.renderViewport(planet_wars.editorViewPort,true,true);
}

planet_wars.editorMouseUp=function()
{
	if(!planet_wars.editorOpen)
	{
		return;
	}
	planet_wars.selectedObject=false;
	clearInterval(planet_wars.editorLoopMe);
	planet_wars.editorLoopMe=false;
	
	if(!planet_wars.checkMapPossible())
	{
		planet_wars.editorWarningDiv.style.display="block";
	}
	else
	{
		planet_wars.editorWarningDiv.style.display="none";
	}
	//Render.renderViewport(planet_wars.editorViewPort,true,true);
}

//open editing controls
planet_wars.openEditor = function(viewPort,hideThese,showThese)
{
	planet_wars.editorOpen=true;
	//store the viewport to use for the editor
	planet_wars.editorViewPort=viewPort;
	//divs to hide when opening editor
	planet_wars.editorHidden=hideThese;
	//divs to show when opening editor
	planet_wars.editorShown=showThese
	
	for(var i=0;i<planet_wars.editorHidden.length;i++)
	{
		document.getElementById(planet_wars.editorHidden[i]).style.display="none";
	}
	
	for(var i=0;i<planet_wars.editorShown.length;i++)
	{
		document.getElementById(planet_wars.editorShown[i]).style.display="block";
	}
	
    //planet_wars.preview.style.display = "none";
    //planet_wars.editor.style.display = "block";
    //planet_wars.editor_container.style.display = "block";
    //self.location.href = '#planet_wars_editor';
    Render.renderViewport(viewPort,true,true);
	planet_wars.selectTool("move");
}

//viewPort here is the one that will need re-drawing
planet_wars.closeEditor = function(viewPort)
{
	planet_wars.selectedObject=false;
	clearInterval(planet_wars.editorLoopMe);
	planet_wars.editorLoopMe=false;
	
	planet_wars.editorOpen=false;
	//planet_wars.editor.style.display="none";
//	planet_wars.editor_container.style.display="none";

	for(var i=0;i<planet_wars.editorHidden.length;i++)
	{
		document.getElementById(planet_wars.editorHidden[i]).style.display="block";
	}
	
	for(var i=0;i<planet_wars.editorShown.length;i++)
	{
		document.getElementById(planet_wars.editorShown[i]).style.display="none";
	}

	Render.renderViewport(viewPort);
}

planet_wars.selectTool=function(thisTool)
{
	planet_wars.selectedTool=thisTool;
}
