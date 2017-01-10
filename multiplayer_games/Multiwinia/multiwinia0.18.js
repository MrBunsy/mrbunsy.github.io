//Multiwinia Board Game
var MWBG = new Object();

//function called on page load.
MWBG.load=function()
  {
	MWBG.div=document.getElementById('MWBGdiv')
	
	//mouse move stuff
	MWBG.divPosX=MWBG.findPosX(MWBG.div)
	MWBG.divPosY=MWBG.findPosY(MWBG.div)
	
	//alert(MWBG.divPosY)
	//MWBG.divPosY=0
	
	MWBG.mouse=new Array(2)
	MWBG.div.onmousemove=MWBG.getMouse;
	
	MWBG.noSelect(MWBG.div)
	
	MWBG.width=parseFloat(document.getElementById('MWBGdiv').style.width)
	MWBG.height=parseFloat(document.getElementById('MWBGdiv').style.height)

	//add span for text
	MWBG.textSpan=document.getElementById('MWBGtextSpan')
	MWBG.menuSpan=document.getElementById('MWBGmenuSpan')
	
	MWBG.menuSpan.innerHTML+="<div id='MWBGeditordiv' style='display:none;position:absolute;margin-left:"+(MWBG.width)+";width:"+(MWBG.width*0.3)+";height:"+(MWBG.height*0.6)+";border:solid black 1px;'><h3>Editor</h3><span onClick='MWBG.openMainMenu();'>Back to Menu</span><br><br><span onClick='MWBG.changePlacing(0)' id='MWBGplace0'>Place Land</span><span id='MWBGplaceExtra0' style='display:none;'></span><br><span onClick='MWBG.changePlacing(1)' id='MWBGplace1'>Place Hill</span><span id='MWBGplaceExtra1' style='display:none;'></span><br><span onClick='MWBG.changePlacing(2)' id='MWBGplace2'>Place Blockage</span><span id='MWBGplaceExtra2' style='display:none;'><br><select id='MWBGblockType'><option value=0>Grey</option></select></span><br><span onClick='MWBG.changePlacing(3)' id='MWBGplace3'>Place Water</span><span id='MWBGplaceExtra3' style='display:none;'></span><br><span onClick='MWBG.changePlacing(5)' id='MWBGplace5'>Place Capture Area</span><span id='MWBGplaceExtra5' style='display:none;'><br><select id='MWBGcaptureNum'><option value=0>0</option><option value=1>1</option><option value=2>2</option><option value=3>3</option><option value=4>4</option><option value=5>5</option><option value=6>6</option></select></span><br><span onClick='MWBG.changePlacing(4)' id='MWBGplace4'>Place Spawn</span><span id='MWBGplaceExtra4' style='display:none;'><br><select id='MWBGspawnColour'><option value=0>Empty</option><option value=1>Red</option><option value=2>Yellow</option><option value=3>Green</option><option value=4>Blue</option></select></span><br><br><span onClick='MWBG.saveMap(true)'>Save Map</span><br><span onClick='MWBG.importMap()'>Import Map</span><br><br><span onClick='MWBG.mapCells=new Array();MWBG.makeCells();MWBG.drawBoard();MWBG.clearText();'>Clear Map</span><br><br><span onClick='MWBG.changeGridSize(1)'>More Cells</span><br><span onClick='MWBG.changeGridSize(-1)'>Less Cells</span></div>"
	
	MWBG.menuSpan.innerHTML+="<div id='MWBGgamediv' style='display:none;position:absolute;margin-left:"+(MWBG.width)+";width:"+(MWBG.width*0.3)+";height:"+(MWBG.height*0.6)+";border:solid black 1px;'><h3>MWBG</h3><span onClick='MWBG.openMainMenu();'>Quit Game</span><br><br><span id='MWBGwhosGo'></span><br><span id='MWBGturnStage'></span></div>"
	
	MWBG.div.style.fontFamily='Helvetica,Arial, "trebuchet MS",  sans-serif';
	
	MWBG.editorDiv=document.getElementById('MWBGeditordiv');
	MWBG.gameDiv=document.getElementById('MWBGgamediv');
	
	MWBG.whosGoSpan=document.getElementById('MWBGwhosGo');
	MWBG.turnStageSpan=document.getElementById('MWBGturnStage');
	
	MWBG.canvastag=document.getElementById('MWBGcanvas');
	MWBG.canvastag2=document.getElementById('MWBGcanvas2');
	
	MWBG.canvastag2.onmousedown=MWBG.mouseClick;
	
	MWBG.canvastag.style.position="absolute";
	MWBG.canvastag2.style.position="absolute";
	
	MWBG.canvas=new Array(2);
	
  if (MWBG.canvastag.getContext)
    {
    MWBG.canvas[0] = MWBG.canvastag.getContext('2d');
		MWBG.canvas[1] = MWBG.canvastag2.getContext('2d');
    }
	
	MWBG.cols=11
	MWBG.rows=12;
	MWBG.getWorldSize();
	
	
	/*
	if(row%2==0){var extraright=0;}else{var extraright=1;}
  x=c*gridwidth+extraright*width/2
  y=r*gridsize*1.5
	*/
	
	MWBG.makingMap=false;
	
	MWBG.openMainMenu()
	
  MWBG.mapCells=new Array();
	
	//MWBG.makeCells();
	//MWBG.drawBoard();
  }

//updates size to corrospond with div size and cols and rows
MWBG.getWorldSize=function()
  {
	MWBG.cellWidth=MWBG.width/(MWBG.cols+1)
	//length of a side
	MWBG.cellSize=MWBG.cellWidth/1.732
	
	MWBG.offsetX=MWBG.cellWidth/4;
	MWBG.offsetY=MWBG.cellSize;
	}
	
MWBG.openMainMenu=function()
  {
	MWBG.inGame=false;
	MWBG.makingMap=false;
	MWBG.editorDiv.style.display="none";
	MWBG.gameDiv.style.display="none";
	MWBG.clearText();
	MWBG.canvas[0].clearRect(0,0,MWBG.width,MWBG.height);
	MWBG.canvas[1].clearRect(0,0,MWBG.width,MWBG.height);
	
	//draw background
	for(var c=0;c<MWBG.cols;c++)
	  {
		for(var r=0;r<MWBG.rows;r++)
		  {
			var grey=r*(Math.random()-0.5)*30
			MWBG.canvas[0].fillStyle="rgba("+Math.round(15+grey)+","+Math.round(15+grey)+","+Math.round(15+grey)+",0.5)"
			MWBG.canvas[0].fillRect(c*(MWBG.width/MWBG.cols) , r*(MWBG.height/MWBG.rows) , MWBG.width/MWBG.cols , MWBG.height/MWBG.rows);
			}
		}
		
	//MWBG.drawMultiwinian([MWBG.width*3/4 , MWBG.height*3/4],MWBG.height/2,0,-Math.PI/8,"rgba(200,0,0,0.5)",0)
	//MWBG.drawMultiwinian([MWBG.width/8 , MWBG.height/4],MWBG.height/2,0,Math.PI/8,"rgba(0,200,0,0.5)",0)
	
	MWBG.drawMultiwinian([MWBG.width/2+MWBG.width/6 , MWBG.height/2+MWBG.height/6],MWBG.height*3/4,0,-Math.PI/8,"rgba(200,100,100,1)",0)
	
	MWBG.text('&nbsp;Welcome!<br><br><span onClick="MWBG.startGame()">&nbsp;&nbsp;Play</span><br><span onClick="MWBG.openEditor();">&nbsp;&nbsp;Make Map</span>',0,0.1,0.1,false)
	}
	
MWBG.player=function(name,colour)
  {
	this.name=name;
	this.colour=colour;
	
	switch(colour)
	  {
		case 1://red
		  this.rgb="rgb(255,0,0)";
			this.rgba="rgba(255,0,0,0.5)";
			this.hex="#ff0000";
		break;
		case 2://yellow
		  this.rgb="rgb(255,255,0)";
			this.rgba="rgba(255,255,0,0.5)";
			this.hex="#ffff00";
		break;
		case 3://green
		  this.rgb="rgb(0,100,0)";
			this.rgba="rgba(0,100,0,0.5)";
			this.hex="#00cc00";
		break;
		case 4://blue
		  this.rgb="rgb(0,0,255)";
			this.rgba="rgba(0,0,255,0.5)";
			this.hex="#0000ff";
		break;
		}
	}
	
MWBG.startGame=function()
  {
	MWBG.goNumber=0;
	
	//how many player have used their movement phase?
	MWBG.playersMoved=0;
	
	MWBG.mouseDowns=new Array();
	
	MWBG.inGame=true;
	//things on the board
	MWBG.peices=new Array();
	
	MWBG.loadMap([ [ 12, 13 ] , [[0,0,3,false] , [1,0,3,false] , [2,0,3,false] , [3,0,3,false] , [4,0,3,false] , [5,0,3,false] , [6,0,3,false] , [7,0,3,false] , [8,0,3,false] , [9,0,3,false] , [10,0,3,false] , [11,0,3,false] , [0,1,3,false] , [1,1,3,false] , [2,1,3,false] , [3,1,3,false] , [4,1,3,false] , [5,1,3,false] , [6,1,3,false] , [9,1,5,1] , [11,1,3,false] , [0,2,3,false] , [1,2,3,false] , [4,2,3,false] , [5,2,3,false] , [8,2,4,0] , [9,2,5,1] , [10,2,5,1] , [0,3,3,false] , [2,3,4,3] , [5,3,4,0] , [11,3,3,false] , [0,4,3,false] , [1,4,3,false] , [10,4,3,false] , [11,4,3,false] , [0,5,3,false] , [2,5,3,false] , [4,5,5,0] , [5,5,5,0] , [6,5,1,false] , [7,5,1,false] , [10,5,3,false] , [11,5,3,false] , [0,6,3,false] , [2,6,3,false] , [3,6,3,false] , [4,6,5,0] , [5,6,5,0] , [6,6,5,0] , [7,6,1,false] , [8,6,1,false] , [11,6,3,false] , [0,7,3,false] , [2,7,3,false] , [4,7,5,0] , [5,7,5,0] , [6,7,1,false] , [7,7,1,false] , [10,7,3,false] , [11,7,3,false] , [0,8,3,false] , [1,8,3,false] , [10,8,3,false] , [11,8,3,false] , [0,9,3,false] , [2,9,4,1] , [5,9,4,0] , [11,9,3,false] , [0,10,3,false] , [1,10,3,false] , [4,10,3,false] , [5,10,3,false] , [8,10,4,0] , [9,10,5,2] , [10,10,5,2] , [0,11,3,false] , [1,11,3,false] , [2,11,3,false] , [3,11,3,false] , [4,11,3,false] , [5,11,3,false] , [6,11,3,false] , [9,11,5,2] , [11,11,3,false] , [0,12,3,false] , [1,12,3,false] , [2,12,3,false] , [3,12,3,false] , [4,12,3,false] , [5,12,3,false] , [6,12,3,false] , [7,12,3,false] , [8,12,3,false] , [9,12,3,false] , [10,12,3,false] , [11,12,3,false]]])
	//MWBG.loadMap([ [ 11, 12 ] , [[3,2,4,1] , [4,2,4,3] , [7,2,4,1] , [8,2,4,2] , [2,3,4,1] , [3,3,4,1] , [2,4,4,1] , [3,4,4,1] , [5,4,4,0] , [1,5,4,1] , [2,5,4,1] , [2,6,4,1] , [3,6,4,1] , [1,7,4,1] , [2,7,4,1] , [2,8,4,1] , [3,8,4,4] , [4,8,4,2] , [7,8,4,4] , [8,8,4,3] , [1,9,4,1]]]);
	MWBG.gameDiv.style.display="block";
	
	MWBG.players=new Array();
	for(var i=0;i<MWBG.playerColours.length;i++)
	  {
		MWBG.players.push(new MWBG.player("Player "+i , MWBG.playerColours[i]))
		}
	
	MWBG.turnStage=0;//re-enforcements
	
	MWBG.selected=new Array();//any peices currently selected?
	
	MWBG.whosGo=Math.floor(Math.random()*MWBG.players.length);
	
	MWBG.whosGoSpan.innerHTML=MWBG.players[MWBG.whosGo].name
	MWBG.whosGoSpan.style.color=MWBG.players[MWBG.whosGo].hex
	
	MWBG.reinforcements();
	MWBG.drawPeices();
	
	//reset movement 'tickets'
	MWBG.resetMovements();
	
	MWBG.turnStage=1;//movement.
	MWBG.turnStageSpan.innerHTML="Movement Phase<br><br><b><span onClick='MWBG.endMovement()'>I've finished moving</span></b>"
	}
	
//called by player to end their movement phase.
MWBG.endMovement=function()
  {
	MWBG.playersMoved++
	if(MWBG.playersMoved<MWBG.players.length)
  	{
  	//change whos go to other player.
  	MWBG.whosGo++
  	MWBG.whosGo%=MWBG.players.length;	
		
  	MWBG.whosGoSpan.innerHTML=MWBG.players[MWBG.whosGo].name
  	MWBG.whosGoSpan.style.color=MWBG.players[MWBG.whosGo].hex
  	
  	MWBG.selected=new Array();//any peices currently selected?
  	}
	else
	  {
		MWBG.captureSpawns();
		//everyone has had a movement phase
		MWBG.playersMoved=0;
		MWBG.turnStage=2;//re-enforcements
		MWBG.selected=new Array();
		MWBG.reinforcements();
  	MWBG.drawPeices();
		MWBG.resetMovements();
		MWBG.turnStage=1;//movement.
  	MWBG.turnStageSpan.innerHTML="Movement Phase<br><br><b><span onClick='MWBG.endMovement()'>I've finished moving</span></b>"
		}
	}

//function to check for changes in ownership of spawns - run after battle phase.
MWBG.captureSpawns=function()
  {
	needReDraw=false;
	for(var i=0;i<MWBG.mapCells.length;i++)
	  {
		if(MWBG.mapCells[i].type==4 && MWBG.mapCells[i].peices.length>0)
		  {
			oldInfo=MWBG.mapCells[i].info
			//spawn currently has darwinians on top - turn it to this colour.
			MWBG.mapCells[i].info=MWBG.players[MWBG.peices[MWBG.mapCells[i].peices[0]].player].colour
			if(MWBG.mapCells[i].info!==oldInfo)
			  {
				needReDraw=true;
				}
			}
		else if(MWBG.mapCells[i].type==4 && MWBG.mapCells[i].peices.length==0 && MWBG.mapCells[i].info!==0)
		  {
			//spawn with nothing on top, but owned a player
			
			col=MWBG.mapCells[i].col;
			row=MWBG.mapCells[i].row;
			
			//array: [playerNum]=cells nearby owned
			nearBy=new Array(MWBG.players.length);
			teamWithMost=MWBG.getNumberFromColour(MWBG.mapCells[i].info);
			most=0;
			
			for(var i2=0;i2<nearBy.length;i2++)
			  {
				nearBy[i2]=0;
				}
			odd=(row%2==0)
			//check nearby cells
			for(var i2=0;i2<6;i2++)
			  {
				switch(i2)
				  {
					case 0://check LEFT
						checkMeCol=col-1;
						checkMeRow=row;
					break;
					case 1://check TOP LEFT
					  checkMeCol=col-(odd? 1 : 0);
						checkMeRow=row-1;
					break;
					case 2://check TOP RIGHT
					  checkMeCol=col+(odd? 0 : 1);
						checkMeRow=row-1;
					break;
					case 3://check RIGHT
					  checkMeCol=col+1;
						checkMeRow=row;
					break;
					case 4://check BOTTOM RIGHT
					  checkMeCol=col+(odd? 0 : 1);
						checkMeRow=row+1;
					break;
					case 5://check BOTTOM LEFT
					  checkMeCol=col-(odd? 1 : 0);
						checkMeRow=row+1;
					break;
					}
				checkCell=checkMeRow*MWBG.cols + checkMeCol;
				if(MWBG.mapCells[checkCell].peices.length>0)
				  {
					nearBy[MWBG.peices[MWBG.mapCells[checkCell].peices[0]].player]++;
					if(nearBy[MWBG.peices[MWBG.mapCells[checkCell].peices[0]].player] > most)
					  {
						most=nearBy[MWBG.peices[MWBG.mapCells[checkCell].peices[0]].player];
						teamWithMost=MWBG.peices[MWBG.mapCells[checkCell].peices[0]].player;
						}
					}
				}
			if(teamWithMost!==MWBG.getNumberFromColour(MWBG.mapCells[i].info))
			  {
				//the team with most cells surrounding the empty spawn will take the spawn.
				MWBG.mapCells[i].info=MWBG.players[teamWithMost].colour;
				needReDraw=true;
				}
			}
		}
	if(needReDraw)
	  {
		MWBG.drawBoard();
		}
	}
	
//resets how far something can move during movement phase
MWBG.resetMovements=function()
  {
	for(var i=0;i<MWBG.peices.length;i++)
	  {
		switch(MWBG.peices[i].type)
		  {
			case 0://darwinian
			  MWBG.peices[i].canMove=3;
			break;
			}
		}
	}
	
//add re-enforcements for the begging of a go.
MWBG.reinforcements=function()
  {
	
	//aray of arrays: [player NUMBER ][spawns , [spawn's cellnum]]
	var playersSpawns=new Array(MWBG.players.length);
	var mostSpawns=0;
	
	for(var i=0;i<playersSpawns.length;i++)
	  {
		playersSpawns[i]=new Array(2);
		playersSpawns[i][0]=0;
		playersSpawns[i][1]=new Array();
		}
	
	for(var i=0;i<MWBG.mapCells.length;i++)
	  {
		if(MWBG.mapCells[i].type==4 && MWBG.mapCells[i].info!==0)
		  {
			var playerNum=MWBG.getNumberFromColour(MWBG.mapCells[i].info)
			playersSpawns[playerNum][1].push(i)
			playersSpawns[playerNum][0]++;
			
			if(playersSpawns[playerNum][0] > mostSpawns)
			  {
				mostSpawns=playersSpawns[playerNum][0];
				}
			}
		}
	//player spawns now has the number of spawns for each colour - useful for rules on giving more MWGs
	
	for(var i=0;i<playersSpawns.length;i++)
	  {
		if(playersSpawns[i][0] < mostSpawns/2)
		  {
			//less than half of the number of the biggest player
			var giveMe=3;
			}
		else
		  {
			var giveMe=2;
			}
		//cycle through all the spawn points owned by this team
		for(var i2=0;i2<playersSpawns[i][1].length;i2++)
		  {
			//place darwinians here
  		for(var i3=0;i3<giveMe;i3++)
  		  {
				if(MWBG.mapCells[playersSpawns[i][1][i2]].peices.length<6)
  				{
  				//add to cell
  				MWBG.mapCells[playersSpawns[i][1][i2]].peices.push(MWBG.peices.length)
  				//make object
    			new MWBG.multiwinian(MWBG.mapCells[playersSpawns[i][1][i2]].row , MWBG.mapCells[playersSpawns[i][1][i2]].col , i)
  				}
  			}
			}
		}
	
	}
	
	
MWBG.getNumberFromColour=function(colour)
  {
	//player numbers and colours don't have to corrospond - convert a colour to a number
	//player numbers always start at 0 and go up to (total players) - 1 , player colours could be [1, 3].
	for(var p=0;p<MWBG.players.length;p++)
	  {
		if(MWBG.players[p].colour==colour)
		  {
			return p;
			}
		}
	return false;
	}
	
MWBG.multiwinian=function(col,row,player)
  {
	this.type=0;//multiwinia
	this.alive=true;
	this.inArmour=false;
	this.col=col;
	this.row=row;
	this.player=player;
	
	this.arrayPos=MWBG.peices.length;
	
	MWBG.peices.push(this);
	}
	
MWBG.changePlacing=function(placethis)
  {
	for(var i=0;i<6;i++)
	  {
		document.getElementById('MWBGplace'+i).style.fontWeight="normal";
		document.getElementById('MWBGplaceExtra'+i).style.display="none";
		}
	MWBG.placing=placethis;
	document.getElementById('MWBGplace'+placethis).style.fontWeight="bold";
	document.getElementById('MWBGplaceExtra'+placethis).style.display="inline";
	
	switch(placethis)
	  {
		case 2://block
		  MWBG.placingInfo=parseFloat(document.getElementById('MWBGblockType').value);
		break;
		case 4://spawn
		  MWBG.placingInfo=parseFloat(document.getElementById('MWBGspawnColour').value);
		break;
		case 5://capture area
		  MWBG.placingInfo=parseFloat(document.getElementById('MWBGcaptureNum').value);
		break;
		default:
		  MWBG.placingInfo=false;
		break;
		}	
	}
	
//change size of grid in editor
MWBG.changeGridSize=function(bythis)
  {
	oldMap=MWBG.saveMap(false);
	
	MWBG.cols+=bythis;
	MWBG.rows+=bythis;
	MWBG.getWorldSize();
	
	oldMap[0]=[MWBG.cols,MWBG.rows];
	
	MWBG.loadMap(oldMap)
	}
	
MWBG.openEditor=function()
  {
  MWBG.changePlacing(0)
	MWBG.makingMap=true;
	MWBG.clearText();
	MWBG.makeCells();
	MWBG.drawBoard();
	MWBG.editorDiv.style.display="block";
	}
	
//used in editor to edit a saved map.
MWBG.importMap=function()
  {
	MWBG.text('<div style="background-color:white;z-index:4;border:solid black 1px;"><h3>Paste saved level here.</h3><textarea id="MWBGloadtextarea" cols="60" rows="15"></textarea><br><b><span class="clickme" onClick="MWBG.loadMap(eval(document.getElementById(\'MWBGloadtextarea\').value));">Load</span></b> - <b><span class="clickme" onClick="MWBG.clearText();">Back to Editor</span></b></div>',0,0.2,0.03,true)
  MWBG.highlighttext('MWBGloadtextarea')
	}
	
MWBG.loadMap=function(thisMap)
  {
	MWBG.savedDistances=new Array();
	
	MWBG.cols=thisMap[0][0];
	MWBG.rows=thisMap[0][1];
	
	MWBG.playerColours=new Array();
	
	MWBG.getWorldSize();
	
	MWBG.mapCells=new Array();
	MWBG.makeCells();
	
	for(var i=0;i<thisMap[1].length;i++)
	  {
		if(thisMap[1][i][1]*MWBG.cols + thisMap[1][i][0] < MWBG.mapCells.length)
  		{
			//if on the map (otherwise crashes when using Less Cells in editor)
  		MWBG.mapCells[ thisMap[1][i][1]*MWBG.cols + thisMap[1][i][0]].make(thisMap[1][i][2] , thisMap[1][i][3]);
			
			if(thisMap[1][i][2] == 4 && thisMap[1][i][3]!==0)
			  {
				//if type is a spawn and not empty build up playerColours array
				General.addtoifnotin(thisMap[1][i][3],MWBG.playerColours)
				}
			
  		}
		}
	MWBG.clearText();
	MWBG.drawBoard();
	}
	
MWBG.saveMap=function(text)
  {
	//save array: [0]=[cols,rows], [1]=[ [col,row,type,info]  , ... ]
	
	var saveArray=new Array(2);
	var saveText='[ [ '+(MWBG.cols)+', '+(MWBG.rows)+' ] , [';
	saveArray[0]=[MWBG.cols,MWBG.rows];
	saveArray[1]=new Array();
	
	var cellsadded=0;
	
	for(var i=0;i<MWBG.mapCells.length;i++)
	  {
		if(MWBG.mapCells[i].type!==0)
		  {
			
			//if not land
			saveArray[1].push([ MWBG.mapCells[i].col , MWBG.mapCells[i].row , MWBG.mapCells[i].type , MWBG.mapCells[i].info ])
			if(cellsadded>0)
			  {
				saveText+=" , ";
				}
			saveText+='['+(MWBG.mapCells[i].col)+","+(MWBG.mapCells[i].row)+","+MWBG.mapCells[i].type+","
			if(typeof MWBG.mapCells[i].info == 'object')
			  {
				saveText+="["
				for(var i2=0;i2<MWBG.mapCells[i].info.length;i2++)
				  {
					saveText+=MWBG.mapCells[i].info[i2]
					if(i2<MWBG.mapCells[i].info.length-1)
					  {
						saveText+=",";
						}
					}
				saveText+="]";
				}
			else
			  {
				saveText+=MWBG.mapCells[i].info+"]"
				}
			cellsadded++;
			}
		}
	saveText+="]]";
	
	//are we bringing up the save window or using this internally?
	if(text)
  	{	
  	MWBG.text('<div style="background-color:white;z-index:4;border:solid black 1px;"><h3>Copy this text to save your level.</h3><textarea id="MWBGsavetextarea" cols="60" rows="15"></textarea><br><b><span class="clickme" onClick="MWBG.openMainMenu();">Back to Main Menu</span></b> - <b><span class="clickme" onClick="MWBG.clearText();">Back to Editor</span></b></div>',0,0.2,0.03,true)
  	document.getElementById('MWBGsavetextarea').value=saveText;
    MWBG.highlighttext('MWBGsavetextarea')
    }
	else
	  {
		return saveArray;
		}
	}

MWBG.highlighttext=function(thisdiv)
  {
  document.getElementById(thisdiv).focus();
  document.getElementById(thisdiv).select();
  }
	
	
MWBG.clearText=function()
  {
	MWBG.textSpan.innerHTML=''
	}
	
MWBG.text=function(html,left,top,size,centre)
  {
	//create html
	if(centre)
	  {
			MWBG.textSpan.innerHTML+="<div style='position:absolute;width:"+(MWBG.width)+";margin-top:"+(top*MWBG.height)+"px;z-index:2;font-size:"+(MWBG.height*size)+"px;'><center>"+html+"</center></div>";
		}
  else
	  {
			MWBG.textSpan.innerHTML+="<div style='position:absolute;margin-left:"+(left*MWBG.width)+"px;margin-top:"+(top*MWBG.height)+"px;z-index:2;font-size:"+(MWBG.height*size)+"px;'>"+html+"</div>";
		}
	}
	
MWBG.cell=function(col,row,Xs,Ys,type,info)
  {
  this.col=col;
  this.row=row;
  //cell types, 0=land (info:tree?), 1=hill, 2=block (info:type of block), 3=water, 4=spawn (info:colour), 5=capture area (info: which area)
  this.type=type;
  //extra info for cell type. (0=empty, 1=red, 2=yellow, 3=green, 4=blue)
	this.info=info;
  
	//for polygon collision detection
  this.Xs=Xs;
  this.Ys=Ys;
  
	//peices (arraynum) on the cell.
	this.peices=new Array();
	
  this.draw=MWBG.drawCell;
  this.make=MWBG.makeCellType;
	
	this.make(type,info)
	
  MWBG.mapCells.push(this);
  }

//update type of cell.
MWBG.makeCellType=function(thistype,info)
  {
	this.type=thistype;
	this.info=info;
	switch(thistype)
	  {
		case 0://land
  		this.tree=this.info;
  		this.colour="rgb(72,"+(184+Math.round( (Math.random()-0.5)*40 ))+",37)";
		break;
		case 1://hill
		  this.colour="rgb(32,"+(100+Math.round( (Math.random()-0.5)*40 ))+",0)";
		break;
		case 2://block
		  this.colour="rgb(96,96,96)";
		break;
		case 3://water
		  this.colour="rgb(35,114,"+(186+Math.round( (Math.random()-0.5)*40 ))+")";
		break;
		case 4://spawn
		  this.colour="rgb(200,165,32)";
		break;
		case 5://capture area
		  this.colour="rgb(248,174,71)";
		break;
		}
	}
	
MWBG.makeCells=function()
  {
	
	
	for(var r=0;r<MWBG.rows;r++)
    {
    for(var c=0;c<MWBG.cols;c++)
      {
      if(r%2==0)
			  {
				var extraright=0;
				}
			else
			  {
				var extraright=1;
				}
      new MWBG.cell(c,r,[c*MWBG.cellWidth+extraright*MWBG.cellWidth/2+MWBG.offsetX , c*MWBG.cellWidth+extraright*MWBG.cellWidth/2+MWBG.offsetX , c*MWBG.cellWidth+extraright*MWBG.cellWidth/2+MWBG.cellWidth/2+MWBG.offsetX , c*MWBG.cellWidth+extraright*MWBG.cellWidth/2+MWBG.cellWidth+MWBG.offsetX , c*MWBG.cellWidth+extraright*MWBG.cellWidth/2+MWBG.cellWidth+MWBG.offsetX , c*MWBG.cellWidth+extraright*MWBG.cellWidth/2+MWBG.cellWidth/2+MWBG.offsetX] , [ MWBG.cellSize/2+r*MWBG.cellSize*1.5+MWBG.offsetY , MWBG.cellSize/2+r*MWBG.cellSize*1.5+MWBG.cellSize+MWBG.offsetY , MWBG.cellSize/2+r*MWBG.cellSize*1.5+MWBG.cellSize*1.5+MWBG.offsetY , MWBG.cellSize/2+r*MWBG.cellSize*1.5+MWBG.cellSize+MWBG.offsetY , MWBG.cellSize/2+r*MWBG.cellSize*1.5+MWBG.offsetY , MWBG.cellSize/2+r*MWBG.cellSize*1.5-MWBG.cellSize/2+MWBG.offsetY],0,false);
      }
    }
	
	}
	
	
	
MWBG.drawCell=function()
  {
	
	if(this.row%2==0){var extraright=0;}else{var extraright=1;}
  x=MWBG.offsetX + this.col*MWBG.cellWidth+extraright*MWBG.cellWidth/2
  y=MWBG.offsetY + MWBG.cellSize/2 + this.row*MWBG.cellSize*1.5
	
	MWBG.drawhexagon(x,y,MWBG.cellSize,MWBG.cellWidth,this.colour,0)
	
	/*
	MWBG.canvas[0].beginPath();
	MWBG.canvas[0].moveTo(this.Xs[this.Xs.length-1] , this.Ys[this.Ys.length-1]);
	MWBG.canvas[0].lineTo(this.Xs[0] , this.Ys[0])
	
	for(var i=0;i<this.Xs.length;i++)
	  {
		MWBG.canvas[0].lineTo(this.Xs[i] , this.Ys[i])
		}
	MWBG.canvas[0].stroke();
	*/
	
	switch(this.type)
	  {
		case 4://spawn
		MWBG.canvas[0].save();
		  switch(this.info)
			  {
				case 0://no-one - grey
				  MWBG.canvas[0].strokeStyle="rgb(96,96,96)";
				break;
				case 1://red
				  MWBG.canvas[0].strokeStyle="rgb(255,0,0)";
				break;
				case 2://yellow
				  MWBG.canvas[0].strokeStyle="rgb(255,255,0)";
				break;
				case 3://green
				  MWBG.canvas[0].strokeStyle="rgb(0,100,0)";
				break;
				case 4://blue
				  MWBG.canvas[0].strokeStyle="rgb(0,0,255)";
				break;
				}
			
		  MWBG.canvas[0].beginPath();
			MWBG.canvas[0].lineWidth=MWBG.cellWidth/30
			MWBG.canvas[0].moveTo(x+MWBG.cellWidth-MWBG.cellWidth/30, y+MWBG.cellSize/2)
			MWBG.canvas[0].arc(x+MWBG.cellWidth/2 , y+MWBG.cellSize/2 , MWBG.cellWidth/2-MWBG.cellWidth/30 , 0 , Math.PI*2 , false);
			MWBG.canvas[0].stroke();
			MWBG.canvas[0].restore();
		break;
		case 5:
		  if(MWBG.inEditor)
  			{
  		  MWBG.text(this.info,x/MWBG.width,y/MWBG.height,MWBG.cellSize/MWBG.height,false)
  			}
		break;
		}
	}

MWBG.drawhexagon=function(x,y,gridsize,width,fillstyle,layer)
  {
	/*
  reg hexagons:
     / \      |d        |
   /     \		|					|
  |*      |     |x			|height
  |<width>|			|				|
   \     /							|
     \ / 								|
  x = width/ root 3 = gridsize
  d = x/2
  height= (2 / root3) * width
	height taking into account overlapping = width * root3 / 2
  */
	
	
	
  if(fillstyle!==false)
    {
    MWBG.canvas[layer].fillStyle=fillstyle;
    MWBG.canvas[layer].beginPath();
    MWBG.canvas[layer].moveTo(Math.round(x)-0.5 , Math.round( y))//starting at * on diagram
    MWBG.canvas[layer].lineTo(Math.round(x)-0.5 , Math.round( y + gridsize))//moving down
    MWBG.canvas[layer].lineTo(Math.round(x+width/2)-0.5 , Math.round( y + gridsize*1.5))//moving down and right to bottom point
    MWBG.canvas[layer].lineTo(Math.round(x+width)-0.5 , Math.round( y + gridsize))//moving up and right.
    MWBG.canvas[layer].lineTo(Math.round(x+width)-0.5 , Math.round(y) )//moving up
    MWBG.canvas[layer].lineTo(Math.round(x+width/2)-0.5 , Math.round( y - gridsize/2))//moving up to point at top
    MWBG.canvas[layer].lineTo(Math.round(x)-0.5 , Math.round(y))//back to *
    MWBG.canvas[layer].fill();
    }
  
  MWBG.canvas[layer].beginPath();
  MWBG.canvas[layer].moveTo(Math.round(x)-0.5 , Math.round(y))//starting at * on diagram
  MWBG.canvas[layer].lineTo(Math.round(x)-0.5 , Math.round( y + gridsize))//moving down
  MWBG.canvas[layer].lineTo(Math.round(x+width/2)-0.5 , Math.round( y + gridsize*1.5))//moving down and right to bottom point
  MWBG.canvas[layer].lineTo(Math.round(x+width)-0.5 , Math.round( y + gridsize))//moving up and right.
  MWBG.canvas[layer].lineTo(Math.round(x+width)-0.5 , Math.round(y) )//moving up
  MWBG.canvas[layer].lineTo(Math.round(x+width/2)-0.5 , Math.round( y - gridsize/2))//moving up to point at top
  MWBG.canvas[layer].lineTo(Math.round(x)-0.5 , Math.round( y))//back to *
  MWBG.canvas[layer].stroke();
  }
	
	
MWBG.drawBoard=function()
  {
	MWBG.canvas[0].clearRect(0,0,MWBG.width,MWBG.height);
	for(var i=0;i<MWBG.mapCells.length;i++)
	  {
		MWBG.mapCells[i].draw();
		}
	}
	
	
MWBG.drawPeices=function()
  {
	MWBG.canvas[1].clearRect(0,0,MWBG.width,MWBG.height);
	MWBG.mouseDowns=new Array();
	
	//highlight cells if a darwinian is highlighted
	if(MWBG.selected.length>0)
	  {
		var canMoves=new Array();
		for(var i=0;i<MWBG.selected.length;i++)
		  {
			canMoves.push(MWBG.peices[MWBG.selected[i]].canMove)
			}
		var smallestMove=General.getLowest(canMoves);
		for(var i=0;i<MWBG.mapCells.length;i++)
		  {
			if(MWBG.cellDistance(MWBG.selectedFrom,i,false) <= smallestMove)
			  {
				if(MWBG.mapCells[i].row%2==0){var extraright=0;}else{var extraright=1;}
        x=MWBG.offsetX + MWBG.mapCells[i].col*MWBG.cellWidth+extraright*MWBG.cellWidth/2
        y=MWBG.offsetY + MWBG.cellSize/2 + MWBG.mapCells[i].row*MWBG.cellSize*1.5
      	
      	//MWBG.drawhexagon(x,y,MWBG.cellSize,MWBG.cellWidth,MWBG.players[MWBG.peices[MWBG.selected[0]].player].rgba,1)
				MWBG.drawhexagon(x,y,MWBG.cellSize,MWBG.cellWidth,"rgba(170,240,255,0.25)",1)
				}
			}
		}
	
	
	for(var i=0;i<MWBG.mapCells.length;i++)
	  {
		/*
		draw darwinians in a cross shape - one in centre, one above, below, left and right.
		x=MWBG.offsetX + this.col*MWBG.cellWidth+extraright*MWBG.cellWidth/2
  y=MWBG.offsetY + MWBG.cellSize/2 + this.row*MWBG.cellSize*1.5
		
		*/
		if(MWBG.mapCells[i].row%2==0){var extraright=0;}else{var extraright=1;}
		var centreX=MWBG.offsetX + MWBG.mapCells[i].col*MWBG.cellWidth+extraright*MWBG.cellWidth/2 + MWBG.cellWidth/2;
		var centreY=MWBG.offsetY + MWBG.cellSize + MWBG.mapCells[i].row*MWBG.cellSize*1.5;
		
		tempHeight=MWBG.cellSize/3;
		
		
		var cellCount=MWBG.mapCells[i].peices.length
		for(var i2=0;i2<cellCount;i2++)
		  {
			tempColour=MWBG.players[MWBG.peices[MWBG.mapCells[i].peices[i2]].player].rgb
			switch(i2)
			  {
				case 0://middle
				  tempX=centreX;
					tempY=centreY;
				break;
				case 1://left
				  tempX=centreX-MWBG.cellSize/2;
					tempY=centreY;
				break;
				case 2://right
				  tempX=centreX+MWBG.cellSize/2;
					tempY=centreY;
				break;
				case 3://top
				  tempX=centreX;
					tempY=centreY-MWBG.cellSize/2;
				break;
				case 4://bottom
				  tempX=centreX;
					tempY=centreY+MWBG.cellSize/2;
				break;
				//below only used potentially:
				case 5://top left
				  tempX=centreX-MWBG.cellSize/2;
					tempY=centreY-MWBG.cellSize/2;
				break;
				case 6://top right
				  tempX=centreX-MWBG.cellSize/2;
					tempY=centreY-MWBG.cellSize/2;
				break;
				}
			
			if(General.inarray(MWBG.mapCells[i].peices[i2] , MWBG.selected))
			  {
				//this peice is selected - add outline
				//MWBG.drawMultiwinian([tempX,tempY],tempHeight+3,0,0,"rgb(0,0,0)",1)
				tempColour="rgb(170,240,255)";
				}
			
			MWBG.drawMultiwinian([tempX,tempY],tempHeight,0,0,tempColour,1)
			new MWBG.mouseDown(tempX-tempHeight/2 , tempY-tempHeight/2 , tempHeight , tempHeight , 0 , [i,i2])
			}
		}
	
	
		/*
		if(MWBG.mapCells[MWBG.selectedFrom].row%2==0){var extraright=0;}else{var extraright=1;}
		var centreX=MWBG.offsetX + MWBG.mapCells[MWBG.selectedFrom].col*MWBG.cellWidth+extraright*MWBG.cellWidth/2 + MWBG.cellWidth/2;
		var centreY=MWBG.offsetY + MWBG.cellSize + MWBG.mapCells[MWBG.selectedFrom].row*MWBG.cellSize*1.5;
		
		MWBG.canvas[1].save();
		MWBG.canvas[1].strokeStyle=MWBG.players[MWBG.peices[MWBG.selected[0]].player].rgb;
		MWBG.canvas[1].beginPath();
		MWBG.canvas[1].moveTo(centreX+MWBG.cellWidth/2 + MWBG.cellWidth*smallestMove , centreY)
		MWBG.canvas[1].arc(centreX , centreY , MWBG.cellWidth/2 + MWBG.cellWidth*smallestMove , 0 , Math.PI*2 ,false )
		MWBG.canvas[1].stroke();
		MWBG.canvas[1].restore();
		*/
		
		
	}
	
MWBG.drawMultiwinian=function(pos,height,angle1,angle2,colour,layer)
  {
	MWBG.canvas[layer].fillStyle=colour
	
	//angle 1 controls how thin the darwinians are
	squished=Math.cos(angle1)
	//squished=1;
	
	tempDist=height/32
	pi=Math.PI;
	
	MWBG.canvas[layer].beginPath();
	//top right of head
	MWBG.canvas[layer].moveTo(pos[0] + Math.cos(-0.43*pi+angle2)*16.4*tempDist*squished , pos[1] + Math.sin(-0.43*pi+angle2)*16.4*tempDist);
	//top left of right arm
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(-0.38*pi+angle2)*9.7*tempDist*squished , pos[1] + Math.sin(-0.38*pi+angle2)*9.7*tempDist);
	//top right of right arm
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(-0.16*pi+angle2)*18.4*tempDist*squished , pos[1] + Math.sin(-0.16*pi+angle2)*18.4*tempDist);
	//bottom right of right arm
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(-0.08*pi+angle2)*16.5*tempDist*squished , pos[1] + Math.sin(-0.08*pi+angle2)*16.5*tempDist);
	//bottom of right arm
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(-0.27*pi+angle2)*5.3*tempDist*squished , pos[1] + Math.sin(-0.27*pi+angle2)*5.3*tempDist);
	//top left of right leg
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(0.09*pi+angle2)*3.6*tempDist*squished , pos[1] + Math.sin(0.09*pi+angle2)*3.6*tempDist);
	//top right of right leg
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(0.03*pi+angle2)*9.6*tempDist*squished , pos[1] + Math.sin(0.03*pi+angle2)*9.6*tempDist);
	//bottom right of right leg
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(0.33*pi+angle2)*18.6*tempDist*squished , pos[1] + Math.sin(0.33*pi+angle2)*18.6*tempDist);
	//bottom left of right leg
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(0.43*pi+angle2)*16.4*tempDist*squished , pos[1] + Math.sin(0.43*pi+angle2)*16.4*tempDist);
	//inside of right leg
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(0.33*pi+angle2)*6.9*tempDist*squished , pos[1] + Math.sin(0.33*pi+angle2)*6.9*tempDist);
	
	//inside of left leg
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(pi-0.33*pi+angle2)*6.9*tempDist*squished , pos[1] + Math.sin(pi-0.33*pi+angle2)*6.9*tempDist);
	//bottom right of left leg
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(pi-0.43*pi+angle2)*16.4*tempDist*squished , pos[1] + Math.sin(pi-0.43*pi+angle2)*16.4*tempDist);
	//bottom left of left leg
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(pi-0.33*pi+angle2)*18.6*tempDist*squished , pos[1] + Math.sin(pi-0.33*pi+angle2)*18.6*tempDist);
	//top left of left leg
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(pi-0.03*pi+angle2)*9.6*tempDist*squished , pos[1] + Math.sin(pi-0.03*pi+angle2)*9.6*tempDist);
	//top right of left leg
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(pi-0.09*pi+angle2)*3.6*tempDist*squished , pos[1] + Math.sin(pi-0.09*pi+angle2)*3.6*tempDist);
	//bottom of left arm
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(pi+0.27*pi+angle2)*5.3*tempDist*squished , pos[1] + Math.sin(pi+0.27*pi+angle2)*5.3*tempDist);
	//bottom left of left arm
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(pi+0.08*pi+angle2)*16.5*tempDist*squished , pos[1] + Math.sin(pi+0.08*pi+angle2)*16.5*tempDist);
	//top left of left arm
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(pi+0.16*pi+angle2)*18.4*tempDist*squished , pos[1] + Math.sin(pi+0.16*pi+angle2)*18.4*tempDist);
	//top right of left arm
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(pi+0.38*pi+angle2)*9.7*tempDist*squished , pos[1] + Math.sin(pi+0.38*pi+angle2)*9.7*tempDist);
	//top left of head
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(pi+0.43*pi+angle2)*16.4*tempDist*squished , pos[1] + Math.sin(pi+0.43*pi+angle2)*16.4*tempDist);
	//top right of head
	MWBG.canvas[layer].lineTo(pos[0] + Math.cos(-0.43*pi+angle2)*16.4*tempDist*squished , pos[1] + Math.sin(-0.43*pi+angle2)*16.4*tempDist);
	
	MWBG.canvas[layer].fill();
	}

MWBG.mouseClick=function()
  {
	if(MWBG.makingMap)
	  {
		//update placingInfo
		MWBG.changePlacing(MWBG.placing);
		
		var thisCell=MWBG.findCell();
		MWBG.mapCells[thisCell].make(MWBG.placing,MWBG.placingInfo);
		MWBG.drawBoard();
	  }
	else if(MWBG.inGame)
	  {
		switch(MWBG.turnStage)
  		{
  		case 1://moving
    		var thisCell=MWBG.findCell();
    		
    		//in-game
    		if(MWBG.selected.length>0 && MWBG.selectedFrom!==thisCell)
      		{
      		//we've already selected something and have just clicked elsewhere
    			var howFar=MWBG.cellDistance(MWBG.selectedFrom,thisCell,false)
					
					for(var i=0;i<MWBG.selected.length;i++)
  					{
  					if(howFar <= MWBG.peices[MWBG.selected[i]].canMove)
						  {
							//take away movement tokens
							MWBG.peices[MWBG.selected[i]].canMove-=howFar;
							//move peice
							MWBG.peices[MWBG.selected[i]].col=MWBG.mapCells[thisCell].col;
							MWBG.peices[MWBG.selected[i]].row=MWBG.mapCells[thisCell].row;
							//take peice out of old cell's array and put into new cell.
							MWBG.mapCells[MWBG.selectedFrom].peices=General.removeFromArray(MWBG.selected[i],MWBG.mapCells[MWBG.selectedFrom].peices);
							MWBG.mapCells[thisCell].peices.push(MWBG.selected[i]);
							}
  					}
					MWBG.selected=new Array();
					MWBG.selectedFrom=false;
					MWBG.drawPeices();
      		}
    		else
    		  {
    			//selecting something
    			if(MWBG.findmouseDown())
    			  {
    				//record cell selected FROM
    				MWBG.selectedFrom=MWBG.mouseDowns[MWBG.clicked].info[0]
						var selectThis=MWBG.mapCells[MWBG.mouseDowns[MWBG.clicked].info[0]].peices[MWBG.mouseDowns[MWBG.clicked].info[1]]
						
						if(General.inarray(selectThis,MWBG.selected))
						  {
							//already been selected - deselect
							General.removeFromArray(selectThis,MWBG.selected)
							}
						else
						  {
							//add peice ID to selection array
							if(MWBG.peices[selectThis].player==MWBG.whosGo)
  							{
								//only select if they're the same team.
      					MWBG.selected.push(selectThis)				
  							}
							}
    				
    				MWBG.drawPeices();
    				}
    			else
    			  {
    				//nothing selected or something selected, but just clicked on cell they came from.
						if(MWBG.selected.length==0 && MWBG.mapCells[thisCell].peices.length>0 && MWBG.peices[MWBG.mapCells[thisCell].peices[0]].player==MWBG.whosGo)
  						{
  						MWBG.selectedFrom=thisCell;
    					MWBG.selected=MWBG.selected.concat(MWBG.mapCells[thisCell].peices)
    					MWBG.drawPeices();
  						}
						else
						  {
      				//de-select everything
      				MWBG.selected=new Array();
      				MWBG.drawPeices();
  						}
    				}
			  break;
				}
			}
		
		}
	}
	
//save distances so as to not need to re-calculate the same one again
MWBG.savedDistance=function(cell1,cell2,water,distance)
  {
	if(cell1<cell2){smallCell=cell1;bigCell=cell2;}else{smallCell=cell2;bigCell=cell1;}
	
	this.smallCell=smallCell;
	this.bigCell=bigCell;
	this.water=water;
	this.distance=distance;
	
	MWBG.savedDistances.push(this);
	}
	
//check to see if a distance has already been measured.
MWBG.findSavedDistance=function(cell1,cell2,water)
  {
	if(cell1<cell2){smallCell=cell1;bigCell=cell2;}else{smallCell=cell2;bigCell=cell1;}
	
	for(var s=0;s<MWBG.savedDistances.length;s++)
	  {
		if(MWBG.savedDistances[s].smallCell==smallCell && MWBG.savedDistances[s].bigCell==bigCell && MWBG.savedDistances[s].water==water)
		  {
			MWBG.distanceWanted=MWBG.savedDistances[s].distance;
			return true;
			}
		}
	return false;
	}
	
//water: true=can go over water, false=can't.
MWBG.cellDistance=function(cell1,cell2,water)
  {
	//if distance has already been measured, don't measure again.
	/*if(MWBG.findSavedDistance(cell1,cell2,water))
	  {
		return MWBG.distanceWanted;
		}*/
	
	if(cell1==cell2)
	  {
		return 0;
		}
	
	//set all distances to false.  distance=number is distance from cell1, distance=false means this cell can't be traveled.
	for(var i=0;i<MWBG.mapCells.length;i++)
	  {
		MWBG.mapCells[i].distanceFrom=false;
		}
	
	//set cell 1 to be 0 away from itself.
	MWBG.mapCells[cell1].distanceFrom=0;
	
	//var cellsChecked=0;
	var keepGoing=true;
	//keep going until we have got routes to all cells surrounding cell2
	while(keepGoing)
	  {
		//alert('pop')
		//go through all cells
		for(var i=0;i<MWBG.mapCells.length;i++)
		  {
			row=MWBG.mapCells[i].row;
			col=MWBG.mapCells[i].col;
			nearCellsChecked=0;
			var odd=(row%2==0);//true or false
			
			//check nearby cells
			for(var i2=0;i2<6;i2++)
			  {
				switch(i2)
				  {
					case 0://check LEFT
						checkMeCol=col-1;
						checkMeRow=row;
					break;
					case 1://check TOP LEFT
					  checkMeCol=col-(odd? 1 : 0);
						checkMeRow=row-1;
					break;
					case 2://check TOP RIGHT
					  checkMeCol=col+(odd? 0 : 1);
						checkMeRow=row-1;
					break;
					case 3://check RIGHT
					  checkMeCol=col+1;
						checkMeRow=row;
					break;
					case 4://check BOTTOM RIGHT
					  checkMeCol=col+(odd? 0 : 1);
						checkMeRow=row+1;
					break;
					case 5://check BOTTOM LEFT
					  checkMeCol=col-(odd? 1 : 0);
						checkMeRow=row+1;
					break;
					}
				
				//check row and col is in-range:
				if(checkMeCol>=0 && checkMeCol < MWBG.cols && checkMeRow>=0 && checkMeRow < MWBG.rows && MWBG.mapCells[checkMeRow*MWBG.cols + checkMeCol].distanceFrom!==false)
				  {
					//only if cell is on board and got a distance
					switch(MWBG.mapCells[i].type)
					  {
						case 0://normal land
    					weight=1;
						break;
						case 1://hill
						  weight=2;
						break;
						case 2://block
						  weight=10000;
						break;
						case 3://water
						  if(water)
							  {
								weight=1;
								}
							else
							  {
								weight=10000;
								}
						break;
						default:
						  weight=1;
						break;
					  }
					if(MWBG.mapCells[i].peices.length>0 && MWBG.peices[MWBG.mapCells[i].peices[0]].player!==MWBG.whosGo)
					  {
						//other team occupies this cell
						weight=10000;
						}
					//weight of 10000 is essentially impassable.
					
					if(MWBG.mapCells[i].distanceFrom===false || MWBG.mapCells[checkMeRow*MWBG.cols + checkMeCol].distanceFrom + weight < MWBG.mapCells[i].distanceFrom)
  					{
  					MWBG.mapCells[i].distanceFrom=MWBG.mapCells[checkMeRow*MWBG.cols + checkMeCol].distanceFrom + weight;
						}
					}
					
				if(i == cell2 && ( checkMeCol<0 || checkMeCol >= MWBG.cols || checkMeRow<0 || checkMeRow >= MWBG.rows || MWBG.mapCells[checkMeRow*MWBG.cols + checkMeCol].distanceFrom!==false ))
  			  {
  				//we're checking the cell we want the distance TO, this will stop looping once it's got distances from surrounding cells. (or they're off screen)
  				nearCellsChecked++
  				}
				
				}
			if(nearCellsChecked==6)
			  {
				//all 6 surrounding cells of cell2 have distances
				keepGoing=false;
				}
			}
		}
	/*	
	//displays weightings on all cells for debugging:
	for(var i=0;i<MWBG.mapCells.length;i++)
	  {
		row=MWBG.mapCells[i].row;
		col=MWBG.mapCells[i].col;
		
		if(row%2==0){var extraright=0;}else{var extraright=1;}
    x=MWBG.offsetX + MWBG.mapCells[i].col*MWBG.cellWidth+extraright*MWBG.cellWidth/2 + MWBG.cellWidth/2
    y=MWBG.offsetY + MWBG.cellSize/2 + MWBG.mapCells[i].row*MWBG.cellSize*1.5
    MWBG.text(MWBG.mapCells[i].distanceFrom,x/MWBG.width,y/MWBG.height,MWBG.cellSize*0.5/MWBG.height,false)
		}
	*/
	
	new MWBG.savedDistance(cell1,cell2,water,MWBG.mapCells[cell2].distanceFrom);
		
	return MWBG.mapCells[cell2].distanceFrom;
	}
	
//find the cell the mouse is in
MWBG.findCell=function()
  {
	for(var i=0;i<MWBG.mapCells.length;i++)
	  {
		if(inpoly(MWBG.mouse[0] , MWBG.mouse[1] , MWBG.mapCells[i].Xs , MWBG.mapCells[i].Ys))
		  {
			return i;
			}
		}
	return false;
	}
	
/*

types: 0=peice (info: [ cell, peice in cell ])

*/

//square area of the playing area which can be clicked on.  dimensions in PIXELS, x,y = top left
MWBG.mouseDown=function(x,y,w,h,type,info)
  {
	this.x=x;
	this.y=y;
	this.w=w;
	this.h=h;
	this.type=type;
	this.info=info;
	MWBG.mouseDowns.push(this);
	}
	
MWBG.findmouseDown=function()
  {
	for(var i=0;i<MWBG.mouseDowns.length;i++)
		{
		
		if(MWBG.mouse[0] > MWBG.mouseDowns[i].x && MWBG.mouse[0] < MWBG.mouseDowns[i].x+MWBG.mouseDowns[i].w && MWBG.mouse[1] > MWBG.mouseDowns[i].y && MWBG.mouse[1] < MWBG.mouseDowns[i].y+MWBG.mouseDowns[i].h)
			{
			//mouse is inside the square.
			MWBG.clicked=i;
			return true;
		  }
	  }
	return false;
	}
	
MWBG.getMouse=function(e)
  {//if(IE){
	if(document.all)
	  {
		//grab the x-y pos.s if browser is IE
		MWBG.mouse[0] = event.clientX + document.body.scrollLeft - MWBG.divPosX;
		MWBG.mouse[1] = event.clientY + document.body.scrollTop - MWBG.divPosY;
	}else{
	  //grab the x-y pos.s if browser is NS
		MWBG.mouse[0] = e.pageX - MWBG.divPosX;
		MWBG.mouse[1] = e.pageY - MWBG.divPosY;
		}
	//catch possible negative values in NS4
	if (MWBG.mouse[0] < 0){MWBG.mouse[0] = 0}
	if (MWBG.mouse[1] < 0){MWBG.mouse[1] = 0}
	//this will do things with the mouse movement
	//MWBG.checkMice();
	//MWBG.oldmouse[0]=MWBG.mouse[0];
	//MWBG.oldmouse[1]=MWBG.mouse[1];
	//alert(MWBG.mouse[0]+','+MWBG.mouse[1])
	}
	
//VERY useful pair of functions, curtersy of http://blog.firetree.net/2005/07/04/javascript-find-position/

MWBG.findPosX=function(obj)
  {
    var curleft = 0;
    if(obj.offsetParent)
        while(1) 
        {
          curleft += obj.offsetLeft;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.x)
        curleft += obj.x;
    return curleft;
  }

MWBG.findPosY=function(obj)
  {
    var curtop = 0;
    if(obj.offsetParent)
        while(1)
        {
          curtop += obj.offsetTop;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.y)
        curtop += obj.y;
    return curtop;
  }
	
//disables text selection for a div
MWBG.noSelect=function(thisdiv)
  {
	if(typeof thisdiv.onselectstart!='undefined')//IE
	  {
		thisdiv.onselectstart=function()
		  {
			return false;
			}
		}
  else if (thisdiv.style.MozUserSelect)//FF
	  {
		thisdiv.style.MozUserSelect="none";
		}
  else //other browsers exist?!
	  {
		thisdiv.onmousedown=function()
		  {
			return false;
			}
		}
	thisdiv.style.cursor="pointer";
	}
	
MWBG.addLoadEvent=function(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}