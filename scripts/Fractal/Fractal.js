/* 
 * Copyright Luke Wallin 2012
 * 
 * idea - don't know if it would speed it up much, but instead of working out hte complex position for each pixel
 * give the worker the bounds in complex form and get it to loop through those?
 * 
 * idea - option for click to start, can use canvas text for little message!
 * or maybe load png for first image then roll with real thing after the first click?
 * 
 * idea for menu if I can be bothered - on focus (mouse overt he thing) a menu bar at the top appears
 * 
 */
//class
var Fractal = function(canvas,fullscreen,location){
    // ------------ properties ------------
    var self=this;
    this.canvas = canvas;
    this.ctx=null;
    this.maxIterations = 75;
    this.colData=null;
    this.blockWidth=20;
    this.workers=new Array(4);
    //this.busyWorkers=[];
    this.complexPos=[];
    this.dxComplex=1;
    this.dyComplex=1;
    this.fullscreen=fullscreen;
    //functions 
    //0 = mandelbrot
    //1 = burning ship
    this.fz=0;
    //flip the y axis upside down?
    this.inverted=false;
    this.location = typeof(location)=="undefined" ? "" : location;
    //position mouse was pressed
    this.mouseDown=null;
    this.mouseMovingThread=null;
    
    // ------------ constuctor ------------
    
    if(fullscreen){
        this.canvas.width=window.innerWidth;
        this.canvas.height=window.innerHeight;
    }
    
    this.width= parseInt(this.canvas.width);
    this.height = parseInt(this.canvas.height);

    //this.origin = new Vector(this.width*0.75,this.height/2);
    this.centre=new Vector(-0.5, 0);
    //complex width of x axis
    this.zoom = 2.5;
    //figure actually used for donig useful stuff
    //bit of a mess,but trying to keep this similar to JavaFractal
    this.adjustedZoom = this.zoom / Math.min(this.width,this.height);
    this.x=0;
    
    this.black = new Colour(0,0,0);
    
    this.redo = createArray(this.width,this.height);
    
    for(var x=0;x<this.width;x++){
            for(var y=0;y<this.height;y++){
                this.redo[x][y]=true;
            }
    }
    
    if (this.canvas.getContext) 
    {
        //make the ctx!
        this.ctx = this.canvas.getContext('2d');
        this.colData = this.ctx.createImageData(this.blockWidth,this.height);
        
        this.ctx.save();
        //this.ctx.fillRect(0,0,this.width,this.height);
    }else{
        throw "Help, no canvas!";
    }
    
    this.ctx.fillStyle="rgb(64,64,64)";
    
    this.bufferCanvas=document.createElement("canvas");
    this.bufferCanvas.width=this.width;
    this.bufferCanvas.height=this.height;
    this.bufferCtx = this.bufferCanvas.getContext("2d");
    
    // ------------ methods ------------
    
    this.setFunction=function(fz){
        
        this.inverted=false;
        switch(fz){
            case "mandelbrot":
                this.fz=0;
                break;
            case "burningship":
                this.inverted=true;
                this.fz=1;
                break;
            default:
                throw "not recognised";
                break;
        }
    }
    
    this.iterationToColour=function(i){
        if(i==this.maxIterations){
            return new Colour(0,0,0);
        }
        var c = Colour.hsvToRgb((Math.max(i,0)%50)/50, 0.5, 1);
        return c;
    }
    
    this.startThread=function(id){
        //data required:
        //
        //width in pixels
        //height in pixels
        //top left complex coord
        //width in complex
        //height in complex
        //detail
        //
        //x1 is useful for then drawing the image later
        //
        
        var data = new Object();
        data.x1=this.x;
        
        data.width=this.blockWidth;
        data.height=this.height;

        var complexPos = this.pixelToComplex(this.x, 0, this.adjustedZoom, this.centre, this.width, this.height);
        
        data.c=[complexPos.x,complexPos.y];
        data.zoom=this.adjustedZoom;
        data.detail=this.maxIterations;
        data.id=id;
        data.fz=this.fz;
        
        this.workers[id].postMessage(data);
        
        this.x+=this.blockWidth;
    }
    
    this.cancelRender=function(){
        this.x=this.width;
    }
    
    this.render=function(){
        this.x=0;
        
        //calculate the complex position of the top left of each slither
//        this.complexPos=[];
//        for(var x=0;x<this.width;x+=this.blockWidth){
//            this.complexPos.push(this.pixelToComplex(x, 0, this.adjustedZoom, this.centre, this.width, this.height));
//        }
        
//        this.dxComplex=this.blockWidth*this.adjustedZoom;
//        this.dyComplex = this.height*this.adjustedZoom;
        
        for(var i=0;i<this.workers.length;i++){
            this.startThread(i);
        }
    }
    
    this.threadFinished=function(data){
       if(data.x1>this.x){
           //don't use this - its past the point were interested in
           return;
       }
       var pixels = data.pixels;
       //if we're flipping the y-axis, do this to the image too
       if(this.inverted){
           pixels = [];
           for(var y=this.height-1;y>=0;y--){
               for(var x=0;x<this.blockWidth;x++){
                   pixels.push(data.pixels[y*this.blockWidth+x]);
               }
           }
       }
       
        for(var i=0,j=0;i<pixels.length;i++,j+=4){
            var colour=this.iterationToColour(pixels[i]);
            this.colData.data[j]=colour.r;
            this.colData.data[j+1]=colour.g;
            this.colData.data[j+2]=colour.b;
            this.colData.data[j+3]=255;
        }
        
        this.ctx.putImageData(this.colData, data.x1,0);
        
        if(this.x<this.width){
            //do more if there's still some left to do
            this.startThread(data.id);
        }
    }
    

    //create workers
    for(var i=0;i<this.workers.length;i++){
        this.workers[i]=new Worker(this.location+"worker.js");
        
        this.workers[i].onmessage=function(e){
            //alert(e.data);
            self.threadFinished(e.data);
        }
    }
    //TODO use this only here, and give the worker only the bounds of the area to be drawn
    this.pixelToComplex=function(x, y,  _adjustedZoom, centre,width,height){
        var diff = new Vector((x - width/2),(height/2-y));

        diff = diff.multiply(_adjustedZoom);

        var cv = centre.add(diff);

        return new Complex(cv.x, cv.y);
    }
    
    this.complexToPixel=function(c,adjustedZoom, centre){
        var intermediate = c.subtract(centre);
        intermediate = intermediate.multiplyScalar(1/adjustedZoom);
        
        return new Vector(this.width*0.5 + intermediate.x,this.height*0.5 - intermediate.y);
    }
    
    this.updateZoom=function(scroll) {
        if (scroll < 0) {
            this.zoom *= 1.5;
        } else {
            this.zoom /= 1.5;
        }
        
        this.adjustedZoom = this.zoom / Math.min(this.width,this.height);
        //estimate new detail level
        this.maxIterations = Math.round(100/Math.pow(this.zoom,0.35));
    }
    
    //scroll: int, how much mouse wheel was scrolled
    //m: vector for mouse pos at moment
    this.zoomAt=function(scroll, m) {
        //Point m = window.getMousePosition(true);

        //mouse position on the complex plain
        var mouseComplex = this.pixelToComplex(m.x, m.y, this.adjustedZoom, this.centre, this.width, this.height)           
        var oldZoom = this.zoom;
        var oldAdjustedZoom = this.adjustedZoom;
        var oldCentre = new Complex(this.centre.x,this.centre.y);
        
        this.updateZoom(scroll);

        
        this.centre = mouseComplex.add(new Vector(-(m.x - this.width/2),-(this.height/2-m.y)).multiply(this.adjustedZoom));
        //TODO - port over the scale image stuff from Java
        
        
        var ratio = this.zoom/oldZoom;
        
        
        if(ratio<1){
                //zooming in - easy, since only taking a chunk of the image
                
                
                var sampleWidth = Math.round(this.width*ratio);
                var sampleHeight =  Math.round(this.height*ratio);
                
                //need - NEW centre on OLD image
                var newCentrePixels = this.complexToPixel(this.centre,oldAdjustedZoom,oldCentre);
                
                var x = Math.round(newCentrePixels.x-sampleWidth/2);
                var y = Math.round(newCentrePixels.y-sampleHeight/2);
                
                //getting pixels from current canvas, dumping them onto an in-memory canvas
//                var zoomImageData = this.ctx.getImageData(x,y , sampleWidth, sampleHeight);
//                var zoomImageCanvas = document.createElement("canvas");
//                var zoomImage = zoomImageCanvas.getContext("2d");
//                zoomImage.putImageData(zoomImageData,0,0);
//                
//                //drawing them on main canvas enlarged
//                this.ctx.drawImage(zoomImage, 0, 0,this.width,this.height);
                this.ctx.drawImage(this.canvas, x, y, sampleWidth, sampleHeight, 0, 0, this.width, this.height);
                
                
            }else{
                //zooming out
                
                //what to shrink the old image to
                var newHeight = this.height/ratio;
                var newWidth = this.width/ratio;
                
                //where to put this
                
                //need the OLD centre on the NEW image
                var oldCentrePixels = this.complexToPixel(oldCentre, this.adjustedZoom, this.centre);
                
                //var zoomImage = Image.getScaledInstance(bufferImage, (int)Math.round(newWidth), (int)Math.round(newHeight), RenderingHints.VALUE_INTERPOLATION_BILINEAR, false);
                
//                Graphics g = bufferImage.getGraphics();
                
                var bufferImageCanvas = document.createElement("canvas");
                bufferImageCanvas.width=newWidth;
                bufferImageCanvas.height=newHeight;
                var bufferImage = bufferImageCanvas.getContext("2d");
                bufferImage.drawImage(this.canvas,0,0,newWidth,newHeight);
                
                //fill in image with grey
                this.ctx.fillRect(0,0,this.width,this.height);
                //works - but can't have bg greyed first.
                //this.ctx.drawImage(this.canvas, Math.round(oldCentrePixels.x-newWidth/2), Math.round(oldCentrePixels.y-newHeight/2), Math.round(newWidth), Math.round(newHeight));
                this.ctx.drawImage(bufferImageCanvas,Math.round(oldCentrePixels.x-newWidth/2), Math.round(oldCentrePixels.y-newHeight/2));
            }
        
        this.render();
    }
    
    this.drag=function(down, up) {
        if (down !== null) {
            
            var downC = this.pixelToComplex(down.x, down.y, this.adjustedZoom, this.centre, this.width, this.height);
            var upC = this.pixelToComplex(up.x, up.y, this.adjustedZoom, this.centre, this.width, this.height);
            
            //Vector difference = new Vector(up.x - down.x, up.y - down.y);
            var difference = upC.subtract(downC);
            //mixing Complex and Vector a bit here... sets z to Nan which might come back to bite.
            this.centre = this.centre.subtract(difference);

            this.render();
        }
    }
    
    this.getMousePos=function(e){
        var x,y;
                
        if(e.pageX || e.pageY){
            x=e.pageX;
            y=e.pageY;
        }else {
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }
        
        var canvasPos = $("#"+self.canvas.id).offset();
        
//        x-=self.canvas.offsetLeft;
//        y-=self.canvas.offsetTop;
        x-=canvasPos.left;
        y-=canvasPos.top;
        
        //if we're  using an inverted y axis, readjust mouse click pos
        if(self.inverted){
            y+=(self.height/2-y)*2
        }
        
        return new Vector(x,y);
    }
    
    this.mouseClicked=function(e){
        //var clicked = new Vector(e.clientX - self.canvas.offsetLeft,e.clientY - self.canvas.offsetTop);
        //var clicked = new Vector(e.pageX - self.canvas.offsetLeft,e.pageY - self.canvas.offsetTop);
//        var clicked;
//        //http://answers.oreilly.com/topic/1929-how-to-use-the-canvas-and-draw-elements-in-html5/
//        if (e.pageX || e.pageY) {
//            clicked = new Vector(e.pageX,e.pageY);
//        }
//        else {
//            clicked = new Vector(e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
//                e.clientY + document.body.scrollTop + document.documentElement.scrollTop);
//        }
//        
//        clicked=clicked.subtract(new Vector(self.canvas.offsetLeft,self.canvas.offsetTop));
//        alert(clicked+"");
        
        var mouse=self.getMousePos(e);
        
        //alert(x+","+y);
        
        self.centre=self.pixelToComplex(mouse.x, mouse.y, self.adjustedZoom, self.centre, self.width, self.height);
        
        self.zoom*=0.25;
        self.adjustedZoom = self.zoom / Math.min(self.width,self.height);
        
        self.maxIterations = Math.round(100/Math.pow(self.zoom,0.35));
        
        self.render();
    }
    
//    this.doubleClicked=function(e){
//        self.zoom/=0.25;
//        
//        self.adjustedZoom = self.zoom / Math.min(self.width,self.height);
//        
//        self.maxIterations = Math.round(100/Math.pow(self.zoom,0.35));
//        
//        self.render();
//    }

    this.scrolled=function(e){
        self.zoomAt(e.detail? -e.detail : e.wheelDelta, self.getMousePos(e));
        e.preventDefault(e);
        
    }
    
    this.mousePressed=function(e){
        self.cancelRender();
        self.mouseDown=self.getMousePos(e);
        self.bufferCtx.drawImage(self.canvas,0,0);
        self.canvas.addEventListener("mousemove", self.mouseMoving, false);
    }
    
    this.mouseUp=function(e){
        
        self.drag(self.mouseDown,self.getMousePos(e));
        self.canvas.removeEventListener("mousemove", self.mouseMoving, false);
    }
    
    this.mouseMoving=function(e){
        var m = self.getMousePos(e);
        var dx=m.x-self.mouseDown.x;
        var dy=m.y-self.mouseDown.y;
        self.ctx.fillRect(0,0,self.width,self.height);
        self.ctx.drawImage(self.bufferCanvas,dx,dy);
    }
    
    //this.canvas.addEventListener("click", this.mouseClicked, false);
    this.canvas.addEventListener("mousedown", this.mousePressed,false);
    this.canvas.addEventListener("mouseup", this.mouseUp,false);
    //this.canvas.addEventListener("dblclick", this.doubleClicked, false);
    
    this.canvas.addEventListener("DOMMouseScroll", this.scrolled, false);
    
    this.canvas.onmousewheel=this.scrolled;
    
    this.resized=function(e){
        self.canvas.width=window.innerWidth;
        self.canvas.height=window.innerHeight;
        
        self.width = self.canvas.width;
        self.height = self.canvas.height;
        
        self.adjustedZoom = self.zoom / Math.min(self.width,self.height);
        
        self.colData = self.ctx.createImageData(self.blockWidth,self.height);
        
        self.render();
    }
    if(this.fullscreen){
        window.addEventListener("resize", this.resized, false);
    }
}

