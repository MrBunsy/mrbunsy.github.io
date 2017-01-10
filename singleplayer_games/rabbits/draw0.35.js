/*
corner of cell for sqaure:
x= col*gridsize
y= row*gridsize

corner of cell for hexagon:

if(row%2==0){var extraright=0;}else{var extraright=1;}
x=c*gridwidth+extraright*width/2
y=r*gridsize*1.5

*/
var offset=50;

function getCentreXY(col,row)
{//returns co-ords of the centre of a cell.
switch(gridsides)
{case 6:
if(row%2==0){var extraright=0;}else{var extraright=1;}
return [col*gridwidth+extraright*gridwidth/2 +gridwidth/2+offset , row*gridsize*1.5 + gridsize+offset];
break;
case 4:
return [col*gridsize+gridsize/2+offset , row*gridsize+gridsize/2+offset ];
break;}
}

function getXY(col,row)
{//returns TOP LEFT co-ords of the centre of a cell.
switch(gridsides)
{case 6:
if(row%2==0){var extraright=0;}else{var extraright=1;}
return [col*gridwidth+extraright*gridwidth/2+offset , row*gridsize*1.5+gridsize/2+offset];
break;
case 4:
return [col*gridsize+offset , row*gridsize+offset ];
break;}
}

function getColour(colour)
{//colours: 0=red, 1=yellow, 2=green, 3=blue, 4=bunny brown, 5=carrot green, 6=carrot orange, 7=teddy brown, 8=lettuce green 1, 9=lettuce green 2 (share carrot green as well?), 10=book blue 1, 11=book blue 2.
switch(colour)
{
case 4:
case false:return "rgb(165,100,0)";break;//brownish
case 0:return "rgb(230,0,0)";break;//red
case 1:return "rgb(255,204,0)";break;//yellow
case 2:return "rgb(0,200,0)";break;//green
case 3:return "rgb(50,50,200)";break;//blue

case 5:return "green";break;//carrot green
case 6:return "rgb(255,69,0)";break;//carrot orange
case 7:return "rgb(165,165,0)";break;//teddy brown
case 8:return "rgb(230,251,130)";break;//lettuce green 1
case 9:return "rgb(207,228,107)";break;//lettuce green 2
case 10:return "rgb(190,211,106)";break;//lettuce green 3
case 11:return "rgb(140,210,255)";break;//light book blue
case 12:return "rgb(100,170,215)";break;//dark book blue
case 13:return "rgb(141,158,46)";break;//lettuce stroke
}
}

var drawlength;
function newGrid()
{
switch(gridsides)
{case 4:
worldsize=[Math.ceil(gridcols*gridsize),Math.ceil(gridrows*gridsize)];

if(worldsize[0]>700 || worldsize[1] > 650){offset=0;}else{offset=50;}

for(var c=0;c<gridcols;c++)
{
for(var r=0;r<gridrows;r++)
{
var tempcolour="rgb(72,"+(184+Math.round( (Math.random()-0.5)*40 ))+",37)";
new cell(c,r,[c*gridsize+offset,c*gridsize+gridsize+offset,c*gridsize+gridsize+50,c*gridsize+offset],[r*gridsize+offset,r*gridsize+offset,r*gridsize+gridsize+offset,r*gridsize+gridsize+offset],tempcolour);
}
}
//drawlength=gridsize*2/3
drawlength=gridsize*5/9
break;
case 6:
worldsize=[Math.ceil(gridcols*gridsize*1.732+gridsize*1.732/2),Math.ceil(gridrows*gridsize*1.5 +gridsize/2)];

if(worldsize[0]>700  || worldsize[1] > 650){offset=5;}else{offset=50;}

gridwidth=1.732*gridsize
/*
reg hexagons:
   / \      |d        |
 /     \		|					|
|*      |     |x			|height
|<width>|			|				|
 \     /							|
   \ / 								|
x = width/ root 3
d = x/2
height= (2 / root3) * width
*/
for(var r=0;r<gridrows;r++)
{
for(var c=0;c<gridcols;c++)
{
if(r%2==0)//even row
{var extraright=0;}else{var extraright=1;}
var tempcolour="rgb(72,"+(184+Math.round( (Math.random()-0.5)*40 ))+",37)";
new cell(c,r,[c*gridwidth+extraright*gridwidth/2+offset , c*gridwidth+extraright*gridwidth/2+offset , c*gridwidth+extraright*gridwidth/2+gridwidth/2+offset , c*gridwidth+extraright*gridwidth/2+gridwidth+offset , c*gridwidth+extraright*gridwidth/2+gridwidth+offset , c*gridwidth+extraright*gridwidth/2+gridwidth/2+offset],[ gridsize/2+r*gridsize*1.5+offset , gridsize/2+r*gridsize*1.5+gridsize+offset , gridsize/2+r*gridsize*1.5+gridsize*1.5+offset , gridsize/2+r*gridsize*1.5+gridsize+offset , gridsize/2+r*gridsize*1.5+offset , gridsize/2+r*gridsize*1.5-gridsize/2+offset],tempcolour);
}//end of even rows loop
}//end of cols loop
//canvas.stroke();
drawlength=gridsize;
break;}//end of sides switch
document.getElementById('clickmediv').style.left=offset/2;
document.getElementById('clickmediv').style.top=offset/2;
document.getElementById('clickmediv').style.width=worldsize[0]+offset;
document.getElementById('clickmediv').style.height=worldsize[1]+offset;
document.getElementById('toolbardiv').style.left=worldsize[0]+50+offset;
document.getElementById('toolbardiv').style.display='block';
}

function drawhexagon(x,y,sidelength,width,fillstyle)
{
//canvas.fillStyle="rgb(72,184,37)";
if(fillstyle!==false)
{
canvas[0].fillStyle=fillstyle;
canvas[0].beginPath();
canvas[0].moveTo(Math.round(x ) , Math.round( y))//starting at * on diagram
canvas[0].lineTo(Math.round(x ) , Math.round( y + sidelength))//moving down
canvas[0].lineTo(Math.round(x+width/2) , Math.round( y + sidelength*1.5))//moving down and right to bottom point
canvas[0].lineTo(Math.round(x+width ) , Math.round( y + sidelength))//moving up and right.
canvas[0].lineTo(Math.round(x+width ) , Math.round(y) )//moving up
canvas[0].lineTo(Math.round(x+width/2 ) , Math.round( y - sidelength/2))//moving up to point at top
canvas[0].lineTo(Math.round(x ) , Math.round( y))//back to *
canvas[0].fill();
}
//canvas[0].strokeStyle="black";
//canvas[0].strokeStyle="rgb(0,32,0)";

canvas[0].beginPath();
canvas[0].moveTo(Math.round(x ) , Math.round(y))//starting at * on diagram
canvas[0].lineTo(Math.round(x ) , Math.round( y + sidelength))//moving down
canvas[0].lineTo(Math.round(x+width/2) , Math.round( y + sidelength*1.5))//moving down and right to bottom point
canvas[0].lineTo(Math.round(x+width ) , Math.round( y + sidelength))//moving up and right.
canvas[0].lineTo(Math.round(x+width ) , Math.round(y) )//moving up
canvas[0].lineTo(Math.round(x+width/2 ) , Math.round( y - sidelength/2))//moving up to point at top
canvas[0].lineTo(Math.round(x ) , Math.round( y))//back to *
canvas[0].stroke();

}


var debug=true;

function drawCell()
{
switch(this.Xs.length)//same as sides
{case 4:
    if(IErendermode)
		{
		var coords=getXY(this.col,this.row);
		//just set up the strokes.
		var tempfunc= function (){
		canvas[0].moveTo(coords[0],coords[1]);
		canvas[0].lineTo(coords[0]+gridsize,coords[1]);
		canvas[0].lineTo(coords[0]+gridsize,coords[1]+gridsize);
		canvas[0].lineTo(coords[0],coords[1]+gridsize);
		canvas[0].lineTo(coords[0],coords[1]);
		}
		IEstroke.push(tempfunc)
		
		}else{
		
		canvas[0].fillStyle=this.colour;
		canvas[0].fillRect(this.col*gridsize+offset,this.row*gridsize+offset,gridsize,gridsize);
		canvas[0].strokeRect(this.col*gridsize+offset,this.row*gridsize+offset,gridsize,gridsize);
		}

break;
case 6:
if(this.row%2==0)//even row
{var extraright=0;}else{var extraright=1;}
if(IErendermode)
{
drawhexagon(this.col*gridwidth+extraright*gridwidth/2+offset,gridsize/2+this.row*gridsize*1.5+offset,gridsize,gridwidth,false);
}else{
drawhexagon(this.col*gridwidth+extraright*gridwidth/2+offset,gridsize/2+this.row*gridsize*1.5+offset,gridsize,gridwidth,this.colour);
}
break;
}
}

function fillCell(col,row,colour)
{
switch(gridsides)
{
case 6:
var coords=getXY(col,row);
drawhexagon(coords[0],coords[1],drawlength,gridwidth,colour);
break;
case 4:
canvas[0].fillStyle=colour;
canvas[0].fillRect(col*gridsize+offset,row*gridsize+50,gridsize,gridsize);
canvas[0].strokeRect(col*gridsize+offset,row*gridsize+50,gridsize,gridsize);
break;}
}


function drawEars(tempx,tempy,radius,angle,colour,layer)
{//x,y,radius of head

var earfunc1=function(){
canvas[layer].moveTo(tempx+Math.cos(angle+Math.PI+Math.PI/6)*radius , tempy+Math.sin(angle+Math.PI+Math.PI/6)*radius)

canvas[layer].bezierCurveTo(tempx+Math.cos(angle+Math.PI+Math.PI/6)*radius*3, tempy+Math.sin(angle+Math.PI+Math.PI/6)*radius*3 , tempx+Math.cos(angle+Math.PI)*radius*3 , tempy+Math.sin(angle+Math.PI)*radius*3 , tempx+Math.cos(angle+Math.PI)*radius , tempy+Math.sin(angle+Math.PI)*radius)
}

var earfunc1fill=function(){//this extra bit is to join the ends of the ears up with the edge of the head circle.
canvas[layer].arc(tempx, tempy, radius, angle+Math.PI, angle+Math.PI+Math.PI/6, false)
}

//joins
var earfunc2=function(){
canvas[layer].moveTo(tempx+Math.cos(angle+Math.PI-Math.PI/6)*radius , tempy+Math.sin(angle+Math.PI-Math.PI/6)*radius)
canvas[layer].bezierCurveTo(tempx+Math.cos(angle+Math.PI-Math.PI/6)*radius*3, tempy+Math.sin(angle+Math.PI-Math.PI/6)*radius*3 , tempx+Math.cos(angle+Math.PI)*radius*3 , tempy+Math.sin(angle+Math.PI)*radius*3 , tempx+Math.cos(angle+Math.PI)*radius , tempy+Math.sin(angle+Math.PI)*radius)
}
var earfunc2fill=function(){
canvas[layer].arc(tempx, tempy, radius, angle+Math.PI, angle+Math.PI-Math.PI/6, true)
}


switch(layer)
{
case 0://not on a bunny
canvas[0].fillStyle=getColour(colour)
canvas[0].beginPath();
earfunc1()
earfunc1fill()
earfunc2()
earfunc2fill();
canvas[0].fill();

canvas[0].beginPath();
earfunc1();
earfunc1fill()
earfunc2();
earfunc2fill()
canvas[0].stroke();
break;
case 1://bunny!
if(colour===false){colour=4;}
fills[1][colour].push(earfunc1);
fills[1][colour].push(earfunc1fill);
fills[1][colour].push(earfunc2);
fills[1][colour].push(earfunc2fill);

strokes[1].push(earfunc1);
strokes[1].push(earfunc2);
break;
}

}


function drawObject(tempx,tempy,angle,radius,carrying,layer)
{
switch(carrying)
{
case 0://carrot

var carrotblobfunc=function()
{
canvas[layer].moveTo(tempx+Math.cos(angle+2*Math.PI/8+Math.PI)*radius*3/4 + radius/4 , tempy+Math.sin(angle+2*Math.PI/8+Math.PI)*radius*3/4);
canvas[layer].arc(tempx+Math.cos(angle+2*Math.PI/8+Math.PI)*radius*3/4,tempy+Math.sin(angle+2*Math.PI/8+Math.PI)*radius*3/4,radius/4,0,2*Math.PI, true);
}

var carrotfunc=function()
{
//should form a triangle
canvas[layer].moveTo(tempx+Math.cos(angle+Math.PI/8+Math.PI)*radius*3/4 , tempy+Math.sin(angle+Math.PI/8+Math.PI)*radius*3/4);
canvas[layer].lineTo(tempx+Math.cos(angle+3*Math.PI/8+Math.PI)*radius*3/4 , tempy+Math.sin(angle+3*Math.PI/8+Math.PI)*radius*3/4);
canvas[layer].lineTo(tempx+Math.cos(angle+2*Math.PI/8)*radius , tempy+Math.sin(angle+2*Math.PI/8)*radius)//point of carrot. 
canvas[layer].lineTo(tempx+Math.cos(angle+Math.PI/8+Math.PI)*radius*3/4 , tempy+Math.sin(angle+Math.PI/8+Math.PI)*radius*3/4);
}

switch(layer)
{
case 0://not bunny
canvas[layer].beginPath();
canvas[layer].fillStyle="green"
carrotblobfunc();
canvas[layer].fill();

canvas[layer].beginPath();
carrotblobfunc();
canvas[layer].stroke();

canvas[layer].fillStyle="rgb(255,69,0)";
canvas[layer].beginPath();
carrotfunc();
canvas[layer].fill();

canvas[layer].beginPath();
carrotfunc();
canvas[layer].stroke();
break;
case 1://bunny!
fills[1][5].push(carrotblobfunc);
strokes[1].push(carrotblobfunc);

fills[2][6].push(carrotfunc);
strokes[2].push(carrotfunc);
break;
}





break;
case 1://teddy

//canvas[layer].beginPath();
//canvas[layer].fillStyle="rgb(165,165,0)";//"rgb(165,100,0)";//"brown"

//ears
var earsfunc=function()
{
canvas[layer].moveTo(tempx+Math.cos(angle+2*Math.PI/8+Math.PI)*radius*5/6+Math.cos(angle+Math.PI)*5*radius/12 +radius/6 , tempy+Math.sin(angle+2*Math.PI/8+Math.PI)*radius*5/6+Math.sin(angle+Math.PI)*5*radius/12);
canvas[layer].arc(tempx+Math.cos(angle+2*Math.PI/8+Math.PI)*radius*5/6+Math.cos(angle+Math.PI)*5*radius/12,tempy+Math.sin(angle+2*Math.PI/8+Math.PI)*radius*5/6+Math.sin(angle+Math.PI)*5*radius/12,radius/6,0,2*Math.PI, true);

canvas[layer].moveTo(tempx+Math.cos(angle+2*Math.PI/8+Math.PI)*radius*5/6+Math.cos(angle+Math.PI+Math.PI/2)*5*radius/12 +radius/6 , tempy+Math.sin(angle+2*Math.PI/8+Math.PI)*radius*5/6+Math.sin(angle+Math.PI+Math.PI/2)*5*radius/12);
canvas[layer].arc(tempx+Math.cos(angle+2*Math.PI/8+Math.PI)*radius*5/6+Math.cos(angle+Math.PI+Math.PI/2)*5*radius/12,tempy+Math.sin(angle+2*Math.PI/8+Math.PI)*radius*5/6+Math.sin(angle+Math.PI+Math.PI/2)*5*radius/12,radius/6,0,2*Math.PI, true);
}

//arms
var armsfunc=function(){
canvas[layer].moveTo(tempx+Math.cos(angle+Math.PI/2-Math.PI/8)*radius/8 , tempy+Math.sin(angle+Math.PI/2-Math.PI/8)*radius/8 )
canvas[layer].lineTo(tempx+Math.cos(angle+Math.PI/2-Math.PI/8)*radius/8 + Math.cos(angle+Math.PI-Math.PI/8)*radius*3/4 , tempy+Math.sin(angle+Math.PI/2-Math.PI/8)*radius/8 + Math.sin(angle+Math.PI-Math.PI/8)*radius*3/4 );
canvas[layer].arc(tempx+Math.cos(angle+Math.PI-Math.PI/8)*radius*3/4 , tempy + Math.sin(angle+Math.PI-Math.PI/8)*radius*3/4 , radius/8 ,  angle+Math.PI/2-Math.PI/8 , angle+Math.PI*3/2-Math.PI/8 , false);//end of old stroked arm 
canvas[layer].lineTo(tempx+Math.cos(angle+Math.PI*3/2-Math.PI/8)*radius/8 , tempy+Math.sin(angle+Math.PI*3/2-Math.PI/8)*radius/8 )
canvas[layer].lineTo(tempx+Math.cos(angle+Math.PI/2-Math.PI/8)*radius/8 , tempy+Math.sin(angle+Math.PI/2-Math.PI/8)*radius/8 )

canvas[layer].moveTo(tempx+Math.cos(angle+5*Math.PI/8+Math.PI/2)*radius/8 , tempy+Math.sin(angle+5*Math.PI/8+Math.PI/2)*radius/8 )
canvas[layer].lineTo(tempx+Math.cos(angle+5*Math.PI/8+Math.PI/2)*radius/8 + Math.cos(angle+5*Math.PI/8+Math.PI)*radius*3/4 , tempy+Math.sin(angle+5*Math.PI/8+Math.PI/2)*radius/8 + Math.sin(angle+5*Math.PI/8+Math.PI)*radius*3/4 );
canvas[layer].arc(tempx+Math.cos(angle+5*Math.PI/8+Math.PI)*radius*3/4 , tempy + Math.sin(angle+5*Math.PI/8+Math.PI)*radius*3/4 , radius/8 , angle+5*Math.PI/8+Math.PI/2 , angle+5*Math.PI/8+Math.PI*3/2 , false);//end of old stroked arm 
canvas[layer].lineTo(tempx+Math.cos(angle+5*Math.PI/8+Math.PI*3/2)*radius/8 , tempy+Math.sin(angle+5*Math.PI/8+Math.PI*3/2)*radius/8 )
canvas[layer].lineTo(tempx+Math.cos(angle+5*Math.PI/8+Math.PI/2)*radius/8 , tempy+Math.sin(angle+5*Math.PI/8+Math.PI/2)*radius/8 )

}


//body
var bodyfunc=function()
{
canvas[layer].moveTo(tempx+radius/2,tempy);
canvas[layer].arc(tempx,tempy,radius/2,0,2*Math.PI, true);
}


//head
var headfunc=function()
{
canvas[layer].moveTo(tempx+Math.cos(angle+2*Math.PI/8+Math.PI)*radius*5/6 +5*radius/12 , tempy+Math.sin(angle+2*Math.PI/8+Math.PI)*radius*5/6);
canvas[layer].arc(tempx+Math.cos(angle+2*Math.PI/8+Math.PI)*radius*5/6,tempy+Math.sin(angle+2*Math.PI/8+Math.PI)*radius*5/6,5*radius/12,0,2*Math.PI, true);
}


//feet
var feetfunc=function()
{
canvas[layer].moveTo(tempx+Math.cos(angle+Math.PI/16)*(radius/2+radius/8) +radius/4 , tempy+Math.sin(angle+Math.PI/16)*(radius/2+radius/8))
canvas[layer].arc(tempx+Math.cos(angle+Math.PI/16)*(radius/2+radius/8),tempy+Math.sin(angle+Math.PI/16)*(radius/2+radius/8),radius/4,0,2*Math.PI, true);
canvas[layer].moveTo(tempx+Math.cos(angle+7*Math.PI/16)*(radius/2+radius/8) +radius/4 , tempy+Math.sin(angle+7*Math.PI/16)*(radius/2+radius/8))
canvas[layer].arc(tempx+Math.cos(angle+7*Math.PI/16)*(radius/2+radius/8),tempy+Math.sin(angle+7*Math.PI/16)*(radius/2+radius/8),radius/4,0,2*Math.PI, true);
}

switch(layer)
{
case 0://not bunny



canvas[layer].fillStyle=getColour(7);
//arms
canvas[layer].beginPath();
armsfunc();
canvas[layer].fill();
canvas[layer].beginPath();
armsfunc();
canvas[layer].stroke();
//ears
canvas[layer].beginPath();
earsfunc();
canvas[layer].fill();
canvas[layer].beginPath();
earsfunc();
canvas[layer].stroke();
//body
canvas[layer].beginPath();
bodyfunc();
canvas[layer].fill();
canvas[layer].beginPath();
bodyfunc();
canvas[layer].stroke()
//head
canvas[layer].beginPath();
headfunc();
canvas[layer].fill();
canvas[layer].beginPath();
headfunc();
canvas[layer].stroke()
//feet
canvas[layer].beginPath();
feetfunc();
canvas[layer].fill();
canvas[layer].beginPath();
feetfunc();
canvas[layer].stroke()
break;
case 1://bunny
fills[1][7].push(armsfunc);
strokes[1].push(armsfunc);

fills[2][7].push(earsfunc);
strokes[2].push(earsfunc);

fills[2][7].push(bodyfunc);
strokes[2].push(bodyfunc);

fills[3][7].push(headfunc);
strokes[3].push(headfunc);

fills[3][7].push(feetfunc);
strokes[3].push(feetfunc);
break;
}

break;
case 2://lettuce

//lettuce green: "rgb(190,211,106)";

var lettucefunc1=function(){
canvas[layer].moveTo(tempx+radius*0.8,tempy)
canvas[layer].arc(tempx,tempy,radius*0.8,0,2*Math.PI, true);
}

var lettucefuncs=new Array();

canvas[layer].save();
canvas[layer].strokeStyle="rgb(141,158,46)"
/*
for(var l=0;l<6;l++)
{
//canvas[layer].beginPath();
//using math.cos(l) as random - because it near enough is and it'll be the same for each lettuce
//canvas[layer].fillStyle="rgb("+(190+Math.round(Math.abs(Math.cos(l)*40)))+","+(211+Math.round(Math.abs(Math.cos(l)*40)))+","+(90+Math.round(Math.abs(Math.cos(l)*40)))+")"
lettucefuncs[l]=function(){
canvas[layer].moveTo(tempx +radius*(0.7-l/10) , tempy);
canvas[layer].arc(tempx+Math.cos(l*Math.PI*0.7)*radius*0.1 , tempy+Math.sin(l*Math.PI*0.7)*radius*0.1 , radius*(0.7-l/10),0,2*Math.PI, true);
}
//canvas[layer].fill();

}
*/
lettucefuncs[0]=function(){
canvas[layer].moveTo(tempx+Math.cos(0*Math.PI*0.7)*radius*0.1 +radius*(0.7-0/10) , tempy+Math.sin(0*Math.PI*0.7)*radius*0.1);
canvas[layer].arc(tempx+Math.cos(0*Math.PI*0.7)*radius*0.1 , tempy+Math.sin(0*Math.PI*0.7)*radius*0.1 , radius*(0.7-0/10),0,2*Math.PI, true);
}
lettucefuncs[1]=function(){
canvas[layer].moveTo(tempx+Math.cos(1*Math.PI*0.7)*radius*0.1 +radius*(0.7-1/10) , tempy+Math.sin(1*Math.PI*0.7)*radius*0.1);
canvas[layer].arc(tempx+Math.cos(1*Math.PI*0.7)*radius*0.1 , tempy+Math.sin(1*Math.PI*0.7)*radius*0.1 , radius*(0.7-1/10),0,2*Math.PI, true);
}
lettucefuncs[2]=function(){
canvas[layer].moveTo(tempx+Math.cos(2*Math.PI*0.7)*radius*0.1 +radius*(0.7-2/10) , tempy+Math.sin(2*Math.PI*0.7)*radius*0.1);
canvas[layer].arc(tempx+Math.cos(2*Math.PI*0.7)*radius*0.1 , tempy+Math.sin(2*Math.PI*0.7)*radius*0.1 , radius*(0.7-2/10),0,2*Math.PI, true);
}
lettucefuncs[3]=function(){
canvas[layer].moveTo(tempx+Math.cos(3*Math.PI*0.7)*radius*0.1 +radius*(0.7-3/10) , tempy+Math.sin(3*Math.PI*0.7)*radius*0.1);
canvas[layer].arc(tempx+Math.cos(3*Math.PI*0.7)*radius*0.1 , tempy+Math.sin(3*Math.PI*0.7)*radius*0.1 , radius*(0.7-3/10),0,2*Math.PI, true);
}
lettucefuncs[4]=function(){
canvas[layer].moveTo(tempx+Math.cos(4*Math.PI*0.7)*radius*0.1 +radius*(0.7-4/10) , tempy+Math.sin(4*Math.PI*0.7)*radius*0.1);
canvas[layer].arc(tempx+Math.cos(4*Math.PI*0.7)*radius*0.1 , tempy+Math.sin(4*Math.PI*0.7)*radius*0.1 , radius*(0.7-4/10),0,2*Math.PI, true);
}
lettucefuncs[5]=function(){
canvas[layer].moveTo(tempx+Math.cos(5*Math.PI*0.7)*radius*0.1 +radius*(0.7-5/10) , tempy+Math.sin(5*Math.PI*0.7)*radius*0.1);
canvas[layer].arc(tempx+Math.cos(5*Math.PI*0.7)*radius*0.1 , tempy+Math.sin(5*Math.PI*0.7)*radius*0.1 , radius*(0.7-5/10),0,2*Math.PI, true);
}

/*
var lettucefunc3=function(){
canvas[layer].moveTo(tempx +radius*(0.7-EL/10) , tempy);
canvas[layer].arc(tempx+Math.cos(EL*Math.PI*0.7)*radius*0.1 , tempy+Math.sin(EL*Math.PI*0.7)*radius*0.1 , radius*(0.7-EL/10),0,2*Math.PI, true);
}
*/

canvas[layer].restore();
canvas[layer].beginPath();
canvas[layer].arc(tempx,tempy,radius*0.8,0,2*Math.PI, true);
canvas[layer].stroke();

/*
lettuce layers:

230,251,130
212,233,112
207,228,107
230,251,130
216,237,116
201,222,101

*/

switch(layer)
{
case 0://not bunny
canvas[layer].beginPath();
canvas[layer].fillStyle="rgb(190,211,106)";
lettucefunc1();
canvas[layer].fill();

canvas[layer].save();
canvas[layer].strokeStyle=getColour(13);
  for(var l=0;l<lettucefuncs.length;l++)
	{//8-10 are lettuce colours
	canvas[0].fillStyle=getColour(8+(l%3))
	canvas[0].beginPath();
	lettucefuncs[l]();
	canvas[0].fill();
	canvas[0].beginPath();
	lettucefuncs[l]();
	canvas[0].stroke();
	}
canvas[layer].restore();
break;
case 1://bunny

fills[1][8].push(lettucefunc1);
strokes[1].push(lettucefunc1);

  for(var l=0;l<lettucefuncs.length;l++)
	{//8-10 are lettuce colours
	fills[2+Math.floor(l/2)][8+Math.floor(l/2)].push(lettucefuncs[l]);
	
	colourStrokes[2+Math.floor(l/2)][13].push(lettucefuncs[l]);
	}

break;
}

break;
case 3://book
var bookfill1=function(){
canvas[layer].moveTo(tempx+Math.cos(angle)*radius , tempy+Math.sin(angle)*radius )//bottom of book.
canvas[layer].lineTo(tempx+Math.cos(angle+Math.PI/4)*radius , tempy+Math.sin(angle+Math.PI/4)*radius );
canvas[layer].lineTo(tempx+Math.cos(angle+3*Math.PI/4)*radius , tempy+Math.sin(angle+3*Math.PI/4)*radius );
canvas[layer].lineTo(tempx+Math.cos(angle+Math.PI)*radius/3, tempy+Math.sin(angle+Math.PI)*radius/3 );//top of book
}

var bookfill2=function(){
canvas[layer].moveTo(tempx+Math.cos(angle+Math.PI)*radius/3, tempy+Math.sin(angle+Math.PI)*radius/3 );//top of book
canvas[layer].lineTo(tempx+Math.cos(angle-3*Math.PI/4)*radius , tempy+Math.sin(angle-3*Math.PI/4)*radius );
canvas[layer].lineTo(tempx+Math.cos(angle-Math.PI/4)*radius , tempy+Math.sin(angle-Math.PI/4)*radius );
canvas[layer].lineTo(tempx+Math.cos(angle)*radius , tempy+Math.sin(angle)*radius )//bottom of book.
}

var bookstroke=function(){
canvas[layer].moveTo(tempx+Math.cos(angle)*radius , tempy+Math.sin(angle)*radius )//bottom of book.
canvas[layer].lineTo(tempx+Math.cos(angle+Math.PI)*radius/3, tempy+Math.sin(angle+Math.PI)*radius/3 );//top of book
canvas[layer].moveTo(tempx+Math.cos(angle)*radius , tempy+Math.sin(angle)*radius )//bottom of book.
canvas[layer].lineTo(tempx+Math.cos(angle+Math.PI/4)*radius , tempy+Math.sin(angle+Math.PI/4)*radius );
canvas[layer].lineTo(tempx+Math.cos(angle+3*Math.PI/4)*radius , tempy+Math.sin(angle+3*Math.PI/4)*radius );
canvas[layer].lineTo(tempx+Math.cos(angle+Math.PI)*radius/3, tempy+Math.sin(angle+Math.PI)*radius/3 );//top of book
canvas[layer].lineTo(tempx+Math.cos(angle-3*Math.PI/4)*radius , tempy+Math.sin(angle-3*Math.PI/4)*radius );
canvas[layer].lineTo(tempx+Math.cos(angle-Math.PI/4)*radius , tempy+Math.sin(angle-Math.PI/4)*radius );
canvas[layer].lineTo(tempx+Math.cos(angle)*radius , tempy+Math.sin(angle)*radius )//bottom of book.
}

switch(layer)
{
case 0://not bunny
canvas[0].fillStyle=getColour(11);
canvas[0].beginPath();
bookfill1();
canvas[0].fill();
canvas[0].fillStyle=getColour(12);
canvas[0].beginPath();
bookfill2();
canvas[0].fill();
canvas[0].beginPath();
bookstroke();
canvas[0].stroke();
break;
case 1://bunny
fills[1][11].push(bookfill1)
fills[1][12].push(bookfill2)
strokes[1].push(bookstroke)
break;
}

break;
case 4://paintbrush - not carried by bunnies

//var angle=getAngleFromFace(5)

canvas[layer].save();//handle outline
canvas[layer].lineWidth=radius/6;
canvas[layer].lineCap="round";
canvas[layer].beginPath();
canvas[layer].moveTo(tempx+Math.cos(angle)*(radius/2) , tempy+Math.sin(angle)*(radius/2))
canvas[layer].lineTo(tempx,tempy);
canvas[layer].stroke();
canvas[layer].restore();

canvas[layer].save();//brown bit of handle
canvas[layer].lineWidth=radius/6-1.5;
canvas[layer].lineCap="round";
canvas[layer].strokeStyle=getColour(false)
canvas[layer].beginPath();
canvas[layer].moveTo(tempx+Math.cos(angle)*(radius/2) , tempy+Math.sin(angle)*(radius/2))//end of handle
canvas[layer].lineTo(tempx,tempy);
canvas[layer].stroke();
canvas[layer].restore();

canvas[layer].save();
canvas[layer].lineWidth=radius/1.5;
canvas[layer].beginPath();//base of bristles outline
canvas[layer].strokeStyle="rgb(255,255,255)"
canvas[layer].moveTo(tempx , tempy)//end of handle
canvas[layer].lineTo(tempx+Math.cos(angle+Math.PI)*(radius/2) , tempy+Math.sin(angle+Math.PI)*(radius/2));
canvas[layer].stroke();
canvas[layer].restore();

canvas[layer].save();
canvas[layer].lineWidth=radius/5;
canvas[layer].beginPath();//base of bristles outline
canvas[layer].moveTo(tempx+Math.cos(angle+Math.PI/2)*(radius/3) , tempy+Math.sin(angle+Math.PI/2)*(radius/3))//end of handle
canvas[layer].lineTo(tempx+Math.cos(angle-Math.PI/2)*(radius/3) , tempy+Math.sin(angle-Math.PI/2)*(radius/3));
canvas[layer].stroke();
canvas[layer].restore();

canvas[layer].save();
canvas[layer].lineWidth=radius/5-1.5;
canvas[layer].strokeStyle=getColour(false)
canvas[layer].beginPath();//brown bit of base of bristles
canvas[layer].moveTo(tempx+Math.cos(angle+Math.PI/2)*(radius/3-0.75) , tempy+Math.sin(angle+Math.PI/2)*(radius/3-0.75))//end of handle
canvas[layer].lineTo(tempx+Math.cos(angle-Math.PI/2)*(radius/3-0.75) , tempy+Math.sin(angle-Math.PI/2)*(radius/3-0.75));
canvas[layer].stroke();
canvas[layer].restore();
break;
case 5://closed padlock
canvas[layer].fillStyle="rgb(132,124,54)";//brass
canvas[layer].fillRect(tempx-radius/6,tempy-radius/16,radius/3,radius/3);
canvas[layer].strokeRect(tempx-radius/6,tempy-radius/16,radius/3,radius/3);

canvas[layer].save();
canvas[layer].lineWidth=radius/16;
canvas[layer].beginPath();
canvas[layer].moveTo(tempx-radius/6+radius/32,tempy-radius/16);//top left of rectangle
canvas[layer].lineTo(tempx-radius/6+radius/32,tempy-radius/8);//start of arc;
canvas[layer].arc(tempx,tempy-radius/16-radius/8 , radius/6-radius/32 , Math.PI , Math.PI*2 , false)
canvas[layer].lineTo(tempx+radius/6-radius/32,tempy-radius/16)//top right of rectangle
canvas[layer].stroke();
canvas[layer].restore();

canvas[layer].save();
canvas[layer].lineWidth=radius/16-1.5;
canvas[layer].strokeStyle="rgb(128,128,128)"
canvas[layer].beginPath();
canvas[layer].moveTo(tempx-radius/6+radius/32,tempy-radius/16);//top left of rectangle
canvas[layer].lineTo(tempx-radius/6+radius/32,tempy-radius/8);//start of arc;
canvas[layer].arc(tempx,tempy-radius/16-radius/8 , radius/6-radius/32 , Math.PI , Math.PI*2 , false)
canvas[layer].lineTo(tempx+radius/6-radius/32,tempy-radius/16)//top right of rectangle
canvas[layer].stroke();
canvas[layer].restore();
break;
case 6://open padlock
canvas[layer].fillStyle="rgb(132,124,54)";//brass
canvas[layer].fillRect(tempx-radius/6,tempy-radius/16,radius/3,radius/3);
canvas[layer].strokeRect(tempx-radius/6,tempy-radius/16,radius/3,radius/3);

canvas[layer].save();
canvas[layer].lineWidth=radius/16;
canvas[layer].beginPath();
canvas[layer].moveTo(tempx-radius/6+radius/32-radius/3+radius/16 , tempy-radius/16);//top left of rectangle
canvas[layer].lineTo(tempx-radius/6+radius/32-radius/3+radius/16 , tempy-radius/8);//start of arc;
canvas[layer].arc(tempx-radius/3+radius/16,tempy-radius/16-radius/8 , radius/6-radius/32 , Math.PI , Math.PI*2 , false)
canvas[layer].lineTo(tempx+radius/6-radius/32-radius/3+radius/16 , tempy-radius/16)//top right of rectangle
canvas[layer].stroke();
canvas[layer].restore();

canvas[layer].save();
canvas[layer].lineWidth=radius/16-1.5;
canvas[layer].strokeStyle="rgb(128,128,128)"
canvas[layer].beginPath();
canvas[layer].moveTo(tempx-radius/6+radius/32-radius/3+radius/16 , tempy-radius/16);//top left of rectangle
canvas[layer].lineTo(tempx-radius/6+radius/32-radius/3+radius/16 , tempy-radius/8);//start of arc;
canvas[layer].arc(tempx-radius/3+radius/16 , tempy-radius/16-radius/8 , radius/6-radius/32 , Math.PI , Math.PI*2 , false)
canvas[layer].lineTo(tempx+radius/6-radius/32-radius/3+radius/16 , tempy-radius/16)//top right of rectangle
canvas[layer].stroke();
canvas[layer].restore();
break;
case 7://key with grey background


canvas[layer].fillStyle="rgb(132,124,54)";//brass

//teeth:
tempx-=radius/5
canvas[layer].fillRect(tempx-radius,tempy,radius/10,radius/2);
canvas[layer].strokeRect(tempx-radius,tempy,radius/10,radius/2);

canvas[layer].fillRect(tempx-radius+radius/10,tempy,radius/10,radius/3);
canvas[layer].strokeRect(tempx-radius+radius/10,tempy,radius/10,radius/3);

canvas[layer].fillRect(tempx-radius+radius/5,tempy,radius/10,radius/2);
canvas[layer].strokeRect(tempx-radius+radius/5,tempy,radius/10,radius/2);

//length of key
canvas[layer].fillRect(tempx-radius-radius/8,tempy-radius/10,radius*2,radius/5);
canvas[layer].strokeRect(tempx-radius-radius/8,tempy-radius/10,radius*2,radius/5);

//circle at end of key:
canvas[layer].beginPath();
canvas[layer].moveTo(tempx+radius,tempy);
canvas[layer].arc(tempx+radius,tempy , radius/2 , 0, Math.PI*2, true)
canvas[layer].fill();

canvas[layer].beginPath();//line around circle
canvas[layer].moveTo(tempx+radius+radius/2,tempy);
canvas[layer].arc(tempx+radius,tempy , radius/2 , 0, Math.PI*2, true)
canvas[layer].stroke();

canvas[layer].fillStyle="rgb(96,96,96)";//grey - the bg colour
canvas[layer].beginPath();//filling in circle (make it look like a line)
canvas[layer].moveTo(tempx+radius,tempy);
canvas[layer].arc(tempx+radius,tempy , radius/3 , 0, Math.PI*2, true)
canvas[layer].fill();

canvas[layer].beginPath();
canvas[layer].moveTo(tempx+radius+radius/3,tempy);
canvas[layer].arc(tempx+radius,tempy , radius/3 , 0, Math.PI*2, true)
canvas[layer].stroke();

break;
}
}


function drawRabbit()
{
var writethis=false;
var dontdrawme=false;

if(realloopcount%(animatesync+1)==0 || this.standstill)//just drawing static bunnies
{
var coords=this.coords;
var angle=getAngleFromFace(this.facing)
var tempx=coords[0]+Math.cos(angle)*drawlength/3;
var tempy=coords[1]+Math.sin(angle)*drawlength/3;

}else{//end of static - onto animations

var oldcoords=this.oldcoords;
var newcoords=this.coords;

    if(realloopcount%(animatesync+1) <= animatesync/2)
		{//first stage of animation - simply move forwards and finish on next tile
		
		switch(this.animate)
		{
		case 2://crash into something - only move half the way.
		
		var dx=((newcoords[0]-oldcoords[0])/(animatesync/2));
		var dy=((newcoords[1]-oldcoords[1])/(animatesync/2));
		
		if(realloopcount%(animatesync+1) <= animatesync/4)
		{//move at same speed as normal - but stop half way.
		var angle=getAngleFromFace(this.oldfacing)
		var tempx=oldcoords[0]+dx*(realloopcount%(animatesync+1))+Math.cos(angle)*drawlength/3;
		var tempy=oldcoords[1]+dy*(realloopcount%(animatesync+1))+Math.sin(angle)*drawlength/3;
		}else{//at half way point
		var angle=getAngleFromFace(this.facing)
		var tempx=(newcoords[0]+oldcoords[0])/2+Math.cos(angle)*drawlength/3;
		var tempy=(newcoords[1]+oldcoords[1])/2+Math.sin(angle)*drawlength/3;
		writethis="OW!";
		}
		break;
		default:
		var dx=(newcoords[0]-oldcoords[0])/(animatesync/2);
		var dy=(newcoords[1]-oldcoords[1])/(animatesync/2);
		 
		var angle=getAngleFromFace(this.oldfacing)
		var tempx=oldcoords[0]+dx*(realloopcount%(animatesync+1))+Math.cos(angle)*drawlength/3;
		var tempy=oldcoords[1]+dy*(realloopcount%(animatesync+1))+Math.sin(angle)*drawlength/3;
		break;
		}
		
		}else{//second stage of animation
		
		switch(this.animate)
		{
		case 2://crash into something
		if(realloopcount%(animatesync+1) <= animatesync*3/4)
		{//stand still for a bit
		var angle=getAngleFromFace(this.facing)
		var tempx=(newcoords[0]+oldcoords[0])/2+Math.cos(angle)*drawlength/3;
		var tempy=(newcoords[1]+oldcoords[1])/2+Math.sin(angle)*drawlength/3;
		writethis="OW!";
		}else{//then dissapear
		dontdrawme=true;
		}
		break;
		case 3://get to a warren
		writethis="YEY!";
		case 0://carry on - so just stand there
		var angle=getAngleFromFace(this.facing)
		var tempx=newcoords[0]+Math.cos(angle)*drawlength/3;
		var tempy=newcoords[1]+Math.sin(angle)*drawlength/3;
		break;
		case 1://rotate
		var newangle=getAngleFromFace(this.facing)
		var oldangle=getAngleFromFace(this.oldfacing)
		
		if(newangle<0 && oldangle>0){oldangle-=Math.PI*2}
		if(newangle>0 && oldangle<0){oldangle+=Math.PI*2}
		
		var da=(newangle-oldangle)/(animatesync/2);
		var angle=oldangle + da*((realloopcount%(animatesync+1)) - animatesync/2);
		
		var tempx=newcoords[0]+Math.cos(angle)*drawlength/3;
		var tempy=newcoords[1]+Math.sin(angle)*drawlength/3;
		
		break;}
		
		
		}

}
if(!(writethis===false))
{
//var textsize=Math.round(drawlength/2);
document.getElementById('bunnyspan').innerHTML+="<div class='bunnymessage' style='position:absolute;top:"+(tempy-drawlength/8)+";left:"+(tempx-drawlength/3)+";font-size: "+drawlength/2+"px;'>"+writethis+"</div>";
}
var bodycolour=getColour(this.bodycolour)
if(this.earcolour===false){var earcolour=this.bodycolour;}else{var earcolour=this.earcolour;}

if(!dontdrawme)//some animations stop drawing sooner than others
{

//face
canvas[1].fillStyle=bodycolour;
var facefunc=function(){
canvas[1].moveTo(tempx+drawlength/2 , tempy); 
canvas[1].arc(tempx , tempy , drawlength/2 ,0,2*Math.PI, true);
}
  if(this.bodycolour===false)
	{
	fills[0][4].push(facefunc);
	}else{
	fills[0][this.bodycolour].push(facefunc);
	}

strokes[0].push(facefunc);
	

drawEars(tempx,tempy,drawlength/2,angle,earcolour,1);

drawObject(tempx,tempy,angle,drawlength/2,this.carrying,1)


}//end of dontdrawme
//drawRealArrow(coords[0],coords[1],drawlength*3/4-2,getAngleFromFace(this.facing),2);

}

function drawRealArrow(x,y,size,angle,thick)
{//x,y is for the centre of the arrow.
canvas[0].save();
canvas[0].beginPath();
canvas[0].lineWidth=thick;
canvas[0].lineCap='round';
canvas[0].lineJoin='round';
canvas[0].moveTo(x+Math.cos(angle+Math.PI)*size/2 , y+Math.sin(angle+Math.PI)*size/2)//bottom of arrow
canvas[0].lineTo(x+Math.cos(angle)*size/2 , y+Math.sin(angle)*size/2)//point of arrow

canvas[0].moveTo(x+Math.cos(angle+Math.PI/4)*size/4 , y+Math.sin(angle+Math.PI/4)*size/4)//end of one of the > bits
canvas[0].lineTo(x+Math.cos(angle)*size/2 , y+Math.sin(angle)*size/2)//back to point
canvas[0].lineTo(x+Math.cos(angle-Math.PI/4)*size/4 , y+Math.sin(angle-Math.PI/4)*size/4)//other pointy bit.
canvas[0].stroke();
canvas[0].restore();
}



function drawHutch()
{
fillCell(this.col,this.row,"rgb(64,128,0)");

var coords=getCentreXY(this.col,this.row);
canvas[0].save();
canvas[0].strokeStyle="rgba(96,96,96,0.8)";//dark grey semi-transparent
canvas[0].beginPath();

//vertical bars
canvas[0].moveTo(coords[0]-drawlength/4,coords[1]-drawlength/2)
canvas[0].lineTo(coords[0]-drawlength/4,coords[1]+drawlength/2)
canvas[0].moveTo(coords[0],coords[1]-drawlength/2)
canvas[0].lineTo(coords[0],coords[1]+drawlength/2)
canvas[0].moveTo(coords[0]+drawlength/4,coords[1]-drawlength/2)
canvas[0].lineTo(coords[0]+drawlength/4,coords[1]+drawlength/2)

//horizontal bars
canvas[0].moveTo(coords[0]-drawlength/2,coords[1]+drawlength/4)
canvas[0].lineTo(coords[0]+drawlength/2,coords[1]+drawlength/4)
canvas[0].moveTo(coords[0]-drawlength/2,coords[1])
canvas[0].lineTo(coords[0]+drawlength/2,coords[1])
canvas[0].moveTo(coords[0]-drawlength/2,coords[1]-drawlength/4)
canvas[0].lineTo(coords[0]+drawlength/2,coords[1]-drawlength/4)

canvas[0].stroke();
canvas[0].restore();

canvas[0].save();
canvas[0].lineWidth=drawlength/8;
canvas[0].strokeRect(coords[0]-drawlength/2,coords[1]-drawlength/2,drawlength,drawlength);
canvas[0].restore();

canvas[0].save();
canvas[0].strokeStyle=getColour(false);
canvas[0].lineWidth=drawlength/8-2;
canvas[0].strokeRect(coords[0]-drawlength/2,coords[1]-drawlength/2,drawlength,drawlength);
canvas[0].restore();

drawRealArrow(coords[0],coords[1],drawlength/2,getAngleFromFace(this.facing),drawlength/15);
}


function drawWarren()
{
fillCell(this.col,this.row,"rgb(64,128,0)");

var coords=getCentreXY(this.col,this.row)
switch(this.rabbittype)
{case 0://all colours
canvas[0].fillStyle=getColour(false)
break;
case 1://body colour
canvas[0].fillStyle=getColour(this.specific)
break;
case 2://ears
canvas[0].fillStyle=getColour(false);
break;
case 3:
canvas[0].fillStyle=getColour(false);
break;
}

canvas[0].beginPath();
canvas[0].arc(Math.round(coords[0]),Math.round(coords[1]),Math.round(drawlength/2),0,2*Math.PI, true);
canvas[0].fill();

canvas[0].save();
canvas[0].lineWidth=2;
canvas[0].beginPath();
canvas[0].arc(Math.round(coords[0]),Math.round(coords[1]),Math.round(drawlength/2),0,2*Math.PI, true);
canvas[0].stroke();
canvas[0].restore();

switch(this.rabbittype)
{
case 2://ears
drawEars(coords[0],coords[1]+drawlength/2,drawlength/2,Math.PI/2,this.specific,0)
break;
case 3://carrying
drawObject(coords[0],coords[1],Math.PI/2,drawlength/2,this.specific,0)
break;
}
}


function drawArrow()
{
fillCell(this.col,this.row,"rgb(64,128,0)");

var coords=getCentreXY(this.col,this.row)
switch(this.rabbittype)
{
case 0://direct everything
canvas[0].fillStyle=getColour(false)
break;
case 1://body colour
canvas[0].fillStyle=getColour(this.specific)
break;
case 2://ear colour
case 3://carringy arrow
canvas[0].fillStyle="rgb(128,255,128)";//getColour(false);//"rgb(128,128,128)";
break;
}

canvas[0].beginPath();
canvas[0].arc(Math.round(coords[0]),Math.round(coords[1]),Math.round(drawlength*3/4),0,2*Math.PI, true);
canvas[0].fill();

//if a permanet arrow, give it a big thick border.
if(!this.editable){canvas[0].save();canvas[0].lineWidth=3;}//drawlength/13;}
canvas[0].beginPath();
canvas[0].arc(Math.round(coords[0]),Math.round(coords[1]),Math.round(drawlength*3/4),0,2*Math.PI, true);
canvas[0].stroke();
if(!this.editable){canvas[0].restore();}

switch(this.rabbittype)
{
case 2://ears
drawEars(coords[0],coords[1]+drawlength/2,drawlength/2,Math.PI/2,this.specific,0)
break;
case 3://carrying
drawObject(coords[0],coords[1],Math.PI/2,drawlength/2,this.specific,0)
break;
}

drawRealArrow(coords[0],coords[1],drawlength*3/4-2,getAngleFromFace(this.facing),drawlength/12);
}


function drawBlock()
{
fillCell(this.col,this.row,"rgb(165,100,0)");
}


function drawGate()
{
fillCell(this.col,this.row,"rgb(64,128,0)");

var coords=getCentreXY(this.col,this.row)
switch(this.rabbittype)
{
case 1://body colour
canvas[0].fillStyle=getColour(this.specific)
break;
case 2://ear colour
case 3://carringy arrow
canvas[0].fillStyle="rgb(128,255,128)";
break;
}
canvas[0].beginPath();
canvas[0].arc(Math.round(coords[0]),Math.round(coords[1]),Math.round(drawlength*3/4),0,2*Math.PI, true);
canvas[0].fill();

switch(this.rabbittype)
{
case 2://ears
drawEars(coords[0],coords[1]+drawlength/2,drawlength/2,Math.PI/2,this.specific,0)
break;
case 3://carrying
drawObject(coords[0],coords[1],Math.PI/2,drawlength/2,this.specific,0)
break;
}

canvas[0].save();
canvas[0].lineWidth=drawlength/12;
switch(this.gatetype)
{case 0://specific only - draw tick
canvas[0].beginPath()
canvas[0].moveTo(coords[0]-drawlength/4,coords[1])
canvas[0].lineTo(coords[0],coords[1]+drawlength/4)
canvas[0].lineTo(coords[0]+3*drawlength/8 , coords[1]-3*drawlength/8)
canvas[0].stroke();

break;
case 1://do not left specific through
canvas[0].beginPath()
canvas[0].moveTo(coords[0]-3*drawlength/8,coords[1]-3*drawlength/8)
canvas[0].lineTo(coords[0]+3*drawlength/8,coords[1]+3*drawlength/8)
canvas[0].moveTo(coords[0]-3*drawlength/8,coords[1]+3*drawlength/8)
canvas[0].lineTo(coords[0]+3*drawlength/8,coords[1]-3*drawlength/8)
canvas[0].stroke();

break;
}
canvas[0].lineWidth=3;
canvas[0].beginPath();
canvas[0].arc(Math.round(coords[0]),Math.round(coords[1]),Math.round(drawlength*3/4),0,2*Math.PI, true);
canvas[0].stroke();
canvas[0].restore();
}



function drawRepaint()
{
var coords=getXY(this.col,this.row)
//draw multicoloured background
switch(gridsides)
{case 6:
canvas[0].fillStyle=getColour(0);
canvas[0].beginPath();//top left quadrant in RED
canvas[0].moveTo(coords[0]+gridwidth/2 , coords[1] - drawlength/2)//top point
canvas[0].lineTo(coords[0] , coords[1])//top left
canvas[0].lineTo(coords[0] , coords[1] + drawlength/2)//between top and bottom left
canvas[0].lineTo(coords[0]+gridwidth/2 , coords[1]+ drawlength/2)//centre
canvas[0].lineTo(coords[0]+gridwidth/2 , coords[1] - drawlength/2)//back to top
canvas[0].fill();

canvas[0].fillStyle=getColour(1);
canvas[0].beginPath();//top right quadrant in YELLOW
canvas[0].moveTo(coords[0]+gridwidth/2 , coords[1] - drawlength/2)//top point
canvas[0].lineTo(coords[0]+gridwidth  , Math.round(coords[1]) )//top right
canvas[0].lineTo(coords[0]+gridwidth , coords[1] + drawlength/2)//between top and bottom right
canvas[0].lineTo(coords[0]+gridwidth/2 , coords[1]+ drawlength/2)//centre
canvas[0].lineTo(coords[0]+gridwidth/2 , coords[1] - drawlength/2)//back to top
canvas[0].fill();

canvas[0].fillStyle=getColour(2);
canvas[0].beginPath();//bottom right quadrant in GREEN
canvas[0].moveTo(coords[0]+gridwidth/2 , coords[1]+ drawlength/2)//centre
canvas[0].lineTo(coords[0]+gridwidth , coords[1] + drawlength/2)//between top and bottom right
canvas[0].lineTo(coords[0]+gridwidth , coords[1] + drawlength)//bottom right
canvas[0].lineTo(coords[0]+gridwidth/2 , coords[1] + drawlength*1.5)//bottom
canvas[0].lineTo(coords[0]+gridwidth/2 , coords[1]+ drawlength/2)//centre
canvas[0].fill();

canvas[0].fillStyle=getColour(3);
canvas[0].beginPath();//bottom left quadrant in BLUE
canvas[0].moveTo(coords[0]+gridwidth/2 , coords[1]+ drawlength/2)//centre
canvas[0].lineTo(coords[0] , coords[1] + drawlength/2)//between top and bottom left
canvas[0].lineTo(coords[0] , coords[1] + drawlength)//bottom left
canvas[0].lineTo(coords[0]+gridwidth/2 , coords[1] + drawlength*1.5)//bottom
canvas[0].lineTo(coords[0]+gridwidth/2 , coords[1]+ drawlength/2)//centre
canvas[0].fill();

//draw outline:
drawhexagon(coords[0],coords[1],drawlength,gridwidth,false);
break;
case 4:
canvas[0].fillStyle=getColour(0)//top left red
canvas[0].fillRect(this.col*gridsize+offset,this.row*gridsize+offset,gridsize/2,gridsize/2);
canvas[0].fillStyle=getColour(1)//top right yellow
canvas[0].fillRect(this.col*gridsize+offset+gridsize/2,this.row*gridsize+offset,gridsize/2,gridsize/2);
canvas[0].fillStyle=getColour(2)//bottom right green
canvas[0].fillRect(this.col*gridsize+offset+gridsize/2,this.row*gridsize+offset+gridsize/2,gridsize/2,gridsize/2);
canvas[0].fillStyle=getColour(3)//bottom left blue
canvas[0].fillRect(this.col*gridsize+offset,this.row*gridsize+offset+gridsize/2,gridsize/2,gridsize/2);

canvas[0].strokeRect(this.col*gridsize+offset,this.row*gridsize+offset,gridsize,gridsize);
break;}

coords=getCentreXY(this.col,this.row);

//drawObject(coords[0],coords[1],getAngleFromFace(5),drawlength/2,4,0)


var needcircle=false
switch(this.rabbittype)
{
case 0://back to no colour
canvas[0].fillStyle=getColour(false)
needcircle=true;
break;
case 1://body colour
canvas[0].fillStyle=getColour(this.specific)
needcircle=true;
break;
case 2://ear colour
//needcircle=true;
//canvas[0].fillStyle=getColour(this.specific)
//break;
case 3://carringy arrow
canvas[0].fillStyle="rgb(128,255,128)";
break;
}
if(needcircle)
{canvas[0].beginPath();
canvas[0].arc(Math.round(coords[0]),Math.round(coords[1]),Math.round(drawlength/3),0,2*Math.PI, true);
canvas[0].fill();
canvas[0].beginPath();
canvas[0].arc(Math.round(coords[0]),Math.round(coords[1]),Math.round(drawlength/3),0,2*Math.PI, true);
canvas[0].stroke();}


switch(this.rabbittype)
{
case 2://ears
drawEars(coords[0],coords[1]+drawlength/2,drawlength/2,Math.PI/2,this.specific,0)
break;
case 3://carrying
drawObject(coords[0],coords[1],Math.PI/2,drawlength/2,this.specific,0)
break;
}

}


function drawLock()
{
fillCell(this.col,this.row,"rgb(96,96,96)");
var coords=getCentreXY(this.col,this.row);
if(this.open)
{//open padlock
drawObject(coords[0],coords[1],Math.PI/2,drawlength*1.5,6,0)
}else{//closed padlock
drawObject(coords[0],coords[1],Math.PI/2,drawlength*1.5,5,0)
}

if(leveleditor && !testinglevel)
{//add the lock number if in editor
coords=getXY(this.col,this.row);
document.getElementById('bunnyspan').innerHTML+="<div class='bunnymessage' style='position:absolute;top:"+(coords[1]+drawlength/3)+";left:"+(coords[0]+drawlength/3)+";font-size: "+drawlength/2+"px;'>"+this.locknum+"</div>";
}
}

function drawKey()
{
fillCell(this.col,this.row,"rgb(96,96,96)");
if(leveleditor && !testinglevel)
{//add the lock number if in editor
coords=getXY(this.col,this.row);
  if(this.toggle)
	{
	var toggletext=" (T)";
	}else{
	var toggletext='';
	}
document.getElementById('bunnyspan').innerHTML+="<div class='bunnymessage' style='position:absolute;top:"+(coords[1]+drawlength/3)+";left:"+(coords[0]+drawlength/3)+";font-size: "+drawlength/2+"px;'>"+this.locknum+toggletext+"</div>";
}
var coords=getCentreXY(this.col,this.row);
drawObject(coords[0],coords[1],Math.PI/2,drawlength/2,7,0)

if(this.used)
{//draw a tick
canvas[0].save();
canvas[0].lineWidth=3;
canvas[0].beginPath()
canvas[0].moveTo(coords[0]-drawlength/4,coords[1])
canvas[0].lineTo(coords[0],coords[1]+drawlength/4)
canvas[0].lineTo(coords[0]+3*drawlength/8 , coords[1]-3*drawlength/8)
canvas[0].stroke();
canvas[0].restore();
}

}


function drawFakelock()
{
fillCell(this.col,this.row,"rgb(96,96,96)");
var coords=getCentreXY(this.col,this.row);
if(locks[this.reallock].open)
{//open padlock
drawObject(coords[0],coords[1],Math.PI/2,drawlength*1.5,6,0)
}else{//closed padlock
drawObject(coords[0],coords[1],Math.PI/2,drawlength*1.5,5,0)
}

if(leveleditor && !testinglevel)
{//add the lock number if in editor
coords=getXY(this.col,this.row);
document.getElementById('bunnyspan').innerHTML+="<div class='bunnymessage' style='position:absolute;top:"+(coords[1]+drawlength/3)+";left:"+(coords[0]+drawlength/3)+";font-size: "+drawlength/2+"px;'>"+this.reallock+" (C)</div>";
}
}

function drawGrassStalk(x,y,angle,radius,colour)
{
canvas[0].fillStyle=colour;
canvas[0].beginPath();
canvas[0].moveTo(x+Math.cos(angle+Math.PI/2)*radius/15 , y+Math.sin(angle+Math.PI/2)*radius/15)
canvas[0].lineTo(x+Math.cos(angle)*radius , y+Math.sin(angle)*radius)
canvas[0].lineTo(x+Math.cos(angle-Math.PI/2)*radius/15 , y+Math.sin(angle-Math.PI/2)*radius/15)
canvas[0].fill();
}

function drawGrass()
{
fillCell(this.col,this.row,"rgb(64,128,0)");
var coords=getCentreXY(this.col,this.row);

for(var g=0;g<7;g++)
{
drawGrassStalk(coords[0]+Math.cos(-Math.PI*3/4 + g*Math.PI/12)*drawlength/2 ,coords[1]+drawlength*3/4 +Math.sin(-Math.PI*3/4 + g*Math.PI/12)*drawlength/2 , -Math.PI*3/4 + g*Math.PI/12 ,drawlength/1.5,"rgb(72,"+Math.round(184+Math.cos(g*7+g/2)*20)+",37)")
}
}

function getAngleFromFace(facing)
{
switch(facing)
{
case 0:var angle=-Math.PI;break;//west
case 1:var angle=-Math.PI*2/3;break;//northwest
case 2:var angle=-Math.PI/2;break;//north
case 3:var angle=-Math.PI/3;break;//northeast
case 4:var angle=0;break;//east
case 5:var angle=Math.PI/3;break;//southeast
case 6:var angle=Math.PI/2;break;//south
case 7:var angle=Math.PI*2/3;break;//southwest
}
return angle;
}

function drawRabbits()
{
   for(var i=0;i<rabbits.length;i++)
	 {
	 if((rabbits[i].alive && realloopcount%(animatesync+1)==0) || (realloopcount%(animatesync+1)!==0 && rabbits[i].oldalive))
	 {rabbits[i].drawRabbit();}
	 }
}

function drawEntities()
{
for(var i=0;i<entities.length;i++){if(entities[i].active){entities[i].draw();}}
}

function drawCells()
{
for(var i=0;i<gridcells.length;i++){gridcells[i].drawCell();}
}
/*
if(IErendermode){drawCells=function ()
    {
       switch(gridsides)
			 {//IE sucks at canvas, so get it to do as little as possible to keep it fast
			 case 4:
			 default:
			 canvas[0].fillStyle="rgb(72,184,37)";
			 canvas[0].fillRect(offset,offset,worldsize[0],worldsize[1]);
			 break;
			 }
			 
		for(var i=0;i<gridcells.length;i++){gridcells[i].drawCell();}
			 
	
		}
}
*/