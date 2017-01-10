/* 
 * Copyright Luke Wallin 2012
 * 
 * an interface to define the AI for running a vehicle
 * can also be the player's vehicle
 */


var Logic = function(){
    this.update=function(pos,dt){
        return[];//animations
    }
    this.newPos=function(pos,dt){
        return Vector;
    }
    
    //mostly for ai purposes, not used by vehicle/entity class
    this.getV=function(){
        return Vector;
    }
//    this.newV=function(pos,v,dt){
//        
//    }
    
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
        return false;
    }
    
    this.getGunDir=function(){
        return Vector;
    }
}


