
function inpoly(x,y,polyXs,polyYs)
{//test to see if a single point is inside a certain polygon.
var crosslines=0;
var x2=x+10000;
for(var p=0;p<polyXs.length;p++)
{var p2=(p+1)%polyXs.length
if(linesintersect(x,y,x2,y,polyXs[p],polyYs[p],polyXs[p2],polyYs[p2])){crosslines++}
}
if(crosslines%2==0)
{
//even :. outside poly.
return false;
}else{
//odd :. inside poly
return true;
}
}

//checks for intersection
function linesintersect(sx1,sy1,sx2,sy2,px1,py1,px2,py2)
{
if(sx1<sx2){var sx1test=sx1;var sx2test=sx2}else{var sx1test=sx2;var sx2test=sx1;}
if(sy1<sy2){var sy1test=sy1;var sy2test=sy2}else{var sy1test=sy2;var sy2test=sy1;}
if(px1<px2){var px1test=px1;var px2test=px2}else{var px1test=px2;var px2test=px1;}
if(py1<py2){var py1test=py1;var py2test=py2}else{var py1test=py2;var py2test=py1;}

var sm=(sy2-sy1)/(sx2-sx1)
var pm=(py2-py1)/(px2-px1)

//gradients not equal :. not parallel and will intersect in 2D
if(sm!==pm && sm!==Infinity && pm!==Infinity && sm!==0 && pm!==0)
{
//co-ords of intersection
var x=(sx1*sm-px1*pm+py1-sy1)/(sm-pm)
var y=pm*(x-px1)+py1

}else{
//an infinite gradient means a vertical line
if(sm==-Infinity){sm=Infinity}
if(pm==-Infinity){pm=Infinity}
//a gradient of zero means a horizontal line

if(sm==Infinity && pm==Infinity){if(sy2test>=py1test && sy1test<=py2test && sx1==px1){return true}}
else if(sm==0 && pm==0){if(sx2test>=px1test && sx1test<=px2test && py1==sy1){return true}}
else if(sm==Infinity && pm==0){var x=sx1;var y=py1;}
else if(sm==0 && pm==Infinity){var y=sy1;var x=px1;}
else if(sm==Infinity){var x=sx1;var y=pm*(x-px1)+py1}
else if(pm==Infinity){var x=px1;var y=sm*(x-sx1)+sy1}
else if(sm==0){var y=sy1;var x=(y-py1)/pm+px1}
else if(pm==0){var y=py1;var x=(y-sy1)/sm+sx1}

}
if(sx1test<=x && x<=sx2test && px1test<= x && x<=px2test && sy1test<=y && y<=sy2test && py1test<=y && y<=py2test){return true}

return false;
}

function dsqrd(dx1,dy1,dx2,dy2)
{var dx=dx2-dx1
var dy=dy2-dy1
return dx*dx+dy*dy;}
