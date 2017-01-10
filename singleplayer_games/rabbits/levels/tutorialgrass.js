function loadlevel()
{

new block(0,2,0); 
new block(1,2,0); 
new block(3,2,0); 
new block(4,2,0); 
new grass(2,1); 
new hutch(0,1,[false],[false],[false],4,2,20); 
new warren(3,4,0,0); 
new grass(2,2); 
gridcols=5;gridrows=5;gridsize=120;gridsides=4;
new tool(0,0,4); 
rabbitsWillWait=true;

}
loadlevel();
finishloading();