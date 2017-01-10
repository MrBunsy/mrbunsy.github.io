/**
 * @author Luke
 */
var SandboxClass=function(controlsDiv,canvasTag,canvas,canvasSize,worldSize,gravity,friction,fps,miniMapCanvasTag,miniMapCanvas,miniMapSize,url,link,linkText)
{
	var thisObject=this;
	
	
	
	
	this._ajax=new AjaxClass();
	//url is up to and including the last slash, eg: "lukewallin.co.uk/scribble/"
	this._url=url;
	this._link=link;
	this._linkText=linkText;
	
	
	
	this._IE = (typeof(IE) != "undefined" && IE);
	
	this._controlsDiv=controlsDiv
	
	
	
	this._defaultGravity=gravity;
	this._defaultFriction=friction;
	//size of simulated world in virtual pixels
	this._worldSize=worldSize;
	//size of main viewport in real pixels
	this._canvasSize=canvasSize;
	this._canvas=canvas;
	this._canvasTag=canvasTag;
	this._miniMapCanvasTag=miniMapCanvasTag;
	
	this._gui=new EngineGUIClass(this._canvasTag, this._canvasSize, this._controlsDiv);
	
	this._fps=fps;
	
	this._period=1/fps;
	this._period_ms=this._period*1000;
	
	this._physicsLoopRef=false;
	this._toolLoopRef=false;
	
	this._mousePos=[0,0];
	this._oldMousePos=[0,0];
	this._mouseRadius=5;
	this._addShapeRadius=25;
	this._addShapeCentre=[0,0];
	this._addShapeHollow=false;
	this._addShapeColour="008800";
	this._addShapeSides=4;
	this._addShapeMass=50;
	this._addShapeElasticity=1;
	this._addShapePhysicsPaused=false;
	this._addShape=false;
	this._addShapePoints=new Array();
	this._addShapeCanMove=true;
	//smallest angle to allow for drawing a custom polygon
	this._addShapeAngleAccuracy=Math.PI/4;
	
	this._implodeTime=0.5;
	this._explodeTime=2;
	this._implodeRadius=200;
	this._explodeRadius=500;
	this._implodeStrength=1000;
	this._explodeStrength=10000;
	
	this._addChargeSign=1;
	this._addChargeSize=1;
	
	this._stringStrength=10000;
	this._stringLength=50;
	this._stringWeight=5;
	this._connectAngle1=0;
	this._connectShape1=false;
	this._connectPos1=[0,0];
	
	
	
	this._lastToolChosen;
	
	//is the world limited to the borders of the main viewport?
	this._smallWorld=false;
	
	this._dragShapeWithSpring=true;
	this._dragShapeSpring=false;
	this._dragShape=false;
	this._dragShapeToMouse
	this._dragShapeSpringStrength=10000;
	
	if(miniMapCanvas!==false)
	{
		this._miniMapCanvas=miniMapCanvas;
		this._miniMapSize=miniMapSize;
	}
	
	this._physics=new PhysicsClass(this._defaultGravity, this._defaultFriction);
	this._render=new RenderClass(20);
	
	this._mainView=new this._render.Viewport(this._canvas,0,this._worldSize[1]/2-this._canvasSize[1]/2,this._canvasSize[0],this._canvasSize[1],1,1,true,true,true);
	
	this._miniMapView=new this._render.Viewport(this._miniMapCanvas,0,0,this._miniMapSize[0],this._miniMapSize[1],this._miniMapSize[0]/this._worldSize[0],1,true);
	
	//add border
	this._border=this._physics.addHollowRectangle(this._worldSize[0], this._worldSize[1], [0,0], 1, false, "000000", 'border');
	
	//used for anchoring things like pin springs, because the border can move when a small world is introduced
	this._anchor=this._physics.addCircle(1, [0,0], 0, [0,0,0], 10, [0,0,0], false, 1, false, false, false, "000000", "anchor");
	//var circle=this._physics.addCircle(50, [0,0], 0, [0,0,0], 50, [0,0,0], true, 1, true, true, true, "FF0000", false);
	
	this._toolChosen="moveViewOrShape";
	
	
	
	
	
	this._buildMessageWindows=function(){
		
		this._nothingToSaveMessage = thisObject._gui.newMessageWindow("You haven't created anything to save yet.",0.5);
		
		this._saveMessage=new thisObject._gui.MessageWindow("",0.5);
		
		this._saveMessage.form.innerHTML="<h3>Copy this URL to show your level to others:</h3><input type='text' size=50 name='saveURL' /><br><br><br>Or copy this text to save your level offline:<br><textarea name='saveTextArea' cols=45 rows=4></textarea>";
		
		this._saveMessage.form.saveURL.onclick=function(){
			thisObject._saveMessage.form.saveURL.focus();
			thisObject._saveMessage.form.saveURL.select();
		}
		
		this._saveMessage.form.saveTextArea.onclick=function(){
			thisObject._saveMessage.form.saveTextArea.focus();
			thisObject._saveMessage.form.saveTextArea.select();
		}
		
		//this._saveMessage.form.saveTextArea.style.display="none";
		
		this._loadMessage=thisObject._gui.newMessageWindow("",0.5);
		this._loadMessage.form.innerHTML="Paste saved text here to load your level:<br><textarea name='loadTextArea' cols=45 rows=8></textarea><input type='button' name='loadMessageButton' value='Load' />";
		
		this._loadMessage.form.loadMessageButton.onclick=function(){
			
			thisObject.loadJSON(thisObject._loadMessage.form.loadTextArea.value)
			thisObject._loadMessage.close();
		}
		
		this._springMessage=thisObject._gui.newMessageWindow("<h3>Spring Options</h3>",0.5);
		var html= "<ul>";
		
		html+="<li><label><input type='text' name='strength' value='"+this._stringStrength+"'/> Spring Strength</label></li>";
		html+="<li><label><input type='text' name='length' value='0'/> Spring Length (0 for auto)</label></li>";
		html+="<li><label> <input type='checkbox' name='visible' checked /> Visible</label></li>";
		html+="<li><label> <input type='checkbox' name='centre' /> Always Connect to Centre</label></li>";
		html+="</ul>";
		this._springMessage.form.innerHTML=html;
		
		this._explosionMessage=thisObject._gui.newMessageWindow("<h3>Explosion Options</h3>",0.5);
		
		html="<ul>";
		html+="<li><label><input type='checkbox' value='animation' name='animation' /> Animation</label></li>";
		html+="<li><label><input type='text' value='"+this._implodeTime+"' name='implodeTime' /> Implosion Time/s</label></li>";
		html+="<li><label><input type='text' value='"+this._implodeStrength+"' name='implodeStrength' /> Implosion Strength</label></li>";
		html+="<li><label><input type='text' value='"+this._implodeRadius+"' name='implodeRadius' /> Implosion Radius</label></li>";
		html+="<li><label><input type='text' value='"+this._explodeTime+"' name='explodeTime' /> Explosion Time/s</label></li>";
		html+="<li><label><input type='text' value='"+this._explodeStrength+"' name='explodeStrength' /> Explosion Strength</label></li>";
		html+="<li><label><input type='text' value='"+this._explodeRadius+"' name='explodeRadius' /> Explosion Radius</label></li>";
		html+="</ul>";
		
		this._explosionMessage.form.innerHTML=html;
		
		this._newShapeMessage=thisObject._gui.newMessageWindow("<h3>New Shape Options</h3>",0.5);
		
		html="<ul>";
		html+="<li><label><select name='colour' style='background:#008800;' /><option value='000000' style='background:#000000;color:#FFFFFF;'>Black</option><option value='FFFFFF' style='color:#000000;background:#FFFFFF'>White</option><option value='FF0000' style='background:#FF0000'>Red</option><option value='FF6600' style='background:#FF6600'>Orange</option><option value='FFFF00' style='background:#FFFF00'>Yellow</option><option value='00FF00' style='background:#00FF00'>Lime</option><option value='008800' style='background:#008800' selected='selected'>Green</option><option value='0000FF' style='background:#0000FF'>Blue</option><option value='6600FF' style='background:#6600FF'>Purple</option></select></label></li>";
		html+="<li><label><input type='checkbox' value='hollow' name='hollow' /> Hollow</label></li>";
		html+="<li><label><input type='text' value='50' name='mass' /> kg</label></li>";
		html+="<li><label><input type='text' value='1' name='e' /> Coefficient of Restitution (between 0 and 1)</label></li>";
		html+="</ul>";
		
		this._newShapeMessage.form.innerHTML=html;
		
		this._newShapeMessage.form.e.onchange=function(){
			var e=parseFloat(thisObject._newShapeMessage.form.e.value);
			if(!isNaN(e) && e>=0 && e<=1)
			thisObject._addShapeElasticity=e;
		}
		
		this._newShapeMessage.form.mass.onchange=function()
		{
			thisObject._addShapeMass=parseFloat(thisObject._newShapeMessage.form.mass.value);
			if (isNaN(thisObject._addShapeMass)) {
				thisObject._addShapeMass = 50;
			}
		}
		
		this._newShapeMessage.form.hollow.onchange=function()
		{
			thisObject._addShapeHollow=thisObject._newShapeMessage.form.hollow.checked;
		}
		
		this._newShapeMessage.form.colour.onchange=function()
		{
			thisObject._newShapeMessage.form.colour.style.background="#"+thisObject._newShapeMessage.form.colour.value;
			thisObject._addShapeColour=thisObject._newShapeMessage.form.colour.value;
		}
		
		this._worldOptionsMessage=thisObject._gui.newMessageWindow("<h3>World Options</h3>",0.5);
		
		html="<ul>";
		html+="<li><input type='text' name='gravityY' value='"+this._defaultGravity[1]+"'> Gravity</li>";
		html+="<li><input type='text' name='friction' value='"+this._defaultFriction+"'> Friction</li>";
		html+="<li><input type='button' name='update' value='Update' /> <input type='button' name='cancel' value='Cancel' /></li>";
		html+="</ul>";
		
		this._worldOptionsMessage.form.innerHTML=html;
		
		this._worldOptionsMessage.form.update.onclick=function(){
			
			var gravY=parseFloat(thisObject._worldOptionsMessage.form.gravityY.value);
			if(isNaN(gravY)){
				gravY=thisObject._defaultGravity[1];
			}
			
			var fric=parseFloat(thisObject._worldOptionsMessage.form.friction.value);
			if(isNaN(fric)){
				fric=thisObject._defaultFriction
			}
			
			thisObject._physics._gravity[1]=gravY;
			thisObject._physics._friction=fric;
			thisObject._worldOptionsMessage.close();
		}
		
		this._worldOptionsMessage.form.cancel.onclick=function(){
			
			thisObject._worldOptionsMessage.close();
		}
		
		//get rid of default 'close window' message
		this._worldOptionsMessage.messageDivForm.innerHTML="";
	}
	
	this.loadJSON=function(loadJSONtext){
		if(loadJSONtext.length == 0)
			return;
			
		var loadObject=JSON.parse(loadJSONtext);
		
			thisObject._physics.load(loadObject);
			
			thisObject._border=thisObject._physics._shapesArray[0];
			thisObject._anchor=thisObject._physics._shapesArray[1];
			thisObject._changeWorldSize(loadObject.smallWorld);
			
			thisObject._worldOptionsMessage.form.friction.value=loadObject.friction;
			thisObject._worldOptionsMessage.form.gravityY.value=loadObject.gravity[1];
			
			thisObject._mainView.pos=loadObject.mainViewPos;
			thisObject._mainView.zoom=loadObject.mainViewZoom;
			
			if(thisObject._physicsLoopRef===false)
			{
				thisObject._drawViewports();
			}
	}
	
	
	//checks arbitarty shape against existing shapes
	this._checkCollide=function(pos,d,hollow,shape,ignoreArray){
		if(typeof(ignoreArray)=="undefined")
			ignoreArray=new Array();
		for (var i = 0; i < thisObject._physics._hardArray.length; i++) 
		{
			var otherShape = thisObject._physics._hardArray[i];
			
			if (inArray(otherShape,ignoreArray))
			{
				//ignore border
				continue;
			}

			
			var collide = thisObject._physics._detect.checkForCollision(pos, d, hollow, pos[2], shape, otherShape.pos, otherShape.d, otherShape.hollow, otherShape.pos[2], otherShape.shape);
			
			if (collide.overlap) 
			{
				return {
					"collision": true,
					"otherShape": otherShape
				};
			}
		}
		return {
			"collision": false
		};
	}
	
	this._checkCollideCircle = function(pos,radius,ignoreArray){
		return thisObject._checkCollide(pos,radius,false,0,ignoreArray);
	}
	
	this._checkCollidePoly = function(pos,angle,d,ignoreArray){
		return thisObject._checkCollide([pos[0],pos[1],angle],d,false,3,ignoreArray);
	}
	
	//choose tool from the radio buttons
	this.setTool=function()
	{
		//search through radio buttons to find the one which is selected, and set toolChosen to that
		for(var i=0;i<thisObject._settingsForm.toolChoose.length;i++)
		{
			if(thisObject._settingsForm.toolChoose[i].checked)
			{
				thisObject._toolChosen=thisObject._settingsForm.toolChoose[i].value;
				break;
			}
		}
	}
	
	this._divPosToSimulation=function(divPos)
	{
		return [(divPos[0]-thisObject._mainView.halfWidth)/thisObject._mainView.zoom +thisObject._mainView.pos[0],(divPos[1]-thisObject._mainView.halfHeight)/thisObject._mainView.zoom +thisObject._mainView.pos[1]];
	}
	
	this._changeWorldSize=function(smallWorld)
	{
		thisObject._smallWorld=smallWorld;
		thisObject._settingsForm.smallWorld.checked=smallWorld;
		if(thisObject._smallWorld)
		{
			//shrink border
			thisObject._border.d=thisObject._canvasSize.slice(0);
			thisObject._border.pos=[0,thisObject._worldSize[1]/2-thisObject._canvasSize[1]/2,0];
			//thisObject._mainView.pos=[0,thisObject._worldSize[1]/2-thisObject._canvasSize[1]/2];
			//thisObject._mainView.zoom=1;
			thisObject._resetCamera();
			
			thisObject._miniMapView.enabled=false;
			thisObject._miniMapCanvasTag.style.display="none";
			thisObject._settingsForm.zoomOut.disabled="disabled";
			thisObject._settingsForm.zoomIn.disabled="disabled";
		}
		else
		{
			thisObject._settingsForm.zoomOut.removeAttribute("disabled");
			thisObject._settingsForm.zoomIn.removeAttribute("disabled");
			
			//enlarge border
			thisObject._border.d=thisObject._worldSize.slice(0);
			thisObject._border.pos=[0,0,0];
			thisObject._miniMapView.enabled=true;
			thisObject._miniMapCanvasTag.style.display="block";
		}
		
		if(thisObject._physicsLoopRef===false)
		{
			thisObject._drawViewports();
		}
	}
	
	this._resetCamera=function(){
			thisObject._mainView.pos=[0,thisObject._worldSize[1]/2-thisObject._canvasSize[1]/2];
			thisObject._mainView.zoom=1;
			if(thisObject._physicsLoopRef===false)
			{
				thisObject._drawViewports();
			}
		}
	
	this.saveSuccess=function(returnedAjax){
		var returnedObject=JSON.parse(returnedAjax);
		if (typeof returnedObject.id != "undefined") {
			
			
			thisObject._saveId=parseInt(returnedObject.id);
			
			thisObject._saveMessage.form.saveURL.removeAttribute("disabled");
			thisObject._saveMessage.form.saveURL.value = thisObject._url + "sandbox.php?id=" + parseInt(returnedObject.id);
			thisObject._saveMessage.form.saveURL.focus();
			thisObject._saveMessage.form.saveURL.select();
		}
	}
	
	this.saveFail=function(){
		//thisObject.save();
		//show the old fasioned text save
		this._saveMessage.form.saveTextArea.style.display="block";
	}
	
	this._saveWorld=function(){
			
			/*
			 *  document.getElementById('savetextarea').value=save;
	document.getElementById('savetextarea').focus();
	document.getElementById('savetextarea').select();
	
	<textarea id="savetextarea" cols="55" rows="13"><\/textarea>
			 */
			
			if(thisObject._physics.shapesArray().length ==2){
				//nothing created
				thisObject._nothingToSaveMessage.open();
				return;
			}
			
			thisObject._saveMessage.open();
			var saveObject=thisObject._physics.save();
			//add non-physics info
			saveObject.smallWorld=thisObject._smallWorld;
			saveObject.mainViewPos=thisObject._mainView.pos.slice(0);
			saveObject.mainViewZoom=thisObject._mainView.zoom;
			//prompt("world string",JSON.stringify(saveObject));
			
			var saveObject2=new Object();
			saveObject2.saveObject=saveObject;
			
			thisObject._saveMessage.form.saveTextArea.value=JSON.stringify(saveObject);
			thisObject._saveMessage.form.saveTextArea.focus();
			thisObject._saveMessage.form.saveTextArea.select();
			
			thisObject._ajax.postRequest('sandboxServer.php', 5000, ['json'], [JSON.stringify(saveObject2)], function(){}, thisObject.saveSuccess, thisObject.saveFail)
			
			thisObject._saveMessage.form.saveURL.disabled="disabled";
			thisObject._saveMessage.form.saveURL.value="Saving...";
			
		}
	
	this._buildControlDiv=function()
	{
		this._settingsForm = document.createElement("form");
		this._controlsDiv.appendChild(this._settingsForm);
		
		//add html to this form
		var html = "<ul>";
		html+="<li><h3><a href='"+this._link+"'>"+this._linkText+"</a></h3></li>";
//		html+="<li><input type='button' name='pause' value='Pause' /></li>";
//		html+="<li><input type='button' name='play' value='Play' /></li>";
		html+="<li><input type='button' name='playOrPause' value='Pause' /></li>";
		html+="<li><input type='button' name='saveWorld' value='Save World' /></li>";
		html+="<li><input type='button' name='loadWorld' value='Load World' /></li>";
		html+="<li><input type='button' name='zoomOut' value='-' /> Zoom <input type='button' name='zoomIn' value='+'></li>";
		html+="<li><input type='button' name='resetCamera' value='Reset Camera' /></li>";
		html+="<li><label><input type='checkbox' value='smallWorld' name='smallWorld' /> Small World</label></li>";
		
		html+="<li><input type='button' name='worldOptions' value='World Options' /></li>";
		//html+="<li><label><input type='radio' value='moveView' name='toolChoose' checked='checked'/> Move View</label></li>";
		//html+="<li><label><input type='radio' value='moveShape' name='toolChoose' /> Move Shape</label></li>";
		html+="<li><label><input type='radio' value='moveViewOrShape' name='toolChoose' checked='checked' /> Move Shape or View</label></li>";
		html+="<li>New Shape:</li>";
		html+="<li><label>----<input type='button' value='New Shape Options' name='newShapeOptions' /></label></li>";
		
		//html+="<li><label><select name='addShapeColour' style='background:#008800;' /><option value='000000' style='background:#000000;color:#FFFFFF;'>Black</option><option value='FFFFFF' style='color:#000000;background:#FFFFFF'>White</option><option value='FF0000' style='background:#FF0000'>Red</option><option value='FF6600' style='background:#FF6600'>Orange</option><option value='FFFF00' style='background:#FFFF00'>Yellow</option><option value='00FF00' style='background:#00FF00'>Lime</option><option value='008800' style='background:#008800' selected='selected'>Green</option><option value='0000FF' style='background:#0000FF'>Blue</option><option value='6600FF' style='background:#6600FF'>Purple</option></select></label></li>";
		html+="<li><label><input type='radio' value='addCircle' name='toolChoose' /> Circle</label></li>";
		html+="<li><label><input type='radio' value='addRegularPolygon' name='toolChoose' /> Regular Polygon with </label><label><select name='addShapeSides' /><option value='3'>3</option><option value='4' selected='selected'>4</option><option value='5'>5</option><option value='6'>6</option><option value='7'>7</option><option value='8'>8</option></select> Sides</label></li>";
//		html+="<li></li>";
		html+="<li><label><input type='radio' value='addCustomPolygon' name='toolChoose' /> Draw Shape</label></li>";
		html+="<li><label><input type='radio' value='addCharge' name='toolChoose' /> Add Charge of </label><input type='button' value='+' name='chargeSign'/><input type='text' name='chargeSize' value='1'/></li>";
		html+="<li><label><input type='radio' value='removeCharge' name='toolChoose' /> Remove Charge</label></li>";
		html+="<li><label><input type='radio' value='stringBetween' name='toolChoose' /> Connect With String</label></li>";
		html+="<li><label><input type='radio' value='springBetween' name='toolChoose' /> Connect With a Spring</label></li>";
		html+="<li><label>----<input type='button' value='Spring Options' name='springOptions' /></label></li>";
		html+="<li><label><input type='radio' value='fixOrFree' name='toolChoose' /> Fix/Free</label></li>";
		html+="<li><label><input type='radio' value='pin' name='toolChoose' /> Pin</label></li>";
		html+="<li><label>----<input type='button' value='Explosion Options' name='explosionOptions' /></label></li>";
		html+="<li><label><input type='radio' value='makeExplosion' name='toolChoose' /> Explosion</label></li>";
		html+="<li><label><input type='radio' value='breakSprings' name='toolChoose' /> Break Springs</label></li>";
		html+="<li><label><input type='radio' value='delete' name='toolChoose' /> Delete Shape</label></li>";
		html+="<li><label><input type='button' name='clearWorld' value='Clear World' /></label></li>";
		html+="</ul>";
		this._settingsForm.innerHTML = html;
		
		this._settingsForm.smallWorld.onchange=function()
		{
			//thisObject._smallWorld=thisObject._settingsForm.smallWorld.checked;
			thisObject._changeWorldSize(thisObject._settingsForm.smallWorld.checked);
		}
		
		this._settingsForm.springOptions.onclick=function(){
			thisObject._springMessage.open();
		}
		this._settingsForm.explosionOptions.onclick=function(){
			thisObject._explosionMessage.open();
		}
		
		this._settingsForm.newShapeOptions.onclick=function(){
			thisObject._newShapeMessage.open();
		}
		
		this._settingsForm.worldOptions.onclick=function(){
			thisObject._worldOptionsMessage.open();
		}
		
		this._settingsForm.resetCamera.onclick=this._resetCamera;
		
		this._settingsForm.saveWorld.onclick=this._saveWorld;
		
		this._settingsForm.loadWorld.onclick=function(){
			
			
			thisObject._loadMessage.open();
			
			thisObject._loadMessage.form.loadTextArea.focus();
			thisObject._loadMessage.form.loadTextArea.select();
			
			/*
			var loadString=prompt("world string");
			if(typeof loadString != "string")
				return;
			var loadObject=JSON.parse(loadString);
			
			thisObject._physics.load(loadObject);
			
			thisObject._border=thisObject._physics._shapesArray[0];
			thisObject._anchor=thisObject._physics._shapesArray[1];
			thisObject._changeWorldSize(loadObject.smallWorld);
			
			thisObject._mainView.pos=loadObject.mainViewPos;
			thisObject._mainView.zoom=loadObject.mainViewZoom;
			
			if(thisObject._physicsLoopRef===false)
			{
				thisObject._drawViewports();
			}
			*/
		}
		
		this._settingsForm.chargeSign.onclick=function(){
			//select Add Charge
			thisObject._selectTool('addCharge');
			thisObject._addChargeSign*=-1;
			thisObject._settingsForm.chargeSign.value="+";
			if(thisObject._addChargeSign<0)
				thisObject._settingsForm.chargeSign.value="-";
		}
		
		this._settingsForm.chargeSize.onchange=this._changeChargeSize;
//		this._settingsForm.chargeSize.onkeydown=this._changeChargeSize;
		this._settingsForm.chargeSize.onkeyup=this._changeChargeSize;
		
		this._settingsForm.clearWorld.onclick=function()
		{
			thisObject._physics.clearWorld([thisObject._border, thisObject._anchor]);
			
			if(thisObject._physicsLoopRef===false)
			{
				thisObject._drawViewports();
			}
		}
		
		
		this._settingsForm.addShapeSides.onchange=function()
		{
			thisObject._addShapeSides=parseInt(thisObject._settingsForm.addShapeSides.value);
			thisObject._selectTool('addRegularPolygon');
		}
		
		
		
		/*
		this._settingsForm.pause.onclick=function()
		{
			thisObject.pause();
		}
		
		this._settingsForm.play.onclick=function()
		{
			thisObject.play();
		}
		*/
		
		this._settingsForm.playOrPause.onclick=function()
		{
			if(thisObject._physicsLoopRef===false)
			{
				thisObject.play();
				thisObject._settingsForm.playOrPause.value="Pause";
			}
			else
			{
				thisObject.pause();
				thisObject._settingsForm.playOrPause.value="Play";
			}
				
		}
		
		this._settingsForm.zoomOut.onclick=function()
		{
			thisObject._scrollHandle(-1,true);
		}
		
		this._settingsForm.zoomIn.onclick=function()
		{
			thisObject._scrollHandle(1,true);
		}
		
		for (var i = 0; i < this._settingsForm.toolChoose.length; i++) 
		{
			this._settingsForm.elements.toolChoose[i].onchange = this.setTool;
			if(this._IE)
				this._settingsForm.elements.toolChoose[i].onclick= this.setTool;
		}
		
		this._settingsForm.action = "javascript:;";

	}
	
	this._changeChargeSize=function(){
			thisObject._selectTool('addCharge');
			thisObject._addChargeSize=parseFloat(thisObject._settingsForm.chargeSize.value);
		}
	
	this._selectTool=function(thisTool){
		for (var i = 0; i < this._settingsForm.toolChoose.length; i++) 
		{
			if(thisObject._settingsForm.elements.toolChoose[i].value==thisTool)
				thisObject._settingsForm.elements.toolChoose[i].checked="checked";
		}
		
		thisObject.setTool();
	}
	
	this._buildControlDiv();
	
	this._mouseDownMoveView=function()
	{
		thisObject._oldMousePos=thisObject._mousePos.slice(0);
		thisObject._startToolLoop();
	}
	
	this._mouseDownMoveShape=function(collide)
	{
		if(thisObject._dragShapeSpring!==false || thisObject._dragShape!==false)
			return;
		var simMousePoint=thisObject._divPosToSimulation(thisObject._mousePos);
		if(typeof collide=="undefined")
			collide=thisObject._checkCollideCircle (simMousePoint,thisObject._mouseRadius,[thisObject._border]);//thisObject._mainView.zoom);
		
		if(thisObject._dragShapeSpring===false && collide.collision)
		{
			if (thisObject._dragShapeWithSpring && collide.otherShape.canMove && thisObject._physicsLoopRef!==false) {
				//if dragging objects with springs is enabled, shape can move and sandbox isn't paused
				var mouseFromShape = [simMousePoint[0] - collide.otherShape.pos[0], simMousePoint[1] - collide.otherShape.pos[1]];
				
				var dist1 = Math.sqrt(Math.pow(mouseFromShape[0], 2) + Math.pow(mouseFromShape[1], 2));
				var angle1 = Math.atan2(mouseFromShape[1], mouseFromShape[0]);
				
				//dist1=0;
				//angle1=0;
				//from border centre to mouse
				
				var mouseFromBorder = [simMousePoint[0] - thisObject._border.pos[0], simMousePoint[1] - thisObject._border.pos[1]];
				
				var dist2 = Math.sqrt(Math.pow(mouseFromBorder[0], 2) + Math.pow(mouseFromBorder[1], 2));
				var angle2 = Math.atan2(mouseFromBorder[1], mouseFromBorder[0]);
				
				thisObject._dragShapeSpring = thisObject._physics.springBetween(collide.otherShape, dist1, angle1 - collide.otherShape.pos[2], thisObject._border, dist2, angle2, 0, thisObject._dragShapeSpringStrength, false);
				thisObject._dragShape = collide.otherShape;
				thisObject._startToolLoop();
			}
			else{
				//otherwise, move shape without springs
				thisObject._dragShape=collide.otherShape;
				//thisObject._oldMousePos=thisObject._mousePos.slice(0);
				thisObject._dragShapeToMouse=[simMousePoint[0]-collide.otherShape.pos[0] , simMousePoint[1]-collide.otherShape.pos[1]];
				thisObject._startToolLoop();
			}
		}
	}
	
	this._startToolLoop=function()
	{
		if (thisObject._toolLoopRef === false) 
		{
			thisObject._toolLoopRef = setInterval(thisObject._toolLoop, thisObject._period_ms);
		}
	}
	this.miniMapMouseDown=function()
	{
		thisObject._lastToolChosen=thisObject._toolChosen;
		
		thisObject._toolChosen="dragMiniMap";
		thisObject._startToolLoop();
	}
	
	
	this.mouseDown=function()
	{
		switch(thisObject._toolChosen)
		{
			case 'moveView':
				if(thisObject._smallWorld)
				break;
				thisObject._mouseDownMoveView();
				break;
			case 'moveShape':
				thisObject._mouseDownMoveShape();
				break;
			case 'moveViewOrShape':
				var simMousePoint=thisObject._divPosToSimulation(thisObject._mousePos);
				var collide=thisObject._checkCollideCircle(simMousePoint,thisObject._mouseRadius,[thisObject._border]);//thisObject._mainView.zoom);
				if(collide.collision || thisObject._smallWorld)
					thisObject._mouseDownMoveShape(collide);
				else
					thisObject._mouseDownMoveView();
				break;
			case 'addCircle':
				var simMousePoint=thisObject._divPosToSimulation(thisObject._mousePos);
				if(!thisObject._checkCollideCircle(simMousePoint,thisObject._addShapeRadius,[]).collision)
				{
					thisObject._addShapePhysicsPaused=(thisObject._physicsLoopRef===false);
					thisObject.pause();
					//can make circle here
					thisObject._addShapeCentre=simMousePoint.slice(0);
					//(radius, position, angle, velocity, mass, force, hard, elasticity, hollow, canMove, visible, colour, gameType)
					thisObject._addShape=thisObject._physics.addCircle(thisObject._addShapeRadius,simMousePoint,0,[0,0,0],thisObject._addShapeMass,[0,0,0],true,thisObject._addShapeElasticity,thisObject._addShapeHollow,true,true,thisObject._addShapeColour,false);
					
					thisObject._drawMainView();
					thisObject._startToolLoop();
				}
				break;
			case 'makeExplosion':
			
				if(!isNaN(parseFloat(thisObject._explosionMessage.form.explodeTime.value))){
					thisObject._explodeTime=parseFloat(thisObject._explosionMessage.form.explodeTime.value);
				}
				if(!isNaN(parseFloat(thisObject._explosionMessage.form.explodeStrength.value))){
					thisObject._explodeStrength=parseFloat(thisObject._explosionMessage.form.explodeStrength.value);
				}
				if(!isNaN(parseFloat(thisObject._explosionMessage.form.explodeRadius.value))){
					thisObject._explodeRadius=parseFloat(thisObject._explosionMessage.form.explodeRadius.value);
				}
				
				if(!isNaN(parseFloat(thisObject._explosionMessage.form.implodeTime.value))){
					thisObject._implodeTime=parseFloat(thisObject._explosionMessage.form.implodeTime.value);
				}
				if(!isNaN(parseFloat(thisObject._explosionMessage.form.implodeStrength.value))){
					thisObject._implodeStrength=parseFloat(thisObject._explosionMessage.form.implodeStrength.value);
				}
				if(!isNaN(parseFloat(thisObject._explosionMessage.form.implodeRadius.value))){
					thisObject._implodeRadius=parseFloat(thisObject._explosionMessage.form.implodeRadius.value);
				}
				
				
				var simMousePoint=thisObject._divPosToSimulation(thisObject._mousePos);
				thisObject._physics.makeExplosion(simMousePoint,thisObject._implodeTime,thisObject._explodeTime,thisObject._implodeRadius,thisObject._explodeRadius,thisObject._implodeStrength,thisObject._explodeStrength);
				break;
			case 'addRegularPolygon':
				var simMousePoint=thisObject._divPosToSimulation(thisObject._mousePos);
				
				var modulii=new Array();
				var angles=new Array();
				var angle=Math.PI*2/thisObject._addShapeSides;
				var startAngle=0;
				/*
				switch(thisObject._addShapeSides)
				{
					case 4:
						startAngle=Math.PI/4;
						break;
				}
				*/
				for(var i=0;i<thisObject._addShapeSides;i++)
				{
					modulii.push(thisObject._addShapeRadius);
					angles.push(startAngle+angle*i);
					
				}
				var d={
					"modulii":modulii,
					"angles":angles
				}
				
				if(!thisObject._checkCollidePoly(simMousePoint,0,d,[]).collision)
				{
					thisObject._addShapePhysicsPaused=(thisObject._physicsLoopRef===false);
					thisObject.pause();
					//can make poly
					thisObject._addShapeCentre=simMousePoint.slice(0);
					//(radius, position, angle, velocity, mass, force, hard, elasticity, hollow, canMove, visible, colour, gameType)
					thisObject._addShape=thisObject._physics.addPolygon(thisObject._physics.polarToCartesian(modulii,angles),simMousePoint,0,[0,0,0],thisObject._addShapeMass,[0,0,0],true,thisObject._addShapeElasticity,thisObject._addShapeHollow,true,true,thisObject._addShapeColour,false);
					
					thisObject._drawMainView();
					thisObject._startToolLoop();
				}
				break;
			case 'addCustomPolygon':
				thisObject._addShapePoints=new Array();
				thisObject._addShapePoints.push(thisObject._mousePos);
				
				thisObject._mainView.canvas.strokeStyle=thisObject._render.colourToRGB(thisObject._addShapeColour);
				
				thisObject._addShapePhysicsPaused=(thisObject._physicsLoopRef===false);
				thisObject.pause();
				thisObject._startToolLoop();
				
				break;
			case 'addCharge':
				var simMousePoint=thisObject._divPosToSimulation(thisObject._mousePos);
				var collide=thisObject._checkCollideCircle (simMousePoint,thisObject._mouseRadius,[thisObject._border]);
				if(collide.collision){
					collide.otherShape.giveCharge(thisObject._addChargeSign*thisObject._addChargeSize);
					if(thisObject._physicsLoopRef===false)
						thisObject._drawViewports();
				}
				break;
			case 'removeCharge':
				var simMousePoint=thisObject._divPosToSimulation(thisObject._mousePos);
				var collide=thisObject._checkCollideCircle (simMousePoint,thisObject._mouseRadius,[thisObject._border]);
				if(collide.collision){
					collide.otherShape.giveCharge(0);
					if(thisObject._physicsLoopRef===false)
						thisObject._drawViewports();
				}
				break;
			case 'pin':
				var simMousePoint=thisObject._divPosToSimulation(thisObject._mousePos);
				var collide=thisObject._checkCollideCircle (simMousePoint,thisObject._mouseRadius,[thisObject._border]);
				
				
				if(collide.collision){
					//have clicked on a shape
					var shapeToMouse=[simMousePoint[0] - collide.otherShape.pos[0] , simMousePoint[1] - collide.otherShape.pos[1]];
					//this does nothing physics-wise yet, but does produce a graphic
					//collide.otherShape.pinMe(shapeToMouse);
					
					//relative polar position of pin from centre of shape
					var polar = Math.cartToPolar(shapeToMouse);
					polar[1]-=collide.otherShape.pos[2];
					
					//relative polar position of pin from centre of anchor
					var polar2 = Math.cartToPolar(simMousePoint);
					
					
					thisObject._physics.springBetween(collide.otherShape, polar[0], polar[1], thisObject._anchor, polar2[0], polar2[1], 0, thisObject._dragShapeSpringStrength, true);
				}
				
				break;
			case 'breakSprings':
				var simMousePoint=thisObject._divPosToSimulation(thisObject._mousePos);
				var collide=thisObject._checkCollideCircle (simMousePoint,thisObject._mouseRadius,[thisObject._border]);
				
				if(collide.collision){
					collide.otherShape.breakAllSprings()
				}
				break;
			case 'stringBetween':
			case 'springBetween':
				var simMousePoint=thisObject._divPosToSimulation(thisObject._mousePos);
				var collide=thisObject._checkCollideCircle (simMousePoint,thisObject._mouseRadius,[thisObject._border]);
				
				if(collide.collision)
					var shapeToMouse=[simMousePoint[0] - collide.otherShape.pos[0] , simMousePoint[1] - collide.otherShape.pos[1]];
				
				if(thisObject._connectShape1===false && collide.collision){
					//haven't selected a shape to connect yet, and have clicked on a shape
					thisObject._connectShape1=collide.otherShape;
					thisObject._connectAngle1=collide.otherShape.pos[2];
					thisObject._connectPos1=shapeToMouse;
				}
				else if(thisObject._connectShape1!==false && collide.collision){
					//have clicked on a shape and already chosen a first shape
					
					if (thisObject._connectShape1 == collide.otherShape) {
						//clicked on the same shape as before again
						thisObject._connectShape1 = false;
						break;
					}
					
					var dist1=Math.sqrt(Math.pow(thisObject._connectPos1[0],2) + Math.pow(thisObject._connectPos1[1],2));
					var angle1=Math.atan2(thisObject._connectPos1[1],thisObject._connectPos1[0])-thisObject._connectAngle1;
					
					var dist2=Math.sqrt(Math.pow(shapeToMouse[0],2) + Math.pow(shapeToMouse[1],2));
					var angle2=Math.atan2(shapeToMouse[1],shapeToMouse[0]) - collide.otherShape.pos[2];
					
					var relativeDist = Math.sqrt(Math.pow(thisObject._connectShape1.pos[0] + thisObject._connectPos1[0] - simMousePoint[0], 2) + Math.pow(thisObject._connectShape1.pos[1] + thisObject._connectPos1[1] - simMousePoint[1], 2));
					
					//(shapeA, distA, angleA, shapeB, distB, angleB, segmentLength, weight, strength) {
					if (thisObject._toolChosen == "stringBetween") {
						thisObject._physics.stringBetween(thisObject._connectShape1, dist1, angle1, collide.otherShape, dist2, angle2, thisObject._stringLength, thisObject._stringWeight, thisObject._stringStrength);
					}else{//spring
					//(shapeA, distA, angleA, shapeB, distB, angleB, length, strength, visible)
					
						var tempStrength=thisObject._stringStrength;
						if(!isNaN(parseFloat(thisObject._springMessage.form.strength.value))){
							tempStrength=parseFloat(thisObject._springMessage.form.strength.value);
						}
						
						var tempLength=relativeDist;
						if(!isNaN(parseFloat(thisObject._springMessage.form.length.value)) && parseFloat(thisObject._springMessage.form.length.value)>0){
							tempLength=parseFloat(thisObject._springMessage.form.length.value);
						}
						
						if(thisObject._springMessage.form.centre.checked){
							//connect springs to centre
							dist1=0;
							dist2=0;
							angle1=0;
							angle2=0;
							relativeDist = Math.sqrt(Math.pow(thisObject._connectShape1.pos[0] - collide.otherShape.pos[0],2) + Math.pow(thisObject._connectShape1.pos[1] - collide.otherShape.pos[1],2));
						}
						
						thisObject._physics.springBetween(thisObject._connectShape1, dist1, angle1, collide.otherShape, dist2, angle2, tempLength, tempStrength, thisObject._springMessage.form.visible.checked);
					}
					
					thisObject._connectShape1=false;
					
					if(thisObject._physicsLoopRef===false)
						thisObject._drawViewports();
				}
				
				break;
			case 'fixOrFree':
				var simMousePoint=thisObject._divPosToSimulation(thisObject._mousePos);
				var collide=thisObject._checkCollideCircle(simMousePoint, thisObject._addShapeRadius, [thisObject._border]);
				if (collide.collision) {
					
					if(collide.otherShape.pinned())
					{
						collide.otherShape.unPinMe();
					}
					
					if(collide.otherShape.canMove)
						thisObject._physics.fix(collide.otherShape);
					else
						thisObject._physics.free(collide.otherShape);
				}
				break;
			case 'delete':
				var simMousePoint=thisObject._divPosToSimulation(thisObject._mousePos);
				var collide=thisObject._checkCollideCircle(simMousePoint, thisObject._addShapeRadius, [thisObject._border]);
				if (collide.collision) {
					thisObject._physics.deleteShape(collide.otherShape);
					if(thisObject._physicsLoopRef===false)
						thisObject._drawViewports();
				}
				break;
		}
	}
	
	this._toolLoopMoveView=function()
	{
		var dx=(thisObject._mousePos[0]-thisObject._oldMousePos[0])/thisObject._mainView.zoom;
		var dy=(thisObject._mousePos[1]-thisObject._oldMousePos[1])/thisObject._mainView.zoom;
		
		thisObject._mainView.pos[0]-=dx;
		thisObject._mainView.pos[1]-=dy;
		
		if(thisObject._physicsLoopRef===false)
			thisObject._drawViewports();
		
	}
	
	this._toolLoopMoveShape=function()
	{
		var simMousePoint=thisObject._divPosToSimulation(thisObject._mousePos);
		if (thisObject._dragShapeSpring !== false) {
			//dragging a shape with a spring
			var mouseFromBorder = [simMousePoint[0] - thisObject._border.pos[0], simMousePoint[1] - thisObject._border.pos[1]];
			
			var dist = Math.sqrt(Math.pow(mouseFromBorder[0], 2) + Math.pow(mouseFromBorder[1], 2));
			var angle = Math.atan2(mouseFromBorder[1], mouseFromBorder[0]);
			
			thisObject._dragShapeSpring.distB = dist;
			thisObject._dragShapeSpring.angleB = angle;
		}
		else{
			//var simOldMousePoint=thisObject._divPosToSimulation(thisObject._oldMousePos);
			//var dx=simMousePoint[0]-simOldMousePoint[0];
			//var dy=simMousePoint[1]-simOldMousePoint[1];
			
			var newPos=simMousePoint.slice(0);
			newPos[0]-=thisObject._dragShapeToMouse[0];
			newPos[1]-=thisObject._dragShapeToMouse[1];
			
			var ignore=[thisObject._dragShape]
			ignore=ignore.concat(thisObject._dragShape.cantCollideWithArray);
			
			
			//dragging a shape without a spring
			var collide=thisObject._checkCollide(newPos, thisObject._dragShape.d, thisObject._dragShape.hollow, thisObject._dragShape.shape, ignore);
			if (!collide.collision){
				thisObject._dragShape.pos[0]=newPos[0];
				thisObject._dragShape.pos[1]=newPos[1];
				if(thisObject._physicsLoopRef===false)
					thisObject._drawViewports();
					
			}
		}
	}
	
	this._toolLoop=function()
	{
		
		switch(thisObject._toolChosen)
		{
			case 'dragMiniMap':
				var miniMapToMainCanvas=[findPosX(thisObject._miniMapCanvasTag) - findPosX(thisObject._canvasTag) , findPosY(thisObject._miniMapCanvasTag) - findPosY(thisObject._canvasTag)];
		
				var miniMapMousePos=[thisObject._mousePos[0] - miniMapToMainCanvas[0] -thisObject._miniMapSize[0]/2 , thisObject._mousePos[1] - miniMapToMainCanvas[1] - thisObject._miniMapSize[1]/2];
				
				miniMapMousePos[0]=miniMapMousePos[0]/thisObject._miniMapSize[0]*thisObject._worldSize[0];
				miniMapMousePos[1]=miniMapMousePos[1]/thisObject._miniMapSize[1]*thisObject._worldSize[1];
				
				thisObject._mainView.pos=miniMapMousePos.slice(0);
				
				if(thisObject._physicsLoopRef===false)
					thisObject._drawViewports();
				break;
			case 'moveView':
				thisObject._toolLoopMoveView();
				break;
			case 'moveShape':
				thisObject._toolLoopMoveShape();
				break;
			case 'moveViewOrShape':
				if(thisObject._dragShape===false)
					thisObject._toolLoopMoveView();
				else
					thisObject._toolLoopMoveShape();
				break;
			case 'addCircle':
				var simMousePoint=thisObject._divPosToSimulation(thisObject._mousePos);
				
				var radius=thisObject._addShapeRadius + Math.sqrt(Math.pow(thisObject._addShapeCentre[0] - simMousePoint[0],2) + Math.pow(thisObject._addShapeCentre[1] - simMousePoint[1],2));
				
				if (!thisObject._checkCollideCircle(thisObject._addShapeCentre, radius, [thisObject._addShape]).collision) 
				{
					thisObject._addShape.d = radius;
					thisObject._addShape._r = radius;
					thisObject._drawMainView();
				}
				break;
			case 'addRegularPolygon':
				var simMousePoint=thisObject._divPosToSimulation(thisObject._mousePos);
				var tempD=cloneObject(thisObject._addShape.d,2);
				
				var radius=thisObject._addShapeRadius + Math.sqrt(Math.pow(thisObject._addShapeCentre[0] - simMousePoint[0],2) + Math.pow(thisObject._addShapeCentre[1] - simMousePoint[1],2));
				var angle=Math.atan2(simMousePoint[1] - thisObject._addShape.pos[1] , simMousePoint[0] - thisObject._addShape.pos[0]);
				for(var i=0;i<tempD.modulii.length;i++)
				{
					tempD.modulii[i]=radius;
				}
				
				if (!thisObject._checkCollidePoly(thisObject._addShapeCentre, angle , tempD, [thisObject._addShape]).collision) 
				{
					//thisObject._addShape.d = tempD;
					thisObject._addShape.giveNewCoords(thisObject._physics.polarToCartesian(tempD.modulii,tempD.angles));
					thisObject._addShape.pos[2]=angle;
					thisObject._drawMainView();
				}
				break;
			case 'addCustomPolygon':
				thisObject._addShapePoints.push(thisObject._mousePos.slice(0));
				thisObject._mainView.canvas.beginPath();
				thisObject._mainView.canvas.moveTo(thisObject._addShapePoints[thisObject._addShapePoints.length-2][0] , thisObject._addShapePoints[thisObject._addShapePoints.length-2][1]);
				thisObject._mainView.canvas.lineTo(thisObject._addShapePoints[thisObject._addShapePoints.length-1][0] , thisObject._addShapePoints[thisObject._addShapePoints.length-1][1]);
				thisObject._mainView.canvas.stroke();
				break;
				
		}
		thisObject._oldMousePos=thisObject._mousePos.slice(0);
	}
	
	this.mouseUp=function()
	{
		if (thisObject._toolLoopRef !== false) 
		{
			clearInterval(thisObject._toolLoopRef);
			thisObject._toolLoopRef=false;
		}
		
		if(thisObject._dragShapeSpring!==false)
		{
			thisObject._physics.breakSpring(thisObject._dragShapeSpring);
			thisObject._dragShapeSpring=false;
		}
		
		if(thisObject._dragShape!==false)
		{
			thisObject._dragShape=false;
		}
		
		if(thisObject._addShape!==false)
		{
			thisObject._addShape=false;
			//was creating a shape
			if(!thisObject._addShapePhysicsPaused)
			{
				thisObject.play();
			}
		}
		
		if(thisObject._toolChosen=='dragMiniMap')
		{
			thisObject._toolChosen=thisObject._lastToolChosen;
		}
		
		if(thisObject._addShapePoints.length>0)
		{
			//was drawing a new polygon
			
			//re-adjust mouse positions to simulation points:
			for(var i=0;i<thisObject._addShapePoints.length;i++){
				thisObject._addShapePoints[i]=thisObject._divPosToSimulation(thisObject._addShapePoints[i]);
			}
			
			var finalPoints=[thisObject._addShapePoints[0]];
			var lastpoint=0;
			
			for (var i = 0; i < thisObject._addShapePoints.length; i++) {
				var i2 = (i + 1) % thisObject._addShapePoints.length;
				var i3 = (i + 2) % thisObject._addShapePoints.length;
				
				var totalangle = 0;
				for (var j = lastpoint; j < i2; j++) {//go through all the points since the last 'final point'
					var j2 = (j + 1) % thisObject._addShapePoints.length;
					var lp2 = (lastpoint + 1) % thisObject._addShapePoints.length;
					totalangle += Math.atan2(thisObject._addShapePoints[j2][1] - thisObject._addShapePoints[j][1], thisObject._addShapePoints[j2][0] - thisObject._addShapePoints[j][0]) - Math.atan2(thisObject._addShapePoints[lp2][1] - thisObject._addShapePoints[lastpoint][1], thisObject._addShapePoints[lp2][0] - thisObject._addShapePoints[lastpoint][0]);
				}
				if (Math.abs(totalangle) > thisObject._addShapeAngleAccuracy) {
					finalPoints.push(thisObject._addShapePoints[i2]);
					lastpoint = i;
				}
			
			}
			
			
			
			var centre=thisObject._physics.calculateCentreOfMass(finalPoints);
			
			/* attempt at getting rid of non-convex polyons, worked, but got rid of a lot of convex ones too.
			
			var finalPoints2=new Array();
			var lastAngle=Math.atan2(finalPoints[0][1] - centre[1] , finalPoints[0][0] - centre[0]);
			
			for(var i=1;i<finalPoints.length;i++)
			{
				var j=(i+1) % finalPoints.length;
				var thisAngle=Math.atan2(finalPoints[i][1] - centre[1] , finalPoints[i][0] - centre[0]);
				if (thisAngle - lastAngle > 0) {
					finalPoints2.push(finalPoints[i]);
					lastAngle=thisAngle;
				}
					
				
			}
			alert([finalPoints,finalPoints2].toSource());
			centre=thisObject._physics.calculateCentreOfMass(finalPoints2);
			*/
			
			if (finalPoints.length > 3 && thisObject._physics.calculateArea(finalPoints) > 10) {
				//(coords, position, angle, velocity, mass, force, hard, elasticity, hollow, canMove, visible, colour, gameType)
				thisObject._physics.addPolygon(finalPoints, [centre[0], centre[1], 0], 0, [0, 0, 0], thisObject._addShapeMass, [0, 0, 0], true, thisObject._addShapeElasticity, thisObject._addShapeHollow, thisObject._addShapeCanMove, true, thisObject._addShapeColour, false);
			}
			thisObject._addShapePoints=new Array();
			
			if(!thisObject._addShapePhysicsPaused)
			{
				thisObject.play();
			}
			else
			{
				thisObject._drawViewports();
			}
		}
	}
	
	this.mouseMove = function(e){
		if (thisObject._IE) 
		{
			//grab the x-y pos.s if browser is IE
			thisObject._mousePos[0] = event.clientX + document.body.scrollLeft - findPosX(thisObject._canvasTag);
			thisObject._mousePos[1] = event.clientY + document.body.scrollTop - findPosY(thisObject._canvasTag);
		}
		else 
		{
			//grab the x-y pos.s if browser is NS
			thisObject._mousePos[0] = e.pageX - findPosX(thisObject._canvasTag);
			thisObject._mousePos[1] = e.pageY - findPosY(thisObject._canvasTag);
		}
		//if(typeof thisObject._oldMousePos[0]=="undefined")
		//	thisObject._oldMousePos=thisObject._mousePos.slice(0);
	}
	
		
	//mouse wheel scroll stuff  from http://adomas.org/javascript-mouse-wheel/
	this._scrollHandle = function(howmuch,ignoreMouse){
		if(thisObject._smallWorld)
			return
		if (thisObject._mainView.zoom + howmuch / 5 > 0.05 && thisObject._mainView.zoom + howmuch / 5 < 2) 
		{
			
			var oldzoom = thisObject._mainView.zoom;
			thisObject._mainView.zoom += howmuch / 5;
			if (!ignoreMouse) 
			{
				//find the difference between the edge of the old viewport and the mouse in 'virtual pixels' (engine unit of measurement) 
				//works for zooming towards mouse.
				thisObject._mainView.pos[0] -= ((thisObject._mousePos[0] - thisObject._mainView.halfWidth) / thisObject._mainView.zoom - (thisObject._mousePos[0] - thisObject._mainView.halfWidth) / oldzoom);
				thisObject._mainView.pos[1] -= ((thisObject._mousePos[1] - thisObject._mainView.halfHeight) / thisObject._mainView.zoom - (thisObject._mousePos[1] - thisObject._mainView.halfHeight) / oldzoom);
			}
			
			if(thisObject._physicsLoopRef===false)
				thisObject._drawViewports();
		}
	}
	
	
	this._mouseWheel = function(event){
		var delta = 0;
		if (!event) 
			event = window.event;
		if (event.wheelDelta) 
		{
			delta = event.wheelDelta / 120;
			if (window.opera) 
				delta = -delta;
		}
		else if (event.detail) 
		{
			delta = -event.detail / 3;
		}
		if (delta)
			thisObject._scrollHandle(delta,false);
		if (event.preventDefault) 
			event.preventDefault();
		event.returnValue = false;
		return false;
	}
		
	
	
	this._physicsLoop=function()
	{
		//if(thisObject._physics.shapesArray.length==0)
			//return;
		thisObject._physics.advance(thisObject._period);
		thisObject._drawViewports();
	}
	
	this._drawViewports=function()
	{
		thisObject._drawMainView();
		thisObject._drawMiniMap();
		
	}
	
	this._drawMainView=function()
	{
		thisObject._render.drawViewport(thisObject._mainView,thisObject._physics.visibleArray(),thisObject._physics.visibleSpringArray());
		
		//draw green at the bottom of the world
		if(thisObject._mainView.pos[1]+thisObject._mainView.halfHeight/thisObject._mainView.zoom > thisObject._worldSize[1]/2)
		{
			//viewport will show bottom of world
			var top=(thisObject._worldSize[1]/2 - thisObject._mainView.pos[1])*thisObject._mainView.zoom + thisObject._mainView.halfHeight;
			var height=thisObject._mainView.height-top;
			
			if(height>thisObject._mainView.height)
				height=thisObject._mainView.height;
				
			if(top <0)
				top=0;
			
			thisObject._mainView.canvas.fillStyle="rgb(64,224,64)";
			thisObject._mainView.canvas.fillRect(0,top,thisObject._mainView.width , height);
		}
	}
	
	this._drawMiniMap=function()
	{
		thisObject._render.drawViewport(thisObject._miniMapView,thisObject._physics.visibleArray());
		thisObject._miniMapView.canvas.strokeStyle="rgb(0,0,0)";
		
		var viewportPos=[(thisObject._mainView.pos[0]-thisObject._mainView.halfWidth/thisObject._mainView.zoom-thisObject._miniMapView.pos[0])*thisObject._miniMapView.zoom + thisObject._miniMapView.halfWidth , (thisObject._mainView.pos[1]-thisObject._mainView.halfHeight/thisObject._mainView.zoom-thisObject._miniMapView.pos[1])*thisObject._miniMapView.zoom  + thisObject._miniMapView.halfHeight];
		
		thisObject._miniMapView.canvas.strokeRect(Math.round(  viewportPos[0] ) +0.5,Math.round(viewportPos[1])+0.5 , Math.round(thisObject._mainView.width/thisObject._mainView.zoom*thisObject._miniMapView.zoom) , Math.round(thisObject._mainView.height/thisObject._mainView.zoom*thisObject._miniMapView.zoom));
	}
	
	this.pause=function()
	{
		clearInterval(thisObject._physicsLoopRef);
		thisObject._physicsLoopRef=false;
	}
	
	this.play=function()
	{
		if(thisObject._physicsLoopRef===false)
			thisObject._physicsLoopRef=setInterval(thisObject._physicsLoop,thisObject._period_ms);
	}
	
	this._buildMessageWindows();
	
	this.loadJSON(sandboxInitialJson);
	
	
	
	myAddEvent(this._canvasTag, 'onmousedown', this.mouseDown);
	myAddEvent(this._miniMapCanvasTag, 'onmousedown', this.miniMapMouseDown);
	myAddEvent(document, 'onmouseup', this.mouseUp);
	myAddEvent(document, 'onmousemove', this.mouseMove);
	//myAddEvent(this._canvasTag, 'onmousewheel', this._mouseWheel);
	/*
	//set up the graphdiv to collect the scrollwheel info
	if (window.addEventListener)
	this._canvasTag.addEventListener('DOMMouseScroll', this._mouseWheel, false);
	if(this._IE){window.onmousewheel = document.onmousewheel = this._mouseWheel;}
	this._canvasTag.onmousewheel = this._mouseWheel;
	*/
	
	if (window.addEventListener)
	this._canvasTag.addEventListener('DOMMouseScroll', this._mouseWheel, false);
}
