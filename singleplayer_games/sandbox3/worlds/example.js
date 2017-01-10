function loadexample()
{
var temparray=new Array();
temparray[0]=new entity(1,'smallball1',150,300,9,9,50,'red',0,0,0,0,0,true,false,0,true,2,1,'','balls/red.gif');
temparray[1]=new entity(1,'smallball2',200,300,9,9,50,'red',0,0,0,0,0,true,false,0,true,2,1,'','balls/red.gif');
temparray[2]=new entity(1,'smallball3',150,350,9,9,50,'red',0,0,0,0,0,true,false,0,true,2,1,'','balls/red.gif');
temparray[3]=new entity(1,'smallball4',200,350,9,9,50,'red',0,0,0,0,0,true,false,0,true,2,1,'','balls/red.gif');

connect(temparray[0].arraypos,temparray[1].arraypos,10000,false,1,0,true)
connect(temparray[0].arraypos,temparray[2].arraypos,10000,false,1,0,true)
connect(temparray[1].arraypos,temparray[2].arraypos,10000,false,0,0,true)
connect(temparray[3].arraypos,temparray[0].arraypos,10000,false,0,0,true)
connect(temparray[3].arraypos,temparray[1].arraypos,10000,false,1,0,true)
connect(temparray[3].arraypos,temparray[2].arraypos,10000,false,1,0,true)

temparray[4]=new entity(1,'ball',200,100,50,50,50,'red',0,0,0,0,0,true,false,0,true,1,0.95,'','balls/red.gif');
temparray[5]=new entity(1,'ball2',600,100,50,50,50,'green',0,0,0,0,0,true,false,0,true,1,0.95,'','balls/green.gif');
temparray[6]=new entity(1,'fixedpoint3',400,200,50,50,100,'black',1,0,0,0,0,true,false,0,true,2,1,'','balls/black.gif');
stringbetween(temparray[4].arraypos,temparray[5].arraypos,30,1,5000,true)


gravityY=200;
friction=5;
document.getElementById('smallworld').checked=false;
}

loadexample();
finishloading();