function loadpentagon()
{
new entity(1,'savedcircle0',322.9133564270278,191.42250824498655,20,20,50,'green',0,0.25150162145127736,0.5688995769972586,0,0,true,false,0,true,1,0.95,'','balls/green.gif');
new entity(1,'savedcircle1',298.9180691594872,334.24443880392334,20,20,50,'green',0,-0.41761861758606766,-0.537488555457168,0,0,true,false,0,true,1,0.95,'','balls/green.gif');
new entity(1,'savedcircle2',426.78038312226874,401.7076977047905,20,20,50,'green',0,-0.22145807233592157,0.037161644241898446,0,0,true,false,0,true,1,0.95,'','balls/green.gif');
new entity(1,'savedcircle3',530.486654951815,300.3428374479657,20,20,50,'green',0,0.7603925267239102,-0.2546542417066687,0,0,true,false,0,true,1,0.95,'','balls/green.gif');
new entity(1,'savedcircle4',466.22792142910777,170.99901934733495,20,20,50,'green',0,0.07529069997997288,0.03757008492984065,0,0,true,false,0,true,1,0.95,'','balls/green.gif');
connect(6,8,1000,200,1,0);
connect(5,6,1000,200,1,0);
connect(5,7,1000,200,1,0);
connect(7,9,1000,200,1,0);
connect(8,9,1000,200,1,0);
connect(7,8,1000,200,1,0);
connect(6,7,1000,200,1,0);
connect(6,9,1000,200,1,0);
connect(5,9,1000,200,1,0);
connect(5,8,1000,200,1,0);
gravityY=200;
friction=1;
document.getElementById('smallworld').checked=false;
}
loadpentagon();
finishloading();