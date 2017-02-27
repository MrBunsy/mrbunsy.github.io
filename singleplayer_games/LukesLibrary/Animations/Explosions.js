/* 
 * Copyright Luke Wallin 2012
 */


LukesAnimations.FancyExplosionlet=function(pos,startR,endR,startInnerColour,endInnerColour,startOuterColour,endOuterColour,stages)
{
    this.pos=pos;
    this.startR=startR;
    this.endR=endR;

    this.stages=stages;
    this.stage=0;
	
    this.dR=(this.endR-this.startR)/this.stages;
	
    //this.dInnerR=this.dR/2;
    //this.dOuterR=this.dR;
	
    this.startInnerColour = startInnerColour;
    this.endInnerColour = endInnerColour;
    this.dInnerColour = [(this.endInnerColour.r - this.startInnerColour.r) / this.stages, (this.endInnerColour.g - this.startInnerColour.g) / this.stages, (this.endInnerColour.b - this.startInnerColour.b) / this.stages, (this.endInnerColour.a - this.startInnerColour.a) / this.stages];
	
    this.startOuterColour = startOuterColour;
    this.endOuterColour = endOuterColour;
    this.dOuterColour = [(this.endOuterColour.r - this.startOuterColour.r) / this.stages, (this.endOuterColour.g - this.startOuterColour.g) / this.stages, (this.endOuterColour.b - this.startOuterColour.b) / this.stages, (this.endOuterColour.a - this.startOuterColour.a) / this.stages];
	
    this.drawNext = function(ctx,controller)
    {
        if (this.startR + this.dR * this.stage > 0) 
        {
            ctx.save();
            var grad = ctx.createRadialGradient(this.pos.x, this.pos.y, (this.startR + this.dR * this.stage) / 2, this.pos.x, this.pos.y, (this.startR + this.dR * this.stage));
            
            
            grad.addColorStop(0, "rgba(" + Math.round(this.startInnerColour.r + this.dInnerColour[0] * this.stage) + "," + Math.round(this.startInnerColour.g + this.dInnerColour[1] * this.stage) + "," + Math.round(this.startInnerColour.b + this.dInnerColour[2] * this.stage) + "," + (this.startInnerColour.a + this.dInnerColour[3] * this.stage) + ")");
            grad.addColorStop(1, "rgba(" + Math.round(this.startOuterColour.r + this.dOuterColour[0] * this.stage) + "," + Math.round(this.startOuterColour.g + this.dOuterColour[1] * this.stage) + "," + Math.round(this.startOuterColour.b + this.dOuterColour[2] * this.stage) + "," + (this.startOuterColour.a + this.dOuterColour[3] * this.stage) + ")");
			
            ctx.beginPath();
            ctx.fillStyle = grad;
            //ctx.fillStyle="rgb(0,0,0)";
            ctx.arc(this.pos.x, this.pos.y, this.startR + this.dR * this.stage, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();
			
        }
	
        this.stage++;
		
        return (this.stage >= this.stages);
    }
}

LukesAnimations.BoxShattering=function(pos,impactPos,width,height,startColour,endColour)
{
    this.pos=pos;
    //impactPos is relative to pos;
    this.impactPos=impactPos;
    this.width=width;
    this.height=height;

	
    this.stages=1;
    this.stage=0;
	
    this.startColour=startColour;
    this.endColour=endColour;
	
    this.spins=3;
    this.stickStages=60;
    this.thick=2;
	
    this.drawNext = function(ctx,controller)
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
            var tempAngle=Math.random()*Math.PI*0.4 -Math.PI*0.2 +   Math.atan2(positions[i][1]-this.impactPos.y , positions[i][0]-this.impactPos.x);
						
            var tempDist=positions[i][2]*2+Math.random()*positions[i][2]*3
            controller.add(new LukesAnimations.SpinningStick(new Vector(this.pos.x-positions[i][0] , this.pos.y-positions[i][1]),tempAngle,positions[i][2],tempDist,Math.ceil(Math.random()*this.spins+1),positions[i][3],this.stickStages,this.thick,this.startColour,this.endColour,(Math.random()<0.5)));

        }		
		
		
		
        this.stage++;
        return (this.stage >= this.stages);
    }
}
//note: expects colour as [r,g,b,a]
LukesAnimations.SpinningStick=function(pos,angle,length,distance,spins,startAngle,stages,thick,startColour,endColour,clockWise)
{
    this.pos=pos;
    this.length=length;
    //angle is for path of spinning stick
    this.angle=angle;
    this.distance=distance;
    //thickenss of line
    this.thick=thick;

	
    this.stages=stages;
    this.stage=0;
	
    this.clockWise=clockWise;
	
    //this is for the angle of the stick itself
    this.startAngle=startAngle;
	
    var finishAngle=this.startAngle+Math.PI*2*spins*(clockWise ? 1 : -1);
	
    this.dA=(finishAngle-this.startAngle)/stages;
	
    var finishPos=new Vector(this.pos.x+Math.cos(this.angle)*this.distance , this.pos.y+Math.sin(this.angle)*this.distance);
	
	
    this.dx=(finishPos.x-this.pos.x)/this.stages;
    this.dy=(finishPos.y-this.pos.y)/this.stages;
	
    this.startColour = startColour;
    this.endColour = endColour;
	
    this.dColour = [(endColour[0] - startColour[0]) / stages, (endColour[1] - startColour[1]) / stages, (endColour[2] - startColour[2]) / stages, (endColour[3] - startColour[3]) / stages];
	
    this.drawNext = function(ctx,controller)
    {
        ctx.save();
        
        var style= "rgba(" + Math.round(this.startColour[0] + this.dColour[0] * this.stage) + "," + Math.round(this.startColour[1] + this.dColour[1] * this.stage) + "," + Math.round(this.startColour[2] + this.dColour[2] * this.stage) + "," + (this.startColour[3] + this.dColour[3] * this.stage) + ")";
        
        ctx.strokeStyle = style;
        ctx.beginPath();
        ctx.lineWidth=this.thick;
        ctx.lineCap="round";
		
        var tempAngle=this.startAngle+this.dA*this.stage;
        var tempDx=Math.cos(tempAngle)*this.length/2;
        var tempDy=Math.sin(tempAngle)*this.length/2;
        ctx.moveTo(this.pos.x+this.dx*this.stage+tempDx , this.pos.y+this.dy*this.stage+tempDy);
        ctx.lineTo(this.pos.x+this.dx*this.stage-tempDx , this.pos.y+this.dy*this.stage-tempDy);
		
        ctx.stroke();
	ctx.restore();

        this.stage++;

        return (this.stage >= this.stages);
    }
}




//rougly place a mini grey explosion


LukesAnimations.SmokePuff=function(pos,angle,size,stages)
{
    this.pos=pos;
    this.angle=angle;
    this.size=size;
    this.stages=stages;
    this.stage=0;
	
    this.plonkMiniExplosion=function(pos,wibble,controller)
    {
        wibble*=Math.random()*0.5;
        pos.x+=Math.cos(Math.random()*Math.PI*2)*wibble;
        pos.y+=Math.sin(Math.random()*Math.PI*2)*wibble;//wibble/2-Math.random()*wibble;
		
        var lastFor=4*this.stages/2
        //this.animationObject.MakeExplosionParticle(pos, 0, this.size/2, [200, 128 + Math.random() * 128, 128, 1], [255,255,255,0], lastFor);
        controller.add(new LukesAnimations.ExplosionParticle(pos, 0, this.size/2,  new Colour(200, 128 + Math.random() * 128, 128, 1), new Colour(255,255,255,0), lastFor));
    }
    this.dLength=this.size/this.stages;
    this.dWibble=this.size/(this.stages*2);
	
    this.drawNext=function(ctx,controller)
    {
        var blobs=6;
		
        //var dTempLength=this.dLength*stages/blobs;
		
        var tempPos=new Vector(this.pos.x+Math.cos(this.angle)*this.dLength*this.stage , this.pos.y+Math.sin(this.angle)*this.dLength*this.stage);
        var tempWibble=this.dWibble*this.stage;
		
        for(var i=0;i<blobs;i++)
        {
            this.plonkMiniExplosion(tempPos,tempWibble,controller);
        }
		
        this.stage++
        return (this.stage >= this.stages);
    }
}

LukesAnimations.MushroomCloud=function(pos,angle,size,stages,simple)
{
    this.pos=pos;
    this.angle=angle;
    this.size=size;
    this.stages=stages;
    this.stage=0;
	
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
	
    this.plonkMiniExplosion=function(pos,wibble,controller)
    {
        wibble*=Math.random()*0.5;
        pos.x+=Math.cos(Math.random()*Math.PI*2)*wibble;
        pos.y+=Math.sin(Math.random()*Math.PI*2)*wibble;//wibble/2-Math.random()*wibble;
		
        var lastFor=this.stages/2
        //this.animationObject.MakeExplosionParticle(pos, 0, this.size/5, [255, 128 + Math.random() * 128, 0, 1], [255,255,255,0], lastFor);
        controller.add(new LukesAnimations.ExplosionParticle(pos, 0, this.size/5, new Colour(255, 128 + Math.random() * 128, 0, 1), new Colour(255,255,255,0), lastFor));
    }
    
    
	
    this.drawNext=function(ctx,controller)
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
			
            var tempPos=new Vector(this.pos.x+Math.cos(this.angle-Math.PI/2)*dWidth*i , this.pos.y+Math.sin(this.angle-Math.PI/2)*dWidth*i);
			
            this.plonkMiniExplosion(tempPos,this.size/10,controller);
        }
		
        //right
        for(var i=0;i<numOfBlobs;i+=2)
        {
			
            var tempPos=new Vector(this.pos.x+Math.cos(this.angle+Math.PI/2)*dWidth*i , this.pos.y+Math.sin(this.angle+Math.PI/2)*dWidth*i);
			
            this.plonkMiniExplosion(tempPos,this.size/10,controller);
        }
		
        //up
        for(var i=0;i<numOfBlobs;i++)
        {
			
            var tempPos=new Vector(this.pos.x+Math.cos(this.angle)*dHeight*i , this.pos.y+Math.sin(this.angle)*dHeight*i);
			
            this.plonkMiniExplosion(tempPos,this.size/10,controller);
        }		
		
        if(this.stage+1 >= this.stages)
        {
            numOfBlobs*=3;
        }
		
        //top
        for(var i=0;i<numOfBlobs;i++)
        {
			
            var tempPos=new Vector(this.pos.x+Math.cos(this.angle)*height , this.pos.y+Math.sin(this.angle)*height);
			
            this.plonkMiniExplosion(tempPos,this.size/2,controller);
        }
		

			
        if(this.stage==0 || this.simple)
        {
            //first loop
            //bright flash
            controller.add(new LukesAnimations.ExplosionParticle(this.pos, 0, this.size/2, new Colour(255, 128 + Math.random() * 128, 0, 1), new Colour(255,255,255,0), this.stages/2));
        }
		
		
        this.stage++
        return (this.stage >= this.stages);
    }
}

LukesAnimations.ExplosionParticle = function(pos, startR, endR, startColour, endColour, stages)
{
    this.pos = pos;
    this.startR = startR;
    this.endR = endR;
	
    this.stages = stages;
    this.stage = 0;
	
    this.startColour = startColour;
    this.endColour = endColour;
	
    this.dColour = [(endColour.r - startColour.r) / stages, (endColour.g - startColour.g) / stages, (endColour.b - startColour.b) / stages, (endColour.a - startColour.a) / stages];
    this.dR = (endR - startR) / stages;
	
    this.drawNext = function(ctx,controller)
    {
        var tempR = this.startR + this.dR * this.stage;
        if (tempR > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.fillStyle = "rgba(" + Math.round(this.startColour.r + this.dColour[0] * this.stage) + "," + Math.round(this.startColour.g + this.dColour[1] * this.stage) + "," + Math.round(this.startColour.b + this.dColour[2] * this.stage) + "," + (this.startColour.a + this.dColour[3] * this.stage) + ")"
            ctx.moveTo(this.pos.x + tempR, this.pos.y);
            ctx.arc(this.pos.x, this.pos.y, tempR, 0, Math.PI * 2, true);
            ctx.fill();
            ctx.restore();
        }
		
		
        this.stage++
        return (this.stage >= this.stages);
    }
}

LukesAnimations.Explosion2 = function(pos, size)
{
    this.pos = pos;
    this.size = size;
	
    this.stages = 1;
    this.stage = 0;
	
    this.blobs=30;
	
    this.getExplosionColour = LukesAnimations.GetExplosionColour;
	
    this.drawNext = function(ctx,controller)
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
				
                var tempColour1 = new Colour(greyNess, greyNess, greyNess, 1);
                //grey
                var tempColour2 = new Colour(greyNess/2 , greyNess/2 , greyNess/2 , 0);
				
                //					tempColour1=[0,255,0,0]
				
                var tempA = Math.random() * Math.PI * 2;
                var tempPos = new Vector(this.pos.x + Math.cos(tempA) * tempR, this.pos.y + Math.sin(tempA) * tempR);
                controller.add(new LukesAnimations.ExplosionParticle(tempPos, 0, tempSize, tempColour1, tempColour2, tempStages));
			
			
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
                var tempColour2 = new Colour(196 + Math.random() * 128, 128 + Math.random() * 64, 0, 0);
				
				
                var tempA = Math.random() * Math.PI * 2;
                var tempPos = new Vector(this.pos.x + Math.cos(tempA) * tempR, this.pos.y + Math.sin(tempA) * tempR);
		
                controller.add(new LukesAnimations.ExplosionParticle(tempPos, 0, tempSize, tempColour1, tempColour2, tempStages));
            }

        }
		
		
        this.stage++
        return (this.stage >= this.stages);
    }
}

LukesAnimations.GetExplosionColour=function(alpha)
{
    switch (Math.floor(Math.random() * 3))
    {
        case 0:
            //red
            return new Colour(128 + Math.random() * 128, 0, 0, alpha);
            break;
        case 1:
            //yellow
            return new Colour(255, 128 + Math.random() * 128, 0, alpha);
            break;
        case 2:
            //orange
            return new Colour(128 + Math.random() * 128, Math.random() * 128, 0, alpha);
            break;
    }
}

LukesAnimations.Explosion=function(pos, size)
{
    this.pos = pos;
    this.size = size;
	
    this.stages = 5;
    this.stage = 0;
	
    this.getExplosionColour = LukesAnimations.GetExplosionColour;
	
    this.drawNext = function(ctx,controller)
    {
        for (var i = 0; i < 3; i++)
        {
            var tempR = Math.random() * this.size;
            var tempA = Math.random() * Math.PI * 2;
            var tempPos = new Vector(this.pos.x + Math.cos(tempA) * tempR, this.pos.y + Math.sin(tempA) * tempR);
            var tempStages = Math.round(5 + Math.random() * 10);
			
            var tempSize=this.size + Math.random()*this.size*2
			
            var tempColour1 = this.getExplosionColour(1);
			
            if (this.stage > this.stages / 2)
            {
                //fade to grey
                var tempColour2 = new Colour(Math.round(112 + Math.random() * 32), Math.round(112 + Math.random() * 32), Math.round(112 + Math.random() * 32), 0);
            }
            else
            {
                //go to explosion colour
                var tempColour2 = this.getExplosionColour(0);
            }
			
            controller.add(new LukesAnimations.ExplosionParticle(tempPos, 0, tempSize, tempColour1, tempColour2, tempStages));
        }
		
		
        this.stage++
		
        return (this.stage >= this.stages);
    }
}

//something has hit a force field, this is what happens
LukesAnimations.ForceFieldHit=function(pos,dir,colour,size){
    //dir is the dir the thing that hit it was travelling
    
    this.pos=pos;
    this.dir=dir.multiply(-1);
    this.angle=dir.get2DAngle();
    this.colour=colour;
    this.size=size;
    
    this.drawNext = function(ctx,controller){
        
        
        for(var i=0;i<4;i++){
            var pos=this.pos;
            var angle=this.angle + (-0.5 + Math.random())*Math.PI;
            var length = this.size*(0.5 + Math.random()*0.5);
            var distance=this.size*(0.5 + Math.random());
            var spins = Math.random()*2;
            var startAngle=Math.random()*Math.PI*2;
            var stages = 5 + Math.round(Math.random()*10);
            var thick = this.size*(0.1 + Math.random()*0.1);
            var startColour = [this.colour.r,this.colour.g,this.colour.b,1];
            var endColour = [this.colour.r,this.colour.g,this.colour.b,1];
            var clockWise = Math.random() > 0.5;
            controller.add(new LukesAnimations.SpinningStick(pos, angle, length, distance, spins, startAngle, stages, thick, startColour, endColour, clockWise));
        }
        
        
        
        //finish straight away
        return true;
    }
    
}