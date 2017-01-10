

Sandbox.pauseloop=function()
  {
  //if the mouse is dragging something, move it:
  if(Sandbox.followmouse!==false)
    {
    if(Shapes.wholeworld[followmouse].gametype!==0)
      {
			//if we're not colliding or don't want collision detection
      if(document.getElementById('dragcollisions').checked==false || Detect.checkforanycollide2(Shapes.wholeworld[followmouse],UI.mouseX/Render.viewports[0].zoom+Render.viewports[0].x+mousedragdifference[0],UI.mouseY/Render.viewports[0].zoom+Render.viewports[0].y+UI.mousedragdifference[1])===false)
        {
        Shapes.wholeworld[followmouse].x=UI.mouseX/Render.viewports[0].zoom+Render.viewports[0].x+UI.mousedragdifference[0];
        Shapes.wholeworld[followmouse].y=UI.mouseY/Render.viewports[0].zoom+Render.viewports[0].y+UI.mousedragdifference[1];
        redrawworld();
        }
  		}
		}
  
  if(Sandbox.drawingshape)
    {
    switch(Sandbox.newshape)
      {
      case 1://rectangle
        Render.redrawworld();
        
        var tempheight=Math.abs(newshapecoords[1]*Render.viewports[0].zoom+Render.viewports[0].y-mouseY)/Render.viewports[0].zoom//*2
        var tempwidth=Math.abs(newshapecoords[0]*Render.viewports[0].zoom+Render.viewports[0].x-mouseX)/Render.viewports[0].zoom//*2
        
        if(checkforanycollide3(newshapecoords[0]/Render.viewports[0].zoom+Render.viewports[0].x+tempwidth/2,newshapecoords[1]/Render.viewports[0].zoom+Render.viewports[0].y+tempheight/2,tempwidth*1,tempheight*1,1)===false || document.getElementById('drawrectanglecolision').checked==false)
          {
          Render.viewports[0].canvas.strokeStyle = 'black'
          Render.viewports[0].canvas.strokeRect((newshapecoords[0]-Render.viewports[0].x)*Render.viewports[0].zoom,(newshapecoords[1]-Render.viewports[0].y)*Render.viewports[0].zoom,tempwidth*Render.viewports[0].zoom,tempheight*Render.viewports[0].zoom);
          }
				else
				  {
					//colliding with something
          Render.viewports[0].canvas.strokeStyle = 'red'
          Render.viewports[0].canvas.strokeRect((newshapecoords[0]-Render.viewports[0].x)*Render.viewports[0].zoom,(newshapecoords[1]-Render.viewports[0].y)*Render.viewports[0].zoom,tempwidth*Render.viewports[0].zoom,tempheight*Render.viewports[0].zoom);
          }
      break;
      case 3://polygon
        //if drawing a new shape
        newshapeXs.push(mouseX);
        newshapeYs.push(mouseY);
        if (newshapeXs.length>2)
          {
          Render.viewports[0].canvas.beginPath();
          Render.viewports[0].canvas.strokeStyle='black';
          Render.viewports[0].canvas.lineWidth=2;
          Render.viewports[0].canvas.moveTo(newshapeXs[newshapeXs.length-2],newshapeYs[newshapeYs.length-2]);
          Render.viewports[0].canvas.lineTo(mouseX,mouseY)
          Render.viewports[0].canvas.stroke();
          }//end of length>2
      break;
      }//end of newshape switch
    
    }//end of drawingshape
  
  Sandbox.rotatestuff()
  }

Sandbox.rotatestuff=function()
  {
  if(mouserotate!==false)
    {
    var oldrotateangle=Math.atan2(Shapes.wholeworld[mouserotate].y-prerotatey,Shapes.wholeworld[mouserotate].x-prerotatex)
    var newrotateangle=Math.atan2(Shapes.wholeworld[mouserotate].y-mouseY,Shapes.wholeworld[mouserotate].x-mouseX)
    
    var testangle=Shapes.wholeworld[mouserotate].angle+(newrotateangle-oldrotateangle);
    if(document.getElementById('rotatecollisions').checked==false || Detect.checkforanycollide2b(Shapes.wholeworld[mouserotate],testangle)===false)
      {
      Shapes.wholeworld[mouserotate].angle=testangle;
      prerotatex=mouseX;
      prerotatey=mouseY;
      if(paused)
			  {
				redrawworld();
				}
      }
    //end of mouserotate
    }
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
  
  var testnewx=(testnewvx*times+1/2*testax*timeperloop*timeperloop)+Shapes.wholeworld[i].x
  var testnewy=(testnewvy*times+1/2*testay*timeperloop*timeperloop)+Shapes.wholeworld[i].y
  return[testnewx,testnewy];
  }

function replotentities()
  {
  for (i=0;i<Shapes.wholeworld.length;i++)
    {
    if(Shapes.wholeworld[i].canMove && Shapes.wholeworld[i].alive)
      {
      //can move and alive
      Physics.ourspeed=Math.sqrt(Shapes.wholeworld[i].v[0]*Shapes.wholeworld[i].v[0]+Shapes.wholeworld[i].v[1]*Shapes.wholeworld[i].v[1])
      
      var ourangle=Math.atan2(Shapes.wholeworld[i].v[1],Shapes.wholeworld[i].v[0]);
      
      //F=-bV
      //a=F/m
      //v=u+at
      
      var ourspeedfriction=ourspeed-Physics.friction*ourspeed*Physics.timeperloop/Shapes.wholeworld[i].mass
     
      //acceleration of object to be updated; f=ma therefore a=f/m
      var fx=Shapes.wholeworld[i].fx+Physics.gravityX*Shapes.wholeworld[i].mass//-Shapes.wholeworld[i].vx
      var fy=Shapes.wholeworld[i].fy+Physics.gravityY*Shapes.wholeworld[i].mass//-Shapes.wholeworld[i].vy
      
      if(Shapes.wholeworld[i].charged)
        {
				for(var k=0;k<Physics.chargedobjects.length;k++)
          {
  				if(Physics.chargedobjects[k].name!==Shapes.wholeworld[i].name)
            {
    				var rsqrd=Math.pow(Shapes.wholeworld[i].x-Physics.chargedobjects[k].x,2)+Math.pow(Shapes.wholeworld[i].y-Physics.chargedobjects[k].y,2)
            //coloumbs law:
            //f=k.q1.q2/r^2
            var coulombforce=8990000000*Physics.chargedobjects[k].charge*Shapes.wholeworld[i].charge/rsqrd
            var coulombangle=Math.atan2(Shapes.wholeworld[i].y-Physics.chargedobjects[k].y,Shapes.wholeworld[i].x-Physics.chargedobjects[k].x)
            fy+=Math.sin(coulombangle)*coulombforce
            fx+=Math.cos(coulombangle)*coulombforce
      			}
    			}
  			}
      
      var tempvx=Math.cos(ourangle)*ourspeedfriction
      var tempvy=Math.sin(ourangle)*ourspeedfriction
      
      for(var k=0;k<Shapes.wholeworld[i].connected.length;k++)
        {
        switch(connections[Shapes.wholeworld[i].connected[k]].type)
          {
          case 0:
  					//if this connection is a spring
            if(connections[Shapes.wholeworld[i].connected[k]].to!==i)
              {
  						var them=connections[Shapes.wholeworld[i].connected[k]].to;
  						}
            else
  					  {
            	var them=connections[Shapes.wholeworld[i].connected[k]].from;
  						}
            
            var tempspringstrength=connections[Shapes.wholeworld[i].connected[k]].connectionstrength;
            var tempspringlength=connections[Shapes.wholeworld[i].connected[k]].connectionlength;
            
            var themx=Shapes.wholeworld[them].x;
            var themy=Shapes.wholeworld[them].y;
            
            //alert(themx)
            //Hooke's Law:
            //F=-kx
            var springvar = Physics.springforce(Shapes.wholeworld[i].x,themx,Shapes.wholeworld[i].y,themy,tempspringstrength,tempspringlength)
            //(Shapes.wholeworld[us].x+Shapes.wholeworld[us].width/2)-themx,(Shapes.wholeworld[us].y+Shapes.wholeworld[us].height/2)-themy
            
            //force from current position
            var testfy=Math.sin(springvar[2])*springvar[1]//+Shapes.wholeworld[i].vx
            var testfx=Math.cos(springvar[2])*springvar[1]//+Shapes.wholeworld[i].vy
            
            //force from one loop's time if the above force were applied
            var testpositions=Physics.posfromforce(tempvx,tempvy,testfx,testfy,ourangle,ourspeedfriction,timeperloop/2);
            springvar = Physics.springforce(testpositions[0],themx,testpositions[1],themy,tempspringstrength,tempspringlength)
            var testfy2=Math.sin(springvar[2])*springvar[1]
            var testfx2=Math.cos(springvar[2])*springvar[1]
            
            //force on thingy if it moved using average of above two forces
            testpositions=Physics.posfromforce(tempvx,tempvy,(testfx+testfx2)/2,(testfy+testfy2)/2,ourangle,ourspeedfriction,timeperloop);
            springvar = Physics.springforce(testpositions[0],themx,testpositions[1],themy,tempspringstrength,tempspringlength)
            var testfy3=Math.sin(springvar[2])*springvar[1]
            var testfx3=Math.cos(springvar[2])*springvar[1]
            
            fy+=(testfy+testfy2+testfy3)/3 + Shapes.wholeworld[them].fy//this seems to help with balloons, though I'm not too sure how realistic it is.
            fx+=(testfx+testfx2+testfx3)/3 + Shapes.wholeworld[them].fx
            //end of if connection is a spring
          break;
          }
        //end of connections loop
        }
      
      var ax=fx/Shapes.wholeworld[i].mass
      var ay=fy/Shapes.wholeworld[i].mass

      //v=u+at
      newvy=Math.sin(ourangle)*ourspeedfriction+ay*timeperloop
      newvx=Math.cos(ourangle)*ourspeedfriction+ax*timeperloop
      
      //optimisation, if we're not moving, don't faff about re-plotting our position - broken with polygons, need a resting contact system really.
      if(true){//newvy!==0 || newvx!==0 || !(followmouse===false || newvw!==0)
      // if we're moving really slowly, and there's no force on us, then stop moving.
      if(ourspeedfriction <=Physics.minspeed && Shapes.wholeworld[i].fx==0 && Shapes.wholeworld[i].fy==0 && ax==0 && ay==0)
			  {
				newvx=0;
				newvy=0;
				}
      //s=ut + 0.5at^2 therefore, new position = old position + ut+1/2at^2
      newx=(Shapes.wholeworld[i].vx*Physics.timeperloop+1/2*ax*Physics.timeperloop*Physics.timeperloop)+Shapes.wholeworld[i].x
      newy=(Shapes.wholeworld[i].vy*Physics.timeperloop+1/2*ay*Physics.timeperloop*Physics.timeperloop)+Shapes.wholeworld[i].y
      
      newvw=Shapes.wholeworld[i].vw;
      newangle=Shapes.wholeworld[i].angle+Shapes.wholeworld[i].vw*Physics.timeperloop;
      
      
      if(followmouse==i)
  			{
        newx=mouseX/Render.viewports[0].zoom+Render.viewports[0].x+mousedragdifference[0];newy=mouseY/Render.viewports[0].zoom+Render.viewports[0].y+mousedragdifference[1];
        dragoldx=Shapes.wholeworld[i].x;
        dragoldy=Shapes.wholeworld[i].y;
  			}
      
      
      if(Shapes.wholeworld[i].hard)
        {
        for (var i2=0;i2<Shapes.wholeworld.length;i2++)
          {
          if(Shapes.wholeworld[i2].hard==true && i!==i2 && Shapes.wholeworld[i2].alive)
            {
						//(p1,d1,f1,a1,s1,p2,d2,f2,a2,a2,s2)
            if(checkcollide([newx,newy],Shapes.wholeworld[i].dimensions,Shapes.wholeworld[i].filled,Shapes.wholeworld[i].angle,Shapes.wholeworld[i].shape,Shapes.wholeworld[i2].pos,Shapes.wholeworld[i2].dimensions,Shapes.wholeworld[i2].filled,Shapes.wholeworld[i2].angle,Shapes.wholeworld[i2].angle,Shapes.wholeworld[i2].shape))
              {
  						//if there is a collision
              
              //switch(Shapes.wholeworld[i].gametype){
              //case 1: if(Shapes.wholeworld[i2].gametype==2){if(Shapes.wholeworld[i].name=='us'){Shapes.wholeworld[i].state=4;}else{Shapes.wholeworld[i].state=3}};break;
              //use this to detect stuff
              //}
  
              if(Shapes.wholeworld[i].shape==0 && Shapes.wholeworld[i2].shape==0)
                {//two circles
                Shapes.wholeworld[i].vx=newvx
                Shapes.wholeworld[i].vy=newvy
                collideascircles(Shapes.wholeworld[i],Shapes.wholeworld[i2])
                
                }
  						else if(Shapes.wholeworld[i].shape==3 || Shapes.wholeworld[i2].shape==3)
                {
  							//polygon involved
                collidewithpoly(i,i2);
                }
              else
                {
  							//just treat as old-style squares.
                collideassquares(Shapes.wholeworld[i],Shapes.wholeworld[i2])
                }
              
              if(Shapes.wholeworld[i2].canMove && Shapes.wholeworld[i].canMove)
  						  {
  							Shapes.wholeworld[i2].v=[theirnewvx,theirnewvy,theirnewvw];
  							}
              //newx=Shapes.wholeworld[i].x;newy=Shapes.wholeworld[i].y;
              
              
              //this bit is new (engine v1.48), the idea is to solve problems when a ball is stuck between two plates, or similar.
              //as of 2.54 it also helps with polygons getting stuck, but I can't seem to get rotation handled correctly
  						//3.00 - found bug as to why things weren't working in 2.54
              var dx=newx-Shapes.wholeworld[i].pos[0]
              var dy=newy-Shapes.wholeworld[i].pos[1]
              var da=newangle-Shapes.wholeworld[i].angle;
  						//(p1,d1,f1,a1,s1,p2,d2,f2,a2,a2,s2)
              if(Detect.checkcollide([(newx-dx/4),(newy-dy/4)],Shapes.wholeworld[i].dimensions,Shapes.wholeworld[i].filled,(newangle-da/4),Shapes.wholeworld[i].shape,Shapes.wholeworld[i2].pos,Shapes.wholeworld[i2].dimensions,Shapes.wholeworld[i2].filled,Shapes.wholeworld[i2].angle,Shapes.wholeworld[i2].shape)!==true)
  						  {
  							newx-=dx/4;
  							newy-=dy/4;
  							newangle-=da/4;
  							}
              if(Detect.checkcollide([(newx-dx/2),(newy-dy/2)],Shapes.wholeworld[i].dimensions,Shapes.wholeworld[i].filled,(newangle-da/2),Shapes.wholeworld[i].shape,Shapes.wholeworld[i2].pos,Shapes.wholeworld[i2].dimensions,Shapes.wholeworld[i2].filled,Shapes.wholeworld[i2].angle,Shapes.wholeworld[i2].shape)!==true)
  						  {
  							newx-=dx/2;
  							newy-=dy/2;
  							newangle-=da/2;
  							}
              if(Detect.checkcollide([(newx-dx*3/4),(newy-dy*3/4)],Shapes.wholeworld[i].dimensions,Shapes.wholeworld[i].filled,(newangle-da*3/4),Shapes.wholeworld[i].shape,Shapes.wholeworld[i2].pos,Shapes.wholeworld[i2].dimensions,Shapes.wholeworld[i2].filled,Shapes.wholeworld[i2].angle,Shapes.wholeworld[i2].shape)!==true)
  						  {
  							newx-=(dx/4)*3;
  							newy-=(dy/4)*3;
  							newangle-=da*3/4;
  							}
              else
  						  {
  							//can't move, so don't move.
              	newx=Shapes.wholeworld[i].pos[0];
  							newy=Shapes.wholeworld[i].pos[1];
  							newangle=Shapes.wholeworld[i].angle;
                }
  
              Shapes.wholeworld[i].v=[newvx,newvy,newvw];
              Shapes.wholeworld[i].angle=newangle
  
              newvx*=(Shapes.wholeworld[i].elastic+Shapes.wholeworld[i2].elastic)/2
              newvy*=(Shapes.wholeworld[i].elastic+Shapes.wholeworld[i2].elastic)/2
              
              //end of there is a collision
              }
            //end of collidable if statement
            }
          //end of i2 (collision) loop
          }
        //end of if i is hard
        }
      /*
      for (var i2=0;i2<connections.length;i2++)
      {
      if(connections[i2].hard==true && connections[i2].state==1 && connections[i2].to!==i && connections[i2].from!==i)
      {//using second set of co-ords of line in place of width and height of line
      if(checkcollide(newx,newy,Shapes.wholeworld[i].width,Shapes.wholeworld[i].height,Shapes.wholeworld[i].shape,Shapes.wholeworld[connections[i2].to].x+Shapes.wholeworld[connections[i2].to].width/2,Shapes.wholeworld[connections[i2].to].y+Shapes.wholeworld[connections[i2].to].height/2,Shapes.wholeworld[connections[i2].from].x+Shapes.wholeworld[connections[i2].from].width/2,Shapes.wholeworld[connections[i2].from].y+Shapes.wholeworld[connections[i2].from].height/2,4,Shapes.wholeworld[i],false))
      {//if there is a collision between an object TO BE MOVED and an existing connection
      
      //alert('now what?')
      
      newvx*=-1
      newvy*=-1
      newx=Shapes.wholeworld[i].x;newy=Shapes.wholeworld[i].y;
      
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
      
      newvx*=-1
      newvy*=-1
      newx=Shapes.wholeworld[i].x;newy=Shapes.wholeworld[i].y;
      
      }
      
      }
      */
      Shapes.wholeworld[i].v=[newvx,newvy,newvw];
      Shapes.wholeworld[i].pos=[newx,newy];
      Shapes.wholeworld[i].angle=newangle;
      
      //end of if we're moving statement
      }
      
      //end of if can move and alive statement
      }
    //end of Shapes.wholeworld loop 
    }
  //end of replotentities()
  }


Sandbox.togglepause=function()
  {
  if(Sandbox.paused)
	  {
    clearInterval(Sandbox.loopme);
    Sandbox.paused=false;Sandbox.loopme=setInterval(Sandbox.loop,Physics.refreshrate);
    document.getElementById("pausebutton").value="Pause";
    }
  else
	  {
    paused=true;
		clearInterval(loopme);
		document.getElementById("pausebutton").value="Play";
    Sandbox.loopme=setInterval(Sandbox.pauseloop,Physics.refreshrate);
    }
  }

Sandbox.minimiseminimap=function()
  {
  document.getElementById('minimapwindowdiv').style.position='absolute';
  document.getElementById('minimapwindowdiv').style.top=570;
  document.getElementById('minimapwindowdiv').style.left=10;
  }

Sandbox.updateworldsize=function()
  {
  //borders of world - oldstyle/small or big. 
  
  switch(document.getElementById('smallworld').checked)
    {
		case true:
      Sandbox.worldissmall=true;
      Shapes.wholeworld[0].visible=false;
      Shapes.wholeworld[2].x=0;Shapes.wholeworld[2].y=-48900;
      Shapes.wholeworld[3].x=-49200;Shapes.wholeworld[3].y=90000;
      Shapes.wholeworld[4].x=50800;Shapes.wholeworld[4].y=90000;
      Sandbox.minimapwindow.CloseWindow();
      Render.viewports[0].x=0;Render.viewports[0].y=0;Render.viewports[0].zoom=1;
      Render.viewports[1].enabled=false;
    break;
    case false:
      Sandbox.worldissmall=false;
      Shapes.wholeworld[0].visible=true;
      Shapes.wholeworld[2].x=0;Shapes.wholeworld[2].y=-51100;
      Shapes.wholeworld[3].x=-50800;Shapes.wholeworld[3].y=90000;
      Shapes.wholeworld[4].x=52400;Shapes.wholeworld[4].y=90000;
      Sandbox.minimapwindow.OpenWindow();
      Render.viewports[1].enabled=true;
    break;
		}
  }

Sandbox.finishshape=function()
  {
  var totalXs=0;
  for(var i=0;i<Sandbox.newShapeXs.length;i++)
    {
    Sandbox.newShapeXs[i]=Sandbox.newShapeXs[i]/Render.viewports[0].zoom+Render.viewports[0].x;
    totalXs+=Sandbox.newShapeXs[i];
    }

  var midx=totalXs/Sandbox.newShapeXs.length;

  var totalYs=0;
  for(var i=0;i<Sandbox.newShapeYs.length;i++)
    {
    Sandbox.newShapeYs[i]=Sandbox.newShapeYs[i]/Render.viewports[0].zoom+Render.viewports[0].y;
    totalYs+=Sandbox.newShapeYs[i];
    }
  var midy=totalYs/Sandbox.newShapeYs.length;
  
  var finalXs=new Array();
  var finalYs=new Array();
  
  finalXs[0]=Sandbox.newShapeXs[0];
  finalYs[0]=Sandbox.newShapeYs[0];
  
  var lastpoint=0;
  
  for(var i=0;i<Sandbox.newShapeXs.length;i++)
    {
  	var i2=(i+1)%Sandbox.newShapeXs.length;
    var i3=(i+2)%Sandbox.newShapeXs.length;
  	
    var totalangle=0;
    for(var j=lastpoint;j<i2;j++)
      {
  		//go through all the points since the last 'final point'
      var j2=(j+1)%Sandbox.newShapeXs.length;
      var lp2=(lastpoint+1)%Sandbox.newShapeXs.length;
      totalangle+=Math.atan2(Sandbox.newShapeYs[j2]-Sandbox.newShapeYs[j],Sandbox.newShapeXs[j2]-Sandbox.newShapeXs[j])-Math.atan2(Sandbox.newShapeYs[lp2]-Sandbox.newShapeYs[lastpoint],Sandbox.newShapeXs[lp2]-Sandbox.newShapeXs[lastpoint]);
      }
  	
    if(Math.abs(totalangle)>Math.PI/8)
      {
      finalXs.push(Sandbox.newShapeXs[i2]);
      finalYs.push(Sandbox.newShapeYs[i2]);
      lastpoint=i;
      }
    
    }//end of points loop
  
  for(var i=0;i<finalXs.length;i++)
    {
    finalXs[i]=finalXs[i]-midx;
    finalYs[i]=finalYs[i]-midy;
    }

	//Shapes.polygon=function(alive,canMove,pos,angle,Xs,Ys,mass,colour,v,f,hard,filled,visible,gameType,elastic)
	
  new Shapes.polygon(true,false,[midx,midy],0,finalXs,finalYs,100,2,[0,0,0],[0,0,0],true,true,true,1,1)
  }

function finishrectangle()
  {
  var tempheight=Math.abs(Sandbox.newShapecoords[1]*Render.viewports[0].zoom+Render.viewports[0].y-UI.mouseY)/Render.viewports[0].zoom//*2
  var tempwidth=Math.abs(Sandbox.newShapecoords[0]*Render.viewports[0].zoom+Render.viewports[0].x-UI.mouseX)/Render.viewports[0].zoom//*2
  
  if(Detect.checkforanycollide3(Sandbox.newShapecoords[0]/Render.viewports[0].zoom+Render.viewports[0].x+tempwidth/2,Sandbox.newShapecoords[1]/Render.viewports[0].zoom+Render.viewports[0].y+tempheight/2,tempwidth*1,tempheight*1,1)===false || document.getElementById('drawrectanglecolision').checked==false)
    {
    var testpolygon=new polygon(1,'poly'+created,Sandbox.newShapecoords[0]+tempwidth/2,Sandbox.newShapecoords[1]+tempheight/2,[-tempwidth/2,tempwidth/2,tempwidth/2,-tempwidth/2],[-tempheight/2,-tempheight/2,tempheight/2,tempheight/2],100,'red',0,0,0,0,0,0,0,true,true,true,1,1)
    created++
    }
  }
/*
// variables to hold mouse x-y position
var mouseX = 0
var mouseY = 0
var realmouseX = 0
var realmouseY = 0
var oldmouseX = 0
var oldmouseY = 0
var changeinX=0;
var changeinY=0;
var oldtop
var oldleft
var mousediffinx
var mousediffiny
*/

Sandbox.mousein=false;

//this is called anytime the mouse button is released on the page. Stops windows 'sticking' to the mouse
IU.finalmouseup=function()
  {//stop an object being dragged
  if(followmouse!==false && !document.getElementById('dragmomentum').checked)
    {
    var movedx=Shapes.wholeworld[Sandbox.followmouse].pos[0]-Sandbox.dragoldx;
    var movedy=Shapes.wholeworld[Sandbox.followmouse].pos[1]-Sandbox.dragoldy;
    //without this check things go screwy when paused
    if(!Sandbox.paused)
      {
      Shapes.wholeworld[Sandbox.followmouse].v[0]=movedx*0.4/Physics.timeperloop;
      Shapes.wholeworld[Sandbox.followmouse].v[1]=movedy*0.4/Physics.timeperloop;
      }
    else
		  {
			Shapes.wholeworld[Sandbox.followmouse].v[0]=0;
    	Shapes.wholeworld[Sandbox.followmouse].v[1]=0;
			}
    }
    Sandbox.dragworld=false;
    Sandbox.followmouse=false;
    Sandbox.mouserotate=false;
    if(Sandbox.drawingshape)
      {
      switch(Sandbox.newShape)
      {
      case 1:
      Sandbox.finishrectangle();
      break;
      case 3:
      Sandbox.finishshape();
      break;
      }
      Sandbox.drawingshape=false;
      
			if(!Sandbox.pausedbeforedrawingshape)
			  {
				togglepause();
				}
			else
			  {
				redrawworld();
				}
      }
  
  if(Sandbox.worldissmall!==document.getElementById('smallworld').checked)
    {
    Sandbox.updateworldsize()
    }

  //stop windows being dragged
  for(var i=0;i<windows.length;i++)
	  {
		windows[i].moveme=false;
		}
	}

//detect IE or not for mouse capture
//if (document.all){var IE=true}else{var IE = false}
//is this still needed? (21-08-08)
if (!IE)
  {
	document.captureEvents(Event.MOUSEMOVE);
	}

Sandbox.getMouseXY=function(e)
  {
	if(IE)
  	{
    //grab the x-y pos.s if browser is IE
    UI.mouseX = event.clientX + document.body.scrollLeft-13
    UI.mouseY = event.clientY + document.body.scrollTop-18
    UI.realmouseX = event.clientX + document.body.scrollLeft//-13
    UI.realmouseY = event.clientY + document.body.scrollTop//-18
    }
	else
	  {
    //grab the x-y pos.s if browser is NS
    UI.mouseX = e.pageX-8
    UI.mouseY = e.pageY-8
    UI.realmouseX = e.pageX//-8
    UI.realmouseY = e.pageY//-8
    }
  //catch possible negative values in NS4
  if (UI.mouseX < 0){UI.mouseX = 0}
  if (UI.mouseY < 0){UI.mouseY = 0}
  //this will do things with the mouse movement
  Sandbox.checkmice();
  UI.oldmouseX=UI.mouseX;
  UI.oldmouseY=UI.mouseY;
	}
  
  //see where the mouse is, and if a window needs to be moved
Sandbox.checkmice=function()
  {
	for(var i=0;i<windows.length;i++)
    {
  	if (windows[i].moveme == true)//moveing a window
      {
    	var oldwidth=tonumber(document.getElementById(windows[i].title).style.width)
      var oldheight=tonumber(document.getElementById(windows[i].divname).style.height)
      var offset=getScrollXY();
      var screenwidth = document.body.clientWidth*1+offset[0];
      var screenheight = document.body.clientHeight*1+offset[1];
      var newleft =	UI.realmouseX-UI.mousediffinx;
      var newtop = UI.realmouseY-UI.mousediffiny;
      //find out if you're trying to drag the window off the bottom and right edges of the screen
      var newright =	UI.realmouseX+oldwidth-UI.mousediffinx+20
      var newbottom = UI.realmouseY+oldheight+20
      if (newright > screenwidth){newleft=screenwidth-oldwidth-20}
      if (newbottom > screenheight){newtop=screenheight-oldheight-32}
      if (newleft < 10){newleft = 10}
      if (newtop < 10){newtop = 10}  
      document.getElementById(windows[i].divname).style.left=newleft
      document.getElementById(windows[i].divname).style.top=newtop;
    	}
  	}
  if(Sandbox.dragworld && !Sandbox.worldissmall)
    {
    Render.viewports[0].x-=(mouseX-oldmouseX)/Render.viewports[0].zoom
    Render.viewports[0].y-=(mouseY-oldmouseY)/Render.viewports[0].zoom
    if(Sandbox.paused)
  		{
  		Render.redrawworld();
  		}
    }
  }

Sandbox.selected=false;
Sandbox.followmouse=false;
Sandbox.mouserotate=false;

Sandbox.drawingshape=false;
Sandbox.newShape=3;//the new shape being drawn, 0=circle, 1=rectangle, 3=poly
Sandbox.newShapecoords=new Array;
Sandbox.pausedbeforedrawingshape=false;
Sandbox.newShapeXs=new Array();
Sandbox.newShapeYs=new Array();


var dragworld=false;

//distance from mouse to centre of object being dragged:
Sandbox.mousedragdifference;

Sandbox.mousegonedown=function(event,divstuff)
  {
  if(!isNaN(parseFloat(document.getElementById('mousesize').value)))
    {
  	var mousesize=Math.round(document.getElementById('mousesize').value*1);
  	}
  else
    {
  	var mousesize=1;
  	}
  
  here=Detect.checkforanycollide3(UI.mouseX/Render.viewports[0].zoom+Render.viewports[0].x,mouseY/Render.viewports[0].zoom+Render.viewports[0].y,mousesize,mousesize,0)//see what mouse cursor is colliding with
  /*break;
  default:
  here=divstuff
  break}
  */
  if(here!==false)
    {
    //if you've clicked a border or something un-clickable
    if(Shapes.wholeworld[here].gametype==0)
  	  {
  		here=false;
  		}
    }
  
  if(here!==false || document.getElementById('mousedoes').value=='create' || document.getElementById('mousedoes').value=='EP'  || document.getElementById('mousedoes').value=='drag'   || document.getElementById('mousedoes').value=='dragworld'    || document.getElementById('mousedoes').value=='draw' || document.getElementById('mousedoes').value=='drawrectangle')
    {
    switch(document.getElementById('mousedoes').value)
      {
      case 'EP':
        alert(EPatpoint(mouseX,mouseY))
      break;
      case 'alertname':
        alert(Shapes.wholeworld[here].name)
      break;
      case 'dragworld':
        dragworld=true;
      break;
      case 'drag':
        if(!here && document.getElementById('dragworldpossible').checked)
        {
        dragworld=true;
        }else
        {
        timer=0;
        mousein=here
        followmouse=here
        mousedragdifference=[Shapes.wholeworld[followmouse].x-mouseX/Render.viewports[0].zoom-Render.viewports[0].x,Shapes.wholeworld[followmouse].y-mouseY/Render.viewports[0].zoom-Render.viewports[0].y];
        predragx=Shapes.wholeworld[followmouse].x;
        predragy=Shapes.wholeworld[followmouse].y;
        }
      break;
      case 'rotate':
        if(Shapes.wholeworld[here].shape==3)
        {
        prerotatex=mouseX;
        prerotatey=mouseY;
        mousein=here;
        mouserotate=here;
        }
      break;
      case 'drawrectangle':
        drawingshape=true;
        Sandbox.newShapecoords=[mouseX/Render.viewports[0].zoom-Render.viewports[0].x,mouseY/Render.viewports[0].zoom-Render.viewports[0].y];
        Sandbox.newShape=1;
        pausedbeforedrawingshape=paused;
        if(!paused){togglepause();}
      break;
      case 'draw':
        drawingshape=true;
        Sandbox.newShape=3;
        pausedbeforedrawingshape=paused;
        if(!paused){togglepause();}
        Sandbox.newShapeXs=new Array();
        Sandbox.newShapeYs=new Array();
      break;
      case 'breakconnections': 
        Shapes.wholeworld[here].cutfree();
        redrawworld();
      break;
      case 'givecharge':
        if(!isNaN(parseFloat(document.getElementById('chargesize').value)))
        {Shapes.wholeworld[here].makecharged(document.getElementById('chargesize').value*negposcharge)
        }else{Shapes.wholeworld[here].makecharged(negposcharge*0.2);document.getElementById('chargesize').value=0.2;}
        //if set, give the charged object a new colour
        if(document.getElementById('chargecolour').checked)
        {
        if(negposcharge>0){Shapes.wholeworld[here].colour="red";Shapes.wholeworld[here].divimage="balls/red.gif";}
        else{Shapes.wholeworld[here].colour="blue";Shapes.wholeworld[here].divimage="balls/blue.gif";}
        redrawworld();
        }
        
      break;
      case 'nocharge':
        Shapes.wholeworld[here].makecharged(0)
      break;
      case 'addballoon':
        if(Shapes.wholeworld[here].name!=='bg')//not clicking on bg
        {
        if(!isNaN(parseFloat(document.getElementById('balloonthrust').value)))
        {var tempthrust=document.getElementById('balloonthrust').value;}
        else{var tempthrust=200;}
        //upwards force of gravity + thrust*mass
        var balloonnum=Shapes.wholeworld.length;
        //var temp=
        new entity(1,'balloon'+created,mouseX/Render.viewports[0].zoom+Render.viewports[0].x,mouseY/Render.viewports[0].zoom+Render.viewports[0].y-125,50,50,5,'rgb(255,165,0)',0,0,0,0,-1000-tempthrust*5,false,false,0,true,1,0.95,'','balls/orange.gif');
        
        connect(here,balloonnum,1000,100,1,0,true)
        if(paused){redrawworld();}
        created++;
        }
      break;
      case 'springconnect':
        if(selected===false && Shapes.wholeworld[here].name!=='bg')//if we haven't already clicked on something
        {selected=here;
        document.getElementById('selectedspan').innerHTML="Connect "+Shapes.wholeworld[here].name;
        document.getElementById('selectedspan').style.display="block";
        }else if(selected!==here && Shapes.wholeworld[here].name!=='bg')//if we have
        {
        
        document.getElementById('selectedspan').innerHTML='';
        document.getElementById('selectedspan').style.display="none";
        
        if(!isNaN(parseFloat(document.getElementById('customk').value))){var customk=document.getElementById('customk').value;}else{var customk=5000;}
        if(document.getElementById('customspringlength').value==0){var customlength=false;}
        else if(!isNaN(parseFloat(document.getElementById('customspringlength').value))){var customlength=document.getElementById('customspringlength').value;}else{var customlength=false;}
        
        connect(selected,here,customk,customlength,document.getElementById('customlinetype').value,0,true)
        selected=false;}
        else if(selected==here)//we've clicked an object we've already selected
        {selected=false;
        document.getElementById('selectedspan').innerHTML='';
        document.getElementById('selectedspan').style.display="none";
        }
        
        
        redrawworld();
      break;
        //connect(one,two,strength,howfar,graphics,type,hard)
        
        case 'rodconnect':
        if(selected===false && Shapes.wholeworld[here].name!=='bg')//if we haven't already clicked on something
        {selected=here;
        document.getElementById('selectedspan').innerHTML="Connect "+Shapes.wholeworld[here].name;
        document.getElementById('selectedspan').style.display="block";
        }else if(selected!==here && Shapes.wholeworld[here].name!=='bg')//if we have
        {
        
        document.getElementById('selectedspan').innerHTML='';
        document.getElementById('selectedspan').style.display="none";
        
        if(document.getElementById('customrodlength').value==0){var customlength=false;}
        else if(!isNaN(parseFloat(document.getElementById('customrodlength').value))){var customlength=document.getElementById('customrodlength').value;}else{var customlength=false;}
        
        if(!isNaN(parseFloat(document.getElementById('customrodgive').value))){var customgive=document.getElementById('customrodlength').value;}else{var customgive=10;}
        
        //what was k was is now used for give
        connect(selected,here,customgive,customlength,2,1,true)
        selected=false;}
        else if(selected==here)//we've clicked an object we've already selected
        {selected=false;
        document.getElementById('selectedspan').innerHTML='';
        document.getElementById('selectedspan').style.display="none";
        }
        
        
        redrawworld();
      break;
      case 'stringconnect':
        if(selected===false)
        {selected=here;
        document.getElementById('selectedspan').innerHTML="Connect "+Shapes.wholeworld[here].name;
        document.getElementById('selectedspan').style.display="block";
        }else{document.getElementById('selectedspan').innerHTML='';
        document.getElementById('selectedspan').style.display="none";
        
        var tempdensity=30
        var tempdotsize=6
        var tempk=5000
        
        if(!isNaN(parseFloat(document.getElementById('stringdensity').value))){tempdensity=document.getElementById('stringdensity').value}else{document.getElementById('stringdensity').value=30}
        if(!isNaN(parseFloat(document.getElementById('stringdotsize').value))){tempdotsize=document.getElementById('stringdotsize').value}else{document.getElementById('stringdotsize').value=6}
        if(!isNaN(parseFloat(document.getElementById('stringk').value))){tempk=document.getElementById('stringk').value}else{document.getElementById('stringk').value=5000}
        
        //stringbetween(one,two,density,dotsize,stringstrength,hard)
        stringbetween(selected,here,tempdensity,tempdotsize,tempk,true)
        selected=false;}
        redrawworld();
      break;
      case 'delete':
        //Shapes.wholeworld[here].destroy();
        //Shapes.wholeworld[here].cutfree();
        if(Shapes.wholeworld[here].gametype!==0){Shapes.wholeworld[here].kill();}
      break;
      case 'fix':
        //make object static
        Shapes.wholeworld[here].type=1;
      break;
      case 'free':
        //make object movable
        if(Shapes.wholeworld[here].gametype!==0)
        {
        Shapes.wholeworld[here].type=0;
        }
      break;
      case 'create':
        
        var tempshape=document.getElementById('createshape').value;
        var temptype=document.getElementById('createtype').value;
        var tempcolour=document.getElementById('createcolour').value;
        var tempwidth
        var tempheight
        var tempelastic
        var tempmass
        
        switch(tempshape)
        {
        case '1'://rectangle
        case 1:
        if(!isNaN(parseFloat(document.getElementById('createheight').value))){tempheight=document.getElementById('createheight').value}else{tempheight=document.getElementById('createheight').value=50}
        if(!isNaN(parseFloat(document.getElementById('createwidth').value))){tempwidth=document.getElementById('createwidth').value}else{tempwidth=document.getElementById('createwidth').value=50}
        break;
        case '0'://circle
        case 0:
        if(!isNaN(parseFloat(document.getElementById('creatediameter').value))){tempwidth=document.getElementById('creatediameter').value;tempheight=document.getElementById('creatediameter').value;}else{document.getElementById('createwidth').value=50}
        break;
        }
        
        if(!isNaN(parseFloat(document.getElementById('createmass').value))){tempmass=document.getElementById('createmass').value}else{document.getElementById('createmass').value=50}
        if(!isNaN(parseFloat(document.getElementById('createelastic').value))){tempelastic=document.getElementById('createelastic').value}else{document.getElementById('createelastic').value=1}
        
        if(checkforanycollide3(mouseX/Render.viewports[0].zoom+Render.viewports[0].x,mouseY/Render.viewports[0].zoom+Render.viewports[0].y,tempwidth*1,tempheight*1,tempshape*1)===false || document.getElementById('createcolision').checked==false)
        {//only create shape if it's not colliding or collision detection isn't wanted
        
        switch(tempshape)
        {case '0':
        case 0:
        new entity(1,'circle'+created,mouseX/Render.viewports[0].zoom+Render.viewports[0].x,mouseY/Render.viewports[0].zoom+Render.viewports[0].y,tempwidth*1,tempheight*1,tempmass*1,tempcolour,temptype*1,0,0,0,0,true,false,0,true,1,tempelastic*1,'','balls/green.gif');
        break;
        case '1':
        case 1:
        var temp=new entity(1,'square'+created,mouseX/Render.viewports[0].zoom+Render.viewports[0].x,mouseY/Render.viewports[0].zoom+Render.viewports[0].y,tempwidth*1,tempheight*1,tempmass*1,'green',temptype*1,0,0,0,0,true,false,1,true,1,tempelastic*1,'background-color:green;');
        break;}
        }
        if(rendermode=="canvas"){redrawworld();}
        created++;
        break;}
      
      //end of if here!==false
      }
    if (event.preventDefault){event.preventDefault();}
    
    event.returnValue = false;
    
  return false;
  }

Sandbox.zoomfunc=function(howmuch)
  {
  if(Render.viewports[0].zoom+howmuch/5 > 0.05  && !Sandbox.drawingshape && !Sandbox.worldissmall)
    {
    
    var oldzoom=Render.viewports[0].zoom;
    Render.viewports[0].zoom+=howmuch/5;
    
    //find the difference between the edge of the old viewport and the mouse in 'virtual pixels' (engine unit of measurement) 
    //works for zooming towards mouse.
    Render.viewports[0].x-=(UI.mouseX/Render.viewports[0].zoom - UI.mouseX/oldzoom)
    Render.viewports[0].y-=(UI.mouseY/Render.viewports[0].zoom - UI.mouseY/oldzoom)
    Render.redrawworld();
    }
  
  }

//mouse wheel scroll stuff  from http://adomas.org/javascript-mouse-wheel/
UI.handle=function(delta) 
  {
  if (delta < 0)
	  {
  	zoomfunc(delta);
		}
  else
	  {
  	zoomfunc(delta);
		}
  }

UI.wheel=function(event)
  {
  var delta = 0;
  if (!event)
	  {
		event = window.event;
		}
  if (event.wheelDelta)
	  {
  	delta = event.wheelDelta/120; 
  	if (window.opera) 
		  {
			delta = -delta;
			}
    }
	else if (event.detail)
	  {
  delta = -event.detail/3;
  	}
  if (delta)
	  {
  	handle(delta);
		}
  if (event.preventDefault)
    {
		event.preventDefault();
		}
  event.returnValue = false;
  }

document.onmouseup   = UI.finalmouseup;
document.onmousemove = getMouseXY;

//set up the graphdiv to collect the scrollwheel info
if (window.addEventListener)
  {
	document.getElementById("mainworldcanvas").addEventListener('DOMMouseScroll', wheel, false);
	}
if(IE)
  {
	window.onmousewheel = document.onmousewheel = wheel;
	}
document.getElementById("mainworldcanvas").onmousewheel = wheel;
