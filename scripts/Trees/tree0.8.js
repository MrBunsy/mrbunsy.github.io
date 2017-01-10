var TreeObject=new Object();

TreeObject.load=function()
  {
	TreeObject.trees=new Array();
	
	if(document.getElementById('canvastagid').getContext)
    {
  	TreeObject.canvas=document.getElementById('canvastagid').getContext('2d');
  	}
	TreeObject.IE=false;
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
  
	TreeObject.width=500;
	TreeObject.height=500;
	
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

TreeObject.tree=function(x,y,iterations,branchings,size,steps,thick,ratio,colour,angle,leaves,leafSize)
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
	
	//false:no leaves, 0=circles, 1=playing cards
	this.leaves=leaves
	//fraction of treesize
	this.leafSize=leafSize
	
	this.leafColour="rgb(0,200,0)";
	
	this.alive=true;
	this.atStage=0;
	
	this.branches=new Array();
	this.branches.push(new TreeObject.branch(this.root , [this.root[0],this.root[1]-this.size] , this.steps , false) )
	//idea for angles and stuff:
	//angle[iteration][branchnum]
	
	TreeObject.trees.push(this); 
	}

//for next itteration: if(i==branches.length-1) {start next iteration}
	
TreeObject.branch=function(start,finish,steps)
  {
	this.type=0;//branch
	this.start=start;
	this.finish=finish;
	this.steps=steps
	this.progress=0;
	
	this.alive=true;
	
	this.dx=(finish[0]-start[0])/steps
	this.dy=(finish[1]-start[1])/steps
	}
	
TreeObject.leaf=function(start,size,steps,type)
  {
	this.type=1;//leaf
	this.start=start;
	this.size=size;// /10;
	this.steps=steps;
	
	this.alive=true;
	this.progress=0;
	
	this.type=type
	
	switch(this.type)
	  {
		case 1://card
		this.card=new Cards.card(Math.round(Math.random()*3),Math.round(Math.random()*12+1),true);
		break;
		}
	
	this.ds=this.size/steps;
	}

TreeObject.loop=function()
  {
	for(var tree=0;tree<TreeObject.trees.length;tree++)
  	{
		if(TreeObject.trees[tree].alive)
  		{
			
			//for each branch that is alive, draw a bit more.
			TreeObject.canvas.beginPath();
			//set thickness of line
			TreeObject.canvas.lineWidth=TreeObject.trees[tree].thick[0]+TreeObject.trees[tree].dthick*TreeObject.trees[tree].iteration;

			switch(TreeObject.trees[tree].atStage)
			  {
				case 0://drawing branches
				  TreeObject.canvas.strokeStyle="rgb("+Math.round(TreeObject.trees[tree].colour[0][0]+TreeObject.trees[tree].dcolour[0]*TreeObject.trees[tree].iteration)+","+Math.round(TreeObject.trees[tree].colour[0][1]+TreeObject.trees[tree].dcolour[1]*TreeObject.trees[tree].iteration)+","+Math.round(TreeObject.trees[tree].colour[0][2]+TreeObject.trees[tree].dcolour[2]*TreeObject.trees[tree].iteration)+")";
				break;
				case 1://drawing leaves
				  switch(TreeObject.trees[tree].leaves)
  					{
  					case 0:
    				  TreeObject.canvas.fillStyle=TreeObject.trees[tree].leafColour;
  					break;
						case 1:
						  TreeObject.canvas.strokeStyle='rgb(0,0,0)';
							TreeObject.canvas.lineWidth=1;
						break;
  					}
				break
				}
			
    	for(var branch=0;branch<TreeObject.trees[tree].branches.length;branch++)
    	  {
  			if(TreeObject.trees[tree].branches[branch].alive)
    			{
					switch(TreeObject.trees[tree].branches[branch].type)
  					{
						case 0://branch
    					TreeObject.canvas.moveTo(TreeObject.trees[tree].branches[branch].start[0]+TreeObject.trees[tree].branches[branch].dx*TreeObject.trees[tree].branches[branch].progress , TreeObject.trees[tree].branches[branch].start[1]+TreeObject.trees[tree].branches[branch].dy*TreeObject.trees[tree].branches[branch].progress)
          		TreeObject.trees[tree].branches[branch].progress++
          		TreeObject.canvas.lineTo(TreeObject.trees[tree].branches[branch].start[0]+TreeObject.trees[tree].branches[branch].dx*TreeObject.trees[tree].branches[branch].progress , TreeObject.trees[tree].branches[branch].start[1]+TreeObject.trees[tree].branches[branch].dy*TreeObject.trees[tree].branches[branch].progress)
						break;
						case 1://leaf
  						switch(TreeObject.trees[tree].leaves)
      					{
      					case 0://circle
    							TreeObject.trees[tree].branches[branch].progress++
    						  TreeObject.canvas.moveTo(TreeObject.trees[tree].branches[branch].start[0]+TreeObject.trees[tree].branches[branch].ds*TreeObject.trees[tree].branches[branch].progress,TreeObject.trees[tree].branches[branch].start[1]);
    							TreeObject.canvas.arc(TreeObject.trees[tree].branches[branch].start[0] , TreeObject.trees[tree].branches[branch].start[1] , TreeObject.trees[tree].branches[branch].ds*TreeObject.trees[tree].branches[branch].progress , 0 , Math.PI*2 , false );
    						break;
								case 1://card
									TreeObject.trees[tree].branches[branch].progress++
									tempsize=TreeObject.trees[tree].branches[branch].ds*TreeObject.trees[tree].branches[branch].progress;
									//(x,y,width,where,full)
									if(!Cards.IE || TreeObject.trees[tree].branches[branch].progress==TreeObject.trees[tree].branches[branch].steps)
  									{
										if(tempsize>0)
  										{
    									TreeObject.trees[tree].branches[branch].card.draw((TreeObject.trees[tree].branches[branch].start[0]-tempsize/2)/Cards.width , (TreeObject.trees[tree].branches[branch].start[1]-tempsize*1.5/2)/Cards.height , (tempsize)/Cards.width , 0 , true)
  										}
  									}
									else
  									{
  									//draw a blank card in IE for all bar the last leaf growth
										if(tempsize>0)
  										{
  										Cards.drawBox((TreeObject.trees[tree].branches[branch].start[0]-tempsize/2)/Cards.width , (TreeObject.trees[tree].branches[branch].start[1]-tempsize*1.5/2)/Cards.height , (tempsize)/Cards.width,(tempsize*1.5)/Cards.width,"rgb(255,255,255)","rgb(0,0,0)",0)
  										}
  									}
								break;
    						}
						break;
  					}
    			}
    		}
			switch(TreeObject.trees[tree].atStage)
			  {
				case 0://drawing branches
				  TreeObject.canvas.stroke();
				break;
				case 1://drawing leaves
				  switch(TreeObject.trees[tree].leaves)
      			{
						case 0:
				  	  TreeObject.canvas.fill();
						break;
						}
				break
				}
			
    	if(TreeObject.trees[tree].branches[TreeObject.trees[tree].branches.length-1].progress >= TreeObject.trees[tree].steps)
  		  {
  			//all live branches for this tree grown to full length
  			TreeObject.trees[tree].iteration++;
				//reduce length
  			TreeObject.trees[tree].size*=TreeObject.trees[tree].ratio;

  			if((TreeObject.trees[tree].iteration <= TreeObject.trees[tree].iterations+1 && TreeObject.trees[tree].leaves!==false) || TreeObject.trees[tree].iteration <= TreeObject.trees[tree].iterations)
  				{//within number of iterations, or growing leaves in the iteration just over the last
					
					drawingLeaves=false;
					if(TreeObject.trees[tree].iteration > TreeObject.trees[tree].iterations && TreeObject.trees[tree].leaves!==false)
					  {
						drawingLeaves=true;
						TreeObject.trees[tree].atStage=1;
						}
					
    			tempbranches=TreeObject.trees[tree].branches.length;
    			for(var b=0;b<tempbranches;b++)
    			  {
    				if(TreeObject.trees[tree].branches[b].alive)
    				  {
    					TreeObject.trees[tree].branches[b].alive=false;
    					//create the new branches starting from the end of this branch
    					if(drawingLeaves)
  						  {
  							TreeObject.trees[tree].branches.push(new TreeObject.leaf(TreeObject.trees[tree].branches[b].finish , TreeObject.trees[tree].size*TreeObject.trees[tree].leafSize , TreeObject.trees[tree].steps ,  TreeObject.trees[tree].leaves))
  							}
							else
  							{
      					for(var b2=0;b2<TreeObject.trees[tree].branchings;b2++)
      					  {
      						//angle of branch which has just stopped
      						oldangle=Math.atan2(TreeObject.trees[tree].branches[b].finish[1]-TreeObject.trees[tree].branches[b].start[1] , TreeObject.trees[tree].branches[b].finish[0]-TreeObject.trees[tree].branches[b].start[0])
      						newangle=oldangle+ Math.random()*Math.PI*TreeObject.trees[tree].angle - Math.PI*TreeObject.trees[tree].angle/2;
  								
      						TreeObject.trees[tree].branches.push(new TreeObject.branch(TreeObject.trees[tree].branches[b].finish , [TreeObject.trees[tree].branches[b].finish[0]+Math.cos(newangle)*TreeObject.trees[tree].size , TreeObject.trees[tree].branches[b].finish[1]+Math.sin(newangle)*TreeObject.trees[tree].size] , TreeObject.trees[tree].steps))
  								
      						}//new branches loop
								}
    					}//branch was alive
    				}//branches loop
    			}
				else
				  {
					//tree grown too much
					TreeObject.trees[tree].alive=false;
					}
				}//all grown
  		}//tree alive
  	}//tree loop
	}

