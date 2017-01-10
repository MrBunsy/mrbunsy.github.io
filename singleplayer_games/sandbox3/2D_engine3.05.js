var Render=new Object();
var Shapes=new Object();
var Physics=new Object();
var General=new Object();
var Response=new Object();
var Detect=new Object();

Physics.connections=new Array();
Physics.chargedobjects=new Array();
Shapes.wholeworld=new Array();
Render.viewports=new Array();
Render.fills=new Array();
Render.strokes=new Array();

Detect.polyline=false;
Detect.polyline2=false;
Detect.polycorner=false;
Detect.polynumber=0;//which polygon? the first or second.

Render.viewport=function(rendermode,htmlname,x,y,width,height,zoom,sync,bg,enabled)
  {
	//either main span, or canvas
	this.htmlname=htmlname;
	//co-ords of top left
	this.x=x;this.y=y;
	//size of viewport
	this.width=width;this.height=height;
	//zoom: 'virtual' pixels (measuring unit) *zoom = screen pixels
	this.zoom=zoom;
	//sync - how often to update (in terms of physics advances eg 2 means only updated every other physics update)
	this.sync=sync;
	//background colour, false=clear
	this.bg=bg;
	//running or not
	this.enabled=enabled;
	
	
	this.canvassetup=false;
	this.divssetup=false;
	
	if (document.getElementById(htmlname+'canvas').getContext)
	  {
		this.canvas = document.getElementById(htmlname+'canvas').getContext('2d');
		this.canvassetup=true;
		}
	
  //add to array of viewports
	Render.viewports.push(this);
	}

Shapes.polygon=function(alive,canMove,pos,angle,Xs,Ys,mass,colour,v,f,hard,filled,visible,gameType,elastic)
  {
	//shapes, 1= rectangle, 0=circle, 2=square/rectangle, but collide as circle, 3 = polygon
	this.shape=3
	//general stuff
	this.mass=mass;
	//number for colour
	this.colour=colour;
	//pos = [x,y] - origin of shape, also take as centre of mass.  Xs and Ys are arrays, so (Xs[0],Ys[0])...(Xs[n],Ys[n]) form all the vertices of the shape
	this.pos=pos;
	//fill the image, and count anything inside as colliding.  if false, object is lines only.
	this.filled=filled;
	
	//moments of inertia - placeholder for proper system
	this.MI=mass*( 200*200 + 100*100)/12;
	
	var largestR=0;
	this.Rs=new Array();
	this.As=new Array();
	//create arrays for distances and angles of vertices from origin
	for(var k=0;k<Xs.length;k++)
	  {
		this.Rs[k]=Math.sqrt(Xs[k]*Xs[k]+Ys[k]*Ys[k])
		this.As[k]=Math.atan2(Ys[k],Xs[k])
		if(this.Rs[k]>largestR){largestR=this.Rs[k];}
		}
	
	//rotation, in radians clockwise from positive x axis (since world is upside down to conventional axis)
	this.angle=angle;
	
	//array all shapes have, should be enough information for collision detection.
	this.dimensions=[this.Rs,this.As,largestR,Xs,Ys]
	
  //true for movable, false for static
	this.canMove=canMove;
	//v=veloctity,f=force.  both arrays, [x,y,angular]
	this.v=v;
	this.f=f;
	//is object in the world?
	this.alive=alive
	//can it collide? boolean.
	this.hard=hard;
	//game types.  0=border, anything else for anything else
	this.gameType=gameType
	//does this object have a charge?
	this.charged=false
	//how elastic the collisions are (0->1)
	this.elastic=elastic;
	//is the object drawn?
	this.visible=visible;
	
	//enter our object into the world array
	this.arraypos=Shapes.wholeworld.length
	Shapes.wholeworld.push(this)
	
	//position in connections array of the object with the info for the connection
	this.connected=new Array();

	//functions
	this.kill=Physics.kill;
	this.unKill=Physics.unKill;
	this.draw=Render.drawPoly;
	this.makeCharged=Physics.makeCharged;
	this.cutFree=Physics.cutFree;
	}

Shapes.circle=function(alive,canMove,pos,angle,r,mass,colour,v,f,hard,filled,visible,gameType,elastic)
  {
	this.shape=0;
	this.MI=mass*Math.pow(r,2)/2
	this.alive=alive;
	this.canMove=canMove;
	this.pos=pos;
	this.angle=angle;
	//dimensions is just radius.
	this.dimensions=r;
	this.mass=mass;
	this.colour=colour;
	this.v=v;
	this.f=f;
	this.hard=hard;
	//false for hollow
	this.filled=filled;
	//not sure if an invisible circle will ever be needed, mind.
	this.visible=visible;
	this.gameType=gameType;
	
	this.elastic=elastic;
	
	//enter our object into the world array
	this.arraypos=Shapes.wholeworld.length
	Shapes.wholeworld.push(this)
	
	//position in connections array of the object with the info for the connection
	this.connected=new Array();

	//functions
	this.kill=Physics.kill;
	this.unKill=Physics.unKill;
	this.draw=Render.drawCircle;
	this.makeCharged=Physics.makeCharged;
	this.cutFree=Physics.cutFree;
	
	}

//rectangle which can't rotate.
Shapes.oldRectangle=function(alive,canMove,pos,width,height,mass,colour,v,f,hard,filled,visible,gameType,elastic)
  {
	this.shape=1;
	this.MI=mass*(height*height+width*width)/12
	this.alive=alive;
	this.canMove=canMove;
	this.pos=pos;
	this.angle=0;
	//dimensions
	this.dimensions=[width,height];
	this.mass=mass;
	this.colour=colour;
	this.v=v;
	this.f=f;
	this.hard=hard;
	//false for hollow
	this.filled=filled;
	//not sure if an invisible circle will ever be needed, mind.
	this.visible=visible;
	this.gameType=gameType;
	
	this.elastic=elastic;
	
	//enter our object into the world array
	this.arraypos=Shapes.wholeworld.length
	Shapes.wholeworld.push(this)
	
	//position in connections array of the object with the info for the connection
	this.connected=new Array();

	//functions
	this.kill=Physics.kill;
	this.unKill=Physics.unKill;
	this.draw=Render.drawRectangle;
	this.makeCharged=Physics.makeCharged;
	this.cutFree=Physics.cutFree;
	
	}

//connects two objects with a spring
Physics.connect=function(one,two,strength,howfar,graphics,type,hard)
  {
	if(howfar===false)
	  {
		//don't pre-set it, but set it as the current distance
		var x1=wholeworld[one].x;
		var y1=wholeworld[one].y;
		var x2=wholeworld[two].x;
		var y2=wholeworld[two].y;
		howfar=Math.round(Math.sqrt( Math.pow(x1-x2,2)+Math.pow(y1-y2,2)));
		}
  new Physics.connection(one,two,strength,howfar,graphics,type,hard)
	Shapes.wholeworld[one].connected.push(Physics.connections.length-1)
	Shapes.wholeworld[two].connected.push(Physics.connections.length-1)
	}

//object definition for all the springs in the world, used for forces and drawing springs
Physics.connection=function(from,to,connectionstrength,connectionlength,graphics,type,hard)
  {
	if(to>from)
	  {
		this.from=from;this.to=to;
		}
	else
	  {
		this.to=from;this.from=to;
		}
  this.connectionstrength=connectionstrength
	this.connectionlength=connectionlength
	
	if(type==1)//rod
	  {
		//square them
		this.strengthsqrd=Math.pow(connectionstrength,2);
		this.lengthsqrd=Math.pow(connectionlength,2);
		}

  //type of connection, 0=spring; 1=rod
	this.type=type
	
	//collision detection; true or false
	this.hard=hard;
	
	//0=no line, 1=thin black line, 2= thick black line
	this.graphics=graphics;
	
	//in world or not?
	this.alive=true;

	this.arraypos=Physics.connections.length;
	Physics.connections.push(this)

	this.draw=Render.drawConnection;
	this.breakConnection=Physics.breakConnection
}

Physics.breakConnection=function()
  {
	//go and splice all the arrays stored in each object attacted to the spring, and then delete the spring object and splice that from the connections array
	//springlines.splice(this.arraypos, 1)
	Physics.connections[this.arraypos].state=0;
	
	for(var k=0;k<wholeworld[this.from].connected.length;k++)
    {
		if(wholeworld[this.from].connected[k]==this.arraypos)
		  {
			wholeworld[this.from].connected.splice(k,1);
			}
		}

	for(var k=0;k<wholeworld[this.to].connected.length;k++)
	  {
		if(wholeworld[this.to].connected[k]==this.arraypos)
		  {
			wholeworld[this.to].connected.splice(k,1);
			}
		}

  }

//breaks all the springs connected to an entity
Physics.cutFree=function()
  {
	while(this.connected.length>0)
	  {
		Physics.connections[this.connected[0]].breakConnection();
		}
	}


//draws a dotted line for each spring
Render.updateLine=function(vp)
  {
	if(this.alive)
	  {
		switch(parseFloat(this.graphics))
		  {
			case 1:
			case 2:
			  var startx=wholeworld[this.from].x;
				var starty=wholeworld[this.from].y;
				var finishx=wholeworld[this.to].x;
				var finishy=wholeworld[this.to].y;

				viewports[vp].canvas.moveTo((startx-viewports[vp].x)*viewports[vp].zoom,(starty-viewports[vp].y)*viewports[vp].zoom);
				viewports[vp].canvas.lineTo((finishx-viewports[vp].x)*viewports[vp].zoom,(finishy-viewports[vp].y)*viewports[vp].zoom);
			break;
			}
		}	
  }



Physics.makeCharged=function(chargeme)//if not 0 then gives an object a charge, if 0 then removes charge
  {
	if(chargeme==0)
	  {
		this.charged=false;this.charge=0;Physics.chargedobjects.splice(this.chargearraypos, 1);
		}
	else
	  {
		if(this.charged)//already got a charge, so wipe it first
		  {
			this.charged=false;this.charge=0;Physics.chargedobjects.splice(this.chargearraypos, 1);
			}

		this.charge=chargeme;
		this.charged=true;
		this.chargearraypos=Physics.chargedobjects.length
		Physics.chargedobjects.push(this);
		}
  }

General.inarray=function(needle,haystack)
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


Physics.stringbetween=function(one,two,density,dotsize,stringstrength,hard)
  {
	//density is distance between each particle
	var startx=wholeworld[one].x;
	var starty=wholeworld[one].y;
	var dx=wholeworld[two].x-wholeworld[one].x;
	var dy=wholeworld[two].y-wholeworld[one].y;
	var linelength=Math.sqrt(dx*dx+dy*dy);
	var dots=Math.ceil(linelength/density) 
	dx/=dots
	dy/=dots
	//function(alive,canMove,pos,angle,r,mass,colour,v,f,hard,filled,visible,gameType,elastic)
	new circle(true,true,[(startx+1*dx),(starty+1*dy)],0,dotsize*1,5,8,[0,0,0],[0,0,0],true,true,true,0,1);
	//connect(one,two,strength,howfar,graphics,type,hard)
	Physics.connect(one,wholeworld.length-1,stringstrength,density,1,0,hard)

	for(var d=2;d<dots;d++)
	  {
		new circle(true,true,[(startx+d*dx),(starty+d*dy)],0,dotsize*1,5,8,[0,0,0],[0,0,0],true,true,true,0,1);
		Physics.connect(wholeworld.length-2,wholeworld.length-1,stringstrength,density,1,0,hard);
		}
  connect(wholeworld.length-1,two,stringstrength,density,1,0,hard);
	}

//this adds an element to an array and returns true if it is already not in it. Otherwise if it's already in the array it returns false.
General.addtoifnotin=function(thisarray,thisthing)
  {
	var testin=0;
	for(var z=0;z<thisarray.length;z++)
	  {
		if(thisarray[z]==thisthing)
		  {
			testin++;
			}
		}
	if(testin==0)
	  {
		thisarray.push(thisthing);
		return true;
		}
	else
	  {
		return false;
		}
	}

General.randommass=function(aprox,leeway)
  {
	var themass=aprox+(Math.random()-1)*2*leeway;
	return Math.round(themass);
	}

Render.getColour=function(colour)
{
  switch(colour)
	{
	case 0:return 'rgb(255,0,0)';break;//red
	case 1:return 'rgb(255,165,0)';break;//orange
	case 2:return 'rgb(255,255,0)';break;//yellow
	case 3:return 'rgb(0,255,0)';break;//lime green
	case 4:return 'rgb(0,128,0)';break;//green
	case 5:return 'rgb(0,0,255)';break;//blue
	case 6:return 'rgb(128,0,128)';break;//purple
	case 7:return 'rgb(255,192,203)';break;//pink
	case 8:return 'rgb(0,0,0)';break;//black
	case 9:return 'rgb(128,128,128)';break;//grey
	}
}



Render.drawcounter=0;

Render.redrawworld=function()
  {
	for(var r=0;r<Render.viewports.length;r++)
	  {
		if(Render.drawcounter%Render.viewports[r].sync==0 && Render.viewports[r].enabled)
		  {
			if(Render.viewports[r].bg===false)
			  {
				//blank bg
				Render.viewports[r].canvas.clearRect(0,0,Render.viewports[r].width,Render.viewports[r].height); // clear canvas
				}
			else
			  {
				//coloured bg
				Render.viewports[r].canvas.fillStyle = Render.viewports[r].bg;
				Render.viewports[r].canvas.fillRect(0,0,Render.viewports[r].width,Render.viewports[r].height);
				}
			
			Render.fills=new Array(10)
			Render.strokes=new Array(10);
			
			for(var r2=0;r2<Render.fills.length;r2++)
			  {
				Render.fills[r2]=new Array();
				Render.strokes[r2]=new Array();
				}

			Render.viewports[r].canvas.beginPath();
			for (i4=0;i4<Shapes.wholeworld.length;i4++)
			  {
				if(Shapes.wholeworld[i4].visible && Shapes.wholeworld[i4].alive)
				  {
					Shapes.wholeworld[i4].draw(r);
					}
				}
				
			for(var r2=0;r2<Render.fills.length;r2++)
			  {
				Render.viewports[r].canvas.beginPath()
				Render.viewports[r].canvas.fillStyle=Render.getColour(r2);
				
				for(var r3=0;r3<Render.fills[r2].length;r3++)
				  {
					Render.fills[r2][r3]();
					}
				Render.viewports[r].canvas.fill();
				}
			
			for(var r2=0;r2<Render.strokes.length;r2++)
			  {
				Render.viewports[r].canvas.beginPath()
				Render.viewports[r].canvas.strokeStyle=Render.getColour(r2);
				
				for(var r3=0;r3<Render.strokes[r2].length;r3++)
				  {
					Render.strokes[r2][r3]();
					}
				Render.viewports[r].canvas.stroke();
				}	

			//Render.viewports[r].canvas.fill();
			Render.viewports[r].canvas.beginPath();
			Render.viewports[r].canvas.strokeStyle='black';
			Render.viewports[r].canvas.lineWidth=Render.viewports[r].zoom;

			for (i4=0;i4<Physics.connections.length;i4++)
			  {
				Physics.connections[i4].updateline(r);
				}
			Render.viewports[r].canvas.stroke();
			}
		}
		Render.drawcounter++;
	}

//makes an object disapear
Physics.kill=function()
  {
	this.alive=false;
	this.cutFree();
	this.makeCharged(0);
	Render.redrawworld();
	}

//brings entity back
Physics.unkill=function()
  {
	if (checkforanycollide(this)!==false)
    {
		this.state=true;
		}
	}

Render.drawCircle=function(vp)
  {
	var tempp=this.pos;
	var tempd=this.dimensions
	var tempfunc=function()
		{
		
		Render.viewports[vp].canvas.moveTo((tempp[0]-Render.viewports[vp].x+tempd)*Render.viewports[vp].zoom, (tempp[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		Render.viewports[vp].canvas.arc((tempp[0]-Render.viewports[vp].x)*Render.viewports[vp].zoom,(tempp[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom,tempd*Render.viewports[vp].zoom,0,Math.PI*2,true);  // draw circle
		}
	
	if(this.filled)
	  {
		Render.fills[this.colour].push(tempfunc);
		}
	else
	  {
		Render.strokes[this.colour].push(tempfunc);
		}
	}
	
Render.drawRectangle=function(vp)
  {
	var temppos=this.pos;
	var tempdimensions=this.dimensions;
	
	var tempfunc=function()
		{
		//top left
		Render.viewports[vp].canvas.moveTo((temppos[0]-tempdimensions[0]/2-Render.viewports[vp].x)*Render.viewports[vp].zoom, (temppos[1]-tempdimensions[1]/2-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		//top right
		Render.viewports[vp].canvas.lineTo((temppos[0]+tempdimensions[0]/2-Render.viewports[vp].x)*Render.viewports[vp].zoom, (temppos[1]-tempdimensions[1]/2-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		//bottom right
		Render.viewports[vp].canvas.lineTo((temppos[0]+tempdimensions[0]/2-Render.viewports[vp].x)*Render.viewports[vp].zoom, (temppos[1]+tempdimensions[1]/2-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		//bottom left
		Render.viewports[vp].canvas.lineTo((temppos[0]-tempdimensions[0]/2-Render.viewports[vp].x)*Render.viewports[vp].zoom, (temppos[1]+tempdimensions[1]/2-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		//top left
		Render.viewports[vp].canvas.lineTo((temppos[0]-tempdimensions[0]/2-Render.viewports[vp].x)*Render.viewports[vp].zoom, (temppos[1]-tempdimensions[1]/2-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		}
	
	if(this.filled)
	  {
		Render.fills[this.colour].push(tempfunc);
		}
	else
	  {
		Render.strokes[this.colour].push(tempfunc);
		}
	}

Render.drawPoly=function(vp)
  {
	var temppos=this.pos;
	var tempRs=this.Rs;
	var tempangle=this.angle
	var tempAs=this.As;
	var tempfunc=function()
	  {
		Render.viewports[vp].canvas.moveTo((temppos[0]+tempRs[0]*Math.cos(tempangle+tempAs[0])-Render.viewports[vp].x)*Render.viewports[vp].zoom,(temppos[1]+tempRs[0]*Math.sin(tempangle+tempAs[0])-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		
		for(var z=1;z<=tempRs.length;z++)
		  {
			if(z==tempRs.length)
			  {
				var z1=0;
				}
			else
			  {
				var z1=z;
				}
		Render.viewports[vp].canvas.lineTo((temppos[0]+tempRs[z1]*Math.cos(tempangle+tempAs[z1])-Render.viewports[vp].x)*Render.viewports[vp].zoom,(temppos[1]+tempRs[z1]*Math.sin(tempangle+tempAs[z1])-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		  }
		}
	
  if(this.filled)
	  {
		Render.fills[this.colour].push(tempfunc);
		}
	else
	  {
		Render.strokes[this.colour].push(tempfunc);
		}

	}

//don't know if this is still used: (21-08-08)
Physics.findacceleration=function(tempforce,tempmass,tempvelocity,tempfriction)
  {
	var tempa = (tempforce)/tempmass
	//attempt at moddeling friction
	if(tempvelocity>1){tempa-=tempfriction}
	if(tempvelocity<(-1)){tempa+=tempfriction}
	return tempa
	}



//the 'collide as' or 'with' functions collide the two objects given to them, 'us' and 'them', and sets the global variables newvy, newvx, theirnewvy and theirnewvx

Response.collidewithpoly=function(us,them)//isn't 'us' only ever going to be something which can move?  need to check this.
  {
	//static poly + moving non-poly
	if(Shapes.wholeworld[us].canMove && Shapes.wholeworld[us].shape!==3 && !Shapes.wholeworld[them].canMove && Shapes.wholeworld[them].shape==3)
	  {
		Response.staticPolyAndNonPoly(Shapes.wholeworld[us],Shapes.wholeworld[them]);
		}
	else if(Shapes.wholeworld[them].canMove && Shapes.wholeworld[them].shape!==3 && !Shapes.wholeworld[us].canMove && Shapes.wholeworld[us].shape==3)
	  {
		Response.staticPolyAndNonPoly(Shapes.wholeworld[them],Shapes.wholeworld[us]);
		}
	else if(Shapes.wholeworld[us].canMove && Shapes.wholeworld[us].shape==3 && !Shapes.wholeworld[them].canMove)
	  {//moving polygon + static something else.

		switch(Shapes.wholeworld[them].shape)//set PCnormalx, PCnormaly, PCpointx, PCpointy
		  {
			case 0://circle
			  Response.NormAndPointPolyAndCircle(Shapes.wholeworld[us],Shapes.wholeworld[them])
			break;
			case 1://square
			  Response.NormAndPointPolyAndSquare(Shapes.wholeworld[us],Shapes.wholeworld[them],us,Response.newx,Response.newy,Shapes.wholeworld[them].pos[0],Shapes.wholeworld[them].pos[1],Response.newangle)
			break;
			case 1://polygon
			  Response.NormAndPointPolyAndPoly(Shapes.wholeworld[us],Shapes.wholeworld[them],us,Response.newx,Response.newy,Shapes.wholeworld[them].pos[0],Shapes.wholeworld[them].pos[1],Response.newangle)
			break;
			}

			//Vap1 = Va1 + Wa1 x Rap
			//W x R = (-WRx, WRy, 0) - cross product. 
			//vector from centre of mass to collision point
			PCRap=[Response.PCpoint[0]-Shapes.wholeworld[us].pos[0],Response.PCpoint[1]-Shapes.wholeworld[us].pos[1]];
			PCRbp=[Response.PCpoint[0]-Shapes.wholeworld[them].pos[0],Response.PCpoint[1]-Shapes.wholeworld[them].pos[1]];
			
			//velocity of collision point on each object 
			PCVa1=[Shapes.wholeworld[us].v[0] - Shapes.wholeworld[us].v[2]*PCRap[1] , Shapes.wholeworld[us].v[1] + Shapes.wholeworld[us].v[2]*PCRap[0]];
			PCVb1=[0,0];

			//relative velocity of these points.
			PCVab=[ PCVa1[0]-PCVb1[0] , PCVa1[1]-PCVb1[1] ];

			PCaI=Shapes.wholeworld[us].mass*( 100*100 + 100*100)/12;

			// ( Rap x n)^2
			var rapnsqrd=Math.pow(  PCRap[0]*Response.PCnormal[1] - Response.PCnormal[0]*PCRap[1] ,2);

			PCi= ( (-1)*(1+Shapes.wholeworld[us].elastic)*(PCVa1[0]*Response.PCnormal[0]+PCVa1[1]*Response.PCnormal[1]) )/( (1/Shapes.wholeworld[us].mass)  + rapnsqrd/PCaI);

			Response.newvx= Shapes.wholeworld[us].v[0] + PCi*Response.PCnormal[0]/Shapes.wholeworld[us].mass
			Response.newvy= Shapes.wholeworld[us].v[1] + PCi*Response.PCnormal[1]/Shapes.wholeworld[us].mass
			Response.newvw = Shapes.wholeworld[us].v[2] + PCi*(PCRap[0]*Response.PCnormal[1] - PCRap[1]*Response.PCnormal[0])/PCaI
			
	  }//end of moving poly + static otherwise
	else if(Shapes.wholeworld[us].canMove && Shapes.wholeworld[them].canMove)
	  {//moving poly has hit moving circle

		switch(Shapes.wholeworld[us].shape)
		  {
			case 3:// 'us' is the polygon.
			  switch(Shapes.wholeworld[them].shape)
				  {
					case 0://poly + circle
					  Response.NormAndPointPolyAndCircle(Shapes.wholeworld[us],Shapes.wholeworld[them]);
					break;
					case 3://poly + poly
					  Response.NormAndPointPolyAndPoly(Shapes.wholeworld[us],Shapes.wholeworld[them]);
					break;
					}

			break;
			case 0://us is the circle, and them is the polygon
			  Response.NormAndPointPolyAndCircle(Shapes.wholeworld[them],Shapes.wholeworld[us])
			break;
			}
			
		//vector from centre of mass to collision point
		PCRap=[Response.PCpoint[0]-Shapes.wholeworld[us].pos[0],Response.PCpoint[1]-Shapes.wholeworld[us].pos[1]];
		PCRbp=[Response.PCpoint[0]-Shapes.wholeworld[them].pos[0],Response.PCpoint[1]-Shapes.wholeworld[them].pos[1]];

		//velocity of collision point on each object 
		PCVa1=[Shapes.wholeworld[us].v[0] - Shapes.wholeworld[us].v[2]*PCRap[1] , Shapes.wholeworld[us].v[1] + Shapes.wholeworld[us].v[2]*PCRap[0]];
		PCVb1=[Shapes.wholeworld[them].v[0] - Shapes.wholeworld[them].v[2]*PCRbp[1] , Shapes.wholeworld[them].v[1] + Shapes.wholeworld[them].v[2]*PCRbp[0]];

		if(Shapes.wholeworld[them].type==1)
		  {
			PCVb1=[0,0];
			}

		//relative velocity of these points.
		PCVab=[ PCVa1[0]-PCVb1[0] , PCVa1[1]-PCVb1[1] ];

		PCaI=Shapes.wholeworld[us].MI;
		PCbI=Shapes.wholeworld[them].MI;

		// ( Rap x n)^2
		var rapnsqrd=Math.pow(  PCRap[0]*Response.PCnormal[1] - Response.PCnormal[0]*PCRap[1] ,2);
		var rbpnsqrd=Math.pow(  PCRbp[0]*Response.PCnormal[1] - Response.PCnormal[0]*PCRbp[1] ,2);

		PCi= ( (-1)*(1+(Shapes.wholeworld[us].elastic+Shapes.wholeworld[them].elastic)/2)*(PCVab[0]*Response.PCnormal[0]+PCVab[1]*Response.PCnormal[1]) )/( (1/Shapes.wholeworld[us].mass) + (1/Shapes.wholeworld[them].mass) + rapnsqrd/PCaI + rbpnsqrd/PCbI);

		Response.newvx= Shapes.wholeworld[us].v[0] + PCi*Response.PCnormal[0]/Shapes.wholeworld[us].mass
		Response.newvy= Shapes.wholeworld[us].v[1] + PCi*Response.PCnormal[1]/Shapes.wholeworld[us].mass
		Response.newvw = Shapes.wholeworld[us].v[2] + PCi*(PCRap[0]*Response.PCnormal[1] - PCRap[1]*Response.PCnormal[0])/PCaI
		
		Response.theirnewvx= Shapes.wholeworld[them].v[0] - PCi*Response.PCnormal[0]/Shapes.wholeworld[them].mass
		Response.theirnewvy= Shapes.wholeworld[them].v[1] - PCi*Response.PCnormal[1]/Shapes.wholeworld[them].mass
		Response.theirnewvw = Shapes.wholeworld[them].v[2] - PCi*(PCRap[0]*Response.PCnormal[1] - PCRap[1]*Response.PCnormal[0])/PCbI

		if(General.debug)
		  {
			Sandbox.togglepause();
			
			var startx=PCpoint[0];
			var starty=PCpoint[1];

			var angle=Math.atan2(PCnormal[1],PCnormal[0]);

			var finishx=startx+Math.cos(angle)*100
			var finishy=starty+Math.sin(angle)*100

			Render.viewports[0].canvas.beginPath()
			Render.viewports[0].canvas.moveTo((startx-Render.viewports[0].x)*Render.viewports[0].zoom,(starty-Render.viewports[0].y)*Render.viewports[0].zoom);
			Render.viewports[0].canvas.lineTo((finishx-Render.viewports[0].x)*Render.viewports[0].zoom,(finishy-Render.viewports[0].y)*Render.viewports[0].zoom);
			Render.viewports[0].canvas.stroke()
			}
		}//end of moving poly + moving something  else
	}

//alert something when debugging, but to avoid infinite loop alerts, do it in a confirm, where pressing cancel will take the engine out of debug mode.
General.dalert=function(saythis)
  {
	if(General.debug)
	  {
		General.debug=confirm(saythis);
		}
	}
/*
//PC = poly collide
var PCpointx;
var PCpointy;
var PCpoint;
//unit vector
var PCnormalx;
var PCnormaly;
var PCnormal;
var PCnormalsize;
//distance vector of point from both bodies
var PCrap;
var PCrbp;
//pre-collision angular velocities
var PCwa1;
var PCwb1;
//post-collision angular velocities
var PCwa2;
var PCwb2;
//velocity of collision point on both bodies
var PCVa1;
var PCVb1;
//relative velocity of these two points
var PCVab;
//impulse
var PCi;
//moments of Interia
var PCaI;
var PCbI;
*/

//the functions below find the collision normal - the vector perpendicular to the 'face' of impact and the point of impact.
Response.NormAndPointPolyAndSquare=function(poly,square,us,polycentreX,polycentreY,squareX,squareY,newangle)
  {
	General.dalert('poly and square')
	for(var k=0;k<poly.Rs.length;k++)
	  {//treating corners of polygon as small circles to see if the polygon has entered the square
		polyx=polycentreX+poly.Rs[k]*Math.cos(poly.As[k]+newangle);
		polyy=polycentreY+poly.Rs[k]*Math.sin(poly.As[k]+newangle);

		if(squareX+square.dimensions[0]/2 >= polyx && squareX-square.dimensions[0]/2 <= polyx && squareY-square.dimensions[1]/2 <= polyy && squareY+square.dimensions[1]/2 >= polyy)
		  {//corner of poly lies INSIDE square
			//treat this corner as the point of collision
			Response.PCpointx=polyx;
			Response.PCpointy=polyy;

			//point before collision:
			var oldpointX=poly.pos[0]+poly.Rs[k]*Math.cos(poly.As[k]);
			var oldpointY=poly.pos[1]+poly.Rs[k]*Math.sin(poly.As[k]);
			var oldsquareX=square.pos[0];
			var oldsquareY=square.pos[1];

			//using positions of square and poly before they had moved, find which edge of square poly has hit.
			if(oldpointX >= oldsquareX+square.dimensions[0]/2 && oldpointY <= oldsquareY+square.dimensions[1]/2 && oldpointY >= oldsquareY-square.dimensions[1]/2)
			  {//point is on the RIGHT of the square
				Response.PCnormalx=1;
				Response.PCnormaly=0;
				//this bit below makes sure the point is always on the static square - I found out this stopped energy gains with circles, so am repeating it here.
				Response.PCpointx=oldsquareX+square.dimensions[0]/2;
				}
			else if(oldpointX <= oldsquareX-square.dimensions[0]/2 && oldpointY <= oldsquareY+square.dimensions[1]/2 && oldpointY >= oldsquareY-square.dimensions[1]/2)
			  {//LEFT hand side
				Response.PCnormalx=-1;
				Response.PCnormaly=0;
				Response.PCpointx=oldsquareX-square.dimensions[0]/2;
				}
			else if(oldpointY <= oldsquareY+square.dimensions[1]/2 && oldpointX >= oldsquareX-square.dimensions[0]/2 && oldpointX <= oldsquareX+square.dimensions[0]/2)
			  {//ABOVE
				Response.PCnormalx=0;
				Response.PCnormaly=-1;
				Response.PCpointy=oldsquareY+square.dimensions[1]/2;
				}
			else// if(oldpointY >= oldsquareY+square.dimensions[1]/2 && oldpointX >= oldsquareX-square.dimensions[0]/2 && oldpointX <= oldsquareX+square.dimensions[0]/2)
			  {//BELOW
				Response.PCnormalx=0;
				Response.PCnormaly=1;
				Response.PCpointy=oldsquareY-square.dimensions[1]/2;
				}
		  //end of poly inside square
			}
	  //end of polycorners loop.
		}

	Response.PCnormalsize=Math.sqrt(Response.PCnormalx*Response.PCnormalx+Response.PCnormaly*Response.PCnormaly)
	Response.PCpoint=[Response.PCpointx , Response.PCpointy];
	General.dalert('pointx'+Response.PCpointx)
	Response.PCnormal=[Response.PCnormalx/Response.PCnormalsize , Response.PCnormaly/Response.PCnormalsize];

	//end of normal and point for poly and square
	}

Response.NormAndPointPolyAndPoly=function(poly1,poly2)
  {
	PCpoint=Detect.CLr;
	if(Detect.polycorner)
	  {
		switch(Detect.polynumber)
		  {
			case 1:
			  var tempangle=Response.getangleofpolyline(poly2,Detect.polyline)+Math.PI/2;
			break;
			case 2:
			  var tempangle=Response.getangleofpolyline(poly1,Detect.polyline)+Math.PI/2;
			break;
			}
		}
	else
	  {
		var tempangle=Response.getangleofpolyline(poly2,polyline2)+Math.PI/2;
		}
	Response.PCnormal=[Math.cos(tempangle),Math.sin(tempangle)];
	}

Response.NormAndPointPolyAndCircle=function(poly,circle)
  {
	
	//PCpoint=CLr;//Circle Line intersection
	
	if(Detect.polycorner)//corner of polygon collided with circle - take tangent to circle as collision surface
	  {
		//angle between collision point and centre of circle
		var tempangle=Math.atan2(Detect.CLr[1]-circle.pos[1],Detect.CLr[0]-circle.pos[0]);
		}
	else
	  {
		//side of polygon collided with circle - take edge of poly as collision surface
		tempangle=Response.getangleofpolyline(poly,Detect.polyline)+Math.PI/2
		}

	Response.PCnormal=[Math.cos(tempangle),Math.sin(tempangle)];

	//this makes sure point is always actually on one of the objects.  This stops the magically appearing energy problems which occured when using the point of intersection between circle and poly.
	Response.PCpoint=[circle.pos[0]+Math.cos(tempangle)*circle.dimensions , circle.pos[1]+Math.sin(tempangle)*circle.dimensions];
	}
	
//no longer used with new poly collisions - left in case it comes in handy
General.findnormalvector=function(dx,dy,samesize)
  {
	var x;
	var y;
	
	if(dx!==0 && dy!==0)//neither vertical nor horizontal
	  {
		x=1;
		y=(-1)*dx/dy;// dervived from grada*gradb=-1 or a.b=0
		}
	else if(dx==0)//vertical line
	  {
		x=1;
		y=0;
		}
	else if(dy==0)//horizontal line
	  {
		x=0;
		y=1;
		}

	if(samesize)//make normal vector have same magnitude as old vector
	  {
		var oldsize=Math.sqrt(dy*dy+dx*dx);
		var newsize=Math.sqrt(y*y+x*x);
		var diffsize=oldsize/newsize
		return [x*diffsize,y*diffsize];
		}
	else
	  {
	  return [x,y];
	  }
	}

//find the vector of the nearest line of a polygon - this might need re-doing? (21-08-08)
Response.findpolylinevector=function(polyX,polyY,polyAs,polyRs,polyangle,theircentrex,theircentrey)
  {
	
	var polyx1=polyX+polyRs[0]*Math.cos(polyAs[0]+polyangle);
	var polyy1=polyY+polyRs[0]*Math.sin(polyAs[0]+polyangle);
	var polyx2=polyX+polyRs[1]*Math.cos(polyAs[1]+polyangle);
	var polyy2=polyY+polyRs[1]*Math.sin(polyAs[1]+polyangle);
	
	//distance between point and each end of the polygon's line, minus the polygon's line.
	Detect.polyline=0;
	var diffinx=polyx2-polyx1;
	var diffiny=polyy2-polyy1;
	var shortest=dsqrd(polyx1,polyy1,theircentrex,theircentrey)+dsqrd(polyx2,polyy2,theircentrex,theircentrey)-dsqrd(polyx2,polyy2,polyx1,polyy1)
	
	for(var k=0;k<polyRs.length;k++)
	  {
		k2=(k+1)%polyRs.length;
		polyx1=polyX+polyRs[k]*Math.cos(polyAs[k]+polyangle);
		polyy1=polyY+polyRs[k]*Math.sin(polyAs[k]+polyangle);
		polyx2=polyX+polyRs[k2]*Math.cos(polyAs[k2]+polyangle);
		polyy2=polyY+polyRs[k2]*Math.sin(polyAs[k2]+polyangle);
		var testshort=dsqrd(polyx1,polyy1,theircentrex,theircentrey)+dsqrd(polyx2,polyy2,theircentrex,theircentrey)-dsqrd(polyx2,polyy2,polyx1,polyy1)
		if(testshort<shortest)
		  {
			shortest=testshort;
			Detect.polyline=k;
			diffinx=polyx2-polyx1;
			diffiny=polyy2-polyy1;
			}
		}
	return [diffinx,diffiny];
	}

Response.getangleofpolyline=function(them,k)
  {
	var polyx1=them.pos[0]+them.Rs[k]*Math.cos(them.As[k]+them.angle);
	var polyy1=them.pos[1]+them.Rs[k]*Math.sin(them.As[k]+them.angle);
	var polyx2=them.pos[0]+them.Rs[k2]*Math.cos(them.As[k2]+them.angle);
	var polyy2=them.pos[1]+them.Rs[k2]*Math.sin(them.As[k2]+them.angle);
	
	var dy=polyy2-polyy1
	var dx=polyx2-polyx1
	return Math.atan2(dy,dx);
	}

Response.staticPolyAndNonPoly=function(us,them)
  {//collide a moveable non-polygon with a static polygon.
	var k=Detect.polyline
	//atm all polys are objects so poly can't be 'us'
	if(!polycorner)//hit a line of the polygon - not a corner.
	  {
		var k2=(k+1)%them.Rs.length;
		var polyx1=them.pos[0]+them.Rs[k]*Math.cos(them.As[k]+them.angle);
		var polyy1=them.pos[1]+them.Rs[k]*Math.sin(them.As[k]+them.angle);
		var polyx2=them.pos[0]+them.Rs[k2]*Math.cos(them.As[k2]+them.angle);
		var polyy2=them.pos[1]+them.Rs[k2]*Math.sin(them.As[k2]+them.angle);
		
		var dy=polyy2-polyy1
		var dx=polyx2-polyx1
		var ourangle=Math.atan2(us.v[1],us.v[0])
		//ourangle is the angle the direction of the ball makes with the x axis, measured in a clockwise direction, where the angle is between 0 and 360 (in radians)
		var lineangle=Math.atan2(dy,dx)
		//ourangle is the angle the line makes with the x axis, measured in a clockwise direction, where the angle is between 0 and 360
		vectorangle=lineangle-ourangle
		//don't ask how long this took to work out.
		Response.newvx=Math.cos(ourangle+vectorangle*2)*ourspeed
		Response.newvy=Math.sin(ourangle+vectorangle*2)*ourspeed;
	  }
	else
	  {//hit a corner of the polygon

		//circle collision stuff (see collideascircles) - assuming polygon can't move.

  	ourcentrex=us.pos[0];
		ourcentrey=us.pos[1];
		theircentrex=them.pos[0]+them.Rs[k]*Math.cos(them.As[k]+them.angle);
		theircentrey=them.pos[1]+them.Rs[k]*Math.sin(them.As[k]+them.angle);
		diffinx=theircentrex-ourcentrex;
		diffiny=theircentrey-ourcentrey;
		
		collisionangle=Math.atan2(diffiny,diffinx)

		ouranglebelowx=Math.atan2(us.v[1],us.v[0])
		theiranglebelowx=Math.atan2(them.v[1],them.v[0])

		//ourspeed is set earlier
		ourparellelv=Response.ourspeed*(Math.cos(ouranglebelowx-collisionangle))
		ourperpendicularv=ourspeed*(Math.sin(ouranglebelowx-collisionangle))


		ournewparellelv=ourparellelv*(-1)
		Response.newvx=ournewparellelv*(Math.cos(collisionangle))+ourperpendicularv*(Math.cos(collisionangle+(Math.PI/2)))
		Response.newvy=ournewparellelv*(Math.sin(collisionangle))+ourperpendicularv*(Math.sin(collisionangle+(Math.PI/2)))
		}
	}

Response.collideassquares=function(us,them)
  {
	//from an equation I found on the internet (elastic collisons, re-arrangement of the above two equations)
	if(them.canMove)
	  {//we're colliding with a shape which can move	
		//1D collision equations dervived from kinetic energy and conservation of momentum, probably incorrectly applied in a 2D context
		Response.newvx=( (us.mass-them.mass)/(us.mass+them.mass))*us.v[0]+( (2*them.mass)/(us.mass+them.mass) )*them.v[0]
		Response.newvy=( (us.mass-them.mass)/(us.mass+them.mass))*us.v[1]+( (2*them.mass)/(us.mass+them.mass) )*them.v[1]
		Response.theirnewvx=( (them.mass-us.mass)/(them.mass+us.mass))*them.v[0]+( (2*us.mass)/(them.mass+us.mass) )*us.v[0]
		Response.theirnewvy=( (them.mass-us.mass)/(them.mass+us.mass))*them.v[1]+( (2*us.mass)/(them.mass+us.mass) )*us.v[1]
		}
	else
    {//they can't move
		theirleft=them.pos[0]-them.dimensions[0]/2
		theirright=them.pos[0]+them.dimensions[0]/2;
		theirtop=them.pos[1]-them.dimensions[1]/2
		theirbottom=them.pos[1]+them.dimensions[1]/2
		
		switch(us.shape)
		  {
			case 0:
				var ourwidth=us.dimensions*2;
    		var ourheight=us.dimensions*2;
			break;
			case 1:
    		var ourwidth=us.dimensions[0]
    		var ourheight=us.dimensions[1];
			break;
			}
		/*
		if(us.pos[1]-ourheight/2>theirtop && us.pos[1]-ourheight/2<theirbottom  && us.shape !==3)
		  {
			Response.newvy=us.v[1]*(-1);
			Response.newvx=us.v[0];
			}
		else if(us.pos[0]-ourwidth/2>theirleft && us.pos[0]-ourwidth/2<theirright && us.shape !==3)
		  {
			Response.newvx=us.v[0]*(-1);
			Response.newvy=us.v[1];
			}
		else if(us.pos[1]+ourheight/2>theirtop && us.pos[1]+ourheight/2<theirbottom && us.shape !==3)
		  {
			Response.newvy=us.v[1]*(-1);
			Response.newvx=us.v[0];
			}
		else(us.pos[0]+ourwidth/2>theirleft && us.pos[0]+ourwidth/2<theirright && us.shape !==3)
		  {
			General.dalert('else')
			Response.newvx=us.v[0]*(-1);
			Response.newvy=us.v[1];
			}
		*/
		
		//bodge, since above ancient script seems to have stopped working
		
		if(us.pos[0]>theirleft && us.pos[0] < theirright)
		  {
			//above or below
			Response.newvy*=-1;
			}
		else
		  {
			Response.newvx*=-1;
			}
		}
	}

function collideascircles(us,them)
  {
	ourcentrex=us.x;
	ourcentrey=us.y;
	theircentrex=them.x;
	theircentrey=them.y;
	diffinx=theircentrex-ourcentrex
	diffiny=theircentrey-ourcentrey
	collisionangle=getangle(diffinx,diffiny)
  
  //essentially, momentum is conserved parrellel and perpendicular to the angle of collision
  //http://director-online.com/buildArticle.php?id=532 proved immensly useful, and in actual fact, rendered most of 
  //my previous work at collisions wasted as I re-wrote a lot of it
  
  ouranglebelowx=getangle(us.vx,us.vy)
  theiranglebelowx=getangle(them.vx,them.vy)
  
  //ourspeed is set earlier
  theirspeed=Math.sqrt(them.vx*them.vx+them.vy*them.vy)
  ourparellelv=Response.ourspeed*(Math.cos(ouranglebelowx-collisionangle))
  ourperpendicularv=Response.ourspeed*(Math.sin(ouranglebelowx-collisionangle))
  theirparellelv=theirspeed*(Math.cos(theiranglebelowx-collisionangle))
  theirperpendicularv=theirspeed*(Math.sin(theiranglebelowx-collisionangle))
  if(them.type == 0)
  	{//we're colliding with an entity, so it can also move
    
    ournewparellelv=( (us.mass-them.mass)/(us.mass+them.mass))*ourparellelv+( (2*them.mass)/(us.mass+them.mass) )*theirparellelv
    theirnewparellelv=( (them.mass-us.mass)/(them.mass+us.mass))*theirparellelv+( (2*us.mass)/(them.mass+us.mass) )*ourparellelv
    newvx=ournewparellelv*(Math.cos(collisionangle))+ourperpendicularv*(Math.cos(collisionangle+(Math.PI/2)))
    newvy=ournewparellelv*(Math.sin(collisionangle))+ourperpendicularv*(Math.sin(collisionangle+(Math.PI/2)))
    theirnewvx=theirnewparellelv*(Math.cos(collisionangle))+theirperpendicularv*(Math.cos(collisionangle+(Math.PI/2)))
    theirnewvy=theirnewparellelv*(Math.sin(collisionangle))+theirperpendicularv*(Math.sin(collisionangle+(Math.PI/2)))
    
    }
	else
	  {//we're colliding with an object, so it can't move
    ournewparellelv=ourparellelv*(-1)
    newvx=ournewparellelv*(Math.cos(collisionangle))+ourperpendicularv*(Math.cos(collisionangle+(Math.PI/2)))
    newvy=ournewparellelv*(Math.sin(collisionangle))+ourperpendicularv*(Math.sin(collisionangle+(Math.PI/2)))
    
    }
  }

//checks to see if specific shape is currently in a collision
Detect.checkforanycollide=function(collidee)
  {
  for(i5=0;i5<Shapes.wholeworld.length;i5++)
	  {
	  if(Shapes.wholeworld[i5].canMove && Shapes.wholeworld[i5].alive)
  		{
			//checkcollide=function(p1,d1,f1,a1,s1,p2,d2,f2,a2,a2,s2)
  		if(Detect.checkcollide(collidee.pos,collidee.dimensions,collidee.filled,collidee.angle,collidee.shape,Shapes.wholeworld[i5].pos,Shapes.wholeworld[i5].dimensions,Shapes.wholeworld[i5].filled,Shapes.wholeworld[i5].angle,Shapes.wholeworld[i5].shape))
			  {
				return Shapes.wholeworld[i5];
				}
  		}
  	}
  return false;
  }

//checks to see if specific shape will be in a collision at a specified new position
Detect.checkforanycollide2=function(collidee,newx,newy)
  {
  for(var z=0;z<Shapes.wholeworld.length;z++)
	  {
  	if(Shapes.wholeworld[z].alive && z!==collidee.arraypos && Shapes.wholeworld[z].hard)
  	  {
  		if(Detect.checkcollide([newx,newy],collidee.dimensions,collidee.filled,collidee.angle,collidee.shape,Shapes.wholeworld[z].pos,Shapes.wholeworld[z].dimensions,Shapes.wholeworld[z].filled,Shapes.wholeworld[z].angle,Shapes.wholeworld[z].shape,collidee.bigR,Shapes.wholeworld[z].bigR,collidee.angle,Shapes.wholeworld[z].angle))
			  {
				return Shapes.wholeworld[z];
				}
  		}
	  }
  return false;
  }

//checks to see if specific shape will be in a collision at a specified new angle
Detect.checkforanycollide2b=function(collidee,newangle)
  {
    for(var z=0;z<Shapes.wholeworld.length;z++)
    {
    if(Shapes.wholeworld[z].alive && z!==collidee.arraypos && Shapes.wholeworld[z].hard)
      {
      if(Detect.checkcollide(collidee.pos,collidee.dimensions,collidee.filled,newangle,collidee.shape,Shapes.wholeworld[z].pos,Shapes.wholeworld[z].dimensions,Shapes.wholeworld[z].filled,Shapes.wholeworld[z].angle,Shapes.wholeworld[z].shape,collidee.bigR,Shapes.wholeworld[z].bigR,collidee.angle,Shapes.wholeworld[z].angle))
  			{
  			return Shapes.wholeworld[z];
  			}
      }
    
    }
  return false;
  }

//checks to see if THEORETICAL (non-poly) shape will be in a collision at a specified position
Detect.checkforanycollide3=function(pos,dimensions,f,a,s)
  {
  for(var z=0;z<Shapes.wholeworld.length;z++)
    {
    if(Shapes.wholeworld[z].alive && Shapes.wholeworld[z].hard)// && wholeworld[z].hard)
      {
      if(Detect.checkcollide(pos,dimensions,f,a,s,Shapes.wholeworld[z].pos,Shapes.wholeworld[z].dimensions,Shapes.wholeworld[z].filled,Shapes.wholeworld[z].angle,Shapes.wholeworld[z].shape))
  			{
  			return z;
  			}
      }
    }
  return false;
  }

//checks to see if THEORETICAL shape will be in a collision at a specified position, and ignore 2 collisions
Detect.checkforanycollide4=function(x,y,w,h,s,ignore1,ignore2)
  {
  for(var z=0;z<Shapes.wholeworld.length;z++)
    {
    if(Shapes.wholeworld[z].alive && Shapes.wholeworld[z].hard && z!==ignore1 && z!==ignore2 && Shapes.wholeworld[z].gametype!==0)
      {
      var testcollide=Detect.checkcollide(x,y,w,h,s,Shapes.wholeworld[z].x,Shapes.wholeworld[z].y,Shapes.wholeworld[z].width,Shapes.wholeworld[z].height,Shapes.wholeworld[z].shape,0,Shapes.wholeworld[z].bigR,0,Shapes.wholeworld[z].angle,false,Shapes.wholeworld[z].filled)
      if(testcollide == true)
  			{
  			return z;
  			}
      }
    }
  return false;
  }

//checks if a given theoretical shape would collide
Detect.checkspecifics=function(testx,testy,testwidth,testheight,testshape,testname,testobject)
  {
  for(i5=0;i5<Shapes.wholeworld.length;i5++)
    {
    if(Shapes.wholeworld[i5].alive && Shapes.wholeworld[i5].hard && testname!==Shapes.wholeworld[i5].name)
      {
      if(Detect.checkcollide(testx,testy,testwidth,testheight,testshape,Shapes.wholeworld[i5].x,Shapes.wholeworld[i5].y,Shapes.wholeworld[i5].width,Shapes.wholeworld[i5].height,Shapes.wholeworld[i5].shape,testobject,Shapes.wholeworld[i5]) == true)
  			{
  			return Shapes.wholeworld[i5];
  			}
      }
    }
  return false;
  }

//p=pos=[x,y], d=dimensions,s=shape, a=angle, f=filled
Detect.checkcollide=function(p1,d1,f1,a1,s1,p2,d2,f2,a2,s2)
  {
	x1=p1[0];
	y1=p1[1];
	x2=p2[0];
	y2=p2[1];
	
  if(s1==0 && s2==0)//both are circles
    {
    radii=Math.pow((d1+d2),2);
    //pythagoras - this was pythag, but since square roots are slow maths, I've decided to just compare the squares.
    var circledistance= (x1-x2)*(x1-x2)+(y1-y2)*(y1-y2) 
    //if the distance between the two circles is less than or equal to the sum of their two radii then they'll collide
    if(circledistance<radii)
  		{
  		return true;
  		}
    }
  
  //shapes,0=circle, 1= rectangle,  2=square/rectangle (obselete, I think), but collide as circle, 3 = polygon, 4= line
  
  else if(s1==4 && s2==0)//line + circle
    {
  	if(Detect.circleandline(x1,p1[2],y1,p1[3],x2,y2,d2))
		  {
			return true;
			}
  	}
  else if(s1==0 && s2==4)//line + circle
    {
  	if(Detect.circleandline(x2,p2[2],y2,p2[3],x1,y1,d1))
		  {
			return true;
			}
  	}
  else if(s1==3 || s2==3)//involves a polygon
    {
  	if(s1==3 && s2!==3)
  	  {//(polyX,polyY,polyRs,polyAs,polybigR,polyangle,polyfilled,theirx,theiry,notpolyd,notpolyshape)
			
      var polycollide=Detect.polyandshape(x1,y1,d1[0],d1[1],d1[2],a1,f1,x2,y2,d2,s2);
			}
    else if(s2==3 && s1!==3)
		  {
			var polycollide=Detect.polyandshape(x2,y2,d2[0],d2[1],d2[2],a2,f2,x1,y1,d1,s1);
		  }
    else if(s2==3 && s1==3)
      {
      var polycollide=Detect.polyandpoly(x1,y1,d1[0],d1[1],d1[2],a1,f1,x2,y2,d2[0],d2[1],d2[2],a2,f2);
  		}
  
  	if(polycollide){return true;}
  
  	}
	else if(s1==0 && s2==1)
		{
  	//circle + rectangle combo
  	if(x1+d1 > x2-d2[0]/2 && x1-d1 < (x2+d2[0]/2) && y1-d1 < (y2+d2[1]/2) && y1+d1 > y2-d2[1]/2)
		  {
			return true;
			}
  	}
  return false;
  }

Detect.inpoly=function(x,y,polyX,polyY,polyRs,polyAs,polyangle)
  {//test to see if a single point is inside a certain polygon.
	var crosslines=0;
	var x2=x+1000;
	for(var p=0;p<polyRs.length;p++)
	  {
		var p2=(p+1)%polyRs.length;
		if(Detect.linesintersect(x,y,x2,y,polyX+polyRs[p]*Math.cos(polyAs[p]+polyangle),polyY+polyRs[p]*Math.sin(polyAs[p]+polyangle),polyX+polyRs[p2]*Math.cos(polyAs[p2]+polyangle),polyY+polyRs[p2]*Math.sin(polyAs[p2]+polyangle)))
		  {
			crosslines++;
			}
		}
	if(crosslines%2==0)
    {
    //even :. outside poly.
    return false;
    }
	else
	  {
    //odd :. inside poly
    return true;
    }
  }

Detect.polyandpoly=function(poly1X,poly1Y,poly1Rs,poly1As,poly1bigR,poly1angle,poly1filled,poly2X,poly2Y,poly2Rs,poly2As,poly2bigR,poly2angle,poly2filled)
  {//detects if two polygons are colliding.
  //this function will be very, very slow.  It is mostly here as a working placeholder until I re-write polygon collisions.
  
	//testing corners of poly2 inside poly1
  if(poly1filled)
    {
    for(var k=0;k<poly2Rs.length;k++)
      {
      polyx1=poly2X+poly2Rs[k]*Math.cos(poly2As[k]+poly2angle);
      polyy1=poly2Y+poly2Rs[k]*Math.sin(poly2As[k]+poly2angle);
      if(Detect.inpoly(polyx1,polyy1,poly1X,poly1Y,poly1Rs,poly1As,poly1angle))
        {
        Detect.polyline=Detect.findpolyline(polyx1,polyy1,poly1X,poly1Y,poly1Rs,poly1As,poly1angle);
        Detect.CLr=[polyx1,polyy1];
        Detect.polynumber=2;
				Detect.polycorner=true;
				return true;
				}
      }
    }
  
  
  if(poly2filled)//testing corners of poly1 inside poly2
    {
    for(var k=0;k<poly1Rs.length;k++)
      {
      polyx1=poly1X+poly1Rs[k]*Math.cos(poly1As[k]+poly1angle);
      polyy1=poly1Y+poly1Rs[k]*Math.sin(poly1As[k]+poly1angle);
      if(inpoly(polyx1,polyy1,poly2X,poly2Y,poly2Rs,poly2As,poly2angle))
        {
        Detect.polyline=Detect.findpolyline(polyx1,polyy1,poly2X,poly2Y,poly2Rs,poly2As,poly2angle);
        Detect.CLr=[polyx1,polyy1];
        Detect.polynumber=1;
				Detect.polycorner=true;
				return true;
				}
      }
    }
  
  Detect.polycorner=false
  
  if(!poly1filled || !poly2filled)
    {//only check overlapping lines if either polygon is hollow. 
    
    //return false
    for(var k=0;k<poly1Rs.length;k++)
      {
			k2=(k+1)%poly1Rs.length;
      var xa1=poly1X+poly1Rs[k]*Math.cos(poly1As[k]+poly1angle);
      var ya1=poly1Y+poly1Rs[k]*Math.sin(poly1As[k]+poly1angle);
      var xa2=poly1X+poly1Rs[k2]*Math.cos(poly1As[k2]+poly1angle);
      var ya2=poly1Y+poly1Rs[k2]*Math.sin(poly1As[k2]+poly1angle);
      		
      for(var p=0;p<poly2Rs.length;p++)
    		{
				p2=(p+1)%poly2Rs.length;
    		var xb1=poly2X+poly2Rs[p]*Math.cos(poly2As[p]+poly2angle);
    		var yb1=poly2Y+poly2Rs[p]*Math.sin(poly2As[p]+poly2angle);
    		var xb2=poly2X+poly2Rs[p2]*Math.cos(poly2As[p2]+poly2angle);
    		var yb2=poly2Y+poly2Rs[p2]*Math.sin(poly2As[p2]+poly2angle);
    		
    		if(Detect.linesintersect(xa1,ya1,xa2,ya2,xb1,yb1,xb2,yb2))
      		{
					Detect.polyline=k;
					Detect.polyline2=p;
					return true;
					}
    		}
      }
    }//end of polyfilled
  return false;
  }


Detect.findpolyline=function(x,y,polyX,polyY,polyRs,polyAs,polyangle)
  {
  var polyx1=polyX+polyRs[0]*Math.cos(polyAs[0]+polyangle);
  var polyy1=polyY+polyRs[0]*Math.sin(polyAs[0]+polyangle);
  var polyx2=polyX+polyRs[1]*Math.cos(polyAs[1]+polyangle);
  var polyy2=polyY+polyRs[1]*Math.sin(polyAs[1]+polyangle);
  
  var shortest=General.dsqrd(polyx1,polyy1,x,y)+General.dsqrd(polyx2,polyy2,x,y)-General.dsqrd(polyx2,polyy2,polyx1,polyy1)
  var temppolyline=0;
  
  for(var k=0;k<polyRs.length;k++)
    {
		k2=(k+1)%polyRs.length;
    polyx1=polyX+polyRs[k]*Math.cos(polyAs[k]+polyangle);
    polyy1=polyY+polyRs[k]*Math.sin(polyAs[k]+polyangle);
    polyx2=polyX+polyRs[k2]*Math.cos(polyAs[k2]+polyangle);
    polyy2=polyY+polyRs[k2]*Math.sin(polyAs[k2]+polyangle);
    var testshort=General.dsqrd(polyx1,polyy1,x,y)+General.dsqrd(polyx2,polyy2,x,y)-General.dsqrd(polyx2,polyy2,polyx1,polyy1)
    if(testshort<shortest)
		  {
			shortest=testshort;
			temppolyline=k;
			}
    }
  return temppolyline;
  }

Detect.polyandshape=function(polyX,polyY,polyRs,polyAs,polybigR,polyangle,polyfilled,theirx,theiry,notpolyd,notpolyshape)
  {//detects if there's a collision with a polygon
  
  //polyRs = radii of verticies from centre
  //polyAs = angle of verticles from centre

  switch(notpolyshape)
	  {
		case 0:
		  notpolyradius=notpolyd;
			notpolywidth=notpolyradius*2
			notpolyheight=notpolyradius*2
		break;
		case 1:
      notpolywidth=notpolyd[0];
      notpolyheight=notpolyd[1];
	  break;
		}
    theircentrex=theirx;
    theircentrey=theiry;
  
  //optimisation - treat poly as giant circle
  if(General.dsqrd(polyX,polyY,theircentrex,theircentrey)>Math.pow(polybigR+notpolywidth+notpolyheight,2))
    {
		//they're too far away to be able to collide
    return false;
    }
  
  //check to see if their shape has hit a corner treating the corner as a very small circle
  if(notpolyshape==0)
    {
    for(var k=0;k<polyRs.length;k++)
      {
      polyx1=polyX+polyRs[k]*Math.cos(polyAs[k]+polyangle);
      polyy1=polyY+polyRs[k]*Math.sin(polyAs[k]+polyangle);
      if(General.dsqrd(polyx1,polyy1,theircentrex,theircentrey)<notpolyradius*notpolyradius)
        {
				Detect.polyline=k;
				Detect.polycorner=true;
				Detect.CLr=[polyx1,polyy1];
				return true;
				}
      }
    }
  Detect.polycorner=false;
  
  
  
  //if polygon is 'filled', check to see if shape is inside.
  if(polyfilled)//check to see if bigR is greater than notpolywidth?
    {
    if(Detect.inpoly(theircentrex,theircentrey,polyX,polyY,polyRs,polyAs,polyangle))
      {//find which line of the polygon is nearest.
      Detect.polyline=Detect.findpolyline(theircentrex,theircentrey,polyX,polyY,polyRs,polyAs,polyangle);
      return true;
  		}
		}
  
  for(var k=0;k<polyRs.length;k++)
    {//loop through each line of the polygon
    k2=(k+1)%polyRs.length;
    //if(k2==polyXs.length){k2=0;}
    
    //var linelength=distance(poly.x[k2],poly.y[k2],poly.x[k],poly.y[k])+0.5
    
    var polyx1=polyX+polyRs[k]*Math.cos(polyAs[k]+polyangle);
    var polyy1=polyY+polyRs[k]*Math.sin(polyAs[k]+polyangle);
    var polyx2=polyX+polyRs[k2]*Math.cos(polyAs[k2]+polyangle);
    var polyy2=polyY+polyRs[k2]*Math.sin(polyAs[k2]+polyangle);
    
    //check to see if we're even vaguely near first.  if we are *then* check thoroughly
    
    //this actually compares the squares of the lengths, as this is much faster to execute.
    //if(Math.pow((theircentrex-polyx2),2)+Math.pow((theircentrey-polyy2),2)+Math.pow((theircentrex-polyx1),2)+Math.pow((theircentrey-polyy1),2) <= poly.linelength[k]+Math.pow((notpolywidth+notpolyheight),2))
    if(true)
      {
      
      if(polyx1<polyx2){var testpolyx1=polyx1;var testpolyx2=polyx2}else{var testpolyx1=polyx2;var testpolyx2=polyx1}
      if(polyy1<polyy2){var testpolyy1=polyy1;var testpolyy2=polyy2}else{var testpolyy1=polyy2;var testpolyy2=polyy1}
      
      var dy=polyy2-polyy1
      var dx=polyx2-polyx1
      
      if(notpolyshape!==0)//check all four corners of rectangle
        {
        var leftx=theirx-notpolywidth/2
        var topy=theiry-notpolyheight/2
        var rightx=theirx+notpolywidth/2
        var bottomy=theiry+notpolyheight/2
        //top line of square
        if(Detect.linesintersect(leftx,topy,rightx,topy,polyx1,polyy1,polyx2,polyy2))
				  {
					Detect.polyline=k;
					return true;
					}
        //right hand side
        if(Detect.linesintersect(rightx,topy,rightx,bottomy,polyx1,polyy1,polyx2,polyy2))
				  {
					Detect.polyline=k;
					return true;
					}
        //bottom line
        if(Detect.linesintersect(leftx,bottomy,rightx,bottomy,polyx1,polyy1,polyx2,polyy2))
				  {
					Detect.polyline=k;
					return true;
					}
        //left had side
        if(Detect.linesintersect(leftx,topy,leftx,bottomy,polyx1,polyy1,polyx2,polyy2))
				  {
					Detect.polyline=k;
					return true;
					}
        }
			else
				{
				//circle intersecting with a line
        var r=notpolyradius
        var a=theircentrex
        var b=theircentrey
        var x1=polyx1
        var y1=polyy1
        //gradient of poly line
        var m=dy/dx
        
        if(Detect.circleandline(polyx1,polyx2,polyy1,polyy2,a,b,r))
				  {
					Detect.polyline=k;
					return true;
					}
        
        //end of circle if
        }
      //end of optimisation if
      }
    //end of loop
    }
  return false
  }

//checks for intersection
Detect.linesintersect=function(sx1,sy1,sx2,sy2,px1,py1,px2,py2)
  {
  if(sx1<sx2){var sx1test=sx1;var sx2test=sx2}else{var sx1test=sx2;var sx2test=sx1;}
  if(sy1<sy2){var sy1test=sy1;var sy2test=sy2}else{var sy1test=sy2;var sy2test=sy1;}
  if(px1<px2){var px1test=px1;var px2test=px2}else{var px1test=px2;var px2test=px1;}
  if(py1<py2){var py1test=py1;var py2test=py2}else{var py1test=py2;var py2test=py1;}
  
  //if(sx2 > px1 && sx1 < px2 && sy1 < py2 && sy2 > py1){
  var sm=(sy2-sy1)/(sx2-sx1)
  var pm=(py2-py1)/(px2-px1)
  
  //gradients not equal :. not parallel and will intersect in 2D
  if(sm!==pm && sm!==Infinity && pm!==Infinity && sm!==0 && pm!==0)
    {
    //co-ords of intersection
    var x=(sx1*sm-px1*pm+py1-sy1)/(sm-pm)
    var y=pm*(x-px1)+py1
    
    }
	else
		{
    //an infinite gradient means a vertical line
    if(sm==-Infinity)
		  {
			sm=Infinity;
			}
    if(pm==-Infinity)
		  {
			pm=Infinity;
			}
    //a gradient of zero means a horizontal line
    
    if(sm==Infinity && pm==Infinity){if(sy2test>=py1test && sy1test<=py2test && sx1==px1){return true}}
    else if(sm==0 && pm==0){if(sx2test>=px1test && sx1test<=px2test && py1==sy1){return true}}
    else if(sm==Infinity && pm==0){var x=sx1;var y=py1;}
    else if(sm==0 && pm==Infinity){var y=sy1;var x=px1;}
    else if(sm==Infinity){var x=sx1;var y=pm*(x-px1)+py1}
    else if(pm==Infinity){var x=px1;var y=sm*(x-sx1)+sy1}
    else if(sm==0){var y=sy1;var x=(y-py1)/pm+px1}
    else if(pm==0){var y=py1;var x=(y-sy1)/sm+sx1}
    
    }
  Detect.CLr=[x,y];
  if(sx1test<=x && x<=sx2test && px1test<= x && x<=px2test && sy1test<=y && y<=sy2test && py1test<=y && y<=py2test)
	  {
		return true;
		}
  
  //end of optimisation
  //}
  
  return false;
  }

General.toradians=function(degrees)
  {
	return ((Math.PI/180)*degrees);
	}

General.todegrees=function(radians)
  {
	return radians*180/Math.PI;
	}

//distance between two points.
General.distance=function(dx1,dy1,dx2,dy2)
  {
	var dx=dx2-dx1;
  var dy=dy2-dy1;
  return Math.sqrt(dx*dx+dy*dy);
	}

//distance squared
General.dsqrd=function(dx1,dy1,dx2,dy2)
  {
	var dx=dx2-dx1;
  var dy=dy2-dy1;
  return dx*dx+dy*dy;
	}

//CP = circle line, r=position vector
//var CLr;

//does a circle intersect a line?
Detect.circleandline=function(x1,x2,y1,y2,a,b,r)
  {
  //r=radius
  //a=circle centre x
  //b=circle centre y
  //(x1,y1), (x2,y2) points line travels between
  
  if(x1<x2){var testx1=x1;var testx2=x2;}else{var testx1=x2;var testx2=x1;}
  if(y1<y2){var testy1=y1;var testy2=y2;}else{var testy1=y2;var testy2=y1;}
  
  //treat both as squares first, if they collide, look in more detail
  //if(testx2 > (a-r) && testx1 < (a+r) && testy1 < (b+r) && testy2 > (b-r))
  //{
  var dy=y2-y1;
  var dx=x2-x1;
  //gradient of line
  var m=dy/dx
  //fixes odd problem with not detecting collision point correctly on a nearly vertical line - needs looking into?
  if(m>1000000)
	  {
		m=Infinity;
		}
  switch(m)
    {
    case Infinity:
    case -Infinity:
      //vertical line - we know x, but have potentially two possible Ys
      var x=x1
      //b^2 - 4ac
      var discrim=Math.pow((-2*b),2)-4*(b*b+(x-a)*(x-a)-r*r)
      if(discrim>=0)
        {
				//minus
        var y=(-(-2*b)-Math.sqrt(discrim))/2
        if(testx1<=x && x<= testx2 && testy1<=y && y<=testy2)
				  {
					Detect.CLr=[x,y];
					return true;
					}
        //plus
        var y=(-(-2*b)+Math.sqrt(discrim))/2
        if(testx1<=x && x<= testx2 && testy1<=y && y<=testy2)
				  {
					Detect.CLr=[x,y];
					return true;
					}
        }
    break;
    case 0:
      //horizontal line, two potential Xs
      var y=y1
      var discrim=Math.pow((-2*a),2)-4*(a*a+(y-b)*(y-b)-r*r)
      if(discrim>=0)
        {
				//minus
        var x=(-(-2*a)-Math.sqrt(discrim))/2
        if(testx1<=x && x<= testx2 && testy1<=y && y<=testy2)
				  {
					Detect.CLr=[x,y];
					return true;
					}
        //plus
        var x=(-(-2*a)+Math.sqrt(discrim))/2
        if(testx1<=x && x<= testx2 && testy1<=y && y<=testy2)
				  {
					Detect.CLr=[x,y];
					return true;
					}
        }
    break;
    default:
      //re-arrangement of the equation of a circle and the equation of a straight line to find the x co-ordinate of an intersection
      var discrim=Math.pow((-2*a-2*m*m*x1+2*y1*m-2*b*m),2)-4*(1+m*m)*(-2*m*x1*y1+2*m*x1*b+m*m*x1*x1-r*r+a*a+(y1-b)*(y1-b))
      //if discriminant is less than zero then there are no real roots and :. no interesction
      if(discrim>=0)
        {
				//circle intersects line, but where?
        //minus first
        var x=(-(-2*a-2*m*m*x1+2*y1*m-2*b*m)-Math.sqrt(discrim))/(2*(1+m*m))
        var y=m*(x-x1)+y1
        if(testx1<=x && x<= testx2 && testy1<=y && y<=testy2)
				  {
					Detect.CLr=[x,y];
					return true;
					}
        //then plus
        x=(-(-2*a-2*m*m*x1+2*y1*m-2*b*m)+Math.sqrt(discrim))/(2*(1+m*m))
        y=m*(x-x1)+y1
        
        if(testx1<=x && x<= testx2 && testy1<=y && y<=testy2)
				  {
					Detect.CLr=[x,y];
					return true;
					}
        //end of discrim if
        }
    break;
    //end of m switch
    }
  return false;
  }