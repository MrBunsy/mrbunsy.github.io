function loadtutorial6()
{
levelmessage("<b>Tutorial 6 - Carrying Things</b><br><br>Some bunnies will <b>carry objects</b> with them.  They can carry <b>carrots</b>, <b>teddy bears</b>, <b>lettuces</b> and <b>books</b>.  Similar to colours, some <b>gates</b> will only let bunnies through if they are carrying a certain object - the one drawn on the gate.<br><br>Use your <b>teddy arrow</b> to sort the bunnies so the right ones can pass through the correct gates.");

new gate(2,3,1,0,0); 
new gate(4,3,3,1,0); 
new block(3,3,0); 
new block(1,3,0); 
new block(0,3,0); 
new block(5,3,0); 
new block(6,3,0); 
new hutch(3,0,[0,1],[false],[false,1],6,2,20); 
new warren(3,6,0,false); 
gridcols=7;gridrows=7;gridsize=80;gridsides=4;
new tool(3,1,1); 
new tool(0,1,8); 


}
loadtutorial6();
finishloading();