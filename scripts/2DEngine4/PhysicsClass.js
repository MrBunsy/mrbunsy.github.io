/**
 * @author Luke
 *
 * PhysicsClass
 *
 * public methods:
 *
 * save()
 * returns string
 * for saving world state
 *
 * load(jsonText:string)
 * loads previously saved world state, wiping current state
 * 
 * clearWorld(keepArray)
 * clears world of everything being simulated, except for the shapes in the keepArray
 * 
 * 
 * advance(dt:float)
 * advances physics simulation by time given
 *
 * springBetween(shapeA: shape object,distA:float,angleA:float,shapeB:shape object,distB:float,angleB:float,length:float,strength:float)
 * returns spring ref
 * makes spring between two shapes
 *
 * stringBetween(shapeA,distA,angleA,shapeB,distB,angleB,segmentLength,weight,strength)
 * makes a string between two shapes
 * 
 * deleteShape(shapeRef)
 * deletes shape from world
 * 
 * polarToCartesian(modulii,angles)
 * returns [ [point1x,point1y] , [point2x,point2y] , ... ]
 * given modulii and angles of points, it will return cartesian sets of coords
 * 
 * addCircle (radius, position, angle, velocity, mass, force, hard, elasticity, hollow, canMove, visible, colour, gameType)
 * returns circle ref
 *
 * addHollowRectangle(width, height, position, elasticity, visible, colour, gameType)
 * returns rectangle ref
 *
 * addPolygon (coords, position, angle, velocity, mass, force, hard, elasticity, hollow, canMove, visible, colour, gameType)
 * returns polygon ref
 *
 * addRod(length, position, angle, velocity, mass, force, hard, elasticity, canMove, visible, colour, gameType
 * returns rod ref
 * 
 * 
 * Notes:  there exists a system to give each object one 'pin' - the idea was to use this as a point it can only rotate about.
 * however I've realised that to do this properly would require a lot of maths and effort, but I'd like to do it one day
 * so I've left it in, but the intention is to build cheap pins into the sandbox using springs.
 *
 */
var PhysicsClass = function(gravity, friction) {
	var thisObject = this;
	//array, [gravityX, gravityY];
	this._gravity = gravity;
	
	this._friction = friction;
	
	//constants:
	this._k = 800000;
	
	this._maxSpringForce=500000;
	
	
	//list of all the shapes
	this._shapesArray = new Array();
	
	this.shapesArray=function(){
		return this._shapesArray.slice(0);
	}
	
	//array of all shapes that can move
	this._canMoveArray = new Array();
	
	//array of all visible shapes
	this._visibleArray = new Array();
	
	this.visibleArray = function() {
		return this._visibleArray.slice(0);
	}
	
	//array of all shapes that can collide
	this._hardArray = new Array();
	
	//array of all charged shapes
	this._chargeArray = new Array();
	
	//references to all arrays that contain shapes
	this._arrayOfShapeArrays=[this._shapesArray,this._canMoveArray,this._visibleArray,this._hardArray,this._chargeArray];
	
	//array of connection objects
	this._springArray = new Array();
	
	//array of visible springs
	this._visibleSpringArray = new Array();
	
	this.visibleSpringArray = function() {
		return this._visibleSpringArray.slice(0);
	}
	//collision detection
	this._detect = new DetectClass();
	
	//collision response
	this._response = new ResponseClass();
	
	this._checkCollide = function(thisShape, newPos) {
		for (var i = 0; i < thisObject._hardArray.length; i++) {
			var otherShape = thisObject._hardArray[i];
			if (otherShape === thisShape || inArray(otherShape, thisShape.cantCollideWithArray)) {
				//can't collide with self or shapes in can't collide with array
				continue;
			}
			var collide = thisObject._detect.checkForCollision(newPos, thisShape.d, thisShape.hollow, newPos[2], thisShape.shape, otherShape.pos, otherShape.d, otherShape.hollow, otherShape.pos[2], otherShape.shape);
			
			if (collide.overlap) {
				return {
					"collision": true,
					"otherShape": otherShape,
					"contactPoint": collide.contactPoint,
					"contactNormal": collide.contactNormal
				};
			}
		}
		return {
			"collision": false
		};
	}
	
	//checks wantPoses
	this._checkCollide2 = function(thisShape) {
		for (var i = 0; i < thisObject._hardArray.length; i++) {
			var otherShape = thisObject._hardArray[i];
			if (otherShape === thisShape || inArray(otherShape, thisShape.cantCollideWithArray)) {
				//can't collide with self or shapes in can't collide with array
				continue;
			}
			var collide = thisObject._detect.checkForCollision(thisShape.wantPos, thisShape.d, thisShape.hollow, thisShape.wantPos[2], thisShape.shape, otherShape.wantPos, otherShape.d, otherShape.hollow, otherShape.wantPos[2], otherShape.shape);
			
			if (collide.overlap) {
				return {
					"collision": true,
					"otherShape": otherShape,
					"contactPoint": collide.contactPoint,
					"contactNormal": collide.contactNormal
				};
			}
		}
		return {
			"collision": false
		};
	}
	
	this.deleteShape = function(deleteMe) {
		deleteMe.breakAllSprings();
		for(var i=0;i<thisObject._arrayOfShapeArrays.length;i++)
		{
			removeFromArray(deleteMe,thisObject._arrayOfShapeArrays[i]);
		}
	}
	
	this.clearWorld=function(keepArray)
	{
		if(!(keepArray instanceof Array))
			keepArray = [];
			
		for(var i=0;i<this._shapesArray.length;i++)
		{
			if (!inArray(this._shapesArray[i], keepArray)) {
				this.deleteShape(this._shapesArray[i]);
				i--;
			}
		}
		
		this._springArray=new Array();
		this._visibleSpringArray=new Array();
	}
	
	this.save = function() {
		var saveObject={};
		
		saveObject.gravity=thisObject._gravity;
		saveObject.friction=thisObject._friction;
		
		saveObject.shapesArray=cloneObject(thisObject._shapesArray,3);
		
		for(var i=0;i<thisObject._shapesArray.length;i++){
			
			for(var j=0;j<saveObject.shapesArray[i].springs.length;j++){
				//instead of an array of spring references in each shape, give position in spring array of spring ref
				saveObject.shapesArray[i].springs[j]=whereInArray(thisObject._shapesArray[i].springs[j],thisObject._springArray);
			}
			for(var j=0;j<thisObject._shapesArray[i].cantCollideWithArray.length;j++){
				//same for cantcollidewith shape referances
				saveObject.shapesArray[i].cantCollideWithArray[j]=whereInArray(thisObject._shapesArray[i].cantCollideWithArray[j],thisObject._shapesArray);
			}
		}
		
		saveObject.springArray=cloneObject(thisObject._springArray,1);
		
		for(var i=0;i<saveObject.springArray.length;i++){
			saveObject.springArray[i].shapeA=whereInArray(thisObject._springArray[i].shapeA,thisObject._shapesArray);
			saveObject.springArray[i].shapeB=whereInArray(thisObject._springArray[i].shapeB,thisObject._shapesArray);
		}
		
		return saveObject;
		//return JSON.stringify(saveObject);
	}
	
	this.load = function(jsonText) {
		if (typeof jsonText == "string") {
			//handed json string
			var loadObject = JSON.parse(jsonText);
		}
		else{
			//handed object
			var loadObject = jsonText;
		}
		
		//kill old world, including border
		thisObject.clearWorld();
		
		//load all the shapes and give them their charge
		for(var i=0;i<loadObject.shapesArray.length;i++){
			switch(loadObject.shapesArray[i].shape)
			{
				case 0://circle
					var tempShape=thisObject.addCircle(loadObject.shapesArray[i].d, loadObject.shapesArray[i].pos, 0, loadObject.shapesArray[i].v, loadObject.shapesArray[i].mass, loadObject.shapesArray[i].f, loadObject.shapesArray[i].hard, loadObject.shapesArray[i].e, loadObject.shapesArray[i].hollow, loadObject.shapesArray[i].canMove, loadObject.shapesArray[i].visible, loadObject.shapesArray[i].colour, loadObject.shapesArray[i].gameType);
					tempShape.giveCharge(loadObject.shapesArray[i].charge);
					break;
				case 4://rod
					var tempShape=thisObject.addRod(loadObject.shapesArray[i].d*2, loadObject.shapesArray[i].pos, 0, loadObject.shapesArray[i].v, loadObject.shapesArray[i].mass, loadObject.shapesArray[i].f, loadObject.shapesArray[i].hard, loadObject.shapesArray[i].e, loadObject.shapesArray[i].canMove, loadObject.shapesArray[i].visible, loadObject.shapesArray[i].colour, loadObject.shapesArray[i].gameType);
					tempShape.giveCharge(loadObject.shapesArray[i].charge);
					break;
				case 2://hollow rectangle
					var tempShape=thisObject.addHollowRectangle(loadObject.shapesArray[i]._width, loadObject.shapesArray[i]._height, loadObject.shapesArray[i].pos, loadObject.shapesArray[i].e, loadObject.shapesArray[i].visible, loadObject.shapesArray[i].colour, loadObject.shapesArray[i].gameType);
					tempShape.giveCharge(loadObject.shapesArray[i].charge);
					break;
				case 3://polygon
					var tempShape=thisObject.addPolygon(loadObject.shapesArray[i]._coords, loadObject.shapesArray[i].pos, 0, loadObject.shapesArray[i].v, loadObject.shapesArray[i].mass, loadObject.shapesArray[i].f, loadObject.shapesArray[i].hard, loadObject.shapesArray[i].e, loadObject.shapesArray[i].hollow, loadObject.shapesArray[i].canMove, loadObject.shapesArray[i].visible, loadObject.shapesArray[i].colour, loadObject.shapesArray[i].gameType);
					tempShape.giveCharge(loadObject.shapesArray[i].charge);
					break;
			}
			
		}
		
		for(var i=0;i<loadObject.shapesArray.length;i++){
			for(var j=0;j<loadObject.shapesArray[i].cantCollideWithArray.length;j++){
				thisObject._shapesArray[i].cantCollideWith(thisObject._shapesArray[loadObject.shapesArray[i].cantCollideWithArray[j]]);
			}
		}
		
		//link up all the springs
		
		for(var i=0;i<loadObject.springArray.length;i++){
			thisObject.springBetween(thisObject._shapesArray[loadObject.springArray[i].shapeA] , loadObject.springArray[i].distA , loadObject.springArray[i].angleA , thisObject._shapesArray[loadObject.springArray[i].shapeB] , loadObject.springArray[i].distB , loadObject.springArray[i].angleB, loadObject.springArray[i].length, loadObject.springArray[i].strength, loadObject.springArray[i].visible);
		}
		
		/*
		thisObject._shapesArray = loadObject.shapesArray;
		thisObject._springArray = loadObject.springArray;
		
		thisObject._hardArray = [];
		thisObject._canMoveArray = [];
		thisObject._visibleArray = [];
		thisObject._chargeArray = [];
		thisObject._visibleSpringArray = [];
		
		for (var i = 0; i < thisObject._shapesArray.length; i++) {
			
			switch(thisObject._shapesArray[i].shape)
			{
				case 3:
				//poly only methods
					thisObject._shapesArray[i].tidyCoords = thisObject.tidyCoords;
					thisObject._shapesArray[i].calculateMI = thisObject.calculateMI;
					thisObject._shapesArray[i].giveNewCoords=thisObject.giveNewCoords;		
				default:
					thisObject._shapesArray[i].addSpring = thisObject.addSpring;
					thisObject._shapesArray[i].removeSpring = thisObject.removeSpring;
					thisObject._shapesArray[i].breakAllSprings = thisObject.breakAllSprings;
					thisObject._shapesArray[i].cantCollideWith = thisObject.cantCollideWith;
					thisObject._shapesArray[i].canCollideWith = thisObject.canCollideWith;
					thisObject._shapesArray[i].canCollideWithAll = thisObject.canCollideWithAll;
					thisObject._shapesArray[i].giveCharge = thisObject.giveCharge;
					break;
			}
			
			//replace array positions with references again
			for (var j = 0; j < thisObject._shapesArray[i].springs.length; j++) {
				thisObject._shapesArray[i].springs[j] = thisObject._springArray[thisObject._shapesArray[i].springs[j]];
			}
			
			for (var j = 0; j < thisObject._shapesArray[i].cantCollideWithArray.length; j++) {
				thisObject._shapesArray[i].cantCollideWithArray[j]=thisObject._shapesArray[thisObject._shapesArray[i].cantCollideWithArray[j]];
			}
			
			if (thisObject._shapesArray[i].hard) 
				thisObject._hardArray.push(thisObject._shapesArray[i]);
			
			if (thisObject._shapesArray[i].canMove) 
				thisObject._canMoveArray.push(thisObject._shapesArray[i]);
			
			if (thisObject._shapesArray[i].visible) 
				thisObject._visibleArray.push(thisObject._shapesArray[i]);
			
			if (thisObject._shapesArray[i].charge != 0) 
				thisObject._chargeArray.push(thisObject._shapesArray[i]);
		}
		
		for(var i=0;i<thisObject._springArray.length;i++){
			thisObject._springArray[i].shapeA=thisObject._shapesArray[thisObject._springArray[i].shapeA];
			thisObject._springArray[i].shapeB=thisObject._shapesArray[thisObject._springArray[i].shapeB];
		}
		*/
	}
	
	this._getGravityForce = function(moveMe, atPos, atV) {
		var force = [0, 0, 0];
		
		force[0] += thisObject._gravity[0] * moveMe.mass;
		force[1] += thisObject._gravity[1] * moveMe.mass;
		
		return force;
	}
	
	this._getFrictionForce = function(moveMe, atPos, atV) {
		var force = [0, 0, 0];
		
		var speed = Math.sqrt(Math.pow(atV[0], 2) + Math.pow(atV[1], 2));
		
		var frictionForce = -thisObject._friction * speed;
		var angle = Math.atan2(atV[1], atV[0]);
		
		force[0] += Math.cos(angle) * frictionForce;
		force[1] += Math.sin(angle) * frictionForce;
		force[2] += - atV[2] * thisObject._friction;
		
		return force;
	}
	
	
	this._getChargeForces = function(moveMe, atPos, atV) {
		var force = [0, 0, 0];
		
		if (moveMe.charge !== 0) {
		
			for (var i = 0; i < thisObject._chargeArray.length; i++) {
				var otherShape = thisObject._chargeArray[i];
				
				
				if (moveMe === otherShape) {
					continue;
				}
				
				var rsqrd = Math.pow(otherShape.pos[0] - atPos[0], 2) + Math.pow(otherShape.pos[1] - atPos[1], 2);
				//coloumbs law:
				//f=i.q1.q2/r^2
				var coulombForce = thisObject._k * otherShape.charge * moveMe.charge / rsqrd;
				var coulombAngle = Math.atan2(atPos[1] - otherShape.pos[1], atPos[0] - otherShape.pos[0]);
				
				force[0] += Math.cos(coulombAngle) * coulombForce;
				force[1] += Math.sin(coulombAngle) * coulombForce;
				
			}
		}
		return force;
	}
	
	this._getSpringForce = function(moveMe, atPos, atV) {
	
		var force = [0, 0, 0];
		/*
		 *  F_linear = F
		 *  F_torque = F cross (p - x)
		 *
		 */
		for (var i = 0; i < moveMe.springs.length; i++) {
			var spring = moveMe.springs[i];
			var ourDist = spring.distB;
			var ourAngle = spring.angleB;
			var theirDist = spring.distA;
			var theirAngle = spring.angleA;
			var them = spring.shapeA;
			
			if (moveMe == spring.shapeA) {
				ourDist = spring.distA;
				ourAngle = spring.angleA;
				theirDist = spring.distB;
				theirAngle = spring.angleB;
				them = spring.shapeB;
			}
			
			var ourPoint = [atPos[0] + ourDist * Math.cos(ourAngle + atPos[2]), atPos[1] + ourDist * Math.sin(ourAngle + atPos[2])];
			
			var theirPoint = [them.pos[0] + theirDist * Math.cos(theirAngle + them.pos[2]), them.pos[1] + theirDist * Math.sin(theirAngle + them.pos[2])];
			
			
			var distance = Math.sqrt(Math.pow(theirPoint[0] - ourPoint[0], 2) + Math.pow(theirPoint[1] - ourPoint[1], 2));
			//alert((distance - spring.length))
			var springForce = spring.strength * (distance - spring.length);
			
			if(springForce>thisObject._maxSpringForce)
			{
				springForce=thisObject._maxSpringForce;
			}
				//alert([atPos, ourDist, ourAngle].toSource());
				
			
			var springAngle = Math.atan2(theirPoint[1] - ourPoint[1], theirPoint[0] - ourPoint[0]);
			
			var springForceVector = [springForce * Math.cos(springAngle), springForce * Math.sin(springAngle)];
			
			force[0] += springForceVector[0];
			force[1] += springForceVector[1];
			force[2] += Math.crossProduct([ourPoint[0] - moveMe.pos[0], ourPoint[1] - moveMe.pos[1]], springForceVector)[2];
			/*
			if(!isFinite(force[0]))
				force[0]=0;
				
			if(!isFinite(force[1]))
				force[1]=0;
				
			if(!isFinite(force[2]))
				force[2]=0;
			*/	
		}
		return force;
	}
	
	this._eulerGetPosAndV = function(atPos, atV, a, dt) {
	
		//final velocity, v=u+at;
		var v = [atV[0] + a[0] * dt, atV[1] + a[1] * dt, atV[2] + a[2] * dt];
		
		//s=u*t + 0.5*a*t^2
		var newPos = [atPos[0] + atV[0] * dt + 0.5 * a[0] * dt * dt, atPos[1] + atV[1] * dt + 0.5 * a[1] * dt * dt, atPos[2] + atV[2] * dt + 0.5 * a[2] * dt * dt];
		
		return {
			"v": v,
			"pos": newPos
		}
	}
	
	//RK4
	this._getPosAndV = function(moveMe, dt) {
		//velocity + acceleration of initial position
		
		var k1V = moveMe.v.slice(0);
		var k1A = thisObject._getAcceleration(moveMe, moveMe.pos, moveMe.v);
		
		if(isNaN(moveMe.pos[0]))
			alert(['RK4,moveMe.pos',moveMe.pos].toSource())
		
		//v + a at half an euler's advancement under k1 conditions
		var k2Temp = thisObject._eulerGetPosAndV(moveMe.pos, moveMe.v, k1A, dt / 2);
		var k2V = k2Temp.v;
		var k2A = thisObject._getAcceleration(moveMe, k2Temp.pos, k2Temp.v);
		
		if(!isFinite(k2Temp.v[0]))
			alert(['RK4,k2Temp',k2Temp,k1A].toSource())
		
		//v + a at half an euler's advancement under k2 conditions
		var k3Temp = thisObject._eulerGetPosAndV(moveMe.pos, k2V, k2A, dt / 2);
		//var k3Temp=thisObject._eulerGetPosAndV(k2Temp.pos, k2V, k2A ,dt/2);
		var k3V = k3Temp.v;
		var k3A = thisObject._getAcceleration(moveMe, k3Temp.pos, k3Temp.v);
		
		if(!isFinite(k3Temp.v[0]))
			alert(['RK4,k3Temp',k3Temp,moveMe.pos, k2V, k2A, dt / 2].toSource())
		
		//v + a at a full euler's advancement under k3 conditions
		var k4Temp = thisObject._eulerGetPosAndV(moveMe.pos, k3V, k3A, dt);
		var k4V = k4Temp.v;
		var k4A = thisObject._getAcceleration(moveMe, k4Temp.pos, k4Temp.v);
		
		
		if(!isFinite(k4Temp.v[0]))
			alert(['RK4,k4Temp',k4Temp].toSource())
		
		var v = new Array(3);
		
		v[0] = (k1V[0] + 2 * (k2V[0] + k3V[0]) + k4V[0]) / 6;
		v[1] = (k1V[1] + 2 * (k2V[1] + k3V[1]) + k4V[1]) / 6;
		v[2] = (k1V[2] + 2 * (k2V[2] + k3V[2]) + k4V[2]) / 6;
		
		var a = new Array(3);
		
		a[0] = (k1A[0] + 2 * (k2A[0] + k3A[0]) + k4A[0]) / 6;
		a[1] = (k1A[1] + 2 * (k2A[1] + k3A[1]) + k4A[1]) / 6;
		a[2] = (k1A[2] + 2 * (k2A[2] + k3A[2]) + k4A[2]) / 6;
		
		
		//var temp = thisObject._eulerGetPosAndV(moveMe.pos, moveMe.v, k1A, dt)
		
		return {
			"pos": [moveMe.pos[0] + v[0] * dt, moveMe.pos[1] + v[1] * dt, moveMe.pos[2] + v[2] * dt],
			//"pos": [moveMe.pos[0] + moveMe.v[0]*dt + 0.5*a[0]*dt*dt , moveMe.pos[1] + moveMe.v[1]*dt + 0.5*a[1]*dt*dt , moveMe.pos[2] + moveMe.v[2]*dt + 0.5*a[2]*dt*dt],
			"v": [moveMe.v[0] + a[0] * dt, moveMe.v[1] + a[1] * dt, moveMe.v[2] + a[2] * dt]
		}
		
	}
	
	this._getAcceleration = function(moveMe, atPos, atV) {
		if(isNaN(atPos[0]))
			alert(['getAcceleration',atPos].toSource())
		//want value of moveMe.f, not reference to!
		var force = moveMe.f.slice(0);
		var gravity = thisObject._getGravityForce(moveMe, atPos, atV);
		var spring = thisObject._getSpringForce(moveMe, atPos, atV);
		var friction = thisObject._getFrictionForce(moveMe, atPos, atV);
		var charge = thisObject._getChargeForces(moveMe, atPos, atV);
		
		
		force[0] += gravity[0] + friction[0] + spring[0] + charge[0];
		force[1] += gravity[1] + friction[1] + spring[1] + charge[1];
		force[2] += friction[2] + spring[2];
		
		//accereration = f/m
		var a = [force[0] / moveMe.mass, force[1] / moveMe.mass, force[2] / moveMe.mI];
		if(!isFinite(a[0]))
			a=[0,0,0];
		
		
		return a;
	}
	
	this._moveUntilCollision = function(moveMe,time) {
		var collideT = time;
		var testT = time;
		//binary search to find exactly what time shape collides
		for (var j = 0; j < 8; j++) {
			testT /= 2;
			if (thisObject._checkCollide(moveMe, thisObject._getPosAndV(moveMe, collideT - testT).pos).collision) {
				collideT -= testT;
			}
		}
		
		//collision data
		collide = thisObject._checkCollide(moveMe, thisObject._getPosAndV(moveMe, collideT + testT).pos);
		
		collideT -= testT;
		
		//position and speed just before collision
		newPosAndV = thisObject._getPosAndV(moveMe, collideT);
		if (!collide.collision) {
			alert(collideT)
		}
		//will collide with collide.otherShape
		var newVs = thisObject._response.collideTwoShapes(moveMe, newPosAndV.pos, newPosAndV.v, collide.otherShape, collide.contactPoint, collide.contactNormal);
		
		if (isNaN(newVs.v1[0]) || isNaN(newVs.v2[0])) {
			alert([moveMe,collide].toSource())
			alert(newVs.toSource());
		}
		
		//DETECTION HERE PERHAPS FOR RESTING CONTACT?
		
		//give position just before collision and give new velocity
		moveMe.v = newVs.v1;
		moveMe.pos = newPosAndV.pos;
		/*
		 if(collide.otherShape.canMove)
		 {
		 //other shape can move
		 collide.otherShape.v=newVs.v2;
		 return;
		 }
		 */
		//calculate where it'd end up if moving from this point for rest of frame
		newPosAndV = thisObject._getPosAndV(moveMe, time - collideT);
		
		if (!thisObject._checkCollide(moveMe, newPosAndV.pos).collision) {
			//only give it the position it would have if continuing to move at new speed *IF* it doesn't collide further
			moveMe.v = newPosAndV.v;
			moveMe.pos = newPosAndV.pos;
		}
		else if (collideT > 0.0001) {
			//recursion: try again unless it's likely to get stuck ina  recusrive loop
			thisObject._moveUntilCollision(moveMe,time - collideT)
		}
		
		
		if (collide.otherShape.canMove) {
			collide.otherShape.v = newVs.v2;
		}
	}
	
	this._giveWantPos = function(time) {
		for (var i = 0; i < thisObject._canMoveArray.length; i++) {
			var moveMe = thisObject._canMoveArray[i];
			var newPosAndV = thisObject._getPosAndV(moveMe, dt);
			moveMe.wantPos = newPosAndV.pos.slice(0);
			moveMe.wantV = newPosAndV.v.slice(0);
		}
	}
	
	this._isWantPosCollision = function() {
		for (var i = 0; i < thisObject._canMoveArray.length; i++) {
			var collide = thisObject._checkCollide2(thisObject._canMoveArray[i], newPosAndV.pos.slice(0));
			if (collide.collision) 
				return true;
		}
		return false;
	}
	
	this._isCollisionAtTime = function(time) {
	
		thisObject._giveWantPos(time);
		return thisObject._isWantPosCollision();
	}
	
	this._findCollisionTime = function(time,accuracy) {
	
		var collideT = time;
		var testT = time;
		
		//binary search to find exactly what time shape collides
		for (var j = 0; j < accuracy; j++) {
			testT /= 2;
			if (thisObject._isCollisionAtTime(collideT - testT)) {
				collideT -= testT;
			}
			
			//so we can do collisions
			thisObject._giveWantPos(collideT);
			
			//return time juuuust before collision
			return collideT-testT;
		}
	}
	
	//advance physics by dt seconds
	this.advance = function(dt) {
		/*
		thisObject._giveWantPos(dt);
		
		if (!thisObject._isWantPosCollision()) {
			//no collision, everything can move
			for (var i = 0; i < thisObject._canMoveArray.length; i++) {
				thisObject._canMoveArray[i].pos = thisObject._canMoveArray[i].wantPos;
				thisObject._canMoveArray[i].v = thisObject._canMoveArray[i].wantV;
			}
			//stop running advance here!
			return;
		}
		
		var collideT=thisObject._findCollisionTime(dt,8);
		*/
		
		for (var i = 0; i < thisObject._canMoveArray.length; i++) {
			var moveMe=thisObject._canMoveArray[i];
			
			var newPosAndV = thisObject._getPosAndV(moveMe, dt);
			
			var collide=thisObject._checkCollide(moveMe, newPosAndV.pos);
			
			if(isNaN(newPosAndV.pos[0]) || !isFinite(newPosAndV.pos[0]) || !isFinite(newPosAndV.v[0]))
				{
					alert(collide.toSource());
					alert(newPosAndV.toSource())
				}
			
			if (!collide.collision) {
				
				moveMe.pos = newPosAndV.pos.slice(0);
				moveMe.v = newPosAndV.v.slice(0);
			}
			/*else if (!collide.otherShape.canMove) {
				//othershape can't move, use binary search system for moving our shape
				thisObject._moveUntilCollision(moveMe,dt);
			}*/
			else{
				//other shape can move, leave our shape not moving and give both shapes new Vs
				var newVs = thisObject._response.collideTwoShapes(moveMe, newPosAndV.pos, newPosAndV.v, collide.otherShape, collide.contactPoint, collide.contactNormal)
				moveMe.v=newVs.v1.slice(0);
				if(collide.otherShape.canMove)
					collide.otherShape.v=newVs.v2.slice(0);

			}
		}
	}
	this.polarToCartesian=function(modulii,angles)
	{
		var returnArray=new Array();
		for(var i=0;i<modulii.length;i++)
		{
			returnArray.push([modulii[i]*Math.cos(angles[i]) , modulii[i]*Math.sin(angles[i])]);
		}
		return returnArray;
	}
	
	this.fix=function(shape){
		shape.canMove=false;
		removeFromArray(shape, this._canMoveArray);
	}
	
	this.free=function(shape){
		if(shape.canMove)
			return;
		shape.canMove=true;
		this._canMoveArray.push(shape);
	}
	
	this.Spring = function(shapeA, distA, angleA, shapeB, distB, angleB, length, strength, visible) {
		this.shapeA = shapeA;
		this.shapeB = shapeB;
		
		//angle (when shape's angle is at zero) and distance from centre of mass of shape
		this.distA = distA;
		this.angleA = angleA;
		
		this.distB = distB;
		this.angleB = angleB
		
		this.length = length;
		this.strength = strength;
		
		this.visible = visible;
	}
	
	this.springBetween = function(shapeA, distA, angleA, shapeB, distB, angleB, length, strength, visible) {
		var tempSpring = new thisObject.Spring(shapeA, distA, angleA, shapeB, distB, angleB, length, strength, visible);
		thisObject._springArray.push(tempSpring);
		
		if (visible) 
			thisObject._visibleSpringArray.push(tempSpring);
		
		shapeA.addSpring(tempSpring);
		shapeB.addSpring(tempSpring);
		
		return tempSpring;
	}
	
	//completely gets rid of a specific spring
	this.breakSpring = function(spring) {
		spring.shapeA.removeSpring(spring);
		spring.shapeB.removeSpring(spring);
		removeFromArray(spring, thisObject._springArray);
		removeFromArray(spring, thisObject._visibleSpringArray);
	}
	
	this.stringBetween = function(shapeA, distA, angleA, shapeB, distB, angleB, segmentLength, weight, strength) {
		var pointA = [shapeA.pos[0] + distA * Math.cos(angleA + shapeA.pos[2]), shapeA.pos[1] + distA * Math.sin(angleA + shapeA.pos[2])];
		
		var pointB = [shapeB.pos[0] + distB * Math.cos(angleB + shapeB.pos[2]), shapeB.pos[1] + distB * Math.sin(angleB + shapeB.pos[2])];
		
		var distance = Math.sqrt(Math.pow(pointA[0] - pointB[0], 2) + Math.pow(pointA[1] - pointB[1], 2));
		
		var angle = Math.atan2(pointB[1] - pointA[1], pointB[0] - pointA[0]);
		
		var averageV = [(shapeA.v[0] + shapeB.v[0]) / 2, (shapeA.v[1] + shapeB.v[1]) / 2, 0];
		
		
		var numRods = Math.ceil(distance / segmentLength);
		var rodLength = distance / numRods;
		
		var rodWeight = weight;// / numRods;
		
		var dx = (pointB[0] - pointA[0]) / numRods;
		var dy = (pointB[1] - pointA[1]) / numRods;
		
		var rods = new Array();
		
		for (var i = 0; i < numRods; i++) {
			var rodCentre = [pointA[0] + dx / 2 + dx * i, pointA[1] + dy / 2 + dy * i];
			
			rods.push(new this.Rod(rodLength, rodCentre, angle, averageV, rodWeight, [0, 0, 0], true, 1, true, true, "000000", "string"));
			
			if (i > 0) {
				//connect rod to last rod
				this.springBetween(rods[rods.length - 2], rodLength / 2, 0, rods[rods.length - 1], rodLength / 2, Math.PI, 0, strength, true);
			}
		}
		
		//first rod to shapeA
		this.springBetween(rods[0], rodLength / 2, Math.PI, shapeA, distA, angleA, 0, strength, true);
		//last rod to shapeB
		this.springBetween(rods[rods.length - 1], rodLength / 2, 0, shapeB, distB, angleB, 0, strength, true);
		
		for (var i = 0; i < rods.length; i++) {
			shapeA.cantCollideWith(rods[i]);
			shapeB.cantCollideWith(rods[i]);
			
			rods[i].cantCollideWith(shapeA);
			rods[i].cantCollideWith(shapeB);
			
			for (var i2 = 0; i2 < rods.length; i2++) {
				//if(i==i2)
				//continue;
				rods[i].cantCollideWith(rods[i2]);
			}
		}
		
	}
	
	
	
	this.addCircle = function(radius, position, angle, velocity, mass, force, hard, elasticity, hollow, canMove, visible, colour, gameType) {
		return new thisObject.Circle(radius, position, angle, velocity, mass, force, hard, elasticity, hollow, canMove, visible, colour, gameType);
	}
	
	this.addHollowRectangle = function(width, height, position, elasticity, visible, colour, gameType) {
		return new thisObject.HollowRectangle(width, height, position, elasticity, visible, colour, gameType)
	}
	
	this.addPolygon = function(coords, position, angle, velocity, mass, force, hard, elasticity, hollow, canMove, visible, colour, gameType) {
		return new thisObject.Polygon(coords, position, angle, velocity, mass, force, hard, elasticity, hollow, canMove, visible, colour, gameType);
	}
	
	this.addRod = function(length, position, angle, velocity, mass, force, hard, elasticity, canMove, visible, colour, gameType) {
		return new thisObject.Rod(length, position, angle, velocity, mass, force, hard, elasticity, canMove, visible, colour, gameType);
	}
	
	// ---------------- shape classes -------------------
	/*
	this.addSpring = function(springRef) {
		this.springs.push(springRef);
	}
	
	this.removeSpring = function(springRef) {
		removeFromArray(springRef, this.springs);
	}
	
	this.breakAllSprings = function() {
		this.springs = new Array();
	}
	
	this.cantCollideWith = function(withMe) {
		this.cantCollideWithArray.push(withMe);
	}
	
	this.canCollideWith = function(withMe) {
		removeFromArray(withMe, this.cantCollideWithArray);
	}
	
	this.canCollideWithAll = function() {
		this.cantCollideWithArray = new Array();
	}
	
	this.giveCharge = function(chargeMe) {
		if (chargeMe !== 0) {
			this.charge = chargeMe;
			if (!inArray(thisShape, thisObject._chargeArray)) {
				thisObject._chargeArray.push(thisShape);
			}
		}
		else {
			removeFromArray(this, thisObject._chargeArray)
			this.charge = 0;
		}
	}
	*/
	
	this.Circle = function(radius, position, angle, velocity, mass, force, hard, elasticity, hollow, canMove, visible, colour, gameType) {
		var thisShape=this;
		
		this.shape = 0;
		this.alive = true;
		
		//radius
		this._r = radius;
		
		//dimensions object
		//this._d={"_r":radius};
		this.d = radius;
		/*
		 this.d=function()
		 {
		 return this._r;
		 }
		 */
		//position of centre, [x,y,angle]
		this.pos = position;
		if (this.pos.length < 3) {
			this.pos.push(angle);
		}
		//current velocity [x,y,angular]
		this.v = velocity;
		this.mass = mass;
		//permanent forces on this object [x,y,angular]
		this.f = force;
		
		//can collide?
		this.hard = hard;
		//coefficient of restitution
		this.e = elasticity;
		//hollow or filled?
		this.hollow = hollow;
		//inverse true is used for a border - the only non-colliding area is inside it
		this.inverse = false;
		
		//is this object visible?
		this.visible = visible;
		
		if (visible) {
			thisObject._visibleArray.push(this);
		}
		
		//can this object move?
		this.canMove = canMove;
		
		//is this object pinned?
		this.pin=false;
		
		//colour (HTML colour code with # missing)
		this.colour = colour;
		
		//used by whatever the engine is implemented as
		this.gameType = gameType;
		
		//moments of inertia
		this.mI = mass * radius * radius / 2;
		
		
		if (this.canMove) {
			thisObject._canMoveArray.push(this);
		}
		
		if (this.hard) {
			thisObject._hardArray.push(this);
		}
		
		thisObject._shapesArray.push(this);
		
		
		
		this.charge = 0;
		this.springs = new Array();
		this.cantCollideWithArray = new Array();
		/*
		this.addSpring = thisObject.addSpring;
		this.removeSpring = thisObject.removeSpring;
		this.breakAllSprings = thisObject.breakAllSprings;
		this.cantCollideWith = thisObject.cantCollideWith;
		this.canCollideWith = thisObject.canCollideWith;
		this.canCollideWithAll = thisObject.canCollideWithAll;
		this.giveCharge = thisObject.giveCharge;
		*/
	this.addSpring = function(springRef) {
		this.springs.push(springRef);
	}
	
	this.removeSpring = function(springRef) {
		removeFromArray(springRef, this.springs);
	}
	
	this.breakAllSprings = function() {
		//this.springs = new Array();
		//use the main physics class method to remove the spring properly
		while(this.springs.length > 0){
			thisObject.breakSpring(this.springs[0]);
		}
	}
	
	this.pinned=function(){
			return !(this.pin === false);
		}
	
	this.pinMe = function(fromCentre){
		//from centre: [dist,angle] vector of pin from centre of mass
		this.pin=fromCentre;
	}
	
	this.unPinMe = function(){
		this.pin=false;
	}
	
	
	this.cantCollideWith = function(withMe) {
		this.cantCollideWithArray.push(withMe);
	}
	
	this.canCollideWith = function(withMe) {
		removeFromArray(withMe, this.cantCollideWithArray);
	}
	
	this.canCollideWithAll = function() {
		this.cantCollideWithArray = new Array();
	}
	
	this.giveCharge = function(chargeMe) {
		if (chargeMe !== 0) {
			this.charge = chargeMe;
			if (!inArray(thisShape, thisObject._chargeArray)) {
				thisObject._chargeArray.push(thisShape);
			}
		}
		else {
			removeFromArray(this, thisObject._chargeArray)
			this.charge = 0;
		}
	}
		
		
	}
	
	//inheritFrom(this.BasicShape,this.Circle);
	
	this.Rod = function(length, position, angle, velocity, mass, force, hard, elasticity, canMove, visible, colour, gameType) {
		var thisShape=this;
		this.shape = 4;
		this.alive = true;
		
		//radius
		this._length = length;
		
		//dimensions object
		//this._d={"_r":radius};
		this.d = length / 2;
		/*
		 this.d=function()
		 {
		 return this._r;
		 }
		 */
		//position of centre, [x,y,angle]
		this.pos = position;
		if (this.pos.length < 3) {
			this.pos.push(angle);
		}
		//current velocity [x,y,angular]
		this.v = velocity;
		this.mass = mass;
		//permanent forces on this object [x,y,angular]
		this.f = force;
		
		//can collide?
		this.hard = hard;
		//coefficient of restitution
		this.e = elasticity;
		//hollow or filled?
		this.hollow = true;
		//inverse true is used for a border - the only non-colliding area is inside it
		this.inverse = false;
		
		//is this object visible?
		this.visible = visible;
		
		if (visible) {
			thisObject._visibleArray.push(this);
		}
		
		//can this object move?
		this.canMove = canMove;
		
		//is this object pinned?
		this.pin=false;
		
		//colour (HTML colour code with # missing)
		this.colour = colour;
		
		//used by whatever the engine is implemented as
		this.gameType = gameType;
		
		//moments of inertia
		this.mI = mass * length * length / 12;
		
		if (this.canMove) {
			thisObject._canMoveArray.push(this);
		}
		
		if (this.hard) {
			thisObject._hardArray.push(this);
		}
		
		thisObject._shapesArray.push(this);
		
		this.charge = 0;
		this.springs = new Array();
		this.cantCollideWithArray = new Array();
		/*
		this.addSpring = thisObject.addSpring;
		this.removeSpring = thisObject.removeSpring;
		this.breakAllSprings = thisObject.breakAllSprings;
		this.cantCollideWith = thisObject.cantCollideWith;
		this.canCollideWith = thisObject.canCollideWith;
		this.canCollideWithAll = thisObject.canCollideWithAll;
		this.giveCharge = thisObject.giveCharge;
		*/
		
		this.addSpring = function(springRef) {
		this.springs.push(springRef);
		}
		
		this.removeSpring = function(springRef) {
			removeFromArray(springRef, this.springs);
		}
		
		this.breakAllSprings = function() {
		//this.springs = new Array();
		//use the main physics class method to remove the spring properly
		while(this.springs.length > 0){
			thisObject.breakSpring(this.springs[0]);
		}
	}
		
		this.pinned=function(){
			return !(this.pin === false);
		}
		
		this.pinMe = function(fromCentre){
			//from centre: [dist,angle] vector of pin from centre of mass
			this.pin=fromCentre;
		}
		
		this.unPinMe = function(){
			this.pin=false;
		}
		
		this.cantCollideWith = function(withMe) {
			this.cantCollideWithArray.push(withMe);
		}
		
		this.canCollideWith = function(withMe) {
			removeFromArray(withMe, this.cantCollideWithArray);
		}
		
		this.canCollideWithAll = function() {
			this.cantCollideWithArray = new Array();
		}
		
		this.giveCharge = function(chargeMe) {
			if (chargeMe !== 0) {
				this.charge = chargeMe;
				if (!inArray(thisShape, thisObject._chargeArray)) {
					thisObject._chargeArray.push(thisShape);
				}
			}
			else {
				removeFromArray(this, thisObject._chargeArray)
				this.charge = 0;
			}
		}
	}
	//inheritFrom(this.BasicShape, this.Rod);
	
	this.HollowRectangle = function(width, height, position, elasticity, visible, colour, gameType) {
		var thisShape=this;
		this.shape = 2;
		//size
		this._width = width;
		this._height = height;
		
		//dimensions object
		//this._d={"_w":width,"_h":height};
		this.d = [width, height];
		/*
		 this.d=function()
		 {
		 return [this.width, this.height];
		 }
		 */
		//position of centre, [x,y,angle]
		this.pos = position;
		
		if (this.pos.length < 3) {
			this.pos.push(0);
		}
		
		//can collide?
		this.hard = true;
		//coefficient of restitution
		this.e = elasticity;
		//hollow or filled?
		this.hollow = true;
		//inverse true is used for a border - the only non-colliding area is inside it
		this.inverse = true;
		
		//is this object visible?
		this.visible = visible;
		
		if (visible) {
			thisObject._visibleArray.push(this);
		}
		
		//can this object move?
		this.canMove = false;
		//is this object pinned?
		this.pin = false;
		
		//colour (HTML colour code with # missing)
		this.colour = colour;
		
		this.mI = 1000;
		
		//used by whatever the engine is implemented as
		this.gameType = gameType;
		
		thisObject._hardArray.push(this);
		thisObject._shapesArray.push(this);
		
		this.charge = 0;
		this.springs = new Array();
		this.cantCollideWithArray = new Array();
		/*
		this.addSpring = thisObject.addSpring;
		this.removeSpring = thisObject.removeSpring;
		this.breakAllSprings = thisObject.breakAllSprings;
		this.cantCollideWith = thisObject.cantCollideWith;
		this.canCollideWith = thisObject.canCollideWith;
		this.canCollideWithAll = thisObject.canCollideWithAll;
		this.giveCharge = thisObject.giveCharge;
		*/
		this.addSpring = function(springRef) {
		this.springs.push(springRef);
		}
		
		this.removeSpring = function(springRef) {
			removeFromArray(springRef, this.springs);
		}
		
		this.breakAllSprings = function() {
			this.springs = new Array();
		}
		
		this.pinned=function(){
			return !(this.pin === false);
		}
		
		this.pinMe = function(fromCentre){
			//from centre: [dist,angle] vector of pin from centre of mass
			this.pin=fromCentre;
		}
		
		this.unPinMe = function(){
			this.pin=false;
		}
		
		this.cantCollideWith = function(withMe) {
			this.cantCollideWithArray.push(withMe);
		}
		
		this.canCollideWith = function(withMe) {
			removeFromArray(withMe, this.cantCollideWithArray);
		}
		
		this.canCollideWithAll = function() {
			this.cantCollideWithArray = new Array();
		}
		
		this.giveCharge = function(chargeMe) {
			if (chargeMe !== 0) {
				this.charge = chargeMe;
				if (!inArray(thisShape, thisObject._chargeArray)) {
					thisObject._chargeArray.push(thisShape);
				}
			}
			else {
				removeFromArray(this, thisObject._chargeArray)
				this.charge = 0;
			}
		}
	}
	
	this.calculateArea = function(coords) {
			/*
			 * Area = 0.5* SUM( i=0 -> N-1 ) { x_i * y_i+1 - x_i+1 * y_i }
			 *
			 * where n is number of vertaces assuming last vertix is the same as the first
			 */
			var area = 0;
			for (var i = 0; i < coords.length; i++) {
				var j = (i + 1) % coords.length;
				area += coords[i][0] * coords[j][1] - coords[j][0] * coords[i][1];
			}
			if (area < 0) {
				//negative area, reverse coords to give +ve results
				coords.reverse();
			}
			
			return Math.abs(area / 2);
		}
		
		this.calculateCentreOfMass = function(coords) {
			var area = this.calculateArea(coords);
			
			var xSum = 0;
			var ySum = 0;
			
			for (var i = 0; i < coords.length; i++) {
				var j = (i + 1) % coords.length;
				xSum += (coords[i][0] + coords[j][0]) * (coords[i][0] * coords[j][1] - coords[j][0] * coords[i][1]);
				ySum += (coords[i][1] + coords[j][1]) * (coords[i][0] * coords[j][1] - coords[j][0] * coords[i][1]);
			}
			
			xSum /= (6 * area);
			ySum /= (6 * area);
			
			return [xSum, ySum];
		}
	
	this.giveNewCoords=function(coords)
		{
			this._coords = coords;
			this.tidyCoords();
			this.d = {
				"modulii": this._rs,
				"angles": this._as,
				"boundingR": this._boundingR
				}
			this.mI = this.calculateMI();
		}
	
	this.calculateMI = function() {
		var topSum = 0;
		var bottomSum = 0;
		for (var i = 0; i < this._coords.length; i++) {
			var j = (i + 1) % this._coords.length;
			topSum += Math.modulus(Math.crossProduct(this._coords[j], this._coords[i])) * (Math.dotProduct(this._coords[j], this._coords[j]) + Math.dotProduct(this._coords[j], this._coords[i]) + Math.dotProduct(this._coords[i], this._coords[i]));
			bottomSum += Math.modulus(Math.crossProduct(this._coords[j], this._coords[i]));
		}
		
		return this.mass * topSum / (6 * bottomSum);
	}
	
	this.tidyCoords=function() {
			var centreOffset = thisObject.calculateCentreOfMass(this._coords);
			var biggestR = 0;
			//moduluses
			this._rs = new Array();
			//angles
			this._as = new Array();
			
			//re-align this._coords
			for (var i = 0; i < this._coords.length; i++) {
				this._coords[i][0] -= centreOffset[0];
				this._coords[i][1] -= centreOffset[1];
				
				var r = Math.modulus(this._coords[i]);
				
				if (r > biggestR) {
					biggestR = r;
				}
				
				var angle = Math.atan2(this._coords[i][1], this._coords[i][0])
				
				if (angle < 0) {
					angle += Math.PI * 2;
				}
				
				if (angle > Math.PI * 2) {
					angle -= Math.PI * 2;
				}
				
				this._rs.push(r);
				this._as.push(angle);
				this._boundingR = biggestR;
			}
		}
	
	this.Polygon = function(coords, position, angle, velocity, mass, force, hard, elasticity, hollow, canMove, visible, colour, gameType) {
	
		var thisShape=this;
		
		//align this._coords so centre is also centre of mass and create radial coords system
		this.tidyCoords = thisObject.tidyCoords;
		this.calculateMI = thisObject.calculateMI;
		this.giveNewCoords=thisObject.giveNewCoords;
		
		this.shape = 3;
		this.alive = true;
		
		this._coords = coords;
		
		this.tidyCoords();
		
		
		
		//dimensions object
		//this._d={"_r":radius};
		this.d = {
			"modulii": this._rs,
			"angles": this._as,
			"boundingR": this._boundingR
		}
		
		//position of centre, [x,y,angle]
		this.pos = position;
		if (this.pos.length < 3) {
			this.pos.push(angle);
		}
		//current velocity [x,y,angular]
		this.v = velocity;
		this.mass = mass;
		//permanent forces on this object [x,y,angular]
		this.f = force;
		//can collide?
		this.hard = hard;
		//coefficient of restitution
		this.e = elasticity;
		//hollow or filled?
		this.hollow = hollow;
		//inverse true is used for a border - the only non-colliding area is inside it
		this.inverse = false;
		
		//is this object visible?
		this.visible = visible;
		
		if (visible) {
			thisObject._visibleArray.push(this);
		}
		
		//can this object move?
		this.canMove = canMove;
		
		//is this object pinned?
		this.pin=false;
		
		//colour (HTML colour code with # missing)
		this.colour = colour;
		
		//used by whatever the engine is implemented as
		this.gameType = gameType;
		
		//moments of inertia
		this.mI = this.calculateMI();
		
		this.charge = 0;
		
		if (this.canMove) {
			thisObject._canMoveArray.push(this);
		}
		
		if (this.hard) {
			thisObject._hardArray.push(this);
		}
		
		thisObject._shapesArray.push(this);
		
		this.charge = 0;
		this.springs = new Array();
		this.cantCollideWithArray = new Array();
		/*
		this.addSpring = thisObject.addSpring;
		this.removeSpring = thisObject.removeSpring;
		this.breakAllSprings = thisObject.breakAllSprings;
		this.cantCollideWith = thisObject.cantCollideWith;
		this.canCollideWith = thisObject.canCollideWith;
		this.canCollideWithAll = thisObject.canCollideWithAll;
		this.giveCharge = thisObject.giveCharge;
		*/
		
		this.addSpring = function(springRef) {
		this.springs.push(springRef);
		}
		
		this.removeSpring = function(springRef) {
			removeFromArray(springRef, this.springs);
		}
		
		this.breakAllSprings = function() {
		//this.springs = new Array();
		//use the main physics class method to remove the spring properly
		while(this.springs.length > 0){
			thisObject.breakSpring(this.springs[0]);
		}
	}
		
		this.cantCollideWith = function(withMe) {
			this.cantCollideWithArray.push(withMe);
		}
		
		this.canCollideWith = function(withMe) {
			removeFromArray(withMe, this.cantCollideWithArray);
		}
		
		this.canCollideWithAll = function() {
			this.cantCollideWithArray = new Array();
		}
		
		this.pinned=function(){
			return !(this.pin === false);
		}
		
		this.pinMe = function(fromCentre){
			//from centre: [dist,angle] vector of pin from centre of mass
			this.pin=fromCentre;
		}
		
		this.unPinMe = function(){
			this.pin=false;
		}
		
		this.giveCharge = function(chargeMe) {
			if (chargeMe !== 0) {
				this.charge = chargeMe;
				if (!inArray(thisShape, thisObject._chargeArray)) {
					thisObject._chargeArray.push(thisShape);
				}
			}
			else {
				removeFromArray(this, thisObject._chargeArray)
				this.charge = 0;
			}
		}
	}

	//need to add old-style rectangle - one that can move and collide but not rotate.  this could be used for characters and things.
}
