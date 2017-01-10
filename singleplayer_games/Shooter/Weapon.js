/* 
 * Copyright Luke Wallin 2012
 * 
 * basically used as a struct to pass stuff to setWeapon
 */

//expire is either a number (time in seconds) or a function with args(pos,gunDir)
var Weapon = function(graphic,size,damage,speed,time,type,expires){//,animations
    //which image to use
    this.graphic=graphic;
    //how big
    this.size=size;
    //how much damage this does
    this.damage=damage;
    //how many fire at once
    //this.guns=guns;
    //how fast it flies
    this.speed=speed;
    //after firing once, how long before can fire again?
    this.time=time;
    
    this.type=type;
    if(typeof(expires)=="undefined"){
        expires=-1;
    }
    //<0 means can't expire, >=0 is a time in seconds
    this.expires=expires;
    //this is a BODGE - if expires is a number it'll create a function that just returns it, otherwise it'll reference the function given
    if(typeof(expires)=="function"){
        this.getExpiresTime=expires
    }else{
        this.getExpiresTime=function(pos){
            return expires;
        }
    }
    
///    if(typeof(animations)=="undefined"){
//        animations = function(){
//            return [];
//        }
//    }
//    //the animations for after every time this updates
//    this.animations=animations;
    
//    //build a buffer for the graphics
//    
//    //offscreen canvas
//    this.canvas=document.createElement("canvas");
//    
//    this.canvas.width=this.size+2;
//    this.canvas.height=this.size+2;
//    this.buffer=this.canvas.getContext("2d");
//    this.buffer.translate(Math.round(this.size/2)+0.5,Math.round(this.size/2)+0.5);
//    
//    this.graphic(this.buffer,this.size,0);
}