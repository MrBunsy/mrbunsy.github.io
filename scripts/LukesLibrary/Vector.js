/* 
 * Copyright Luke Wallin 2012
 * 
 * ported from Java in LukesBits
 * 
 */

var Vector  =function(x,y,z){
    
    //public double x,y,z;
    
    // ------------ constuctor ------------
    
    this.x=x;
    this.y=y;
    if(typeof(z)=="undefined"){
        this.z=0;
    }else{
        this.z=z;
    }
    
    // ------------ methods ------------
    
    this.equals=function(v){
        return v!=null && v.x== this.x && v.y== this.y && v.z == this.z;
    }
    
    this.get=function(i){
        if(i==0){
            return this.x;
        }
        if(i==1){
            return this.y;
        }else{
            return this.z;
        }
        
    }
    
    this.getRoundedX=function(){
        return Math.round(this.x);
    }
    
    
    this.getRoundedY=function(){
        return Math.round(this.y);
    }
    
    this.getRoundedZ=function(){
        return ath.round(this.z);
    }
    
    this.getMagnitude=function(){
        
        var d = (this.x*this.x)+(this.y*this.y)+(this.z*this.z);
        
        //return SquareRootHack.sqrt((float)d);
        //return SquareRoot.sqrt((x*x)+(y*y)+(z*z));
        return Math.sqrt(d);
    }
    
    this.getMagnitudeSqrd=function(){
        return (this.x*this.x)+(this.y*this.y)+(this.z*this.z);
    }
    
    this.get2DAngle = function(){
        return Math.atan2(this.y, this.x);
    }
    
    this.getUnit=function(){
        //TODO check if mag equals one?  if it does, leave be.
        var mag = this.getMagnitude();
        if(mag==0){
            return new Vector(0,0,0);
        }
        var invSize = 1/mag;
        
        var newX=this.x*invSize;
        var newY=this.y*invSize;
        var newZ=this.z*invSize;
        
        return new Vector(newX,newY,newZ);
    }
    
    this.add=function(a){
        return new Vector(this.x+a.x,this.y+a.y,this.z+a.z);
    }
    
    this.addMultiple=function(a,coef){ 
        return new Vector(this.x+coef*a.x,this.y+coef*a.y,this.z+coef*a.z);
    }
    
    this.subtractMultiple=function(a,coef){
        return this.add(a,-coef);
    }
    
    this.subtract=function(a){
        return new Vector(this.x-a.x,this.y-a.y,this.z-a.z);
    }

    this.dot=function(a){
        return a.x*this.x+a.y*this.y+a.z*this.z;
    }
    
    this.cross=function(b){
        return new Vector(this.y*b.z-this.z*b.y , this.z*b.x-this.x*b.z, this.x*b.y - this.y*b.x);
    }
    
    this.twoDNormal=function(){
        return this.cross(new Vector(0,0,1));
    }
    
    this.multiply=function(s){
        return new Vector(this.x*s,this.y*s,this.z*s);
    }
    
    this.setX=function(x){
        //this.x=x;
        return new Vector(x,this.y,this.z);
    }
    
    this.setY=function(y){
        //this.y=y;
        return new Vector(this.x,y,this.z);
    }
    
    this.setZ=function(z){
        //this.z=z;
        return new Vector(this.x,this.y,z);
    }
    
    //return a vector which is normal to vector a, and in a random direction.
    //    this.randomNormal=function(){
    //        Random r = new Random();
    //        
    //        return randomNormal(r);
    //    }
    
    //    //TODO test this
    //    public Vector rotate(Vector torque){
    //        return rotate(torque.getUnit(),torque.getMagnitude());
    //    }
    
     
    /**
    * http://en.wikipedia.org/wiki/Rotation_matrix#Rotation_matrix_from_axis_and_angle
    * @return 
    */
   this.crossProductMatrix=function(){
       var newM = new Array(3);
       
       for(var i=0;i<3;i++){
           newM[i] = new Array(3);
           for(var j=0;j<3;j++){
               newM[i][j]=0;
           }
       }
       
       newM[0][1]=-this.z;
       newM[0][2]=this.y;
       
       newM[1][0]=this.z;
       newM[1][2]=-this.x;
       
       newM[2][0]=-this.y;
       newM[2][1]=this.x;
       
        var M = new Matrix(3,3);
        M.setA(newM);
        
        return M;
   }
    
    this.tensorProduct=function(){
        var newM = new Array(3);

        for(var i=0;i<3;i++){
            newM[i] = new Array(3);
            for(var j=0;j<3;j++){
                newM[i][j]=this.get(i)*this.get(j);
            }
        }


        var M = new Matrix(3,3);
        M.setA(newM);
        
        return M;
    }
     
    this.getRotationMatrix=function(axis, angle){
        var u=axis.getUnit();
        
        var R = Matrix.identity(3).multiplyByDouble(Math.cos(angle));
        
        R = R.addMatrix(u.crossProductMatrix().multiplyByDouble(Math.sin(angle)));
        
        R = R.addMatrix(u.tensorProduct().multiplyByDouble(1-Math.cos(angle)));
        
        return R;
    }
    
    //rotate by angle around axis
    this.rotateByAxis=function(axis, angle){
        var R = this.getRotationMatrix(axis,angle);
        return this.rotateByMatrix(R);
    }
    
    //rotate using a rotation matrix
    this.rotateByMatrix=function(R){
         var v = new Matrix(3,1);
        v.set(0, 0, x);
        v.set(1, 0, y);
        v.set(2, 0, z);
        
        //answer
        var ans = R.multiplyByMatrix(v);
        
        return new Vector(ans.get(0, 0),ans.get(1, 0),ans.get(2, 0));
    }
    //    
    //    public Vector randomNormal(Random r){// throws Exception{
    //        double Nx,Ny,Nz;
    //        
    //        do{
    //            Nx=Ny=Nz=0;
    //            //nextDouble is 0-1 inclusive 0, exclusive 1.  so to get answers strictly > 0, we're doing 1-ans
    //            //scrap that, forgot about -ve numbers needed
    //            switch(r.nextInt(3)){
    //            //switch(0){
    //                case 0:
    //                    Nx=1 - r.nextDouble()*2;
    //                    break;
    //                case 1:
    //                    Ny=1-r.nextDouble()*2;
    //                    break;
    //                case 2:
    //                    Nz=1-r.nextDouble()*2;
    //                    break;
    //            }
    //        }while(!validNormalSelection(Nx,Ny,Nz));
    //        
    //        //now either x,y or z is non zero
    //        
    //        if(Nx!=0){
    //            //x is now known
    //            if(z!=0){
    //                Ny = 1 - r.nextDouble()*2;
    //                Nz = -(x*Nx + y*Ny)/z;
    //            }else if(y!=0){
    //                Nz = 1 - r.nextDouble()*2;
    //                Ny = -(x*Nx + z*Nz)/y;
    //            }else{
    //                //throw new Exception("help");
    //                //panic
    //            }
    //            
    //            //Ny = (-2*x*Nx*y + Math.sqrt(x*x*Nx*Nx*y*y + (z*z+y*y)*(1-Nx*Nx)*z*z )  ) / (x*x + y*y);
    //            
    //            //Nz = (-2*x*Nx*z + Math.sqrt(x*x*Nx*Nx*z*z + (y*y+z*z)*(1-Nx*Nx)*y*y )  ) / (x*x + z*z);
    //        }else if(Ny !=0){
    //            //y is now known
    //            if(z!=0){
    //                Nx = 1 - r.nextDouble()*2;
    //                Nz = -(x*Nx + y*Ny)/z;
    //            }else if(x!=0){
    //                Nz = 1 - r.nextDouble()*2;
    //                Nx = -(y*Ny + z*Nz)/x;
    //            }else{
    //                //throw new Exception("help");
    //                //panic
    //            }
    //        }else if(Nz !=0){
    //            //y is now known
    //            if(y!=0){
    //                Nz = 1 - r.nextDouble()*2;
    //                Ny = -(x*Nx + z*Nz)/y;
    //            }else if(x!=0){
    //                Nz = 1 - r.nextDouble()*2;
    //                Nx = -(y*Ny + z*Nz)/x;
    //            }else{
    //                //throw new Exception("help");
    //                //panic
    //            }
    //        }else{
    //            //panic further
    //        }
    //        
    //        Vector n = new Vector(Nx,Ny,Nz);
    //        
    //        return n.getUnit();
    //    }
    
    this.predictableNormal=function(){
        if(!(this.x==1 && this.y==0 && this.z==0)){
            var n = new Vector(1,0,0);
            return this.cross(n).getUnit();
        }else{
            var n = new Vector(0,1,0);
            return this.cross(n).getUnit();
        }
    }
    
    //    private boolean validNormalSelection(double Nx, double Ny, double Nz){
    //        if(Nx!=0 && y==0 && z==0){
    //            //cannot create a true normal in this direction
    //            return false;
    //        }
    //        
    //        if(x==0 && Ny!=0 && z==0){
    //            //cannot create a true normal in this direction
    //            return false;
    //        }
    //        
    //        if(x==0 && y==0 && Nz!=0){
    //            //cannot create a true normal in this direction
    //            return false;
    //        }
    //        
    //        return true;
    //    }
    
    this.copy=function(){
        return new Vector(this.x,this.y,this.z);
    }
    
    this.toString=function(){
        
        return "("+Math.round(this.x*100.0)/100.0+","+Math.round(this.y*100.0)/100.0+","+Math.round(this.z*100.0)/100.0+")";
    }
    
    this.serialize=function(){
        return {
            'x': this.x,
            'y': this.y,
            'z': this.z
        };
    }
}

Vector.unSerialize=function(v){
    return new Vector(v.x,v.y,v.z);
}

//order them so the furthest away from awayFrom is 0
Vector.order=function(awayFrom){
    return function(a,b){
        var A = a.subtract(awayFrom).getMagnitudeSqrd();
        var B = b.subtract(awayFrom).getMagnitudeSqrd();
        
        return ((A > B) ? -1 : (A < B) ? +1 : 0);
    }
}