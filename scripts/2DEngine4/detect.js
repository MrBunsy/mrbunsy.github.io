// Collision detection component of 2D engine.
// Requires only General component, as it is entirely abstracted. 

var Detect = new Object();

//variables to send into to response.
Detect.polyline = false;
Detect.polyline2 = false;
Detect.polycorner = false;
Detect.polynumber = 0;//which polygon? the first or second.
// p=pos=[x,y], d=dimensions,s=shape, a=angle, f=filled
// shapes+dimensions:
// Circle: shape=0, d=radius
// square: shape=1, d=[ width , height ]
// polygon: shape=3, d=[ Rs , As , bigR , Xs , Ys ] 
// line: shape = 4, d=[x2,y2]
Detect.checkcollide = function(p1, d1, f1, a1, s1, p2, d2, f2, a2, s2)
{
	x1 = p1[0];
	y1 = p1[1];
	x2 = p2[0];
	y2 = p2[1];
	
	if (s1 == 0 && s2 == 0)//both are circles
	{
		radii = Math.pow((d1 + d2), 2);
		//pythagoras - this was pythag, but since square roots are slow maths, I've decided to just compare the squares.
		var circledistance = (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)
		//if the distance between the two circles is less than or equal to the sum of their two radii then they'll collide
		if (circledistance < radii) 
		{
			return true;
		}
	}
	
	//shapes,0=circle, 1= rectangle,  2=square/rectangle (obselete, I think), but collide as circle, 3 = polygon, 4= line
	
	else if (s1 == 4 && s2 == 0)//line + circle
	{
		if (Detect.circleandline(x1, d1[0], y1, d1[1], x2, y2, d2)) 
		{
			return true;
		}
	}
	else if (s1 == 0 && s2 == 4)//circle + line
	{
	
		//if(Detect.circleandline(x2,p2[2],y2,p2[3],x1,y1,d1))
		if (Detect.circleandline(x2, d2[0], y2, d2[1], x1, y1, d1)) 
		{
			return true;
		}
	}
	else if (s1 == 3 || s2 == 3)//involves a polygon
	{
		if (s1 == 3 && s2 !== 3) 
		{//(polyX,polyY,polyRs,polyAs,polybigR,polyangle,polyfilled,theirx,theiry,notpolyd,notpolyshape)
			var polycollide = Detect.polyandshape(x1, y1, d1[0], d1[1], d1[2], a1, f1, x2, y2, d2, s2);
		}
		else if (s2 == 3 && s1 !== 3) 
		{
			var polycollide = Detect.polyandshape(x2, y2, d2[0], d2[1], d2[2], a2, f2, x1, y1, d1, s1);
		}
		else if (s2 == 3 && s1 == 3) 
		{
			var polycollide = Detect.polyandpoly(x1, y1, d1[0], d1[1], d1[2], a1, f1, x2, y2, d2[0], d2[1], d2[2], a2, f2);
		}
		
		if (polycollide) 
		{
			return true;
		}
		
	}
	else if (s1 == 0 && s2 == 1) 
	{
		//circle + rectangle combo
		if (x1 + d1 > x2 - d2[0] / 2 && x1 - d1 < (x2 + d2[0] / 2) && y1 - d1 < (y2 + d2[1] / 2) && y1 + d1 > y2 - d2[1] / 2) 
		{
			return true;
		}
	}
	return false;
}

Detect.inpoly = function(x, y, polyX, polyY, polyRs, polyAs, polyangle)
{//test to see if a single point is inside a certain polygon.
	var crosslines = 0;
	var x2 = x + 1000;
	for (var p = 0; p < polyRs.length; p++) 
	{
		var p2 = (p + 1) % polyRs.length;
		if (Detect.linesintersect(x, y, x2, y, polyX + polyRs[p] * Math.cos(polyAs[p] + polyangle), polyY + polyRs[p] * Math.sin(polyAs[p] + polyangle), polyX + polyRs[p2] * Math.cos(polyAs[p2] + polyangle), polyY + polyRs[p2] * Math.sin(polyAs[p2] + polyangle))) 
		{
			crosslines++;
		}
	}
	if (crosslines % 2 == 0) 
	{
		//even :. outside poly.
		return false;
	}
	else 
	{
		//odd :. inside poly
		return true;
	}
}

Detect.polyandpoly = function(poly1X, poly1Y, poly1Rs, poly1As, poly1bigR, poly1angle, poly1filled, poly2X, poly2Y, poly2Rs, poly2As, poly2bigR, poly2angle, poly2filled)
{//detects if two polygons are colliding.
	//this function will be very, very slow.  It is mostly here as a working placeholder until I re-write polygon collisions.
	
	//testing corners of poly2 inside poly1
	if (poly1filled) 
	{
		for (var k = 0; k < poly2Rs.length; k++) 
		{
			polyx1 = poly2X + poly2Rs[k] * Math.cos(poly2As[k] + poly2angle);
			polyy1 = poly2Y + poly2Rs[k] * Math.sin(poly2As[k] + poly2angle);
			if (Detect.inpoly(polyx1, polyy1, poly1X, poly1Y, poly1Rs, poly1As, poly1angle)) 
			{
				Detect.polyline = Detect.findpolyline(polyx1, polyy1, poly1X, poly1Y, poly1Rs, poly1As, poly1angle);
				Detect.CLr = [polyx1, polyy1];
				Detect.polynumber = 2;
				Detect.polycorner = true;
				return true;
			}
		}
	}
	
	
	if (poly2filled)//testing corners of poly1 inside poly2
	{
		for (var k = 0; k < poly1Rs.length; k++) 
		{
			polyx1 = poly1X + poly1Rs[k] * Math.cos(poly1As[k] + poly1angle);
			polyy1 = poly1Y + poly1Rs[k] * Math.sin(poly1As[k] + poly1angle);
			if (Detect.inpoly(polyx1, polyy1, poly2X, poly2Y, poly2Rs, poly2As, poly2angle)) 
			{
				Detect.polyline = Detect.findpolyline(polyx1, polyy1, poly2X, poly2Y, poly2Rs, poly2As, poly2angle);
				Detect.CLr = [polyx1, polyy1];
				Detect.polynumber = 1;
				Detect.polycorner = true;
				return true;
			}
		}
	}
	
	Detect.polycorner = false
	
	if (!poly1filled || !poly2filled) 
	{//only check overlapping lines if either polygon is hollow. 
		//return false
		for (var k = 0; k < poly1Rs.length; k++) 
		{
			k2 = (k + 1) % poly1Rs.length;
			var xa1 = poly1X + poly1Rs[k] * Math.cos(poly1As[k] + poly1angle);
			var ya1 = poly1Y + poly1Rs[k] * Math.sin(poly1As[k] + poly1angle);
			var xa2 = poly1X + poly1Rs[k2] * Math.cos(poly1As[k2] + poly1angle);
			var ya2 = poly1Y + poly1Rs[k2] * Math.sin(poly1As[k2] + poly1angle);
			
			for (var p = 0; p < poly2Rs.length; p++) 
			{
				p2 = (p + 1) % poly2Rs.length;
				var xb1 = poly2X + poly2Rs[p] * Math.cos(poly2As[p] + poly2angle);
				var yb1 = poly2Y + poly2Rs[p] * Math.sin(poly2As[p] + poly2angle);
				var xb2 = poly2X + poly2Rs[p2] * Math.cos(poly2As[p2] + poly2angle);
				var yb2 = poly2Y + poly2Rs[p2] * Math.sin(poly2As[p2] + poly2angle);
				
				if (Detect.linesintersect(xa1, ya1, xa2, ya2, xb1, yb1, xb2, yb2)) 
				{
					Detect.polyline = k;
					Detect.polyline2 = p;
					return true;
				}
			}
		}
	}//end of polyfilled
	return false;
}


Detect.findpolyline = function(x, y, polyX, polyY, polyRs, polyAs, polyangle)
{
	var polyx1 = polyX + polyRs[0] * Math.cos(polyAs[0] + polyangle);
	var polyy1 = polyY + polyRs[0] * Math.sin(polyAs[0] + polyangle);
	var polyx2 = polyX + polyRs[1] * Math.cos(polyAs[1] + polyangle);
	var polyy2 = polyY + polyRs[1] * Math.sin(polyAs[1] + polyangle);
	
	var shortest = General.dsqrd(polyx1, polyy1, x, y) + General.dsqrd(polyx2, polyy2, x, y) - General.dsqrd(polyx2, polyy2, polyx1, polyy1)
	var temppolyline = 0;
	
	for (var k = 0; k < polyRs.length; k++) 
	{
		k2 = (k + 1) % polyRs.length;
		polyx1 = polyX + polyRs[k] * Math.cos(polyAs[k] + polyangle);
		polyy1 = polyY + polyRs[k] * Math.sin(polyAs[k] + polyangle);
		polyx2 = polyX + polyRs[k2] * Math.cos(polyAs[k2] + polyangle);
		polyy2 = polyY + polyRs[k2] * Math.sin(polyAs[k2] + polyangle);
		var testshort = General.dsqrd(polyx1, polyy1, x, y) + General.dsqrd(polyx2, polyy2, x, y) - General.dsqrd(polyx2, polyy2, polyx1, polyy1)
		if (testshort < shortest) 
		{
			shortest = testshort;
			temppolyline = k;
		}
	}
	return temppolyline;
}

Detect.polyandshape = function(polyX, polyY, polyRs, polyAs, polybigR, polyangle, polyfilled, theirx, theiry, notpolyd, notpolyshape)
{//detects if there's a collision with a polygon
	//polyRs = radii of verticies from centre
	//polyAs = angle of verticles from centre
	
	switch (notpolyshape)
	{
		case 0:
			notpolyradius = notpolyd;
			notpolywidth = notpolyradius * 2
			notpolyheight = notpolyradius * 2
			break;
		case 1:
			notpolywidth = notpolyd[0];
			notpolyheight = notpolyd[1];
			break;
	}
	theircentrex = theirx;
	theircentrey = theiry;
	
	//optimisation - treat poly as giant circle
	if (General.dsqrd(polyX, polyY, theircentrex, theircentrey) > Math.pow(polybigR + notpolywidth + notpolyheight, 2)) 
	{
		//they're too far away to be able to collide
		return false;
	}
	
	//check to see if their shape has hit a corner treating the corner as a very small circle
	if (notpolyshape == 0) 
	{
		for (var k = 0; k < polyRs.length; k++) 
		{
			polyx1 = polyX + polyRs[k] * Math.cos(polyAs[k] + polyangle);
			polyy1 = polyY + polyRs[k] * Math.sin(polyAs[k] + polyangle);
			if (General.dsqrd(polyx1, polyy1, theircentrex, theircentrey) < notpolyradius * notpolyradius) 
			{
				Detect.polyline = k;
				Detect.polycorner = true;
				Detect.CLr = [polyx1, polyy1];
				return true;
			}
		}
	}
	Detect.polycorner = false;
	
	
	
	//if polygon is 'filled', check to see if shape is inside.
	if (polyfilled)//check to see if bigR is greater than notpolywidth?
	{
		if (Detect.inpoly(theircentrex, theircentrey, polyX, polyY, polyRs, polyAs, polyangle)) 
		{//find which line of the polygon is nearest.
			Detect.polyline = Detect.findpolyline(theircentrex, theircentrey, polyX, polyY, polyRs, polyAs, polyangle);
			return true;
		}
	}
	
	for (var k = 0; k < polyRs.length; k++) 
	{//loop through each line of the polygon
		k2 = (k + 1) % polyRs.length;
		//if(k2==polyXs.length){k2=0;}
		
		//var linelength=distance(poly.x[k2],poly.y[k2],poly.x[k],poly.y[k])+0.5
		
		var polyx1 = polyX + polyRs[k] * Math.cos(polyAs[k] + polyangle);
		var polyy1 = polyY + polyRs[k] * Math.sin(polyAs[k] + polyangle);
		var polyx2 = polyX + polyRs[k2] * Math.cos(polyAs[k2] + polyangle);
		var polyy2 = polyY + polyRs[k2] * Math.sin(polyAs[k2] + polyangle);
		
		//check to see if we're even vaguely near first.  if we are *then* check thoroughly
		
		//this actually compares the squares of the lengths, as this is much faster to execute.
		//if(Math.pow((theircentrex-polyx2),2)+Math.pow((theircentrey-polyy2),2)+Math.pow((theircentrex-polyx1),2)+Math.pow((theircentrey-polyy1),2) <= poly.linelength[k]+Math.pow((notpolywidth+notpolyheight),2))
		if (true) 
		{
		
			if (polyx1 < polyx2) 
			{
				var testpolyx1 = polyx1;
				var testpolyx2 = polyx2
			}
			else 
			{
				var testpolyx1 = polyx2;
				var testpolyx2 = polyx1
			}
			if (polyy1 < polyy2) 
			{
				var testpolyy1 = polyy1;
				var testpolyy2 = polyy2
			}
			else 
			{
				var testpolyy1 = polyy2;
				var testpolyy2 = polyy1
			}
			
			var dy = polyy2 - polyy1
			var dx = polyx2 - polyx1
			
			if (notpolyshape !== 0)//check all four corners of rectangle
			{
				var leftx = theirx - notpolywidth / 2
				var topy = theiry - notpolyheight / 2
				var rightx = theirx + notpolywidth / 2
				var bottomy = theiry + notpolyheight / 2
				//top line of square
				if (Detect.linesintersect(leftx, topy, rightx, topy, polyx1, polyy1, polyx2, polyy2)) 
				{
					Detect.polyline = k;
					return true;
				}
				//right hand side
				if (Detect.linesintersect(rightx, topy, rightx, bottomy, polyx1, polyy1, polyx2, polyy2)) 
				{
					Detect.polyline = k;
					return true;
				}
				//bottom line
				if (Detect.linesintersect(leftx, bottomy, rightx, bottomy, polyx1, polyy1, polyx2, polyy2)) 
				{
					Detect.polyline = k;
					return true;
				}
				//left had side
				if (Detect.linesintersect(leftx, topy, leftx, bottomy, polyx1, polyy1, polyx2, polyy2)) 
				{
					Detect.polyline = k;
					return true;
				}
			}
			else 
			{
				//circle intersecting with a line
				var r = notpolyradius
				var a = theircentrex
				var b = theircentrey
				var x1 = polyx1
				var y1 = polyy1
				//gradient of poly line
				var m = dy / dx
				
				if (Detect.circleandline(polyx1, polyx2, polyy1, polyy2, a, b, r)) 
				{
					Detect.polyline = k;
					return true;
				}
				
				//end of circle if
			}
			//end of optimisation if
		}
		//end of loop
	}
	return false
}

//checks for intersection
Detect.linesintersect = function(sx1, sy1, sx2, sy2, px1, py1, px2, py2)
{
	if (sx1 < sx2) 
	{
		var sx1test = sx1;
		var sx2test = sx2
	}
	else 
	{
		var sx1test = sx2;
		var sx2test = sx1;
	}
	if (sy1 < sy2) 
	{
		var sy1test = sy1;
		var sy2test = sy2
	}
	else 
	{
		var sy1test = sy2;
		var sy2test = sy1;
	}
	if (px1 < px2) 
	{
		var px1test = px1;
		var px2test = px2
	}
	else 
	{
		var px1test = px2;
		var px2test = px1;
	}
	if (py1 < py2) 
	{
		var py1test = py1;
		var py2test = py2
	}
	else 
	{
		var py1test = py2;
		var py2test = py1;
	}
	
	//if(sx2 > px1 && sx1 < px2 && sy1 < py2 && sy2 > py1){
	var sm = (sy2 - sy1) / (sx2 - sx1)
	var pm = (py2 - py1) / (px2 - px1)
	
	//gradients not equal :. not parallel and will intersect in 2D
	if (sm !== pm && sm !== Infinity && pm !== Infinity && sm !== 0 && pm !== 0) 
	{
		//co-ords of intersection
		var x = (sx1 * sm - px1 * pm + py1 - sy1) / (sm - pm)
		var y = pm * (x - px1) + py1
		
	}
	else 
	{
		//an infinite gradient means a vertical line
		if (sm == -Infinity) 
		{
			sm = Infinity;
		}
		if (pm == -Infinity) 
		{
			pm = Infinity;
		}
		//a gradient of zero means a horizontal line
		
		if (sm == Infinity && pm == Infinity) 
		{
			if (sy2test >= py1test && sy1test <= py2test && sx1 == px1) 
			{
				return true
			}
		}
		else if (sm == 0 && pm == 0) 
		{
			if (sx2test >= px1test && sx1test <= px2test && py1 == sy1) 
			{
				return true
			}
		}
		else if (sm == Infinity && pm == 0) 
		{
			var x = sx1;
			var y = py1;
		}
		else if (sm == 0 && pm == Infinity) 
		{
			var y = sy1;
			var x = px1;
		}
		else if (sm == Infinity) 
		{
			var x = sx1;
			var y = pm * (x - px1) + py1
		}
		else if (pm == Infinity) 
		{
			var x = px1;
			var y = sm * (x - sx1) + sy1
		}
		else if (sm == 0) 
		{
			var y = sy1;
			var x = (y - py1) / pm + px1
		}
		else if (pm == 0) 
		{
			var y = py1;
			var x = (y - sy1) / sm + sx1
		}
		
	}
	Detect.CLr = [x, y];
	if (sx1test <= x && x <= sx2test && px1test <= x && x <= px2test && sy1test <= y && y <= sy2test && py1test <= y && y <= py2test) 
	{
		return true;
	}
	
	//end of optimisation
	//}
	
	return false;
}

//CP = circle line, r=position vector
//var CLr;

//does a circle intersect a line?
Detect.circleandline = function(x1, x2, y1, y2, a, b, r)
{
	//r=radius
	//a=circle centre x
	//b=circle centre y
	//(x1,y1), (x2,y2) points line travels between
	
	if (x1 < x2) 
	{
		var testx1 = x1;
		var testx2 = x2;
	}
	else 
	{
		var testx1 = x2;
		var testx2 = x1;
	}
	if (y1 < y2) 
	{
		var testy1 = y1;
		var testy2 = y2;
	}
	else 
	{
		var testy1 = y2;
		var testy2 = y1;
	}
	
	//treat both as squares first, if they collide, look in more detail
	//if(testx2 > (a-r) && testx1 < (a+r) && testy1 < (b+r) && testy2 > (b-r))
	//{
	var dy = y2 - y1;
	var dx = x2 - x1;
	//gradient of line
	var m = dy / dx
	//fixes odd problem with not detecting collision point correctly on a nearly vertical line - needs looking into?
	if (m > 1000000) 
	{
		m = Infinity;
	}
	switch (m)
	{
		case Infinity:
		case -Infinity:
			//vertical line - we know x, but have potentially two possible Ys
			var x = x1
			//b^2 - 4ac
			var discrim = Math.pow((-2 * b), 2) - 4 * (b * b + (x - a) * (x - a) - r * r)
			if (discrim >= 0) 
			{
				//minus
				var y = (-(-2 * b) - Math.sqrt(discrim)) / 2
				if (testx1 <= x && x <= testx2 && testy1 <= y && y <= testy2) 
				{
					Detect.CLr = [x, y];
					return true;
				}
				//plus
				var y = (-(-2 * b) + Math.sqrt(discrim)) / 2
				if (testx1 <= x && x <= testx2 && testy1 <= y && y <= testy2) 
				{
					Detect.CLr = [x, y];
					return true;
				}
			}
			break;
		case 0:
			//horizontal line, two potential Xs
			var y = y1
			var discrim = Math.pow((-2 * a), 2) - 4 * (a * a + (y - b) * (y - b) - r * r)
			if (discrim >= 0) 
			{
				//minus
				var x = (-(-2 * a) - Math.sqrt(discrim)) / 2
				if (testx1 <= x && x <= testx2 && testy1 <= y && y <= testy2) 
				{
					Detect.CLr = [x, y];
					return true;
				}
				//plus
				var x = (-(-2 * a) + Math.sqrt(discrim)) / 2
				if (testx1 <= x && x <= testx2 && testy1 <= y && y <= testy2) 
				{
					Detect.CLr = [x, y];
					return true;
				}
			}
			break;
		default:
			//re-arrangement of the equation of a circle and the equation of a straight line to find the x co-ordinate of an intersection
			var discrim = Math.pow((-2 * a - 2 * m * m * x1 + 2 * y1 * m - 2 * b * m), 2) - 4 * (1 + m * m) * (-2 * m * x1 * y1 + 2 * m * x1 * b + m * m * x1 * x1 - r * r + a * a + (y1 - b) * (y1 - b))
			//if discriminant is less than zero then there are no real roots and :. no interesction
			if (discrim >= 0) 
			{
				//circle intersects line, but where?
				//minus first
				var x = (-(-2 * a - 2 * m * m * x1 + 2 * y1 * m - 2 * b * m) - Math.sqrt(discrim)) / (2 * (1 + m * m))
				var y = m * (x - x1) + y1
				if (testx1 <= x && x <= testx2 && testy1 <= y && y <= testy2) 
				{
					Detect.CLr = [x, y];
					return true;
				}
				//then plus
				x = (-(-2 * a - 2 * m * m * x1 + 2 * y1 * m - 2 * b * m) + Math.sqrt(discrim)) / (2 * (1 + m * m))
				y = m * (x - x1) + y1
				
				if (testx1 <= x && x <= testx2 && testy1 <= y && y <= testy2) 
				{
					Detect.CLr = [x, y];
					return true;
				}
			//end of discrim if
			}
			break;
		//end of m switch
	}
	return false;
}
