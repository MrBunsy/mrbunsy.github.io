/* 
 * Copyright Luke Wallin 2012
 * 
 * Yes, this is likely to be an unmaintable mess.  I don't care.  I'm on holiday.
 * - it's actually got much better since UIController.  Still a bit ugly.
 * 
 * TODO - atm internalteeth can be set very high, but this doesn't influence the limit of the next gear size
 * maybe limit internalteeth?
 * -sort of done, might be enough
 * 
 * TODO - tidy up gear size limits now that thye can go on the outside
 * STILL NEEDS DOING - a gear on the outside of a preivous gear can't be bigger than it
 * 
 * TODO allow backwards rotations  tickbox for anti-clockwise?
 * Done :D
 * 
 * TODO - massively tidy up layout of Internal Gear and generally tidy up layout of rest
 * -done, mostly!
 * 
 * TODO - proper UI for once in progress.
 * DONE
 * 
 * TODO pause button :D
 * have Play next to Pause and the right one disabled
 * 
 * TODO - maybe add rounded border to colour chooser button?
 * 
 * TODO remove last gear option? <- REALLY DO NEED THIS
 * 
 * 
 * TODO -add warning to Create Another (prompt?)
 * done :D
 * 
 * 
 * If I really wanted to tidy this up I think I could do it like htis:
 * have a createSlider option which takes a string for the name and the element to add it to
 * there is a keypair array for all the sliders with the name string as a key
 * 
 * I think this might be worth doing - then I could re-use this stuff for later!
 * done :D
 * 
 * 
 * future thoguht: a much neater way of doing this would be tpo ahve callbacks for values
 * like teeth, and then a needUpdate boolean
 * which is checked on a loop to re-draw the screen
 * 
 * don't think I wnat to change it now though.
 * 
 * 
 * extra features:
 * adding more than one pen - maybe add pen doesn't then finish?  just goes back to gears
 * 
 * change colour of pen while drawing?
 * 
 * preview?  Is it possible to get an equation for the line and then draw it without 
 * requiring the same sort of generation
 * 
 * 
 * better state system: currentState and nextState, and then everything is rebuilt whenever the state changes
 */


/*
 * States:
 * new - nothing happened yet
 * firstGear - adjusting the first gear
 * topGear - adjusting the topmost gear
 * pen - adding a pen (have something record which gear it is being added to? will this.gear do?)
 * running - spirograph actually running
 */

var SpirographUI=function(spirograph,div){
    var self=this;
    this.controller = new UIController();
    this.spirograph = spirograph;
    this.width=this.spirograph.canvas.width;
    this.height=this.spirograph.canvas.height;
    this.div=div;
    this.colours=[new Colour(255,0,0),new Colour(0,255,0),new Colour(0,0,255),new Colour(255,128,0),new Colour(128,0,255),new Colour(255,255,0)];
    
    this.state="new";
    this.wantState="new";
    
    this.init=function(){
        
        var json = getVar("json");
        
        if(json.length >0){
            //some json, try to decode
            json=decodeURIComponent(json);
            this.spirograph.unSerialize(JSON.parse(json));
            //this.spirograph.start();
            //this.startSpiro();
            this.wantState="running";
        }else{
            //standard UI
            //this.firstGearUI();
            //
            //TODO add the first gear!
            
            this.wantState="firstGear";
        }
        
    }
    
    this.teethAndInsideUI=function(){
        
        this.addZoomOptions(this.gearForm);
        this.gearForm.appendChild(document.createElement('br'));
        
        this.addText("Teeth", this.gearForm);
        this.controller.addSlider("teeth", true, 20, this.oldGearTeeth, 200, 2, this.gearForm);
        this.addBR(this.gearForm);
        
        
        this.insideLabel = document.createElement("label");
        this.insideLabel.innerHTML="Inside";
        this.controller.addTickBox("inside", true, this.insideLabel);
        this.gearForm.appendChild(this.insideLabel);
    }
    
    this.firstGearUI=function(){

        //slight bodge so that when going back to the first gear there isn't a graphic glitch
        if(this.spirograph.gears.length==0){
            this.spirograph.addGear( new Gear(100,this.getToothSize(100,this.width*0.4),new Colour(200,200,200)).setPos(new Vector(this.width/2,this.height/2)) );
            this.spirograph.draw();
        }
        this.state="firstGear";
        this.gear=0;

        this.addTitleText();
        this.updateTitle("Fixed Gear");

        this.gearForm = document.createElement("form");

        
        
        //for updating hte number of teeth - this hsould be the same as the first gear
        this.oldGearTeeth=100;

        
        this.teethAndInsideUI();
        
        //if enter is pressed on the gear form
        this.gearForm.onsubmit=function(){
            self.nextStage();
            return false;
        }

        this.div.appendChild(this.gearForm);

        //a form to go at the bottom to hold the buttons
        this.submitForm = document.createElement("form");
        this.submitForm.onsubmit=function(){
            self.nextStage();
            return false;
        }

        this.backAGear = UIController.addButton("Back",this.submitForm,function(){
            switch(self.state){
                //case "firstGear":
                case "nextGears":
                if(self.gear>1){
                    //remove the top gear
                    self.spirograph.gears.splice(self.gear,1);
                    self.gear--;
                    self.spirograph.draw();

                    //set max high enough
                    self.controller.getRawElements("teeth")[0].max=spirograph.gears[self.gear-1].getTeeth()-1;
                    //set the controls for the previous gear
                    self.controller.setValue("teeth",self.spirograph.gears[self.gear].getTeeth());
                    self.controller.setValue("colour",self.spirograph.gears[self.gear].getColour());
                    self.controller.setValue("inside",self.spirograph.gears[self.gear].getInside());

                    self.controller.setValue("clockwise",self.spirograph.gears[self.gear].getSpeed() > 0);

                    var internalTeeth = self.spirograph.gears[self.gear].getInternalGear() !=null;
                    if(internalTeeth){
                        self.controller.setValue("internalTeethTick",internalTeeth)
                        self.controller.setValue("internalTeeth",self.spirograph.gears[self.gear].getTeeth(true));
                    }

                    //open/close the internal teeth stuff
                    self.openCloseInternal(internalTeeth);
                }else if(self.gear >0){
                    //going back to the original gear, this is a little more messy

                    //remove gear 1
                    self.spirograph.gears.splice(self.gear,1);

                    var teeth = self.spirograph.gears[0].getTeeth();
                    var inside = self.spirograph.gears[0].getInside();
                    //self.reset();
                    self.controller.reset();
                    self.div.innerHTML="";
                    //self.init();
                    //assume we want to ccreate a new spiro, not just reload the page
                    self.firstGearUI();

                    self.controller.setValue("teeth",teeth);
                    self.controller.setValue("inside",inside);

                    self.spirograph.draw();
                    //this.spirograph.addGear( new Gear(teeth,this.getToothSize(100,this.width*0.4),new Colour(200,200,200)).setPos(new Vector(this.width/2,this.height/2)) );
                    //self.spirograph.draw();
                    //something to force update to re-add the gear:
    //                this.oldGearTeeth=-1;
    //                this.updateFirstGearTeeth();

                }
                break;
                //we could finish, or we could go back and add more gears
                case "readyForFinish":
                    //added a pen, go back to adding gears
                    //put the forms back
                    self.gearForm.innerHTML="";
                    self.teethAndInsideUI();
                    self.addGearsUI();
                    self.state="nextGears";
                    //put the colour back
                    //self.colourPicked=self.spirograph.gears[self.gear].getColour();
                    self.controller.setValue("colour",self.spirograph.gears[self.gear].getColour());
                    //self.addNextGear();
                    break;
            }
        });
        this.backAGear.disabled=true;

        this.submitFormSubmit = document.createElement("input");
        this.submitFormSubmit.type="submit";
        this.submitFormSubmit.value="Add Another Gear";
        this.submitForm.appendChild(this.submitFormSubmit);
        
        this.submitFormFinishButton = UIController.addButton("Add Pen",this.submitForm,this.addPen);
        this.submitFormFinishButton.style.display="none";

        this.addBR(this.div);
        this.div.appendChild(this.submitForm);
    }
    
    
    
    //functions used by init:
    this.getToothSize=function(teeth,r){
        return Math.PI*r/teeth;
    }
    
    this.addZoomOptions=function(parent){
        this.addText("Zoom:", parent, "button_title");
        UIController.addButton("-",parent,function(){
            self.spiroZoomText.innerHTML = Math.round(self.spirograph.changeZoom(false)*10)/10 + "x";
            self.spirograph.drawIfNotRunning();
        });
        this.spiroZoomText = this.addText("1x", parent, "between_button_text");
        UIController.addButton("+",parent,function(){
            self.spiroZoomText.innerHTML = Math.round(self.spirograph.changeZoom(true)*10)/10 + "x";
            self.spirograph.drawIfNotRunning();
        });
    }
    
    this.addTitleText=function(){
        this.titleTextDiv = document.createElement("div");
        this.titleText = document.createElement("h1");
        this.titleTextDiv.appendChild(this.titleText);
        this.div.appendChild(this.titleText);
    }
    
    this.updateTitle=function(title){
        this.titleText.innerHTML=title;
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
    
    this.addBR=function(parent){
        parent.appendChild(document.createElement("br"));
    }
    
    //if someone presses the Add Pen button (this.submitFormFinishButton)
    this.addPen=function(){
        self.state="addingPen";
        self.nextStage();
    }
    
    
    
    
    
    this.reset=function(){
        self.stop();
        self.controller.reset();
        self.div.innerHTML="";
        self.spirograph.reset();
        //self.init();
        //assume we want to ccreate a new spiro, not just reload the page
        self.firstGearUI();
        self.start();
    }
    
    //"firstGearGear" - the size of the firstGear gear
    //"nextGear" - all the next gears, including if they're internal/have a pen, are inside,colour etc
    
    this.updateFirstGearTeeth=function(){
        var newTeeth = this.controller.getValue("teeth");
        if(newTeeth!=this.oldGearTeeth || this.oldInsideTicked!=this.controller.getValue("inside")){
            this.spirograph.gears[0]=new Gear(newTeeth,this.getToothSize(newTeeth,this.controller.getValue("inside") ? this.width*0.4 : this.width*0.2),new Colour(200,200,200)).setPos(new Vector(this.width/2,this.height/2)).gearTo(null,this.controller.getValue("inside"));
            this.spirograph.draw();
            this.oldGearTeeth=newTeeth;
            this.oldInsideTicked=this.controller.getValue("inside");
        }
    }
    
    this.oldInternalTeeth=0;
    this.oldInternalTeethTicked=false;
    this.oldInsideTicked=true;
    
    this.updateGearTeeth=function(){
        var newTeeth = this.controller.getValue("teeth");
        var newInternalTeeth = this.controller.getValue("internalTeeth");
        if(newTeeth!=this.oldGearTeeth || this.oldInsideTicked!=this.controller.getValue("inside") || this.oldInternalTeethTicked!=this.controller.getValue("internalTeethTick") ||(this.controller.getValue("internalTeethTick") && newInternalTeeth!=this.oldInternalTeeth)){
            this.spirograph.gears[this.gear]=new Gear(newTeeth,this.spirograph.gears[this.gear-1].getToothSize(this.controller.getValue("inside")),this.colourPicked).gearTo(this.spirograph.gears[this.gear-1], this.controller.getValue("inside"));
            this.updateGearSpeed();
            if(this.controller.getValue("internalTeethTick")){

                var innerToothSize=this.spirograph.gears[this.gear].getToothSize();
                if(newInternalTeeth >= newTeeth){
                    //toothsize needs to shrink
                    var outerC = newTeeth*this.spirograph.gears[this.gear].getToothSize();
                    var innerC=outerC*0.9;
                    innerToothSize = innerC/newInternalTeeth;
                }
                this.spirograph.gears[this.gear].setInternalGear(newInternalTeeth,innerToothSize);
            }
            
            this.spirograph.draw();
            this.oldGearTeeth=newTeeth;
            this.oldInternalTeeth=newInternalTeeth;
            this.oldInternalTeethTicked=this.controller.getValue("internalTeethTick");//this.internalTeethTickBox.checked;
            this.oldInsideTicked=this.controller.getValue("inside");
            this.updateTeethLimit();
        }
    }
    //the last colour chosen by the colour picker
    this.colourPicked=this.colours[1];
    //make the gear being edited the colour just chosen
    this.updateGearColour=function(colour){
        this.spirograph.gears[this.gear].setColour(colour);
        this.spirograph.draw();
    }
    
    //the speed slider has been used, update
    this.updateGearSpeed=function(){
        self.spirograph.gears[self.gear].setRevsPerSec((self.controller.getValue("clockwise") ? 1 : -1)*self.controller.getValue("speed"));
    }
    
    this.openCloseInternal=function(ticked){
//        if(ticked){
//        //open internal teeth options
//            self.internalTeethSlider.disabled=false;
//            self.internalTeethBox.disabled=false;
//        }else{
//            //close them
//            self.internalTeethSlider.disabled=true;
//            self.internalTeethBox.disabled=true;
//        }
        self.controller.enable("internalTeeth",ticked);
    }
    
    this.getNewTeeth=function(){
        if(this.controller.getValue("internalTeethTick")){
            //this is inside the previous gear, look at how many teeth it has inside
            return Math.round(this.spirograph.gears[this.gear].getTeeth(this.controller.getValue("inside"))*0.4);
        }else if(!this.controller.getValue("inside")){
            //this is outside the previous gear, don't reduce the number of teeth much
            return Math.round(this.spirograph.gears[this.gear].getTeeth()*0.9);
        }else{
            return Math.round(this.spirograph.gears[this.gear].getTeeth()*0.4);
        }
        
    }
    
    this.addColourPicker=function(){
        this.addText("Colour", this.gearForm);
        if(this.controller.exists("colour")){
            this.controller.remove("colour");
        }
        this.controller.addColourPicker("colour", this.gearForm, this.colours[this.gear+1], this.colourSelected);
    }
    
    this.updateTeethLimit=function(){
        var gear = this.gear-1;//this.state=="nextGears" ? this.gear-1: this.gear;
        if(this.controller.getValue("inside")){
            this.controller.getRawElements("teeth")[0].max=this.spirograph.gears[gear].getTeeth()-1;
        }else{
            this.controller.getRawElements("teeth")[0].max=200;
        }
    }
    
    this.addGearsUI=function(){
        
        
//        this.div.innerHTML="";
//        this.firstGearUI();
        
        this.updateFirstGearTeeth();
        //add the new stuff to the form
        this.state="nextGears";
        this.updateTitle("Movable Gear");

        //update the teeth slider config
        this.controller.getRawElements("teeth")[0].min=10;
        this.controller.getRawElements("teeth")[0].step=1;

        this.addText("Speed", this.gearForm);
        this.controller.addSlider("speed", false, 1, 5, 60, 0.5, this.gearForm, this.updateGearSpeed);

        this.speedBoxLabel = document.createElement("label");
        this.speedBoxLabel.innerHTML="Clockwise:";

        this.internalTeethDiv = document.createElement("label");
        this.internalTeethDiv.innerHTML="Internal Teeth";
        //adding the tick box to the label
        this.controller.addTickBox("internalTeethTick", false, this.internalTeethDiv, this.openCloseInternal);

        this.controller.addTickBox("clockwise",true, this.speedBoxLabel,this.updateGearSpeed);
        this.gearForm.appendChild(this.speedBoxLabel);

        this.addBR(this.gearForm);

        this.gearForm.appendChild(this.internalTeethDiv);
        this.addBR(this.gearForm); 
        this.controller.addSlider("internalTeeth", true, 10, 10, 200, 1, this.gearForm);
        //disable it
        this.controller.enable("internalTeeth",false);
        //set the default value of number of internal teeth
        this.controller.setValue("internalTeeth",this.getNewTeeth());

        this.addColourPicker();

        this.submitFormFinishButton.style.display="inline";
    }
    
    this.addNextGear=function(){
        var newTeeth = this.getNewTeeth();
        newTeeth = Math.max(10,newTeeth);
        var oldTeeth = this.spirograph.gears[this.gear].getTeeth();
        if(oldTeeth > 10){

            this.controller.setValue("internalTeeth",this.getNewTeeth());
            this.controller.setValue("internalTeethTick",false);
            //this.controller.getRawElements("teeth")[0].max=oldTeeth-1;

            this.controller.setValue("teeth",newTeeth);
            //close the internal teeth stuff
            this.openCloseInternal(false);

            this.oldGearTeeth=newTeeth;
            this.gear++;
            //updateTeethLimit requires this.gear to be correct
            this.updateTeethLimit();
            this.spirograph.gears[this.gear]=new Gear(newTeeth,this.spirograph.gears[this.gear-1].getToothSize(this.controller.getValue("inside")),this.colours[this.gear%this.colours.length]).gearTo(this.spirograph.gears[this.gear-1], this.controller.getValue("inside"));
            this.controller.setValue("colour", this.colours[this.gear%this.colours.length]);
            this.updateGearSpeed();
            this.spirograph.draw()

        }

        this.backAGear.disabled=false;
    }
    
    //this is a strange peice of logic and really wasn't what I intended
    //I should probably have planned this on paper
    this.nextStage=function(){
        switch(this.state){
            case "firstGear":
                //we've just added the first gear and want to add stuff to the UI for adding
                //subsequent gears
                this.addGearsUI();
            case "nextGears":
                //adding another gear
                
                this.addNextGear();
                
                break;
            case "addingPen":
                //adding a pen to the final gear
                
                this.gearForm.innerHTML="";
                
                //this.addTitleText();
                this.addZoomOptions(this.gearForm);
                this.addColourPicker();
                
                //this.titleText.innerHTML="Pen";
                this.updateTitle("Pen");

                this.submitForm.removeChild(this.submitFormFinishButton);
                this.submitFormSubmit.value="Finish";

                this.distanceDiv = document.createElement("div");
                this.distanceDiv.innerHTML="Pen Distance From Centre";

                var lastR=this.spirograph.gears[this.gear].getRadius(false);

                this.gearForm.appendChild(this.distanceDiv);
                this.controller.addSlider("distance", false, 0, lastR*0.4, lastR, 0.2, this.gearForm);
                this.controller.setValue("colour",new Colour(0,0,0));
                
                this.pen = new Pen(new Colour(0,0,0), this.spirograph.ctxPen, 0,this.getPenDistance());
                this.spirograph.gears[this.gear].addPen(this.pen);
                
                this.spirograph.draw();
                
                this.state="readyForFinish";
                break;
            case "readyForFinish":
               
                this.updatePenDistance();
                this.startSpiro();
                
                break;
                
        }
    }
    
    this.colourSelected=function(colour){
        self.colourPicked=colour;
        switch(self.state){
            case "nextGears":
                //changing colour of gear
                self.updateGearColour(colour);
                break;
            case "readyForFinish":
                //chaning pen colour
                self.spirograph.gears[self.gear].pens[0].setColour(colour);
                break;
        }
        
    }
    
    this.oldPenDistance=0;
    
    this.getPenDistance=function(){
        return this.controller.getValue("distance");
    }
    
    this.updatePenDistance=function(){
        var newPenDistance = this.getPenDistance();
        if(this.oldPenDistance!=newPenDistance){
            this.spirograph.gears[this.gear].pens[0] = new Pen(this.colourPicked, this.spirograph.ctxPen, 0,this.getPenDistance());
            //this.pen=new Pen(new Colour(0,0,0), this.spirograph.ctxPen, 0,this.getPenDistance());
            this.spirograph.draw();
            this.oldPenDistance = newPenDistance;
        }
    }
    
    this.update=function(){
        switch(this.state){
            case "firstGear":
                this.updateFirstGearTeeth();
                break;
            case "nextGears":
                this.updateGearTeeth();
                //colour can be done when needed - not the same problem of multiple firings as the sliders
                //this.updateGearColour();
                //this.updateGearSpeed();//now done by a callback from the slider
                break;
            case "readyForFinish":
                this.updatePenDistance();
                break;
        }
    }
    
    this.thread=false;
    this.interval=200;
    
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
    
    this.startSpiro=function(){
        self.state="finished";
        self.stop();
        self.spirograph.start();
        
        //wipe the div
        self.div.innerHTML="";
        
        this.addTitleText();

        //here is the UI for when the spiro is drawing.
        this.updateTitle("Drawing")
        
        this.addZoomOptions(this.div);
        this.addBR(this.div);
        
        //speed control buttons
        this.addText("Speed:", this.div, "button_title");
        UIController.addButton("-",this.div,function(){
            self.spiroSpeedText.innerHTML = Math.round(self.spirograph.slowDown()*10)/10 + "x";
        });
        this.spiroSpeedText = this.addText("1x", this.div, "between_button_text");
        UIController.addButton("+",this.div,function(){
            self.spiroSpeedText.innerHTML = Math.round(self.spirograph.speedUp()*10)/10 + "x";
        });
        
 
        this.addBR(this.div);
        
        //framerate stuff
        this.addText("Framerate:", this.div, "button_title");
        UIController.addButton("-",this.div,function(){
            self.spiroframerateText.innerHTML = Math.round(self.spirograph.changeFramerate(false)*10)/10+" FPS";
        });
        this.spiroframerateText = this.addText("20 FPS", this.div, "between_button_text");
        //increase framerate  
        UIController.addButton("+",this.div,function(){
            self.spiroframerateText.innerHTML = Math.round(self.spirograph.changeFramerate(true)*10)/10+" FPS";
        });
        
        
        this.addBR(this.div);
        
        //pause and play stuff
        //spacer:
        //this.addText("", this.div, "button_title");
        this.pauseButton=UIController.addButton("Pause",this.div,function(){
            self.spirograph.stop();
            self.pauseButton.disabled=true;
            self.playButton.disabled=false;
        });
        this.playButton=UIController.addButton("Play",this.div,function(){
            self.spirograph.start();
            self.pauseButton.disabled=false;
            self.playButton.disabled=true;
        });
        self.playButton.disabled=true;
        
        this.addBR(this.div);
        UIController.addButton("Clear Screen",this.div,function(){
            self.spirograph.clearPenCanvas();
        });
        
        this.addBR(this.div);
        this.completeButton=UIController.addButton("Complete Quickly",this.div,function(){
            self.cancelCompleteButton.disabled=false;
            self.spirograph.complete(function(){self.cancelCompleteButton.disabled=true;});
        });
        
        this.cancelCompleteButton=UIController.addButton("Cancel",this.div,function(){
            self.spirograph.cancelComplete();
            self.cancelCompleteButton.disabled=true;
        });
        this.cancelCompleteButton.disabled=true;
        
        
        
        
        
//        
//        UIController.addButton("Export JSON",this.div,function(){
//            alert(JSON.stringify(self.spirograph.serialize()));
//        });
//        
//        UIController.addButton("Save Image",this.div,function(){
//            alert("Add .png to the end of the file name to save as an image.")
//            //Canvas2Image.saveAsPNG(self.spirograph.penCanvas,false,self.spirograph.width,self.spirograph.height);
//            document.location.href=self.spirograph.penCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
//        });
        
        this.addBR(this.div);
        this.addBR(this.div);
        
        //doing this only once has the side-effect (originally unforseen) that the zoom/speed options don't influence the link
        //not sure whether to change this or not
        this.addText("<a href='"+this.getURL()+"'>A Link to this Spirograph</a>", this.div);
        
        this.addBR(this.div);
        
        UIController.addButton("Save Current Image",this.div,function(){
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
        this.div.appendChild(this.saveDiv);

        this.addBR(this.div);
        this.addBR(this.div);
        UIController.addButton("Create New Spirograph",this.div,function(){
            var doReset=confirm("This will lose your current Spirograph.  Are you sure?");
            if(doReset){
                self.reset();
                self.start();
            }
        });
        
        //also want:
        //save image - open a new window with the image?
        //save URL
        //reset?
        //edit?
        
    }
    
    this.getURL=function(){
        var url=document.location+'';
	var lastSlash=url.lastIndexOf('/');
	var link=url.substring(0,lastSlash+1);
        var json = JSON.stringify(this.spirograph.serialize());
        
        //json = urlencode(json);
        
        return link+"?json="+json;
    }
    
    this.init();
}