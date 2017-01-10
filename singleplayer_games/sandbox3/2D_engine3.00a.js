var Render=new Object();
var Shapes=new Object();
var Physics=new Object();
var General=new Object();
var Response=new Object();
var Detect=new Object();
var UI=new Object();

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
	viewports.push(this);
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
	this.dimensions=[Rs,As,largestR,Xs,Ys]
	
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
	this.arraypos=wholeworld.length
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
	this.MI=mass*(width/2)*(width/2)/2
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
	this.angle=angle;
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



Physics.makecharged=function(chargeme)//if not 0 then gives an object a charge, if 0 then removes charge
  {
	if(chargeme==0)
	  {
		this.charged=false;this.charge=0;chargedobjects.splice(this.chargearraypos, 1);
		}
	else
	  {
		if(this.charged)//already got a charge, so wipe it first
		  {
			this.charged=false;this.charge=0;chargedobjects.splice(this.chargearraypos, 1);
			}

		this.charge=chargeme;
		this.charged=true;
		this.chargearraypos=chargedobjects.length
		chargedobjects.push(this);
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
	for(var r=0;r<viewports.length;r++)
	  {
		if(drawcounter%viewports[r].sync==0 && viewports[r].enabled)
		  {
			if(viewports[r].bg===false)
			  {
				//blank bg
				viewports[r].canvas.clearRect(0,0,viewports[r].width,viewports[r].height); // clear canvas
				}
			else
			  {
				//coloured bg
				viewports[r].canvas.fillStyle = viewports[r].bg;
				viewports[r].canvas.fillRect(0,0,viewports[r].width,viewports[r].height);
				}

			viewports[r].canvas.beginPath();
			for (i4=0;i4<wholeworld.length;i4++)
			  {
				wholeworld[i4].draw(r);
				}

			viewports[r].canvas.fill();
			viewports[r].canvas.beginPath();
			viewports[r].canvas.strokeStyle='black';
			viewports[r].canvas.lineWidth=viewports[r].zoom;

			for (i4=0;i4<connections.length;i4++)
			  {
				connections[i4].updateline(r);
				}
			viewports[r].canvas.stroke();
			}
		}
		drawcounter++;
	}
