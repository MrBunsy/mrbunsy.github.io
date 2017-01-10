// Javascript Simple Simon Solitaire 1.2
// Copyright Luke Wallin August 2008
// requires cards.js and tree.js
// Tested in IE 6,7,8, FF 3, Safari and Opera.
// Use following HTML to add this game to a page:
/*

<div  id="cardsdiv" style="width:850;height:700;"></div>
<script src="cards0.24.js" type="text/javascript"></script>
<script src="tree0.8.js" type="text/javascript"></script>
<script src="simon1.0.js" type="text/javascript"></script>

*/
// Any combination of height and width will work - although a rectangle wider than it is tall seems to be best to play in.
// Card piles will automatically squash themselves to avoid going off the bottom, so even quite short rectangles will work.

Simon=new Object();

//create canvas tag (must be done here to work in IE)
document.getElementById('cardsdiv').innerHTML+='<div id="menudiv" style="border:solid black 1px;background-color:#78beeb;width:'+parseFloat(document.getElementById('cardsdiv').style.width)+';height:'+parseFloat(document.getElementById('cardsdiv').style.height)*0.04+';font-size:'+parseFloat(document.getElementById('cardsdiv').style.height)*0.03+'px;"><span style="float:left;margin-left:'+parseFloat(document.getElementById('cardsdiv').style.height)*0.01+'px;"><span onClick="Simon.confirmNewGame();">New Game</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span onClick="Simon.undo();">Undo</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span onClick="Simon.help();">Help</span></span><span style="float:right;margin-right:'+parseFloat(document.getElementById('cardsdiv').style.height)*0.01+'px;" onClick="Simon.about();">Simple Simon</span></div><span id="cardsspan"></span><span style="display:none">this makes it work in IE for some bizzare reason</span><canvas style="display:none;" id="cardsminicanvas" width="'+(parseFloat(document.getElementById('cardsdiv').style.width)*0.1)+'" height="'+(parseFloat(document.getElementById('cardsdiv').style.height)*0.75)+'"></canvas><canvas id="cardscanvas" width="'+(parseFloat(document.getElementById('cardsdiv').style.width))+'" height="'+(parseFloat(document.getElementById('cardsdiv').style.height)*0.96)+'"></canvas>'

Simon.confirmNewGame=function()
  {
	if(!Simon.won)
  	{
  	//disable mouse clicks:
  	Cards.mouseDowns=new Array();
  	//"rgb(120,190,235)"
  	Cards.drawBox(0.325,0.3,0.35,0.3,'rgb(0,200,0)','rgb(0,0,0)',0);
 		new Cards.text('<center>New Game?<br><br><span onClick="Simon.newGame();">Yes</span>&nbsp;&nbsp;&nbsp;&nbsp; <span onClick="Simon.draw();">No</span></center>','#000000',1,0.25,0,0.36,0.05);
		}
	}

Simon.about=function()
  {
	if(!Simon.won)
  	{
  	//disable mouse clicks:
  	Cards.mouseDowns=new Array();
  	Cards.drawBox(0.3,0.3,0.4,0.35,'rgb(0,200,0)','rgb(0,0,0)',0);
  	new Cards.text('<center>Simple Simon 1.2<br><br><span style="font-size:'+Cards.width*0.03+'px;">&copy; Luke Wallin 2008<br><br>www.lukewallin.co.uk</a></span></center>','#000000',1,0.25,0,0.36,0.05);
  	//Cards.mouseDown=function(x,y,w,h,type,info,down)
  	new Cards.mouseDown(0.325,0.3,0.35,0.35 , 3 , false, true);
		}
	}

Simon.help=function()
  {
	if(!Simon.won)
  	{
  	//disable mouse clicks:
  	Cards.mouseDowns=new Array();
  	Cards.drawBox(0.05,0.05,0.9,0.86,'rgb(0,200,0)','rgb(0,0,0)',0);
  	new Cards.text('<span onClick="Simon.draw();"><center><b>How to Play</b><span style="font-size:'+Cards.width*0.03+'px;"><br><br>The aim of the game is to place all the cards in a stack of descending order of the same suit.  Once a pile from King to Ace of one suit has been made, it is folded up and placed off the table on the right hand side of the screen.<br><br>Cards can be placed on another card which is of a higher number, reguardless of suit.  For example, a five may be placed on any six.  Groups of cards can only be picked up if they are all the same suit and in consecutive descending order.  For example: five, four, three and two of spades.  Any card may be placed in a blank space.<br><br><b>Tip:</b> A good starting point is to try and clear a space.  Throughout the game keep as many spaces clear as possible.<br><br>(Click to close)</span></center></span>','#000000',0.86,0.82,0.07,0.06,0.05);
  	}
	}

Simon.newGame=function()
  {
	
	Simon.won=false;
	
	//set up undo:
	Simon.moves=new Array();
	
	//stop the bar at the top being selected
	Cards.noSelect(document.getElementById('menudiv'));
	
	//not won yet
	Simon.gameWon=false;
	//piles of suits completed
	Simon.aceStacks=0;
	
	Cards.minicanvastag.style.display="none";
	//mouse stuff for dragging minicanvas
	Simon.drag=false;
  Simon.dragDiff=new Array(2);
	
	//double click detection
	Simon.mouseDownAt=[[false,false],new Date()];
	Simon.justDoubleClicked=false;

	
	//mouse move stuff
	Cards.checkCount=0;
	Cards.checkMice=Simon.checkMice;
	
	//set up mouse detection
	Cards.div.onmousedown=function(){Simon.mouseGoneDown(true);}
	Cards.div.onmouseup=function(){Simon.mouseGoneDown(false);}
	
	//create a pack with no jokers
	Simon.deck=new Cards.deck(0,true);
	//shuffle deck
	Simon.deck.shuffle();
	
	//piles 0-9 are on the table and 10-13 are the ace piles
	Simon.piles=new Array(14);
	
	tempcardcount=0;
	
	for(var i=0;i<Simon.piles.length;i++)
	  {
		Simon.piles[i]=new Array();
		
		if(i<3)
		  {
			//first 3 piles - 8 cards each
			for(var i2=0;i2<8;i2++)
			  {
				Simon.piles[i].push(tempcardcount);
				tempcardcount++;
				}
			}
		else if(i<10)
		  {
			for(var i2=0;i2<(10-i);i2++)
			  {
				Simon.piles[i].push(tempcardcount);
				tempcardcount++;
				}
			}
		}
	
		
	//Simon.piles[0]=Simon.piles[0].concat(Simon.piles[1],Simon.piles[2],Simon.piles[3]);
	Simon.draw();
	}

Simon.checkMice=function()
  {
  if(Simon.drag!==false && Cards.checkCount%2==0)
	  {
		Cards.minicanvastag.style.marginLeft=Cards.mouse[0]+Simon.dragDiff[0];
		Cards.minicanvastag.style.marginTop=Cards.mouse[1]+Simon.dragDiff[1];
		}
	Cards.checkCount++
  }

Simon.undo=function()
  {
	if(Simon.moves.length>0)
  	{
  	movenum=Simon.moves.length-1;
  	if(Simon.moves[movenum].possible)
  	  {
  		//add cards back to old pile
    	Simon.piles[Simon.moves[movenum].oldpile]=Simon.piles[Simon.moves[movenum].oldpile].concat(Simon.piles[Simon.moves[movenum].newpile].slice(Simon.moves[movenum].newpos))
  		//take them off the new pile
  		Simon.piles[Simon.moves[movenum].newpile]=Simon.piles[Simon.moves[movenum].newpile].slice(0,Simon.moves[movenum].newpos);
  		//re-draw
  		Simon.draw();
  		//remove this move from the array
  		Simon.moves=Simon.moves.slice(0,-1)
    	}
  	}
	}	
	
//stop dragging a card
Simon.dropCard=function()
  {
	Simon.drag=false;
	Cards.minicanvastag.style.display='none';
	}

Simon.move=function(oldpile,newpile,newpos,possible)
  {
	//pile is, uh, the pile number.  pos is the position in that pile (including that card and all the cards on top).
	this.oldpile=oldpile;
	this.newpile=newpile;
	this.newpos=newpos;
	//if false, don't allow undos beyond this move (use to flying cards to ace stack?)
	this.possible=possible
	
	Simon.moves.push(this);
	}
	
//types:
// 0=card which can be dragged (info: array[col, row]),
// 1=pile which can be dragged ONTO (info:pile)
// 2=new game
// 3=re-draw screen
	
Simon.mouseGoneDown=function(down)
  {
  cardin=Cards.findmouseDown(down)

	if(cardin!==false)
  	{
  	switch(Cards.mouseDowns[cardin].type)
  	  {
			case 0://pick up card(s)
			
			  if(Simon.drag===false && Simon.canPickUp(Cards.mouseDowns[cardin].info[0] , Cards.mouseDowns[cardin].info[1]))
  				{
  				//store what cards are being dragged
  				Simon.drag=Simon.piles[Cards.mouseDowns[cardin].info[0]].slice(Cards.mouseDowns[cardin].info[1])
  				
  				//remove this from old pile
  				Simon.piles[Cards.mouseDowns[cardin].info[0]]=Simon.piles[Cards.mouseDowns[cardin].info[0]].slice(0,Cards.mouseDowns[cardin].info[1])
  				
  				//pile cards being dragged from
  				Simon.dragFrom=Cards.mouseDowns[cardin].info[0];
					//position in pile (save for undo function)
					//Simom.dragFromPos=Cards.mouseDowns[cardin].info[1]
  
  				//stuff for mouse dragging image of card
  				Simon.dragDiff[0]=Math.ceil(Cards.mouseDowns[cardin].x*Cards.width-Cards.mouse[0]);
  				Simon.dragDiff[1]=Math.ceil(Cards.mouseDowns[cardin].y*Cards.height-Cards.mouse[1]);
  				
  				//clear minicanvas
    			Cards.canvas[1].clearRect(0,0,Cards.width*0.10 , Cards.height*0.75)
					stackheight=0.035
  				//draw little cards on the minicanvas
    			for(var i=0;i<Simon.drag.length;i++)
    			  {
      			Simon.deck.cards[Simon.drag[i]].draw(0.0001,0.001+i*(stackheight)*Cards.width/Cards.height,0.08,1,i==Simon.drag.length-1?true:false)
    				}
  				Cards.minicanvastag.style.marginLeft=Cards.mouse[0]+Simon.dragDiff[0];
      		Cards.minicanvastag.style.marginTop=Cards.mouse[1]+Simon.dragDiff[1];
    		  Cards.minicanvastag.style.display='block';
  				
    			Simon.drawPile(Cards.mouseDowns[cardin].info[0],true);
					//Simon.draw();
  			  }
			break;
			case 1://put down card(s)
			
			  //something being dragged, and card on pile is one higher number and different colour, or pile is empty and this is a king
			  if(Simon.drag!==false && Simon.cardCanGoHere(Cards.mouseDowns[cardin].info , Simon.drag[0]) && Simon.dragFrom!==Cards.mouseDowns[cardin].info )
  				{
					//must NOT be same pile as card was from - causes problems to undo function
					//length of pile before card was added
					oldlength=Simon.piles[Cards.mouseDowns[cardin].info].length;
					//add card
  				Simon.piles[Cards.mouseDowns[cardin].info]=Simon.piles[Cards.mouseDowns[cardin].info].concat(Simon.drag)
					//stop dragging card
					Simon.dropCard();
					//remember this pile for after drawing
					thispile=Cards.mouseDowns[cardin].info;
					
					//check for stack Ace->King.
					if(!Simon.checkPile(Cards.mouseDowns[cardin].info))
					  {
						new Simon.move(Simon.dragFrom,thispile,oldlength,true);
    				//only draw pile if it was false, otherwise it will have drawn it and thus wiped the mousedowns info.
  					Simon.drawPile(Cards.mouseDowns[cardin].info,true);
						}
					else
					  {
						//this move resulted in a king->ace stack
  					new Simon.move(Simon.dragFrom,thispile,oldlength,false);
						}
					
					
  				}
			break;
			case 2: //new Game
			  Simon.newGame();
			break;
			case 3: //redraw screen
			  Simon.draw();
			break;
			}
		}
	if(!down && Simon.drag!==false)
	  {
		//mouse gone UP and something was being dragged
		
		//add what was being dragged back to where it was dragged from
		Simon.piles[Simon.dragFrom]=Simon.piles[Simon.dragFrom].concat(Simon.drag)
		Simon.dropCard();
		Simon.drawPile(Simon.dragFrom,true);
		}
	}

//check a pile for a King->Ace stack
Simon.checkPile=function(pile)
  {
	if(Simon.piles[pile].length<13)
	  {
		//too few cards for this to be possible
		return false;
		}
	for(var i=0;i<Simon.piles[pile].length;i++)
	  {
		if(Simon.deck.cards[Simon.piles[pile][i]].number==13)//king
		  {
			
			if(Simon.piles[pile].length-i>=12)
			  {
				//enough cards on top of king
				suit=Simon.deck.cards[Simon.piles[pile][i]].suit
    		lastnum=Simon.deck.cards[Simon.piles[pile][i]].number
    		for(var i2=i+1;i2<Simon.piles[pile].length;i2++)
    		  {
    			if(Simon.deck.cards[Simon.piles[pile][i2]].suit!==suit || Simon.deck.cards[Simon.piles[pile][i2]].number!==lastnum-1)
    			  {
    				//not the same suit and consequtive order
    				break;
    				}
    			lastnum=Simon.deck.cards[Simon.piles[pile][i2]].number;
					}
				if(lastnum==1)
				  {
					//down to ace
					Simon.removeStack(pile,i)
					return true;
					}
			  }
			
			}
		}
	return false;
	}

//remove a King->Ace stack
Simon.removeStack=function(pile,fromcard)
  {
	//disable mouse;
	Cards.mouseDowns=new Array();
	//for 2 seconds
	//setTimeout(function(){Simon.drawPile(Simon.animateSuit+10,true);},2000);
	
	//alert([pile,fromcard])
	
	/*
	two ideas for animation:
	1 - cards (still on the pile) fold up until you can just see the ace, then that flies to the ace stacks.
	2 - ace flies to the ace stack, followed by all the other cards one by one.
	*/
	
	//steps 0-10:folding stack up, steps 11-20: flying ace to ace stack
	Simon.animateStep=0;
	Simon.animatePile=pile;
	Simon.animateCard=fromcard;
	Simon.animateSuit=Simon.deck.cards[Simon.piles[pile][fromcard]].suit;
	
	//add cards to ace stack
	Simon.piles[10+Simon.animateSuit]=Simon.piles[10+Simon.animateSuit].concat(Simon.piles[pile].slice(fromcard))
	
	//take cards off old pile
	if(fromcard>0)
  	{
  	Simon.piles[pile]=Simon.piles[pile].slice(0,fromcard)
  	}
	else
	  {
		Simon.piles[pile]=new Array();
		}
		

  
  Simon.drawPile(pile,false);
	
		
	Simon.stackLoop=setInterval(function(){Simon.animateStack();},50);
	//Simon.draw();
	Simon.animateDrawMiniCanvas(0.035)
	
	
	Simon.aceStacks++
	
	}
//debug function - called by the browser
Simon.forceStuff=function()
  {
	Simon.piles[9]=[15,18,16,12,11,10,9,8,7,6,5,4,3,2,1];
	Simon.piles[8]=[0];
	Simon.draw();
	}
	
Simon.animateDrawMiniCanvas=function(stackheight)
  {
	//clear minicanvas
  Cards.canvas[1].clearRect(0,0,Cards.width*0.10 , Cards.height*0.75)
  //draw little cards on the minicanvas
  for(var i=0;i<Simon.piles[10+Simon.animateSuit].length;i++)
    {
    Simon.deck.cards[Simon.piles[10+Simon.animateSuit][i]].draw(0.0001,0.001+i*(stackheight)*Cards.width/Cards.height,0.08,1,i==Simon.piles[10+Simon.animateSuit].length-1?true:false)
    }
  Cards.minicanvastag.style.marginLeft=(Simon.animatePile*0.0909+0.00545)*Cards.width;
  Cards.minicanvastag.style.marginTop=(0.00808+((0.035)*Cards.width/Cards.height)*Simon.animateCard)*Cards.height;
  Cards.minicanvastag.style.display='block';
	}

Simon.animateStack=function()
  {
	if(Simon.animateStep<21)
	  {
		if(!Cards.IE || Simon.animateStep%3==0 || Simon.animateStep==20)
  		{
			//use half as many steps for the folding up animation
  		ds=0.035/20
  		Simon.animateDrawMiniCanvas(0.035-ds*Simon.animateStep)
  		}
		}
	else if(Simon.animateStep<40)
	  {
		oldx=(Simon.animatePile*0.0909+0.00545)*Cards.width;
		oldy=(0.00808+((0.035)*Cards.width/Cards.height)*Simon.animateCard)*Cards.height;
		newx=0.909*Cards.width;
		newy=(Simon.animateSuit*0.136+0.00808)*Cards.width;
		dx=(newx-oldx)/20;
		dy=(newy-oldy)/20;
		Cards.minicanvastag.style.marginLeft=Math.round(oldx+dx*(Simon.animateStep-20))
  	Cards.minicanvastag.style.marginTop=Math.round(oldy+dy*(Simon.animateStep-20))
		}
	else
	  {
		Cards.minicanvastag.style.display='none';
		Simon.drawPile(Simon.animateSuit+10,true);
		clearInterval(Simon.stackLoop)
		
		setTimeout(function(){if(Simon.aceStacks==4){Simon.win();}},100);
		
		
		}
	Simon.animateStep++
	}
	
Simon.win=function()
  {
	//disable mouse;
	Cards.mouseDowns=new Array();
	Simon.won=true;
	new Cards.text('<center>You Win!<br><span style="padding:5px;background-color:#00c800;border:solid black 1px;font-size:'+(Cards.width*0.05)+'px;" onClick=";Simon.newGame();">Play Again?</span></center>','#000000',1,0.6,0,0.05,0.2);
	
	TreeObject.trees=new Array();
	
	TreeObject.canvas=Cards.canvas[0];
	
	Simon.winLoop=setInterval(TreeObject.loop,200)
	//Cards.canvas[0].clearRect(0 , 0 , Cards.width , Cards.height);
	new TreeObject.tree(Cards.width/2,Cards.height*0.96,3,3,Cards.height*0.1 , 7,[3,3], 1 , [[0,0,0],[255,0,0]] , 0.5 , 1 , 0.3);
	
	Simon.trees=2;
	if(!Cards.IE)
  	{
		//loop drawing 3 trees over and over
  	Simon.winLoop2=setInterval(Simon.treesLoop,8000)
  	}
	else
	  {
		//draw the extra two trees at staggered times
		setTimeout(function(){new TreeObject.tree((Cards.width/4)*(1),Cards.height*0.96,5,2,Cards.height*0.1 , 5,[3,3], 0.95 , [[0,0,0],[255,0,0]] , 0.4 , 1 , 0.4);},8000);
		setTimeout(function(){new TreeObject.tree((Cards.width/4)*(3),Cards.height*0.96,5,2,Cards.height*0.1 , 5,[3,3], 0.95 , [[0,0,0],[255,0,0]] , 0.4 , 1 , 0.4);},16000);
		}
		
	
	}

//spawn new trees
Simon.treesLoop=function()
  {
	switch(Simon.trees%3)
	{
	case 0://left tree - long and spindly
	case 2:
	  new TreeObject.tree((Cards.width/4)*(Simon.trees%3+1),Cards.height*0.96,5,2,Cards.height*0.1 , 5,[3,3], 0.95 , [[0,0,0],[255,0,0]] , 0.4 , 1 , 0.4);
	break;
	case 1://middle tree - medium and roundish
  	new TreeObject.tree((Cards.width/4)*(Simon.trees%3+1),Cards.height*0.96,3,3,Cards.height*0.1 , 7,[3,3], 1 , [[0,0,0],[255,0,0]] , 0.5 , 1 , 0.3);
	break;
	}
	
	Simon.trees++
	
	if(Simon.trees%3==2)
	  {
		//Cards.width*0.909-1
		Cards.canvas[0].clearRect(0 , 0 , Cards.width , Cards.height);
		}
	}
	
//check that a stack of cards (or card) can be picked up  card=pos in pile
Simon.canPickUp=function(pile,card)
  {
	if(Simon.piles[pile].length-1==card)
	  {
		//card is the last on the pile
		return true;
		}
	else
	  {
		suit=Simon.deck.cards[Simon.piles[pile][card]].suit
		lastnum=Simon.deck.cards[Simon.piles[pile][card]].number
		for(var i=card+1;i<Simon.piles[pile].length;i++)
		  {
			//alert([Simon.deck.cards[Simon.piles[pile][i]].suit,Simon.deck.cards[Simon.piles[pile][i]].number])
			if(Simon.deck.cards[Simon.piles[pile][i]].suit!==suit || Simon.deck.cards[Simon.piles[pile][i]].number!==lastnum-1)
			  {
				//not the same suit and consequtive order
				return false;
				}
			lastnum=Simon.deck.cards[Simon.piles[pile][i]].number;
			}
		}
	return true;
	}

//check that a card can be put down (ignore cards on top of card being moved)  cardnum: Simon.deck.cards[cardnum]
Simon.cardCanGoHere=function(pile,cardnum)
  {
	if(Simon.piles[pile].length==0 || Simon.deck.cards[cardnum].number==Simon.deck.cards[Simon.piles[pile][Simon.piles[pile].length-1]].number-1)
	  {
		//if card above is one number higher than card being dropped
		return true;
		}
	return false
	}
	
Simon.draw=function()
  {
	Cards.canvas[0].lineWidth=1;
	Cards.canvas[0].strokeStyle="rgb(0,0,0)";
	
	clearInterval(Simon.stackLoop)
  clearInterval(Simon.winLoop)
	clearInterval(Simon.winLoop2)
  Cards.clear();
  Cards.mouseDowns=new Array();
	new Cards.text('','#000000',1,1,0,0,0.1)
	
  //different colour for ace stack section
  Cards.canvas[0].fillStyle="rgb(120,190,235)"
  Cards.canvas[0].fillRect(Cards.tidy(0.909*Cards.width,1),0,Math.round(0.0909*Cards.width),Cards.height)
  //line between ace stacks and table
  Cards.canvas[0].beginPath()
  Cards.canvas[0].moveTo(Cards.tidy(0.909*Cards.width,1) , 0)
  Cards.canvas[0].lineTo(Cards.tidy(0.909*Cards.width,1) , Cards.height)
  Cards.canvas[0].stroke();
  
  for(var i=0;i<Simon.piles.length;i++)
    {
  	
  	if(i<10)
  	  {
			stackheight=0.035
			while( ((stackheight)*Cards.width/Cards.height)*Simon.piles[i].length + 0.08*1.5*Cards.width/Cards.height+ 0.00808 > 0.95)
			  {
				//too many cards to fit on screen, so shorten how far between each card on the pile
				stackheight*=0.95
				}

  		//piles on table
  		for(var i2=0;i2<Simon.piles[i].length;i2++)
  		  {
  			//height between cards will always be relative to size of cards, not height of board.
  			Simon.deck.cards[Simon.piles[i][i2]].draw(i*0.0909+0.00545 , 0.00808+((stackheight)*Cards.width/Cards.height)*i2 , 0.08 , 0 , i2==Simon.piles[i].length-1?true:false);
				
				//function(x,y,w,h,type,info,down)
				//picking up cards detection
				new Cards.mouseDown(i*0.0909+0.00545 , 0.00808+((stackheight)*Cards.width/Cards.height)*i2 , 0.08 , (i2==Simon.piles[i].length-1? 0.08*1.5:stackheight)*Cards.width/Cards.height , 0 , [i,i2] , true)
  			}
			
			//putting card down detection
			new Cards.mouseDown(i*0.0909+0.00545 , 0.00808+((stackheight)*Cards.width/Cards.height)*(Simon.piles[i].length-1) , 0.08 ,0.08*2*Cards.width/Cards.height , 1 , i , false)	
  		}
  	else// i>=10
  	  {
  		//ace stacks
  		if(Simon.piles[i].length>0)
  		  {
  			//stack full
  			Simon.deck.cards[Simon.piles[i][Simon.piles[i].length-1]].draw(0.909+0.00545 , ((i-10)*0.136+0.00808)*Cards.width/Cards.height , 0.08 , 0 , true )
  			}
  		else
  		  {
				//new Cards.mouseDown(0.909+0.00545 , ((i-10)*0.136+0.00808)*Cards.width/Cards.height, 0.08 ,0.08*1.5*Cards.width/Cards.height , 1 , i)
  			//stack empty
  			//Cards.drawOutline(0.909+0.00545 , ((i-10)*0.136+0.00808)*Cards.width/Cards.height , 0.08 , 'rgb(0,0,0)' , 0 )
				//'rgb(140,210,255)'
  			Cards.drawBox(0.909+0.00545 , ((i-10)*0.136+0.00808)*Cards.width/Cards.height, 0.08 ,0.08*1.5*Cards.width/Cards.height,'rgb(0,200,0)','rgb(0,0,0)',0)
  			
  			//draw the suit symbol in the middle
  			//function(x,y,r,u,where)
  	  	switch(i-10)
      	  {
      		case 0:
      		  //diamonds
      			Cards.drawDiamond((0.909+0.00545 +0.04)*Cards.width , ((i-10)*0.136+0.00808 + 0.06)*Cards.width , 0.03*Cards.width , false , 0);
      		break;
      		case 1:
      		  //hearts
      			Cards.drawHeart((0.909+0.00545 +0.04)*Cards.width , ((i-10)*0.136+0.00808 + 0.06)*Cards.width , 0.03*Cards.width , false , 0);
      		break;
      		case 2:
      		  //clubs
      			Cards.drawClub((0.909+0.00545 +0.04)*Cards.width , ((i-10)*0.136+0.00808 + 0.06)*Cards.width , 0.03*Cards.width , false , 0);
      		break;
      		case 3:
      		  //spades
      			Cards.drawSpade((0.909+0.00545 +0.04)*Cards.width , ((i-10)*0.136+0.00808 + 0.06)*Cards.width , 0.03*Cards.width , false , 0);
      		break;
      		}
  			}
  		}
  	}
  }

Simon.buildMouseDowns=function()
  {
	for(var i=0;i<Simon.piles.length;i++)
    {
		if(i<10)
      {
      stackheight=0.035
      while( ((stackheight)*Cards.width/Cards.height)*Simon.piles[i].length + 0.08*1.5*Cards.width/Cards.height+ 0.00808 > 0.95)
        {
        //too many cards to fit on screen, so shorten how far between each card on the pile
        stackheight*=0.95
        }
      //piles on table
      for(var i2=0;i2<Simon.piles[i].length;i2++)
        {
        //picking up cards detection
        new Cards.mouseDown(i*0.0909+0.00545 , 0.00808+((stackheight)*Cards.width/Cards.height)*i2 , 0.08 , (i2==Simon.piles[i].length-1? 0.08*1.5:stackheight)*Cards.width/Cards.height , 0 , [i,i2] , true)
        }
      //putting card down detection
      new Cards.mouseDown(i*0.0909+0.00545 , 0.00808+((stackheight)*Cards.width/Cards.height)*(Simon.piles[i].length-1) , 0.08 ,0.08*2*Cards.width/Cards.height , 1 , i , false)	
      }
		}
	}
	
// taken directly from draw. i=pile
Simon.drawPile=function(i,full)
  {
  Cards.mouseDowns=new Array();
	//new Cards.text('','#000000',1,1,0,0,0.1)
	
	//if not full then don't reset mouse stuff
	if(full)
	  {
		Simon.buildMouseDowns();
		}
		
	
	if(i<10)
	  {
		Cards.canvas[0].fillStyle='rgb(140,210,255)';
		Cards.canvas[0].fillRect(i*0.0909*Cards.width , 0 , 0.0909*Cards.width- (i==9?1:0) , Cards.height)
		
  	stackheight=0.035
  	while( ((stackheight)*Cards.width/Cards.height)*Simon.piles[i].length + 0.08*1.5*Cards.width/Cards.height+ 0.00808 > 0.95)
  	  {
  		//too many cards to fit on screen, so shorten how far between each card on the pile
  		stackheight*=0.95
  		}

		//piles on table
		for(var i2=0;i2<Simon.piles[i].length;i2++)
		  {
			//height between cards will always be relative to size of cards, not height of board.
			Simon.deck.cards[Simon.piles[i][i2]].draw(i*0.0909+0.00545 , 0.00808+((stackheight)*Cards.width/Cards.height)*i2 , 0.08 , 0 , i2==Simon.piles[i].length-1?true:false);
		
		//function(x,y,w,h,type,info,down)
		//picking up cards detection
		new Cards.mouseDown(i*0.0909+0.00545 , 0.00808+((stackheight)*Cards.width/Cards.height)*i2 , 0.08 , (i2==Simon.piles[i].length-1? 0.08*1.5:stackheight)*Cards.width/Cards.height , 0 , [i,i2] , true)
			}
	
  	//putting card down detection
  	new Cards.mouseDown(i*0.0909+0.00545 , 0.00808+((stackheight)*Cards.width/Cards.height)*(Simon.piles[i].length-1) , 0.08 ,0.08*2*Cards.width/Cards.height , 1 , i , false)	
		}
	else// i>=10
	  {
		//ace stacks
		if(Simon.piles[i].length>0)
		  {
			//stack full
			Simon.deck.cards[Simon.piles[i][Simon.piles[i].length-1]].draw(0.909+0.00545 , ((i-10)*0.136+0.00808)*Cards.width/Cards.height , 0.08 , 0 , true )
			}
		else
		  {
		//new Cards.mouseDown(0.909+0.00545 , ((i-10)*0.136+0.00808)*Cards.width/Cards.height, 0.08 ,0.08*1.5*Cards.width/Cards.height , 1 , i)
			//stack empty
			//Cards.drawOutline(0.909+0.00545 , ((i-10)*0.136+0.00808)*Cards.width/Cards.height , 0.08 , 'rgb(0,0,0)' , 0 )
		//'rgb(140,210,255)'
			Cards.drawBox(0.909+0.00545 , ((i-10)*0.136+0.00808)*Cards.width/Cards.height, 0.08 ,0.08*1.5*Cards.width/Cards.height,'rgb(0,200,0)','rgb(0,0,0)',0)
			
			//draw the suit symbol in the middle
			//function(x,y,r,u,where)
	  	switch(i-10)
    	  {
    		case 0:
    		  //diamonds
    			Cards.drawDiamond((0.909+0.00545 +0.04)*Cards.width , ((i-10)*0.136+0.00808 + 0.06)*Cards.width , 0.03*Cards.width , false , 0);
    		break;
    		case 1:
    		  //hearts
    			Cards.drawHeart((0.909+0.00545 +0.04)*Cards.width , ((i-10)*0.136+0.00808 + 0.06)*Cards.width , 0.03*Cards.width , false , 0);
    		break;
    		case 2:
    		  //clubs
    			Cards.drawClub((0.909+0.00545 +0.04)*Cards.width , ((i-10)*0.136+0.00808 + 0.06)*Cards.width , 0.03*Cards.width , false , 0);
    		break;
    		case 3:
    		  //spades
    			Cards.drawSpade((0.909+0.00545 +0.04)*Cards.width , ((i-10)*0.136+0.00808 + 0.06)*Cards.width , 0.03*Cards.width , false , 0);
    		break;
    		}
			}
		}
	}

this.onload=function(){Cards.load();Simon.newGame();}