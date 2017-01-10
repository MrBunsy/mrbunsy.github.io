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


//TODO - re-do this so the structure is generated seperately to the lengths and angles.  leave that to the rendering so the growth animation can be done really swish

//idea - for lengths give ratios? that way the length of the branch dependant on the one before it is known.
//sort out the growth so it is done dependent on the iterations of branches that are goign to be drawn.

//colours - [r,g,b,a]
//gravity - unit vector in direction expected
//branch ratio - ratio of length of branches
//trunk ratio - ratio of length of continued sections
var RealisticTreeClass=function(pos,angle,iterations,angleLimit,startColour,endColour,branchLength,branchRatio,trunkRatio,branchChance,trunkChance,growthRate,gravity){
    
    var thisObject=this;
    //angle first branch starts from
    this.angle=angle;
    this.pos=pos;
    this.getPos=function(){
        //I wish JS had getters and setters
        return thisObject.pos;
    }
    this.sRand=new sRand(Math.ceil(Math.random()*99));
    this.startColour=startColour;
    this.endColour=endColour;
    this.dcolour=[ (endColour[0]-startColour[0])/iterations , (endColour[1]-startColour[1])/iterations , (endColour[2]-startColour[2])/iterations , (endColour[3]-startColour[3])/iterations];

    this.gravity=gravity;

    this.iterations=iterations;

    this.branchRatio=branchRatio;
    this.trunkRatio=trunkRatio;
    this.branchChance=branchChance;
    this.trunkChance=trunkChance;
    this.growthRate=growthRate;

    this.colours=[]
    this.angleLimit=angleLimit;
    this.branchLength=branchLength;

    this.getLevel=function(){
        return 0;
    }

    this.getThickness=function(upToLevel,branchSizes){
        //return 5;
        //alert(branchSizes)
        return thisObject.branchlings[0].getThickness(upToLevel,branchSizes);
    }

    this.getTotalLevels=function(){
        return thisObject.iterations;
    }

    this.getLonger=function(){};
    /*
    for(var i=0;i<iterations;i++){
        
        //this.angleLimits.push(angleLimit);
       // this.branchLengths.push(branchLength);
        if(i<iterations-1){
            this.colours.push([Math.round(this.startColour[0]+this.dcolour[0]*i) , Math.round(this.startColour[1]+this.dcolour[1]*i) , Math.round(this.startColour[2]+this.dcolour[2]*i) , (this.startColour[3]+this.dcolour[3]*i)]);
            //this.branches.push(branchlings);
        }else{
            //ensure we definitely finish on the wanted end colour
            this.colours.push(this.endColour);
        }
    }*/
    //branchesLeft is an array of ints, branchesLeft[0] is how many branches will grow from fromBranch
    this.createBranches=function(fromBranch,iteration){
        if(iteration<thisObject.iterations){
           // for(var i=0;i<branches[iteration];i++){


                var tempRand=this.sRand.next();

                if(tempRand<this.trunkChance){
                    //straight on segement - high chance

                    //var newBranch=new BranchClass(fromBranch,colours[iteration],this.applyGravity(fromBranch.angle),thisObject.angleLimit,fromBranch.getLength()*this.trunkRatio,1,iteration+1);
                    var newBranch=new BranchClass(fromBranch,this.startColour,this.endColour,this.applyGravity(fromBranch.nextAngle(thisObject.angleLimit/4)),fromBranch.getLength(iteration+1)*this.trunkRatio,0.5,iteration+1,this.growthRate);
                    fromBranch.branchlings.push(newBranch);

                    this.createBranches(newBranch,iteration+1);
                }

                if(tempRand<this.branchChance){
                    //offshoot
                    var newBranch2=new BranchClass(fromBranch,this.startColour,this.endColour,this.applyGravity(fromBranch.nextAngle(thisObject.angleLimit)),fromBranch.getLength(iteration+1)*this.branchRatio,0.5,iteration+1,this.growthRate);
                    fromBranch.branchlings.push(newBranch2);

                    this.createBranches(newBranch2,iteration+1);
                }
                 if(tempRand<0.5 && false){
                    //second offshoot
                    var newBranch3=new BranchClass(fromBranch,this.startColour,this.endColour,this.applyGravity(fromBranch.nextAngle(thisObject.angleLimit)),fromBranch.getLength(iteration+1)*this.branchRatio,1,iteration+1,this.growthRate);
                    fromBranch.branchlings.push(newBranch3);

                    this.createBranches(newBranch3,iteration+1);
                }
           // }

           //fromBranch.getLonger();
           //this.growAllBranches();
        }
    }

    //apply gravity to an angle
    this.applyGravity=function(angle){

        angle+=Math.crossProduct([Math.cos(angle),Math.sin(angle)],gravity)[2]/10;

        return angle;
    }

    //make all existing branches grow a bit longer
    //doesn't work - needs to be recursive!
    this.growAllBranches=function(){
        for(var i=0;i<this.branchlings.length;i++){
            this.branchlings[i].getLonger();
        }
    }

    //generate tree
    this.grow=function(){
        this.kill();
        //create trunk
        //var trunk=new BranchClass(this,this.colours[0],this.angle,this.angleLimit,this.branchLength,1);
        var trunk=new BranchClass(this,this.startColour,this.endColour,this.angle,this.branchLength,1,1,this.growthRate);
        var trunk2=new BranchClass(trunk,this.startColour,this.endColour,this.angle,this.branchLength,1,2,this.growthRate);
        this.branchlings.push(trunk);
        trunk.branchlings.push(trunk2)
        this.createBranches(trunk2,2,this.colours);

        //trunk.length*=1.5;
        //this.growAllBranches();
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

//worth re-doing colours so that the final level drawn is always the correct colour?
    this.draw=function(canvas,upToLevel,branchLengths,parent,iteration){

        if(typeof(upToLevel)=='undefined'){
            upToLevel=thisObject.getTotalLevels();
        }

        if(typeof(branchLengths)=='undefined'){
            branchLengths=[];
           for(var i=0;i<=upToLevel;i++){
                //branchLengths.push(thisObject.getFullHeight());
                branchLengths.push(1);
           }
        }

        if(typeof(iteration)=='undefined'){
            iteration=1;
        }

        if(typeof(parent)=='undefined'){
            parent=thisObject;
        }

        /*
        var drawBranchThisLong=false;
        if(height+thisObject.branchLengths[iteration] > upToHeight){
        //    drawBranchThisLong=upToHeight-height;
        }
        */
        for(i=0;i<parent.branchlings.length;i++){
           //parent.branchlings[i].draw(canvas,branchLengths,upToLevel);
           //parent.branchlings[i].draw(canvas,branchLengths,this.iterations);
           parent.branchlings[i].draw(canvas,branchLengths,this.iterations,upToLevel);
           //if(parent.branchlings[i].getLevel()<=upToLevel){
           if(iteration < upToLevel){
           //NOTE - level is iteration+1, because the first branch is level 1
                thisObject.draw(canvas,upToLevel,branchLengths,parent.branchlings[i],iteration+1);
           }
        }
    }

    
    this.getFullHeight=function(){
        return thisObject.branchLength;


        //won't work atm
        var height=0;
        for(var i=0;i<thisObject.branchLengths.length;i++){
            height+=thisObject.branchLengths[i];
        }
        return height;
    }
}

var count=0;

var BranchClass=function(parent,startColour,endColour,angle,length,thick,level,growthRate){
    var thisBranch=this;
    this.parent=parent;
    this.sRand=parent.sRand;
    this.startColour=startColour;
    this.endColour=endColour;
    this.angle=angle;
    //this.angleLimit=angleLimit;
    this.branchlings=[];
    this.thick=thick
    this.length=length
    this.level=level;
    this.growthRate=growthRate;
    //console.log(thisBranch.level)

    this.getLength=function(atLevel){
        var diff=atLevel-this.level;
        return Math.pow(this.growthRate,diff)*this.length;
    }


    this.getPos=function(branchSizes,upToLevel){
        //slightly crazy way of getting position of end of this branch by going back to the very root of the tree
        thisBranch.parentPos=thisBranch.parent.getPos(branchSizes,upToLevel);
        var ourBranchSize=branchSizes[thisBranch.level-1];
        //console.log([thisBranch.level,thisBranch.getLevel()])
        var ourLength=thisBranch.getLength(upToLevel)*ourBranchSize;
        return [thisBranch.parentPos[0]+Math.cos(thisBranch.angle)*ourLength,thisBranch.parentPos[1]+Math.sin(thisBranch.angle)*ourLength];
    }

    this.nextAngle=function(angleLimit){
        //console.log(Math.crossProduct([Math.cos(this.angle),Math.sin(this.angle)],gravity));
        //console.log(Math.modulus(Math.crossProduct([Math.cos(this.angle),Math.sin(this.angle)],gravity)));

        //find angle of next branch
        //return this.angle-this.angleLimit/2 + this.sRand.next()*this.angleLimit;

        return this.angle-angleLimit + this.sRand.next()*angleLimit*2;

        if(this.sRand.next()<0.5){
            return this.angle-angleLimit;
        }else{
            return this.angle+angleLimit;
        }


/*
        //if(newAngle<)
        newAngle+=Math.crossProduct([Math.cos(newAngle),Math.sin(newAngle)],gravity)[2]/10;
        return newAngle;*/
    }

    this.getThickness=function(upToLevel,branchSizes){
        //if this is NOT the end branch - either because it has no more branchlings or arent drawing tree fully
        if(this.branchlings.length>0 && upToLevel>this.level){
            //sum up radius of thickness squared for each branchling to get total area
            var sumR2=0;

            for(var b=0;b<this.branchlings.length;b++){
                sumR2+=Math.pow(this.branchlings[b].getThickness(upToLevel,branchSizes)/2,2);
            }
            //console.log(Math.sqrt(sumR2))
            return Math.sqrt(sumR2)*2;//*branchSizes[this.level-1]/thisBranch.getLength(upToLevel);
        }

        return this.thick;//*branchSizes[this.level-1];//thisBranch.getLength(upToLevel);
    }

    //multiply length by branchSize to get how long this branch is
    //uptoLevel - total level that exists for this drawing
    this.draw=function(canvas,branchSizes,maxIterations){
        /*if(thisBranch.getLevel > maxIterations){
            return;
        }*/
        var myPos=thisBranch.getPos(branchSizes,maxIterations);
        //var parentPos=thisBranch.parent.getPos(branchSizes);
        var parentPos=thisBranch.parentPos;
        var drawToX=myPos[0];
        var drawToY=myPos[1];

        //var angle=Math.atan2(myPos[1]-parentPos[1], myPos[0]-parentPos[0]);

        var parentThick=thisBranch.parent.getThickness(maxIterations,branchSizes)*branchSizes[thisBranch.level-1];
        //var parentThick=5;
        var myThick=thisBranch.getThickness(maxIterations,branchSizes)*branchSizes[thisBranch.level-1];

        /*if(branchSize!==false){
            drawToX=parentPos[0]+Math.cos(thisBranch.angle)*branchSize;
            drawToY=parentPos[1]+Math.sin(thisBranch.angle)*branchSize;
        }*/

        //draw rectanlge with curved ends starting thickness of parentThick, ending thickness of this thick
        /*
        canvas.strokeStyle="rgba("+thisBranch.colour[0]+","+thisBranch.colour[1]+","+thisBranch.colour[2]+","+thisBranch.colour[3]+")";
        canvas.lineCap="round";
       // canvas.lineWidth=thisBranch.getThickness(maxIterations,branchSizes);//*branchSizes[thisBranch.level-1];
        canvas.lineWidth=parentThick;
        //console.log(parentThick)
        canvas.beginPath();
        canvas.moveTo(parentPos[0],parentPos[1]);
        canvas.lineTo(parentPos[0]+(drawToX-parentPos[0])/2,parentPos[1]+(drawToY-parentPos[1])/2);
        canvas.stroke();

        canvas.beginPath();
        canvas.lineCap="round";
        canvas.lineWidth=myThick;
        canvas.moveTo(parentPos[0],parentPos[1]);
        canvas.lineTo(drawToX,drawToY);
        canvas.stroke();
        */
       //alert([maxIterations])
        var dcolour=[ (thisBranch.endColour[0]-thisBranch.startColour[0])/maxIterations , (thisBranch.endColour[1]-thisBranch.startColour[1])/maxIterations , (thisBranch.endColour[2]-thisBranch.startColour[2])/maxIterations , (thisBranch.endColour[3]-thisBranch.startColour[3])/maxIterations];
        var myColour=[Math.round(thisBranch.startColour[0]+dcolour[0]*thisBranch.level) , Math.round(thisBranch.startColour[1]+dcolour[1]*thisBranch.level) , Math.round(thisBranch.startColour[2]+dcolour[2]*thisBranch.level) , (thisBranch.startColour[3]+dcolour[3]*thisBranch.level)]

       
        canvas.fillStyle="rgba("+myColour[0]+","+myColour[1]+","+myColour[2]+","+myColour[3]+")";
        //drawing a rectangle with rounded ends
        canvas.beginPath();
        //console.log(parentThick)
        canvas.moveTo(parentPos[0] + Math.cos(angle-Math.PI/2)*parentThick/2, parentPos[1] + Math.sin(angle-Math.PI/2)*parentThick/2);
       // canvas.lineTo(parentPos[0] + Math.cos(angle+Math.PI/2)*parentThick/2, parentPos[1] + Math.sin(angle+Math.PI/2)*parentThick/2);
        
        if(parentThick/2>1){
        canvas.arc(parentPos[0], parentPos[1],parentThick/2, angle-Math.PI/2, angle+Math.PI/2, true );
        }else{
            //don't draw an arc if the radius is too small
            canvas.lineTo(parentPos[0] + Math.cos(angle+Math.PI/2)*parentThick/2, parentPos[1] + Math.sin(angle+Math.PI/2)*parentThick/2);
        }
        canvas.lineTo(myPos[0] + Math.cos( angle+Math.PI/2)*myThick/2, myPos[1] + Math.sin( angle+Math.PI/2)*myThick/2);
        canvas.lineTo(myPos[0] + Math.cos( angle-Math.PI/2)*myThick/2, myPos[1] + Math.sin( angle-Math.PI/2)*myThick/2);
        //can't quite work out what I've got the wrong way aroud here, but it looks fine with rounded bottoms only
        //
        //canvas.arc(myPos[0], parentPos[1],myThick/2, angle+Math.PI/2,angle-Math.PI/2,  false );

        canvas.lineTo(parentPos[0] + Math.cos(angle-Math.PI/2)*parentThick/2, parentPos[1] + Math.sin(angle-Math.PI/2)*parentThick/2);
        canvas.fill();
        

        /*
        canvas.fillStyle="rgba("+thisBranch.colour[0]+","+thisBranch.colour[1]+","+thisBranch.colour[2]+","+thisBranch.colour[3]+")";
        //drawing a rectangle with rounded ends
        canvas.beginPath();
        canvas.moveTo(parentPos[0] + 5, parentPos[1] + 5);
        canvas.lineTo(parentPos[0] - 5, parentPos[1] - 5);
       // canvas.arc(parentPos[0], parentPos[1],parentThick/2, angle, angle+Math.PI, true );

        canvas.lineTo(myPos[0] + 3, myPos[1] + 3);
        //canvas.arc(myPos[0], parentPos[1],myThick/2, angle-Math.PI, angle, true );
        canvas.lineTo(parentPos[0] + 5, parentPos[1] + 5);
        canvas.fill();
        */

    }

}