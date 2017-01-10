//functions for loading worlds

function loadcradle()
{
gravityY=200;
document.getElementById('customgravity').value=200;

var temparray=new Array();
temparray[0]=new entity(1,'fixedpoint7',250,100,50,50,100,'balls/black.gif',1,0,0,0,0,true,false,0,'',2,1,'');
temparray[1]=new entity(1,'fixedpoint1',300,100,50,50,100,'balls/black.gif',1,0,0,0,0,true,false,0,'',2,1,'');
temparray[2]=new entity(1,'fixedpoint2',350,100,50,50,100,'balls/black.gif',1,0,0,0,0,true,false,0,'',2,1,'');
temparray[3]=new entity(1,'fixedpoint3',400,100,50,50,100,'balls/black.gif',1,0,0,0,0,true,false,0,'',2,1,'');
temparray[4]=new entity(1,'fixedpoint4',450,100,50,50,100,'balls/black.gif',1,0,0,0,0,true,false,0,'',2,1,'');
temparray[5]=new entity(1,'fixedpoint5',500,100,50,50,100,'balls/black.gif',1,0,0,0,0,true,false,0,'',2,1,'');
temparray[6]=new entity(1,'fixedpoint6',550,100,50,50,100,'balls/black.gif',1,0,0,0,0,true,false,0,'',2,1,'');

temparray[7]=new entity(1,'ball7',250,300,50,50,200,'balls/blue.gif',0,0,0,0,0,true,false,0,'',2,1,'');
temparray[8]=new entity(1,'ball1',300,300,50,50,200,'balls/blue.gif',0,0,0,0,0,true,false,0,'',2,1,'');
temparray[9]=new entity(1,'ball2',350,300,50,50,200,'balls/blue.gif',0,0,0,0,0,true,false,0,'',2,1,'');
temparray[10]=new entity(1,'ball3',400,300,50,50,200,'balls/blue.gif',0,0,0,0,0,true,false,0,'',2,1,'');
temparray[11]=new entity(1,'ball4',450,300,50,50,200,'balls/blue.gif',0,0,0,0,0,true,false,0,'',2,1,'');
temparray[12]=new entity(1,'ball5',500,300,50,50,200,'balls/blue.gif',0,0,0,0,0,true,false,0,'',2,1,'');
temparray[13]=new entity(1,'ball6',550,300,50,50,200,'balls/blue.gif',0,0,0,0,0,true,false,0,'',2,1,'');

connect(temparray[0].arraypos,temparray[7].arraypos,50000,false,1)
connect(temparray[1].arraypos,temparray[8].arraypos,50000,false,1)
connect(temparray[2].arraypos,temparray[9].arraypos,50000,false,1)
connect(temparray[3].arraypos,temparray[10].arraypos,50000,false,1)
connect(temparray[4].arraypos,temparray[11].arraypos,50000,false,1)
connect(temparray[5].arraypos,temparray[12].arraypos,50000,false,1)
connect(temparray[6].arraypos,temparray[13].arraypos,50000,false,1)
}

function loadexample()
{
new entity(1,'ball',200,100,50,50,50,'balls/red.gif',0,0,0,0,0,true,false,0,'',1,0.95,'');
new entity(1,'ball2',600,100,50,50,50,'balls/green.gif',0,0,0,0,0,true,false,0,'',1,0.95,'');
new entity(1,'fixedpoint3',400,200,50,50,100,'balls/black.gif',1,0,0,0,0,true,false,0,'',2,1,'');
stringbetween(ball.arraypos,ball2.arraypos,30,6,5000)

new entity(1,'smallball1',150,300,9,9,50,'tinyballs/red.gif',0,0,0,0,0,true,false,0,'',2,1,'');
new entity(1,'smallball2',200,300,9,9,50,'tinyballs/red.gif',0,0,0,0,0,true,false,0,'',2,1,'');
new entity(1,'smallball3',150,350,9,9,50,'tinyballs/red.gif',0,0,0,0,0,true,false,0,'',2,1,'');
new entity(1,'smallball4',200,350,9,9,50,'tinyballs/red.gif',0,0,0,0,0,true,false,0,'',2,1,'');

connect(smallball1.arraypos,smallball2.arraypos,10000,false,0)
connect(smallball1.arraypos,smallball3.arraypos,10000,false,0)
connect(smallball2.arraypos,smallball3.arraypos,10000,false,0)
connect(smallball4.arraypos,smallball1.arraypos,10000,false,0)
connect(smallball4.arraypos,smallball2.arraypos,10000,false,0)
connect(smallball4.arraypos,smallball3.arraypos,10000,false,0)

}

function loadsusbridge()
{
//19 blobs
stringbetween(rightborder.arraypos,leftborder.arraypos,40,6,5000)

var temp1 = new entity(1,'fixedpoint1',550,100,50,50,100,'balls/black.gif',1,0,0,0,0,true,false,0,'',2,1,'');
var temp2 = new entity(1,'fixedpoint2',220,100,50,50,100,'balls/black.gif',1,0,0,0,0,true,false,0,'',2,1,'');

connect(7,temp1.arraypos,10000,false,1)
connect(10,temp1.arraypos,10000,false,1)
connect(13,temp1.arraypos,10000,false,1)
connect(16,temp2.arraypos,10000,false,1)
connect(19,temp2.arraypos,10000,false,1)
connect(22,temp2.arraypos,10000,false,1)
}

function loadorbit()
{
gravityY=0;
document.getElementById('customgravity').value=0;
friction=1;
document.getElementById('customfriction').value=0;
var temp1=new entity(1,'ball1',500,200,50,50,100,'balls/red.gif',0,135,0,0,0,true,false,0,'',1,0.95);
temp1.makecharged(0.2)
var temp2=new entity(1,'charge2',500,300,50,50,100,'balls/black.gif',1,0,0,0,0,true,false,0,'',1,0.95);
temp2.makecharged(-0.1)
}