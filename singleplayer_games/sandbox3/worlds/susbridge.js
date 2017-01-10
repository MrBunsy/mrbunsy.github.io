function loadsusbridge()
{
//19 blobs
var leftthing=new entity(1,'fixedpoint3',0,300,10,10,100,'black',1,0,0,0,0,true,false,0,true,2,1,'','balls/black.gif');
var rightthing=new entity(1,'fixedpoint4',790,300,10,10,100,'black',1,0,0,0,0,true,false,0,true,2,1,'','balls/black.gif');

stringbetween(rightthing.arraypos,leftthing.arraypos,40,5,5000)

var temp1 = new entity(1,'fixedpoint1',530,100,50,50,100,'black',1,0,0,0,0,true,false,0,true,2,1,'','balls/black.gif');
var temp2 = new entity(1,'fixedpoint2',180,100,50,50,100,'black',1,0,0,0,0,true,false,0,true,2,1,'','balls/black.gif');

connect(8,temp1.arraypos,10000,false,1,0)
connect(11,temp1.arraypos,10000,false,1,0)
connect(14,temp1.arraypos,10000,false,1,0)
connect(18,temp2.arraypos,10000,false,1,0)
connect(21,temp2.arraypos,10000,false,1,0)
connect(24,temp2.arraypos,10000,false,1,0)
document.getElementById('smallworld').checked=true;
}
loadsusbridge();
finishloading();