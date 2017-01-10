/**
 * @author Luke
 */
var test=new Object();



test.load=function()
{
	test.IE=(typeof(IE) != "undefined" && IE);
	
	alert(test.IE)
	
	test.div=document.getElementById('testEngineDiv');
	
	test.width=parseInt(test.div.style.width);
	test.height=parseInt(test.div.style.height);
	
	test.canvasTag = document.createElement("canvas");
	test.div.appendChild(test.canvasTag);
	
	test.canvasTag.width=test.width;
	test.canvasTag.height=test.height;
	
	if(test.IE)
	{
		//test.canvas = 
		G_vmlCanvasManager.initElement(test.canvas);
	}
	
	if (test.canvasTag.getContext) 
	{
		test.canvas = test.canvasTag.getContext('2d');
	}
	
	test.physics=new PhysicsClass([00,100], 0);
	test.render=new RenderClass();
	
	test.viewPort = new test.render.Viewport(test.canvas,0,0,test.width,test.height,1,1,true);
	
	test.physics.addHollowRectangle(test.width-4, test.height-4, [0.5,0.5], 1, true, "000000", 'border');
	
	/*
	var circle1 = new test.physics.Circle(50, [-200,-100], 0, [0,0,-1], 50, [0,0,0], true, 1, false, false, true, "FFFF00", 'circle')
	
	var circle2 = new test.physics.Circle(50, [200,-100], 0, [0,0,2], 50, [0,0,0], true, 1, true, false, true, "006600", 'circle')
	
	//(shapeA,distA,angleA,shapeB,distB,angleB,length,strength)
	//test.physics.springBetween(circle1,50,0,circle2,50,0,0,5000);
	
	test.physics.stringBetween (circle1,20,0,circle2,50,0,20,500,5000)
	
	//circle1.cantCollideWith(circle2)
	//circle2.cantCollideWith(circle1);
	//test.physics.addRod(100, [0,-200], 0, [-200,0,0], 50, [0,0,0], true, 1, true, true, "000000", "rod");
	
	test.physics.addCircle(50, [0,-200], 0, [0,0,-1], 50, [0,0,0], true, 1, false, true, true, "FFFF00", 'circle')
	*/
	//var poly = new test.physics.Polygon([[-100,-50],[-100,50],[100,50],[100,-50]], [0,150], 0, [0,0,0], 200, [0,0,0], true, 1, false, true, true, "FF6600", "poly")
	
	//circle1.giveCharge(10);
	//circle2.giveCharge(10);
	
	//test.physics.addCircle(50, [-100,10], 0, [0,0,20], 50, [0,0,0], true, 1, true, false, false, true, "006600", 'circle')
	
	
	var circle=new test.physics.Circle(50, [-300,-150], 0, [0,-10,20], 50, [0,0,0], true, 1, false, true, true, "FFFF00", 'circle')
	//[[-50,-50],[-50,50],[50,50],[50,-50]]
	test.physics.addPolygon([[-100,-50],[-100,50],[0,50],[0,-50]], [-50,50], 0, [0,0,0], 50, [0,0,0], true, 1, false, true, true, "ff0000", "poly")
	
	
	//test.physics.addPolygon([[-100,-50],[-100,50],[0,50],[0,-50]], [-90,-150], 0, [0,0,0], 200, [0,0,0], true, 1, false, false, true, true, "006600", "poly")
	
	new test.physics.Polygon([[-50,50],[50,50],[0,-43]], [100,0], 0, [0,0,0], 100, [0,0,0], true, 1, false, true, true, "0000FF", "poly")
	
	test.physics.addPolygon([[-100,-50],[-100,50],[100,50],[100,-50]], [200,-150], 0, [0,0,0], 200, [0,0,0], true, 1, false, true, true, "FF6600", "poly")
	
	test.physics.addPolygon([[-50,-30],[-50,30],[10,50],[50,0],[10,-50]], [-200,-150], 0, [0,0,0], 200, [0,0,0], true, 1, false, true, true, "006600", "poly")
	
	test.physics.addPolygon([[-25,-40],[50,-40],[25,30],[-50,30]], [-200,250], 0, [0,0,0], 200, [0,0,0], true, 1, false, true, true, "3300FF", "poly")
	
	
	
	//Rod = function(length, position, angle, velocity, mass, force, hard, elasticity, group, canMove, visible, colour, gameType){
	
	//test.physics.addRod(100, [0,0], Math.PI/4, [-200,0,0], 50, [0,0,0], true, 1, true, true, "000000", "rod");
	
	//test.physics.addPolygon([[-50,-0.5],[50,-0.5],[50,0.5], [-50,0.5]], [0,0], 0, [-200,0,0], 100, [0,0,0], true, 1, false, true, true, "666600", "poly")
	
	//test.physics.addPolygon([[-50,-50],[50,-50],[0,20.7]], [0,0], 0, [0,0,0], 100, [0,0,0], true, 1, false, false, true, true, "666600", "poly")
	/*
	var collide = test.physics._detect.checkForCollision(circle.pos, circle.d,!circle.hollow, circle.pos[2], circle.shape, poly.pos, poly.d, !poly.hollow, poly.pos[2], poly.shape);
	
	
	//alert([circle.pos, circle.d, circle.filled, circle.pos[2], circle.shape, poly.pos, poly.d, poly.filled, poly.a, poly.shape].toSource())
	
	alert(collide.toSource())
	//test.physics.advance(0.01);
	*/
	test.render.drawViewport(test.viewPort,test.physics._visibleArray,test.physics._springArray);
	
	test.loopRef=setInterval(test.loopFunc,20);
}

test.loopFunc=function()
{
	test.physics.advance(0.01);
	
	test.render.drawViewport(test.viewPort,test.physics._visibleArray,test.physics._springArray);
}

myAddEvent(window, 'onload', test.load);