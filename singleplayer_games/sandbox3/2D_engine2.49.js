var addtoworld;

//see if an object with a certain name already exists
function testnameinarray(thisname)
{for (var i5=0;i5<wholeworld.length;i5++)
{if(wholeworld[i5].name == thisname){return i5;}}
return false;}

var viewports=new Array();

function viewport(rendermode,htmlname,x,y,width,height,zoom,sync,bg,enabled)
{
//'canvas' or 'divs'.
this.rendermode=rendermode;
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

switch(this.rendermode)
{
case 'canvas':
if (document.getElementById(htmlname+'canvas').getContext)
{
this.canvas = document.getElementById(htmlname+'canvas').getContext('2d');
this.canvassetup=true;
//this.canvas.globalCompositeOperation = 'darker';
}
document.getElementById(htmlname+'canvas').style.display='block';
break;
case 'divs':
this.world=document.getElementById(htmlname+'divs');
this.divssetup=true;
break;
}

//function to update a viewport
//this.DrawViewport=DrawViewport;

//add to array of viewports
viewports.push(this);
}

function polygon(state,name,x,y,Xs,Ys,mass,colour,type,vx,vy,vw,fx,fy,fw,hard,filled,visible,gametype,elastic)
{
//general stuff
this.name=name;this.mass=mass;this.colour=colour;
//(x,y) is origin of shape, also take as centre of mass.  Xs and Ys are arrays, so (Xs[0],Ys[0])...(Xs[n],Ys[n]) form all the vertices of the shape
this.x=x;this.y=y;

//fill the image, and count anything inside as colliding.
this.filled=filled;

//this.width=Xs;this.height=Ys;

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
this.bigR=largestR;

this.Xs=Xs;this.Ys=Ys;

this.width=this.Rs;this.height=this.As;

//rotation, in radians clockwise from positive x axis (since world is upside down to conventional axis)
this.angle=0;
this.div=name+'div';
//extra stuff to go in the style of the div
//this.divoptions=divoptions;
//consider using documenty.gEtelkememtbyid?
this.img=name+'img';
//types 0 =moveable entitiy, 1= still object
this.type=type;
//v=veloctity,f=force.  x/y = x/y component, w=angular
this.vx=vx;this.vy=vy;this.vw=vw;this.fx=fx;this.fy=fy;this.fw=fw;
//state is used for wether it's alive or dead (out of the world) or whatever 0=dead, 1=alive (in the world), 2= waiting to be brought back, 3 = due for destruction, 4 = due to be reset (white ball)
this.state=state
//sticky types: false means elastic collision, true means all momentum is lost
this.sticky=false;
//shapes, 1= rectangle, 0=circle, 2=square/rectangle, but collide as circle, 3 = polygon
this.shape=3
//can it collide?
this.hard=hard
//game types.  0=border, anything else for anything else
this.gametype=gametype
this.charged=false
//how elastic the collisions are (0->1)
this.elastic=elastic
//is the object drawn?
this.visible=visible
//enter our object into the world array
this.arraypos=wholeworld.length
wholeworld.push(this)

//this.onclickstuff=onclickstuff

this.connected=new Array();//position in connections array of the object with the info for the connection

//functions
this.kill=kill
this.unkill=unkill
this.plotme=plotme
this.updatediv=updatediv
this.updatediv2=updatediv2
this.destroy=destroy
this.makecharged=makecharged;
this.cutfree=cutfree;
this.makediv=makediv;
}

//the object definition for 'entities' which are everything in the world.
function entity(state,name,x,y,width,height,mass,colour,type,vx,vy,fx,fy,hard,sticky,shape,visible,gametype,elastic,divoptions,divimage)
{
var testarray=testnameinarray(name)
if(testarray == false)
{//if this entity isn't already in the world array, add it.....
this.name=name;this.x=x;this.y=y;this.width=width;this.height=height;this.mass=mass;this.colour=colour;
this.div=name+'div';
//extra stuff to go in the style of the div
this.divoptions=divoptions;
//image to use if using divs
this.divimage=divimage;
//consider using documenty.gEtelkememtbyid?
this.img=name+'img';
//types 0 =moveable entitiy, 1= still object
this.type=type;
//v=veloctity,f=force
this.vx=vx;this.vy=vy;this.fx=fx;this.fy=fy;this.vw=0;
//state is used for wether it's alive or dead (out of the world) or whatever 0=dead, 1=alive (in the world), 2= waiting to be brought back, 3 = due for destruction, 4 = due to be reset (white ball)
this.state=state
//sticky types: false means elastic collision, true means all momentum is lost
this.sticky=sticky;
//shapes, 1= rectangle, 0=circle, 2=square/rectangle, but collide as circle, 3 = polygon
this.shape=shape
//can it collide?
this.hard=hard
//game types.  0=border, 1=notcharged, 2=charged
this.gametype=gametype
this.charged=false
//how elastic the collisions are 1=fully, 0.5=partially
this.elastic=elastic
//enter our object into the world array
this.arraypos=wholeworld.length
wholeworld.push(this)
this.visible=visible
//this.onclickstuff=onclickstuff

this.connected=new Array();//position in connections array of the object with the info for the connection

/*
if(!testfordiv(this.div) && this.shape!==3)
{addtoworld="<div id=\'"+this.div+"' style='position:absolute;  width:"+this.width+";"+this.divoptions+" height:"+this.height+";  top:"+this.y+"; left:"+this.x+';'
if(this.state!==1 || this.gametype==0){addtoworld+="display:none;"}else{addtoworld+="display:block;"}
// onClick='"+onclickstuff+"'
//onMouseDown=mousegonedown(event,"+this.arraypos+")
addtoworld+="' ;>";
if(this.divimage!==false){addtoworld+="<img id='"+this.name+"img'  height='"+this.height+"' width='"+this.width+"' src='"+this.divimage+"'>";}
addtoworld+="</div>"
world.innerHTML+=addtoworld}
*/

}else{
//....the worldarray already contains something by this name, so update it
wholeworld[testarray].name=name;wholeworld[testarray].x=x*1;wholeworld[testarray].y=y*1;wholeworld[testarray].width=width*1;wholeworld[testarray].height=height*1;wholeworld[testarray].mass=mass*1;wholeworld[testarray].colour=colour;
wholeworld[testarray].div=name+'div';
wholeworld[testarray].img=name+'img';
wholeworld[testarray].type=type;
wholeworld[testarray].vx=vx;wholeworld[testarray].vy=vy;wholeworld[testarray].fx=fx;wholeworld[testarray].fy=fy;
wholeworld[testarray].state=state
wholeworld[testarray].sticky=sticky;
wholeworld[testarray].shape=shape
wholeworld[testarray].hard=hard
wholeworld[testarray].gametype=gametype
wholeworld[testarray].elastic=elastic
wholeworld[testarray].visible=visible
//if(gametype==2){wholeworld[testarray].walk=0;wholeworld[testarray].direction='right';wholeworld[testarray].health=healthperworm;wholeworld[testarray].aimangle=0;wholeworld[testarray].weapon='rocket';}
wholeworld[testarray].updatediv();
}
//functions
this.kill=kill
this.unkill=unkill
this.plotme=plotme
this.updatediv=updatediv
this.updatediv2=updatediv2
this.destroy=destroy
this.makecharged=makecharged;
this.cutfree=cutfree;
this.makediv=makediv;
}

//tests to see if a div already exists on the page
function testfordiv(id)
{if(document.getElementById(id)){return true;}else{return false;}}

function makediv()
{
if(!testfordiv(this.div) && this.shape!==3)
{addtoworld="<div id=\'"+this.div+"' style='position:absolute;  width:"+this.width+";"+this.divoptions+" height:"+this.height+";  top:"+this.y+"; left:"+this.x+';'
if(this.state!==1 ||this.gametype==0){addtoworld+="display:none;"}else{addtoworld+="display:block;"}
// onClick='"+onclickstuff+"'
//onMouseDown=mousegonedown(event,"+this.arraypos+");
addtoworld+="' >";
if(this.divimage!==false){addtoworld+="<img id='"+this.name+"img'  height='"+this.height+"' width='"+this.width+"' src='"+this.divimage+"'>";}
addtoworld+="</div>"
world.innerHTML+=addtoworld}
}


//connects two objects with a spring
function connect(one,two,strength,howfar,graphics,type,hard)
{
if(howfar===false){
//don't pre-set it, but set it as the current distance
var x1=wholeworld[one].x;
var y1=wholeworld[one].y;

var x2=wholeworld[two].x;
var y2=wholeworld[two].y;


howfar=Math.round(Math.sqrt( Math.pow(x1-x2,2)+Math.pow(y1-y2,2)))

}



var tempvar = new connection(one,two,strength,howfar,graphics,type,hard)

wholeworld[one].connected.push(connections.length-1)
wholeworld[two].connected.push(connections.length-1)
}

//object definition for all thr springs in the world, used for forces and drawing springs
var connections=new Array();
function connection(from,to,connectionstrength,connectionlength,graphics,type,hard)
{
if(to>from){this.from=from;this.to=to;}else{this.to=from;this.from=to;}
this.connectionstrength=connectionstrength
this.connectionlength=connectionlength

if(type==1)//rod
{
this.strengthsqrd=connectionstrength*connectionstrength//square them
this.lengthsqrd=connectionlength*connectionlength
}

this.div=this.from+"-"+this.to+"div";
this.image=this.from+"-"+this.to+"img";

//type of connection, 0=spring; 1=rod
this.type=type

//collision detection; true or false
this.hard=hard;

//0=no line, 1=thin black line, 2= thick black line
this.graphics=graphics

//0=dead, 1=alive
this.state=1;

if(!testfordiv(this.from+"-"+this.to+'div'))
{
document.getElementById('linespan').innerHTML+="<div style='position:absolute;' id='"+this.from+"-"+this.to+"div'><img id='"+this.from+"-"+this.to+"img' src='blank.gif'></div>"
}


this.arraypos=connections.length;
connections.push(this)

this.updateline=updateline
this.breakconnection=breakconnection
this.makeconnectiondiv=makeconnectiondiv;
}

function makeconnectiondiv()
{
if(!testfordiv(this.from+"-"+this.to+'div'))
{
document.getElementById('linespan').innerHTML+="<div style='position:absolute;' id='"+this.from+"-"+this.to+"div'><img id='"+this.from+"-"+this.to+"img' src='blank.gif'></div>"
}
}

function breakconnection()
{
//go and splice all the arrays stored in each object attacted to the spring, and then delete the spring object and splice that from the connections array
//springlines.splice(this.arraypos, 1)
connections[this.arraypos].state=0;
for(var k=0;k<wholeworld[this.from].connected.length;k++)
{
if(wholeworld[this.from].connected[k]==this.arraypos)
{document.getElementById(this.div).style.display='none';
wholeworld[this.from].connected.splice(k,1)}
}

for(var k=0;k<wholeworld[this.to].connected.length;k++)
{
if(wholeworld[this.to].connected[k]==this.arraypos)
{wholeworld[this.to].connected.splice(k,1)}
}

}

//breaks all the springs connected to an entity
function cutfree()
{while(this.connected.length>0)
{connections[this.connected[0]].breakconnection();}}

var linehtml=''

var updatedlines=new Array()
//draws a dotted line for each spring
function updateline(vp)
{
if(this.state==1)
{
switch(this.graphics)
{
case 1:
case '1':
case 2:
//if(!inarray(this.arraypos,updatedlines)){
var startx=wholeworld[this.from].x;
var starty=wholeworld[this.from].y;

var finishx=wholeworld[this.to].x;
var finishy=wholeworld[this.to].y;

switch(rendermode)
{case 'canvas':
viewports[vp].canvas.moveTo((startx-viewports[vp].x)*viewports[vp].zoom,(starty-viewports[vp].y)*viewports[vp].zoom);
viewports[vp].canvas.lineTo((finishx-viewports[vp].x)*viewports[vp].zoom,(finishy-viewports[vp].y)*viewports[vp].zoom);
break;
case 'divs':

var dy=(finishy-starty);
var dx=(finishx-startx);
var grad=dy/dx

if(startx>finishx){var leftx=Math.round(finishx)}else{var leftx=Math.round(startx)}
if(starty>finishy){var topy=Math.round(finishy)}else{var topy=starty}

if(grad<=-6){document.getElementById(this.div).style.top=(topy); document.getElementById(this.div).style.left=(leftx); document.getElementById(this.div).innerHTML="<img src='lines/gradvert.gif' width='"+Math.ceil(Math.abs(dx))+"' height='"+Math.ceil(Math.abs(dy))+"'>";}
else if(grad>-6 && grad<=-1.5){document.getElementById(this.div).style.top=(topy);document.getElementById(this.div).style.left=(leftx);document.getElementById(this.div).innerHTML="<img src='lines/20grad-2.gif' width='"+Math.ceil(Math.abs(dx))+"' height='"+Math.ceil(Math.abs(dy))+"'>";}
else if(grad>-1.5 && grad<=-0.75){document.getElementById(this.div).style.top=(topy);document.getElementById(this.div).style.left=(leftx);document.getElementById(this.div).innerHTML="<img src='lines/20grad-1.gif' width='"+Math.ceil(Math.abs(dx))+"' height='"+Math.ceil(Math.abs(dy))+"'>";}
else if(grad>-0.75 && grad<=-0.2){document.getElementById(this.div).style.top=(topy);document.getElementById(this.div).style.left=(leftx);document.getElementById(this.div).innerHTML="<img src='lines/20grad-0.5.gif' width='"+Math.ceil(Math.abs(dx))+"' height='"+Math.ceil(Math.abs(dy))+"'>";}
else if(grad>-0.2 && grad<=0.2){document.getElementById(this.div).style.top=(topy);document.getElementById(this.div).style.left=(leftx);document.getElementById(this.div).innerHTML="<img src='lines/gradvert.gif' width='"+Math.ceil(Math.abs(dx))+"' height='"+Math.ceil(Math.abs(dy))+"'>";}
else if(grad>0.2 && grad<=0.75){document.getElementById(this.div).style.top=(topy);document.getElementById(this.div).style.left=(leftx);document.getElementById(this.div).innerHTML="<img src='lines/20grad+0.5.gif' width='"+Math.ceil(Math.abs(dx))+"' height='"+Math.ceil(Math.abs(dy))+"'>";}
else if(grad>0.75 && grad<=1.5 ){document.getElementById(this.div).style.top=(topy);document.getElementById(this.div).style.left=(leftx);document.getElementById(this.div).innerHTML="<img src='lines/20grad+1.gif' width='"+Math.ceil(Math.abs(dx))+"' height='"+Math.ceil(Math.abs(dy))+"'>";}
else if(grad>1.5 && grad<=6){document.getElementById(this.div).style.top=(topy);document.getElementById(this.div).style.left=(leftx);document.getElementById(this.div).innerHTML="<img src='lines/20grad+2.gif' width='"+Math.ceil(Math.abs(dx))+"' height='"+Math.ceil(Math.abs(dy))+"'>";}
else if(grad>6){document.getElementById(this.div).style.top=(topy);document.getElementById(this.div).style.left=(leftx);document.getElementById(this.div).innerHTML="<img src='lines/gradvert.gif' width='"+Math.ceil(Math.abs(dx))+"' height='"+Math.ceil(Math.abs(dy))+"'>";}

break;}

//end of if in array
//updatedlines.push(this.arraypos)}

break;}
}
}

var chargedobjects=new Array();

function makecharged(chargeme)//if not 0 then gives an object a charge, if 0 then removes charge
{
if(chargeme==0){this.charged=false;this.charge=0;chargedobjects.splice(this.chargearraypos, 1)
}else{

if(this.charged)//already got a charge, so wipe it first
{this.charged=false;this.charge=0;chargedobjects.splice(this.chargearraypos, 1)}

this.charge=chargeme;
this.charged=true;
this.chargearraypos=chargedobjects.length
chargedobjects.push(this);}
}

function inarray(needle,haystack)
{for (var k=0;k<haystack.length;k++)
{if(haystack[k] == needle){return true;}}
return false;}

var stringballs=new Array(1);
function stringbetween(one,two,density,dotsize,stringstrength,hard)
{//density is distance between each particle

var startx=wholeworld[one].x;
var starty=wholeworld[one].y;

var dx=wholeworld[two].x-wholeworld[one].x;
var dy=wholeworld[two].y-wholeworld[one].y;
var linelength=Math.sqrt(dx*dx+dy*dy);


var dots=Math.ceil(linelength/density) 

//var stringstrength=10000

dx/=dots
dy/=dots

//var firststringball=wholeworld.length;

//alert(stringballs)

new entity(1,'stringball'+stringballs.length,(startx+1*dx),(starty+1*dy),dotsize*1,dotsize*1,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');
stringballs.push(1)
//connect(one,two,strength,howfar,graphics,type,hard)
connect(one,wholeworld.length-1,stringstrength,density,1,0,hard)

for(var d=2;d<dots;d++)
{
new entity(1,'stringball'+stringballs.length,(startx+d*dx),(starty+d*dy),dotsize*1,dotsize*1,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');
stringballs.push(1)
connect(wholeworld.length-2,wholeworld.length-1,stringstrength,density,1,0,hard)
}

connect(wholeworld.length-1,two,stringstrength,density,1,0,hard)

}





//this adds an element to an array and returns true if it is already not in it. Otherwise if it's already in the array it returns false.
function addtoifnotin(thisarray,thisthing)
{var testin=0;
for(var z=0;z<thisarray.length;z++)
{if(thisarray[z]==thisthing){testin++;}}
if(testin==0){thisarray.push(thisthing);return true;}
else{return false;}}

//random mass - specically designed for pool, but can be used anywhere.  Attempt to remove complete uniformness to create a bit more realism
function randommass(aprox,leeway)
{var themass=aprox+(Math.random()-1)*2*leeway
return Math.round(themass)}

var needredraw=false

var drawcounter=0;

function redrawworld()
{
for(var r=0;r<viewports.length;r++)
{
if(drawcounter%viewports[r].sync==0 && viewports[r].enabled)
{
switch(viewports[r].rendermode)
{case 'canvas':
if(viewports[r].bg===false)
{//blank bg
viewports[r].canvas.clearRect(0,0,viewports[r].width,viewports[r].height); // clear canvas
}else{//coloured bg
viewports[r].canvas.fillStyle = viewports[r].bg;
viewports[r].canvas.fillRect(0,0,viewports[r].width,viewports[r].height);
}
//viewports[r].canvas.fillStyle = 'white';
//viewports[r].canvas.fillRect(0,0,800,600);

viewports[r].canvas.beginPath();
for (i4=0;i4<wholeworld.length;i4++)
{wholeworld[i4].plotme(r)}
viewports[r].canvas.fill();

viewports[r].canvas.beginPath();
viewports[r].canvas.strokeStyle='black';
viewports[r].canvas.lineWidth=viewports[r].zoom;

for (i4=0;i4<connections.length;i4++)
{connections[i4].updateline(r)}

viewports[r].canvas.stroke();
break;

case 'divs':
viewports[r].world.innerHTML='';
for (i4=0;i4<wholeworld.length;i4++)
{wholeworld[i4].makediv()}

document.getElementById('linespan').innerHTML='';
for (i4=0;i4<connections.length;i4++)
{connections[i4].makeconnectiondiv()}

break;}

}//end of if drawn this sync
}//end of loop
drawcounter++;
}

//updates an objects div
function updatediv()
{document.getElementById(this.div).style.left=this.x-this.width/2
document.getElementById(this.div).style.top=this.y-this.height/2
document.getElementById(this.div).style.width=this.width
document.getElementById(this.div).style.height=this.height
if(rendermode=='divs'){if(this.state==1){document.getElementById(this.div).style.display="block"}else{document.getElementById(this.div).style.display="none";}}
}
//same as above, but does less and so is faster
function updatediv2()
{document.getElementById(this.div).style.left=this.x-this.width/2
document.getElementById(this.div).style.top=this.y-this.height/2}

//makes an object disapear
function kill()
{this.state=0;
this.cutfree();
this.makecharged(0);
switch(rendermode)
{case 'canvas':
redrawworld();
break;
case 'divs':
document.getElementById(this.div).style.display='none';
break;}
}

//brings entity back
function unkill()
{
if(this.shape!==3){
canwepopout=checkforanycollide(this)
if (canwepopout !==false){this.state=2;if(this.name=='us'){canwepopout.vx=100}}else{this.state=1;}
this.updatediv();
}
}

//doesn't work :P
function destroy()
{
this.cutfree();
this.makecharged(0);
if(this.shape!==3){

//var destroywhom;
//for (var i9=0;i9<wholeworld.length;i9++)
//{if(wholeworld[i9].name==this.name){destroywhom=i9}}
wholeworld.splice(this.arraypos, 1)
}
//delete this
}


//creates a div for an object, same as when the object is first made.  used for re-generating world.
function plotme(vp)//vp=viewport
{
if(this.visible && this.state==1){
switch(this.shape)
{
case 0://circle
viewports[vp].canvas.fillStyle = this.colour

viewports[vp].canvas.moveTo((this.x-viewports[vp].x)*viewports[vp].zoom,(this.y-viewports[vp].y)*viewports[vp].zoom);
viewports[vp].canvas.arc((this.x-viewports[vp].x)*viewports[vp].zoom,(this.y-viewports[vp].y)*viewports[vp].zoom,this.width*viewports[vp].zoom/2,0,Math.PI*2,true);  // draw circle

if(this.arraypos<wholeworld.length-1)
{
if(wholeworld[this.arraypos+1].colour!==this.colour)
{
viewports[vp].canvas.fill();
viewports[vp].canvas.beginPath();
}
}

break;
case 1://rectangle


if(this.name=='lowerborder')
{//alert('lb')
//alert((this.y-viewports[vp].y)*viewports[vp].zoom)
if((this.y-this.width/2-viewports[vp].y)*viewports[vp].zoom<551)
{
//alert((this.y-viewports[vp].y)*viewports[vp].zoom)
viewports[vp].canvas.fillStyle = this.colour
viewports[vp].canvas.fillRect(0,(this.y-this.height/2-viewports[vp].y)*viewports[vp].zoom,viewports[vp].width,viewports[vp].height-(this.y-this.height/2-viewports[vp].y)*viewports[vp].zoom);
}
}else{//normal shape
viewports[vp].canvas.fillStyle = this.colour
viewports[vp].canvas.fillRect((this.x-this.width/2-viewports[vp].x)*viewports[vp].zoom,(this.y-this.height/2-viewports[vp].y)*viewports[vp].zoom,this.width*viewports[vp].zoom,this.height*viewports[vp].zoom);
}

break;
case 4://hollow rectangle.
viewports[vp].canvas.strokeStyle = this.colour
viewports[vp].canvas.strokeRect((this.x-this.width/2-viewports[vp].x)*viewports[vp].zoom,(this.y-this.height/2-viewports[vp].y)*viewports[vp].zoom,this.width*viewports[vp].zoom,this.height*viewports[vp].zoom);
break;
case 3://polygon
//alert(this.name)

viewports[vp].canvas.fill();
viewports[vp].canvas.beginPath();
if(this.filled){viewports[vp].canvas.fillStyle=this.colour;}else{viewports[vp].canvas.strokeStyle=this.colour;}
viewports[vp].canvas.moveTo((this.x+this.Rs[0]*Math.cos(this.angle+this.As[0])-viewports[vp].x)*viewports[vp].zoom,(this.y+this.Rs[0]*Math.sin(this.angle+this.As[0])-viewports[vp].y)*viewports[vp].zoom)

for(var z=1;z<=this.width.length;z++)
{
if(z==this.width.length){var z1=0;}else{var z1=z;}
viewports[vp].canvas.lineTo((this.x+this.Rs[z1]*Math.cos(this.angle+this.As[z1])-viewports[vp].x)*viewports[vp].zoom,(this.y+this.Rs[z1]*Math.sin(this.angle+this.As[z1])-viewports[vp].y)*viewports[vp].zoom)
}
//viewports[vp].canvas.stroke();
if(this.filled){viewports[vp].canvas.fill();}else{viewports[vp].canvas.stroke();}
viewports[vp].canvas.beginPath();

break;
}

}
}

//not used anymore, but was used when the framerate could be altered
function updatefps()
{if (timeperloop!==(1/document.gameform.fpsselect.value)){timeperloop=1/document.gameform.fpsselect.value;refreshrate=1000/document.gameform.fpsselect.value;clearInterval(loopme);loopme=setInterval('loop()',refreshrate)}}



//counts how many of a certain type of peice are are in a certain state
function counttype(thistype,thisstate)
{var typecounter=0;
for (var k=0;k<wholeworld.length;k++)
{if(wholeworld[k].type == thistype && wholeworld[k].state == thisstate){typecounter++}}
return typecounter;}


//general variables used in the main loop (not in this script file anymore)
var newvx
var newvy

//returns angle - not needed, but I didn't used to know that atan2 existed.
function getangle(x,y)
{return Math.atan2(y,x);}

function findacceleration(tempforce,tempmass,tempvelocity,tempfriction)
{
var tempa = (tempforce)/tempmass
//attempt at moddeling friction
if(tempvelocity>1){tempa-=tempfriction}
if(tempvelocity<(-1)){tempa+=tempfriction}
return tempa
}



//the 'collide as' or 'with' functions collide the two objects given to them, 'us' and 'them', and sets the global variables newvy, newvx, theirnewvy and theirnewvx

function collidewithpoly(us,them)//isn't 'us' only ever going to be something which can move?  need to check this.
{
//static poly + moving non-poly
if(wholeworld[us].type==0 && wholeworld[us].shape!==3 && wholeworld[them].type==1 && wholeworld[them].shape==3){staticPolyAndNonPoly(wholeworld[us],wholeworld[them])}
else if(wholeworld[them].type==0 && wholeworld[them].shape!==3 && wholeworld[us].type==1 && wholeworld[us].shape==3){staticPolyAndNonPoly(wholeworld[them],wholeworld[us])}
else if(wholeworld[us].type==0 && wholeworld[us].shape==3 && wholeworld[them].type==1)//moving polygon + static something else.
{

switch(wholeworld[them].shape)//set PCnormalx, PCnormaly, PCpointx, PCpointy
{
case 0://circle

break;
case 1://square
NormAndPointPolyAndSquare(wholeworld[us],wholeworld[them],us,newx,newy,wholeworld[them].x,wholeworld[them].y,newangle)
break;
}

//Vap1 = Va1 + Wa1 x Rap
//W x R = (-WRx, WRy, 0) - cross product. 

//vector from centre of mass to collision point
PCRap=[PCpoint[0]-wholeworld[us].x,PCpoint[1]-wholeworld[us].y];
PCRbp=[PCpoint[0]-wholeworld[them].x,PCpoint[1]-wholeworld[them].y];

//velocity of collision point on each object 
PCVa1=[wholeworld[us].vx - wholeworld[us].vw*PCRap[1] , wholeworld[us].vy + wholeworld[us].vw*PCRap[0]];
PCVb1=[wholeworld[them].vx - wholeworld[them].vw*PCRbp[1] , wholeworld[them].vy + wholeworld[them].vw*PCRbp[0]];

if(wholeworld[them].type==1){PCVb1=[0,0]}

//relative velocity of these points.
PCVab=[ PCVa1[0]-PCVb1[0] , PCVa1[1]-PCVb1[1] ];
//alert(PCVab[1])

PCaI=wholeworld[us].mass*( 100*100 + 100*100)/12;
//alert(PCaI)
PCbI=1000;

// ( Rap x n)^2
var rapnsqrd=Math.pow(  PCRap[0]*PCnormal[1] - PCnormal[0]*PCRap[1] ,2);
var rbpnsqrd=Math.pow(  PCRbp[0]*PCnormal[1] - PCnormal[0]*PCRbp[1] ,2);

if(wholeworld[them].type==0)
{//both objects can move
PCi= ( (-1)*(1+wholeworld[us].elastic)*(PCVab[0]*PCnormal[0]+PCVab[1]*PCnormal[1]) )/( (1/wholeworld[us].mass) + (1/wholeworld[them].mass) + rapnsqrd/PCaI + rbpnsqrd/PCbI);
}else{ //b can't move.
PCi= ( (-1)*(1+wholeworld[us].elastic)*(PCVa1[0]*PCnormal[0]+PCVa1[1]*PCnormal[1]) )/( (1/wholeworld[us].mass)  + rapnsqrd/PCaI);
}

newvx= wholeworld[us].vx + PCi*PCnormal[0]/wholeworld[us].mass
newvy= wholeworld[us].vy + PCi*PCnormal[1]/wholeworld[us].mass
newvw = wholeworld[us].vw + PCi*(PCRap[0]*PCnormal[1] - PCRap[1]*PCnormal[0])/PCaI

}//end of moving poly + static otherwise

}

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

//the functions below find the collision normal - the vector perpendicular to the 'face' of impact and the point of impact.
function NormAndPointPolyAndSquare(poly,square,us,polycentreX,polycentreY,squareX,squareY,newangle)
{
for(var k=0;k<poly.Rs.length;k++)
{//treating corners of polygon as small circles to see if the polygon has entered the square
polyx=polycentreX+poly.Rs[k]*Math.cos(poly.As[k]+newangle);
polyy=polycentreY+poly.Rs[k]*Math.sin(poly.As[k]+newangle);

if(squareX+square.width/2 >= polyx && squareX-square.width/2 <= polyx && squareY-square.height/2 <= polyy && squareY+square.height/2 >= polyy)
{//corner of poly lies INSIDE square

//treat this corner as the point of collision
PCpointx=polyx;
PCpointy=polyy;

//point before collision:
var oldpointX=poly.x+poly.Rs[k]*Math.cos(poly.As[k]);
var oldpointY=poly.y+poly.Rs[k]*Math.sin(poly.As[k]);
var oldsquareX=square.x;
var oldsquareY=square.y;

//using positions of square and poly before they had moved, find which edge of square poly has hit.
if(oldpointX >= oldsquareX+square.width/2 && oldpointY <= oldsquareY+square.height/2 && oldpointY >= oldsquareY-square.height/2)
{//point is on the RIGHT of the square
PCnormalx=1;
PCnormaly=0;
}
else if(oldpointX <= oldsquareX-square.width/2 && oldpointY <= oldsquareY+square.height/2 && oldpointY >= oldsquareY-square.height/2)
{//LEFT hand side
PCnormalx=-1;
PCnormaly=0;
}
else if(oldpointY <= oldsquareY+square.height/2 && oldpointX >= oldsquareX-square.width/2 && oldpointX <= oldsquareX+square.width/2)
{//ABOVE
PCnormalx=0;
PCnormaly=-1;
}
else// if(oldpointY >= oldsquareY+square.height/2 && oldpointX >= oldsquareX-square.width/2 && oldpointX <= oldsquareX+square.width/2)
{//BELOW
PCnormalx=0;
PCnormaly=1;
}

//end of poly inside square
}

//end of polycorners loop.
}

//below script has never been tested - squares are rarely used other than for the borders anymore.
/*
//testing corners of square to see if they're inside the polygon.
//top left
if(inpoly(squareX,squareY,polycentreX,polycentreY,poly.Rs,poly.As,newangle))
{var polylinevector=findpolylinevector(polycentreX,polycentreY,poly.Rs,poly.As,newangle,squareX-square.width/2,squareY-square.height/2)
var normalvector=findnormalvector(polylinevector[0],polylinevector[1],false)
PCnormalx=normalvector[0];
PCnormaly=normalvector[1];
PCpointx=squareX;
PCpointy=squareY;
}else//top right
if(inpoly(squareX+square.width/2,squareY-square.height/2,polycentreX,polycentreY,poly.Rs,poly.As,newangle))
{var polylinevector=findpolylinevector(polycentreX,polycentreY,poly.Rs,poly.As,newangle,squareX+square.width/2,squareY-square.height/2)
var normalvector=findnormalvector(polylinevector[0],polylinevector[1],false)
PCnormalx=normalvector[0];
PCnormaly=normalvector[1];
PCpointx=squareX+square.width;
PCpointy=squareY;
}else//bottom right
if(inpoly(squareX+square.width/2,squareY+square.height/2,polycentreX,polycentreY,poly.Rs,poly.As,newangle))
{var polylinevector=findpolylinevector(polycentreX,polycentreY,poly.Rs,poly.As,newangle,squareX+square.width/2,squareY+square.height/2)
var normalvector=findnormalvector(polylinevector[0],polylinevector[1],false)
PCnormalx=normalvector[0];
PCnormaly=normalvector[1];
PCpointx=squareX+square.width;
PCpointy=squareY+square.height;
}else//bottom left
if(inpoly(squareX-square.width/2,squareY+square.height/2,polycentreX,polycentreY,poly.Rs,poly.As,newangle))
{var polylinevector=findpolylinevector(polycentreX,polycentreY,poly.Rs,poly.As,newangle,squareX-square.width/2,squareY+square.height/2)
var normalvector=findnormalvector(polylinevector[0],polylinevector[1],false)
PCnormalx=normalvector[0];
PCnormaly=normalvector[1];
PCpointx=squareX;
PCpointy=squareY+square.height;
}
*/
PCnormalsize=Math.sqrt(PCnormalx*PCnormalx+PCnormaly*PCnormaly)
PCpoint=[PCpointx,PCpointy];
PCnormal=[PCnormalx/PCnormalsize,PCnormaly/PCnormalsize];

//end of normal and point for poly and square
}


function NormAndPointPolyAndCircle(poly,square,us,polycentreX,polycentreY,squareX,squareY,newangle)
{
for(var k=0;k<poly.Rs.length;k++)
{//treating corners of polygon as small circles to see if the polygon has entered the square
polyx=polycentreX+poly.Rs[k]*Math.cos(poly.As[k]+newangle);
polyy=polycentreY+poly.Rs[k]*Math.sin(poly.As[k]+newangle);


}//end of poly points loop.


}//end of normal and point for poly and circle

function findnormalvector(dx,dy,samesize)//no longer used with new poly collisions
{
var x;
var y;

if(dx!==0 && dy!==0)//neither vertical nor horizontal
{
x=1;
y=(-1)*dx/dy;// dervived from grada*gradb=-1 or a.b=0
}
else if(dx==0)//vertical line
{x=1;y=0;}
else if(dy==0)//horizontal line
{x=0;y=1;}

if(samesize)//make normal vector have same magnitude as old vector
{
var oldsize=Math.sqrt(dy*dy+dx*dx);
var newsize=Math.sqrt(y*y+x*x);
var diffsize=oldsize/newsize
return [x*diffsize,y*diffsize];
}
else
{return [x,y];}

}

//find the vector of the nearest line of a polygon
function findpolylinevector(polyX,polyY,polyAs,polyRs,polyangle,theircentrex,theircentrey)
{

var polyx1=polyX+polyRs[0]*Math.cos(polyAs[0]+polyangle);
var polyy1=polyY+polyRs[0]*Math.sin(polyAs[0]+polyangle);
var polyx2=polyX+polyRs[1]*Math.cos(polyAs[1]+polyangle);
var polyy2=polyY+polyRs[1]*Math.sin(polyAs[1]+polyangle);

//distance between point and each end of the polygon's line, minus the polygon's line.
polyline=0;
var diffinx=polyx2-polyx1;
var diffiny=polyy2-polyy1;
var shortest=dsqrd(polyx1,polyy1,theircentrex,theircentrey)+dsqrd(polyx2,polyy2,theircentrex,theircentrey)-dsqrd(polyx2,polyy2,polyx1,polyy1)

for(var k=0;k<polyRs.length;k++)
{k2=(k+1)%polyRs.length;
polyx1=polyX+polyRs[k]*Math.cos(polyAs[k]+polyangle);
polyy1=polyY+polyRs[k]*Math.sin(polyAs[k]+polyangle);
polyx2=polyX+polyRs[k2]*Math.cos(polyAs[k2]+polyangle);
polyy2=polyY+polyRs[k2]*Math.sin(polyAs[k2]+polyangle);
var testshort=dsqrd(polyx1,polyy1,theircentrex,theircentrey)+dsqrd(polyx2,polyy2,theircentrex,theircentrey)-dsqrd(polyx2,polyy2,polyx1,polyy1)
if(testshort<shortest)
{
shortest=testshort;
polyline=k;
diffinx=polyx2-polyx1;
diffiny=polyy2-polyy1;
}

}

//return polyline;
return [diffinx,diffiny];
}


function NormAndPointPolyAndCircle(poly,circle,us)
{




}


function staticPolyAndNonPoly(us,them)
{//collide a moveable non-polygon with a static polygon.
var k=polyline
//atm all polys are objects so poly can't be 'us'
if(!polycorner)//hit a line of the polygon - not a corner.
{
var k2=(k+1)%them.Rs.length;

var polyx1=them.x+them.Rs[k]*Math.cos(them.As[k]+them.angle);
var polyy1=them.y+them.Rs[k]*Math.sin(them.As[k]+them.angle);
var polyx2=them.x+them.Rs[k2]*Math.cos(them.As[k2]+them.angle);
var polyy2=them.y+them.Rs[k2]*Math.sin(them.As[k2]+them.angle);

var dy=polyy2-polyy1
var dx=polyx2-polyx1
var ourangle=Math.atan2(us.vy,us.vx)
//ourangle is the angle the direction of the ball makes with the x axis, measured in a clockwise direction, where the angle is between 0 and 360 (in radians)
var lineangle=Math.atan2(dy,dx)
//ourangle is the angle the line makes with the x axis, measured in a clockwise direction, where the angle is between 0 and 360
vectorangle=lineangle-ourangle
//don't ask how long this took to work out.
newvx=Math.cos(ourangle+vectorangle*2)*ourspeed
newvy=Math.sin(ourangle+vectorangle*2)*ourspeed;
}else{//hit a corner of the polygon

//circle collision stuff (see collideascircles) - assuming polygon can't move.

ourcentrex=us.x;
ourcentrey=us.y;
theircentrex=them.x+them.Rs[k]*Math.cos(them.As[k]+them.angle);
theircentrey=them.y+them.Rs[k]*Math.sin(them.As[k]+them.angle);
diffinx=theircentrex-ourcentrex;
diffiny=theircentrey-ourcentrey;

collisionangle=Math.atan2(diffiny,diffinx)

ouranglebelowx=Math.atan2(us.vy,us.vx)
theiranglebelowx=Math.atan2(them.vy,them.vx)

//ourspeed is set earlier
ourparellelv=ourspeed*(Math.cos(ouranglebelowx-collisionangle))
ourperpendicularv=ourspeed*(Math.sin(ouranglebelowx-collisionangle))


ournewparellelv=ourparellelv*(-1)
newvx=ournewparellelv*(Math.cos(collisionangle))+ourperpendicularv*(Math.cos(collisionangle+(Math.PI/2)))
newvy=ournewparellelv*(Math.sin(collisionangle))+ourperpendicularv*(Math.sin(collisionangle+(Math.PI/2)))

}




//end of staticPolyAndNonPoly
}

function collideassquares(us,them)
{

//from an equation I found on the internet (elastic collisons, re-arrangement of the above two equations)
if(them.type == 0){//we're colliding with an entity, so it can also move

//1D collision equations dervived from kinetic energy and conservation of momentum, probably incorrectly applied in a 2D context
newvx=( (us.mass-them.mass)/(us.mass+them.mass))*us.vx+( (2*them.mass)/(us.mass+them.mass) )*them.vx
newvy=( (us.mass-them.mass)/(us.mass+them.mass))*us.vy+( (2*them.mass)/(us.mass+them.mass) )*them.vy
theirnewvx=( (them.mass-us.mass)/(them.mass+us.mass))*them.vx+( (2*us.mass)/(them.mass+us.mass) )*us.vx
theirnewvy=( (them.mass-us.mass)/(them.mass+us.mass))*them.vy+( (2*us.mass)/(them.mass+us.mass) )*us.vy
}else{//they're an object

dontcontinue=0
theirleft=them.x-them.width/2
theirright=them.x+them.width/2;
theirtop=them.y-them.height/2
theirbottom=them.y+them.height/2
//alert('pop')
if(us.y-us.height/2>theirtop && us.y-us.height/2<theirbottom && dontcontinue==0  && us.shape !==3){newvx=us.vx*(-1);newvy=us.vy;dontcontinue++;}
if(us.x-us.width/2>theirleft &&us.x-us.width/2<theirright && dontcontinue==0 && us.shape !==3){newvy=us.vy*(-1);newvx=us.vx;dontcontinue++}
if(us.y+us.height/2>theirtop && us.y+us.height/2<theirbottom && dontcontinue==0 && us.shape !==3){newvx=us.vx*(-1);newvy=us.vy;dontcontinue++;}
if(us.x+us.width/2>theirleft && us.x+us.width/2<theirright && dontcontinue==0 && us.shape !==3){newvy=us.vy*(-1);newvx=us.vx;dontcontinue++}

/*
theirleft=them.x
theirright=them.x+them.width
theirtop=them.y
theirbottom=them.y+them.height
if(us.y>theirtop && us.y<theirbottom && dontcontinue==0  && us.shape !==3){newvx=us.vx*(-1);newvy=us.vy;dontcontinue++;}
if(us.x>theirleft &&us.x<theirright && dontcontinue==0 && us.shape !==3){newvy=us.vy*(-1);newvx=us.vx;dontcontinue++}
if(us.y+us.height>theirtop && us.y+us.height<theirbottom && dontcontinue==0 && us.shape !==3){newvx=us.vx*(-1);newvy=us.vy;dontcontinue++;}
if(us.x+us.width>theirleft && us.x+us.width<theirright && dontcontinue==0 && us.shape !==3){newvy=us.vy*(-1);newvx=us.vx;dontcontinue++}
*/

if(dontcontinue==0 || us.shape ==3)
{
collideascircles(us,them)
//alert('inside squares - circles')
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

//if(ourcentrex==theircentrex){ourcentrex+=0.1}

//if(diffinx == 0){collisionangle=0}else{collisionangle=Math.atan(diffiny/diffinx)}

collisionangle=getangle(diffinx,diffiny)

//essentially, momentum is conserved parrellel and perpendicular to the angle of collision
//http://director-online.com/buildArticle.php?id=532 proved immensly useful, and in actual fact, rendered most of 
//my previous work at collisions wasted as I re-wrote a lot of it

ouranglebelowx=getangle(us.vx,us.vy)
theiranglebelowx=getangle(them.vx,them.vy)

//ourspeed is set earlier
theirspeed=Math.sqrt(them.vx*them.vx+them.vy*them.vy)
ourparellelv=ourspeed*(Math.cos(ouranglebelowx-collisionangle))
ourperpendicularv=ourspeed*(Math.sin(ouranglebelowx-collisionangle))
theirparellelv=theirspeed*(Math.cos(theiranglebelowx-collisionangle))
theirperpendicularv=theirspeed*(Math.sin(theiranglebelowx-collisionangle))
if(them.type == 0){//we're colliding with an entity, so it can also move

ournewparellelv=( (us.mass-them.mass)/(us.mass+them.mass))*ourparellelv+( (2*them.mass)/(us.mass+them.mass) )*theirparellelv
theirnewparellelv=( (them.mass-us.mass)/(them.mass+us.mass))*theirparellelv+( (2*us.mass)/(them.mass+us.mass) )*ourparellelv
newvx=ournewparellelv*(Math.cos(collisionangle))+ourperpendicularv*(Math.cos(collisionangle+(Math.PI/2)))
newvy=ournewparellelv*(Math.sin(collisionangle))+ourperpendicularv*(Math.sin(collisionangle+(Math.PI/2)))
theirnewvx=theirnewparellelv*(Math.cos(collisionangle))+theirperpendicularv*(Math.cos(collisionangle+(Math.PI/2)))
theirnewvy=theirnewparellelv*(Math.sin(collisionangle))+theirperpendicularv*(Math.sin(collisionangle+(Math.PI/2)))

}else{//we're colliding with an object, so it can't move

ournewparellelv=ourparellelv*(-1)
newvx=ournewparellelv*(Math.cos(collisionangle))+ourperpendicularv*(Math.cos(collisionangle+(Math.PI/2)))
newvy=ournewparellelv*(Math.sin(collisionangle))+ourperpendicularv*(Math.sin(collisionangle+(Math.PI/2)))

}
}


function checkforanycollide(collidee)
{//checks to see if specific shape is currently in a collision
for(i5=0;i5<wholeworld.length;i5++)
{

if(wholeworld[i5].type==0 && wholeworld[i5].state==1)
{
var testcollide=checkcollide(collidee.x,collidee.y,collidee.width,collidee.height,collidee.shape,wholeworld[i5].x,wholeworld[i5].y,wholeworld[i5].width,wholeworld[i5].height,wholeworld[i5].shape)
if(testcollide == true){return wholeworld[i5]}
}

}
return false;
}

function checkforanycollide2(collidee,newx,newy)
{//checks to see if specific shape will be in a collision at a specified new position
for(var z=0;z<wholeworld.length;z++)
{
//wholeworld[i5].type==0 &&
if(wholeworld[z].state==1 && z!==collidee.arraypos && wholeworld[z].hard)
{
var testcollide=checkcollide(newx,newy,collidee.width,collidee.height,collidee.shape,wholeworld[z].x,wholeworld[z].y,wholeworld[z].width,wholeworld[z].height,wholeworld[z].shape,collidee.bigR,wholeworld[z].bigR,collidee.angle,wholeworld[z].angle,collidee.filled,wholeworld[z].filled)
if(testcollide == true){return wholeworld[z]}
}

}
return false;
}

function checkforanycollide2b(collidee,newangle)
{//checks to see if specific shape will be in a collision at a specified new angle
for(var z=0;z<wholeworld.length;z++)
{
//wholeworld[i5].type==0 &&
if(wholeworld[z].state==1 && z!==collidee.arraypos && wholeworld[z].hard)
{
var testcollide=checkcollide(collidee.x,collidee.y,collidee.width,collidee.height,collidee.shape,wholeworld[z].x,wholeworld[z].y,wholeworld[z].width,wholeworld[z].height,wholeworld[z].shape,collidee.bigR,wholeworld[z].bigR,newangle,wholeworld[z].angle,collidee.filled,wholeworld[z].filled)
if(testcollide == true){return wholeworld[z]}
}

}
return false;
}

function checkforanycollide3(x,y,w,h,s,r,a,f)
{//checks to see if THEORETICAL (non-poly) shape will be in a collision at a specified position
for(var z=0;z<wholeworld.length;z++)
{
if(wholeworld[z].state==1 && wholeworld[z].hard)// && wholeworld[z].hard)
{//(x1,y1,w1,h1,s1,x2,y2,w2,h2,s2,r1,r2,a1,a2,f1,f2)
var testcollide=checkcollide(x,y,w,h,s,wholeworld[z].x,wholeworld[z].y,wholeworld[z].width,wholeworld[z].height,wholeworld[z].shape,r,wholeworld[z].bigR,a,wholeworld[z].angle,f,wholeworld[z].filled)
if(testcollide == true){return z;}
}

}
return false;
}

function checkforanycollide4(x,y,w,h,s,ignore1,ignore2)
{//checks to see if THEORETICAL shape will be in a collision at a specified position, and ignore 2 collisions
for(var z=0;z<wholeworld.length;z++)
{
if(wholeworld[z].state==1 && wholeworld[z].hard && z!==ignore1 && z!==ignore2 && wholeworld[z].gametype!==0)
{
var testcollide=checkcollide(x,y,w,h,s,wholeworld[z].x,wholeworld[z].y,wholeworld[z].width,wholeworld[z].height,wholeworld[z].shape,0,wholeworld[z].bigR,0,wholeworld[z].angle,false,wholeworld[z].filled)
if(testcollide == true){return z;}
}

}
return false;
}


function checkspecifics(testx,testy,testwidth,testheight,testshape,testname,testobject)
{//checks if a given theoretical shape would collide
for(i5=0;i5<wholeworld.length;i5++)
{
//wholeworld[i5].type==0 && 
if(wholeworld[i5].state==1 && wholeworld[i5].hard && testname!==wholeworld[i5].name)
{
if(checkcollide(testx,testy,testwidth,testheight,testshape,wholeworld[i5].x,wholeworld[i5].y,wholeworld[i5].width,wholeworld[i5].height,wholeworld[i5].shape,testobject,wholeworld[i5]) == true){return wholeworld[i5]}
}

}
return false;
}



var polycollide;

//x,y=topleft coords, w=width,h=height,s=shape, r=biggest length from polygon, a=angle of polygon, f=polygon filled
function checkcollide(x1,y1,w1,h1,s1,x2,y2,w2,h2,s2,r1,r2,a1,a2,f1,f2)//,us,them)
{
rightx1=x1+w1/2
rightx2=x2+w2/2
bottomy1=y1+h1/2
bottomy2=y2+h2/2
centrex1=x1;
centrex2=x2;
centrey1=y1;
centrey2=y2;
rad1=h1/2
rad2=h2/2
if(s1==0 && s2==0)//both are circles
{
radii=Math.pow((rad1+rad2),2);
//pythagoras - this was pythag, but since square roots are slow maths, I've decided to just compare the squares.
var circledistance= (centrex1-centrex2)*(centrex1-centrex2)+(centrey1-centrey2)*(centrey1-centrey2) 
//alert(circledistance) 
//if the distance between the two circles is less than or equal to the sum of their two radii then they'll collide
if(circledistance<radii){return true}
}

//shapes,0=circle, 1= rectangle,  2=square/rectangle (obselete, I think), but collide as circle, 3 = polygon, 4= line

else if(s1==4 && s2==0)//line + circle
{
//using width and height for the second set of co-ords for a line
if(circleandline(x1,w1,y1,h1,x2+w2/2,y2+h2/2,w2/2)){return true;}
}
else if(s1==0 && s2==4)//line + circle
{
//using width and height for the second set of co-ords for a line
if(circleandline(x2,w2,y2,h2,x1+w1/2,y1+h1/2,w1/2)){return true;}
}
else if(s1==3 || s2==3)//involves a polygon
{
if(s1==3)
{
//(polyX,polyY,polyXs,polyYs,polybigR,theirx,theiry,notpolywidth,notpolyheight,notpolyshape)
var polycollide=polyandshape(x1,y1,w1,h1,r1,a1,f1,x2,y2,w2,h2,s2)}
else{var polycollide=polyandshape(x2,y2,w2,h2,r2,a2,f2,x1,y1,w1,h1,s1)}
//alert(polycollide)
if(polycollide){return true;}

}else{//circle + rectangle combo

if(rightx1 > x2-w2/2 && x1-w1/2 < (x2+w2/2) && y1-h1/2 < (y2+h2/2) && bottomy1 > y2-h2/2){return true}
}
return false;
}

function inpoly(x,y,polyX,polyY,polyRs,polyAs,polyangle)
{//test to see if a single point is inside a certain polygon.
var crosslines=0;
var x2=x+1000;
for(var p=0;p<polyRs.length;p++)
{var p2=(p+1)%polyRs.length
if(linesintersect(x,y,x2,y,polyX+polyRs[p]*Math.cos(polyAs[p]+polyangle),polyY+polyRs[p]*Math.sin(polyAs[p]+polyangle),polyX+polyRs[p2]*Math.cos(polyAs[p2]+polyangle),polyY+polyRs[p2]*Math.sin(polyAs[p2]+polyangle))){crosslines++}
}
if(crosslines%2==0)
{
//even :. outside poly.
return false;
}else{
//odd :. inside poly
return true;
}
}



var polyline=false;
var polycorner=false;

function polyandshape(polyX,polyY,polyRs,polyAs,polybigR,polyangle,polyfilled,theirx,theiry,notpolywidth,notpolyheight,notpolyshape)
{//detects if there's a collision with a polygon

//polyRs = radii of verticies from centre
//polyAs = angle of verticles from centre

theircentrex=theirx;
theircentrey=theiry;

//optimisation - treat poly as giant circle
if(dsqrd(polyX,polyY,theircentrex,theircentrey)>Math.pow(polybigR+notpolywidth+notpolyheight,2))
{//they're too far away to be able to collide
return false;
}

//check to see if their shape has hit a corner treating the corner as a very small circle
if(notpolyshape==0)
{
for(var k=0;k<polyRs.length;k++)
{
polyx1=polyX+polyRs[k]*Math.cos(polyAs[k]+polyangle);
polyy1=polyY+polyRs[k]*Math.sin(polyAs[k]+polyangle);
if(dsqrd(polyx1,polyy1,theircentrex,theircentrey)<(notpolywidth/2)*(notpolywidth/2))
{polyline=k;polycorner=true;return true;}
}
}
polycorner=false;


//if polygon is 'filled', check to see if shape is inside.
if(polyfilled)//check to see if bigR is greater than notpolywidth?
{
if(inpoly(theircentrex,theircentrey,polyX,polyY,polyRs,polyAs,polyangle))
{//find which line of the polygon is nearest.

var polyx1=polyX+polyRs[0]*Math.cos(polyAs[0]+polyangle);
var polyy1=polyY+polyRs[0]*Math.sin(polyAs[0]+polyangle);
var polyx2=polyX+polyRs[1]*Math.cos(polyAs[1]+polyangle);
var polyy2=polyY+polyRs[1]*Math.sin(polyAs[1]+polyangle);

//distance between point and each end of the polygon's line, minus the polygon's line.
polyline=0;
var shortest=dsqrd(polyx1,polyy1,theircentrex,theircentrey)+dsqrd(polyx2,polyy2,theircentrex,theircentrey)-dsqrd(polyx2,polyy2,polyx1,polyy1)

for(var k=0;k<polyRs.length;k++)
{k2=(k+1)%polyRs.length;
polyx1=polyX+polyRs[k]*Math.cos(polyAs[k]+polyangle);
polyy1=polyY+polyRs[k]*Math.sin(polyAs[k]+polyangle);
polyx2=polyX+polyRs[k2]*Math.cos(polyAs[k2]+polyangle);
polyy2=polyY+polyRs[k2]*Math.sin(polyAs[k2]+polyangle);
var testshort=dsqrd(polyx1,polyy1,theircentrex,theircentrey)+dsqrd(polyx2,polyy2,theircentrex,theircentrey)-dsqrd(polyx2,polyy2,polyx1,polyy1)
if(testshort<shortest){shortest=testshort;polyline=k;}}
return true;}}


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




//var dy=polyy2-polyy1
//var dx=polyx2-polyx1

if(polyx1<polyx2){var testpolyx1=polyx1;var testpolyx2=polyx2}else{var testpolyx1=polyx2;var testpolyx2=polyx1}
if(polyy1<polyy2){var testpolyy1=polyy1;var testpolyy2=polyy2}else{var testpolyy1=polyy2;var testpolyy2=polyy1}

var dy=testpolyy2-testpolyy1
var dx=testpolyx2-testpolyx1

if(notpolyshape!==0)//check all four corners of rectangle
{
var leftx=theirx-notpolywidth/2
var topy=theiry-notpolyheight/2
var rightx=theirx+notpolywidth/2
var bottomy=theiry+notpolyheight/2
//top line of square
if(linesintersect(leftx,topy,rightx,topy,polyx1,polyy1,polyx2,polyy2)){polyline=k;return true}
//right hand side
if(linesintersect(rightx,topy,rightx,bottomy,polyx1,polyy1,polyx2,polyy2)){polyline=k;return true}
//bottom line
if(linesintersect(leftx,bottomy,rightx,bottomy,polyx1,polyy1,polyx2,polyy2)){polyline=k;return true}
//left had side
if(linesintersect(leftx,topy,leftx,bottomy,polyx1,polyy1,polyx2,polyy2)){polyline=k;return true}

}else{//circle intersecting with a line

var r=notpolywidth/2
var a=theircentrex
var b=theircentrey
var x1=testpolyx1
var y1=testpolyy1
//gradient of poly line
var m=dy/dx

if(circleandline(testpolyx1,testpolyx2,testpolyy1,testpolyy2,a,b,r)){polyline=k;return true;}

//alert(m)
/*
switch(m)
{

case Infinity:
case -Infinity:
//vertical line - we know x, but have potentially two possible Ys
var x=x1
//b^2 - 4ac
var discrim=Math.pow((-2*b),2)-4*(b*b+(x-a)*(x-a)-r*r)
if(discrim>=0)
{//minus
var y=(-(-2*b)-Math.sqrt(discrim))/2
if(testpolyx1<=x && x<= testpolyx2 && testpolyy1<=y && y<=testpolyy2){polyline=k;return true}
//plus
var y=(-(-2*b)+Math.sqrt(discrim))/2
if(testpolyx1<=x && x<= testpolyx2 && testpolyy1<=y && y<=testpolyy2){polyline=k;return true}
}

break;
case 0:
//horizontal line, two potential Xs
var y=y1
var discrim=Math.pow((-2*a),2)-4*(a*a+(y-b)*(y-b)-r*r)
if(discrim>=0)
{//minus
var x=(-(-2*a)-Math.sqrt(discrim))/2
if(testpolyx1<=x && x<= testpolyx2 && testpolyy1<=y && y<=testpolyy2){polyline=k;return true}
//plus
var y=(-(-2*a)+Math.sqrt(discrim))/2
if(testpolyx1<=x && x<= testpolyx2 && testpolyy1<=y && y<=testpolyy2){polyline=k;return true}
}

break;

default:
//re-arrangement of the equation of a circle and the equation of a straight line to find the x co-ordinate of an intersection
var discrim=Math.pow((-2*a-2*m*m*x1+2*y1*m-2*b*m),2)-4*(1+m*m)*(-2*m*x1*y1+2*m*x1*b+m*m*x1*x1-r*r+a*a+(y1-b)*(y1-b))
//if discriminant is less than zero then there are no real roots and :. no interesction
if(discrim>=0)
{//circle intersects line, but where?
//minus first
var x=(-(-2*a-2*m*m*x1+2*y1*m-2*b*m)-Math.sqrt(discrim))/(2*(1+m*m))
var y=m*(x-x1)+y1
if(testpolyx1<=x && x<= testpolyx2 && testpolyy1<=y && y<=testpolyy2){polyline=k;return true}
//then plus
x=(-(-2*a-2*m*m*x1+2*y1*m-2*b*m)+Math.sqrt(discrim))/(2*(1+m*m))
y=m*(x-x1)+y1
if(testpolyx1<=x && x<= testpolyx2 && testpolyy1<=y && y<=testpolyy2){polyline=k;return true}
//end of discrim if
}

break;
//end of m switch
}
*/



//end of circle if
}
//end of optimisation if
}
//end of loop
}
//RETURN TRUE
//return true;
return false
}

//checks for intersection
function linesintersect(sx1,sy1,sx2,sy2,px1,py1,px2,py2)
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

}else{
//an infinite gradient means a vertical line
if(sm==-Infinity){sm=Infinity}
if(pm==-Infinity){pm=Infinity}
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
if(sx1test<=x && x<=sx2test && px1test<= x && x<=px2test && sy1test<=y && y<=sy2test && py1test<=y && y<=py2test){return true}

//end of optimisation
//}

return false;
}

function toradians(degrees)
{return ((Math.PI/180)*degrees)}

//distance between two points.
function distance(dx1,dy1,dx2,dy2)
{var dx=dx2-dx1
var dy=dy2-dy1
return Math.sqrt(dx*dx+dy*dy)}

//distance squared
function dsqrd(dx1,dy1,dx2,dy2)
{var dx=dx2-dx1
var dy=dy2-dy1
return dx*dx+dy*dy;}

//does a circle intersect a line?
function circleandline(x1,x2,y1,y2,a,b,r)
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

//var dy=y2-y1;
//var dx=x2-x1;
var dy=testy2-testy1;
var dx=testx2-testx1;
//gradient of line
var m=dy/dx

switch(m)
{

case Infinity:
case -Infinity:
//vertical line - we know x, but have potentially two possible Ys
var x=testx1
//b^2 - 4ac
var discrim=Math.pow((-2*b),2)-4*(b*b+(x-a)*(x-a)-r*r)
if(discrim>=0)
{//minus
var y=(-(-2*b)-Math.sqrt(discrim))/2
if(testx1<=x && x<= testx2 && testy1<=y && y<=testy2){return true;}
//plus
var y=(-(-2*b)+Math.sqrt(discrim))/2
if(testx1<=x && x<= testx2 && testy1<=y && y<=testy2){return true;}
}

break;
case 0:
//horizontal line, two potential Xs
var y=y1
var discrim=Math.pow((-2*a),2)-4*(a*a+(y-b)*(y-b)-r*r)
if(discrim>=0)
{//minus
var x=(-(-2*a)-Math.sqrt(discrim))/2
if(testx1<=x && x<= testx2 && testy1<=y && y<=testy2){return true;}
//plus
var y=(-(-2*a)+Math.sqrt(discrim))/2
if(testx1<=x && x<= testx2 && testy1<=y && y<=testy2){return true;}
}

break;

default:
//re-arrangement of the equation of a circle and the equation of a straight line to find the x co-ordinate of an intersection
var discrim=Math.pow((-2*a-2*m*m*x1+2*y1*m-2*b*m),2)-4*(1+m*m)*(-2*m*x1*y1+2*m*x1*b+m*m*x1*x1-r*r+a*a+(y1-b)*(y1-b))
//if discriminant is less than zero then there are no real roots and :. no interesction
if(discrim>=0)
{//circle intersects line, but where?
//minus first
var x=(-(-2*a-2*m*m*x1+2*y1*m-2*b*m)-Math.sqrt(discrim))/(2*(1+m*m))
var y=m*(x-x1)+y1
if(testx1<=x && x<= testx2 && testy1<=y && y<=testy2){return true;}
//then plus
x=(-(-2*a-2*m*m*x1+2*y1*m-2*b*m)+Math.sqrt(discrim))/(2*(1+m*m))
y=m*(x-x1)+y1
if(testx1<=x && x<= testx2 && testy1<=y && y<=testy2){return true;}
//end of discrim if
}

break;
//end of m switch
}

//end of more detail if statement
//}
return false;
}