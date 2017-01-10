function loadorbit()
{
gravityY=0;
document.getElementById('customgravity').value=0;
friction=1;
document.getElementById('customfriction').value=0;
var temp1=new entity(1,'ball1',500,200,50,50,100,'red',0,135,0,0,0,true,false,0,true,1,0.95,'','balls/red.gif');
temp1.makecharged(0.2)
var temp2=new entity(1,'charge2',500,300,50,50,100,'black',1,0,0,0,0,true,false,0,true,1,0.95,'','balls/black.gif');
temp2.makecharged(-0.1)
viewports[0].x=100;
viewports[0].y=100;
document.getElementById('smallworld').checked=false
}
loadorbit();
finishloading();