// AnimationTest.js

//namespaces
var AnimationTest=new Object();

AnimationTest.load=function()
{

    //AnimationTest.canvasTag=document.getElementById('AnimationCanvas');
    //<canvas id="AnimationCanvas" width=600 height=600></canvas>
    AnimationTest.div=document.getElementById('AnimationDiv');
    
    //AnimationTest.canvasTag=document.createElement("canvas");
    //AnimationTest.canvasTag.id="AnimationCanvas";
         
    AnimationTest.width=parseInt(AnimationTest.div.style.width);
    AnimationTest.height=parseInt(AnimationTest.div.style.height);
   /* AnimationTest.canvasTag.width=AnimationTest.width;
    AnimationTest.canvasTag.height=AnimationTest.height;

    AnimationTest.div.appendChild(AnimationTest.canvasTag);
*/
    AnimationTest.canvasTag=document.getElementById('AnimationCanvas');

    if (AnimationTest.canvasTag.getContext)
    {
        AnimationTest.canvas = AnimationTest.canvasTag.getContext('2d');
        alert('canvas');
        
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
    /*AnimationTest.animationObj=new Animation(AnimationTest.canvas,clearCanvas,finish,true,false);

   AnimationTest.tree=new TreeClass([300,600],3,6,Math.PI/2,[255,255,0,1],[255,0,0,1],60,-Math.PI/2,3,1)
   AnimationTest.tree.grow();
   */
   //AnimationTest.tree.drawMe(AnimationTest.canvas)
   //AnimationTest.canvas.beginPath();
   AnimationTest.canvas.fillStyle="rgb(255,0,0)";
   AnimationTest.canvas.fillRect(50,50,200,200);
   alert('drawn')
  // AnimationTest.tree.drawMe(AnimationTest.canvas,188.4);
  //AnimationTest.animationObj.MakeTree(AnimationTest.tree,100)
}


AnimationTest.simpleLoad=function(){

    var finish=function(){
        AnimationTest.tree.drawMe(AnimationTest.animationObj.canvas);
        AnimationTest.tree.grow();
        setTimeout(function(){AnimationTest.animationObj.MakeTree(AnimationTest.tree,100)},2000);
    }

    AnimationTest.animationObj=loadSimpleAnimationFromCanvas("AnimationCanvas",finish);

    AnimationTest.tree=new TreeClass([300,600],3,6,Math.PI/2,[255,255,0,1],[255,0,0,1],60,-Math.PI/2,3,1)
    AnimationTest.tree.grow();
    AnimationTest.animationObj.MakeTree(AnimationTest.tree,100)
    //AnimationTest.tree.drawMe(AnimationTest.animationObj.canvas);
}

myAddEvent(window,'onload',AnimationTest.simpleLoad);
//myAddEvent(window,'onload',AnimationTest.load);





