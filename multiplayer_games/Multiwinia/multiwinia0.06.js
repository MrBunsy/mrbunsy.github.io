//Multiwinia Board Game
var MWBG = new Object();

//function called on page load.
MWBG.load=function()
  {
	MWBG.div=document.getElementById('MWBGdiv')
	
	//mouse move stuff
	MWBG.divPosX=MWBG.findPosX(MWBG.div)
	MWBG.divPosY=MWBG.findPosY(MWBG.div)
	
	MWBG.mouse=new Array(2)
	
	MWBG.div.onmousemove=MWBG.getMouse;
	
	MWBG.noSelect(MWBG.div)
	
	MWBG.width=parseFloat(document.getElementById('MWBGdiv').style.width)
	MWBG.height=parseFloat(document.getElementById('MWBGdiv').style.height)

	//add span for text
	document.getElementById('MWBGdiv').innerHTML+="<span id='textSpan'></span><div id='MWBGeditordiv' style='display:none;position:absolute;margin-left:"+(MWBG.width)+";width:"+(MWBG.width*0.3)+";height:"+(MWBG.height*0.6)+";border:solid black 1px;'><h3>Editor</h3><span onClick='MWBG.openMainMenu();'>Back to Menu</span><br><br><span onClick='MWBG.changePlacing(0)' id='MWBGplace0'>Place Land</span><span id='MWBGplaceExtra0' style='display:none;'></span><br><span onClick='MWBG.changePlacing(1)' id='MWBGplace1'>Place Hill</span><span id='MWBGplaceExtra1' style='display:none;'></span><br><span onClick='MWBG.changePlacing(2)' id='MWBGplace2'>Place Blockage</span><span id='MWBGplaceExtra2' style='display:none;'><br><select id='MWBGblockType'><option value=0>Grey</option></select></span><br><span onClick='MWBG.changePlacing(3)' id='MWBGplace3'>Place Water</span><span id='MWBGplaceExtra3' style='display:none;'></span><br><span onClick='MWBG.changePlacing(4)' id='MWBGplace4'>Place Spawn</span><span id='MWBGplaceExtra4' style='display:none;'><br><select id='MWBGspawnColour'><option value=0>Empty</option><option value=1>Red</option><option value=2>Yellow</option><option value=3>Green</option><option value=4>Blue</option></select></span><br><br><span onClick='MWBG.saveMap(true)'>Save Map</span><br><span onClick='MWBG.importMap()'>Import Map</span><br><br><span onClick='MWBG.mapCells=new Array();MWBG.makeCells();MWBG.drawBoard();'>Clear Map</span><br><br><span onClick='MWBG.changeGridSize(1)'>More Cells</span><br><span onClick='MWBG.changeGridSize(-1)'>Less Cells</span></div>"
	MWBG.textSpan=document.getElementById('textSpan')
	MWBG.div.style.fontFamily='Helvetica,Arial, "trebuchet MS",  sans-serif';
	
	//MWBG.div.innerHTML+='<div id="saveleveldiv" class="savemenu" style="display:none;z-index:4;"><h3>Copy this text to save your level.</h3><textarea id="savetextarea" cols="60" rows="15"></textarea><br><b><span class="clickme" onClick="">Back to Main Menu</span></b> - <b><span class="clickme" onClick="saveMapMiniMenu.close();">Back to Editor</span></b></div>';	
	//document.getElementById('MWBGdiv').innerHTML+="<div id='MWBGeditordiv' style='display:none;position:absolute;margin-left:"+(MWBG.width)+";border:solid black 1px;'>Editor</div>"
	MWBG.editorDiv=document.getElementById('MWBGeditordiv');
	
	MWBG.canvastag=document.getElementById('MWBGcanvas');
	MWBG.canvastag2=document.getElementById('MWBGcanvas2');
	
	MWBG.canvastag2.onmousedown=MWBG.mouseDown;
	
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
	MWBG.offsetY=MWBG.cellSize/4;
	}
	
MWBG.openMainMenu=function()
  {
	MWBG.makingMap=false;
	MWBG.editorDiv.style.display="none";
	MWBG.clearText();
	MWBG.canvas[0].clearRect(0,0,MWBG.width,MWBG.height);
	MWBG.text('Welcome!<br><br><span onClick="MWBG.openEditor();">Make Map</span>',0,0.1,0.1,true)
	}

MWBG.changePlacing=function(placethis)
  {
	for(var i=0;i<5;i++)
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
	MWBG.cols=thisMap[0][0];
	MWBG.rows=thisMap[0][1];
	
	MWBG.getWorldSize();
	
	MWBG.mapCells=new Array();
	MWBG.makeCells();
	
	for(var i=0;i<thisMap[1].length;i++)
	  {
		if(thisMap[1][i][1]*MWBG.cols + thisMap[1][i][0] < MWBG.mapCells.length)
  		{
  		MWBG.mapCells[ thisMap[1][i][1]*MWBG.cols + thisMap[1][i][0]].make(thisMap[1][i][2] , thisMap[1][i][3]);
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
  //cell types, 0=land (info:tree?), 1=hill, 2=block (info:type of block), 3=water, 4=spawn (info:colour), 
  this.type=type;
  //extra info for cell type. (0=empty, 1=red, 2=yellow, 3=green, 4=blue)
	this.info=info;
  
	//for polygon collision detection
  this.Xs=Xs;
  this.Ys=Ys;
  
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
      new MWBG.cell(c,r,[c*MWBG.cellWidth+extraright*MWBG.cellWidth/2+MWBG.offsetX , c*MWBG.cellWidth+extraright*MWBG.cellWidth/2+MWBG.offsetX , c*MWBG.cellWidth+extraright*MWBG.cellWidth/2+MWBG.cellWidth/2+MWBG.offsetX , c*MWBG.cellWidth+extraright*MWBG.cellWidth/2+MWBG.cellWidth+MWBG.offsetX , c*MWBG.cellWidth+extraright*MWBG.cellWidth/2+MWBG.cellWidth+MWBG.offsetX , c*MWBG.cellWidth+extraright*MWBG.cellWidth/2+MWBG.cellWidth/2+MWBG.offsetX],[ MWBG.cellSize/2+r*MWBG.cellSize*1.5+MWBG.offsetY , MWBG.cellSize/2+r*MWBG.cellSize*1.5+MWBG.cellSize+MWBG.offsetY , MWBG.cellSize/2+r*MWBG.cellSize*1.5+MWBG.cellSize*1.5+MWBG.offsetY , MWBG.cellSize/2+r*MWBG.cellSize*1.5+MWBG.cellSize+MWBG.offsetY , MWBG.cellSize/2+r*MWBG.cellSize*1.5+MWBG.offsetY , MWBG.cellSize/2+r*MWBG.cellSize*1.5-MWBG.cellSize/2+MWBG.offsetY],0,false);
      }
    }
	
	}
	
	
	
MWBG.drawCell=function()
  {
	
	if(this.row%2==0){var extraright=0;}else{var extraright=1;}
  x=MWBG.offsetX + this.col*MWBG.cellWidth+extraright*MWBG.cellWidth/2
  y=MWBG.offsetY + MWBG.cellSize + this.row*MWBG.cellSize*1.5
	
	MWBG.drawhexagon(x,y,MWBG.cellSize,MWBG.cellWidth,this.colour)
	
	
	switch(this.type)
	  {
		case 4://spawn
		  switch(this.info)
			  {
				case 0://no-one - grey
				  MWBG.canvas[0].fillStyle="rgb(96,96,96)";
				break;
				case 1://red
				  MWBG.canvas[0].fillStyle="rgb(255,0,0)";
				break;
				case 2://yellow
				  MWBG.canvas[0].fillStyle="rgb(255,255,0)";
				break;
				case 3://green
				  MWBG.canvas[0].fillStyle="rgb(0,255,0)";
				break;
				case 4://blue
				  MWBG.canvas[0].fillStyle="rgb(0,0,255)";
				break;
				}
		  MWBG.canvas[0].beginPath();
			MWBG.canvas[0].moveTo(x+MWBG.cellWidth/2 + MWBG.cellSize*0.8, y+MWBG.cellSize/2)
			MWBG.canvas[0].arc(x+MWBG.cellWidth/2 , y+MWBG.cellSize/2 , MWBG.cellSize/2 , 0 , Math.PI*2 , false);
			MWBG.canvas[0].fill();
		break;
		}
	}

MWBG.drawhexagon=function(x,y,gridsize,width,fillstyle)
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
    MWBG.canvas[0].fillStyle=fillstyle;
    MWBG.canvas[0].beginPath();
    MWBG.canvas[0].moveTo(Math.round(x)-0.5 , Math.round( y))//starting at * on diagram
    MWBG.canvas[0].lineTo(Math.round(x)-0.5 , Math.round( y + gridsize))//moving down
    MWBG.canvas[0].lineTo(Math.round(x+width/2)-0.5 , Math.round( y + gridsize*1.5))//moving down and right to bottom point
    MWBG.canvas[0].lineTo(Math.round(x+width)-0.5 , Math.round( y + gridsize))//moving up and right.
    MWBG.canvas[0].lineTo(Math.round(x+width)-0.5 , Math.round(y) )//moving up
    MWBG.canvas[0].lineTo(Math.round(x+width/2)-0.5 , Math.round( y - gridsize/2))//moving up to point at top
    MWBG.canvas[0].lineTo(Math.round(x)-0.5 , Math.round(y))//back to *
    MWBG.canvas[0].fill();
    }
  
  MWBG.canvas[0].beginPath();
  MWBG.canvas[0].moveTo(Math.round(x)-0.5 , Math.round(y))//starting at * on diagram
  MWBG.canvas[0].lineTo(Math.round(x)-0.5 , Math.round( y + gridsize))//moving down
  MWBG.canvas[0].lineTo(Math.round(x+width/2)-0.5 , Math.round( y + gridsize*1.5))//moving down and right to bottom point
  MWBG.canvas[0].lineTo(Math.round(x+width)-0.5 , Math.round( y + gridsize))//moving up and right.
  MWBG.canvas[0].lineTo(Math.round(x+width)-0.5 , Math.round(y) )//moving up
  MWBG.canvas[0].lineTo(Math.round(x+width/2)-0.5 , Math.round( y - gridsize/2))//moving up to point at top
  MWBG.canvas[0].lineTo(Math.round(x)-0.5 , Math.round( y))//back to *
  MWBG.canvas[0].stroke();
  }
	
	
MWBG.drawBoard=function()
  {
	MWBG.canvas[0].clearRect(0,0,MWBG.width,MWBG.height);
	for(var i=0;i<MWBG.mapCells.length;i++)
	  {
		MWBG.mapCells[i].draw();
		}
	}
	
MWBG.drawMultiwinian=function(dead)
  {
	MWBG.canvas.fillStyle="rgb(0,255,0)";
	
	if(typeof dead !=='undefined' && dead)
	  {
		MWBG.canvas.fillStyle="rgb(0,50,0)";
		}
	
	squished=Math.cos(this.angle)
	//squished=1;
	
	tempDist=this.size/32
	pi=Math.Pi
	
	MWBG.canvas.beginPath();
	//top right of head
	MWBG.canvas.moveTo(this.pos[0] + Math.cos(-0.43*Math.PI+this.angle2)*16.4*tempDist*squished , this.pos[1] + Math.sin(-0.43*Math.PI+this.angle2)*16.4*tempDist);
	//top left of right arm
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(-0.38*Math.PI+this.angle2)*9.7*tempDist*squished , this.pos[1] + Math.sin(-0.38*Math.PI+this.angle2)*9.7*tempDist);
	//top right of right arm
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(-0.16*Math.PI+this.angle2)*18.4*tempDist*squished , this.pos[1] + Math.sin(-0.16*Math.PI+this.angle2)*18.4*tempDist);
	//bottom right of right arm
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(-0.08*Math.PI+this.angle2)*16.5*tempDist*squished , this.pos[1] + Math.sin(-0.08*Math.PI+this.angle2)*16.5*tempDist);
	//bottom of right arm
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(-0.27*Math.PI+this.angle2)*5.3*tempDist*squished , this.pos[1] + Math.sin(-0.27*Math.PI+this.angle2)*5.3*tempDist);
	//top left of right leg
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(0.09*Math.PI+this.angle2)*3.6*tempDist*squished , this.pos[1] + Math.sin(0.09*Math.PI+this.angle2)*3.6*tempDist);
	//top right of right leg
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(0.03*Math.PI+this.angle2)*9.6*tempDist*squished , this.pos[1] + Math.sin(0.03*Math.PI+this.angle2)*9.6*tempDist);
	//bottom right of right leg
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(0.33*Math.PI+this.angle2)*18.6*tempDist*squished , this.pos[1] + Math.sin(0.33*Math.PI+this.angle2)*18.6*tempDist);
	//bottom left of right leg
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(0.43*Math.PI+this.angle2)*16.4*tempDist*squished , this.pos[1] + Math.sin(0.43*Math.PI+this.angle2)*16.4*tempDist);
	//inside of right leg
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(0.33*Math.PI+this.angle2)*6.9*tempDist*squished , this.pos[1] + Math.sin(0.33*Math.PI+this.angle2)*6.9*tempDist);
	
	//inside of left leg
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(Math.PI-0.33*Math.PI+this.angle2)*6.9*tempDist*squished , this.pos[1] + Math.sin(Math.PI-0.33*Math.PI+this.angle2)*6.9*tempDist);
	//bottom right of left leg
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(Math.PI-0.43*Math.PI+this.angle2)*16.4*tempDist*squished , this.pos[1] + Math.sin(Math.PI-0.43*Math.PI+this.angle2)*16.4*tempDist);
	//bottom left of left leg
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(Math.PI-0.33*Math.PI+this.angle2)*18.6*tempDist*squished , this.pos[1] + Math.sin(Math.PI-0.33*Math.PI+this.angle2)*18.6*tempDist);
	//top left of left leg
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(Math.PI-0.03*Math.PI+this.angle2)*9.6*tempDist*squished , this.pos[1] + Math.sin(Math.PI-0.03*Math.PI+this.angle2)*9.6*tempDist);
	//top right of left leg
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(Math.PI-0.09*Math.PI+this.angle2)*3.6*tempDist*squished , this.pos[1] + Math.sin(Math.PI-0.09*Math.PI+this.angle2)*3.6*tempDist);
	//bottom of left arm
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(Math.PI+0.27*Math.PI+this.angle2)*5.3*tempDist*squished , this.pos[1] + Math.sin(Math.PI+0.27*Math.PI+this.angle2)*5.3*tempDist);
	//bottom left of left arm
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(Math.PI+0.08*Math.PI+this.angle2)*16.5*tempDist*squished , this.pos[1] + Math.sin(Math.PI+0.08*Math.PI+this.angle2)*16.5*tempDist);
	//top left of left arm
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(Math.PI+0.16*Math.PI+this.angle2)*18.4*tempDist*squished , this.pos[1] + Math.sin(Math.PI+0.16*Math.PI+this.angle2)*18.4*tempDist);
	//top right of left arm
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(Math.PI+0.38*Math.PI+this.angle2)*9.7*tempDist*squished , this.pos[1] + Math.sin(Math.PI+0.38*Math.PI+this.angle2)*9.7*tempDist);
	//top left of head
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(Math.PI+0.43*Math.PI+this.angle2)*16.4*tempDist*squished , this.pos[1] + Math.sin(Math.PI+0.43*Math.PI+this.angle2)*16.4*tempDist);
	//top right of head
	MWBG.canvas.lineTo(this.pos[0] + Math.cos(-0.43*Math.PI+this.angle2)*16.4*tempDist*squished , this.pos[1] + Math.sin(-0.43*Math.PI+this.angle2)*16.4*tempDist);
	
	MWBG.canvas.fill();
	}

MWBG.mouseDown=function()
  {
	if(MWBG.makingMap)
	  {
		//update placingInfo
		MWBG.changePlacing(MWBG.placing);
		
		var thisCell=MWBG.findCell();
		MWBG.mapCells[thisCell].make(MWBG.placing,MWBG.placingInfo);
		MWBG.drawBoard();
	  }
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