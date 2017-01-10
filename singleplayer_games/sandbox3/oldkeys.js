/*
var moveup=false;
var movedown=false;
var moveleft=false;
var moveright=false;
var spacedown=false;

var lastkeypressed=false;
*/

function keydown(event)
{

var key = String.fromCharCode(event.keyCode || event.which);
var code=(event.keyCode || event.which);
//alert(code)
switch (key)
{
case 'D':document.getElementById('mousedoes').value='drag';break;
//oldmousedo=document.getElementById('mousedoes').value;
case 'M':document.getElementById('mousedoes').value='dragworld';break;
case 'P':togglepause();break;
case 'R':viewports[0].x=0;viewports[0].y=0;viewports[0].zoom=1;redrawworld();break;
}
switch(code)
{
case 37:if(!drawingshape){viewports[0].x-=100/viewports[0].zoom;redrawworld();};break;//left arrow
case 38:if(!drawingshape){viewports[0].y-=100/viewports[0].zoom;redrawworld();};break;//up arrow
case 39:if(!drawingshape){viewports[0].x+=100/viewports[0].zoom;redrawworld();};break;//right arrow
case 40:if(!drawingshape){viewports[0].y+=100/viewports[0].zoom;redrawworld();};break;//down arrow
//case 32:spacedown=true;break;
}

}


function keyup(event)
{
var key = String.fromCharCode(event.keyCode || event.which);
var code=(event.keyCode || event.which);
switch (key)
{
//case 'M':document.getElementById('mousedoes').value=oldmousedo;break;
}
switch(code)
{
//case 32:spacedown=false;break;
}

}