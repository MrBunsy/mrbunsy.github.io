/* 
 * Copyright Luke Wallin 2012
 * 
 * The idea is this takes the heavy lifting of form elements and makes an
 * easy way to get and set values
 * 
 * I'm not sure if jquery has something similar, I was away from the internet when writing this
 * 
 * controller.addWhatever(name,parent,arguments,callback) will add the elements to the parent object (eg a div)
 * the callback will be called with the value as the arugment if it changes
 * 
 * then controller.getValue(name) will also return the value
 * controller.setValue(name,value) will set the value
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
    
    //return an array of the raw HTML elements created
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
var UISlider=function(name,bInt,_min,_value,_max,_step,parent,callback){
    var self=this;
    this.name=name;
    this.bInt=bInt;
//    this.min=_min;
//    this.max=_max;
//    this.value=_value;
//    this.step=_step;
    
    this.defaultValue=_value;
    
    //create the slider
    this.slider = document.createElement("input");
    //this.slider.type="range";
    
//    this.slider.max=_max;
//    this.slider.min=_min;
//    this.slider.value=_value;
//    this.slider.step=_step;
    //doing it this way means html5slider.js for firefox picks up on min,max and step
    this.slider.setAttribute("type", "range");
    this.slider.setAttribute("max", _max);
    this.slider.setAttribute("min", _min);
    this.slider.setAttribute("value", _value);
    this.slider.setAttribute("step", _step);
    
    if(typeof(fdSlider)!="undefined"){
        this.sliderDiv=document.createElement("div");
        this.sliderDiv.style.width="200px";
        this.sliderDiv.style.display="inline-block"
        this.sliderDiv.appendChild(this.slider);
    }
    
    
    //create the box
    this.box = document.createElement("input");
    this.box.type="text";
    this.box.value=_value;
    //sync them
    UISlider.sync(this.box,this.slider);
    
    
    this.getValue=function(){
        var v = this.bInt ? parseInt(this.slider.value) : parseFloat(this.slider.value);
        if(isNaN(v)){
            v=this.defaultValue;
        }
        return v;
    }
    
    if(typeof(callback)!="undefined"){
        var oldonchange=this.slider.onchange;
        this.slider.onchange=function(){oldonchange();callback(self.getValue())};
        this.slider.onkeyup=function(){oldonchange();callback(self.getValue())};
        var oldonchange2 = this.box.onchange;
        this.box.onchange=function(){oldonchange2();callback(self.getValue())};
        this.box.onkeyup=function(){oldonchange2();callback(self.getValue())};
    }
    
    //add them to the parent
    //parent.appendChild(this.slider);
    if(typeof(fdSlider)!="undefined"){
        parent.appendChild(this.sliderDiv);
        
//        fdSlider.createSlider({
//                // Associate the select list
//                inp:this.slider,
//                // Use the tween animation
//                //animation:"tween",
//                // Keep the form element hidden
//                hideInput:true,
//                // Set min, max and step
//                max:_max,
//                min:_min,
//                step:_step
//        });        
        fdSlider.init();
        
    }else{
        parent.appendChild(this.slider);
    }
    parent.appendChild(this.box);
        
    this.getName=function(){
        return this.name;
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
        //can't get working, not sure how to get the id I need to give enable/disable.
        //only IE so can't be bothered in putting in effort to find it
//        if(typeof(fdSlider)!="undefined"){
//            if(bEnabled){
//                fdSlider.enable(this.slider);
//            }else{
//                fdSlider.disable(this.slider);
//            }
//        }
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