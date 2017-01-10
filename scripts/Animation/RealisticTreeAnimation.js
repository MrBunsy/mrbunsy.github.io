/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


Animation.prototype.MakeRealisticTree = function(tree,stages)
{
	//animate an explosion
	this.animations.push(new RealisticTreeAnimation(tree,this.canvas,this,stages));
	this.start();

}


var RealisticTreeAnimation=function(tree,canvas, animationObject,stages){

        this.canvas=canvas;
	this.tree=tree;
        this.fullHeight=tree.getFullHeight();
        this.fullLevel=tree.getTotalLevels();
        //this.tree.grow();
        this.animationObject=animationObject;

	this.stages=stages;
	this.stage=0;

        this.fakeStage=0;

	this.dheight=this.fullHeight/stages;
        this.dLevel=this.fullLevel/stages;

        //how many stages each level has to grow
        //eg branchStages[3] = how many stages there are left for level 3 to grow to full length
        this.branchStages=[];
        this.branchDGrowths=[];

        this.getLevel=function(stage){
            return Math.ceil(stage*this.dLevel+0.1);
        }

        var oldLevel=-1;
        for(var i=0;i<this.stages;i++){
            var testLevel=this.getLevel(i);
            if(testLevel>oldLevel){
                oldLevel=testLevel;
                //this.branchStages.push(this.stages-i);
                this.branchStages.push(i)
                //this.branchDGrowths.push(this.fullHeight/(this.stages-i));
                this.branchDGrowths.push(1/(this.stages-i));
            }

        }
        //console.log(this.branchStages)
        this.getBranchLengths=function(stage){
            var branchLengths=[];

            for(var l=0;l<this.getLevel(stage);l++){
                //console.log((this.branchStages[i]-stage)*this.branchDGrowths[i])
                branchLengths.push((stage-this.branchStages[l])*this.branchDGrowths[l]);
                //console.log(["level: "+l,"stages into:"+(stage-this.branchStages[l])])
            }
            if(branchLengths.length==0){
                branchLengths.push(0)
            }
           // console.log(branchLengths)
            return branchLengths;
        }

	this.drawNext = function(still)
	{

                //this.tree.draw(this.canvas,this.stage*this.dheight,this.fullLevel);//Math.ceil(this.stage*this.dLevel)
                this.tree.draw(this.canvas,this.getLevel(this.fakeStage),this.getBranchLengths(this.fakeStage));
                //console.log([this.getLevel(this.stage),this.getBranchLengths(this.stage)]);
                if (!still)
		{
                    //we are using a fakeStage system to decrease the speed at which the tree grows as it gets older.  otherwise the compounding of each stage growing means it speeds up a lot!

                        //this will count up to about 1 more than the full stages, not quite sure why
                        this.fakeStage+=2-2*(this.stage)/this.stages;
                        //but this check ensures the tree never grows more than it should
                        if(this.fakeStage>=this.stages){
                            this.fakeStage=this.stages;
                        }
                        this.stage++;
                       //console.log([this.stage,this.fakeStage])
		}

		if(this.stage >= this.stages)
                //if(this.fakeStage >= this.stages)
		{
			return true;
		}

		return false;
	}
}