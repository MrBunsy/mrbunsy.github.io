/* 
 * Copyright Luke Wallin 2012
 */

var Gear = function(teeth,radius,fixedTo,relativeAngle,inside){
    this.teeth=teeth;
    this.radius=radius;
    this.circumference = Math.PI*2*radius;
    //if we're not fixed, then this angle is a relative angle
    this.angle=relativeAngle;
    this.offset=0;//needed?
    
    this.toothSize = this.circumference/(this.teeth*2);
    this.innerRadius = this.radius - this.toothSize;
    this.avgRadius = (this.innerRadius + this.radius)/2;
    //angle for a chunk of a tooth - so two of these per total tooth (where total tooth is in and out= |-|_
    this.toothAngle = Math.PI*2/(this.teeth*2);
    
    //this.teethRound=0;
    
    //another gear or null
    this.fixedTo=fixedTo;
    //goinr around inside or outside of anotehr gear
    this.inside=inside;
    //the angle we're at relative to the gear we're rotating around/inside
    this.relativeAngle=relativeAngle;
    
    this.colour="rgb(0,0,0)";
    
    if(this.fixedTo==null){
        //bodge, using relativeAngle as a vector here
        this.pos=relativeAngle;
        this.angle=0;
    }
    
    this.getTeeth=function(){
        return this.teeth;
    }
    
    this.getToothAngle=function(){
        return this.toothAngle;
    }
    
    this.setColour=function(colour){
        this.colour=colour;
        return this;
    }
    
    this.setAngle=function(a){
        this.angle=a;
        return this;
    }
    
    this.adjustAngle=function(d){
        this.angle+=d;
        return this;
    }
    
//    this.rotate=function(teeth){
//        this.angle+=teeth*(this.toothAngle*0.5);
//        this.teethRound+=teeth;
//    }
    
    this.getAngle=function(){
        if(this.fixedTo==null){
            return this.angle;
        }else{
            
            
            //return this.fixedTo.getAngle() + this.teethRound*this.toothAngle*1.14*(this.inside ? -1 : 1);
            
            var teeth = this.angle/(this.fixedTo.getToothAngle());//(this.toothAngle);
            
            //sort of moment of inspiration for this.
            //if the gear was going along a FLAT toothed surface, its angle would be 2*pi*flatTeethSoFar*teeth
            //add the current angle to attribute for the fact that we're not going around a flat thing.
            
            var angle;
            if(this.inside){
                angle=this.fixedTo.getAngle() +this.angle - Math.PI*teeth/this.teeth;
            }else{
                angle=this.fixedTo.getAngle() +this.angle + Math.PI*teeth/this.teeth;
            }
                    
            
            
            
            return angle;
            
            //return this.fixedTo.getAngle() +this.angle + (this.angle/(2*Math.PI))*(this.fixedTo.getTeeth()/this.teeth);
            
//            //angle due to gear we're attatched to
//            var angle = this.fixedTo.getAngle();
//            
//            //now for working out what absolute angle we're at based on our relative angle (this.angle)
//            //how far around the circumference of relativeTo are we
//            //var c = this.fixedTo.getRadius(this.inside)*this.angle;
//            var c = this.fixedTo.getRadius(!this.inside)*this.angle;
//            
//            //what angle is this same distance around us
//            var a = c/this.radius;
//            
//            angle+=a * (this.inside ? -1 : 1);
//            
//            return angle;
        }
    }
    
    this.getRadius=function(inner){//inner
        if(typeof(inner)=="undefined"){
            return this.radius;
        }
        if(inner){
            return this.innerRadius;
        }
        return this.radius;
    }
    
    this.getInnerRadius=function(){
        return this.innerRadius;
    }
    
    this.getAvgRadius=function(){
        return this.avgRadius;
    }
    
    this.getPos=function(){
        if(this.fixedTo==null){
            return this.pos;
        }else{
            //the absolute angle from centre of relativeTo to us, now what we're rotated at
            var angle=this.fixedTo.getAngle() + this.angle;
            var ourAngle = new Vector(Math.cos(angle),Math.sin(angle));
            var pos = this.fixedTo.getPos();
            
            //the outside of the other gear at the relativeAngle
            pos=pos.add(ourAngle.multiply(fixedTo.getRadius()));
            
            if(inside){
                pos=pos.subtract(ourAngle.multiply(this.radius));
            }else{
                pos=pos.add(ourAngle.multiply(this.radius-this.toothSize));
                //pos=pos.add(ourAngle.multiply(this.radius));
            }
            return pos;
            //return this.fixedTo.getPos().add( (new Vector(Math.cos(this.relativeAngle),Math.sin(this.relativeAngle))).multiply(this.radius * (this.inside ? -1 : 1)));
        }
    }
    
    this.draw=function(ctx){
        var x;
        var y;
        if(this.fixedTo==null){
            x=this.pos.x;
            y=this.pos.y;
        }else{
            var pos = this.getPos();
            x=pos.x;
            y=pos.y;
        }
        
        var angle=this.getAngle();
        
        //console.log(this.colour+": "+angle + ", "+this.angle);
        
        ctx.strokeStyle=this.colour;
        
        ctx.beginPath();
        //ctx.moveTo(x,y);
        for(var i=0;i<this.teeth*2;i+=2){
            
            var adjust=0.2;
            
            ctx.arc(x, y, this.radius, angle+(i+adjust)*this.toothAngle, angle+(i+1-adjust)*this.toothAngle, false);
            ctx.arc(x, y, this.innerRadius, angle+(i+1+adjust)*this.toothAngle, angle+(i+2-adjust)*this.toothAngle, false);
        }
        ctx.lineTo(x+Math.cos(angle+adjust*this.toothAngle)*this.radius,y+Math.sin(angle+adjust*this.toothAngle)*this.radius);
        
        
        //draw a line to tell easily the angle
//        if(this.inside){
//            ctx.moveTo(x,y);
//            ctx.lineTo(x+this.innerRadius*Math.cos(angle),y+this.innerRadius*Math.sin(angle));
//        }else{
//            ctx.moveTo(x,y);
//            ctx.lineTo(x+this.innerRadius*Math.cos(angle+Math.PI),y+this.innerRadius*Math.sin(angle+Math.PI));
//        }
        ctx.stroke();
    }
}


//static method
Gear.getGear=function(toothSize,teeth,fixedTo,relativeAngle,inside){
    
    
    if(typeof(pos)=="undefined"){
        pos=new Vector(0,0);
    }
    
    var circum=toothSize*2*teeth;
    var rad = circum/(2*Math.PI);
    
    return new Gear(teeth,rad,fixedTo,relativeAngle,inside);
}