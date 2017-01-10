/*
this file creates all the level object so that the game can access them easily
*/
//new levelGroup(name,description,endmessage,leadto,onlist)
new levelGroup('Tutorial','These levels teach you how to play.','<b>Well done!<\/b>  You have finished the tutorial, you should now be ready to have a go at some of the easy and medium levels.',true,true);
new levelGroup('User Submitted','Levels submitted by users','Thanks to everyone who contributed!',false,true)
new levelGroup('Easy','A few easy to solve levels to get you started','<b>Well done!<\/b>  You\'ve mastered the easy levels, for something a bit more challenging, try the medium levels.',false,true);
new levelGroup('Medium','Mastered easy?  Want something a bit harder?  Give these ago.','You\'ve completed all the medium levels!  Fancy a shot at some hard ones?',false,true);
new levelGroup('Hard','Mastered Medium as well? These are even more difficult.','Wow, you completed all the hard levels, <b>very well done!</b>',false,true);
new levelGroup('Odds and Sods','Various levels of varying difficulty','',false,false);

//new level(name,description,file,group)
//tutorials:
new level('Tutorial 1 - Arrows',"<b>Tutorial 1 - Arrows</b><br><br>Welcome to the tutorial!  This is a series of very simple puzzles, each demonstrating a new game mechanic.  Once you have completed all the tutorial levels, you will have been introduced to the basics of the entire game.<br><br>The square in the top left is a <b>hutch</b>. Rabbits will leave the hutch in the direction of the arrow.  Your aim is to get all of these rabbits into their <b>burrow</b>, which is the circle at the bottom right of the screen.<br><br>If you press <b>'Open Toolbox'</b> you will be shown a list of arrows you can place on the map.  Click on one of these arrows to select it, then click on the map to place it.  When a rabbit walks over an arrow, it will walk in the direction the arrow faces.  To <b>change the direction of an arrow</b>, click near the edge of the arrow.  To <b>move an arrow</b>, click near the centre and drag it to another tile.  You can put an arrow back in your toolbox by dragging it off the green map.<br><br>To start the rabbits moving, press the <b>Play</b> button.  To speed them up, hold down <b>Fast Forward</b>.  You can reset the bunnies by pressting <b>Reset Bunnies</b>.",'tutorialarrows',0);
new level('Tutorial 2 - Locks and Keys',"<b>Tutorial 2 - Locks and Keys</b><br><br>Surrounding the warren there are <b>locks</b> which will only let bunnies through once they have been opened.  To open a lock, bunnies must walk over the top of all the the <b>keys</b> linked to that lock.  Use your arrows to direct the bunnies over the key and through the lock.",'tutoriallocks',0);
new level('Tutorial 3 - Grass',"<b>Tutorial 3 - Grass</b><br><br>Some tiles are overgrown with <b>grass</b>.  The bunnies can still walk over these tiles, but you <b>can't place arrows</b> on the grass.<br><br>Direct the rabbits to the warren, using your arrows carefully.",'tutorialgrass',0);
new level('Tutorial 4 - Colours',"<b>Tutorial 4 - Colour</b><br><br>Some rabbits are different colours to other rabbits.  A <b>coloured burrow</b> (the coloured circles  near the middle) will only take that colour of rabbit.  <b>Coloured arrows</b> (check your toolbox) will direct only that colour of rabbit.  Normal arrows will direct all and any rabbits.<br><br>Bunnies which can't enter a burrow can still <b>walk over the top</b> of it.",'tutorialcolours',0);
new level('Tutorial 5 - Collisions',"<b>Tutorial 5 - Collision Course</b><br><br>On some levels the rabbits don't properly check where they're going - which means they can get hurt if they <b>bump into each other</b>.  Use the arrows to direct the bunnies so they they don't collide with each other on their way to the burrows.",'tutorialcollisions',0);
new level('Tutorial 6 - Gates',"<b>Tutorial 6 - Gates</b><br><br>The coloured circles with crosses and ticks are <b>gates</b>.  A gate with a <b>tick</b> will let <b>only</b> that colour through, whereas a gate with a <b>cross</b> will let anything <b>except</b> that colour through.<br><br>  Use your <b>red arrow</b> to sort the rabbits so that they will go through the correct gate.",'tutorialgates',0);
new level('Tutorial 7 - Carrying Things',"<b>Tutorial 7 - Carrying Things</b><br><br>Some bunnies will <b>carry objects</b> with them.  They can carry <b>carrots</b>, <b>teddy bears</b>, <b>lettuces</b> and <b>books</b>.  Similar to colours, some <b>gates</b> will only let bunnies through if they are carrying a certain object - the one drawn on the gate.<br><br>Use your <b>teddy arrow</b> to sort the bunnies so the right ones can pass through the correct gates.",'tutorialcarrying',0);
new level('Tutorial 8 - Re-Supplies',"<b>Tutorial 8 - Re-Supply Tiles</b><br><br>In the gap in the blocks there is a <b>gate</b> which will only let through bunnies carrying a teddy bear.  The bunnies must get past this gate to get to their warren, but none of the bunnies coming out of the hutch are carrying teddy bears.<br><br>  To solve this problem you must direct the bunnies over the <b>re-supply tile</b> (the brightly coloured square with a teddy on top).  This tile will supply all bunnies which go over it with a teddy bear, which means they will be able to get through the gate!",'tutorialresupply',0);

//user-submitted:
new level("Jennifer's Colourful Level","Level made by Jennifer Wallin",'jenscolourfullevel',1);

//easy:
new level('Easy Gate Fun 1',false,'gatefun2',2);
new level('Easy Gate Fun 2',false,'gatefun3b',2);

new level('Easy Colours 1',false,'easycolours1',2);
new level('Easy Colours 2',false,'easycolours2',2);
//new level('Easy Weave 1',false,'easyweave1',2);



//medium:
new level('Colour Weave 1',false,'colourweave1',3);
new level('Colour Weave 2',false,'colourweave2',3);
new level('Arrow Weave 1',false,'arrowweave1',3);
new level('Crazy Timing 1',false,'hardtiming1',3);
new level('Gate Fun 1',false,'gatefun1',3);
new level('Gate Fun 2',false,'gatefun4',3);
new level('Gate and Paint 1',false,'gateandpaint1',3);
new level('Gate and Paint 2',false,'gateandpaint2',3);
new level('Gate and Paint 3',false,'gateandpaint3',3);
new level('Lock Labyrinth 1',false,'lockfun1',3);
new level('Lock Labyrinth 2','Tip: You can move the arrows any time you want - even when the bunnies are out of the hutch.','lockfun2',3);
new level('Grass and Arrows 1',false,'grassandarrows1',3);


//hard:
new level('Paints, Gates and Keys',false,'paintgatekeys1',4);
new level('Gates and Keys',false,'gatesandkeys1',4);
new level('Hard Arrow Weave 1',false,'hardarrowweave1',4);
