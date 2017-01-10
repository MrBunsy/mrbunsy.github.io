/* 
 * Copyright Luke Wallin 2012
 * 
 */
//class
var Fractal = function(canvas){
    // ------------ properties ------------
    this.canvasTag = canvas;
    this.canvas=false;
    this.maxIterations = 100;
    
    // ------------ constuctor ------------
    
    this.width= parseInt(this.canvasTag.width);
    this.height = parseInt(this.canvasTag.height);
    this.origin = new Vector(this.width*0.75,this.height/2);
    this.zoom = 2/this.width;
    this.x=0;
    
    this.black = new Colour(0,0,0);
    
    this.redo = createArray(this.width,this.height);
    
    for(var x=0;x<this.width;x++){
            for(var y=0;y<this.height;y++){
                this.redo[x][y]=true;
            }
    }
    
    if (this.canvasTag.getContext) 
    {
        //make the canvas!
        this.canvas = this.canvasTag.getContext('2d');
        
        //this.canvas.fillRect(0,0,this.width,this.height);
    }
    
    // ------------ methods ------------
    
    this.iterationToColour=function(i){

        var c = Colour.hsvToRgb((i%50)/50, 0.5, 1);
        return c;
//        
//        //works:
//        i %= 255
//        return new Colour(255-i,i,i*10);
    }
    
    this.render=function(detail){
        var x=this.x;
       // for(var x=0;x<this.width;x++){
            for(var y=0;y<this.height;y++){
                
//                if(!Colour.getColourFromCanvas(x, y, this.canvas).equals(this.black)){
//                    
//                    continue;
//                }

//                if(!this.redo[x][y]){
//                    //don't re-draw non black pixels
//                    continue;
//                }
                
                var colour;
                
                var p = new Vector(x,y);
                
                p=p.subtract(this.origin);
                p=p.multiply(this.zoom);
                
                //imaginary number from our coordinates
                var c = new Complex(p.x,p.y);
                //starting value of z
                var z = new Complex(0,0);
                
                var i = 0;
                
                while(z.magnitudeSqrd() < 4 && i<detail){
                    z = z.square().add(c);//.square()
                    i++;
                }
                
                var redo=true;
                
                if(i==detail){
                    //black for not maxed out yet
                    colour=new Colour(0,0,0);
                    redo=true;
                }else{
                    colour = this.iterationToColour(i);
                    redo=false;
                }
                
                //does this one need re-considering?
                this.redo[x][y]=redo;
                
                this.canvas.fillStyle=colour.toRGB();
                this.canvas.fillRect(x, y, 1, 1)
            }
            
            if(this.x<this.width-1){
                this.x++;
                var tempThis=this;
                setTimeout(function(){tempThis.render.call(tempThis,detail)}, 0);
            }else{
                //at the end, look at increasing the detail
                if(detail<this.maxIterations){
                    detail*=5;
                    this.x=0;
                    var tempThis=this;
                    setTimeout(function(){tempThis.render.call(tempThis,detail)}, 0);
                }
            }
        //}
    }
}

var fractal;

function main(){
    fractal = new Fractal(document.getElementById("fractalCanvas"));
    fractal.render(10);
}

$(document).ready(main);