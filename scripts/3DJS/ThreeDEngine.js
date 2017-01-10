/* 
 * Copyright Luke Wallin 2012
 * 
 * idea: to demo moving lights, have the mouse move an extra light source?
 * 
 */
//class
var ThreeDEngine = function(canvasId){
    // ------------ properties ------------
    this.canvasTag = document.getElementById(canvasId);
    this.jquery = $("#"+canvasId);
    this.canvas=false;
    this.period;
    //for storing the reference to the interval
    this.thread;
    //array of objects in the world
    this.world=[];
    this.camera;
    this.lights=[];
    this.ambient = 0.2;
    
    this.movingLight=new Light(new Vector(000,500,500),200000);
//    this.oldAngleAroundZ=0;
//    this.oldAngleAroundX=0;
//    this.oldAnglesExist=false;
    
    // ------------ constuctor ------------
    
    this.lights.push(this.movingLight);
    
    this.width= parseInt(this.canvasTag.width);
    this.height = parseInt(this.canvasTag.height);
    
    if (this.canvasTag.getContext) 
    {
        //make the canvas!
        this.canvas = this.canvasTag.getContext('2d');
        this.canvas.lineJoin="round";
        this.canvas.lineWidth=1.2;
    }
    
    // ------------ methods ------------
    
    this.run = function(){
        
//        for(var i=0;i<3;i++){
//            this.world[0].vertices[i]=this.world[0].vertices[i].rotateByAxis((new Vector(0.1,0.1,0.5)).getUnit(), 0.01)
//        }

        var newCamLoc = this.camera.pos.rotateByAxis(new Vector(0,0,1), 0.02);
        this.camera.setPosAndDir(newCamLoc, newCamLoc.multiply(-1).getUnit());
        this.camera.setupRez(this.width, this.height);
        
        this.movingLight.pos=this.movingLight.pos.rotateByAxis(new Vector(0,0,1), 0.02);
        
        //this.lights[0].pos=this.lights[0].pos.rotateByAxis(new Vector(0,0,1), 0.08);
        
//        for(var i=0;i<this.world.length;i++){
//            this.world[i].rotate(new Vector(0,0,1), 0.02);
//        }
        
        this.draw();
    }
    
    this.start = function(fps){
        this.period = 1000/fps;
        //hack so that 'this' in run will reference this object
        var tempThis=this;
        this.interval = setInterval(function(){tempThis.run.call(tempThis)}, this.period);
    }
    
    //update the canvas
    this.draw = function(){
        
        
        this.world.sort(Shape.order(this.camera.pos));
        
        
        
        this.canvas.clearRect(0, 0, this.width, this.height);
        
        for(var i=0;i<this.world.length;i++){
            
            var test = this.world[i].getCentre();
            
            var triangles = this.world[i].getTriangles();
            for(var j=0;j<triangles.length;j++){
                
                var n = triangles[j].n;
                
                if(n.dot(this.camera.pos.subtract(triangles[j].centre)) < 0){
                    continue;
                    //triangle is facing away from us
                }
                
                var a=this.camera.threeDTo2D(triangles[j].vertices[0]);
                var b=this.camera.threeDTo2D(triangles[j].vertices[1]);
                var c=this.camera.threeDTo2D(triangles[j].vertices[2]);
                
                
                
                
                
                var colour = triangles[j].colour.dim(this.ambient);
                
                for(var l=0;l<this.lights.length;l++){
                    var lightAngle = this.lights[l].pos.subtract(triangles[j].centre);
                    var dist2 = lightAngle.getMagnitudeSqrd();
                    
                    lightAngle=lightAngle.getUnit();
                    
                    var lightHere = this.lights[l].lightAtDistanceSqrd(dist2);
                    
                    lightHere *=  lightAngle.dot(triangles[j].n);
                    
                    colour = colour.add(triangles[j].colour.dim(lightHere));
                }
                
                this.canvas.fillStyle=colour.toRGB();
                this.canvas.strokeStyle=colour.toRGB();
                
                this.canvas.beginPath();
                this.canvas.moveTo(a.x,a.y);
                this.canvas.lineTo(b.x,b.y);
                this.canvas.lineTo(c.x,c.y);
                this.canvas.lineTo(a.x,a.y);
                this.canvas.closePath();
                this.canvas.fill();
                //stroking the lines too seems to clear up some of the gaps
                this.canvas.stroke();
                
            }
        }
    }
    
    
    
    this.setCamera = function(camera){
        this.camera=camera;
        this.camera.setupRez(this.width, this.height);
    }
    
    this.mouseMove=function(event){
        var mouse = new Vector(event.pageX,event.pageY);
        
        var parentOffset = this.jquery.offset();
        
        var angleAroundZ=(mouse.x-parentOffset.left)*Math.PI/this.width - Math.PI/2;
        var angleAroundX=(mouse.y-parentOffset.top)*Math.PI/this.height - Math.PI/4;
        
        var cameraDir = this.camera.pos.getUnit();
        
        //var angle = new Vector(1, 1, 2).getUnit();
        var angle = cameraDir;//.add(new Vector(0, 0, 1).getUnit());
        
        var horizontalAxis = new Vector(0,0,1).cross(cameraDir);
        
        angle=angle.rotateByAxis(new Vector(0,0,1), angleAroundZ);
        angle=angle.rotateByAxis(horizontalAxis, angleAroundX);
        
        this.movingLight.pos = angle.multiply(500);
        
//        if(!this.oldAnglesExist){
//            //need to know how far the mouse has moved
//            this.oldAnglesExist=true;
//            this.oldAngleAroundX=angleAroundX;
//            this.oldAngleAroundZ=angleAroundZ;
//        }else{
//            this.movingLight.pos
//        }
    }
}

var threeD;

function main(){
    threeD = new ThreeDEngine("threeDEngineCanvas");
    //threeD = new ThreeDEngine($("#threeDEngineCanvas"));
    
    threeD.setCamera(new Camera(new Vector(0,400,300),new Vector(0,-1,-0.8),8,16));

    //threeD.world.push(new Triangle(new Vector(100,0,0),new Vector(-100,0,0),new Vector(0,0,100)));
    
    threeD.world.push(new Cube(new Vector(200,0,100), new Vector(0,0,1), 50, 0,[new Colour(255,0,0),new Colour(255,128,0),new Colour(255,255,0),new Colour(0,255,0),new Colour(0,0,255),new Colour(0,255,255)]));
    threeD.world.push(new Sphere(new Vector(0,0,100),100,10,10,new Colour(0,255,0)));
    
    threeD.lights.push(new Light(new Vector(500,500,500),200000));
    
    //threeD.movingLight=new Light(new Vector(000,500,500),300000);
    
    //threeD.lights.push(threeD.movingLight);
    
    //threeD.draw();
    
    threeD.start(30);
    
    
    $("#threeDEngineCanvas").mousemove(function(event){threeD.mouseMove.call(threeD,event)});
}

$(document).ready(main);