/* 
 * Copyright Luke Wallin 2012
 */

//TODO - maybe give this the animations instead of hard code here?
var MissileLogic = function(dir,speed,friendly,type,size){
    
    this.dir=dir;
    this.speed=speed;
    this.v = this.dir.getUnit().multiply(this.speed);
    //fired by player or enemy? true for fired by player
    this.friendly=friendly;
    //bullet,rocket,flak,missile
    this.type=type;
    this.size=size;
    //will it only last a certain length of time?  Only used for flak atm
    //this.expires=expires; //this is done in entity, not in logic!
    
    this.update=function(pos,dt){
        switch(this.type){
            case "rocket":
                var colour1 = new Colour(192+Math.random()*64,128+Math.random()*128,0,1);
                var colour2 = new Colour(192+Math.random()*64,128+Math.random()*128,0,0);
                var colour3 = new Colour(192+Math.random()*64,128+Math.random()*128,0,0);
                var colour4 = new Colour(192+Math.random()*64,128+Math.random()*128,0,0);

                return [new LukesAnimations.FancyExplosionlet(pos.add(new Vector(this.size*(0.1-Math.random()*0.2),this.size*(0.25-Math.random()*0.5))),0.01,this.size*(0.2+Math.random()*0.6),colour1,colour2,colour3,colour4,5)];//3+Math.random()*3
                break;
            default:
                return [];
                break;
        }
    }
    this.newPos=function(pos,dt){
        return pos.add(this.v.multiply(dt));
    }
    
    //mostly for ai purposes, not used by vehicle/entity class
    this.getV=function(){
        return this.v;
    }
    
    this.fireGun=function(){
        return false;
    }
    
    this.fireBomb=function(){
        return false;
    }
    
    this.fireSpecial=function(){
        return false;
    }
    
    this.isFriendly=function(){
        return this.friendly;
    }
    
    this.getGunDir=function(){
        return this.v;
    }
}

