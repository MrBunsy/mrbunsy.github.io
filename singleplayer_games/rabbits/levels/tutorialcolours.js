function loadtutorial2()
{
//levelmessage("<b>Tutorial 2 - Colour</b><br><br>Some rabbits are different colours to other rabbits.  A <b>coloured burrow</b> (the coloured circles  near the middle) will only take that colour of rabbit.  <b>Coloured arrows</b> (check your toolbox) will direct only that colour of rabbit.  Normal arrows will direct all and any rabbits.<br><br>Bunnies which can't enter a burrow can still <b>walk over the top</b> of it.");

new hutch(0,2,[0,3],[0,3],[false],4,2,20); 
new warren(2,2,1,0); 
new warren(3,3,1,3); 
gridcols=6;gridrows=6;gridsize=100;gridsides=4;
new tool(0,0,2); 
new tool(1,0,2); 
new tool(1,3,2); 
rabbitsWillWait=true;

}
loadtutorial2();
finishloading();