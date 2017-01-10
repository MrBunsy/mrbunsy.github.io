var addtoworld;

function testnameinarray(thisname)
{for (var i5=0;i5<wholeworld.length;i5++)
{if(wholeworld[i5].name == thisname){return i5;}}
return false;}


function entity(state,name,x,y,width,height,mass,image,type,vx,vy,fx,fy,hard,sticky,shape,divoptions,gametype,elastic)
{
var testarray=testnameinarray(name)
if(testarray == false)
{//if this entity isn't already in the world array, add it.....
this.name=name;this.x=x;this.y=y;this.width=width;this.height=height;this.mass=mass;this.image=image;
this.div=name+'div';
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
this.divoptions=divoptions

this.connected=new Array();//objects, given by position in world array, that this is connected to by a theorical spring
this.springstrength=new Array();//spring constant (Hooke's Law).
this.springlength=new Array();//relaxed length of spring

if(!testfordiv(this.div) && this.shape!==3)
{addtoworld="<div id=\'"+this.div+"' style='position:absolute;  width:"+this.width+";"+this.divoptions+" height:"+this.height+";  top:"+this.y+"; left:"+this.x+';'
if(this.state!==1){addtoworld+="display:none;"}else{addtoworld+="display:block;"}
addtoworld+="'>";
if(this.image!==false){addtoworld+="<img id='"+this.name+"img' src='"+this.image+"'>";}
addtoworld+="</div>"
world.innerHTML+=addtoworld}

else{//polygon time! :D
this.linelength=new Array();

for(var i=0;i<this.x.length;i++)
{var i2=i+1
if(i2==this.x.length){i2=0;}
//height = z-index, image = colour, width = thickness
DrawLine(this.x[i],this.y[i],this.x[i2],this.y[i2],this.height,this.image,this.width,this.name+'class')
//linelength is the line length squared, because this saves slower square root calculations later on
this.linelength[i]=(this.x[i2]-this.x[i])*(this.x[i2]-this.x[i])+(this.y[i2]-this.y[i])*(this.y[i2]-this.y[i])
}

}

}else{
//....the worldarray already contains something by this name, so update it
wholeworld[testarray].name=name;wholeworld[testarray].x=x*1;wholeworld[testarray].y=y*1;wholeworld[testarray].width=width*1;wholeworld[testarray].height=height*1;wholeworld[testarray].mass=mass*1;wholeworld[testarray].image=image;
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
wholeworld[testarray].divoptions=divoptions
if(gametype==2){wholeworld[testarray].walk=0;wholeworld[testarray].direction='right';wholeworld[testarray].health=healthperworm;wholeworld[testarray].aimangle=0;wholeworld[testarray].weapon='rocket';}
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
}

function testfordiv(id)
{var testme=document.getElementById(id);
if(testme){return true;}else{return false;}}



function buildpolycollides(extrarads)
{
}

function addtoifnotin(thisarray,thisthing)
{//this adds an element to an array and returns true if it is already not in it. Otherwise if it's already in the array it returns false.
var testin=0;
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
{world.innerHTML='';
for (i4=0;i4<wholeworld.length;i4++)
{wholeworld[i4].plotme()}}

function updatediv()
{document.getElementById(this.div).style.left=this.x
document.getElementById(this.div).style.top=this.y
document.getElementById(this.div).style.width=this.width
document.getElementById(this.div).style.height=this.height}

function updatediv2()
{document.getElementById(this.div).style.left=this.x
document.getElementById(this.div).style.top=this.y}

function kill()
{this.state=0;
document.getElementById(this.div).style.display='none';}

//brings entity back
function unkill()
{
if(this.shape!==3){
canwepopout=checkforanycollide(this)
if (canwepopout !==false){this.state=2;if(this.name=='us'){canwepopout.vx=100}}else{this.state=1;document.getElementById(this.div).style.display='block';}
this.updatediv();
}
}

function destroy()
{
if(this.shape!==3){
document.getElementById(this.div).style.display='none';
var destroywhom;
for (var i9=0;i9<wholeworld.length;i9++)
{if(wholeworld[i9].name==this.name){destroywhom=i9}}
wholeworld.splice(destroywhom, 1)
}
delete this
}


function plotme()
{
if(this.shape!==3){
if(!testfordiv(this.div))
{addtoworld="<div id=\'"+this.div+"' style='position:absolute;  width:"+this.width+";"+this.divoptions+" height:"+this.height+";  top:"+this.y+"; left:"+this.x+";";
if(this.state!==1){addtoworld+="display:none;"}else{addtoworld+="display:block;"}
addtoworld+="'>";
if(this.image!==false){addtoworld+="<img id='"+this.name+"img' src='"+this.image+"'>";}
addtoworld+="</div>"
world.innerHTML+=addtoworld}
}
}

function updatefps()
{if (timeperloop!==(1/document.gameform.fpsselect.value)){timeperloop=1/document.gameform.fpsselect.value;refreshrate=1000/document.gameform.fpsselect.value;clearInterval(loopme);loopme=setInterval('loop()',refreshrate)}}



//counts how many of a certain type of peice are are in a certain state
function counttype(thistype,thisstate)
{var typecounter=0;
for (var k=0;k<wholeworld.length;k++)
{if(wholeworld[k].type == thistype && wholeworld[k].state == thisstate){typecounter++}}
return typecounter;}


//displacement
var currentleft;
var currenttop;
//velocity
var currentvx;
var currentvy;
var newvx
var newvy
//force
var currentfx;
var currentfy;
//acceleration
var ax
var ay

//seconds per loop

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

function getangle(x,y)
{
if(x<0){theangle=(Math.PI)+(Math.atan(y/x))}
else if(x>0 && y>=0){theangle=Math.atan(y/x)}
else if(x>0 && y < 0){theangle=2*(Math.PI)+Math.atan(y/x)}
else if(x==0 && y == 0){theangle=0}
else if(x==0 && y>=0){theangle=(Math.PI)/2}
else{theangle=3*(Math.PI)/2}

return theangle;
}

function findacceleration(tempforce,tempmass,tempvelocity,tempfriction)
{
var tempa = (tempforce)/tempmass
//attempt at moddeling friction
if(tempvelocity>1){tempa-=tempfriction}
if(tempvelocity<(-1)){tempa+=tempfriction}
return tempa
}


//the 'collide as' functions collide the two objects given to them, 'us' and 'them', and sets the global variables newvy, newvx, theirnewvy and theirnewvx


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

if(diffinx == 0){collisionangle=0}else{collisionangle=Math.atan(diffiny/diffinx)}

//essentially, momentum is conserved parrellel and perpendicular to the angle of collision
//http://director-online.com/buildArticle.php?id=532 proved immensly useful, and in actual fact, rendered most of 
//my previous work at collisions wasted as I re-wrote a lot of it
if(us.vx<0){ouranglebelowx=(Math.PI)+(Math.atan(us.vy/us.vx))}
else if(us.vx>0 && us.vy>=0){ouranglebelowx=Math.atan(us.vy/us.vx)}
else if(us.vx>0 && us.vy < 0){ouranglebelowx=2*(Math.PI)+(Math.atan(us.vy/us.vx))}
else if(us.vx==0 && us.vy == 0){ouranglebelowx=0}
else if(us.vx==0 && us.vy>=0){ouranglebelowx=(Math.PI)/2}
else{ouranglebelowx=3*(Math.PI)/2}
if(them.vx<0){theiranglebelowx=(Math.PI)+(Math.atan(them.vy/them.vx))}
else if(them.vx>0 && them.vy>=0){theiranglebelowx=Math.atan(them.vy/them.vx)}
else if(them.vx>0 && them.vy < 0){theiranglebelowx=2*(Math.PI)+(Math.atan(them.vy/them.vx))}
else if(them.vx==0 && them.vy == 0){theiranglebelowx=0}
else if(them.vx==0 && them.vy>=0){theiranglebelowx=(Math.PI)/2}
else{theiranglebelowx=3*(Math.PI)/2}

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

//shapes, 1= rectangle, 0=circle, 2=square/rectangle, but collide as circle, 3 = polygon

else if(s1==3 || s2==3)//involves a polygon
{
if(s1==3)
{polycollide=polyandshape(us,x2,y2,them)}
else{polycollide=polyandshape(them,x1,y1,us)}

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

function polyandshape(poly,theirx,theiry,notpoly)
{//detects if there's a collision with a polygon

//this is the third version of this function, the first used vector equations to detect when it will collide, but this never worked.
//the second was very simple, it measured the distance from the shape to each end of the line, and if these two lengths 
//were nearly the same as the length of the line, then it would count as a collisison.  however, this whilst it did work, wasn't very good
//it didn't properly detect collisisons with 'spikey' polygons and left a large buffer for some reason

//this current, hopefully last, version uses an algebraic technicue to find were lines, or circles and lines will intersect.  After some problems with 
//horizontal and vertical line gradients, it was proved very reliable. 

theircentrex=theirx+notpoly.width/2
theircentrey=theiry+notpoly.height/2

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
if(Math.pow((theircentrex-polyx2),2)+Math.pow((theircentrey-polyy2),2)+Math.pow((theircentrex-polyx1),2)+Math.pow((theircentrey-polyy1),2) <= poly.linelength[k]+Math.pow((notpoly.width+notpoly.height),2))
{




var dy=poly.y[k2]-poly.y[k]
var dx=poly.x[k2]-poly.x[k]

if(polyx1<polyx2){var testpolyx1=polyx1;var testpolyx2=polyx2}else{var testpolyx1=polyx2;var testpolyx2=polyx1}
if(polyy1<polyy2){var testpolyy1=polyy1;var testpolyy2=polyy2}else{var testpolyy1=polyy2;var testpolyy2=polyy1}

if(notpoly.shape!==0)//check all four corners of rectangle
{
var leftx=theirx
var topy=theiry
var rightx=theirx+notpoly.width
var bottomy=theiry+notpoly.height
//top line of square
if(linesintersect(leftx,topy,rightx,topy,polyx1,polyy1,polyx2,polyy2)){polyline=k;return true}
//right hand side
if(linesintersect(rightx,topy,rightx,bottomy,polyx1,polyy1,polyx2,polyy2)){polyline=k;return true}
//bottom line
if(linesintersect(leftx,bottomy,rightx,bottomy,polyx1,polyy1,polyx2,polyy2)){polyline=k;return true}
//left had side
if(linesintersect(leftx,topy,leftx,bottomy,polyx1,polyy1,polyx2,polyy2)){polyline=k;return true}
}else{//circle intersecting with a line
var r=notpoly.width/2
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

function distance(dx1,dy1,dx2,dy2)
{

var dx=dx2-dx1
var dy=dy2-dy1

return Math.sqrt(dx*dx+dy*dy)
}