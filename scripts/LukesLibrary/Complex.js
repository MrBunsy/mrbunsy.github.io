/* 
 * Copyright Luke Wallin 2012
 * 
 * Not a full implementation - it's just enough for me to make the Fractal
 */

//imaginary numbers
//z = x + jy
var Complex = function(x,y){
    this.x=x;
    this.y=y;
    
    this.add=function(a){
        return new Complex(this.x+a.x,this.y+a.y);
    }
    
    this.subtract=function(a){
        return new Complex(this.x-a.x,this.y-a.y);
    }
    
    this.multiply=function(a){
        return new Complex(this.x*a.x - this.y*a.y, this.x*a.y + this.y*a.x);
    }
    
    this.multiplyScalar=function(a){
        return new Complex(this.x*a, this.y*a);
    }
    
    this.square = function(){
        return new Complex(this.x*this.x - this.y*this.y, 2*this.x*this.y);
    }
    
    this.magnitude = function(){
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    
    this.magnitudeSqrd = function(){
        return this.x*this.x + this.y*this.y;
    }
    
    this.toString=function(){
        return "("+Math.round(this.x*100.0)/100.0+","+Math.round(this.y*100.0)/100.0+")";
    }
}