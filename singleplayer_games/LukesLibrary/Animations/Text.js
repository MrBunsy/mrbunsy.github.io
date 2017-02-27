/* 
 * Copyright Luke Wallin 2012
 */


LukesAnimations.TextFadeUp=function(pos,finishPos,startTransparency,finishTransparency,text,size,colour,stages)
{
    this.pos=pos;
    this.finishPos=finishPos;
    this.colour=colour;
    this.text=text;
    this.size=size;
    //transparency is on a 0=transparent, 1=visible scale
    this.startTransparency=startTransparency;
    this.finishTransparency=finishTransparency;

    this.stages=stages;
    this.stage=0;

    this.dx=(this.finishPos.x-this.pos.x)/this.stages;
    this.dy=(this.finishPos.y-this.pos.y)/this.stages;

    this.dt=(this.finishTransparency - this.startTransparency)/this.stages;



    this.drawNext = function(ctx)
    {
        ctx.save();

        var x = this.pos.x+this.dx*this.stage;
        var y = this.pos.y+this.dy*this.stage;

        var trans = this.startTransparency + this.dt*this.stage;

        trans=Math.min(1,trans);

        ctx.fillStyle=this.colour.toRGBA(trans);
        ctx.font=this.size+"px arial,sans-serif";//Arial
        ctx.fillText(this.text, x, y); 

        ctx.restore();

        this.stage++;

        return this.stage >= this.stages;
    }
}