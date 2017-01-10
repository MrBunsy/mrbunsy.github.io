// JavaScript Spider Solitiaire 0.8
// Copyright Luke Wallin September 2008
// Requires Cards.js (version 0.27+)


var Spider=new Object();

document.getElementById('cardsdiv').innerHTML+='<div id="menudiv" style="border:solid black 1px;background-color:#78beeb;width:'+parseFloat(document.getElementById('cardsdiv').style.width)+';height:'+parseFloat(document.getElementById('cardsdiv').style.height)*0.04+';font-size:'+parseFloat(document.getElementById('cardsdiv').style.height)*0.03+'px;"><span style="float:left;margin-left:'+parseFloat(document.getElementById('cardsdiv').style.height)*0.01+'px;"><span onClick="Spider.confirmNewGame();">New Game</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span onClick="Spider.undo();">Undo</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span onClick="Spider.openOptions();">Options</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span onClick="Spider.help();">Help</span></span><span style="float:right;margin-right:'+parseFloat(document.getElementById('cardsdiv').style.height)*0.01+'px;" onClick="Spider.about();">Spider</span></div><span id="cardsspan"></span><span style="display:none">this makes it work in IE for some bizzare reason</span><canvas id="cardscanvas" width="'+(parseFloat(document.getElementById('cardsdiv').style.width))+'" height="'+(parseFloat(document.getElementById('cardsdiv').style.height)*0.96)+'"></canvas><div id="cardsdiv2"><canvas style="display:none;" id="cardsminicanvas" width="'+(parseFloat(document.getElementById('cardsdiv').style.width)*0.1)+'" height="'+(parseFloat(document.getElementById('cardsdiv').style.height)*0.8)+'"></canvas></div>'

Spider.openOptions=function()
  {
		if(!Spider.gameWon)
  	{
		Spider.draw();
  	//disable mouse clicks:
  	Cards.mouseDowns=new Array();
  	//"rgb(120,190,235)"
  	Cards.drawBox(0.25,0.15,0.5,0.5,'rgb(0,200,0)','rgb(0,0,0)',0);
 		new Cards.text('<center>Undo Level?<br><br><span id="undo0" onClick="Spider.undoLevel=0;Spider.draw();">Cheat (Undo Everything)</span><br><span id="undo1" onClick="Spider.undoLevel=1;Spider.draw();">Normal (Undo Some)</span><br><span id="undo2" onClick="Spider.undoLevel=2;Spider.draw();">None (Undo Off)</span> <br><br> <span onClick="Spider.draw();">Cancel</span></center>','#000000',1,0.25,0,0.2,0.05);
		//highlight current setting
		document.getElementById('undo'+Spider.undoLevel).style.fontWeight="bold"
		}
	}

Spider.confirmNewGame=function()
  {
	if(!Spider.gameWon)
  	{
		Spider.draw();
  	//disable mouse clicks:
  	Cards.mouseDowns=new Array();
  	//"rgb(120,190,235)"
  	Cards.drawBox(0.25,0.15,0.5,0.5,'rgb(0,200,0)','rgb(0,0,0)',0);
 		new Cards.text('<center>New Game?<br><br><span onClick="Spider.newGame(1);">Easy (1 Suit)</span><br><span onClick="Spider.newGame(2);">Medium (2 Suits)</span><br><span onClick="Spider.newGame(4);">Hard (4 Suits)</span> <br><br> <span onClick="Spider.draw();">Cancel</span></center>','#000000',1,0.25,0,0.2,0.05);
		}
	}

//function run when script loads - pings up box asking what difficulty you want to play.
Spider.startUp=function()
  {
	//undo levels, 0=cheat (everything except ace stacks), 1=normal (only moves, no revealing cards), 2=off
	Spider.undoLevel=1;
	//stops undo working:
	Spider.gameWon=true;
	//disable mouse clicks:
	Cards.mouseDowns=new Array();
	//"rgb(120,190,235)"
	Cards.drawBox(0.25,0.2,0.5,0.4,'rgb(0,200,0)','rgb(0,0,0)',0);
	new Cards.text('<center>Difficulty?<br><br><span onClick="Spider.newGame(1);">Easy (1 Suit)</span><br><span onClick="Spider.newGame(2);">Medium (2 Suits)</span><br><span onClick="Spider.newGame(4);">Hard (4 Suits)</span>','#000000',1,0.25,0,0.26,0.05);
	}
	
Spider.about=function()
  {
	if(!Spider.gameWon)
  	{
		Spider.draw();
  	//disable mouse clicks:
  	Cards.mouseDowns=new Array();
  	Cards.drawBox(0.3,0.3,0.4,0.35,'rgb(0,200,0)','rgb(0,0,0)',0);
  	new Cards.text('<center>Spider Solitaire 1.5<br><br><span style="font-size:'+Cards.width*0.03+'px;">&copy; Luke Wallin 2008<br><br>www.lukewallin.co.uk</a></span></center>','#000000',1,0.25,0,0.36,0.05);
  	//Cards.mouseDown=function(x,y,w,h,type,info,down)
  	new Cards.mouseDown(0.325,0.3,0.35,0.35 , 3 , false, true);
		}
	}

Spider.help=function()
  {
	if(!Spider.gameWon)
  	{
		Spider.draw();
  	//disable mouse clicks:
  	Cards.mouseDowns=new Array();
  	Cards.drawBox(0.05,0.05,0.9,0.86,'rgb(0,200,0)','rgb(0,0,0)',0);
  	new Cards.text('<span onClick="Spider.draw();"><center><b>How to Play</b><span style="font-size:'+Cards.width*0.029+'px;"><br><br>The aim of the game is to place all the cards in a stack of descending order of the same suit.  Once a pile from King to Ace of one suit has been made, it is folded up and placed off the table at the top of the screen.<br><br>Cards may be placed on another card which is of a higher number, reguardless of suit.  For example, a five may be placed on any six.  Groups of cards can only be picked up if they are all the same suit and in consecutive descending order.  For example: five, four, three and two of spades.  Any card may be placed in a blank space, but no cards may be placed ontop of an upside down card.<br><br>You can click on the cards at the top left to deal one more card to each pile, but only when there are no cards on the top of a pile facing down.<br><br>(Click to close)</span></center></span>','#000000',0.86,0.82,0.07,0.06,0.04);
  	}
	}

//set up undo:
Spider.moves=new Array();


	
Spider.newGame=function(diff)
  {
	//number of suits
	Spider.difficult=diff;
	
	//set up undo:
	Spider.moves=new Array();
	
	//width height ration:
	Cards.WHR=Cards.width/Cards.height
	
	//stop the bar at the top being selected
	Cards.noSelect(document.getElementById('menudiv'));
	
	//not won yet
	Spider.gameWon=false;
	//piles of suits completed
	Spider.aceStacks=0;
	
	Cards.minicanvastag.style.display="none";
	//mouse stuff for dragging minicanvas
	Cards.drag=false;
  Cards.dragDiff=new Array(2);

	//set up mouse detection
	Cards.div.onmousedown=function(){Spider.mouseGoneDown(true);}
	Cards.div.onmouseup=function(){Spider.mouseGoneDown(false);}
	
	//create a double pack with no jokers, cards initially facing down.
	Spider.deck=new Cards.deck(0,false,2,Spider.difficult);
	//shuffle deck
	Spider.deck.shuffle();

	//piles 0-9 are on the table, 10 is the rest of the deck, and 11-18 are the ace piles
	Spider.piles=new Array(19);
	
	tempcardcount=0;
	
	for(var i=0;i<Spider.piles.length;i++)
	  {
		Spider.piles[i]=new Array();
		
		if(i<4)
		  {
			//first 4 piles - 6 cards each
			for(var i2=0;i2<6;i2++)
			  {
				Spider.piles[i].push(tempcardcount);
				if(i2==5)
				  {
					//card on top turned face up.
					Spider.deck.cards[tempcardcount].faceup=true;
					}
				tempcardcount++;
				}
			}
		else if(i<10)
		  {
			// 5 cards each
			for(var i2=0;i2<5;i2++)
			  {
				Spider.piles[i].push(tempcardcount);
				if(i2==4)
				  {
					//card on top turned face up.
					Spider.deck.cards[tempcardcount].faceup=true;
					}
				tempcardcount++;
				}
			}
		else if(i==10)
		  {
			//spare deck - put the rest of the cards here.
			while(tempcardcount<104)
			  {
				Spider.piles[i].push(tempcardcount);
				tempcardcount++;
				}
			}
		}
	Spider.draw();
	}

Spider.win=function()
  {
	//disable mouse;
	Cards.mouseDowns=new Array();
	Spider.won=true;
	new Cards.text('<center>You Win!<br><span style="padding:5px;background-color:#00c800;border:solid black 1px;font-size:'+(Cards.width*0.05)+'px;" onClick=";Spider.newGame(Spider.difficult);">Play Again?</span></center>','#000000',1,0.6,0,0.15*Cards.WHR,0.2);
	}
	
	
//types:
// 0=card which can be dragged (info: array[col, row]),
// 1=pile which can be dragged ONTO (info:pile)
// 2=new game
// 3=re-draw screen
// 4=deal out more cards.
// 5=turn over upside down card (info: array[col, row]),
	
Spider.mouseGoneDown=function(down)
  {
  cardin=Cards.findmouseDown(down)

	if(cardin!==false)
  	{
  	switch(Cards.mouseDowns[cardin].type)
  	  {
			case 0://pick up card(s)
			
			  if(Cards.drag===false && Spider.canPickUp(Cards.mouseDowns[cardin].info[0] , Cards.mouseDowns[cardin].info[1]))
  				{
  				//store what cards are being dragged
  				Cards.drag=Spider.piles[Cards.mouseDowns[cardin].info[0]].slice(Cards.mouseDowns[cardin].info[1])
  				
  				//remove this from old pile
  				Spider.piles[Cards.mouseDowns[cardin].info[0]]=Spider.piles[Cards.mouseDowns[cardin].info[0]].slice(0,Cards.mouseDowns[cardin].info[1])
  				
  				//pile cards being dragged from
  				Cards.dragFrom=Cards.mouseDowns[cardin].info[0];
					//position in pile (save for undo function)
					//Simom.dragFromPos=Cards.mouseDowns[cardin].info[1]
  
  				//stuff for mouse dragging image of card
  				Cards.dragDiff[0]=Math.ceil(Cards.mouseDowns[cardin].x*Cards.width-Cards.mouse[0]);
  				Cards.dragDiff[1]=Math.ceil(Cards.mouseDowns[cardin].y*Cards.height-Cards.mouse[1]);
  				
  				//clear minicanvas
    			Cards.canvas[1].clearRect(0,0,Cards.width*0.10 , Cards.height*0.8)
					stackheight=0.04*Cards.WHR
  				//draw little cards on the minicanvas
    			for(var i=0;i<Cards.drag.length;i++)
    			  {
      			Spider.deck.cards[Cards.drag[i]].draw(0.0001,0.001+i*stackheight,0.09,1,i==Cards.drag.length-1?true:false)
    				}
  				//Cards.minicanvastag.style.left=Cards.mouse[0]+Cards.dragDiff[0];
      		//Cards.minicanvastag.style.top=Cards.mouse[1]+Cards.dragDiff[1];
					Cards.minicanvastag.style.top=Cards.mouse[1]+Cards.dragDiff[1];
					Cards.minicanvastag.style.left=Cards.mouse[0]+Cards.dragDiff[0];
    		  Cards.minicanvastag.style.display='block';
  				
    			Spider.drawPile(Cards.mouseDowns[cardin].info[0],true);
					//Spider.draw();
  			  }
			break;
			case 1://put down card(s)
			
			  //something being dragged, and card on pile is one higher number and different colour, or pile is empty and this is a king
			  if(Cards.drag!==false && Spider.cardCanGoHere(Cards.mouseDowns[cardin].info , Cards.drag[0]) && Cards.dragFrom!==Cards.mouseDowns[cardin].info )
  				{
					//must NOT be same pile as card was from - causes problems to undo function
					//length of pile before card was added
					oldlength=Spider.piles[Cards.mouseDowns[cardin].info].length;
					//add card
  				Spider.piles[Cards.mouseDowns[cardin].info]=Spider.piles[Cards.mouseDowns[cardin].info].concat(Cards.drag)
					//stop dragging card
					Cards.dropCard();
					//remember this pile for after drawing
					thispile=Cards.mouseDowns[cardin].info;
					Spider.drawPile(Cards.mouseDowns[cardin].info,true);
					//check for stack Ace->King and act on results
					if(!Spider.checkPile(thispile))
					  {
						new Spider.move(0,[Cards.dragFrom,thispile,oldlength],true);
						}
					else
					  {
						//this move resulted in a king->ace stack
  					new Spider.move(0,[Cards.dragFrom,thispile,oldlength],false);
						}
					
  				}
			break;
			case 2: //new Game
			  Spider.newGame();
			break;
			case 3: //redraw screen
			  Spider.draw();
			break;
			case 4://deal more cards
			  if(Spider.canDealCards())
				  {
					//cancel mouse stuff
					Cards.mouseDowns=new Array();
  			  for(var i=0;i<10;i++)
  				  {
  					//turn card on top of deck to face up
  					Spider.deck.cards[Spider.piles[10][Spider.piles[10].length-1]].faceup=true;
  					//add last card on the deck to a pile
  					Spider.piles[i].push(Spider.piles[10][Spider.piles[10].length-1]);
  					//then take it off the deck.
  					Spider.piles[10]=Spider.piles[10].slice(0,-1)
  					}
					//set off animation
  				Spider.animateStep=0;
  				Spider.animateThis=1;//dealing out cards
  				Spider.animatePile=0;
					Spider.animateInProgress=true;//work-around for odd bug
  				Spider.animateLoop=setInterval(Spider.animation,25);
					}
				else if(Cards.whyNotPile!==false && !Spider.animateInProgress)//false means animation in progress
				  {
					Spider.mouseDowns=new Array();
					//set off animation to show why you can't deal more cards.
					Spider.animateStep=0;
  				Spider.animateThis=2;//making a pile flash yellow
  				Spider.animatePile=0;
  				Spider.animateLoop=setInterval(Spider.animation,25);
					Spider.animateInProgress=true;
					//clear minicanvas
    			Cards.canvas[1].clearRect(0,0,Cards.width*0.10 , Cards.height*0.8)
					Cards.minicanvastag.style.display="block";
					Cards.minicanvastag.style.top=(0.15*Cards.WHR+Spider.getStackHeight(Cards.whyNotPile,true))*Cards.height;
					Cards.minicanvastag.style.left=Cards.whyNotPile*0.1*Cards.width+1;
					}
				
			break;
			case 5://turn over card
			  if(Cards.drag===false)
  				{
  			  Spider.deck.cards[Spider.piles[Cards.mouseDowns[cardin].info[0]][Cards.mouseDowns[cardin].info[1]]].faceup=true;
  				//Spider.draw();
  				new Spider.move(1,Cards.mouseDowns[cardin].info[0],true)
  				Spider.drawPile(Cards.mouseDowns[cardin].info[0],true);
  				}
			break;
			}
		}
	if(!down && Cards.drag!==false)
	  {
		//mouse gone UP and something was being dragged
		
		//add what was being dragged back to where it was dragged from
		Spider.piles[Cards.dragFrom]=Spider.piles[Cards.dragFrom].concat(Cards.drag)
		Cards.dropCard();
		Spider.drawPile(Cards.dragFrom,true);
		//Spider.draw();
		}
	}

//check that a stack of cards (or card) can be picked up  card=pos in pile
Spider.canPickUp=function(pile,card)
  {
	if(Spider.piles[pile].length-1==card)
	  {
		//card is the last on the pile
		return true;
		}
	else
	  {
		suit=Spider.deck.cards[Spider.piles[pile][card]].suit
		lastnum=Spider.deck.cards[Spider.piles[pile][card]].number
		for(var i=card+1;i<Spider.piles[pile].length;i++)
		  {
			//alert([Spider.deck.cards[Spider.piles[pile][i]].suit,Spider.deck.cards[Spider.piles[pile][i]].number])
			if(Spider.deck.cards[Spider.piles[pile][i]].suit!==suit || Spider.deck.cards[Spider.piles[pile][i]].number!==lastnum-1)
			  {
				//not the same suit and consequtive order
				return false;
				}
			lastnum=Spider.deck.cards[Spider.piles[pile][i]].number;
			}
		}
	return true;
	}

//check that a card can be put down (ignore cards on top of card being moved)  cardnum: Spider.deck.cards[cardnum]
Spider.cardCanGoHere=function(pile,cardnum)
  {
	if(Spider.piles[pile].length==0 || Spider.deck.cards[cardnum].number==Spider.deck.cards[Spider.piles[pile][Spider.piles[pile].length-1]].number-1)
	  {
		//if card above is one number higher than card being dropped
		return true;
		}
	return false
	}
	
//function to check that more cards can be dealt out
Spider.canDealCards=function()
  {
	
	for(var i=0;i<10;i++)
	  {
		if(Spider.piles[i].length==0)
		  {
			//if an empty pile exists
			//return false - turned this off for now - the rule for not allowing cards to be dealt while a space is clear seems silly.
			}
		else if(!Spider.deck.cards[Spider.piles[i][Spider.piles[i].length-1]].faceup)
		  {
			//if a card on top of a pile isn't facing up
			Cards.whyNotPile=i;
			return false
			}
		}
	if(Spider.animateInProgress)
	  {
		Cards.whyNotPile=false;
		return false;
		}
	return true;
	}	
	
Spider.undo=function()
  {
	if(Spider.moves.length>0)
  	{
  	movenum=Spider.moves.length-1;
  	if(Spider.moves[movenum].possible)
  	  {
			switch(Spider.moves[movenum].type)
			  {
				case 0:
				  if(Spider.undoLevel<2)
  					{
        		//add cards back to old pile
          	Spider.piles[Spider.moves[movenum].info[0]]=Spider.piles[Spider.moves[movenum].info[0]].concat(Spider.piles[Spider.moves[movenum].info[1]].slice(Spider.moves[movenum].info[2]))
        		//take them off the new pile
        		Spider.piles[Spider.moves[movenum].info[1]]=Spider.piles[Spider.moves[movenum].info[1]].slice(0,Spider.moves[movenum].info[2]);
        		//re-draw
        		//Spider.draw();
  					Spider.drawPile(Spider.moves[movenum].info[0],false);
  					Spider.drawPile(Spider.moves[movenum].info[1],true);
        		//remove this move from the array
        		Spider.moves=Spider.moves.slice(0,-1)
  					}
			  break;
				case 1:
				  if(Spider.undoLevel<1)
  					{
  				  //turn over card on top of pile
  				  Spider.deck.cards[Spider.piles[Spider.moves[movenum].info][Spider.piles[Spider.moves[movenum].info].length-1]].faceup=false;
  					
  					Spider.drawPile(Spider.moves[movenum].info,true);
        		//remove this move from the array
  					Spider.moves=Spider.moves.slice(0,-1)
						}
				break;
				case 2:
				  if(Spider.undoLevel<1)
  					{
  				  //undo dishing out cards
  					for(var i=9;i>=0;i--)
    				  {
  						//add last card on pile i to the deck
    					Spider.piles[10].push(Spider.piles[i][Spider.piles[i].length-1]);
  						
    					//turn card on top of deck to face down
    					Spider.deck.cards[Spider.piles[10][Spider.piles[10].length-1]].faceup=false;
    					
    					//then take it off pile i
    					Spider.piles[i]=Spider.piles[i].slice(0,-1)
    					}
  					//remove this move from the array
  					Spider.moves=Spider.moves.slice(0,-1)
  					//re-draw
  					Spider.draw();
  					}
				break;
				}
    	}
  	}
	}	

// move types:
// 0=pile of cards from one pile to another.  Info: [oldpile , newpile, newpos] - pos is the position in the new pile (including that card and all the cards on top).
// 1=turn card over.  Info: pile
// 2=dish out extra cards
Spider.move=function(type,info,possible)
  {
	//pile is, uh, the pile number.  
  this.type=type;
	this.info=info;
	this.possible=possible//set to false if move results in an ace stack being completed
	Spider.moves.push(this);
	}
	
//check a pile for a King->Ace stack
Spider.checkPile=function(pile)
  {
	if(Spider.piles[pile].length<13)
	  {
		//too few cards for this to be possible
		return false;
		}
	for(var i=0;i<Spider.piles[pile].length;i++)
	  {
		if(Spider.deck.cards[Spider.piles[pile][i]].number==13)//king
		  {
			
			if(Spider.piles[pile].length-i>=12)
			  {
				//enough cards on top of king
				suit=Spider.deck.cards[Spider.piles[pile][i]].suit
    		lastnum=Spider.deck.cards[Spider.piles[pile][i]].number
    		for(var i2=i+1;i2<Spider.piles[pile].length;i2++)
    		  {
    			if(Spider.deck.cards[Spider.piles[pile][i2]].suit!==suit || Spider.deck.cards[Spider.piles[pile][i2]].number!==lastnum-1)
    			  {
    				//not the same suit and consequtive order
    				break;
    				}
    			lastnum=Spider.deck.cards[Spider.piles[pile][i2]].number;
					}
				if(lastnum==1)
				  {
					//down to ace
					Spider.removeStack(pile,i)
					return true;
					}
			  }
			
			}
		}
	return false;
	}

//remove a King->Ace stack
Spider.removeStack=function(pile,fromcard)
  {
	//disable mouse;
	Cards.mouseDowns=new Array();
	
	/*
	two ideas for animation:
	1 - cards (still on the pile) fold up until you can just see the ace, then that flies to the ace stacks.
	2 - ace flies to the ace stack, followed by all the other cards one by one.
	*/
	
	//steps 0-10:folding stack up, steps 11-20: flying ace to ace stack
	Spider.animateStep=0;
	Spider.animateOldPile=pile;
	Spider.animateCard=fromcard;
	Spider.animateNewPile=11+Spider.aceStacks;
	
	
	
	
	Spider.animateStackHeight=Spider.getStackHeight(pile);
	pileheight=0;
	//height to king.
	for(var i=0;i<fromcard;i++)
	  {
		pileheight+=Spider.deck.cards[Spider.piles[pile][i]].faceup ? Spider.animateStackHeight : Spider.animateStackHeight/4;
		}
	
	//position of King of stack when still on the table
	Spider.animateOldPos=[pile*0.1+0.005 , (0.15+0.0075)*Cards.WHR + pileheight]
	
	//position of ace stack pile
	Spider.animateNewPos=[(2+Spider.aceStacks)*0.1 +0.005 , 0.0075*Cards.WHR]
	
	//for working out where ace is as it flies to ace stack pile
	Spider.animatedx=(Spider.animateNewPos[0]-Spider.animateOldPos[0])/15;
	Spider.animatedy=(Spider.animateNewPos[1]-Spider.animateOldPos[1])/15;
	
	//add cards to ace stack
	Spider.piles[11+Spider.aceStacks]=Spider.piles[11+Spider.aceStacks].concat(Spider.piles[pile].slice(fromcard))
	
	//take cards off old pile
	if(fromcard>0)
  	{
  	Spider.piles[pile]=Spider.piles[pile].slice(0,fromcard)
  	}
	else
	  {
		Spider.piles[pile]=new Array();
		}
		

  //drawing the pile the stack came from will clear it from under the animation - force OLD stackheight
  Spider.drawPile(pile,false,Spider.animateStackHeight);
	
	Spider.animateDrawMiniCanvas(Spider.animateStackHeight)
	Spider.animateThis=0;//ace king stack
	Spider.animateLoop=setInterval(Spider.animation,50);
	//Spider.draw();
	//Spider.animateDrawMiniCanvas(0.035)
	
	
	Spider.aceStacks++
	
	}

	
//function to be looped
Spider.animation=function()
  {
	switch(Spider.animateThis)
	  {
		case 0://ace stack folding up and flying to ace stack pile
    	if(Spider.animateStep<21)
    	  {
    		if(!Cards.IE || Spider.animateStep%3==0 || Spider.animateStep==20)
      		{
    			//use half as many steps for the folding up animation
      		ds=Spider.animateStackHeight/20
      		Spider.animateDrawMiniCanvas(Spider.animateStackHeight-ds*Spider.animateStep)
      		}
    		}
    	else if(Spider.animateStep<35)
    	  {
    		Cards.minicanvastag.style.left=Math.ceil((Spider.animateOldPos[0]+Spider.animatedx*(Spider.animateStep-20))*Cards.width)
      	Cards.minicanvastag.style.top=Math.ceil((Spider.animateOldPos[1]+Spider.animatedy*(Spider.animateStep-20))*Cards.height)
    		}
    	else
    	  {
    		Cards.minicanvastag.style.display='none';
				Spider.drawPile(Spider.animateOldPile,false);//old pile - now with proper stackheight
    		Spider.drawPile(Spider.animateNewPile,true);
    		clearInterval(Spider.animateLoop)
				
				//check for win AFTER animation has finished.
				setTimeout(function(){if(Spider.aceStacks==8){Spider.win();}},100);
				
    		}
		break;
		case 1://flying cards from deck stack to bottom of piles
		  //cards have already been added to the piles, and removed from the deck - so we can use the last card on each pile.
			if(Spider.animateStep%10==0)
			  {
				if(Spider.animatePile<10)
  				{
					
					if(Spider.animatePile-1>=0)
					  {
						//draw card on bottom of previous pile
						Spider.drawPile(Spider.animatePile-1,false);
						}
					if(Spider.animatePile==9)
					  {
						Spider.drawPile(10,false);//deck stack
						}
					//clear minicanvas
          Cards.canvas[1].clearRect(0,0,Cards.width*0.10 , Cards.height*0.8);
					
  				//draw last card on animatePile on the minicanvas
  				Spider.deck.cards[Spider.piles[Spider.animatePile][Spider.piles[Spider.animatePile].length-1]].draw(0.0001,0.001,0.09,1,true)
  				
  				Spider.animateOldPos=[0.005+0.008*(Spider.piles[10].length/10),0.0075*Cards.WHR];
  				Spider.animateNewPos=[0.1*Spider.animatePile+0.005 , Spider.getStackHeight(Spider.animatePile,true)+0.15*Cards.WHR+0.0075*Cards.WHR]
  				
					//for working out where card is as it flies to its pile
        	Spider.animatedx=(Spider.animateNewPos[0]-Spider.animateOldPos[0])/9;//dividing by 9, not 10 so that the last move places the card where it will be when the pile is drawn. (stops a judder as pile *is* drawn)
        	Spider.animatedy=(Spider.animateNewPos[1]-Spider.animateOldPos[1])/9;
					
  				Cards.minicanvastag.style.left=Math.ceil(Spider.animateOldPos[0]*Cards.width);
    			Cards.minicanvastag.style.top=Math.ceil(Spider.animateOldPos[1]*Cards.height);
					
					Cards.minicanvastag.style.display='block';
					Spider.animatePile++;
  				}
				else
				  {
					//end of animation
					
					clearInterval(Spider.animateLoop)
					Spider.drawPile(Spider.animatePile-1,true);
					Cards.minicanvastag.style.display='none';
					if(!Spider.checkAllPiles())
					  {
						//allow giving out extra cards to be undone
						new Spider.move(2,false,true)
						}
					else
					  {
						//don't
						new Spider.move(2,false,false)
						}
					
					if(Cards.IE)
					  {Spider.draw();}
					
					setTimeout(function(){Spider.animateInProgress=false;},100);
					
					//just in case this has completed a King->Ace stack, check all the piles.
					
					}
				}
			else
			  {
				//mid animation of moving the card
				Cards.minicanvastag.style.left=Math.ceil((Spider.animateOldPos[0]+Spider.animatedx*(Spider.animateStep%10))*Cards.width)
      	Cards.minicanvastag.style.top=Math.ceil((Spider.animateOldPos[1]+Spider.animatedy*(Spider.animateStep%10))*Cards.height)
				}
		break;
		case 2://make minicanvas flash yellow
		//alert(Spider.animateStep)
		  if(Spider.animateStep<5)
			  {
				Cards.canvas[1].clearRect(0,0,Cards.width*0.1 , Cards.height*0.8);
				Cards.drawBox(0.001,0.001,0.1,0.15*Cards.WHR,"rgba(255,255,0,"+(0.2+0.2*Spider.animateStep)+")","rgba(255,255,0,"+(0.2+0.2*Spider.animateStep)+")",1)
				//Cards.canvas[1].fillStyle="rgba(255,255,0,"+(0.2+0.2*Spider.animateStep)+")";
				//Cards.canvas[1].fillRect(0,0,Cards.width*0.1 , Cards.height*0.15*Cards.WHR);
				}
			else if(Spider.animateStep<10)
			  {
				Cards.canvas[1].clearRect(0,0,Cards.width*0.1 , Cards.height*0.8);
				Cards.drawBox(0.001,0.001,0.1,0.15*Cards.WHR,"rgba(255,255,0,"+(1-0.2*(Spider.animateStep-5))+")","rgba(255,255,0,"+(1-0.2*(Spider.animateStep-5))+")",1)
				//Cards.canvas[1].fillStyle="rgba(255,255,0,"+(1-0.2*(Spider.animateStep-5))+")";
				//Cards.canvas[1].fillRect(0,0,Cards.width*0.1 , Cards.height*0.15*Cards.WHR);
				}
			else
			  {
				clearInterval(Spider.animateLoop)
				Cards.minicanvastag.style.display='none';
				Spider.buildMouseDowns();
				setTimeout(function(){Spider.animateInProgress=false;},100);//pile 9 + mousedowns
				}
		break;
		}
	Spider.animateStep++;
	}
	
Spider.checkAllPiles=function()
  {
	positives=false;
  for(var i=0;i<10;i++)
	  {
		if(Spider.checkPile(i))
		  {positives=true;}
		}
	return positives;
	}
	
Spider.animateDrawMiniCanvas=function(stackheight)
  {
	//clear minicanvas
  Cards.canvas[1].clearRect(0,0,Cards.width*0.10 , Cards.height*0.8)
  //draw little cards on the minicanvas
  for(var i=0;i<Spider.piles[Spider.animateNewPile].length;i++)
    {
    Spider.deck.cards[Spider.piles[Spider.animateNewPile][i]].draw(0.0001,0.001+i*stackheight,0.09,1,i==Spider.piles[Spider.animateNewPile].length-1?true:false)
    }
  Cards.minicanvastag.style.left=Math.ceil(Spider.animateOldPos[0]*Cards.width);
  Cards.minicanvastag.style.top=Math.ceil(Spider.animateOldPos[1]*Cards.height);
  Cards.minicanvastag.style.display='block';
	}

//get spacing between cards for a certain pile, optionally get height of top of the last card on pile
Spider.getStackHeight=function(i,topstuff)
  {
	if(typeof topstuff=="undefined")
	  {
		topstuff=false;
		}
	upfacing=0;
	downfacing=0;
	for(var i2=0;i2<Spider.piles[i].length;i2++)
	  {
		if(Spider.deck.cards[Spider.piles[i][i2]].faceup)
		  {
			upfacing++;
			}
		else
		  {
			downfacing++;
			}
		}
	
	stackheight=0.04*Cards.WHR
  	while( stackheight*upfacing + stackheight*0.25*downfacing + 0.135*Cards.WHR > 0.8)
  	  {
  		//too many cards to fit on screen, so shorten how far between each card on the pile
  		stackheight*=0.95
  		}
  if(topstuff)
	  {
		return stackheight*((upfacing>0)?(upfacing-1):upfacing) + stackheight*((upfacing>0)?(downfacing):(downfacing-1))/4
		}
	else
  	{
  	return stackheight;
  	}
	}
	
//i=pile num, full=buildmousedowns? , optional forceheight to force a certain stackheight.
Spider.drawPile=function(i,full,forceheight)
  {
	
	if(typeof forceheight=='undefined')
	  {
		forceheight=false;
		}
	
	if(full)
	  {
		Spider.buildMouseDowns();
		}
	
	if(i<10)
		  {
			//piles of cards on table
			
			if(Cards.IE)
  			{
  			Cards.canvas[0].fillStyle="rgb(140,210,255)";
  			Cards.canvas[0].fillRect(i*0.1*Cards.width , 0.15*Cards.WHR*Cards.height , 0.1*Cards.width, (1-0.15*Cards.WHR)*Cards.height)
  			}
			else
			  {
				Cards.canvas[0].clearRect(i*0.1*Cards.width , 0.15*Cards.WHR*Cards.height , 0.1*Cards.width, (1-0.15*Cards.WHR)*Cards.height)
				}
			
			if(forceheight===false)
			  {
  			stackheight=Spider.getStackHeight(i);
  			}
			else
			  {
				stackheight=forceheight;
				}
			
			pileheight=0
  		for(var i2=0;i2<Spider.piles[i].length;i2++)
  		  {
  			Spider.deck.cards[Spider.piles[i][i2]].draw(i*0.1 +0.005 , 0.15*Cards.WHR +pileheight +0.0075*Cards.WHR , 0.09 , 0 , i2==Spider.piles[i].length-1?true:false)
				pileheight+=Spider.deck.cards[Spider.piles[i][i2]].faceup ? stackheight : stackheight/4
  			}

			}
		else if(i==10)
		  {
			if(Cards.IE)
  			{
  			Cards.canvas[0].fillStyle="rgb(140,210,255)";
  			Cards.canvas[0].fillRect(0 , 0 , 0.2*Cards.width, 0.15*Cards.WHR*Cards.height)
  			}
			else
			  {
				Cards.canvas[0].clearRect(0 , 0 , 0.2*Cards.width, 0.15*Cards.WHR*Cards.height)
				}
			//spare deck
			if(Spider.piles[i].length>0)
			  {
				//stack the cards right, to show how many more dealings are left.
				for(var i2=0;i2<Spider.piles[i].length/10;i2++)
				  {
					Spider.deck.cards[Spider.piles[i][0]].draw(0.005 + 0.008*i2 , 0.0075*Cards.WHR , 0.09 , 0 , i2==Spider.piles[i].length/10-1 ? true:false)
					}
				new Cards.mouseDown(0.005+0.008*(Spider.piles[i].length/10-1) , 0.0075*Cards.WHR , 0.09 ,0.135*Cards.WHR , 4 , i , false)
				}
				
			}
		else
		  {
			//ace stacks
			//'rgb(140,210,255)'
			if(Cards.IE)
  			{
  			Cards.canvas[0].fillStyle="rgb(140,210,255)";
  			Cards.canvas[0].fillRect((i-9)*0.1*Cards.width , 0 , 0.1*Cards.width, 0.15*Cards.WHR*Cards.height)
  			}
			else
			  {
				Cards.canvas[0].clearRect((i-9)*0.1*Cards.width , 0 , 0.1*Cards.width, 0.15*Cards.WHR*Cards.height)
				}
			
			if(Spider.piles[i].length>0)
			  {
				//ace stuck full - draw an ace
				Spider.deck.cards[Spider.piles[i][Spider.piles[i].length-1]].draw((i-9)*0.1+0.005 , 0.0075*Cards.WHR , 0.09 , 0 , true)
				}
			else
			  {
				//draw an empty box with half transparent suit sybmols.
  			//Cards.drawDiamond(((i-9)*0.1+0.05)*Cards.width , (0.075)*Cards.width , 0.02*Cards.width , false , 0);
  			
  		  Cards.drawDiamond(((i-9)*0.1+0.05 - 0.1/4)*Cards.width , (0.075 - 0.075/3)*Cards.width , 0.015*Cards.width , false , 0);
  		  Cards.drawHeart(((i-9)*0.1+0.05 + 0.1/4)*Cards.width , (0.075 + 0.075/3)*Cards.width , 0.015*Cards.width , false , 0);
  		  Cards.drawClub(((i-9)*0.1+0.05 - 0.1/4)*Cards.width , (0.075 + 0.075/3)*Cards.width , 0.015*Cards.width , false , 0);
  		  Cards.drawSpade(((i-9)*0.1+0.05 + 0.1/4)*Cards.width , (0.075 - 0.075/3)*Cards.width , 0.015*Cards.width , false , 0);
  
  			Cards.drawBox((i-9)*0.1+0.005 , 0.0075, 0.09 ,0.135*Cards.WHR,'rgba(140,210,255,0.5)','rgb(0,0,0)',0)
  			}
			}
	}

Spider.buildMouseDowns=function()
  {
	Cards.mouseDowns=new Array();
	
	for(var i=0;i<Spider.piles.length;i++)
	  {
		
		if(i<10)
		  {
			//piles of cards on table
			stackheight=Spider.getStackHeight(i);
			
			pileheight=0
  		for(var i2=0;i2<Spider.piles[i].length;i2++)
  		  {
				if(Spider.deck.cards[Spider.piles[i][i2]].faceup)
  				{
    			//picking up cards detection - only if facing up
  				new Cards.mouseDown(i*0.1 +0.005 , 0.15*Cards.WHR +pileheight +0.0075*Cards.WHR , 0.09 , (i2==Spider.piles[i].length-1? 0.135:stackheight)*Cards.WHR , 0 , [i,i2] , true)
  				}
				
				if(i2==Spider.piles[i].length-1)
				  {
					switch(Spider.deck.cards[Spider.piles[i][i2]].faceup)
  					{
  					case true:
    					//putting card down detection
    					new Cards.mouseDown(i*0.1 +0.005 , 0.15*Cards.WHR +pileheight +0.0075*Cards.WHR , 0.09 ,0.135*2*Cards.WHR , 1 , i , false)
  					break;
  					case false:
						  //turn card over detection
							new Cards.mouseDown(i*0.1 +0.005 , 0.15*Cards.WHR +pileheight +0.0075*Cards.WHR , 0.09 , 0.135*Cards.WHR , 5 , [i,i2] , true)
  					break;
  					}
					}
				
				pileheight+=Spider.deck.cards[Spider.piles[i][i2]].faceup ? stackheight : stackheight/4
				
  			}
			
			if(Spider.piles[i].length==0)
			  {
				//putting card down detection
    		new Cards.mouseDown(i*0.1 +0.005 , (0.15+0.0075)*Cards.WHR , 0.09 ,0.135*2*Cards.WHR , 1 , i , false)
				}
			
			}
		else if(i==10)
		  {
			
			//spare deck
			if(Spider.piles[i].length>0)
			  {
				//stack the cards right, to show how many more dealings are left.
				new Cards.mouseDown(0.005+0.008*(Spider.piles[i].length/10-1) , 0.0075*Cards.WHR , 0.09 ,0.135*Cards.WHR , 4 , i , false)
				}
			}
		
		}	
	}
	
Spider.draw=function()
  {
	clearInterval(Spider.animateLoop)
	
	Cards.clear();
  Cards.mouseDowns=new Array();
	new Cards.text('','#000000',1,1,0,0,0.1)
	
	for(var i=0;i<Spider.piles.length;i++)
	  {
		
		if(i<10)
		  {
			//piles of cards on table
			stackheight=Spider.getStackHeight(i);
			
			pileheight=0
  		for(var i2=0;i2<Spider.piles[i].length;i2++)
  		  {
  			Spider.deck.cards[Spider.piles[i][i2]].draw(i*0.1 +0.005 , 0.15*Cards.WHR +pileheight +0.0075*Cards.WHR , 0.09 , 0 , i2==Spider.piles[i].length-1?true:false)
				if(Spider.deck.cards[Spider.piles[i][i2]].faceup)
  				{
    			//picking up cards detection - only if facing up
  				new Cards.mouseDown(i*0.1 +0.005 , 0.15*Cards.WHR +pileheight +0.0075*Cards.WHR , 0.09 , (i2==Spider.piles[i].length-1? 0.135:stackheight)*Cards.WHR , 0 , [i,i2] , true)
  				}
				
				if(i2==Spider.piles[i].length-1)
				  {
					switch(Spider.deck.cards[Spider.piles[i][i2]].faceup)
  					{
  					case true:
    					//putting card down detection
    					new Cards.mouseDown(i*0.1 +0.005 , 0.15*Cards.WHR +pileheight +0.0075*Cards.WHR , 0.09 ,0.135*2*Cards.WHR , 1 , i , false)
  					break;
  					case false:
						  //turn card over detection
							new Cards.mouseDown(i*0.1 +0.005 , 0.15*Cards.WHR +pileheight +0.0075*Cards.WHR , 0.09 , 0.135*Cards.WHR , 5 , [i,i2] , true)
  					break;
  					}
					}
				
				pileheight+=Spider.deck.cards[Spider.piles[i][i2]].faceup ? stackheight : stackheight/4
				
  			}
			
			if(Spider.piles[i].length==0)
			  {
				//putting card down detection
    		new Cards.mouseDown(i*0.1 +0.005 , (0.15+0.0075)*Cards.WHR , 0.09 ,0.135*2*Cards.WHR , 1 , i , false)
				}
			
			}
		else if(i==10)
		  {
			
			//spare deck
			if(Spider.piles[i].length>0)
			  {
				//stack the cards right, to show how many more dealings are left.
				for(var i2=0;i2<Spider.piles[i].length/10;i2++)
				  {
					Spider.deck.cards[Spider.piles[i][0]].draw(0.005 + 0.008*i2 , 0.0075*Cards.WHR , 0.09 , 0 , i2==Spider.piles[i].length/10-1 ? true:false)
					}
				new Cards.mouseDown(0.005+0.008*(Spider.piles[i].length/10-1) , 0.0075*Cards.WHR , 0.09 ,0.135*Cards.WHR , 4 , i , false)
				}
			}
		else
		  {
			//ace stacks
			//'rgb(140,210,255)'
			
			if(Spider.piles[i].length>0)
			  {
				//ace stuck full - draw an ace
				Spider.deck.cards[Spider.piles[i][Spider.piles[i].length-1]].draw((i-9)*0.1+0.005 , 0.0075*Cards.WHR , 0.09 , 0 , true)
				}
			else
			  {
				//draw an empty box with half transparent suit sybmols.
  			//Cards.drawDiamond(((i-9)*0.1+0.05)*Cards.width , (0.075)*Cards.width , 0.02*Cards.width , false , 0);
  			
  		  Cards.drawDiamond(((i-9)*0.1+0.05 - 0.1/4)*Cards.width , (0.075 - 0.075/3)*Cards.width , 0.015*Cards.width , false , 0);
  		  Cards.drawHeart(((i-9)*0.1+0.05 + 0.1/4)*Cards.width , (0.075 + 0.075/3)*Cards.width , 0.015*Cards.width , false , 0);
  		  Cards.drawClub(((i-9)*0.1+0.05 - 0.1/4)*Cards.width , (0.075 + 0.075/3)*Cards.width , 0.015*Cards.width , false , 0);
  		  Cards.drawSpade(((i-9)*0.1+0.05 + 0.1/4)*Cards.width , (0.075 - 0.075/3)*Cards.width , 0.015*Cards.width , false , 0);
  
  			Cards.drawBox((i-9)*0.1+0.005 , 0.0075, 0.09 ,0.135*Cards.WHR,'rgba(140,210,255,0.5)','rgb(0,0,0)',0)
  			}
			}
		
		}	
	}
	
	
Spider.checkMice=function()
  {
	if(Cards.drag!==false && Cards.checkCount%2==0)
	  {
		Cards.minicanvastag.style.left=Cards.mouse[0]+Cards.dragDiff[0];
		Cards.minicanvastag.style.top=Cards.mouse[1]+Cards.dragDiff[1];
		}
	Cards.checkCount++
	}
	
Cards.addLoadEvent(function(){Cards.load();Spider.startUp();})	