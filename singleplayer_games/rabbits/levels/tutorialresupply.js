function loadtutorial6()
{
//levelmessage("<b>Tutorial 6 - Re-Supply Tiles</b><br><br>In the gap in the blocks there is a <b>gate</b> which will only let through bunnies carrying a teddy bear.  The bunnies must get past this gate to get to their warren, but none of the bunnies coming out of the hutch are carrying teddy bears.<br><br>  To solve this problem you must direct the bunnies over the <b>re-supply tile</b> (the brightly coloured square with a teddy on top).  This tile will supply all bunnies which go over it with a teddy bear, which means they will be able to get through the gate!");

new block(0,3,0); 
new block(1,3,0); 
new block(3,3,0); 
new block(4,3,0); 
new block(5,3,0); 
new warren(2,5,0,false); 
new gate(2,3,3,1,0); 
new hutch(5,0,[0,2,3],[false],[false],0,2,20); 
new repaint(2,1,3,1); 
gridcols=6;gridrows=6;gridsize=100;gridsides=4;
new tool(0,0,5); 



}
loadtutorial6();
finishloading();