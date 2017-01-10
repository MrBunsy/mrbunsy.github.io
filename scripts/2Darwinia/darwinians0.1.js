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
	
	
	new Darwinians.darwinian([400,250],100,1)
	
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
	
	//0=facing screen directly.  they wibble slightly as they walk.
	this.angle=0//Math.random()*Math.PI/4-Math.PI/8;
	//speed of wibble
	this.rotating=Math.random()*Math.PI/20;
	//speed of walk
	this.speed=Math.random()*10+10;
	
	//angle for jumping rotation
	this.angle2=0;
	
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
	
	Darwinians.canvas.beginPath();
	//body
	Darwinians.canvas.fillRect(this.pos[0]-squished*this.size*3.5/32 , this.pos[1] - this.size/2 , squished*this.size*7/32 , this.size*22/32);
	//arms
	Darwinians.canvas.fillRect(this.pos[0]-squished*this.size/2 , this.pos[1] - this.size*9/32 , squished*this.size , this.size*5/32);
	//left leg
	Darwinians.canvas.fillRect(this.pos[0]-squished*this.size*9.5/32 , this.pos[1] + this.size*1/32 , squished*this.size*6/32 , this.size*15/32);
	//right leg
	Darwinians.canvas.fillRect(this.pos[0]+squished*this.size*3.5/32 , this.pos[1] + this.size*1/32 ,squished* this.size*6/32 , this.size*15/32);
	}
	
Darwinians.loop=function()
  {
	Darwinians.canvas.clearRect(0,0,Darwinians.width,Darwinians.height)
	
	for(var i=0;i<Darwinians.darwinians.length;i++)
	  {
		if(Darwinians.darwinians[i].alive)
		  {
			switch(Darwinians.darwinians[i].doing)
			  {
				case 0://walking
				
				  Darwinians.darwinians[i].pos[0]+=Darwinians.darwinians[i].size*0.005*Darwinians.darwinians[i].direction;
					
					if(Darwinians.darwinians[i].pos[0] > Darwinians.width || Darwinians.darwinians[i].pos[0] < 0)
					  {
						//getting to edge of screen, turn around
						Darwinians.darwinians[i].direction*=-1;
						Darwinians.darwinians[i].doing=1;
						
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