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
case 'P':Sandbox.togglepause();break;
case 'R':Render.viewports[0].x=0;Render.viewports[0].y=0;Render.viewports[0].zoom=1;Render.redrawworld();break;
}
switch(code)
{
case 37:if(!Sandbox.drawingshape){Render.viewports[0].x-=100/Render.viewports[0].zoom;Render.redrawworld();};break;//left arrow
case 38:if(!Sandbox.drawingshape){Render.viewports[0].y-=100/Render.viewports[0].zoom;Render.redrawworld();};break;//up arrow
case 39:if(!Sandbox.drawingshape){Render.viewports[0].x+=100/Render.viewports[0].zoom;Render.redrawworld();};break;//right arrow
case 40:if(!Sandbox.drawingshape){Render.viewports[0].y+=100/Render.viewports[0].zoom;Render.redrawworld();};break;//down arrow
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