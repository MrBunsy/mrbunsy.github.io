//Multiwinia Board Game
var MWBG = new Object();

//function called on page load.
MWBG.load=function()
  {
	MWBG.width=parseFloat(document.getElementById('MWBGdiv').style.width)
	MWBG.height=parseFloat(document.getElementById('MWBGdiv').style.height)
	
	MWBG.canvastag=document.getElementById('MWBGcanvas');
	MWBG.canvastag2=document.getElementById('MWBGcanvas2');
	
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
	
	MWBG.cellWidth=MWBG.width/(MWBG.cols+1)
	//length of a side
	MWBG.cellSize=MWBG.cellWidth/1.732
	
	MWBG.offsetX=MWBG.cellWidth/4;
	MWBG.offsetY=MWBG.cellSize/4;
	
	/*
	if(row%2==0){var extraright=0;}else{var extraright=1;}
  x=c*gridwidth+extraright*width/2
  y=r*gridsize*1.5
	*/
	
	
  MWBG.mapCells=new Array();
	
	MWBG.makeCells();
	
	MWBG.drawBoard();
  }

MWBG.cell=function(col,row,Xs,Ys,type,info)
  {
  this.col=col;
  this.row=row;
  //cell types, 0=land (info:tree?), 1=hill, 2=block (info:type of block), 3=water, 4=spawn (info:colour), 
  this.type=type;
  //extra info for cell type. (0=empty, 1=red, 2=yellow, 3=green, 4=blue)
	this.info=info;
  switch(type)
	  {
		case 0://land
  		this.tree=info;
  		this.colour="rgb(72,"+(184+Math.round( (Math.random()-0.5)*40 ))+",37)";
		break;
		case 1://hill
		  this.colour="rgb(64,128,0)";
		break;
		case 2://block
		  this.colour="rgb(96,96,96)";
		break;
		case 3://water
		  this.colour="rgb(35,114,186)";
		break;
		case 4://spawn
		  this.colour="rgb(132,165,32)";
		break;
		}
	//for polygon collision detection
  this.Xs=Xs;
  this.Ys=Ys;
  
  this.draw=MWBG.drawCell;
  
  MWBG.mapCells.push(this);
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