
var moveup=false;
var movedown=false;
var moveleft=false;
var moveright=false;
function keydown(event)
{
//alert(keydown)
var key = String.fromCharCode(event.keyCode || event.which);
switch (key){
case "A":
case "%":
//left
moveleft = true;
break;
case "D":
case "'":
//righ
moveright=true;
break;
case "W":
case "&":
//up
moveup=true;
break;
case "S":
case "(":
//down
movedown=true;
break;
default:
return true;}
return false;}
function keyup(event)
{var key = String.fromCharCode(event.keyCode || event.which);
switch (key){
case "A":
case "%":
moveleft=false;
break;
case "D":
case "'":
moveright=false;
break;
case "W":
case "&":
moveup=false;
break;
case "S":
case "(":
movedown=false;
break;
default:
return true;}
return false;}