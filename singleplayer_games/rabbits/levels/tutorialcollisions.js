function loadtutorial3()
{
//levelmessage("<b>Tutorial 3 - Collision Course</b><br><br>The rabbits are so excited that they've got out of their hutches that they don't properly check where they're going - which means they can get hurt if they <b>bump into each other</b>.  Use the arrows to direct the bunnies so they they don't collide with each other on their way to the burrows.");

new hutch(2,0,[0],[0],[false],6,2,10); 
new hutch(3,3,[2],[2],[false],0,2,10); 
new warren(0,3,1,2); 
new warren(2,4,1,0); 
gridcols=6;gridrows=6;gridsize=100;gridsides=4;
new tool(0,3,5); 

}
loadtutorial3();
finishloading();