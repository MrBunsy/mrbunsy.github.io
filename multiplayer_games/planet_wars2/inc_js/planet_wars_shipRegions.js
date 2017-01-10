//subsection of planet_wars.js - defines all the regions which ships can spawn
//can use all of the planet_wars object as it will be loaded after planet_wars.js 

//regions go anti clockwise around the edge of the map, idea is one is chosen randomly then the ships are placed as far apart as possible (as if the regions were in a circle)

planet_wars.buildShipRegions=function()
{
  //planet_wars.shipRegion=function(pos,r)
  
  //clear old ones first
  planet_wars.shipRegions=new Array();
  
  //shortcuts:
  
  var h=planet_wars.worldHeight;
  var w=planet_wars.worldWidth;


  //top left
  new planet_wars.shipRegion([w/8 , h/8] , w/16 , 2 , 0);
  //mid left
  new planet_wars.shipRegion([w/8 , h/2] , w/16 , 2 , 0);
  //bottom left
  new planet_wars.shipRegion([w/8 , 7*h/8] , w/16 , 2 , 0);
  
  //bottom part left
  new planet_wars.shipRegion([w/3 , 7*h/8] , w/16 , 2 , 0);
  //mid bottom
  new planet_wars.shipRegion([w/2 , 7*h/8] , w/16 , 2 , 0);
  //bottom part right
  new planet_wars.shipRegion([2*w/3 , 7*h/8] , w/16 , 2 , 0);
  
  //bottom right
  new planet_wars.shipRegion([7*w/8 , 7*h/8] , w/16 , 2 , 1);
  //mid right
  new planet_wars.shipRegion([7*w/8 , h/2] , w/16 , 2 , 1);
  //top right
  new planet_wars.shipRegion([7*w/8 , h/8] , w/16 , 2 , 1);
  
  //top part right
  new planet_wars.shipRegion([2*w/3 , h/8] , w/16 , 2 , 0);
  //mid top
  new planet_wars.shipRegion([w/2 , h/8] , w/16 , 2 , 0);
  //top part left
  new planet_wars.shipRegion([w/3 , h/8] , w/16 , 2 , 0);
  
}