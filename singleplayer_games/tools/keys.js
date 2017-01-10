var moveup=false;
var movedown=false;
var moveleft=false;
var moveright=false;
var spacedown=false;
var lastkeypressed=false;

function keydown(event)
{
var key = String.fromCharCode(event.keyCode || event.which);
var code=(event.keyCode || event.which);

switch (key)
{
case 'A':case "%":moveleft=true;break;
case 'D':case "'":moveright=true;break;
case 'W':case "&":moveup=true;break;
case 'S':case "(":movedown=true;break;
}
switch(code)
{
case 32:spacedown=true;break;
}

}


function keyup(event)
{
var key = String.fromCharCode(event.keyCode || event.which);
var code=(event.keyCode || event.which);
switch (key){
case 'A':case "%":moveleft=false;break;
case 'D':case "'":moveright=false;break;
case 'W':case "&":moveup=false;break;
case 'S':case "(":movedown=false;break;
}
switch(code)
{
case 32:spacedown=false;break;
}

}