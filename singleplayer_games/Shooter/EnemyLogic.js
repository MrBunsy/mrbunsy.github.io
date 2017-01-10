/* 
 * Copyright Luke Wallin 2012
 */

/*
 * flying styles:
 * 0: fly in straight line, regardless
 * 1: fly zig-zaging down screen
 * 2: fly at the player
 * 3: actively avoid the player
 * 
 * 
 * shooting styles:
 * 
 * -1: doesn't shoot
 * 0: random bursts straight ahead (in directino of flight?)
 * 1: sweeping from side to side
 * 2: aimed at player's current position
 * 3: aimed at player's predicted position
 * 
 * 
 */

var EnemyLogic = function(speed,flyingStyle,firingStyle,shooter){
    
    this.count=Math.random()*3;
    this.firing=false;
    
    this.speed=speed;
    //reference to the player's vehicle
    this.player=shooter.getPlayer();
    
    //size of our vehicle
    this.size=shooter.getVehicleSize();
    this.width=shooter.width;
    
    this.flyingStyle=flyingStyle;
    this.firingStyle=firingStyle;
    
    this.gunDir=new Vector(0,1);
    
    //angle gun currently at
    this.gunAngle=Math.PI/4 + Math.random()*Math.PI/2;
    //angle gun is turning
    this.gunClockwise=true;
    
    switch(this.flyingStyle){
        
        case 1:
            //fly at an angle
            //randomly choose an angle that is less than 45deg
            var x = 1-Math.random()*2;
            var v = new Vector(x,1);
            this.v = v.getUnit().multiply(this.speed);
            break;
        case 2:
            //fly at the player
             
            //break;
        case 3:
            //actively avoid the player
        case 0:
        //fly in a straight line
        default:
            this.v = new Vector(0,this.speed);
            break;
    }
    
    
    
    
    this.update=function(pos,dt){
        this.count-=dt;
        
        if(this.count<0){
            //toggle firing
            this.firing=!this.firing;
            if(this.firing){
                this.count=Math.random()*1;
            }else{
                this.count=Math.random()*3;
            }
        }
        
        switch(this.flyingStyle){
            case 1:
                //zig-zagging
                var newPos=pos.addMultiple(this.v,dt);
                if(newPos.x< this.size || newPos.x > this.width-this.size){
                    //going off the side
                    this.v.x*=-1;
                }
                break;
            case 2:
                //flying at the player
                var angle = this.angleToPlayer(pos);
                this.v=new Vector(Math.cos(angle),Math.sin(angle)).multiply(this.speed);
                break;
        }
        
        switch(this.firingStyle){
            case 0:
            default:
                //nothing needs doing - fire in a straight line by default
                break;
            case 1:
                this.gunAngle+=(this.gunClockwise ? 1 : -1)*Math.PI*0.2*dt;
                if(this.gunAngle<Math.PI/4 || this.gunAngle > Math.PI*3/4){
                    //gone too far
                    this.gunClockwise=!this.gunClockwise;
                }
                
                this.gunDir = new Vector(Math.cos(this.gunAngle),Math.sin(this.gunAngle));
                break;
            case 3://same as 2 for now
            case 2:
                var angle = this.angleToPlayer(pos);
                this.gunDir = new Vector(Math.cos(angle),Math.sin(angle));
                break;
//            case 3:
//                //aim at where the player is going to be if they maintain same velocity
//                //TODO
//                break;
        }
        
        return [];
    }
    //gives the angle towards the player, but only within 45deg of forwards
    this.angleToPlayer=function(pos){
        var toPlayer = this.player.getPos().subtract(pos).getUnit();
                //face forwards
                //toPlayer.y=Math.abs(toPlayer.y);
                
                var angle = toPlayer.get2DAngle();
                if(angle < -Math.PI/2){
                    angle+=Math.PI*2;
                }
                
                angle = Math.max(Math.PI/4,angle);
                angle = Math.min(Math.PI*3/4,angle);
                
                return angle;
    }
    
    this.newPos=function(pos,dt){
        return pos.addMultiple(this.v,dt);
    }
    
    this.fireGun=function(){
        switch(this.firingStyle){
            case -1:
                return false;
                break;
            default:
                return this.firing;
                break;
        }
        
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
    
    this.getV=function(){
        return this.v;
    }
    
    this.getGunDir=function(){
        return this.gunDir;
    }
//    //get the relative position of the gun
//    this.getGunPos=function(){
//        return new Vector(0,0,-this)
//    }
}