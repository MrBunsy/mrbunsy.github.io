// Cards version 0.24
// Copyright Luke Wallin (27th August) 2008
// This script is to help create card games in JavaScript.
// Cards provides functions to create a deck of cards, shuffle them, draw individual cards on the canvas and detect mouse ups and downs.
// It also features a function to draw some text on the canvas - just enough letters and numbers for the cards at present.

var Cards=new Object();


Cards.load=function()
  {
	Cards.IE=false;
	if (/MSIE/.test(navigator.userAgent) && !window.opera)
	  {
		Cards.IE=true;
		}
	
	//mouse dragg stuff:
	Cards.checkCount=0;
	Cards.dragDiff=new Array(2);
	Cards.drag=false;
	
	//mouse coords
  Cards.mouse=new Array(2);
  Cards.oldmouse=new Array(2);
	
	Cards.div=document.getElementById('cardsdiv');
	Cards.texts=new Array();
	Cards.span=document.getElementById('cardsspan');
	Cards.div.style.fontFamily='Helvetica,Arial, "trebuchet MS",  sans-serif';
	Cards.width=parseFloat(document.getElementById('cardsdiv').style.width);
	Cards.height=parseFloat(document.getElementById('cardsdiv').style.height);
	
	Cards.div.style.overflow="hidden";
	Cards.div.style.clip="5px -5px -5px 5px";
	
	Cards.canvastag=document.getElementById('cardscanvas');
	Cards.minicanvastag=document.getElementById('cardsminicanvas');
	Cards.minicanvastag.style.position="relative";
	Cards.minicanvastag.style.zIndex=2;
	
	Cards.canvastag.style.position="absolute";
	Cards.canvastag.style.top=Cards.height*0.05
	
	Cards.noSelect(Cards.minicanvastag);
	
	Cards.canvas=new Array();
  if (Cards.canvastag.getContext)
    {
    Cards.canvas[0] = Cards.canvastag.getContext('2d');
		Cards.canvas[1] = Cards.minicanvastag.getContext('2d');
    }
	
  Cards.canvastag.style.border="solid black 1px";
	Cards.div.style.cursor="pointer";
	Cards.canvastag.style.backgroundColor="#8cd2ff";
	Cards.div.onmousemove=Cards.getMouse;
	}

	
Cards.mouseDowns=new Array();

//square area of the playing area which can be clicked on.  dimensions in fractions
Cards.mouseDown=function(x,y,w,h,type,info,down)
  {
	this.x=x;
	this.y=y;
	this.w=w;
	this.h=h;
	this.type=type;
	this.info=info;
	//true= catch mouse on mouseDown, false = catch mouse on mouseUp
	this.down=down;
	Cards.mouseDowns.push(this);
	}

Cards.clicked=false;	
	
Cards.findmouseDown=function(down)
  {
	for(var i=0;i<Cards.mouseDowns.length;i++)
		{
		
		if(down===Cards.mouseDowns[i].down && Cards.mouse[0] > Cards.mouseDowns[i].x*Cards.width && Cards.mouse[0] < Cards.mouseDowns[i].x*Cards.width+Cards.mouseDowns[i].w*Cards.width && Cards.mouse[1] > Cards.mouseDowns[i].y*Cards.height && Cards.mouse[1] < Cards.mouseDowns[i].y*Cards.height+Cards.mouseDowns[i].h*Cards.height)
			{
			//mouse is inside the square.
			Cards.clicked=i;
			return i;
		  }
	  }
	return false;
	}
	

Cards.card=function(suit,number,faceup)
  {
	//0=diamonds, 1=hearts, 2=clubs, 3=spades, 4=joker
	this.suit=suit;
	
	if(this.suit==0 || this.suit==1)
	  {
		this.red=true;
		}
	else
	  {
		this.red=false;
		}
	
	//0=joker, 1=ace, 2-10=2-10, 11=jack, 12=queen, 13=king
	this.number=number;
	
	//card visible? (true/false)
	this.faceup=faceup
	
	//picture card?
	if(11 <= this.number && this.number <= 13)
	  {
		this.picture=true;
		}
	else
	  {
		this.picture=false;
		}
	
	this.draw=Cards.drawCard;
	}
	

/*

card height:width ratio = 1.51:1
curve identation:width ratio = 0.069:1

*/
//draw the outline of a card
Cards.drawOutline=function(x,y,width,colour,where)
  {
	x=Math.ceil(x*Cards.width)-(thick%2==0 ? 0 : 0.5);
	y=Math.ceil(y*Cards.height)-(thick%2==0 ? 0 : 0.5);
	width*=Cards.width;
	height=Math.round(width*1.5);
	corner=Math.round(width*0.069);
	width=Math.round(width);
	
	Cards.canvas[where].save();
	Cards.canvas[where].strokeStyle=colour
	Cards.canvas[where].beginPath();
	Cards.canvas[where].moveTo(x+corner , y);
	Cards.canvas[where].lineTo(x+width-corner , y);
	//top right corner
	Cards.canvas[where].arc(x+width-corner , y+corner , corner , -Math.PI/2, 0, false);
	Cards.canvas[where].lineTo(x+width , y+height-corner);
	//bottom right corner
	Cards.canvas[where].arc(x+width-corner , y+height-corner , corner , 0 , Math.PI/2 , false);
	Cards.canvas[where].lineTo(x+corner, y+height);
	//bottom left corner
	Cards.canvas[where].arc(x+corner , y+height-corner , corner, Math.PI/2 , Math.PI , false);
	Cards.canvas[where].lineTo(x , y+corner);
	//top left corner
	Cards.canvas[where].arc (x+corner, y+corner , corner, Math.PI, Math.PI*3/2 , false);
	Cards.canvas[where].stroke();
	Cards.canvas[where].restore();
	
	}
/*
Cards.drawBoxTemp=function(x,y,width,height)
  {
	opera.postError('indrawbox function')
	TreeObject.canvas.fillRect(x,y,width,height)	
	}
*/
Cards.drawBoxTemp=function(x,y,width,height,colour1,colour2,where)
  {
	//opera.postError('indrawbox function')
	Cards.canvas[where].fillStyle=colour1
	Cards.canvas[where].fillRect(x,y,width,height)
	TreeObject.canvas.fillRect(x,y,width,height)	
	}

//draw a card-style rounded box, colour1=bg colour, colour2=line colour
Cards.drawBox=function(x,y,width,height,colour1,colour2,where)
  {
	
	cardthick=Math.ceil(0.01*width*Cards.width)
	x=Math.ceil(x*Cards.width)-(cardthick%2==0 ? 0 : 0.5);
	y=Math.ceil(y*Cards.height)-(cardthick%2==0 ? 0 : 0.5);
	width*=Cards.width;
	height=Math.ceil(height*Cards.height);
	corner=Math.ceil(width*0.069);
	width=Math.ceil(width);

	Cards.canvas[where].save();
	Cards.canvas[where].fillStyle=colour1
	Cards.canvas[where].beginPath();
	Cards.canvas[where].moveTo(x+corner , y);
	Cards.canvas[where].lineTo(x+width-corner , y);
	//top right corner
	Cards.canvas[where].arc(x+width-corner , y+corner , corner , -Math.PI/2, 0, false);
	Cards.canvas[where].lineTo(x+width , y+height-corner);
	//bottom right corner
	Cards.canvas[where].arc(x+width-corner , y+height-corner , corner , 0 , Math.PI/2 , false);
	Cards.canvas[where].lineTo(x+corner, y+height);
	//bottom left corner
	Cards.canvas[where].arc(x+corner , y+height-corner , corner, Math.PI/2 , Math.PI , false);
	Cards.canvas[where].lineTo(x , y+corner);
	//top left corner
	Cards.canvas[where].arc (x+corner, y+corner , corner, Math.PI, Math.PI*3/2 , false);
	Cards.canvas[where].fill();
	Cards.canvas[where].restore();

	Cards.canvas[where].save();
	Cards.canvas[where].strokeStyle=colour2
	Cards.canvas[where].beginPath();
	Cards.canvas[where].moveTo(x+corner , y);
	Cards.canvas[where].lineTo(x+width-corner , y);
	//top right corner
	Cards.canvas[where].arc(x+width-corner , y+corner , corner , -Math.PI/2, 0, false);
	Cards.canvas[where].lineTo(x+width , y+height-corner);
	//bottom right corner
	Cards.canvas[where].arc(x+width-corner , y+height-corner , corner , 0 , Math.PI/2 , false);
	Cards.canvas[where].lineTo(x+corner, y+height);
	//bottom left corner
	Cards.canvas[where].arc(x+corner , y+height-corner , corner, Math.PI/2 , Math.PI , false);
	Cards.canvas[where].lineTo(x , y+corner);
	//top left corner
	Cards.canvas[where].arc (x+corner, y+corner , corner, Math.PI, Math.PI*3/2 , false);
	Cards.canvas[where].stroke();
	Cards.canvas[where].restore();
	
	}

	
//draw a card, x,y: top left coords.  coords and sizes in fractions of width and height.  full=draw full card or only top?
Cards.drawCard=function(x,y,width,where,full)
  {
	//where=1
	thick=Math.ceil(0.01*width*Cards.width)
	//only -0.5 if odd, and don't minus anything if line thickness is even - ensures crisp lines on the canvas
	x=Math.ceil(x*Cards.width)-(thick%2==0 ? 0 : 0.5);
	y=Math.ceil(y*Cards.height)-(thick%2==0 ? 0 : 0.5);
	width*=Cards.width;
	height=Math.ceil(width*1.5);
	corner=Math.ceil(width*0.069);
	width=Math.ceil(width);
		
	outlinefunc=function()
	  {
  	Cards.canvas[where].moveTo(x+corner , y);
  	Cards.canvas[where].lineTo(x+width-corner , y);
  	//top right corner
  	Cards.canvas[where].arc(x+width-corner , y+corner , corner , -Math.PI/2, 0, false);
  	Cards.canvas[where].lineTo(x+width , y+height-corner);
  	//bottom right corner
  	Cards.canvas[where].arc(x+width-corner , y+height-corner , corner , 0 , Math.PI/2 , false);
  	Cards.canvas[where].lineTo(x+corner, y+height);
  	//bottom left corner
  	Cards.canvas[where].arc(x+corner , y+height-corner , corner, Math.PI/2 , Math.PI , false);
  	Cards.canvas[where].lineTo(x , y+corner);
  	//top left corner
  	Cards.canvas[where].arc (x+corner, y+corner , corner, Math.PI, Math.PI*3/2 , false)
	  }

	if(this.faceup)
  	  {
  	Cards.canvas[where].beginPath()
  	Cards.canvas[where].fillStyle="rgb(255,255,255)";
  	outlinefunc(where);
  	Cards.canvas[where].fill();
  	
  	switch(this.suit)
  	  {
  		case 0:
  		  //diamonds
  			drawSymbol=Cards.drawDiamond;
  			drawColour='rgb(255,0,0)';
  		break;
  		case 1:
  		  //hearts
  			drawSymbol=Cards.drawHeart;
  			drawColour='rgb(255,0,0)';
  		break;
  		case 2:
  		  //clubs
  			drawSymbol=Cards.drawClub;
  			drawColour='rgb(0,0,0)';
  		break;
  		case 3:
  		  //spades
  			drawSymbol=Cards.drawSpade;
  			drawColour='rgb(0,0,0)';
  		break;
  		}

  	switch(this.number)
  	  {
  		case 1:
  			drawLetter='A';
				if(full)
  				{
    		  drawSymbol(x+width/2 , y+height/2 , width/4 , false , where);
  				}
  		break;
  		case 2:
  		  drawLetter=2;
  		  drawSymbol(x+width/2 , y+height/6 , width/8 , false , where);
				if(full)
  				{
    			drawSymbol(x+width/2 , y+height-height/6 , width/8 , true , where);
  				}
  		break;
  		case 3:
  		  drawLetter=3;
  			drawSymbol(x+width/2 , y+height/6 , width/8 , false , where);
				if(full)
  				{
    			drawSymbol(x+width/2 , y+height/2 , width/8 , false , where);
  				}
  			drawSymbol(x+width/2 , y+height-height/6 , width/8 , true , where);
  		break;
  		case 4:
  		  drawLetter=4;
  			// ( 1/3 + 1/4  , where)/2 = 7/24
  			drawSymbol(x+width/3 , y+height/6 , width/8 , false , where);
				drawSymbol(x+width-width/3 , y+height/6 , width/8 , false , where);
				if(full)
  				{
    			drawSymbol(x+width/3 , y+height-height/6 , width/8 , true , where);
    			drawSymbol(x+width-width/3 , y+height-height/6 , width/8 , true , where);
  				}
  		break;
  		case 5:
  		  drawLetter=5;
  			drawSymbol(x+width/3 , y+height/6 , width/8 , false , where);
				drawSymbol(x+width-width/3 , y+height/6 , width/8 , false , where);
				if(full)
  				{
    			drawSymbol(x+width/3 , y+height-height/6 , width/8 , true , where);
    			drawSymbol(x+width/2 , y+height/2 , width/8 , false , where);
    			drawSymbol(x+width-width/3 , y+height-height/6 , width/8 , true , where);
  				}
  		break;
  		case 6:
  		  drawLetter=6;
  			drawSymbol(x+width/3 , y+height/6 , width/8 , false , where);
				drawSymbol(x+width-width/3 , y+height/6 , width/8 , false , where);
				if(full)
  				{
    			drawSymbol(x+width/3 , y+height/2 , width/8 , false , where);
    			drawSymbol(x+width/3 , y+height-height/6 , width/8 , true , where);
    			drawSymbol(x+width-width/3 , y+height/2 , width/8 , false , where);
    			drawSymbol(x+width-width/3 , y+height-height/6 , width/8 , true , where);
  				}
  		break;
  		case 7:
  		  drawLetter=7;
  			drawSymbol(x+width/3 , y+height/6 , width/8 , false , where);
				drawSymbol(x+width-width/3 , y+height/6 , width/8 , false , where);
				drawSymbol(x+width/2 , y+height/3 , width/8 , false , where);
				if(full)
  				{
    			drawSymbol(x+width/3 , y+height/2 , width/8 , false , where);
    			drawSymbol(x+width/3 , y+height-height/6 , width/8 , true , where);
    			drawSymbol(x+width-width/3 , y+height/2 , width/8 , false , where);
    			drawSymbol(x+width-width/3 , y+height-height/6 , width/8 , true , where);
  				}
  		break;
  		case 8:
  		  drawLetter=8;
  			drawSymbol(x+width/3 , y+height/6 , width/8 , false , where);
				drawSymbol(x+width-width/3 , y+height/6 , width/8 , false , where);
				drawSymbol(x+width/2 , y+height/3 , width/8 , false , where);
				if(full)
  				{
    			drawSymbol(x+width/3 , y+height/2 , width/8 , false , where);
    			drawSymbol(x+width/3 , y+height-height/6 , width/8 , true , where);
    			drawSymbol(x+width-width/3 , y+height/2 , width/8 , false , where);
    			drawSymbol(x+width-width/3 , y+height-height/6 , width/8 , true , where);
    			drawSymbol(x+width/2 , y+height-height/3 , width/8 , true , where);
  				}
  		break;
  		case 9:
  		  drawLetter=9;
  			drawSymbol(x+width/3 , y+height/6 , width/8 , false , where);
				drawSymbol(x+width-width/3 , y+height/6 , width/8 , false , where);
				if(full)
  				{
    			drawSymbol(x+width/3 , y+height*7/18 , width/8 , false , where);
    			drawSymbol(x+width/3 , y+height-height*7/18 , width/8 , true , where);
    			drawSymbol(x+width/3 , y+height-height/6 , width/8 , true , where);
    			drawSymbol(x+width/2 , y+height/2 , width/8 , false , where);
    			drawSymbol(x+width-width/3 , y+height-height/6 , width/8 , true , where);
    			drawSymbol(x+width-width/3 , y+height*7/18 , width/8 , false , where);
    			drawSymbol(x+width-width/3 , y+height-height*7/18 , width/8 , true , where);
    			}
  		break;
  		case 10:
  		  drawLetter=10;
  			drawSymbol(x+width/3 , y+height/6 , width/8 , false , where);
				drawSymbol(x+width-width/3 , y+height/6 , width/8 , false , where);
				drawSymbol(x+width/2 , y+height*5/18 , width/8 , false , where);
				if(full)
  				{
    			drawSymbol(x+width/3 , y+height*7/18 , width/8 , false , where);
    			drawSymbol(x+width/3 , y+height-height*7/18 , width/8 , true , where);
    			drawSymbol(x+width/3 , y+height-height/6 , width/8 , true , where);
    			drawSymbol(x+width/2 , y+height-height*5/18 , width/8 , true , where);
    			drawSymbol(x+width-width/3 , y+height-height/6 , width/8 , true , where);
    			drawSymbol(x+width-width/3 , y+height*7/18 , width/8 , false , where);
    			drawSymbol(x+width-width/3 , y+height-height*7/18 , width/8 , true , where);
    			}
  		break;
  		case 11:
  		  drawLetter='J';
  		break;
  		case 12:
  		  drawLetter='Q';
  		break;
  		case 13:
  		  drawLetter='K';
  		break;
  		}
  		
  	//top left and bottom right
  	drawSymbol(x+width/10 , y+height/4 , width/16 , false , where)
		if(full)
  		{
    	drawSymbol(x+width-width/10 , y+height-height/4 , width/16 , true , where)
  		}
  	//(text,x,y,h,a,c)
  	Cards.drawText(drawLetter,x+width/10 , y+height/10 , width/5 , false , drawColour , where)
		if(full)
  		{
    	Cards.drawText(drawLetter,x+width-width/10 , y+height-height/10 , width/5 , true , drawColour , where)
    	}
		
  	if(this.picture)
  	  {
  		//draw rabbits - placeholder for something better
			if(full)
  			{
				//rabbit down bottom right
    		Cards.drawRabbit(Math.round(x+width-width*9/24),Math.round(y+height-height*5/12),width/6,-Math.PI/2,drawColour=='rgb(0,0,0)' ? 'rgb(0,0,200)':drawColour , where);
  			}
  		Cards.drawRabbit(Math.round(x+width*9/24),Math.round(y+height*5/12),width/6,Math.PI/2,drawColour=='rgb(0,0,0)' ? 'rgb(0,0,200)':drawColour , where);
  		//Cards.drawCrown=function(x,y,width,height,colour,where)
			switch(this.number)
  			{
				case 11://jack
				  //Cards.drawStick=function(x,y,l,colour,upside,where)
					Cards.drawStick(x+width/4 , y+height/2 , height/4 , 'rgb(255,215,0)' , false , where)
					if(full)
					  {
						Cards.drawStick(x+width-width/4 , y+height-height/2 , height/4 , 'rgb(255,215,0)' , true , where)
						}
				break;
				case 12://queen - slightly smaller silver crown
				  Cards.drawCrown(x+width*9/24 , y+height/3 , width*7/24 , height*3/32 , 'rgb(192,192,192)',false,where);
					if(full)
					  {
						Cards.drawCrown(x+width-width*9/24 , y+height-height/3 , width*7/24 , height*3/32 , 'rgb(192,192,192)',true,where);
						}
				break;
				case 13://king - gold crown
    			Cards.drawCrown(x+width*9/24 , y+height/3 , width/3 , height/8 , 'rgb(255,215,0)',false,where);
					if(full)
					  {
						Cards.drawCrown(x+width-width*9/24 , y+height-height/3 , width/3 , height/8 , 'rgb(255,215,0)',true,where);
						}
				break;
  			}
			//*7/24
  		drawSymbol(x+width-width/3 , y+height/3 , width/8 , false , where);
  		if(full)
  			{
  			drawSymbol(x+width/3 , y+height-height/3 , width/8 , true , where);
    		}
  		//Cards.canvas[where].lineWidth=1;
  		Cards.canvas[where].strokeRect(Math.ceil(x+width/5)-0.5 , Math.ceil(y+width/5)-0.5 , Math.ceil(width*3/5) , Math.ceil(height-width*2/5))
  		}
		//end of if faceup
		}
	else
	  {
		//draw back of card
		
  	Cards.canvas[where].beginPath();
		Cards.canvas[where].fillStyle="rgb(0,200,0)"
  	outlinefunc(where);
  	Cards.canvas[where].fill();
		if(full)
  		{
  		Cards.drawRabbit(x+width/2 , y+height/2+width/6 , width/3,Math.PI/2,'rgb(0,150,0)' , where);
  		}
		}
	Cards.canvas[where].save()
	Cards.canvas[where].lineWidth=thick;
	Cards.canvas[where].beginPath();
  outlinefunc(where);
	Cards.canvas[where].stroke();
	Cards.canvas[where].restore();
	

	
	}

//x,y = centre coords, all in pixels
Cards.drawDiamond=function(x,y,r,u,where)
	{
	Cards.canvas[where].beginPath();
	Cards.canvas[where].fillStyle="rgb(255,0,0)"
	//top of diamond
	Cards.canvas[where].moveTo(x , y-r);
	//right
	Cards.canvas[where].lineTo(x+r*3/4 , y)
	//bottom
	Cards.canvas[where].lineTo(x , y+r)
	//left
	Cards.canvas[where].lineTo(x-r*3/4 , y)
	//top
	Cards.canvas[where].lineTo(x, y-r);
	Cards.canvas[where].fill();
	}

Cards.drawHeart=function(x,y,r,u,where)
  {
	r*=0.9
	if(u)
	  {
		r*=-1;
		}
	Cards.canvas[where].beginPath();
	Cards.canvas[where].fillStyle="rgb(255,0,0)";
	Cards.canvas[where].moveTo(x,y-r/2);
	Cards.canvas[where].arc(x-r/2 , y-r/2 , Math.abs(r/2) , 0+(u?Math.PI:0) , Math.PI*7/8+(u?Math.PI:0) , true);
	Cards.canvas[where].lineTo(x,y+r);
	
	Cards.canvas[where].moveTo(x,y-r/2);
	Cards.canvas[where].arc(x+r/2 , y-r/2 , Math.abs(r/2) , Math.PI+(u?Math.PI:0) , Math.PI/8+(u?Math.PI:0) , false);
	Cards.canvas[where].lineTo(x,y+r);
	
	Cards.canvas[where].fill()
	}
	
Cards.drawClub=function(x,y,r,u,where)
  {
	r*=0.9
	if(u)
	  {
		r*=-1;
		}
	Cards.canvas[where].beginPath();
	Cards.canvas[where].fillStyle="rgb(0,0,0)";
	//left blob
	Cards.canvas[where].moveTo(x,y+r/4);
	Cards.canvas[where].arc(x-r/2 , y+r/4, Math.abs(r/2) , 0+(u?Math.PI:0) , Math.PI*2+(u?Math.PI:0) , false);
	Cards.canvas[where].fill();
	
	Cards.canvas[where].beginPath();
	//top blob
	Cards.canvas[where].moveTo(x+r/2,y-r/2);
	Cards.canvas[where].arc(x , y-r/2, Math.abs(r/2) , 0+(u?Math.PI:0) , Math.PI*2+(u?Math.PI:0) , false);
	Cards.canvas[where].fill();
	
	Cards.canvas[where].beginPath();
	//right blob
	Cards.canvas[where].moveTo(x+r,y+r/4);
	Cards.canvas[where].arc(x+r/2 , y+r/4, Math.abs(r/2) , 0+(u?Math.PI:0) , Math.PI*2+(u?Math.PI:0) , false);
	Cards.canvas[where].fill();
	
	Cards.canvas[where].beginPath();
	//central cover-up-gaps blob
	Cards.canvas[where].moveTo(x+r/3,y+r/4);
	Cards.canvas[where].arc(x , y+4/r, Math.abs(r/3) , 0+(u?Math.PI:0) , Math.PI*2+(u?Math.PI:0) , false);
	Cards.canvas[where].fill();
	
	Cards.canvas[where].beginPath();
	Cards.canvas[where].moveTo(x,y);
	Cards.canvas[where].lineTo(x-r/4 , y+r)
	Cards.canvas[where].lineTo(x+r/4 , y+r);
	Cards.canvas[where].lineTo(x,y)
	Cards.canvas[where].fill();
	}
	
Cards.drawSpade=function(x,y,r,u,where)
  {
	r*=0.9
	if(u)
	  {
		r*=-1;
		}
	Cards.canvas[where].beginPath();
	Cards.canvas[where].fillStyle="rgb(0,0,0)";
	
	Cards.canvas[where].moveTo(x,y+r/4);
	Cards.canvas[where].arc(x-r/2 , y+r/4 , Math.abs(r/2) , 0+(u?Math.PI:0) , -Math.PI*3/4+(u?Math.PI:0) , false);
	Cards.canvas[where].lineTo(x , y-r/0.9);
	
	Cards.canvas[where].moveTo(x,y+r/4);
	Cards.canvas[where].arc(x+r/2 , y+r/4 , Math.abs(r/2) , Math.PI+(u?Math.PI:0) , -Math.PI/4+(u?Math.PI:0) , true);
	Cards.canvas[where].lineTo(x , y-r/0.9);
	
	Cards.canvas[where].fill();
	
	Cards.canvas[where].beginPath();
	Cards.canvas[where].moveTo(x,y);
	Cards.canvas[where].lineTo(x-r/3 , y+r)
	Cards.canvas[where].lineTo(x+r/3 , y+r);
	Cards.canvas[where].lineTo(x,y)
	Cards.canvas[where].fill();
	}

//stick the jack holds  x,y=bottom of stick, l=length.  All in pixels
Cards.drawStick=function(x,y,l,colour,upside,where)
  {
	if(upside)
	  {
		l*=-1;
		}
	Cards.canvas[where].save();
	Cards.canvas[where].lineWidth=Math.abs(l/10);
	Cards.canvas[where].beginPath();
	Cards.canvas[where].moveTo(x,y);
	Cards.canvas[where].lineTo(x,y-l);
	Cards.canvas[where].stroke();
	Cards.canvas[where].restore();
	
	Cards.canvas[where].beginPath();
	Cards.canvas[where].fillStyle=colour;
	Cards.canvas[where].moveTo(x+Math.abs(l/10),y-l);
	Cards.canvas[where].arc(x,y-l,Math.abs(l/10),0,Math.PI*2,false);
	Cards.canvas[where].fill();
	
	Cards.canvas[where].beginPath();
	Cards.canvas[where].moveTo(x+Math.abs(l/10),y-l);
	Cards.canvas[where].arc(x,y-l,Math.abs(l/10),0,Math.PI*2,false);
	Cards.canvas[where].stroke();
	}
	
//x,y=centre, all in pixels
Cards.drawCrown=function(x,y,width,height,colour,upside,where)
  {
	
	if(upside)
	  {
		width*=-1;
		height*=-1;
		}
	
	/*
		Cards.canvas[where].moveTo(x-width/2 , y-height/2);
		Cards.canvas[where].lineTo(x-width/2+width/6 , y);
		Cards.canvas[where].lineTo(x-width/2+width/3 , y-height/2);
		Cards.canvas[where].lineTo(x , y);
		Cards.canvas[where].lineTo(x+width/6 , y-height/2);
		Cards.canvas[where].lineTo(x+width/3 , y);
		Cards.canvas[where].lineTo(x+width/2 , y-height/2);
		Cards.canvas[where].lineTo(x+width/2 , y+height/2);
		Cards.canvas[where].lineTo(x-width/2 , y+height/2);
		Cards.canvas[where].lineTo(x-width/2 , y-height/2);
	*/
	
	var tempfunc=function()
  	{
  	Cards.canvas[where].moveTo(Cards.tidy(x-width/2,1) , Cards.tidy(y-height/2,1));
		Cards.canvas[where].lineTo(Cards.tidy(x-width/2+width/6,1) , Cards.tidy(y,1));
		Cards.canvas[where].lineTo(Cards.tidy(x-width/2+width/3,1) , Cards.tidy(y-height/2,1));
		Cards.canvas[where].lineTo(Cards.tidy(x,1) , Cards.tidy(y,1));
		Cards.canvas[where].lineTo(Cards.tidy(x+width/6,1) , Cards.tidy(y-height/2,1));
		Cards.canvas[where].lineTo(Cards.tidy(x+width/3,1) , Cards.tidy(y,1));
		Cards.canvas[where].lineTo(Cards.tidy(x+width/2,1) , Cards.tidy(y-height/2,1));
		Cards.canvas[where].lineTo(Cards.tidy(x+width/2,1) , Cards.tidy(y+height/2,1));
		Cards.canvas[where].lineTo(Cards.tidy(x-width/2,1) , Cards.tidy(y+height/2,1));
		Cards.canvas[where].lineTo(Cards.tidy(x-width/2,1) , Cards.tidy(y-height/2,1));
  	}
	
	Cards.canvas[where].beginPath();
	Cards.canvas[where].fillStyle=colour;
	tempfunc();
	Cards.canvas[where].fill();
	
	Cards.canvas[where].beginPath();
	tempfunc();
	Cards.canvas[where].stroke();
	
	}
	
Cards.drawRabbit=function(tempx,tempy,radius,angle,colour,where)
  {
  
	var headfunc=function(){
	Cards.canvas[where].moveTo(tempx+radius , tempy)
	Cards.canvas[where].arc(tempx , tempy , radius , 0 , Math.PI*2 , false);
	}
		
  var earfunc1=function(){
  Cards.canvas[where].moveTo(tempx+Math.cos(angle+Math.PI+Math.PI/6)*radius , tempy+Math.sin(angle+Math.PI+Math.PI/6)*radius)
  
  Cards.canvas[where].bezierCurveTo(tempx+Math.cos(angle+Math.PI+Math.PI/6)*radius*3, tempy+Math.sin(angle+Math.PI+Math.PI/6)*radius*3 , tempx+Math.cos(angle+Math.PI)*radius*3 , tempy+Math.sin(angle+Math.PI)*radius*3 , tempx+Math.cos(angle+Math.PI)*radius , tempy+Math.sin(angle+Math.PI)*radius)
  }
  
  var earfunc1fill=function(){//this extra bit is to join the ends of the ears up with the edge of the head circle.
  Cards.canvas[where].arc(tempx, tempy, radius, angle+Math.PI, angle+Math.PI+Math.PI/6, false)
  }
  
  //joins
  var earfunc2=function(){
  Cards.canvas[where].moveTo(tempx+Math.cos(angle+Math.PI-Math.PI/6)*radius , tempy+Math.sin(angle+Math.PI-Math.PI/6)*radius)
  Cards.canvas[where].bezierCurveTo(tempx+Math.cos(angle+Math.PI-Math.PI/6)*radius*3, tempy+Math.sin(angle+Math.PI-Math.PI/6)*radius*3 , tempx+Math.cos(angle+Math.PI)*radius*3 , tempy+Math.sin(angle+Math.PI)*radius*3 , tempx+Math.cos(angle+Math.PI)*radius , tempy+Math.sin(angle+Math.PI)*radius)
  }
  var earfunc2fill=function(){
  Cards.canvas[where].arc(tempx, tempy, radius, angle+Math.PI, angle+Math.PI-Math.PI/6, true)
  }
  
  /*
  fills[1][colour].push(earfunc1);
  fills[1][colour].push(earfunc1fill);
  fills[1][colour].push(earfunc2);
  fills[1][colour].push(earfunc2fill);
  
  strokes[1].push(earfunc1);
  strokes[1].push(earfunc2);
  */
	Cards.canvas[where].beginPath()
	Cards.canvas[where].fillStyle=colour//"rgb(165,100,0)";//rabbits brown
	headfunc();
	earfunc1();
	earfunc1fill();
	earfunc2();
  earfunc2fill();
	
	Cards.canvas[where].fill();
	
	//stroking covers up tiny gap between ears and head
	Cards.canvas[where].save()
	Cards.canvas[where].strokeStyle="rgb(0,0,0)";//colour=="rgb(0,0,200)"? "rgb(0,0,200)":"rgb(0,0,0)"
	Cards.canvas[where].lineWidth=1;
	Cards.canvas[where].beginPath()
	headfunc();
	earfunc1();
	//earfunc1fill();
	earfunc2();
	//earfunc2fill();
	Cards.canvas[where].stroke();
	Cards.canvas[where].restore();

	}
	
//x,y centre coords, h=height, u=upside down, c=colour.  All in pixels
Cards.drawText=function(letters,x,y,h,u,c,where)
  {
	
	if(u)
	  {
		h*=-1
		}
	t=Math.round(Math.abs(h/14));
	w=h/2;
	w2=h/4;
	w4=h/8;
	h2=h/2;
	h4=h/4;
	//h=h;
	
	Cards.canvas[where].save();
	Cards.canvas[where].beginPath();
	Cards.canvas[where].lineWidth=t
  Cards.canvas[where].lineCap='round'
	Cards.canvas[where].lineJoin='round'
	Cards.canvas[where].strokeStyle=c;
	
	switch(letters)
	  {
		case 'A':
		  Cards.canvas[where].moveTo(x-w2 , y+h2)//bottom left
			Cards.canvas[where].lineTo(x , y-h2)//top point
			Cards.canvas[where].lineTo(x+w2 , y+h2)//bottom right
			Cards.canvas[where].moveTo(Cards.tidy(x-w4,t) , Cards.tidy(y,t))//part left middle
			Cards.canvas[where].lineTo(Cards.tidy(x+w4,t) , Cards.tidy(y,t))//part right middle
		break;
		case 'J':
		  Cards.canvas[where].moveTo(Cards.tidy(x-w2,t) , Cards.tidy(y-h2,t))//top left
			Cards.canvas[where].lineTo(Cards.tidy(x+w2,t) , Cards.tidy(y-h2,t))//top right
			Cards.canvas[where].moveTo(Cards.tidy(x,t) , Cards.tidy(y-h2,t))//middle of top
			Cards.canvas[where].lineTo(Cards.tidy(x,t) , Cards.tidy(y+h4+h/8,t))//near middle of bottom
			Cards.canvas[where].arc(x-w4 , y+h4+h/8 , Math.abs(h/8) , 0+(u?Math.PI:0) , Math.PI+(u?Math.PI:0) , false);
		break;
		case 'Q':
		  Cards.canvas[where].arc(x , y-h4 , Math.abs(h4) , 0+(u?Math.PI:0) , Math.PI+(u?Math.PI:0) , true);
			Cards.canvas[where].lineTo(x-w2 , y+h4)
			Cards.canvas[where].arc(x , y+h4 , Math.abs(h4) , Math.PI+(u?Math.PI:0) , 0+(u?Math.PI:0) , true);
			Cards.canvas[where].lineTo(x+w2 , y-h4)
			Cards.canvas[where].moveTo(x,y)
			Cards.canvas[where].lineTo(x+w2 , y+h2)
		break;
		case 'K':
		  Cards.canvas[where].moveTo(Cards.tidy(x-w2,t) , Cards.tidy(y-h2,t));//top left
			Cards.canvas[where].lineTo(Cards.tidy(x-w2,t) , Cards.tidy(y+h2,t));//bottom left
			Cards.canvas[where].moveTo(x+w2 , y-h2);//top right
			Cards.canvas[where].lineTo(Cards.tidy(x-w2,t) , y);//centre left
			Cards.canvas[where].lineTo(x+w2 , y+h2);//bottom right
		break;
		case 2:
		  Cards.canvas[where].arc(x , y-h4 , Math.abs(h4) , Math.PI +(u?Math.PI:0) , Math.PI/4+(u?Math.PI:0) , false)
			Cards.canvas[where].lineTo(Cards.tidy(x-w2,t) , Cards.tidy(y+h2,t))//bottom left
			Cards.canvas[where].lineTo(Cards.tidy(x+w2,t) , Cards.tidy(y+h2,t))//bottom right
		  /*
		  Cards.canvas[where].moveTo(x+w2 , y+h2)//bottom right
			Cards.canvas[where].lineTo(x-w2 , y+h2)//bottom left
			Cards.canvas[where].lineTo(x+w2 , y-h4)//mid top right
			Cards.canvas[where].arc(x , y-h4 , Math.abs(h4) , 0+(u?Math.PI:0) , Math.PI +(u?Math.PI:0) , true)
			*/
		break;
		case 3:
		  Cards.canvas[where].moveTo(x-w2 , y+h4)//mid bottom left
			Cards.canvas[where].arc(x , y+h4 , Math.abs(h4) , Math.PI+(u?Math.PI:0) , -Math.PI/2+(u?Math.PI:0) , true)
			Cards.canvas[where].arc(x , y-h4 , Math.abs(h4) , Math.PI/2+(u?Math.PI:0) , Math.PI+(u?Math.PI:0) , true)
		break;
		case 4:
		  Cards.canvas[where].moveTo(Cards.tidy(x+w2,t) , Cards.tidy(y+h4,t))//right
			Cards.canvas[where].lineTo(Cards.tidy(x-w2,t) , Cards.tidy(y+h4,t))//left
			Cards.canvas[where].lineTo(Cards.tidy(x+w4,t) , Cards.tidy(y-h2,t))//top
			Cards.canvas[where].lineTo(Cards.tidy(x+w4,t) , Cards.tidy(y+h2,t))//bottom
		break;
		case 5:
		  //Cards.canvas[where].moveTo(x + Math.cos(-Math.PI*3/4+(u?Math.PI:0))*h4 , y+h4 + Math.sin (Math.PI*3/4+(u?Math.PI:0))*h4)
		  Cards.canvas[where].arc(x , y+h4 , Math.abs(h4) , Math.PI*3/4+(u?Math.PI:0) , -Math.PI*3/4+(u?Math.PI:0) , true);
			Cards.canvas[where].lineTo(x+ Math.cos(-Math.PI*3/4+(u?Math.PI:0))*Math.abs(h4)  , Cards.tidy(y-h2,t));//near left top
			Cards.canvas[where].lineTo(Cards.tidy(x+w2,t) , Cards.tidy(y-h2,t));//top right
		break;
		case 6:
		  Cards.canvas[where].arc(x , y-h4 , Math.abs(h4) , 0+(u?Math.PI:0) , Math.PI+(u?Math.PI:0) , true);
			Cards.canvas[where].lineTo( x-w2 , y+h4)
			Cards.canvas[where].moveTo(x+Math.cos(0)*Math.abs(h4) , y+h4)
			Cards.canvas[where].arc(x , y+h4 , Math.abs(h4) , 0 , Math.PI*2 , false)
		break;
		case 7:
		  Cards.canvas[where].moveTo(Cards.tidy(x-w2,t) , Cards.tidy(y-h2,t));//top left
			Cards.canvas[where].lineTo(Cards.tidy(x+w2,t) , Cards.tidy(y-h2,t));//top right
			Cards.canvas[where].lineTo(x-w2 , y+h2);//bottom left
		break;
		case 8:
		  Cards.canvas[where].moveTo(x+Math.abs(h4) , y-h4);
		  Cards.canvas[where].arc(x , y-h4 , Math.abs(h4) , 0 , Math.PI*2 , false)
			Cards.canvas[where].moveTo(x+Math.abs(h4) , y+h4);
		  Cards.canvas[where].arc(x , y+h4 , Math.abs(h4) , 0 , Math.PI*2 , false)
		break;
		case 9:
		  Cards.canvas[where].arc(x , y+h4 , Math.abs(h4) , Math.PI+(u?Math.PI:0) , 0+(u?Math.PI:0) , true);
//			Cards.canvas[where].moveTo(x+w2 , y+h4)
			Cards.canvas[where].lineTo(x+w2 , y-h4)
			Cards.canvas[where].moveTo(x+Math.cos(0)*Math.abs(h4) , y-h4)
			Cards.canvas[where].arc(x , y-h4 , Math.abs(h4) , 0 , Math.PI*2 , false)
		break;
		case 10:
		  Cards.canvas[where].moveTo(Cards.tidy(x-w2,t) , Cards.tidy(y-h2,t));//top left
			Cards.canvas[where].lineTo(Cards.tidy(x-w2,t) , Cards.tidy(y+h2,t));//bottom left
			
			Cards.canvas[where].moveTo(x+w2 , y-h4-h/8);//near top right
			Cards.canvas[where].arc(x+w4 , y-h4-h/8 , Math.abs(h/8) , 0+(u?Math.PI:0) , Math.PI+(u?Math.PI:0) , true);
			Cards.canvas[where].lineTo(x , y+h4+h/8);
			Cards.canvas[where].arc(x+w4 , y+h4+h/8 , Math.abs(h/8) , Math.PI+(u?Math.PI:0) , 0+(u?Math.PI:0) , true);
			Cards.canvas[where].lineTo(x+w2 , y-h4-h/8);
		break;
		}
	
	Cards.canvas[where].stroke();
	Cards.canvas[where].restore();
	}

//tidies a coordinate to allow crisp lines
Cards.tidy=function(xy,t)
  {
	return Math.floor(xy)+(t%2==0 ? 0:0.5);
	}
	
//jokers:int, faceup:boolean[, decks:int (optional), suits:int (option)]
Cards.deck=function(jokers,faceup,decks,suits)
  {
	if(typeof decks=='undefined')
	  {
		decks=1;
		}
		
	if(typeof suits=='undefined')
	  {
		suits=4;
		}
		
	this.cards=new Array();
	
	for(var i0=0;i0<decks;i0++)
  	{
  	for(var i=0;i<4;i++)
  	  {	
			suit=i;
			if(suits==2)
			  {
				//two suits has a special bit to make sure that one is red and one is black - design flaw I should have spotted long ago.  In an ideal world, suits should go red black, red black.
				while(suit==1 || suit==3)
				  {
					suit++;
					suit%=4;
					}
				}
			else
  		  {
  			suit%=suits;
  			}
  		for(var i2=1;i2<14;i2++)
  		  {
  			this.cards.push(new Cards.card(suit,i2,faceup))
  			}
  		}
  	}
	
	for(var i=0;i<jokers;i++)
	  {
		this.cards.push(new Cards.card(4,0,faceup))
		}	
	
	this.cardcount=this.cards.length;
	
	this.shuffle=Cards.shuffleDeck;
	}

Cards.shuffleDeck=function()
  {
	
	donecards=new Array();
	newcards=new Array();
	i=Math.round(Math.random()*(this.cards.length-1));
	
	while(donecards.length<this.cardcount)
	  {
		while(Cards.inarray(i,donecards))
		  {
			i=Math.round(Math.random()*(this.cards.length-1));
			}
		newcards.push(this.cards[i]);
		donecards.push(i);
		}
	
	this.cards=new Array();
	this.cards=newcards;
	
	}


//stop dragging a card
Cards.dropCard=function()
  {
	Cards.drag=false;
	Cards.minicanvastag.style.display='none';
	}
	
//text 'on canvas'
Cards.text=function(html,colour,width,height,left,top,size)
  {
	//name of div to be created
	this.divname='Cardstextdiv'+Cards.texts.length;
	//create html
	Cards.span.innerHTML+="<div id='"+this.divname+"' style='color:"+colour+";display:block;position:absolute;width:"+(width*Cards.width)+"px;height:"+(height*Cards.height)+"px;margin-left:"+(left*Cards.width)+"px;margin-top:"+(top*Cards.height)+"px;z-index:1;font-size:"+(Cards.height*size)+"px;'>"+html+"</div>";
	//shortcut to div
	this.div=document.getElementById(this.divname);
	//disable text selection - more flash-game-like
	Cards.noSelect(this.div);
	//show text
	this.show=function()
	  {
		document.getElementById(this.divname).style.display='block';
		}
	//hide text
	this.hide=function()
	  {
		document.getElementById(this.divname).style.display='none';
		}
	
	//add to text array
	Cards.texts.push(this);
	}

Cards.hideTexts=function()
  {
		for(var i=0;i<Cards.texts.length;i++)
		{
		document.getElementById(Cards.texts[i].divname).style.display='none';
		}
	}
	
Cards.clear=function()
  {
	//Cards.hideTexts();
	Cards.span.innerHTML='';
	Cards.texts=new Array();
	//clear canvas
	Cards.canvas[0].clearRect(0,0,Cards.width,Cards.height);
	}
	
//disables text selection for a div
Cards.noSelect=function(thisdiv)
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
/*
Cards.clear=function()
  {
	//Cards.hideTexts();
	//clear canvas
	Cards.canvas[0].clearRect(0,0,Cards.width,Cards.height);
}
*/
Cards.get=function(name)
  {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    {
		return false;
		}
   else
    {
		return results[1];
		}
  }

//is the needle in the haystack?
Cards.inarray=function(needle,haystack)
  {
	for (var k=0;k<haystack.length;k++)
	  {
		if(haystack[k] === needle)
		  {
			return true;
			}
		}
	return false;
	}

Cards.checkMice=function()
  {
	if(Cards.drag!==false && Cards.checkCount%2==0)
	  {
		Cards.minicanvastag.style.marginLeft=Cards.mouse[0]+Cards.dragDiff[0];
		Cards.minicanvastag.style.marginTop=Cards.mouse[1]+Cards.dragDiff[1]+Cards.height*0.04;//plus extra height because of menubar at top.
		}
	Cards.checkCount++
	}

	
Cards.getMouse=function(e)
  {//if(IE){
	if(document.all)
	  {
		//grab the x-y pos.s if browser is IE
		Cards.mouse[0] = event.clientX + document.body.scrollLeft - Cards.findPosX(Cards.canvastag);//Cards.div.offsetLeft - Cards.canvastag.offsetLeft;
		Cards.mouse[1] = event.clientY + document.body.scrollTop - Cards.findPosY(Cards.canvastag);//Cards.div.offsetTop - Cards.canvastag.offsetTop;
	}else{
	  //grab the x-y pos.s if browser is NS
		Cards.mouse[0] = e.pageX - Cards.findPosX(Cards.canvastag)//.offsetLeft;
		Cards.mouse[1] = e.pageY - Cards.findPosY(Cards.canvastag)//.offsetTop;
		}
	//catch possible negative values in NS4
	if (Cards.mouse[0] < 0){Cards.mouse[0] = 0}
	if (Cards.mouse[1] < 0){Cards.mouse[1] = 0}
	//this will do things with the mouse movement
	Cards.checkMice();
	Cards.oldmouse[0]=Cards.mouse[0];
	Cards.oldmouse[1]=Cards.mouse[1];
	//alert(Cards.mouse[0]+','+Cards.mouse[1])
	}
	
//VERY useful pair of functions, curtersy of http://blog.firetree.net/2005/07/04/javascript-find-position/

Cards.findPosX=function(obj)
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

Cards.findPosY=function(obj)
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

/* This script and many more are available free online at
The JavaScript Source!! http://javascript.internet.com
Created by: Simon Willison | http://simon.incutio.com/ */

Cards.addLoadEvent=function(func) {
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