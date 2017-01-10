
//idea for hitting a powerup - the box shatters asteroids style - need another mini-class of spinning stick (set how many spins, what direction, how far, first and last colour)

Animation.prototype.MakeExplosion = function(pos, size)
{
	//animate an explosion
	this.animations.push(new AnimationExplosion(pos,size,this.canvas,this));
	this.start();

}

Animation.prototype.MakeExplosion2 = function(pos, size)
{
	//animate an explosion
	this.animations.push(new AnimationExplosion2(pos,size,this.canvas,this));
	this.start();
}

//a single circle of an explosion. colours are arrays: [r,g,b,a]
Animation.prototype.MakeExplosionParticle = function(pos, startR, endR, startColour, endColour, stages)
{
	this.animations.push(new AnimationExplosionParticle(pos, startR, endR, this.canvas, startColour, endColour, stages));
	this.start();
}

Animation.prototype.MakeDrawCross=function(pos,r,stages,colour)
{
	this.animations.push(new AnimationDrawCross(pos,r,stages,colour,this.canvas));
	this.start();
}

Animation.prototype.MakeMushroomCloud=function(pos,size,angle,stages,simple)
{
	this.animations.push(new AnimationMushroomCloud(pos,angle,size,this.canvas,stages,this,simple));
	this.start();
}

Animation.prototype.MakeSmokePuff=function(pos,angle,size,stages)
{
	this.animations.push(new AnimationSmokePuff(pos,angle,size,this.canvas,stages,this));
	this.start();
}

Animation.prototype.MakeSkiingRobot=function(pos,r,stages,startAngle)
{
	this.animations.push(new AnimationSkiingRobot(pos,r,stages,this.canvas,startAngle));
	this.start();
}

Animation.prototype.MakeSpinningStick=function(pos,angle,length,distance,spins,startAngle,stages,thick,startColour,endColour,clockWise)
{
	this.animations.push(new AnimationSpinningStick(pos,angle,length,distance,this.canvas,spins,startAngle,stages,thick,startColour,endColour,clockWise));
	this.start();
}

Animation.prototype.MakeBoxShattering=function(pos,impactPos,width,height,animationObject,startColour,endColour)
{
	this.animations.push(new AnimationBoxShattering(pos,impactPos,width,height,this.canvas,animationObject,startColour,endColour));
	this.start();
}

Animation.prototype.MakePlanetImplode=function(pos,r,animationObject)
{
	this.animations.push(new AnimationPlanetImplode(pos,r,this.canvas,animationObject));
	this.start();
}

Animation.prototype.MakeFancyExplosionlet=function(pos,startR,endR,startInnerColour,endInnerColour,startOuterColour,endOuterColour,stages)
{
	this.animations.push(new AnimationFancyExplosionlet(pos,startR,endR,this.canvas,startInnerColour,endInnerColour,startOuterColour,endOuterColour,stages));
	this.start();
}

Animation.prototype.MakeTextFadeUp=function(pos,finishPos,startTransparency,finishTransparency,text,size,colour,stages)
{
	this.animations.push(new AnimationTextFadeUp(pos,finishPos,startTransparency,finishTransparency,text,size,colour,stages));
	this.start();
}

var AnimationTextFadeUp=function(pos,finishPos,startTransparency,finishTransparency,text,size,colour,stages)
{
	this.pos=pos;
	this.finishPos=finishPos;
	this.colour=colour;
	this.text=text;
	this.size=size;
	//transparency is on a 0=transparent, 1=visible scale
	this.startTransparency=startTransparency;
	this.finishTransparency=finishTransparency;
	
	this.stages=stages;
	this.stage=0;
	
	this.dx=(this.finishPos[0]-this.pos[0])/this.stages;
	this.dy=(this.finishPos[1]-this.pos[1])/this.stages;
	
	this.dt=(this.finishTransparency - this.startTransparency)/this.stages;
	
	this.div = document.createElement("div");
	this.div.style.position="absolute";
	this.div.style.left=Math.round(this.pos[0])+"px";
	this.div.style.top=Math.round(this.pos[1])+"px";
	this.div.style.fontSize=this.size+"px";
	this.div.style.fontFamily="arial,sans-serif"
	this.div.innerHTML=this.text;
	this.div.style.color=colour;
	
	document.body.appendChild(this.div)

	
	this.drawNext = function(still)
	{
		this.div.style.left = Math.round(this.pos[0]+this.dx*this.stage)+"px";
		this.div.style.top = Math.round(this.pos[1]+this.dy*this.stage)+"px";
		
		var trans=this.startTransparency + this.dt*this.stage;
		
		if(trans > 1)
		{
			trans=1;
		}
		
		this.div.style.opacity =trans;
		
		//IE SUCKS
		trans=Math.round(trans*100);
		if(trans<1)
		{
			trans=1;
		}
		
		this.div.style.filter  = "alpha(opacity=" + trans + ")";
		
		if (!still) 
		{
			this.stage++;
		}
		
		if(this.stage >= this.stages)
		{
			//kill off the div
			var parent=this.div.parentNode;
			parent.removeChild(this.div);
			return true;
		}
		
		return false;
	}
}


var AnimationPlanetImplode=function(pos,r,canvas,animationObject)
{
	this.pos=pos;
	this.r=r;
	this.animationObject=animationObject;
	this.canvas=canvas;
	
	this.stages=20;
	this.stage=0;
	
	this.dInnerR=this.r/this.stages;
	this.dOuterR=this.r*2/this.stages;

	this.drawNext = function(still)
	{

		if(this.stage==0)
		{
			this.animationObject.MakeFancyExplosionlet(this.pos,0,this.r*2,[255,0,0,1],[255,128,0,1],[255,255,0,0],[255,255,0,0],this.stages/2)
		}
		
		if(this.stage==this.stages/2)
		{
			this.animationObject.MakeFancyExplosionlet(this.pos,this.r*2,0,[255,128,0,1],[255,192,192,0],[255,255,0,0],[255,255,0,0],this.stages/2-1)
		}
		
		if (!still) 
		{
			this.stage++;
		}
		return (this.stage >= this.stages);
	}
}

var AnimationFancyExplosionlet=function(pos,startR,endR,canvas,startInnerColour,endInnerColour,startOuterColour,endOuterColour,stages)
{
	this.pos=pos;
	this.startR=startR;
	this.endR=endR;
	this.canvas=canvas;

	this.stages=stages;
	this.stage=0;
	
	this.dR=(this.endR-this.startR)/this.stages;
	
	//this.dInnerR=this.dR/2;
	//this.dOuterR=this.dR;
	
	this.startInnerColour = startInnerColour;
	this.endInnerColour = endInnerColour;
	this.dInnerColour = [(this.endInnerColour[0] - this.startInnerColour[0]) / this.stages, (this.endInnerColour[1] - this.startInnerColour[1]) / this.stages, (this.endInnerColour[2] - this.startInnerColour[2]) / this.stages, (this.endInnerColour[3] - this.startInnerColour[3]) / this.stages];
	
	this.startOuterColour = startOuterColour;
	this.endOuterColour = endOuterColour;
	this.dOuterColour = [(this.endOuterColour[0] - this.startOuterColour[0]) / this.stages, (this.endOuterColour[1] - this.startOuterColour[1]) / this.stages, (this.endOuterColour[2] - this.startOuterColour[2]) / this.stages, (this.endOuterColour[3] - this.startOuterColour[3]) / this.stages];
	
	this.drawNext = function(still)
	{
		if (this.startR + this.dR * this.stage > 0) 
		{
			var grad = this.canvas.createRadialGradient(this.pos[0], this.pos[1], (this.startR + this.dR * this.stage) / 2, this.pos[0], this.pos[1], (this.startR + this.dR * this.stage));
			
			grad.addColorStop(0, "rgba(" + Math.round(this.startInnerColour[0] + this.dInnerColour[0] * this.stage) + "," + Math.round(this.startInnerColour[1] + this.dInnerColour[1] * this.stage) + "," + Math.round(this.startInnerColour[2] + this.dInnerColour[2] * this.stage) + "," + (this.startInnerColour[3] + this.dInnerColour[3] * this.stage) + ")");
			grad.addColorStop(1, "rgba(" + Math.round(this.startOuterColour[0] + this.dOuterColour[0] * this.stage) + "," + Math.round(this.startOuterColour[1] + this.dOuterColour[1] * this.stage) + "," + Math.round(this.startOuterColour[2] + this.dOuterColour[2] * this.stage) + "," + (this.startOuterColour[3] + this.dOuterColour[3] * this.stage) + ")");
			
			this.canvas.beginPath();
			this.canvas.fillStyle = grad;
			this.canvas.arc(this.pos[0], this.pos[1], this.startR + this.dR * this.stage, 0, Math.PI * 2, true);
			this.canvas.fill();
				
			
		}
	if (!still) 
		{
			this.stage++;
		}
		return (this.stage >= this.stages);
	}
}

var AnimationBoxShattering=function(pos,impactPos,width,height,canvas,animationObject,startColour,endColour)
{
	this.pos=pos;
	//impactPos is relative to pos;
	this.impactPos=impactPos;
	this.width=width;
	this.height=height;
	this.canvas=canvas;
	
	this.animationObject=animationObject;
	
	this.stages=1;
	this.stage=0;
	
	this.startColour=startColour;
	this.endColour=endColour;
	
	this.spins=3;
	this.stickStages=40;
	this.thick=2;
	
	this.drawNext = function()
	{
		//[xdiff, ydiff, length, startAngle]
		var positions=new Array();
		//top row leftmost
		positions.push([-this.width/3 , -this.height/2 , this.width/3,0]);
		//top row mid
		positions.push([0 , -this.height/2 , this.width/3,0]);
		//top row rightmost
		positions.push([this.width/3 , -this.height/2 , this.width/3,0]);
		
		//leftside topmost
		positions.push([-this.width/2 , -this.height/3 , this.width/3,Math.PI/2]);
		//leftside mid
		positions.push([-this.width/2 , 0 , this.width/3,Math.PI/2]);
		//leftside bottommost
		positions.push([-this.width/2 , this.height/3 , this.width/3,Math.PI/2]);
		
		//bottom row leftmost
		positions.push([-this.width/3 , this.height/2 , this.width/3,0]);
		//bottom row mid
		positions.push([0 , this.height/2 , this.width/3,0]);
		//bottom row rightmost
		positions.push([this.width/3 , this.height/2 , this.width/3,0]);
		
		
		//rightside topmost
		positions.push([this.width/2 , -this.height/3 , this.width/3,Math.PI/2]);
		//rightside mid
		positions.push([this.width/2 , 0 , this.width/3,Math.PI/2]);
		//rightside bottommost
		positions.push([this.width/2 , this.height/3 , this.width/3,Math.PI/2]);
		
		
		/*   _ _ _
		 *  |     |
		 *  |     |
		 * 	|_ _ _|
		 * 
		 */
		
		for(var i=0;i<positions.length;i++)
		{
			
			//angle between impact point and this stick
			var tempAngle=Math.random()*Math.PI*0.4 -Math.PI*0.2 +   Math.atan2(positions[i][1]-this.impactPos[1] , positions[i][0]-this.impactPos[0]);
						
			var tempDist=positions[i][2]*2+Math.random()*positions[i][2]*3
			
			this.animationObject.MakeSpinningStick([this.pos[0]-positions[i][0] , this.pos[1]-positions[i][1]],tempAngle,positions[i][2],tempDist,Math.ceil(Math.random()*this.spins+1),positions[i][3],this.stickStages,this.thick,this.startColour,this.endColour,(Math.random()<0.5))

		}		
		
		
		
		this.stage++;
		return (this.stage >= this.stages);
	}
}

var AnimationSpinningStick=function(pos,angle,length,distance,canvas,spins,startAngle,stages,thick,startColour,endColour,clockWise)
{
	this.pos=pos;
	this.length=length;
	//angle is for path of spinning stick
	this.angle=angle;
	this.distance=distance;
	//thickenss of line
	this.thick=thick;
	
	this.canvas=canvas;
	
	this.stages=stages;
	this.stage=0;
	
	this.clockWise=clockWise;
	
	//this is for the angle of the stick itself
	this.startAngle=startAngle;
	
	var finishAngle=this.startAngle+Math.PI*2*spins*(clockWise ? 1 : -1);
	
	this.dA=(finishAngle-this.startAngle)/stages;
	
	var finishPos=[this.pos[0]+Math.cos(this.angle)*this.distance , this.pos[1]+Math.sin(this.angle)*this.distance];
	
	
	this.dx=(finishPos[0]-this.pos[0])/this.stages;
	this.dy=(finishPos[1]-this.pos[1])/this.stages;
	
	this.startColour = startColour;
	this.endColour = endColour;
	
	this.dColour = [(endColour[0] - startColour[0]) / stages, (endColour[1] - startColour[1]) / stages, (endColour[2] - startColour[2]) / stages, (endColour[3] - startColour[3]) / stages];
	
	this.drawNext = function(still)
	{
		
		this.canvas.strokeStyle = "rgba(" + Math.round(this.startColour[0] + this.dColour[0] * this.stage) + "," + Math.round(this.startColour[1] + this.dColour[1] * this.stage) + "," + Math.round(this.startColour[2] + this.dColour[2] * this.stage) + "," + (this.startColour[3] + this.dColour[3] * this.stage) + ")"
		this.canvas.beginPath();
		this.canvas.lineWidth=this.thick;
		this.canvas.lineCap="round";
		
		var tempAngle=this.startAngle+this.dA*this.stage;
		var tempDx=Math.cos(tempAngle)*this.length/2;
		var tempDy=Math.sin(tempAngle)*this.length/2;
		this.canvas.moveTo(this.pos[0]+this.dx*this.stage+tempDx , this.pos[1]+this.dy*this.stage+tempDy);
		this.canvas.lineTo(this.pos[0]+this.dx*this.stage-tempDx , this.pos[1]+this.dy*this.stage-tempDy);
		
		this.canvas.stroke();
		
		
		if (!still) 
		{
			this.stage++;
		}
		return (this.stage >= this.stages);
	}
}

//make a little robot skii around a planet
var AnimationSkiingRobot=function(pos,r,stages,canvas,startAngle)
{
	this.pos=pos;
	this.r=r;
	
	this.botHeight=this.r/3;
	
	this.startAngle=startAngle;
	
	this.canvas=canvas;
	
	this.stages=stages;
	this.stage=0;
	
	//how many times to move the arms for skiing
	this.armMoves=10;
	this.armMove=0;
	
	this.dAngle=Math.PI*2/this.stages;
	
	this.stagesPerArmMove=this.stages/this.armMoves;
	
	this.armMax=Math.PI*0.5;
	this.armMin=-Math.PI*0.3
	this.dArm1Angle=(this.armMax-this.armMin)*2/(this.stagesPerArmMove);
	
	this.drawNext=function(still)
	{
		var tempAngle=this.startAngle+this.dAngle*this.stage;
		var tempPos=[pos[0]+Math.cos(tempAngle)*this.r , pos[1]+Math.sin(tempAngle)*this.r];
		
		var armStage=this.stage%this.stagesPerArmMove;
		
		if(armStage < this.stagesPerArmMove/2)
		{
			var tempArmAngle1=this.armMin+this.dArm1Angle*armStage/2;
			var tempArmAngle2=tempArmAngle1/2;
		}
		else
		{
			var tempArmAngle1=this.armMax-this.dArm1Angle*armStage/2;
			var tempArmAngle2=tempArmAngle1/2;
		}
		
		
		
		this.drawCookerBot(tempPos,tempAngle , tempArmAngle1,tempArmAngle2,0,0, this.botHeight , false);
		
		if (!still) 
		{
			this.stage++;
		}
		return (this.stage >= this.stages);
	}
	
	this.drawCookerBot=function(pos,angle,larm1,larm2,rarm1,rarm2,height,facingLeft)
	{
		//pos is the position of the very base of the bot
		//size is the height of the box bit
		// arm is the angle of the arm (relative to the whole arm stretched out forwards), l=left, r=right, 1=first segment, 2=second segment
		
		
		
		var faceLeft=facingLeft ? -1: 1;
		var faceRight=faceLeft*-1;
	
	
		larm1*=faceRight;
		larm2*=faceRight;
		
		rarm1*=faceRight;
		rarm2*=faceRight;
		
		//angles of 0 will result in arm facing out in front:
		larm1+=angle + faceLeft* Math.PI/2;
	//	larm2+=angle + faceLeft* Math.PI/2;
		larm2+=larm1
		rarm1+=angle + faceLeft* Math.PI/2;
		rarm2+=angle + faceLeft* Math.PI/2;
		
		//var faceLeft=facingLeft ? 1: 0;
		//var faceRight=facingLeft ? 0 : 1;
		
		var width=height*0.75;
		var skirtHeight=height*0.15;
		var skirtWidth=width*0.9;
		var antennaHeight=height*0.2;
		var armLength=width*0.5;
		var armBoxSize=width*0.35;
		var skiLength=height*1.2;
		var skiEndR=skiLength/8;
		var lineWidth=height/20;
		
		var stickLength=height;
		var stickRatio=0.2;
		
		var handR=lineWidth;
		
		
		
		canvas.lineWidth=lineWidth;
		
		var body=new Object();
		
		//body corners
		body.bottomLeft=[pos[0]+Math.cos(angle)*skirtHeight*2+Math.cos(angle-Math.PI/2)*width/2 , pos[1]+Math.sin(angle)*skirtHeight*2+Math.sin(angle-Math.PI/2)*width/2];
		body.bottomRight=[pos[0]+Math.cos(angle)*skirtHeight*2+Math.cos(angle+Math.PI/2)*width/2 , pos[1]+Math.sin(angle)*skirtHeight*2+Math.sin(angle+Math.PI/2)*width/2];
		body.topLeft=[pos[0]+Math.cos(angle-Math.PI/2)*width/2+Math.cos(angle)*(skirtHeight*2+height) , pos[1]+Math.sin(angle-Math.PI/2)*width/2+Math.sin(angle)*(skirtHeight*2+height)];
		body.topRight=[pos[0]+Math.cos(angle+Math.PI/2)*width/2+Math.cos(angle)*(skirtHeight*2+height) , pos[1]+Math.sin(angle+Math.PI/2)*width/2+Math.sin(angle)*(skirtHeight*2+height)];
		
		var antennaBase=[pos[0]+Math.cos(angle)*(skirtHeight*2+height) , pos[1]+Math.sin(angle)*(skirtHeight*2+height)];
		var antennaTop=[pos[0]+Math.cos(angle)*(skirtHeight*2+height+antennaHeight) , pos[1]+Math.sin(angle)*(skirtHeight*2+height+antennaHeight)];
		
		var wheelPos=[pos[0]+Math.cos(angle)*skirtHeight*0.25 , pos[1]+Math.sin(angle)*skirtHeight*0.25];
		
		var rightSkiEnd=[pos[0]+Math.cos(angle+faceRight*Math.PI/2)*skiLength/2 , pos[1]+Math.sin(angle+faceRight*Math.PI/2)*skiLength/2]
		var leftSkiBit=[pos[0]+Math.cos(angle+faceLeft*Math.PI/2)*(skiLength/2-skiEndR) , pos[1]+Math.sin(angle+faceLeft*Math.PI/2)*(skiLength/2-skiEndR)]
		var leftSkiCentre=[pos[0]+Math.cos(angle+faceLeft*Math.PI/2)*(skiLength/2) + Math.cos(angle)*skiEndR , pos[1]+Math.sin(angle+faceLeft*Math.PI/2)*(skiLength/2) + Math.sin(angle)*skiEndR];
		
		
		var armBox=new Object();
		
		//black box arm emergies from
		armBox.bottomLeft=[pos[0]+Math.cos(angle)*(skirtHeight*2+height/2-armBoxSize/2) + Math.cos(angle+faceLeft*Math.PI/2)*armBoxSize , pos[1]+Math.sin(angle)*(skirtHeight*2+height/2-armBoxSize/2) + Math.sin(angle+faceLeft*Math.PI/2)*armBoxSize]
		armBox.bottomRight=[pos[0]+Math.cos(angle)*(skirtHeight*2+height/2-armBoxSize/2) , pos[1]+Math.sin(angle)*(skirtHeight*2+height/2-armBoxSize/2)]
		armBox.topLeft=[pos[0]+Math.cos(angle)*(skirtHeight*2+height/2+armBoxSize/2) + Math.cos(angle+faceLeft*Math.PI/2)*armBoxSize , pos[1]+Math.sin(angle)*(skirtHeight*2+height/2+armBoxSize/2) + Math.sin(angle+faceLeft*Math.PI/2)*armBoxSize]
		armBox.topRight=[pos[0]+Math.cos(angle)*(skirtHeight*2+height/2+armBoxSize/2) , pos[1]+Math.sin(angle)*(skirtHeight*2+height/2+armBoxSize/2)]
		
		var armStart=[pos[0]+Math.cos(angle)*(skirtHeight*2+height/2) + Math.cos(angle+faceLeft*Math.PI/2)*armBoxSize/2 , pos[1]+Math.sin(angle)*(skirtHeight*2+height/2) + Math.sin(angle+faceLeft*Math.PI/2)*armBoxSize/2 ];
		
		var larm1Pos=[armStart[0] + Math.cos(larm1)*armLength , armStart[1] + Math.sin(larm1)*armLength];
		var larm2Pos=[larm1Pos[0] + Math.cos(larm2)*armLength , larm1Pos[1] + Math.sin(larm2)*armLength];
		var larmHandTop=[larm2Pos[0] + Math.cos(larm2-Math.PI/2)*handR*1, larm2Pos[1] + Math.sin(larm2-Math.PI/2)*handR*1];
		var larmHandBottom=[larm2Pos[0] + Math.cos(larm2+Math.PI/2)*handR*1 , larm2Pos[1] + Math.sin(larm2+Math.PI/2)*handR*1];
		
		if(!facingLeft)
		{
			stickRatio=1-stickRatio;
		}
		
		var stickTop=[larm2Pos[0] + Math.cos(larm2-Math.PI/2)*stickLength*(1-stickRatio), larm2Pos[1] + Math.sin(larm2-Math.PI/2)*stickLength*(1-stickRatio)];
		var stickBottom=[larm2Pos[0] + Math.cos(larm2+Math.PI/2)*stickLength*stickRatio, larm2Pos[1] + Math.sin(larm2+Math.PI/2)*stickLength*stickRatio];
		
		var skirtBox=new Object();
		
		skirtBox.bottomLeft=[pos[0]+Math.cos(angle)*skirtHeight + Math.cos(angle-Math.PI/2)*skirtWidth/2 , pos[1]+Math.sin(angle)*skirtHeight + Math.sin(angle-Math.PI/2)*skirtWidth/2];
		skirtBox.bottomRight=[pos[0]+Math.cos(angle)*skirtHeight + Math.cos(angle+Math.PI/2)*skirtWidth/2 , pos[1]+Math.sin(angle)*skirtHeight + Math.sin(angle+Math.PI/2)*skirtWidth/2];
		skirtBox.topLeft=[pos[0]+Math.cos(angle)*skirtHeight*2 + Math.cos(angle-Math.PI/2)*skirtWidth/2 , pos[1]+Math.sin(angle)*(skirtHeight*2+0.5) + Math.sin(angle-Math.PI/2)*skirtWidth/2];
		skirtBox.topRight=[pos[0]+Math.cos(angle)*skirtHeight*2 + Math.cos(angle+Math.PI/2)*skirtWidth/2 , pos[1]+Math.sin(angle)*(skirtHeight*2+0.5) + Math.sin(angle+Math.PI/2)*skirtWidth/2];	
		
		var drawBox=function(thisBox)
		{
			canvas.moveTo(thisBox.bottomLeft[0] , thisBox.bottomLeft[1]);
			canvas.lineTo(thisBox.topLeft[0] , thisBox.topLeft[1]);
			canvas.lineTo(thisBox.topRight[0] , thisBox.topRight[1]);
			canvas.lineTo(thisBox.bottomRight[0] , thisBox.bottomRight[1]);
			canvas.lineTo(thisBox.bottomLeft[0] , thisBox.bottomLeft[1]);
		}
		
		canvas.beginPath();
		canvas.strokeStyle="rgb(200,150,50)";
		canvas.lineCap="round";
		canvas.moveTo(antennaTop[0] , antennaTop[1]);
		canvas.lineTo(wheelPos[0] , wheelPos[1]);
		canvas.stroke();
		
		//draw grey wheel box thing at bottom
		canvas.beginPath();
		canvas.fillStyle="rgb(64,64,64)";
		drawBox(skirtBox);
		canvas.fill();
		
		canvas.beginPath();
		canvas.fillStyle="rgb(240,200,100)";
		drawBox(body);
		canvas.fill();
		
		canvas.beginPath();
		canvas.fillStyle="rgb(0,0,0)";
		drawBox(armBox);
		canvas.fill();
		
	
		/*
		canvas.beginPath();
		canvas.strokeStyle="rgb(200,150,50)";
		canvas.moveTo(antennaBase[0] , antennaBase[1]);
		canvas.lineTo(antennaTop[0] , antennaTop[1]);
		canvas.stroke();
		*/
		
		canvas.beginPath();
		canvas.fillStyle="rgb(200,150,50)";
		canvas.arc(antennaTop[0] , antennaTop[1] , lineWidth*1.5,0,Math.PI*2,true);
		canvas.fill();
		
		
		//wheel at the bottom
		canvas.beginPath();
		canvas.fillStyle="rgb(200,150,50)";
		canvas.arc(wheelPos[0] , wheelPos[1] , skirtHeight/4,0,Math.PI*2,true);
		canvas.fill();
		
		canvas.beginPath();
		canvas.fillStyle="rgb(0,0,0)";
		canvas.arc(wheelPos[0] , wheelPos[1] , lineWidth/2,0,Math.PI*2,true);
		canvas.fill();
		
		//ski
		canvas.beginPath();
		canvas.strokeStyle="rgb(200,150,50)";//"rgb(64,64,64)";
		canvas.moveTo(rightSkiEnd[0] , rightSkiEnd[1]);
		canvas.lineTo(leftSkiBit[0] , leftSkiBit[1]);
		canvas.arc(leftSkiCentre[0] , leftSkiCentre[1] , skiEndR , angle-Math.PI, angle+faceLeft*Math.PI/2 , !facingLeft);
		canvas.stroke();
		
		
		//stick!
		canvas.beginPath();
		canvas.strokeStyle="rgb(200,150,50)";
		canvas.moveTo(stickTop[0] , stickTop[1]);
		canvas.lineTo(stickBottom[0] , stickBottom[1]);
		canvas.stroke();
		
		
		
		//left arm
		canvas.beginPath();
		canvas.strokeStyle="rgb(200,150,50)";
		canvas.moveTo(armStart[0] , armStart[1]);
		canvas.lineTo(larm1Pos[0] , larm1Pos[1]);
		canvas.lineTo(larm2Pos[0] , larm2Pos[1]);
		canvas.stroke();
		
		//elbow joint
		canvas.beginPath();
		canvas.fillStyle="rgb(200,150,50)";
		canvas.arc(larm1Pos[0] , larm1Pos[1] , lineWidth*1.5,0,Math.PI*2,true);
		canvas.fill();
		
		//fingers
		canvas.beginPath();
		canvas.fillStyle="rgb(255,255,255)";
		canvas.arc(larm2Pos[0] , larm2Pos[1] , handR,0,Math.PI*2,true);
		canvas.arc(larmHandTop[0] , larmHandTop[1] , handR,0,Math.PI*2,true);
		canvas.arc(larmHandBottom[0] , larmHandBottom[1] , handR,0,Math.PI*2,true);	
		canvas.fill();
		
		canvas.beginPath();
		canvas.arc(larm2Pos[0] , larm2Pos[1] , handR*2 , larm2+faceLeft*Math.PI/2 , larm2+faceRight*Math.PI/2,facingLeft);
		canvas.fill();
	}
}

var AnimationDrawCross=function(pos,r,stages,colour,canvas)
{
	this.pos=pos;
	this.r=r;
	
	var tempStages=stages;
	if(tempStages%2 !== 0)
	{
		//not even, make even
		tempStages++;
	}
	
	this.stages=tempStages;
	this.stage=0;
	this.colour=colour;
	this.canvas=canvas;
	
	this.d=4*r/stages;
	
	this.drawNext=function()
	{
		
		this.canvas.save();
		this.canvas.strokeStyle=this.colour;
		this.canvas.lineWidth=2;
		this.canvas.beginPath();
		
		if(this.stage<this.stages/2)
		{
			//line top left to bottom right
			this.canvas.moveTo(this.pos[0]-this.r , this.pos[1]-this.r);
			this.canvas.lineTo(this.pos[0]-this.r+this.d*(this.stage+1) , this.pos[1]-this.r+this.d*(this.stage+1));
		}
		else
		{
			this.canvas.moveTo(this.pos[0]-this.r , this.pos[1]-this.r);
			this.canvas.lineTo(this.pos[0]+this.r , this.pos[1]+this.r);
			
			//top right to bottom left
			this.canvas.moveTo(this.pos[0]+this.r , this.pos[1]-this.r);
			this.canvas.lineTo(this.pos[0]+this.r-this.d*(this.stage-this.stages/2+1) , this.pos[1]-this.r+this.d*(this.stage-this.stages/2+1));
		}
		
		this.canvas.stroke();
		this.canvas.restore();
		
		this.stage++
		return (this.stage >= this.stages);
	}
	
}

//rougly place a mini grey explosion


var AnimationSmokePuff=function(pos,angle,size,canvas,stages,animationObject)
{
	this.pos=pos;
	this.angle=angle;
	this.size=size;
	this.canvas=canvas;
	this.stages=stages;
	this.stage=0;
	this.animationObject=animationObject;
	
	this.plonkMiniExplosion=function(pos,wibble)
	{
		wibble*=Math.random()*0.5;
		pos[0]+=Math.cos(Math.random()*Math.PI*2)*wibble;
		pos[1]+=Math.sin(Math.random()*Math.PI*2)*wibble;//wibble/2-Math.random()*wibble;
		
		var lastFor=4*this.stages/2
		this.animationObject.MakeExplosionParticle(pos, 0, this.size/2, [200, 128 + Math.random() * 128, 128, 1], [255,255,255,0], lastFor);
	}
	this.dLength=this.size/this.stages;
	this.dWibble=this.size/(this.stages*2);
	
	this.drawNext=function()
	{
		var blobs=6;
		
		//var dTempLength=this.dLength*stages/blobs;
		
		var tempPos=[this.pos[0]+Math.cos(this.angle)*this.dLength*this.stage , this.pos[1]+Math.sin(this.angle)*this.dLength*this.stage];
		var tempWibble=this.dWibble*this.stage;
		
		for(var i=0;i<blobs;i++)
		{
			this.plonkMiniExplosion(tempPos,tempWibble);
		}
		
		this.stage++
		return (this.stage >= this.stages);
	}
}

var AnimationMushroomCloud=function(pos,angle,size,canvas,stages,animationObject,simple)
{
	this.pos=pos;
	this.angle=angle;
	this.size=size;
	this.canvas=canvas;
	this.stages=stages;
	this.stage=0;
	this.animationObject=animationObject;
	
	this.simple=simple		
	
	
	//make stages divisible by 3
	while(this.stages%3!==0)
	{
		this.stages++;
	}
	
	if(this.simple)
	{
		this.stage=this.stages-1;
	}
	
	this.plonkMiniExplosion=function(pos,wibble)
	{
		wibble*=Math.random()*0.5;
		pos[0]+=Math.cos(Math.random()*Math.PI*2)*wibble;
		pos[1]+=Math.sin(Math.random()*Math.PI*2)*wibble;//wibble/2-Math.random()*wibble;
		
		var lastFor=this.stages/2
		this.animationObject.MakeExplosionParticle(pos, 0, this.size/5, [255, 128 + Math.random() * 128, 0, 1], [255,255,255,0], lastFor);
	}
	
	this.drawNext=function()
	{
		//stuff happens here for every loop
		/*
		if(this.stage < 2*this.stages/3)
		{
			//stuff happens here for first 2/3
	
		}
		
		if(this.stage < this.stages/3)
		{
			//stuff happens ehre for first 1/3
			
		}
		*/
		
		var numOfBlobs=6;
		//var width=this.size/10 + 2*this.stage*this.size/(this.stages*5);
		//var height=this.size/4 + 2*this.stage*this.size/(this.stages*2);
		
		var width=this.stage*this.size/(this.stages)/2;
		var height=this.stage*this.size/(this.stages);
		
		var dWidth=width/numOfBlobs;
		var dHeight=height/numOfBlobs
		
		//left
		for(var i=0;i<numOfBlobs;i+=2)
		{
			
			var tempPos=[this.pos[0]+Math.cos(this.angle-Math.PI/2)*dWidth*i , this.pos[1]+Math.sin(this.angle-Math.PI/2)*dWidth*i];
			
			this.plonkMiniExplosion(tempPos,this.size/10);
		}
		
		//right
		for(var i=0;i<numOfBlobs;i+=2)
		{
			
			var tempPos=[this.pos[0]+Math.cos(this.angle+Math.PI/2)*dWidth*i , this.pos[1]+Math.sin(this.angle+Math.PI/2)*dWidth*i];
			
			this.plonkMiniExplosion(tempPos,this.size/10);
		}
		
		//up
		for(var i=0;i<numOfBlobs;i++)
		{
			
			var tempPos=[this.pos[0]+Math.cos(this.angle)*dHeight*i , this.pos[1]+Math.sin(this.angle)*dHeight*i];
			
			this.plonkMiniExplosion(tempPos,this.size/10);
		}		
		
		if(this.stage+1 >= this.stages)
		{
			numOfBlobs*=3;
		}
		
		//top
		for(var i=0;i<numOfBlobs;i++)
		{
			
			var tempPos=[this.pos[0]+Math.cos(this.angle)*height , this.pos[1]+Math.sin(this.angle)*height];
			
			this.plonkMiniExplosion(tempPos,this.size/2);
		}
		

			
		if(this.stage==0 || this.simple)
		{
			//first loop
			//bright flash
			this.animationObject.MakeExplosionParticle(this.pos, 0, this.size/2, [255, 128 + Math.random() * 128, 0, 1], [255,255,255,0], this.stages/2);
		}
		
		
		this.stage++
		return (this.stage >= this.stages);
	}
}

var AnimationExplosionParticle = function(pos, startR, endR, canvas, startColour, endColour, stages)
{
	this.pos = pos;
	this.startR = startR;
	this.endR = endR;
	this.canvas = canvas;
	
	this.stages = stages;
	this.stage = 0;
	
	this.startColour = startColour;
	this.endColour = endColour;
	
	this.dColour = [(endColour[0] - startColour[0]) / stages, (endColour[1] - startColour[1]) / stages, (endColour[2] - startColour[2]) / stages, (endColour[3] - startColour[3]) / stages];
	this.dR = (endR - startR) / stages;
	
	this.drawNext = function()
	{
		var tempR = this.startR + this.dR * this.stage;
		if (tempR > 0) {
			this.canvas.save();
			this.canvas.beginPath();
			this.canvas.fillStyle = "rgba(" + Math.round(this.startColour[0] + this.dColour[0] * this.stage) + "," + Math.round(this.startColour[1] + this.dColour[1] * this.stage) + "," + Math.round(this.startColour[2] + this.dColour[2] * this.stage) + "," + (this.startColour[3] + this.dColour[3] * this.stage) + ")"
			this.canvas.moveTo(this.pos[0] + tempR, this.pos[1]);
			this.canvas.arc(this.pos[0], this.pos[1], tempR, 0, Math.PI * 2, true);
			this.canvas.fill();
			this.canvas.restore();
		}
		
		
		this.stage++
		return (this.stage >= this.stages);
	}
}

var AnimationExplosion2 = function(pos, size, canvas, animationObject)
{
	this.pos = pos;
	this.size = size;
	this.canvas = canvas;
	
	this.animationObject = animationObject;
	
	this.stages = 1;
	this.stage = 0;
	
	this.blobs=30;
	
	this.getExplosionColour = AnimationGetExplosionColour;
	
	this.drawNext = function()
	{
		//grey smoke with yellow explosions on top
		for(var i=0;i<this.blobs;i++)
		{
			if(i<this.blobs/2)
			{
				//later smoke
				var tempR = Math.random() * this.size;
				var tempStages = Math.round(10 + Math.random() * 15);
				var tempSize=this.size + Math.random()*this.size*2
				
				var greyNess=96 + Math.random() * 64;
				
				var tempColour1 = [greyNess, greyNess, greyNess, 1];
				//grey
				var tempColour2 = [greyNess/2 , greyNess/2 , greyNess/2 , 0];
				
//					tempColour1=[0,255,0,0]
				
				var tempA = Math.random() * Math.PI * 2;
				var tempPos = [this.pos[0] + Math.cos(tempA) * tempR, this.pos[1] + Math.sin(tempA) * tempR];
				this.animationObject.MakeExplosionParticle(tempPos, 0, tempSize, tempColour1, tempColour2, tempStages);
			
			
			}	
			else
			{
				//initial yellow bright explosion
				var tempR = Math.random() * this.size;
				var tempStages = Math.round(5 + Math.random() * 10);
				var tempSize=this.size/2 + Math.random()*this.size*2
				
				//yellow
				//var tempColour1 = [255, 128 + Math.random() * 128, 0, 1];
				var tempColour1 = this.getExplosionColour(1);
				//darker orange
				var tempColour2 = [196 + Math.random() * 128, 128 + Math.random() * 64, 0, 0];
				
				
				var tempA = Math.random() * Math.PI * 2;
				var tempPos = [this.pos[0] + Math.cos(tempA) * tempR, this.pos[1] + Math.sin(tempA) * tempR];
		
				this.animationObject.MakeExplosionParticle(tempPos, 0, tempSize, tempColour1, tempColour2, tempStages);
			}

		}
		
		
		this.stage++
		return (this.stage >= this.stages);
	}
}

var AnimationGetExplosionColour=function(alpha)
{
	switch (Math.floor(Math.random() * 3))
	{
		case 0:
			//red
			return [128 + Math.random() * 128, 0, 0, alpha];
			break;
		case 1:
			//yellow
			return [255, 128 + Math.random() * 128, 0, alpha];
			break;
		case 2:
			//orange
			return [128 + Math.random() * 128, Math.random() * 128, 0, alpha];
			break;
	}
}

var AnimationExplosion=function(pos, size, canvas, animationObject)
{
	this.pos = pos;
	this.size = size;
	this.canvas = canvas;
	
	this.animationObject=animationObject;
	
	this.stages = 5;
	this.stage = 0;
	
	this.getExplosionColour = AnimationGetExplosionColour;
	
	this.drawNext = function()
	{
		for (var i = 0; i < 3; i++)
		{
			var tempR = Math.random() * this.size;
			var tempA = Math.random() * Math.PI * 2;
			var tempPos = [this.pos[0] + Math.cos(tempA) * tempR, this.pos[1] + Math.sin(tempA) * tempR];
			var tempStages = Math.round(5 + Math.random() * 10);
			
			var tempSize=this.size + Math.random()*this.size*2
			
			var tempColour1 = this.getExplosionColour(1);
			
			if (this.stage > this.stages / 2)
			{
				//fade to grey
				var tempColour2 = [Math.round(112 + Math.random() * 32), Math.round(112 + Math.random() * 32), Math.round(112 + Math.random() * 32), 0];
			}
			else
			{
				//go to explosion colour
				var tempColour2 = this.getExplosionColour(0);
			}
			
			this.animationObject.MakeExplosionParticle(tempPos, 0, tempSize, tempColour1, tempColour2, tempStages);
		}
		
		
		this.stage++
		
		return (this.stage >= this.stages);
	}
}