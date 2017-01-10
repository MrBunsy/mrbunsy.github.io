/* 
 * Copyright Luke Wallin 2012
 * 
 * 
 * used like a struct
 */

//smaller scale means the animation runs slower
//period is how long before it repeats
//phase is where in this period it is at teht start
//pos is relative to the vehicle its attached to
var VehicleAnimation=function(graphic,period,scale,phase,size,pos){
    
    this.graphic=graphic;
    this.size=size;
    
    this.scale=scale;
    this.period=period;
    this.phase=phase;
    
    this.pos=pos;
    
    //"rotate"
    //this.type=type;
    
//    this.draw=function(ctx,pos,time){
//        this.graphic(ctx,this.size,(time*this.scale)%this.period);
//    }
}