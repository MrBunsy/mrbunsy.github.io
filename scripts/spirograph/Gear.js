/* 
 * Copyright Luke Wallin 2012
 * 
 * TODO updateTeeth option
 */

var Gear = function(teeth,toothSize,colour){//,gearedTo,inside,internalTeeth,internalToothSize){
    this.teeth=teeth;
    
    
    this.speed=0;
    this.secondsPerRev=10;
    this.id=0;
    
    this.internalGear=null;
    this.internalTeeth=0;
    this.internalToothSize=toothSize;
    
    this.radius=toothSize*2*teeth/(2*Math.PI);
    //this.circumference = Math.PI*2*this.radius;
    //if we're not fixed, then this angle is a relative angle
    this.angle=0;
    //this.offset=0;//needed?
    
    //if we are fixed to another gear, as in fastened to in a way that can't move, these are used:
    this.fixedAngle=0;
    this.fixedRadius=0;
    
    //assume the gear is set to rotate around/inside the other gear
    this.fixed=false;
    
    //this.toothSize = this.circumference/(this.teeth*2);
    this.toothSize = toothSize;
    
    //used internally for graphics:
    this.innerRadius = this.radius - this.toothSize;
    //this.avgRadius = (this.innerRadius + this.radius)/2;
    //angle for a chunk of a tooth - so two of these per total tooth (where total tooth is in and out= |-|_
    this.toothAngle = Math.PI*2/(this.teeth*2);
    
    this.pens=[];
    
    //this.teethRound=0;
    
    //another gear or null  if null, this gear is fixed to the bg
    this.gearedTo=null;
    //goinr around inside or outside of anotehr gear
    this.inside=true;
    //the angle we're at relative to the gear we're rotating around/inside
    //this.relativeAngle=0;
    
    this.colour=colour;
    this.fillColour=colour.paler();
    this.fillAlpha=1;
    
    //if(this.gearedTo==null){
        this.pos=new Vector(0,0);
        //this.angle=0;
    //}
    
    // ---------------------- Methods ----------------------
    
    this.setTeeth=function(teeth,toothSize){
        if(typeof(toothSize)=="undefined"){
            toothSize=this.toothSize;
        }
        this.teeth=teeth;
        this.internalToothSize=toothSize;

        this.radius=toothSize*2*teeth/(2*Math.PI);
        this.toothSize = toothSize;

        //used internally for graphics:
        this.innerRadius = this.radius - this.toothSize;
        //angle for a chunk of a tooth - so two of these per total tooth (where total tooth is in and out= |-|_
        this.toothAngle = Math.PI*2/(this.teeth*2);
    }
    
    this.setInternalGear=function(teeth,toothSize){
        if(typeof(toothSize)=="undefined"){
            toothSize=this.toothSize;
        }
        this.internalTeeth= teeth;
        this.internalToothSize=toothSize;
        if(teeth > 0){
            this.internalGear = new Gear(teeth,toothSize,this.colour).gearTo(this,true).fix(0,0).setFillColour(this.colour,0);
        }else{
            this.internalGear = null;
        }
        return this;
    }
    
    this.getInside=function(){
        return this.inside;
    }
    
    this.setInside=function(inside){
        this.inside=inside;
    }
    
    this.setPos=function(pos){
        this.pos=pos;
        return this;
    }
    
    this.gearTo=function(gearedTo,inside){
        this.inside=inside;
        this.gearedTo=gearedTo;
        return this;
    }
    
    
    
    this.setRevsPerSec=function(secondsPerRev){
        this.secondsPerRev=Math.round(secondsPerRev*1000)/1000;
        //speed is in angle per second
        this.speed=2*Math.PI/this.secondsPerRev;
        return this;
    }
    //woops
    this.setSecondsPerRev=this.setRevsPerSec;
    
    //this little mess is all so that secondsPerRev is limited to 3dp for the finding the time before 
    //the shape repeats
    this.setSpeed=function(speed){
        var secsPerRev = 2*Math.PI/speed;
        this.setRevsPerSec(secsPerRev);
        return this;
    }
    
    this.getSecondsPerRev=function(){
        return this.secondsPerRev;
    }
    
    this.getSpeed=function(){
        return this.speed;
    }
    
    this.fix=function(radius,angle){
        this.fixedAngle=angle;
        this.fixedRadius=radius;
        this.fixed=true;
        
        return this;
    }
    
    this.addPen=function(pen){
        this.pens.push(pen);
        //work out total running time of this gear for the pen
        pen.setTotalTime(Spirograph.calculateRunningTime(this.getGearTree()));
        return this;
    }
    
    //return an array of gears starting with the fixed gear and working down to this gear
    this.getGearTree=function(){
        var gears = [];
        var g = this;
        do{
            gears.push(g);
            g=g.gearedTo;
        }
        while(g!=null);
        
        return gears.reverse();
    }
    
    this.getTeeth=function(inside){
        if(typeof(inside)=="undefined"){
            inside=false;
        }
        if(inside && this.internalGear!=null){
            return this.internalGear.getTeeth();
        }
        return this.teeth;
    }
    
    this.getToothAngle=function(){
        return this.toothAngle;
    }
    
    this.getToothSize=function(inside){
        if(typeof(inside)=="undefined"){
            inside=false;
        }
        
        if(inside && this.internalGear!=null){
            //if somone is asking for the toothsize of the inside, and we have an internal gear
            //give them the right toothsize
            return this.internalGear.getToothSize();
        }
        return this.toothSize;
    }
    
    this.setColour=function(colour){
        this.colour=colour;
        this.fillColour=colour.paler();
        if(this.internalGear!=null){
            this.internalGear.setColour(colour);
        }
        return this;
    }
    
    this.getColour=function(){
        return this.colour;
    }
    
    this.setFillColour=function(colour,alpha){
        this.fillColour=colour;
        this.fillAlpha=alpha;
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
        if(this.gearedTo==null){
            return this.angle;
        }else if(this.fixed){
            return this.gearedTo.getAngle() + this.angle;
        }else{
            //angle due to gear we're attatched to
            var angle = this.gearedTo.getAngle()+this.angle;
            
            //now for working out what absolute angle we're at based on our relative angle (this.angle)
            //how far around the circumference of relativeTo are we
            var c = this.gearedTo.getRadius(this.inside)*this.angle;
            
            if(!this.inside && this.teeth%2==1){
                //odd number of teeth and on the outside
                angle+=this.toothAngle;
            }
            
            //what angle is this same distance around us
            var a = c/this.radius;
            angle+=a * (this.inside ? -1 : 1);
            return angle;
        }
    }
    
    this.getRadius=function(inside){//inner
        if(inside && this.internalGear!=null){
            //if we have an internal gear and sommething wants the radius of the inside, return the internal radius
            return this.internalGear.getRadius(inside);
        }
        return this.radius;
    }
    
    this.getInnerRadius=function(){
        return this.innerRadius;
    }
    
    this.getInternalGear=function(){
        return this.internalGear;
    }
    
    this.getAvgRadius=function(){
        return this.avgRadius;
    }
    
    this.getPos=function(){
        if(this.gearedTo==null){
            return this.pos;
        }else{
            //the absolute angle from centre of relativeTo to us, now what we're rotated at
            var angle=this.gearedTo.getAngle() + this.angle;
            var ourAngle = new Vector(Math.cos(angle),Math.sin(angle));
            var pos = this.gearedTo.getPos();
            
            if(this.fixed){
                pos=pos.add(ourAngle.multiply(this.fixedRadius));
            }else{
                //the outside of the other gear at the relativeAngle
                pos=pos.add(ourAngle.multiply(this.gearedTo.getRadius(this.inside)));
                //adjust so we touch the other gear at the right place:
                if(this.inside){
                    pos=pos.subtract(ourAngle.multiply(this.radius));
                }else{
                    pos=pos.add(ourAngle.multiply(this.radius-this.toothSize));
                }
            }
            return pos;
        }
    }
    
    this.gearPath=function(x,y,angle,ctx){
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
    }
    
    this.draw=function(ctx){
        var x;
        var y;
        var pos;
        
        pos = this.getPos();
        x=pos.x;
        y=pos.y;
        
        var angle=this.getAngle();
        
        //console.log(this.colour+": "+angle + ", "+this.angle);
        
        
        if(this.gearedTo==null && this.inside){
            
            //TODO make this a circle, with bold outline, then can scrap the need for width and height?
            
            //this is an unmoving gear which draws its colour outside the gear
            ctx.fillStyle=this.colour.paler().toRGB();
            //ctx.fillRect(0,0,width,height);
            ctx.beginPath();
            ctx.arc(x,y,this.radius*1.1,0,Math.PI*2,true);
            ctx.fill();
            
            ctx.strokeStyle=this.colour.toRGB();
            ctx.beginPath();
            ctx.arc(x,y,this.radius*1.1,0,Math.PI*2,true);
            ctx.stroke();

            //make inside transparent
            ctx.save();
            ctx.beginPath();
            this.gearPath(x,y,angle,ctx);
            ctx.clip();
            ctx.clearRect(x-this.radius,y-this.radius,this.radius*2,this.radius*2);
            ctx.restore();
           
        }/*else if(this.internalGear!=null){
            //has an internal gear, draw the inside transparent and the rest translucent
            ctx.fillStyle=this.fillColour.toRGBA(this.fillAlpha);
            ctx.beginPath();
            this.gearPath(x,y,angle,ctx);
            //this.internalGear.gearPath(x,y,angle,ctx);
            ctx.fill();
        }*/
        else if(this.fillAlpha==0){
            //want to make the inside transparent
            //make inside transparent
            ctx.save();
            ctx.beginPath();
            this.gearPath(x,y,angle,ctx);
            ctx.clip();
            ctx.clearRect(x-this.radius,y-this.radius,this.radius*2,this.radius*2);
            ctx.restore();
            
        }else{
            //normal gear, draw translucent
            
            ctx.fillStyle=this.fillColour.toRGBA(this.fillAlpha);
            ctx.beginPath();
            this.gearPath(x,y,angle,ctx);
            ctx.fill();
        }
        
        ctx.strokeStyle=this.colour.toRGB();
        ctx.beginPath();
        this.gearPath(x,y,angle,ctx);
        ctx.stroke();
        for(var i=0;i<this.pens.length;i++){
            var penPos=this.pens[i].getPos(pos, angle);
            //draw the circle for each pen
            ctx.save();
            ctx.beginPath();
            ctx.arc(penPos.x,penPos.y,this.radius/10,0,Math.PI*2,false);
            ctx.clip();
            ctx.clearRect(penPos.x-this.radius/10,penPos.y-this.radius/10,this.radius/5,this.radius/5);
            ctx.restore();
            
            ctx.beginPath();
            ctx.arc(penPos.x,penPos.y,this.radius/10,0,Math.PI*2,false);
            ctx.stroke();
        }
        
        if(this.internalGear !=null){
            this.internalGear.draw(ctx);//,width,height
        }
    }
    
    //dt is in SECONDS
    this.update=function(dt,bPenPathOnly){//,bDrawPens
        this.adjustAngle(dt*this.speed);
        
        var pos = this.getPos();
        var angle=this.getAngle();
        
        //update all our pens
        for(var i=0;i<this.pens.length;i++){
            var penPos=this.pens[i].getPos(pos, angle);
            this.pens[i].update(penPos,bPenPathOnly,dt);//bDrawPens,
        }
    }
    
    this.setId=function(id){
        this.id=id;
    }
    
    this.getId=function(){
        return this.id;
    }
    
    this.serialize=function(){
        var pens = [];
        for(var i=0;i<this.pens.length;i++){
            pens.push(this.pens[i].serialize());
        }
        return {
            'angle':this.angle,
            'colour':this.colour.serialize(),
            'fillAlpha':this.fillAlpha,
            'fillColour':this.fillColour.serialize(),
            'fixed' : this.fixed,
            'fixedAngle' : this.fixedAngle,
            'fixedRadius' : this. fixedRadius,
            'gearedTo' : (this.gearedTo==null ? -1 : this.gearedTo.getId()),
            'id' : this.id,
            'inside' : this.inside,
            'internalGear' : this.internalGear!=null,
            'internalTeeth' : this.internalTeeth,
            'internalToothSize' : this.internalToothSize,
            'pens' : pens,
            'pos' : this.pos.serialize(),
            'radius' : this.radius,
            'speed' : this.speed,
            'secondsPerRev' : this.secondsPerRev,
            'teeth' : this.teeth,
            'toothSize' : this.toothSize
        }
    }
    
}


//static method
//Gear.getGear=function(toothSize,teeth,gearedTo,relativeAngle,inside){
//    
//    
//    if(typeof(pos)=="undefined"){
//        pos=new Vector(0,0);
//    }
//    
//    var circum=toothSize*2*teeth;
//    var rad = circum/(2*Math.PI);
//    
//    return new Gear(teeth,rad,gearedTo,relativeAngle,inside);
//}
//
//Gear.getRingGears=function(toothSize,teethOut,teethIn,gearedTo,relativeAngle,inside){
//    var outer = Gear.getGear(toothSize,teethOut,gearedTo,relativeAngle,inside);
//    var inner = Gear.getGear(toothSize,teethIn,outer,relativeAngle,inside);
//    
//    inner.fix(0, 0);
//    
//    return [outer,inner];
//}

///Gear.unSerialize=function(g){
//    return new Gear(g.teeth.toothSize,Colour.unSerialize(g.colour)).setAngle(g.angle).setFillColour(Colour.unSerialize(g.fillColour),g.fillAlpha).setInternalGear(g.internalTeeth, g.internalToothSize).setPos(Vector.unSerialize(g.pos)).setSpeed(g.speed);
//}