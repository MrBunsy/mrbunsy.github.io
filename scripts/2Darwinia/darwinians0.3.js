var Darwinians = new Object();

Darwinians.load=function()
  {
	Darwinians.width=parseFloat(document.getElementById('darwiniansdiv').style.width)
	Darwinians.height=parseFloat(document.getElementById('darwiniansdiv').style.height)
	
	Darwinians.canvastag=document.getElementById('darwinianscanvas');
	
  if (Darwinians.canvastag.getContext)
    {
    Darwinians.canvas = Darwinians.canvastag.getContext('2d');
    }
	
	Darwinians.animateLoop=setInterval(Darwinians.loop,20);
	
	
	//new Darwinians.darwinian([400,250],20,1)
	
	new Darwinians.darwinian([620,500],20,-1)
	
	}

Darwinians.darwinians=new Array();
	
Darwinians.darwinian=function(pos,size,direction)
  {
	this.startPos=pos;
	//centre [x ,y ]
	this.pos=pos;
	//in pixels
	this.size=size;
	//general direction it's heading in
	this.direction=direction;
	
	//0=walking, 1=turning around, 2=turning around fast, 3=fleeing spider, 4=jumping for joy, 5=dieing
	this.doing=0;
	//animation step:
	this.step=0;
	//=function(alive,canMove,pos,width,height,mass,colour,v,f,hard,filled,visible,gameType,elastic)
	this.body=new Shapes.oldRectangle(false,true,pos,size,size,50,0,[0,0,0],[0,0,0],false,true,false,4,Darwinians.darwinians.length)
	
	//0=facing screen directly.  they wibble slightly as they walk.
	this.angle=0//Math.random()*Math.PI/4-Math.PI/8;
	//speed of wibble
	this.rotating=Math.random()*Math.PI/20;
	//speed of walk
	this.speed=(Math.random()*20+10)*0.02;
	
	//angle for jumping rotation
	this.angle2=0;
	
	//consistant randomness :P
	this.seed=Math.random();
	
	this.alive=true;
	
	this.draw=Darwinians.drawMe
	
	//add to array
	Darwinians.darwinians.push(this)
	}
	
Darwinians.drawMe=function()
  {
	Darwinians.canvas.fillStyle="rgb(0,255,0)";
	
	squished=Math.cos(this.angle)
	//squished=1;
	
	tempDist=this.size/32
	pi=Math.Pi
	
	Darwinians.canvas.beginPath();
	/*
	//body
	Darwinians.canvas.fillRect(this.pos[0]-squished*this.size*3.5/32 , this.pos[1] - this.size/2 , squished*this.size*7/32 , this.size*22/32);
	//arms
	Darwinians.canvas.fillRect(this.pos[0]-squished*this.size/2 , this.pos[1] - this.size*9/32 , squished*this.size , this.size*5/32);
	//left leg
	Darwinians.canvas.fillRect(this.pos[0]-squished*this.size*9.5/32 , this.pos[1] + this.size*1/32 , squished*this.size*6/32 , this.size*15/32);
	//right leg
	Darwinians.canvas.fillRect(this.pos[0]+squished*this.size*3.5/32 , this.pos[1] + this.size*1/32 ,squished* this.size*6/32 , this.size*15/32);
	*/
	
	//top right of head
	Darwinians.canvas.moveTo(this.pos[0] + Math.cos(-0.43*Math.PI+this.angle2)*16.4*tempDist*squished , this.pos[1] + Math.sin(-0.43*Math.PI+this.angle2)*16.4*tempDist);
	//top left of right arm
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(-0.38*Math.PI+this.angle2)*9.7*tempDist*squished , this.pos[1] + Math.sin(-0.38*Math.PI+this.angle2)*9.7*tempDist);
	//top right of right arm
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(-0.16*Math.PI+this.angle2)*18.4*tempDist*squished , this.pos[1] + Math.sin(-0.16*Math.PI+this.angle2)*18.4*tempDist);
	//bottom right of right arm
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(-0.08*Math.PI+this.angle2)*16.5*tempDist*squished , this.pos[1] + Math.sin(-0.08*Math.PI+this.angle2)*16.5*tempDist);
	//bottom of right arm
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(-0.27*Math.PI+this.angle2)*5.3*tempDist*squished , this.pos[1] + Math.sin(-0.27*Math.PI+this.angle2)*5.3*tempDist);
	//top left of right leg
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(0.09*Math.PI+this.angle2)*3.6*tempDist*squished , this.pos[1] + Math.sin(0.09*Math.PI+this.angle2)*3.6*tempDist);
	//top right of right leg
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(0.03*Math.PI+this.angle2)*9.6*tempDist*squished , this.pos[1] + Math.sin(0.03*Math.PI+this.angle2)*9.6*tempDist);
	//bottom right of right leg
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(0.33*Math.PI+this.angle2)*18.6*tempDist*squished , this.pos[1] + Math.sin(0.33*Math.PI+this.angle2)*18.6*tempDist);
	//bottom left of right leg
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(0.43*Math.PI+this.angle2)*16.4*tempDist*squished , this.pos[1] + Math.sin(0.43*Math.PI+this.angle2)*16.4*tempDist);
	//inside of right leg
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(0.33*Math.PI+this.angle2)*6.9*tempDist*squished , this.pos[1] + Math.sin(0.33*Math.PI+this.angle2)*6.9*tempDist);
	
	//inside of left leg
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(Math.PI-0.33*Math.PI+this.angle2)*6.9*tempDist*squished , this.pos[1] + Math.sin(Math.PI-0.33*Math.PI+this.angle2)*6.9*tempDist);
	//bottom right of left leg
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(Math.PI-0.43*Math.PI+this.angle2)*16.4*tempDist*squished , this.pos[1] + Math.sin(Math.PI-0.43*Math.PI+this.angle2)*16.4*tempDist);
	//bottom left of left leg
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(Math.PI-0.33*Math.PI+this.angle2)*18.6*tempDist*squished , this.pos[1] + Math.sin(Math.PI-0.33*Math.PI+this.angle2)*18.6*tempDist);
	//top left of left leg
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(Math.PI-0.03*Math.PI+this.angle2)*9.6*tempDist*squished , this.pos[1] + Math.sin(Math.PI-0.03*Math.PI+this.angle2)*9.6*tempDist);
	//top right of left leg
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(Math.PI-0.09*Math.PI+this.angle2)*3.6*tempDist*squished , this.pos[1] + Math.sin(Math.PI-0.09*Math.PI+this.angle2)*3.6*tempDist);
	//bottom of left arm
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(Math.PI+0.27*Math.PI+this.angle2)*5.3*tempDist*squished , this.pos[1] + Math.sin(Math.PI+0.27*Math.PI+this.angle2)*5.3*tempDist);
	//bottom left of left arm
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(Math.PI+0.08*Math.PI+this.angle2)*16.5*tempDist*squished , this.pos[1] + Math.sin(Math.PI+0.08*Math.PI+this.angle2)*16.5*tempDist);
	//top left of left arm
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(Math.PI+0.16*Math.PI+this.angle2)*18.4*tempDist*squished , this.pos[1] + Math.sin(Math.PI+0.16*Math.PI+this.angle2)*18.4*tempDist);
	//top right of left arm
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(Math.PI+0.38*Math.PI+this.angle2)*9.7*tempDist*squished , this.pos[1] + Math.sin(Math.PI+0.38*Math.PI+this.angle2)*9.7*tempDist);
	//top left of head
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(Math.PI+0.43*Math.PI+this.angle2)*16.4*tempDist*squished , this.pos[1] + Math.sin(Math.PI+0.43*Math.PI+this.angle2)*16.4*tempDist);
	//top right of head
	Darwinians.canvas.lineTo(this.pos[0] + Math.cos(-0.43*Math.PI+this.angle2)*16.4*tempDist*squished , this.pos[1] + Math.sin(-0.43*Math.PI+this.angle2)*16.4*tempDist);
	
	Darwinians.canvas.fill();
	}
	
Darwinians.loop=function()
  {
	
	Physics.replotentities();
	
	Darwinians.canvas.clearRect(0,0,Darwinians.width,Darwinians.height)
	
	if(Math.random()<0.005)
	  {
		//spawn more darwinians
		switch(Math.round(Math.random()))
		  {
		  case 0:
			  new Darwinians.darwinian([-20,500],20,1)
			break;
			case 1:
			  new Darwinians.darwinian([620,500],20,-1)
			break;
		  }
		}
	
	for(var i=0;i<Darwinians.darwinians.length;i++)
	  {
		if(Darwinians.darwinians[i].alive)
		  {
			switch(Darwinians.darwinians[i].doing)
			  {
				case 0://walking
				
				  Darwinians.darwinians[i].pos[0]+=Darwinians.darwinians[i].speed*Darwinians.darwinians[i].direction
					//Darwinians.darwinians[i].size*0.005*Darwinians.darwinians[i].direction;
					
					if((Math.random()<0.001 && Darwinians.darwinians[i].pos[0]>0 && Darwinians.darwinians[i].pos[0]<Darwinians.width) ||  (Darwinians.darwinians[i].pos[0] > Darwinians.width-Darwinians.darwinians[i].size  && Darwinians.darwinians[i].direction==1) || (Darwinians.darwinians[i].pos[0] < Darwinians.darwinians[i].size && Darwinians.darwinians[i].direction==-1))
					  {
						//getting to edge of screen or on screen randomly, turn around
						Darwinians.darwinians[i].direction*=-1;
						Darwinians.darwinians[i].doing=1;
						
						}
					else if(Math.random()<0.001)
					  {
						//jump!
						Darwinians.darwinians[i].doing=4;
						//prepare physics object
						Darwinians.darwinians[i].body.alive=true;
						Darwinians.darwinians[i].body.pos=Darwinians.darwinians[i].pos;
						Darwinians.darwinians[i].body.v=[Darwinians.darwinians[i].size*(1+Math.random()*2)*Darwinians.darwinians[i].direction , -Darwinians.darwinians[i].size*(2+Math.random()) , 0]
						//simulate lower gravity by adding updwards force
						Darwinians.darwinians[i].body.f[1]=-8000;
						}
					
				  Darwinians.darwinians[i].draw();
				break;
				case 1://turning slowly around animation
				
				  Darwinians.darwinians[i].step++
					
					Darwinians.darwinians[i].angle+=Math.PI/100
					
					if(Darwinians.darwinians[i].step>100)
					  {
						Darwinians.darwinians[i].angle=0;
						//walk again
						Darwinians.darwinians[i].doing=0;
						Darwinians.darwinians[i].step=0;
						}
						Darwinians.darwinians[i].draw();
				break;
				case 2://turn around very quickly!
				  Darwinians.darwinians[i].step++
					
					Darwinians.darwinians[i].angle+=Math.PI/20
					
					if(Darwinians.darwinians[i].step>20)
					  {
						Darwinians.darwinians[i].angle=0;
						//walk again
						Darwinians.darwinians[i].doing=0;
						Darwinians.darwinians[i].step=0;
						}
						Darwinians.darwinians[i].draw();
				break;
				case 3://fleeing
				  
					Darwinians.darwinians[i].step++
					
				  Darwinians.darwinians[i].pos[0]+=Darwinians.darwinians[i].size*0.01*Darwinians.darwinians[i].direction;
					
					if(Darwinians.darwinians[i].pos[0] > Darwinians.width+Darwinians.darwinians[i].size || Darwinians.darwinians[i].pos[0] < -Darwinians.darwinians[i].size)
					  {
						//off edge of screen, dissapear
						Darwinians.darwinians[i].alive=false
						Darwinians.darwinians[i].step=0;
						}
					
					if(Darwinians.darwinians[i].step>200)
					  {
						//walk again
						Darwinians.darwinians[i].step=0;
						Darwinians.darwinians[i].doing=0;
						}
					
				  Darwinians.darwinians[i].draw();
				
				break;
				case 4://jumping
				
				  Darwinians.darwinians[i].pos=Darwinians.darwinians[i].body.pos;
				  Darwinians.darwinians[i].angle2+=Math.PI*0.01*Darwinians.darwinians[i].direction
					
					if(Darwinians.darwinians[i].pos[1]>Darwinians.darwinians[i].startPos[1])
					  {
						//back on ground
						Darwinians.darwinians[i].angle2=0;
						Darwinians.darwinians[i].body.kill();
						Darwinians.darwinians[i].pos[1]=Darwinians.darwinians[i].startPos[1]
						//walk again
						Darwinians.darwinians[i].doing=0;
						}
					
					Darwinians.darwinians[i].draw();
				break;
			  }
			}
		}
	}
	
Darwinians.addLoadEvent=function(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}