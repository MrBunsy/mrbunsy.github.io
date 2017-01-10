/* 
 * Copyright Luke Wallin 2012
 * 
 * this is for arriving at a building - so it's being built for the jetty, but should hopefully be reusable for the other stuff too
 * 
 * idea - for getGunDir(relativePos) - use half the relative pos to work out 
 * how to aim the gun at teh player?
 * 
 * this will mean that the guns will all aim roughly towards the player
 * 
 * don't know if this will actuially make it harder to easier - the spread will be larger
 * 
 */


var BuildingFormation=function(start,dir,speed,distance,player){
    //reference to the player entity object
    this.player=player;
    
    this.start=start.copy();
    this.pos=start;
    
    //this.stopAt=stopAt;
    this.speed=speed;
    //this.bArrived=false;
    this.v=dir.getUnit();//this.stopAt.subtract(start).getUnit();
    
    this.arriveTime=distance/speed;
    
    this.time=0;
    
    this.update=function(dt){
        this.time+=dt;
        if(this.time<this.arriveTime){
            
            this.pos=this.pos.addMultiple(this.v,this.speed*dt);
        }
        
        if(this.time > this.stopFire){
            this.calcFire();
        }
    }
    
    this.calcFire=function(){
        this.nextFire = this.time + Math.random()*(this.fireMax - this.fireMin) + this.fireMin;
        this.stopFire = this.nextFire+this.fireFor;
    }
    
    this.fire=false;
    
    this.fireMin=0;
    this.fireMax=0;
    this.fireFor=0;
    
    this.setFireRate=function(fireMin,fireMax,fireFor){
        this.fire=true;
        this.fireMin=fireMin;
        this.fireMax=fireMax;
        this.fireFor=fireFor;
        
        this.calcFire();

    }
    
    
    
    this.firing=function(){
        //idea - poisson distribution affected by the last updatetime?
        if(!this.fire){
            return false;
        }
        //this.time > this.arriveTime && // allow firing before building has arrived :D
        return ( this.time > this.nextFire && this.time< this.stopFire);
        
    }
    
    this.getGunDir=function(offset){
        var pos = this.pos.add(offset);
        return this.player.getPos().subtract(pos).getUnit();
    }
    
    this.getCentre=function(){
        return this.pos;
    }
    
    this.reset=function(){
        this.pos=this.start.copy();
        this.time=0;
        this.calcFire();
    }
    
    this.arrived=function(){
        return this.time>=this.arriveTime;
    }
}