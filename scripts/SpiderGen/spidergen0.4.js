var SpiderGen=new Object();

document.getElementById('spiderdiv').innerHTML+='<span style="display:none">this makes it work in IE for some bizzare reason</span><canvas id="spidercanvas" width="'+(parseFloat(document.getElementById('spiderdiv').style.width))+'" height="'+(parseFloat(document.getElementById('spiderdiv').style.height))+'"></canvas>';

SpiderGen.load=function()
  {
	SpiderGen.width=parseFloat(document.getElementById('spiderdiv').style.width)
	SpiderGen.height=parseFloat(document.getElementById('spiderdiv').style.height)
	
	SpiderGen.canvastag=document.getElementById('spidercanvas');
	
  if (SpiderGen.canvastag.getContext)
    {
    SpiderGen.canvas = SpiderGen.canvastag.getContext('2d');
    }
	General.debug=true;

	
	new SpiderGen.spider(25,1,0,[250,0]);
	
	Physics.timeperloop=0.02;
	Physics.friction=20;
	SpiderGen.animateLoop=setInterval(SpiderGen.loop,20);
	
	}


Render=new Object();

Render.drawConnection=function(vp)
  {
	if(this.alive)
	  {
		switch(parseFloat(this.graphics))
		  {
			case 1:
			case 2:
			  var startx=Shapes.wholeworld[this.from].pos[0];
				var starty=Shapes.wholeworld[this.from].pos[1];
				var finishx=Shapes.wholeworld[this.to].pos[0];
				var finishy=Shapes.wholeworld[this.to].pos[1];
				SpiderGen.canvas.moveTo(startx , starty);
				SpiderGen.canvas.lineTo(finishx , finishy);
			break;
			}
		}	
  }
	
SpiderGen.loop=function()
  {
	Physics.replotentities();
	SpiderGen.canvas.clearRect(0,0,SpiderGen.width,SpiderGen.height)
	
	for(var i=0;i<SpiderGen.spiders.length;i++)
	  {
		switch(SpiderGen.spiders[i].doThis)
      {
      case 0://swing back and forth
  		switch(SpiderGen.spiders[i].stage)
    		{
    		case 0://initial dangling
      		if(Math.pow(SpiderGen.spiders[i].body.v[0],2) + Math.pow(SpiderGen.spiders[i].body.v[1],2) < 500)
      		  {
      			//speed less than 10
      			SpiderGen.spiders[i].timestill+=Physics.timeperloop;
      			}
      		else
      		  {
      			//not still, re-set stillcounter
      			SpiderGen.spiders[i].timestill=0;
      			}
      		if(SpiderGen.spiders[i].timestill>1)//3 seconds still
      		  {
      			SpiderGen.spiders[i].stage++;
  					switch(SpiderGen.spiders[i].doThis)
  					  {
  						case 0:
      					Physics.friction=1;
  							//connect anchor straigt to spider.
  							Physics.connect(SpiderGen.spiders[i].anchor.arraypos , SpiderGen.spiders[i].body.arraypos , 2000 , false , 0 , 0 , false);
  						break;
    					}
      			}
    		break;
  			case 1://swing left and right
  				if(!SpiderGen.spiders[i].inMiddle && SpiderGen.spiders[i].body.pos[0] > SpiderGen.spiders[i].startPos[0]-SpiderGen.spiders[i].size*2 && SpiderGen.spiders[i].body.pos[0] < SpiderGen.spiders[i].startPos[0]+SpiderGen.spiders[i].size*2)// && SpiderGen.spiders[i].body.pos[1] > SpiderGen.spiders[i].startPos[1]+SpiderGen.spiders[i].springLength*5)
  				  {
  					//spider doesn't think it's in the middle, but is.
  					//swing other way
  					SpiderGen.spiders[i].swinging*=-1;
  					//set to inmiddle
  					SpiderGen.spiders[i].inMiddle=true;
  					}
  				
  				if(SpiderGen.spiders[i].inMiddle && !(SpiderGen.spiders[i].body.pos[0] > SpiderGen.spiders[i].startPos[0]-SpiderGen.spiders[i].size*2 && SpiderGen.spiders[i].body.pos[0] < SpiderGen.spiders[i].startPos[0]+SpiderGen.spiders[i].size*2))
  				  {
  					//not in middle, but think we are.
  					SpiderGen.spiders[i].inMiddle=false;
  					}
  			
  			
  			  if(SpiderGen.spiders[i].inMiddle)
  				  {
  					//if inmiddle is false, but spider is positioned in the middle of its swing
  					//SpiderGen.spiders[i].inMiddle=true;
  					//give boost in direction of swigning
  					SpiderGen.spiders[i].body.v[0]+=2*SpiderGen.spiders[i].swinging;
  					//SpiderGen.spiders[i].body.v[1]+=-1;
  					//change direction of swinging.
  					//SpiderGen.spiders[i].swinging*=-1;
  					}
  			break;
    		}
			break;
			}
		}
	
	SpiderGen.canvas.beginPath();

	for (i4=0;i4<Physics.connections.length;i4++)
	  {
		Physics.connections[i4].draw(0);
		}
	SpiderGen.canvas.stroke();
	
	for(var i=0;i<Shapes.wholeworld.length;i++)
	  {
		switch(Shapes.wholeworld[i].gameType)
		  {
			case 0://spider dangling
			
				//angle between spider and last peice of string.
			  tempangle=Math.atan2(Shapes.wholeworld[i].pos[1]-Shapes.wholeworld[i-1].pos[1] , Shapes.wholeworld[i].pos[0] - Shapes.wholeworld[i-1].pos[0]) - Math.PI/2;
				
				//General.dalert(Math.round(General.todegrees(tempangle)));
								
				//fill background :
				SpiderGen.canvas.save();
  			SpiderGen.canvas.beginPath();
				SpiderGen.canvas.fillStyle="rgb(255,255,255)"//fill in white first to hide string
    		SpiderGen.canvas.moveTo(Shapes.wholeworld[i].pos[0]+ SpiderGen.spiders[Shapes.wholeworld[i].elastic].size , Shapes.wholeworld[i].pos[1])
    		SpiderGen.canvas.arc(Shapes.wholeworld[i].pos[0] , Shapes.wholeworld[i].pos[1] , SpiderGen.spiders[Shapes.wholeworld[i].elastic].size , 0 , Math.PI*2 , false);
    		SpiderGen.canvas.fill();
				SpiderGen.canvas.restore();
				
				SpiderGen.canvas.save();
				SpiderGen.canvas.lineWidth=2;
				SpiderGen.canvas.beginPath();
				//outline of face:
    		SpiderGen.canvas.moveTo(Shapes.wholeworld[i].pos[0]+ SpiderGen.spiders[Shapes.wholeworld[i].elastic].size , Shapes.wholeworld[i].pos[1])
    		SpiderGen.canvas.arc(Shapes.wholeworld[i].pos[0] , Shapes.wholeworld[i].pos[1] , SpiderGen.spiders[Shapes.wholeworld[i].elastic].size , 0 , Math.PI*2 , false);
				
				//legs:

				for (var i2=0;i2<4;i2++)
  				{
					SpiderGen.canvas.moveTo(Shapes.wholeworld[i].pos[0] + Math.cos(-Math.PI/4+Math.PI*i2/8 +tempangle)*Shapes.wholeworld[i].dimensions , Shapes.wholeworld[i].pos[1] + Math.sin(-Math.PI/4+Math.PI*i2/8 +tempangle)*Shapes.wholeworld[i].dimensions)
					
					endOfLegX=Shapes.wholeworld[i].pos[0] + Math.cos(-Math.PI/4+Math.PI*i2/8 +tempangle)*(Shapes.wholeworld[i].dimensions + Shapes.wholeworld[i].dimensions*SpiderGen.spiders[Shapes.wholeworld[i].elastic].LBratio)
					endOfLegY=Shapes.wholeworld[i].pos[1] + Math.sin(-Math.PI/4+Math.PI*i2/8 +tempangle)*(Shapes.wholeworld[i].dimensions + Shapes.wholeworld[i].dimensions*SpiderGen.spiders[Shapes.wholeworld[i].elastic].LBratio)
					
  				SpiderGen.canvas.lineTo(endOfLegX , endOfLegY)
  				endOfLegX+=Math.cos(Math.PI/3 +tempangle)*(Shapes.wholeworld[i].dimensions + Shapes.wholeworld[i].dimensions*SpiderGen.spiders[Shapes.wholeworld[i].elastic].LBratio)
  				endOfLegY+=Math.sin(Math.PI/3 +tempangle)*(Shapes.wholeworld[i].dimensions + Shapes.wholeworld[i].dimensions*SpiderGen.spiders[Shapes.wholeworld[i].elastic].LBratio)
  				SpiderGen.canvas.lineTo(endOfLegX , endOfLegY)
  				}
				
				for (var i2=0;i2<4;i2++)
  				{
					SpiderGen.canvas.moveTo(Shapes.wholeworld[i].pos[0] + Math.cos(Math.PI-Math.PI/8+Math.PI*i2/8 +tempangle)*Shapes.wholeworld[i].dimensions , Shapes.wholeworld[i].pos[1] + Math.sin(Math.PI-Math.PI/8+Math.PI*i2/8 +tempangle)*Shapes.wholeworld[i].dimensions)
					
					endOfLegX=Shapes.wholeworld[i].pos[0] + Math.cos(Math.PI-Math.PI/8+Math.PI*i2/8 +tempangle)*(Shapes.wholeworld[i].dimensions + Shapes.wholeworld[i].dimensions*SpiderGen.spiders[Shapes.wholeworld[i].elastic].LBratio)
					endOfLegY=Shapes.wholeworld[i].pos[1] + Math.sin(Math.PI-Math.PI/8+Math.PI*i2/8 +tempangle)*(Shapes.wholeworld[i].dimensions + Shapes.wholeworld[i].dimensions*SpiderGen.spiders[Shapes.wholeworld[i].elastic].LBratio)
					
  				SpiderGen.canvas.lineTo(endOfLegX , endOfLegY)
  				endOfLegX+=Math.cos(Math.PI*2/3 +tempangle)*(Shapes.wholeworld[i].dimensions + Shapes.wholeworld[i].dimensions*SpiderGen.spiders[Shapes.wholeworld[i].elastic].LBratio)
  				endOfLegY+=Math.sin(Math.PI*2/3 +tempangle)*(Shapes.wholeworld[i].dimensions + Shapes.wholeworld[i].dimensions*SpiderGen.spiders[Shapes.wholeworld[i].elastic].LBratio)
  				SpiderGen.canvas.lineTo(endOfLegX , endOfLegY)
  				}
				
    		SpiderGen.canvas.stroke();
				SpiderGen.canvas.restore();
				
				SpiderGen.canvas.beginPath();
				//eyes
				SpiderGen.canvas.moveTo(Shapes.wholeworld[i].pos[0]+Math.cos(-Math.PI/4 + tempangle)*Shapes.wholeworld[i].dimensions/2 + Shapes.wholeworld[i].dimensions/5 , Shapes.wholeworld[i].pos[1]+Math.sin(-Math.PI/4 + tempangle)*Shapes.wholeworld[i].dimensions/2)
				SpiderGen.canvas.arc( Shapes.wholeworld[i].pos[0]+Math.cos(-Math.PI/4 + tempangle)*Shapes.wholeworld[i].dimensions/2 , Shapes.wholeworld[i].pos[1]+Math.sin(-Math.PI/4 + tempangle)*Shapes.wholeworld[i].dimensions/2 , Shapes.wholeworld[i].dimensions/5 , 0 , Math.PI*2 , false)
				
				SpiderGen.canvas.moveTo(Shapes.wholeworld[i].pos[0]+Math.cos(-Math.PI*3/4 + tempangle)*Shapes.wholeworld[i].dimensions/2 + Shapes.wholeworld[i].dimensions/5 , Shapes.wholeworld[i].pos[1]+Math.sin(-Math.PI*3/4 + tempangle)*Shapes.wholeworld[i].dimensions/2)
				SpiderGen.canvas.arc( Shapes.wholeworld[i].pos[0]+Math.cos(-Math.PI*3/4 + tempangle)*Shapes.wholeworld[i].dimensions/2 , Shapes.wholeworld[i].pos[1]+Math.sin(-Math.PI*3/4 + tempangle)*Shapes.wholeworld[i].dimensions/2 , Shapes.wholeworld[i].dimensions/5 , 0 , Math.PI*2 , false)
				
				//pupils
				SpiderGen.canvas.moveTo(Shapes.wholeworld[i].pos[0]+Math.cos(-Math.PI*3/4 + tempangle)*Shapes.wholeworld[i].dimensions/2 + 0.5 , Shapes.wholeworld[i].pos[1]+Math.sin(-Math.PI*3/4 + tempangle)*Shapes.wholeworld[i].dimensions/2)
				SpiderGen.canvas.arc( Shapes.wholeworld[i].pos[0]+Math.cos(-Math.PI*3/4 + tempangle)*Shapes.wholeworld[i].dimensions/2 , Shapes.wholeworld[i].pos[1]+Math.sin(-Math.PI*3/4 + tempangle)*Shapes.wholeworld[i].dimensions/2 , 0.5 , 0 , Math.PI*2 , false)
				
				SpiderGen.canvas.moveTo(Shapes.wholeworld[i].pos[0]+Math.cos(-Math.PI/4 + tempangle)*Shapes.wholeworld[i].dimensions/2 + 0.5 , Shapes.wholeworld[i].pos[1]+Math.sin(-Math.PI/4 + tempangle)*Shapes.wholeworld[i].dimensions/2)
				SpiderGen.canvas.arc( Shapes.wholeworld[i].pos[0]+Math.cos(-Math.PI/4 + tempangle)*Shapes.wholeworld[i].dimensions/2 , Shapes.wholeworld[i].pos[1]+Math.sin(-Math.PI/4 + tempangle)*Shapes.wholeworld[i].dimensions/2 , 0.5 , 0 , Math.PI*2 , false)
				
				//smile
				SpiderGen.canvas.moveTo(Shapes.wholeworld[i].pos[0] + Math.cos(Math.PI/8 + tempangle)*Shapes.wholeworld[i].dimensions/2 , Shapes.wholeworld[i].pos[1] + Math.sin(Math.PI/8 + tempangle)*Shapes.wholeworld[i].dimensions/2 )
				SpiderGen.canvas.arc( Shapes.wholeworld[i].pos[0] , Shapes.wholeworld[i].pos[1] , Shapes.wholeworld[i].dimensions/2 , Math.PI/8 + tempangle , Math.PI*7/8 + tempangle , false )
				
				
				SpiderGen.canvas.stroke();
				
			break;
			case 1://spider facing left/right
			
			break;
			}
		}
	}
	
	
SpiderGen.spiders=new Array();
	
	/*
	gametypes: 0=spider danglying, 1=spider swinging left/right, 2= part of string
	
	DoThiss: 0=drop down then swing left and right.
	*/
	
SpiderGen.spider=function(size,LBratio,doThis,startPos)
  {
	//[x,y] of start position
	this.startPos=startPos
	//radius of body
	this.size=size;
	//leg body ratio
	this.LBratio=LBratio;
	//animation to run.  0=drop down and swing back and forth.
	this.doThis=doThis;
	
	switch(doThis)
	  {
		case 0:
		  //draw styles: 0=facing out of screen while dangling, 1=facing left or right (depends on velocity) while swining
		  this.inMiddle=false;
		  this.swinging=( Math.round(Math.random())==0) ? -1 : 1;//-1=left, +1=right
		break;
		}
		
	
	this.springLength=30;
	
	//what it's currently doing. 0=intial dangling.
	this.stage=0
	
	//time spent still (used to work out when dangling has stopped)
	this.timestill=0;
	
	//anchor, gametype 2
	this.anchor=new Shapes.circle(true,false,[startPos[0],startPos[1]-SpiderGen.width*0.1],0,size,1,0,[0,0,0],[0,0,0],false,true,false,2,1);
	
	this.stringPoints=new Array();
	//create string
	for(var i=0;i<5;i++)
	  {
		this.stringPoints.push(new Shapes.circle(true,true,[startPos[0]+General.randommass(0,10) , startPos[1]-SpiderGen.width*0.1+i*(0.1/5)*SpiderGen.width ],0,this.size,1,0,[0,0,0],[0,0,0],false,true,false,2,1))
		Physics.connect(this.stringPoints[this.stringPoints.length-1].arraypos , this.stringPoints[this.stringPoints.length-1].arraypos-1 , 1000 , this.springLength , 1 , 0 , false);
		}
	
	//(alive,canMove,pos,angle,r,mass,colour,v,f,hard,filled,visible,gameType,elastic)
	//gametype 0=spider body circle  elastic is used as spider number
	this.body=new Shapes.circle(true,true,startPos,0,size,50,0,[General.randommass(0,10),General.randommass(0,10),0],[0,0,0],false,true,true,0,SpiderGen.spiders.length);
	
	
	
	//connect with spring.
	//(one,two,strength,howfar,graphics,type,hard)
	Physics.connect(this.body.arraypos , this.body.arraypos-1 , 1000 , this.springLength , 1 , 0 , false);
	
	SpiderGen.spiders.push(this);
	}

SpiderGen.addLoadEvent=function(func) {
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

SpiderGen.addLoadEvent(SpiderGen.load);