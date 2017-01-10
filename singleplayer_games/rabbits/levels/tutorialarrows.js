function loadtutorial1()
{
//levelmessage("<b>Tutorial 1 - Arrows</b><br><br>Welcome to the tutorial!  This is a series of very simple puzzles, each demonstrating a new game mechanic.  Once you have completed all the tutorial levels, you will have been introduced to the basics of the entire game.<br><br>The square in the top left is a <b>hutch</b>. Rabbits will leave the hutch in the direction of the arrow.  Your aim is to get all of these rabbits into their <b>burrow</b>, which is the circle at the bottom right of the screen.<br><br>If you press <b>'Open Toolbox'</b> you will be show a list of arrows you can place on the map.  Click on one of these arrows to select it, then click on the map to place it.  When a rabbit walks over an arrow, it will walk in the direction the arrow faces.  To <b>change the direction of an arrow</b>, click near the edge of the arrow.  To <b>move an arrow</b>, click near the centre and drag it to another tile.  You can put an arrow back in your toolbox by dragging it off the green map.<br><br>To start the rabbits moving, press the <b>Play</b> button.  To speed them up, hold down <b>Fast Forward</b>.  You can reset the bunnies by pressting <b>Reset Bunnies</b>.");

new hutch(0,0,[false],[false],[false],4,2,20); 
new warren(4,4,0,false); 
new block(3,2,0); 
new block(4,2,0); 
new block(1,2,0); 
new block(0,2,0); 
gridcols=5;gridrows=5;gridsize=120;gridsides=4;
new tool(0,0,5); 
rabbitsWillWait=true;

}
loadtutorial1();
finishloading();