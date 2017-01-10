/* 
 * Copyright Luke Wallin 2012
 */

var Light = function(pos,intensity){
    this.pos=pos;
    this.intensity=intensity;
    
    this.lightAt=function(pos){
        var distance2=pos.subtract(pos).getMagnitudeSqrd();

        if(distance==0){
            distance=1;
        }
        //1/r^2
        return this.intensity/distance2;
    }
    
    this.lightAtDistance=function(distance){
         return this.intensity/Math.pow(distance,2);
    }
    //uses distance^2, which might likely already exist
    this.lightAtDistanceSqrd=function(distance2){
         return this.intensity/distance2;
    }
}
