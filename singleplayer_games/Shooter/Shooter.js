/* 
 * Copyright Luke Wallin 2012
 * 
 * would WeaponGraphic be best as its own class? that way animations and graphics are in the same thing
 * 
 * TODO z-index for objects in the entity array
 * done :D
 * 
 * TODOs:
 * Formations - done
 * Boss Fights - done final
 * Health system
 * Flak - explodes after certain distance - adjustable for AI to aim at player? - done
 * Homing Missiles/ slightly homing missiles
 * More Graphics
 * 
 * Smoke puff when firing certain weapons
 * 
 * water splashes behind vehicles on section 0
 * 
 * respawn boss after dieing in bossfight - done
 * 
 * Weapon idea:
 * flamethrower?  will need for dragon
 * laser?
 * 
 * atm there's no rounding of position when drawing - because things going same speed as ground gitter
 * this means everything's a little blurred.  not sure what to do about htis
 * 
 * 
 * z positions:
 * 0 - player level, everything here fights and could be drawn in any order
 * 
 * below -5 - below the player and cna't be crashed into or shot
 * 
 * 
 * IDEA - for non essential animations tied to vehicles (like propellers, rotor blades)
 * use the animation system with an animation class that can have its position altered?
 * will this line up well enough, or will I need to manually call the animation system from
 * this update loop
 * 
 * might have a special animation class which can be tied to an entity?
 * 
 * 
 * idea - give entity a collides() and getHitAnimation() methods, so that defaults all
 * work fine for normal vehicles, but bosses can have special stuff
 * 
 * think I could get away fine with lower fps for animations, but would
 * require re-jigging the lenthgs of a lot of them
 * 
 * 
 * TODO proper collision detection, give Entity a getBoundingShape() method?
 * I think simply combinations of circles and rectangles (or maybe not even combinations!) would be sufficinet to cover everyting needed
 * 
 * 
 * 
 * 
 * Level ideas:
 * 
 * section 1 - water:
 * 
 * single guns, quickly upgrading to double guns
 * then formation of single & double guns
 * rockets which quickly upgrade
 * 
 * idea - submarine as an obstacle that shoots?
 * 
 * 
 * 
 * TODO tidy up changeState and startSection so there's only one and it does everything I need
 * changeState I think is for the menu - gameState is different! so it should be fine as it is
 * 
 * 
 * 
 * big list of TODOs:
 * 
 * formation for boss - option to have guns point at player
 * tidy up the planes and weapons available in level 2
 * disable bomb in water level - done
 * fix hud - done
 * HEALTH SYSTEM - done
 * increase pace of enemies as weapons improve - done, needs testing - MORE!
 * collision detection system with walls for player - so boat works better - bodged
 * lots of playtesting!
 * MENU SYSTEM - mostly done :D
 * formation killed quickly bonus?  how about a timer taht counts down, but formation will last till it or you die - done!
 * SOUND
 * improve graphics for catamaran
 * 
 * 
 * jetty: sams much harder, substation little eaiser - done
 * final boss: more obvious and harder
 * don't give more lives as starting next section! but maybe boost health?
 * 
 * formation in level 2: planes not ships! and different shape?
 * 
 * flying fortress - huge aircraft - as a second formation?
 * 
 * ideally:
 * a ground level?
 * see if I can have a good smoke effect behind the red arrows :D
 * 
 * 
 * 17:17 - Paul: It's quite good.  But the rockets are brutal.  Also, I got to the end without getting beyond two shots.
17:18 - Paul: Sometimes you are essentially forced to take damage as well
17:19 - Paul: The worst thing is insane sprays of bullets that are literally unavoidable
17:20 - Paul: I'd generally have the enemies fire slightly less often, but have the bullets do more damage

 * score in top right?
 * 
 * how about something showing what weapon, how many left to kill before next upgrade in top right too?
 * 
 * more impressive animation for defeating russian sky fortress? it crashing to the ground?
 * 
 * some kind of much bigger version if the window is increased in size?
 * 
 * maybe make about link go to my page about it?
 * 
 * HELICOPTER! - MV-22_Osprey_Line_Drawing.svg should be good for this
 */


var Shooter = function(div){
    var self=this;
    this.div=div;
    
    //can't die
    this.godMode=false;
    
    //do I want to ensure that this is square?
    this.width=parseInt(this.div.style.width);
    this.height=parseInt(this.div.style.height);
    this.pos = new Vector(this.div.offsetLeft,this.div.offsetTop);
    
    this.radius = Math.sqrt(this.width*this.width/4 + this.height*this.height/4);
    
    this.thread=false;
    this.running=false;
    
    this.framerate=30;
    
    this.interval=1000/this.framerate;
    this.dt = this.interval/1000;
    
    this.lives=3;
    
    this.state="new";
    /*
     * states:
     * menu
     * playing
     * new
     */
    
    this.gameState="flying";
    /*
     * game states:
     * flying - normal flying and shooting
     * formation -nothing but the enemy formation to fight
     * preFormation - waiting for a formation to start
     * boss - background stops scrolling and just a boss fight
     * preBoss - waiting for a boss fight to start
     */
    
    this.entities=[];
    
    this.canvases=[];
    //[background, entities, animations, hud]
    this.ctxs=[];
    
    for(var i=0;i<4;i++){
        this.canvases[i] = document.createElement("canvas");
        this.canvases[i].width=this.width;
        this.canvases[i].height=this.height;
        this.canvases[i].style.position="absolute";
        this.canvases[i].style.top=this.pos.y+1;
        this.canvases[i].style.left=this.pos.x+1;
        
        this.div.appendChild(this.canvases[i]);
        
        this.ctxs[i]=this.canvases[i].getContext("2d");
    //        this.ctxs[i].font="20px Verdana, Arial, Helvetica, sans-serif";//Arial
    //        this.ctxs[i].fillText("Sample String", 5, 30+20*i); 
    }
    
    this.animationController=new AnimationController(this.ctxs[2], 30,this.width,this.height);
    
    //we'll call the animation loop from here
    this.animationController.setSelfRunning(false);
    
    this.vehicleSize = this.height*0.075;
    this.playerSpeed = this.width*0.4;
    this.playerMissileSpeed=this.playerSpeed*1.5;
    
    this.playerLogic = new PlayerLogic(this.width,this.height,this.vehicleSize,this.playerSpeed);
    //Vehicle.friendlyVickersValiant
    
    this.defaultPlayerPos=new Vector(this.width/2,this.height*0.9);
    
    this.player= new Entity(this.defaultPlayerPos.copy(), this.vehicleSize,this,Graphics.friendlyHovercraft,"player",this.playerLogic,100);
    
    this.playerGraphics=[Graphics.friendlyHovercraft,Graphics.friendlyVickersValiant]
    
    this.entities.push(this.player);
    
    this.groundSpeed=this.playerSpeed/5;
    
    this.graphics=new Graphics(this.width, this.height);
    
    this.nextSectionTime=0;
    
    //note: level is not being used, currentWeapon and playerWeapon are about as close to a leveling system as it is
    //in terms of different areas, those are sections
    //however from the UI point of view, the three sections will be called levels as this is most simple
    //for the user, I hope!
    //this.level=0;
    this.section=0;
    
    this.nextEnemy=2+Math.random()*5;
    this.enemyTime=0;
    
    this.nextObstacle=6+Math.random()*12;
    this.obstacleTime=0;
    
    this.time=0;
    this.count=0;
    
    this.enemyCount=0;
    this.enemyRateMin=2;
    this.enemyRateRandom=3;
    
    //thing to remember about enemy weapons - a new level
    //doesn't have to be a whole new weapon, it could be a previous weapon with a 
    //higher min gun, or higher max shooting
    
    //idea - section one:
    //
    //first - just boat with single gun
    //then upgrade to catamaran with two guns
    //then formation of cats or boats
    //
    //then hovercraft with rockets
    //
    //then boss
    //
    //make sure to limit how much catamaran can upgrade so it doesn't take ages before formation
    //
    
    this.flakSpeed=this.playerSpeed*2;
    this.flakExplosionSize=this.vehicleSize;
    
    this.enemyFlak=function(enemyPos,gunDir){
        //returns a time such that once the flak reachs teh current position of the player it will explode
        //playerpos mins enemyPos dotted with gunDir
        return (Math.abs(enemyPos.setZ(0).subtract(self.player.getPos().setZ(0)).dot(gunDir)))/self.flakSpeed;
    }
    
    //these arrays are the size of the number of weapons
    //[section][weapon]
    
    //current max guns for each weapon
    this.currentGuns=[[1,2,1],[1,2,1],[]];
    this.minGuns=[[1,2,1],[1,2,1],[]];
    //the max guns allowed for each weapon on this section
    this.maxGuns=[[1,2,1],[1,2,2],[]];

    //most inteligent flying level avaliable for each weapon
    this.currentFlying=[[0,0,0],[0,0,0],[]];
    this.minFlying=[[0,0,0],[0,0,0],[]];
    this.maxFlying=[[1,2,2],[1,2,3],[]];
    
    //most intelligent shooting level avaliable for each weapon
    this.currentShooting=[[0,0,0],[0,0,0],[]];
    this.minShooting=[[0,0,0],[0,0,0],[]];
    this.maxShooting=[[0,1,2],[1,2,3],[]];
    
    //graphics for each weapon
    this.enemyGraphics=[[Graphics.attackBoat,Graphics.catamaran,Graphics.hovercraft],
        [Graphics.sopwithCamel, Graphics.vickersValiant, Graphics.eurofighter],
        []];
    //hit boxes, null means it'll default to a circle
    this.enemyShapes=[[new Shape(1, this.vehicleSize*0.7, this.vehicleSize),null,null]
        ,[null,null,null,null],[]]
    
    this.enemyHealths=[[30,70,150],[30,70,150],[]];
    
    //current worst weapon the enemy can throw at you
    this.currentWeapon=0;
    //this array is the size of the number of sections
    //this.currentWeaponSection=[2,4,6];
    //the worst weapon that can be thrown this section
    //this.maxWeapon=2;
    
    //for each section, at which weapon upgrade of the enemy does a formation appear?
    this.formationFightAtWeapon=[2,1,3];
    //TODO - make this do something:
    this.secondFormationFightAtWeapon=[-1,2,3];
    
    //probabilities of each weapon, as proportion of total sum of array
    this.weaponProb=[1,1,1,1];
    
    
    
    this.enemyWeapons = [[
    //new Weapon(Graphics.bullet, this.vehicleSize*0.1,20,this.flakSpeed,0.75,"flak",this.enemyFlak),
    new Weapon(Graphics.bullet, this.vehicleSize*0.1, 5, this.playerSpeed, 0.1,"bullet"),
    new Weapon(Graphics.bullet, this.vehicleSize*0.1, 10, this.playerSpeed, 0.1,"bullet"),
    //new Weapon(Graphics.rocket, this.vehicleSize*0.5, 20, this.playerSpeed*1.5, 0.5,Missile.rocketAnimations),
    new Weapon(Graphics.rocket, this.vehicleSize*0.5, 30, this.playerSpeed*1.5, 0.5,"rocket")]
        ,[new Weapon(Graphics.bullet, this.vehicleSize*0.1, 5, this.playerSpeed, 0.1,"bullet"),
        new Weapon(Graphics.bullet, this.vehicleSize*0.1, 10, this.playerSpeed, 0.1,"bullet"),
        new Weapon(Graphics.rocket, this.vehicleSize*0.5, 30, this.playerSpeed*1.5, 0.5,"rocket")],
    []
    ];
    
    this.playerWeapon=0;
    
    this.playerWeapons = [[
    new Weapon(Graphics.bullet, this.vehicleSize*0.1, 10, this.playerMissileSpeed, 0.1,"bullet"),
    new Weapon(Graphics.bullet, this.vehicleSize*0.1, 10, this.playerMissileSpeed, 0.1,"bullet"),
    new Weapon(Graphics.bullet, this.vehicleSize*0.1, 10, this.playerMissileSpeed, 0.1,"bullet"),
    new Weapon(Graphics.bullet, this.vehicleSize*0.1, 10, this.playerMissileSpeed, 0.1,"bullet")],
    [       
    new Weapon(Graphics.bullet, this.vehicleSize*0.1, 10, this.playerMissileSpeed, 0.1,"bullet"),
    new Weapon(Graphics.bullet, this.vehicleSize*0.1, 10, this.playerMissileSpeed, 0.1,"bullet"),
    new Weapon(Graphics.bullet, this.vehicleSize*0.1, 10, this.playerMissileSpeed, 0.1,"bullet"),
    new Weapon(Graphics.bullet, this.vehicleSize*0.1, 10, this.playerMissileSpeed, 0.1,"bullet")],[]
    ];
    
    this.playerGuns = [[
    1,
    2,
    3,
    4],[1,
    2,
    3,
    4],[]
    ]
    
    this.player.setWeapon(this.playerWeapons[this.section][this.playerWeapon],this.playerGuns[this.section][this.playerWeapon]);
    
    
    
    this.upgradeEnemyCount=0;
    
    //after so many enenmies have spawned
    this.upgradeEnemiesAfter=12;
    
    //after so many have been killed
    this.upgradePlayerAfter=20;
    
    this.killedCount=0;
    
    this.backgroundPos=0;
    
    //is the death animation in the process of happening?
    this.dieing=false;
    this.dieingAnimationTime=0;
    
    this.groundStoppedAt=0;
    this.groundStopped=false;
    
    this.formation=new Formation(new Vector(this.width/2,this.height/2),new Vector(this.width/2,-this.vehicleSize),this.width*0.3,"simple");
    
    this.updateBackground=function(){
        if(this.count%1==0){
            this.ctxs[0].clearRect(0,0,this.width,this.height);
            
            var groundAt= this.groundStopped ? this.groundStoppedAt : this.time*this.groundSpeed;
            
            switch(this.section){
                case 0:
                    this.graphics.drawWater(this.ctxs[0], groundAt, this.time*this.groundSpeed,this.dieing);//Math.round
                    break;
                default:
                    this.graphics.drawGround(this.ctxs[0], groundAt,this.dieing);//Math.round
                    break;
            }
            
        }
    }
    
    this.updateSpawning=function(){
        //flying enemies shooting at you
        if(this.enemyTime > this.nextEnemy){
            this.enemyTime=0;
            this.nextEnemy=this.enemyRateMin+Math.random()*this.enemyRateRandom;
            this.spawnEnemy();
        }
        //mines, barrage balloons, etc
        if(this.obstacleTime > this.nextObstacle){
            this.obstacleTime=0;
            this.nextObstacle=6+Math.random()*12;
            this.spawnObstacle();
        }
    }
    
    this.updateEntities=function(){
        
        //sort so lowest z is drawn first
        this.entities.sort(function(a,b){
            return a.getPos().z - b.getPos().z;
        })
        
        //trying an array of htings to kill off, might get around the problems I've 
        //been having with undefined entities
        var killOff=[];
        
        this.ctxs[1].clearRect(0,0,this.width,this.height);
        for(var i=0;i<this.entities.length;i++){
            
            if(killOff.indexOf(i)>=0){
                //this is something to be killed, don't update it
                continue;
            }
            
            var animations = this.entities[i].update(this.dt);
            //if(!this.dieing){
                //don't do animations if we're dieing.. though I think animations
                //can be induced from other places too.
                for(var a=0;a<animations.length;a++){
                    this.animationController.add(animations[a]);
                }
            //}
            
            //            switch(this.section){
            //                case 0:
            //                    if(this.entities[i].getType()=="enemy" || this.entities[i].getType()=="player"){
            //                        this.splashFrom(this.entities[i].getPos(),this.entities[i].getSize());
            //                    }
            //                    break;
            //            }
            
            var pos = this.entities[i].getPos()
            //off the top or bottom
            //only kill if off the top and not an enemy - that way formations aren't destroyed
            if((pos.y < -100 && this.entities[i].getType()!="enemy" ) || pos.y > this.height+100){
                killOff.push(i);
                continue;
            }
            
            if(this.entities[i].hasExpired()){
                //this is something which has run out of time, what do we do?
                switch(this.entities[i].getType()){
                    case "flak":
                        killOff.push(i);
                        this.flakExplosion(this.entities[i].getPos());
                        //find if player was nearby - NOTE - ASSUMING FLAK IS ENEMY ONLY
                        if(this.entities[i].isFriendly()){
                            throw "flak can't be friendly!!";
                        }
                        //idea is flak has a very large range, but doesn't do *much*  damage until up close!
                        
                        var d2 = this.entities[i].getPos().subtract(this.player.getPos()).getMagnitudeSqrd();
                        if(d2<this.flakExplosionSize*this.flakExplosionSize*4){
                            //within range, damage the player
                            this.player.changeHealth(-this.entities[i].getHealth()*4/Math.sqrt(d2+1));
                        }
                        
                        break;
                }
            }
            
            switch(this.entities[i].getType()){
                case "player":
                    //check for collision
                    
                    for(var j=0;j<this.entities.length;j++){
                        if(j==i || this.entities[j].getPos().z < -5|| this.entities[j].getType()=="flak"){
                            //skip ourselves or anything which is below the player
                            //also skipping flak
                            continue;
                        }
                        var missile=false;
                        if(this.entities[j].getType()=="bullet" || this.entities[j].getType()=="bomb" ||this.entities[j].getType()=="rocket"){
                            if(this.entities[j].isFriendly()){
                                continue;
                            }
                            missile=true;
                        }
                        
                        if(this.entities[i].collidesWith(this.entities[j])){
                            //collision!  Erm, do something
                            if(missile){
                                //collided with a missile
                                this.explosion(this.entities[j].getPos(), this.entities[j].getSize());
                                this.player.changeHealth(-this.entities[j].getDamage());
                                killOff.push(j);
                            }else{
                                //collided with an enemy - lose lots of health and crash enemy?
                                this.player.changeHealth(-this.entities[j].getHealth()*0.5);
                                this.explosion(this.entities[j].getPos(), this.vehicleSize*0.25);
                                //to avoid problems with bits of the boss not respawning, only kill of something crashed into if we're
                                //not fighting a boss
                                if(this.gameState!="boss"){
                                    killOff.push(j);
                                }
                            }
                        }
                    }
                    
                    break;
                case "bullet":
                case "rocket":
                    if(this.entities[i].isFriendly()){
                        //friendly missile, check for enemies
                        
                        for(j=0;j<this.entities.length;j++){
                            if(j==i || this.entities[j].getPos().z < -5 
                                || this.entities[j].getType()!="enemy"){
                                //skip ourselves and other missiles and anything too low down
                                continue;
                            }
                            
                            //                            var d = this.entities[j].getSize()/2;
                            //                            d*=d;
                            //                            //TODO track down what cause this line to fail, when the entitiy was undefined
                            //                            if(this.entities[j].getPos().subtract(this.entities[i].getPos()).getMagnitudeSqrd() < d){
                            if(this.entities[j].collidesWith(this.entities[i])){
                                //damage the enemy
                                this.entities[j].changeHealth(-this.entities[i].getDamage());
                                if(this.entities[j].canDie() && this.entities[j].getHealth()<=0){
                                    //enemy died!
                                    this.explosion(this.entities[j].getPos(), this.vehicleSize*0.25);
                                    killOff.push(j);
                                    this.killedCount++;
                                }
                                //impact of bullet against enemy
                                this.animationController.add(this.entities[j].getHitAnimation(this.entities[i].getPos(), this.entities[i].getSize(), this.entities[i].getV()));
                                
                                //this.explosion(this.entities[i].getPos(), this.entities[i].getSize());
                                //lose the bullet
                                killOff.push(i);
                            }
                        }
                        
                    }
                    break;
                case "bomb":
                    if(this.entities[i].getPos().z<-10){
                        //bomb has hit the ground
                        //find things near it to damage
                        for(j=0;j<this.entities.length;j++){
                            if(this.entities[j].getType()!="enemy" || this.entities[j].getPos().z>=-5){
                                continue;
                            }
                                
                            //var d=Math.pow(this.entities[i].getSize()*2 + this.entities[j].getSize()/2,2);
                            //is this enemy actually near the bomb?
                            //if(this.entities[j].getPos().subtract(this.entities[i].getPos()).getMagnitudeSqrd() < d)
                            if(this.entities[j].collidesWith(this.entities[i]))
                            {
                                //only interested in enemies at the right height
                                this.entities[j].changeHealth(-this.entities[i].getDamage());
                                if(this.entities[j].getHealth()<=0){
                                    //enemy died!
                                    this.explosion(this.entities[j].getPos(), this.vehicleSize*0.25);
                                    killOff.push(j);
                                    this.killedCount++;
                                }
                            }
                        }
                            
                            
                        //bomb explosion
                        this.explosion(this.entities[i].getPos(), this.entities[i].getSize());
                        killOff.push(i);
                    }
                    break;
            }
            //            
            if(i>=0 && i < this.entities.length){
                //TODO track down what can cause i to leave this range
                this.entities[i].draw(this.ctxs[1]);
            }
        }
        
        this.killOffEntities(killOff);
    }
    //killOff is an array of their positions in the entities array, and may contain duplicates
    this.killOffEntities=function(killOff){
        //up requires Maths.js
        killOff.sort(up);
        
        var killOffNoDuplicates = [];
        for (var i = 0; i <killOff.length; i++) {
            if (killOffNoDuplicates.indexOf(killOff[i])<0) {
                killOffNoDuplicates.push(killOff[i]);
            }
        }
        
        //THINK the player getting vanished is when this.entities[killOff[i]] is undefined - is
        //this if there was a duplicate entry in killOff?
        for(var i=0;i<killOffNoDuplicates.length;i++){
            
            if(this.entities[killOffNoDuplicates[i]].getType=="player"){
                throw "Trying to kill off player";
            }
            
            this.entities.splice(killOffNoDuplicates[i],1);
            for(var j=i;j<killOffNoDuplicates.length;j++){
                killOffNoDuplicates[j]--;
            }
        }
    }
    
    this.updateHUD=function(){
        //update HUD
        this.ctxs[3].clearRect(0,0,this.width,this.height);
        
        
        var gap=this.width*0.02;
        //health
        var x = gap;
        var y = gap;
        
        var health = Math.max(0,this.player.getHealth()/100);
        
        var barWidth=this.width*0.15;
        var barHeight=barWidth*0.3;
        
        this.ctxs[3].save();
        
        this.ctxs[3].lineWidth=this.width*0.005;
        this.ctxs[3].strokeStyle="rgba(150,150,64,1)";
        
        this.ctxs[3].fillStyle="rgba(255,32,32,0.75)";
        
        this.ctxs[3].fillRect(x,y,barWidth*health,barHeight);
        this.ctxs[3].strokeRect(x,y,barWidth,barHeight);
        
        
        var heartSize=barHeight;
        
        x+=gap+barWidth+heartSize/2;
        y+=barHeight/2;
        
        for(var i=0;i<this.lives;i++){
            this.ctxs[3].save();
            this.ctxs[3].translate(x,y);
            Graphics.heart(this.ctxs[3], heartSize, 0);
            this.ctxs[3].restore();
            x+=heartSize*1.5;
        }
        
        this.ctxs[3].font = barHeight+"px Arial";
        this.ctxs[3].textBaseline="top";
            this.ctxs[3].fillStyle="rgba(0,0,0,0.75)";
            
        if(this.bonusTime > 0){
        
            x = gap;
            y = gap*2 + barHeight;
            this.ctxs[3].textAlign="left";
            this.ctxs[3].textBaseline="top";
            
            
            this.ctxs[3].fillText("Bonus:",x,y);
            
            this.ctxs[3].fillStyle="rgba(0,0,0,0.75)";
            this.ctxs[3].fillRect(x+barHeight*3.5,y+barHeight*0.1,this.bonusTime*10,barHeight);
        }
        
        if(this.gameState!="boss"){
            this.ctxs[3].textAlign="right";
            
            
            this.ctxs[3].fillText("Upgrade in:",this.width*0.9,gap);
            
            this.ctxs[3].textAlign="left";
            this.ctxs[3].fillText(this.upgradePlayerAfter*(this.playerWeapon+1)-this.killedCount+1 ,this.width*0.905,gap);
        }
        
        
        
        this.ctxs[3].restore();
        
        
        
        
        
//        this.ctxs[3].fillText("Entities: "+this.entities.length,5,15);
//        this.ctxs[3].fillText("Health: "+this.player.getHealth(),5,25);
//        this.ctxs[3].fillText("Level: "+this.section,5,35);
//        this.ctxs[3].fillText("Flying: "+this.currentFlying[this.section],5,45);
//        this.ctxs[3].fillText("Shooting: "+this.currentShooting[this.section],5,55);
//        this.ctxs[3].fillText("Guns: "+this.currentGuns[this.section],5,65);
//        this.ctxs[3].fillText("Weapon: "+this.currentWeapon,5,75);
//        this.ctxs[3].fillText("Game State: "+this.gameState,5,85);
    }
    
    this.killOffMissiles=function(){
        //for respawning, kill off all the bullets, flak and rockets
        
        var killOff=[];
        
        for(var i=0;i<this.entities.length;i++){
            switch(this.entities[i].getType()){
                case "bullet":
                case "flak":
                case "rocket":
                    killOff.push(i);
                    break;
            }
        }
        
        this.killOffEntities(killOff);
    }
    
    this.respawnPlayer=function(){
        
        //don't want old animations lurking
        this.animationController.clear();
        
        this.bonusTime=0;
        
        if(this.lives==0 && !this.godMode){
            this.changeState("lost");
            return;
        }
        
        this.dieing=false;
        this.dieingAnimationTime=0;
        this.player.setHealth(100);
        this.lives--;
        
        this.player.setPos(this.defaultPlayerPos.copy());
        
        switch(this.gameState){
            case "boss":
                //bring the boss back from offscreen
                this.formation.reset();
                //wipe out any rockets or bullets
                this.killOffMissiles();
                this.groundStopped=false;
                break;
            default:
                //kills everything off
                for(var i=0;i<this.entities.length;i++){
                    //kill everything else off
                    if(this.entities[i].getType()!="player"){
                        this.entities.splice(i,1);
                        i--;
                    }
                }
                break;
        }
    }
    
    this.upgradePlayer=function(){
        if(this.killedCount>this.upgradePlayerAfter*(this.playerWeapon+1) 
            && this.playerWeapons[this.section].length > this.playerWeapon+1){
            //upgrade the player's weapon!
            this.playerWeapon++;
            this.player.setWeapon(this.playerWeapons[this.section][this.playerWeapon],this.playerGuns[this.section][this.playerWeapon]);
        }
    }
    
    this.countAliveEnemies=function(){
        var c=0;
        for(var i=0;i<this.entities.length;i++){
            if(this.entities[i].getType()=="enemy"){
                c++;
            }
        }
        
        return c;
    }
    
    this.forceFieldHit=function(pos,size,dir){
        return new LukesAnimations.ForceFieldHit(pos,dir,new Colour(128,128,255),size*1.5);
    }
    
    //the boss lightnign core
    this.bossCoreLifted=0;
    this.boss=null;
    //how many times the core has been damaged
    this.bossHits=0;
    this.bossGuns=[];
    this.bossProps=[];
    this.bossCoreVehicle=null;
    //flying, repairing
    this.bossState="flying";
    this.bossRepairing=-1;
    //is the animation for repairing a prop running?
    this.bossRepairAnimation=false;
    this.bossPropD=0;
    //this.bossOpeningCore=false;
    this.repairTimer=0;
    this.bossCoreExposed=false;
    //currently opening or closing the core?
    this.bossCoreOpening=true;
    //how many times has the boss been damaged?
    this.bossDamaged=0;
    //is the lighting weapon currently being used?
    this.bossLightningWeapon=false;
    this.bossLightningWeaponAngle=0;
    this.bossSize=this.vehicleSize*4;
    //starting health for a core
    this.bossCoreHealth=500;
    this.bossWeaponHealth=750;
    
    this.getDamagedProp=function(){
        var engineD=this.vehicleSize*1.6;
        var end;
        switch(self.bossRepairing){
            case 0:
                end=new Vector(-engineD,-engineD);
                break;
            case 1:
                end=new Vector(engineD,-engineD);
                break;
            case 2:
                end=new Vector(-engineD,engineD);
                break;
            case 3:
            default:
                end=new Vector(engineD,engineD);
                break;
        }
        
        return end;
    }
    
    this.spawnBoss=function(){
        switch(this.section){
            case 0:
                this.spawnJetty();
                break;
            case 1:
                
                //break;
            case 2:
                this.spawnFinalBoss();
                break;
        }
        
    }
    
    this.substation=null;
    this.cage=null;
    
    this.spawnJetty=function(){
        /*
         * idea:
         * 
         * destroy the substation to open the gate to get the car?
         * 
         * make substation heavily defended with lots of guns in front.
         * 
         */
        var jettyHeight=this.height*0.5;
        
        var startPos = new Vector(this.width/2,-this.height*0.5);
        
        var formation=new BuildingFormation(startPos, new Vector(0,1), this.groundSpeed, this.height*0.6,this.player);
        
        formation.setFireRate(2, 5, 1);
        var ai = new FormationLogic(formation, new Vector(0,0,-6));
        var jetty = new Entity(startPos, this.width, this, Graphics.jetty, "enemy", ai, 500);
        
        this.addEntity(jetty);
        
        this.bossGuns=[];
        
        //weapons on the boss
        //note that z is +ve, so they will always be drawn on top of the boss
        ai = new FormationLogic(formation, new Vector(0,jettyHeight*0.4,1));
        var aaGun = new Entity(startPos, this.vehicleSize, this, Graphics.samSite , "enemy",ai,this.bossWeaponHealth);
        //var weapon = new Weapon(Graphics.bullet, this.vehicleSize*0.1, 5, this.playerSpeed, 0.1,"bullet");
        var weapon = new Weapon(Graphics.rocket, this.vehicleSize*0.5, 30, this.playerSpeed*1.5, 0.5,"rocket");
        aaGun.setWeapon(weapon ,1);
        this.addEntity(aaGun);
        this.bossGuns.push(aaGun);
        
        ai = new FormationLogic(formation, new Vector(-this.width*0.2,jettyHeight*0.4,1));
        aaGun = new Entity(startPos, this.vehicleSize, this, Graphics.samSite , "enemy",ai,this.bossWeaponHealth);
        aaGun.setWeapon(weapon ,1);
        this.addEntity(aaGun);
        this.bossGuns.push(aaGun);
        
        ai = new FormationLogic(formation, new Vector(-this.width*0.4,jettyHeight*0.4,1));
        aaGun = new Entity(startPos, this.vehicleSize, this, Graphics.samSite , "enemy",ai,this.bossWeaponHealth);
        aaGun.setWeapon(weapon ,1);
        this.addEntity(aaGun);
        this.bossGuns.push(aaGun);
        
        var cageSize=this.vehicleSize*3;
        
        ai = new FormationLogic(formation, new Vector(this.width*0.3,this.width*0.075,1));
        var cage = new Entity(startPos, cageSize, this, Graphics.blank , "enemy",ai,10000);
        cage.addVehicleAnimation(new VehicleAnimation(Graphics.lightningCage, 100000, 1, 0, cageSize, new Vector(0,0)));
        cage.setBulletHitAnimation(this.forceFieldHit);
        cage.addCollisionShape(new Shape(1, cageSize, cageSize), true);
        this.addEntity(cage);
        
        this.cage=cage;
        
        ai = new FormationLogic(formation, new Vector(this.width*0.3,this.width*0.075,1));
        var nextVehicle = new Entity(startPos, this.vehicleSize, this, Graphics.friendlyVickersValiant , "enemy",ai,10000);
        this.addEntity(nextVehicle);
        
        var substationSize=this.width*0.5;
        
        ai = new FormationLogic(formation, new Vector(-this.width*0.3,this.width*0.025,1.1));
        var substation = new Entity(startPos, substationSize, this, Graphics.substation , "enemy",ai,10000);
        substation.addCollisionShape(new Shape(1, substationSize*3/4, substationSize/4), true);
        this.addEntity(substation);
        
        this.substation=substation;
        
        this.substationAlive=true;
        
        this.boss=jetty;
        this.formation=formation;
        this.gameState="boss";
    }
    
    this.spawnFinalBoss=function(){
        //my idea for the boss is that the platform is impervious to fire
        //you can only shoot the guns and the properllers (and the protected LIGHTNING CORE)
        //once a prop is shot enough, it'll start to smoke and/or catch fire
        //then the shielf on the LIGHTNING CORE will unveil, it'll zap
        //the damaged prop for a while, then the prop will be repaired
        //and the core will cover itself up again
        //only when the core is uncovered is it possible to harm to boss!
        
        //might have to carefully adjust size of platform and prop/gun positions
        //so that it's relatively hard to shoot the props
        
        //maybe change the colour of the lightning core and/or emit smoke from it
        //as it gets more damaged?
        
        //how about for the final core damage: the lightning is flailing around in a circle
        //forcing the player to move in a circle around the ship, limiting chances of shooting
        //the core?
        //
        //Idea for weapons on the boss:
        //firstly - don't have a weapon in front - it will need destroying before the core
        //can be reached
        //
        //Every time a core is damaged, an existing weapon is upgraded, and a new weapon
        //is spawned.
        //So if there were none left, a weak one is spawned?
        //
        var size=this.vehicleSize*4;
        
        var startPos=new Vector(this.width/2,this.height/2);
        //var bossSize=size;
        
        var formation=new Formation(startPos,new Vector(this.width/2,-size*2),this.bossSize,"simple");
        
        var ai = new FormationLogic(formation, new Vector(0,0,-6));
        var bossPlane = new Entity(new Vector(0,-size), size, this, Graphics.skyFortress, "enemy", ai, 500);
        //propellers:
        var engineD=size*0.4;
        var propSpeed=10;
        bossPlane.addVehicleAnimation(new VehicleAnimation(Graphics.prop, Math.PI*2, -propSpeed, 0, size*0.3, new Vector(-engineD+0.5,-engineD+0.5)));
        bossPlane.addVehicleAnimation(new VehicleAnimation(Graphics.prop, Math.PI*2, propSpeed, 0.5, size*0.3, new Vector(-engineD+0.5,engineD+0.5)));
        bossPlane.addVehicleAnimation(new VehicleAnimation(Graphics.prop, Math.PI*2, propSpeed, 3, size*0.3, new Vector(engineD+0.5,-engineD+0.5)));
        bossPlane.addVehicleAnimation(new VehicleAnimation(Graphics.prop, Math.PI*2, -propSpeed, 2.1, size*0.3, new Vector(engineD+0.5,engineD+0.5)));
        this.bossPropD=engineD;
        
        //LIGHTNING CORE :D
        //bit of a hack so I can control how open the core is from this object with this.coreLifted
        var lightningCoreAnimation=function(ctx,size,state){
            Graphics.bossLightningCore(ctx,size,state,self.bossCoreLifted);
        }
        
        this.bossLightningCoreAnimation=new VehicleAnimation(lightningCoreAnimation, 100000, 10, 0, size*0.3, new Vector(0,0));
        bossPlane.addVehicleAnimation(this.bossLightningCoreAnimation);
        
        var lightningRepairAnimation=function(ctx,size,state){
            if(self.bossRepairAnimation){
                if(self.bossRepairing>-1){
                    var end=self.getDamagedProp();
                    Graphics.lightning(ctx, new Vector(0,0), end, self.vehicleSize*0.1);
                }
            }
            if(self.bossLightningWeapon){
                
                //                var end2 = new Vector(Math.cos(self.bossLightningWeaponAngle)*self.radius , Math.sin(self.bossLightningWeaponAngle)*self.radius)
                //                Graphics.lightning(ctx, new Vector(0,0), end2, self.vehicleSize*0.1);
                //                for(var i=0;i<4;i++){
                //                    
                //                }
                var r=0;
                var oldPos = new Vector(0,0);
                var newPos=null;
                do{
                    r+=self.radius*(0.1 + Math.random()*0.25);
                    newPos = new Vector(Math.cos(self.bossLightningWeaponAngle)*r , Math.sin(self.bossLightningWeaponAngle)*r);
                    Graphics.lightning(ctx, oldPos, newPos, self.vehicleSize*0.1);
                    oldPos=newPos;
                }
                while(r < self.radius)

            }
        }
        
        //a vehicle for the core:
        ai = new FormationLogic(formation, new Vector(0,0));
        this.bossCoreVehicle= new Entity(startPos, size*0.3, this, Graphics.blank , "enemy",ai,1000);
        this.bossCoreVehicle.setInvincible(true);
        this.bossCoreVehicle.setBulletHitAnimation(this.forceFieldHit);
        this.addEntity(this.bossCoreVehicle);
        
        
        //        this.bossRepairAnimation=true;
        //        self.bossRepairing=0;
        
        var repairAnim=new VehicleAnimation(lightningRepairAnimation, 100000, 10, 0, size*0.3, new Vector(0,0));
        bossPlane.addVehicleAnimation(repairAnim);
        this.addEntity(bossPlane);
        
        
        //the properllers are being done as enemies so they can be shot
        ai = new FormationLogic(formation, new Vector(-engineD+0.5,-engineD+0.5));
        this.bossProps[0] = new Entity(startPos, this.vehicleSize*0.5, this, Graphics.blank , "enemy",ai,1000);
        this.bossProps[0].setInvincible(true);
        this.addEntity(this.bossProps[0]);
        
        ai = new FormationLogic(formation, new Vector(engineD+0.5,-engineD+0.5));
        this.bossProps[1] = new Entity(startPos, this.vehicleSize*0.5, this, Graphics.blank , "enemy",ai,1000);
        this.bossProps[1].setInvincible(true);
        this.addEntity(this.bossProps[1]);
        
        ai = new FormationLogic(formation, new Vector(-engineD+0.5,engineD+0.5));
        this.bossProps[2] = new Entity(startPos, this.vehicleSize*0.5, this, Graphics.blank , "enemy",ai,1000);
        this.bossProps[2].setInvincible(true);
        this.addEntity(this.bossProps[2]);
        
        ai = new FormationLogic(formation, new Vector(engineD+0.5,engineD+0.5));
        this.bossProps[3] = new Entity(startPos, this.vehicleSize*0.5, this, Graphics.blank , "enemy",ai,1000);
        this.bossProps[3].setInvincible(true);
        this.addEntity(this.bossProps[3]);
        
        //weapons on the boss
        //note that z is +ve, so they will always be drawn on top of the boss
        ai = new FormationLogic(formation, new Vector(this.bossSize*0.35,0,1));
        var aaGun = new Entity(startPos, this.vehicleSize*0.9, this, Graphics.aaGun , "enemy",ai,this.bossWeaponHealth);
        //var weapon = new Weapon(Graphics.bullet, this.vehicleSize*0.1, 5, this.playerSpeed, 0.1,"bullet");
        var weapon = new Weapon(Graphics.bullet, this.vehicleSize*0.1,20,this.flakSpeed,0.75,"flak",this.enemyFlak);
        aaGun.setWeapon(weapon ,1);
        this.addEntity(aaGun);
        this.bossGuns.push(aaGun);
        
        ai = new FormationLogic(formation, new Vector(-this.bossSize*0.35,0,1));
        aaGun = new Entity(startPos, this.vehicleSize*0.9, this, Graphics.aaGun , "enemy",ai,this.bossWeaponHealth);
        //weapon = new Weapon(Graphics.bullet, this.vehicleSize*0.1,20,this.flakSpeed,0.75,"flak",this.enemyFlak);
        aaGun.setWeapon(weapon ,1);
        this.addEntity(aaGun);
        this.bossGuns.push(aaGun);
        
        //        ai = new FormationLogic(formation, new Vector(0,this.bossSize*0.35,1));
        //        aaGun = new Entity(startPos, this.vehicleSize*0.9, this, Graphics.aaGun , "enemy",ai,100);
        //        aaGun.setWeapon(weapon ,1);
        //        this.addEntity(aaGun);
        
        
        this.boss=bossPlane;
        this.formation=formation;
        this.gameState="boss";
    }
    
    this.smokeFrom=function(pos,size){
        var angle = Math.random()*Math.PI*2;
        //how far from centre
        var d = Math.random()*size/2;//Math.random()*this.vehicleSize*0.2;
        //size of final smoke blob
        var r =Math.random()*size;//Math.random()*this.vehicleSize*0.5;

        pos = pos.add(new Vector(Math.cos(angle)*d,Math.sin(angle)*d));

        var c = Math.round(32+Math.random()*64)
        var c2 = Math.round(64+Math.random()*128);

        var colour1 = new Colour(c,c,c,1);
        var colour2 = new Colour(c2,c2,c2,0);

        var stages = 10+Math.random()*10;

        this.animationController.add(new LukesAnimations.ExplosionParticle(pos, 0.1, r, colour1, colour2, stages))
    }
    
    //c is an int, 0=red, 1= white, 2 = blue
    this.colouredSmokeFrom=function(pos,size,c){
        var angle = Math.random()*Math.PI*2;
        //how far from centre
        var d = Math.random()*size/2;//Math.random()*this.vehicleSize*0.2;
        //size of final smoke blob
        var r =Math.random()*size;//Math.random()*this.vehicleSize*0.5;

        pos = pos.add(new Vector(Math.cos(angle)*d,Math.sin(angle)*d));
        
        var c1 = Math.round(32+Math.random()*64)
        var c2 = Math.round(64+Math.random()*128);
        
        var colour1;
        var colour2;
        switch(c){
            case 0:
                colour1 = new Colour(255,c1,c1,1);
                colour2 = new Colour(255,c2,c2,0);
                break;
            case 1:
                colour1 = new Colour(c1+128,c1+128,c1+128,1);
                colour2 = new Colour(c2+64,c2+64,c2+64,0);
                break;
            case 2:
                colour1 = new Colour(c1,c1,255,1);
                colour2 = new Colour(c2,c2,255,0);
                break;
        }
        
        
        var stages = 40+Math.random()*30;

        this.animationController.add(new LukesAnimations.ExplosionParticle(pos, 0.1, r, colour1, colour2, stages))
    }
    
    this.fireFrom=function(pos,size){
        for(var i=0;i<2;i++){

            var angle = Math.random()*Math.PI*2;
            //how far from centre
            var d = Math.random()*size*0.25;
            //size of final smoke blob
            var r =Math.random()*size;

            pos = pos.add(new Vector(Math.cos(angle)*d,Math.sin(angle)*d));

            var c = Math.round(96+Math.random()*64);
            var c1 = Math.round(96+Math.random()*64);
            var c2 = Math.round(128+Math.random()*128);
            var c3 = Math.round(128+Math.random()*128);

            var colour1 = new Colour(c2,c,0,1);
            var colour2 = new Colour(c3,c1,0,0);

            var stages = 10+Math.random()*10;

            this.animationController.add(new LukesAnimations.ExplosionParticle(pos, 0.1, r, colour1, colour2, stages))
            
        }
    }
    //this looks terrible
    this.splashFrom=function(pos,size){
        for(var i=0;i<5;i++){

            var angle = Math.random()*Math.PI*2;
            //how far from centre
            var d = Math.random()*size*0.5;
            //size of final smoke blob
            var r =Math.random()*size*0.25;

            pos = pos.add(new Vector(Math.cos(angle)*d,Math.sin(angle)*d));

            var c = Math.round(96+Math.random()*64);
            var c1 = Math.round(96+Math.random()*64);
            var c2 = Math.round(128+Math.random()*128);
            var c3 = Math.round(128+Math.random()*128);

            var colour1 = new Colour(c,c,c2,0);
            var colour2 = new Colour(c1,c1,c3,0.5);

            var stages = 10+Math.random()*10;

            this.animationController.add(new LukesAnimations.ExplosionParticle(pos, r, 0.01, colour1, colour2, stages))
            
        }
    }
    
    this.updateBoss=function(){
        switch(this.section){
            case 0:
                this.updateJetty();
                break;
            case 1:
                
                //break;
            case 2:
                this.updateFinalBoss();
                break;
        }
    }
    
    this.substationAlive=true;
    
    this.updateJetty=function(){
        //stop the ground moving after the jetty has stopeed
        if(!this.groundStopped && this.formation.arrived()){
            this.groundStoppedAt=this.time*this.groundSpeed;
            this.groundStopped=true;
        }
        
        
        //check if the substaion has been damaged enough yet
        
        if(this.substationAlive && this.substation.getHealth()<9000){
            this.substationAlive=false;
            this.substation.setGraphicState(1);
            this.cage.setGraphicState(1);
            this.cage.removeVehicleAnimations();
            this.cage.setGraphic(Graphics.lightningCage,-1);
            
            this.explosion(this.substation.getPos(), this.vehicleSize*1.5);
            
            this.gameState="preNextSection";
            this.nextSectionTime=this.time;
            
        }
    }
    
    this.updateFinalBoss=function(){
        //        this.bossCoreLifted+=0.01;
        //        this.bossCoreLifted%=1;

        //point guns at player
        //add a little bit of random in to make up for the fact that otherwise if the player doesn't move, both guns miss
        //due to the offset of both guns from the centre of the boss
        //this.formation.setGunDir(this.player.getPos().add(new Vector(-this.vehicleSize + Math.random()*this.vehicleSize*2,-this.vehicleSize + Math.random()*this.vehicleSize*2)).subtract(this.boss.getPos()).getUnit());
        
        this.formation.setAimAt(this.player.getPos());
        
        if(this.bossRepairing>=0 && this.bossCoreOpening){
            //one of the props is damaged
            //detected by the fact taht a core is about to be or is being repaired
            //and the core hasn't started to shut yet
            var pos = this.boss.getPos().add(this.getDamagedProp());
            this.fireFrom(pos, this.vehicleSize*0.25);
            this.smokeFrom(pos, this.vehicleSize*0.5);
            
        }
        
        if(this.bossDamaged > 1){
            //fire too
            this.fireFrom(this.boss.getPos(), this.vehicleSize*0.5);
        }
        if(this.bossDamaged > 0){
            //smoke from LIGHTNING CORE
            this.smokeFrom(this.boss.getPos(), this.vehicleSize*0.75);
        }
        

        switch(this.bossState){
            case "flying":
                var damaged=-1;
                for(var i=0;i<this.bossProps.length;i++){
                    if(this.bossProps[i].getHealth()<750){
                        damaged=i;
                        break;
                    }
                }

                if(damaged>=0){
                    //one of the props was damaged, set off the lightning
                    //repair stuff
                    this.bossState="repairing";
                    this.bossRepairing=damaged;
                    this.repairTimer=0;
                    this.bossCoreOpening=true;
                    
                    
                }
                
                
                break;
            case "preLightning":
                //the platform is shaking itself around
                //make it shake its way back to the centre
                
                if(this.formation.getPos().subtract(new Vector(this.width/2,this.height/2)).getMagnitudeSqrd() < this.width*0.1){
                    //it's close to the centre
                    //put the formation back into the centre, leave it shaking around
                    this.formation.setCentre(new Vector(this.width/2,this.height/2));
                    //put the health back
                    //increase the core's health for this final bit - I want it to be harder!  you must escape the crazying lightining I took ages to make!
                    this.bossCoreVehicle.setHealth(this.bossCoreHealth*2);
                    this.bossState="lightning";
                    //stop the repair lightining
                    //but leave the engine on fire and smoking
                    this.bossRepairAnimation=false;
                    //move slightly less violently
                    this.formation.setMoveTime(0.2);
                    //turn on the crazy weapon!
                    //this.bossLightningWeaponAngle=this.getDamagedProp().get2DAngle();
                    
                    //make the angle away from the player - gotta be slightly nice!
                    this.bossLightningWeaponAngle= this.boss.getPos().subtract(this.player.getPos()).get2DAngle();
                    this.bossLightningWeapon=true;
                }else{
                    var toCentre = new Vector(this.width/2,this.height/2).subtract(this.formation.getPos()).getUnit();
                    //move towards the centre, while still shaking
                    this.formation.setCentre(this.formation.getPos().add(toCentre.multiply(this.width*0.01)));
                }   
                break;
            case "lightning":
                //crazy lightning weapon is being used!
                //once the core is destroyed this time, the boss is dead and the game is over!
                
                this.bossLightningWeaponAngle+=Math.PI*0.25*this.dt;
                
                //                //angle to player
                //                var angleToPlayer = this.player.getPos().subtract(this.boss.getPos()).get2DAngle();
                //                
                //                if(Math.abs(angleToPlayer))
                //work out how far the player is from the LIGHTNING RAY
                var lightningDir = new Vector(Math.cos(this.bossLightningWeaponAngle),Math.sin(this.bossLightningWeaponAngle));
                //boss to player
                var bossToPlayer = this.player.getPos().subtract(this.boss.getPos());
                if(lightningDir.dot(bossToPlayer) > 0){
                    //player is on the right side of the boss to be in the lightning
                    //find the distance from the line the lightning is following to the player
                    var playerToLightning = Math.distanceLineToPoint(this.boss.getPos(),lightningDir,this.player.getPos());

                    if(playerToLightning<this.radius*0.1){
                        //damage the player!
                        this.player.changeHealth(-5);
                    }
                   
                }
                
                if(this.bossCoreVehicle.getHealth()<=0){
                    //core has been sufficiently damaged, boomtime for boss!
                    this.bossState="crashing";
                }
                
                break;
            case "crashing":
                //boss has been killed, make funky animaion here :D
                this.explosion(this.boss.getPos(), this.bossSize);
                this.changeState("won");
                break;
            case "repairing":
                //lil bit of a mess, here's what the variables do:
                //
                //bossCoreOpening: boolean, if true the core is or was in the process of opening.
                //this is still true even once it's fully open
                //
                //bossCoreLifted: number, is the current open-ness of the core lid
                //0=shut, 1 = open
                //
                //bossCoreExposed: boolean, true if the core is currently vulnerable
                //should get set if bossCoreLifted > 0.5
                //
                //bossRepairing: number, which prop is currently damaged and needs reparing
                //if -1, no props are damaged
                //gets set back to -1 as soon as the lightning stops (i think)
                //
                //bossLightningWeapon: boolean, is the final crazy flail lightning
                //around happening?
                //
                //opening
                if(this.bossCoreOpening && this.bossCoreLifted < 1){
                    this.bossCoreLifted+=0.01;
                }
                //shutting
                if(!this.bossCoreOpening && this.bossCoreLifted > 0){
                    this.bossCoreLifted-=0.01;
                }
                if(!this.bossCoreOpening && this.bossCoreLifted <=0){
                    //it's shut, get everything ready so it could be triggered again
                    //put the prop health back up to full
                    //we will get to this bit regardless of if hte core was damaged or the timer was reached
                    this.bossProps[this.bossRepairing].setHealth(1000);
                    this.bossRepairing=-1;
                    this.bossState="flying";
                    this.bossCoreOpening=true;
                    //put the formation back to normal
                    //if the formation was already normal, this won't do anything
                    this.formation.setMoveTime(3);
                    this.formation.setRange(this.bossSize);
                    this.formation.setCentre(new Vector(this.width/2,this.height/2));
                    //TODO refresh weapons!
                    
                    var liveWeapons=0;
                    for(var i=0;i<this.bossGuns.length;i++){
                        if(this.bossGuns[i].getHealth()>0){
                            liveWeapons++;
                        }
                    }
                    
                    if(liveWeapons==0){
                        //bring back to life one weapon
                        var respawn = Math.round(Math.random()*this.bossGuns.length);
                        this.bossGuns[respawn].setHealth(this.bossWeaponHealth);
                        this.addEntity(this.bossGuns[respawn]);
                    //
                    //                        ai = new FormationLogic(formation, new Vector(this.bossSize*0.35,0,1));
                    //                        var aaGun = new Entity(startPos, this.vehicleSize*0.9, this, Graphics.aaGun , "enemy",ai,100);
                    //                        var weapon = new Weapon(Graphics.bullet, this.vehicleSize*0.1, 5, this.playerSpeed, 0.1,"bullet");
                    //                        aaGun.setWeapon(weapon ,1);
                    //                        this.addEntity(aaGun);
                    }else{
                    //randomly choose one to upgrade!
                    //TODO once more weapon types exist
                    }
                    
                }
                
                //core always has a vehicle, just the animations should be different
                if(this.bossCoreLifted > 0.5 && !this.bossCoreExposed){
                    //core just opened
                    this.bossCoreExposed=true;
                    this.bossCoreVehicle.setHealth(this.bossCoreHealth);
                    //set to normal explosion animation for bullets
                    this.bossCoreVehicle.setBulletHitAnimation(null);
                    
                    this.fadeText(new Vector(this.width/2,this.height/2), this.height*0.1, "Core is exposed!", new Colour(0,0,0));
                    
                //                    if(this.entities.indexOf(this.bossCoreVehicle) <0){
                //                        //add the core to the entities array so it can be hit
                //                        this.addEntity(this.bossCoreVehicle);
                //                    }
                }
                
                if(this.bossCoreExposed && this.bossCoreOpening && this.bossCoreVehicle.getHealth()<0){
                    //also && this.bossCoreOpening so that it doesn't continue
                    ////to happen after it's triggered once
                    //they damaged the core while it was exposed!
                    //placeholder explosion
                    this.explosion(this.boss.getPos(), this.vehicleSize);
                    this.bossDamaged++;
                    
                    //make it shake about
                    this.formation.setMoveTime(0.1);
                    this.formation.setRange(this.width*0.03);
                    this.formation.setCentre(this.formation.getPos());
                    this.formation.returnToCentre();
                    
                    if(this.bossDamaged < 3){
                        //start shutting down the core
                        this.bossCoreOpening=false;
                        this.bossRepairAnimation=false;
                    }else{
                        //flail lightning around!
                        //this.bossLightningWeapon=true;
                        this.bossState="preLightning";
                    }
                    
                    
                    
                //                    this.bossCoreOpening=false;
                //                    this.bossRepairAnimation=false;
                }
                
                if(this.bossCoreLifted < 0.5 && this.bossCoreExposed){
                    //core now shut again
                    this.bossCoreExposed=false;
                    this.bossCoreVehicle.setBulletHitAnimation(this.forceFieldHit);
                }
                ////else{
                //                    //core now shut, so remove the vehicle so it can't be hit
                //                    var i=this.entities.indexOf(this.bossCoreVehicle);
                //                    if(i>=0){
                //                        this.entities.splice(this.bossCoreVehicle);
                //                    }
                //                }
                //core just finished completely opening
                if(this.bossCoreLifted>=1 && this.bossCoreOpening){
                    this.bossCoreLifted=1;
                    this.bossRepairAnimation=true;
                }
                if(this.bossCoreExposed){//} && !this.bossLightningWeapon){
                    
                
                    if(this.repairTimer > 5){
                        //finished repairing
                        //start to shut the core again!
                        this.bossCoreOpening=false;
                        this.bossRepairAnimation=false;
                    }
                    
                    this.repairTimer+=this.dt;
                }
                
                break;
        }
    //var damaged=-1;
        
        
    }
    
    this.bonusTime=0;
    this.smokePlanes=[];
    
    this.spawnFormation=function(){
        
        //which planes can leave a trail of smoke
        this.smokePlanes=[];
        
        var formation=new Formation(new Vector(this.width/2,this.height/2),new Vector(this.width/2,-this.vehicleSize*3),this.width*0.45,"simple");
        
        var vehicle;
        var startPos=new Vector(0,-this.vehicleSize);
        var ai;
        var weapon = new Weapon(Graphics.bullet, this.vehicleSize*0.1, 5, this.playerSpeed, 0.1,"bullet");
        
        switch(this.section){
            
            case 0:
                
                this.bonusTime=10;
                //                break;
                //            default:
                //3 at the back
                for(var i=0;i<3;i++){
                    ai = new FormationLogic(formation, new Vector((i-1)*this.vehicleSize*1.5,-this.vehicleSize*1.5));
                    vehicle = new Entity(startPos, this.vehicleSize, this, Graphics.hovercraft, "enemy", ai, 100);
                    vehicle.setWeapon(weapon, 2);
                    this.addEntity(vehicle);
                }
                //2 in the middle
                for(var i=0;i<2;i++){
                    ai = new FormationLogic(formation, new Vector((i*2-1)*this.vehicleSize*0.75,0));
                    vehicle = new Entity(startPos, this.vehicleSize, this, Graphics.attackBoat, "enemy", ai, 75);
                    vehicle.setWeapon(weapon, 1);
                    this.addEntity(vehicle);
                }

                //1 at the front
                ai = new FormationLogic(formation, new Vector(0,this.vehicleSize*1.5));
                vehicle = new Entity(startPos, this.vehicleSize, this, Graphics.attackBoat, "enemy", ai, 50);
                vehicle.setWeapon(weapon, 1);
                this.addEntity(vehicle);
                break;
                //case 0:
                case 1:
                case 2:
                    if(this.currentWeapon==this.formationFightAtWeapon[this.section]){
                        //this is the first formation
                        //
                        //red arrows style formation
                        //      
                        //                  *
                        //              *       *
                        //                  *
                        //              *       *
                        //          *       *       *
                        
                        //speed it up a bit
                        formation.setMoveTime(2);
                        formation.setFireFor(0.25);
                        //how far apart
                        var dist = this.vehicleSize*1.5;

                        this.bonusTime=15;

                        //front plane
                        ai = new FormationLogic(formation, new Vector(0,dist));
                        vehicle = new Entity(startPos, this.vehicleSize, this, Graphics.redArrow, "enemy", ai, 75);
                        vehicle.setWeapon(weapon, 1);
                        this.addEntity(vehicle);

                        //front left
                        ai = new FormationLogic(formation, new Vector(-dist,dist/2));
                        vehicle = new Entity(startPos, this.vehicleSize, this, Graphics.redArrow, "enemy", ai, 75);
                        vehicle.setWeapon(weapon, 1);
                        this.addEntity(vehicle);
                        //front right
                        ai = new FormationLogic(formation, new Vector(dist,dist/2));
                        vehicle = new Entity(startPos, this.vehicleSize, this, Graphics.redArrow, "enemy", ai, 75);
                        vehicle.setWeapon(weapon, 1);
                        this.addEntity(vehicle);

                        //middle
                        ai = new FormationLogic(formation, new Vector(0,0));
                        vehicle = new Entity(startPos, this.vehicleSize, this, Graphics.redArrow, "enemy", ai, 75);
                        vehicle.setWeapon(weapon, 1);
                        this.addEntity(vehicle);

                        //mid left
                        ai = new FormationLogic(formation, new Vector(-dist,-dist/2));
                        vehicle = new Entity(startPos, this.vehicleSize, this, Graphics.redArrow, "enemy", ai, 75);
                        vehicle.setWeapon(weapon, 1);
                        this.addEntity(vehicle);
                        //mid right
                        ai = new FormationLogic(formation, new Vector(dist,-dist/2));
                        vehicle = new Entity(startPos, this.vehicleSize, this, Graphics.redArrow, "enemy", ai, 75);
                        vehicle.setWeapon(weapon, 1);
                        this.addEntity(vehicle);


                        //far rear left
                        ai = new FormationLogic(formation, new Vector(-dist*2,-dist));
                        vehicle = new Entity(startPos, this.vehicleSize, this, Graphics.redArrow, "enemy", ai, 75);
                        vehicle.setWeapon(weapon, 1);
                        this.addEntity(vehicle);
                        this.smokePlanes.push(vehicle);

                        //rear plane
                        ai = new FormationLogic(formation, new Vector(0,-dist));
                        vehicle = new Entity(startPos, this.vehicleSize, this, Graphics.redArrow, "enemy", ai, 75);
                        vehicle.setWeapon(weapon, 1);
                        this.addEntity(vehicle);
                        this.smokePlanes.push(vehicle);

                        //far rear right
                        ai = new FormationLogic(formation, new Vector(dist*2,-dist));
                        vehicle = new Entity(startPos, this.vehicleSize, this, Graphics.redArrow, "enemy", ai, 75);
                        vehicle.setWeapon(weapon, 1);
                        this.addEntity(vehicle);
                        this.smokePlanes.push(vehicle);
                        break;
                    }else{
                        //this is the second 'formation' - in this case just one huge plane!
                        //but seems to be easiest to use the formation system
                        
                        var scale=7;
                        
                        ai = new FormationLogic(formation, new Vector(0,0));
                        vehicle = new Entity(startPos, this.vehicleSize*scale, this, Graphics.russianSkyFortress, "enemy", ai, 1250);
                        //one wide rectangle
                        vehicle.addCollisionShape(new Shape(1,this.vehicleSize*scale , this.vehicleSize*scale*0.4), true);
                        //one tall thin one
                        vehicle.addCollisionShape(new Shape(1,this.vehicleSize*scale*0.2 , this.vehicleSize*scale*0.25), false);
                        vehicle.setWeapon(weapon, "fortress");
                        this.addEntity(vehicle);
                    }
        }
        
        
        
        this.formation=formation;
        
        this.gameState="formation";
    }
    
    //in the process of fading out the screen to get to the next section
    this.switchSectionUpdate=function(t){
        var fadeTime=5;
        
        var timeSoFar=this.time - this.nextSectionTime;
        
        var faded = Math.min(1,timeSoFar/fadeTime);
        
        this.ctxs[3].save();
        this.ctxs[3].fillStyle="rgba(0,0,0,"+faded+")";
        this.ctxs[3].fillRect(0,0,this.width,this.height);
        this.ctxs[3].restore();
        
        if(timeSoFar > fadeTime){
            
            this.ctxs[3].save();
            this.ctxs[3].fillStyle="rgb(255,255,255)";
            this.ctxs[3].font = this.height*0.1+"px Arial";
            this.ctxs[3].textAlign="center";
            this.ctxs[3].textBaseline="middle";
            this.ctxs[3].fillText("Level "+(this.section+2),this.width*0.5,this.height*0.5);
            this.ctxs[3].restore();
            //next section!
            
            if(timeSoFar - fadeTime > 5){
                //had enough time of the text, move to next section
                this.section++;
                this.startSection();
            }
        }
    }
    
    this.startSection=function(){
        this.entities=[];
        this.groundStopped=false;
        this.player.setHealth(100);
        this.player.setGraphic(this.playerGraphics[this.section]);
        this.addEntity(this.player);
        //this.gameState="flying";
        this.player.setPos(this.defaultPlayerPos.copy());
        
        this.nextEnemy=2+Math.random()*5;
        this.enemyTime=0;

        this.time=0;
        this.count=0;
        
        //make sure at least 3 lives
        //this.lives=Math.max(3,this.lives);

        this.enemyCount=0;
        this.enemyRateMin=2;
        this.enemyRateRandom=3;

        //current worst weapon the enemy can throw at you
        this.currentWeapon=0;

        //probabilities of each weapon, as proportion of total sum of array
        this.weaponProb=[];//[1,1,1];
        for(var i=0;i<this.enemyWeapons[this.section].length;i++){
            this.weaponProb.push(1);
        }


        this.playerWeapon=0;

        this.player.setWeapon(this.playerWeapons[this.section][this.playerWeapon],this.playerGuns[this.section][this.playerWeapon]);

        this.upgradeEnemyCount=0;

        //upgrade enemies after so many enenmies have spawned
        this.upgradeEnemiesAfter=5;
        //upgrade player's weapon after so many have been killed
        this.upgradePlayerAfter=30;
        this.killedCount=0;
        this.backgroundPos=0;

        this.start();
        this.spawnEnemy();

        this.gameState="flying";
        //this.gameState="preBoss";
        //this.gameState="preFormation";
        
        
        
    }
    
    //a formation is running, this is updating it
    this.updateFormation=function(t){
        this.formation.update(t);
        if(this.countAliveEnemies()==0){
            //formation all dead, back to normal

            if(this.bonusTime > 0){
                //formation was killed fast enough to get a bonus!
                this.bonusTime=0;
                switch(this.section){
                    default:
                    this.fadeText(new Vector(this.width/2,this.height/2), this.width*0.1, "Extra Life!");
                    this.lives++;
                    break;
                }
            }

            this.gameState="flying";
        }
        
        for(var i=0;i<this.smokePlanes.length;i++){
            if(this.smokePlanes[i].getHealth()>0){
                this.colouredSmokeFrom(this.smokePlanes[i].getPos().add(new Vector(0,-this.vehicleSize/2)), this.vehicleSize*0.3, i);
                this.colouredSmokeFrom(this.smokePlanes[i].getPos().add(new Vector(0,-this.vehicleSize/2)), this.vehicleSize*0.3, i);
            }
            
        }
        
        this.bonusTime-=t;
    }
    
    this.update=function(){
        
        
        
        switch(this.state){
            case "playing":
                var t = this.dt;
                if(this.dieing){
                    this.dieingAnimationTime+=t;
                    
                    for(var i=0;i<this.ctxs.length;i++){
                        this.ctxs[i].clearRect(0,0,this.width,this.height);
                        this.ctxs[i].save();
                        
                        this.ctxs[i].translate(this.width/2,this.height/2);
                        //zoom in
                        this.ctxs[i].scale(Math.pow(2,this.dieingAnimationTime*(2/8)),Math.pow(2,this.dieingAnimationTime*(2/8)))
                        
                        this.ctxs[i].rotate(this.dieingAnimationTime*(Math.PI*2)/4);
                        this.ctxs[i].translate(-this.width/2,-this.height/2);
                    }
                }
                
                this.animationController.loop();
                
                //draw background, first as it's most noticble if it lags
                //doesn't seem to make any difference
                this.updateBackground();
                
                if(!this.dieing){
                    this.playerLogic.keysPressed(this.up, this.down, this.left, this.right, this.fire1, this.fire2, this.fire3);
                }
                
                this.updateEntities();
                //if(!this.dieing){
                    this.updateHUD();
                //}
                switch(this.gameState){
                    case "flying":
                        this.updateSpawning();
                        this.upgradePlayer();
                        break;
                    case "preBoss":
                        if(this.countAliveEnemies()==0){
                            this.spawnBoss();   
                        }
                        break;
                    case "preFormation":
                        if(this.countAliveEnemies()==0){
                            //no enemies on the screen, start a formation!
                            this.spawnFormation();
                        }
                        break;
                    case "boss":
                        this.formation.update(t);
                        this.updateBoss();
                        break;
                    case "formation":
                        this.updateFormation(t);
                        
                        break;
                    case "preNextSection":
                        //TODO - wait a short while, then fade the screen out
                        this.switchSectionUpdate(t);
                        break;
                }
                
                
                if(this.player.getHealth()<=0){
                    this.dieing=true;
                    //animations are turned off because they're controlled by their own loop
                    ////not anymore!
//                    this.animationController.stop();
//                    this.animationController.clear();
                    this.playerLogic.keysPressed(false, false, false, false, false, false, false);
                    
                    
                }
                
                if(this.dieing){
                    for(var i=0;i<this.ctxs.length;i++){
                        this.ctxs[i].restore();
                    }
                }
                
                if(this.dieingAnimationTime > 4){
                    //finish the animation, respawn, kill all the enemies
                    this.respawnPlayer();
                }
                
                this.time+=t;
                this.enemyTime+=t;
                this.obstacleTime+=t;
                this.backgroundPos+=t*this.groundSpeed;
                this.count++;
                break;
            case "menu":
                    
                break;
        }
        
    }
    
    this.addEntity=function(entity){
        this.entities.push(entity);
    //now sort them
        
        
    }
    
    this.flakExplosion=function(pos){
        for(var i=0;i<10;i++){
            this.smokeFrom(pos,this.flakExplosionSize);
        }
    }
    
    this.explosion=function(pos,size){
        this.animationController.add(new LukesAnimations.Explosion2(pos, size));
    }
    
    this.fadeText=function(pos,size,text,colour){
        if(typeof(colour)=="undefined"){
            colour = new Colour(0,0,0);
        }
        this.animationController.add(new LukesAnimations.TextFadeUp(pos,pos,1,0,text,size,colour,60))
    }
    
    //this.sectionStaticObstacles=[]
    
    //two types, static and active: static just sits there, like a rock or balloon
    //active will shoot you.
    this.spawnObstacle=function(){
        var active = Math.random()<0.5;
        
        if(this.section==0){
            this.active=false;
        }
        
        //if active ,then it can fire
        //if not, it can't
        var ai = new EnemyLogic(this.groundSpeed, 0 , active ? 0:-1, this);
        
        var startPos = new Vector(this.vehicleSize + Math.random()*(this.width-2*this.vehicleSize), -this.vehicleSize);
        
        switch(this.section){
            case 0:
                startPos.z=-1;
                
                var graphic = Graphics.seaMine;

                var vehicle = new Entity(startPos, this.vehicleSize*0.75, this, graphic , "enemy",ai,200,Math.random()*Math.PI*2);
                //vehicle.setGraphicState(Math.random()*Math.PI*2);
                this.addEntity(vehicle);
                break;
            default:
                if(active){
            
                    var graphic = Graphics.aaGun;
                    startPos.z=-10;

                    var vehicle = new Entity(startPos, this.vehicleSize*0.9, this, graphic , "enemy",ai,50);
                    //var weapon = new Weapon(Graphics.bullet, this.vehicleSize*0.1, 5, this.playerSpeed, 0.1,"bullet");
                    //flak :D
                    var weapon = new Weapon(Graphics.bullet, this.vehicleSize*0.1,20,this.flakSpeed,0.75,"flak",this.enemyFlak);

                    vehicle.setWeapon(weapon ,1);
                    this.addEntity(vehicle);
                //


                }else{
                    //put it below all the aircraft and bullets, but still able to collide with the player
                    startPos.z=-1;
                    var left = Math.random()<0.5;
                    var graphic = left ? Graphics.barrageBalloonLeft : Graphics.barrageBalloonRight;

                    var vehicle = new Entity(startPos, this.vehicleSize*1.5, this, graphic , "enemy",ai,500);
                    this.addEntity(vehicle);
                }
                break;
        }
        
        
    }
    
    this.upgradeEnemies=function(){
        //have we got anything left to upgrade for this weapon?
        var fullyUpgraded=this.currentFlying[this.section][this.currentWeapon]==this.maxFlying[this.section][this.currentWeapon] 
        && this.currentShooting[this.section][this.currentWeapon]==this.maxShooting[this.section][this.currentWeapon]
        && this.currentGuns[this.section][this.currentWeapon]==this.maxGuns[this.section][this.currentWeapon];

        if(fullyUpgraded){
            //can we upgrade the weapon any further at this section?
            if(this.currentWeapon<this.enemyWeapons[this.section].length-1){
                //give the AI the next weapon :D
                this.currentWeapon++;

                //shift probabilities in favour of better weapons
                for(var i=0;i<this.weaponProb.length;i++){
                    this.weaponProb[i]+=i;
                }
                if(this.currentWeapon==this.formationFightAtWeapon[this.section] || this.currentWeapon == this.secondFormationFightAtWeapon[this.section]){
                    //ready for a formation!
                    this.gameState="preFormation"
                }
            }else{
                //AI and guns can't be upgraded any more at this weapon
                //TODO start the boss fight once the last enemies are dead!
                this.gameState="preBoss";
            }
        }
        
        //checking for fully upgraded FIRST so that once the final upgrade has happened, it is actually seen ebfore the next stage.
        
        
        var i=0;
        var upgraded=false;
        
        //this will always upgrade something if something is available to upgrade.
        //by default it rotates around the three things: flying, guns and shooting
        //if one of these is fully upgraded for this weapon, it will upgrade one of the others
        //it will also not upgrade anything if they're all fully upgraded
        
        while(!upgraded && i<3){
            //time to upgrade!
            switch((this.upgradeEnemyCount+i)%3){
                //delibertly letting it fall throuygh if something is maxed out, because 
                //many of the lower section enemies I want to upgrade quickly, and often their guns cna't be
                //upgraded at all, and their other things can't be upgraded much
                //the fall through is only working in a specific order - might alter this later
                case 2:
                    //upgrade guns
                    if(this.currentGuns[this.section][this.currentWeapon]<this.maxGuns[this.section][this.currentWeapon]){
                        this.currentGuns[this.section][this.currentWeapon]++;
                        //break;
                        upgraded=true;
                    }
                    break;
                case 1:
                    //upgrade shooting
                    if(this.currentShooting[this.section][this.currentWeapon]<this.maxShooting[this.section][this.currentWeapon]){
                        this.currentShooting[this.section][this.currentWeapon]++;
                        //break;
                        upgraded=true;
                    }
                    break;
                case 0:
                    //upgrade flying
                    if(this.currentFlying[this.section][this.currentWeapon]<this.maxFlying[this.section][this.currentWeapon]){
                        this.currentFlying[this.section][this.currentWeapon]++;
                        //break;
                        upgraded=true;
                    }
                    break;  
            }
            i++;
        }
        
        this.upgradeEnemyCount++;
        this.enemyRateMin*=0.9;
        this.enemyRateRandom*=0.95;
    }
    
    this.spawnEnemy=function(){
        this.enemyCount++;

        var weapon=Math.getWeightedRandom(this.weaponProb.slice(0,this.currentWeapon+1));
        
        var graphic = this.enemyGraphics[this.section][weapon];
        var health= this.enemyHealths[this.section][weapon];
        
        var flying = this.minFlying[this.section][weapon] + Math.round(Math.random()*(this.currentFlying[this.section][weapon]-this.minFlying[this.section][weapon]));
        var shooting = this.minShooting[this.section][weapon] + Math.round(Math.random()*(this.currentShooting[this.section][weapon]-this.minShooting[this.section][weapon]));
        
        var ai = new EnemyLogic(this.height*0.1, flying , shooting, this);
        
        if(this.enemyCount%this.upgradeEnemiesAfter==0){
            this.upgradeEnemies();
        }

        var startPos = new Vector(this.vehicleSize + Math.random()*(this.width-2*this.vehicleSize), -this.vehicleSize);
        var vehicle = new Entity(startPos, this.vehicleSize, this, graphic , "enemy",ai,health);
        
        var shape = this.enemyShapes[this.section][weapon];
        if(shape!=null){
            //if using non default collision detection:
            vehicle.addCollisionShape(shape, true);
        }
        var guns = this.minGuns[this.section][weapon] + Math.round(Math.random()*(this.currentGuns[this.section][weapon]-this.minGuns[this.section][weapon]));
        
        vehicle.setWeapon(this.enemyWeapons[this.section][weapon],guns);
        this.addEntity(vehicle);
    }
    
    
    
    this.getPlayer=function(){
        return this.player;
    }
    
    this.getVehicleSize=function(){
        return this.vehicleSize;
    }
    
    
    this.stop=function()
    {
        clearInterval(this.thread);
        this.running=false;
    }
	
    this.start = function()
    {
        if(!this.running){
            this.thread = setInterval(function(){
                self.update.call(self)
            }, this.interval);
            this.running=true;
        }
    }
    
    this.bombsAllowed=function(){
        return this.section>0;
    }
    
    this.left=false;
    this.down=false;
    this.up=false;
    this.right=false;
    this.fire1=false;
    this.fire2=false;
    this.fire3=false;
    
    self.keydown=function(e){
        switch(e.keyCode){
            case 39://right arrow
            case 68://d
                self.right=true;
                break;
            case 38://up arrow
            case 87://w
                self.up=true;
                break;
            case 37://left arrow
            case 65://a
                self.left=true;
                break;
            case 40://down arrow
            case 83://s
                self.down=true;
                break;
            case 16://shift
                self.fire2=true;
                break;
            case 13://enter
                self.fire1=true;
                break;
            case 32://space
                self.fire3=true;
                break;
        }
    //self.updateInput();
    }
    
    
    self.keyup=function(e){
        switch(e.keyCode){
            case 39://right arrow
            case 68://d
                self.right=false;
                break;
            case 38://up arrow
            case 87://w
                self.up=false;
                break;
            case 37://left arrow
            case 65://a
                self.left=false;
                break;
            case 40://down arrow
            case 83://s
                self.down=false;
                break;
            case 16://shift
                self.fire2=false;
                break;
            case 13://enter
                self.fire1=false;
                break;
            case 32://space
                self.fire3=false;
                break;
        }
    //self.updateInput();
    }
    
    this.click=function(e){
        var x,y;
                
        if(e.pageX || e.pageY){
            x=e.pageX;
            y=e.pageY;
        }else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        
        var canvasPos = $(self.div).offset();
        
        x-=canvasPos.left;
        y-=canvasPos.top;
        
        switch(self.state){
            case "won":
            case "lost":
                
                self.changeState("menu");
                
                break;
            case "menu":
            
                self.menuController.click(x,y);
                break;
        }
        
    }
    
    this.startAtSection=function(section){
        this.section=section;
        this.changeState("playing");
//        this.currentWeapon=2;
//        this.gameState="preFormation";
        
    }
    
    this.titlePos=new Vector(this.width/2,this.height*0.1);
    
    this.menuController=new CanvasGUI(this.canvases[3], this.ctxs[3]);
    
    this.menuController.addMenu("main", null);
    this.menuController.addText("main",this.titlePos , this.height*0.1,"Shooter");
    this.menuController.addButton("main", new Vector(this.width/2,this.height*0.3), this.width*0.5, this.height*0.1, "Play", function(){self.changeState("playing")});
    this.menuController.addButton("main", new Vector(this.width/2,this.height*0.45), this.width*0.5, this.height*0.1, "Practise", "levels");
    this.menuController.addButton("main", new Vector(this.width/2,this.height*0.6), this.width*0.5, this.height*0.1, "High Scores", "scores");
    this.menuController.addButton("main", new Vector(this.width/2,this.height*0.75), this.width*0.5, this.height*0.1, "Help", "help");
    this.menuController.addButton("main", new Vector(this.width/2,this.height*0.9), this.width*0.5, this.height*0.1, "About", "about");
    
    this.menuController.addMenu("levels", null);
    this.menuController.addText("levels",this.titlePos , this.height*0.1,"Choose Level");
    this.menuController.addButton("levels", new Vector(this.width/2,this.height*0.9), this.width*0.5, this.height*0.1, "Back", "main");
    this.menuController.addButton("levels", new Vector(this.width/2,this.height*0.3), this.width*0.5, this.height*0.1, "Level 1", function(){self.startAtSection(0)});
    this.menuController.addButton("levels", new Vector(this.width/2,this.height*0.45), this.width*0.5, this.height*0.1, "Level 2", function(){self.startAtSection(1)});
    
    
    this.menuController.addMenu("scores", null);
    this.menuController.addText("scores",this.titlePos , this.height*0.1,"High Scores");
    this.menuController.addButton("scores", new Vector(this.width/2,this.height*0.9), this.width*0.5, this.height*0.1, "Back", "main");
    
    this.menuController.addMenu("help", null);
    this.menuController.addText("help",this.titlePos , this.height*0.1,"Help");
    this.menuController.addTextBlock("help", new Vector(this.width/2,this.height*0.3), this.height*0.03, ["WASD keys to move","Enter to shoot main guns","Shift to drop bombs (only from planes)"])
    this.menuController.addButton("help", new Vector(this.width/2,this.height*0.9), this.width*0.5, this.height*0.1, "Back", "main");
    
    this.menuController.addMenu("about", null);
    this.menuController.addText("about",this.titlePos , this.height*0.1,"About");
    //this.menuController.addText("about",new Vector(this.width/2,this.height*0.3) , this.height*0.05,"Testing \n Multiple \n Lines");
    this.menuController.addTextBlock("about", new Vector(this.width/2,this.height*0.3), this.height*0.03, ["Shooter is Copyright (c) Luke Wallin 2012","Some artwork is public domain (via Wikipedia)","See www.lukewallin.co.uk/games/shooter for more details.","","Inspired by memories of classics like Bomber and","Invasion of the Mutant Space Bats of Doom"])
    this.menuController.addButton("about", new Vector(this.width/2,this.height*0.9), this.width*0.5, this.height*0.1, "Back", "main");
    
    //menustate is what menu is going to be loaded when the menu system is loaded
    //this.menuState="main";
    
    this.buttons=[];
    
    this.loadMenu=function(){
        
        for(var i=0;i<this.ctxs.length;i++){
            this.ctxs[i].clearRect(0,0,this.width,this.height);
        }
        this.graphics.drawGround(this.ctxs[0], 0,false);
        //grey it a bit
        this.ctxs[0].save();
        this.ctxs[0].fillStyle="rgba(255,255,255,0.2)";
        this.ctxs[0].fillRect(0,0,this.width,this.height);
        this.ctxs[0].restore();
        
        //load the main menu
        //this.menuController.open(this.menuState);
        this.menuController.open("main");
    }
    
    this.changeState=function(newState){
        
//        //wipe everything
//        not doing this so that when losing or winning, the world stays there behind it
//        for(var i=0;i<this.ctxs.length;i++){
//            this.ctxs[i].clearRect(0,0,this.width,this.height);
//        }
        
        this.state=newState;
        switch(newState){
            case "playing":
                
                //this.level=0;
                //this.section=0;
                this.lives=3;
                this.startSection();
                //this.gameState="preFormation";
                break;
            case "menu":
                this.loadMenu();
                break;
            case "won":
                this.ctxs[1].save();
                //grey out the lower canvas
                this.ctxs[1].fillStyle="rgba(128,128,128,0.5)";
                this.ctxs[1].fillRect(0,0,this.width,this.height);
                this.ctxs[1].restore();
                
                //big text on the hud canvas
                this.ctxs[3].save();
                this.ctxs[3].font = this.height*0.1+"px Arial";
                this.ctxs[3].textAlign="center";
                this.ctxs[3].textBaseline="middle";
                this.ctxs[3].fillText("You Won!",this.width*0.5,this.height*0.5);
                this.ctxs[3].restore();
                break;
            case "lost":
                
                this.ctxs[1].save();
                //grey out the lower canvas
                this.ctxs[1].fillStyle="rgba(128,128,128,0.5)";
                this.ctxs[1].fillRect(0,0,this.width,this.height);
                this.ctxs[1].restore();
                
                //big text on the hud canvas
                this.ctxs[3].save();
                this.ctxs[3].font = this.height*0.1+"px Arial";
                this.ctxs[3].textAlign="center";
                this.ctxs[3].textBaseline="middle";
                this.ctxs[3].fillText("You Lost",this.width*0.5,this.height*0.5);
                this.ctxs[3].restore();
                break;
        }
    }
    
    
    
    //window.
    window.addEventListener("keydown", this.keydown, false);
    window.addEventListener("keyup", this.keyup, false);
    //window.addEventListener(type, listener, useCapture)
    
    this.div.addEventListener("click", this.click, false);
    
    //this.changeState("playing");
    this.changeState("menu");
}

