/*
facing which direction
0=west, 1=north west (hexagons only), 2=north (squares only) ,3=north east(hexagons only), 4=east, 5=south east (hexagons only), 6=south (squares only), 7=south west (hexagons only)

//arrow types: 0=everything, 1=bodycolour, 2=earcolour, 3=carry
//colours: 0=red, 1=yellow, 2=green, 3=blue
//carry: 0=carrot, 1=teddy, 2=lettuce, 3=book (red, yellow, green blue again :) )

entitity types:
0=hutch
1=warren
2=arrow
3=block
4=Gate aka gate
5=repaint
6=lock
7=key
8=fakelock
9=nobuild

*/
function rabbit(col,row,bodycolour,earcolour,carrying,facing)
{
//co-ords:
this.col=col;
this.row=row;
//colour of body
this.bodycolour=bodycolour;
//colour of ears - if false will be drawn as same as body
this.earcolour=earcolour;
//carrying
this.carrying=carrying;
//heading in direction
this.facing=facing
//alive or dead
this.alive=true;
//standing still?
this.standstill=false;

this.drawRabbit=drawRabbit;

rabbits.push(this);
}

function tool(type,specific,howmany)
{//essentially arrows in the toolbox
this.type=type;
this.specific=specific;
//at start
this.howmany=howmany;
//mid-game
this.howmanyleft=howmany;

this.reset=resetTool;

tools.push(this);
}

function cell(col,row,Xs,Ys,colour)
{
this.col=col;
this.row=row;
this.colour=colour;
this.Xs=Xs;
this.Ys=Ys;

this.drawCell=drawCell;

gridcells.push(this);
}

var levelGroups=new Array();

function levelGroup(name,description,endmessage,leadto,onlist)
{//group of levels - eg tutorial, easy, hard
this.name=name;
//pinged up at benning of level, set to false for none.
this.description=description;
//message once all levels in campaign are completed.
this.endmessage=endmessage;
//does one level lead to the next? true/false.
this.leadto=leadto
//add to list of levels on loading screen?
this.onlist=onlist;

//array of levels in this group
this.levels=new Array();

levelGroups.push(this);
}

function level(name,description,file,group)
{//file = "levels/"+this.file+".js";
this.name=name;
this.description=description;
this.file=file
this.group=group;
//add to group
levelGroups[group].levels.push(this);
}

var bigMenus=new Array();

function bigMenu(div)
{
this.div=div;

this.open=function (){closeAllBigMenus();closeAllMiniMenus();document.getElementById(this.div).style.display="block";}
this.close=function (){document.getElementById(this.div).style.display="none";}

bigMenus.push(this);
}

function closeAllBigMenus()
{

  for(var m=0;m<bigMenus.length;m++)
	{
	bigMenus[m].close();
	}
}

var miniMenus=new Array();

function miniMenu(div)
{
this.div=div;

this.open=function (){closeAllMiniMenus();document.getElementById(this.div).style.display="block";}
this.close=function (){document.getElementById(this.div).style.display="none";}

miniMenus.push(this);
}

function closeAllMiniMenus()
{

  for(var m=0;m<miniMenus.length;m++)
	{
	miniMenus[m].close();
	}
}

function hutch(col,row,bodycolour,earcolour,carrying,facing,freq,total)
{//aka spawn point
//co-ords:
this.col=col;
this.row=row;
this.type=0;//hutch
this.facing=facing
//how often to spawn
this.freq=freq
//how many to spawn
this.total=total;
this.startingtotal=total;
this.spawned=0;
this.editable=false;

this.bodycolour=bodycolour;
this.earcolour=earcolour;
this.carrying=carrying;
this.active=true;

this.draw=drawHutch;
this.reset=resetHutch;
entities.push(this);
}

function warren(col,row,rabbittype,specific)
{//exit point
this.type=1;
this.col=col;
this.row=row;
//as per arrow, 0=all rabbits, 1=body, 2=ears, 3=carried
this.rabbittype=rabbittype;
this.specific=specific;
//if(rabbittype==0){this.specific=false;}
//how many rabbits have got in?
this.holding=0;
this.active=true;
this.editable=false;

this.draw=drawWarren;
this.reset=resetWarren;
entities.push(this);
}

function arrow(col,row,facing,rabbittype,specific,editable,active)
{
this.type=2;
this.col=col;
this.row=row;
this.facing=facing;
this.rabbittype=rabbittype;
this.specific=specific;
//can user change this arrow?
this.editable=editable;
//has it been deleted?
this.active=active;

this.draw=drawArrow;
this.reset=resetArrow;
entities.push(this);
}

function block(col,row,graphics)
{
this.type=3;
this.col=col;
this.row=row;
//what to look like.
//0=brown cell.
this.graphics=graphics;
this.active=true;
this.editable=false;

this.draw=drawBlock;
this.reset=resetBlock;
entities.push(this);
}

function gate(col,row,rabbittype,specific,gatetype)
{
this.type=4;
this.col=col;
this.row=row;
this.rabbittype=rabbittype//body, ears, etc
this.specific=specific
//0=only let through above, 1=do not let through above
this.gatetype=gatetype
this.active=true;
this.editable=false;

this.draw=drawGate;
this.reset=resetGate;
entities.push(this);
}


function repaint(col,row,rabbittype,specific)
{
this.type=5;
this.col=col;
this.row=row;
this.rabbittype=rabbittype//body, ears, etc
this.specific=specific

this.active=true;
this.editable=false;

this.draw=drawRepaint;
this.reset=resetRepaint;
entities.push(this);
}

var locks=new Array();

function lock(col,row,keys)
{
this.type=6;
this.col=col;
this.row=row;
//number of keys needed to be activated to open lock
this.keys=keys;
//currently activate keys:
this.keycount=0;
//lock currently open?
this.open=false;
//where in locks array are we?
this.locknum=locks.length;

this.active=true;
this.editable=false;

this.draw=drawLock;
this.reset=resetLock;
entities.push(this);
locks.push(this);
}

function key(col,row,toggle,locknum)
{
this.type=7;
this.col=col;
this.row=row;
//will key de-activate when there isn't a bunny on top?
this.toggle=toggle;
//which lock? this is an array of numbers - each number refers to the lock's position in the locks array;
this.locknum=locknum;
//has key been used?
this.used=false;

this.active=true;
this.editable=false;

this.draw=drawKey;
this.reset=resetKey;
entities.push(this);
}

function fakelock(col,row,reallock)
{//simply duplicates a real lock, so when the real lock is open so is this.
this.type=8;
this.col=col;
this.row=row;
this.reallock=reallock;

this.active=true;
this.editable=false;

this.draw=drawFakelock;
this.reset=resetFakelock;
entities.push(this);
}

function nobuild(col,row)
{//tile which rabbits can walk over but user cannot place arrows on.
this.type=9;
this.col=col;
this.row=row;

this.active=true;
this.editable=false;

this.draw=drawNobuild;
this.reset=resetNobuild;
entities.push(this);
}

function resetHutch()
{this.spawned=0;
this.total=this.startingtotal;} 

function resetWarren()
{this.holding=0;} 

function resetArrow()
{}

function resetBlock()
{}

function resetGate()
{}

function resetRepaint()
{}

function resetLock()
{
this.keycount=0;
this.open=false;
}

function resetFakelock()
{}

function resetNobuild()
{}

function resetKey()
{
this.used=false;
}

function resetTool()
{
this.howmanyleft=this.howmany;
}

function resetTools()
{for(var t=0;t<tools.length;t++)
{tools[t].reset();}}

function resetEntities()
{
  for(var e=0;e<entities.length;e++)
	{
	entities[e].reset();
	}
resetLocks();
}

function resetLocks()
{
locks=new Array();
  for(var l=0;l<entities.length;l++)
	{
	  if(entities[l].type==6 && entities[l].active)
		{
		entities[l].locknum=locks.length;
		locks.push(entities[l]);
		}
	}

}