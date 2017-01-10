function loadcradle()
{
new entity(1,'fixedpoint7',250,100,50,50,100,'black',1,0,0,0,0,true,false,0,true,2,1,'','balls/black.gif');
new entity(1,'fixedpoint1',300,100,50,50,100,'black',1,0,0,0,0,true,false,0,true,2,1,'','balls/black.gif');
new entity(1,'fixedpoint2',350,100,50,50,100,'black',1,0,0,0,0,true,false,0,true,2,1,'','balls/black.gif');
new entity(1,'fixedpoint3',400,100,50,50,100,'black',1,0,0,0,0,true,false,0,true,2,1,'','balls/black.gif');
new entity(1,'fixedpoint4',450,100,50,50,100,'black',1,0,0,0,0,true,false,0,true,2,1,'','balls/black.gif');
new entity(1,'fixedpoint5',500,100,50,50,100,'black',1,0,0,0,0,true,false,0,true,2,1,'','balls/black.gif');
new entity(1,'fixedpoint6',550,100,50,50,100,'black',1,0,0,0,0,true,false,0,true,2,1,'','balls/black.gif');
new entity(1,'ball7',249.2487452320028,301.0039161674297,50,50,200,'blue',0,0.5991477571216549,1.9923070012691766,0,0,true,false,0,true,2,1,'','balls/blue.gif');
new entity(1,'ball1',299.62475462563816,301.00497008512383,50,50,200,'blue',0,0.09909676357991662,1.9902529115091376,0,0,true,false,0,true,2,1,'','balls/blue.gif');
new entity(1,'ball2',349.6309590598839,301.0049815690184,50,50,200,'blue',0,0.09139330584080525,1.9902388392639359,0,0,true,false,0,true,2,1,'','balls/blue.gif');
new entity(1,'ball3',399.63846800317265,301.0049949301278,50,50,200,'blue',0,0.12414373038994793,1.9902738184240585,0,0,true,false,0,true,2,1,'','balls/blue.gif');
new entity(1,'ball4',449.71519342752816,301.00511829628323,50,50,200,'blue',0,0.25211903635060906,1.9904101530042317,0,0,true,false,0,true,2,1,'','balls/blue.gif');
new entity(1,'ball5',499.72630166584344,301.0051337297363,50,50,200,'blue',0,0.2606694672765696,1.990408079312568,0,0,true,false,0,true,2,1,'','balls/blue.gif');
new entity(1,'ball6',549.873966498422,300.0052803718777,50,50,200,'blue',0,0.35461496004389725,1.990279478569784,0,0,true,false,0,true,2,1,'','balls/blue.gif');
connect(11,18,0,200,2,1,true);
connect(10,17,0,201,2,1,true);
connect(9,16,0,201,2,1,true);
connect(8,15,0,201,2,1,true);
connect(7,14,0,201,2,1,true);
connect(6,13,0,201,2,1,true);
connect(5,12,0,201,2,1,true);
gravityY=200;
friction=5; 
document.getElementById('smallworld').checked=false;
}
loadcradle();
finishloading();