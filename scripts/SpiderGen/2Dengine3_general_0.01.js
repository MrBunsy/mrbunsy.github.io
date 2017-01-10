// General functions for use with 2D engine.  Could be used in any project.

var General=new Object();

General.debug=false;

if (/MSIE/.test(navigator.userAgent) && !window.opera)
  {
  General.IE=true;
  }
		
//gets variables from url, like GET in PHP
General.gup=function(name)
  {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
	  {
  	return "";
		}
  else
	  {
  	return results[1];
		}
  }
	

General.inarray=function(needle,haystack)
  {
	for (var k=0;k<haystack.length;k++)
	  {
		if(haystack[k] === needle)
		  {
			return true;
			}
		}
  return false;
	}

//this adds an element to an array and returns true if it is already not in it. Otherwise if it's already in the array it returns false.
General.addtoifnotin=function(thisarray,thisthing)
  {
	var testin=0;
	for(var z=0;z<thisarray.length;z++)
	  {
		if(thisarray[z]==thisthing)
		  {
			testin++;
			}
		}
	if(testin==0)
	  {
		thisarray.push(thisthing);
		return true;
		}
	else
	  {
		return false;
		}
	}

//originally for pool.  useful anywhere.
General.randommass=function(aprox,leeway)
  {
	var themass=aprox+(Math.random()-0.5)*2*leeway;
	return Math.round(themass);
	}

//alert something when debugging, but to avoid infinite loop alerts, do it in a confirm, where pressing cancel will take the engine out of debug mode.
General.dalert=function(saythis)
  {
	if(General.debug)
	  {
		General.debug=confirm(saythis);
		}
	}
	

//no longer used with new poly collisions - left in case it comes in handy
General.findnormalvector=function(dx,dy,samesize)
  {
	var x;
	var y;
	
	if(dx!==0 && dy!==0)//neither vertical nor horizontal
	  {
		x=1;
		y=(-1)*dx/dy;// dervived from grada*gradb=-1 or a.b=0
		}
	else if(dx==0)//vertical line
	  {
		x=1;
		y=0;
		}
	else if(dy==0)//horizontal line
	  {
		x=0;
		y=1;
		}

	if(samesize)//make normal vector have same magnitude as old vector
	  {
		var oldsize=Math.sqrt(dy*dy+dx*dx);
		var newsize=Math.sqrt(y*y+x*x);
		var diffsize=oldsize/newsize
		return [x*diffsize,y*diffsize];
		}
	else
	  {
	  return [x,y];
	  }
	}


General.toradians=function(degrees)
  {
	return ((Math.PI/180)*degrees);
	}

General.todegrees=function(radians)
  {
	return radians*180/Math.PI;
	}

//distance between two points.
General.distance=function(dx1,dy1,dx2,dy2)
  {
	var dx=dx2-dx1;
  var dy=dy2-dy1;
  return Math.sqrt(dx*dx+dy*dy);
	}

//distance squared
General.dsqrd=function(dx1,dy1,dx2,dy2)
  {
	var dx=dx2-dx1;
  var dy=dy2-dy1;
  return dx*dx+dy*dy;
	}