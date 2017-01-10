/* 
 * Copyright Luke Wallin 2012
 * 
 * re-writing the old one as follows:
 * 
 * proper state system
 * 
 * loop to re-draw spiro which does so if reDraw is true
 * 
 * all controls use callbacks to update the spirograph
 * 
 * 
 * to add another gear, the addAnotherGear method will simply add a new gear with the default settings
 * to the top of the spirograph, and then the state system will auto edit the top gear
 * on the pile
 * 
 * 
 * TODO - work out hwy so much CPU is being used
 * I think that was unrelated
 */

/*
 * States:
 * blank - nothing happened yet
 
 * editFirstGear - adjusting the first gear
 
 * editTopGear - adjusting the topmost gear
 * pen - adding a pen (have something record which gear it is being added to? will this.gear do?)
 * running - spirograph actually running
 */

//not using:
//* addFirstGear - transatory state to add a first gear
//* addTopGear - transatory state to add another gear

var SpirographUI=function(spirograph,div){
    var self=this;
    this.controller = new UIController();
    this.spirograph = spirograph;
    this.width=this.spirograph.canvas.width;
    this.height=this.spirograph.canvas.height;
    this.div=div;
    this.colours=[new Colour(255,0,0),new Colour(0,255,0),new Colour(0,0,255),new Colour(255,128,0),new Colour(128,0,255),new Colour(255,255,0)];
    
    //at top is TitleDiv
    //in middle is ContentDiv
    //at bottom is BottomDiv
    
    this.titleDiv=document.createElement("div");
    this.contentDiv=document.createElement("div");
    this.bottomDiv=document.createElement("div");
    
    this.div.appendChild(this.titleDiv);
    this.div.appendChild(this.contentDiv);
    this.div.appendChild(this.bottomDiv);
    
    
    this.title=document.createElement("h2");
    this.titleDiv.appendChild(this.title);
    
    //for our loop
    this.thread=false;
    this.interval=200;
    this.running=false;
    
    this.reDraw=false;
    
    this.state="blank";
    this.gear=0;
    
    this.setTitle=function(title){
        this.title.innerHTML=title;
    }
    
    
    this.init=function(){
        
        var json = getVar("json");
        
        if(json.length >0){
            //some json, try to decode
            json=decodeURIComponent(json);
            this.spirograph.unSerialize(JSON.parse(json));
            this.gear=this.spirograph.gears.length-1;
            this.changeState("running");
        }else{
            //this.changeState("addFirstGear");
            this.addFirstGear();
            this.changeState("editFirstGear");
        }
        
    }
    
    this.changeState=function(nextState){
        
        switch(nextState){
            case "blank":
                this.setTitle("Spirograph");
                this.contentDiv.innerHTML="";
                this.bottomDiv.innerHTML="";
                this.stop();
                break;
//            case "addFirstGear":
//                //reset the spirograph add add just one gear - the first one
//                this.spirograph.reset();
//                this.spirograph.addGear( new Gear(100,this.getToothSize(100,this.width*0.4),new Colour(200,200,200)).setPos(new Vector(this.width/2,this.height/2)) );
//                this.spirograph.draw();
//                //this.changeState("editFirstGear");
//                break;
            case "editFirstGear":
                this.setTitle("Edit First Gear");
                this.contentDiv.innerHTML="";
                this.bottomDiv.innerHTML="";
                this.start();
                this.gear=0;
                this.firstGearContent();
                break;
//            case "addTopGear":
//                this.addTopGear();
//                break;
            case "editTopGear":
                this.setTitle("Edit Gear");
                this.contentDiv.innerHTML="";
                this.bottomDiv.innerHTML="";
                this.topGearContent();
                this.start();
                break;
            case "pen":
                this.setTitle("Edit Pen");
                this.contentDiv.innerHTML="";
                this.bottomDiv.innerHTML="";
                this.penContent();
                self.spirograph.stop();
                self.spirograph.clearPenCanvas();
                this.start();
                break;
            case "running":
                this.setTitle("Drawing Spirograph");
                this.contentDiv.innerHTML="";
                this.bottomDiv.innerHTML="";
                this.runningContent();
                this.spirograph.start();
                this.stop();
                break;
        }
        
        
        this.state=nextState;
    }
    
    this.addFirstGear=function(){
        this.spirograph.reset();
        this.spirograph.addGear( new Gear(100,this.getToothSize(100,this.width*0.4),new Colour(200,200,200)).setPos(new Vector(this.width/2,this.height/2)) );
        this.spirograph.draw();
    }
    
    //get the max teeth for the gear on top of the pile
    this.getMaxTeeth = function(){
        
        var inside=this.spirograph.gears[this.gear].getInside();
        
        var parentTeeth = this.spirograph.gears[this.gear-1].getTeeth(inside);
        
        var maxTeeth = inside ? parentTeeth-1 : 200;
        
        return maxTeeth;
    }
    
    //content for editing the pen on the top gear
    this.penContent=function(){
        var pen = this.spirograph.gears[this.gear].pens[this.spirograph.gears[this.gear].pens.length-1];
        
        this.addText("Pen Distance From Centre",this.contentDiv)
        this.addBR(this.contentDiv);
        
        var lastR=this.spirograph.gears[this.gear].getInnerRadius();
        
        this.controller.addSlider("distance", false, 0, pen.radius, lastR*0.9, 0.2, this.contentDiv,this.penDistanceCallback);
        this.addBR(this.contentDiv);
        this.addText("Pen Colour",this.contentDiv)
        this.addBR(this.contentDiv);
        
        this.controller.addColourPicker("colour", this.contentDiv, pen.colour, this.penColourCallback);
        
        UIController.addButton("Back", this.bottomDiv, function(){
            //TODO if I want multiple pens on the same gear, remove this:
            self.spirograph.gears[self.gear].pens=new Array();
            self.spirograph.draw();
            self.changeState("editTopGear");
        });
        
        UIController.addButton("Finish", this.bottomDiv, function(){
            self.changeState("running");
        });
    }
    
    //content for editing the top gear
    this.topGearContent=function(){
        //therefore assuming that this.gear>=1
        //zoom control
        this.addZoomOptions(this.contentDiv);
        this.addBR(this.contentDiv);
        this.addBR(this.contentDiv);
        var inside=this.spirograph.gears[this.gear].getInside();
        
        var maxTeeth = this.getMaxTeeth();
        
        var teeth = this.spirograph.gears[this.gear].getTeeth();
        //teeth slider
        this.addText("Teeth", this.contentDiv);
        this.controller.addSlider("teeth", true, 10, teeth,maxTeeth, 1, this.contentDiv,this.teethCallback);
        this.addBR(this.contentDiv);
        this.addBR(this.contentDiv);
        //inside tickbox
        this.controller.addTickBox("inside", inside, this.contentDiv,"Inside",this.insideCallback);
        this.addBR(this.contentDiv);
        this.addBR(this.contentDiv);
        //colour picker
        this.addText("Colour: ", this.contentDiv,'inline');
        this.controller.addColourPicker("colour", this.contentDiv, this.spirograph.gears[this.gear].getColour(), this.gearColourCallback);
        this.addBR(this.contentDiv);
        this.addBR(this.contentDiv);
        //speed slider
        this.addText("Speed", this.contentDiv);
        var speed = this.spirograph.gears[this.gear].getSecondsPerRev();
        //Math.round(100*1/this.spirograph.gears[this.gear].getSecondsPerRev())/100
        //this.controller.addSlider("speed", false, 0, 0.2, 1, 0.01, this.contentDiv, this.gearSpeedCallback);
        this.controller.addSlider("speed", false, 1, Math.abs(speed), 60, 0.5, this.contentDiv, this.gearSpeedCallback);
        this.controller.addTickBox("clockwise",speed > 0, this.contentDiv, "Clockwise: ",this.gearSpeedClockwiseCallback);
        var internal=this.spirograph.gears[this.gear].getInternalGear() !=null;
        
        this.addBR(this.contentDiv);
        this.addBR(this.contentDiv);
        
        //tickbox for internal teeth control
        this.controller.addTickBox("internalTeethTick", internal, this.contentDiv, "Internal Teeth", this.openCloseInternal);
        this.addBR(this.contentDiv);
        var internalTeeth = this.spirograph.gears[this.gear].getTeeth(internal);
        this.controller.addSlider("internalTeeth", true, 10, internalTeeth, 200, 1, this.contentDiv, this.setInternalTeeth);
        //enable or disable it
        this.controller.enable("internalTeeth",internal);
        this.addBR(this.contentDiv);
        this.addBR(this.contentDiv);
        UIController.addButton("Back", this.bottomDiv, function(){
            self.removeTopGear();
            if(self.gear ==0){
                self.changeState("editFirstGear");
            }else{
                self.changeState("editTopGear");
            }
        });
        
        UIController.addButton("Add Another Gear", this.bottomDiv, function(){
            //self.changeState("addTopGear");
            self.addTopGear();

            self.changeState("editTopGear");

        });
        
        UIController.addButton("Add Pen", this.bottomDiv, function(){
            //self.changeState("addTopGear");
            self.addPen();

            self.changeState("pen");

        });
    }
    
    //content for editing the first gear
    this.firstGearContent=function(){
        this.addZoomOptions(this.contentDiv);
        this.addBR(this.contentDiv);
        this.addBR(this.contentDiv);
        this.addText("Teeth", this.contentDiv);
        this.controller.addSlider("teeth", true, 20, this.spirograph.gears[0].getTeeth(), 200, 2, this.contentDiv,this.teethFirstGearCallback);
        this.addBR(this.contentDiv);
        this.addBR(this.contentDiv);
        this.controller.addTickBox("inside", this.spirograph.gears[0].getInside(), this.contentDiv,"Inside",this.insideFirstGearCallback);
        this.addBR(this.contentDiv);
        this.addBR(this.contentDiv);
        UIController.addButton("Add Another Gear", this.bottomDiv, function(){
            //self.changeState("addTopGear");
            self.addTopGear();
            self.changeState("editTopGear");
        });
    }
    
    //generate the running content
    this.runningContent=function(){
        this.addZoomOptions(this.contentDiv);
        this.addBR(this.contentDiv);
        
        //speed control buttons
        this.addText("Speed:", this.contentDiv, "button_title");
        UIController.addButton("-",this.contentDiv,function(){
            self.spiroSpeedText.innerHTML = Math.round(self.spirograph.slowDown()*10)/10 + "x";
        });
        this.spiroSpeedText = this.addText(Math.round(this.spirograph.getSpeedBoost()*10)/10+"x", this.contentDiv, "between_button_text");
        UIController.addButton("+",this.contentDiv,function(){
            self.spiroSpeedText.innerHTML = Math.round(self.spirograph.speedUp()*10)/10 + "x";
        });
        this.addBR(this.contentDiv);
        
        //framerate stuff
        this.addText("Framerate:", this.contentDiv, "button_title");
        UIController.addButton("-",this.contentDiv,function(){
            self.spiroframerateText.innerHTML = Math.round(self.spirograph.changeFramerate(false)*10)/10+" FPS";
        });
        this.spiroframerateText = this.addText(self.spirograph.getFramerate()+" FPS", this.contentDiv, "between_button_text");
        //increase framerate  
        UIController.addButton("+",this.contentDiv,function(){
            self.spiroframerateText.innerHTML = Math.round(self.spirograph.changeFramerate(true)*10)/10+" FPS";
        });
        this.addBR(this.contentDiv);
        
        //pause and play stuff
        //TODO if auto-complete is occuring, pressing pause should cancel it
        this.pauseButton=UIController.addButton("Pause",this.contentDiv,function(){
            self.spirograph.cancelComplete();
            self.spirograph.stop();
            self.pauseButton.disabled=true;
            self.playButton.disabled=false;
        });
        this.playButton=UIController.addButton("Play",this.contentDiv,function(){
            self.spirograph.start();
            self.pauseButton.disabled=false;
            self.playButton.disabled=true;
        });
        self.playButton.disabled=true;
        
        //clear screen button
        this.addBR(this.contentDiv);
        UIController.addButton("Clear Screen",this.contentDiv,function(){
            self.spirograph.clearPenCanvas();
        });
        
        //auto complete button
        this.addBR(this.contentDiv);
        this.completeButton=UIController.addButton("Complete Quickly",this.contentDiv,function(){
            self.cancelCompleteButton.disabled=false;
            self.spirograph.complete(function(){self.cancelCompleteButton.disabled=true;});
        });
        this.cancelCompleteButton=UIController.addButton("Cancel",this.contentDiv,function(){
            self.spirograph.cancelComplete();
            self.cancelCompleteButton.disabled=true;
        });
        this.cancelCompleteButton.disabled=true;
        
        this.addBR(this.contentDiv);
        this.addBR(this.contentDiv);
        
        //link
        //doing this only once has the side-effect (originally unforseen) that the zoom/speed options don't influence the link
        //not sure whether to change this or not
        this.addText("<a href='"+this.getURL()+"'>A Link to this Spirograph</a>", this.contentDiv);
        this.addBR(this.contentDiv);
        //save image options
        UIController.addButton("Save Current Image",this.contentDiv,function(){
            self.img.src=self.spirograph.penCanvas.toDataURL("image/png");
            self.saveDiv.style.display="block";
        });
        
        this.img=document.createElement("img");
        this.img.width=200;
        this.img.height=200;
        this.img.style.border="solid #999 1px";
        
        this.saveDiv=document.createElement("div");
        
        this.saveDiv.innerHTML="Right click, Save Image As";
        
        UIController.addButton("Done",this.saveDiv,function(){
            self.saveDiv.style.display="none";
        });
        
        this.addBR(this.saveDiv);
        this.saveDiv.style.display="none";
        this.saveDiv.appendChild(this.img);
        this.contentDiv.appendChild(this.saveDiv);

        //start again button
        this.addBR(this.contentDiv);
        this.addBR(this.contentDiv);
        
        UIController.addButton("Edit",this.contentDiv,function(){
            self.changeState("pen");
        });
        UIController.addButton("Create New Spirograph",this.contentDiv,function(){
            var doReset=confirm("This will lose your current Spirograph.  Are you sure?");
            if(doReset){
                //self.changeState("addFirstGear");
                self.addFirstGear();
                self.changeState("editFirstGear");
            }
        });
    }
    
    this.getURL=function(){
        var url=document.location+'';
        //bodge so its the last question mark, not the last slash
	var lastSlash=url.lastIndexOf('?');
        if(lastSlash < 0){
            lastSlash=url.length;
        }
	var link=url.substring(0,lastSlash);//+1
        var json = JSON.stringify(this.spirograph.serialize());
        return link+"?json="+json;
    }
    
    //methods for UI stuff:
    this.addBR=function(parent){
        return parent.appendChild(document.createElement("br"));
    }
    
    this.addText=function(text,parent,className){
        var div = document.createElement("div");
        if(typeof(className)!="undefined"){
            div.setAttribute("class", className);
        }
        div.innerHTML=text;
        parent.appendChild(div);
        
        return div
    }
    
    this.addZoomOptions=function(parent){
        this.addText("Zoom:", parent, "button_title");
        UIController.addButton("-",parent,function(){
            self.spiroZoomText.innerHTML = Math.round(self.spirograph.changeZoom(false)*10)/10 + "x";
            self.spirograph.drawIfNotRunning();
        });
        this.spiroZoomText = this.addText(Math.round(this.spirograph.getZoom()*10)/10+"x", parent, "between_button_text");
        UIController.addButton("+",parent,function(){
            self.spiroZoomText.innerHTML = Math.round(self.spirograph.changeZoom(true)*10)/10 + "x";
            self.spirograph.drawIfNotRunning();
        });
    }
    
    this.getToothSize=function(teeth,r){
        return Math.PI*r/teeth;
    }
    
    //add a pen to the top gear
    this.addPen=function(){
        var lastR=this.spirograph.gears[this.gear].getRadius();
        var pen = new Pen(new Colour(0,0,0), this.spirograph.ctxPen, 0,0);//Math.round(10*lastR*0.4)/10
        this.spirograph.gears[this.gear].addPen(pen);
        
        this.spirograph.draw();
    }
    
    this.removeTopGear=function(){
      this.spirograph.gears.splice(this.gear,1);
      this.gear--;
      
      this.spirograph.draw();
    }
    
    //add another gear on top
    this.addTopGear=function(){
        //assuming that this is always inside
        var newTeeth = Math.round(this.spirograph.gears[this.gear].getTeeth(true)*0.4);
        newTeeth = Math.max(10,newTeeth);
        
        var inside=true;
        
        
        
        var oldTeeth = this.spirograph.gears[this.gear].getTeeth();
        if(oldTeeth > 10){
            this.gear++;
            this.spirograph.addGear(new Gear(newTeeth,this.spirograph.gears[this.gear-1].getToothSize(inside),this.colours[this.gear%this.colours.length]).gearTo(this.spirograph.gears[this.gear-1], inside).setSecondsPerRev(5));
            
        }
        
        
        this.spirograph.draw();
    }
    
    this.penDistanceCallback=function(distance){
        var pen = self.spirograph.gears[self.gear].pens[self.spirograph.gears[self.gear].pens.length-1];
        
        pen.radius=distance;
        
        self.reDraw=true;
    }
    
    this.penColourCallback=function(colour){
        var pen = self.spirograph.gears[self.gear].pens[self.spirograph.gears[self.gear].pens.length-1];
        pen.setColour(colour);
        
        self.spirograph.draw();
    }
    
    this.gearColourCallback=function(colour){
        self.spirograph.gears[self.gear].setColour(colour);
        self.spirograph.draw();
    }
    
    this.openCloseInternal=function(open){
        self.controller.enable("internalTeeth",open);
        
        if(open){
            //self.spirograph.gears[self.gear].setInternalGear(teeth, toothSize)
            self.setInternalTeeth(self.controller.getValue("internalTeeth"));
        }else{
            self.spirograph.gears[self.gear].setInternalGear(0, 0);
        }
        self.reDraw=true;
    }
    
    this.setInternalTeeth=function(teeth){
        var innerToothSize=self.spirograph.gears[self.gear].getToothSize();
        var outsideTeeth = self.spirograph.gears[self.gear].getTeeth();
        if(teeth >= outsideTeeth){
            //toothsize needs to shrink
            var outerC = outsideTeeth*self.spirograph.gears[self.gear].getToothSize();
            var innerC=outerC*0.9;
            innerToothSize = innerC/teeth;
        }
        
        self.spirograph.gears[self.gear].setInternalGear(teeth, innerToothSize);
        
        self.reDraw=true;
    }
    
    this.gearSpeedClockwiseCallback=function(clockwise){
        var speed = self.spirograph.gears[self.gear].getSecondsPerRev();
        
        speed = (clockwise ? 1 : -1) * Math.abs(speed);
        
        self.spirograph.gears[self.gear].setSecondsPerRev(speed);
    }
    
    this.gearSpeedCallback=function(speed){
        self.spirograph.gears[self.gear].setSecondsPerRev(speed);
    }
    
    this.teethFirstGearCallback=function(newTeeth){
        var inside = self.spirograph.gears[0].getInside();
        var toothSize = self.getToothSize(newTeeth,self.width*(inside ? 0.4 : 0.2));
        self.spirograph.gears[0].setTeeth(newTeeth,toothSize);
        
        self.reDraw=true;
    }
    
    this.teethCallback=function(newTeeth){
        //var inside = self.spirograph.gears[self.gear].getInside();
        //var toothSize = self.gear==0 ? self.getToothSize(newTeeth,self.width*(inside ? 0.4 : 0.2)) : self.spirograph.gears[self.gear-1].getToothSize(self.spirograph.gears[self.gear].getInside());
        self.spirograph.gears[self.gear].setTeeth(newTeeth);
        
        self.reDraw=true;
    }
    
    
    this.insideFirstGearCallback = function(inside){
        self.spirograph.gears[self.gear].setInside(inside);
        self.teethFirstGearCallback(self.spirograph.gears[self.gear].getTeeth(inside));
    }
    
    this.insideCallback=function(inside){
        self.spirograph.gears[self.gear].setInside(inside);
        //update the max teeth allowed
        self.controller.getRawElements("teeth")[0].max = self.getMaxTeeth();
        
        self.reDraw=true;
    }
    
    this.update=function(){
        switch(this.state){
            case "editFirstGear":
            case "editTopGear":
            case "pen":
                if(this.reDraw){
                    this.spirograph.draw();
                    this.reDraw=false;
                }
                break;
        }
    }
    
    
    
    this.start=function(){
        if(!this.running){
            //this var should work fine in update:
            this.thread = setInterval(function(){
                self.update.call(self)
                },this.interval);
            this.running=true;
        }
    }
    
    this.stop=function(){
        if(this.running){
            clearInterval(this.thread);
            this.running=false;
        }
    }
    
    
    //initialise?
    this.changeState("blank");
    
    this.init();
}