/* 
 * Copyright Luke Wallin 2012
 * 
 * generates a path which FormationLogic can follow
 * 
 */


var Formation=function(centre,start,range,type){
    
    this.type=type;
//    this.width=width;
//    this.height=height;
    
    this.centre=centre;
    this.range=range;
    
    this.pos=start;//new Vector(width/2,-this.height*0.075);
    
    this.start=start;
    
    this.gunDir=new Vector(0,1);
    
    //how long to take to move between places by default
    this.moveTime=3;
    
    this.time=0;
    
    this.fireFor=0.5;
    
    //return the formation to its centre
    this.returnToCentre=function(){
        this.newDestination(this.centre);
        return this;
    }
    //how long it takes to move
    this.setMoveTime=function(moveTime){
        this.moveTime=moveTime;
        return this;
    }
    
    //max distance from centre it can move
    this.setRange=function(range){
        this.range=range;
        return this;
    }
    
    //point that the formation centres around
    this.setCentre=function(centre){
        this.centre=centre;
        return this;
    }
    
    this.getPos=function(){
        return this.pos;
    }
    
    //how long the firing last after starting to move again
    this.setFireFor=function(fireFor){
        this.fireFor=fireFor;
    }
        
    //where we want to be
    this.movingTo=centre;//new Vector(this.width/2,this.height/2);
    //how long we want to take to get there
    this.movingToIn = 5;
    this.v=this.movingTo.subtract(this.pos).multiply(1/this.movingToIn);
    
    //at what time to stop firing:
    this.stopFiring=2;
    this.startFiring=1;
    
    //the next time to change direction
    this.nextChange=this.movingToIn;
    
    this.newDestination=function(moveTo){
        if(typeof(moveTo)=="undefined"){
            moveTo = new Vector(this.centre.x-this.range/2 + Math.random()*this.range,this.centre.y-this.range/2 + Math.random()*this.range);
        }
        this.movingTo=moveTo;
        //how long we want to take to get there
        this.movingToIn = this.moveTime;//2 + Math.random()*2;
        this.v=this.movingTo.subtract(this.pos).multiply(1/this.movingToIn);
        this.nextChange=this.time+this.movingToIn;
        this.stopFiring=this.time+this.fireFor;
    }
    
    this.update=function(dt){
        this.time+=dt;
        
        this.pos=this.pos.add(this.v.multiply(dt));
        
        if(this.time > this.nextChange){
            this.newDestination();
        }
        
//        switch(this.type){
//            case "boss":
//                //for 6 seconds, move downwards
//                if(this.time < 6){
//                    this.pos=this.pos.add(new Vector(0,this.height/6).multiply(dt));
//                }
//                break;
//            case "simple":
//                //for 6 seconds, move downwards
//                if(this.time < 6){
//                    this.pos=this.pos.add(new Vector(0,this.height/6).multiply(dt));
//                }
//                break;
//        }
        
    }
    
    this.gunDir=new Vector(0,1);
    
    this.aimAt=null;
    
    //want everything in the formation to aim at a specific target?
    this.setAimAt=function(aimAt){
        this.aimAt=aimAt;
    }
    
    this.getCentre=function(){
        return this.pos;
    }
    
    this.getGunDir=function(offset){
        if(this.aimAt==null){
            return this.gunDir;
        }else{
            var pos = this.pos.add(offset);
            return this.aimAt.subtract(pos).getUnit();
        }
    }
    
    this.setGunDir=function(gunDir){
        this.gunDir=gunDir;
        return this;
    }
    
    this.firing=function(){
        return this.time<this.stopFiring && this.time > this.startFiring;
    }
    
    //used when respawning the boss after a player dies,
    //this puts the current position of the formation to resetPos and leaves everything else the same
    this.reset=function(){
        this.pos=start;
        this.newDestination(this.centre);
    }
}