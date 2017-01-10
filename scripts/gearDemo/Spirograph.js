/* 
 * Copyright Luke Wallin 2012
 */
var Spirograph = function(canvas){//},canvas2){
    var self = this;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    
    this.width=this.canvas.width;
    this.height=this.canvas.height;
    
    this.time=0;
    
    this.gears=[];
    
    this.fixedGear = Gear.getGear(9, 50,null,new Vector(300,300),true).setColour("rgb(200,200,200)");
    this.innerGear = Gear.getGear(9, 20,this.fixedGear,0,true).setColour("rgb(255,0,0)");
    this.outerGear = Gear.getGear(9, 20,this.fixedGear,0,false).setColour("rgb(0,200,0)");
    this.innerGear2 = Gear.getGear(9, 10,this.innerGear,0,true).setColour("rgb(0,0,255)");
    
    //this.gear = new Gear(20,50);
    //this.gear = Gear.getGear(10, 20);
    this.gears.push(this.fixedGear);//.setPos(new Vector(200,200))
    this.gears.push(this.innerGear);//.setPos(new Vector(200,200))
    this.gears.push(this.outerGear);
    this.gears.push(this.innerGear2);
    
    
    
    this.update = function(){
        //this.time+=0.02;
        this.innerGear.adjustAngle(0.01);
        this.outerGear.adjustAngle(0.01);
        this.innerGear2.adjustAngle(-0.05);
        
        this.fixedGear.adjustAngle(-0.02);
        //this.
        //this.innerGear.rotate(0.2);
        //this.outerGear.rotate(0.2);
        //var innerPos = new Vector(Math.cos())
        this.draw();
    }
    
    this.draw=function(){
        this.ctx.clearRect(0,0,this.width,this.height);
        for(var i=0;i<this.gears.length;i++){
            this.gears[i].draw(this.ctx);
        }
    }
    
    
    this.draw();
    
    //this var should work fine in update:
    this.thread = setInterval(function(){self.update.call(self)},100);
}