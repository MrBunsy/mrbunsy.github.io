//Animation class

var Animation = function(clearCanvasFunc,finishedAnimating,canvas,autoLoop,extraLoop)
{
	this.canvas=canvas;
	
	this.animations = new Array();
	
	this.framePeriod = 50;
	
	//does this object deal with the drawing, or is loop() called from elsewhere?
	this.autoLoop=autoLoop;
	
	//function to be called at the end of loop, optional
	if(typeof(extraLoop)=="function")
	{
		this.extraLoop=extraLoop;
	}
	else
	{
		this.extraLoop=function(){};
	}
	
	//overide this to clear canvas between each frame
	this.clearCanvas=clearCanvasFunc;

//	 = function(){	}
	
	//ovverride this to detect when animations have finished
	this.finishedAnimating=finishedAnimating;
//	 = function(){	}
	
	//running means animations are alive, not that the loop is being auto-run
	this.running=false;
	
	this.loopMe = false;
	this.loop = function(who,still)
	{
		if(typeof(still)=="undefined")
		{
			//optional, if still==true then this merely draws the animation static, doens't advance.
			still=false;
		}
		who.clearCanvas();
		
		if (who.animations.length == 0) 
		{
			clearInterval(who.loopMe);
			who.loopMe = false;
			who.finishedAnimating();
			who.running=false;
		}
		
		for (var i = 0; i < who.animations.length; i++) 
		{
			if (who.animations[i].drawNext(still))
			{
				//this has finished, remove it!
				who.animations.splice(i, 1);
				//decrease i so we don't skip an animation
				i--;
			}
		}
		
		who.extraLoop();
	}
	
	this.AnimationsRunning=function()
	{
		return (this.running);
	}
	
	//public force auto-animate
	this.ForceLoopStart=function()
	{
		if (this.loopMe === false)
		{
			this.running=true;
			//bodge means that then loop is called using this object, not 'this' refereing to the window
			var tempThis=this;
			this.loopMe = setInterval(function(){tempThis.loop(tempThis);}, this.framePeriod);
		}
	}
	
	this.ForceLoopStop=function()
	{
		clearInterval(who.loopMe);
		who.loopMe = false;
		this.running=false;
	}
	
	//see if loop needs starting
	this.start = function()
	{
		this.running=true;
		if (this.loopMe === false && this.autoLoop)
		{
			//bodge means that then loop is called using this object, not 'this' refereing to the window
			var tempThis=this;
			this.loopMe = setInterval(function(){tempThis.loop(tempThis);}, this.framePeriod);
		}
		/*else if(!this.autoLoop)
		{
			this.loopMe=true;
		}
		*/
	}
	
	//--------------- animation classes ------------------
	/*
	this.MakeExplosion = function(pos, size)
	{
		//animate an explosion
		this.animations.push(new Explosion(pos,size,this.canvas,this));
		this.start();
	}
	
	this.MakeExplosion2 = function(pos, size)
	{
		//animate an explosion
		this.animations.push(new Explosion2(pos,size,this.canvas,this));
		this.start();
	}
	
	//a single circle of an explosion. colours are arrays: [r,g,b,a]
	this.MakeExplosionParticle = function(pos, startR, endR, startColour, endColour, stages)
	{
		this.animations.push(new ExplosionParticle(pos, startR, endR, this.canvas, startColour, endColour, stages));
		this.start();
	}
	
	this.MakeDrawCross=function(pos,r,stages,colour)
	{
		this.animations.push(new AnimationDrawCross(pos,r,stages,colour,this.canvas));
		this.start();
	}
	
	this.MakeMushroomCloud=function(pos,size,angle,stages,simple)
	{
		this.animations.push(new AnimationMushroomCloud(pos,angle,size,this.canvas,stages,this,simple));
		this.start();
	}
	
	this.MakeSmokePuff=function(pos,angle,size,stages)
	{
		this.animations.push(new AnimationSmokePuff(pos,angle,size,this.canvas,stages,this));
		this.start();
	}
	
	this.MakeSkiingRobot=function(pos,r,stages,startAngle)
	{
		this.animations.push(new AnimationSkiingRobot(pos,r,stages,this.canvas,startAngle));
		this.start();
	}
	*/
	// ------------------------------------------------------
}

