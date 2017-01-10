/* 
 * Copyright Luke Wallin 2012, with stuff from:
 * 
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license Use it if you like it
 */



var Colour = function(r,g,b){

    this.r=r;
    this.g=g;
    this.b=b;

    // validate/cleanup values
    this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
    this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
    this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);

    // some getters
    this.toRGB = function () {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
    }
    this.toHex = function () {
        var r = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);
        if (r.length == 1) r = '0' + r;
        if (g.length == 1) g = '0' + g;
        if (b.length == 1) b = '0' + b;
        return '#' + r + g + b;
    }
    
    //dim:0-1
    this.dim=function(dim){
        return new Colour(Math.round(r*dim),Math.round(g*dim) ,Math.round(b*dim) );
    }

    //bit of a hack to deal with colour light on an object
    this.multiply=function(colour){
        var timesr = colour.r/255.0;
        var timesg = colour.g/255.0;
        var timesb = colour.b/255.0;
        
        return new Colour(Math.round(r*timesr) ,Math.round(g*timesg),Math.round(b*timesb));
    }
    
    this.add=function(colour){
        return new Colour(r+colour.r,g+colour.g,b+colour.b);
    }
}