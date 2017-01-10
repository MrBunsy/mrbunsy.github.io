/* 
 * Copyright Luke Wallin 2012
 */


var FormationLogic = function(formation,offset){
    this.formation=formation;
    
    this.offset=offset;
    
    this.update=function(pos,dt){
        return[];//animations
    }
    this.newPos=function(pos,dt){
        return this.formation.getCentre().add(this.offset);
    }
    
    //mostly for ai purposes, not used by vehicle/entity class
    this.getV=function(){
        return new Vector(0,0);
    }
    
    this.fireGun=function(){
        return this.formation.firing();
    }
    
    this.fireBomb=function(){
        return false;
    }
    
    this.fireSpecial=function(){
        return false;
    }
    
    this.isFriendly=function(){
        return false;
    }
    
    this.getGunDir=function(){
        return this.formation.getGunDir(this.offset);
    }
}