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
		
if(IE)
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
  var mainview=new viewport('canvas','mainworld',0,0,800,550,1,1,false,true);
  //-2475
  var miniview=new viewport('canvas','minimap',-1600,-2200,400,275,0.1,10,false,true);
  if(General.gup('preload')!=='')
    {
    Sandbox.loadworld(gup('preload'),true);
    }
  Sandbox.loopme=setInterval('loop()',Physics.refreshrate)
	

	
	Sandbox.extracreate()
	Sandbox.extramouse()
	Sandbox.updategravity()

  }

Sandbox.closeextras=function(except)
  {
	//closes all the extra options except the exception
  for(var k=0;k<extras.length;k++)
    {
    if(extras[k]!==except)
		  {
			document.getElementById(extras[k]).style.display="none";
			}
    }
  }

Sandbox.extramouse=function()
  {//run when a mouse option is selected, and opens up/closes the extra options
  closeextras(document.getElementById('mousedoes').value)
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

Sandbox.updategravity()
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

Sandbox.minimapwindow = new divwindow('minimapwindow','Mini Map',1,'#8cd2ff','#64aaff',405,300,10,570,3,'<canvas id="minimapcanvas" width="400" height="275"></canvas><div id="minimapdivs"></div>','document.getElementById("openminimapspan").style.display="block";viewports[1].enabled=false;')
Sandbox.minimapwindow.OpenWindow();
Sandbox.loadwindow = new divwindow('loadwindow','load World',1,'white','yellow',500,300,300,300,3,'<form action="javascript:inportworld();"><textarea id="loadtextarea" cols="55" rows="10"><\/textarea><br>Copy the text from Save World into this box.<br><br><input type="submit" value="Load"><\/form>','')

Sandbox.savewindow = new divwindow('savewindow','Save World',1,'white','yellow',500,300,300,300,3,'<textarea id="savetextarea" cols="55" rows="13"><\/textarea><br>Use Load -> Saved World and copy this text in to load this world.','')

Sandbox.inportworld=function()
  {
  eval(document.getElementById('loadtextarea').value)
  Sandbox.updateworldsize();
  Sandbox.loadwindow.CloseWindow();
  }
	

function saveworld()
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

  for(var k=0;k<connections.length;k++)
    {
    if(connections[k].alive)
      {
      save+="connect("+connections[k].from+","+connections[k].to+","+connections[k].connectionstrength+","+connections[k].connectionlength+","+connections[k].graphics+","+connections[k].type+","+connections[k].hard+"); \n";
      }
    }
  
  for(var k=0;k<Physics.chargedobjects.length;k++)
    {
    save+="Shapes.wholeworld["+Physics.chargedobjects[k].arraypos+"].charged=true;Shapes.wholeworld["+Physics.chargedobjects[k].arraypos+"].charge="+Physics.chargedobjects[k].charge+";Physics.chargedobjects.push(Shapes.wholeworld["+Physics.chargedobjects[k].arraypos+"]); \n"
    }
  
  save+="Physics.gravityY="+gravityY+";Physics.friction="+friction+";Render.viewports[0].x="+viewports[0].x+";Render.viewports[0].y="+viewports[0].y+";Render.viewports[0].zoom="+viewports[0].zoom+";";
  
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
new Shapes.oldRectangle(true,false,[400,-825],4000,2750,10,8,v[0,0,0],[0,0,0],false,false,true,0,1);
//playing area:
//top= -2200
//bottom=550
//left=-1600
//right=2400

//var lowerborder=new entity(1,'lowerborder',0,25550,200000,50000,10,'rgb(121,158,41)',1,0,0,0,0,true,false,1,true,0,0,'',false);
new Shapes.oldRectangle(true,false,[0,25550],200000,50000,10,8,[0,0,0],[0,0,0],true,true,false,0,1);
//var upperborder=new entity(1,'upperborder',0,-51100,200000,100000-2200,10,false,1,0,0,0,0,true,false,1,false,0,0,'',false);
new Shapes.oldRectangle(true,false,[0,-5110],200000,100000-2200,10,8,[0,0,0],[0,0,0],true,true,false,0,1);
//var leftborder=new entity(1,'leftborder',-50800,90000,100000-1600,200000,10,false,1,0,0,0,0,true,false,1,false,0,0,'',false);
new Shapes.oldRectangle(true,false,[-50800,90000],100000-1600,200000,10,8,[0,0,0],[0,0,0],true,true,false,0,1);
//var rightborder=new entity(1,'rightborder',52400,90000,100000,200000,10,false,1,0,0,0,0,true,false,1,false,0,0,'',false);
new Shapes.oldRectangle(true,false,[52400,90000],100000,200000,10,8,[0,0,0],[0,0,0],true,true,false,0,1);



//var ball=new entity(1,'ball',200,100,50,50,50,'red',0,0,0,0,0,true,false,0,true,1,0.95,'','balls/red.gif');

new Shapes.circle(true,true,[200,100],0,25,50,0,[0,0,0],[0,0,0],true,false,true,1,1)
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

//alert(borderpoly.visible)
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

UI.oldloopmouseX=0;
UI.oldloopmouseY=0;

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
  if((drawcounter-1)%Render.viewports[1].sync==0 && Render.viewports[1].enabled)
    {
		Render.viewports[1].canvas.lineWidth=1;
    Render.viewports[1].canvas.strokeStyle='rgb(0,0,0)';
    Render.viewports[1].canvas.strokeRect(Math.ceil((Render.viewports[0].x-Render.viewports[1].x)*Render.viewports[1].zoom)-0.5,Math.ceil((Render.viewports[0].y-Render.viewports[1].y)*Render.viewports[1].zoom)-0.5,Math.floor(Render.viewports[0].width*Render.viewports[1].zoom/Render.viewports[0].zoom),Math.floor(Render.viewports[0].height*Render.viewports[1].zoom/Render.viewports[0].zoom));
    }
  
  //if the mouse is dragging something, move it:
  if(followmouse!==false)
    {
    if(Shapes.wholeworld[followmouse].type==1 && Shapes.wholeworld[followmouse].gametype!==0)
      {//if we're not colliding or don't want collision detection
      
      if(document.getElementById('dragcollisions').checked==false || checkforanycollide2(Shapes.wholeworld[followmouse],mouseX/Render.viewports[0].zoom+Render.viewports[0].x+mousedragdifference[0],mouseY/Render.viewports[0].zoom+Render.viewports[0].y+mousedragdifference[1])===false)
        {
        Shapes.wholeworld[followmouse].x=mouseX/Render.viewports[0].zoom+Render.viewports[0].x+mousedragdifference[0];
        Shapes.wholeworld[followmouse].y=mouseY/Render.viewports[0].zoom+Render.viewports[0].y+mousedragdifference[1];
        }
      }
    }
  
  Sandbox.rotatestuff()
  UI.oldloopmouseX=UI.mouseX
  UI.oldloopmouseY=UI.mouseY
  Sandbox.counter++
  }
