/**
 * Branch class - has array of branches which come off this branch, and ref to which branch this branch comes from?
 *
 * tree class - creates first branch class, with information as to what branches will follow it?
 *
 * iterative function for drawing branches - can specify level of depth wanted, and how far into current depth wanted eg 2nd branch but only 10% along this branch (so smooth animation can draw trees gropwing)
 *
 * drawing method - draw on canvas or return array of structs?
 *
 * stick struct - pointa pointb, colour (inc alpha)
 */

//colours - [r,g,b,a]
var TreeClass=function(pos,branchlings,iterations,angleLimit,startColour,endColour,branchLength,angle,startThick,endThick){
    
    var thisObject=this;
    //angle first branch starts from
    this.angle=angle;
    this.pos=pos;
    this.sRand=new sRand(3);
    this.startColour=startColour;
    this.endColour=endColour;
    this.dcolour=[ (endColour[0]-startColour[0])/iterations , (endColour[1]-startColour[1])/iterations , (endColour[2]-startColour[2])/iterations , (endColour[3]-startColour[3])/iterations];
    
    this.startThick=startThick;
    this.endThick=endThick;
    this.dThick=(endThick-startThick)/iterations;
    this.branchlings=[];

    this.branches=[1];
    this.angleLimits=[];
    this.colours=[];
    this.branchLengths=[];
    this.thicknesses=[];
    this.lengths=[]

    for(var i=0;i<iterations;i++){
        
        this.angleLimits.push(angleLimit);
        this.branchLengths.push(branchLength);
        if(i<iterations-1){
            this.colours.push([Math.round(this.startColour[0]+this.dcolour[0]*i) , Math.round(this.startColour[1]+this.dcolour[1]*i) , Math.round(this.startColour[2]+this.dcolour[2]*i) , (this.startColour[3]+this.dcolour[3]*i)]);
            this.thicknesses.push(this.startThick+this.dThick*i);
            this.branches.push(branchlings);
        }else{
            //ensure we definitely finish on the wanted end colour
            this.colours.push(this.endColour);
            this.thicknesses.push(this.endThick);
        }
    }
    //branchesLeft is an array of ints, branchesLeft[0] is how many branches will grow from fromBranch
    this.createBranches=function(fromBranch,iteration,branches,colours,angleLimits,lengths,thicknesses){
        if(iteration<branches.length){
            for(var i=0;i<branches[iteration];i++){
                var newBranch=new BranchClass(fromBranch,colours[iteration],fromBranch.nextAngle(),angleLimits[iteration],lengths[iteration],thicknesses[iteration]);
                fromBranch.branchlings.push(newBranch);
                this.createBranches(newBranch,iteration+1,branches,colours,angleLimits,lengths,thicknesses);
            }
        }
    }

    //generate tree
    this.grow=function(){
        this.kill();
        this.createBranches(this,0,this.branches,this.colours,this.angleLimits,this.branchLengths,this.thicknesses);
    }

    //kill off tree
    this.kill=function(){
        this.branchlings=[];
    }

    this.nextAngle=function(){
        //find angle of next branch
        //return this.angle-this.angleLimits[0]/2 + this.sRand.next()*this.angleLimits[0];
        return this.angle;
    }

    this.drawOnCanvas=function(){
        
    }

    this.drawMe=function(canvas,upToHeight,height,iteration,parent){
        if(typeof(parent)=='undefined'){
            parent=thisObject;
        }
        if(typeof(iteration)=='undefined'){
            iteration=0;
        }
        if(typeof(upToHeight)=='undefined'){
            upToHeight=Infinity;
        }
        if(typeof(height)=='undefined'){
            height=0;
        }

        if(height>upToHeight){
            return;
        }

        var drawBranchThisLong=false;
        if(height+thisObject.branchLengths[iteration] > upToHeight){
            drawBranchThisLong=upToHeight-height;
        }
        
        //console.log([drawBranchThisLong,iteration,height,upToHeight])
        for(var i=0;i<parent.branchlings.length;i++){
           parent.branchlings[i].draw(canvas,drawBranchThisLong);
           if(drawBranchThisLong===false){
                thisObject.drawMe(canvas,upToHeight,height+thisObject.branchLengths[iteration],iteration+1,parent.branchlings[i]);
           }
        }
    }

    this.getFullHeight=function(){
        var height=0;
        for(var i=0;i<thisObject.branchLengths.length;i++){
            height+=thisObject.branchLengths[i];
        }
        return height;
    }
}

var count=0;

var BranchClass=function(parent,colour,angle,angleLimit,length,thick){
    var thisBranch=this;
    this.parent=parent;
    this.sRand=parent.sRand;
    this.colour=colour;
    this.angle=angle;
    this.angleLimit=angleLimit;
    this.branchlings=[];
    this.thick=thick

    this.pos=[parent.pos[0]+Math.cos(angle)*length,parent.pos[1]+Math.sin(angle)*length];

    this.nextAngle=function(){
        //find angle of next branch
        return this.angle-this.angleLimit/2 + this.sRand.next()*this.angleLimit;
    }

    this.draw=function(canvas,drawThisLong){
        var drawToX=thisBranch.pos[0];
        var drawToY=thisBranch.pos[1];
        if(drawThisLong!==false){
            drawToX=parent.pos[0]+Math.cos(thisBranch.angle)*drawThisLong;
            drawToY=parent.pos[1]+Math.sin(thisBranch.angle)*drawThisLong;
            //console.log("notfalse"+drawThisLong)
        }
        canvas.strokeStyle="rgba("+thisBranch.colour[0]+","+thisBranch.colour[1]+","+thisBranch.colour[2]+","+thisBranch.colour[3]+")";
        canvas.lineWidth=thisBranch.thick;
        canvas.beginPath();
        canvas.moveTo(parent.pos[0],parent.pos[1]);
        canvas.lineTo(drawToX,drawToY);
        canvas.stroke();
    }

}