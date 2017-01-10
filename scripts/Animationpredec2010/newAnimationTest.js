/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var AnimationTest=new Object();
AnimationTest.loadAnimation=function(){

    var finish=function(){
       // AnimationTest.tree.drawMe(AnimationTest.animationObj.canvas);
        //AnimationTest.tree.grow();
        //setTimeout(function(){AnimationTest.animationObj.MakeTree(AnimationTest.tree,100)},2000);
         AnimationTest.animationObj.MakeFire([300,500],45,4,100);
         AnimationTest.animationObj.MakeFire([320,500],40,2,100);
         AnimationTest.animationObj.MakeFire([280,500],40,2,100);
    }

    AnimationTest.animationObj=loadSimpleAnimationFromCanvas("harmonographCanvas",finish);
     //animationObj.canvas.fillStyle="rgb(255,0,0)";
     //animationObj.canvas.fillRect(50,50,200,200);
    AnimationTest.tree=new TreeClass([300,600],3,6,Math.PI/2,[255,255,0,1],[255,0,0,1],60,-Math.PI/2,3,1)
    AnimationTest.tree.grow();
    //AnimationTest.animationObj.MakeTree(AnimationTest.tree,100)
    

   //AnimationTest.animationObj.MakeFireParticle([200,200], -Math.PI/2, 10, 200, 0.1, Math.PI/3, 100, 20, AnimationGetExplosionColour(1), [128,128,128,0.5], 30)
   AnimationTest.animationObj.MakeFire([300,500],150,4,100);
   AnimationTest.animationObj.MakeFire([320,500],100,2,100);
   AnimationTest.animationObj.MakeFire([280,500],100,2,100);
    //AnimationTest.tree.drawMe(AnimationTest.animationObj.canvas);
}

myAddEvent(window,'onload',AnimationTest.loadAnimation);