function loadlevel()
{
//THIS PUZZLE WILL NOT WORK UNLESS RABBITS CAN WAIT FOR ONE ANOTHER.
new warren(8,3,0,false); 
new lock(7,3,4); 
new key(12,4,false,0); 
new key(5,3,false,0); 
new key(4,5,false,0); 
new key(10,8,false,0); 
new gate(5,4,1,3,0); 
new gate(4,6,1,3,0); 
new gate(3,5,1,3,0); 
new gate(12,5,1,3,0); 
new gate(13,4,1,1,0); 
new gate(11,4,1,1,0); 
new gate(4,3,1,1,0); 
new gate(6,2,3,1,0); 
new gate(10,9,3,1,1); 
new gate(9,7,3,1,1); 
new gate(9,9,1,1,1); 
new gate(10,7,1,1,1); 
new gate(11,5,3,3,1); 
new gate(12,3,3,3,1); 
new gate(11,3,3,0,1); 
new gate(5,6,3,0,0); 
new gate(4,4,3,0,0); 
new gate(6,4,3,3,1); 
new gate(5,2,3,3,1); 
new gate(5,5,3,3,1); 
new gate(11,8,1,3,1); 
new gate(9,8,1,0,1); 
new gate(6,3,1,0,0); 
new block(2,13,0); 
new block(1,12,0); 
new block(1,11,0); 
new block(1,8,0); 
new block(7,9,0); 
new block(6,8,0); 
new block(1,4,0); 
new block(3,2,0); 
new block(2,1,0); 
new block(3,0,0); 
new block(1,0,0); 
new block(12,0,0); 
new block(14,7,0); 
new block(12,12,0); 
new block(12,14,0); 
new hutch(6,14,[3,1,2],[false],[0,1,2,3,1],1,2,20); 
new fakelock(8,2,0); 
new fakelock(9,2,0); 
new fakelock(9,3,0); 
new fakelock(9,4,0); 
new fakelock(8,4,0); 
gridcols=15;gridrows=15;gridsize=25;gridsides=6;
new tool(0,0,9); 
new tool(3,1,1); 
new tool(3,2,1); 
new tool(1,3,1); 
new tool(1,2,1); 
rabbitsWillWait=true;



}
loadlevel();
finishloading();