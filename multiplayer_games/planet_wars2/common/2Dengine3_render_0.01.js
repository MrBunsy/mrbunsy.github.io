// Rendering component of 2D engine
// Requires shapes, physics and general components.

var Render=new Object();

Render.viewports=new Array();
Render.fills=new Array();
Render.strokes=new Array();

Render.viewport=function(rendermode,htmlname,x,y,width,height,zoom,sync,bg,enabled)
  {
	//either main span, or canvas
	this.htmlname=htmlname;
	//co-ords of top left
	this.x=x;this.y=y;
	//size of viewport
	this.width=width;this.height=height;
	//zoom: 'virtual' pixels (measuring unit) *zoom = screen pixels
	this.zoom=zoom;
	//sync - how often to update (in terms of physics advances eg 2 means only updated every other physics update)
	this.sync=sync;
	//background colour, false=clear
	this.bg=bg;
	//running or not
	this.enabled=enabled;
	
	
	this.canvassetup=false;
	this.divssetup=false;
	
	if (document.getElementById(htmlname+'canvas').getContext)
	  {
		this.canvas = document.getElementById(htmlname+'canvas').getContext('2d');
		this.canvassetup=true;
		}
	
  //add to array of viewports
	Render.viewports.push(this);
	}


//draws a dotted line for each spring
Render.updateLine=function(vp)
  {
	if(this.alive)
	  {
		switch(parseFloat(this.graphics))
		  {
			case 1:
			case 2:
			  var startx=wholeworld[this.from].x;
				var starty=wholeworld[this.from].y;
				var finishx=wholeworld[this.to].x;
				var finishy=wholeworld[this.to].y;

				viewports[vp].canvas.moveTo((startx-viewports[vp].x)*viewports[vp].zoom,(starty-viewports[vp].y)*viewports[vp].zoom);
				viewports[vp].canvas.lineTo((finishx-viewports[vp].x)*viewports[vp].zoom,(finishy-viewports[vp].y)*viewports[vp].zoom);
			break;
			}
		}	
  }

Render.getColour=function(colour)
{
  switch(colour)
	{
	case 0:return 'rgb(255,0,0)';break;//red
	case 1:return 'rgb(255,165,0)';break;//orange
	case 2:return 'rgb(255,255,0)';break;//yellow
	case 3:return 'rgb(0,255,0)';break;//lime green
	case 4:return 'rgb(0,128,0)';break;//green
	case 5:return 'rgb(0,0,255)';break;//blue
	case 6:return 'rgb(128,0,128)';break;//purple
	case 7:return 'rgb(255,192,203)';break;//pink
	case 8:return 'rgb(0,0,0)';break;//black
	case 9:return 'rgb(128,128,128)';break;//grey
	}
}



Render.drawcounter=0;

Render.redrawworld=function()
  {
	for(var r=0;r<Render.viewports.length;r++)
	  {
		if(Render.drawcounter%Render.viewports[r].sync==0 && Render.viewports[r].enabled)
		  {
			if(Render.viewports[r].bg===false)
			  {
				//blank bg
				Render.viewports[r].canvas.clearRect(0,0,Render.viewports[r].width,Render.viewports[r].height); // clear canvas
				}
			else
			  {
				//coloured bg
				Render.viewports[r].canvas.fillStyle = Render.viewports[r].bg;
				Render.viewports[r].canvas.fillRect(0,0,Render.viewports[r].width,Render.viewports[r].height);
				}
			
			Render.fills=new Array(10)
			Render.strokes=new Array(10);
			
			for(var r2=0;r2<Render.fills.length;r2++)
			  {
				Render.fills[r2]=new Array();
				Render.strokes[r2]=new Array();
				}

			Render.viewports[r].canvas.beginPath();
			for (i4=0;i4<Shapes.wholeworld.length;i4++)
			  {
				if(Shapes.wholeworld[i4].visible && Shapes.wholeworld[i4].alive)
				  {
					Shapes.wholeworld[i4].draw(r);
					}
				}
				
			for(var r2=0;r2<Render.fills.length;r2++)
			  {
				Render.viewports[r].canvas.beginPath()
				Render.viewports[r].canvas.fillStyle=Render.getColour(r2);
				
				for(var r3=0;r3<Render.fills[r2].length;r3++)
				  {
					Render.fills[r2][r3]();
					}
				Render.viewports[r].canvas.fill();
				}
			
			for(var r2=0;r2<Render.strokes.length;r2++)
			  {
				Render.viewports[r].canvas.beginPath()
				Render.viewports[r].canvas.strokeStyle=Render.getColour(r2);
				
				for(var r3=0;r3<Render.strokes[r2].length;r3++)
				  {
					Render.strokes[r2][r3]();
					}
				Render.viewports[r].canvas.stroke();
				}	

			//Render.viewports[r].canvas.fill();
			Render.viewports[r].canvas.beginPath();
			Render.viewports[r].canvas.strokeStyle='black';
			Render.viewports[r].canvas.lineWidth=Render.viewports[r].zoom;

			for (i4=0;i4<Physics.connections.length;i4++)
			  {
				Physics.connections[i4].updateline(r);
				}
			Render.viewports[r].canvas.stroke();
			}
		}
		Render.drawcounter++;
	}


Render.drawCircle=function(vp)
  {
	var tempp=this.pos;
	var tempd=this.dimensions
	var tempfunc=function()
		{
		
		Render.viewports[vp].canvas.moveTo((tempp[0]-Render.viewports[vp].x+tempd)*Render.viewports[vp].zoom, (tempp[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		Render.viewports[vp].canvas.arc((tempp[0]-Render.viewports[vp].x)*Render.viewports[vp].zoom,(tempp[1]-Render.viewports[vp].y)*Render.viewports[vp].zoom,tempd*Render.viewports[vp].zoom,0,Math.PI*2,true);  // draw circle
		}
	
	if(this.filled)
	  {
		Render.fills[this.colour].push(tempfunc);
		}
	else
	  {
		Render.strokes[this.colour].push(tempfunc);
		}
	}
	
Render.drawRectangle=function(vp)
  {
	var temppos=this.pos;
	var tempdimensions=this.dimensions;
	
	var tempfunc=function()
		{
		//top left
		Render.viewports[vp].canvas.moveTo((temppos[0]-tempdimensions[0]/2-Render.viewports[vp].x)*Render.viewports[vp].zoom, (temppos[1]-tempdimensions[1]/2-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		//top right
		Render.viewports[vp].canvas.lineTo((temppos[0]+tempdimensions[0]/2-Render.viewports[vp].x)*Render.viewports[vp].zoom, (temppos[1]-tempdimensions[1]/2-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		//bottom right
		Render.viewports[vp].canvas.lineTo((temppos[0]+tempdimensions[0]/2-Render.viewports[vp].x)*Render.viewports[vp].zoom, (temppos[1]+tempdimensions[1]/2-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		//bottom left
		Render.viewports[vp].canvas.lineTo((temppos[0]-tempdimensions[0]/2-Render.viewports[vp].x)*Render.viewports[vp].zoom, (temppos[1]+tempdimensions[1]/2-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		//top left
		Render.viewports[vp].canvas.lineTo((temppos[0]-tempdimensions[0]/2-Render.viewports[vp].x)*Render.viewports[vp].zoom, (temppos[1]-tempdimensions[1]/2-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		}
	
	if(this.filled)
	  {
		Render.fills[this.colour].push(tempfunc);
		}
	else
	  {
		Render.strokes[this.colour].push(tempfunc);
		}
	}

Render.drawPoly=function(vp)
  {
	var temppos=this.pos;
	var tempRs=this.Rs;
	var tempangle=this.angle
	var tempAs=this.As;
	var tempfunc=function()
	  {
		Render.viewports[vp].canvas.moveTo((temppos[0]+tempRs[0]*Math.cos(tempangle+tempAs[0])-Render.viewports[vp].x)*Render.viewports[vp].zoom,(temppos[1]+tempRs[0]*Math.sin(tempangle+tempAs[0])-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		
		for(var z=1;z<=tempRs.length;z++)
		  {
			if(z==tempRs.length)
			  {
				var z1=0;
				}
			else
			  {
				var z1=z;
				}
		Render.viewports[vp].canvas.lineTo((temppos[0]+tempRs[z1]*Math.cos(tempangle+tempAs[z1])-Render.viewports[vp].x)*Render.viewports[vp].zoom,(temppos[1]+tempRs[z1]*Math.sin(tempangle+tempAs[z1])-Render.viewports[vp].y)*Render.viewports[vp].zoom);
		  }
		}
	
  if(this.filled)
	  {
		Render.fills[this.colour].push(tempfunc);
		}
	else
	  {
		Render.strokes[this.colour].push(tempfunc);
		}

	}
