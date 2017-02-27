/* 
 * Copyright Luke Wallin 2012, with stuff from:
 * 
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license Use it if you like it
 */



var Colour = function(r,g,b,a){

    this.r=r;
    this.g=g;
    this.b=b;
    //alpha, if not given assume solid colour
    this.a = typeof(a) == "undefined" ? 1 : a;

    // validate/cleanup values
    this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
    this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
    this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);
    this.a = (this.a < 0 || isNaN(this.a)) ? 0 : ((this.a > 1) ? 1 : this.a);
    
    this.FACTOR=0.7;
    
    // some getters
    this.toRGB = function () {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
        //return this.toRGBA(this.a);
    }
    
    this.toRGBA=function(a){
        return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ','+ a +')';
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
    /**
     * PORTED FROM JAVA LIBRARY
     *
     * Creates a new <code>Color</code> that is a brighter version of this
     * <code>Color</code>.
     * <p>
     * This method applies an arbitrary scale factor to each of the three RGB 
     * components of this <code>Color</code> to create a brighter version
     * of this <code>Color</code>. Although <code>brighter</code> and
     * <code>darker</code> are inverse operations, the results of a
     * series of invocations of these two methods might be inconsistent
     * because of rounding errors. 
     * @return     a new <code>Color</code> object that is  
     *                 a brighter version of this <code>Color</code>.
     * @see        java.awt.Color#darker
     * @since      JDK1.0
     */
    this.brighter=function() {
        var r = Math.round(this.r);
        var g = Math.round(this.g);
        var b = Math.round(this.b);

        /* From 2D group:
         * 1. black.brighter() should return grey
         * 2. applying brighter to blue will always return blue, brighter
         * 3. non pure color (non zero rgb) will eventually return white
         */
        var i = Math.round(1.0/(1.0-this.FACTOR));
        if ( r == 0 && g == 0 && b == 0) {
           return new Colour(i, i, i);
        }
        if ( r > 0 && r < i ) r = i;
        if ( g > 0 && g < i ) g = i;
        if ( b > 0 && b < i ) b = i;

        return new Colour(Math.min(Math.round(r/this.FACTOR), 255),
                         Math.min(Math.round(g/this.FACTOR), 255),
                         Math.min(Math.round(b/this.FACTOR), 255));
    }
    
    this.paler=function(){
        //not sure if HSB and HSV are equivilant
        //looks like they are
        var hsb = Colour.RGBtoHSB(this.r, this.g, this.b);
        return Colour.hsvToRgb(hsb[0], Math.max(hsb[1]*0.5,0), Math.min(hsb[2]*1.2,1));
    }
    
    this.inverse=function(){
        return new Colour(255-this.r,255-this.g,255-this.b);
    }
    
    this.serialize = function(){
        return {
            'r' : this.r,
            'g' : this.g,
            'b' : this.b
        };
    }
    
    this.copy=function(){
        return new Colour(this.r,this.g,this.b);
    }
    
}

Colour.unSerialize = function(json){
    return new Colour(json.r,json.g,json.b);
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
        case 0:r = v, g = t, b = p;break;
        case 1:r = q, g = v, b = p;break;
        case 2:r = p, g = v, b = t;break;
        case 3:r = p, g = q, b = v;break;
        case 4:r = t, g = p, b = v;break;
        case 5:r = v, g = p, b = q;break;
    }

    //return [r * 255, g * 255, b * 255];
    return new Colour(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}
/**
     * Converts the components of a color, as specified by the default RGB 
     * model, to an equivalent set of values for hue, saturation, and 
     * brightness that are the three components of the HSB model. 
     * <p>
     * If the <code>hsbvals</code> argument is <code>null</code>, then a 
     * new array is allocated to return the result. Otherwise, the method 
     * returns the array <code>hsbvals</code>, with the values put into 
     * that array. 
     * @param     r   the red component of the color
     * @param     g   the green component of the color
     * @param     b   the blue component of the color
     * @param     hsbvals  the array used to return the 
     *                     three HSB values, or <code>null</code>
     * @return    an array of three elements containing the hue, saturation, 
     *                     and brightness (in that order), of the color with 
     *                     the indicated red, green, and blue components.
     * @see       java.awt.Color#getRGB()
     * @see       java.awt.Color#Color(int)
     * @see       java.awt.image.ColorModel#getRGBdefault()
     * @since     JDK1.0
     */
Colour.RGBtoHSB=function(r, g, b) {
	var hue;
        var saturation;
        var brightness;
	
        //var hsbvals = new Array(3);
	
    	var cmax = (r > g) ? r : g;
	if (b > cmax) cmax = b;
	var cmin = (r < g) ? r : g;
	if (b < cmin) cmin = b;

	brightness = (cmax) / 255.0;
	if (cmax != 0)
	    saturation = ((cmax - cmin)) / ( cmax);
	else
	    saturation = 0;
	if (saturation == 0)
	    hue = 0;
	else {
	    var redc = ( (cmax - r)) / ( (cmax - cmin));
	    var greenc = ( (cmax - g)) / ((cmax - cmin));
	    var bluec = ( (cmax - b)) / ( (cmax - cmin));
	    if (r == cmax)
		hue = bluec - greenc;
	    else if (g == cmax)
	        hue = 2.0 + redc - bluec;
            else
		hue = 4.0 + greenc - redc;
	    hue = hue / 6.0;
	    if (hue < 0)
		hue = hue + 1.0;
	}
//	hsbvals[0] = hue;
//	hsbvals[1] = saturation;
//	hsbvals[2] = brightness;
	return [hue,saturation,brightness];
    }

Colour.getColourFromCanvas=function(x,y,canvas){
    //http://stackoverflow.com/questions/667045/getpixel-from-html-canvas
    var data = canvas.getImageData(x, y, 1, 1).data;
    return new Colour([data[0], data[1], data[2]]);
}