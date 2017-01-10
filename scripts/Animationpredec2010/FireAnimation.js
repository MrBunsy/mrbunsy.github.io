Animation.prototype.MakeFireParticle = function(pos, angle, mag, length, scale, phase, startR, endR, startColour, endColour, stages)
{
	this.animations.push(new AnimationFireParticle(pos, angle, mag, length, scale, phase, startR, endR, this.canvas, startColour, endColour, stages));
	this.start();
}

Animation.prototype.MakeFire=function(pos,size,rate,stages){
   this.animations.push(new AnimationFire(pos,size,this.canvas,this,rate,stages));
   this.start();
}

//circle, starts radius startR at pos, finishes radius endR after moving along sine wave of mag*sin(scale*t+phase) in direction angle
var AnimationFireParticle = function(pos, angle, mag, length, scale, phase, startR, endR, canvas, startColour, endColour, stages)
{
	this.pos = pos;
        this.angle=angle;
        this.length=length;
        this.mag=mag;
        this.scale=scale;
        this.phase=phase;
	this.startR = startR;
	this.endR = endR;
	this.canvas = canvas;

	this.stages = stages;
	this.stage = 0;

	this.startColour = startColour;
	this.endColour = endColour;

	this.dColour = [(endColour[0] - startColour[0]) / stages, (endColour[1] - startColour[1]) / stages, (endColour[2] - startColour[2]) / stages, (endColour[3] - startColour[3]) / stages];
	this.dR = (endR - startR) / stages;
        this.dLength=length / stages;

	this.drawNext = function()
	{
		var tempR = this.startR + this.dR * this.stage;
                var tempX = this.dLength*this.stage;
                var tempY = this.mag*Math.sin(tempX*this.scale + this.phase)
		if (tempR > 0) {
			this.canvas.save();
                        this.canvas.translate(this.pos[0],this.pos[1])
                        this.canvas.rotate(this.angle);
			this.canvas.beginPath();
			this.canvas.fillStyle = "rgba(" + Math.round(this.startColour[0] + this.dColour[0] * this.stage) + "," + Math.round(this.startColour[1] + this.dColour[1] * this.stage) + "," + Math.round(this.startColour[2] + this.dColour[2] * this.stage) + "," + (this.startColour[3] + this.dColour[3] * this.stage) + ")"
			this.canvas.moveTo(tempX + tempR,tempY);
			this.canvas.arc(tempX, tempY, tempR, 0, Math.PI * 2, true);
			this.canvas.fill();
			this.canvas.restore();
		}


		this.stage++
		return (this.stage >= this.stages);
	}
}

var AnimationFire=function(pos,size,canvas,animationObject,rate,stages){

    this.stages = stages;
    this.stage = 0;

    //how often (as stage%rate==0) to create a new fire particle
    this.rate=rate;

    this.pos=pos;
    this.size=size;
    this.stages=stages;
    this.animationObject=animationObject;

    this.drawNext = function()
	{
                if(this.stage%this.rate==0){
                    this.animationObject.MakeFireParticle([pos[0]+Math.random()*this.size/10,pos[1]+Math.random()*this.size/10], -3*Math.PI/8 - Math.random()*Math.PI/4, Math.random()*this.size/4, this.size, 0.05+Math.random()*0.1, Math.random()*2*Math.PI, Math.random()*this.size/8+this.size/8,  Math.random()*this.size/8+this.size/8, AnimationGetExplosionColour(0.5), [128,128,128,0], 20+Math.random()*10);
                }

		this.stage++
		return (this.stage >= this.stages);
	}
}