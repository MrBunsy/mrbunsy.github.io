//ideas:  colour ranges - anywhere between colour a and b linearilly.  just slightly random near a colour could end up with blues or such when trying to create green.
//You should do an "Autumn" mode with reds, pinks, oranges and yellows!

//colour = [r,g,b,a] (r,g,b=0-255, a=0-1)
var RealisticLeafClass = function(x,y,angle,size,colourA,colourB,seed){

    if(typeof seed == "undefined"){
        this.seed = new sRand(Math.round(Math.random()*1000));
    }else{
        this.seed = seed;
    }
    this.pos=[x,y];
    this.angle=angle;
    this.size=size;

    this.seed.next();

    var colourRandomA=this.seed.next();
    var colourRandomB=this.seed.next();

    this.colourA=[Math.round(colourA[0]+(colourB[0]-colourA[0])*colourRandomA) , Math.round(colourA[1]+(colourB[1]-colourA[1])*colourRandomA) , Math.round(colourA[2]+(colourB[2]-colourA[2])*colourRandomA) , colourA[3]+(colourB[3]-colourA[3])*colourRandomA];
    this.colourB=[Math.round(colourA[0]+(colourB[0]-colourA[0])*colourRandomB) , Math.round(colourA[1]+(colourB[1]-colourA[1])*colourRandomB) , Math.round(colourA[2]+(colourB[2]-colourA[2])*colourRandomB) , colourA[3]+(colourB[3]-colourA[3])*colourRandomB];

    //using canvas transformations to avoid having to fiddle about with angles and stuff!
    //by default draw leaf upwards, then rotate
    this.draw=function(canvas){

       

        

        var scale=1/6;
        //alert(Math.seededAprox(10,5,this.seed))
        //var tip=[this.pos[0]+Math.cos(this.angle)*this.size , this.pos[1]+Math.sin(this.angle)*this.size];
        var tip=[this.pos[0],this.pos[1]+this.size];

        var leftA=[this.pos[0]+Math.seededAprox(-this.size/2,this.size*scale,this.seed) , this.pos[1]+Math.seededAprox(this.size/5,this.size*scale,this.seed)];
        var rightA=[this.pos[0]+Math.seededAprox(this.size/2,this.size*scale,this.seed) , this.pos[1]+Math.seededAprox(this.size/5,this.size*scale,this.seed)];

        var leftB=[this.pos[0]+Math.seededAprox(-this.size/2,this.size*scale,this.seed) , this.pos[1]+Math.seededAprox(4*this.size/5,this.size*scale,this.seed)];
        var rightB=[this.pos[0]+Math.seededAprox(this.size/2,this.size*scale,this.seed) , this.pos[1]+Math.seededAprox(4*this.size/5,this.size*scale,this.seed)];


        var centreA=[Math.seededAprox(this.pos[0],this.size*scale,this.seed) , this.pos[1] + Math.seededAprox(this.size/3,this.size*scale,this.seed)];
        //so that the centre line has "monotonic derivative" - doesn't bend twice
        var centreB=[centreA[0] , centreA[1]+ Math.seededAprox(this.size/3,this.size*scale,this.seed)];

        canvas.save();

        //might be right, need to check
        canvas.rotate(this.angle+Math.PI/2);

        canvas.beginPath();
        canvas.fillStyle="rgba("+this.colourA[0]+","+this.colourA[1]+","+this.colourA[2]+","+this.colourA[3]+")";

        canvas.moveTo(this.pos[0],this.pos[1]);
        //left first
        canvas.bezierCurveTo(leftA[0], leftA[1], leftB[0], leftB[1], tip[0], tip[1]);
        //back to bottom
        canvas.bezierCurveTo(centreB[0], centreB[1], centreA[0], centreA[1], this.pos[0], this.pos[1]);

        canvas.fill();

        canvas.beginPath();
        canvas.fillStyle="rgba("+this.colourB[0]+","+this.colourB[1]+","+this.colourB[2]+","+this.colourB[3]+")";
        canvas.moveTo(this.pos[0],this.pos[1]);
        //right hand side now
        canvas.bezierCurveTo(rightA[0], rightA[1], rightB[0], rightB[1], tip[0], tip[1]);
        //back to bottom
        canvas.bezierCurveTo(centreB[0], centreB[1], centreA[0], centreA[1], this.pos[0], this.pos[1]);
        canvas.fill();

        //do a line over the top of the middle to cover up the gap in the middle
        canvas.beginPath();
        canvas.lineWidth=size/50;
        canvas.lineCap="round";
        canvas.strokeStyle="rgba("+this.colourB[0]+","+this.colourB[1]+","+this.colourB[2]+","+this.colourB[3]+")";
        canvas.moveTo(this.pos[0],this.pos[1]+size/50);
        //right hand side now
        canvas.bezierCurveTo(centreA[0], centreA[1], centreB[0], centreB[1], tip[0], tip[1]-size/50);
        canvas.stroke();

        canvas.restore();
        

    }


}