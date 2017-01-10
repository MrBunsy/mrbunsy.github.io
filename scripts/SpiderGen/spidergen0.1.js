var SpiderGen=new Object();

document.getElementById('spiderdiv').innerHTML+='<span style="display:none">this makes it work in IE for some bizzare reason</span><canvas id="spidercanvas" width="'+(parseFloat(document.getElementById('spiderdiv').style.width))+'" height="'+(parseFloat(document.getElementById('spiderdiv').style.height))+'"></canvas>';

SpiderGen.load=function()
  {
	SpiderGen.width=parseFloat(document.getElementById('spiderdiv').style.width)
	SpiderGen.height=parseFloat(document.getElementById('spiderdiv').style.height)
	
	SpiderGen.canvastag=document.getElementById('spidercanvas');
	
  if (SpiderGen.canvastag.getContext)
    {
    SpiderGen.canvas = SpiderGen.canvastag.getContext('2d');
    }
	General.debug=true;

	
	new SpiderGen.spider(25,1,0,[250,0]);
	
	Physics.timeperloop=0.02;
	SpiderGen.animateLoop=setInterval(SpiderGen.loop,50);
	
	}

SpiderGen.loop=function()
  {
	Physics.replotentities();
	SpiderGen.canvas.clearRect(0,0,SpiderGen.width,SpiderGen.height)
	for(var i=0;i<SpiderGen.spiders.length;i++)
	  {
		SpiderGen.canvas.beginPath();
		SpiderGen.canvas.moveTo(SpiderGen.spiders[i].body.pos[0] , SpiderGen.spiders[i].body.pos[1])
		SpiderGen.canvas.arc(SpiderGen.spiders[i].body.pos[0] , SpiderGen.spiders[i].body.pos[1] , SpiderGen.spiders[i].size , 0 , Math.PI*2 , false);
		SpiderGen.canvas.fill();
		}
	
	}
	
SpiderGen.spiders=new Array();
	
SpiderGen.spider=function(size,LBratio,doThis,startPos)
  {
	//[x,y] of start position
	this.startPos=startPos
	//radius of body
	this.size=size;
	//leg body ratio
	this.LBratio=LBratio;
	//animation to run
	this.doThis=doThis;
	//(alive,canMove,pos,angle,r,mass,colour,v,f,hard,filled,visible,gameType,elastic)
	//gametype 0=spider body circle
	this.body=new Shapes.circle(true,true,startPos,0,size,50,0,[0,0,0],[0,0,0],false,true,true,0,1);
	
	//anchor, gametype 1
	this.anchor=new Shapes.circle(false,true,startPos,0,size,1,0,[0,0,0],[0,0,0],false,true,false,1,1);
	
	//connect with spring.
	//(one,two,strength,howfar,graphics,type,hard)
	Physics.connect(this.body.arraypos , this.anchor.arraypos , 1000 , 100 , 1 , 0 , false);
	
	SpiderGen.spiders.push(this);
	}

SpiderGen.addLoadEvent=function(func) {
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

SpiderGen.addLoadEvent(SpiderGen.load);