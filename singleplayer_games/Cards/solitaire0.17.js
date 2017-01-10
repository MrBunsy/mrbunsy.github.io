// Javascript Solitare Version 1.6
// Copyright Luke Wallin August 2008
// Requires Cards script.
// To add this to a page use the following html:
/*
<!--[if IE]><script type="text/javascript" src="excanvas-compressed.js"></script><![endif]-->
<div  id="cardsdiv" style="width:650;height:650;"></div>
<script src="cards0.22.js" type="text/javascript"></script>
<script src="solitaire0.16.js" type="text/javascript"></script>
*/

// You can change the size of the game by changing the style of cardsdiv.
// It is designed to be square, and will likely look odd in a rectangle.

Solitaire=new Object();

//<div id="noselectdiv" style="position:absolute;z-index:1;width:'+parseFloat(document.getElementById('cardsdiv').style.width)+';height:'+parseFloat(document.getElementById('cardsdiv').style.height)*0.98+';"></div>

//create canvas tag (must be done here to work in IE)
document.getElementById('cardsdiv').innerHTML+='<div id="menudiv" style="border:solid black 1px;background-color:#78beeb;width:'+parseFloat(document.getElementById('cardsdiv').style.width)+';height:'+parseFloat(document.getElementById('cardsdiv').style.height)*0.04+';font-size:'+parseFloat(document.getElementById('cardsdiv').style.height)*0.03+'px;"><span style="float:left;margin-left:'+parseFloat(document.getElementById('cardsdiv').style.height)*0.01+'px;" onClick="Solitaire.confirmNewGame();">New Game</span><span style="float:right;margin-right:'+parseFloat(document.getElementById('cardsdiv').style.height)*0.01+'px;" onClick="Solitaire.about();">Solitaire</span></div><span id="cardsspan"></span><span style="display:none">this makes it work in IE for some bizzare reason</span><canvas style="display:none;" id="cardsminicanvas" width="'+(parseFloat(document.getElementById('cardsdiv').style.width)*0.13)+'" height="'+(parseFloat(document.getElementById('cardsdiv').style.height)*0.66)+'"></canvas><canvas id="cardscanvas" width="'+(parseFloat(document.getElementById('cardsdiv').style.width))+'" height="'+(parseFloat(document.getElementById('cardsdiv').style.height)*0.96)+'"></canvas>'

Solitaire.confirmNewGame=function()
  {
	/*
	Cards.drawBlank(0.35,0.3,0.3,'rgb(0,200,0)',0);
	Cards.drawOutline(0.35,0.3,0.3,'rgb(0,0,0)',0);
	*/
	//disable mouse clicks:
	Cards.mouseDowns=new Array();
	
	Cards.drawBox(0.325,0.3,0.35,0.3,'rgb(0,200,0)','rgb(0,0,0)',0);
	new Cards.text('<center>New Game?<br><br><span onClick="Solitaire.newGame();">Yes</span>&nbsp;&nbsp;&nbsp;&nbsp; <span onClick="Solitaire.draw();">No</span></center>','#000000',1,0.25,0,0.36,0.05);
	}

Solitaire.about=function()
  {
	//disable mouse clicks:
	Cards.mouseDowns=new Array();
	Cards.drawBox(0.325,0.3,0.35,0.35,'rgb(0,200,0)','rgb(0,0,0)',0);
	new Cards.text('<center>Solitaire 1.7<br><br><span style="font-size:'+Cards.width*0.03+'px;">&copy; Luke Wallin 2008<br><br>www.lukewallin.co.uk</a></span></center>','#000000',1,0.25,0,0.36,0.05);
	//Cards.mouseDown=function(x,y,w,h,type,info,down)
	new Cards.mouseDown(0.325,0.3,0.35,0.35 , 6 , false, true);
	}
	
Solitaire.newGame=function()
  {
	Cards.checkCount=0;
	Cards.noSelect(document.getElementById('menudiv'))
	
	Solitaire.gameWon=false;
	//time for double click
	if (Cards.IE)
	  {
		Solitaire.doubleTime=2000;
		}
	else
	  {
		Solitaire.doubleTime=500;
		}
	Cards.minicanvastag.style.display="none";
	//mouse stuff for dragging minicanvas
	Solitaire.drag=false;
  Solitaire.dragDiff=new Array(2);
	
	//double click detection
	Solitaire.mouseDownAt=[[false,false],new Date()];
	Solitaire.justDoubleClicked=false;

	Cards.checkMice=Solitaire.checkMice;
	
	//set up mouse detection
	Cards.div.onmousedown=function(){Solitaire.mouseGoneDown(true);}
	Cards.div.onmouseup=function(){Solitaire.mouseGoneDown(false);}
	//Cards.minicanvastag.onmouseup=function(){Solitaire.mouseGoneDown(false);}
	
	//create a pack with no jokers
	Solitaire.deck=new Cards.deck(0,false);
	//shuffle deck
	Solitaire.deck.shuffle();
	
	//piles 0-6 are on the table, 7 is the spare cards, 8 is the turned over spare cards and 9-12 are the ace piles
	Solitaire.piles=new Array(13);
	
	tempcardcount=0;
	
	for(var i=0;i<Solitaire.piles.length;i++)
	  {
		Solitaire.piles[i]=new Array();
		if(i<7)
		  {
			//add deck references to piles of cards on board
			for(var i2=0;i2<i+1;i2++)
			  {
				Solitaire.piles[i].push(tempcardcount);
				tempcardcount++;
				}
			Solitaire.deck.cards[Solitaire.piles[i][Solitaire.piles[i].length-1]].faceup=true;
			}
		else if(i==7)
		  {
			//spare cards pile
			for(var i2=tempcardcount;i2<Solitaire.deck.cardcount;i2++)
			  {
				Solitaire.piles[i].push(tempcardcount);
				tempcardcount++
				}
			}
		}
	Solitaire.draw();
	}

Solitaire.checkMice=function()
  {
  if(Solitaire.drag!==false && Cards.checkCount%2==0)
	  {
		Cards.minicanvastag.style.marginLeft=Cards.mouse[0]+Solitaire.dragDiff[0];
		Cards.minicanvastag.style.marginTop=Cards.mouse[1]+Solitaire.dragDiff[1];
		}
	Cards.checkCount++
  }

//stop dragging a card
Solitaire.dropCard=function()
  {
	Solitaire.drag=false;
	Cards.minicanvastag.style.display='none';
	}

//types: 0=card which can be dragged (info: array[col, row]),
// 1=card to be turned over (info: array[col, row]),
// 2=pile which can be dragged ONTO (info:pile)
// 3=take another card off the deck
// 4=turn deck over
// 5=new game
// 6=re-draw screen


Solitaire.mouseGoneDown=function(down)
  {
  cardin=Cards.findmouseDown(down)
  //alert(cardin)
	if(cardin!==false)
  	{
  	switch(Cards.mouseDowns[cardin].type)
  	  {
  		case 0: //dragging card
			  if(Solitaire.drag===false)
  				{
  				counttime=new Date()
  				
  				if(counttime-Solitaire.mouseDownAt[1]<Solitaire.doubleTime  && Cards.mouseDowns[cardin].info[0]==Solitaire.mouseDownAt[0][0] && Cards.mouseDowns[cardin].info[1]==Solitaire.mouseDownAt[0][1] && Solitaire.piles[Cards.mouseDowns[cardin].info[0]].length-1==Cards.mouseDowns[cardin].info[1])
  				  {
  					//we've clicked on the same card as last time, within half a second, and it's the top card on the pile
  					
  					//if we can put it on an ace stack, do so
  					  for(var i=9;i<Solitaire.piles.length;i++)
  						  {
  							//alert([i,Solitaire.piles[i].length])
  							if(Solitaire.piles[i].length>0)
  							  {
  								//cards on the ace stack
  								if(Solitaire.deck.cards[Solitaire.piles[i][0]].suit==Solitaire.deck.cards[Solitaire.piles[Cards.mouseDowns[cardin].info[0]][Cards.mouseDowns[cardin].info[1]]].suit && Solitaire.deck.cards[Solitaire.piles[i][Solitaire.piles[i].length-1]].number==Solitaire.deck.cards[Solitaire.piles[Cards.mouseDowns[cardin].info[0]][Cards.mouseDowns[cardin].info[1]]].number-1)
  								  {
  									//same suit as the ace and one number more than the card on top
  									
  									//add card to this ace pile
  									Solitaire.piles[i].push(Solitaire.piles[Cards.mouseDowns[cardin].info[0]][Cards.mouseDowns[cardin].info[1]])
  								  Solitaire.piles[Cards.mouseDowns[cardin].info[0]]=Solitaire.piles[Cards.mouseDowns[cardin].info[0]].slice(0,-1)
  									//Solitaire.draw();
  									Solitaire.drawPile(Cards.mouseDowns[cardin].info[0]);
  									Solitaire.drawPile(i);
  									Solitaire.justDoubleClicked=true;
  									setTimeout(function(){Solitaire.justDoubleClicked=false},100);
  									break;
  									}
  								}
  							else if(Solitaire.deck.cards[Solitaire.piles[Cards.mouseDowns[cardin].info[0]][Cards.mouseDowns[cardin].info[1]]].number==1)
  							  {
  								//no cards on ace stack and this is an ace
  								//add card to this ace pile
  								Solitaire.piles[i].push(Solitaire.piles[Cards.mouseDowns[cardin].info[0]][Cards.mouseDowns[cardin].info[1]])
  								Solitaire.piles[Cards.mouseDowns[cardin].info[0]]=Solitaire.piles[Cards.mouseDowns[cardin].info[0]].slice(0,-1)
  								//Solitaire.draw();
  								Solitaire.drawPile(Cards.mouseDowns[cardin].info[0]);
  								Solitaire.drawPile(i);
  								Solitaire.justDoubleClicked=true;
  								setTimeout(function(){Solitaire.justDoubleClicked=false},100);
  								break;
  								}
  							}
  					}
  				else
  				  {
    				Solitaire.mouseDownAt=[Cards.mouseDowns[cardin].info,counttime];
    				
    				//store what cards are being dragged
    				Solitaire.drag=Solitaire.piles[Cards.mouseDowns[cardin].info[0]].slice(Cards.mouseDowns[cardin].info[1])
    				
    				//remove this from old pile
    				Solitaire.piles[Cards.mouseDowns[cardin].info[0]]=Solitaire.piles[Cards.mouseDowns[cardin].info[0]].slice(0,Cards.mouseDowns[cardin].info[1])
    				
    				//pile cards being dragged from
    				Solitaire.dragFrom=Cards.mouseDowns[cardin].info[0];
    
    				//stuff for mouse dragging image of card
    				Solitaire.dragDiff[0]=Math.ceil(Cards.mouseDowns[cardin].x*Cards.width-Cards.mouse[0]);
    				Solitaire.dragDiff[1]=Math.ceil(Cards.mouseDowns[cardin].y*Cards.height-Cards.mouse[1]);
    				
    				//clear minicanvas
      			Cards.canvas[1].clearRect(0,0,Cards.width*0.13 , Cards.height*0.66)
    				//draw little cards on the minicanvas
      			for(var i=0;i<Solitaire.drag.length;i++)
      			  {
    					
        			Solitaire.deck.cards[Solitaire.drag[i]].draw(0.0001,0.001+i*0.04,0.12,1,i==Solitaire.drag.length-1?true:false)
      				}
    				Cards.minicanvastag.style.marginLeft=Cards.mouse[0]+Solitaire.dragDiff[0];
        		Cards.minicanvastag.style.marginTop=Cards.mouse[1]+Solitaire.dragDiff[1];
      		  Cards.minicanvastag.style.display='block';
    				
      			Solitaire.drawPile(Cards.mouseDowns[cardin].info[0]);
    				}
  				}
  		break;
			case 1://turning card over
			  if(Solitaire.drag===false && !Solitaire.justDoubleClicked)
  				{
					//not dragging anything AND not just double clicked to send a card to the ace stack
  			  Solitaire.deck.cards[Solitaire.piles[Cards.mouseDowns[cardin].info[0]][Cards.mouseDowns[cardin].info[1]]].faceup=true;
  				//Solitaire.draw();
					Solitaire.drawPile(Cards.mouseDowns[cardin].info[0]);
  				}
			break;
			case 2://dropping card onto a pile
			
			  //something being dragged, and card on pile is one higher number and different colour, or pile is empty and this is a king
			  if(Solitaire.drag!==false && Solitaire.cardCanGoHere(Solitaire.drag[0] , Cards.mouseDowns[cardin].info) )
  				{
  				Solitaire.piles[Cards.mouseDowns[cardin].info]=Solitaire.piles[Cards.mouseDowns[cardin].info].concat(Solitaire.drag)
  				Solitaire.dropCard();
  				//Solitaire.draw();
					Solitaire.drawPile(Cards.mouseDowns[cardin].info);
  				}
			break;
			case 3://turning over another card from the spare deck

			  //add top card to pile
			  Solitaire.piles[8].push(Solitaire.piles[7][Solitaire.piles[7].length-1]);
				//turn card over
				Solitaire.deck.cards[Solitaire.piles[8][Solitaire.piles[8].length-1]].faceup=true
				//take top card off deck stack.
				Solitaire.piles[7]=Solitaire.piles[7].slice(0,-1);
				
				//Solitaire.draw();
				Solitaire.drawPile(7);
				Solitaire.drawPile(8);
			break;
			case 4://deck of spare cards needs turning over again.

				//put pile back in deck
			  Solitaire.piles[7]=Solitaire.piles[8];
				//put back in right order
				Solitaire.piles[7].reverse();
				
				//turn them all face down
				for(var i=0;i<Solitaire.piles[7].length;i++)
				  {
					Solitaire.deck.cards[Solitaire.piles[7][i]].faceup=false;
					}
				
				//remove the pile
				Solitaire.piles[8]=new Array();
				//Solitaire.draw();
				Solitaire.drawPile(7);
				Solitaire.drawPile(8);
			break;
			case 5://new game
			  
				Solitaire.newGame();
			break;
			case 6://re-draw screen, usually used for closing menus
			
			  Solitaire.draw();
			break;
  		}
  	}
	if(!down && Solitaire.drag!==false)
	  {
		//mouse gone UP and something was being dragged
		
		//add what was being dragged back to where it was dragged from
		Solitaire.piles[Solitaire.dragFrom]=Solitaire.piles[Solitaire.dragFrom].concat(Solitaire.drag)
		Solitaire.dropCard();
		Solitaire.draw();
		}
	
	Solitaire.checkWin();
	}	

//check to see if a certain card can go on a certain pile
Solitaire.cardCanGoHere=function(cardnum,pile)
  {
	
	if(9<=pile && pile<=13)
	  {
		//ace stacks
		
		if(Solitaire.piles[pile].length==0 && Solitaire.deck.cards[cardnum].number==1)
		  {
			//if empty pile, only allow aces
			return true;
			}
		
		if(Solitaire.piles[pile].length>0 && Solitaire.deck.cards[cardnum].suit == Solitaire.deck.cards[Solitaire.piles[pile][0]].suit && Solitaire.deck.cards[cardnum].number == Solitaire.deck.cards[Solitaire.piles[pile][Solitaire.piles[pile].length-1]].number+1)
		  {
			//if pile not empty, must be same suit as the ace and the next highest number
			return true;
			}
		
		}
	else if(Solitaire.piles[pile].length==0)
	  {
		//empty pile
		
		if(Solitaire.deck.cards[cardnum].number==13)
		  {
			//only allow kings
			return true;
			}
		}
	else
	  {
		//pile with cards on
		if(Solitaire.deck.cards[cardnum].red !== Solitaire.deck.cards[Solitaire.piles[pile][Solitaire.piles[pile].length-1]].red && Solitaire.deck.cards[cardnum].number == Solitaire.deck.cards[Solitaire.piles[pile][Solitaire.piles[pile].length-1]].number-1)
		  {
			//only if different colour and the number lower
			return true;
			}
		}
	return false;
	}

//check for a win
Solitaire.checkWin=function()
  {
	
	if(Solitaire.piles[9].length+Solitaire.piles[10].length+Solitaire.piles[11].length+Solitaire.piles[12].length == 52)
	  {
		//all cards on the ace stacks and cascade not already in progress
		if(!Solitaire.gameWon)
		  {
			Solitaire.win();
			}
		else
		  {
			//Solitaire.newGame();
			}
		}
	
	}	

Solitaire.forceWin=function()
  {
  for(var i=0;i<Solitaire.piles.length;i++)
	  {
		Solitaire.piles[i]=new Array();
		}
	for(var i=9;i<Solitaire.piles.length;i++)
	  {
		for(var i2=0;i2<13;i2++)
  		{
  		Solitaire.piles[i].push((i-9)*12+i2);
  		}
		}
  }
	
Solitaire.win=function()
  {
	Solitaire.gameWon=true;
	//diable mouse stuff
	Cards.mouseDowns=new Array();
	//Cards.hideTexts();
	//background-color:white; filter:alpha(opacity=75);-moz-opacity:.75;opacity:.75;
	
	//Cards.mouseDown=function(x,y,w,h,type,info,down)
	new Cards.mouseDown(0.2 , 0.5 , 0.6 , 0.2 , 5 , false , true);
	//<span style="font-size:'+(Cards.width*0.1)+'px;">Click for new game</span>
	new Cards.text('<center>You Win!<br><span style="padding:5px;background-color:#00c800;border:solid black 1px;font-size:'+(Cards.width*0.1)+'px;" onClick=";Solitaire.newGame();">New Game?</span></center>','#000000',1,0.6,0,0.3,0.2);
	
	//below is for the win easter egg of flying cards.  works well in all browsers except IE
	
	Solitaire.winCards=new Array();
	Solitaire.winCards.concat(Solitaire.piles[9],Solitaire.piles[10],Solitaire.piles[11],Solitaire.piles[12])
	
	Solitaire.winMiniCanvas=function(card)
  {
	//clear minicanvas
	Cards.canvas[1].clearRect(0,0,Cards.width*0.13 , Cards.height*0.66)
  //draw little cards on the minicanvas
	Solitaire.deck.cards[card].draw(0.0001,0.001,0.12,1,true)

  Cards.minicanvastag.style.marginLeft=Solitaire.flyPos[0]*Cards.width;
	Cards.minicanvastag.style.marginTop=Solitaire.flyPos[1]*Cards.height;
  Cards.minicanvastag.style.display='block';
	}
	
	
	Solitaire.flyA=0.09;
	Solitaire.flyingCard=0;
	Solitaire.flyPos=[0.429+0.0115+0.143*Math.round(Math.random()*3),0.0175];
	Solitaire.flyV=[(Math.random()*0.1+0.01)*(Math.round(Math.random()*0.8)>0.5?1:-1),0];
	Solitaire.flyE=0.7+Math.random()*0.2;// (0.8->1)
	//Solitaire.flyTime=Solitaire.doubleTime/5000
	Solitaire.flyTime=0.1
	if(Cards.IE)
	  {
		Solitaire.flyTime*=2;
		Solitaire.winMiniCanvas(0)
		}

	
	Cards.canvas[0].fillStyle="rgb(255,255,255)";
	
	
	Solitaire.winFunc=function()
  {
	
	  newV=new Array(2);
		//v=u+at
		newV[0]=Solitaire.flyV[0];
		newV[1]=Solitaire.flyV[1]+Solitaire.flyA*Solitaire.flyTime;
		
		//s=ut+ 1/2 at^2
		newPos=new Array(2);
		newPos[0]=Solitaire.flyPos[0] + newV[0]*Solitaire.flyTime// + Solitaire.flyA*Math.pow(Solitaire.flyTime,2);
		newPos[1]=Solitaire.flyPos[1] + newV[1]*Solitaire.flyTime + Solitaire.flyA*Math.pow(Solitaire.flyTime,2);
		
		if(newPos[1]+0.12*1.5 > 0.96)
		  {
			//card off bottom of screen
			newV[1]*=-Solitaire.flyE;
			//line up with bottom of screen
			newPos[1]=0.96-0.12*1.5
			}
		
		
		
	//(x,y,width,where,full)
	if(!Cards.IE)
  	{
		Solitaire.deck.cards[Solitaire.flyingCard].faceup=true
  	Solitaire.deck.cards[Solitaire.flyingCard].draw(newPos[0],newPos[1],0.12,0,Solitaire.doubleTime>500?false:true);
  	}
	else
	 {
	 Cards.minicanvastag.style.marginLeft=newPos[0]*Cards.width;
	 Cards.minicanvastag.style.marginTop=newPos[1]*Cards.height;
	 Cards.canvas[0].fillRect(newPos[0]*Cards.width , newPos[1]*Cards.height , 0.12*Cards.width , 0.12*1.5*Cards.height)
	 Cards.canvas[0].strokeRect(newPos[0]*Cards.width , newPos[1]*Cards.height , 0.12*Cards.width , 0.12*1.5*Cards.height)
	 }
	
	Solitaire.flyPos=newPos
	Solitaire.flyV=newV
	
		if(newPos[0]>1 || newPos[0]+0.12<0)
		  {
			//card off left or right of screen
			Solitaire.flyingCard++
			Solitaire.flyingCard%=52;
			//Solitaire.flyPos=[0.429,0];
			//Solitaire.flyV=[0.05,0]
			Solitaire.flyPos=[0.429+0.0115+0.143*Math.round(Math.random()*3),0.0175];
			Solitaire.flyV=[(Math.random()*0.1+0.02)*(Math.round(Math.random()*0.8)>0.5?1:-1),0];
			Solitaire.flyE=0.7+Math.random()*0.2;
			if(Cards.IE)
			  {
				Solitaire.winMiniCanvas(Solitaire.flyingCard);
				}
			}
	
	}
	
	Solitaire.winLoop=setInterval(Solitaire.winFunc,Solitaire.flyTime*100);
	}

//draw just one pile
Solitaire.drawPile=function(pile)
  {
	Cards.span.innerHTML='';
	Cards.texts=new Array();
	new Cards.text('','#000000',1,1,0,0,0.1)
	//Cards.mouseDowns=new Array();
	Solitaire.buildMouseDowns();
	Cards.canvas[0].fillStyle="rgb(140,210,255)";
	switch(pile)
	  {
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6://pile is one of the card piles at the bottom
		  
			Cards.canvas[0].fillRect(pile*0.143*Cards.width , 0.215*Cards.height , 0.143*Cards.width , 0.785*Cards.height);
			
  		pileheight=0
  		for(var i2=0;i2<Solitaire.piles[pile].length;i2++)
  		  {
  			Solitaire.deck.cards[Solitaire.piles[pile][i2]].draw(pile*0.143 +0.0115 , 0.215 +pileheight +0.0175 , 0.12 , 0 , i2==Solitaire.piles[pile].length-1?true:false)
  			pileheight+=Solitaire.deck.cards[Solitaire.piles[pile][i2]].faceup ? 0.04 : 0.015
  			}
  		
		break;
		case 7://deck stack
		  
			Cards.canvas[0].fillRect(0 , 0 , 0.143*Cards.width , 0.215*Cards.height);
			
			if(Solitaire.piles[7].length>0)
    	  {
    		Solitaire.deck.cards[Solitaire.piles[7][Solitaire.piles[7].length-1]].draw(0.0115 , 0.0175 , 0.12 , 0 , true)
    		}
    	else
    	  {
    		//rest of deck is empty
    		Cards.drawOutline(0.0115 , 0.0175 , 0.12, "rgb(0,0,0)" , 0);
    		}
		break;
		case 8://card turned over next to deck
		  
			Cards.canvas[0].fillRect(0.143*Cards.width , 0 , 0.143*Cards.width , 0.215*Cards.height);
    	if(Solitaire.piles[8].length>0)
    	  {
    		Solitaire.deck.cards[Solitaire.piles[8][Solitaire.piles[8].length-1]].draw(0.143+0.0115 , 0.0175 , 0.12 , 0 , true);
    		}
		break;
		case 9:
		case 10:
		case 11:
		case 12:
		  
			Cards.canvas[0].fillRect(0.143*(pile-6)*Cards.width , 0 , 0.143*Cards.width , 0.215*Cards.height);
			
			if(Solitaire.piles[pile].length>0)
	    {
			Solitaire.deck.cards[Solitaire.piles[pile][Solitaire.piles[pile].length-1]].draw(0.143*(pile-6)+0.0115 , 0.0175 , 0.12 , 0 , true);
			}
		else
		  {
			Cards.drawOutline(0.143*(pile-6)+0.0115 , 0.0175 , 0.12 , "rgb(0,0,0)" , 0);
			}
		break;
		}
//	Solitaire.buildMouseDowns();
	}

//just put all the mouse downs and ups in place
Solitaire.buildMouseDowns=function()
  {
	Cards.mouseDowns=new Array();
	
	for(var i=0;i<7;i++)
	  {
		pileheight=0
		
		if(Solitaire.piles[i].length==0)
		  {
			//empty space for a king
			new Cards.mouseDown(i*0.143 +0.0115, 0.215 +0.0175 , 0.2 , 0.12*1.5 , 2 ,i , false)
			}
		for(var i2=0;i2<Solitaire.piles[i].length;i2++)
		  {	
			if(Solitaire.deck.cards[Solitaire.piles[i][i2]].faceup && i2!==Solitaire.piles[i].length-1)
			  {
				//card facing up but not on top
				new Cards.mouseDown(i*0.143 +0.0115, 0.215 +pileheight +0.0175,0.12, 0.04 , 0 ,[i,i2],true)
				}
			else if(Solitaire.deck.cards[Solitaire.piles[i][i2]].faceup && i2==Solitaire.piles[i].length-1)
			  {
				//facing up and on top
				//can be dragged
				new Cards.mouseDown(i*0.143 +0.0115, 0.215 +pileheight +0.0175,0.12, 0.12*1.5 , 0 ,[i,i2],true)
				//can have cards placed on top
				new Cards.mouseDown(i*0.143 +0.0115, 0.215 +pileheight +0.0175, 0.12, 0.12*1.8 , 2 , i , false)
				}
			else if(i2==Solitaire.piles[i].length-1 && !Solitaire.deck.cards[Solitaire.piles[i][i2]].faceup)
			  {
				//not facing up, but on top - so able to be turned over
				new Cards.mouseDown(i*0.143 +0.0115, 0.215 +pileheight +0.0175,0.12, 0.12*1.5 , 1 ,[i,i2],false)
				}
			pileheight+=Solitaire.deck.cards[Solitaire.piles[i][i2]].faceup ? 0.04 : 0.015
			}
		}
	//rest of deck
	if(Solitaire.piles[7].length>0)
	  {
		//click to turn over card on top of deck.
		new Cards.mouseDown(0.0115, 0.0175 , 0.12 , 0.12*1.5 , 3 , false , false );
		}
	else
	  {
		//rest of deck is empty
		//click to start deck again.
		new Cards.mouseDown(0.0115, 0.0175 , 0.12 , 0.12*1.5 , 4 , false , false );
		}
		
	//card turned over next to deck
	if(Solitaire.piles[8].length>0)
	  {
		//can be dragged
		new Cards.mouseDown(0.143+0.0115 , 0.0175 , 0.12 , 0.12*1.5 , 0 ,[8,Solitaire.piles[8].length-1],true)
		}
	
	//draw ace stacks
	for(var i=9;i<Solitaire.piles.length;i++)
	  {
		if(Solitaire.piles[i].length>0)
	    {
			//can be dragged
			new Cards.mouseDown(0.143*(i-6)+0.0115 , 0.0175 , 0.12, 0.12*1.5 , 0 ,[i,Solitaire.piles[i].length-1],true)
			}
		//can have cards placed on top
		new Cards.mouseDown(0.143*(i-6)+0.0115 , 0.0175 , 0.12, 0.12*1.8 , 2 ,i,false)
		}
	}
	
//draw the whole screen (same as all the drawPiles and buildMouse together - those were taken from this.)
Solitaire.draw=function()
  {
	clearInterval(Solitaire.winLoop)
	Cards.clear();
	Cards.mouseDowns=new Array();
	
	//new Cards.text('<span onClick="Solitaire.confirmNewGame();"><center>New<br>Game</center></span>','#000000',0.143,0.12,0.286,0.05,0.05);
	new Cards.text('','#000000',1,1,0,0,0.1)
	//draw piles
	for(var i=0;i<7;i++)
	  {
		pileheight=0
		
		if(Solitaire.piles[i].length==0)
		  {
			//empty space for a king
			new Cards.mouseDown(i*0.143 +0.0115, 0.215 +0.0175 , 0.2 , 0.12*1.5 , 2 ,i , false)
			}
		
		for(var i2=0;i2<Solitaire.piles[i].length;i2++)
		  {
			
			Solitaire.deck.cards[Solitaire.piles[i][i2]].draw(i*0.143 +0.0115 , 0.215 +pileheight +0.0175 , 0.12 , 0 , i2==Solitaire.piles[i].length-1?true:false)
			
			if(Solitaire.deck.cards[Solitaire.piles[i][i2]].faceup && i2!==Solitaire.piles[i].length-1)
			  {
				//card facing up but not on top
				new Cards.mouseDown(i*0.143 +0.0115, 0.215 +pileheight +0.0175,0.12, 0.04 , 0 ,[i,i2],true)
				}
			else if(Solitaire.deck.cards[Solitaire.piles[i][i2]].faceup && i2==Solitaire.piles[i].length-1)
			  {
				//facing up and on top
				//can be dragged
				new Cards.mouseDown(i*0.143 +0.0115, 0.215 +pileheight +0.0175,0.12, 0.12*1.5 , 0 ,[i,i2],true)
				//can have cards placed on top
				new Cards.mouseDown(i*0.143 +0.0115, 0.215 +pileheight +0.0175, 0.12, 0.12*1.8 , 2 , i , false)
				}
			else if(i2==Solitaire.piles[i].length-1 && !Solitaire.deck.cards[Solitaire.piles[i][i2]].faceup)
			  {
				//not facing up, but on top - so able to be turned over
				new Cards.mouseDown(i*0.143 +0.0115, 0.215 +pileheight +0.0175,0.12, 0.12*1.5 , 1 ,[i,i2],false)
				}
			
			pileheight+=Solitaire.deck.cards[Solitaire.piles[i][i2]].faceup ? 0.04 : 0.015
			}
		
		
		}
	//draw rest of deck
	if(Solitaire.piles[7].length>0)
	  {
		Solitaire.deck.cards[Solitaire.piles[7][Solitaire.piles[7].length-1]].draw(0.0115 , 0.0175 , 0.12 , 0 , true)
		//click to turn over card on top of deck.
		new Cards.mouseDown(0.0115, 0.0175 , 0.12 , 0.12*1.5 , 3 , false , false );
		}
	else
	  {
		//rest of deck is empty
		Cards.drawOutline(0.0115 , 0.0175 , 0.12, "rgb(0,0,0)" , 0);
		//click to start deck again.
		new Cards.mouseDown(0.0115, 0.0175 , 0.12 , 0.12*1.5 , 4 , false , false );
		}
		
	//card turned over next to deck
	if(Solitaire.piles[8].length>0)
	  {
		Solitaire.deck.cards[Solitaire.piles[8][Solitaire.piles[8].length-1]].draw(0.143+0.0115 , 0.0175 , 0.12 , 0 , true);
		//new Cards.mouseDown(0.143+0.0115 , 0.0175 , 0.12 , 0.12*1.5 , 5 , false , true );
		
		//can be dragged
		new Cards.mouseDown(0.143+0.0115 , 0.0175 , 0.12 , 0.12*1.5 , 0 ,[8,Solitaire.piles[8].length-1],true)
		}
	
	//draw ace stacks
	for(var i=9;i<Solitaire.piles.length;i++)
	  {
		if(Solitaire.piles[i].length>0)
	    {
			Solitaire.deck.cards[Solitaire.piles[i][Solitaire.piles[i].length-1]].draw(0.143*(i-6)+0.0115 , 0.0175 , 0.12 , 0 , true);
			
			//can be dragged
			new Cards.mouseDown(0.143*(i-6)+0.0115 , 0.0175 , 0.12, 0.12*1.5 , 0 ,[i,Solitaire.piles[i].length-1],true)
			}
		else
		  {
			Cards.drawOutline(0.143*(i-6)+0.0115 , 0.0175 , 0.12 , "rgb(0,0,0)" , 0);
			}
		//can have cards placed on top
		new Cards.mouseDown(0.143*(i-6)+0.0115 , 0.0175 , 0.12, 0.12*1.8 , 2 ,i,false)
		}
	
	}
	
this.onload=function(){Cards.load();Solitaire.newGame();}
