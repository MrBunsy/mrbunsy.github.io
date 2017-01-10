/**
 * @author Luke
 */

var formSanityFloat=function(formchunk){
	
	var num=parseFloat(formchunk.value);
	
	if(!isNaN(num)){
		return num;
	}
	return 1;
}

function roundTo(num,dp){
	num=num*Math.pow(10,dp);
	num=Math.round(num);
	num=num*Math.pow(10,-dp);
	/*for(var i=0;i<dp;i++){
		num/=10;
	}*/
	return num;
}

//ant wrote this I think, stolen from ECS' first year C course 
function sRand(seed)
{
    this.seed = (typeof seed == 'undefined') ? randomInt() : seed;
    this.next = function()
    {
        var rand_max = 65536; //2 bytes
        var rand = 0; //where the put the bits
        for (var i=0; i<16; i++)
        { 
            //get the random no, bit by bit, for 2 bytes
            this.seed = this.getBit(this.seed);
            //make space
            rand <<= 1;
            //add the new bit to the end
            rand |= (this.seed & 1);
        }
        return rand / (rand_max+1); //and down to 0-0.999999
    }
    
    this.getBit = function(bitSeed)
    {   
        if (bitSeed & 131072)
            bitSeed = ((bitSeed ^ 19) << 1) | 1;
        else
            bitSeed <<= 1;
        return bitSeed;
    }
	
	this.next();
}

function randomInt()
{
    return Math.round(Math.random()*65536);
}

var inArray = function(needle, haystack)
{
	for (var k = 0; k < haystack.length; k++) 
	{
		if (haystack[k] === needle) 
		{
			return true;
		}
	}
	return false;
}

//does what it says on the tin.  works in all browsers, aparently.
function isArray(obj) {
	if (typeof obj == "undefined") {
		return false;
	}
	return obj.constructor == Array;
}

var whereInArray = function(needle, haystack)
{
	for (var k = 0; k < haystack.length; k++) 
	{	
		if (haystack[k] === needle) 
		{
			return k;
		}
	}
	return -1;
}

var removeFromArray = function(needle, haystack)
{
	for (var k = 0; k < haystack.length; k++) 
	{
		if (haystack[k] === needle) 
		{
			haystack.splice(k,1);
			return true;
		}
	}
	
	return false;
}

var inheritFrom=function(parent,child)
{
	for(var i in parent.prototype)
	{
		child.prototype[i]=parent.prototype[i];
	}
}

// vector functions
Math.dotProduct = function(vector1, vector2)
{
	var dot=0;
	for(var i=0;i<vector1.length;i++)
	{
		dot+=vector1[i]*vector2[i];
	}
	return dot;
}

Math.crossProduct = function(a, b)
{
	if(a.length<3)
	{
		a.push(0);
	}
	
	if(b.length<3)
	{
		b.push(0);
	}
	
	return [a[1]*b[2] - a[2]*b[1] , a[2]*b[1] - a[0]*b[2] , a[0]*b[1] - a[1]*b[0]];
}

Math.modulus=function(vector)
{
	var sqrd=0;
	for(var i=0;i<vector.length;i++)
	{
		sqrd+=vector[i]*vector[i];
	}
	return Math.sqrt(sqrd);
}

Math.dsqrd=function(xA, yA, xB, yB)
{
	return (xA-xB)*(xA-xB) + (yA-yB)*(yA-yB);
}


//finds x coords of an element on the page.  Set includescroll to true if div or whatever doesn't scroll with the page
var findPosX=function(obj,includeScroll)
  {
    var curleft = 0;
    if(obj.offsetParent)
        while(1) 
        {
          curleft += obj.offsetLeft;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.x)
        curleft += obj.x;
		if(includeScroll)
		{
			curleft += document.body.scrollLeft ? document.body.scrollLeft : window.pageXOffset
		}
    return curleft;
  }

var findPosY = function(obj, includeScroll) {
  	var curtop = 0;
  	if (obj.offsetParent) 
  		while (1) {
  			curtop += obj.offsetTop;
  			if (!obj.offsetParent) 
  				break;
  			obj = obj.offsetParent;
  		}
  	else if (obj.y) 
  		curtop += obj.y;
  	if (includeScroll) {
  		curtop += document.body.scrollTop ? document.body.scrollTop : window.pageYOffset
  	}
  	return curtop;
  }

// http://scripts.franciscocharrua.com/javascript-get-variables.php
function getVar(name)
     {
     get_string = document.location.search;         
     return_value = '';
     
     do { //This loop is made to catch all instances of any get variable.
        name_index = get_string.indexOf(name + '=');
        
        if(name_index != -1)
          {
          get_string = get_string.substr(name_index + name.length + 1, get_string.length - name_index);
          
          end_of_value = get_string.indexOf('&');
          if(end_of_value != -1)                
            value = get_string.substr(0, end_of_value);                
          else                
            value = get_string;                
            
          if(return_value == '' || value == '')
             return_value += value;
          else
             return_value += ', ' + value;
          }
        } while(name_index != -1)
        
     //Restores all the blank spaces.
     space = return_value.indexOf('+');
     while(space != -1)
          { 
          return_value = return_value.substr(0, space) + ' ' + 
          return_value.substr(space + 1, return_value.length);
						 
          space = return_value.indexOf('+');
          }
      
     return(return_value);        
     }

function urlencode(s) {
	s = encodeURIComponent(s);
	return s.replace(/~/g, '%7E').replace(/%20/g, '+');
	}

function str_ireplace(removethis, tothis, strings) {
	while (strings.indexOf(removethis) != -1) {
		strings = strings.replace(removethis, tothis);
	}
	return strings;
}

//for converting hex colour string to whatever is needed
//either: RRGGBB (in hex) or RRGGBBA (where A is alpha, from 0 to 9)
colourToRGB = function(colour){
	if(colour.length>6)//contains alpha at end
		return "rgba(" + parseInt(colour.substring(0, 2), 16) + "," + parseInt(colour.substring(2, 4), 16) + "," + parseInt(colour.substring(4, 6), 16) + " , "+parseInt(colour.substring(6, 7))/10+")";
	return "rgb(" + parseInt(colour.substring(0, 2), 16) + "," + parseInt(colour.substring(2, 4), 16) + "," + parseInt(colour.substring(4, 6), 16) + ")";
}

colourToRGBArray = function(colour){
	return [parseInt(colour.substring(0, 2), 16), parseInt(colour.substring(2, 4), 16), parseInt(colour.substring(4, 6), 16)];
}

colourToBright = function(colour){
	return colourChangeBy(colour, 128);
}

colourToDark = function(colour){
	return colourChangeBy(colour, -128);
}

//takes the hex-code string and changes its brightness by changeBy
colourChangeBy = function(colour, changeBy){
	var newColour = "";
	for (var i = 0; i < 3; i++) 
	{
		var tempColour = putInRange(parseInt(colour.substring(i * 2, i * 2 + 2), 16) + changeBy, 0, 255).toString(16);
		newColour += tempColour.length == 1 ? "0" + tempColour : tempColour;
	}
	return newColour;
}

/*
var addToArray = function(addMe, haystack)
{
	for (var k = 0; k < haystack.length; k++) 
	{
		if (haystack[k] === addMe) 
		{
			return false;
		}
	}
	
	haystack.push(addMe);
}
*/

//http://my.opera.com/GreyWyvern/blog/show.dml/1725165
/*
Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  } return newObj;
};
*/

cloneObject = function(thisObject,iteration) {
	if(typeof iteration=="undefined")
		iteration=5;
  var newObj = (thisObject instanceof Array) ? [] : {};
  for (var i in thisObject) {
//  	alert(i)
    if (thisObject[i] && typeof thisObject[i] == "object") {
      newObj[i] = (iteration > 0) ? cloneObject(thisObject[i],iteration-1) : {};
    } else newObj[i] = thisObject[i];
  } return newObj;
};


function myAddEvent(obj,event,func) {
	//adapted from a function by Todd Anthony Spartaforce http://spatacoli.com/storydisplay.aspx?reqid=5463c334-0d6f-425a-94cd-fe5ead3634e7
	//needed a non-destructive cross-browser method for adding event listeners
	var oldevent = obj[event];
	if (typeof obj[event] != 'function')
		obj[event] = func;
	else {
		obj[event] = function() {
			oldevent();
			func();
		};
	}
} 