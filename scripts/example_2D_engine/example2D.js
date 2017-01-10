//namespace
var Engine=new Object();

//array of entities in the world
Engine.entityArray=new Array();
Engine.loopEvery=50;

//called when page has finished loading
Engine.OnLoad=function()
{
	Engine.canvasTag=document.getElementById('example2Dcanvastag');
	
	Engine.worldWidth=parseInt(Engine.canvasTag.width);
	Engine.worldHeight=parseInt(Engine.canvasTag.height);
	
	if (Engine.canvasTag)
    {
		//create the canvas object we can draw to
    	Engine.canvas = Engine.canvasTag.getContext('2d');
    }
	
	Engine.loopMe=setInterval(Engine.LoopMe,Engine.loopEvery);
	
	//just a temp thing to spawn stuff
	Engine.spawnStuff=setInterval(Engine.spawnStuff,500);
	Engine.spawnStuff();
	
}


Engine.lastSpawnAngle=0;
//just a temp function to spawn random things
Engine.spawnStuff=function()
{
	Engine.lastSpawnAngle+=0.4;
	new Engine.Entity(Engine.worldWidth/2 , Engine.worldHeight/2 , 80*Math.cos(Engine.lastSpawnAngle),80*Math.sin(Engine.lastSpawnAngle),20);
}

//main function to be called every loopEvery miliseconds
Engine.LoopMe=function()
{
	//advance physics by loopEvery seconds 1ms = 1/1000s
	Engine.PhysicsLoopMe(Engine.loopEvery/1000);
	//re-draw the world so we can see what's happened
	Engine.RenderLoopMe();
}

//Entity class
Engine.Entity=function(posX,posY,speedX,speedY,radius)
{
	//position
	this.pos=[posX,posY];
	//velocity
	this.v=[speedX,speedY];
	
	//what radius?
	this.r=radius;
	
	//add a reference to the entity array
	Engine.entityArray.push(this);
}

//function to increment physics
Engine.PhysicsLoopMe=function(timeStep)
{
	for(var i=0;i<Engine.entityArray.length;i++)
	{
		//looping through all the entities
		
		//update position  s=ut
		Engine.entityArray[i].pos[0]+=Engine.entityArray[i].v[0]*timeStep;
		Engine.entityArray[i].pos[1]+=Engine.entityArray[i].v[1]*timeStep;
	}
}

//function to draw world on canvas
Engine.RenderLoopMe=function()
{
	//alert([0,0,Engine.worldWidth,Engine.worldHeight])
	//clear old canvas
	Engine.canvas.clearRect(0,0,Engine.worldWidth,Engine.worldHeight);
	
	for (var i = 0; i < Engine.entityArray.length; i++)
	{
		//draw a circle for each entity
		Engine.canvas.beginPath();
		Engine.canvas.arc(Engine.entityArray[i].pos[0] , Engine.entityArray[i].pos[1] , Engine.entityArray[i].r , 0, Math.PI*2,false);
		Engine.canvas.fill();
	}
		
}

//set up onLoad function to be called when page is loaded

window.onload=Engine.OnLoad;
