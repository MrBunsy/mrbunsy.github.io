/* 
 * Copyright Luke Wallin 2012
 */
//ideas from:
//http://ejohn.org/blog/web-workers/
//http://blogs.gnome.org/jamesh/2011/03/08/javascript-fractal/


//generate a single strip of pixels
onmessage = function(e){
    var data=e.data;
    var x1=data.x1;
    var dx=data.width;
    var x2=x1+dx;
    
    var height=data.height;

    var detail = data.detail;

    var zoom = data.zoom;
    var fz = data.fz;
    
    
    var pixels = new Array(dx*height);
    
//    switch(fz){
//        case 1://burning ship
//            //turn upside down
//            data.c[1]=-data.c[1];
//            break;
//    }
    
    var cx=data.c[0];
    var cy=data.c[1];
    for (var x = x1; x < x2; x++) {
            
        cy=data.c[1];
            
        for (var y = 0; y < height; y++) {               

            var zx=0,zy=0;
                
            var i = 0;
            
            while(zx*zx + zy*zy < 4 && i<detail){
                //z = z.square().add(c);//.square()
                switch(fz){
                    case 1:
                        //burning ship
//                        Complex q = new Complex(Math.abs(z.re()), Math.abs(z.im()));
//                        return q.times(q).plus(c.times(-1));
                        zx = Math.abs(zx);
                        zy = Math.abs(zy);
                        
                        //deliberately fall into mandelbrot after this
                        //break;
                    case 0:
                    default:
                        //mandelbrot
                        var newzx = zx*zx - zy*zy + cx;
                        zy = 2*zx*zy + cy;
                        zx = newzx;
                        break;
                }
                
                    
                i++;
            }
            var s=i;
                
            if(i!=detail){
                
                //z = z.square().add(c);
                newzx = zx*zx - zy*zy + cx;
                zy = 2*zx*zy + cy;
                zx = newzx;
                    
                newzx = zx*zx - zy*zy + cx;
                zy = 2*zx*zy + cy;
                zx = newzx;
                s=i +1 - Math.log(Math.log(zx*zx + zy*zy))/Math.log(2);
            }
                
            pixels[(x-x1+y*dx)]=s;
           
            cy-=zoom;
        }
        cx+=zoom;
    }
        
    var returnObject = new Object();
    returnObject.pixels=pixels;
    returnObject.x1=x1;
    returnObject.id=data.id;
        
    postMessage(returnObject);
}
