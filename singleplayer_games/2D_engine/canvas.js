//canvas version 0.6 - drawline is fairly optimised (draws minimm number of divs) and draws a nice clean line, but cicles and elipses aren't optimised and draw 'fuzzy' lines. 
//edited with classname for use in 2d engine
function DrawLine(x1,y1,x2,y2,z,colour,thick,classname)
{
//uses Bresenham's line algorithm
var dy=y2-y1
var dx=x2-x1
var gradient=dy/dx
var addhtml=''
if (gradient <= 1 && gradient >= -1){
//shallow slope
if(x1<x2)
{var startx=x1;var finishx=x2;
var starty=y1-1;var finishy=y2
}else{
var startx=x2;var finishx=x1;
var starty=y2-1;var finishy=y1
}
var y=starty
var divwidth=1;
for(x=startx;x<=finishx;x++)
{
var realY=gradient*(x-startx)+starty
var errors=Math.abs(y-realY)
if(errors>0.5&& gradient <=1 && gradient >=0){y++;addhtml+="<div class='"+classname+"' style='position:absolute; line-height:0; clip:rect(0,"+divwidth+"px,"+thick+"px,0); z-index:"+z+"; width:"+divwidth+"px; height:"+thick+"px; left:"+(x-divwidth)+"; top:"+y+"; background-color:"+colour+";'></div>";divwidth=1;}
else if(errors>0.5&& gradient <=0){y--;addhtml+="<div class='"+classname+"' style='position:absolute; line-height:0; clip:rect(0,"+divwidth+"px,"+thick+"px,0); z-index:"+z+"; width:"+divwidth+"px; height:"+thick+"px; left:"+(x-divwidth)+"; top:"+y+"; background-color:"+colour+";'></div>";divwidth=1;}
else{divwidth++; if(x==finishx){addhtml+="<div class='"+classname+"' style='position:absolute; line-height:0; clip:rect(0,"+divwidth+"px,"+thick+"px,0); z-index:"+z+"; width:"+divwidth+"px; height:"+thick+"px; left:"+(x-divwidth)+"; top:"+y+"; background-color:"+colour+";'></div>";divwidth=1;}}
}
//end of shallow slope
}else
{
//steep slope
if(y1<y2)
{var startx=x1-1;var finishx=x2;
var starty=y1;var finishy=y2
}else{
var startx=x2-1;var finishx=x1;
var starty=y2;var finishy=y1
}
var x=startx
var divheight=1;
for(y=starty;y<=finishy;y++)
{
var realX=(y-starty)/gradient+startx
var errors=Math.abs(x-realX)
//if(errors>0.5){x++}
if(errors>0.5&& gradient >1){addhtml+="<div class='"+classname+"' style='position:absolute; line-height:0; clip:rect(0,"+thick+"px,"+divheight+"px,0); z-index:"+z+"; width:"+thick+"px; height:"+divheight+"px; left:"+x+"; top:"+(y-divheight)+"; background-color:"+colour+";'></div>";divheight=1;x++;}
else if(errors>0.5&& gradient <-1){addhtml+="<div class='"+classname+"' style='position:absolute; line-height:0; clip:rect(0,"+thick+"px,"+divheight+"px,0); z-index:"+z+"; width:"+thick+"px; height:"+divheight+"px; left:"+x+"; top:"+(y-divheight)+"; background-color:"+colour+";'></div>";divheight=1;x--;}
else{divheight++;if(y==finishy){addhtml+="<div class='"+classname+"' style='position:absolute; line-height:0; clip:rect(0,"+thick+"px,"+divheight+"px,0); z-index:"+z+"; width:"+thick+"px; height:"+divheight+"px; left:"+x+"; top:"+(y-divheight)+"; background-color:"+colour+";'></div>";divheight=1;}}
}//end of steep slope
}document.getElementById('canvasspan').innerHTML+=addhtml}
