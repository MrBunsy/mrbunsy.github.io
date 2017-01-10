// Collision response component of 2D engine.
// requires physics, shapes, general and collision detection components (everything except render I think).

var Response=new Object();

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
	if(!Detect.polycorner)//hit a line of the polygon - not a corner.
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
		Response.newvx=Math.cos(ourangle+vectorangle*2)*Physics.ourspeed
		Response.newvy=Math.sin(ourangle+vectorangle*2)*Physics.ourspeed;
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
		ourparellelv=Physics.ourspeed*(Math.cos(ouranglebelowx-collisionangle))
		ourperpendicularv=Physics.ourspeed*(Math.sin(ouranglebelowx-collisionangle))


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

Response.collideascircles=function(us,them)
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
