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
    
    this.equals=function(colour){
        return this.r==colour.r && this.g==colour.g && this.b==colour.b;
    }
}

/**
 *
 *http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
 *
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
Colour.hsvToRgb=function(h, s, v){
    var r, g, b;

    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);

    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    //return [r * 255, g * 255, b * 255];
    return new Colour(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}

Colour.getColourFromCanvas=function(x,y,canvas){
    //http://stackoverflow.com/questions/667045/getpixel-from-html-canvas
    var data = canvas.getImageData(x, y, 1, 1).data;
    return new Colour([data[0], data[1], data[2]]);
}