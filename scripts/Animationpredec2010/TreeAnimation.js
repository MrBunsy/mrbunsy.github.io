/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


Animation.prototype.MakeTree = function(tree,stages)
{
	//animate an explosion
	this.animations.push(new TreeAnimation(tree,this.canvas,this,stages));
	this.start();

}


var TreeAnimation=function(tree,canvas, animationObject,stages){

        this.canvas=canvas;
	this.tree=tree;
        this.fullHeight=tree.getFullHeight();
        //this.tree.grow();
        this.animationObject=animationObject;

	this.stages=stages;
	this.stage=0;

	this.dheight=this.fullHeight/stages;

	this.drawNext = function(still)
	{

                this.tree.drawMe(this.canvas,this.stage*this.dheight);

                if (!still)
		{
			this.stage++;
		}

		if(this.stage >= this.stages)
		{
			return true;
		}

		return false;
	}
}