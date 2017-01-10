// shapes component of 2D engine - classes for circles, rectangles and polygons.

var Shapes=new Object();

Shapes.wholeworld=new Array();

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

	//functions - only add certain ones if that component of the engine is present.
	if(typeof Physics !== 'undefined')
  	{
  	this.kill=Physics.kill;
  	this.unKill=Physics.unKill;
  	this.makeCharged=Physics.makeCharged;
  	this.cutFree=Physics.cutFree;
  	}
	if(typeof Render !== 'undefined')
  	{
  	this.draw=Render.drawPoly;
		}
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

	//functions - only add certain ones if that component of the engine is present.
	if(typeof Physics !== 'undefined')
  	{
  	this.kill=Physics.kill;
  	this.unKill=Physics.unKill;
  	this.makeCharged=Physics.makeCharged;
  	this.cutFree=Physics.cutFree;
  	}
	if(typeof Render !== 'undefined')
  	{
  	this.draw=Render.drawPoly;
		}	
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

	//functions - only add certain ones if that component of the engine is present.
	if(typeof Physics !== 'undefined')
  	{
  	this.kill=Physics.kill;
  	this.unKill=Physics.unKill;
  	this.makeCharged=Physics.makeCharged;
  	this.cutFree=Physics.cutFree;
  	}
	if(typeof Render !== 'undefined')
  	{
  	this.draw=Render.drawPoly;
		}
	
	}
