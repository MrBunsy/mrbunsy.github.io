/* 
 * Copyright Luke Wallin 2012
 * 
 * system for a menu on the canvas
 * menus can have buttons and text
 * 
 * 
 * TODO - how about slightly rounded corners?
 * 
 * TODO - how about a link element?
 * 
 */

var CanvasGUI=function(canvas,ctx){
    var self=this;
    if(typeof(ctx)=="undefined"){
        ctx = canvas.getContext("2d");
    }
    
    this.menuOpen=null;
    
    this.ctx=ctx;
    this.canvas=canvas;
    
    this.menus=[];
    
    this.addMenu=function(name,background){
        this.menus.push(new CanvasGUIMenu(name));
    }
    
    this.getMenu=function(name){
        for(var i=0;i<this.menus.length;i++){
            if(this.menus[i].name==name){
                return this.menus[i];
            }
        }
        throw "Could not find menu: "+name;
    }
    
    this.open=function(name){
        
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        
        this.ctx.save();
        
        var menu = this.getMenu(name);
        
        this.menuOpen=menu;
        
        if(menu.background!=null){
            //draw background
            this.ctx.drawImage(menu.background, 0, 0);
        }
        
        
        this.ctx.textAlign="center";
        this.ctx.textBaseline="middle";
            
        var b=null;
        
        for(var i=0;i<menu.buttons.length;i++){
            b = menu.buttons[i];
            this.ctx.fillStyle="rgba(0,0,0,0.5)";
            this.ctx.font = (b.height*0.8)+"px Arial";
            
            this.ctx.fillRect(b.pos.x-b.width/2,b.pos.y-b.height/2,b.width,b.height);
            this.ctx.strokeRect(b.pos.x-b.width/2,b.pos.y-b.height/2,b.width,b.height);
            this.ctx.fillStyle="rgba(0,0,0,1)";
            this.ctx.fillText(b.text,b.pos.x,b.pos.y);
        }
        
        var t=null;
        
        for(var i=0;i<menu.text.length;i++){
            t=menu.text[i];
            
            this.ctx.font = t.size+"px Arial";
            
            this.ctx.fillText(t.text,t.pos.x,t.pos.y);
        }
        
        this.ctx.restore();
        
    }
    
    this.close=function(){
        this.menuOpen=null;
    }
    
    this.click=function(x,y){
        
        if(this.menuOpen!=null){
            var b=null;
            for(var i=0;i<this.menuOpen.buttons.length;i++){
                b = this.menuOpen.buttons[i];
                if(x>b.pos.x-b.width/2 && x<b.pos.x+b.width/2 && y>b.pos.y-b.height/2 && y<b.pos.y+b.height/2){
                    if(typeof(b.onpress)=="string"){
                        this.open(b.onpress)
                    }else{
                        b.onpress();
                    }
                    //don't keep on searching! otherwise if another button on the new menu is in the smae place it all goes phooey
                    return;
                }
            }
        }
    }
    this.addButton=function(menuName,pos,width,height,text,onpress){
        this.getMenu(menuName).buttons.push(new CanvasGUIButton(pos, width, height, text, onpress));
    }
    
    this.addText=function(menuName,pos,size,text){
        this.getMenu(menuName).text.push(new CanvasGUIText(pos, size,text));
    }
    
    this.addTextBlock=function(menuName,pos,size,texts){
        for(var i=0;i<texts.length;i++){
            this.getMenu(menuName).text.push(new CanvasGUIText(pos.add(new Vector(0,size*1.5*i)), size,texts[i]));
        }
    }
    
//    this.pressed=function(){
//        if(typeof(this.onpress=="string")){
//            
//        }
//    }
}

var CanvasGUIButton=function(pos,width,height,text,onpress){
    //if onpress is a string, then pressing the button will load that menu
    //otherwise onpress is a function
    this.pos=pos;
    this.width=width;
    this.height=height;
    this.text=text;
    this.onpress=onpress;
    
    
}

var CanvasGUIText=function(pos,size,text){
    this.pos=pos;
    this.size=size;
    this.text=text;
}

var CanvasGUIMenu=function(name,background){
    this.name=name;
    this.background=background;//a canvas or img object taht can be drawn onto ctx
    this.buttons=[];
    this.text=[];    
}