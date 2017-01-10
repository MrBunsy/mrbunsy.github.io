/* 
 * Copyright Luke Wallin 2012
 * 
 * 
 * This started out as a Vehicle class, but now serves as anything which can move around
 * therefore it's a little weird when this is a bullet, but
 * it should be less messy than it used to be
 */


var Entity=function(startPos,size,shooter,graphic,type,logic,health,graphicAngle){
    
//    this.worldWidth=worldWidth;
//    this.worldHeight=worldHeight;
    
    var self=this;
    
    //eg "player" or "hardEnemy"
    this.type=type;
    
    //function to draw this.graphic(ctx,size,state)
    this.graphic=graphic
    
    //might use pos.z to define what is on top of what
    this.pos=startPos;
    this.size=size;
    //velocity
    //this.v = new Vector(0,0);
    //class controlling everyting
    this.shooter=shooter;
    
    this.graphicAngle=typeof(graphicAngle)=="undefined" ? 0 : graphicAngle-Math.PI/2;
    
    //an object with update(dt,pos,v), newV(oldV), newPos(oldPos), fireGun(),fireBomb(),fireSpecial()
    this.logic=logic;
    //damage done is the orignial health by default
    this.damage=health
    this.health=health;
    
    //offscreen canvas
    this.canvas=document.createElement("canvas");
    //twice as large for bits that stick over the edge
    this.canvas.width=this.size*2;
    this.canvas.height=this.size*2;
    this.buffer=this.canvas.getContext("2d");
    this.buffer.translate(Math.round(this.size)+0.5,Math.round(this.size)+0.5);
    this.buffer.rotate(this.graphicAngle);
    this.graphic(this.buffer,this.size,0);
    
    this.weapon=false;
    
    //does this vehicle have a moving part taht needs animating?
    //this.animated=false;
    //maybe array instead?
    this.vehicleAnimations=[];

    //deliberatly putting guns as zero by default, this way if a weapon isn't set, it can't fire
    this.guns=0;
    
    //counter for each type of weapon, and how long has to be waited before it can be fired again.
    this.gunTime=500;
    this.gunTimeLimit=0.1;
    this.bombTime=500;
    this.bombTimeLimit=3;
    this.specialTime=500
    this.specialTimeLimit=60;
    
    
    this.time=0;
    
    //is this is something that only lasts a certain length of time?
    this.canExpire=false;
    this.expires=0;
    
    //collision detection shapes
    //by default, collision detection is simply a circle
    this.shapes=[new Shape(0,this.size*Math.SQRT1_2)];
    
    
    this.addCollisionShape=function(shape,replace){
        if(typeof(replace)=="undefined"){
            replace=false;
        }
        
        if(replace){
            this.shapes=[];
        }
        
        this.shapes.push(shape);
    }
    
    this.setGraphic=function(graphic,state){
        if(typeof(state)=="undefined"){
            state=0;
        }
        this.buffer.clearRect(-this.size,-this.size,this.size*2,this.size*2);
        this.graphic=graphic;
        this.graphic(this.buffer,this.size,state);
    }
    
    this.setGraphicState=function(state){
        this.buffer.clearRect(-this.size,-this.size,this.size*2,this.size*2);
        this.graphic(this.buffer,this.size,state);
    }
    
//    this.getCollisionShapes=function(){
//        return this.shapes;
//    }
    
//    //0=circle, 1 = rectangle
//    this.collisionShape=0;
//    this.width=0;
//    this.height=0;
    
    //if expires >=0 this gets set, otherwise it doens't
    this.setExpire=function(expires){
        this.expires=expires;
        this.canExpire=expires >=0;
        return this;
    }
    
    //have we passed our expirey time?
    this.hasExpired=function(){       
        return this.canExpire && this.time >=this.expires;
    }
    
    this.addVehicleAnimation=function(animation){
        this.vehicleAnimations.push(animation);
        return this;
    }
    
    this.removeVehicleAnimations=function(){
        this.vehicleAnimations=[];
    }
    
    this.getHealth=function(){
        return this.health;
    }
    
    this.changeHealth=function(dh){
        this.health+=dh;
        return this;
    }
    
    this.setHealth=function(health){
        this.health=health;
        return this;
    }
    
    this.getDamage=function(){
        return this.damage;
    }
    
    this.setDamage=function(damage){
        this.damage=damage;
        return this;
    }
    
    this.update=function(dt){
        
        this.time+=dt;
        
        var animations = this.logic.update(this.pos,dt);
        this.pos = this.logic.newPos(this.pos,dt);
        this.gunTime+=dt;
        this.bombTime+=dt;
        this.specialTime+=dt;
        this.fireWeapons(this.logic.fireGun(), this.logic.fireBomb(), this.logic.fireSpecial());
        
        return animations;
    }
    
    this.getPos=function(){
        return this.pos;
    }
    
    this.setPos=function(pos){
        this.pos=pos;
    }
    
    //this doens't actually have a velocity, that's entirely controller by the logic
    this.getV=function(){
        return this.logic.getV();
    }
    
    this.getType=function(){
        return this.type;
    }
    this.getSize=function(){
        return this.size;
    }
    //currently just letting this class know the player has fired
//    this.fire=function(){
//        this.time=0;
//    }
    
    //TODO give logic a getGunAim
    
    this.fireWeapon=function(pos){
        var entity=new Entity(pos, this.weapon.size, this.shooter, this.weapon.graphic, this.weapon.type, new MissileLogic(this.logic.getGunDir(), this.weapon.speed, this.logic.isFriendly(), this.weapon.type, this.weapon.size), this.weapon.damage,this.logic.getGunDir().get2DAngle()).setExpire(this.weapon.getExpiresTime(this.pos,this.logic.getGunDir()));
        entity.addCollisionShape(new Shape(0,0,0), true);//collision is just a point
        this.shooter.addEntity(entity);
    }
    
    this.fireWeapons=function(guns,bomb,special){
        if(guns && this.gunTime > this.gunTimeLimit){
            switch(this.guns){
                case 1:
                    this.fireWeapon(this.pos.setZ(0));
                    break;
                case 2:
                    this.fireWeapon(this.pos.add(new Vector(-this.size/2,0)).setZ(0));
                    this.fireWeapon(this.pos.add(new Vector(this.size/2,0)).setZ(0) );
                    break;
                case 3:
                    this.fireWeapon(this.pos.add(new Vector(-this.size/2,0)).setZ(0));
                    this.fireWeapon(this.pos.setZ(0)                                );
                    this.fireWeapon(this.pos.add(new Vector(this.size/2,0)).setZ(0) );
                    break;
                case 4:
                    this.fireWeapon(this.pos.add(new Vector(-this.size/2,0)).setZ(0));
                    this.fireWeapon(this.pos.add(new Vector(this.size/2,0)).setZ(0) );
                    this.fireWeapon(this.pos.add(new Vector(this.size*0.1-this.size/2,0)).setZ(0));
                    this.fireWeapon(this.pos.add(new Vector(this.size/2-this.size*0.1,0)).setZ(0));

                    break;
                case "fortress":
                    //yey hack
                    var wingHeight=this.size*0.2;
                    
                    var engines=[new Vector(-size*0.4,wingHeight),new Vector(-size*0.25,wingHeight*1.1),new Vector(-size*0.1,wingHeight*1.1),
                    new Vector(size*0.4,wingHeight),new Vector(size*0.25,wingHeight*1.1),new Vector(size*0.1,wingHeight*1.1)];
                    
                    for(var i=0;i<engines.length;i++){
                        this.fireWeapon(this.pos.add(engines[i]));
                    }
                    
                    break;
            }
            this.gunTime=0;
        }
        
        if(bomb && this.shooter.bombsAllowed() && this.bombTime> this.bombTimeLimit){
            
            //assuming friendly atm - this.logic.isFriendly()
            //var dir = new Vector(0,-0.707,-0.707);
            var dir = new Vector(0,-1,-0.05);
            this.shooter.addEntity(new Entity(this.pos, this.size*0.4, this.shooter, Graphics.bombFriendly, "bomb", new MissileLogic(dir, this.weapon.speed*0.75, this.logic.isFriendly(), "bomb", this.size*0.4), 50))
            //this.shooter.addEntity(new Missile(this.pos, dir, this.weapon.speed*0.75, Graphics.bomb, this.logic.isFriendly(), this.size*0.4 , 50, function(){return []},true));
            this.bombTime=0;
        }
    }
    
//    this.canFire=function(){
//        return this.time > this.fireTime;
//    }
    
    this.draw=function(ctx){
        //ctx.strokeRect(this.pos.x,this.pos.y,this.size,this.size);
        ctx.drawImage(this.canvas, (this.pos.x-this.size), (this.pos.y-this.size));//Math.round
        
        for(var i=0;i<this.vehicleAnimations.length;i++){
            
            ctx.save();
            
            ctx.translate(this.pos.x+this.vehicleAnimations[i].pos.x,this.pos.y+this.vehicleAnimations[i].pos.y);
            
            this.vehicleAnimations[i].graphic(ctx,this.vehicleAnimations[i].size,this.vehicleAnimations[i].phase + (this.time*this.vehicleAnimations[i].scale)%this.vehicleAnimations[i].period);
            
            
            ctx.restore();
        }
//        this;
//    }
        
//        if(this.vehicleAnimation!=null){
//            this.vehicleAnimation.draw(ctx,this.pos,this.time);
//        }
    }
    
    this.isFriendly=function(){
        return this.logic.isFriendly();
    }
    
    this.setWeapon=function(weapon,guns){
        this.weapon=weapon;
        //the graphic
//        this.weapon.graphic=type;
//        //how much damage it does
//        this.weapon.damage=damage;
        //how many guns fire at once
        this.guns=guns;
        
        this.gunTimeLimit=this.weapon.time;
        
//        //speed of missiles
//        this.weapon.speed=speed;
//        //how long between firing
//        this.gunTime=time;
    }
    
    //default is a small explosion
    this.bulletHitAnimation=function(bulletPos,bulletSize,bulletV){
        return new LukesAnimations.Explosion2(bulletPos, bulletSize);
    }
    
    this.setBulletHitAnimation=function(bulletHitAnimation){
        if(bulletHitAnimation==null){
            //reset to default
            this.bulletHitAnimation=function(bulletPos,bulletSize,bulletV){
                return new LukesAnimations.Explosion2(bulletPos, bulletSize);
            }
        }else{
            this.bulletHitAnimation=bulletHitAnimation;
        }
    }
    
    //hit by a bullet or rocket, what do we do?
    this.getHitAnimation=function(bulletPos,bulletSize,bulletV){
        return this.bulletHitAnimation(bulletPos, bulletSize, bulletV);
    }
    
    
    
    this.invincible=false;
    
    this.setInvincible=function(invincible){
        this.invincible=invincible;
    }
    
    this.canDie=function(){
        return !this.invincible;
    }
    //returns true or false
    this.collidesWith=function(entity){
        //first check if the game mechanics allow these two things to collide at all
        if(entity.isFriendly()==this.isFriendly() || entity === this || Math.abs(entity.getPos().z - this.getPos().z) >=5){
            //cannot crash into things on the same team
            //cannot crash if flying at different heights
            return false;
        }
        
        //both entities have an array of shapes to represent them
        
        for(var i=0;i<entity.shapes.length;i++){
            for(var j=0;j<this.shapes.length;j++){
                
                var s1=entity.shapes[i];
                var p1=entity.getPos();
                var s2=this.shapes[j];
                var p2=this.pos;
                
                if(s1.type==0 && s2.type==0){
                    //comparing circles
                    var d1 = Math.pow(s1.r + s2.r,2);
                    var d2 = p1.subtract(p2).getMagnitudeSqrd();
                    
                    if(d2 < d1){
                        //circles are too close
                        return true;
                    }
                }else if(s1.type==1 && s2.type==1){
                    //comparing rectangles
                    if(p1.x-s1.r/2 < p2.x+s2.r/2 && p1.x+s1.r/2 > p2.x-s2.r/2 && p1.y-s1.h/2 < p2.y+s2.h/2 && p1.y+s1.h/2 > p2.y-s2.h/2){
                        //old test - if our furthest right is greater than their furthest left
                        //and our furthest left is less than their greatest height
                        //plus same test in y axis, then the shapes overlap
                        return true;
                    }
                }else{
                    //one is rectangle, one is a circle
                    var circle,rect,cPos,rPos;
                    if(s1.type==0){
                        circle=s1;
                        cPos=p1;
                        rect=s2;
                        rPos=p2;
                    }else{
                        circle=s2;
                        cPos=p2;
                        rect=s1;
                        rPos=p1;
                    }
                    var corners = [
                        rPos.add(new Vector(-rect.r/2,-rect.h/2)),
                        rPos.add(new Vector(rect.r/2,-rect.h/2)),
                        rPos.add(new Vector(-rect.r/2,rect.h/2)),
                        rPos.add(new Vector(rect.r/2,rect.h/2))
                    ];
                    var d1=circle.r*circle.r;
                    //test if any of the four points of the rectangle are inside teh circle
                    for(var k=0;k<4;k++){
                        var d2= corners[i].subtract(cPos).getMagnitudeSqrd();
                        if(d2 < d1){
                            return true;
                        }
                    }
                    
                    //test if the circle is inside the rectangle
                    if(cPos.x-circle.r/2 < rPos.x+rect.r/2 && cPos.x+circle.r/2 > rPos.x-rect.r/2 && cPos.y-circle.r/2 < rPos.y+rect.h/2 && cPos.y+circle.r/2 > rPos.y-rect.h/2){
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
}

//these draw the vehicle within (-size/2,-size/2,size/2,size/2) and centred around (0,0)

