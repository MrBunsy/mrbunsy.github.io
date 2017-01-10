// AnimationTest.js

//namespaces
var AnimationTest=new Object();

AnimationTest.load=function()
{

    //AnimationTest.canvasTag=document.getElementById('AnimationCanvas');
    //<canvas id="AnimationCanvas" width=600 height=600></canvas>
    AnimationTest.div=document.getElementById('AnimationDiv');
    AnimationTest.canvasTag=document.createElement("canvas");
    AnimationTest.canvasTag.id="AnimationCanvas";
         
    AnimationTest.width=parseInt(AnimationTest.div.style.width);
    AnimationTest.height=parseInt(AnimationTest.div.style.height);
    AnimationTest.canvasTag.width=AnimationTest.width;
    AnimationTest.canvasTag.height=AnimationTest.height;

    AnimationTest.div.appendChild(AnimationTest.canvasTag);

    if (AnimationTest.canvasTag.getContext)
    {
        AnimationTest.canvas = AnimationTest.canvasTag.getContext('2d');
    }
	
    //override
    var clearCanvas=function()
    {
        AnimationTest.canvas.clearRect(0,0,AnimationTest.width,AnimationTest.height);
    }
	
    var finish=function(){
        //AnimationTest.animationObj.MakeExplosion([200,200],50);
        //AnimationTest.animationObj.MakeSkiingRobot([200,200],100,200,10);
         //AnimationTest.animationObj.MakeTree(AnimationTest.tree,100)
        // AnimationTest.animationObj.ForceLoopStop();
        AnimationTest.tree.drawMe(AnimationTest.canvas);
        AnimationTest.tree.grow();
        setTimeout(function(){AnimationTest.animationObj.MakeTree(AnimationTest.tree,100)},2000);
    }
	
    //Animation.loopMe=setInterval(function(){AnimationTest.canvas.clearRect(0,0,AnimationTest.width,AnimationTest.height);Animation.loop();},Animation.framePeriod);
	
    //new Animation.explosionParticle([100,100],0,20,AnimationTest.canvas,[255,0,0,1],[128,128,128,0],10);
	
    //this.animationObj=new Animation(clearCanvas,finish,AnimationTest.canvas);
    AnimationTest.animationObj=new Animation(clearCanvas,finish,AnimationTest.canvas,true,false)
	
    //AnimationTest.animationObj.MakeExplosion([200,200],20);
   // AnimationTest.animationObj.MakeSkiingRobot([200,200],100,200,10);
   //AnimationTest.tree=new TreeClass([200,200],3,3,Math.PI/2,[255,255,0,0.5],[255,255,0,0.5],50,Math.PI/2,2,2);
   AnimationTest.tree=new TreeClass([300,600],3,6,Math.PI/2,[255,255,0,1],[255,0,0,1],60,-Math.PI/2,3,1)
   //AnimationTest.tree=new TreeClass([300,600],3,6,Math.PI/2,[25,43,29,1],[121,136,52,1],60,-Math.PI/2,3,1)
   AnimationTest.tree.grow();
  // AnimationTest.tree.drawMe(AnimationTest.canvas,188.4);
  AnimationTest.animationObj.MakeTree(AnimationTest.tree,100)
}

myAddEvent(window,'onload',AnimationTest.load);





// ----------------- Common functions --------------------

function myAddEvent(obj,event,func) {
    //adapted from a function by Todd Anthony Spartaforce http://spatacoli.com/storydisplay.aspx?reqid=5463c334-0d6f-425a-94cd-fe5ead3634e7
    //needed a non-destructive cross-browser method for adding event listeners
    var oldevent = obj[event];
    if (typeof obj[event] != 'function')
        obj[event] = func;
    else {
        obj[event] = function() {
            oldevent();
            func();
        };
    }
} 

