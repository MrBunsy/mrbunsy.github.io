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
	for(var t=0;t<TreeObject.trees.length;t++)
  	{
		if(TreeObject.trees[t].alive)
  		{
			
			//for each branch that is alive, draw a bit more.
			TreeObject.canvas.beginPath();
			//set thickness of line
			TreeObject.canvas.lineWidth=TreeObject.trees[t].thick[0]+TreeObject.trees[t].dthick*TreeObject.trees[t].iteration;
			//alert(TreeObject.trees[t].branches.length)
			opera.postError('got to chosing branch type')
			switch(TreeObject.trees[t].atStage)
			  {
				case 0://drawing branches
				  TreeObject.canvas.strokeStyle="rgb("+Math.round(TreeObject.trees[t].colour[0][0]+TreeObject.trees[t].dcolour[0]*TreeObject.trees[t].iteration)+","+Math.round(TreeObject.trees[t].colour[0][1]+TreeObject.trees[t].dcolour[1]*TreeObject.trees[t].iteration)+","+Math.round(TreeObject.trees[t].colour[0][2]+TreeObject.trees[t].dcolour[2]*TreeObject.trees[t].iteration)+")";
				break;
				case 1://drawing leaves
				  switch(TreeObject.trees[t].leaves)
  					{
  					case 0:
    				  TreeObject.canvas.fillStyle=TreeObject.trees[t].leafColour;
  					break;
						case 1:
						  TreeObject.canvas.strokeStyle='rgb(0,0,0)';
							TreeObject.canvas.lineWidth=1;
						break;
  					}
				break
				}
			
			
    	for(var i=0;i<TreeObject.trees[t].branches.length;i++)
    	  {
  			if(TreeObject.trees[t].branches[i].alive)
    			{
					switch(TreeObject.trees[t].branches[i].type)
  					{
						case 0://branch
    					TreeObject.canvas.moveTo(TreeObject.trees[t].branches[i].start[0]+TreeObject.trees[t].branches[i].dx*TreeObject.trees[t].branches[i].progress , TreeObject.trees[t].branches[i].start[1]+TreeObject.trees[t].branches[i].dy*TreeObject.trees[t].branches[i].progress)
          		TreeObject.trees[t].branches[i].progress++
          		TreeObject.canvas.lineTo(TreeObject.trees[t].branches[i].start[0]+TreeObject.trees[t].branches[i].dx*TreeObject.trees[t].branches[i].progress , TreeObject.trees[t].branches[i].start[1]+TreeObject.trees[t].branches[i].dy*TreeObject.trees[t].branches[i].progress)
						break;
						case 1://leaf
  						switch(TreeObject.trees[t].leaves)
      					{
      					case 0://circle
    							TreeObject.trees[t].branches[i].progress++
    						  TreeObject.canvas.moveTo(TreeObject.trees[t].branches[i].start[0]+TreeObject.trees[t].branches[i].ds*TreeObject.trees[t].branches[i].progress,TreeObject.trees[t].branches[i].start[1]);
    							TreeObject.canvas.arc(TreeObject.trees[t].branches[i].start[0] , TreeObject.trees[t].branches[i].start[1] , TreeObject.trees[t].branches[i].ds*TreeObject.trees[t].branches[i].progress , 0 , Math.PI*2 , false );
    						break;
								case 1://card
								  //var tempcard=new Cards.card(Math.round(Math.random()*3),Math.round(Math.random()*12+1),true)
									TreeObject.trees[t].branches[i].progress++
									tempsize=TreeObject.trees[t].branches[i].ds*TreeObject.trees[t].branches[i].progress;
									//(x,y,width,where,full)
									//alert(TreeObject.trees[t].branches[i].size)
									//alert([(TreeObject.trees[t].branches[i].start[0]-TreeObject.trees[t].branches[i].size/2)/Cards.width , (TreeObject.trees[t].branches[i].start[1]-TreeObject.trees[t].branches[i].size*1.5/2)/Cards.height , (TreeObject.trees[t].branches[i].size)/Cards.width , 0 , true])
									//alert([TreeObject.trees[t].branches[i].card.suit , TreeObject.trees[t].branches[i].card.number])
									if(!Cards.IE || TreeObject.trees[t].branches[i].progress==TreeObject.trees[t].branches[i].steps)
  									{
  									TreeObject.trees[t].branches[i].card.draw((TreeObject.trees[t].branches[i].start[0]-tempsize/2)/Cards.width , (TreeObject.trees[t].branches[i].start[1]-tempsize*1.5/2)/Cards.height , (tempsize)/Cards.width , 0 , true)
  									}
									else
  									{
  									//draw a blank card in IE for all bar the last leaf growth
										Cards.drawBox((TreeObject.trees[t].branches[i].start[0]-tempsize/2)/Cards.width , (TreeObject.trees[t].branches[i].start[1]-tempsize*1.5/2)/Cards.height , (tempsize)/Cards.width,(tempsize*1.5)/Cards.width,"rgb(255,255,255)","rgb(0,0,0)",0)
  									}
								break;
    						}
						break;
  					}
    			}
    		}
			opera.postError('got to finishing branch')
			switch(TreeObject.trees[t].atStage)
			  {
				case 0://drawing branches
				  TreeObject.canvas.stroke();
				break;
				case 1://drawing leaves
				  switch(TreeObject.trees[t].leaves)
      			{
						case 0:
				  	  TreeObject.canvas.fill();
						break;
						}
				break
				}
			
    	if(TreeObject.trees[t].branches[TreeObject.trees[t].branches.length-1].progress >= TreeObject.trees[t].steps)
  		  {
  			//all live branches for this tree grown to full length
  			TreeObject.trees[t].iteration++;
				//reduce length
  			TreeObject.trees[t].size*=TreeObject.trees[t].ratio;

  			if((TreeObject.trees[t].iteration <= TreeObject.trees[t].iterations+1 && TreeObject.trees[t].leaves!==false) || TreeObject.trees[t].iteration <= TreeObject.trees[t].iterations)
  				{//within number of iterations, or growing leaves in the iteration just over the last
					
					drawingLeaves=false;
					if(TreeObject.trees[t].iteration > TreeObject.trees[t].iterations && TreeObject.trees[t].leaves!==false)
					  {
						drawingLeaves=true;
						TreeObject.trees[t].atStage=1;
						}
					
    			tempbranches=TreeObject.trees[t].branches.length;
    			for(var b=0;b<tempbranches;b++)
    			  {
    				if(TreeObject.trees[t].branches[b].alive)
    				  {
    					TreeObject.trees[t].branches[b].alive=false;
    					//create the new branches starting from the end of this branch
    					if(drawingLeaves)
  						  {
  							TreeObject.trees[t].branches.push(new TreeObject.leaf(TreeObject.trees[t].branches[b].finish , TreeObject.trees[t].size*TreeObject.trees[t].leafSize , TreeObject.trees[t].steps ,  TreeObject.trees[t].leaves))
  							}
							else
  							{
      					for(var b2=0;b2<TreeObject.trees[t].branchings;b2++)
      					  {
      						//angle of branch which has just stopped
      						oldangle=Math.atan2(TreeObject.trees[t].branches[b].finish[1]-TreeObject.trees[t].branches[b].start[1] , TreeObject.trees[t].branches[b].finish[0]-TreeObject.trees[t].branches[b].start[0])
      						newangle=oldangle+ Math.random()*Math.PI*TreeObject.trees[t].angle - Math.PI*TreeObject.trees[t].angle/2;
  								
      						TreeObject.trees[t].branches.push(new TreeObject.branch(TreeObject.trees[t].branches[b].finish , [TreeObject.trees[t].branches[b].finish[0]+Math.cos(newangle)*TreeObject.trees[t].size , TreeObject.trees[t].branches[b].finish[1]+Math.sin(newangle)*TreeObject.trees[t].size] , TreeObject.trees[t].steps))
  								
      						}//new branches loop
								}
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

