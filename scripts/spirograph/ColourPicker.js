/* 
 * Copyright Luke Wallin 2012
 * 
 * Been done before, probably much better, but I'm without Internet atm and fancy giving it a go
 */


var ColourPicker=function(parent,callback,defaultColour){
    var self=this;
    //the div with the thing to click on
    this.div=document.createElement("div");
    parent.appendChild(this.div);
    
    
    this.div.style.display="inline";//-block
    this.div.style.border="solid #999 1px";
    this.div.innerHTML="Click to choose";
    
    this.div.style.color=defaultColour.inverse().toHex();
    
    this.width=500;
    this.height=200;
    
//    this.canvas.width = window.innerWidth;
//    this.canvas.height = window.innerHeight;
    
    this.popup=document.createElement("div");
    this.popup.style.display="none";
    this.popup.style.position="absolute";
    var left = Math.round((window.innerWidth - this.width)/2);
    
    //this.popup.style.marginLeft=left+"px";
    
    //this.popup.setAttribute("style.left", left+"px");
    this.popup.style.left=left+"px";//innerWidth
    //this.popup.style.left=500+"px";
    //window.
    var top = Math.round((window.innerHeight - this.height)/2)
    
    this.popup.style.top=top+"px";
    this.popup.style.width=this.width;
    this.popup.style.height=this.height;
    this.popup.style.zIndex=10;
    document.body.appendChild(this.popup);
    
    if(this.width==500 && this.height==200){
        //use stored image
        this.img = document.createElement("img");
        this.img.src="ColourPicker.png";
        this.popup.appendChild(this.img);
    }else{
        //generate afresh on canvas
        this.canvas=document.createElement("canvas");
        this.canvas.width=this.width;
        this.canvas.height=this.height;
        this.popup.appendChild(this.canvas);

        this.ctx = this.canvas.getContext("2d");

        for(var x=0;x<this.width;x++){
            for(var y=0;y<this.height;y++){

                var c=Colour.hsvToRgb(x/this.width,1,(this.height-y)/this.height);

                this.ctx.fillStyle=c.toRGB();
                this.ctx.fillRect(x,y,1,1);
            }
        }
    }
    //callback function for when a colour is selected
    this.callback=callback;
    if(typeof(defaultColour)=="undefined"){
        defaultColour=new Colour(255,0,0);
    }
    this.colour=defaultColour;
    
    this.div.onclick=function(){
        self.popup.style.display="block";
    }
    
    this.setColour=function(colour){
        self.colour=colour;
        self.div.style.backgroundColor=self.colour.toHex();
        self.div.style.color=self.colour.inverse().toHex();
        self.callback(self.colour);
    }
    
    this.getColour=function(){
        return self.colour;
    }
    
//    this.popup.onclick=function(){
//        var x = event.clientX + document.body.scrollLeft +
//        document.documentElement.scrollLeft - canvas.offsetLeft,
//        event.clientY + document.body.scrollTop +
//        document.documentElement.scrollTop - canvas.offsetTop
//    }
    
    this.clicked=function(x,y){
        self.popup.style.display="none";
        self.setColour(Colour.hsvToRgb(x/self.width,1,(self.height-y)/self.height));
        
    }
    
    this.popup.addEventListener("click", function(event) {
        self.clicked(event.clientX + document.body.scrollLeft +
                   document.documentElement.scrollLeft - self.popup.offsetLeft,
                   event.clientY + document.body.scrollTop +
                   document.documentElement.scrollTop -self.popup.offsetTop);
    }, false);
    
    //var div = document.createElement("div");
    //div.style.b
    this.div.style.backgroundColor=this.colour.toHex();
}