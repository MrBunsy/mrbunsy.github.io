function loadlevel()
{
new gate(4,1,1,0,0); 
new gate(3,2,1,1,0); 
new gate(5,2,1,1,0); 
new gate(3,4,1,3,0); 
new gate(5,4,1,3,0); 
new gate(4,5,1,0,0); 
new repaint(4,2,3,3); 
new repaint(3,3,3,0); 
new repaint(5,3,3,1); 
new repaint(4,4,3,2); 
new gate(6,3,1,2,0); 
new gate(4,3,1,2,0); 
new gate(2,3,1,2,0); 
new warren(4,7,3,2); 
new gate(8,3,3,1,0); 
new gate(8,5,3,1,0); 
new repaint(8,4,1,3); 
new hutch(8,0,[1],[false],[false],0,2,20); 
new gate(0,3,3,3,0); 
new gate(0,5,3,3,0); 
new repaint(0,4,1,2); 
gridcols=9;gridrows=8;gridsize=60;gridsides=4;
new tool(0,0,14); 


}
loadlevel();
finishloading();