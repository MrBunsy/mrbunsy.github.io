/* 
 * Copyright Luke Wallin 2012
 */


var Triangle = function(a,b,c,colour){
    this.vertices = [a,b,c];
    
    var u=b.subtract(a);
    var v=c.subtract(a);
    
    this.n = u.cross(v).getUnit();
    
    this.centre = a.add(u.multiply(0.5)).add(v.multiply(0.5));
    
    this.colour=colour;
    
    //     a------u----->b
    //       \
    //        \   p
    //         v
    //          \|
    //           c
    
    //idea - colour points in direction of u cross v?  like in the raytracer?
    
    this.getTriangles=function(){
        return [this];
    }
    
    this.getCentre=function(){
        return this.centre;
    }
    
    this.thisIsInside=function(centre){
        
        var thisWay=this.vertices[0].subtract(centre);
        
        if(thisWay.dot(this.n)<0){
            this.n=this.n.multiply(-1.0);
        }

    }
    
    this.getColour = function(){
        return this.colour;
    }
    
    this.rotate=function(axis,angle){
        for(var i=0;i<this.vertices.length;i++){
            this.vertices[i]=this.vertices[i].rotateByAxis(axis, angle);
        }
    }
}

Triangle.order=function(cameraPos){
    
    return function(a,b){
        //instead of using the centre of the triangle, use the furthest away point.  more intensive, but also more reliable
        //adding the centre as well to clear up few more glicthes
        var As = a.vertices.slice(0);
        var Bs = b.vertices.slice(0)
        
        As.push(a.centre);
        Bs.push(b.centre);
        
        As.sort(Vector.order(cameraPos));
        Bs.sort(Vector.order(cameraPos));
        
        var A = As[0].subtract(cameraPos).getMagnitudeSqrd();
        var B = Bs[0].subtract(cameraPos).getMagnitudeSqrd();
        return ((A > B) ? -1 : (A < B) ? +1 : 0);
    }
    
}
