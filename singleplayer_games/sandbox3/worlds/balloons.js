function loadballoons()
{
new entity(1,'blob1',381.7239973373884,421.4860497908423,50,50,50,'green',0,-2.573751914812953,-52.01705921184487,0,0,true,false,0,true,1,0.95,'','balls/green.gif');
new entity(1,'blobballoon1',370,313.190454437746,50,50,5,'rgb(255,165,0)',0,4.07947689693688,-54.69999782342896,0,-3500,false,false,0,true,1,0.95,'','balls/orange.gif');
new entity(1,'blobballoon2',395,313.29778626542435,50,50,5,'rgb(255,165,0)',0,2.524739107613881,-53.859006943890336,0,-3500,false,false,0,true,1,0.95,'','balls/orange.gif');
connect(5,6,1000,100,1,0,true);
connect(5,7,1000,100,1,0,true);
gravityY=200;
friction=0.995;
document.getElementById('smallworld').checked=false;
}
loadballoons();
finishloading();
