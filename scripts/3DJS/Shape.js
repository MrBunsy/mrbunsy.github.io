/* 
 * Copyright Luke Wallin 2012
 */


//note - this doesn't mean anyhting in javascript, just used by me to keep track of things

var Shape = function(){
    
    this.getCentre=function(){
        
    }
    
    this.getTriangles=function(){
        return [];
    }
    
    this.rotate=function(axis,angle){
        for(var i=0;i<this.triangles.length;i++){
            this.triangles[i].thisIsInside(this.pos);
        }
    }
}


//static method I suppose?
//Shape.getTriangles
Shape.order=function(cameraPos){
    
    return function(a,b){
        //instead of using the centre of the triangle, use the furthest away point.  more intensive, but also more reliable
        //adding the centre as well to clear up few more glicthes
        var A = a.getCentre().subtract(cameraPos).getMagnitudeSqrd();
        //alert(b.toSource(1));
        var B = b.getCentre().subtract(cameraPos).getMagnitudeSqrd();//getCentre()

        return ((A > B) ? -1 : (A < B) ? +1 : 0);
    }
    
}