function loadlevel()
{
new hutch(0,5,[0],[false],[false],2,3,20); 
new hutch(6,0,[2],[false],[false],6,3,20); 
new warren(5,0,3,1); 
new warren(6,1,3,1); 
new warren(0,4,3,3); 
new warren(1,5,3,3); 
new repaint(6,2,3,0); 
new repaint(4,0,3,0); 
new repaint(2,5,3,2); 
new repaint(0,3,3,2); 
new gate(5,1,1,0,0); 
new gate(1,4,1,2,0); 
new repaint(5,4,3,1); 
new repaint(1,1,3,3); 
gridcols=7;gridrows=6;gridsize=90;gridsides=4;
new tool(0,0,15); 
rabbitsWillWait=false;


}
loadlevel();
finishloading();