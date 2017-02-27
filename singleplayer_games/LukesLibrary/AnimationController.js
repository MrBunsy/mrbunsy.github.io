//Animation class - version 2
/**
 *main changes from first one - now assuming that this will be on a seperate
 *canvas and so got rid of a lot of bits and peices that are now longer relevent
 *
 *
 *finishedCallback - function reference - called when this has finished all animations
 *
 *ctx - reference to ctx object (canvas.getContext)
 */

//container object as a namespace for all the animations:
var LukesAnimations=new Object();

var AnimationController = function(ctx,framerate,width,height,finishedCallback)
{
    var self=this;
    this.framerate=framerate;
    this.framePeriod = 1000/this.framerate;

    if(typeof(finishedCallback)=="undefined"){
        finishedCallback=function(){};
    }

    this.ctx=ctx;
    
    this.width=width;
    this.height=height;
    
    this.animations = new Array();
	
    
	
    //ovverride this to detect when animations have finished
    this.finishedCallback=finishedCallback;
	
    //running means animations are alive, not that the loop is being auto-run
    this.running=false;
	
    this.thread = false;
    this.loop = function()
    {	
        this.ctx.clearRect(0,0,this.width,this.height);
                
        if (this.animations.length == 0){
            this.stop();
            this.finishedCallback();
        }
		
        for (var i = 0; i < this.animations.length; i++) {
            if (this.animations[i].drawNext(this.ctx,this)){
                //this has finished, remove it!
                this.animations.splice(i, 1);
                //decrease i so we don't skip an animation
                i--;
            }
        }
    }
	
	
	
    this.stop=function()
    {
        this.ctx.clearRect(0,0,this.width,this.height);
        clearInterval(this.thread);
        this.running=false;
    }
	
    this.start = function()
    {
        if(!this.running){
            this.thread = setInterval(function(){self.loop.call(self)}, this.framePeriod);
            this.running=true;
        }
    }
    
    this.clear=function(){
        this.ctx.clearRect(0,0,this.width,this.height);
        this.animations=[];
    }
    
    this.isRunning=function(){
        return this.running;
    }
    
    this.add=function(animation){
        this.animations.push(animation);
        this.start();
    }
    
    this.getStagesFromTime=function(time){
        return time*1000/this.framePeriod;
    }
}


/*
 * Animation 'interface:
 * 
 */

var ExampleAnimation=function(){
    this.drawNext=function(ctx,animationController){
        if(finished){
            return true;
        }else{
            return false;
        }
    }
}