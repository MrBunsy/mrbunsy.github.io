/* 
 * Copyright Luke Wallin 2012
 * TODO search online and find faster algorithms than mine!
 * To anyone reading this later: I didn't have internet when I wrote these.
 */

function up(a, b){
    return a - b;
}

function down(a, b){
    return b - a;
}

/*
 * Find highest common factor of a and b
 * 
 * returns int, expects ints
 */
Math.hcf=function(a,b){
    var aF=Math.factors(a).sort(down);
    var bF=Math.factors(b).sort(down);
    
    var bigger=bF;
    var smaller=aF
    if(aF[0] > bF[0]){
        bigger=aF;
        smaller=bF;
    }
    
    for(var i=0;i<bigger.length;i++){
        for(var j=0;j<smaller.length;j++){
            if(bigger[i]==smaller[j]){
                return bigger[i];
            }
        }
    }
    
    return 1;
}
/*
 * Find factors of a number, not returned in any particular order
 * 
 * returns array, expects int
 */
Math.factors=function(a){
    var factors=[1,a];
    
    var max = Math.ceil(Math.sqrt(a));
    //check for square numbers
    if(max*max==a){
        factors.push(max);
    }
    //only search up to below the sqrt of a
    for(var i=2;i<max;i++){
        var test = a/i;
        if(test%1==0){
            //i*test = a
            factors.push(i);
            factors.push(test);
        }
    }
    
    return factors;
}


/*
 * Finds the prime factors of an integer
 * Should always be returned starting with the smallest
 * 
 * returns array, expects int
 */

Math.primeFactors=function(a){
    
    if(a%1!=0){
        //not an int
        throw "Argument must be an integer";
    }
    
    var product = 1;
    var newA=a;
    
    var factors=[];
    var f=2;
    
    while(product<a){
        if(newA/f %1 ==0){
            //if f is a factor of a
            factors.push(f);
            newA=newA/f;
            product*=f;
        }else{
            //f wasn't a factor, try incrementing it
            f++;
        }
    }
    
    return factors;
}

/*
 * Lowest Common Multiple of an array of intergers
 * returns int, expects array
 */
Math.lcm=function(arr){
    if(arr.length==1){
        return arr[0];
    }
    
    var largestPFs=new Array(arr.length);
    
    //prime factors
    var pfs = new Array(arr.length);
    //get array of arrays of the prime factors
    for(var i=0;i<arr.length;i++){
        pfs[i] = Math.primeFactors(arr[i]);
        //store the largest one
        largestPFs[i] = pfs[i][pfs[i].length-1];
    }
    
    largestPFs.sort(down);
    //now largestPFs[0] is the largest single prime factor
    
    //find all the common ones eg if pfs = [ [2,2,3] , [2,2,2,5,5] ]
    //this should get [2,2,2,3,5,5]
    
    var counts=new Array(arr.length);
    
    var lcm = 1;
    
    for(var i=largestPFs[0];i>1;i--){
        //count how many occurances of i are in each array;
        for(var j=0;j<arr.length;j++){
            counts[j] = occurs(pfs[j],i);
        }
        //find the largest count
        counts.sort(down);
        //multiply the answer by i this many of times
        lcm*=Math.pow(i,counts[0]);
    }
    
    //to keep the warnings happy that something is being returned
    return lcm;
}
/*
 * return how many times value occurs in array
 */
var occurs = function(array,value){
    var c=0;
    for(var i=0;i<array.length;i++){
        //only == not ===, might catch me out later?
        if(array[i]==value){
            c++;
        }
    }
    return c;
}
/*
 * given a weighting array of numbers, will return int up to lenght of array-1,
 * with probability given by value of that position in the weightings out of 
 * the total sum of the weighting array
 * 
 * eg given [1,2,4]
 * there's a 1/7 change of getting 0
 * a 2/7 change of getting 1
 * and a 4/7 change of getting 2
 */
Math.getWeightedRandom=function(weightings){
        
    if(weightings.length==0){
        return 0;
    }
        
    var totalP=0;

    for(var i=0;i<weightings.length;i++){
        totalP+=weightings[i];
    }

    var r = Math.random()*totalP;

    var lastP=0;

    for(var i=0;i<weightings.length;i++){
        lastP+=weightings[i];
        if(r < lastP){
            return i;
        }

    }

    return weightings.length-1;

}

Math.hypot=function(x,y){
    return Math.sqrt(x*x + y*y);
}

//caps = Vector, noncaps = scalar:
//line = A + tN
//point = P
//return shortest distance from point to line
//http://en.wikipedia.org/wiki/Distance_from_a_point_to_a_line#Vector_formulation
//Math.distanceLineToPointSqrd=function(a,n,p){
//    var stepOne = n.multiply( (a.subtract(p)).dot(n) );
//    
//    var lineToPoint = (a.subtract(p)).subtract(stepOne);
//    
//    return lineToPoint.getMagnitudeSqrd();
//}

Math.distanceLineToPoint=function(a, n, p){
    
    var A = a;
    var B = a.add(n);
    var P = p;
    //return Math.sqrt(Math.distanceLineToPointSqrd(a, n, p));
    var normalLength = Math.hypot(B.x - A.x, B.y - A.y);
    return Math.abs((P.x - A.x) * (B.y - A.y) - (P.y - A.y) * (B.x - A.x)) / normalLength;
}