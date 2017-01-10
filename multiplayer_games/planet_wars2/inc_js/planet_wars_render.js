//adaption of 2D Engine's Render object for Planet Wars

var Render=new Object();

Render.viewports=new Array();

Render.drawPoly=false;

Render.viewport=function(htmlname,x,y,width,height,zoom,enabled)
{
	//either main span, or canvas
	this.htmlname=htmlname;
	//co-ords of top left
	this.x=x;this.y=y;
	//size of viewport
	this.width=width;this.height=height;
	//zoom: 'virtual' pixels (measuring unit) *zoom = screen pixels
	this.zoom=zoom;
	//being used?
	this.enabled=enabled;
	
	if (document.getElementById(htmlname).getContext)
	{
		this.canvas = document.getElementById(htmlname).getContext('2d');
		this.clear=function()
		{
			this.canvas.clearRect(0,0,width,height);
		}
	}
	
  //add to array of viewports
	Render.viewports.push(this);
}

//heres is an array of positions, returns which pos if the pos is less than r from any of the positions in heres 
planet_wars.nearHere=function(pos,heres,r)
{
    r*=r;
    
    for(var h=0;h<heres.length;h++)
    {
        if(Math.pow(pos[0] - heres[h][0] , 2) + Math.pow(pos[1] - heres[h][1] , 2) < r )
        {
        return h;
        }
    }
    return false;    
}

Render.drawRings1=function(planet,vp,colour)
{
	var i=planet;
    var centrex=planet_wars.objects[i].pos[0];
    var centrey=planet_wars.objects[i].pos[1];
    var radius=planet_wars.objects[i].r;
    var bigrad=radius*1.25
    var angle=planet_wars.objects[i].angle;
    var Lx=centrex-Math.cos(angle)*bigrad
    var Ly=centrey-Math.sin(angle)*bigrad
    var Rx=centrex+Math.cos(angle)*bigrad
    var Ry=centrey+Math.sin(angle)*bigrad
    var LUx=Lx+Math.cos(angle-Math.PI/2)*radius
    var LUy=Ly+Math.sin(angle-Math.PI/2)*radius
    var LDx=Lx-Math.cos(angle-Math.PI/2)*radius
    var LDy=Ly-Math.sin(angle-Math.PI/2)*radius
    var RUx=Rx+Math.cos(angle-Math.PI/2)*radius
    var RUy=Ry+Math.sin(angle-Math.PI/2)*radius
    var RDx=Rx-Math.cos(angle-Math.PI/2)*radius
    var RDy=Ry-Math.sin(angle-Math.PI/2)*radius
    
    var grad2 = Render.viewports[vp].canvas.createLinearGradient((centrex-bigrad-Render.viewports[vp].x)*Render.viewports[vp].zoom , (centrey-bigrad-Render.viewports[vp].y)*Render.viewports[vp].zoom , (centrex+bigrad-Render.viewports[vp].x)*Render.viewports[vp].zoom , (centrey+bigrad-Render.viewports[vp].y)*Render.viewports[vp].zoom);
    grad2.addColorStop(0,colour);
    grad2.addColorStop(1,'rgb(0,0,0)');
    
    
    if(planet_wars.IE)
    {
        grad2=colour;
    }
    
    
    Render.viewports[vp].canvas.beginPath();
    Render.viewports[vp].canvas.moveTo((Lx-Render.viewports[vp].x)*Render.viewports[vp].zoom,(Ly-Render.viewports[vp].y)*Render.viewports[vp].zoom);
    
    Render.viewports[vp].canvas.strokeStyle=grad2;
    Render.viewports[vp].canvas.lineWidth=planet_wars.objects[i].r*Render.viewports[vp].zoom/5;
    Render.viewports[vp].canvas.lineCap='round';
    
    Render.viewports[vp].canvas.bezierCurveTo((LUx-Render.viewports[vp].x)*Render.viewports[vp].zoom, (LUy-Render.viewports[vp].y)*Render.viewports[vp].zoom, (RUx-Render.viewports[vp].x)*Render.viewports[vp].zoom, (RUy-Render.viewports[vp].y)*Render.viewports[vp].zoom , (Rx-Render.viewports[vp].x)*Render.viewports[vp].zoom , (Ry-Render.viewports[vp].y)*Render.viewports[vp].zoom);
    Render.viewports[vp].canvas.stroke();
}

Render.drawRings2=function(planet,vp,colour)
{
	var i=planet;
    var centrex=planet_wars.objects[i].pos[0];
    var centrey=planet_wars.objects[i].pos[1];
    var radius=planet_wars.objects[i].r;
    var bigrad=radius*1.25
    var angle=planet_wars.objects[i].angle;
    var Lx=centrex-Math.cos(angle)*bigrad
    var Ly=centrey-Math.sin(angle)*bigrad
    var Rx=centrex+Math.cos(angle)*bigrad
    var Ry=centrey+Math.sin(angle)*bigrad
    var LUx=Lx+Math.cos(angle-Math.PI/2)*radius
    var LUy=Ly+Math.sin(angle-Math.PI/2)*radius
    var LDx=Lx-Math.cos(angle-Math.PI/2)*radius
    var LDy=Ly-Math.sin(angle-Math.PI/2)*radius
    var RUx=Rx+Math.cos(angle-Math.PI/2)*radius
    var RUy=Ry+Math.sin(angle-Math.PI/2)*radius
    var RDx=Rx-Math.cos(angle-Math.PI/2)*radius
    var RDy=Ry-Math.sin(angle-Math.PI/2)*radius
	
	var grad2 = Render.viewports[vp].canvas.createLinearGradient((centrex-bigrad-Render.viewports[vp].x)*Render.viewports[vp].zoom , (centrey-bigrad-Render.viewports[vp].y)*Render.viewports[vp].zoom , (centrex+bigrad-Render.viewports[vp].x)*Render.viewports[vp].zoom , (centrey+bigrad-Render.viewports[vp].y)*Render.viewports[vp].zoom);
    grad2.addColorStop(0,colour);
    grad2.addColorStop(1,'rgb(0,0,0)');
	
	if(planet_wars.IE)
    {
        grad2=colour;
    }
	
	Render.viewports[vp].canvas.beginPath();
	Render.viewports[vp].canvas.moveTo((Lx-Render.viewports[vp].x)*Render.viewports[vp].zoom,(Ly-Render.viewports[vp].y)*Render.viewports[vp].zoom);
	Render.viewports[vp].canvas.strokeStyle=grad2
	Render.viewports[vp].canvas.lineWidth=planet_wars.objects[i].r*Render.viewports[vp].zoom/5;
	Render.viewports[vp].canvas.lineCap='round';
	Render.viewports[vp].canvas.bezierCurveTo((LDx-Render.viewports[vp].x)*Render.viewports[vp].zoom, (LDy-Render.viewports[vp].y)*Render.viewports[vp].zoom, (RDx-Render.viewports[vp].x)*Render.viewports[vp].zoom, (RDy-Render.viewports[vp].y)*Render.viewports[vp].zoom, (Rx-Render.viewports[vp].x)*Render.viewports[vp].zoom , (Ry-Render.viewports[vp].y)*Render.viewports[vp].zoom);
	Render.viewports[vp].canvas.stroke();
	
	if(planet_wars.IE)
	{//this tidies up a gap where the two halves of the ring meet in IE
	    
	    Render.viewports[vp].canvas.fillStyle=grad2
	    Render.viewports[vp].canvas.beginPath();
	    Render.viewports[vp].canvas.moveTo((Lx-Render.viewports[vp].x)*Render.viewports[vp].zoom , (Ly-Render.viewports[vp].y)*Render.viewports[vp].zoom);
	    Render.viewports[vp].canvas.arc((Lx-Render.viewports[vp].x)*Render.viewports[vp].zoom , (Ly-Render.viewports[vp].y)*Render.viewports[vp].zoom , planet_wars.objects[i].r*Render.viewports[vp].zoom/7.5,0,Math.PI*2,true);  // draw circle
	    Render.viewports[vp].canvas.moveTo( (Rx-Render.viewports[vp].x)*Render.viewports[vp].zoom , (Ry-Render.viewports[vp].y)*Render.viewports[vp].zoom );
	    Render.viewports[vp].canvas.arc( (Rx-Render.viewports[vp].x)*Render.viewports[vp].zoom , (Ry-Render.viewports[vp].y)*Render.viewports[vp].zoom , planet_wars.objects[i].r*Render.viewports[vp].zoom/7.5,0,Math.PI*2,true);  // draw circle
	    //Render.viewports[vp].canvas.closePath();
	    Render.viewports[vp].canvas.fill();
	}
}

//renders a specific viewport.  done by index in viewport array. blackHoles==true is for showing black holes, simple==true is for quicker rendering & for map editor
Render.renderViewport=function(vp,drawBlackHoles,simple)
{
	planet_wars.random=new sRand(planet_wars.seed);
	Render.viewports[vp].canvas.clearRect(0,0,Render.viewports[vp].width,Render.viewports[vp].height);
    
	var blackHoles=new Array();
    
    //find positions of black holes
    for(var i=0;i<planet_wars.objects.length;i++)
    {
        if(planet_wars.objects[i].type==2)
        {
            //black hole
            blackHoles.push(planet_wars.objects[i].pos);
        }
    }

    if(simple !== true)
    {
        //draw stars
        for(var i=0;i<60;i++)
        {
            var maxDist=200;
            var tempX=planet_wars.random.next()*planet_wars.worldWidth;
            var tempY=planet_wars.random.next()*planet_wars.worldHeight;
            var tempR=planet_wars.random.next()*2;
            
            var nearBH=planet_wars.nearHere([tempX,tempY] , blackHoles , maxDist);
            
            if(nearBH!==false)
            {
                var angle=Math.atan2(blackHoles[nearBH][1] - tempY , blackHoles[nearBH][0] - tempX);
                var realDist=Math.sqrt(Math.pow(blackHoles[nearBH][0] - tempX , 2) + Math.pow(blackHoles[nearBH][1] - tempY , 2));
                var dist=(maxDist - realDist)/25;
                if(realDist > 50)
                {
                    //if star isn't too clos to black hole, draw it being sucked in.
                    Render.viewports[vp].canvas.beginPath();
                    //white to tinted yellow
                    Render.viewports[vp].canvas.lineWidth=tempR;
                    Render.viewports[vp].canvas.lineCap="round";
                    Render.viewports[vp].canvas.strokeStyle="rgb(255,255,"+Math.round(planet_wars.random.next()*100+155)+")";
                    Render.viewports[vp].canvas.moveTo((tempX-Render.viewports[vp].x)*Render.viewports[vp].zoom , (tempY-Render.viewports[vp].y)*Render.viewports[vp].zoom);
                    Render.viewports[vp].canvas.lineTo((tempX+Math.cos(angle)*dist-Render.viewports[vp].x)*Render.viewports[vp].zoom , (tempY+Math.sin(angle)*dist-Render.viewports[vp].y)*Render.viewports[vp].zoom);
                    Render.viewports[vp].canvas.stroke();
                }
				else
				{
					//to keep rest of stars the same if a black hole moves
					planet_wars.random.next();
				}
            }
            else
            {
                Render.viewports[vp].canvas.beginPath();
                //white to tinted yellow
                Render.viewports[vp].canvas.fillStyle="rgb(255,255,"+Math.round(planet_wars.random.next()*100+155)+")";
                Render.viewports[vp].canvas.arc((tempX-Render.viewports[vp].x)*Render.viewports[vp].zoom , (tempY-Render.viewports[vp].y)*Render.viewports[vp].zoom , tempR*Render.viewports[vp].zoom , 0 , Math.PI*2 , true);
                Render.viewports[vp].canvas.fill();
            }
        }
    }

  for(var i=0;i<planet_wars.objects.length;i++)
  {
    switch(planet_wars.objects[i].type)
    {
        case 0:// planet
            //script nicked straight from the old planet wars for drawing a ring.
            if(planet_wars.objects[i].ring)
            {
				Render.drawRings1(i,vp,'rgb(192,192,192)');
            }
            
            if (!planet_wars.IE && planet_wars.usePlanetImages){
				var randomPlanet=Math.floor(Math.random()*planet_wars.planetImages.length);
				
				Render.viewports[vp].canvas.drawImage(planet_wars.planetImages[randomPlanet], (planet_wars.objects[i].pos[0] - planet_wars.objects[i].r*1.389 - Render.viewports[vp].x) * Render.viewports[vp].zoom, (planet_wars.objects[i].pos[1] - planet_wars.objects[i].r*1.389 - Render.viewports[vp].x) * Render.viewports[vp].zoom, planet_wars.objects[i].r*2*1.389, planet_wars.objects[i].r*2*1.389)
			}else{
				//gradient of colour in top left fading to black in bottom right
				
				if(!planet_wars.canUseRadialGrads || planet_wars.IE)
				{
					var grad = Render.viewports[vp].canvas.createLinearGradient((planet_wars.objects[i].pos[0] - planet_wars.objects[i].r - Render.viewports[vp].x) * Render.viewports[vp].zoom, (planet_wars.objects[i].pos[1] - planet_wars.objects[i].r - Render.viewports[vp].y) * Render.viewports[vp].zoom, (planet_wars.objects[i].pos[0] + planet_wars.objects[i].r - Render.viewports[vp].x) * Render.viewports[vp].zoom, (planet_wars.objects[i].pos[1] + planet_wars.objects[i].r - Render.viewports[vp].y) * Render.viewports[vp].zoom);
					grad.addColorStop(0, Render.colourToRGB(planet_wars.objects[i].colour));
					grad.addColorStop(1, 'black');
				}
				else
				{
					var grad = Render.viewports[vp].canvas.createRadialGradient((planet_wars.objects[i].pos[0] - planet_wars.objects[i].r*0.707 - Render.viewports[vp].x) * Render.viewports[vp].zoom,(planet_wars.objects[i].pos[1] - planet_wars.objects[i].r*0.707 - Render.viewports[vp].y) * Render.viewports[vp].zoom, 0 ,(planet_wars.objects[i].pos[0] - Render.viewports[vp].x) * Render.viewports[vp].zoom,(planet_wars.objects[i].pos[1] - Render.viewports[vp].x) * Render.viewports[vp].zoom,planet_wars.objects[i].r*2* Render.viewports[vp].zoom);
	
					grad.addColorStop(0, Render.colourToRGB(planet_wars.objects[i].colour));
					//grad.addColorStop(0.8, Render.colourToRGB(Render.colourChangeBy(planet_wars.objects[i].colour,-192)));
					grad.addColorStop(0.9, "rgb(0,0,0)");
				}
				
				
				Render.viewports[vp].canvas.beginPath();
				Render.viewports[vp].canvas.fillStyle = grad;
				Render.viewports[vp].canvas.moveTo((planet_wars.objects[i].pos[0] - Render.viewports[vp].x + planet_wars.objects[i].r) * Render.viewports[vp].zoom, (planet_wars.objects[i].pos[1] - Render.viewports[vp].y) * Render.viewports[vp].zoom);
				Render.viewports[vp].canvas.arc((planet_wars.objects[i].pos[0] - Render.viewports[vp].x) * Render.viewports[vp].zoom, (planet_wars.objects[i].pos[1] - Render.viewports[vp].y) * Render.viewports[vp].zoom, planet_wars.objects[i].r * Render.viewports[vp].zoom, 0, Math.PI * 2, true);
				Render.viewports[vp].canvas.fill();
			}
            
				
			
			
            if(planet_wars.objects[i].ring)
            {
                Render.drawRings2(i,vp,'rgb(192,192,192)');
                
            }
            
            break;
        case 1://ship
        
			if(planet_wars.players[planet_wars.objects[i].player].shield)
			{
				Render.drawShield(planet_wars.objects[i].pos,vp);
			}
		
            Render.drawShip(planet_wars.objects[i].pos , Render.colourToRGB(planet_wars.players[planet_wars.objects[i].player].colour) , planet_wars.objects[i].graphic,vp,planet_wars.objects[i].angle);
            break;
        case 2://black hole
            if(drawBlackHoles == true)
            {
                Render.viewports[vp].canvas.save();
                Render.viewports[vp].canvas.beginPath();
                Render.viewports[vp].canvas.lineWidth=1;
                Render.viewports[vp].canvas.strokeStyle='rgb(255,255,255)';
                Render.viewports[vp].canvas.moveTo((planet_wars.objects[i].pos[0]-Render.viewports[vp].x+planet_wars.blackHoleRadius)*Render.viewports[vp].zoom, (planet_wars.objects[i].pos[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom);
    		    Render.viewports[vp].canvas.arc((planet_wars.objects[i].pos[0]-Render.viewports[vp].x)*Render.viewports[vp].zoom,(planet_wars.objects[i].pos[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom,planet_wars.blackHoleRadius*Render.viewports[vp].zoom,0,Math.PI*2,true);
                Render.viewports[vp].canvas.stroke();
                Render.viewports[vp].canvas.restore();
            }
            break;
        case 3://space station
            /*
            var grad= Render.viewports[vp].canvas.createLinearGradient((planet_wars.objects[i].pos[0]-planet_wars.objects[i].r-Render.viewports[vp].x)*Render.viewports[vp].zoom , (planet_wars.objects[i].pos[1]-planet_wars.objects[i].r-Render.viewports[vp].y)*Render.viewports[vp].zoom , (planet_wars.objects[i].pos[0]+planet_wars.objects[i].r-Render.viewports[vp].x)*Render.viewports[vp].zoom , (planet_wars.objects[i].pos[1]+planet_wars.objects[i].r-Render.viewports[vp].y)*Render.viewports[vp].zoom);
            grad.addColorStop(0,"rgb(128,128,128)");
            grad.addColorStop(1,'black');
            
            Render.viewports[vp].canvas.beginPath();
            Render.viewports[vp].canvas.fillStyle=grad;
            Render.viewports[vp].canvas.moveTo((planet_wars.objects[i].pos[0]-Render.viewports[vp].x+planet_wars.objects[i].r)*Render.viewports[vp].zoom, (planet_wars.objects[i].pos[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom);
    		Render.viewports[vp].canvas.arc((planet_wars.objects[i].pos[0]-Render.viewports[vp].x)*Render.viewports[vp].zoom,(planet_wars.objects[i].pos[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom,planet_wars.objects[i].r*Render.viewports[vp].zoom,0,Math.PI*2,true);
            Render.viewports[vp].canvas.fill();
            */
            
            //stolen from old planet wars - stand in death star graphic until I can write a better system
            var centrex=(planet_wars.objects[i].pos[0]-Render.viewports[vp].x)*Render.viewports[vp].zoom;
            var centrey=(planet_wars.objects[i].pos[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom;
            var radius=planet_wars.objects[i].r*Render.viewports[vp].zoom;
            
            var grad = Render.viewports[vp].canvas.createLinearGradient(centrex-radius,centrey,centrex+radius,centrey);//left -> right
            grad.addColorStop(0,'black');
            grad.addColorStop(1,'rgb(128,128,128)');
            
            var grad2 = Render.viewports[vp].canvas.createLinearGradient(centrex,centrey,centrex+radius,centrey);
            grad2.addColorStop(0,'rgb(128,128,128)');
            if(planet_wars.IE){grad2.addColorStop(1,'rgb(64,64,64)');}else{grad2.addColorStop(1,'black');}
            
            
            var grad3 = Render.viewports[vp].canvas.createLinearGradient(centrex-radius,centrey,centrex+radius,centrey);
            grad3.addColorStop(0,'rgb(10,10,10)');
            grad3.addColorStop(1,'rgb(135,135,135)');
            
            var grad4 = Render.viewports[vp].canvas.createLinearGradient(centrex-radius,centrey,centrex+radius,centrey);
            grad4.addColorStop(0,'rgb(0,0,0)');
            grad4.addColorStop(1,'rgb(64,64,64)');
            
            Render.viewports[vp].canvas.beginPath()
            Render.viewports[vp].canvas.moveTo(centrex,centrey)
            Render.viewports[vp].canvas.fillStyle=grad
            Render.viewports[vp].canvas.arc(centrex,centrey,radius,0,Math.PI*2,true);
            Render.viewports[vp].canvas.fill();
            
            Render.viewports[vp].canvas.beginPath()
            Render.viewports[vp].canvas.moveTo(centrex+radius/3,centrey-radius/3-2)
            Render.viewports[vp].canvas.fillStyle=grad2
            Render.viewports[vp].canvas.arc(centrex+radius/3,centrey-radius/3-2,radius/3.5,0,Math.PI*2,true);
            Render.viewports[vp].canvas.fill();
            
            Render.viewports[vp].canvas.fillStyle = grad3;
            Render.viewports[vp].canvas.fillRect(centrex-radius,centrey-1.5,radius*2,1);
            
            Render.viewports[vp].canvas.fillStyle = grad3;
            Render.viewports[vp].canvas.fillRect(centrex-radius,centrey+0.5,radius*2,1);

            break;
		
		case 6://powerup
			if(!planet_wars.objects[i].used)
			{
				Render.drawPowerUp(planet_wars.objects[i].pos,planet_wars.objects[i].powerup_type,vp);
			}
			break;
    }
  }
}

Render.drawPowerUp=function(pos,powerup_type,vp)
{
	if(powerup_type===false)
	{
		//blacking out a powerup
		var lineColour="rgb(0,0,0)";
		var bgColour="rgb(0,0,0)";
	}
	else
	{
		var lineColour=Render.colourToRGB(Render.colourToDark(planet_wars.powerupColours[powerup_type]));
	var bgColour=Render.colourToRGB(planet_wars.powerupColours[powerup_type]);
	}
	
			
	Render.viewports[vp].canvas.fillStyle=bgColour;
    Render.viewports[vp].canvas.fillRect((pos[0]-planet_wars.powerUpRadius-Render.viewports[vp].x)*Render.viewports[vp].zoom , (pos[1]-planet_wars.powerUpRadius-Render.viewports[vp].y)*Render.viewports[vp].zoom , planet_wars.powerUpRadius*2*Render.viewports[vp].zoom , planet_wars.powerUpRadius*2*Render.viewports[vp].zoom);

	Render.viewports[vp].canvas.strokeStyle=lineColour;
	Render.viewports[vp].canvas.lineWidth=2;
    Render.viewports[vp].canvas.strokeRect((pos[0]-planet_wars.powerUpRadius-Render.viewports[vp].x)*Render.viewports[vp].zoom , (pos[1]-planet_wars.powerUpRadius-Render.viewports[vp].y)*Render.viewports[vp].zoom , planet_wars.powerUpRadius*2*Render.viewports[vp].zoom , planet_wars.powerUpRadius*2*Render.viewports[vp].zoom);
	
	switch(powerup_type)
	{
		default:
			
			break;
	}
}

Render.drawShield=function(pos,vp)
{
	if (planet_wars.canUseRadialGrads) 
	{
		var grad = Render.viewports[vp].canvas.createRadialGradient(pos[0], pos[1], planet_wars.shipRadius, pos[0], pos[1], planet_wars.shipRadius * 2.5);
		
		grad.addColorStop(0, "rgb(0,0,0)");
		grad.addColorStop(1, "rgb(0,255,0)");
		
		Render.viewports[vp].canvas.beginPath();
		Render.viewports[vp].canvas.fillStyle = grad;
		Render.viewports[vp].canvas.arc(pos[0], pos[1], planet_wars.shipRadius * 2, 0, Math.PI * 2, true);
		Render.viewports[vp].canvas.fill();
	}
	else 
	{
		Render.viewports[vp].canvas.beginPath();
		Render.viewports[vp].canvas.strokeStyle = "rgb(0,255,0)";
		Render.viewports[vp].canvas.lineWidth = 2;
		Render.viewports[vp].canvas.moveTo((pos[0] - Render.viewports[vp].x + planet_wars.shipRadius * 2) * Render.viewports[vp].zoom, (pos[1] - Render.viewports[vp].y) * Render.viewports[vp].zoom);
		Render.viewports[vp].canvas.arc((pos[0] - Render.viewports[vp].x) * Render.viewports[vp].zoom, (pos[1] - Render.viewports[vp].y) * Render.viewports[vp].zoom, planet_wars.shipRadius * 2 * Render.viewports[vp].zoom, 0, Math.PI * 2, true);
		Render.viewports[vp].canvas.stroke();
	}
}

// [x,y] , graphic for ship , viewport
Render.drawShip=function(pos,colour,graphic,vp,angle)
{
	switch(graphic)
	{
		case false:
			//blank out old ship
			Render.viewports[vp].canvas.beginPath();
		    Render.viewports[vp].canvas.fillStyle="rgb(0,0,0)";
			Render.viewports[vp].canvas.moveTo((pos[0]-Render.viewports[vp].x+planet_wars.shipRadius*1.2)*Render.viewports[vp].zoom, (pos[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		    Render.viewports[vp].canvas.arc((pos[0]-Render.viewports[vp].x)*Render.viewports[vp].zoom,(pos[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom,planet_wars.shipRadius*1.2*Render.viewports[vp].zoom,0,Math.PI*2,true);
		    Render.viewports[vp].canvas.fill();
			break;
		case 1:
		 //draw circle
			Render.viewports[vp].canvas.beginPath();
		    Render.viewports[vp].canvas.fillStyle=colour;
		    Render.viewports[vp].canvas.moveTo((pos[0]-Render.viewports[vp].x+planet_wars.shipRadius)*Render.viewports[vp].zoom, (pos[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		    Render.viewports[vp].canvas.arc((pos[0]-Render.viewports[vp].x)*Render.viewports[vp].zoom,(pos[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom,planet_wars.shipRadius*Render.viewports[vp].zoom,0,Math.PI*2,true);
		    Render.viewports[vp].canvas.fill();
			break;
		case 0:
		
		var r=planet_wars.shipRadius;	
		var tempPos=new Array(2);
		
		tempPos[0]=pos[0]+Math.cos(angle)*r*0.1;
		tempPos[1]=pos[1]+Math.sin(angle)*r*0.1;
		
		Render.viewports[vp].canvas.strokeStyle = "black";
		Render.viewports[vp].canvas.lineWidth = r/8
		Render.viewports[vp].canvas.lineCap = 'round';
		
		var belowExhast = [tempPos[0] + Math.cos(angle + Math.PI * 0.9) * r * 0.75, tempPos[1] + Math.sin(angle + Math.PI * 0.9) * r * 0.75];
		var aboveExhast = [tempPos[0] + Math.cos(angle - Math.PI * 0.9) * r * 0.75, tempPos[1] + Math.sin(angle - Math.PI * 0.9) * r * 0.75];
		
		var nose = [tempPos[0] + Math.cos(angle) * r, tempPos[1] + Math.sin(angle) * r];
		
		
		var bodyFunc = function()
		{
			//bottom of body
			//above exhast
			Render.viewports[vp].canvas.moveTo((belowExhast[0] - Render.viewports[vp].x) * Render.viewports[vp].zoom, (belowExhast[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom)
			
			Render.viewports[vp].canvas.bezierCurveTo((tempPos[0] + Math.cos(angle + Math.PI * 0.6) * r * 1.3 - Render.viewports[vp].x) * Render.viewports[vp].zoom, (tempPos[1] + Math.sin(angle + Math.PI * 0.6) * r * 1.3-Render.viewports[vp].y)*Render.viewports[vp].zoom, (tempPos[0] + Math.cos(angle + Math.PI * 0.2) * r-Render.viewports[vp].x)*Render.viewports[vp].zoom, (tempPos[1] + Math.sin(angle + Math.PI * 0.2) * r-Render.viewports[vp].y)*Render.viewports[vp].zoom, (nose[0]-Render.viewports[vp].x)*Render.viewports[vp].zoom, (nose[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom);
			//front
			Render.viewports[vp].canvas.bezierCurveTo((tempPos[0] + Math.cos(angle - Math.PI * 0.2) * r-Render.viewports[vp].x)*Render.viewports[vp].zoom, (tempPos[1] + Math.sin(angle - Math.PI * 0.2) * r-Render.viewports[vp].y)*Render.viewports[vp].zoom, (tempPos[0] + Math.cos(angle - Math.PI * 0.6) * r * 1.3-Render.viewports[vp].x)*Render.viewports[vp].zoom, (tempPos[1] + Math.sin(angle - Math.PI * 0.6) * r * 1.3-Render.viewports[vp].y)*Render.viewports[vp].zoom, (aboveExhast[0]-Render.viewports[vp].x)*Render.viewports[vp].zoom, (aboveExhast[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom);
			Render.viewports[vp].canvas.lineTo((belowExhast[0]-Render.viewports[vp].x)*Render.viewports[vp].zoom, (belowExhast[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom);
			
			//Render.viewports[vp].canvas.bezierCurveTo( tempPos[0]+Math.cos(angle+Math.PI*0.25)*r , tempPos[1]+Math.sin(angle+Math.PI*0.25)*r , tempPos[0]+Math.cos(angle+Math.PI*0.75)*r*2 , tempPos[1]+Math.sin(angle+Math.PI*0.75)*r*2  , tempPos[0]+Math.cos(angle+Math.PI*0.9)*r , tempPos[1]+Math.sin(angle+Math.PI*0.9)*r)
		}
		
		var finFunc = function()
		{
			Render.viewports[vp].canvas.moveTo((belowExhast[0] + Math.cos(angle) * r * 0.5-Render.viewports[vp].x)*Render.viewports[vp].zoom, (belowExhast[1] + Math.sin(angle) * r * 0.5-Render.viewports[vp].y)*Render.viewports[vp].zoom);
			Render.viewports[vp].canvas.arc((belowExhast[0]-Render.viewports[vp].x)*Render.viewports[vp].zoom, (belowExhast[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom, r * 0.5*Render.viewports[vp].zoom, angle, angle + Math.PI * 0.8, false)
			Render.viewports[vp].canvas.lineTo((belowExhast[0]-Render.viewports[vp].x)*Render.viewports[vp].zoom, (belowExhast[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom);
			
			Render.viewports[vp].canvas.moveTo((aboveExhast[0] + Math.cos(angle) * r * 0.5-Render.viewports[vp].x)*Render.viewports[vp].zoom, (aboveExhast[1] + Math.sin(angle) * r * 0.5-Render.viewports[vp].y)*Render.viewports[vp].zoom);
			Render.viewports[vp].canvas.arc((aboveExhast[0]-Render.viewports[vp].x)*Render.viewports[vp].zoom, (aboveExhast[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom, r * 0.5*Render.viewports[vp].zoom, angle, angle - Math.PI * 0.8, true)
			Render.viewports[vp].canvas.lineTo((aboveExhast[0]-Render.viewports[vp].x)*Render.viewports[vp].zoom, (aboveExhast[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		}
		
		var flame1Func = function()
		{
			Render.viewports[vp].canvas.moveTo((belowExhast[0]-Render.viewports[vp].x)*Render.viewports[vp].zoom, (belowExhast[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom);
			Render.viewports[vp].canvas.quadraticCurveTo((tempPos[0] + Math.cos(angle + Math.PI * 0.9) * r-Render.viewports[vp].x)*Render.viewports[vp].zoom, (tempPos[1] + Math.sin(angle + Math.PI * 0.9) * r-Render.viewports[vp].y)*Render.viewports[vp].zoom, (tempPos[0] + Math.cos(angle + Math.PI) * r * 1.2-Render.viewports[vp].x)*Render.viewports[vp].zoom, (tempPos[1] + Math.sin(angle + Math.PI) * r * 1.2-Render.viewports[vp].y)*Render.viewports[vp].zoom)
			Render.viewports[vp].canvas.quadraticCurveTo((tempPos[0] + Math.cos(angle - Math.PI * 0.9) * r-Render.viewports[vp].x)*Render.viewports[vp].zoom, (tempPos[1] + Math.sin(angle - Math.PI * 0.9) * r-Render.viewports[vp].y)*Render.viewports[vp].zoom, (aboveExhast[0]-Render.viewports[vp].x)*Render.viewports[vp].zoom, (aboveExhast[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom)
		}
		
		var flame2Func = function()
		{
			Render.viewports[vp].canvas.moveTo((belowExhast[0] + Math.cos(angle - Math.PI / 2) * r * 0.1-Render.viewports[vp].x)*Render.viewports[vp].zoom, (belowExhast[1] + Math.sin(angle - Math.PI / 2) * r * 0.1-Render.viewports[vp].y)*Render.viewports[vp].zoom);
			Render.viewports[vp].canvas.quadraticCurveTo((tempPos[0] + Math.cos(angle + Math.PI * 0.9) * r * 0.9-Render.viewports[vp].x)*Render.viewports[vp].zoom, (tempPos[1] + Math.sin(angle + Math.PI * 0.9) * r * 0.9-Render.viewports[vp].y)*Render.viewports[vp].zoom, (tempPos[0] + Math.cos(angle + Math.PI) * r * 1.1-Render.viewports[vp].x)*Render.viewports[vp].zoom, (tempPos[1] + Math.sin(angle + Math.PI) * r * 1.1-Render.viewports[vp].y)*Render.viewports[vp].zoom)
			Render.viewports[vp].canvas.quadraticCurveTo((tempPos[0] + Math.cos(angle - Math.PI * 0.9) * r * 0.9-Render.viewports[vp].x)*Render.viewports[vp].zoom, (tempPos[1] + Math.sin(angle - Math.PI * 0.9) * r * 0.9-Render.viewports[vp].y)*Render.viewports[vp].zoom, (aboveExhast[0] + Math.cos(angle + Math.PI / 2) * r * 0.1-Render.viewports[vp].x)*Render.viewports[vp].zoom, (aboveExhast[1] + Math.sin(angle + Math.PI / 2) * r * 0.1-Render.viewports[vp].y)*Render.viewports[vp].zoom)
		}
		
		Render.viewports[vp].canvas.fillStyle = colour;
		Render.viewports[vp].canvas.beginPath()
		finFunc();
		Render.viewports[vp].canvas.fill();
		
		Render.viewports[vp].canvas.beginPath()
		finFunc();
		Render.viewports[vp].canvas.stroke();
		
		Render.viewports[vp].canvas.fillStyle = "rgb(255,255,0)";
		Render.viewports[vp].canvas.beginPath()
		flame1Func();
		Render.viewports[vp].canvas.fill();
		
		Render.viewports[vp].canvas.fillStyle = "rgb(255,128,0)";
		Render.viewports[vp].canvas.beginPath()
		flame2Func();
		Render.viewports[vp].canvas.fill();
		
		
		Render.viewports[vp].canvas.fillStyle = colour;
		Render.viewports[vp].canvas.beginPath();
		bodyFunc();
		Render.viewports[vp].canvas.fill()
		
		
		Render.viewports[vp].canvas.beginPath();
		bodyFunc();
		Render.viewports[vp].canvas.stroke();
		
		Render.viewports[vp].canvas.fillStyle = "rgb(132,132,0)"
		Render.viewports[vp].canvas.beginPath();
		Render.viewports[vp].canvas.arc((tempPos[0] + Math.cos(angle) * r * 0.3-Render.viewports[vp].x)*Render.viewports[vp].zoom, (tempPos[1] + Math.sin(angle) * r * 0.3-Render.viewports[vp].y)*Render.viewports[vp].zoom, r * 0.2*Render.viewports[vp].zoom, 0, Math.PI * 2, false);
		
		Render.viewports[vp].canvas.fill();
		
		Render.viewports[vp].canvas.beginPath();
		//Render.viewports[vp].canvas.moveTo(tempPos[0]+Math.cos(angle)*r*0.3 + r*0.2 , tempPos[1]+Math.sin(angle)*r*0.3)
		
		Render.viewports[vp].canvas.arc((tempPos[0] + Math.cos(angle) * r * 0.3-Render.viewports[vp].x)*Render.viewports[vp].zoom, (tempPos[1] + Math.sin(angle) * r * 0.3-Render.viewports[vp].y)*Render.viewports[vp].zoom, r * 0.2*Render.viewports[vp].zoom, 0, Math.PI * 2, false);
		
		Render.viewports[vp].canvas.stroke();
		break;
	}
               
    
}


Render.drawCross=function(pos,colour,r,vp)
{
	Render.viewports[vp].canvas.save();
	
	//cross them out
	
	Render.viewports[vp].canvas.strokeStyle=colour;
	Render.viewports[vp].canvas.lineWidth=2;
	Render.viewports[vp].canvas.beginPath();
	Render.viewports[vp].canvas.moveTo((pos[0]-r-Render.viewports[vp].x)*Render.viewports[vp].zoom , (pos[1]-r-Render.viewports[vp].y)*Render.viewports[vp].zoom);
	Render.viewports[vp].canvas.lineTo((pos[0]+r-Render.viewports[vp].x)*Render.viewports[vp].zoom , (pos[1]+r-Render.viewports[vp].y)*Render.viewports[vp].zoom);
	Render.viewports[vp].canvas.moveTo((pos[0]-r-Render.viewports[vp].x)*Render.viewports[vp].zoom , (pos[1]+r-Render.viewports[vp].y)*Render.viewports[vp].zoom);
	Render.viewports[vp].canvas.lineTo((pos[0]+r-Render.viewports[vp].x)*Render.viewports[vp].zoom , (pos[1]-r-Render.viewports[vp].y)*Render.viewports[vp].zoom);
	Render.viewports[vp].canvas.stroke();
	Render.viewports[vp].canvas.restore();
}

Render.colourToRGB=function(colour)
{
	return "rgb("+parseInt(colour.substring(0,2),16)+","+parseInt(colour.substring(2,4),16)+","+parseInt(colour.substring(4,6),16)+")";
}

Render.colourToRGBArray=function(colour)
{
	return [parseInt(colour.substring(0,2),16),parseInt(colour.substring(2,4),16),parseInt(colour.substring(4,6),16)];
}

Render.colourToBright=function(colour)
{
	return Render.colourChangeBy(colour,128);
}

Render.colourToDark=function(colour)
{
	return Render.colourChangeBy(colour,-128);
}



//takes the hex-code string and changes its brightness by changeBy
Render.colourChangeBy=function(colour,changeBy)
{
	var newColour = "";
	for (var i = 0; i < 3; i++)
	{
		var tempColour=putInRange(parseInt(colour.substring(i*2, i*2+2), 16) + changeBy, 0, 255).toString(16);
		newColour += tempColour.length == 1 ? "0"+tempColour : tempColour;
	}
	return newColour;
}



//draw the missile on the second canvas and its trail on the first
Render.drawMissile=function(vp)
{
	/*
	if(typeof(vp)=="undefined")
	{
		vp=0;
	}
	*/
	
	var i=planet_wars.liveMissile;
    //check for alive to make sure missile dissapears because this is run after missile dies
    if(planet_wars.objects[i].physics.alive)
    {
        planet_wars.objects[i].pos=planet_wars.objects[i].physics.pos;
        
        //build up array of all the moves
        planet_wars.objects[i].positions.push(planet_wars.objects[i].pos);
		
		
		if (planet_wars.frameSkip==1 || planet_wars.objects[i].positions.length - planet_wars.objects[i].lastPosDrawn >= planet_wars.frameSkip) 
		{
			//draw if not skipping this frame
			
			if (planet_wars.graphicsLevel > 1) 
			{
				//draw the trail as the missile moves
				Render.viewports[vp].canvas.beginPath();
				Render.viewports[vp].canvas.lineWidth = 1.5;
				Render.viewports[vp].canvas.strokeStyle = Render.colourToRGB(Render.colourToBright(planet_wars.players[planet_wars.objects[i].player].colour));
				for (var k = planet_wars.objects[i].lastPosDrawn+1; k < planet_wars.objects[i].positions.length; k++) 
				{
					//alert(planet_wars.objects[i].positions)
					Render.viewports[vp].canvas.moveTo((planet_wars.objects[i].positions[k-1][0] + 0.5 - Render.viewports[vp].x) * Render.viewports[vp].zoom, (planet_wars.objects[i].positions[k-1][1] + 0.5 - Render.viewports[vp].y) * Render.viewports[vp].zoom);
					Render.viewports[vp].canvas.lineTo((planet_wars.objects[i].positions[k][0] + 0.5 - Render.viewports[vp].x) * Render.viewports[vp].zoom, (planet_wars.objects[i].positions[k][1] + 0.5 - Render.viewports[vp].y) * Render.viewports[vp].zoom);
				}
				Render.viewports[vp].canvas.stroke();
				planet_wars.objects[i].lastPosDrawn=planet_wars.objects[i].positions.length-1;
			}
			
			if (planet_wars.objects[i].missileType === 0 && planet_wars.graphicsLevel > 2 && Math.random() < 0.5) 
			{
				//powerup red matter running and full animations enabled - leave behind a trail of red 'sparks'
				
				var tempAngle = Math.random() * Math.PI * 0.4 - Math.PI * 0.2 + Math.atan2(planet_wars.objects[i].oldPos[1] - planet_wars.objects[i].pos[1], planet_wars.objects[i].oldPos[0] - planet_wars.objects[i].pos[0]);
				
				var tempPos = [(planet_wars.objects[i].pos[0] - Render.viewports[1].x + Math.cos(tempAngle) * planet_wars.missileImageRadius * 2) * Render.viewports[1].zoom, (planet_wars.objects[i].pos[1] - Render.viewports[1].y + Math.sin(tempAngle) * planet_wars.missileImageRadius * 2) * Render.viewports[1].zoom];
				
				
				//(pos,angle,length,distance,spins,startAngle,stages,thick,startColour,endColour)
				
				var clockWise = (Math.random() < 0.5);
				
				planet_wars.anyTimeAnimation.MakeSpinningStick(tempPos, tempAngle, planet_wars.missileImageRadius * 2 * Render.viewports[vp].zoom, planet_wars.missileImageRadius * 5, 5, Math.random() * Math.PI * 2, 20, 2, [255, 0, 0, 1], [255, 255, 0, 0], clockWise);
				
			}
			
			//draw the blob on the animation canvas
			Render.viewports[1].canvas.clearRect(0, 0, Render.viewports[1].width, Render.viewports[1].height);
			Render.viewports[1].canvas.beginPath();
			Render.viewports[1].canvas.fillStyle = Render.colourToRGB(planet_wars.players[planet_wars.objects[i].player].colour);
			Render.viewports[1].canvas.arc((planet_wars.objects[i].pos[0] - Render.viewports[1].x) * Render.viewports[1].zoom, (planet_wars.objects[i].pos[1] - Render.viewports[1].y) * Render.viewports[1].zoom, planet_wars.missileImageRadius * Render.viewports[1].zoom, 0, Math.PI * 2, true);
			Render.viewports[1].canvas.fill();
			
			planet_wars.objects[i].oldPos = planet_wars.objects[i].pos;
			
			//only draw green lines if graphics level high enough
			if (planet_wars.graphicsLevel > 0) 
			{
				for (var i2 = 0; i2 < planet_wars.objects.length; i2++) 
				{
					if (planet_wars.objects[i2].type == 3 && Math.pow(planet_wars.objects[i2].pos[0] - planet_wars.objects[i].pos[0], 2) + Math.pow(planet_wars.objects[i2].pos[1] - planet_wars.objects[i].pos[1], 2) < Math.pow(planet_wars.objects[i2].r * planet_wars.spaceStationLineRatio, 2)) 
					{
						//if close to a space station draw a green line between it and the missile
						Render.viewports[1].canvas.beginPath();
						Render.viewports[1].canvas.lineWidth = 2;
						Render.viewports[1].canvas.strokeStyle = "rgb(0,255,0)";
						Render.viewports[1].canvas.moveTo((planet_wars.objects[i2].pos[0] + planet_wars.objects[i2].r / 3 - Render.viewports[1].x) * Render.viewports[1].zoom, (planet_wars.objects[i2].pos[1] - planet_wars.objects[i2].r / 3 - Render.viewports[1].y) * Render.viewports[1].zoom);
						Render.viewports[1].canvas.lineTo((planet_wars.objects[i].pos[0] + 0.5 - Render.viewports[1].x) * Render.viewports[1].zoom, (planet_wars.objects[i].pos[1] + 0.5 - Render.viewports[1].y) * Render.viewports[1].zoom);
						Render.viewports[1].canvas.stroke();
					}
				}
			}
			
			
		}

    }
    else
    {
        //the missile has just died
        //if(planet_wars.graphicsLevel<=1)
        //{
			/*        
            Render.viewports[vp].canvas.beginPath();
            Render.viewports[vp].canvas.lineWidth=1.5;
            Render.viewports[vp].canvas.strokeStyle=Render.colourToRGB(Render.colourToBright(planet_wars.players[planet_wars.objects[i].player].colour));
            
            Render.viewports[vp].canvas.moveTo((planet_wars.objects[i].positions[0][0]+0.5-Render.viewports[vp].x)*Render.viewports[vp].zoom , (planet_wars.objects[i].positions[0][1]+0.5-Render.viewports[vp].y)*Render.viewports[vp].zoom);
            
            for(var i2=1;i2<planet_wars.objects[i].positions.length;i2++)
            {
                Render.viewports[vp].canvas.lineTo((planet_wars.objects[i].positions[i2][0]+0.5-Render.viewports[vp].x)*Render.viewports[vp].zoom , (planet_wars.objects[i].positions[i2][1]+0.5-Render.viewports[vp].y)*Render.viewports[vp].zoom);
            }
            Render.viewports[vp].canvas.stroke();
            */
			//draw the trail as the missile moves
			Render.viewports[vp].canvas.beginPath();
			Render.viewports[vp].canvas.lineWidth = 1.5;
			Render.viewports[vp].canvas.strokeStyle = Render.colourToRGB(Render.colourToBright(planet_wars.players[planet_wars.objects[i].player].colour));
			for (var k = planet_wars.objects[i].lastPosDrawn+1; k < planet_wars.objects[i].positions.length; k++) 
			{
				//alert(planet_wars.objects[i].positions)
				Render.viewports[vp].canvas.moveTo((planet_wars.objects[i].positions[k-1][0] + 0.5 - Render.viewports[vp].x) * Render.viewports[vp].zoom, (planet_wars.objects[i].positions[k-1][1] + 0.5 - Render.viewports[vp].y) * Render.viewports[vp].zoom);
				Render.viewports[vp].canvas.lineTo((planet_wars.objects[i].positions[k][0] + 0.5 - Render.viewports[vp].x) * Render.viewports[vp].zoom, (planet_wars.objects[i].positions[k][1] + 0.5 - Render.viewports[vp].y) * Render.viewports[vp].zoom);
			}
			Render.viewports[vp].canvas.stroke();
			
			planet_wars.objects[i].lastPosDrawn=planet_wars.objects[i].positions.length-1;
       // }
    }
    
	
	if(typeof(planet_wars.missileAnimation)!=="undefined" && planet_wars.missileAnimation.AnimationsRunning())
	{
		planet_wars.missileAnimation.loop(planet_wars.missileAnimation,planet_wars.missileDrawCount%planet_wars.missileDrawAnimation!==0);
	}
	
	if(typeof(planet_wars.anyTimeAnimation)!=="undefined" && planet_wars.anyTimeAnimation.AnimationsRunning())
	{
		planet_wars.anyTimeAnimation.loop(planet_wars.anyTimeAnimation,planet_wars.missileDrawCount%planet_wars.missileDrawAnimation!==0);
	}
	
	planet_wars.missileDrawCount++;
}



//draws the barings circle around the ship who is currently aiming
Render.drawAim=function()
{
    Render.viewports[1].canvas.clearRect(0,0,Render.viewports[1].width,Render.viewports[1].height);
    
   
    
    var tempX=planet_wars.objects[planet_wars.players[planet_wars.whosGo].ship].pos[0];
    var tempY=planet_wars.objects[planet_wars.players[planet_wars.whosGo].ship].pos[1];
    
	//blot out out ship on canvas underneath by darwing a black circle on this canvas
	Render.drawShip(planet_wars.objects[planet_wars.players[planet_wars.whosGo].ship].pos,"rgb(0,0,0)",false,1,0);
	/*
	Render.viewports[1].canvas.beginPath();
    Render.viewports[1].canvas.fillStyle="rgb(0,0,0)";
    Render.viewports[1].canvas.arc((tempX-Render.viewports[1].x)*Render.viewports[1].zoom , (tempY-Render.viewports[1].y)*Render.viewports[1].zoom , planet_wars.shipRadius*Render.viewports[1].zoom , 0 , Math.PI*2 , true);
    Render.viewports[1].canvas.fill();
	*/
	
    Render.viewports[1].canvas.beginPath();
    Render.viewports[1].canvas.fillStyle="rgba(32,32,32,0.85)";
    Render.viewports[1].canvas.arc((tempX-Render.viewports[1].x)*Render.viewports[1].zoom , (tempY-Render.viewports[1].y)*Render.viewports[1].zoom , 100*Render.viewports[1].zoom , 0 , Math.PI*2 , true);
    Render.viewports[1].canvas.fill();
    
    Render.viewports[1].canvas.beginPath();
    Render.viewports[1].canvas.lineWidth=1;
    Render.viewports[1].canvas.strokeStyle="rgba(255,255,255,0.75)";
    Render.viewports[1].canvas.moveTo((tempX+100-Render.viewports[1].x)*Render.viewports[1].zoom , (tempY-Render.viewports[1].y)*Render.viewports[1].zoom);
    Render.viewports[1].canvas.arc((tempX-Render.viewports[1].x)*Render.viewports[1].zoom , (tempY-Render.viewports[1].y)*Render.viewports[1].zoom , 100*Render.viewports[1].zoom , 0 , Math.PI*2 , true);
    //vertical line through ship
    Render.viewports[1].canvas.moveTo(Math.ceil((tempX-Render.viewports[1].x)*Render.viewports[1].zoom)-0.5 , Math.ceil((tempY-110-Render.viewports[1].y)*Render.viewports[1].zoom)-0.5);
    Render.viewports[1].canvas.lineTo(Math.ceil((tempX-Render.viewports[1].x)*Render.viewports[1].zoom)-0.5 , Math.ceil((tempY+110-Render.viewports[1].y)*Render.viewports[1].zoom)-0.5);
    //horizontal
    Render.viewports[1].canvas.moveTo(Math.ceil((tempX-110-Render.viewports[1].x)*Render.viewports[1].zoom)-0.5 , Math.ceil((tempY-Render.viewports[1].y)*Render.viewports[1].zoom)-0.5);
    Render.viewports[1].canvas.lineTo(Math.ceil((tempX+110-Render.viewports[1].x)*Render.viewports[1].zoom)-0.5 , Math.ceil((tempY-Render.viewports[1].y)*Render.viewports[1].zoom)-0.5);
    Render.viewports[1].canvas.stroke();
    
    //draw numbers, 000, 090, 180, 270 around edges of compas thing
    
    //left
    Render.drawText('270',(tempX-120-Render.viewports[1].x)*Render.viewports[1].zoom,(tempY-Render.viewports[1].y)*Render.viewports[1].zoom,10,false,"rgb(255,255,255)",1);
    //top
    Render.drawText('000',(tempX-Render.viewports[1].x)*Render.viewports[1].zoom,(tempY-120-Render.viewports[1].y)*Render.viewports[1].zoom,10,false,"rgb(255,255,255)",1);
    //right
    Render.drawText('090',(tempX+120-Render.viewports[1].x)*Render.viewports[1].zoom,(tempY-Render.viewports[1].y)*Render.viewports[1].zoom,10,false,"rgb(255,255,255)",1);
    //bottom
    Render.drawText('180',(tempX-Render.viewports[1].x)*Render.viewports[1].zoom,(tempY+120-Render.viewports[1].y)*Render.viewports[1].zoom,10,false,"rgb(255,255,255)",1);
    
	
	
	
	
    
    var tempColour=Render.colourToRGB(planet_wars.players[planet_wars.whosGo].colour);
    
    var count=0;
    //draw old goes - 5 small circles, each more transparent than the last
    for(var i=planet_wars.players[planet_wars.whosGo].goes.length-1;i>planet_wars.players[planet_wars.whosGo].goes.length-5 && i>=0;i--)
    {
        var tempAngle=planet_wars.players[planet_wars.whosGo].goes[i][0];
		//planet_wars.baringToRadian(planet_wars.players[planet_wars.whosGo].goes[i][0]);
        var tempSpeed=planet_wars.players[planet_wars.whosGo].goes[i][1];

        Render.viewports[1].canvas.beginPath();
        Render.viewports[1].canvas.fillStyle="rgba("+tempColour.substr(4,tempColour.length-5)+","+(1 - 0.2*count)+")";
        Render.viewports[1].canvas.arc((tempX+Math.cos(tempAngle)*tempSpeed-Render.viewports[1].x)*Render.viewports[1].zoom , (tempY+Math.sin(tempAngle)*tempSpeed-Render.viewports[1].y)*Render.viewports[1].zoom , 2 , 0 , Math.PI*2 , true);
        Render.viewports[1].canvas.fill();
        
        count++;
    }
    
  	//draw arrow for current aim
    var safeStuff=planet_wars.santiseFireBox(true);
    var tempAngle=planet_wars.baringToRadian(safeStuff[0]);
    var tempSpeed=safeStuff[1];
    
	//draw ship ontop
    
    Render.drawShip([tempX,tempY],Render.colourToRGB(planet_wars.players[planet_wars.whosGo].colour),planet_wars.objects[planet_wars.players[planet_wars.whosGo].ship].graphic,1,tempAngle);
	
    Render.viewports[1].canvas.save();
    Render.viewports[1].canvas.beginPath();
    Render.viewports[1].canvas.lineWidth=1;
    Render.viewports[1].canvas.lineCap="round";
    Render.viewports[1].canvas.strokeStyle=Render.colourToRGB(Render.colourToBright(planet_wars.players[planet_wars.whosGo].colour));//"rgba(255,255,255,0.8)";
    //edge of ship
    Render.viewports[1].canvas.moveTo((tempX + Math.cos(tempAngle)*planet_wars.shipRadius - Render.viewports[1].x)*Render.viewports[1].zoom , (tempY + Math.sin(tempAngle)*planet_wars.shipRadius - Render.viewports[1].y)*Render.viewports[1].zoom )
    //end of arrow
    Render.viewports[1].canvas.lineTo((tempX + Math.cos(tempAngle)*tempSpeed - Render.viewports[1].x)*Render.viewports[1].zoom , (tempY + Math.sin(tempAngle)*tempSpeed - Render.viewports[1].y)*Render.viewports[1].zoom )
    //left of arrowhead
    Render.viewports[1].canvas.moveTo((tempX + Math.cos(tempAngle-Math.PI/32)*tempSpeed*0.91 - Render.viewports[1].x)*Render.viewports[1].zoom , (tempY + Math.sin(tempAngle-Math.PI/32)*tempSpeed*0.91 - Render.viewports[1].y)*Render.viewports[1].zoom )
    //end of arrow
    Render.viewports[1].canvas.lineTo((tempX + Math.cos(tempAngle)*tempSpeed - Render.viewports[1].x)*Render.viewports[1].zoom , (tempY + Math.sin(tempAngle)*tempSpeed - Render.viewports[1].y)*Render.viewports[1].zoom )
    //right of arrowhead
    Render.viewports[1].canvas.lineTo((tempX + Math.cos(tempAngle+Math.PI/32)*tempSpeed*0.91 - Render.viewports[1].x)*Render.viewports[1].zoom , (tempY + Math.sin(tempAngle+Math.PI/32)*tempSpeed*0.91 - Render.viewports[1].y)*Render.viewports[1].zoom )
    
    Render.viewports[1].canvas.stroke();
    
}

	
//x,y centre coords, h=height, u=upside down, c=colour.  All in pixels
Render.drawText=function(text,x,y,h,u,c,vp)
  {
	
        if(u)
        {
        h*=-1
        }
        t=Math.round(Math.abs(h/14));
        w=h/2;
        w2=h/4;
        w4=h/8;
        h2=h/2;
        h4=h/4;
        //h=h;
        
        
        for(var l=0;l<text.length;l++)
        {
            var tempX= x - w*1.35*(text.length-1)/2 + w*1.35*l;
            Render.drawLetter(text.substr(l,1),tempX,y,t,w,w2,w4,h2,h4,h,vp,c,u);
        }
  
	}
  
Render.drawLetter=function(letter,x,y,t,w,w2,w4,h2,h4,h,vp,c,u)
{
	Render.viewports[vp].canvas.save();
	Render.viewports[vp].canvas.beginPath();
	Render.viewports[vp].canvas.lineWidth=t
  Render.viewports[vp].canvas.lineCap='round'
	Render.viewports[vp].canvas.lineJoin='round'
	Render.viewports[vp].canvas.strokeStyle=c;

	switch(letter)
	  {
		case 'A':
		  Render.viewports[vp].canvas.moveTo(x-w2 , y+h2)//bottom left
			Render.viewports[vp].canvas.lineTo(x , y-h2)//top point
			Render.viewports[vp].canvas.lineTo(x+w2 , y+h2)//bottom right
			Render.viewports[vp].canvas.moveTo(Render.tidy(x-w4,t) , Render.tidy(y,t))//part left middle
			Render.viewports[vp].canvas.lineTo(Render.tidy(x+w4,t) , Render.tidy(y,t))//part right middle
		break;
		case 'J':
		  Render.viewports[vp].canvas.moveTo(Render.tidy(x-w2,t) , Render.tidy(y-h2,t))//top left
			Render.viewports[vp].canvas.lineTo(Render.tidy(x+w2,t) , Render.tidy(y-h2,t))//top right
			Render.viewports[vp].canvas.moveTo(Render.tidy(x,t) , Render.tidy(y-h2,t))//middle of top
			Render.viewports[vp].canvas.lineTo(Render.tidy(x,t) , Render.tidy(y+h4+h/8,t))//near middle of bottom
			Render.viewports[vp].canvas.arc(x-w4 , y+h4+h/8 , Math.abs(h/8) , 0+(u?Math.PI:0) , Math.PI+(u?Math.PI:0) , false);
		break;
		case 'Q':
		  Render.viewports[vp].canvas.arc(x , y-h4 , Math.abs(h4) , 0+(u?Math.PI:0) , Math.PI+(u?Math.PI:0) , true);
			Render.viewports[vp].canvas.lineTo(x-w2 , y+h4)
			Render.viewports[vp].canvas.arc(x , y+h4 , Math.abs(h4) , Math.PI+(u?Math.PI:0) , 0+(u?Math.PI:0) , true);
			Render.viewports[vp].canvas.lineTo(x+w2 , y-h4)
			Render.viewports[vp].canvas.moveTo(x,y)
			Render.viewports[vp].canvas.lineTo(x+w2 , y+h2)
		break;
		case 'K':
		  Render.viewports[vp].canvas.moveTo(Render.tidy(x-w2,t) , Render.tidy(y-h2,t));//top left
			Render.viewports[vp].canvas.lineTo(Render.tidy(x-w2,t) , Render.tidy(y+h2,t));//bottom left
			Render.viewports[vp].canvas.moveTo(x+w2 , y-h2);//top right
			Render.viewports[vp].canvas.lineTo(Render.tidy(x-w2,t) , y);//centre left
			Render.viewports[vp].canvas.lineTo(x+w2 , y+h2);//bottom right
		break;
    case '0':
    /*
			Render.viewports[vp].canvas.moveTo(x+w2 , y-h4-h/8);//near top right
			Render.viewports[vp].canvas.arc(x+w4 , y-h4-h/8 , Math.abs(h/8) , 0+(u?Math.PI:0) , Math.PI+(u?Math.PI:0) , true);
			Render.viewports[vp].canvas.lineTo(x , y+h4+h/8);
			Render.viewports[vp].canvas.arc(x+w4 , y+h4+h/8 , Math.abs(h/8) , Math.PI+(u?Math.PI:0) , 0+(u?Math.PI:0) , true);
			Render.viewports[vp].canvas.lineTo(x+w2 , y-h4-h/8);
        */

		  Render.viewports[vp].canvas.arc((x) , y-h4 , (Math.abs(h4)) , Math.PI +(u?Math.PI:0) , 0+(u?Math.PI:0) , false)
		  Render.viewports[vp].canvas.arc((x) , y+h4 , (Math.abs(h4)) , 0 +(u?Math.PI:0) , Math.PI+(u?Math.PI:0) , false)
      Render.viewports[vp].canvas.lineTo(x-w2 , y-h4);
		break;
    case '1':
		    Render.viewports[vp].canvas.moveTo(Render.tidy(x,t) , Render.tidy(y-h2,t));//top left
			Render.viewports[vp].canvas.lineTo(Render.tidy(x,t) , Render.tidy(y+h2,t));//bottom left
	  break;
		case '2':
    Render.viewports[vp].canvas.arc(x , y-h4 , Math.abs(h4) , Math.PI +(u?Math.PI:0) , Math.PI/4+(u?Math.PI:0) , false)
			Render.viewports[vp].canvas.lineTo(Render.tidy(x-w2,t) , Render.tidy(y+h2,t))//bottom left
			Render.viewports[vp].canvas.lineTo(Render.tidy(x+w2,t) , Render.tidy(y+h2,t))//bottom right
		  /*
		  Render.viewports[vp].canvas.moveTo(x+w2 , y+h2)//bottom right
			Render.viewports[vp].canvas.lineTo(x-w2 , y+h2)//bottom left
			Render.viewports[vp].canvas.lineTo(x+w2 , y-h4)//mid top right
			Render.viewports[vp].canvas.arc(x , y-h4 , Math.abs(h4) , 0+(u?Math.PI:0) , Math.PI +(u?Math.PI:0) , true)
			*/
		break;
		case '3':
		  Render.viewports[vp].canvas.moveTo(x-w2 , y+h4)//mid bottom left
			Render.viewports[vp].canvas.arc(x , y+h4 , Math.abs(h4) , Math.PI+(u?Math.PI:0) , -Math.PI/2+(u?Math.PI:0) , true)
			Render.viewports[vp].canvas.arc(x , y-h4 , Math.abs(h4) , Math.PI/2+(u?Math.PI:0) , Math.PI+(u?Math.PI:0) , true)
		break;
		case '4':
		  Render.viewports[vp].canvas.moveTo(Render.tidy(x+w2,t) , Render.tidy(y+h4,t))//right
			Render.viewports[vp].canvas.lineTo(Render.tidy(x-w2,t) , Render.tidy(y+h4,t))//left
			Render.viewports[vp].canvas.lineTo(Render.tidy(x+w4,t) , Render.tidy(y-h2,t))//top
			Render.viewports[vp].canvas.lineTo(Render.tidy(x+w4,t) , Render.tidy(y+h2,t))//bottom
		break;
		case '5':
		  //Render.viewports[vp].canvas.moveTo(x + Math.cos(-Math.PI*3/4+(u?Math.PI:0))*h4 , y+h4 + Math.sin (Math.PI*3/4+(u?Math.PI:0))*h4)
		  Render.viewports[vp].canvas.arc(x , y+h4 , Math.abs(h4) , Math.PI*3/4+(u?Math.PI:0) , -Math.PI*3/4+(u?Math.PI:0) , true);
			Render.viewports[vp].canvas.lineTo(x+ Math.cos(-Math.PI*3/4+(u?Math.PI:0))*Math.abs(h4)  , Render.tidy(y-h2,t));//near left top
			Render.viewports[vp].canvas.lineTo(Render.tidy(x+w2,t) , Render.tidy(y-h2,t));//top right
		break;
		case '6':
		  Render.viewports[vp].canvas.arc(x , y-h4 , Math.abs(h4) , 0+(u?Math.PI:0) , Math.PI+(u?Math.PI:0) , true);
			Render.viewports[vp].canvas.lineTo( x-w2 , y+h4)
			Render.viewports[vp].canvas.moveTo(x+Math.cos(0)*Math.abs(h4) , y+h4)
			Render.viewports[vp].canvas.arc(x , y+h4 , Math.abs(h4) , 0 , Math.PI*2 , false)
		break;
		case '7':
		  Render.viewports[vp].canvas.moveTo(Render.tidy(x-w2,t) , Render.tidy(y-h2,t));//top left
			Render.viewports[vp].canvas.lineTo(Render.tidy(x+w2,t) , Render.tidy(y-h2,t));//top right
			Render.viewports[vp].canvas.lineTo(x-w2 , y+h2);//bottom left
		break;
		case '8':
		  Render.viewports[vp].canvas.moveTo(x+Math.abs(h4) , y-h4);
		  Render.viewports[vp].canvas.arc(x , y-h4 , Math.abs(h4) , 0 , Math.PI*2 , false)
			Render.viewports[vp].canvas.moveTo(x+Math.abs(h4) , y+h4);
		  Render.viewports[vp].canvas.arc(x , y+h4 , Math.abs(h4) , 0 , Math.PI*2 , false)
		break;
		case '9':
		  Render.viewports[vp].canvas.arc(x , y+h4 , Math.abs(h4) , Math.PI+(u?Math.PI:0) , 0+(u?Math.PI:0) , true);
//			Render.viewports[vp].canvas.moveTo(x+w2 , y+h4)
			Render.viewports[vp].canvas.lineTo(x+w2 , y-h4)
			Render.viewports[vp].canvas.moveTo(x+Math.cos(0)*Math.abs(h4) , y-h4)
			Render.viewports[vp].canvas.arc(x , y-h4 , Math.abs(h4) , 0 , Math.PI*2 , false)
		break;
		}
	
	Render.viewports[vp].canvas.stroke();
	Render.viewports[vp].canvas.restore();
}
  
//rounds to make a 1 width line sharp on the canvas
Render.tidy=function(xy,t)
  {
	return Math.floor(xy)+(t%2==0 ? 0:0.5);
	}