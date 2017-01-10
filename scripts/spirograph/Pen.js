/* 
 * Copyright Luke Wallin 2012
 */


var Pen = function(colour,ctx,angle,radius){
    this.ctx=ctx;
    this.colour=colour;
    this.angle=angle;
    this.radius=radius;
    this.thick=1;
    
    //how long since last reset
    this.time=0;
    //how long before it's completed
    this.totalTime=0;
    
    this.lastPos=null;
    
    this.getPos=function(gearPos,gearAngle){
        return gearPos.add( (new Vector(Math.cos(gearAngle+this.angle),Math.sin(gearAngle+this.angle))).multiply(this.radius) );
    }
    
    this.reset=function(){
        this.lastPos=null;
        this.time=0;
    }
    
    this.setThick=function(thick){
        this.thick=thick;
        return this;
    }
    
    this.setTotalTime=function(time){
        this.totalTime=time;
    }
    
    this.getTotalTime=function(){
        return this.totalTime;
    }
    
    this.setColour=function(colour){
        this.colour=colour;
    }
    
    this.update=function(newPos,bPenPathOnly,dt){
        //var newPos = gearPos.add( (new Vector(Math.cos(gearAngle+this.angle),Math.sin(gearAngle+this.angle))).multiply(this.radius) );
        if(this.lastPos==null){
            this.lastPos=newPos;
            this.time+=dt;
            return;
        }
        if(this.totalTime==0 || this.time<=this.totalTime){
            //only draw if that's happening atm
            if(!bPenPathOnly){
                //if doing path only, this is not to be drawn right now
                this.ctx.strokeStyle=this.colour.toRGB();
                this.ctx.beginPath();
            }
            this.ctx.moveTo(this.lastPos.x,this.lastPos.y);
            this.ctx.lineTo(newPos.x,newPos.y);
            if(!bPenPathOnly){
                this.ctx.stroke();
            }
        }
        this.lastPos=newPos;
        this.time+=dt;
        //return;
    }
    
    this.serialize=function(){
        return {
            'angle' : this.angle,
            'colour' : this.colour.serialize(),
            'radius' : this.radius,
            'thick' : this.thick
        };
    }
}