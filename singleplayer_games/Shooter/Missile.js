/* 
 * Copyright Luke Wallin 2012
 * 
 * missile is an entity that acutally flies along and hits stuff
 * 
 * can also be a bomb
 * bit hacky this class doing both, but seems neater than just duplicating half the code
 * 
 * a bomb has its dir aimed in the -ve Z direction
 * once it reaches at least -10, it's hit the ground and will explode
 * 
 */


var Missile=function(pos,dir,speed,graphic,friendly,size,damage,animations,bomb){
    this.pos=pos;
    this.v=dir.getUnit().multiply(speed);
    this.graphic=graphic;
    this.friendly=friendly;
    this.size=size;
    this.damage=damage;
    //are we a bomb or a normal missile?
    this.bomb=typeof(bomb)=="undefined" ? false : bomb;
    
    
    if(typeof(animations)=="undefined"){
        animations = function(){
            return [];
        }
    }
    
    this.animations=animations;
    //build a buffer for the graphics
    
    //offscreen canvas
    this.canvas=document.createElement("canvas");
    
    this.canvas.width=this.size+2;
    this.canvas.height=this.size+2;
    this.buffer=this.canvas.getContext("2d");
    this.buffer.translate(this.size/2,this.size/2);
    //atm drawing missile in buffer at the right angle
    //will need to change this if missiles can change dir
    this.buffer.rotate(dir.get2DAngle()-Math.PI/2);
    this.graphic(this.buffer,this.size,0);
    
    
    this.update=function(dt){
        var oldPos=this.pos;
        this.pos=this.pos.addMultiple(this.v,dt);
        
        
        //return Missile.rocketAnimations(oldPos,this.size);
        
        //return [new LukesAnimations.FancyExplosionlet(oldPos,0.1,size*0.2,new Colour(255,255,0,1),new Colour(255,255,0,0),new Colour(255,255,0,1),new Colour(255,255,0,0),10)];
        return this.animations(oldPos,this.size);
    }
    
    this.getPos=function(){
        return this.pos;
    }
    
    this.getType=function(){
        return this.bomb ? "bomb" : "missile";
    }
    
    this.draw=function(ctx){
        //this.graphic(ctx,this.pos,this.v.getUnit(),this.size);
        ctx.drawImage(this.canvas, Math.round(this.pos.x-this.size/2), Math.round(this.pos.y-this.size/2));
    }
    
    this.getDamage=function(){
        return this.damage;
    }
    
    this.isFriendly=function(){
        return this.friendly;
    }
    
    this.getSize=function(){
        return this.size;
    }
    
}


Missile.rocketAnimations=function(pos,size){
    
    var colour1 = new Colour(192+Math.random()*64,128+Math.random()*128,0,1);
    var colour2 = new Colour(192+Math.random()*64,128+Math.random()*128,0,0);
    var colour3 = new Colour(192+Math.random()*64,128+Math.random()*128,0,0);
    var colour4 = new Colour(192+Math.random()*64,128+Math.random()*128,0,0);
    
    return [new LukesAnimations.FancyExplosionlet(pos.add(new Vector(size*(0.1-Math.random()*0.2),size*(0.25-Math.random()*0.5))),0.01,size*(0.2+Math.random()*0.6),colour1,colour2,colour3,colour4,5)];//3+Math.random()*3
}

//moved to Graphic:
////draw a missile on ctx, at pos facing dir
//Missile.bullet=function(ctx,pos,dir,size){
//    ctx.save();
//    ctx.lineWidth=1.5;
//    ctx.lineCap="round";
//    ctx.beginPath();
//    var start = pos.addMultiple(dir,-size/2);
//    
//    ctx.moveTo(start.x,start.y);
//    
//    var end = pos.addMultiple(dir,size/2);
//    
//    ctx.lineTo(end.x,end.y);
//    ctx.stroke();
//    ctx.restore();
//}
//
//
//Missile.rocket=function(ctx,pos,dir,size){
//    ctx.save();
//    ctx.lineWidth=3;
//    ctx.lineCap="round";
//    ctx.strokeStyle="rgb(255,0,0)";
//    ctx.beginPath();
//    var start = pos.addMultiple(dir,-size/2);
//    
//    ctx.moveTo(start.x,start.y);
//    
//    var end = pos.addMultiple(dir,size/2);
//    
//    ctx.lineTo(end.x,end.y);
//    ctx.stroke();
//    ctx.restore();
//}