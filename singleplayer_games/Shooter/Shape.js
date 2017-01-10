/* 
 * Copyright Luke Wallin 2012
 * 
 * Used for collision detection
 * like a very cut-down version of my 2D engine's collision detection system
 */


var Shape=function(type,r,h){
    //0 = circle, 1 = rectangle
    this.type=type;
    //radius for the circle, width for a rectangle
    this.r=r;
    //height, not used for circle
    this.h=h;
}