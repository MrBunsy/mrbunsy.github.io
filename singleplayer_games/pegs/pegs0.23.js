//everything for the game is done through the pegs variable - should make it easy to put the game on any page without interefing.
var pegs=new Object();

//convert a style size to a number
pegs.toNumber=function(str)
  {
	return str;
	str=str.replace("px","");
	return parseFloat();
	}

//is the needle in the haystack?
pegs.inarray=function(needle,haystack)
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
//square of the distance between two points
pegs.distance=function(x1,x2,y1,y2)
  {
	return (Math.pow(x1-x2,2) + Math.pow(y1-y2,2));
	}

pegs.clickMes=new Array();
//an object which can be clicked on.
//types: 0=colour chooser (info= int: colour), 1=hole on board (info=array, [row, col])
pegs.clickMe=function(x,y,r,type,info)
  {
	this.x=x;
	this.y=y;
	this.r=Math.pow(r,2)
	this.type=type;
	this.info=info;
	pegs.clickMes.push(this);
	}

pegs.clicked=false;
	
pegs.findClickMe=function()
  {
	for(var i=0;i<pegs.clickMes.length;i++)
		{
		if(pegs.distance(pegs.mouse[0],pegs.clickMes[i].x,pegs.mouse[1],pegs.clickMes[i].y) < pegs.clickMes[i].r)
			{
			//the distance between the mouse cursor and the centre of one of the objects is less than its radius
			pegs.clicked=i;
			return i;
		  }
	  }
	return false;
	}

//is a row full of pegs?
pegs.rowFull=function(row)
  {
	if(row>7)
	  {
		return false;
		}
	inrow=0;
	for(var i=0;i<4;i++)
	  {
		if(pegs.rows[row][0][i]!==false)
		  {
			inrow++;
			}
		}
	if(inrow==4)
	  {
		return true;
		}
	return false;
	}
	
//mouse has gone down.
pegs.mouseDown=function()
  {
	//alert(pegs.findClickMe())
	if(pegs.inGame && pegs.findClickMe()!==false)
	  {
		//in game and something has been clicked.
		switch(pegs.clickMes[pegs.clicked].type)
		  {
			case 0://colour chooser
			  pegs.whatChosen=[false,pegs.clickMes[pegs.clicked].info];
			break;
			case 1://hole clicked
			  if(pegs.activeRow==pegs.clickMes[pegs.clicked].info[0])
				  {
					//this row is the active one
					
					if(pegs.whatChosen[0]===false)
					  {//a colour is already chosen
						pegs.rows[pegs.activeRow][0][pegs.clickMes[pegs.clicked].info[1]]=pegs.whatChosen[1];
						//pegs.whatChosen=[false,false];
						}
					else
					  {
						//pegs.whatChosen=[pegs.activeRow,pegs.clickMes[pegs.clicked].info[1]];
						pegs.rows[pegs.activeRow][0][pegs.clickMes[pegs.clicked].info[1]]=false;
						}
					}
			break;
			}
		pegs.reDraw(false);
		}
	}
	
//load the game.
pegs.load=function()
  {
	this.div=document.getElementById('pegsdiv');
	this.span=document.getElementById('pegsspan');
	this.span.style.position="absolute"
	this.span.style.fontFamily='Helvetica,Arial, "trebuchet MS",  sans-serif';
	this.span.style.cursor="pointer";
	pegs.noSelect(this.span);
	this.canvastag=document.getElementById('pegscanvas');
  this.width=this.toNumber(this.canvastag.width);
	this.height=this.toNumber(this.canvastag.height);
	this.canvastag.style.border="solid black 1px";
	this.canvastag.style.cursor="pointer";
	this.canvastag.style.backgroundColor="#8cd2ff";
	this.canvastag.onclick=pegs.mouseDown;
	this.canvastag.style.top="0";
	this.canvastag.style.zIndex="0";
	
	//document.onmouseup   = finalmouseup;
  this.div.onmousemove=pegs.getMouse;
	this.span.onclick=pegs.mouseDown;
	
	//make canvas
	if (this.canvastag.getContext)
	  {
		this.canvas = this.canvastag.getContext('2d');
		}
	//set up game variables
	this.inGame=false;
	
	//make menus
	this.mainMenu=new this.menu("<center>Welcome to Pegs<br><br><span style=\"font-size:"+(pegs.height*0.1)+"px;\" onClick=\"pegs.startGame();\">Play</span><br><br><span id='pegsdifficultspan' onClick=\"pegs.changedifficult();\">Difficulty: Medium</span><br><br><span onClick='pegs.helpMenu.open();'>Help</span><br><br><br><span style=\"font-size:"+(pegs.height*0.03)+"px;\"><a style='color:black;' href='http://www.lukewallin.co.uk'>&copy Luke Wallin 2008</a></span></center>");
	this.helpMenu=new this.menu("<span style=\"font-size:"+(pegs.height*0.05)+"px;\"><center><b>How to Play</b></center></span><span style=\"font-size:"+(pegs.height*0.035)+"px;\"><br><br>The aim of Pegs is to logically deduce the colours and locations of the hidden pegs.<br><br>After placing 4 pegs on the board click <b>Ready</b> to see how many were right.  A black peg means one peg is the right colour and in the right place, a white peg means a peg is the right colour but in the wrong place.<br><br>You must get all the pegs right before 8 attempts or you will lose.<br><br>On <b>easy</b> there are only six colours and each peg will be a different colour.  On <b>medium</b> there can be repetitions and on <b>hard</b> there are eight colours.</span><br><br><span style='font-size:"+(pegs.height*0.04)+"px;\' onClick='if(pegs.inGame) {pegs.closeMenus();pegs.reDraw(false);} else{ pegs.mainMenu.open();}'>Back</span>");
	this.mainMenu.open();
	}

//difficulty, 0=easy, 1=medium, 2=hard, 3=very hard.
pegs.difficult=1;
pegs.changedifficult=function()
  {
	pegs.difficult++
	pegs.difficult%=3;
	
	switch(pegs.difficult)
	  {
		case 0:
		  document.getElementById('pegsdifficultspan').innerHTML="Difficulty: Easy";
		break;
		case 1:
		  document.getElementById('pegsdifficultspan').innerHTML="Difficulty: Medium";
		break;
		case 2:
		  document.getElementById('pegsdifficultspan').innerHTML="Difficulty: Hard";
		break;
		case 3:
		//currently disabled.
		  document.getElementById('pegsdifficultspan').innerHTML="Difficulty: Mastermind";
		break;
		}
	
	}	


//returns [dark, bold, light]
pegs.getColour=function(colour)
  {
	switch(colour)
	  {
		case 0:
		  return ["rgb(220,0,0)",'rgb(255,0,0)',"rgb(255,64,64)"];
		break;
		case 1:
		  return ["rgb(240,135,0)",'rgb(255,165,0)',"rgb(255,200,45)"];
		break;
		case 2:
		  return ['rgb(220,220,0)','rgb(255,255,0)','rgb(255,255,80)'];
		break;
		case 3:
		  return ['rgb(0,150,0)','rgb(0,200,0)','rgb(100,255,100)'];
		break;
		case 4:
		  return ['rgb(0,0,200)','rgb(50,50,255)','rgb(128,128,255)'];
		break;
		case 5:
		  return ["rgb(100,0,100)",'rgb(128,0,128)',"rgb(200,0,200)"];
		break;
		case 6:
		  return ['rgb(100,100,100)','rgb(128,128,128)','rgb(200,200,200)'];
		break;
		case 7:
		  return ['rgb(75,51,0)','rgb(110,51,0)','rgb(170,101,50)'];
		break;
		case 8://white
		  return ['rgb(200,200,200)','rgb(255,255,255)','rgb(255,255,255)'];
		break;
		case 9://black
		  return ['rgb(0,0,0)','rgb(0,0,0)','rgb(128,128,128)'];
		break;
		}
	}

/*
Colours:

0=Red
1=Orange
2=Yellow
3=Green
4=Blue
5=Purple

6=Grey
7=Brown

Difficulty:

0=Easy: 6 colours, no repetitions, 4 pegs
1=Medium: 6 colours, repetitions, 4 pegs
2=hard: 8 colours, repetitions, 4 pegs
3=very hard, 8 colours, reptitions, 6 pegs? - might leave this out.
*/
	
pegs.startGame=function()
  {
	pegs.closeMenus();
	pegs.inGame=true;
	pegs.activeRow=0;
	pegs.clickMes=new Array();
	//whatchosen[0]: false=colour, int=row
	//whatchosen[1]: colour or col num
	pegs.whatChosen=[false,0];
	
	//rows[x]=row num
	//rows[x][0]=array of colours in that row
	//rows[x][1]=array of length 2 for marks for that row.
	pegs.rows=new Array(8);
	
	//create array containing all the pegs on the board
	for(var i=0;i<pegs.rows.length;i++)
	  {
		pegs.rows[i]=[new Array(4),[0,0]];
		
		for(var i2=0;i2<pegs.rows[i][0].length;i2++)
		  {
			pegs.rows[i][0][i2]=false;
			}
		
		}
	
	//create pegs array (pegs to be guessed) then fill it with colours
	switch(pegs.difficult)
	  {
		case 0://easy
		  pegs.pegs=new Array(4);
			pegs.colours=6;
			for(var i=0;i<pegs.pegs.length;i++)
			  {
				var randomcolour=Math.round(Math.random()*5.5-0.5);
				//easy, so no repetiton - check to see if new colour is in pegs array.
				while(pegs.inarray(randomcolour,pegs.pegs))
				  {
					randomcolour=Math.round(Math.random()*5.5-0.5);
					}
				pegs.pegs[i]=randomcolour
				}
		break;
		case 1://medium
		  pegs.pegs=new Array(4);
			pegs.colours=6;
			for(var i=0;i<pegs.pegs.length;i++)
			  {
				var randomcolour=Math.floor(Math.random()*5.99);
				pegs.pegs[i]=randomcolour
				}
		break;
		case 2://hard
		  pegs.pegs=new Array(4);
			pegs.colours=8;
			for(var i=0;i<pegs.pegs.length;i++)
			  {
				var randomcolour=Math.round(Math.random()*7.5-0.5);
				pegs.pegs[i]=randomcolour
				}
		break;
		case 3://very hard
		  pegs.pegs=new Array(6);
			pegs.colours=8;
			for(var i=0;i<pegs.pegs.length;i++)
			  {
				var randomcolour=Math.round(Math.random()*7.5-0.5);
				pegs.pegs[i]=randomcolour
				}
		break;
		}
	//pegs.pegs=[0,0,0,1]
//	pegs.pegs=[3,4,2,2];
	pegs.reDraw(true);
	
	}

pegs.markRow=function()
  {
	//array of pegs to be guessed which have already been taken into consideration
	realmarked=new Array();
	//pegs placed on board already taken into consideration
	ourmarked=new Array()
	blacks=0;
	whites=0;
	
	//first run through to collect count of blacks.
	for(var i=0;i<pegs.rows[pegs.activeRow][0].length;i++)
	  {
	  if(pegs.pegs[i]==pegs.rows[pegs.activeRow][0][i])
	    {
			//same colour in same place
			blacks++;
			ourmarked.push(i);
			realmarked.push(i);
			}
	  }
	
	for(var i=0;i<pegs.rows[pegs.activeRow][0].length;i++)
	  {
		if(!pegs.inarray(i,ourmarked))
		  {
			//this peg isn't totally correct (not black)
			for(var i2=0;i2<pegs.pegs.length;i2++)
			  {
				if(!pegs.inarray(i2,realmarked))
		      {
					//peg hasn't been used already
					if(pegs.pegs[i2]==pegs.rows[pegs.activeRow][0][i])
					  {
						//peg is same colour, but not same place
						whites++
						realmarked.push(i2)
						break;
						}
					}
				}
			}
		ourmarked.push(i)
		}
	//add total of black and white pegs to rows array.
	pegs.rows[pegs.activeRow][1]=[blacks,whites];
	
	pegs.activeRow++;
	pegs.reDraw(false);
	
	if(blacks==4)
	  {
		pegs.gameOver(true);
		}
	else if(pegs.activeRow>7)
	  {
		pegs.gameOver(false);
		}
	}

pegs.gameOver=function(win)
  {
	pegs.inGame=false;
	pegs.clear();
	switch(win)
	  {
		case true:
		  new pegs.text("<center>Well done!</center>",1,0.1,0,0.1,0.1);
			new pegs.text("<center>You worked out the correct pegs</center>",1,0.05,0,0.25,0.05);
			new pegs.text("<center><span onClick='pegs.activeRow--;pegs.reDraw(false);'>See My Solution</span></center>",1,0.05,0,0.7,0.05);
			//
		break;
		case false:
			 new pegs.text("<center>Game Over!</center>",1,0.2,0,0.1,0.1);
			new pegs.text("<center>Oh dear! You've run out of rows</center>",1,0.2,0,0.25,0.05);
new pegs.text("<center><span onClick='pegs.activeRow--;pegs.reDraw(false);'>See Where I Went Wrong</span></center>",1,0.05,0,0.7,0.05);
		break;
	  }
	//draw the actual pegs
	for(var i=0;i<pegs.pegs.length;i++)
	  {
		//function(x,y,r,c,h)
		pegs.drawPeg((0.5+(i-2)*0.2+0.1)*pegs.width , 0.45*pegs.height , 0.08*pegs.width ,pegs.pegs[i],false);
		}
	new pegs.text("<center><span onClick='pegs.clear();pegs.mainMenu.open();'>Menu</span></center>",1,0.05,0,0.6,0.05);
	}

	

pegs.drawArrow=function (x,y,size,angle,thick)
  {//x,y is for the centre of the arrow.
	x*=pegs.width;
	y=Math.round(pegs.height*y)-0.5;
	size=Math.round(pegs.width*size);
	thick*=pegs.height;
	
  pegs.canvas.save();
  pegs.canvas.beginPath();
  pegs.canvas.lineWidth=thick;
	pegs.canvas.strokeStyle="rgb(0,0,0)";
  pegs.canvas.lineCap='round';
  pegs.canvas.lineJoin='round';
  pegs.canvas.moveTo(x+Math.cos(angle+Math.PI)*size/2 , y+Math.sin(angle+Math.PI)*size/2)//bottom of arrow
  pegs.canvas.lineTo(x+Math.cos(angle)*size/2 , y+Math.sin(angle)*size/2)//point of arrow

  pegs.canvas.moveTo(x+Math.cos(angle+Math.PI/4)*size/4 , y+Math.sin(angle+Math.PI/4)*size/4)//end of one of the > bits
  pegs.canvas.lineTo(x+Math.cos(angle)*size/2 , y+Math.sin(angle)*size/2)//back to point
  pegs.canvas.lineTo(x+Math.cos(angle-Math.PI/4)*size/4 , y+Math.sin(angle-Math.PI/4)*size/4)//other pointy bit.
  pegs.canvas.stroke();
  pegs.canvas.restore();
	}
	
pegs.reDraw=function(firsttime)
  {
	//clear canvas and text
	pegs.clear();
	
	//bg of board
	pegs.canvas.fillStyle="rgb(140,90,0)";
	pegs.canvas.fillRect(Math.round(pegs.width*0.2375),0,Math.round(pegs.width*0.625),pegs.height);
	
	//draw arrow pointing to activeRow
	pegs.drawArrow(0.16875,0.125*pegs.activeRow+0.0625,0.1,0,0.01)
	
	//divide board into sections
	pegs.canvas.strokeStyle="rgb(50,25,0)";
	pegs.canvas.lineWidth=2;
	pegs.canvas.beginPath();
	
	//lines at edges of board
	pegs.canvas.moveTo(Math.round(pegs.width*0.2375),0)
	pegs.canvas.lineTo(Math.round(pegs.width*0.2375),pegs.height)
	
	pegs.canvas.moveTo(Math.round(pegs.width*0.8625),0)
	pegs.canvas.lineTo(Math.round(pegs.width*0.8625),pegs.height)
	
	//line at RHS dividing peg area to marking area
	pegs.canvas.moveTo(Math.round(pegs.width*0.7375),0)
	pegs.canvas.lineTo(Math.round(pegs.width*0.7375),pegs.height)
	
	//divide board into rows
	for(var i=0;i<9;i++)
	  {
		pegs.canvas.moveTo(Math.round(pegs.width*0.2375) , Math.round(pegs.height*0.125*i))
		pegs.canvas.lineTo(Math.round(pegs.width*0.8625) , Math.round(pegs.height*0.125*i))
		}
	pegs.canvas.stroke();
	
	//draw peg holes in board
	for(var i=0;i<8;i++)
	  {
		for(var i2=0;i2<4;i2++)
		  {
			tempx=pegs.width*(0.2375 + 0.0625 + 0.125*i2);
			tempy=Math.round(pegs.height*(0.125*i + 0.0625) );
			
			if(pegs.rows[i][0][i2]===false)
			  {
				//empty hole
				pegs.drawHole(tempx , tempy , pegs.width*0.02);
				}
			else
			  {
				//peg in hole
				temph=false
				i===pegs.whatChosen[0] && pegs.whatChosen[1]===i2 ? temph=true : temph=false;
				pegs.drawPeg(tempx , tempy, pegs.width*0.04, pegs.rows[i][0][i2] , temph)
				}
			if(firsttime)
			  {
				new pegs.clickMe(tempx,tempy,pegs.width*0.04,1,[i,i2]);
				}
			}
		}
	
	//draw peg holes in marking section of board
	drawnThisRow=0;
  toDraw=pegs.calcToDraw(0);
	
	for(var i=1;i<24;i++)
	  {
		if(i%3!=0)
		  {
			for(var i2=0;i2<2;i2++)
		    {
				switch(toDraw[drawnThisRow])
				  {
					case 0:
					  pegs.drawPeg(pegs.width*(0.7792 + 0.04167*i2),Math.round(pegs.height*(0.04167*i) ),pegs.width*0.01,9,false)
					break;
					case 1:
					  pegs.drawPeg(pegs.width*(0.7792 + 0.04167*i2),Math.round(pegs.height*(0.04167*i) ),pegs.width*0.01,8,false)
					break;
					case 2:
					  pegs.drawHole(pegs.width*(0.7792 + 0.04167*i2) , Math.round(pegs.height*(0.04167*i) ) , pegs.width*0.005)
				  break;
					}
				drawnThisRow++;
				}
			}
		else
		  {
			//skip this row and reset drawn counter.
			drawnThisRow=0;
			toDraw=pegs.calcToDraw(Math.floor(i/3));
			}
		}
	
	//draw coloured pegs down LHS
	for(var i=0;i<pegs.colours;i++)
	  {
		tempx=Math.round(pegs.width*0.05)
		tempy=Math.round( pegs.height*0.1*i + pegs.height*0.05 )
		temph=false
		pegs.whatChosen[0]===false && i===pegs.whatChosen[1] ? temph=true : temph=false;
		pegs.drawPeg(tempx , tempy, pegs.width*0.04, i , temph)
		
		if(firsttime)
		  {
			new pegs.clickMe(tempx,tempy,pegs.width*0.04,0,i);
			}
		}
		
	new pegs.text("<span onClick='pegs.helpMenu.open();pegs.clear();'>Help</span>",0.1,0.1,0.015,0.1*8+0.02,0.04);
	new pegs.text("<span onClick='pegs.mainMenu.open();pegs.clear();pegs.inGame=false;'>Quit</span>",0.1,0.1,0.015,0.1*9+0.02,0.04);
		
	if(pegs.inGame && pegs.rowFull(pegs.activeRow))
		{
		//function(html,width,height,left,top,size)
		new pegs.text("<span onClick='pegs.markRow();'>Ready?</span>",0.1375,0.125,0.865,0.125*pegs.activeRow+0.042,0.04)
		}
	
	}

pegs.calcToDraw=function(row)
  {
	toDraw=new Array(4);
	totalpegs=pegs.rows[row][1][0]+pegs.rows[row][1][1];
	for(var i=0;i<toDraw.length;i++)
	  {
		if(i<pegs.rows[row][1][0])
		  {
			//black pegs to draw
			toDraw[i]=0;
			}
		else if(i<totalpegs)
		  {
			//white to draw
			toDraw[i]=1;
			}
		else
		  {
			//empty
			toDraw[i]=2;
			}
		}
	return toDraw;
	}
	
//draw a peg at [x,y] radius r, colour number c, h: highlighted?
pegs.drawPeg=function(x,y,r,c,h)
  {
	colour=pegs.getColour(parseFloat(c));
	grad = pegs.canvas.createLinearGradient(x-r,y-r,x+r,y+r);
	grad.addColorStop(0,colour[0]);//dark
	grad.addColorStop(1,colour[2]);//light
	
	pegs.canvas.beginPath();
	pegs.canvas.fillStyle=grad;
	pegs.canvas.moveTo(x+r,y);
	pegs.canvas.arc(x,y,r,0,Math.PI*2,false);
	pegs.canvas.fill();
	
	pegs.canvas.beginPath();
	pegs.canvas.lineWidth=2;
	switch(h)
	  {
		case false:
		  pegs.canvas.strokeStyle="rgb(0,0,0)";
		break;
		case true:
		  //yellow highlight
		  pegs.canvas.strokeStyle=pegs.getColour(2)[1];
		break;
		}
	pegs.canvas.moveTo(x+r+0.125,y);
	pegs.canvas.arc(x,y,r+0.25,0,Math.PI*2,false);
	pegs.canvas.stroke();
	
	}

//draw a peg hole in the board.
pegs.drawHole=function(x,y,r)
  {
	pegs.canvas.beginPath();
	pegs.canvas.fillStyle="rgb(80,40,0)";
	pegs.canvas.moveTo(x+r,y);
	pegs.canvas.arc(x,y,r,0,Math.PI*2,false);
	pegs.canvas.fill();
	
	pegs.canvas.beginPath();
	pegs.canvas.strokeStyle="rgb(100,50,0)";
	pegs.canvas.moveTo(x+r,y);
	pegs.canvas.arc(x,y,r,0,Math.PI*2,false);
	pegs.canvas.stroke();
	
	}	


pegs.menus=new Array();
pegs.texts=new Array();

//menus in-game. sizes and positions are fractions of canvas size.
pegs.menu=function(html)
  {
	//name of div to be created
	this.divname='pegsmenudiv'+pegs.menus.length;
	//create html
	pegs.span.innerHTML+="<div id='"+this.divname+"' style='display:none;position:absolute;width:"+(pegs.width*0.9)+"px;margin-left:"+(pegs.width*0.05)+";margin-top:"+(pegs.height*0.05)+";z-index:1;font-size:"+Math.round(pegs.height*0.07)+"px;'>"+html+"</div>";
	//shortcut to div
	this.div=document.getElementById(this.divname);
	//disable text selection - more flash-game-like
	pegs.noSelect(this.div);
	//function to open this menu
	this.open=function()
	  {
		pegs.closeMenus();
		//using this.div doesn't seem to work.
		document.getElementById(this.divname).style.display="block";
		}
	//add to menu array
	pegs.menus.push(this);
	}

//text 'on canvas'
pegs.text=function(html,width,height,left,top,size)
  {
	//name of div to be created
	this.divname='pegstextdiv'+pegs.texts.length;
	//create html
	pegs.span.innerHTML+="<div id='"+this.divname+"' style='display:block;position:absolute;width:"+(width*pegs.width)+"px;height:"+(height*pegs.height)+"px;margin-left:"+(left*pegs.width)+"px;margin-top:"+(top*pegs.height)+"px;z-index:1;font-size:"+(pegs.height*size)+"px;'>"+html+"</div>";
	//shortcut to div
	this.div=document.getElementById(this.divname);
	//disable text selection - more flash-game-like
	pegs.noSelect(this.div);
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
	pegs.texts.push(this);
	}

//close all the menus
pegs.closeMenus=function()
  {
		for(var i=0;i<pegs.menus.length;i++)
		{
		document.getElementById(pegs.menus[i].divname).style.display='none';
		}
	}

pegs.hideTexts=function()
  {
		for(var i=0;i<pegs.texts.length;i++)
		{
		document.getElementById(pegs.texts[i].divname).style.display='none';
		}
	}
	
pegs.clear=function()
  {
	pegs.hideTexts();
	//clear canvas
	pegs.canvas.clearRect(0,0,pegs.width,pegs.height);
	}
	
//disables text selection for a div
pegs.noSelect=function(thisdiv)
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

//mouse coords
pegs.mouse=new Array(2);
pegs.oldmouse=new Array(2);
	
pegs.getMouse=function(e)
  {//if(IE){
	if(document.all)
	  {
		//grab the x-y pos.s if browser is IE
		pegs.mouse[0] = event.clientX + document.body.scrollLeft - pegs.span.offsetLeft;
		pegs.mouse[1] = event.clientY + document.body.scrollTop - pegs.span.offsetTop;
	}else{
	  //grab the x-y pos.s if browser is NS
		pegs.mouse[0] = e.pageX - pegs.span.offsetLeft;
		pegs.mouse[1] = e.pageY - pegs.span.offsetTop;
		}
	//catch possible negative values in NS4
	if (pegs.mouse[0] < 0){pegs.mouse[0] = 0}
	if (pegs.mouse[1] < 0){pegs.mouse[1] = 0}
	//this will do things with the mouse movement
	//checkmice();
	pegs.oldmouse[0]=pegs.mouse[0];
	pegs.oldmouse[1]=pegs.mouse[1];
	//alert(pegs.mouse[0]+','+pegs.mouse[1])
	}

//load pegs
this.onload=function()
  {
	pegs.load();
	}