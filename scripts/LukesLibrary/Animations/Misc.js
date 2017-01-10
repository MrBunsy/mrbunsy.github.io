/* 
 * Copyright Luke Wallin 2012
 */



LukesAnimations.DrawCross=function(pos,r,stages,colour)
{
    this.pos=pos;
    this.r=r;
	
    var tempStages=stages;
    if(tempStages%2 !== 0)
    {
        //not even, make even
        tempStages++;
    }
	
    this.stages=tempStages;
    this.stage=0;
    this.colour=colour;
	
    this.d=4*r/stages;
	
    this.drawNext=function(ctx,controller)
    {
		
        ctx.save();
        ctx.strokeStyle=this.colour.toRGB();
        ctx.lineWidth=2;
        ctx.beginPath();
		
        if(this.stage<this.stages/2)
        {
            //line top left to bottom right
            ctx.moveTo(this.pos.x-this.r , this.pos.y-this.r);
            ctx.lineTo(this.pos.x-this.r+this.d*(this.stage+1) , this.pos.y-this.r+this.d*(this.stage+1));
        }
        else
        {
            ctx.moveTo(this.pos.x-this.r , this.pos.y-this.r);
            ctx.lineTo(this.pos.x+this.r , this.pos.y+this.r);
			
            //top right to bottom left
            ctx.moveTo(this.pos.x+this.r , this.pos.y-this.r);
            ctx.lineTo(this.pos.x+this.r-this.d*(this.stage-this.stages/2+1) , this.pos.y-this.r+this.d*(this.stage-this.stages/2+1));
        }
		
        ctx.stroke();
        ctx.restore();
		
        this.stage++
        return (this.stage >= this.stages);
    }
	
}