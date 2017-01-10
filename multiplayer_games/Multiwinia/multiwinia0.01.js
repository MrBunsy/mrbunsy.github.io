var MW = new Object();

//function called on page load.
MW.load=function()
  {
	MW.width=parseFloat(document.getElementById('MWdiv').style.width)
	MW.height=parseFloat(document.getElementById('MWdiv').style.height)
	
	MW.canvastag=document.getElementById('MWcanvas');
	
  if (MW.canvastag.getContext)
    {
    MW.canvas = MW.canvastag.getContext('2d');
    }
	
  MW.MapCells=new Array();
  }

MW.cell=function(col,row,Xs,Ys,type,info)
  {
  this.col=col;
  this.row=row;
  //cell types, 0=land (info:tree?), 1=hill, 2=block (info:type of block), 3=water, 4=spawn (info:colour), 
  this.type=type;
  //extra info for cell type. (0=empty, 1=red, 2=yellow, 3=green, 4=blue)
  this.info=info;
  this.Xs=Xs;
  this.Ys=Ys;
  
  this.draw=drawCell;
  
  MW.MapCells.push(this);
  }

MW.drawCell=function()
  {
	
	}

	MW.drawMe=function(dead)
  {
	MW.canvas.fillStyle="rgb(0,255,0)";
	
	if(typeof dead !=='undefined' && dead)
	  {
		MW.canvas.fillStyle="rgb(0,50,0)";
		}
	
	squished=Math.cos(this.angle)
	//squished=1;
	
	tempDist=this.size/32
	pi=Math.Pi
	
	MW.canvas.beginPath();
	//top right of head
	MW.canvas.moveTo(this.pos[0] + Math.cos(-0.43*Math.PI+this.angle2)*16.4*tempDist*squished , this.pos[1] + Math.sin(-0.43*Math.PI+this.angle2)*16.4*tempDist);
	//top left of right arm
	MW.canvas.lineTo(this.pos[0] + Math.cos(-0.38*Math.PI+this.angle2)*9.7*tempDist*squished , this.pos[1] + Math.sin(-0.38*Math.PI+this.angle2)*9.7*tempDist);
	//top right of right arm
	MW.canvas.lineTo(this.pos[0] + Math.cos(-0.16*Math.PI+this.angle2)*18.4*tempDist*squished , this.pos[1] + Math.sin(-0.16*Math.PI+this.angle2)*18.4*tempDist);
	//bottom right of right arm
	MW.canvas.lineTo(this.pos[0] + Math.cos(-0.08*Math.PI+this.angle2)*16.5*tempDist*squished , this.pos[1] + Math.sin(-0.08*Math.PI+this.angle2)*16.5*tempDist);
	//bottom of right arm
	MW.canvas.lineTo(this.pos[0] + Math.cos(-0.27*Math.PI+this.angle2)*5.3*tempDist*squished , this.pos[1] + Math.sin(-0.27*Math.PI+this.angle2)*5.3*tempDist);
	//top left of right leg
	MW.canvas.lineTo(this.pos[0] + Math.cos(0.09*Math.PI+this.angle2)*3.6*tempDist*squished , this.pos[1] + Math.sin(0.09*Math.PI+this.angle2)*3.6*tempDist);
	//top right of right leg
	MW.canvas.lineTo(this.pos[0] + Math.cos(0.03*Math.PI+this.angle2)*9.6*tempDist*squished , this.pos[1] + Math.sin(0.03*Math.PI+this.angle2)*9.6*tempDist);
	//bottom right of right leg
	MW.canvas.lineTo(this.pos[0] + Math.cos(0.33*Math.PI+this.angle2)*18.6*tempDist*squished , this.pos[1] + Math.sin(0.33*Math.PI+this.angle2)*18.6*tempDist);
	//bottom left of right leg
	MW.canvas.lineTo(this.pos[0] + Math.cos(0.43*Math.PI+this.angle2)*16.4*tempDist*squished , this.pos[1] + Math.sin(0.43*Math.PI+this.angle2)*16.4*tempDist);
	//inside of right leg
	MW.canvas.lineTo(this.pos[0] + Math.cos(0.33*Math.PI+this.angle2)*6.9*tempDist*squished , this.pos[1] + Math.sin(0.33*Math.PI+this.angle2)*6.9*tempDist);
	
	//inside of left leg
	MW.canvas.lineTo(this.pos[0] + Math.cos(Math.PI-0.33*Math.PI+this.angle2)*6.9*tempDist*squished , this.pos[1] + Math.sin(Math.PI-0.33*Math.PI+this.angle2)*6.9*tempDist);
	//bottom right of left leg
	MW.canvas.lineTo(this.pos[0] + Math.cos(Math.PI-0.43*Math.PI+this.angle2)*16.4*tempDist*squished , this.pos[1] + Math.sin(Math.PI-0.43*Math.PI+this.angle2)*16.4*tempDist);
	//bottom left of left leg
	MW.canvas.lineTo(this.pos[0] + Math.cos(Math.PI-0.33*Math.PI+this.angle2)*18.6*tempDist*squished , this.pos[1] + Math.sin(Math.PI-0.33*Math.PI+this.angle2)*18.6*tempDist);
	//top left of left leg
	MW.canvas.lineTo(this.pos[0] + Math.cos(Math.PI-0.03*Math.PI+this.angle2)*9.6*tempDist*squished , this.pos[1] + Math.sin(Math.PI-0.03*Math.PI+this.angle2)*9.6*tempDist);
	//top right of left leg
	MW.canvas.lineTo(this.pos[0] + Math.cos(Math.PI-0.09*Math.PI+this.angle2)*3.6*tempDist*squished , this.pos[1] + Math.sin(Math.PI-0.09*Math.PI+this.angle2)*3.6*tempDist);
	//bottom of left arm
	MW.canvas.lineTo(this.pos[0] + Math.cos(Math.PI+0.27*Math.PI+this.angle2)*5.3*tempDist*squished , this.pos[1] + Math.sin(Math.PI+0.27*Math.PI+this.angle2)*5.3*tempDist);
	//bottom left of left arm
	MW.canvas.lineTo(this.pos[0] + Math.cos(Math.PI+0.08*Math.PI+this.angle2)*16.5*tempDist*squished , this.pos[1] + Math.sin(Math.PI+0.08*Math.PI+this.angle2)*16.5*tempDist);
	//top left of left arm
	MW.canvas.lineTo(this.pos[0] + Math.cos(Math.PI+0.16*Math.PI+this.angle2)*18.4*tempDist*squished , this.pos[1] + Math.sin(Math.PI+0.16*Math.PI+this.angle2)*18.4*tempDist);
	//top right of left arm
	MW.canvas.lineTo(this.pos[0] + Math.cos(Math.PI+0.38*Math.PI+this.angle2)*9.7*tempDist*squished , this.pos[1] + Math.sin(Math.PI+0.38*Math.PI+this.angle2)*9.7*tempDist);
	//top left of head
	MW.canvas.lineTo(this.pos[0] + Math.cos(Math.PI+0.43*Math.PI+this.angle2)*16.4*tempDist*squished , this.pos[1] + Math.sin(Math.PI+0.43*Math.PI+this.angle2)*16.4*tempDist);
	//top right of head
	MW.canvas.lineTo(this.pos[0] + Math.cos(-0.43*Math.PI+this.angle2)*16.4*tempDist*squished , this.pos[1] + Math.sin(-0.43*Math.PI+this.angle2)*16.4*tempDist);
	
	MW.canvas.fill();
	}
	
MW.addLoadEvent=function(func) {
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