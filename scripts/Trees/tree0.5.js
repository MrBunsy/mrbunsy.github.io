var TreeObject=new Object();

TreeObject.load=function()
  {
	TreeObject.trees=new Array();
	
	if(document.getElementById('canvastagid').getContext)
    {
  	TreeObject.canvas=document.getElementById('canvastagid').getContext('2d');
  	}
	
	if (/MSIE/.test(navigator.userAgent) && !window.opera)
	  {
		TreeObject.IE=true;
		}
	
  TreeObject.loopme=setInterval(TreeObject.loop,200)
  //new TreeObject.tree(250,500,5,4,100,5)
  //(x,y,iterations,branchings,size,steps,thick,ratio,colour)
	
  TreeObject.canvas.fillStyle="rgb(170,240,255)";
	TreeObject.canvas.fillRect(0,0,500,450);
	
	TreeObject.canvas.fillStyle="rgb(20,200,0)";
	TreeObject.canvas.fillRect(0,450,500,50);
	
  TreeObject.canvas.lineCap="round";
  
	
	document.getElementById('iterations').value=5;
	document.getElementById('branchings').value=4;
	document.getElementById('size').value=100;
	document.getElementById('steps').value=5;
	document.getElementById('thick0').value=3;
	document.getElementById('thick1').value=1;
	document.getElementById('ratio').value=0.8;
	document.getElementById('angle').value=0.8;
	//[ [204,153,0] , [50,200,0] ]
  new TreeObject.tree(250,450,5,4,100,5,[3,3],0.8, [[0,0,0],[255,0,0]] , 0.5 , 0);
	}
	
TreeObject.clear=function()
  {
	
	TreeObject.canvas.clearRect(0,0,500,500)
	TreeObject.canvas.fillStyle="rgb(170,240,255)";
	TreeObject.canvas.fillRect(0,0,500,450);
	clearInterval(TreeObject.loopme);
	TreeObject.trees=new Array();
	
	TreeObject.canvas.fillStyle="rgb(20,200,0)";
	TreeObject.canvas.fillRect(0,450,500,50);
	
	
	}

TreeObject.tree=function(x,y,iterations,branchings,size,steps,thick,ratio,colour,angle,leaves)
  {
	this.root=[x,y];
	this.iterations=iterations;
	this.iteration=0;
	//how many new branches each iteration
	this.branchings=branchings;
	
	//length of first branch
	this.size=size;
	
	//number of steps in drawing each branch.
	this.steps=steps;
	
	this.startsize=size;
	
	//array: [start, end]
	this.thick=thick
	this.dthick=(thick[1]-thick[0])/iterations
	
	//proportion of size to retain each iteration
	this.ratio=ratio
	
	//array:  [ start , finish  ]' start+finish: [ R , G , B  ]'
	this.colour=colour;
	this.dcolour=[ (colour[1][0]-colour[0][0])/iterations , (colour[1][1]-colour[0][1])/iterations , (colour[1][2]-colour[0][2])/iterations];
	
	//angle in fraction of pi which branches can go in
	this.angle=angle;
	
	//false:no leaves, 0=circles
	this.leaves=leaves
	
	this.leafcolour="rgb(0,200,0)";
	
	this.alive=true;
	
	this.branches=new Array();
	this.branches.push(new TreeObject.branch(this.root , [this.root[0],this.root[1]-this.size] , this.steps) , false )
	//idea for angles and stuff:
	//angle[iteration][branchnum]
	
	TreeObject.trees.push(this); 
	}

	
TreeObject.branch=function(start,finish,steps,drawLeaves)
  {
	this.start=start;
	this.finish=finish;
	this.steps=steps
	this.progress=0;
	
	this.alive=true;
	this.drawLeaves=drawLeaves;
	
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
			
			//for each branch that is alive, draw a bit more.
			TreeObject.canvas.beginPath();
			//set thickness of line
			TreeObject.canvas.lineWidth=TreeObject.trees[t].thick[0]+TreeObject.trees[t].dthick*TreeObject.trees[t].iteration;
			if(TreeObject.trees[t].branches[TreeObject.trees[t].branches.length-1].drawLeaves)
			  {
				//will be filling leaves
				TreeObject.canvas.fillStyle=TreeObject.trees[t].leafcolour;
				}
			else
			  {
				//will be stroking branches
				TreeObject.canvas.strokeStyle="rgb("+Math.round(TreeObject.trees[t].colour[0][0]+TreeObject.trees[t].dcolour[0]*TreeObject.trees[t].iteration)+","+Math.round(TreeObject.trees[t].colour[0][1]+TreeObject.trees[t].dcolour[1]*TreeObject.trees[t].iteration)+","+Math.round(TreeObject.trees[t].colour[0][2]+TreeObject.trees[t].dcolour[2]*TreeObject.trees[t].iteration)+")";
				}
			
    	for(var i=0;i<TreeObject.trees[t].branches.length;i++)
    	  {
  			if(TreeObject.trees[t].branches[i].alive)
    			{
					TreeObject.canvas.moveTo(TreeObject.trees[t].branches[i].start[0]+TreeObject.trees[t].branches[i].dx*TreeObject.trees[t].branches[i].progress , TreeObject.trees[t].branches[i].start[1]+TreeObject.trees[t].branches[i].dy*TreeObject.trees[t].branches[i].progress)
      		TreeObject.trees[t].branches[i].progress++
      		TreeObject.canvas.lineTo(TreeObject.trees[t].branches[i].start[0]+TreeObject.trees[t].branches[i].dx*TreeObject.trees[t].branches[i].progress , TreeObject.trees[t].branches[i].start[1]+TreeObject.trees[t].branches[i].dy*TreeObject.trees[t].branches[i].progress)
    			}
				else if(TreeObject.trees[t].branches[i].drawLeaves)
				  {
					switch(TreeObject.trees[t].leaves)
					  {
						case 0://draw circles
						TreeObject.canvas.moveTo(TreeObject.trees[t].branches[i].finish[0]+TreeObject.trees[t].size/10 , TreeObject.trees[t].branches[i].finish[1])
						TreeObject.canvas.arc(TreeObject.trees[t].branches[i].finish[0] , TreeObject.trees[t].branches[i].finish[1] , TreeObject.trees[t].size/10 , 0 , Math.PI*2 , false)
						break;
						}
					}
    		}
			if(TreeObject.trees[t].branches[TreeObject.trees[t].branches.length-1].drawLeaves)
			  {
				TreeObject.canvas.fill();
				}	
			else
  		  {
				TreeObject.canvas.stroke();
				}
			alert(TreeObject.trees[t].branches.length)
			alert(TreeObject.trees[t].branches[TreeObject.trees[t].branches.length-1].progress)
    	if(TreeObject.trees[t].branches[TreeObject.trees[t].branches.length-1].progress >= TreeObject.trees[t].steps)
  		  {
						alert('pop')
  			//all live branches for this tree grown to full length
  			TreeObject.trees[t].iteration++;
				//reduce length
  			TreeObject.trees[t].size*=TreeObject.trees[t].ratio;

  			if(TreeObject.trees[t].iteration <= TreeObject.trees[t].iterations)
  				{
							
    			tempbranches=TreeObject.trees[t].branches.length;
    			for(var b=0;b<tempbranches;b++)
    			  {
    				if(TreeObject.trees[t].branches[b].alive)
    				  {
    					TreeObject.trees[t].branches[b].alive=false;
							
							lastiteration=false;
							if(TreeObject.trees[t].iteration == TreeObject.trees[t].iterations && TreeObject.trees[t].leaves!==false)
							  {
								//last iteration - draw leaves?
								lastiteration=true;
								}
							
    					//create the new branches starting from the end of this branch
    					
    					for(var b2=0;b2<TreeObject.trees[t].branchings;b2++)
    					  {
								//alert(b2)
    						//angle of branch which has just stopped
    						oldangle=Math.atan2(TreeObject.trees[t].branches[b].finish[1]-TreeObject.trees[t].branches[b].start[1] , TreeObject.trees[t].branches[b].finish[0]-TreeObject.trees[t].branches[b].start[0])
    						
    						newangle=oldangle+ Math.random()*Math.PI*TreeObject.trees[t].angle - Math.PI*TreeObject.trees[t].angle/2;
    						//alert([TreeObject.trees[t].branches[b].finish , [TreeObject.trees[t].branches[b].finish[0]+Math.cos(newangle)*TreeObject.trees[t].size , TreeObject.trees[t].branches[b].finish[1]+Math.sin(newangle)*TreeObject.trees[t].size] , TreeObject.trees[t].branchings])
    						TreeObject.trees[t].branches.push(new TreeObject.branch(TreeObject.trees[t].branches[b].finish , [TreeObject.trees[t].branches[b].finish[0]+Math.cos(newangle)*TreeObject.trees[t].size , TreeObject.trees[t].branches[b].finish[1]+Math.sin(newangle)*TreeObject.trees[t].size] , TreeObject.trees[t].steps , lastiteration?true:false))
								
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

