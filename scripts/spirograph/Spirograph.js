/* 
 * Copyright Luke Wallin 2012
 * 
 * 
 * idea: fixed gear, that doesn't rotate, is just in one place on the gear, not necessarily at the edge?
 * -done
 * TODO - consider adding this to UI? or more work than worth for something confusing?
 * TODO - consider having a proper linking so that a gear with teeth on the inside and outside can be considered a single
 * gear, not two seperate ones?
 * -done :D
 * 
 * don't have penCanvas here, have it seperate?
 * feels a bit bodgey, with lack of control in the right place, but might be more simple
 * -leaving as is, is messy but works well enough
 * 
 * fill the gears with a slightly alpha colour?
 * -more or less done
 * 
 * 
 * JSON inport/export so can do loading URLS like the harmonograph
 * also abillity to save image like harmonograph
 * 
 * TODO - when have internet, look up how to brighten a colour properly - convert to HSV, brighten, back to RGB?
 * -done :D Java source code FTW
 * 
 * TODO - add feature like on harmonograph whereby the entire simulation is run without drawing anything
 * and the pen's points are all logged and drawn at the end
 * 
 * TODO - fix auto gear sizing down for when outside
 * 
 * idea - to really resolve the transparent hole in gear could user multiple canvases
 * or break the gear into two halves to draw?
 * or remember what was behind, and then use clip to draw it back? <- might be best solution
 * 
 * 
 * TODO - make each pen remember their length?  that way multiple pens could work
 * this works, what needs doing is for each pen to remember their path so that multiple pens
 * of different colours can work
 */
var Spirograph = function(canvas,framerate,penCanvas){//},canvas2){
    var self = this;
    this.canvas = canvas;
    this.penCanvas=penCanvas;
    this.ctx = canvas.getContext("2d");
    this.ctxPen = penCanvas.getContext("2d");
    
    //save so that we have a save with the default zoom level
    this.ctx.save();
    this.ctxPen.save();
    
    this.ctx.lineCap='round';
    this.ctx.lineJoin='round';
    this.ctxPen.lineCap='round';
    this.ctxPen.lineJoin='round';
    
    this.framerate=framerate;
    this.defaultFramerate=framerate;
    
    this.interval = 1000/framerate;
    
    this.width=this.canvas.width;
    this.height=this.canvas.height;
    
    //measures how long we've been drawing for
    this.time=0;
    //how long till we've finished drawing the complete line
    this.finishtime=0;
    //are we drawing on the main canvas?
    this.drawCanvas=true;
    
    this.zoom=1;
    
    this.gears=[];
    
    this.running=false;
    this.thread=false;
    this.cancelCompletion=false;
    
    this.speedBoost=1;
    
    this.addGear=function(gear){
        this.gears.push(gear);
        return this;
    }
    
    this.setSpeedBoost=function(speedBoost){
        this.speedBoost=speedBoost;
    }
    
    this.speedUp=function(){
        this.speedBoost*=1.5;
        return this.speedBoost;
    }
    
    this.slowDown=function(){
        this.speedBoost/=1.5;
        return this.speedBoost;
    }
    
    this.getSpeedBoost=function(){
        return this.speedBoost;
    }
    
    this.changeFramerate=function(bUpDown){
        this.stop();
        this.framerate+=10*(bUpDown ? 1: -1);
        //min of ten
        this.framerate=Math.max(this.framerate,10);
        this.interval = 1000/this.framerate;
        this.start();
        return this.framerate;
    }
    
    this.setFramerate=function(fps){
        var wasRunning = this.running;
        this.stop();
        this.framerate=fps;
        this.interval = 1000/fps;
        if(wasRunning){
            this.start();
        }
    }
    
    this.getFramerate=function(){
        return this.framerate;
    }
    
//    var scaleCanvas = function(oCanvas, iWidth, iHeight) {
//		if (iWidth && iHeight) {
//			var oSaveCanvas = document.createElement("canvas");
//			oSaveCanvas.width = iWidth;
//			oSaveCanvas.height = iHeight;
//			oSaveCanvas.style.width = iWidth+"px";
//			oSaveCanvas.style.height = iHeight+"px";
//
//			var oSaveCtx = oSaveCanvas.getContext("2d");
//
//			oSaveCtx.drawImage(oCanvas, 0, 0, oCanvas.width, oCanvas.height, 0, 0, iWidth, iHeight);
//			return oSaveCanvas;
//		}
//		return oCanvas;
//	}
    
    
    
    this.setZoom=function(zoom){
        this.zoom=zoom;
        //go back to default zoom level
        this.ctx.restore();
        this.ctxPen.restore();
        
        //wipe ctx
        this.ctx.clearRect(0,0,this.width,this.height);
        //make a copy of the pencanvas first!
//        var penCopyCanvas = document.createElement("canvas");
//        penCopyCanvas.width=this.width;
//        penCopyCanvas.height=this.height;
//        var penCopyCtx = penCopyCanvas.getContext("2d");
//        penCopyCtx.drawImage(this.penCanvas, 0, 0, this.width, this.height);//, 0, 0, this.width, this.height);
        //then wipe it
        
        //var copy = scaleCanvas(this.penCanvas,this.width,this.height);
        
        
        
        this.ctxPen.clearRect(0,0,this.width,this.height);
        //becaues we've lost the canvas, reset the counter
        this.time=0;
        //new pen system means this is needed:
        this.clearPenCanvas();
        
        //make sure a save is kept
        this.ctx.save();
        this.ctxPen.save();
        
        //document.location.href=penCopyCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        
        //this.ctxPen.drawImage(penCopyCanvas, 0, 0, Math.round(this.width*this.zoom), Math.round(this.height*this.zoom));//, 0, 0, this.width, this.height);
        
        this.ctx.translate((this.width-this.width*this.zoom)/2,(this.height-this.height*this.zoom)/2);
        this.ctxPen.translate((this.width-this.width*this.zoom)/2,(this.height-this.height*this.zoom)/2);
        
        this.ctx.scale(this.zoom,this.zoom);
        this.ctxPen.scale(this.zoom,this.zoom);
    }
    
    this.changeZoom=function(bUpDown){
        if(!bUpDown){
            //zooming in
            this.zoom*=0.8;
        }else{
            this.zoom/=0.8;
        }
        
        this.setZoom(this.zoom);
        
        return this.zoom;
    }
    
    this.getZoom=function(){
        return this.zoom;
    }
    
    this.customUpdate=function(){};
    
    this.update = function(){
        this.customUpdate();
        this.updateGears(!this.drawCanvas);
        if(this.drawCanvas){
            this.draw();
        }
    }
    
    this.updateGears=function(bPenPathOnly){
        for(var i=0;i<this.gears.length;i++){
            this.gears[i].update(this.interval*this.speedBoost/1000,bPenPathOnly);
            //this.time <= this.finishTime,
        }
        this.time+=this.interval*this.speedBoost/1000;
    }
    
    this.drawIfNotRunning=function(){
        if(!this.running){
            this.draw();
        }
    }
    
    this.draw=function(){
        //this.ctx.save();
        //this.ctx.restore();
        //counter zoom and translate
        this.ctx.clearRect(-(this.width-this.width*this.zoom)/(2*this.zoom),-(this.height-this.height*this.zoom)/(2*this.zoom),this.width/this.zoom,this.height/this.zoom);
        
        
        for(var i=0;i<this.gears.length;i++){
            this.gears[i].draw(this.ctx);//,this.canvas.width,this.canvas.height);
        }
    }
    
    this.clearPenCanvas=function(){
        this.ctxPen.clearRect(-(this.width-this.width*this.zoom)/(2*this.zoom),-(this.height-this.height*this.zoom)/(2*this.zoom),this.width/this.zoom,this.height/this.zoom);
        this.time=0;
        
        //reset all the pens
        
//        var a = new Array();
//        a.forEach(callback, thisObject);
        
//        this.gears.forEach(function(){
//            this.pens.forEach(function(){
//                this.reset();
//            });
//        });
        
        for(var g=0;g<this.gears.length;g++){
            for(var p=0;p<this.gears[g].pens.length;p++){
                this.gears[g].pens[p].reset();
            }
        }
    }
    
    this.start=function(){
        if(!this.running){
            //this var should work fine in update:
            this.thread = setInterval(function(){self.update.call(self)},this.interval);
            this.running=true;
            this.finishTime=this.getLongestPenTime();//this.calculateRunningTime();
            this.time=0;
        }
    }
    
    this.stop=function(){
        if(this.running){
            clearInterval(this.thread);
            this.running=false;
        }
    }
    
    this.completeLoop=function(){
        var counter=0;
        this.ctxPen.beginPath();
        while(this.time<=this.finishTime+this.startTime && counter<500){
            this.update();
            counter++;
        }
        this.ctxPen.stroke();
        
        if(counter==500 && !this.cancelCompletion){
            //still more to do
            setTimeout(function(){self.completeLoop.call(self)},0);
        }else{
            this.finishComplete();
        }
    }
    
    this.completedCallback=function(){};
    
    this.complete=function(callback){
        if(typeof(callback)=="undefined"){
            callback=function(){};
        }
        this.completedCallback=callback;
        
        if(this.time<=this.finishTime){
            this.startComplete();
        }else{
            callback();
        }
        
    }
    this.pauseAfterComplete=false;
    
    this.cancelComplete=function(pauseAfter){
        this.cancelCompletion=true;
        if(typeof(pauseAfter)=="undefined"){
            pauseAfter=false;
        }
        this.pauseAfterComplete=pauseAfter;
    }
    
    //using setTimeOuts so it doens't lock everything up while it's going
    this.startComplete=function(){
        this.pauseAfterComplete=!this.running;
        this.stop();
        this.drawCanvas=false;
        this.oldSpeedBoost = this.speedBoost;
        this.setSpeedBoost(1);
        this.startTime=this.time;
        this.cancelCompletion=false;
        setTimeout(function(){self.completeLoop.call(self)},0);
    }
    
    this.finishComplete=function(){
        //put everything back
        this.drawCanvas=true;
        this.setSpeedBoost(this.oldSpeedBoost);
        if(!this.pauseAfterComplete){
            this.start();
            this.pauseAfterComplete=false;
        }
        this.completedCallback();
    }
    
    //finish the drawing
    this.completeInOneGo=function(){
        if(this.time<=this.finishTime){
            this.stop();
            this.drawCanvas=false;
            this.ctxPen.beginPath();
            var oldSpeedBoost = this.speedBoost;
            this.setSpeedBoost(1);
            var startTime=this.time;
            //adding the startTime here so it'll repeat that much further so the gear ends up in the right place at the end
            while(this.time<=this.finishTime+startTime){
                this.update();
            }
            //draw the pen path
            this.ctxPen.stroke();
            
            //put everything back
            this.drawCanvas=true;
            this.setSpeedBoost(oldSpeedBoost);
            this.start();
        }
    }
    
    //the pens now keep track of their own running times, so find the longest
    this.getLongestPenTime=function(){
        var longest=0;
        for(var g=0;g<this.gears.length;g++){
            for(var p=0;p<this.gears[g].pens.length;p++){
                longest = Math.max(longest,this.gears[g].pens[p].getTotalTime());
            }
        }
        
        return longest;
    }
    
    this.reset=function(){
        this.cancelComplete();
        this.setFramerate(this.defaultFramerate);
        
        this.stop();
        this.setSpeedBoost(1);
        
        this.setZoom(1);
        this.gears=[];
    }
    
    this.serialize=function(){
        
        for(var i=0;i<this.gears.length;i++){
            this.gears[i].setId(i);
        }
        
        var gears = [];
        for(var i=0;i<this.gears.length;i++){
             gears.push(this.gears[i].serialize());
        }
        return {
            'framerate' : this.framerate,
            'zoom' : this.zoom,
            'speedBoost' : this.speedBoost,
            'gears' : gears
        };
    }
    
    this.unSerialize=function(serialized){
        //var spiro = new Spirograph(canvas,serialized.framerate,penCanvas);
        var spiro=this;
        spiro.setFramerate(serialized.framerate);
        spiro.setZoom(serialized.zoom);
        spiro.setSpeedBoost(serialized.speedBoost);
        //var gears=[];

        for(var i=0;i<serialized.gears.length;i++){
            var g = serialized.gears[i];
            //not unserializing gear in Gear because it's got references
            var gear = new Gear(g.teeth,g.toothSize,Colour.unSerialize(g.colour)).setAngle(g.angle).setFillColour(Colour.unSerialize(g.fillColour),g.fillAlpha).setPos(Vector.unSerialize(g.pos)).setSpeed(g.speed);

            if(g.internalGear){
                gear.setInternalGear(g.internalTeeth, g.internalToothSize);
                //gear.setInternalGear(60,9);
            }


            //same with pens, they're referenced to by the gears and have ref to a canvas
            for(var p=0;p<g.pens.length;p++){
                var pen = new Pen(Colour.unSerialize(g.pens[p].colour), spiro.ctxPen, g.pens[p].angle, g.pens[p].radius);
                gear.addPen(pen);
            }

            spiro.addGear(gear);
        }

        //set all the gearedTo references back again
        for(var i=0;i<serialized.gears.length;i++){
            if(serialized.gears[i].gearedTo >= 0){
                //this needs to have a reference that works
                spiro.gears[i].gearTo(spiro.gears[serialized.gears[i].gearedTo], serialized.gears[i].inside);
                //also need to regen pen times
                for(var p=0;p<spiro.gears[i].pens.length;p++){
                    spiro.gears[i].pens[p].setTotalTime(Spirograph.calculateRunningTime(spiro.gears[i].getGearTree()));
                }
            }else{
                //reference is to null, which does actually need to be kept
                spiro.gears[i].gearTo(null, serialized.gears[i].inside);
            }
        }

        return spiro;
    }
    
}

Spirograph.unSerializeFromScratch=function(serialized,canvas,penCanvas){
    var spiro = new Spirograph(canvas,serialized.framerate,penCanvas);
    spiro.unSerialize(serialized);
}

//will occasionally over estimate - eg if one gear is inside another going the same 
    //speed, but in the wrong direction without the pen in the centre
Spirograph.calculateRunningTime=function(gears){
    //must be given an array of gears

    var repeatTimes=[];

    //start from final gear, work down to penultimate gear
    for(var i=gears.length-1;i>0;i--){
        var child = gears[i];
        var parent = gears[i-1];

        var revs;

        //turn off for now
        //pens are added with radius 1, and this is not yet re-calculated 
        //if the pen is edited
        if(false && i==gears.length-1 && gears[i].pens[0].radius==0){
            //if this is the gear with the pen, and the pen is in the centre
            //then we will repeat after one rev.
            revs=1;
        }else{
        //find the highest common factor in the number of the teeth
            var hcf = Math.hcf(child.getTeeth(),parent.getTeeth(child.getInside()));

            //find the pair of this factor - this is the number of revolutions until it repeats
            revs = child.getTeeth()/hcf;
        }
        //time per rev:
        var secondsPerRev=Math.abs(child.getSecondsPerRev());//2*Math.PI/child.getSpeed();


        var timeTillRepeat = revs*secondsPerRev*1000;

        //seconds per rev is limited to 3dp, so this should be a round number already:
        timeTillRepeat=Math.round(timeTillRepeat);

        repeatTimes.push(timeTillRepeat);
    }

    return Math.lcm(repeatTimes)/1000+0.01;//little bodge to solve gap in line at end

}