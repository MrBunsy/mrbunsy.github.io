var addtoworld;

//see if an object with a certain name already exists
function testnameinarray(thisname)
{for (var i5=0;i5<wholeworld.length;i5++)
{if(wholeworld[i5].name == thisname){return i5;}}
return false;}


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
this.vx=vx;this.vy=vy;this.fx=fx;this.fy=fy;
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


if(!testfordiv(this.div) && this.shape!==3)
{addtoworld="<div id=\'"+this.div+"' style='position:absolute;  width:"+this.width+";"+this.divoptions+" height:"+this.height+";  top:"+this.y+"; left:"+this.x+';'
if(this.state!==1 || this.gametype==0){addtoworld+="display:none;"}else{addtoworld+="display:block;"}
// onClick='"+onclickstuff+"'
//onMouseDown=mousegonedown(event,"+this.arraypos+")
addtoworld+="' ;>";
if(this.divimage!==false){addtoworld+="<img id='"+this.name+"img' height='"+this.height+"' width='"+this.width+"' src='"+this.divimage+"'>";}
addtoworld+="</div>"
world.innerHTML+=addtoworld}


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


//object definition for all thr springs in the world, used for forces and drawing springs
var connections=new Array();
function connection(from,to,connectionstrength,connectionlength,graphics,type,hard)
{
if(to>from){this.from=from;this.to=to;}else{this.to=from;this.from=to;}
this.connectionstrength=connectionstrength
this.connectionlength=connectionlength

this.div=this.from+"-"+this.to+"div";
this.image=this.from+"-"+this.to+"img";

//type of connection, 0=spring;
this.type=type

//collision detection; true or false
this.hard=hard;

//0=no line, 1=line
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
function updateline()
{
if(this.state==1)
{
switch(this.graphics)
{
case 1:
case '1':
//if(!inarray(this.arraypos,updatedlines)){
var startx=wholeworld[this.from].x+wholeworld[this.from].width/2;
var starty=wholeworld[this.from].y+wholeworld[this.from].height/2;
var finishx=wholeworld[this.to].x+wholeworld[this.to].width/2;
var finishy=wholeworld[this.to].y+wholeworld[this.to].height/2;

switch(rendermode)
{case 'canvas':
ctx.moveTo(startx,starty);
ctx.lineTo(finishx,finishy);
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

var startx=wholeworld[one].x+wholeworld[one].width/2-Math.round(dotsize/2);
var starty=wholeworld[one].y+wholeworld[one].height/2-Math.round(dotsize/2);

var dx=wholeworld[two].x+wholeworld[two].width/2-wholeworld[one].x-wholeworld[one].width/2;
var dy=wholeworld[two].y+wholeworld[two].height/2-wholeworld[one].y-wholeworld[one].height/2;
var linelength=Math.sqrt(dx*dx+dy*dy);


var dots=Math.ceil(linelength/density) 

//var stringstrength=10000

dx/=dots
dy/=dots

//var firststringball=wholeworld.length;

//alert(stringballs)

new entity(1,'stringball'+stringballs.length,(startx+1*dx),(starty+1*dy),dotsize*1,dotsize*1,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');
stringballs.push(1)

connect(one,wholeworld.length-1,stringstrength,density,1,0,hard)

for(var d=2;d<dots;d++)
{
new entity(1,'stringball'+stringballs.length,(startx+d*dx),(starty+d*dy),dotsize*1,dotsize*1,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');
stringballs.push(1)
connect(wholeworld.length-2,wholeworld.length-1,stringstrength,density,1,0,hard)
}

connect(wholeworld.length-1,two,stringstrength,density,1,0,hard)

}



//connects two objects with a spring
function connect(one,two,strength,howfar,graphics,type,hard)
{//linetypes: 1=dots, otherwise=nothing
if(howfar===false){
//don't pre-set it, but set it as the current distance
howfar=Math.round(Math.sqrt( Math.pow(wholeworld[one].x+wholeworld[one].width/2-wholeworld[two].x-wholeworld[two].width/2,2)+Math.pow(wholeworld[one].y+wholeworld[one].height/2-wholeworld[two].y-wholeworld[two].height/2,2)))

}

var tempvar = new connection(one,two,strength,howfar,graphics,type,hard)

wholeworld[one].connected.push(connections.length-1)
wholeworld[two].connected.push(connections.length-1)
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


function redrawworld()
{
switch(rendermode)
{case 'canvas':
//ctx.clearRect(0,0,800,600); // clear canvas

ctx.fillStyle = 'black';
ctx.fillRect(0,0,800,600);
case 'blur':
case 'IEblur':

if(makingmap)
{
ctx.fillStyle = 'black';
ctx.fillRect(0,0,800,600);
}

//ctx.beginPath();
for (i4=0;i4<wholeworld.length;i4++)
{wholeworld[i4].plotme()}
//ctx.fill();
/*
ctx.beginPath();
for (i4=0;i4<connections.length;i4++)
{connections[i4].updateline()}
ctx.stroke();
*/
break;

case 'divs':
world.innerHTML='';
for (i4=0;i4<wholeworld.length;i4++)
{wholeworld[i4].makediv()}

document.getElementById('linespan').innerHTML='';
for (i4=0;i4<connections.length;i4++)
{connections[i4].makeconnectiondiv()}

break;}

}

//updates an objects div
function updatediv()
{document.getElementById(this.div).style.left=this.x
document.getElementById(this.div).style.top=this.y
document.getElementById(this.div).style.width=this.width
document.getElementById(this.div).style.height=this.height
if(rendermode=='divs'){if(this.state==1){document.getElementById(this.div).style.display="block"}else{document.getElementById(this.div).style.display="none";}}
}
//same as above, but does less and so is faster
function updatediv2()
{document.getElementById(this.div).style.left=this.x
document.getElementById(this.div).style.top=this.y}

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
case 'IEblur':
case 'blur':
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
function plotme()
{

if(this.shape!==3  && this.visible && this.state==1){
switch(this.shape)
{
case 0://CIRCLE
if(!makingmap)
{
//alert(this.gametype)
switch(this.gametype)
{
case 2://PLANET
//ctx.beginPath()
var grad = ctx.createLinearGradient(this.x,this.y,this.x+this.width,this.y+this.height);
grad.addColorStop(0,this.colour);
grad.addColorStop(1,'black');

if(simplegraphics){grad=this.colour}
ctx.beginPath()
ctx.fillStyle =grad


//1 in 5 chance of having a ring around a planet.
var havering=Math.round(Math.random()*4)
if(havering==0 && !simplegraphics){havering=true;}else{havering=false}

if(havering)
{
var centrex=this.x+this.width/2
var centrey=this.y+this.height/2
var radius=this.width/2
var bigrad=radius*1.25
var angle=-Math.PI/2+Math.random()*Math.PI
var Lx=centrex-Math.cos(angle)*bigrad
var Ly=centrey-Math.sin(angle)*bigrad
var Rx=centrex+Math.cos(angle)*bigrad
var Ry=centrey+Math.sin(angle)*bigrad
var LUx=Lx+Math.cos(angle-Math.PI/2)*radius
var LUy=Ly+Math.sin(angle-Math.PI/2)*radius
var LDx=Lx-Math.cos(angle-Math.PI/2)*radius
var LDy=Ly-Math.sin(angle-Math.PI/2)*radius
var RUx=Rx+Math.cos(angle-Math.PI/2)*radius
var RUy=Ry+Math.sin(angle-Math.PI/2)*radius
var RDx=Rx-Math.cos(angle-Math.PI/2)*radius
var RDy=Ry-Math.sin(angle-Math.PI/2)*radius

var grad2 = ctx.createLinearGradient(centrex-bigrad,centrey-bigrad,centrex+bigrad,centrey+bigrad);
grad2.addColorStop(0,'rgb(192,192,192)');
grad2.addColorStop(1,'rgb(0,0,0)');//rgb(90,78,28)

ctx.moveTo(Lx,Ly);
if(IE){grad2="gray"}

ctx.strokeStyle=grad2
ctx.lineWidth=this.width/10
ctx.lineCap='round';

ctx.bezierCurveTo(LUx, LUy, RUx, RUy, Rx,Ry)
//ctx.closePath();
ctx.stroke()
}

ctx.beginPath();
ctx.moveTo(this.x+this.width/2,this.y+this.height/2);
ctx.arc(this.x+this.width/2,this.y+this.height/2,this.width/2,0,Math.PI*2,true);  // draw circle
ctx.closePath();
ctx.fill();

if(havering)
{
ctx.beginPath()
ctx.moveTo(Lx,Ly);
ctx.strokeStyle=grad2
ctx.lineWidth=this.width/10
ctx.lineCap='round';
ctx.bezierCurveTo(LDx, LDy, RDx, RDy, Rx,Ry)
//ctx.closePath();
ctx.stroke()

if(IE)
{//this tidies up a gap where the two halves of the ring meet in IE

ctx.fillStyle=grad2
ctx.beginPath();
ctx.moveTo(Lx,Ly);
ctx.arc(Lx,Ly,this.width/15,0,Math.PI*2,true);  // draw circle
ctx.moveTo(Rx,Ry);
ctx.arc(Rx,Ry,this.width/15,0,Math.PI*2,true);  // draw circle
//ctx.closePath();
ctx.fill();
}

}
break;
case 6://REPELER

//this draws an attempt at a Death Star

var centrex=this.x+this.width/2
var centrey=this.y+this.width/2
var radius=this.width/2

var grad = ctx.createLinearGradient(centrex-radius,centrey,centrex+radius,centrey);//left -> right
grad.addColorStop(0,'black');
grad.addColorStop(1,'rgb(128,128,128)');
if(simplegraphics){grad='rgb(100,100,100)'}

var grad2 = ctx.createLinearGradient(centrex,centrey,centrex+radius,centrey);
grad2.addColorStop(0,'rgb(128,128,128)');
if(IE){grad2.addColorStop(1,'rgb(64,64,64)');}else{grad2.addColorStop(1,'black');}
if(simplegraphics){grad2='rgb(90,90,90)'}


var grad3 = ctx.createLinearGradient(centrex-radius,centrey,centrex+radius,centrey);
grad3.addColorStop(0,'rgb(10,10,10)');
grad3.addColorStop(1,'rgb(135,135,135)');
if(simplegraphics){grad3='rgb(128,128,128)'}

var grad4 = ctx.createLinearGradient(centrex-radius,centrey,centrex+radius,centrey);
grad4.addColorStop(0,'rgb(0,0,0)');
grad4.addColorStop(1,'rgb(64,64,64)');

ctx.beginPath()
ctx.moveTo(centrex,centrey)
ctx.fillStyle=grad
ctx.arc(centrex,centrey,radius,0,Math.PI*2,true);
ctx.fill();

ctx.beginPath()
ctx.moveTo(centrex+radius/3,centrey-radius/3-2)
ctx.fillStyle=grad2
ctx.arc(centrex+radius/3,centrey-radius/3-2,radius/3.5,0,Math.PI*2,true);
ctx.fill();

ctx.fillStyle = grad3;
ctx.fillRect(centrex-radius,centrey-1.5,radius*2,1);

ctx.fillStyle = grad3;
ctx.fillRect(centrex-radius,centrey+0.5,radius*2,1);

//ctx.fillStyle = grad4;
//ctx.fillRect(centrex-radius,centrey-0.5,radius*2,1);


break;
case 5://WORMHOLE
var tempcentrex=this.x+this.width/2
var tempcentrey=this.y+this.height/2

	
var grad3 = ctx.createRadialGradient(tempcentrex,tempcentrey,0,tempcentrex,tempcentrey,50);
if(IE){grad3.addColorStop(0,this.colour);
grad3.addColorStop(1, 'rgba(0,0,0,0)');}
else{grad3.addColorStop(0,'rgba(0,0,0,0)');
grad3.addColorStop(0.5,this.colour);
grad3.addColorStop(1, 'rgba(0,0,0,0)');}

if(simplegraphics){grad3=this.colour}

if(!IE){
ctx.beginPath()
ctx.moveTo(tempcentrex,tempcentrey);
ctx.fillStyle=grad3
ctx.arc(tempcentrex,tempcentrey,10,0,Math.PI*2,true);  // draw circle
ctx.fill();
}
ctx.beginPath()
ctx.moveTo(tempcentrex,tempcentrey)
ctx.fillStyle=grad3


//which way does the wormhole face?
switch(Math.round(Math.random()))
{case 0:var rotates=(-1);break;
case 1:var rotates=1;break;}

var tempangle=0
for(var k2=0;k2<5;k2++)
{
tempangle+=Math.PI/14
ctx.bezierCurveTo(tempcentrex+Math.cos(rotates*tempangle)*30,tempcentrey+Math.sin(rotates*tempangle)*30,tempcentrex+Math.cos(rotates*(tempangle+Math.PI/3))*40,tempcentrey+Math.sin(rotates*(tempangle+Math.PI/3))*40,tempcentrex+Math.cos(rotates*(tempangle+Math.PI/2))*60,tempcentrey+Math.sin(rotates*(tempangle+Math.PI/2))*60)
tempangle+=Math.PI/3
ctx.bezierCurveTo(tempcentrex+Math.cos(rotates*(tempangle+Math.PI/3))*40,tempcentrey+Math.sin(rotates*(tempangle+Math.PI/3))*40,tempcentrex+Math.cos(rotates*tempangle)*30,tempcentrey+Math.sin(rotates*tempangle)*30,tempcentrex,tempcentrey)
}

ctx.fill()

break;}

}else{
//editing map

ctx.beginPath()
ctx.moveTo(this.x+this.width/2,this.y+this.height/2);
ctx.fillStyle=this.colour;
if(this.gametype==4)
{ctx.fillStyle='white'}
ctx.arc(this.x+this.width/2,this.y+this.height/2,this.width/2,0,Math.PI*2,true);  // draw circle
ctx.fill();

}

break;
case 1://SQUARE

if(this.gametype==1 && !makingmap)//ship
{

switch(Math.round(Math.random()*3))
{case 0://enterprise - roughy :-O
ctx.beginPath();
ctx.moveTo(this.x+this.width*3/4,this.y+this.height/2)
ctx.arc(this.x+this.width*3/4,this.y+this.height/2,this.width/4,0,Math.PI*2,true);
ctx.fillStyle = this.colour
//ctx.closePath();
ctx.fill()
ctx.fillRect(this.x+this.width/4-2.5,this.y+this.height/3,this.width/4+3,this.height/3);
ctx.fillRect(this.x-0.5,this.y-0.5,this.width/4,this.height/3);
ctx.fillRect(this.x-0.5,this.y+this.height*2/3+0.5,this.width/4,this.height/3);
break;
case 1://enterprise backwards - roughy O-:
ctx.beginPath();
ctx.moveTo(this.x+this.width/4,this.y+this.height/2)
ctx.fillStyle = this.colour
ctx.arc(this.x+this.width/4,this.y+this.height/2,this.width/4,0,Math.PI*2,true);
//ctx.closePath();
ctx.fill()
ctx.fillRect(this.x+this.width/2-0.5,this.y+this.height/3,this.width/4+2,this.height/3);
ctx.fillRect(this.x+this.width*3/4+0.5,this.y-0.5,this.width/4,this.height/3);
ctx.fillRect(this.x+this.width*3/4+0.5,this.y+this.height*2/3+0.5,this.width/4,this.height/3);
break;
case 2://dougle and the blue cat style rocket
//ctx.arc(this.x+this.width*5/6,this.y+this.height/2,this.height/3,0,Math.PI*2,true);
//ctx.fill()
//ctx.fillRect(this.x+this.width/4,this.y+this.height/4.8,this.width/2,this.height/1.7);
//ctx.fill()
ctx.beginPath();
//ctx.strokeStyle = this.colour
ctx.moveTo(this.x,this.y)
ctx.fillStyle = this.colour
ctx.lineTo(this.x+this.width/2,this.y+this.height/4);
ctx.lineTo(this.x+this.width*3/4,this.y+this.height/4);
ctx.lineTo(this.x+this.width,this.y+this.height/2);
ctx.lineTo(this.x+this.width*3/4,this.y+this.height*3/4);
ctx.lineTo(this.x+this.width/2,this.y+this.height*3/4);
ctx.lineTo(this.x,this.y+this.height);
ctx.lineTo(this.x+this.width/4,this.y+this.height*3/4);
ctx.lineTo(this.x+this.width/4,this.y+this.height/4);
ctx.lineTo(this.x,this.y);
ctx.closePath();
ctx.fill()
break;
case 3://dougle and the blue cat style rocket - backwards
ctx.beginPath();
ctx.moveTo(this.x+this.width,this.y)
ctx.fillStyle = this.colour
ctx.lineTo(this.x+this.width/2,this.y+this.height/4);
ctx.lineTo(this.x+this.width/4,this.y+this.height/4);
ctx.lineTo(this.x,this.y+this.height/2);
ctx.lineTo(this.x+this.width/4,this.y+this.height*3/4);
ctx.lineTo(this.x+this.width/2,this.y+this.height*3/4);
ctx.lineTo(this.x+this.width,this.y+this.height);
ctx.lineTo(this.x+this.width*3/4,this.y+this.height*3/4);
ctx.lineTo(this.x+this.width*3/4,this.y+this.height/4);
ctx.lineTo(this.x+this.width,this.y);
ctx.closePath();
ctx.fill()
break;
case 4://starbug facing right 
ctx.beginPath();
ctx.moveTo(this.x+this.width/4,this.y+this.height/2)
ctx.fillStyle = this.colour
ctx.arc(this.x+this.width/4,this.y+this.height/2,this.width/4,0,Math.PI*2,true);

ctx.moveTo(this.x+this.width/2+1,this.y+this.height/2)
ctx.arc(this.x+this.width/2+1,this.y+this.height/2,this.width/5,0,Math.PI*2,true);

ctx.moveTo(this.x+this.width-this.width/6,this.y+this.height/2)
ctx.arc(this.x+this.width-this.width/6,this.y+this.height/2,this.width/6,0,Math.PI*2,true);

ctx.fill();

//foot
//ctx.fillRect(this.x+this.width-3,this.y+this.height/2,1,this.height/2);

//ctx.fillRect(this.x,this.y,this.width/4,this.height/8);

//cut notch out end of big circle
//ctx.clearRect(this.x,this.y,this.width/4,this.height/2);

break;
default:
ctx.fillRect(this.x,this.y,this.width,this.height);
break;}

}
else{
ctx.fillStyle=this.colour;
ctx.fillRect(this.x,this.y,this.width,this.height);
}

break;}

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

//seconds per loop
/*
var collide;
var collide2;
var ourvx;
var theirvx;
var ourvy;
var theirvy;

var whichdiv;
var ournewvx;
var ournewvy;
var theirnewvx;
var theirnewvy;

var ourleft
var ourright
var ourtop
var ourbottom
var theirleft
var theirright
var theirtop
var theirbottom
var dontcontinue

var diffinx
var diffiny
var collisionangle
var theirspeed
var ourspeed

var ourperpendicularv;
var ourparellelv;
var theirperpendicularv;
var theirparellelv;

var ournewperpendicularv;
var ournewparellelv;
var theirnewperpendicularv;
var theirnewparellelv;

var ouranglebelowx
var theiranglebelowx

var currentlycolliding
*/
//returns angle
function getangle(x,y)
{

if(x<0){theangle=(Math.PI)+(Math.atan(y/x))}
else if(x>0 && y>=0){theangle=Math.atan(y/x)}
else if(x>0 && y < 0){theangle=2*(Math.PI)+Math.atan(y/x)}
else if(x==0 && y == 0){theangle=0}
else if(x==0 && y>=0){theangle=(Math.PI)/2}
//--new line:
else if(x==0 && y<0){theangle=(Math.PI)*3/2}

else{theangle=3*(Math.PI)/2}

return theangle;

//return Math.atan2(x,y)
}

function findacceleration(tempforce,tempmass,tempvelocity,tempfriction)
{
var tempa = (tempforce)/tempmass
//attempt at moddeling friction
if(tempvelocity>1){tempa-=tempfriction}
if(tempvelocity<(-1)){tempa+=tempfriction}
return tempa
}



//the 'collide as' or 'with' functions collide the two objects given to them, 'us' and 'them', and sets the global variables newvy, newvx, theirnewvy and theirnewvx

function collidewithpoly(us,them)
{
//atm all polys are objects so they can't be 'us'

var k=polyline
var k2=k+1
if(k2==them.x.length){k2=0;}

var dy=(them.y[k2]-them.y[k])
var dx=(them.x[k2]-them.x[k])

var ourangle=getangle(us.vx,us.vy)
//ourangle is the angle the direction of the ball makes with the x axis, measured in a clockwise direction, where the angle is between 0 and 360

var lineangle=getangle(dx,dy)
//ourangle is the angle the line makes with the x axis, measured in a clockwise direction, where the angle is between 0 and 360

vectorangle=lineangle-ourangle
//don't ask how long this took to work out.
newvx=Math.cos(ourangle+vectorangle*2)*ourspeed
newvy=Math.sin(ourangle+vectorangle*2)*ourspeed;
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
theirleft=them.x
theirright=them.x+them.width
theirtop=them.y
theirbottom=them.y+them.height
if(us.y>theirtop && us.y<theirbottom && dontcontinue==0  && us.shape !==3){newvx=us.vx*(-1);newvy=us.vy;dontcontinue++;}
if(us.x>theirleft &&us.x<theirright && dontcontinue==0 && us.shape !==3){newvy=us.vy*(-1);newvx=us.vx;dontcontinue++}
if(us.y+us.height>theirtop && us.y+us.height<theirbottom && dontcontinue==0 && us.shape !==3){newvx=us.vx*(-1);newvy=us.vy;dontcontinue++;}
if(us.x+us.width>theirleft && us.x+us.width<theirright && dontcontinue==0 && us.shape !==3){newvy=us.vy*(-1);newvx=us.vx;dontcontinue++}

if(dontcontinue==0 || us.shape ==3)
{
collideascircles()
//alert('inside squares - circles')
}

}

}




function collideascircles(us,them)
{
ourcentrex=us.x+us.width/2
ourcentrey=us.y+us.height/2
theircentrex=them.x+them.width/2
theircentrey=them.y+them.height/2
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
var testcollide=checkcollide(newx,newy,collidee.width,collidee.height,collidee.shape,wholeworld[z].x,wholeworld[z].y,wholeworld[z].width,wholeworld[z].height,wholeworld[z].shape)
if(testcollide == true){return wholeworld[z]}
}

}
return false;
}

function checkforanycollide3(x,y,w,h,s)
{//checks to see if THEORETICAL shape will be in a collision at a specified position
for(var z=0;z<wholeworld.length;z++)
{
if(wholeworld[z].state==1 && wholeworld[z].hard)
{
var testcollide=checkcollide(x,y,w,h,s,wholeworld[z].x,wholeworld[z].y,wholeworld[z].width,wholeworld[z].height,wholeworld[z].shape)
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
var testcollide=checkcollide(x,y,w,h,s,wholeworld[z].x,wholeworld[z].y,wholeworld[z].width,wholeworld[z].height,wholeworld[z].shape)
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

//x,y=topleft coords, w=width,h=height,s=shape
function checkcollide(x1,y1,w1,h1,s1,x2,y2,w2,h2,s2,us,them)
{
rightx1=x1+w1
rightx2=x2+w2
bottomy1=y1+h1
bottomy2=y2+h2
centrex1=x1+w1/2
centrex2=x2+w2/2
centrey1=y1+h1/2
centrey2=y2+h2/2
rad1=h1/2
rad2=h2/2
if(s1==0 && s2==0)
{
//both are circles
radii=Math.pow((rad1+rad2),2);
//pythagoras - this was pythag, but since square roots are slow maths, I've just decided to compare the squares.
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
{polycollide=polyandshape(us,x2,y2,w2,h2,s2)}
else{polycollide=polyandshape(them,x1,y1,w1,h1,s1)}

if(polycollide){return true;}

}
else
{
//circle + rectangle combo
if(rightx1 > x2 && x1 < (x2+w2) && y1 < (y2+h2) && bottomy1 > y2){return true}
}
return false;
}

var polyline

//this is the older version, the newer (unfinished, unoptimised) version is in the 1.7x versions
//function polyandshape(poly,theirx,theiry,notpoly)
function polyandshape(poly,theirx,theiry,notpolywidth,notpolyheight,notpolyshape)
{//detects if there's a collision with a polygon

//this is the third version of this function, the first used vector equations to detect when it will collide, but this never worked.
//the second was very simple, it measured the distance from the shape to each end of the line, and if these two lengths 
//were nearly the same as the length of the line, then it would count as a collisison.  however, this whilst it did work, wasn't very good
//it didn't properly detect collisisons with 'spikey' polygons and left a large buffer for some reason

//this current, hopefully last, version uses an algebraic technicue to find were lines, or circles and lines will intersect.  After some problems with 
//horizontal and vertical line gradients, it was proved very reliable. 

theircentrex=theirx+notpolywidth/2
theircentrey=theiry+notpolyheight/2

for(var k=0;k<poly.x.length;k++)
{//loop through each line of the polygon
k2=k+1
if(k2==poly.x.length){k2=0;}

//var linelength=distance(poly.x[k2],poly.y[k2],poly.x[k],poly.y[k])+0.5



//minus one unit vector from the second pair of co-ords to try and avoid problems on spikey bits



var polyx1=poly.x[k]//+dx*2/linelength
var polyy1=poly.y[k]//+dy*2/linelength
var polyx2=poly.x[k2]//-dx*2/linelength
var polyy2=poly.y[k2]//-dy*2/linelength

//alert(poly.x[k2]+' '+polyx2+' '+(dx/linelength))

//check to see if we're even vaguely near first.  if we are *then* check thoroughly

//this actually compares the squares of the lengths, as this is much faster to execute.
if(Math.pow((theircentrex-polyx2),2)+Math.pow((theircentrey-polyy2),2)+Math.pow((theircentrex-polyx1),2)+Math.pow((theircentrey-polyy1),2) <= poly.linelength[k]+Math.pow((notpolywidth+notpolyheight),2))
{




var dy=poly.y[k2]-poly.y[k]
var dx=poly.x[k2]-poly.x[k]

if(polyx1<polyx2){var testpolyx1=polyx1;var testpolyx2=polyx2}else{var testpolyx1=polyx2;var testpolyx2=polyx1}
if(polyy1<polyy2){var testpolyy1=polyy1;var testpolyy2=polyy2}else{var testpolyy1=polyy2;var testpolyy2=polyy1}

if(notpolyshape!==0)//check all four corners of rectangle
{
var leftx=theirx
var topy=theiry
var rightx=theirx+notpolywidth
var bottomy=theiry+notpolyheight
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
var x1=polyx1
var y1=polyy1
//gradient of poly line
var m=dy/dx

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




//end of circle if
}
//end of optimisation if
}
//end of loop
}
return false
}

//checks for intersection
function linesintersect(sx1,sy1,sx2,sy2,px1,py1,px2,py2)
{
/*var sdx=sx2-sx1
var sdy=sy2-sy1
var pdx=px2-px1
var pdy=py2-py1*/
//gradients s=shape, p=poly





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

//alert(Math.round(x)+','+Math.round(y))
if(sx1test<=x && x<=sx2test && px1test<= x && x<=px2test && sy1test<=y && y<=sy2test && py1test<=y && y<=py2test){return true}


//end of optimisation
//}

return false;
}

function toradians(degrees)
{return ((Math.PI/180)*degrees)}

function todegrees(radians)
{return ((radians/Math.PI)*180)}

function distance(dx1,dy1,dx2,dy2)
{

var dx=dx2-dx1
var dy=dy2-dy1

return Math.sqrt(dx*dx+dy*dy)
}

function dsqrd(dx1,dy1,dx2,dy2)
{var dx=dx2-dx1
var dy=dy2-dy1
return dx*dx+dy*dy}


function circleandline(x1,x2,y1,y2,a,b,r)
{
//r=radius
//a=circle centre x
//b=circle centre y
//(x1,y1), (x2,y2) points line travels between

if(x1<x2){var testx1=x1;var testx2=x2;}else{var testx1=x2;var testx2=x1;}
if(y1<y2){var testy1=y1;var testy2=y2;}else{var testy1=y2;var testy2=y1;}

//treat both as squares first, if they collide, look in more detail
if(testx2 > (a-r) && testx1 < (a+r) && testy1 < (b+r) && testy2 > (b-r))
{

var dy=y2-y1;
var dx=x2-x1;
//gradient of line
var m=dy/dx

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
}
return false;
}