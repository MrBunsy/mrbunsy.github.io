var Sandbox=new Object();

Sandbox.extras=new Array();
Sandbox.extras.push("selectedspan");
Sandbox.extras.push("chargespan");
Sandbox.extras.push("springspan");
Sandbox.extras.push("dragspan");
Sandbox.extras.push("rotatespan");
Sandbox.extras.push("stringspan");
Sandbox.extras.push("createspan");
Sandbox.extras.push("rodspan");
Sandbox.extras.push("balloonspan");
Sandbox.extras.push("drawrectanglespan");

Sandbox.negposcharge=1;

Sandbox.worldwaspreloaded=false
Sandbox.paused=false;


General.debug=false;
Sandbox.worldissmall=false;
//gravity, and in which direction (could be used as a cheap wind, like Worms 1)  100 seems to be a nice value
Physics.gravityY=200;
Physics.gravityX=0;
//F=-bV (drag), friction=b
Physics.friction=5
//time/s per refresh
Physics.timeperloop=0.02
//essentially fps

if (/MSIE/.test(navigator.userAgent) && !window.opera)
  {
  General.IE=true;
  }
		
if(General.IE)
  {
	Physics.refreshrate=Physics.timeperloop*796;
	}
else
  {
	Physics.refreshrate=Physics.timeperloop*1000;
	}

//the minimum speed anything can have before it's stopped (set to 0 for no min speed)
Physics.minspeed=10

//gets variables from url, like GET in PHP
General.gup=function(name)
  {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
	  {
  	return "";
		}
  else
	  {
  	return results[1];
		}
  }


Sandbox.setupcanvas=function()
  {
  var mainview=new Render.viewport('canvas','mainworld',0,0,800,550,1,1,false,true);
  //-2475
  var miniview=new Render.viewport('canvas','minimap',-1600,-2200,400,275,0.1,10,false,true);
  if(General.gup('preload')!=='')
    {
    Sandbox.loadworld(gup('preload'),true);
    }
  Sandbox.loopme=setInterval(Sandbox.loop,Physics.refreshrate)
	

	
	Sandbox.extracreate()
	Sandbox.extramouse()
	Sandbox.updategravity()

  }

Sandbox.closeextras=function(except)
  {
	//closes all the extra options except the exception
  for(var k=0;k<Sandbox.extras.length;k++)
    {
    if(Sandbox.extras[k]!==except)
		  {
			document.getElementById(Sandbox.extras[k]).style.display="none";
			}
    }
  }

Sandbox.extramouse=function()
  {//run when a mouse option is selected, and opens up/closes the extra options
  Sandbox.closeextras(document.getElementById('mousedoes').value)
  switch(document.getElementById('mousedoes').value)
    {
    case 'givecharge':
      document.getElementById("chargespan").style.display="block";
    break;
    case 'springconnect':
      document.getElementById("springspan").style.display="block";
    break;
    case 'rodconnect':
      document.getElementById("rodspan").style.display="block";
    break;
    case 'drag':
      document.getElementById("dragspan").style.display="block";
    break;
    case 'rotate':
      document.getElementById("rotatespan").style.display="block";
    break;
    case 'stringconnect':
      document.getElementById("stringspan").style.display="block";
    break;
    case 'create':
      document.getElementById("createspan").style.display="block";
    break;
    case 'addballoon':
      document.getElementById("balloonspan").style.display="block";
    break;
    case 'drawrectangle':
      document.getElementById("drawrectanglespan").style.display="block";
    break
    }
  }


Sandbox.extracreate=function()
  {//opens/closes options for circles and squares in the create menu
  if(document.getElementById('createshape').value=='0')
    {
    document.getElementById('createsquare').style.display='none';
    document.getElementById('createcircle').style.display='block';
    }
   else
    {
		document.getElementById('createsquare').style.display='block';
    document.getElementById('createcircle').style.display='none';
		}
  }

Sandbox.extrarender=function()
  {
  if(document.getElementById('customrender').value=="divs")
    {
		document.getElementById('extrarenderspan').style.display="block";
		}
  else
    {
		document.getElementById('extrarenderspan').style.display="none";
		}
  }
	
Sandbox.togglecharge=function()
  {//changes the button in the charge options from + to - and vice versa
  if(Sandbox.negposcharge>0)
	  {
		Sandbox.negposcharge=-1;
		document.getElementById('chargebutton').value="-";
		}
  else
    {
		Sandbox.negposcharge=1;
		document.getElementById('chargebutton').value="+";
		}
  }

Sandbox.updategravity=function()
  {//updates the world's gravity to what's in the text box
  if(!isNaN(parseFloat(document.getElementById('customgravity').value)))
	  {
		gravityY=document.getElementById('customgravity').value;
		}
	else
	  {
		document.getElementById('customgravity').value=100;
		gravityY=100;
		}
  }

Sandbox.updatefriction=function()
  {
  if(!isNaN(parseFloat(document.getElementById('customfriction').value)))
    {
    Sandbox.friction=document.getElementById('customfriction').value;
    }
  }

Sandbox.updateoption=function()
  {
  Sandbox.updategravity();
  Sandbox.updatefriction();
  }

//greys out the play area
Sandbox.greyout=function(dowhat)
  {
  	switch (dowhat)
    {
    case true:
      viewports[0].canvas.fillStyle = "rgba(0, 0, 200, 0.5)";
      viewports[0].canvas.fillRect(0,0,800,600);
      viewports[0].canvas.fillStyle = "rgb(0,0,0)";
    break;
    case false:
      Render.redrawworld();
    break;
    }
  }



Sandbox.loadworld=function(thisworld,preload)
  {
  Sandbox.worldwaspreloaded=preload
  Sandbox.clearworld();
  Sandbox.greyout(true);
  
  //reset grav and friction to defaults
  Sandbox.gravityY=200;
  document.getElementById('customgravity').value=200;
  Sandbox.friction=5;
  document.getElementById('customfriction').value=5;
  
  switch(thisworld)
    {
    case 'custom':
      Sandbox.loadwindow.OpenWindow();
      Sandbox.loadwindow.CentreWindow();
      document.getElementById('customgravity').value=Sandbox.gravityY;
      document.getElementById('customfriction').value=Sandbox.friction
      Sandbox.finishloading()
    break;
    default:
      var newScr = document.createElement("SCRIPT");
      newScr.src = "worlds/"+thisworld+".js";
      newScr.type="text/javascript";
      document.getElementsByTagName("head")[0].appendChild(newScr); 
      document.getElementById('loaddiv').style.display='none';
      document.getElementById('loadingdiv').style.display='block';
    break;
    }
  }

Sandbox.finishloading=function()
  {
  if(!worldwaspreloaded)
    {
    //greyout(false);
    document.getElementById('loaddiv').style.display='none';
    Sandbox.togglepause();
    }
  Sandbox.greyout(false);
  document.getElementById('loadingdiv').style.display='none';
  Sandbox.updateworldsize();
  document.getElementById('customgravity').value=Sandbox.gravityY;
  document.getElementById('customfriction').value=Sandbox.friction
  }

Sandbox.minimapwindow = new divwindow('Sandbox.minimapwindow','Mini Map',1,'#8cd2ff','#64aaff',405,300,10,570,3,'<canvas id="minimapcanvas" width="400" height="275"></canvas><div id="minimapdivs"></div>','document.getElementById("openminimapspan").style.display="block";Render.viewports[1].enabled=false;')
Sandbox.minimapwindow.OpenWindow();
Sandbox.loadwindow = new divwindow('Sandbox.loadwindow','load World',1,'white','yellow',500,300,300,300,3,'<form action="javascript:inportworld();"><textarea id="loadtextarea" cols="55" rows="10"><\/textarea><br>Copy the text from Save World into this box.<br><br><input type="submit" value="Load"><\/form>','')

Sandbox.savewindow = new divwindow('Sandbox.savewindow','Save World',1,'white','yellow',500,300,300,300,3,'<textarea id="savetextarea" cols="55" rows="13"><\/textarea><br>Use Load -> Saved World and copy this text in to load this world.','')

Sandbox.inportworld=function()
  {
  eval(document.getElementById('loadtextarea').value)
  Sandbox.updateworldsize();
  Sandbox.loadwindow.CloseWindow();
  }
	

Sandbox.saveworld=function()
  {
  //entity(state,name,x,y,width,height,mass,colour,type,vx,vy,fx,fy,hard,sticky,shape,visible,gametype,elastic,divoptions,divimage)
  save='';
  for(var k=0;k<Shapes.wholeworld.length;k++)
    {
    if(Shapes.wholeworld[k].gametype!==0 && Shapes.wholeworld[k].shape!==3)
      {
      save+="new entity("+Shapes.wholeworld[k].state+",'saved"+Shapes.wholeworld[k].name+"',"+Shapes.wholeworld[k].x+","+Shapes.wholeworld[k].y+","+Shapes.wholeworld[k].width+","+Shapes.wholeworld[k].height+","+Shapes.wholeworld[k].mass+",'"+Shapes.wholeworld[k].colour+"',"+Shapes.wholeworld[k].type+","+Shapes.wholeworld[k].vx+","+Shapes.wholeworld[k].vy+","+Shapes.wholeworld[k].fx+","+Shapes.wholeworld[k].fy+","+Shapes.wholeworld[k].hard+","+Shapes.wholeworld[k].sticky+","+Shapes.wholeworld[k].shape+","+Shapes.wholeworld[k].visible+","+Shapes.wholeworld[k].gametype+","+Shapes.wholeworld[k].elastic+",'"+Shapes.wholeworld[k].divoptions+"','"+Shapes.wholeworld[k].divimage+"'); \n"
      }
    else if(Shapes.wholeworld[k].gametype!==0 && Shapes.wholeworld[k].shape==3)//saving a polygon
      {
      var tempXs="[";
      for(var c=0;c<Shapes.wholeworld[k].Xs.length;c++)
        {
				tempXs+=Shapes.wholeworld[k].Xs[c];
        if(c<Shapes.wholeworld[k].Xs.length-1)
				  {
					tempXs+=",";
					}
				}
      tempXs+="]";
      
      var tempYs="[";
      for(var c=0;c<Shapes.wholeworld[k].Ys.length;c++)
        {
				tempYs+=Shapes.wholeworld[k].Ys[c];
        if(c<Shapes.wholeworld[k].Ys.length-1){tempYs+=",";}}
      tempYs+="]";
      
      save+="new polygon("+Shapes.wholeworld[k].state+",'saved"+Shapes.wholeworld[k].name+"',"+Shapes.wholeworld[k].x+","+Shapes.wholeworld[k].y+","+tempXs+","+tempYs+","+Shapes.wholeworld[k].mass+",'"+Shapes.wholeworld[k].colour+"',"+Shapes.wholeworld[k].type+","+Shapes.wholeworld[k].vx+","+Shapes.wholeworld[k].vy+","+Shapes.wholeworld[k].vw+","+Shapes.wholeworld[k].fx+","+Shapes.wholeworld[k].fy+","+Shapes.wholeworld[k].fw+","+Shapes.wholeworld[k].hard+","+Shapes.wholeworld[k].filled+","+Shapes.wholeworld[k].visible+","+Shapes.wholeworld[k].gametype+","+Shapes.wholeworld[k].elastic+"); \n";
      }
    }//end of Shapes.wholeworld loop

  for(var k=0;k<Physics.connections.length;k++)
    {
    if(Physics.connections[k].alive)
      {
      save+="connect("+Physics.connections[k].from+","+Physics.connections[k].to+","+Physics.connections[k].Physics.connectionstrength+","+Physics.connections[k].connectionlength+","+Physics.connections[k].graphics+","+Physics.connections[k].type+","+Physics.connections[k].hard+"); \n";
      }
    }
  
  for(var k=0;k<Physics.chargedobjects.length;k++)
    {
    save+="Shapes.wholeworld["+Physics.chargedobjects[k].arraypos+"].charged=true;Shapes.wholeworld["+Physics.chargedobjects[k].arraypos+"].charge="+Physics.chargedobjects[k].charge+";Physics.chargedobjects.push(Shapes.wholeworld["+Physics.chargedobjects[k].arraypos+"]); \n"
    }
  
  save+="Physics.gravityY="+Physics.gravityY+";Physics.friction="+Physics.friction+";Render.viewports[0].x="+Render.viewports[0].x+";Render.viewports[0].y="+Render.viewports[0].y+";Render.viewports[0].zoom="+Render.viewports[0].zoom+";";
  
  save+="document.getElementById('smallworld').checked="+document.getElementById('smallworld').checked;
  
  Sandbox.savewindow.OpenWindow();
  Sandbox.savewindow.CentreWindow();
  document.getElementById('savetextarea').value=save;
	document.getElementById('savetextarea').focus();
	document.getElementById('savetextarea').select();
  }

Sandbox.clearworld=function()
{
document.getElementById('loadingdiv').style.display="none";
Physics.connections=new Array();
var wholeworld2=Shapes.wholeworld.slice(0,5);
Shapes.wholeworld=new Array();
Physics.chargedobjects=new Array();
Shapes.wholeworld=wholeworld2;
Render.viewports[0].x=0;
Render.viewports[0].y=0;
Render.viewports[0].zoom=1;
Render.redrawworld();
}

//here are where objects are created
//gametypes: 0=border, etc, not deletable, 1=otherwise

//Shapes.circle=function(alive,canMove,pos,angle,r,mass,colour,v,f,hard,filled,visible,gameType,elastic)
//Shapes.oldRectangle=function(alive,canMove,pos,width,height,mass,colour,v,f,hard,filled,visible,gameType,elastic)
//Shapes.polygon=function(alive,canMove,pos,angle,Xs,Ys,mass,colour,v,f,hard,filled,visible,gameType,elastic)


//new entity(1,'borderline',400,-825,4000,2750,10,'black',1,0,0,0,0,false,false,4,true,0,0,'',false);
//black line around edge of play area:
new Shapes.oldRectangle(true,false,[400,-825],4000,2750,10,8,[0,0,0],[0,0,0],false,false,true,0,1);

new Shapes.oldRectangle(true,false,[300,100],10,20,10,0,[0,0,0],[0,0,0],true,true,true,0,1);
//playing area:
//top= -2200
//bottom=550
//left=-1600
//right=2400

//var lowerborder=new entity(1,'lowerborder',0,25550,200000,50000,10,'rgb(121,158,41)',1,0,0,0,0,true,false,1,true,0,0,'',false);
new Shapes.oldRectangle(true,false,[0,25550],200000,50000,10,8,[0,0,0],[0,0,0],true,true,true,0,1);

/*//var upperborder=new entity(1,'upperborder',0,-51100,200000,100000-2200,10,false,1,0,0,0,0,true,false,1,false,0,0,'',false);
new Shapes.oldRectangle(true,false,[0,-5110],200000,100000-2200,10,8,[0,0,0],[0,0,0],true,true,false,0,1);
//var leftborder=new entity(1,'leftborder',-50800,90000,100000-1600,200000,10,false,1,0,0,0,0,true,false,1,false,0,0,'',false);
new Shapes.oldRectangle(true,false,[-50800,90000],100000-1600,200000,10,8,[0,0,0],[0,0,0],true,true,false,0,1);
//var rightborder=new entity(1,'rightborder',52400,90000,100000,200000,10,false,1,0,0,0,0,true,false,1,false,0,0,'',false);
new Shapes.oldRectangle(true,false,[52400,90000],100000,200000,10,8,[0,0,0],[0,0,0],true,true,false,0,1);
*/


//var ball=new entity(1,'ball',200,100,50,50,50,'red',0,0,0,0,0,true,false,0,true,1,0.95,'','balls/red.gif');

new Shapes.circle(true,true,[200,100],0,25,50,0,[100,100,0],[0,0,0],true,true,true,1,1)
/*
var ball2=new entity(1,'ball2',600,100,50,50,50,'green',0,0,0,0,0,true,false,0,true,1,0.95,'','balls/green.gif');
var fixedpoint3=new entity(1,'fixedpoint3',400,200,50,50,100,'black',1,0,0,0,0,true,false,0,true,2,1,'','balls/black.gif');
stringbetween(ball.arraypos,ball2.arraypos,30,1,5000,true)



//var testpolygon=new polygon(1,'testpolygon',500,300,[-100,50,200,-50],[-50,-50,50,50],100,'green',1,0,0,0,0,0,0,true,true,true,1,1)
var testpolygon=new polygon(1,'testpolygon',500,300,[-50,50,50,-50],[-50,-50,50,50],100,'green',1,0,0,0,0,0,0,true,true,true,1,0.8)
testpolygon.angle=Math.PI/6;
testpolygon.vw=2
testpolygon.type=0;

//for polygons entity(state,name,x array,y array,thickness,z-index,mass,colour,type,vx,vy,fx,fy,hard,sticky,shape,ignore,gametype,elastic,hollow)
//polygon(state,name,x,y,Xs,Ys,mass,colour,type,vx,vy,vw,fx,fy,fw,hard,filled,visible,gametype,elastic)
//var borderpoly=new entity(1,'borderpoly',0,0,[200,600,600,200],[100,100,500,500],1,'black',1,0,0,0,0,0,0,true,true,true,1,1);

//var borderpoly=new polygon(1,'borderpoly',0,0,[0,800,800,0],[0,0,550,550],100,'black',1,0,0,0,0,0,0,true,false,true,1,1)

var smallball1=new entity(1,'smallball1',150,300,9,9,50,'red',0,0,0,0,0,true,false,0,true,2,1,'','tinyballs/red.gif');
var smallball2=new entity(1,'smallball2',200,300,9,9,50,'red',0,0,0,0,0,true,false,0,true,2,1,'','tinyballs/red.gif');
var smallball3=new entity(1,'smallball3',150,350,9,9,50,'red',0,0,0,0,0,true,false,0,true,2,1,'','tinyballs/red.gif');
var smallball4=new entity(1,'smallball4',200,350,9,9,50,'red',0,0,0,0,0,true,false,0,true,2,1,'','tinyballs/red.gif');


connect(smallball1.arraypos,smallball2.arraypos,10000,false,1,0,true)
connect(smallball1.arraypos,smallball3.arraypos,10000,false,1,0,true)
connect(smallball2.arraypos,smallball3.arraypos,10000,false,1,0,true)
connect(smallball4.arraypos,smallball1.arraypos,10000,false,1,0,true)
connect(smallball4.arraypos,smallball2.arraypos,10000,false,1,0,true)
connect(smallball4.arraypos,smallball3.arraypos,10000,false,1,0,true)
*/


//new entity(1,'circle0',189,290,50,50,50,'green',1,0,0,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'circle1',625,291,50,50,50,'green',1,0,0,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'circle2',401,123,50,50,50,'green',0,0,0,0,0,true,false,0,true,1,0.95,'','balls/green.gif');connect(4,5,1000,436,1,0,true);gravityY=200;friction=0.995;

//loop stuff
Sandbox.counter=0;

//timer variable, used for dragging stuff.
Sandbox.timer=0

Sandbox.dragoldx=0;
Sandbox.dragoldy=0;

Sandbox.oldloopmouseX=0;
Sandbox.oldloopmouseY=0;

//var thingschanged=true;

//this is the function which gets looped when the sandbox isn't paused
Sandbox.loop=function()
  {
  //timer+=timeperloop;
  //finds new position of everything which can move
  Physics.replotentities()
  
  Physics.sortoutrods()
  

  Render.redrawworld()
  
  //draw outline of main viewport on minimap
  if((Render.drawcounter-1)%Render.viewports[1].sync==0 && Render.viewports[1].enabled)
    {
		Render.viewports[1].canvas.lineWidth=1;
    Render.viewports[1].canvas.strokeStyle='rgb(0,0,0)';
    Render.viewports[1].canvas.strokeRect(Math.ceil((Render.viewports[0].x-Render.viewports[1].x)*Render.viewports[1].zoom)-0.5,Math.ceil((Render.viewports[0].y-Render.viewports[1].y)*Render.viewports[1].zoom)-0.5,Math.floor(Render.viewports[0].width*Render.viewports[1].zoom/Render.viewports[0].zoom),Math.floor(Render.viewports[0].height*Render.viewports[1].zoom/Render.viewports[0].zoom));
    }
  
  //if the mouse is dragging something, move it:
  if(Sandbox.followmouse!==false)
    {
    if(Shapes.wholeworld[Sandbox.followmouse].type==1 && Shapes.wholeworld[Sandbox.followmouse].gametype!==0)
      {//if we're not colliding or don't want collision detection
      
      if(document.getElementById('dragcollisions').checked==false || checkforanycollide2(Shapes.wholeworld[Sandbox.followmouse],mouseX/Render.viewports[0].zoom+Render.viewports[0].x+mousedragdifference[0],mouseY/Render.viewports[0].zoom+Render.viewports[0].y+mousedragdifference[1])===false)
        {
        Shapes.wholeworld[Sandbox.followmouse].x=Sandbox.mouseX/Render.viewports[0].zoom+Render.viewports[0].x+Sandbox.mousedragdifference[0];
        Shapes.wholeworld[Sandbox.followmouse].y=Sandbox.mouseY/Render.viewports[0].zoom+Render.viewports[0].y+Sandbox.mousedragdifference[1];
        }
      }
    }
  
  Sandbox.rotatestuff()
  Sandbox.oldloopmouseX=Sandbox.mouseX
  Sandbox.oldloopmouseY=Sandbox.mouseY
  Sandbox.counter++
  }


Sandbox.pauseloop=function()
  {
  //if the mouse is dragging something, move it:
  if(Sandbox.followmouse!==false)
    {
    if(Shapes.wholeworld[Sandbox.followmouse].gametype!==0)
      {
			//if we're not colliding or don't want collision detection
      if(document.getElementById('dragcollisions').checked==false || Detect.checkforanycollide2(Shapes.wholeworld[Sandbox.followmouse],Sandbox.mouseX/Render.viewports[0].zoom+Render.viewports[0].x+Sandbox.mousedragdifference[0],Sandbox.mouseY/Render.viewports[0].zoom+Render.viewports[0].y+Sandbox.mousedragdifference[1])===false)
        {
        Shapes.wholeworld[Sandbox.followmouse].x=Sandbox.mouseX/Render.viewports[0].zoom+Render.viewports[0].x+Sandbox.mousedragdifference[0];
        Shapes.wholeworld[Sandbox.followmouse].y=Sandbox.mouseY/Render.viewports[0].zoom+Render.viewports[0].y+Sandbox.mousedragdifference[1];
        Render.redrawworld();
        }
  		}
		}
  
  if(Sandbox.drawingshape)
    {
    switch(Sandbox.newshape)
      {
      case 1://rectangle
        Render.redrawworld();
        
        var tempheight=Math.abs(Sandbox.newshapecoords[1]*Render.viewports[0].zoom+Render.viewports[0].y-Sandbox.mouseY)/Render.viewports[0].zoom//*2
        var tempwidth=Math.abs(Sandbox.newshapecoords[0]*Render.viewports[0].zoom+Render.viewports[0].x-Sandbox.mouseX)/Render.viewports[0].zoom//*2
        //function(pos,dimensions,f,a,s)
        if(checkforanycollide3([Sandbox.newshapecoords[0]/Render.viewports[0].zoom+Render.viewports[0].x+tempwidth/2,Sandbox.newshapecoords[1]/Render.viewports[0].zoom+Render.viewports[0].y+tempheight/2],[tempwidth*1,tempheight*1],true,0,1)===false || document.getElementById('drawrectanglecolision').checked==false)
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
  if(Sandbox.mouserotate!==false)
    {
    var oldrotateangle=Math.atan2(Shapes.wholeworld[Sandbox.mouserotate].y-prerotatey,Shapes.wholeworld[Sandbox.mouserotate].x-prerotatex)
    var newrotateangle=Math.atan2(Shapes.wholeworld[Sandbox.mouserotate].y-mouseY,Shapes.wholeworld[Sandbox.mouserotate].x-mouseX)
    
    var testangle=Shapes.wholeworld[Sandbox.mouserotate].angle+(newrotateangle-oldrotateangle);
    if(document.getElementById('rotatecollisions').checked==false || Detect.checkforanycollide2b(Shapes.wholeworld[Sandbox.mouserotate],testangle)===false)
      {
      Shapes.wholeworld[Sandbox.mouserotate].angle=testangle;
      prerotatex=Sandbox.mouseX;
      prerotatey=Sandbox.mouseY;
      if(Sandbox.paused)
			  {
				Render.redrawworld();
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
	
Physics.replotentities=function()
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
      
      var ourspeedfriction=Physics.ourspeed-Physics.friction*Physics.ourspeed*Physics.timeperloop/Shapes.wholeworld[i].mass
     
      //acceleration of object to be updated; f=ma therefore a=f/m
      var fx=Shapes.wholeworld[i].f[0]+Physics.gravityX*Shapes.wholeworld[i].mass//-Shapes.wholeworld[i].vx
      var fy=Shapes.wholeworld[i].f[1]+Physics.gravityY*Shapes.wholeworld[i].mass//-Shapes.wholeworld[i].vy
      
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
            
            var themx=Shapes.wholeworld[them].pos[0];
            var themy=Shapes.wholeworld[them].pos[1];
            
            //Hooke's Law:
            //F=-kx
            var springvar = Physics.springforce(Shapes.wholeworld[i].pos[0],themx,Shapes.wholeworld[i].pos[1],themy,tempspringstrength,tempspringlength)
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
            
            fy+=(testfy+testfy2+testfy3)/3 + Shapes.wholeworld[them].f[1]//this seems to help with balloons, though I'm not too sure how realistic it is.
            fx+=(testfx+testfx2+testfx3)/3 + Shapes.wholeworld[them].f[0]
            //end of if connection is a spring
          break;
          }
        //end of connections loop
        }
      
      var ax=fx/Shapes.wholeworld[i].mass
      var ay=fy/Shapes.wholeworld[i].mass

      //v=u+at
      newvy=Math.sin(ourangle)*ourspeedfriction+ay*Physics.timeperloop
      newvx=Math.cos(ourangle)*ourspeedfriction+ax*Physics.timeperloop
			General.dalert('newvy='+newvy)
      
      //optimisation, if we're not moving, don't faff about re-plotting our position - broken with polygons, need a resting contact system really.
      if(true){//newvy!==0 || newvx!==0 || !(followmouse===false || newvw!==0)
      // if we're moving really slowly, and there's no force on us, then stop moving.
      if(ourspeedfriction <=Physics.minspeed && Shapes.wholeworld[i].f[0]==0 && Shapes.wholeworld[i].f[1]==0 && ax==0 && ay==0)
			  {
				newvx=0;
				newvy=0;
				}
      //s=ut + 0.5at^2 therefore, new position = old position + ut+1/2at^2
      newx=(Shapes.wholeworld[i].v[0]*Physics.timeperloop+(1/2)*ax*Physics.timeperloop*Physics.timeperloop)+Shapes.wholeworld[i].pos[0]
      newy=(Shapes.wholeworld[i].v[1]*Physics.timeperloop+(1/2)*ay*Physics.timeperloop*Physics.timeperloop)+Shapes.wholeworld[i].pos[1]
      
			newvw=Shapes.wholeworld[i].v[2];
      newangle=Shapes.wholeworld[i].angle+Shapes.wholeworld[i].v[2]*Physics.timeperloop;
      
      
      if(Sandbox.followmouse===i)
  			{
        newx=Sandbox.mouseX/Render.viewports[0].zoom+Render.viewports[0].x+Sandbox.mousedragdifference[0];newy=Sandbox.mouseY/Render.viewports[0].zoom+Render.viewports[0].y+Sandbox.mousedragdifference[1];
        Sandbox.dragoldx=Shapes.wholeworld[i].pos[0];
        Sandbox.dragoldy=Shapes.wholeworld[i].pos[1];
  			}
      
      
      if(Shapes.wholeworld[i].hard)
        {
        for (var i2=0;i2<Shapes.wholeworld.length;i2++)
          {
          if(Shapes.wholeworld[i2].hard==true && i!==i2 && Shapes.wholeworld[i2].alive)
            {
						//(p1,d1,f1,a1,s1,p2,d2,f2,a2,a2,s2)
            if(Detect.checkcollide([newx,newy],Shapes.wholeworld[i].dimensions,Shapes.wholeworld[i].filled,Shapes.wholeworld[i].angle,Shapes.wholeworld[i].shape,Shapes.wholeworld[i2].pos,Shapes.wholeworld[i2].dimensions,Shapes.wholeworld[i2].filled,Shapes.wholeworld[i2].angle,Shapes.wholeworld[i2].shape))
              {
  						//if there is a collision
              
              //switch(Shapes.wholeworld[i].gametype){
              //case 1: if(Shapes.wholeworld[i2].gametype==2){if(Shapes.wholeworld[i].name=='us'){Shapes.wholeworld[i].state=4;}else{Shapes.wholeworld[i].state=3}};break;
              //use this to detect stuff
              //}
  
              if(Shapes.wholeworld[i].shape==0 && Shapes.wholeworld[i2].shape==0)
                {//two circles
                Shapes.wholeworld[i].v=[newvx,newvy];
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
    Sandbox.paused=true;
		clearInterval(Sandbox.loopme);
		document.getElementById("pausebutton").value="Play";
    Sandbox.loopme=setInterval(Sandbox.pauseloop,Physics.refreshrate);
    }
  }

Sandbox.minimiseminimap=function()
  {
  document.getElementById('Sandbox.minimapwindowdiv').style.position='absolute';
  document.getElementById('Sandbox.minimapwindowdiv').style.top=570;
  document.getElementById('Sandbox.minimapwindowdiv').style.left=10;
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
  var tempheight=Math.abs(Sandbox.newShapecoords[1]*Render.viewports[0].zoom+Render.viewports[0].y-Sandbox.mouseY)/Render.viewports[0].zoom//*2
  var tempwidth=Math.abs(Sandbox.newShapecoords[0]*Render.viewports[0].zoom+Render.viewports[0].x-Sandbox.mouseX)/Render.viewports[0].zoom//*2
  
  if(Detect.checkforanycollide3([Sandbox.newShapecoords[0]/Render.viewports[0].zoom+Render.viewports[0].x+tempwidth/2,Sandbox.newShapecoords[1]/Render.viewports[0].zoom+Render.viewports[0].y+tempheight/2],[tempwidth*1,tempheight*1],true,0,1)===false || document.getElementById('drawrectanglecolision').checked==false)
    {
		//function(alive,canMove,pos,angle,Xs,Ys,mass,colour,v,f,hard,filled,visible,gameType,elastic)
    var testpolygon=new polygon(true,[Sandbox.newShapecoords[0]+tempwidth/2,Sandbox.newShapecoords[1]+tempheight/2],0,[-tempwidth/2,tempwidth/2,tempwidth/2,-tempwidth/2],[-tempheight/2,-tempheight/2,tempheight/2,tempheight/2],100,0,[0,0,0],[0,0,0],true,true,true,1,1)
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
Sandbox.finalmouseup=function()
  {//stop an object being dragged
  if(Sandbox.followmouse!==false && !document.getElementById('dragmomentum').checked)
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
if (!General.IE)
  {
	document.captureEvents(Event.MOUSEMOVE);
	}

Sandbox.getMouseXY=function(e)
  {
	if(General.IE)
  	{
    //grab the x-y pos.s if browser is IE
    Sandbox.mouseX = event.clientX + document.body.scrollLeft-13
    Sandbox.mouseY = event.clientY + document.body.scrollTop-18
    Sandbox.realmouseX = event.clientX + document.body.scrollLeft//-13
    Sandbox.realmouseY = event.clientY + document.body.scrollTop//-18
    }
	else
	  {
    //grab the x-y pos.s if browser is NS
    Sandbox.mouseX = e.pageX-8
    Sandbox.mouseY = e.pageY-8
    Sandbox.realmouseX = e.pageX//-8
    Sandbox.realmouseY = e.pageY//-8
    }
  //catch possible negative values in NS4
  if (Sandbox.mouseX < 0){Sandbox.mouseX = 0}
  if (Sandbox.mouseY < 0){Sandbox.mouseY = 0}
  //this will do things with the mouse movement
  Sandbox.checkmice();
  Sandbox.oldmouseX=Sandbox.mouseX;
  Sandbox.oldmouseY=Sandbox.mouseY;
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
      var newleft =	Sandbox.realmouseX-Sandbox.mousediffinx;
      var newtop = Sandbox.realmouseY-Sandbox.mousediffiny;
      //find out if you're trying to drag the window off the bottom and right edges of the screen
      var newright =	Sandbox.realmouseX+oldwidth-Sandbox.mousediffinx+20
      var newbottom = Sandbox.realmouseY+oldheight+20
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
    Render.viewports[0].x-=(Sandbox.mouseX-Sandbox.oldmouseX)/Render.viewports[0].zoom
    Render.viewports[0].y-=(Sandbox.mouseY-Sandbox.oldmouseY)/Render.viewports[0].zoom
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
  	var mousesize=parseFloat(Math.round(document.getElementById('mousesize').value));
  	}
  else
    {
  	var mousesize=1;
  	}
  //function(pos,dimensions,f,a,s)
	//see what mouse cursor is colliding with
  here=Detect.checkforanycollide3([Sandbox.mouseX/Render.viewports[0].zoom+Render.viewports[0].x,Sandbox.mouseY/Render.viewports[0].zoom+Render.viewports[0].y],mousesize,true,0,0)
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
        alert(Shapes.wholeworld[here].shape)
      break;
      case 'dragworld':
        Sandbox.dragworld=true;
      break;
      case 'drag':
        if(!here && document.getElementById('dragworldpossible').checked)
          {
          Sandbox.dragworld=true;
          }
				else
          {
          Sandbox.timer=0;
          Sandbox.mousein=here;
          Sandbox.followmouse=here;
          Sandbox.mousedragdifference=[Shapes.wholeworld[Sandbox.followmouse].x-Sandbox.mouseX/Render.viewports[0].zoom-Render.viewports[0].x,Shapes.wholeworld[Sandbox.followmouse].y-Sandbox.mouseY/Render.viewports[0].zoom-Render.viewports[0].y];
          Sandbox.predragx=Shapes.wholeworld[Sandbox.followmouse].x;
          Sandbox.predragy=Shapes.wholeworld[Sandbox.followmouse].y;
          }
      break;
      case 'rotate':
        if(Shapes.wholeworld[here].shape==3)
        {
        Sandbox.prerotatex=Sandbox.mouseX;
        Sandbox.prerotatey=Sandbox.mouseY;
        Sandbox.mousein=here;
        Sandbox.mouserotate=here;
        }
      break;
      case 'drawrectangle':
        Sandbox.drawingshape=true;
        Sandbox.newShapecoords=[mouseX/Render.viewports[0].zoom-Render.viewports[0].x,mouseY/Render.viewports[0].zoom-Render.viewports[0].y];
        Sandbox.newShape=1;
        Sandbox.pausedbeforedrawingshape=Sandbox.paused;
        if(!paused){togglepause();}
      break;
      case 'draw':
        Sandbox.drawingshape=true;
        Sandbox.newShape=3;
        Sandbox.pausedbeforedrawingshape=Sandbox.paused;
        if(!Sandbox.paused){Sandbox.togglepause();}
        Sandbox.newShapeXs=new Array();
        Sandbox.newShapeYs=new Array();
      break;
      case 'breakconnections': 
        Shapes.wholeworld[here].cutfree();
        Render.redrawworld();
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
    Render.viewports[0].x-=(Sandbox.mouseX/Render.viewports[0].zoom - Sandbox.mouseX/oldzoom)
    Render.viewports[0].y-=(Sandbox.mouseY/Render.viewports[0].zoom - Sandbox.mouseY/oldzoom)
    Render.redrawworld();
    }
  
  }

//mouse wheel scroll stuff  from http://adomas.org/javascript-mouse-wheel/
Sandbox.handle=function(delta) 
  {
  if (delta < 0)
	  {
  	Sandbox.zoomfunc(delta);
		}
  else
	  {
  	Sandbox.zoomfunc(delta);
		}
  }

Sandbox.wheel=function(event)
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
  	Sandbox.handle(delta);
		}
  if (event.preventDefault)
    {
		event.preventDefault();
		}
  event.returnValue = false;
  }

document.onmouseup   = Sandbox.finalmouseup;
document.onmousemove = Sandbox.getMouseXY;

//set up the graphdiv to collect the scrollwheel info
if (window.addEventListener)
  {
	document.getElementById("mainworldcanvas").addEventListener('DOMMouseScroll', Sandbox.wheel, false);
	}
if(General.IE)
  {
	window.onmousewheel = document.onmousewheel = Sandbox.wheel;
	}
document.getElementById("mainworldcanvas").onmousewheel = Sandbox.wheel;
