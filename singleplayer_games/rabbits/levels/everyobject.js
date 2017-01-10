function loadeveryobject()
{
new hutch(0,1,[false],[false],[false],4,2,20); 
new warren(0,2,0,false); 
new warren(1,2,1,0); 
new warren(2,2,2,0); 
new warren(3,2,3,0); 
new arrow(0,3,0,0,0,false,true); 
new arrow(1,3,0,1,1,false,true); 
new arrow(2,3,0,2,1,false,true); 
new arrow(3,3,0,3,1,false,true); 
new block(0,6,0); 
new lock(0,7,1); 
new key(1,7,false,0); 
new lock(2,7,1); 
entities[entities.length-1].open=true;
new key(3,7,false,1); 
entities[entities.length-1].used=true;
new arrow(0,4,0,0,2,true,true); 
new arrow(1,4,0,1,2,true,true); 
new arrow(2,4,0,2,2,true,true); 
new arrow(3,4,0,3,2,true,true); 
new gate(1,5,1,2,1); 
new gate(2,5,2,2,0); 
new gate(3,5,3,2,1); 
new gate(0,5,1,2,0); 
gridcols=4;gridrows=10;gridsize=60;gridsides=4;
}
loadeveryobject();
loadhelp();