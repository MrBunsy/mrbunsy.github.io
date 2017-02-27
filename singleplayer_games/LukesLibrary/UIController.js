/* 
 * Copyright Luke Wallin 2012
 * 
 * TODO - look at adding the text labels with this system too?
 */


var UIController = function(){
    var self=this;
    this.controls=new Array();
    
    this.getControl=function(name){
        for(var i=0;i<this.controls.length;i++){
            if(this.controls[i].getName()==name){
                return this.controls[i];
            }
        }
        throw "Could not find control: "+name;
    }
    
    this.getRawElements=function(name){
        return this.getControl(name).getRawElements();
    }
    
    this.getValue=function(name){
        return this.getControl(name).getValue();
    }
    
    this.setValue=function(name,value){
        this.getControl(name).setValue(value);
    }
    
    this.enable=function(name,bEnabled){
        this.getControl(name).enable(bEnabled)
    }
    
    this.exists=function(name){
        for(var i=0;i<this.controls.length;i++){
            if(this.controls[i].getName()==name){
                return true;
            }
        }
        
        return false;
    }
    
    this.remove=function(name){
        //try{
        //find it in the array
        var r =this.controls.indexOf(this.getControl(name));
        //remove it
        
//        }catch(e){
//            //bodge for IE
//           for(var i=0;i<this.controls.length;i++){
//               if(this.controls[i].getName()==name){
//                   r=i;
//                   break;
//               }
//           }
//        }
        if(r>=0){
            this.controls.splice(r,1);
        }
    }
    
    this.reset=function(){
        this.controls=new Array();
    }
    //add, and replace if already exists
    this.add=function(control){
        //won't do anything if it didn't exist
        if(this.exists(control.getName())){
            this.remove(control.getName());
        }
        this.controls.push(control);
    }
    
    this.addSlider=function(name,bInt,min,value,max,step,parent,callback){
        this.add(new UISlider(name, bInt, min, value, max, step, parent,callback));
    }
    
    this.addTickBox=function(name,bTicked,parent,label,callback){
        this.add(new UITickBox(name, bTicked,parent,label,callback));
    }
    
    this.addColourPicker=function(name,parent,value,callback){
        this.add(new UIColourPicker(name, parent, value, callback));
    }
    
    
}

UIController.addButton=function(value,parent,callback){
        var button=document.createElement("input");
        button.type="button";
        button.value=value;
        button.onclick=callback;
        parent.appendChild(button);
        return button;
    }

//what all the compontents must obey
var UIComponentInterface=function(){
    this.getName=function(){}
    this.getValue=function(){}
    this.setValue=function(v){}
    this.enable=function(b){}
    //returns the raw HTML element
    this.getRawElements=function(){}
}

var UIColourPicker=function(name,parent,value,callback){
    var self=this;
    this.name=name;
    
    //colour picker will do the appending for us
    this.colourPicker=new ColourPicker(parent,callback,value);
    
    this.getName=function(){
        return this.name
    }
    this.getValue=function(){
        this.colourPicker.getColour();
    }
    this.setValue=function(v){
        this.colourPicker.setColour(v);
    }
    this.enable=function(b){
        //TODO
    }
    //returns the raw HTML element
    this.getRawElements=function(){
        //closest thing to the raw HTML element
        return this.colourPicker;
    };
}

var UITickBox=function(name,bTicked,parent,label,callback){
    var self=this;
    this.name=name;
    
    if(typeof(label)=="undefined"){
        label="";
    }
    
    var useLabel=label.length>0
    if(useLabel){
        var labelElement=document.createElement("label");
        labelElement.innerHTML=label;
    }
    //create the tickbox
    this.checkbox = document.createElement("input");
    this.checkbox.type="checkbox";
    //set it to the default
    this.checkbox.checked=bTicked;
    if(typeof(callback)!="undefined"){
        this.checkbox.onchange=function(){callback(self.getValue())}
    }
    if(useLabel){
        labelElement.appendChild(this.checkbox);
        parent.appendChild(labelElement);
    }else{
        parent.appendChild(this.checkbox);
    }
    
    this.getName=function(){
        return this.name;
    }
    
    this.getValue=function(){
        return this.checkbox.checked;
    }
    
    this.setValue=function(v){
        this.checkbox.checked=v;
    }
    
    this.getRawElements=function(){
        return [this.checkbox];
    }
    
    this.enable=function(bEnabled){
        this.checkbox.disabled=!bEnabled;
    }
}

//bInt = true if int, false if float
var UISlider=function(name,bInt,min,value,max,step,parent,callback){
    var self=this;
    this.name=name;
    this.bInt=bInt;
    
    this.defaultValue=value;
    
    //create the slider
    this.slider = document.createElement("input");
    //this.slider.type="range";
    this.slider.setAttribute("type", "range");
    this.slider.max=max;
    this.slider.min=min;
    this.slider.value=value;
    this.slider.step=step;
    //create the box
    this.box = document.createElement("input");
    this.box.type="text";
    this.box.value=value;
    //sync them
    UISlider.sync(this.box,this.slider);
    
    if(typeof(callback)!="undefined"){
        var oldonchange=this.slider.onchange;
        this.slider.onchange=function(){oldonchange();callback(self.getValue())};
        this.slider.onkeyup=function(){oldonchange();callback(self.getValue())};
        var oldonchange2 = this.box.onchange;
        this.box.onchange=function(){oldonchange2();callback(self.getValue())};
        this.box.onkeyup=function(){oldonchange2();callback(self.getValue())};
    }
    
    //add them to the parent
    parent.appendChild(this.slider);
    parent.appendChild(this.box);
        
    this.getName=function(){
        return this.name;
    }
    
    this.getValue=function(){
        var v = this.bInt ? parseInt(this.slider.value) : parseFloat(this.slider.value);
        if(isNaN(v)){
            v=this.defaultValue;
        }
        return v;
    }
    
    this.setValue=function(v){
        this.slider.value=v;
        this.box.value=v;
    }
    
    this.getRawElements=function(){
        return [this.slider,this.box];
    }
    
    this.enable=function(bEnabled){
        this.slider.disabled=!bEnabled;
        this.box.disabled=!bEnabled;
    }
}

UISlider.sync=function(one,two){
    var a=one;
    var b=two;
    a.onchange=UISlider.updateInput(b,a);
    b.onchange=UISlider.updateInput(a,b);
    a.onkeyup=UISlider.updateInput(b,a);
    b.onkeyup=UISlider.updateInput(a,b);
}
        
UISlider.updateInput=function(updateMe,withMe){
    var from=withMe;
    var to=updateMe;

    return function(){
        to.value=from.value;
    }
}