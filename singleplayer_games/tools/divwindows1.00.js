var windows=new Array();

//var windowspanvar=document.getElementById('windowspan');

function divwindow(name,title,zindex,bgcolour,titlecolour,width,height,left,top,padding,contents)
{this.name=name;
this.content=name+'content';
this.title=name+'titlediv';
this.divname=name+'div';
this.moveme=false;
this.HoldsMouse=HoldsMouse;
this.CloseWindow=CloseWindow;
this.OpenWindow=OpenWindow;
windows.push(this);
document.getElementById('windowspan').innerHTML+="<div id='"+this.divname+"' style='display:none; border:solid black 1px;position:absolute; top:"+top+";left:"+left+"; height:"+height+"; z-index:"+zindex+"; background-color:"+bgcolour+";'><div id='"+this.name+"titlediv' onmousedown='"+this.name+".HoldsMouse();' onmouseup='"+this.name+".moveme=false;' style='position:relative; width:"+width+"; height:20; cursor:move; background-color:"+titlecolour+";'><span style='float:left;'>"+title+"</span><span style='float:right; cursor:hand; cursor:pointer;' onClick='"+this.name+".CloseWindow();'>X</span></div><div id='"+this.name+"content' style='padding:"+padding+";'>"+contents+"</div></div>"
}

function CloseWindow()
{document.getElementById(this.divname).style.display='none';}
function OpenWindow()
{document.getElementById(this.divname).style.display='block';}

function HoldsMouse()
{this.moveme=true;
oldtop=tonumber(document.getElementById(this.divname).style.top)
oldleft=tonumber(document.getElementById(this.divname).style.left)
diffinx=mouseX-oldleft;
diffiny=mouseY-oldtop;}

function closeallwindows()
{for(var i=0;i<windows.length;i++)
{windows[i].CloseWindow();}}

//this is called anytime the mouse button is released on the page. Stops windows 'sticking' to the mouse
function finalmouseup()
{for(var i=0;i<windows.length;i++){windows[i].moveme=false;}}

//detect IE or not for mouse capture
if (document.all){var IE=true}else{var IE = false}
if (IE==false) {document.captureEvents(Event.MOUSEMOVE)}

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


function tonumber(str)
{str = str.replace("px","")
str = str*1
return str;}

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
{for(var i=0;i<windows.length;i++)
{if (windows[i].moveme == true)//moveing a window
{var oldwidth=tonumber(document.getElementById(windows[i].title).style.width)
var oldheight=tonumber(document.getElementById(windows[i].divname).style.height)
var screenwidth = document.body.clientWidth*1
var screenheight = document.body.clientHeight*1
var newleft =	mouseX-diffinx;
var newtop = mouseY-diffiny;
//find out if you're trying to drag the window off the bottom and right edges of the screen
var newright =	mouseX+oldwidth-diffinx+20
var newbottom = mouseY+oldheight+20
if (newright > screenwidth){newleft=screenwidth-oldwidth-20}
if (newbottom > screenheight){newtop=screenheight-oldheight-32}
if (newleft < 10){newleft = 10}
if (newtop < 10){newtop = 10}  
document.getElementById(windows[i].divname).style.left=newleft
document.getElementById(windows[i].divname).style.top=newtop}}}

document.onmouseup   = finalmouseup;
document.onmousemove = getMouseXY;