//Animation class
/**
 *
 *clear canvas func - function reference - the function which is called to clear the canvas of the old frame.
 *TODO- allow false whichproduces an auto function
 *
 *finishedAnimation - function reference - called when this has finished all animations
 *
 *canvas - reference to canvas object
 *
 *autoloop - bool - true and then this class will create the interval to control the animaion, false and loop() must be called externally
 *
 *extraloop - bool or function - if false does nothing, if a fucntion reference then this functin is called after every loop.
 *
 */
var Animation = function(clearCanvasFunc,finishedAnimating,canvas,autoLoop,extraLoop)
{
	var thisObject=this;

        //treat as static method
        //won't work in IE 8 or below
        this.loadFromDiv=function(divId,finishRef){
            var div=document.getElementById(divId);
            var canvasTag=document.createElement("canvas");

            var width=parseInt(AnimationTest.div.style.width);
            var height=parseInt(AnimationTest.div.style.height);
            canvasTag.width=AnimationTest.width;
            canvasTag.height=AnimationTest.height;

            div.appendChild(canvasTag);
            return Animation.loadFromCanvas(canvasTag,finishRef);
        }

        //treat as static method
        this.loadFromCanvas=function(canvasTagRef,finishRef){

            return
        }

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
	this.loop = function(still)
	{
		if(typeof(still)=="undefined")
		{
			//optional, if still==true then this merely draws the animation static, doens't advance.
			still=false;
		}
		
		thisObject.clearCanvas();
                
		if (thisObject.animations.length == 0) 
		{
			clearInterval(thisObject.loopMe);
			thisObject.loopMe = false;
			thisObject.finishedAnimating();
			thisObject.running=false;
                        //DON'T clear the canvas after the animation has finished
                        //return;
		}
		
		for (var i = 0; i < thisObject.animations.length; i++) 
		{
			if (thisObject.animations[i].drawNext(still))
			{
				//this has finished, remove it!
				thisObject.animations.splice(i, 1);
				//decrease i so we don't skip an animation
				i--;
			}
		}
		
		thisObject.extraLoop();
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
			this.loopMe = setInterval(tempThis.loop, this.framePeriod);
		}
	}
	
	this.ForceLoopStop=function()
	{
		clearInterval(thisObject.loopMe);
		thisObject.loopMe = false;
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
			this.loopMe = setInterval(function(){tempThis.loop(false);}, this.framePeriod);
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

