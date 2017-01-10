// variables to hold mouse x-y position
var mouseX = 0
var mouseY = 0
var oldmouseX = 0
var oldmouseY = 0
var changeinX=0;
var changeinY=0;
var oldtop
var oldleft
var diffinx
var diffiny

var mousein=false;

//this is called anytime the mouse button is released on the page. Stops windows 'sticking' to the mouse
function finalmouseup()
{mousein=false;}

//detect IE or not for mouse capture
if (document.all){var IE=true}else{var IE = false}
if (IE==false) {document.captureEvents(Event.MOUSEMOVE)}

function getMouseXY(e)
{if(IE){
//grab the x-y pos.s if browser is IE
mouseX = event.clientX + document.body.scrollLeft
mouseY = event.clientY + document.body.scrollTop
}else{
//grab the x-y pos.s if browser is NS
mouseX = e.pageX
mouseY = e.pageY}
//catch possible negative values in NS4
if (mouseX < 0){mouseX = 0}
if (mouseY < 0){mouseY = 0}
//this will do things with the mouse movement
checkmice();
oldmouseX=mouseX;
oldmouseY=mouseY;}

function checkmice()
{
if(mousein!==false)
{
if(wholeworld[mousein].state==1 && wholeworld[mousein].type==0 && wholeworld[mousein].hard)
{

}


}


}


function mousegonedown(event,here)
{
mousein=here

if (event.preventDefault)
event.preventDefault();
event.returnValue = false;
//alert(here)
}

document.onmouseup   = finalmouseup;
document.onmousemove = getMouseXY;

//document.onmousedown= mousegonedown


/*

if (event.preventDefault)
event.preventDefault();
event.returnValue = false;

*/