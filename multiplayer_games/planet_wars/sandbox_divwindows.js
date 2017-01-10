var windows=new Array();

//var windowspanvar=document.getElementById('windowspan');

function divwindow(name,title,zindex,bgcolour,titlecolour,width,height,left,top,padding,contents,onclose)
{this.name=name;
this.content=name+'content';
this.title=name+'titlediv';
this.divname=name+'div';
this.moveme=false;
this.HoldsMouse=HoldsMouse;
this.CloseWindow=CloseWindow;
this.OpenWindow=OpenWindow;
this.CentreWindow=CentreWindow;
windows.push(this);
document.getElementById('windowspan').innerHTML+="<div id='"+this.divname+"' style='display:none; border:solid black 1px;position:absolute; top:"+top+";left:"+left+"; height:"+height+"; z-index:"+zindex+"; background-color:"+bgcolour+";width:"+width+";'><div id='"+this.name+"titlediv' onmousedown='"+this.name+".HoldsMouse();' onmouseup='"+this.name+".moveme=false;' style='position:relative; width:"+width+"; height:20; cursor:move; background-color:"+titlecolour+";'><span id='"+this.name+"titlespan' style='float:left;'>"+title+"<\/span><span style='float:right; cursor:hand; cursor:pointer;' onClick='"+this.name+".CloseWindow();"+onclose+"'>X<\/span><\/div><div id='"+this.name+"content' style='padding:"+padding+";'>"+contents+"<\/div><\/div>"
}

function CloseWindow()
{document.getElementById(this.divname).style.display='none';}
function OpenWindow()
{document.getElementById(this.divname).style.display='block';}
function CentreWindow()
{
var offset=getScrollXY();
var screenwidth = document.body.clientWidth*1//+offset[0];
var screenheight = document.body.clientHeight*1//+offset[1];

var oldwidth=tonumber(document.getElementById(this.title).style.width)
var oldheight=tonumber(document.getElementById(this.divname).style.height)

document.getElementById(this.divname).style.left=screenwidth/2-oldwidth/2+offset[0];
document.getElementById(this.divname).style.top=screenheight/2-oldheight/2+offset[1];

}

function HoldsMouse()
{this.moveme=true;
var oldtop=tonumber(document.getElementById(this.divname).style.top)
var oldleft=tonumber(document.getElementById(this.divname).style.left)
mousediffinx=realmouseX-oldleft;
mousediffiny=realmouseY-oldtop;}

function closeallwindows()
{for(var i=0;i<windows.length;i++)
{windows[i].CloseWindow();}}

function tonumber(str)
{str = str.replace("px","")
str = str*1
return str;}

function getScrollXY() {
var scrOfX = 0, scrOfY = 0;
if( typeof( window.pageYOffset ) == 'number' ) {
//Netscape compliant
scrOfY = window.pageYOffset;
scrOfX = window.pageXOffset;
}else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
//DOM compliant
scrOfY = document.body.scrollTop;
scrOfX = document.body.scrollLeft;
}else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
//IE6 standards compliant mode
scrOfY = document.documentElement.scrollTop;
scrOfX = document.documentElement.scrollLeft;
}
return [ scrOfX, scrOfY ];
}