/* 
 * Copyright Luke Wallin 2012
 */


var Cube = function(pos,dir,size,angle,colour){
    
    this.triangles = new Array(12);
    
    // ------------ constuctor ------------
    
    //the 6 faces
    this.colours = new Array(6);
    
    //this.colour=colour;
    if($.isArray(colour)){
        this.colours=colour;
    }else{
        for(var i=0;i<6;i++){
            this.colours[i]=colour;
        }
    }
        
    
    //length of a side
    this.size=size;
    //vector for direction top face faces
    this.dir=dir;
    //vector for centre
    this.pos=pos;
    //how much to rotate aroudn the dir
    this.angle=angle;
    
    this.vertices = new Array(8);
    
    this.xDir = this.dir.predictableNormal();
    this.yDir = this.xDir.cross(this.dir).getUnit();
    
    
    var i=0;
    for(var x=-1;x<2;x+=2){
        for (var y=-1;y<2;y+=2){
            for(var z=-1;z<2;z+=2){
                this.vertices[i] = this.pos.addMultiple(this.xDir.multiply(this.size/2), x).addMultiple(this.yDir.multiply(this.size/2), y).addMultiple(this.dir.multiply(this.size/2), z);
                i++;
                //console.log("x:"+x+" y:"+y+" z:"+z);
            }
        }
    }
    
    
    /*
     *  x:0 y:0 z:0
        x:0 y:0 z:1
        x:0 y:1 z:0
        x:0 y:1 z:1
        x:1 y:0 z:0
        x:1 y:0 z:1
        x:1 y:1 z:0
        x:1 y:1 z:1
     */
    
    // ------------ methods ------------
    
    
    
    this.makeTriangles=function(){
        this.triangles = new Array();
        
        //base
        this.triangles.push(new Triangle(this.vertices[0],this.vertices[2],this.vertices[6],this.colours[0]));
        this.triangles.push(new Triangle(this.vertices[0],this.vertices[4],this.vertices[6],this.colours[0]));
        
        //top
        this.triangles.push(new Triangle(this.vertices[1],this.vertices[3],this.vertices[7],this.colours[5]));
        this.triangles.push(new Triangle(this.vertices[1],this.vertices[5],this.vertices[7],this.colours[5]));
        
        //sides
        
//        for(var i=0;i<4;i++){
//            var top=i;
//            var top2=(i+2)%8;
//            var bottom = (i+1)%8;
//            var bottom2 = (i+3)%8
//            this.triangles.push(new Triangle(this.vertices[top],this.vertices[top2],this.vertices[bottom]))
//        }

        //side 1:
        this.triangles.push(new Triangle(this.vertices[0],this.vertices[4],this.vertices[1],this.colours[1]));
        this.triangles.push(new Triangle(this.vertices[4],this.vertices[1],this.vertices[5],this.colours[1]));
        
        //side 2:
        this.triangles.push(new Triangle(this.vertices[4],this.vertices[6],this.vertices[5],this.colours[2]));
        this.triangles.push(new Triangle(this.vertices[5],this.vertices[7],this.vertices[6],this.colours[2]));
        
        //side 3:
        this.triangles.push(new Triangle(this.vertices[6],this.vertices[2],this.vertices[7],this.colours[3]));
        this.triangles.push(new Triangle(this.vertices[7],this.vertices[3],this.vertices[2],this.colours[3]));
        
        //side 4:
        this.triangles.push(new Triangle(this.vertices[2],this.vertices[0],this.vertices[3],this.colours[4]));
        this.triangles.push(new Triangle(this.vertices[3],this.vertices[1],this.vertices[0],this.colours[4]));
        
        //make sure normal points right way
        for(var i=0;i<this.triangles.length;i++){
            this.triangles[i].thisIsInside(this.pos);
        }
    }
    
    this.makeTriangles();
    
    this.getTriangles=function(){
        //order them so that they start with the one furthest from the camera
        return this.triangles;//.sort(Triangle.order(cameraPos));
    }
    
    this.getCentre=function(){
        return this.pos;
    }
    
    this.rotate=function(axis,angle){
        this.pos=this.pos.rotateByAxis(axis, angle);
        
        for(var i=0;i<this.triangles.length;i++){
            this.triangles[i].rotate(axis, angle);
        }
    }
}