/**
 * @author Luke
 */
var HarmonographClass = function(canvas,canvasTag,div,linkDiv,canvasSize,seed,url,page,IE){
	
	var thisObject=this;
	
	this._canvas=canvas;
	this._canvasTag=canvasTag;
	this._canvasSize=canvasSize;
	this._div=div;
	this._linkDiv=linkDiv;
	this._IE=IE;
	//eg http://lukewallin.co.uk/
	this._url=url;
	//eg harmonograph.html
	this._page=page;
	
	this._timeLimit=2000;
	
	if(this._IE){
		this._timeLimit=200;
	}
	this._amplitudeCutOff=10;
	
	this._canvas.lineWidth=0.2;
	
	this._size=200;
	//[min, max, step]
	this._ampLimit=[0,400,20];
	this._freqLimit=[0,8,0.01];
	this._dampLimit=[0,0.1,0.001];
	this._phaseLimit=[0,2,0.1];
	
	this._lastPlane=false;
	this._lastFreq=0;
	
	//if false nt currently drawing slowly, otherwise ref to setTimeout
	this._drawingSlow=false;
	
	//in seconds
	this._timeStep=0.01;
	//in ms
	this._drawSpeed=10;
	//simulated seconds to draw in one go.
	this._drawAtOnce=0.2;
	
	this._random=new sRand(seed);
	
	this._pendulums=new Array();
	this._pendulumForms=new Array();
	
	//found good system I think - x and y pendulum with VERY similar frequency, then another pendulum with different frequency
	
	this.addPendulum=function(){
		

		
		var freq=roundTo(1+this._random.next()*5,2);
		if(this._lastFreq!=0){
			freq=this._lastFreq+roundTo(this._random.next()*0.01,3);
			this._lastFreq=0;
		}else{
			this._lastFreq=freq;
		}
		var amp=roundTo(this._size,2);
		var damping=roundTo(this._random.next()*0.1,3);
		var phase=roundTo(this._random.next()*2,2);
		
		var p=new PendulumClass(amp,freq,phase,damping,!this._lastPlane);
		this._pendulums.push(p);
		
		this._lastPlane=!this._lastPlane;
	}
	
	this.removePendulum=function(i){
		this.updateFromForm();
		this._pendulums.splice(i,1);
		this.buildDiv();
	}
	
	//put an image tag with the png version of the canvas in the div
	this.makePNG=function(thumb){
		//var imgPNG = Canvas2Image.saveAsPNG(this._canvas, true);
		
		/*var imageData=this._canvasTag.toDataURL("image/png", "");
		
		var imageTag=document.createElement("img");
		imageTag.src = imageData;
		*/
		
		if(thumb){
			var imageTag = Canvas2Image.saveAsPNG(this._canvasTag, true, this._canvasSize[0]/2,this._canvasSize[1]/2);  
		}else{
			var imageTag = Canvas2Image.saveAsPNG(this._canvasTag, true);
		}
		
		
		var tempForm=document.createElement("form");
		
		this._div.innerHTML="";
		
		this._div.appendChild(tempForm);
		
		tempForm.innerHTML="Right click, 'save as' image below <input type='button' value='Done' name='done' \><br>"
		
		this._div.appendChild(imageTag);
		
		tempForm.done.onclick=this.buildDiv;
	}
	
	//seperate function so that ptemp is closed after each call so each copy of this anonymous function has a seperate value for ptemp - I think!
	this._removePendulumFunc=function(p){
		var ptemp=p;
		
		return function(){
			thisObject.removePendulum(ptemp);
		}
	}
	
	this._updateWith=function(updateMe,withMe){
		var from=withMe;
		var to=updateMe;
		
		return function(){
			to.value=from.value;
		}
	}
	
	this._copyEachOther=function(one,two){
		var a=one;
		var b=two;
		
		a.onchange=thisObject._updateWith(b,a);
		b.onchange=thisObject._updateWith(a,b);
		a.onkeyup=thisObject._updateWith(b,a);
		b.onkeyup=thisObject._updateWith(a,b);
	}
	
	this.buildDiv=function(){
		
		var saveString="";
		for(var i=0;i<thisObject._pendulums.length;i++){
			saveString+="&a"+i+"="+thisObject._pendulums[i].a;
			saveString+="&d"+i+"="+thisObject._pendulums[i].d;
			saveString+="&p"+i+"="+thisObject._pendulums[i].p;
			saveString+="&f"+i+"="+thisObject._pendulums[i].f;
			saveString+="&pl"+i+"="+(thisObject._pendulums[i].plane ? 1 : 0);
			
		}
		if(thisObject._url.indexOf("?")==-1){
			
		}
		
		thisObject._linkDiv.innerHTML="<a href='"+(thisObject._url+"")+""+(thisObject._page+"")+""+( thisObject._page.indexOf("?")==-1 ? "?" : "&" )+"ps="+(thisObject._pendulums.length)+saveString+"'>Link to this spiral</a>";
		thisObject._div.innerHTML="";
		thisObject._pendulumForms=new Array();
		
		
		for (q = 0; q < thisObject._pendulums.length; q++) {
		
		
			thisObject._pendulumForms.push (document.createElement("form"));
			thisObject._div.appendChild(thisObject._pendulumForms[q]);
			
			//add html to thisObject form
			var html = "<ul>";
			//argh hacky hacky can't remember/thing of a better way  onclick='harmonograph.removePendulum("+q+");'
			html += "<li>Pendulum " + (q + 1) + ": <input type='button' value='remove' name='remove' \></li>";
			html += "<li><label><input type='radio' value='xPlane' name='plane' " + (thisObject._pendulums[q].plane ? " checked='checked'" : "") + "/> x-plane</label><label><input type='radio' value='yPlane' name='plane'" + (!thisObject._pendulums[q].plane ? " checked='checked'" : "") + "/> y-plane</label></li>";
			html += "<li>Amplitude: <input type='range' min='"+thisObject._ampLimit[0]+"' max='"+thisObject._ampLimit[1]+"' step='"+thisObject._ampLimit[2]+"' value='" + (thisObject._pendulums[q].a) + "' name='amp'><input type='text' name='ampValue' value='" + (thisObject._pendulums[q].a) + "'\></li>";
			html += "<li>Frequency: <input type='range' min='"+thisObject._freqLimit[0]+"' max='"+thisObject._freqLimit[1]+"' step='"+thisObject._freqLimit[2]+"' value='" + (thisObject._pendulums[q].f) + "' name='freq'><input type='text' name='freqValue' value='" + (thisObject._pendulums[q].f) + "'\></li>";
			html += "<li>Damping: <input type='range' min='"+thisObject._dampLimit[0]+"' max='"+thisObject._dampLimit[1]+"' step='"+thisObject._dampLimit[2]+"' value='" + (thisObject._pendulums[q].d) + "' name='damp'><input type='text' name='dampValue' value='" + (thisObject._pendulums[q].d) + "' \></li>";
			html += "<li>Phase: <input type='range' min='"+thisObject._phaseLimit[0]+"' max='"+thisObject._phaseLimit[1]+"' step='"+thisObject._phaseLimit[2]+"' value='" + (thisObject._pendulums[q].p) + "' name='phase'><input type='text' name='phaseValue' value='" + (thisObject._pendulums[q].p) + "' \>&pi;</li>";
			
			html += "</ul>";
			thisObject._pendulumForms[q].innerHTML = html;
			
			
			thisObject._pendulumForms[q].remove.onclick=thisObject._removePendulumFunc(q);
			
			//thisObject._pendulumForms[q].amp.onchange=thisObject._updateWith(thisObject._pendulumForms[q].ampValue,thisObject._pendulumForms[q].amp);
			//thisObject._pendulumForms[q].amp.onchange=thisObject._updateWith(thisObject._pendulumForms[q].amp,thisObject._pendulumForms[q].amp);
			thisObject._copyEachOther(thisObject._pendulumForms[q].amp,thisObject._pendulumForms[q].ampValue);
			thisObject._copyEachOther(thisObject._pendulumForms[q].freq,thisObject._pendulumForms[q].freqValue);
			thisObject._copyEachOther(thisObject._pendulumForms[q].damp,thisObject._pendulumForms[q].dampValue);
			thisObject._copyEachOther(thisObject._pendulumForms[q].phase,thisObject._pendulumForms[q].phaseValue);
			
		}
		
	}
	
	this.updateFromForm=function(){
		for (var i = 0; i < this._pendulums.length; i++) {
			this._pendulums[i].plane=this._pendulumForms[i].plane[0].checked;
			this._pendulums[i].a=formSanityFloat(this._pendulumForms[i].ampValue);
			this._pendulums[i].f=formSanityFloat(this._pendulumForms[i].freqValue);
			this._pendulums[i].d=formSanityFloat(this._pendulumForms[i].dampValue);
			this._pendulums[i].p=formSanityFloat(this._pendulumForms[i].phaseValue);
		}
	}
	
	//check to see if all oscilations haven't damped yet
	this._stillOscilating=function(t){
		
		if(t>this._timeLimit){
			//stop infinite loops
			return false;
		}
		
		var stillOscilating=false;
		for(var i=0;i<this._pendulums.length;i++){
			if(this._pendulums[i].d==0 && !stillOscilating){
				stillOscilating=true;
				//no damping
			}else{
				if(Math.pow(Math.E,-this._pendulums[i].d*t)*this._pendulums[i].a > this._amplitudeCutOff && !stillOscilating){
					stillOscilating=true;
				}
			}
			
		}
		return stillOscilating;
	}
	
	this.draw=function(){
		this._cancelDrawSlow();
		this.buildDiv();
		this._canvas.clearRect(0,0,this._canvasSize[0],this._canvasSize[1]);
		this._canvas.beginPath();
		
		var centreX=this._canvasSize[0]/2
		var centreY=this._canvasSize[1]/2
		var t=0;
		while(this._stillOscilating(t)){
			
			var x=centreX;
			var y=centreY;
			
			for(var i=0;i<this._pendulums.length;i++){
				if(this._pendulums[i].plane){
					x+=this._pendulums[i].path(t);
				}else{
					y+=this._pendulums[i].path(t);
				}
			}
			
			
			
			if(t==0){
				this._canvas.moveTo(x,y);
			}else{
				this._canvas.lineTo(x,y);
			}
			
			t+=this._timeStep;
			
			if(this._IE && t%2<this._timeStep/2){
				this._canvas.stroke();
				this._canvas.beginPath();
				this._canvas.moveTo(x,y);
				//t-=this._timeStep;
			}
		}
		this._canvas.stroke();
	}
	
	this._cancelDrawSlow=function(){
		if(this._drawingSlow!==false){
			clearTimeout(this._drawingSlow);
			this._drawingSlow=false;
		}
	}
	
	this.drawSlow=function(){
		
		this._cancelDrawSlow();
		
		this._canvas.clearRect(0,0,this._canvasSize[0],this._canvasSize[1]);
		
		
		
		this._centreX=this._canvasSize[0]/2
		this._centreY=this._canvasSize[1]/2
		this._t=0;
		this._drawSlowPart();
	}
	
	this._drawSlowPart=function(){
		
		thisObject._canvas.beginPath();
		
		for (var j = 0; j < thisObject._drawAtOnce; j += thisObject._timeStep) {
			var x = thisObject._centreX;
			var y = thisObject._centreY;
			
			for (var i = 0; i < thisObject._pendulums.length; i++) {
				if (thisObject._pendulums[i].plane) {
					x += thisObject._pendulums[i].path(thisObject._t);
				}
				else {
					y += thisObject._pendulums[i].path(thisObject._t);
				}
			}
			
			if (j == 0) {
				thisObject._canvas.moveTo(x, y);
			}
			else {
				thisObject._canvas.lineTo(x, y);
			}
			
			thisObject._t += thisObject._timeStep;
		}
		
		//don't leave gaps in the spiral
		thisObject._t -= thisObject._timeStep;
		thisObject._canvas.stroke();
		
		if(thisObject._stillOscilating(thisObject._t)){
			thisObject._drawingSlow=setTimeout(thisObject._drawSlowPart,thisObject._drawSpeed);
		}
	}
	
	this.load=function(){
		if(getVar("ps")!=""){
			//something to load from url
			
			var ps=parseFloat(getVar("ps"));
			
			for(var i=0;i<ps;i++){
				this._pendulums.push(new PendulumClass(parseFloat(getVar("a"+i)) , parseFloat(getVar("f"+i)) , parseFloat(getVar("p"+i)) , parseFloat(getVar("d"+i)) , parseFloat(getVar("pl"+i))==1))
			}
		}else{
			this.addPendulum();
			this.addPendulum();

		}
		
		this.buildDiv();
		
		if (this._IE) {
			this.draw();
			
		}
		else {
			this.drawSlow();
		}
	}
	
}

var PendulumClass=function(amplitude,frequency,phase,decay,plane){
	
	//if(decay < 0.001){ decay = 0.001;}
	this.a=amplitude;
	this.f=frequency;
	this.p=phase;
	this.d=decay;
	//true=x, false=y;
	this.plane=plane;
	
	this.path=function(t){
		return this.a*(Math.cos(this.f*t + this.p*Math.PI)*Math.pow(Math.E,-this.d*t));
	}
}
