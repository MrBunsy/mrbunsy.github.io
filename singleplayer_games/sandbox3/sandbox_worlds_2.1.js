//functions for loading worlds

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
}

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


}

function loadballoons()
{
new entity(1,'blob1',381.7239973373884,421.4860497908423,50,50,50,'green',0,-2.573751914812953,-52.01705921184487,0,0,true,false,0,true,1,0.95,'','balls/green.gif');
new entity(1,'blobballoon1',370,313.190454437746,50,50,5,'rgb(255,165,0)',0,4.07947689693688,-54.69999782342896,0,-3500,false,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'blobballoon2',395,313.29778626542435,50,50,5,'rgb(255,165,0)',0,2.524739107613881,-53.859006943890336,0,-3500,false,false,0,true,1,0.95,'','balls/orange.gif');
connect(5,6,1000,100,1,0,true);
connect(5,7,1000,100,1,0,true);
gravityY=200;
friction=0.995;
}

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

}

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
}

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
}

function loadlattice()
{
new entity(1,'savedcircle74',609.7085605112898,487.7573082740325,50,50,50,'red',0,132.24146946491197,205.0114581269598,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle75',229.1275451642723,435.0747282276791,50,50,50,'red',0,279.4973205296514,322.71621323322677,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle76',163.4454853175849,348.19124462953636,50,50,50,'blue',0,19.680005773237777,-80.77916067850991,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle77',540.6294649051259,496.6774893881831,50,50,50,'blue',0,-92.25657507815365,-121.52500524232323,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle78',694.1033761789527,444.9058452065752,50,50,50,'red',0,-9.698221583033842,73.80744199657173,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle79',241.96177147973825,484.45801697637967,50,50,50,'blue',0,124.82706216364423,-187.54650953692098,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle80',169.24075822700857,487.7356863866454,50,50,50,'red',0,57.768376510603645,-61.508212873116776,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle81',5.850631369183345,414.7085977612719,50,50,50,'red',0,73.67939613104676,-120.83230718748922,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle82',117.53435803870165,485.2022863514933,50,50,50,'blue',0,69.75567175053524,73.70062184527802,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle83',262.89613996302205,340.28247447601103,50,50,50,'red',0,28.64383065998292,-35.06958709674005,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle84',590.4832794134963,391.00606552658127,50,50,50,'red',0,31.692080282455777,-25.433643479624166,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle85',573.5315794425632,303.4664452862088,50,50,50,'blue',0,-88.55391427226988,70.35609917761917,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle86',739.2740985224938,466.3622522375939,50,50,50,'blue',0,-141.3669902728915,-130.69823212473972,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle87',649.3718658480124,208.5920619586805,50,50,50,'blue',0,25.214094312162292,35.92273176883378,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle88',615.8343155590643,435.752587394089,50,50,50,'blue',0,121.17774731414436,-21.4448398681344,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle89',5.0614149810496745,470.74510198735317,50,50,50,'blue',0,-111.70458564014284,47.35544026201049,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle90',66.02840430910095,479.09832713500936,50,50,50,'red',0,-46.1602398480061,115.36721556241216,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle91',293.2484709943752,477.2536953079408,50,50,50,'red',0,-100.57792951022613,-89.27780482487123,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle92',475.88919991865924,382.6135255057679,50,50,50,'red',0,47.41033650782175,-141.2369934694513,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle93',342.96329725702003,493.3802521279918,50,50,50,'blue',0,-25.523008850871026,-117.61697340750133,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle94',426.3451698414264,407.83298515559466,50,50,50,'red',0,-73.64861227962575,235.68072409236686,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle95',395.8623559381588,485.844356316297,50,50,50,'red',0,-40.64349904893395,189.539210088522,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle96',178.54475260129783,296.5972243025251,50,50,50,'red',0,37.89987058424998,-17.74170429059312,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle97',511.8097586207602,292.89385281406095,50,50,50,'red',0,61.906196011516116,99.26264689008921,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle98',683.7234429005424,257.89709698960394,50,50,50,'red',0,-93.69685653602848,-53.60669975794116,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle99',499.17659658295554,456.81780487846834,50,50,50,'red',0,69.85927708444335,44.0799786847003,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle100',140.49865459172494,392.81952920470013,50,50,50,'red',0,121.67634902866172,-128.0820537262452,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle101',289.1203805144823,248.00668336564928,50,50,50,'red',0,92.16845096153344,44.51267125647844,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle102',337.50356074775925,423.6531672018652,50,50,50,'red',0,-156.5471817114086,52.48765390959198,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle103',732.7887329437941,365.2106527863731,50,50,50,'red',0,86.02034903505137,161.52122106261433,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle104',449.01007093719846,458.6328294012629,50,50,50,'blue',0,-80.27017630945103,-130.94410370477092,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle105',225.62614359559785,269.4445316803958,50,50,50,'blue',0,-180.0734915336997,-70.4885120706337,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle106',460.16609351796444,303.947750612967,50,50,50,'blue',0,-41.13677261974043,38.85211914740893,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle107',223.31306810287504,382.2955124602744,50,50,50,'blue',0,63.05237772434234,-78.54841838376493,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle108',539.578061373351,400.2183135023165,50,50,50,'blue',0,-22.36974921972995,-56.14332603919032,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle109',280.91235572479076,415.16554362326025,50,50,50,'blue',0,34.717863828765935,6.87221726077259,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle110',86.55104618535134,402.2299953707729,50,50,50,'blue',0,-33.639984495555325,204.8622807510869,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle111',314.0806876205493,295.51772097382644,50,50,50,'blue',0,-275.3827081770963,66.55384639787573,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle112',177.83196519076643,436.1305750433043,50,50,50,'blue',0,83.82003065782399,147.06471422984592,0,0,true,false,0,true,1,1,'','balls/green.gif'); new entity(1,'savedcircle113',681.3504491653027,392.9537378524241,50,50,50,'blue',0,274.14522467110413,74.17676178349744,0,0,true,false,0,true,1,1,'','balls/green.gif'); wholeworld[16].charged=true; wholeworld[16].charge=-0.2; chargedobjects.push(wholeworld[16]); wholeworld[7].charged=true; wholeworld[7].charge=-0.2; chargedobjects.push(wholeworld[7]); wholeworld[18].charged=true; wholeworld[18].charge=-0.2; chargedobjects.push(wholeworld[18]); wholeworld[17].charged=true; wholeworld[17].charge=-0.2; chargedobjects.push(wholeworld[17]); wholeworld[23].charged=true; wholeworld[23].charge=-0.2; chargedobjects.push(wholeworld[23]); wholeworld[12].charged=true; wholeworld[12].charge=-0.2; chargedobjects.push(wholeworld[12]); wholeworld[19].charged=true; wholeworld[19].charge=-0.2; chargedobjects.push(wholeworld[19]); wholeworld[9].charged=true; wholeworld[9].charge=-0.2; chargedobjects.push(wholeworld[9]); wholeworld[6].charged=true; wholeworld[6].charge=-0.2; chargedobjects.push(wholeworld[6]); wholeworld[15].charged=true; wholeworld[15].charge=-0.2; chargedobjects.push(wholeworld[15]); wholeworld[8].charged=true; wholeworld[8].charge=0.2; chargedobjects.push(wholeworld[8]); wholeworld[4].charged=true; wholeworld[4].charge=0.2; chargedobjects.push(wholeworld[4]); wholeworld[13].charged=true; wholeworld[13].charge=0.2; chargedobjects.push(wholeworld[13]); wholeworld[14].charged=true; wholeworld[14].charge=0.2; chargedobjects.push(wholeworld[14]); wholeworld[5].charged=true; wholeworld[5].charge=0.2; chargedobjects.push(wholeworld[5]); wholeworld[10].charged=true; wholeworld[10].charge=0.2; chargedobjects.push(wholeworld[10]); wholeworld[11].charged=true; wholeworld[11].charge=0.2; chargedobjects.push(wholeworld[11]); wholeworld[20].charged=true; wholeworld[20].charge=0.2; chargedobjects.push(wholeworld[20]); wholeworld[21].charged=true; wholeworld[21].charge=0.2; chargedobjects.push(wholeworld[21]); wholeworld[22].charged=true; wholeworld[22].charge=0.2; chargedobjects.push(wholeworld[22]); wholeworld[33].charged=true; wholeworld[33].charge=0.2; chargedobjects.push(wholeworld[33]); wholeworld[27].charged=true; wholeworld[27].charge=0.2; chargedobjects.push(wholeworld[27]); wholeworld[32].charged=true; wholeworld[32].charge=0.2; chargedobjects.push(wholeworld[32]); wholeworld[28].charged=true; wholeworld[28].charge=0.2; chargedobjects.push(wholeworld[28]); wholeworld[24].charged=true; wholeworld[24].charge=0.2; chargedobjects.push(wholeworld[24]); wholeworld[25].charged=true; wholeworld[25].charge=0.2; chargedobjects.push(wholeworld[25]); wholeworld[31].charged=true; wholeworld[31].charge=0.2; chargedobjects.push(wholeworld[31]); wholeworld[29].charged=true; wholeworld[29].charge=0.2; chargedobjects.push(wholeworld[29]); wholeworld[26].charged=true; wholeworld[26].charge=0.2; chargedobjects.push(wholeworld[26]); wholeworld[30].charged=true; wholeworld[30].charge=0.2; chargedobjects.push(wholeworld[30]); wholeworld[34].charged=true; wholeworld[34].charge=-0.2; chargedobjects.push(wholeworld[34]); wholeworld[34].charged=true; wholeworld[34].charge=-0.2; chargedobjects.push(wholeworld[34]); wholeworld[37].charged=true; wholeworld[37].charge=-0.2; chargedobjects.push(wholeworld[37]); wholeworld[36].charged=true; wholeworld[36].charge=-0.2; chargedobjects.push(wholeworld[36]); wholeworld[35].charged=true; wholeworld[35].charge=-0.2; chargedobjects.push(wholeworld[35]); wholeworld[43].charged=true; wholeworld[43].charge=-0.2; chargedobjects.push(wholeworld[43]); wholeworld[38].charged=true; wholeworld[38].charge=-0.2; chargedobjects.push(wholeworld[38]); wholeworld[41].charged=true; wholeworld[41].charge=-0.2; chargedobjects.push(wholeworld[41]); wholeworld[39].charged=true; wholeworld[39].charge=-0.2; chargedobjects.push(wholeworld[39]); wholeworld[40].charged=true; wholeworld[40].charge=-0.2; chargedobjects.push(wholeworld[40]); wholeworld[42].charged=true; wholeworld[42].charge=-0.2; chargedobjects.push(wholeworld[42]); gravityY=200; friction=1; 
}
/*
function loadbettersusbridge()
{
new entity(1,'savedcircle40',784,320,10,10,50,'green',1,0,0,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle41',1,315,10,10,50,'green',1,0,0,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle42',673.9649414951053,538.9983648752321,10,10,50,'green',0,-5.746718387418521e-14,4.299048524595028e-13,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle43',622.5672225748133,538.9979636216576,10,10,50,'green',0,-4.1201940860258334e-16,-6.950771569737579e-16,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle44',570.277197971529,538.9968482375504,10,10,50,'green',0,-8.078481081651664e-17,1.8449878304839444e-16,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle45',519.0063310403594,538.998514796728,10,10,50,'green',0,5.324560984844926e-15,1.7432807240571527e-14,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle46',291.34728700318954,538.9922805243252,10,10,50,'green',0,-5.364258806084817e-17,1.1651091600536045e-16,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle47',239.81718693471709,538.999417043218,10,10,50,'green',0,-8.32550682155152e-17,-2.4246538177544996e-16,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle48',187.77972603486327,538.997834111006,10,10,50,'green',0,-1.4959528042020346e-17,1.7726297792136774e-16,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle49',136.25988450627145,538.9966372369176,10,10,50,'green',0,-1.1012148389939532e-16,3.9949913497260295e-16,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle50',620.897318228076,491.41675201089123,10,10,50,'green',0,-15.226482716238749,11.125858134913875,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle51',569.6828860468823,492.2710139487571,10,10,50,'green',0,-15.428050702554883,-2.180034330772177,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle52',618.7388869661025,444.75563435945963,10,10,50,'green',0,4.505590491409466,15.023973789284502,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle53',567.4609906832401,444.4468244907264,10,10,50,'green',0,14.428599328843754,1.5876401704984802,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle54',619.6289142544105,400.02324629535696,10,10,50,'green',0,28.005041683587816,-0.25059934474603507,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle55',567.0022382146088,399.6077448591757,10,10,50,'green',0,23.23172235139093,10.261432928131322,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle56',567.5283716148954,354.24812440163714,10,10,50,'green',0,-1.631647905835155,-8.159709830694736,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle57',619.7089036819414,354.0138103390681,10,10,50,'green',0,-12.45150412651827,-13.766395844010168,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle58',239.86724624976756,492.0987537908107,10,10,50,'green',0,-3.6619615108464005,-1.1770968901556205,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle59',188.24247750149908,492.5067552218729,10,10,50,'green',0,-1.1008745998662715,3.324051340352981,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle60',188.34934664187327,445.27761295942673,10,10,50,'green',0,-3.21162023574586,0.5344546208448835,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle61',239.35983481951732,444.50020041155807,10,10,50,'green',0,-2.3296923154119646,-1.722100315447009,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle62',187.03534224472818,400.3516579719353,10,10,50,'green',0,-4.413886765788111,0.8057199541042119,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle63',239.61604004137317,398.61623384337184,10,10,50,'green',0,-2.811706356868134,-0.4988387622062467,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle64',185.63081576067816,354.9582145923995,10,10,50,'green',0,-2.9009080077940412,-6.999937137871322,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle65',237.42877736054308,352.3867946463354,10,10,50,'green',0,-2.22692735879161,-3.5227793774158056,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle82',618.835942227552,306.5733530351685,10,10,50,'green',0,4.917303858451438,-17.062329192055152,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle83',567.7755113845419,307.48859721998843,10,10,50,'green',0,-4.316440598206897,-12.931140342601868,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle84',564.9253359588115,260.3910229518135,10,10,50,'green',0,-4.176774840916751,-0.31713249405258015,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle85',616.0643232644865,257.61177649057714,10,10,50,'green',0,-32.54829809966316,-13.316810479886238,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle86',612.2104021159514,209.2650694206931,10,10,50,'green',0,11.29298249409058,-6.980103933234211,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle87',560.5476698150505,212.80653280943108,10,10,50,'green',0,0.4954988456903866,23.60296455415147,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle88',235.1731604277903,305.3518971655708,10,10,50,'green',0,-4.518514458539034,4.651119956258484,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle89',183.33158260931506,307.7372497870183,10,10,50,'green',0,-7.116380758606523,4.441957913960017,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle90',181.71132533055635,259.7778642285846,10,10,50,'green',0,1.5873087995218886,1.9517956597965997,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle91',232.6434066138599,257.3267837125089,10,10,50,'green',0,0.17489399556500745,-0.9413336425816505,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle92',230.69658067756563,208.25100903080056,10,10,50,'green',0,-11.021841062387553,1.1280834648869125,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle93',180.42064604934868,210.48119138835636,10,10,50,'green',0,-1.9940019805228113,0.9256544216727626,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'stringball82',737.0625,321.6875,6,6,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');new entity(1,'stringball83',688.125,321.375,6,6,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');new entity(1,'stringball84',639.1875,321.0625,6,6,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');new entity(1,'stringball85',590.25,320.75,6,6,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');new entity(1,'stringball86',541.3125,320.4375,6,6,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');new entity(1,'stringball87',492.375,320.125,6,6,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');new entity(1,'stringball88',443.4375,319.8125,6,6,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');new entity(1,'stringball89',394.5,319.5,6,6,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');new entity(1,'stringball90',345.5625,319.1875,6,6,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');new entity(1,'stringball91',296.625,318.875,6,6,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');new entity(1,'stringball92',247.6875,318.5625,6,6,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');new entity(1,'stringball93',198.75,318.25,6,6,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');new entity(1,'stringball94',149.8125,317.9375,6,6,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');new entity(1,'stringball95',100.875,317.625,6,6,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');new entity(1,'stringball96',51.9375,317.3125,6,6,5,'black',0,0,0,0,0,true,false,0,true,1,0.95,'','tinyballs/red.gif');connect(7,8,8000,50,1,0,true);connect(6,7,8000,50,1,0,true);connect(7,14,8000,50,1,0,true);connect(14,15,8000,50,1,0,true);connect(8,15,8000,50,1,0,true);connect(8,9,8000,50,1,0,true);connect(15,17,8000,50,1,0,true);connect(17,19,8000,50,1,0,true);connect(19,20,8000,50,1,0,true);connect(20,21,8000,50,1,0,true);connect(18,21,8000,50,1,0,true);connect(16,18,8000,50,1,0,true);connect(14,16,8000,50,1,0,true);connect(16,17,8000,50,1,0,true);connect(18,19,8000,50,1,0,true);connect(10,11,8000,50,1,0,true);connect(11,12,8000,50,1,0,true);connect(12,13,8000,50,1,0,true);connect(12,23,8000,50,1,0,true);connect(11,22,8000,50,1,0,true);connect(22,23,8000,50,1,0,true);connect(24,25,8000,50,1,0,true);connect(22,25,8000,50,1,0,true);connect(23,24,8000,50,1,0,true);connect(26,27,8000,50,1,0,true);connect(25,27,8000,50,1,0,true);connect(24,26,8000,50,1,0,true);connect(28,29,8000,50,1,0,true);connect(27,29,8000,50,1,0,true);connect(26,28,8000,50,1,0,true);connect(9,15,8000,71,1,0,true);connect(7,15,8000,71,1,0,true);connect(6,14,8000,71,1,0,true);connect(14,17,8000,71,1,0,true);connect(16,19,8000,71,1,0,true);connect(18,20,8000,71,1,0,true);connect(19,21,8000,71,1,0,true);connect(17,18,8000,71,1,0,true);connect(15,16,8000,71,1,0,true);connect(8,14,8000,71,1,0,true);connect(10,22,8000,71,1,0,true);connect(22,24,8000,71,1,0,true);connect(24,27,8000,71,1,0,true);connect(27,28,8000,71,1,0,true);connect(26,29,8000,71,1,0,true);connect(25,26,8000,71,1,0,true);connect(23,25,8000,71,1,0,true);connect(11,23,8000,71,1,0,true);connect(12,22,8000,71,1,0,true);connect(13,23,8000,71,1,0,true);connect(6,16,8000,112,1,0,true);connect(9,17,8000,112,1,0,true);connect(10,25,8000,112,1,0,true);connect(13,24,8000,112,1,0,true);connect(21,30,8000,50,1,0,true);connect(30,31,8000,50,1,0,true);connect(20,31,8000,50,1,0,true);connect(31,32,8000,50,1,0,true);connect(32,33,8000,50,1,0,true);connect(30,33,8000,50,1,0,true);connect(33,34,8000,50,1,0,true);connect(34,35,8000,50,1,0,true);connect(32,35,8000,50,1,0,true);connect(29,36,8000,50,1,0,true);connect(36,37,8000,50,1,0,true);connect(28,37,8000,50,1,0,true);connect(37,38,8000,50,1,0,true);connect(38,39,8000,50,1,0,true);connect(36,39,8000,50,1,0,true);connect(39,40,8000,50,1,0,true);connect(40,41,8000,50,1,0,true);connect(38,41,8000,50,1,0,true);connect(20,30,8000,71,1,0,true);connect(30,32,8000,71,1,0,true);connect(32,34,8000,71,1,0,true);connect(33,35,8000,71,1,0,true);connect(31,33,8000,71,1,0,true);connect(21,31,8000,71,1,0,true);connect(29,37,8000,71,1,0,true);connect(37,39,8000,71,1,0,true);connect(36,38,8000,71,1,0,true);connect(38,40,8000,71,1,0,true);connect(39,41,8000,71,1,0,true);connect(28,36,8000,71,1,0,true);connect(4,42,5000,50,1,0,true);connect(42,43,5000,50,1,0,true);connect(43,44,5000,50,1,0,true);connect(44,45,5000,50,1,0,true);connect(45,46,5000,50,1,0,true);connect(46,47,5000,50,1,0,true);connect(47,48,5000,50,1,0,true);connect(48,49,5000,50,1,0,true);connect(49,50,5000,50,1,0,true);connect(50,51,5000,50,1,0,true);connect(51,52,5000,50,1,0,true);connect(52,53,5000,50,1,0,true);connect(53,54,5000,50,1,0,true);connect(54,55,5000,50,1,0,true);connect(55,56,5000,50,1,0,true);connect(5,56,5000,50,1,0,true);connect(4,34,2000,204,1,0,true);connect(34,42,2000,165,1,0,true);connect(34,43,2000,133,1,0,true);connect(34,44,2000,113,1,0,true);connect(34,45,2000,112,1,0,true);connect(35,45,2000,110,1,0,true);connect(35,46,2000,108,1,0,true);connect(35,47,2000,127,1,0,true);connect(35,48,2000,159,1,0,true);connect(40,52,2000,109,1,0,true);connect(40,53,2000,113,1,0,true);connect(40,51,2000,126,1,0,true);connect(40,50,2000,157,1,0,true);connect(40,49,2000,195,1,0,true);connect(35,49,2000,198,1,0,true);connect(41,54,2000,110,1,0,true);connect(41,53,2000,107,1,0,true);connect(41,55,2000,133,1,0,true);connect(41,56,2000,167,1,0,true);connect(5,41,2000,208,1,0,true);connect(35,50,2000,241,1,0,true);connect(40,48,2000,238,1,0,true);gravityY=200;friction=0.98;
}
*/

function loadluke()
{
new polygon(1,'savedpoly7',125.77142857142857,296.98571428571427,[-75.77142857142857,-75.77142857142857,-75.77142857142857,106.22857142857143,89.22857142857143,89.22857142857143,12.228571428571428,10.228571428571428,-7.771428571428572,-59.77142857142857,-66.77142857142857],[99.01428571428573,100.01428571428573,100.01428571428573,108.01428571428573,39.014285714285734,31.014285714285734,39.014285714285734,39.014285714285734,-160.98571428571427,-158.98571428571427,-157.98571428571427],100,'blue',1,0,0,0,0,0,0,true,true,true,1,1);
new polygon(1,'savedpoly8',356.8397435897436,286.8974358974359,[-69.83974358974359,97.16025641025641,79.16025641025641,78.16025641025641,30.16025641025641,28.16025641025641,40.16025641025641,40.16025641025641,40.16025641025641,37.16025641025641,35.16025641025641,21.16025641025641,16.16025641025641,-27.83974358974359,-31.83974358974359,-34.83974358974359,-34.83974358974359,-34.83974358974359,-77.83974358974359,-88.83974358974359,-88.83974358974359,-89.83974358974359,-89.83974358974359],[124.10256410256409,133.1025641025641,-108.89743589743591,-110.89743589743591,-108.89743589743591,-107.89743589743591,65.10256410256409,68.10256410256409,69.10256410256409,71.10256410256409,71.10256410256409,70.10256410256409,70.10256410256409,66.10256410256409,66.10256410256409,-112.89743589743591,-116.89743589743591,-116.89743589743591,-119.89743589743591,-117.89743589743591,-117.89743589743591,-117.89743589743591,-117.89743589743591],100,'blue',1,0,0,0,0,0,0,true,true,true,1,1);
new polygon(1,'savedpoly9',557.7575757575758,319.74747474747477,[-61.75757575757575,-61.75757575757575,-62.75757575757575,-22.75757575757575,-21.75757575757575,-21.75757575757575,-21.75757575757575,-22.75757575757575,-22.75757575757575,-22.75757575757575,66.24242424242425,68.24242424242425,94.24242424242425,97.24242424242425,6.242424242424249,3.2424242424242493,72.24242424242425,46.24242424242425,15.24242424242425,-21.75757575757575,-22.75757575757575,-22.75757575757575,-24.75757575757575,-37.75757575757575,-42.75757575757575,-42.75757575757575,-44.75757575757575,-69.75757575757575,-71.75757575757575,-75.75757575757575,-78.75757575757575,-78.75757575757575],[80.25252525252523,84.25252525252523,106.25252525252523,103.25252525252523,24.25252525252523,23.25252525252523,23.25252525252523,22.25252525252523,22.25252525252523,21.25252525252523,98.25252525252523,101.25252525252523,60.25252525252523,56.25252525252523,-9.747474747474769,-12.747474747474769,-107.74747474747477,-119.74747474747477,-131.74747474747477,-59.74747474747477,-58.74747474747477,-58.74747474747477,-54.74747474747477,-113.74747474747477,-123.74747474747477,-123.74747474747477,-123.74747474747477,-116.74747474747477,-116.74747474747477,-118.74747474747477,-118.74747474747477,-118.74747474747477],100,'blue',1,0,0,0,0,0,0,true,true,true,1,1);
new polygon(1,'savedpoly10',745.8543689320388,287.9514563106796,[47.145631067961176,28.145631067961176,12.145631067961176,5.145631067961176,-25.854368932038824,-28.854368932038824,-28.854368932038824,-29.854368932038824,-30.854368932038824,-32.854368932038824,-47.854368932038824,-52.854368932038824,-62.854368932038824,57.145631067961176,61.145631067961176,61.145631067961176,60.145631067961176,36.145631067961176,26.145631067961176,-10.854368932038824,-12.854368932038824,-9.854368932038824,39.145631067961176,38.145631067961176,36.145631067961176,16.145631067961176,-0.8543689320388239,-4.854368932038824,-6.854368932038824,-10.854368932038824,-8.854368932038824,43.145631067961176,49.145631067961176,49.145631067961176,49.145631067961176],[-97.95145631067959,-101.95145631067959,-103.95145631067959,-103.95145631067959,-105.95145631067959,-105.95145631067959,-105.95145631067959,-105.95145631067959,-105.95145631067959,-104.95145631067959,-103.95145631067959,-103.95145631067959,123.04854368932041,134.0485436893204,98.04854368932041,93.04854368932041,93.04854368932041,89.04854368932041,87.04854368932041,77.04854368932041,75.04854368932041,30.04854368932041,26.04854368932041,-8.951456310679589,-10.951456310679589,-9.951456310679589,-8.951456310679589,-9.951456310679589,-9.951456310679589,-11.951456310679589,-51.95145631067959,-52.95145631067959,-91.95145631067959,-95.95145631067959,-95.95145631067959],100,'blue',1,0,0,0,0,0,0,true,true,true,1,1);

new entity(1,'savedcircle11',500.0252872887477,146.5887374708698,50,50,50,'green',0,-55.08431268008162,51.87396087092262,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle12',616.6311980579814,291.8490379537722,50,50,50,'green',0,-122.91752200147361,25.597613190179178,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle13',437.7656847611041,134.5316193499998,50,50,50,'green',0,-26.273325502677523,-31.349737674137742,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle14',334.2638605878357,272.5931449417511,50,50,50,'green',0,54.176388872945786,32.58783522423376,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle16',223.28681113570437,245.91270759690838,50,50,50,'green',0,-50.436380123385,-3.960650021293182,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle18',232.81637471772493,362.7855642899789,50,50,50,'green',0,54.8361272207324,-29.692591747107308,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle19',172.12148085705476,474.6316819479864,50,50,50,'green',0,-55.03543933785133,231.14195474311677,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle20',229.5302254389306,298.00261481098045,50,50,50,'green',0,8.375393483660115,102.09933969999555,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle21',337.1941023985402,208.9047739171835,50,50,50,'green',0,28.166031711100192,102.23390753004222,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle22',616.5898355228458,128.32067235804723,50,50,50,'green',0,-31.932735389712423,76.88577995985821,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle23',715.7046613378586,116.64438212818325,50,50,50,'green',0,0.5064822363332652,50.119137166120765,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle25',303.4642102588857,415.5514988277456,50,50,50,'green',0,0.3139969330301263,-34.94296812707835,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle26',653.2234086604917,422.4043469109122,50,50,50,'green',0,-1.1375478714125649,-36.716125170086265,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedcircle27',445.3391899239903,424.9599480090296,50,50,50,'green',0,-3.5733043315270416,-36.00493067897305,0,0,true,false,0,true,1,0.95,'','balls/green.gif');new entity(1,'savedballoon28',651.5677026685171,315.14007581930605,50,50,5,'rgb(255,165,0)',0,5.642418039127871,-42.26007536516671,0,-6000,false,false,0,true,1,0.95,'','balls/orange.gif');new entity(1,'savedballoon29',439.0894349461569,317.28673714077865,50,50,5,'rgb(255,165,0)',0,22.48823773169041,-43.62678606881679,0,-6000,false,false,0,true,1,0.95,'','balls/orange.gif');new entity(1,'savedballoon30',304.7901331189672,306.53659722826615,50,50,5,'rgb(255,165,0)',0,-6.42148786683363,-44.94738207957549,0,-6000,false,false,0,true,1,0.95,'','balls/orange.gif');connect(21,23,1000,100,1,0,true);connect(22,24,1000,100,1,0,true);connect(20,25,1000,100,1,0,true);gravityY=200;friction=5;viewports[0].x=43;viewports[0].y=57;viewports[0].zoom=1;
}


function loadsquinkle()
{
new entity(1,'saved1',530.4731488871905,453.8307888615608,10,10,50,'rgb(255,165,0)',0,-9.280865178550753,-48.34114639390613,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'saved2',505.5702335672815,393.5177097295408,10,10,50,'rgb(255,165,0)',0,24.93259528903691,-49.041086734034906,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'saved3',470.48106303902586,457.1413487475639,10,10,50,'rgb(255,165,0)',0,5.032851711216787,-69.44045239051712,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'saved4',462.9740292204661,394.450372205075,10,10,50,'rgb(255,165,0)',0,71.85090627867508,53.21972187786416,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'saved5',427.61374933800846,458.0561756429667,10,10,50,'rgb(255,165,0)',0,-81.22669221028715,54.47958243677582,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'saved6',415.41126095194255,386.0849473911645,10,10,10,'rgb(255,165,0)',0,19.004617653663942,3.744703121777352,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'saved7',364.1101787791982,438.695662574203,10,10,10,'rgb(255,165,0)',0,9.456874574317162,-17.76070265424795,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'saved8',398.6259515608957,376.30696382037536,10,10,10,'rgb(255,165,0)',0,-0.03182587892066735,-18.56031588020938,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'saved9',330.40796771059433,382.88240030641987,10,10,10,'rgb(255,165,0)',0,5.4210706200061605,12.033579137832024,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'saved10',387.16942724420454,323.10469709843943,10,10,10,'rgb(255,165,0)',0,-31.64087238379907,-17.82808173409054,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'saved11',319.1863112958178,315.817082372226,10,10,10,'rgb(255,165,0)',0,-31.910253215434437,-3.9994509807475382,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'saved12',371.83103315203005,255.84591922363597,10,10,10,'rgb(255,165,0)',0,-5.5789406402488595,9.02941422506104,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'saved13',308.88657749499856,243.21975246550676,10,10,10,'rgb(255,165,0)',0,-1.1985780150456251,-10.354001793534227,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'saved14',341.6796293615796,164.92533615540344,10,10,10,'rgb(255,165,0)',0,42.90885661273234,5.6690005017312535,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'saved15',279.3086753043122,223.26147951359314,10,10,10,'rgb(255,165,0)',0,14.807802883554752,-11.68888757277158,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'saved16',268.9824100492984,149.73324860776677,10,10,10,'rgb(255,165,0)',0,54.974486630220504,-16.79844066365094,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'saved17',245.41728391375835,223.32129692852104,10,10,10,'rgb(255,165,0)',0,18.60836926405593,-27.79700312193536,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'saved18',214.25735564609207,161.74123188630796,10,10,10,'rgb(255,165,0)',0,41.74400679226211,-41.77112268737401,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'scircle2',467.56392382330324,259.8227401132451,30,30,50,'rgb(255,165,0)',0,1.6727374034809412,-33.86676268083735,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'scircle3',226.36624036404214,291.1879872552159,30,30,10,'rgb(255,165,0)',0,32.85199437882925,26.538795355215992,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'scircle4',456.9042087743786,518.2628500385831,30,30,50,'rgb(255,165,0)',0,-0.486228052419742,-13.054695099228507,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'scircle5',294.3641263588285,518.8998874902678,30,30,50,'rgb(255,165,0)',0,1.0302864721336042,1.0433470584916906,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'scircle6',270.5955157084476,38.72465742974691,50,50,10,'rgb(255,165,0)',0,90.98626420304409,-16.391636393865006,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'scircle7',132.31760060711812,73.49112947010663,50,50,10,'rgb(255,165,0)',0,76.53663425676814,-68.45469540739067,0,0,true,false,0,true,1,0.95,'','balls/orange.gif');
connect(5,6,10000,66,1,0,true);
connect(6,7,10000,71,1,0,true);
connect(7,8,10000,65,1,0,true);
connect(8,9,10000,72,1,0,true);
connect(9,10,10000,72,1,0,true);
connect(10,11,10000,73,1,0,true);
connect(11,12,10000,71,1,0,true);
connect(12,13,10000,68,1,0,true);
connect(13,14,10000,83,1,0,true);
connect(14,15,10000,68,1,0,true);
connect(15,16,10000,79,1,0,true);
connect(16,17,10000,64,1,0,true);
connect(17,18,10000,85,1,0,true);
connect(18,19,10000,85,1,0,true);
connect(19,20,10000,74,1,0,true);
connect(20,21,10000,77,1,0,true);
connect(21,22,10000,69,1,0,true);
connect(5,7,10000,59,0,0,true);
connect(7,9,10000,42,0,0,true);
connect(9,11,10000,67,0,0,true);
connect(11,13,10000,68,0,0,true);
connect(13,15,10000,72,0,0,true);
connect(15,17,10000,76,0,0,true);
connect(17,19,10000,37,0,0,true);
connect(19,21,10000,35,0,0,true);
connect(20,22,10000,56,0,0,true);
connect(18,20,10000,74,0,0,true);
connect(16,18,10000,96,0,0,true);
connect(14,16,10000,68,0,0,true);
connect(12,14,10000,53,0,0,true);
connect(10,12,10000,20,0,0,true);
connect(8,10,10000,48,0,0,true);
connect(6,8,10000,43,0,0,true);
connect(5,8,10000,93,0,0,true);
connect(7,10,10000,90,0,0,true);
connect(9,12,10000,86,0,0,true);
connect(11,14,10000,118,0,0,true);
connect(13,16,10000,135,0,0,true);
connect(15,18,10000,154,0,0,true);
connect(16,20,10000,103,0,0,true);
connect(19,22,10000,90,0,0,true);
connect(18,21,10000,112,0,0,true);
connect(16,19,10000,99,0,0,true);
connect(14,17,10000,114,0,0,true);
connect(12,15,10000,100,0,0,true);
connect(10,13,10000,85,0,0,true);
connect(8,11,10000,109,0,0,true);
connect(6,9,10000,98,0,0,true);
connect(5,25,10000,97,0,0,true);
connect(6,25,10000,140,0,0,true);
connect(7,25,10000,73,0,0,true);
connect(8,25,10000,138,0,0,true);
connect(9,25,10000,83,0,0,true);
connect(10,25,10000,153,0,0,true);
connect(9,26,10000,145,0,0,true);
connect(10,26,10000,181,0,0,true);
connect(11,26,10000,109,0,0,true);
connect(12,26,10000,179,0,0,true);
connect(13,26,10000,152,0,0,true);
connect(14,26,10000,223,0,0,true);
connect(27,28,10000,142,0,0,true);
connect(18,27,10000,118,0,0,true);
connect(17,27,10000,186,0,0,true);
connect(19,27,10000,165,0,0,true);
connect(20,27,10000,93,0,0,true);
connect(22,27,10000,128,0,0,true);
connect(21,27,10000,171,0,0,true);
connect(16,27,10000,213,0,0,true);
connect(18,28,10000,203,0,0,true);
connect(19,28,10000,218,0,0,true);
connect(20,28,10000,130,0,0,true);
connect(19,28,10000,182,0,0,true);
connect(22,28,10000,92,0,0,true);
connect(21,28,10000,159,0,0,true);
connect(18,23,1000,156,0,0,true);
connect(16,23,1000,108,0,0,true);
connect(14,23,1000,121,0,0,true);
connect(19,24,1000,84,0,0,true);
connect(17,24,1000,89,0,0,true);
connect(15,24,1000,89,0,0,true);
connect(25,27,5000,499,0,0,true);

gravityY=200;friction=0.995;
}