function loadtutorial5()
{
//levelmessage("<b>Tutorial 5 - Gates</b><br><br>The coloured circles with crosses and ticks are <b>gates</b>.  A gate with a <b>tick</b> will let <b>only</b> that colour through, whereas a gate with a <b>cross</b> will let anything <b>except</b> that colour through.<br><br>  Use your <b>red arrow</b> to sort the rabbits so that they will go through the correct gate.");

new hutch(3,6,[0,1,2],[0,1,2],[false],2,2,20); 
new block(0,3,0); 
new block(1,3,0); 
new block(3,3,0); 
new block(4,3,0); 
new block(6,3,0); 
new warren(4,1,0,false); 
new gate(2,3,1,0,1); 
new gate(5,3,1,0,0); 
gridcols=7;gridrows=7;gridsize=80;gridsides=4;
new tool(0,3,8); 
new tool(1,0,1);  


}
loadtutorial5();
finishloading();