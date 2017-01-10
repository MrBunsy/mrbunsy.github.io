//this script is for the little animation of 2Darwinia (2D darwinia - gettit?).  Darwinians is the little green dudes generator

var Darwinia=new Object();

Darwinia.load=function()
  {
	Darwinia.IE=false;
	if (/MSIE/.test(navigator.userAgent) && !window.opera)
	  {
		Darwinia.IE=true;
		}
	
	//set up canvas
  Darwinia.width=parseFloat(document.getElementById('darwiniansdiv').style.width)
	Darwinia.height=parseFloat(document.getElementById('darwiniansdiv').style.height)
	Darwinia.canvastag=document.getElementById('darwinianscanvas');
	Darwinia.canvastag2=document.getElementById('darwinianscanvas2');
	Darwinia.introDiv=document.getElementById('darwiniaIntroDiv');
	Darwinia.div=document.getElementById('darwiniansdiv');
	
	Darwinia.div.style.border="solid black 1px"
	Darwinia.div.style.backgroundColor="#aaf0ff"
	
	Darwinia.canvastag.style.position="absolute";
	Darwinia.canvastag2.style.position="absolute";
	Darwinia.introDiv.style.position="absolute";
	
	Darwinia.introDiv.innerHTML="<table><tr><td valign='top' style='font-size:50px;'><div style='margin-top:10px;'>2</div></td><td style='font-size:100px;'>D</td><td valign='bottom' style='font-size:50px;'><div style='margin-bottom:10px;'>arwinia</div></td></tr><tr><td style='font-size:20px;' colspan=3><center>By Luke Wallin</center></td></tr></table>"
	Darwinia.introDiv.style.fontFamily='Helvetica,Arial, "trebuchet MS",  sans-serif';
	Darwinia.canvastag.style.zIndex=1;
	Darwinia.canvastag2.style.zIndex=2;
	
	Darwinia.logoVanish=false;
  Darwinia.logoVanishCount=0;
		
	setTimeout(function(){Darwinia.logoVanish=true;},5000)
		
	if (Darwinia.canvastag.getContext)
    {
    Darwinia.canvas = Darwinia.canvastag.getContext('2d');
		Darwinia.canvas2 = Darwinia.canvastag2.getContext('2d');
    }
	
	//draw BG.
	Darwinia.canvas.strokeStyle="rgb(241,174,71)";
	for(var i=0;i<12;i++)
  	{
  	Darwinia.canvas.fillStyle="rgb("+Math.round(164+(Math.random()-1)*20)+","+Math.round(110+(Math.random()-1)*20)+","+Math.round(66+(Math.random()-1)*20)+")";
  	Darwinia.canvas.fillRect(50*i,500,50+50*i,100)
		Darwinia.canvas.strokeRect(50*i,500,50,100)
		
		Darwinia.canvas.fillStyle="rgb("+Math.round(164+(Math.random()-1)*20)+","+Math.round(110+(Math.random()-1)*20)+","+Math.round(66+(Math.random()-1)*20)+")";
		Darwinia.canvas.beginPath();
		//top right
		Darwinia.canvas.moveTo(50*i+50 , 500)
		//bottom left
		Darwinia.canvas.lineTo(50*i , 600)
		//bottom right
		Darwinia.canvas.lineTo(50*i+50 , 600)
		//top right
		Darwinia.canvas.lineTo(50*i+50 , 500)
		Darwinia.canvas.fill();
		
		Darwinia.canvas.beginPath();
		//top right
		Darwinia.canvas.moveTo(50*i+50 , 500)
		//bottom left
		Darwinia.canvas.lineTo(50*i , 600)
		Darwinia.canvas.stroke();
	
		
  	}
	
	TreeObject.trees=new Array();
	
	TreeObject.width=Darwinia.width;
	TreeObject.height=Darwinia.height;
	TreeObject.canvas=Darwinia.canvas;
	
	Darwinia.animateLoop=setInterval(Darwinia.loop,20);
	
	General.debug=true;
	
	SpiderGen.width=Darwinia.width;
	SpiderGen.height=Darwinia.height;
	SpiderGen.canvas=Darwinia.canvas2;
	
	Darwinians.width=Darwinia.width;
	Darwinians.height=Darwinia.height;
	Darwinians.canvas=Darwinia.canvas2;
	
	Physics.friction=0;
	
	new TreeObject.tree(300,500,4,3,100,3,[3,3],0.8, [[255,100,0,0.8],[255,100,0,0.5]] , 0.5 , 0 , 1 ,"rgba(0,255,0,0.3)");
	
	SpiderGen.runAlone=false;
	//turn off spider spawn loop
	SpiderGen.nextSpider=function(){}
	}

Darwinia.loopCount=0;

Darwinia.loop=function()
  {
  if(Darwinia.loopCount%10==0)
	  {
		TreeObject.loop();
		}
	
	if(Darwinia.logoVanish && Darwinia.loopCount%5==0)
  	{
		if(Darwinia.logoVanishCount<10)
  		{
    	Darwinia.introDiv.style.opacity=1-0.1*Darwinia.logoVanishCount;
  		}
  	else
		  {
  		Darwinia.introDiv.style.display="none";
			Darwinia.logoVanish=false;
			}
		Darwinia.logoVanishCount++
  	}
	
	Darwinians.loop();
	SpiderGen.loop();
	Darwinia.loopCount++;
	}