/* 
 * Copyright Luke Wallin 2012
 */


var Graphics=function(width,height){
    //main game canvas size
    this.width=width;
    this.height=height;
    
    //this.groundScale=10;
    
    this.groundHeight=this.height*10;
    this.groundWidth=this.width;
    this.groundCanvas=document.createElement("canvas");
    this.groundCanvas.width=this.groundWidth;
    this.groundCanvas.height=this.groundHeight;
    this.groundBuffer = this.groundCanvas.getContext("2d");
    
    this.waterHeightTimes=10;
    
    this.waterHeight=this.height*this.waterHeightTimes;
    this.waterWidth=this.width*10;
    this.waterCanvas=document.createElement("canvas");
    this.waterCanvas.width=this.waterWidth;
    this.waterCanvas.height=this.waterHeight;
    this.waterBuffer = this.waterCanvas.getContext("2d");
    
    
    
    //extra wide is for the spinning animation
    this.drawGround=function(ctx,time,extraWide){
        
        var y = -this.groundHeight + time%(this.groundHeight);
        
        ctx.drawImage(this.groundCanvas, 0, y,this.width,this.height*10);
        if(extraWide){
            ctx.drawImage(this.groundCanvas, -this.width, y,this.width,this.height*10);
            ctx.drawImage(this.groundCanvas, this.width, y,this.width,this.height*10);
        }
        //y+groundHeight is the bottom of the image
        if(this.extraWide || y+this.groundHeight < this.height){
            //whitespace under the image
            ctx.drawImage(this.groundCanvas, 0, y+this.groundHeight,this.width,this.height*10);
            if(extraWide){
                ctx.drawImage(this.groundCanvas, -this.width, y+this.groundHeight,this.width,this.height*10);
                ctx.drawImage(this.groundCanvas, this.width, y+this.groundHeight,this.width,this.height*10);
            }
        }
        
        
        
    }
    
    this.waterColours=createArray(10,this.waterHeightTimes*10);
    
    this.drawWater=function(ctx,time,waveTime,extraWide){
        ctx.save();
        //        var y = -this.waterHeight + time%(this.waterHeight);
        //        var offset = Math.round(time/50)%10;
        //        var x = -offset*this.waterWidth*0.1;
        //        
        //        ctx.drawImage(this.waterCanvas, x, y);
        ////        if(extraWide){
        ////            ctx.drawImage(this.waterCanvas, -this.width, y,this.width,this.height*10);
        ////            ctx.drawImage(this.waterCanvas, this.width, y,this.width,this.height*10);
        ////        }
        //        //y+waterHeight is the bottom of the image
        //        if(this.extraWide || y+this.waterHeight < this.height){
        //            //whitespace under the image
        //            ctx.drawImage(this.waterCanvas, x, y+this.waterHeight);
        ////            if(extraWide){
        ////                ctx.drawImage(this.waterCanvas, -this.width, y+this.waterHeight,this.width,this.height*10);
        ////                ctx.drawImage(this.waterCanvas, this.width, y+this.waterHeight,this.width,this.height*10);
        ////            }
        //        }
        //        
        
        
        
        var wavePosX = -4 + (waveTime/10)%18;
        var wavePosX2 = -4 + (waveTime/10 + 9)%18;
        //change the colours based on the wave positions
        for(var x=0;x<10;x++){
            for(var y=0;y<this.waterHeightTimes*10;y++){
                if(Math.abs(x-wavePosX)<3){
                    if(x<wavePosX){
                        this.waterColours[x][y]+=2;
                    }else{
                        this.waterColours[x][y]-=2;
                    }
                }
                
                if(Math.abs(x-wavePosX2)<3){
                    if(x<wavePosX2){
                        this.waterColours[x][y]+=2;
                    }else{
                        this.waterColours[x][y]-=2;
                    }
                }
            }
        }
        
        
        var yOffset=(time)%(this.height*this.waterHeightTimes);
        
        var yPos = yOffset-this.waterHeight;
        
        //only draw the bits we need
        
        //pixely = y*size + yPos
        //therefore
        //y = (pixely - ypos)/size
        
        var startY = Math.floor((-this.height*0.1-yPos)/(this.height*0.1));
        var endY = Math.ceil((this.height*1.1-yPos)/(this.height*0.1));
        //        if(endY < startY){
        //            endY=startY+12;
        //        }

        //        while(startY<0){
        //            startY+=this.waterHeightTimes*10;
        //        }
        //        
        //        while(endY<0){
        //            endY+=this.waterHeightTimes*10;
        //        }
        
        var startX = extraWide ? -5 : 0;
        var endX = extraWide ? 15 : 10;
        
        for(var x=startX;x<endX;x++){
            for(var y=startY;y<endY;y++){
                var c = Math.round(this.waterColours[(x+10)%10][y%(this.waterHeightTimes*10)]);
                ctx.fillStyle=(new Colour(c,c, Math.min(c+128,255))).toRGB();
                //this.groundBuffer.fillStyle="rgb(255,0,0)";
                ctx.fillRect(x*this.width*0.1, y*this.width*0.1 + yPos ,Math.round(this.width*0.1)+1,Math.round(this.height*0.1)+1);
                
                
                
                
            //keep in range
            //                this.waterColours[(x+10)%10][y]=Math.min(192,this.waterColours[x][y]);
            //                this.waterColours[(x+10)%10][y]=Math.max(96,this.waterColours[x][y]);
            }
        }    

        //        ctx.beginPath();
        //        ctx.moveTo(wavePosX*this.width*0.1,0);
        //        ctx.lineTo(wavePosX*this.width*0.1,this.height);
        //        ctx.stroke();
        
        ctx.restore();


    }
    
    //build up the off screen buffers
    this.buildBuffers=function(){
        for(var x=0;x<this.groundWidth;x+=this.width*0.1){
            for(var y=0;y<this.groundHeight;y+=this.height*0.1){
                
                this.groundBuffer.fillStyle=(new Colour(Math.round(Math.random()*64),Math.round(128 + Math.random()*128), Math.round(Math.random()*64))).toRGB();
                //this.groundBuffer.fillStyle="rgb(255,0,0)";
                this.groundBuffer.fillRect(x,y,this.width*0.1,this.height*0.1);
            }
        }
        
        //grey it slightly
        this.groundBuffer.fillStyle="rgba(255,255,255,0.3)";
        this.groundBuffer.fillRect(0,0,this.groundWidth,this.groundHeight);
        
        for(var x=0;x<10;x++){
            for(var y=0;y<this.waterHeightTimes*10;y++){
                //this.waterColours[x][y]=Math.round(96+Math.random()*96);
                this.waterColours[x][y]=Math.round(96+Math.random()*64);
            }
        }
    //        for(var x=0;x<this.waterWidth;x+=this.width*0.1){
    //            for(var y=0;y<this.waterHeight;y+=this.height*0.1){
    //                var c = Math.round(96+Math.random()*96)
    //                this.waterBuffer.fillStyle=(new Colour(c,c, Math.min(c+128,255))).toRGB();
    //                //this.groundBuffer.fillStyle="rgb(255,0,0)";
    //                this.waterBuffer.fillRect(x,y,this.width*0.1,this.height*0.1);
    //            }
    //        }
    }
    
    this.buildBuffers();
}

//as per Graphics graphics, this will draw centred around 0,0
Graphics.bullet=function(ctx,size,state){
    ctx.save();
    ctx.lineWidth=size*0.3;
    ctx.lineCap="round";
    ctx.beginPath();
    //var start = pos.addMultiple(dir,-size/2);
    
    ctx.moveTo(0,-size/2);
    
    //var end = pos.addMultiple(dir,size/2);
    
    ctx.lineTo(0,size/2);
    ctx.stroke();
    ctx.restore();
}

Graphics.rocketDown=function(ctx,size,state){
    ctx.save();
    ctx.scale(1,-1);
    Graphics.rocket(ctx, size,state);
    ctx.restore();
}

Graphics.rocket=function(ctx,size,state){
    ctx.save();
    //point upwards
    ctx.scale(1,-1);
    
    ctx.lineWidth=size*0.05;
    ctx.lineCap="miter";
    ctx.lineJoin="miter";
    ctx.fillStyle="rgb(200,200,32)";
    
    
    //fins:
    ctx.beginPath();
    Graphics.rocketFinsPath(ctx, size,state);
    ctx.fill();
    
    ctx.beginPath();
    Graphics.rocketFinsPath(ctx, size,state);
    ctx.stroke();
    
    //the cigar bit:
    
    ctx.beginPath();
    //bottom left
    Graphics.rocketBodyPath(ctx, size,state);
    ctx.fill();
    
    ctx.beginPath();
    //bottom left
    Graphics.rocketBodyPath(ctx, size,state);
    ctx.stroke();
    
    
    
    
    ctx.restore();
}

Graphics.rocketFinsPath=function(ctx,size,state){
    var width=size*0.2;
    var baseWidth=width*0.2;
    
    ctx.save();
    
    ctx.translate(0,-size*0.1);
    
    ctx.moveTo(-baseWidth*0.4,size*0.45);
    ctx.lineTo(-width*0.9,size*0.49);
    ctx.lineTo(-width,size*0.4);
    ctx.lineTo(0,size*0.1);
    ctx.lineTo(-baseWidth*0.4,size*0.45);
    
    ctx.moveTo(baseWidth*0.4,size*0.45);
    ctx.lineTo(width*0.9,size*0.49);
    ctx.lineTo(width,size*0.4);
    ctx.lineTo(0,size*0.1);
    ctx.lineTo(baseWidth*0.4,size*0.45);
    
    ctx.restore();
}

Graphics.rocketBodyPath=function(ctx,size,state){
    var width=size*0.2;
    var baseWidth=width*0.2;
    ctx.moveTo(0,size/2);
    ctx.lineTo(-baseWidth/2,size/2);
    ctx.bezierCurveTo(-width*0.5, size*0.3, -width*0.4, -size/2, 0, -size/2);
    ctx.bezierCurveTo(width*0.4, -size/2, width*0.5, size*0.3, baseWidth/2, size/2);
    ctx.lineTo(0,size/2);
}


Graphics.bombFriendly=function(ctx,size,state){
    ctx.save();
    //point upwards
    ctx.scale(1,-1);
    
    Graphics.bomb(ctx, size,state);
    
    ctx.restore();
}

Graphics.bomb=function(ctx,size,state){
    ctx.save();
    //point upwards
    ctx.scale(1,-1);
    
    
    var bombBodyLength=size*3/4;
    var bombBodyWidth=size*0.3;
    
    ctx.lineWidth=size*0.05;
    ctx.lineCap="miter";
    ctx.lineJoin="miter";
    ctx.fillStyle="rgb(90,140,90)";
    
    var fins=function(){
        ctx.moveTo(0,bombBodyLength/3);
        ctx.lineTo(-bombBodyWidth/2,(1/3+0.1)*bombBodyLength);
        ctx.lineTo(-bombBodyWidth/2,size/2);
        ctx.lineTo(bombBodyWidth/2,size/2);
        ctx.lineTo(bombBodyWidth/2,(1/3+0.1)*bombBodyLength);
        ctx.lineTo(0,bombBodyLength/3);
        ctx.lineTo(0,size/2);
    }
    
    var body = function(){
        var width=size*0.4;
        var baseWidth=width*0.1;
        ctx.moveTo(0,bombBodyLength/3);
        ctx.lineTo(-baseWidth/2,bombBodyLength/3);
        ctx.bezierCurveTo(-width*0.5, size*0.25, -width*0.4, -size/2, 0, -size/2);
        ctx.bezierCurveTo(width*0.4, -size/2, width*0.5, size*0.25, baseWidth/2, bombBodyLength/3);
        ctx.lineTo(0,bombBodyLength/3);
    }
    
    //fins:
    ctx.beginPath();
    fins();
    ctx.fill();
    
    ctx.beginPath();
    fins();
    ctx.stroke();
    
    //the cigar bit:
    
    ctx.beginPath();
    //bottom left
    body();
    ctx.fill();
    
    ctx.beginPath();
    //bottom left
    body();
    ctx.stroke();
    
    
    
    
    ctx.restore();
}


Graphics.barrageBalloonRight=function(ctx,size,state){
    ctx.save();
    ctx.scale(-1,1);
    
    Graphics.barrageBalloonLeft(ctx, size,state);
    
    ctx.restore();
}

Graphics.barrageBalloonLeft=function(ctx,size,state){
    ctx.save();
    
    var balloonBody=function(){
        //far right - the tail end?
        ctx.moveTo(size/2,0);
        ctx.bezierCurveTo(size/2, -size*0.2, -size/2, -size*0.4, -size/2, 0);
        ctx.bezierCurveTo(-size/2, size*0.4, size/2, size*0.2,  size/2, 0);
    }
    
    var topFin=function(){
        ctx.moveTo(size*0.4,-size*0.05);
        ctx.arc(size*0.3,-size*0.2,size*0.175,Math.PI*0.2,Math.PI*1.2,true);
        ctx.lineTo(size*0.05,-size*0.15);
        ctx.lineTo(size*0.4,-size*0.05);
        ctx.lineTo(size*0.3+Math.cos(Math.PI*0.2)*size*0.175,-size*0.2+Math.sin(Math.PI*0.2)*size*0.175);
    }
    var bottomFin=function(){
        ctx.moveTo(size*0.4,size*0.05);
        ctx.arc(size*0.3,size*0.2,size*0.175,-Math.PI*0.2,-Math.PI*1.2,false);
        ctx.lineTo(size*0.05,size*0.15);
        ctx.lineTo(size*0.4,size*0.05);
        ctx.lineTo(size*0.3+Math.cos(-Math.PI*0.2)*size*0.175,size*0.2+Math.sin(-Math.PI*0.2)*size*0.175);
    }
    
    ctx.lineWidth=size*0.05;
    ctx.lineCap="miter";
    ctx.lineJoin="miter";
    
    var grad = ctx.createLinearGradient(0,-size*0.3,0,size*0.3);
    grad.addColorStop(0, "rgb(128,128,192)");
    grad.addColorStop(1, "rgb(32,32,80)");
    
    ctx.fillStyle=grad;//"rgb(128,128,192)";
    
    
    
    ctx.beginPath();
    balloonBody();
    ctx.fill();
    
    ctx.beginPath();
    balloonBody();
    ctx.stroke();
    
    ctx.fillStyle="rgb(96,96,144)";
    
    //ctx.fillStyle="rgb(64,64,96)";
    ctx.beginPath();
    topFin();
    ctx.fill();
    
    //ctx.fillStyle="rgb(128,128,192)";
    ctx.beginPath();
    bottomFin();
    ctx.fill();
    
    ctx.beginPath();
    topFin();
    bottomFin();
    ctx.stroke();
    
    ctx.restore();
}

Graphics.aaGun=function(ctx,size,state){
    ctx.save();
    
    
    ctx.lineWidth=size*0.03;
    ctx.lineCap="miter";
    ctx.lineJoin="miter";
    
    var gunWidth=size*0.1;
    var gunLength=size/2;
    
    var shieldWidth=size*0.9;
    var shieldHeight=size*0.3;
    
    var barrel=function(){
        ctx.moveTo(-gunWidth/2,0)
        //Graphics.halfEllipsePath(ctx, 0, 0, gunWidth, gunWidth*0.5, true);
        Graphics.ellipseFromArc(ctx, 0, 0, gunWidth/2, gunWidth/4, Math.PI, 0, false)
        ctx.lineTo(gunWidth/2,gunLength);
        //Graphics.halfEllipsePath(ctx, 0, gunLength, gunWidth, gunWidth*0.5, false);
        Graphics.ellipseFromArc(ctx, 0, gunLength, gunWidth/2, gunWidth/4, 0, Math.PI, false)
        ctx.lineTo(-gunWidth/2,0);
    }
    
    var cross=function(){
        ctx.moveTo(-size/2,-size/2);
        ctx.lineTo(size/2,size/2);
        ctx.moveTo(-size/2,size/2);
        ctx.lineTo(size/2,-size/2);
    }
    
    //base:
    //ctx.fillStyle="rgb(96,96,96)";
    
    ctx.save();
    ctx.translate(0,-size*0.1);
    
    ctx.fillStyle="rgb(8,32,8)";
    
    
    //cross supports
    ctx.save();
    //ctx.strokeStyle="rgb(96,96,96)";
    ctx.strokeStyle="rgb(8,32,8)";
    ctx.lineWidth=size*0.1;
    ctx.beginPath();
    cross();
    ctx.stroke();
    ctx.restore();
    //    ctx.beginPath();
    //    cross();
    //    ctx.stroke();
    
    //circle bit
    ctx.beginPath();
    ctx.arc(0,0,size*0.3,0,Math.PI*2,true);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0,0,size*0.3,0,Math.PI*2,true);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(0,0,size*0.3,0,Math.PI*2,true);
    ctx.fill();
    
    ctx.restore();
    
    ctx.fillStyle="rgb(16,64,16)";
    //shield
    ctx.fillRect(-shieldWidth/2,-shieldHeight/2,shieldWidth,shieldHeight);
    ctx.strokeRect(-shieldWidth/2,-shieldHeight/2,shieldWidth,shieldHeight);
    
    //gun:
    ctx.beginPath();
    barrel();
    ctx.fill();
    
    ctx.beginPath();
    barrel();
    ctx.moveTo(gunWidth/2,gunLength);
    Graphics.ellipseFromArc(ctx, 0, gunLength, gunWidth/2, gunWidth/4, 0, Math.PI, true)
    ctx.stroke();
    
    ctx.restore();
}

//http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
Graphics.ellipseFromArc=function(ctx, cx, cy, rx, ry,a1,a2, clockwise){
    ctx.save(); // save state
    //ctx.beginPath();

    ctx.translate(cx-rx, cy-ry);
    ctx.scale(rx, ry);
    ctx.arc(1, 1, 1, a1, a2, clockwise);

    ctx.restore(); // restore to original state
//ctx.stroke();
}


Graphics.playerCar = function(ctx,size,state){
    ctx.strokeRect(-size/2,-size/2,size,size,state);
}

Graphics.enemyCar = function(ctx,size,state){
    //ctx.strokeRect(0.5,0.5,size,size,state);
    ctx.strokeRect(-size/2,-size/2,size,size,state);
}


Graphics.friendlyVickersValiant=function(ctx,size,state){
    //facing upwards
    ctx.scale(1,-1);
    
    //not by design, but the colour gradient doesn't chagne dir because it's only the yaxis that is inverted
    
    Graphics.vickersValiant(ctx,size,state);
}

Graphics.vickersValiant=function(ctx,size,state){
    size*=1.1;
    ctx.save();
    //685 long
    //733 wing to wing
    //71 wide at middle
    //170 tip to straight line bit
    //418 tip to bend in at end
    
    //so that up is +ve y
    //ctx.scale(1,-1);
    
    //    var bodyLength=size*0.9;
    //    //var tipToStraight=size*0.23;
    //    var centreToTopBend=size*0.3;
    //    
    //    var centreToBottomMidBend=size*0.2;
    
    var bodyWidth=size*0.1;
    
    //var centreToBottomBend=size*0.1;
    
    
    
    ctx.fillStyle="rgb(128,128,128)";
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.lineWidth=size*0.03;
    ctx.lineCap="round";
    ctx.lineJoin="round";
    
    ctx.beginPath();
    Graphics.vickersWingsPath(ctx, size, state);
    ctx.fill();
    
    //giving it a bold outline to make it more cartoony
    ctx.beginPath();
    Graphics.vickersWingsPath(ctx, size, state);
    ctx.stroke();
    
    var grad = ctx.createLinearGradient(-bodyWidth/2,0,bodyWidth/2,0);
    grad.addColorStop(0, "rgba(128,128,128,1)");
    grad.addColorStop(1, "rgba(0,0,0,1)");
    
    ctx.fillStyle=grad;
    
    //main body
    ctx.beginPath();
    Graphics.vickersBodyPath(ctx, size, state);
    //ctx.stroke();
    ctx.fill();
    
    ctx.beginPath();
    Graphics.vickersBodyPath(ctx, size, state);
    ctx.stroke();
    
    
    ctx.restore();
}

Graphics.vickersBodyPath=function(ctx,size,state){
    
    var bodyLength=size*0.9;
    //var tipToStraight=size*0.23;
    var centreToTopBend=size*0.3;
    
    var centreToBottomMidBend=size*0.2;
    
    var bodyWidth=size*0.1;
    
    var centreToBottomBend=size*0.1;
    
    //bottom left square bit of body
    ctx.moveTo(-bodyWidth/2,-centreToBottomBend);
    ctx.lineTo(-bodyWidth/2,centreToTopBend);
    ctx.quadraticCurveTo(-bodyWidth/2, bodyLength/2, 0, bodyLength/2);
    //now at tip of nose
    ctx.quadraticCurveTo(bodyWidth/2, bodyLength/2, bodyWidth/2, centreToTopBend);
    //ctx.bezierCurveTo(-bodyWidth/2, -bodyLength/2, bodyWidth/2, -bodyLength/2, bodyWidth/2, 0);
    ctx.lineTo(bodyWidth/2,-centreToBottomBend);
    
    ctx.bezierCurveTo(bodyWidth*0.5, -centreToBottomMidBend, bodyWidth*0.2, -bodyLength/2, 0, -bodyLength/2);
    ctx.bezierCurveTo(-bodyWidth*0.2, -bodyLength/2,-bodyWidth*0.5, -centreToBottomMidBend, -bodyWidth/2,-centreToBottomBend);
    
}

Graphics.vickersWingsPath=function(ctx,size,state){
    
    var bottomWingBit=size*0.06;
    
    var centreToWingBottom=size*0.09;
    
    var topWingBitX=size*0.2;
    var topWingBitY = size*0.1;
    var topWingAtCentre=size*0.28;
    
    var bodyWidth=size*0.1;
    //left wing
    ctx.moveTo(0,-bottomWingBit);
    ctx.lineTo(-(bodyWidth/2 + bottomWingBit),-bottomWingBit);
    ctx.lineTo(-size/2,-centreToWingBottom);
    ctx.lineTo(-size/2,0);
    ctx.lineTo(-topWingBitX,topWingBitY);
    ctx.lineTo(0,topWingAtCentre);
    //    ctx.fill();
    //    //right wing
    //    ctx.beginPath();
    ctx.moveTo(0,-bottomWingBit);
    ctx.lineTo((bodyWidth/2 + bottomWingBit),-bottomWingBit);
    ctx.lineTo(size/2,-centreToWingBottom);
    ctx.lineTo(size/2,0);
    ctx.lineTo(topWingBitX,topWingBitY);
    ctx.lineTo(0,topWingAtCentre);
    //    ctx.fill();
    //    
    //    //bottom wing-things?
    //    ctx.beginPath();
    ctx.moveTo(0,-size*0.3);
    ctx.lineTo(-size*0.175,-size*0.38);
    ctx.lineTo(-size*0.175,-size*0.43);
    ctx.lineTo(0,-size*0.4);
    //now at bottom
    ctx.lineTo(size*0.175,-size*0.43);
    ctx.lineTo(size*0.175,-size*0.38);
    ctx.lineTo(0,-size*0.3);
}
Graphics.eurofighter=function(ctx,size,state){
    
    //image width = 530.48
    //default width = 360.6672348
    //left needs to be at 84.9063826
    
    
    size*=1.1;
    
    ctx.save();
    
    ctx.scale(1,-1);
    //fix offset
    ctx.translate(79.9832374*size/530.48,0);
    
    ctx.strokeStyle = 'rgb(0,0,0)';
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'miter';
    ctx.miterLimit = 4;
    //ctx.translate(-337.85009,-228.39401);
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = size*0.03;
    ctx.lineCap = "round";
    ctx.miterLimit = 4;

    //put canvas back to normal coords
    ctx.translate(-size/2,-size/2);


    //grey wings
    ctx.fillStyle="rgb(128,128,128)";
    ctx.beginPath();
    Graphics.eurofigherWings(ctx, size, state);
    ctx.fill();
    
    ctx.beginPath();
    Graphics.eurofigherWings(ctx, size, state);
    ctx.stroke();

    //    var grad = ctx.createLinearGradient(Math.round(size/2-size*0.07),0,Math.round(size/2+size*0.07),0);//size/2+size*0.15/2
    var grad = ctx.createLinearGradient(size*0.3,0,size*0.7,0);//size/2+size*0.15/2
    grad.addColorStop(0, "rgba(128,128,128,1)");
    grad.addColorStop(1, "rgba(0,0,0,1)");
    
    
    ctx.fillStyle=grad;
    ctx.beginPath(); 
    //body with gradient colour
    Graphics.eurofigherBody2(ctx, size, state);
    ctx.fill();

    
    ctx.beginPath();
    
    //    Graphics.eurofigherWings(ctx, size, state);
    //    
    Graphics.eurofigherBody2(ctx, size, state);
    Graphics.eurofigherThinBitsLines(ctx, size, state);
    
    
    ctx.stroke();
    
    
    
    //    ctx.fillStyle="rgb(0,0,0)";
    //    ctx.beginPath();
    //    
    //    Graphics.eurofigherWings(ctx, size, state);
    //    
    //    ctx.fill();
    
    ctx.restore();
}

Graphics.eurofigherThinBitsLines=function(ctx,size,state){
    
    ctx.save();
    ctx.scale(size/530.48,size/530.48);
    //tx.save();
    
    //ctx.translate(0,-521.88218);
    ctx.moveTo(4.9231452,360.11501);
    ctx.lineTo(4.9231452,437.41242);
    //ctx.restore();
    
    //    //ctx.save();
    //ctx.translate(0,521.88216);
    ctx.moveTo(365.59038,364.85472);
    ctx.lineTo(365.59038,442.15207);
    
    ctx.moveTo(185.28286,390.83672);
    ctx.lineTo(185.28286,529.47994);
    
    //ctx.restore();
    ctx.restore();
}

Graphics.eurofigherThinBits=function(ctx,size,state){
    ctx.save();
    ctx.scale(size/530.48,size/530.48);
    
    ctx.translate(0,-521.88218);
    
    ctx.moveTo(185.28286,1051.3621);
    ctx.bezierCurveTo(188.33487,1036.9858000000002,191.60291,916.2371300000001,185.28286,912.71888);
    ctx.bezierCurveTo(178.96275,916.23713,182.23084,1036.9858,185.28286,1051.3621);
    ctx.closePath();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(4.9231452,881.99717);
    ctx.bezierCurveTo(-1.2837183999999997,887.90526,1.7329298000000004,959.29458,1.7329298000000004,959.29458);
    ctx.lineTo(4.9231452,959.29458);
    ctx.lineTo(8.1134163,959.29458);
    ctx.bezierCurveTo(8.1134163,959.29458,11.130064,887.90526,4.9231452,881.99717);
    ctx.closePath();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(365.59038,886.73688);
    ctx.bezierCurveTo(371.69486,906.7175000000001,371.8848,955.5100100000001,365.59038,964.03423);
    ctx.bezierCurveTo(359.80273,960.36289,361.25615999999997,903.19057,365.59038,886.7368799999999);
    ctx.closePath();
    ctx.stroke();
    
    ctx.restore();
}

Graphics.eurofigherBody2=function(ctx,size,state){
    ctx.save();
    ctx.scale(size/530.48,size/530.48);
    
    ctx.translate(0,-521.88218);
    
    
    
    ctx.moveTo(191.29097,1014.3958);
    ctx.lineTo(213.33032999999998,1014.535);
    ctx.bezierCurveTo(213.33032999999998,1014.535,219.43442,994.6445299999999,220.61579999999998,934.18515);
    ctx.bezierCurveTo(221.79724,873.72582,212.34578999999997,758.12442,214.41333999999998,748.96685);
    ctx.bezierCurveTo(207.62009999999998,651.58205,203.97735999999998,559.80983,185.28279999999998,522.88441);
    ctx.bezierCurveTo(166.58828999999997,559.80983,162.94554999999997,651.58205,156.15231999999997,748.96685);
    ctx.bezierCurveTo(158.21979999999996,758.12442,148.76841999999996,873.72582,149.94979999999998,934.18515);
    ctx.bezierCurveTo(151.13123,994.64453,157.23532999999998,1014.5350000000001,157.23532999999998,1014.5350000000001);
    ctx.lineTo(179.27468,1014.3958000000001);
    ctx.lineTo(191.29097,1014.3958000000001);
    
    ctx.restore();
}

Graphics.eurofigherWings=function(ctx,size,state){
    ctx.save();
    ctx.scale(size/530.48,size/530.48);
    
    ctx.translate(0,-521.88218);
    //top wings:
    
    ctx.moveTo(203.38665,602.4465);
    ctx.lineTo(248.37942,648.62801);
    ctx.bezierCurveTo(248.37942,648.62801,249.95467000000002,650.5973700000001,249.65929,656.30853);
    ctx.bezierCurveTo(249.36395,662.01964,249.26547,665.46604,249.26547,665.46604);
    ctx.lineTo(207.71853,652.96065);
   
    ctx.moveTo(203.38665,602.4465);
    ctx.lineTo(167.17902,602.4465);
    ctx.lineTo(122.18625,648.62801);
    ctx.bezierCurveTo(122.18625,648.62801,120.611,650.5973700000001,120.90639,656.30853);
    ctx.bezierCurveTo(121.2017,662.01964,121.3002,665.46604,121.3002,665.46604);
    ctx.lineTo(162.84708,652.96065);
    ctx.lineTo(207.71853000000002,652.96065);
    
    
    //bottom wings:
    
    ctx.moveTo(151.72196,975.6402300000001);
    ctx.lineTo(218.84365,975.6402300000001);
    ctx.lineTo(227.31056,969.23981);
    ctx.lineTo(227.14591000000001,954.4333);
    ctx.lineTo(361.93934,947.81111);
    //ctx.moveTo(361.93934,947.81111);
    ctx.lineTo(361.99354,904.4479);
    ctx.lineTo(212.33772,710.7769499999999);
    ctx.lineTo(157.51362,710.7769499999999);
    //ctx.moveTo(157.51362,710.77695);
    ctx.lineTo(8.5721215,904.4479);
    ctx.lineTo(8.6263195,947.81111);
    //ctx.moveTo(8.6263194,947.81111);
    ctx.lineTo(143.41976,954.4333);
    ctx.lineTo(143.25504,969.23981);
    ctx.lineTo(151.72196,975.6402300000001);
    
    ctx.restore();
}

//taken from an SVG from wikipedia
Graphics.eurofigherBody=function(ctx,size,state){
   
    ctx.save();

    //ctx.scale(0.5,0.5);
    //size/height of SVG
    ctx.scale(size/492.651,size/492.651)
    //x = half of width of SVG + svgtocanvas translate
    ctx.translate(-374.28609,-228.39401-493.63/2);
    //ctx.scale(70/size,250/size,state);
    //ctx.scale(size/250,size/250);


    //ctx.beginPath();
    //ctx.moveTo(402.33324,721.04465);
    //ctx.bezierCurveTo(402.33324,721.04465,408.43733,701.15413,409.61870999999996,640.69475);
    //ctx.bezierCurveTo(410.80015,580.23542,401.34869999999995,464.63401999999996,403.41625,455.47645);
    //ctx.bezierCurveTo(396.62300999999997,358.09165,392.98027,266.31943,374.28571,229.39401);
    //ctx.bezierCurveTo(355.5912,266.31943,351.94847,358.09165,345.15523,455.47645);
    //ctx.bezierCurveTo(347.22272000000004,464.63402,337.77133000000003,580.23542,338.95271,640.69475);
    //ctx.bezierCurveTo(340.13415000000003,701.15413,346.23824,721.04465,346.23824,721.04465);
    ctx.moveTo(402.33324,721.04465);
    ctx.bezierCurveTo(402.33324,721.04465,408.43733,701.15413,409.61870999999996,640.69475);
    ctx.bezierCurveTo(410.80015,580.23542,401.34869999999995,464.63401999999996,403.41625,455.47645);
    ctx.bezierCurveTo(396.62300999999997,358.09165,392.98027,266.31943,374.28571,229.39401);
    ctx.bezierCurveTo(355.5912,266.31943,351.94847,358.09165,345.15523,455.47645);
    ctx.bezierCurveTo(347.22272000000004,464.63402,337.77133000000003,580.23542,338.95271,640.69475);
    ctx.bezierCurveTo(340.13415000000003,701.15413,346.23824,721.04465,346.23824,721.04465);
    ctx.lineTo(402.33324000000005,721.04465);

    ctx.restore();

//71 wide ~ 70
//492 high ~ 500

//myX = (x-373)/70
//myY = (y-474)/250

//bottom centre
//ctx.moveTo(0,size/2);
////bottom right
//ctx.moveTo(size*0.13,size/2);
//x, 402 = size*0.4
//x, 410=0.5
//x, 396 = 0.3
//x, 392 = 0.25
//x, 374 = 0
//bottom right?
//ctx.moveTo(size*0.4,721.04465);
//ctx.bezierCurveTo(size*0.4,721.04465, size*0.5 ,701.15413, size*0.5 ,640.69475);
//ctx.bezierCurveTo(size*0.5,580.23542, size*0.4 ,464.63401999999996, size*0.4 ,455.47645);
//ctx.bezierCurveTo(size*0.3 ,358.09165, size*0.25 ,266.31943, 0 ,229.39401);
//ctx.bezierCurveTo(-size*0.25 ,266.31943, -size*0.25 ,358.09165,-size*0.4,455.47645);
//ctx.bezierCurveTo(-size*0.35,464.63402, 0 ,580.23542, 0 ,640.69475);
//ctx.bezierCurveTo(0 ,701.15413, -size*0.4 ,721.04465,-size*0.4,721.04465);
//ctx.fill();
//ctx.stroke();
//
//ctx.restore();
}


Graphics.sopwithCamel=function(ctx,size,state){
    //I always make it so thte wings just touch the side, then realise that's a bit small looking...
    size*=1.1;
    
    var topWing = function(){
        ctx.moveTo(13.33361,296.13685);
        ctx.bezierCurveTo(13.94504,308.14765,26.41664,349.90279,55.86486,350.7931);
        ctx.lineTo(522.52111,351.26185);
        ctx.bezierCurveTo(543.93083,347.61078,558.97455,327.7246,563.89611,294.63685);
        ctx.lineTo(563.89611,273.63685);
        ctx.bezierCurveTo(563.52841,263.89658,553.31168,259.46805,546.55236,259.63685);
        ctx.lineTo(310.61486,259.44935);
        ctx.bezierCurveTo(306.32409,276.36940999999996,301.93637,282.55832999999996,288.52111,282.63685);
        ctx.bezierCurveTo(275.61093,282.71535,268.94425,274.79192,266.89611,259.82435);
        ctx.lineTo(30.14611000000002,259.63685);
        ctx.bezierCurveTo(20.480170000000022,259.87413999999995,13.28464000000002,266.26435,13.333610000000022,274.19935);
        ctx.lineTo(13.333610000000022,296.13685);
    }
    
    var bottomWing=function(){
        ctx.moveTo(14.343762999999967,243.89477);
        ctx.lineTo(14.343763,265.83227);
        ctx.bezierCurveTo(14.955193,277.84307,27.426793,319.59821,56.875012999999996,320.48852);
        ctx.lineTo(523.53127,320.95727);
        ctx.bezierCurveTo(544.94098,317.3062,559.98471,297.42002,564.90627,264.33227);
        ctx.lineTo(564.90627,243.33227);
        ctx.bezierCurveTo(564.5385699999999,233.59199999999998,554.32184,229.16347,547.56252,229.33227);
        ctx.lineTo(31.156262999999967,229.33227);
        ctx.bezierCurveTo(21.490322999999968,229.56956,14.294792999999967,235.95977,14.343762999999967,243.89477);
        ctx.lineTo(14.343762999999967,265.83227);
    }
    
    var body = function(){
        ctx.moveTo(253.8051,350.9047);
        ctx.lineTo(267.25398,230.65217);
        ctx.bezierCurveTo(269.23082,182.30118000000002,269.69468,139.37990000000002,276.91851,94.11899000000003);
        ctx.lineTo(276.91851,84.11899000000003);
        ctx.lineTo(300.25906000000003,84.11899000000003);
        ctx.lineTo(300.25906000000003,94.11899000000003);
        ctx.bezierCurveTo(307.27547000000004,139.79253000000003,308.18660000000006,185.02782000000002,310.11113000000006,230.65217);
        ctx.lineTo(323.83421000000004,350.9047);
        
        //ctx.moveTo(323.83421,350.9047);
        ctx.bezierCurveTo(323.83421,350.9047,323.81980999999996,357.16038,323.83421,361.77844);
        ctx.bezierCurveTo(323.85990999999996,370.01553,306.75397999999996,368.76185,306.75397999999996,368.76185);
        ctx.lineTo(270.18726999999996,369.26693);
        ctx.bezierCurveTo(270.18726999999996,369.26693,253.73399999999995,369.75526,253.80509999999995,361.77844);
        ctx.bezierCurveTo(253.83179999999996,358.83296,253.80509999999995,350.9047,253.80509999999995,350.9047);
        ctx.lineTo(267.25398,230.65217);
    //ctx.lineTo(323.83421,350.9047);
    }
    
    var tail=function(){
        //ctx.beginPath();
        ctx.moveTo(288.52112,84.221143);
        ctx.lineTo(276.90437,84.221143);
        ctx.lineTo(276.90437,94.070123);
        ctx.lineTo(222.60866999999996,92.80743299999999);
        ctx.bezierCurveTo(218.92993999999996,91.18286299999998,217.61707999999996,87.950043,215.79013999999995,82.70591299999998);
        ctx.lineTo(209.72921999999994,55.68433299999998);
        ctx.bezierCurveTo(205.82969999999995,42.97917299999998,209.28761999999995,37.37245299999998,212.75967999999995,34.47112299999998);
        ctx.bezierCurveTo(218.09759999999994,30.010642999999977,224.12389999999994,30.683052999999976,224.12389999999994,30.683052999999976);
        ctx.lineTo(268.57060999999993,30.683052999999976);
        ctx.lineTo(285.74319999999994,50.12849299999998);
        ctx.lineTo(288.52111999999994,50.38103299999998);
        ctx.lineTo(288.52111999999994,84.22114299999998);
        
        
        ctx.moveTo(288.66904,84.221143);
        ctx.lineTo(300.28579,84.221143);
        ctx.lineTo(300.28579,94.070123);
        ctx.lineTo(354.58149000000003,92.80743299999999);
        ctx.bezierCurveTo(358.26022,91.18286299999998,359.57308,87.950043,361.40002000000004,82.70591299999998);
        ctx.lineTo(367.46094000000005,55.68433299999998);
        ctx.bezierCurveTo(371.36046000000005,42.97917299999998,367.90254000000004,37.37245299999998,364.43048000000005,34.47112299999998);
        ctx.bezierCurveTo(359.09256000000005,30.010642999999977,353.06626000000006,30.683052999999976,353.06626000000006,30.683052999999976);
        ctx.lineTo(308.61955000000006,30.683052999999976);
        ctx.lineTo(291.44696000000005,50.12849299999998);
        ctx.lineTo(288.66904000000005,50.38103299999998);
        ctx.lineTo(288.66904000000005,84.22114299999998);
        
        
    //        ctx.moveTo(287.25843,11.490153);
    //        ctx.lineTo(287.25843,92.807433);
    //        ctx.lineTo(290.03634999999997,92.807433);
    //        ctx.lineTo(290.03634999999997,11.490153000000007);
    //        ctx.lineTo(287.25843,11.490153000000007);
        
    }
    
    var prop=function(){
        ctx.save();
        ctx.translate(0,20);
        ctx.moveTo(288.01604,381.9636);
        ctx.bezierCurveTo(288.01604,381.9636,206.25705999999997,380.20932999999997,206.19368999999998,376.6603);
        ctx.bezierCurveTo(206.13058999999998,373.12477,288.77365999999995,372.87223,288.77365999999995,372.87223);
        ctx.bezierCurveTo(288.77365999999995,372.87223,371.54304999999994,372.61969,371.85871999999995,376.15522);
        ctx.bezierCurveTo(372.19676999999996,379.94136,288.01604,381.9636,288.01604,381.9636);
        ctx.restore();
    }
    
    ctx.save();
    
    
    //ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = 'rgb(0,0,0)';
    //unlike the others, the stroke is scaled here, not just the paths
    ctx.lineWidth = 0.03*551.58356;
    ctx.lineCap = "butt";
    ctx.lineJoin = "miter";
    ctx.miterLimit = 4;
    
    ctx.translate(-size/2,-size/2);
    
    ctx.translate(-12.833357*size/551.58356,-10.990152*size/551.58356);
    
    ctx.scale(size/551.58356,size/551.58356);
    
    //size of image
    //ctx.lineTo(551.58356,374.88272);
    
    //ctx.translate(-12.833357,-10.990152);
    
    //205-133-63
    //ctx.fillStyle="rgb(125,144,82)";
    ctx.fillStyle="rgb(205,133,63)";
    
    ctx.beginPath();
    bottomWing();
    ctx.fill();
    
    ctx.beginPath();
    bottomWing();
    ctx.stroke();
   
    ctx.beginPath();
    body();
    ctx.fill();
   
    ctx.beginPath();
    body();
    ctx.stroke();
    
    ctx.beginPath();
    tail();
    ctx.fill();
    
    ctx.beginPath();
    tail();
    ctx.stroke();
    
    ctx.beginPath();
    topWing();
    ctx.fill();
    
    ctx.beginPath();
    topWing();
    ctx.stroke();

    
    ctx.fillStyle="rgb(255,255,255)";

    ctx.beginPath();
    prop();
    ctx.fill();
    
    ctx.beginPath();
    prop();
    ctx.stroke();

    //ctx.fillRect(13.33361,296.13685,size*0.5,size*0.5)
    
    ctx.restore();
}

Graphics.skyFortress=function(ctx,size,state){
    
    var hsize=size/2;
    //var qsize=size/4;
    var esize=size/8;
    //was 128
    var darkGrey="rgb(64,64,64)";
    
    var basePlate=function(){
        ctx.moveTo(esize,-hsize);
        ctx.lineTo(hsize,-esize);
        ctx.lineTo(hsize,esize);
        ctx.lineTo(esize,hsize);
        ctx.lineTo(-esize,hsize);
        ctx.lineTo(-hsize,esize);
        ctx.lineTo(-hsize,-esize);
        ctx.lineTo(-esize,-hsize);
        ctx.closePath();
    }
    
    ctx.save();
    
    ctx.fillStyle=darkGrey;
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.lineWidth=size*0.01;
    
    //ctx.fillRect(-size/2,-size/2,size,size);
    
    var engineD=size*0.4;
    
    var engineR=size*0.06;
    
    ctx.save();
    ctx.strokeStyle=darkGrey;
    ctx.lineWidth=engineR;
    ctx.beginPath();
    ctx.moveTo(engineD,engineD);
    ctx.lineTo(-engineD,-engineD);
    ctx.moveTo(engineD,-engineD);
    ctx.lineTo(-engineD,engineD);
    ctx.stroke();
    
    ctx.restore();
    
    
    
    ctx.beginPath();
    ctx.arc(-engineD,-engineD,engineR,0,Math.PI*2,false);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(engineD,-engineD,engineR,0,Math.PI*2,false);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(-engineD,engineD,engineR,0,Math.PI*2,false);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(engineD,engineD,engineR,0,Math.PI*2,false);
    ctx.fill();
    ctx.stroke();
    
    
    ctx.beginPath();
    basePlate();
    ctx.fill();
    
    ctx.beginPath();
    basePlate();
    ctx.stroke();
    
    
    ctx.restore();
}

//3 bladed properller at angle of state
Graphics.prop=function(ctx,size,state){
    ctx.save();
    
    //ctx.fillStyle="rgb(0,0,0)";
    
    
    
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.lineCap="butt";
    ctx.lineWidth=size*0.1;
    
    ctx.rotate(state);
    //for(var a=state;a<Math.PI*2+state;a+=Math.PI*2/3){
    for(var i=0;i<3;i++){
        ctx.rotate(Math.PI*2/3);
        
        var grad = ctx.createLinearGradient(size/4, -size*0.05,size/4, size*0.05);
        grad.addColorStop(0,"rgb(32,32,32)");
        grad.addColorStop(1,"rgb(0,0,0)");
        ctx.strokeStyle=grad;
        
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(size/2,0);
        ctx.stroke();
    }
    
    var grad = ctx.createRadialGradient(0,0,0,0,0,size*0.1);
    grad.addColorStop(0,"rgb(64,64,64)");
    grad.addColorStop(1,"rgb(0,0,0)");
    ctx.fillStyle=grad;
    
    ctx.beginPath();
    //circle in middle
    ctx.arc(0,0,size*0.1,0,Math.PI*2,false);
    ctx.fill();
    
    ctx.restore();
}


Graphics.blank=function(ctx,size,state){
    //    ctx.save();
    //    ctx.strokeStyle="rgb(255,0,0)";
    //    ctx.beginPath();
    //    ctx.arc(0,0,size/2,0,Math.PI*2,true);
    //    ctx.stroke();
    //    ctx.restore();
    }

Graphics.lightningCoreWithDome=function(ctx,size,state){
    Graphics.lightningCore(ctx, size, state);
    Graphics.glassDome(ctx, size, state);
}

Graphics.lightningCore=function(ctx,size,state){
    size*=0.8;
    ctx.save();
    
    
    
    ctx.fillStyle="rgb(128,128,255)";
    
    Graphics.hexagonPath(ctx, size, state);
    //need to use close path more!! it links the last bits up :D
    ctx.fill();
    
    ctx.save();
    Graphics.hexagonPath(ctx, size, state);
    ctx.clip();
    
    
    //idea - big miter limit and use clipping?
    //var random=Math.random()*3452;
    var random=Math.round(state*10)+1;
    ctx.lineJoin="miter";
    ctx.miterLimit=10000;
    ctx.strokeStyle="rgb(255,255,0)";
    ctx.lineWidth=size*0.06;
    ctx.beginPath();
    Graphics.lightningPath(ctx, new Vector(size/2,0), new Vector(-size/2,0),random);
    ctx.stroke();
    
    ctx.strokeStyle="rgb(255,255,255)";
    ctx.lineWidth=size*0.02;
    ctx.beginPath();
    Graphics.lightningPath(ctx, new Vector(size/2,0), new Vector(-size/2,0),random);
    ctx.stroke();
    
    ctx.restore();
    
    ctx.lineWidth=size*0.05;
    ctx.strokeStyle="rgb(0,0,0)";
    Graphics.hexagonPath(ctx, size, state);
    //need to use close path more!! it links the last bits up :D
    ctx.stroke();
    
    ctx.restore();
}

Graphics.lightning=function(ctx,start,end,width){
    
    var random=Math.random()*10000 +1;
    
    ctx.save();
    ctx.lineJoin="miter";
    ctx.miterLimit=10000;
    ctx.strokeStyle="rgb(255,255,0)";
    ctx.lineWidth=width;
    ctx.beginPath();
    Graphics.lightningPath(ctx, start, end,random);
    ctx.stroke();
    
    ctx.strokeStyle="rgb(255,255,255)";
    ctx.lineWidth=width/2;
    ctx.beginPath();
    Graphics.lightningPath(ctx, start, end,random);
    ctx.stroke();
    
    ctx.restore();
}

Graphics.lightningPath=function(ctx,start,end,seed){
    if(typeof(seed)=="undefined"){
        //TODO max int
        seed = 1+Math.random()*100000;
    }
    var random = new sRand(seed);
    
    var d=end.subtract(start).multiply(0.5);
    var r = d.getMagnitude();
    var centre = start.add(d);
    
    var points = [];
    //make random points between start and end
    for(var i=0;i<4;i++){
        var randomR=random.next()*r;
        var randomA=random.next()*Math.PI*2;
        
        points.push(new Vector(centre.x + Math.cos(randomA)*randomR,centre.y + Math.sin(randomA)*randomR));
    }
    
    //sort so they're nearest to start
    //this would be better if it was nearest in line with d
    points.sort(function(a,b){
        //return a.subtract(start).getMagnitudeSqrd() - b.subtract(start).getMagnitudeSqrd();
        return a.subtract(start).dot(d) - b.subtract(start).dot(d);
    });
    
    //ctx.beginPath();
    ctx.moveTo(start.x,start.y);
    for(var i=0;i<points.length;i++){
        ctx.lineTo(points[i].x,points[i].y);
    }
    ctx.lineTo(end.x,end.y);
    
}

Graphics.hexagonPath=function(ctx,size,state){
    var width=size;
    var sideLength = width/Math.sqrt(3);
    var height = (2 / Math.sqrt(3)) * width;
    
    var hSideLength=sideLength/2;
    ctx.beginPath();
    //top right corner
    ctx.moveTo(width/2,-hSideLength);
    //top
    ctx.lineTo(0,-height/2);//-sideLength-hSideLength
    //top left
    ctx.lineTo(-width/2,-hSideLength);
    //bottom left
    ctx.lineTo(-width/2,hSideLength);
    //bottom
    ctx.lineTo(0,height/2);
    //bottom right
    ctx.lineTo(width/2,hSideLength);
    ctx.closePath();
//ctx.lineTo(width/2,-hSideLength);
//ctx.lineTo(0,-height/2);
}

Graphics.glassDome=function(ctx,size,state){
    ctx.save();
    
    var grad = ctx.createRadialGradient(-size*0.1,-size*0.1,size*0.1,0,0,size/2);
    //grad.addColorStop(0,"rgba(128,128,255,0.5)");
    grad.addColorStop(0,"rgba(190,190,255,0.5)");
    grad.addColorStop(1,"rgb(64,64,200)");
    
    ctx.fillStyle=grad;
    ctx.beginPath();
    ctx.arc(0,0,size/2,0,Math.PI*2,false);
    ctx.fill();
    
    ctx.restore();
}

Graphics.bossLightningCore=function(ctx,size,state,lifted){
    Graphics.lightningCore(ctx, size, state);
    Graphics.glassDomeLifting(ctx, size, lifted);
}

Graphics.glassDomeLifting=function(ctx,size,lifted){
    ctx.save();
    lifted = Math.min(0.9999,lifted);
    //lifted : 0 = shut, 1 = open
    
    var grad = ctx.createRadialGradient(-size*0.1,-size*0.1,size*0.1,0,0,size/2);
    //grad.addColorStop(0,"rgba(128,128,255,0.5)");
    grad.addColorStop(0,"rgba(190,190,255,0.5)");
    grad.addColorStop(1,"rgb(64,64,200)");
    
    
    var openFrom=Math.PI/3;
    
    var open1=openFrom-Math.PI*lifted;
    var open2 = openFrom+Math.PI*lifted;
    
    if(lifted<=0){
        open1=0;
        open2=Math.PI*2;
    }
    
    ctx.fillStyle=grad;
    ctx.beginPath();
    ctx.arc(0,0,size/2,open1,open2,true);
    ctx.fill();
    
    ctx.restore();
}

Graphics.lightningCage=function(ctx,size,state){
    var random=Math.round(state*10)+1;
    ctx.save();
    var points=[];
    var perSide=4;
    ctx.lineWidth=size*0.01;
    
    var corners = [ new Vector(-size/2,-size/2),
    new Vector(size/2,-size/2),
    new Vector(size/2,size/2),
    new Vector(-size/2,size/2)]
                    
    //just to save having to manually work out where all the posts are.  Also means I can easily and 
    //quickly adjust how many posts area on each side!
    for(var i=0;i<4;i++){
        var start = corners[i];
        var end = corners[(i+1)%4];
        
        var dir = end.subtract(start);
        for(var j=0;j<perSide;j++){
            points.push(start.addMultiple(dir,j*1/perSide));
        }
    }
    
    if(state >=0){
        //only draw the lighting in the default state
        ctx.lineJoin="miter";
        ctx.miterLimit=100;

        ctx.strokeStyle="rgb(128,128,255)";
        ctx.beginPath();
        for(i=0;i<points.length;i++){
            Graphics.lightningPath(ctx, points[i], points[(i+1)%(points.length)],random+i*10);
        }
        ctx.stroke();

        ctx.strokeStyle="rgb(128,128,255)";
        ctx.beginPath();
        for(i=0;i<points.length;i++){
            Graphics.lightningPath(ctx, points[i], points[(i+1)%(points.length)],random+i*10);
        }
        ctx.stroke();
    }
    
    ctx.strokeStyle="rgb(0,0,0)";
    ctx.fillStyle="rgb(128,64,32)";
    for(i=0;i<points.length;i++){
        ctx.beginPath();
        ctx.arc(points[i].x,points[i].y,size*0.02,0,Math.PI*2,true);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    ctx.restore();
    
//    var points = [  new Vector(-size/2,-size/2),
//                    new Vector(-size/2,-size/4),
//                    new Vector(-size/2, 0),
//                    new Vector(-size/2,size/4),
//                    new Vector(-size/2,size/2),
//                    ]
}


Graphics.seaMine=function(ctx,size,state){
    ctx.save();
    
    var grad = ctx.createRadialGradient(0,0,size/2,-size*0.101,-size*0.101,size*0.05);
    //grad.addColorStop(0,"rgba(128,128,255,0.5)");
    grad.addColorStop(0,"rgb(0,0,0)");
    grad.addColorStop(1,"rgb(64,64,64)");
    
    ctx.fillStyle=grad;
    ctx.beginPath();
    ctx.arc(0,0,size/2,0,Math.PI*2,true);
    
    ctx.fill();
    
    ctx.lineWidth=size*0.1;
    
    ctx.beginPath();
    ctx.lineCap="round";
    var angle=state;
    
    var startAt=size*0.3;
    var endAt=size*0.7;
    for(var i=0;i<4;i++){
        angle+=Math.PI*2/4;
        //4 spikes near top
        ctx.moveTo(Math.cos(angle)*startAt,Math.sin(angle)*startAt);
        ctx.lineTo(Math.cos(angle)*endAt,Math.sin(angle)*endAt);
    }
    
    angle+=Math.PI/4;
    startAt=size*0.5;
    endAt=size*0.7;
    for(var i=0;i<4;i++){
        angle+=Math.PI*2/4;
        //4 spikes near bottom
        ctx.moveTo(Math.cos(angle)*startAt,Math.sin(angle)*startAt);
        ctx.lineTo(Math.cos(angle)*endAt,Math.sin(angle)*endAt);
    }
    
    ctx.stroke();
    
    ctx.fillStyle="rgb(0,0,0)";
    ctx.beginPath();
    ctx.arc(0,0,size*0.05,0,Math.PI*2,true);
    ctx.fill();
    
    ctx.restore();
}

//loosely based on a US Landing Craft Air Cushion
Graphics.hovercraft=function(ctx,size,state){
    size*=1.2
    ctx.save();
    
    ctx.lineWidth=size*0.03;
    
    var width=size*0.75;
    var r=size*0.15;
    var gap=size*0.05;
    
    //rubber bit underneath:
    ctx.beginPath();
    ctx.moveTo(-width/2,-size/2);
    ctx.lineTo(-width/2,size/2-r);
    //bottom left round corner
    ctx.arc(-width/2+r,size/2-r,r,Math.PI,Math.PI/2,true);
    ctx.arc(width/2-r,size/2-r,r,Math.PI/2,0,true);
    ctx.lineTo(width/2,-size/2);
    ctx.closePath();
    ctx.fill();
    
    //grey-ey green
    //ctx.fillStyle="rgb(128,192,128)";
    ctx.fillStyle="rgb(96,128,96)";
    
    //grey bit on top
    ctx.beginPath();
    ctx.moveTo(-width/2+gap,-size/2+gap);
    ctx.lineTo(-width/2+gap,size/2-r*2);
    ctx.lineTo(-width/2+gap+r,size/2-r);
    ctx.lineTo(width/2-gap-r,size/2-r);
    ctx.lineTo(width/2-gap,size/2-r*2);
    ctx.lineTo(width/2-gap,-size/2+gap);
    ctx.closePath();
    ctx.fill();
    
    
    //lines from fans to stuff on deck
    ctx.save();
    ctx.lineCap="butt";
    ctx.lineWidth=size*0.05
    ctx.beginPath();
    ctx.moveTo(-width/2-r/2 + r*2.5/2,-size/2+gap);
    ctx.lineTo(-width/2-r/2 + r*2.5/2,-size/2+gap*4);
    ctx.moveTo(width/2+r/2 - r*2.5/2,-size/2+gap);
    ctx.lineTo(width/2+r/2 - r*2.5/2,-size/2+gap*4);
    ctx.stroke();
    
    ctx.restore();
    
    //fan top left
    ctx.fillRect(-width/2-r/2,-size/2-gap,r*2.5,gap*2.5);
    ctx.strokeRect(-width/2-r/2,-size/2-gap,r*2.5,gap*2.5);
    
    //top right
    ctx.fillRect(width/2-r*2,-size/2-gap,r*2.5,gap*2.5);
    ctx.strokeRect(width/2-r*2,-size/2-gap,r*2.5,gap*2.5);
    
    //stuff on the deck
    ctx.fillStyle="rgb(64,96,64)";
    
    //length of deck on left:
    ctx.fillRect(-width/2+gap,-size/2+gap*3,r,size - r*3);
    //on right
    ctx.fillRect(width/2-gap-r,-size/2+gap*3,r,size - r*3);
    
    ctx.restore();
}

Graphics.friendlyHovercraft=function(ctx,size,state){
    ctx.save();
    
    ctx.scale(1,-1);
    Graphics.hovercraft(ctx, size, state);
    
    ctx.restore();
}

Graphics.friendlyAttackBoat=function(ctx,size,state){
    ctx.save();
    
    ctx.scale(1,-1);
    Graphics.attackBoat(ctx, size, state);
    
    ctx.restore();
}

//not based on any particular real boat
Graphics.attackBoat=function(ctx,size,state){
    size*=1.3;
    
    var width=size*0.6;
    
    var outline=function(){
        ctx.beginPath();
        ctx.moveTo(-width/2,-size/2);
        ctx.bezierCurveTo(-width*0.5, size*0.2, -width*0.2, size*0.4, 0, size*0.6);
        ctx.bezierCurveTo(width*0.2, size*0.4,width*0.5, size*0.2,  width/2, -size/2);
        ctx.closePath();
    }
    
    ctx.save();
    
    ctx.lineWidth=size*0.03;
    ctx.fillStyle="rgb(64,64,64)";
    
    //boat shaped bit
    outline();
    ctx.fill();
    ctx.stroke();
    
    var r=size*0.1;
    //gun on the front
    var gunY=size*0.25
    
    var grad = ctx.createRadialGradient(0,gunY,r,-r*0.1,gunY-r*0.1,size*0.02);
    //grad.addColorStop(0,"rgba(128,128,255,0.5)");
    grad.addColorStop(0,"rgb(16,16,16)");
    grad.addColorStop(1,"rgb(96,96,96)");
    
    //gun dome on front
    ctx.fillStyle=grad;
    ctx.lineWidth=size*0.015
    ctx.beginPath();
    ctx.arc(0,gunY,r,0,Math.PI*2,true);
    ctx.fill();
    ctx.stroke();
    
    //gun barrel
    
    //using state as angle
    ctx.beginPath();
    ctx.moveTo(0,gunY+r*0.5);
    ctx.lineTo(0,gunY+r*1.5);
    ctx.stroke();
    
    
    //cabin thing
    ctx.fillStyle="rgb(96,96,96)";
    ctx.beginPath();
    ctx.moveTo(-width*0.3,-size*0.15);
    ctx.lineTo(-width*0.3,size*0.05);
    ctx.lineTo(width*0.3,size*0.05);
    ctx.lineTo(width*0.3,-size*0.15);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    //stuff at back
    ctx.beginPath();
    ctx.moveTo(-width*0.35,-size*0.45);
    ctx.lineTo(-width*0.35,-size*0.2);
    ctx.lineTo(-width*0.05,-size*0.2);
    ctx.lineTo(-width*0.05,-size*0.45);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(width*0.35,-size*0.45);
    ctx.lineTo(width*0.35,-size*0.2);
    ctx.lineTo(width*0.05,-size*0.2);
    ctx.lineTo(width*0.05,-size*0.45);
    ctx.closePath();
    ctx.fill();
    
    
    ctx.restore();
}

Graphics.naffCatamaran=function(ctx,size,state){
    size*=1.2;
    var width=size*0.75;
    
    var body = function(){
        ctx.beginPath();
        //top left
        ctx.moveTo(-width/2,-size/2);
        ctx.bezierCurveTo(-width*0.5, size*0.1, -width*0.1, size*0.3, 0, size*0.5);
        ctx.bezierCurveTo(width*0.1, size*0.3,width*0.5, size*0.1,  width/2, -size/2);
        ctx.closePath();
    }
    
    ctx.save();
    
    ctx.fillStyle="rgb(96,96,96)";
    ctx.lineWidth=size*0.02;
    
    ctx.lineJoin="mitre";
    ctx.miterLimit=1000;
    
    //spikey catamaran bits
    ctx.beginPath();
    ctx.moveTo(-width/2,-size*0.4);
    ctx.lineTo(-width*0.5,size/2);
    ctx.lineTo(-width*0.4,-size*0.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(width/2,-size*0.4);
    ctx.lineTo(width*0.5,size/2);
    ctx.lineTo(width*0.4,-size*0.1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.lineWidth=size*0.03;
    //body bit on top
    
    body();
    ctx.fill();
    //ctx.stroke();
    ctx.save();
    ctx.lineWidth=size*0.01;
    
    ctx.fillStyle="rgb(64,64,64)";
    
    //box at back
    //ctx.fillRect(-width*0.45,-size*0.475,width*0.9,size*0.15);
    
    
    ctx.beginPath();
    ctx.moveTo(-width*0.3,-size*0.5);
    //ctx.lineTo(-width*0.3,-size*0.1);
    ctx.arc(0,-size*0.1,width*0.3,Math.PI,0,true);
    ctx.lineTo(width*0.3,-size*0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    //    
    //    ctx.strokeRect(-width*0.4,-size*0.45,width*0.8,size*0.15);
    
    ctx.restore();
    
    body();
    ctx.stroke();
    
    ctx.restore();
    
}

Graphics.catamaran=function(ctx,size,state){
    size*=1.2;
    ctx.fillStyle="rgb(96,96,96)";
    ctx.lineWidth=size*0.05;
    
    ctx.lineJoin="mitre";
    ctx.miterLimit=1000;
    
    var width=size*0.75;
    
    var hullWidth=size*0.1;
    //main hull
    ctx.beginPath();
    //    ctx.moveTo(-width*0.45,-size*0.4);
    //    ctx.lineTo(-width*0.45,size*0.2);
    //    ctx.lineTo(0,size*0.45);
    //    ctx.lineTo(width*0.45,size*0.2);
    //    ctx.lineTo(width*0.45,-size*0.4);
    //    ctx.lineTo(0,-size*0.45);

    ctx.moveTo(-width*0.3,-size*0.45);
    ctx.bezierCurveTo(-width*0.3, 0, -width*0.2, size*0.2, 0, size*0.4);
    ctx.bezierCurveTo(width*0.2, size*0.2, width*0.3, 0, width*0.3,-size*0.45);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    
    
    ctx.beginPath();
    //left hull
    ctx.moveTo(-width/2,-size/2);
    ctx.bezierCurveTo(-width/2 - hullWidth*0.5, -size*0.3, -width/2- hullWidth*0.5, size*0.2, -width/2+hullWidth/2, size/2);
    ctx.bezierCurveTo(-width/2+hullWidth*1, size*0.2,-width/2+hullWidth*1, -size*0.3,  -width/2+hullWidth, -size/2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    
    ctx.beginPath();
    //right hull
    ctx.moveTo(width/2,-size/2);
    ctx.bezierCurveTo(width/2 + hullWidth*0.5, -size*0.3, width/2+ hullWidth*0.5, size*0.2, width/2-hullWidth/2, size/2);
    ctx.bezierCurveTo(width/2-hullWidth*1, size*0.2,width/2-hullWidth*1, -size*0.3,  width/2-hullWidth, -size/2);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
    
    var grad = ctx.createLinearGradient(-width/2, 0, width/2, 0);
    grad.addColorStop(0, "rgb(32,32,32)");
    grad.addColorStop(1, "rgb(128,128,128)");
    
    ctx.lineWidth=size*0.02;
    ctx.fillStyle=grad;
    
//    var miniHull=0.7;
//    //hull on top
//    ctx.beginPath();
//    ctx.moveTo(-width*0.45*miniHull,-size*0.4*miniHull);
//    ctx.lineTo(-width*0.45*miniHull,size*0.2*miniHull);
//    ctx.lineTo(0,size*0.45*miniHull);
//    ctx.lineTo(width*0.45*miniHull,size*0.2*miniHull);
//    ctx.lineTo(width*0.45*miniHull,-size*0.4*miniHull);
//    ctx.lineTo(0,-size*0.45*miniHull);
//    ctx.closePath();
//    ctx.stroke();
//    ctx.fill();
    
//sheild at front
    
//    grad = ctx.createLinearGradient(-width/2, 0, width/2, 0);
//    grad.addColorStop(0, "rgb(0,0,0)");
//    grad.addColorStop(1, "rgb(32,32,32)");
//    
//    ctx.fillStyle=grad;//"rgb(0,0,0)";
//    
//    ctx.beginPath();
//    ctx.moveTo(-width*0.45*miniHull,size*0.1*miniHull);
//    ctx.lineTo(-width*0.45*miniHull,size*0.2*miniHull);
//    ctx.lineTo(0,size*0.45*miniHull);
//    
//    ctx.lineTo(width*0.45*miniHull,size*0.2*miniHull);
//    
//    ctx.lineTo(width*0.45*miniHull,size*0.1*miniHull);
//    ctx.lineTo(0,size*0.35*miniHull);
//    ctx.closePath();
//    ctx.fill();
    
}


Graphics.jetty=function(ctx,size,state){
    ctx.save();
    //TODO
    var high = size*0.5;
    
    ctx.fillStyle="rgb(64,64,64)";
    
    ctx.fillRect(-size/2,-high/2,size,high);
    
    
    ctx.restore();
}

Graphics.samSite=function(ctx,size,state){
    //surface-air-missile site like just cause 2
    
    ctx.save();
    
    ctx.lineWidth=size*0.03;
    
    ctx.fillStyle="rgb(64,64,64)";
    var r = size*0.4;
    //circular base
    ctx.beginPath();
    ctx.arc(0,0,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.lineWidth=size*0.05;
    
    var centre=size*0.3;
    
    ctx.fillStyle="rgb(96,80,50)";
    
    
    //bit that joins the launches to the middle
    ctx.fillRect(-r,-size*0.05,2*r,size*0.1);
    
    //squareish bit in the middle
    ctx.beginPath();
    //bottom left
    ctx.moveTo(-centre/2,centre/2);
    ctx.lineTo(centre/2,centre/2);
    ctx.lineTo(centre/2,-centre/2);
    ctx.lineTo(centre*0.4,-centre);
    ctx.lineTo(-centre*0.4,-centre);
    ctx.lineTo(-centre/2,-centre/2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    var siloWidth=size*0.3;
    
    
    //launcher on left
    ctx.fillRect(-r-siloWidth/2,-size/2,siloWidth,size*0.8);
    ctx.fillStyle="rgb(96,96,96)";
    ctx.fillRect(-r-siloWidth*0.4,-size/2 + size*0.8,siloWidth*0.8,size*0.1);
    ctx.fillStyle="rgb(96,0,0)";
    ctx.fillRect(-r-siloWidth/2,size*0.2,siloWidth,size*0.05);
    ctx.strokeRect(-r-siloWidth/2,-size/2,siloWidth,size*0.8);
    
    
    ctx.fillStyle="rgb(96,80,50)";
    //launcher on right
    ctx.fillRect(r-siloWidth/2,-size/2,siloWidth,size*0.8);
    ctx.fillStyle="rgb(96,96,96)";
    ctx.fillRect(r-siloWidth*0.4,-size/2 + size*0.8,siloWidth*0.8,size*0.1);
    ctx.fillStyle="rgb(96,0,0)";
    ctx.fillRect(r-siloWidth/2,size*0.2,siloWidth,size*0.05);
    ctx.strokeRect(r-siloWidth/2,-size/2,siloWidth,size*0.8);
    
    ctx.restore();
}

Graphics.substation=function(ctx,size,state){
    //TODO
    //ctx.fillRect(-size/2,-size/2,size,size);
    ctx.save();
    
    
    
    size/=4;
    
    
    
    
    ctx.save();
    ctx.translate(size*1.1, 0);
    Graphics.transformer(ctx,size,state);
    ctx.restore();
    
    ctx.save();
    ctx.translate(-size,2, 0);
    Graphics.pylon(ctx,size*1.2,state);
    ctx.restore();
    
    //cables
    
    ctx.lineWidth=size*0.05;
    ctx.lineCap="round";
    
    //over the pylon and into the building:
    ctx.beginPath();
    ctx.moveTo(-size*0.4,-size*0.4);
    ctx.lineTo(-size,-size*1.2*0.4);
    ctx.lineTo(-size*3,-size*1.2*0.4);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-size*0.4,size*0.4);
    ctx.lineTo(-size,size*1.2*0.4);
    ctx.lineTo(-size*3,size*1.2*0.4);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(-size*0.4,0);
    ctx.lineTo(-size*3,0);
    ctx.stroke();
    
    //out of the building and off to the right
    
    ctx.beginPath();
    
    ctx.moveTo(0,-size*0.5);
    ctx.bezierCurveTo(size, -size, size*2, -size*0.5, size*3.85, -size*0.47);
    
    ctx.stroke();
    
    if(state >0){
        ctx.fillStyle="rgb(32,32,32)";
    }else{
        ctx.fillStyle="rgb(130,130,130)";
    }
    
    
    ctx.fillRect(-size*0.4,-size/2,size*0.8,size);
    
    ctx.restore();
}


Graphics.transformer=function(ctx,size,state){
    ctx.save();
    
    ctx.lineWidth=size*0.09;
    ctx.lineCap="round";
    
    ctx.strokeStyle="rgb(156,156,156)";
    
    for(var x=-size/2+size*0.05;x<size/2;x+=size*0.1){
        ctx.beginPath();
        
        ctx.moveTo(x,-size/2);
        ctx.lineTo(x,size/2);
        
        ctx.stroke();
    }
    
    ctx.fillStyle="rgb(128,128,128)";
    
    ctx.fillRect(-size/2,-size*0.05,size,size*0.1);
    
    ctx.restore();
}

Graphics.pylon=function(ctx,size,state){
    ctx.save();
    
    ctx.fillStyle="rgb(140,100,64)";
    //wooden beam
    ctx.fillRect(-size*0.1,-size/2,size*0.2,size);
    
    
    
    for(var y = -size*0.4;y<size*0.41;y+=size*0.4){
        //insulators
        ctx.fillStyle="rgba(130,200,255,0.6)";
        ctx.beginPath();
        ctx.arc(0,y,size*0.08,0,Math.PI*2,true);
        ctx.fill();
        
        ctx.fillStyle="rgba(110,180,235,0.6)";
        ctx.beginPath();
        ctx.arc(0,y,size*0.05,0,Math.PI*2,true);
        ctx.fill();
    }
    
    
    ctx.restore();
}

Graphics.heart=function(ctx,size,state){
    
    ctx.save();
    //centred, and right way up
    var x=0;
    var y=0;
    var r=size/2;
    var u=false;
    
    //from the old card games
    ctx.beginPath();
    ctx.fillStyle="rgba(255,0,0,0.75)";
    ctx.moveTo(x,y-r/2);
    ctx.arc(x-r/2 , y-r/2 , Math.abs(r/2) , 0+(u?Math.PI:0) , Math.PI*7/8+(u?Math.PI:0) , true);
    ctx.lineTo(x,y+r);

    ctx.moveTo(x,y-r/2);
    ctx.arc(x+r/2 , y-r/2 , Math.abs(r/2) , Math.PI+(u?Math.PI:0) , Math.PI/8+(u?Math.PI:0) , false);
    ctx.lineTo(x,y+r);

    ctx.fill();
    
    ctx.restore();
}

Graphics.redArrow=function(ctx,size,state){
    size*=1.2;
    
    ctx.save();
    
    ctx.lineCap="round";
    ctx.lineJoin="round";
    
    ctx.lineWidth=size*0.02;
    
    //wings
    ctx.beginPath();
    
    ctx.fillStyle="rgb(200,32,32)";
    
    ctx.moveTo(0,-size*0.15);
    //tip of left wing
    ctx.lineTo(-size/2,-size*0.2);
    ctx.bezierCurveTo(-size/2, -size*0.1, -size/2, -size*0.1, 0, size*0.075);
    ctx.bezierCurveTo(size/2, -size*0.1, size/2, -size*0.1, size/2,-size*0.2);
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.beginPath();
    
    ctx.fillStyle="rgb(200,32,32)";
    
    ctx.moveTo(0,-size/2);
    //tip of left tail wing
    ctx.lineTo(-size*0.2,-size*0.55);
    ctx.bezierCurveTo(-size*0.2, -size/2, -size*0.2, -size/2, 0, -size*0.4);
    ctx.bezierCurveTo(size*0.2, -size/2, size*0.2, -size/2, size*0.2,-size*0.55);
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    
    var bodyWidth=size*0.1;
    //body
    ctx.beginPath();
    
    
    ctx.moveTo(-bodyWidth/2,-size*0.3);
    
//    ctx.save();
//    ctx.translate(0,size*0.1)
    //left buldgey bit
    ctx.bezierCurveTo(-bodyWidth/2, -size*0.2,-bodyWidth*1.5, size*0.1,  -bodyWidth/2, size*0.1);
    
    //ctx.lineTo(-bodyWidth/2,size*0.35)
    
    //now on the left just below the buldge - these two are the nose
    ctx.bezierCurveTo(-bodyWidth/2, size*0.35 + (size*0.45 - size*0.35)*0.5, -bodyWidth/4, size*0.45, 0, size*0.45);
    ctx.bezierCurveTo(bodyWidth/4, size*0.45, bodyWidth/2, size*0.35 + (size*0.45 - size*0.35)*0.5,  bodyWidth/2,size*0.1);
    
    //right buldgey bit
    ctx.bezierCurveTo(bodyWidth*1.5, size*0.1, bodyWidth/2, -size*0.2, bodyWidth/2, -size*0.3);
    
    
    //ctx.restore();
    
    ctx.lineTo(bodyWidth/2,-size*0.51);
    ctx.lineTo(-bodyWidth/2,-size*0.51);
    //ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
     
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    
    //dots on the wings
    ctx.fillStyle="rgb(16,16,160)";
    ctx.beginPath();
    ctx.arc(-size*0.4,-size*0.135,size*0.04,0,Math.PI*2,true);
    ctx.fill();
    ctx.fillStyle="rgb(255,255,255)";
    ctx.beginPath();
    ctx.arc(-size*0.4,-size*0.135,size*0.028,0,Math.PI*2,true);
    ctx.fill();
    ctx.fillStyle="rgb(200,32,32)";
    ctx.beginPath();
    ctx.arc(-size*0.4,-size*0.135,size*0.015,0,Math.PI*2,true);
    ctx.fill();
    
    ctx.fillStyle="rgb(16,16,160)";
    ctx.beginPath();
    ctx.arc(size*0.4,-size*0.135,size*0.04,0,Math.PI*2,true);
    ctx.fill();
    ctx.fillStyle="rgb(255,255,255)";
    ctx.beginPath();
    ctx.arc(size*0.4,-size*0.135,size*0.028,0,Math.PI*2,true);
    ctx.fill();
    ctx.fillStyle="rgb(200,32,32)";
    ctx.beginPath();
    ctx.arc(size*0.4,-size*0.135,size*0.015,0,Math.PI*2,true);
    ctx.fill();
    
    ctx.restore();
}

Graphics.russianSkyFortress=function(ctx,size,state){
    //huge plane!
    
    //wings 730 wide
    //wing 145 tall
    
    var wingHeight=size*0.2;
    
    //tail tip to nose 386
    
    //rounding this all so tip to nose is half width of wings - width of wings will be size
    //wings will be 0.2*size tall
    
    //putting top of big wing in centre
    
    ctx.save();
    
    ctx.fillStyle="rgb(100,100,100)";
    
    ctx.lineWidth=size*0.01;
    //big wing
    ctx.beginPath();
    //left wing tip
    //ctx.moveTo(-size/2,wingHeight/2);
    //ctx.bezierCurveTo(-size/2, wingHeight, -size*0.3, wingHeight, 0, wingHeight);
//    ctx.bezierCurveTo(-size/2, wingHeight*1.5, size/2, wingHeight*1.5, size/2, wingHeight/2);
//    ctx.bezierCurveTo(size/2, -wingHeight*0.5, -size/2, -wingHeight*0.5, -size/2, wingHeight/2);

    ctx.moveTo(0,0);
    ctx.lineTo(-size*0.15,0);
    ctx.bezierCurveTo(-size*0.62, 0, -size*0.62, wingHeight, -size*0.15, wingHeight);
    ctx.lineTo(size*0.15,wingHeight);
    ctx.bezierCurveTo(size*0.62, wingHeight, size*0.62,0, size*0.15, 0);
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    var tailDist=size*0.25;
    ctx.save();
    ctx.lineWidth=size*0.005;
    ctx.fillStyle="rgb(64,64,64)";
    //ctx.fillStyle="rgb(0,0,0)";
    var connectWide=size*0.03;
    //connecty bits
    ctx.beginPath();
    
    ctx.moveTo(-size*0.1-connectWide/2,wingHeight/2);
    ctx.arc(-size*0.1,wingHeight/2,connectWide/2,Math.PI,0,true);
    ctx.lineTo(-size*0.1+connectWide/2,-tailDist-connectWide);
    ctx.arc(-size*0.1,-tailDist-connectWide,connectWide/2,0,Math.PI,true);
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    
    ctx.moveTo(size*0.1-connectWide/2,wingHeight/2);
    ctx.arc(size*0.1,wingHeight/2,connectWide/2,Math.PI,0,true);
    ctx.lineTo(size*0.1+connectWide/2,-tailDist-connectWide);
    ctx.arc(size*0.1,-tailDist-connectWide,connectWide/2,0,Math.PI,true);
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    
    var tailHeight=size*0.06;
    
    //tail
    ctx.beginPath();
    ctx.moveTo(0,-tailDist);
    ctx.lineTo(-size*0.1,-tailDist);
    ctx.bezierCurveTo(-size*0.62*0.35, -tailDist, -size*0.62*0.35, tailHeight-tailDist, -size*0.1, tailHeight-tailDist);
    ctx.lineTo(size*0.1,tailHeight-tailDist);
    ctx.bezierCurveTo(size*0.62*0.35, tailHeight-tailDist, size*0.62*0.35,-tailDist, size*0.1, -tailDist);
    
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    var centralWide=size*0.075;
    ctx.lineWidth=size*0.005;
    //central bit
    ctx.beginPath();
    ctx.moveTo(-centralWide/2,wingHeight*1.1);
    ctx.arc(0,wingHeight*1.1,centralWide/2,Math.PI,0,true);
    ctx.lineTo(centralWide/2,-wingHeight*0.1);
    ctx.arc(0,-wingHeight*0.1,centralWide/2,0,Math.PI,true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.fillStyle="rgb(32,32,128)"
    //central bit
    
    
    ctx.beginPath();
    ctx.moveTo(-centralWide/2,wingHeight*1.05);
    ctx.lineTo(-centralWide/2,wingHeight*1.1);
    ctx.arc(0,wingHeight*1.1,centralWide/2,Math.PI,0,true);
    ctx.lineTo(centralWide/2,wingHeight*1.05);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.restore();
    
    var engines=[new Vector(-size*0.4,wingHeight),new Vector(-size*0.25,wingHeight*1.1),new Vector(-size*0.1,wingHeight*1.1),
    new Vector(size*0.4,wingHeight),new Vector(size*0.25,wingHeight*1.1),new Vector(size*0.1,wingHeight*1.1)];
    
    for(var i=0;i<engines.length;i++){
        ctx.save();
        ctx.translate(engines[i].x,engines[i].y);
        Graphics.engine(ctx, size*0.1, state);
        ctx.restore();
    }
    
    
}

Graphics.engine=function(ctx,size,state){
    ctx.save();
    
    ctx.fillStyle="rgb(64,64,64)";
    
    var width=size*0.4;
    ctx.lineWidth=size*0.05;
    
    ctx.beginPath();
    ctx.moveTo(-width/2,0);
    ctx.lineTo(width/2,0);
    ctx.lineTo(width/2,-size/2);
    ctx.arc(0,-size/2,width/2,0,Math.PI,true);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    ctx.lineCap="round";
    
    var propWidth=width*0.2;
    var propGap=size*0.075;
    
    ctx.beginPath();
    ctx.moveTo(-propWidth/2,propGap);
    ctx.arc(0,propGap,propWidth/2,Math.PI,0,true);
    ctx.closePath();
    ctx.fill();
    
    ctx.lineWidth=size*0.02;
    
    ctx.beginPath();
    ctx.moveTo(-propWidth*3,propGap);
    ctx.lineTo(propWidth*3,propGap);
    ctx.stroke();
    
    ctx.restore();
}