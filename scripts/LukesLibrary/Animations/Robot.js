/* 
 * Copyright Luke Wallin 2012
 */


//make a little robot skii around a planet
LukesAnimations.SkiingRobot=function(pos,r,stages,startAngle)
{
    this.pos=pos;
    this.r=r;
	
    this.botHeight=this.r/3;
	
    this.startAngle=startAngle;
	
    this.stages=stages;
    this.stage=0;
	
    //how many times to move the arms for skiing
    this.armMoves=10;
    this.armMove=0;
	
    this.dAngle=Math.PI*2/this.stages;
	
    this.stagesPerArmMove=this.stages/this.armMoves;
	
    this.armMax=Math.PI*0.5;
    this.armMin=-Math.PI*0.3
    this.dArm1Angle=(this.armMax-this.armMin)*2/(this.stagesPerArmMove);
	
    this.drawNext=function(ctx,controller)
    {
        var tempAngle=this.startAngle+this.dAngle*this.stage;
        var tempPos=new Vector(pos.x+Math.cos(tempAngle)*this.r , pos.y+Math.sin(tempAngle)*this.r);
		
        var armStage=this.stage%this.stagesPerArmMove;
		
        if(armStage < this.stagesPerArmMove/2)
        {
            var tempArmAngle1=this.armMin+this.dArm1Angle*armStage/2;
            var tempArmAngle2=tempArmAngle1/2;
        }
        else
        {
            var tempArmAngle1=this.armMax-this.dArm1Angle*armStage/2;
            var tempArmAngle2=tempArmAngle1/2;
        }
		
		
		
        this.drawCookerBot(ctx,tempPos,tempAngle , tempArmAngle1,tempArmAngle2,0,0, this.botHeight , false);
		
        this.stage++;
        return (this.stage >= this.stages);
    }
	
    this.drawCookerBot=function(ctx,pos,angle,larm1,larm2,rarm1,rarm2,height,facingLeft)
    {
        //pos is the position of the very base of the bot
        //size is the height of the box bit
        // arm is the angle of the arm (relative to the whole arm stretched out forwards), l=left, r=right, 1=first segment, 2=second segment
		
		
		
        var faceLeft=facingLeft ? -1: 1;
        var faceRight=faceLeft*-1;
	
	
        larm1*=faceRight;
        larm2*=faceRight;
		
        rarm1*=faceRight;
        rarm2*=faceRight;
		
        //angles of 0 will result in arm facing out in front:
        larm1+=angle + faceLeft* Math.PI/2;
        //	larm2+=angle + faceLeft* Math.PI/2;
        larm2+=larm1
        rarm1+=angle + faceLeft* Math.PI/2;
        rarm2+=angle + faceLeft* Math.PI/2;
		
        //var faceLeft=facingLeft ? 1: 0;
        //var faceRight=facingLeft ? 0 : 1;
		
        var width=height*0.75;
        var skirtHeight=height*0.15;
        var skirtWidth=width*0.9;
        var antennaHeight=height*0.2;
        var armLength=width*0.5;
        var armBoxSize=width*0.35;
        var skiLength=height*1.2;
        var skiEndR=skiLength/8;
        var lineWidth=height/20;
		
        var stickLength=height;
        var stickRatio=0.2;
		
        var handR=lineWidth;
		
		
		
        ctx.lineWidth=lineWidth;
		
        var body=new Object();
		
        //body corners
        body.bottomLeft=new Vector(pos.x+Math.cos(angle)*skirtHeight*2+Math.cos(angle-Math.PI/2)*width/2 , pos.y+Math.sin(angle)*skirtHeight*2+Math.sin(angle-Math.PI/2)*width/2);
        body.bottomRight=new Vector(pos.x+Math.cos(angle)*skirtHeight*2+Math.cos(angle+Math.PI/2)*width/2 , pos.y+Math.sin(angle)*skirtHeight*2+Math.sin(angle+Math.PI/2)*width/2);
        body.topLeft=new Vector(pos.x+Math.cos(angle-Math.PI/2)*width/2+Math.cos(angle)*(skirtHeight*2+height) , pos.y+Math.sin(angle-Math.PI/2)*width/2+Math.sin(angle)*(skirtHeight*2+height));
        body.topRight=new Vector(pos.x+Math.cos(angle+Math.PI/2)*width/2+Math.cos(angle)*(skirtHeight*2+height) , pos.y+Math.sin(angle+Math.PI/2)*width/2+Math.sin(angle)*(skirtHeight*2+height));
		
        var antennaBase=new Vector(pos.x+Math.cos(angle)*(skirtHeight*2+height) , pos.y+Math.sin(angle)*(skirtHeight*2+height));
        var antennaTop=new Vector(pos.x+Math.cos(angle)*(skirtHeight*2+height+antennaHeight) , pos.y+Math.sin(angle)*(skirtHeight*2+height+antennaHeight));
		
        var wheelPos=new Vector(pos.x+Math.cos(angle)*skirtHeight*0.25 , pos.y+Math.sin(angle)*skirtHeight*0.25);
		
        var rightSkiEnd=new Vector(pos.x+Math.cos(angle+faceRight*Math.PI/2)*skiLength/2 , pos.y+Math.sin(angle+faceRight*Math.PI/2)*skiLength/2)
        var leftSkiBit=new Vector(pos.x+Math.cos(angle+faceLeft*Math.PI/2)*(skiLength/2-skiEndR) , pos.y+Math.sin(angle+faceLeft*Math.PI/2)*(skiLength/2-skiEndR))
        var leftSkiCentre=new Vector(pos.x+Math.cos(angle+faceLeft*Math.PI/2)*(skiLength/2) + Math.cos(angle)*skiEndR , pos.y+Math.sin(angle+faceLeft*Math.PI/2)*(skiLength/2) + Math.sin(angle)*skiEndR);
		
		
        var armBox=new Object();
		
        //black box arm emergies from
        armBox.bottomLeft=new Vector(pos.x+Math.cos(angle)*(skirtHeight*2+height/2-armBoxSize/2) + Math.cos(angle+faceLeft*Math.PI/2)*armBoxSize , pos.y+Math.sin(angle)*(skirtHeight*2+height/2-armBoxSize/2) + Math.sin(angle+faceLeft*Math.PI/2)*armBoxSize)
        armBox.bottomRight=new Vector(pos.x+Math.cos(angle)*(skirtHeight*2+height/2-armBoxSize/2) , pos.y+Math.sin(angle)*(skirtHeight*2+height/2-armBoxSize/2))
        armBox.topLeft=new Vector(pos.x+Math.cos(angle)*(skirtHeight*2+height/2+armBoxSize/2) + Math.cos(angle+faceLeft*Math.PI/2)*armBoxSize , pos.y+Math.sin(angle)*(skirtHeight*2+height/2+armBoxSize/2) + Math.sin(angle+faceLeft*Math.PI/2)*armBoxSize)
        armBox.topRight=new Vector(pos.x+Math.cos(angle)*(skirtHeight*2+height/2+armBoxSize/2) , pos.y+Math.sin(angle)*(skirtHeight*2+height/2+armBoxSize/2))
		
        var armStart=new Vector(pos.x+Math.cos(angle)*(skirtHeight*2+height/2) + Math.cos(angle+faceLeft*Math.PI/2)*armBoxSize/2 , pos.y+Math.sin(angle)*(skirtHeight*2+height/2) + Math.sin(angle+faceLeft*Math.PI/2)*armBoxSize/2 );
		
        var larm1Pos=new Vector(armStart.x + Math.cos(larm1)*armLength , armStart.y + Math.sin(larm1)*armLength);
        var larm2Pos=new Vector(larm1Pos.x + Math.cos(larm2)*armLength , larm1Pos.y + Math.sin(larm2)*armLength);
        var larmHandTop=new Vector(larm2Pos.x + Math.cos(larm2-Math.PI/2)*handR*1, larm2Pos.y + Math.sin(larm2-Math.PI/2)*handR*1);
        var larmHandBottom=new Vector(larm2Pos.x + Math.cos(larm2+Math.PI/2)*handR*1 , larm2Pos.y + Math.sin(larm2+Math.PI/2)*handR*1);
		
        if(!facingLeft)
        {
            stickRatio=1-stickRatio;
        }
		
        var stickTop=new Vector(larm2Pos.x + Math.cos(larm2-Math.PI/2)*stickLength*(1-stickRatio), larm2Pos.y + Math.sin(larm2-Math.PI/2)*stickLength*(1-stickRatio));
        var stickBottom=new Vector(larm2Pos.x + Math.cos(larm2+Math.PI/2)*stickLength*stickRatio, larm2Pos.y + Math.sin(larm2+Math.PI/2)*stickLength*stickRatio);
		
        var skirtBox=new Object();
		
        skirtBox.bottomLeft=new Vector(pos.x+Math.cos(angle)*skirtHeight + Math.cos(angle-Math.PI/2)*skirtWidth/2 , pos.y+Math.sin(angle)*skirtHeight + Math.sin(angle-Math.PI/2)*skirtWidth/2);
        skirtBox.bottomRight=new Vector(pos.x+Math.cos(angle)*skirtHeight + Math.cos(angle+Math.PI/2)*skirtWidth/2 , pos.y+Math.sin(angle)*skirtHeight + Math.sin(angle+Math.PI/2)*skirtWidth/2);
        skirtBox.topLeft=new Vector(pos.x+Math.cos(angle)*skirtHeight*2 + Math.cos(angle-Math.PI/2)*skirtWidth/2 , pos.y+Math.sin(angle)*(skirtHeight*2+0.5) + Math.sin(angle-Math.PI/2)*skirtWidth/2);
        skirtBox.topRight=new Vector(pos.x+Math.cos(angle)*skirtHeight*2 + Math.cos(angle+Math.PI/2)*skirtWidth/2 , pos.y+Math.sin(angle)*(skirtHeight*2+0.5) + Math.sin(angle+Math.PI/2)*skirtWidth/2);	
		
        var drawBox=function(thisBox)
        {
            ctx.moveTo(thisBox.bottomLeft.x , thisBox.bottomLeft.y);
            ctx.lineTo(thisBox.topLeft.x , thisBox.topLeft.y);
            ctx.lineTo(thisBox.topRight.x , thisBox.topRight.y);
            ctx.lineTo(thisBox.bottomRight.x , thisBox.bottomRight.y);
            ctx.lineTo(thisBox.bottomLeft.x , thisBox.bottomLeft.y);
        }
		
        ctx.beginPath();
        ctx.strokeStyle="rgb(200,150,50)";
        ctx.lineCap="round";
        ctx.moveTo(antennaTop.x , antennaTop.y);
        ctx.lineTo(wheelPos.x , wheelPos.y);
        ctx.stroke();
		
        //draw grey wheel box thing at bottom
        ctx.beginPath();
        ctx.fillStyle="rgb(64,64,64)";
        drawBox(skirtBox);
        ctx.fill();
		
        ctx.beginPath();
        ctx.fillStyle="rgb(240,200,100)";
        drawBox(body);
        ctx.fill();
		
        ctx.beginPath();
        ctx.fillStyle="rgb(0,0,0)";
        drawBox(armBox);
        ctx.fill();
		
	
        /*
		ctx.beginPath();
		ctx.strokeStyle="rgb(200,150,50)";
		ctx.moveTo(antennaBase.x , antennaBase.y);
		ctx.lineTo(antennaTop.x , antennaTop.y);
		ctx.stroke();
		*/
		
        ctx.beginPath();
        ctx.fillStyle="rgb(200,150,50)";
        ctx.arc(antennaTop.x , antennaTop.y , lineWidth*1.5,0,Math.PI*2,true);
        ctx.fill();
		
		
        //wheel at the bottom
        ctx.beginPath();
        ctx.fillStyle="rgb(200,150,50)";
        ctx.arc(wheelPos.x , wheelPos.y , skirtHeight/4,0,Math.PI*2,true);
        ctx.fill();
		
        ctx.beginPath();
        ctx.fillStyle="rgb(0,0,0)";
        ctx.arc(wheelPos.x , wheelPos.y , lineWidth/2,0,Math.PI*2,true);
        ctx.fill();
		
        //ski
        ctx.beginPath();
        ctx.strokeStyle="rgb(200,150,50)";//"rgb(64,64,64)";
        ctx.moveTo(rightSkiEnd.x , rightSkiEnd.y);
        ctx.lineTo(leftSkiBit.x , leftSkiBit.y);
        ctx.arc(leftSkiCentre.x , leftSkiCentre.y , skiEndR , angle-Math.PI, angle+faceLeft*Math.PI/2 , !facingLeft);
        ctx.stroke();
		
		
        //stick!
        ctx.beginPath();
        ctx.strokeStyle="rgb(200,150,50)";
        ctx.moveTo(stickTop.x , stickTop.y);
        ctx.lineTo(stickBottom.x , stickBottom.y);
        ctx.stroke();
		
		
		
        //left arm
        ctx.beginPath();
        ctx.strokeStyle="rgb(200,150,50)";
        ctx.moveTo(armStart.x , armStart.y);
        ctx.lineTo(larm1Pos.x , larm1Pos.y);
        ctx.lineTo(larm2Pos.x , larm2Pos.y);
        ctx.stroke();
		
        //elbow joint
        ctx.beginPath();
        ctx.fillStyle="rgb(200,150,50)";
        ctx.arc(larm1Pos.x , larm1Pos.y , lineWidth*1.5,0,Math.PI*2,true);
        ctx.fill();
		
        //fingers
        ctx.beginPath();
        ctx.fillStyle="rgb(255,255,255)";
        ctx.arc(larm2Pos.x , larm2Pos.y , handR,0,Math.PI*2,true);
        ctx.arc(larmHandTop.x , larmHandTop.y , handR,0,Math.PI*2,true);
        ctx.arc(larmHandBottom.x , larmHandBottom.y , handR,0,Math.PI*2,true);	
        ctx.fill();
		
        ctx.beginPath();
        ctx.arc(larm2Pos.x , larm2Pos.y , handR*2 , larm2+faceLeft*Math.PI/2 , larm2+faceRight*Math.PI/2,facingLeft);
        ctx.fill();
    }
}