var moveup=false;
var movedown=false;
var moveleft=false;
var moveright=false;
var spacedown=false;

var debug=false;
var debugpressed=false;

var lastkeypressed=false;

function keydown(event)
{
var key = String.fromCharCode(event.keyCode || event.which);
var code=(event.keyCode || event.which);

if(debug){givebonus(key*1);}

switch (key){
case "D":lastkeypressed='D';break;
case "E":if(lastkeypressed=='D'){lastkeypressed='E';}else{lastkeypressed=false;}break;

case "B":if(lastkeypressed=='E'){lastkeypressed='B';}else{lastkeypressed=false;}break;
case "U":if(lastkeypressed=='B'){lastkeypressed='U';}else{lastkeypressed=false;}break;

case "G":if(lastkeypressed=='U'){lastkeypressed=false;if(debug){debug=false;}else{debug=true};rundebug();debugpressed=true;}else{lastkeypressed=false;}break;

case "M":if(lastkeypressed=='E'){lastkeypressed='M';}else{lastkeypressed=false;}break;
case "O":if(lastkeypressed=='M'){lastkeypressed=false;demo=true;}else{lastkeypressed=false;}break;

case "%":moveleft = true;break;
case "'":moveright=true;break;
case "&":moveup=true;break;
case "(":movedown=true;break;

case 'P':pause();break;
default:lastkeypressed=false;break;
}

switch(code)
{
case 32:
spacepressed();
spacedown=true;
break;
}
}


function keyup(event)
{
var key = String.fromCharCode(event.keyCode || event.which);
var code=(event.keyCode || event.which);
switch (key){
//case "A":
case "%":
moveleft=false;
break;
//case "D":
case "'":
moveright=false;
break;
//case "W":
case "&":
moveup=false;
break;
//case "S":
case "(":
movedown=false;
break;
}

switch(code)
{
case 32:
spacedown=false;
break;
}

}