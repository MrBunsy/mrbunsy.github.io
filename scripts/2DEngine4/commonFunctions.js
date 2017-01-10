/**
 * @author Luke
 */
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

function urlencode(s) {
	s = encodeURIComponent(s);
	return s.replace(/~/g, '%7E').replace(/%20/g, '+');
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

//given [x,y], returns [dist,angle]
Math.cartToPolar=function(cartesianVector){
	
	var dist=Math.sqrt(Math.pow(cartesianVector[0],2) + Math.pow(cartesianVector[1],2));
	var angle=Math.atan2(cartesianVector[1],cartesianVector[0]);
	
	return [dist,angle];
}


//finds x coords of an element on the page.  Set includescroll to true if div or whatever doesn't scroll with the page
findPosX=function(obj,includeScroll)
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

findPosY=function(obj,includeScroll)
  {
    var curtop = 0;
    if(obj.offsetParent)
        while(1)
        {
          curtop += obj.offsetTop;
          if(!obj.offsetParent)
            break;
          obj = obj.offsetParent;
        }
    else if(obj.y)
        curtop += obj.y;
		if(includeScroll)
		{
			curtop += document.body.scrollTop ? document.body.scrollTop : window.pageYOffset
		}
    return curtop;
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