var TreeObject=new Object();

TreeObject.canvas=document.getElementById('canvastagid').getContext('2d');

TreeObject.trees=new Array();
TreeObject.tree=function(x,y,iterations,branchings,size,steps)
  {
	this.root=[x,y];
	this.iterations=iterations;
	this.iteration=0;
	this.branchings=branchings;
	this.size=size;
	
	this.steps=steps;
	this.alive=true;
	
	this.branches=new Array();
	this.branches.push(new TreeObject.branch(this.root , [this.root[0],this.root[1]-this.size] , this.steps) )
	//idea for angles and stuff:
	//angle[iteration][branchnum]
	
	TreeObject.trees.push(this); 
	}

//for next itteration: if(i==branches.length-1) {start next iteration}
	
TreeObject.branch=function(start,finish,steps)
  {
	this.start=start;
	this.finish=finish;
	this.steps=steps
	this.progress=0;
	
	this.alive=true;
	
	this.dx=(finish[0]-start[0])/steps
	this.dy=(finish[1]-start[1])/steps
	//alert([this.dx,this.dy])
	}
	


TreeObject.loop=function()
  {
	for(var t=0;t<TreeObject.trees.length;t++)
  	{
		if(TreeObject.trees[t].alive)
  		{
    	for(var i=0;i<TreeObject.trees[t].branches.length;i++)
    	  {
  			if(TreeObject.trees[t].branches[i].alive)
    			{
					//alert(TreeObject.trees[t].branches[i].start)
					
  				//for each branch that is alive, draw a bit more.
					TreeObject.canvas.beginPath();
      		TreeObject.canvas.moveTo(TreeObject.trees[t].branches[i].start[0]+TreeObject.trees[t].branches[i].dx*TreeObject.trees[t].branches[i].progress , TreeObject.trees[t].branches[i].start[1]+TreeObject.trees[t].branches[i].dy*TreeObject.trees[t].branches[i].progress)
      		TreeObject.trees[t].branches[i].progress++
      		TreeObject.canvas.lineTo(TreeObject.trees[t].branches[i].start[0]+TreeObject.trees[t].branches[i].dx*TreeObject.trees[t].branches[i].progress , TreeObject.trees[t].branches[i].start[1]+TreeObject.trees[t].branches[i].dy*TreeObject.trees[t].branches[i].progress)
					TreeObject.canvas.stroke();
    			}
    		}
  		
    	if(TreeObject.trees[t].branches[TreeObject.trees[t].branches.length-1].progress >= TreeObject.trees[t].steps)
  		  {
  			//all live branches for this tree grown to full length
  			TreeObject.trees[t].iteration++;
  			TreeObject.trees[t].size*=0.75;
  			if(TreeObject.trees[t].iteration<TreeObject.trees[t].iterations)
  				{
    			tempbranches=TreeObject.trees[t].branches.length;
    			for(var b=0;b<tempbranches;b++)
    			  {
    				if(TreeObject.trees[t].branches[b].alive)
    				  {
    					TreeObject.trees[t].branches[b].alive=false;
    					//create the new branches starting from the end of this branch
    					
    					for(var b2=0;b2<TreeObject.trees[t].branchings;b2++)
    					  {
								//alert(b2)
    						//angle of branch which has just stopped
    						oldangle=Math.atan2(TreeObject.trees[t].branches[b].finish[1]-TreeObject.trees[t].branches[b].start[1] , TreeObject.trees[t].branches[b].finish[0]-TreeObject.trees[t].branches[b].start[0])
    						
    						newangle=oldangle+ Math.random()*Math.PI*0.8 - Math.PI*0.4;
    						//alert([TreeObject.trees[t].branches[b].finish , [TreeObject.trees[t].branches[b].finish[0]+Math.cos(newangle)*TreeObject.trees[t].size , TreeObject.trees[t].branches[b].finish[1]+Math.sin(newangle)*TreeObject.trees[t].size] , TreeObject.trees[t].branchings])
    						TreeObject.trees[t].branches.push(new TreeObject.branch(TreeObject.trees[t].branches[b].finish , [TreeObject.trees[t].branches[b].finish[0]+Math.cos(newangle)*TreeObject.trees[t].size , TreeObject.trees[t].branches[b].finish[1]+Math.sin(newangle)*TreeObject.trees[t].size] , TreeObject.trees[t].steps))
    						}//new branches loop
    					}//branch was alive
    				}//branches loop
    			}
				else
				  {
					//tree grown too much
					TreeObject.trees[t].alive=false;
					}
				}//all grown
  		}//tree alive
  	}//tree loop
	}

TreeObject.loopme=setInterval(TreeObject.loop,200)

new TreeObject.tree(250,500,5,4,100,5)