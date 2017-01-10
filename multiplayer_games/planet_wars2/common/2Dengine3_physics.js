// Physics component of 2D engine. 0.06
// Requires General and Shapes components.
// Usage example:
/*

Sandbox.loop=function()
  {
  Physics.replotentities()
  Physics.sortoutrods()
  Render.redrawworld()
	}

*/

var Physics=new Object();

//when a collision occurs, try and move the objects as close as possible?
Physics.collisionPositionStuff=true;

Physics.k=8990000000;
Physics.connections=new Array();
Physics.chargedobjects=new Array();

//gravity, and in which direction (could be used as a cheap wind, like Worms 1)  100 seems to be a nice value
Physics.gravityY=200;
Physics.gravityX=0;
//F=-bV (drag), friction=b
Physics.friction=5;
//time/s per refresh
Physics.timeperloop=0.02

Physics.maxDistPerLoop=Infinity;

//the minimum speed anything can have before it's stopped (set to 0 for no min speed)
Physics.minspeed=10
if(General.IE)
  {//essentially fps
	Physics.refreshrate=Physics.timeperloop*796;
	}
else
  {
	Physics.refreshrate=Physics.timeperloop*1000;
	}

Physics.electricPotential=function(pos)
{
	var potential=0;
	
	for (var k = 0; k < Physics.chargedobjects.length; k++)
	{
		var r=Math.sqrt(Math.pow(pos[0]-Physics.chargedobjects[k].pos[0],2) + Math.pow(pos[1]-Physics.chargedobjects[k].pos[1],2));
		//find the electric potential at a point
		potential+=Physics.k * Physics.chargedobjects[k].charge / r;
		
	}
	
	return potential;
}

//something moved without a collision occuring - overrideen in PW
Physics.noCollisionOccured=function()
{
	
}

Physics.sortoutrods=function()
  {
  for(var c=0;c<3;c++)
    {
    for(var i=0;i<Physics.connections.length;i++)
      {
      if(Physics.connections[i].type==1 && Physics.connections[i].alive)//alive rod
        {
        var farapart=General.dsqrd(Shapes.wholeworld[connections[i].from].x,Shapes.wholeworld[connections[i].from].y,Shapes.wholeworld[connections[i].to].x,Shapes.wholeworld[connections[i].to].y);
        if(farapart>connections[i].lengthsqrd+connections[i].strengthsqrd || farapart<connections[i].lengthsqrd-connections[i].strengthsqrd)
          {
  				//if the two particles are too far apart or too close
          farapart=Math.sqrt(farapart);
          var moveme=(Physics.connections[i].connectionlength-farapart)/2
          //angle from 'from' to 'to'
          var angle=Math.atan2(Shapes.wholeworld[Physics.connections[i].to].y-Shapes.wholeworld[connections[i].from].y,Shapes.wholeworld[Physics.connections[i].to].x-Shapes.wholeworld[Physics.connections[i].from].x)
          
          var testnewtox=Shapes.wholeworld[Physics.connections[i].to].x+Math.cos(angle)*moveme;
          var testnewtoy=Shapes.wholeworld[Physics.connections[i].to].y+Math.sin(angle)*moveme;
          
          var testnewfromx=Shapes.wholeworld[Physics.connections[i].from].x+Math.cos(angle+Math.PI)*moveme;
          var testnewfromy=Shapes.wholeworld[Physics.connections[i].from].y+Math.sin(angle+Math.PI)*moveme;
          
          if(Detect.checkforanycollide2(Shapes.wholeworld[Physics.connections[i].from],testnewfromx,testnewfromy)===false && Shapes.wholeworld[Physics.connections[i].from].type==0)//if can move to new position, and not static
            {
  					Shapes.wholeworld[Physics.connections[i].from].x=testnewfromx;
            Shapes.wholeworld[Physics.connections[i].from].vx+=Math.cos(angle+Math.PI)*moveme/timeperloop;
            Shapes.wholeworld[Physics.connections[i].from].vy+=Math.sin(angle+Math.PI)*moveme/timeperloop;
            Shapes.wholeworld[Physics.connections[i].from].y=testnewfromy;
  					}
          
          if(Detect.checkforanycollide2(Shapes.wholeworld[Physics.connections[i].to],testnewtox,testnewtoy)===false && Shapes.wholeworld[Physics.connections[i].to].type==0)
            {
    				Shapes.wholeworld[Physics.connections[i].to].x=testnewtox;
            Shapes.wholeworld[Physics.connections[i].to].vx+=Math.cos(angle)*moveme/timeperloop;
            Shapes.wholeworld[Physics.connections[i].to].vy+=Math.sin(angle)*moveme/timeperloop;
            Shapes.wholeworld[Physics.connections[i].to].y=testnewtoy;
    				}
          
          }
        
        //end of if rod
        }
      //end of connections loop
      }
    //end of iterations loop
    }
  }

Physics.springforce=function(x1,x2,y1,y2,sprstr,sprlng)
  {
  var farapart=Math.sqrt( Math.pow(x2-x1,2) + Math.pow(y2-y1,2)  )
  var springforce=-sprstr*(farapart-sprlng);
  var springangle=Math.atan2(y1-y2,x1-x2);
  return [farapart,springforce,springangle];
  }


Physics.posfromforce=function(vx,vy,testfx,testfy,ourangle,ourspeedfriction,times)
  {
  var testax=testfx/Shapes.wholeworld[i].mass
  var testay=testfy/Shapes.wholeworld[i].mass
  
  var testnewvy=vy+(testfx/Shapes.wholeworld[i].mass)*times
  var testnewvx=vx+(testfy/Shapes.wholeworld[i].mass)*times
  
  var testnewx=(testnewvx*times+1/2*testax*Physics.timeperloop*Physics.timeperloop)+Shapes.wholeworld[i].pos[0]
  var testnewy=(testnewvy*times+1/2*testay*Physics.timeperloop*Physics.timeperloop)+Shapes.wholeworld[i].pos[1]
  return[testnewx,testnewy];
  }

//get the forces a spring should apply, for a given object and time increment (time increment indented to be rendered unecessarry in for this in future)
Physics.getSpringForces=function(thisObject)
{
	var force=[0,0];
	
	for(var k=0;k<Shapes.wholeworld[thisObject].connected.length;k++)
	{
		switch(Physics.connections[Shapes.wholeworld[thisObject].connected[k]].type)
		{
			case 0:
				//if this connection is a spring
				if(Physics.connections[Shapes.wholeworld[thisObject].connected[k]].to!==i)
				{
					var them=Physics.connections[Shapes.wholeworld[thisObject].connected[k]].to;
				}
				else
				{
					var them=Physics.connections[Shapes.wholeworld[thisObject].connected[k]].from;
				}
				
				var tempspringstrength=Physics.connections[Shapes.wholeworld[thisObject].connected[k]].connectionstrength;
				var tempspringlength=Physics.connections[Shapes.wholeworld[thisObject].connected[k]].connectionlength;
				
				var themx=Shapes.wholeworld[them].pos[0];
				var themy=Shapes.wholeworld[them].pos[1];
				
				//Hooke's Law:
				//F=-kx
				var springvar = Physics.springforce(Shapes.wholeworld[thisObject].pos[0],themx,Shapes.wholeworld[thisObject].pos[1],themy,tempspringstrength,tempspringlength)
				//(Shapes.wholeworld[us].x+Shapes.wholeworld[us].width/2)-themx,(Shapes.wholeworld[us].y+Shapes.wholeworld[us].height/2)-themy
				
				//force from current position
				var testfy=Math.sin(springvar[2])*springvar[1]//+Shapes.wholeworld[thisObject].vx
				var testfx=Math.cos(springvar[2])*springvar[1]//+Shapes.wholeworld[thisObject].vy
				
				/*
				//force from one loop's time if the above force were applied
				var testpositions=Physics.posfromforce(tempvx,tempvy,testfx,testfy,ourangle,ourspeedfriction,timeInterval/2);
				springvar = Physics.springforce(testpositions[0],themx,testpositions[1],themy,tempspringstrength,tempspringlength)
				var testfy2=Math.sin(springvar[2])*springvar[1]
				var testfx2=Math.cos(springvar[2])*springvar[1]
				
				//force on thingy if it moved using average of above two forces
				testpositions=Physics.posfromforce(tempvx,tempvy,(testfx+testfx2)/2,(testfy+testfy2)/2,ourangle,ourspeedfriction,timeInterval);
				springvar = Physics.springforce(testpositions[0],themx,testpositions[1],themy,tempspringstrength,tempspringlength)
				var testfy3=Math.sin(springvar[2])*springvar[1]
				var testfx3=Math.cos(springvar[2])*springvar[1]
				
				var fy=(testfy+testfy2+testfy3)/3 + Shapes.wholeworld[them].f[1]//this seems to help with balloons, though I'm not too sure how realistic it is.
				var fx=(testfx+testfx2+testfx3)/3 + Shapes.wholeworld[them].f[0]
				//end of if connection is a spring
				*/
				
				force[0]+=testfx;
				force[1]+=testfy;
			break;
		}
		//end of connections loop
	}
	return force;
}
	
Physics.getChargeForces=function(thisObject)
{
	var force=[0,0];
	if(Shapes.wholeworld[thisObject].charged)
	{
		for(var k=0;k<Physics.chargedobjects.length;k++)
		{
			if(k!==Shapes.wholeworld[thisObject].chargearraypos)
			{
				var rsqrd=Math.pow(Shapes.wholeworld[thisObject].pos[0]-Physics.chargedobjects[k].pos[0],2)+Math.pow(Shapes.wholeworld[thisObject].pos[1]-Physics.chargedobjects[k].pos[1],2);
				//coloumbs law:
				//f=k.q1.q2/r^2
				var coulombforce=Physics.k*Physics.chargedobjects[k].charge*Shapes.wholeworld[thisObject].charge/rsqrd;
				var coulombangle=Math.atan2(Shapes.wholeworld[thisObject].pos[1]-Physics.chargedobjects[k].pos[1],Shapes.wholeworld[thisObject].pos[0]-Physics.chargedobjects[k].pos[0]);
				force[1]+=Math.sin(coulombangle)*coulombforce;
				force[0]+=Math.cos(coulombangle)*coulombforce;
			}
		}
	}
	return force;
}

Physics.getFrictionForces=function(thisObject)
{
	var force=[0,0];

//	var speed=Math.sqrt(Shapes.wholeworld[thisObject].v[0]*Shapes.wholeworld[thisObject].v[0]+Shapes.wholeworld[thisObject].v[1]*Shapes.wholeworld[thisObject].v[1]);
//	var angle=Math.atan2(Shapes.wholeworld[thisObject].v[1],Shapes.wholeworld[thisObject].v[0]);
	
	//F=-bV
	
	force[0]=-Physics.friction*Shapes.wholeworld[thisObject].v[0];
	force[1]=-Physics.friction*Shapes.wholeworld[thisObject].v[1];
	
//	var forceMag=-Physics.friction*speed;
	
	return force;
}

Physics.getGravityForces=function(thisObject)
{
	var force=[0,0];
	
	force[0]=Physics.gravityX*Shapes.wholeworld[thisObject].mass;
	force[1]=Physics.gravityY*Shapes.wholeworld[thisObject].mass;
	
	return force;
}

//positon, speed, acceleration, time
Physics.eulerThis=function(x,v,a,t)
{
	//x=vt + 0.5at^2
	x+=v*t + 0.5*a*t*t;
	alert(x)
	return x;
}

Physics.eulerFindVelocity=function(x,v,a,t)
{
	//return speed aproximated by euler integration at time t
	return v+a*t;
}

Physics.replotentities=function()
{
	for (i=0;i<Shapes.wholeworld.length;i++)
	{
		if(Shapes.wholeworld[i].canMove && Shapes.wholeworld[i].alive)
		{
			//can move and alive
			Physics.ourspeed=Math.sqrt(Shapes.wholeworld[i].v[0]*Shapes.wholeworld[i].v[0]+Shapes.wholeworld[i].v[1]*Shapes.wholeworld[i].v[1]);
			var ourangle=Math.atan2(Shapes.wholeworld[i].v[1],Shapes.wholeworld[i].v[0]);
			
			//F=ma.  Objects can have built in constant force.
			var fx=Shapes.wholeworld[i].f[0];
			var fy=Shapes.wholeworld[i].f[1];
			
			//get forces from various things
			var gravityForce=Physics.getSpringForces(i);
			var springForce=Physics.getSpringForces(i);
			var chargeForce=Physics.getChargeForces(i);
			var frictionForce=Physics.getFrictionForces(i);
			
			fx+=gravityForce[0]+springForce[0]+chargeForce[0]+frictionForce[0];
			fy+=gravityForce[1]+springForce[1]+chargeForce[1]+frictionForce[1];
			
			//var tempvx=Math.cos(ourangle)*ourspeedfriction
			//var tempvy=Math.sin(ourangle)*ourspeedfriction
			
			var tempvx=Shapes.wholeworld[i].v[0];
			var tempvy=Shapes.wholeworld[i].v[1];
			
			var ax=fx/Shapes.wholeworld[i].mass
			var ay=fy/Shapes.wholeworld[i].mass
			
			if(typeof Response == 'undefined')
			{
				Reponse=new Object();
			}
			
			
			// runga kutta 4:
			// dy/dt = f(t,y)
			// Yn+1 = Yn + (1/6)*h*( K1 + 2K2 + 2K3 + K4 )
			// K1 = f(Tn,Yn)
			// K2 = f(Tn + 0.5h , Yn + 0.5*h*K1)
			// K3 = f(Tn + 0.5h , Yn + 0.5*h*K2)
			// K4 = f(Tn + h , Yn + hK3)
			
			//[x,y]
			var k1=[0,0];
			var k2=[0,0];
			var k3=[0,0];
			var k4=[0,0];
			
			k1[0]=Physics.eulerFindVelocity(Shapes.wholeworld[i].pos[0] , Shapes.wholeworld[i].v[0] , ax , Physics.timeperloop);
			k1[1]=Physics.eulerFindVelocity(Shapes.wholeworld[i].pos[1] , Shapes.wholeworld[i].v[1] , ay , Physics.timeperloop);
			
			k2[0]=Physics.eulerFindVelocity(Shapes.wholeworld[i].pos[0] + 0.5*Physics.timeperloop*k1[0] , Shapes.wholeworld[i].v[0] , ax , Physics.timeperloop*1.5);
			k2[1]=Physics.eulerFindVelocity(Shapes.wholeworld[i].pos[1] + 0.5*Physics.timeperloop*k1[1] , Shapes.wholeworld[i].v[1] , ay , Physics.timeperloop*1.5);
			
			k3[0]=Physics.eulerFindVelocity(Shapes.wholeworld[i].pos[0] + 0.5*Physics.timeperloop*k2[0] , Shapes.wholeworld[i].v[0] , ax , Physics.timeperloop*1.5);
			k3[1]=Physics.eulerFindVelocity(Shapes.wholeworld[i].pos[1] + 0.5*Physics.timeperloop*k2[1] , Shapes.wholeworld[i].v[1] , ay , Physics.timeperloop*1.5);			
			
			k4[0]=Physics.eulerFindVelocity(Shapes.wholeworld[i].pos[0] + Physics.timeperloop*k3[0] , Shapes.wholeworld[i].v[0] , ax , Physics.timeperloop*2);
			k4[1]=Physics.eulerFindVelocity(Shapes.wholeworld[i].pos[1] + Physics.timeperloop*k3[1] , Shapes.wholeworld[i].v[1] , ay , Physics.timeperloop*2);
			
			
			General.dalert([(1/6)*(k1[0] + 2*k2[0] + 2*k3[0] + k4[0]),k1[0]])
			Response.newx=Shapes.wholeworld[i].pos[0] + (1/6)*Physics.timeperloop*(k1[0] + 2*k2[0] + 2*k3[0] + k4[0]);
			Response.newy=Shapes.wholeworld[i].pos[1] + (1/6)*Physics.timeperloop*(k1[1] + 2*k2[1] + 2*k3[1] + k4[1]);
			
			if(Math.pow(Response.newx-Shapes.wholeworld[i].pos[0],2) +  Math.pow(Response.newy-Shapes.wholeworld[i].pos[1],2)> Physics.maxDistPerLoop*Physics.maxDistPerLoop)
			{
				var tempAngle=Math.atan2(Response.newy-Shapes.wholeworld[i].pos[1] , Response.newx-Shapes.wholeworld[i].pos[0]);
				Response.newx=Shapes.wholeworld[i].pos[0]+Math.cos(tempAngle)*Physics.maxDistPerLoop;
				Response.newy=Shapes.wholeworld[i].pos[1]+Math.sin(tempAngle)*Physics.maxDistPerLoop;
			}
			
			//alert([Shapes.wholeworld[i].pos[0],Response.newx])
			
			Response.newvx=(Response.newx-Shapes.wholeworld[i].pos[0])/Physics.timeperloop;
			Response.newvy=(Response.newy-Shapes.wholeworld[i].pos[1])/Physics.timeperloop;
			
//			alert(Response.newvx)
			
			//a=F/m
			//v=u+at
			
			//var ourspeedfriction=Physics.ourspeed-Physics.friction*Physics.ourspeed*Physics.timeperloop/Shapes.wholeworld[i].mass
			/*
			//v=u+at
			Response.newvy=tempvy+ay*Physics.timeperloop//Math.sin(ourangle)*ourspeedfriction
			Response.newvx=tempvx+ax*Physics.timeperloop //Math.cos(ourangle)*ourspeedfriction
			//optimisation, if we're not moving, don't faff about re-plotting our position - broken with polygons, need a resting contact system really.
			//      if(true){
			//Response.newvy!==0 || Response.newvx!==0 || !(followmouse===false || Response.newvw!==0)
			// if we're moving really slowly, and there's no force on us, then stop moving.
			if(tempvx*tempvx + tempvy*tempvy <=Physics.minspeed*Physics.minspeed && Shapes.wholeworld[i].f[0]==0 && Shapes.wholeworld[i].f[1]==0 && ax==0 && ay==0)
			{
				Response.newvx=0;
				Response.newvy=0;
			}
			//s=ut + 0.5at^2 therefore, Response.new position = old position + ut+1/2at^2
			Response.newx=(Shapes.wholeworld[i].v[0]*Physics.timeperloop+(1/2)*ax*Physics.timeperloop*Physics.timeperloop)+Shapes.wholeworld[i].pos[0]
			Response.newy=(Shapes.wholeworld[i].v[1]*Physics.timeperloop+(1/2)*ay*Physics.timeperloop*Physics.timeperloop)+Shapes.wholeworld[i].pos[1]
			*/
			Response.newvw=Shapes.wholeworld[i].v[2];
			Response.newangle=Shapes.wholeworld[i].angle+Shapes.wholeworld[i].v[2]*Physics.timeperloop;
			
			
			if(typeof Sandbox!=='undefined' && Sandbox.followmouse===i)
			{
				Response.newx=Sandbox.mouseX/Render.viewports[0].zoom+Render.viewports[0].x+Sandbox.mousedragdifference[0];
				Response.newy=Sandbox.mouseY/Render.viewports[0].zoom+Render.viewports[0].y+Sandbox.mousedragdifference[1];
				Sandbox.dragoldx=Shapes.wholeworld[i].pos[0];
				Sandbox.dragoldy=Shapes.wholeworld[i].pos[1];
			}
			
			
			if(Shapes.wholeworld[i].hard)
			{
				var isCollison=false;
				for (var i2=0;i2<Shapes.wholeworld.length;i2++)
				{
					if(Shapes.wholeworld[i2].hard==true && i!==i2 && Shapes.wholeworld[i2].alive)
					{
						var tempWasCollison=false;
						//(p1,d1,f1,a1,s1,p2,d2,f2,a2,a2,s2)
						if(Detect.checkcollide([Response.newx,Response.newy],Shapes.wholeworld[i].dimensions,Shapes.wholeworld[i].filled,Shapes.wholeworld[i].angle,Shapes.wholeworld[i].shape,Shapes.wholeworld[i2].pos,Shapes.wholeworld[i2].dimensions,Shapes.wholeworld[i2].filled,Shapes.wholeworld[i2].angle,Shapes.wholeworld[i2].shape))
						{
							//if there is a collision
							tempWasCollison=true;
							//switch(Shapes.wholeworld[i].gameType){
							//case 1: if(Shapes.wholeworld[i2].gameType==2){if(Shapes.wholeworld[i].name=='us'){Shapes.wholeworld[i].state=4;}else{Shapes.wholeworld[i].state=3}};break;
							//use this to detect stuff
							//}
							
							
							//end of there is a collision
						}
						
						//crude bit of checking to see if has moved far enough to need this
						else if((Shapes.wholeworld[i2].shape==0 && Math.abs(Response.newx-Shapes.wholeworld[i].pos[0]) + Math.abs(Response.newy-Shapes.wholeworld[i].pos[1]) > Shapes.wholeworld[i2].dimensions) && Detect.checkcollide([Response.newx,Response.newy],Shapes.wholeworld[i].pos,true,0,4,Shapes.wholeworld[i2].pos,Shapes.wholeworld[i2].dimensions,Shapes.wholeworld[i2].filled,Shapes.wholeworld[i2].angle,Shapes.wholeworld[i2].shape))
						{
							//check for jumped over an object by drawing a line between old and new pos
							tempWasCollison=true;
							
						}
						
						
						if(tempWasCollison)
						{
							isCollison=true;
							
							if(Shapes.wholeworld[i].shape==0 && Shapes.wholeworld[i2].shape==0)
							{//two circles
								Shapes.wholeworld[i].v=[Response.newvx,Response.newvy];
								Response.collideascircles(Shapes.wholeworld[i],Shapes.wholeworld[i2])
								
							}
							else if(Shapes.wholeworld[i].shape==3 || Shapes.wholeworld[i2].shape==3)
							{
								//polygon involved
								Response.collidewithpoly(i,i2);
							}
							else
							{
								//just treat as old-style squares.
								Response.collideassquares(Shapes.wholeworld[i],Shapes.wholeworld[i2])
							}
							
							if(Shapes.wholeworld[i2].canMove && Shapes.wholeworld[i].canMove)
							{
								Shapes.wholeworld[i2].v=[Response.theirnewvx,Response.theirnewvy,Response.theirnewvw];
							}
							//Response.newx=Shapes.wholeworld[i].x;Response.newy=Shapes.wholeworld[i].y;
							
							if (Physics.collisionPositionStuff) 
							{
								//this bit is Response.new (engine v1.48), the idea is to solve problems when a ball is stuck between two plates, or similar.
								//as of 2.54 it also helps with polygons getting stuck, but I can't seem to get rotation handled correctly
								//3.00 - found bug as to why things weren't working in 2.54
								var dx = Response.newx - Shapes.wholeworld[i].pos[0]
								var dy = Response.newy - Shapes.wholeworld[i].pos[1]
								var da = Response.newangle - Shapes.wholeworld[i].angle;
								//(p1,d1,f1,a1,s1,p2,d2,f2,a2,a2,s2)
								if (Detect.checkcollide([(Response.newx - dx / 4), (Response.newy - dy / 4)], Shapes.wholeworld[i].dimensions, Shapes.wholeworld[i].filled, (Response.newangle - da / 4), Shapes.wholeworld[i].shape, Shapes.wholeworld[i2].pos, Shapes.wholeworld[i2].dimensions, Shapes.wholeworld[i2].filled, Shapes.wholeworld[i2].angle, Shapes.wholeworld[i2].shape) !== true) 
								{
									Response.newx -= dx / 4;
									Response.newy -= dy / 4;
									Response.newangle -= da / 4;
								}
								if (Detect.checkcollide([(Response.newx - dx / 2), (Response.newy - dy / 2)], Shapes.wholeworld[i].dimensions, Shapes.wholeworld[i].filled, (Response.newangle - da / 2), Shapes.wholeworld[i].shape, Shapes.wholeworld[i2].pos, Shapes.wholeworld[i2].dimensions, Shapes.wholeworld[i2].filled, Shapes.wholeworld[i2].angle, Shapes.wholeworld[i2].shape) !== true) 
								{
									Response.newx -= dx / 2;
									Response.newy -= dy / 2;
									Response.newangle -= da / 2;
								}
								if (Detect.checkcollide([(Response.newx - dx * 3 / 4), (Response.newy - dy * 3 / 4)], Shapes.wholeworld[i].dimensions, Shapes.wholeworld[i].filled, (Response.newangle - da * 3 / 4), Shapes.wholeworld[i].shape, Shapes.wholeworld[i2].pos, Shapes.wholeworld[i2].dimensions, Shapes.wholeworld[i2].filled, Shapes.wholeworld[i2].angle, Shapes.wholeworld[i2].shape) !== true) 
								{
									Response.newx -= (dx / 4) * 3;
									Response.newy -= (dy / 4) * 3;
									Response.newangle -= da * 3 / 4;
								}
								else 
								{
									//can't move, so don't move.
									Response.newx = Shapes.wholeworld[i].pos[0];
									Response.newy = Shapes.wholeworld[i].pos[1];
									Response.newangle = Shapes.wholeworld[i].angle;
								}
								
								Shapes.wholeworld[i].v = [Response.newvx, Response.newvy, Response.newvw];
								Shapes.wholeworld[i].angle = Response.newangle
								
								Response.newvx *= (Shapes.wholeworld[i].elastic + Shapes.wholeworld[i2].elastic) / 2
								Response.newvy *= (Shapes.wholeworld[i].elastic + Shapes.wholeworld[i2].elastic) / 2
							}//end of if extra collision stuff enabled
							
						}
						
						//end of collidable if statement
					}
					//end of i2 (collision) loop
				}
				//end of if i is hard
				
				if(!isCollison)
				{
					Physics.noCollisionOccured();
				}
			}
			/*
			for (var i2=0;i2<connections.length;i2++)
			{
			if(connections[i2].hard==true && connections[i2].state==1 && connections[i2].to!==i && connections[i2].from!==i)
			{//using second set of co-ords of line in place of width and height of line
			if(checkcollide(Response.newx,Response.newy,Shapes.wholeworld[i].width,Shapes.wholeworld[i].height,Shapes.wholeworld[i].shape,Shapes.wholeworld[connections[i2].to].x+Shapes.wholeworld[connections[i2].to].width/2,Shapes.wholeworld[connections[i2].to].y+Shapes.wholeworld[connections[i2].to].height/2,Shapes.wholeworld[connections[i2].from].x+Shapes.wholeworld[connections[i2].from].width/2,Shapes.wholeworld[connections[i2].from].y+Shapes.wholeworld[connections[i2].from].height/2,4,Shapes.wholeworld[i],false))
			{//if there is a collision between an object TO BE MOVED and an existing connection
			
			
			Response.newvx*=-1
			Response.newvy*=-1
			Response.newx=Shapes.wholeworld[i].x;Response.newy=Shapes.wholeworld[i].y;
			
			Shapes.wholeworld[connections[i2].to].vx*=-1
			Shapes.wholeworld[connections[i2].to].vy*=-1
			
			Shapes.wholeworld[connections[i2].from].vx*=-1
			Shapes.wholeworld[connections[i2].from].vy*=-1
			
			
			//end of if connection collision
			}
			//end of connection hard if
			}
			//end of connection collision loop
			}
			
			
			//if the thing which is being moved has things connected to it, those connections might collide
			for(var i2=0;i2<Shapes.wholeworld[i].connected.length;i2++)
			{
			var checkcollidestuff=checkforanycollide4(Shapes.wholeworld[connections[Shapes.wholeworld[i].connected[i2]].to].x+Shapes.wholeworld[connections[Shapes.wholeworld[i].connected[i2]].to].width/2,Shapes.wholeworld[connections[Shapes.wholeworld[i].connected[i2]].to].y+Shapes.wholeworld[connections[Shapes.wholeworld[i].connected[i2]].to].height/2,Shapes.wholeworld[connections[Shapes.wholeworld[i].connected[i2]].from].x+Shapes.wholeworld[connections[Shapes.wholeworld[i].connected[i2]].from].width/2,Shapes.wholeworld[connections[Shapes.wholeworld[i].connected[i2]].from].y+Shapes.wholeworld[connections[Shapes.wholeworld[i].connected[i2]].from].height/2,4,connections[Shapes.wholeworld[i].connected[i2]].from,connections[Shapes.wholeworld[i].connected[i2]].to)
			if(checkcollidestuff!==false)
			{
			//one of the connections attacthed to this object has collided with something else
			
			Shapes.wholeworld[connections[Shapes.wholeworld[i].connected[i2]].to].vx*=-1
			Shapes.wholeworld[connections[Shapes.wholeworld[i].connected[i2]].to].vy*=-1
			
			Shapes.wholeworld[connections[Shapes.wholeworld[i].connected[i2]].from].vx*=-1
			Shapes.wholeworld[connections[Shapes.wholeworld[i].connected[i2]].from].vy*=-1
			
			Shapes.wholeworld[checkcollidestuff].vx*=-1
			Shapes.wholeworld[checkcollidestuff].vy*=-1
			
			Response.newvx*=-1
			Response.newvy*=-1
			Response.newx=Shapes.wholeworld[i].x;Response.newy=Shapes.wholeworld[i].y;
			
			}
			
			}
			*/
			
			Shapes.wholeworld[i].v=[Response.newvx,Response.newvy,Response.newvw];
			Shapes.wholeworld[i].pos=[Response.newx,Response.newy];
			Shapes.wholeworld[i].angle=Response.newangle;
			
		//end of if can move and alive statement
		}
		//end of Shapes.wholeworld loop 
	}
	//end of replotentities()
}
	
/*
 * new replot entities idea:
 * loop through all objects, checking if can move as per usual
 * 
 * 
 */

//connects two objects with a spring
Physics.connect=function(one,two,strength,howfar,graphics,type,hard)
  {
	if(howfar===false)
	  {
		//don't pre-set it, but set it as the current distance
		var x1=Shapes.wholeworld[one].pos[0];
		var y1=Shapes.wholeworld[one].pos[1];
		var x2=Shapes.wholeworld[two].pos[0];
		var y2=Shapes.wholeworld[two].pos[1];
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
	if(typeof Render !=='undefined')
  	{
  	this.draw=Render.drawConnection;
  	}
	this.breakConnection=Physics.breakConnection
}

Physics.breakConnection=function()
  {
	//go and splice all the arrays stored in each object attacted to the spring, and then delete the spring object and splice that from the connections array
	//springlines.splice(this.arraypos, 1)
	Physics.connections[this.arraypos].alive=false;
	
	for(var k=0;k<Shapes.wholeworld[this.from].connected.length;k++)
    {
		if(Shapes.wholeworld[this.from].connected[k]==this.arraypos)
		  {
			Shapes.wholeworld[this.from].connected.splice(k,1);
			}
		}

	for(var k=0;k<Shapes.wholeworld[this.to].connected.length;k++)
	  {
		if(Shapes.wholeworld[this.to].connected[k]==this.arraypos)
		  {
			Shapes.wholeworld[this.to].connected.splice(k,1);
			}
		}
	//Physics.connections.splice(this.arraypos,1)
  }

//breaks all the springs connected to an entity
Physics.cutFree=function()
  {
	while(this.connected.length>0)
	  {
		Physics.connections[this.connected[0]].breakConnection();
		}
	}

Physics.makeCharged = function(chargeme)//if not 0 then gives an object a charge, if 0 then removes charge
{
	if (chargeme == 0) 
	{
		if (this.charged) 
		{
			this.charged = false;
			this.charge = 0;
			Physics.chargedobjects.splice(this.chargearraypos, 1);
		}
		
	}
	else 
	{
		if (this.charged)//already got a charge, so wipe it first
		{
			this.charged = false;
			this.charge = 0;
			Physics.chargedobjects.splice(this.chargearraypos, 1);
		}
		
		this.charge = chargeme;
		this.charged = true;
		this.chargearraypos = Physics.chargedobjects.length
		Physics.chargedobjects.push(this);
	}
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

//makes an object disapear
Physics.kill=function()
  {
	this.alive=false;
	this.cutFree();
	this.makeCharged(0);
	//Render.redrawworld();
	}

//brings entity back
Physics.unkill=function()
  {
	if (checkforanycollide(this)!==false)
    {
		this.state=true;
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

