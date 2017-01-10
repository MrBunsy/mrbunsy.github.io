/* 
 * Copyright Luke Wallin 2012
 * 
 * controls a player vehicle
 * 
 */


var PlayerLogic=function(worldWidth,worldHeight,playerSize,playerSpeed){
    this.width=worldWidth;
    this.height=worldHeight;
    
    this.playerSize=playerSize;
    this.playerSpeed=playerSpeed;
    
    this.dt=0;
    this.pos=new Vector(0,0);
    this.v=new Vector(0,0);
    
    this.update=function(pos,dt){
        return [];
    };
    
    this.newPos=function(playerPos,dt){
        playerPos = playerPos.addMultiple(this.v,dt);
        
        playerPos.x = Math.max(playerPos.x,this.playerSize/2);
        //sto going off right
        playerPos.x = Math.min(playerPos.x,this.width-this.playerSize/2);
        
        //bodge not using /2 to get hovercraft to work better
        //stop going off top
        playerPos.y = Math.max(playerPos.y,this.playerSize*0.6);
        //stop going off bottom
        playerPos.y = Math.min(playerPos.y,this.height-this.playerSize*0.75);
        
        return playerPos;
    }
    
    this.up=false;
    this.down=false;
    this.left=false;
    this.right=false;
    this.guns=false;
    this.bomb=false;
    this.special=false;
    
    this.keysPressed=function(up,down,left,right,guns,bomb,special){
        this.up=up;
        this.down=down;
        this.left=left;
        this.right=right;
        this.guns=guns;
        this.bomb=bomb;
        this.special=special;
        
        
        var x = (this.left ? -1 : 0) + (this.right ? 1 : 0);
        //x*=200;
        var y = (this.up ? -1 : 0) + (this.down ? 1 : 0);
        //y*=200;
        var v = new Vector(x,y);
        
        v= v.getUnit().multiply(this.playerSpeed);
        
        this.v=v;
    }
    
    this.fireGun=function(){
        return this.guns;
    }
    
    this.fireBomb=function(){
        return this.bomb;
    }
    
    this.fireSpecial=function(){
        return this.special;
    }
    
    this.isFriendly=function(){
        return true;
    }
    
    this.getV=function(){
        return this.v;
    }
    
    this.getGunDir=function(){
        return new Vector(0,-1);
    }
    
}