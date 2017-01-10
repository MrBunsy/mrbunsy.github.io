/* 
 * Copyright Luke Wallin 2012
 */


var Sphere = function(pos,r,segments,rings,colour){
    
    this.triangles = new Array();
    this.segments=segments;
    this.rings=rings;
    this.colour=colour;
    this.r=r;
    this.pos=pos;

    //theta = looking from top, angle from x axis, segment
    //alpha = looking from side, angle from z axis, ring

    var dTheta = 2 * Math.PI /  segments;
    var dAlpha = Math.PI /  rings;

    var thetas = new Array(segments);
    var alphas = new Array(rings);


    var top = pos.add(new Vector(0, 0, this.r));
    var bottom = pos.add(new Vector(0, 0, -this.r));

    //number of lines on contours = number of rings, so number of devisions is rings+1 which accoutns for the top/bottom
    //number of lines lengthways = number of segments, because these wrap around.

    var points = createArray(segments,rings);//new Vector[segments][rings];
    var normals = createArray(segments,rings);

    for (var i = 0; i < segments; i++) {
        thetas[i] = dTheta * i;
    }

    for (var i = 0; i < rings; i++) {
        alphas[i] = dAlpha * (i + 1);
    }

    var segmentDir, ringDir;
    for (var i = 0; i < segments; i++) {

        //points along the x-y plane towards the segment
        segmentDir = new Vector(Math.cos(thetas[i]), Math.sin(thetas[i]), 0);

        for (var j = 0; j < rings; j++) {

            //points at the ring on this segment
            ringDir = new Vector(segmentDir.x * Math.sin(alphas[j]), segmentDir.y * Math.sin(alphas[j]), Math.cos(alphas[j]));

            normals[i][j] = ringDir.getUnit();

            points[i][j] = pos.addMultiple(ringDir, r);

        }
    }



    for (var i = 0; i < segments; i++) {
        //top
        this.triangles.push(new Triangle(top, points[i][0], points[((i + 1) % segments)][0],colour));// new Vector(0, 0, 1), normals[i][0], normals[((i + 1) % segments)][0]));



        for (var j = 0; j < rings - 1; j++) {
            //middle

            //top half of this square
            this.triangles.push(new Triangle(points[i][j], points[i][j + 1], points[((i + 1) % segments)][j],colour));//, normals[i][j], normals[i][j + 1], normals[((i + 1) % segments)][j]));

            //bottom half of this square
            this.triangles.push(new Triangle(points[((i + 1) % segments)][j + 1], points[i][j + 1], points[((i + 1) % segments)][j],colour));//, normals[((i + 1) % segments)][j + 1], normals[i][j + 1], normals[((i + 1) % segments)][j]));

        }

        //bottom
        this.triangles.push(new Triangle(bottom, points[i][rings - 1], points[((i + 1) % segments)][rings - 1],colour));//, new Vector(0, 0, -1), normals[i][rings - 1], normals[((i + 1) % segments)][rings - 1]));
    }
    //set all the surface normals for the triangle
    for (var i=0;i<this.triangles.length;i++) {
        this.triangles[i].thisIsInside(pos);
    }

    this.getTriangles=function(){
        return this.triangles;
    }
    
    this.getCentre=function(){
        return this.pos;
    }
    
    this.rotate=function(axis,angle){
        this.pos=this.pos.rotateByAxis(axis, angle);
        
        for(var i=0;i<this.triangles.length;i++){
            this.triangles[i].rotate(axis, angle);
        }
    }
        
}