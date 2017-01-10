// Rendering component of 2D engine
// Requires shapes, physics and general components.

var RenderClass = function(symbolSize){
	var thisObject = this;
	this._viewports = new Array();
	
	this._symbolSize=symbolSize;
	
	//this._drawSprings=true;
	
	this.Viewport = function(canvas, x, y, width, height, zoom, sync, enabled, drawCharge, drawPins){
		//either main span, or canvas
		this.canvas = canvas;
		//co-ords of top left
		//this._pos = [x - width / 2, y - height / 2];
		//coords of centre
		this.pos=[x,y];
		//size of viewport
		this.width = width;
		this.halfWidth=width/2;
		this.height = height;
		this.halfHeight=height/2;
		this.drawCharge=typeof drawCharge == "undefined" ? false : drawCharge;
		this.drawPins=typeof drawPins == "undefined" ? false : drawPins;
		//zoom: 'virtual' pixels (measuring unit) *zoom = screen pixels
		this.zoom = zoom;
		//sync - how often to update (in terms of physics advances eg 2 means only updated every other physics update)
		this.sync = sync;
		//running or not
		this.enabled = enabled;
		
		this.clear = function(){
			this.canvas.clearRect(0, 0, width, height);
		}
		
		//add to array of viewports
		thisObject._viewports.push(this);
	}
	
	//for converting hex colour string to whatever is needed
	//either: RRGGBB (in hex) or RRGGBBA (where A is alpha, from 0 to 9)
	this.colourToRGB = function(colour){
		if(colour.length>6)//contains alpha at end
			return "rgba(" + parseInt(colour.substring(0, 2), 16) + "," + parseInt(colour.substring(2, 4), 16) + "," + parseInt(colour.substring(4, 6), 16) + " , "+parseInt(colour.substring(6, 7))/10+")";
		return "rgb(" + parseInt(colour.substring(0, 2), 16) + "," + parseInt(colour.substring(2, 4), 16) + "," + parseInt(colour.substring(4, 6), 16) + ")";
	}
	
	this.colourToRGBArray = function(colour){
		return [parseInt(colour.substring(0, 2), 16), parseInt(colour.substring(2, 4), 16), parseInt(colour.substring(4, 6), 16)];
	}
	
	this.colourToBright = function(colour){
		return this._colourChangeBy(colour, 128);
	}
	
	this.colourToDark = function(colour){
		return this._colourChangeBy(colour, -128);
	}
	
	//takes the hex-code string and changes its brightness by changeBy
	this._colourChangeBy = function(colour, changeBy){
		var newColour = "";
		for (var i = 0; i < 3; i++) 
		{
			var tempColour = putInRange(parseInt(colour.substring(i * 2, i * 2 + 2), 16) + changeBy, 0, 255).toString(16);
			newColour += tempColour.length == 1 ? "0" + tempColour : tempColour;
		}
		return newColour;
	}
	
	this._drawcounter = 0;
	
	this.drawViewport = function(view, shapes, springs){
		
		if(typeof springs =="undefined")
				springs=new Array();
		
		if (thisObject._drawcounter % view.sync == 0 && view.enabled) 
		{
			
			//clear old scene
			view.clear();
			
			var fillColours = new Array();
			var strokeColours = new Array();
			
			var fills = new Array();
			var strokes = new Array();
			
			//build up arrays of functions in fills and strokes arrays, so all shapes of one colours can be drawn at once
			for (var i = 0; i < shapes.length; i++) 
			{
				var shape = shapes[i];

				switch (shape.shape)
				{
					case 0:
						//circle
						var drawFunc = thisObject.drawCircle(shape, view);
						break;
					case 1:
					case 2:
						//rectangle
						var drawFunc = thisObject.drawRectangle(shape, view);
						break;
					case 3:
						//poly
						var drawFunc = thisObject.drawPoly(shape, view);
						break;
					case 4:
						//rod
						var drawFunc = thisObject.drawRod(shape, view);
						break;
				}
				
				if (shape.hollow) 
				{
					var where = whereInArray(shape.colour, strokeColours)
					if (where == -1) 
					{
						strokeColours.push(shape.colour);
						where = strokes.length;
						strokes.push(new Array());
					}
					strokes[where].push(drawFunc);
				}
				else 
				{
					//not hollow
					var where = whereInArray(shape.colour, fillColours)
					if (where == -1) 
					{
						fillColours.push(shape.colour);
						where = fills.length;
						fills.push(new Array());
					}
					fills[where].push(drawFunc);
				}
				
				if(view.drawCharge && shape.charge != 0){
					switch(shape.charge<0)
					{
						case true:
							var colour="FF00005";
							break;
						default:
							var colour="0000FF5";
							break;
					}
					
					var where = whereInArray(colour, strokeColours)
					if (where == -1) 
					{
						strokeColours.push(colour);
						where = strokes.length;
						strokes.push(new Array());
					}
					strokes[where].push(thisObject.drawCharge(shape,view));
				}
				
				if(view.drawPins && shape.pinned()){
					
					var where = whereInArray("0000005", strokeColours)
					if (where == -1) 
					{
						strokeColours.push("0000005");
						where = strokes.length;
						strokes.push(new Array());
					}
					strokes[where].push(thisObject.drawPin(shape,view));
				}
				
			}
			
			for(var i=0;i<springs.length;i++)
			{
				//var spring=springs[i];
				
				var drawFunc = thisObject.drawSpring(springs[i],view);
				
				var where = whereInArray("000000", strokeColours)
					if (where == -1) 
					{
						strokeColours.push("000000");
						where = strokes.length;
						strokes.push(new Array());
					}
					strokes[where].push(drawFunc);
					
					//alert(strokes[where].toSource())
			}
			
			
			for (var f = 0; f < fills.length; f++) 
			{
				view.canvas.beginPath()
				view.canvas.fillStyle = this.colourToRGB(fillColours[f]);
				
				for (var f2 = 0; f2 < fills[f].length; f2++) 
				{
					fills[f][f2]();
				}
				view.canvas.fill();
			}
			for (var s = 0; s < strokes.length; s++) 
			{
				view.canvas.beginPath()
				view.canvas.strokeStyle = this.colourToRGB(strokeColours[s]);
				for (var s2 = 0; s2 < strokes[s].length; s2++) 
				{
					strokes[s][s2]();
				}
				view.canvas.stroke();
			}
			
		}
		
		this._drawcounter++;
	}
	
	this.drawSpring=function(spring,view)
	{
		var pointA=[spring.shapeA.pos[0] + spring.distA*Math.cos(spring.angleA+spring.shapeA.pos[2]) , spring.shapeA.pos[1] + spring.distA*Math.sin(spring.angleA+spring.shapeA.pos[2])];
		
		var pointB=[spring.shapeB.pos[0] + spring.distB*Math.cos(spring.angleB+spring.shapeB.pos[2]) , spring.shapeB.pos[1] + spring.distB*Math.sin(spring.angleB+spring.shapeB.pos[2])];
		
		return function()
		{
			view.canvas.moveTo((pointA[0]-view.pos[0])*view.zoom+view.halfWidth , (pointA[1]-view.pos[1])*view.zoom+view.halfHeight);
			view.canvas.lineTo((pointB[0]-view.pos[0])*view.zoom+view.halfWidth , (pointB[1]-view.pos[1])*view.zoom+view.halfHeight);
		}
	}
	
	this.drawCharge=function(shape, view){
		var tempX = shape.pos[0];
		var tempY = shape.pos[1];
		var size= thisObject._symbolSize / view.zoom;
		if(shape.charge<0){
			//draw -
			var func = function() {
				view.canvas.moveTo((tempX - size-view.pos[0])*view.zoom+view.halfWidth, (tempY-view.pos[1])*view.zoom+view.halfHeight);
				view.canvas.lineTo((tempX + size-view.pos[0])*view.zoom+view.halfWidth, (tempY-view.pos[1])*view.zoom+view.halfHeight);
			}
		}
		else{
			var func =function(){
				view.canvas.moveTo((tempX - size-view.pos[0])*view.zoom+view.halfWidth, (tempY-view.pos[1])*view.zoom+view.halfHeight);
				view.canvas.lineTo((tempX + size-view.pos[0])*view.zoom+view.halfWidth, (tempY-view.pos[1])*view.zoom+view.halfHeight);
				view.canvas.moveTo((tempX-view.pos[0])*view.zoom+view.halfWidth, (tempY - size-view.pos[1])*view.zoom+view.halfHeight);
				view.canvas.lineTo((tempX-view.pos[0])*view.zoom+view.halfWidth, (tempY + size-view.pos[1])*view.zoom+view.halfHeight);
			}
		}
		return func;
	}
	
	this.drawPin=function(shape, view){
		var tempX = shape.pos[0]+Math.cos(shape.pin[1])*shape.pin[0];
		var tempY = shape.pos[1]+Math.sin(shape.pin[1])*shape.pin[0];
		var size= thisObject._symbolSize/ view.zoom;
		var tempR = Math.sqrt( Math.pow(thisObject._symbolSize,2)/2 );
		
		var func =function(){
			view.canvas.moveTo((tempX - size/2-view.pos[0])*view.zoom+view.halfWidth, (tempY + size/2-view.pos[1])*view.zoom+view.halfHeight);
			view.canvas.lineTo((tempX + size/2-view.pos[0])*view.zoom+view.halfWidth, (tempY - size/2-view.pos[1])*view.zoom+view.halfHeight);
			view.canvas.moveTo((tempX - size/2-view.pos[0])*view.zoom+view.halfWidth, (tempY - size/2-view.pos[1])*view.zoom+view.halfHeight);
			view.canvas.lineTo((tempX + size/2-view.pos[0])*view.zoom+view.halfWidth, (tempY + size/2-view.pos[1])*view.zoom+view.halfHeight);
			view.canvas.moveTo((tempX -view.pos[0])*view.zoom+view.halfWidth+ tempR, (tempY-view.pos[1])*view.zoom+view.halfHeight)
			view.canvas.arc((tempX-view.pos[0])*view.zoom+view.halfWidth, (tempY-view.pos[1])*view.zoom+view.halfHeight , tempR, 0, Math.PI*2, true);
		}
		return func;
	}
	
	this.drawCircle = function(shape, view){
		var tempX = shape.pos[0];
		var tempY = shape.pos[1];
		var tempR = shape.d;
		var tempA = shape.pos[2];
		
		while(tempA > Math.PI*2)
		{
			tempA-=Math.PI*2;
		}
		while(tempA < 0)
		{
			tempA+=Math.PI*2;
		}
		return function(){
			// + tempR
			view.canvas.moveTo((tempX - view.pos[0]) * view.zoom +view.halfWidth, (tempY - view.pos[1]) * view.zoom+view.halfHeight);
			view.canvas.lineTo((tempX - view.pos[0] + Math.cos(tempA)*tempR) * view.zoom+view.halfWidth, (tempY - view.pos[1] + Math.sin(tempA)*tempR) * view.zoom+view.halfHeight);
			view.canvas.moveTo((tempX - view.pos[0] + tempR) * view.zoom+view.halfWidth, (tempY - view.pos[1]) * view.zoom+view.halfHeight);
			view.canvas.arc((tempX - view.pos[0]) * view.zoom+view.halfWidth, (tempY - view.pos[1]) * view.zoom+view.halfHeight, tempR * view.zoom, 0, Math.PI * 2, true); // draw circle
		}
	}
	
	this.drawRectangle = function(shape, view){
		var tempX = shape.pos[0];
		var tempY = shape.pos[1];
		var tempWidth = shape.d[0];
		var tempHeight = shape.d[1];
		return function(){
			//top left
			view.canvas.moveTo((tempX - tempWidth / 2 - view.pos[0]) * view.zoom +view.halfWidth, (tempY - tempHeight / 2 - view.pos[1]) * view.zoom+view.halfHeight);
			//top right
			view.canvas.lineTo((tempX + tempWidth / 2 - view.pos[0]) * view.zoom+view.halfWidth, (tempY - tempHeight / 2 - view.pos[1]) * view.zoom+view.halfHeight);
			//bottom right
			view.canvas.lineTo((tempX + tempWidth / 2 - view.pos[0]) * view.zoom+view.halfWidth, (tempY + tempHeight / 2 - view.pos[1]) * view.zoom+view.halfHeight);
			//bottom left
			view.canvas.lineTo((tempX - tempWidth / 2 - view.pos[0]) * view.zoom+view.halfWidth, (tempY + tempHeight / 2 - view.pos[1]) * view.zoom+view.halfHeight);
			//top left
			view.canvas.lineTo((tempX - tempWidth / 2 - view.pos[0]) * view.zoom+view.halfWidth, (tempY - tempHeight / 2 - view.pos[1]) * view.zoom+view.halfHeight);
		}
	}
	
	this.drawRod = function(shape, view){
		var tempX1 = shape.pos[0] + Math.cos(shape.pos[2])*shape.d;
		var tempY1 = shape.pos[1] + Math.sin(shape.pos[2])*shape.d;
		var tempX2 = shape.pos[0] + Math.cos(shape.pos[2]+Math.PI)*shape.d;
		var tempY2 = shape.pos[1] + Math.sin(shape.pos[2]+Math.PI)*shape.d;
		
		
		return function(){
			view.canvas.moveTo((tempX1 - view.pos[0]) * view.zoom+view.halfWidth, (tempY1 - view.pos[1]) * view.zoom+view.halfHeight);
			view.canvas.lineTo((tempX2 - view.pos[0]) * view.zoom+view.halfWidth, (tempY2 - view.pos[1]) * view.zoom+view.halfHeight);
		}
	}
	
	this.drawPoly = function(shape,view){
		
		var temppos = shape.pos.slice(0);
		var tempRs = shape.d.modulii.slice(0);
		var tempangle = shape.pos[2]
		var tempAs = shape.d.angles.slice(0)
		return function(){

			view.canvas.moveTo((temppos[0] + tempRs[0] * Math.cos(tempangle + tempAs[0]) - view.pos[0]) * view.zoom+view.halfWidth, (temppos[1] + tempRs[0] * Math.sin(tempangle + tempAs[0]) - view.pos[1]) * view.zoom+view.halfHeight);

			for (var z = 1; z <= tempRs.length; z++) 
			{
				if (z == tempRs.length) 
				{
					var z1 = 0;
				}
				else 
				{
					var z1 = z;
				}
				view.canvas.lineTo((temppos[0] + tempRs[z1] * Math.cos(tempangle + tempAs[z1]) - view.pos[0]) * view.zoom+view.halfWidth, (temppos[1] + tempRs[z1] * Math.sin(tempangle + tempAs[z1]) - view.pos[1]) * view.zoom+view.halfHeight);
			}
		}
	}
	
	//draws a dotted line for each spring
	this.updateLine = function(vp){
		if (this.alive) 
		{
			switch (parseFloat(this.graphics))
			{
				case 1:
				case 2:
					var startx = wholeworld[this.from].x;
					var starty = wholeworld[this.from].y;
					var finishx = wholeworld[this.to].x;
					var finishy = wholeworld[this.to].y;
					
					viewports[vp].canvas.moveTo((startx - viewports[vp].x) * viewports[vp].zoom+view.halfWidth, (starty - viewports[vp].y) * viewports[vp].zoom+view.halfHeight);
					viewports[vp].canvas.lineTo((finishx - viewports[vp].x) * viewports[vp].zoom+view.halfWidth, (finishy - viewports[vp].y) * viewports[vp].zoom+view.halfHeight);
					break;
			}
		}
	}
	
}
