/* 
 * Copyright Luke Wallin 2012
 * 
 * ported from JavaTree
 * 
 */


//class
var Camera =  function(pos,dir,lensDistance,lensSize){
    
    // ------------ constuctor ------------
    this.pos=pos;
    this.dir=dir;
    this.lensDistance=lensDistance;
    this.lensSize=lensSize;
    
    // ------------ methods ------------
    
    this.getPost=function(){
        return this.pos;
    }
    
    this.setPosAndDir=function(pos, dir){
        this.pos=pos;
        this.dir=dir.getUnit();
    }
    
    this.setupRez=function(xPixels, yPixels){
        this.xPixels=xPixels;
        this.yPixels=yPixels;
        this.setupScreenCorners(yPixels/xPixels);
    }
    
    this.threeDTo2D=function(s){
        
        //project line from position in world to camera
        //find out where this line intersects with the screen
        
        //Vector s = threeD;
        //line from threeD to camera = t*l + l0
        var d = this.pos.subtract(s);
        //TODO check for if d is now zero
        //if(d.)
        
        if(this.dir.dot(d)==0){
            //the normal and the line are perpendicular - therefore the line is in parralelle with the plane
            return new Vector(0,0,0);
        }else{
            //not parallel
            //line:  r=s + td
            //t = (point on plane - s ) . n / d.n

            var t=this.screenTopLeft.subtract(s).dot(this.dir)/d.dot(this.dir);

            //collision point
            var c=s.add(d.multiply(t));
            
            
            var screenCollision=c.subtract(this.screenTopLeft);
            
            //how far along top of screen
            var x = this.xDir.dot(screenCollision);
            var y = this.yDir.dot(screenCollision);
            
            x = (x/this.width)*this.xPixels;
            y = (y/this.height)*this.yPixels;
            
            return new Vector(x,y);
        
        //idea: find vector from top left corner of screen to collision point.  then get values for top of screen dot with this, and side of screen dot with this
        //this will give how far along each 'axis' of the screen the ocllision point is, and this can be scaled to x,y coords
        }
        
        //return new Vector(0,0);
    }
    
    this.setupScreenCorners=function(ratio){
        //dir=direction camera is facing, distance is distance of screen
        //$ratio=$aspect;
        //of the screen:
        
        //this means that as the window gets wider, the camera sort of zooms in
        //width=lensSize;
        //height=lensSize*ratio;
        
        //as the window gets wider, you see more!  much better for wider screens
        this.height = this.lensSize;
        this.width = this.lensSize/ratio;
        
        //v2 is horizontal vector
        //v1 is the other vector

        var n=this.dir;

        //massive hack - should probably work through the maths and find the special cases.
        if(n.x==0){
            n.x=0.00000001;
        }

        if(n.y==0){
            n.y=0.00000001;
        }

        if(n.z==0){
            n.z=0.00000001;
        }

        var v1z=1;//want this to face upwards where up is +ve z

        var v1y=-(n.z*n.y)/(n.x*n.x + n.y*n.y);

        var v1x=v1y*n.x/n.y;

        var v2x=1;
        var v2y=-n.x/n.y;
        var v2z=0;//horizontal!

        
        
        var v1=new Vector(v1x,v1y,v1z);
        v1=v1.getUnit().multiply(this.height/2);
        var v2=new Vector(v2x,v2y,v2z);
        v2=v2.getUnit().multiply(this.width/2);

        //HACK
        if(this.pos.y >0 ){
            v2=v2.multiply(-1.0);
        }
        //centre of the screen1
        var centre=this.pos.addMultiple(n,this.lensDistance);

        var topLeft=centre.subtract(v2).add(v1);
        var topRight=centre.add(v2).add(v1);

        var bottomLeft=centre.subtract(v2).subtract(v1);
        var bottomRight=centre.add(v2).subtract(v1);
        
        //remember useful stuff
        this.screenTopLeft=topLeft;
        this.xDir=topRight.subtract(topLeft).getUnit();
        this.yDir=bottomLeft.subtract(topLeft).getUnit();
        
        return [topLeft,bottomLeft,bottomRight,topRight];
    }
}