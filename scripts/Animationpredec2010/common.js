function sRand(seed)
{
    this.seed = (typeof seed == 'undefined') ? randomInt() : seed;
    this.next = function()
    {
        var rand_max = 65536; //2 bytes
        var rand = 0; //where the put the bits
        for (var i=0; i<16; i++)
        {
            //get the random no, bit by bit, for 2 bytes
            this.seed = this.getBit(this.seed);
            //make space
            rand <<= 1;
            //add the new bit to the end
            rand |= (this.seed & 1);
        }
        return rand / (rand_max+1); //and down to 0-0.999999
    }

    this.getBit = function(bitSeed)
    {
        if (bitSeed & 131072)
            bitSeed = ((bitSeed ^ 19) << 1) | 1;
        else
            bitSeed <<= 1;
        return bitSeed;
    }
}
// ----------------- Common functions --------------------

function myAddEvent(obj,event,func) {
    //adapted from a function by Todd Anthony Spartaforce http://spatacoli.com/storydisplay.aspx?reqid=5463c334-0d6f-425a-94cd-fe5ead3634e7
    //needed a non-destructive cross-browser method for adding event listeners
    var oldevent = obj[event];
    if (typeof obj[event] != 'function')
        obj[event] = func;
    else {
        obj[event] = function() {
            oldevent();
            func();
        };
    }
}

//expects a and b to be [x,y,z].  will also take 2d vectors and assumes 0 for z;
Math.crossProduct = function(a, b)
{
	if(a.length<3)
	{
		a.push(0);
	}

	if(b.length<3)
	{
		b.push(0);
	}

	return [a[1]*b[2] - a[2]*b[1] , a[2]*b[1] - a[0]*b[2] , a[0]*b[1] - a[1]*b[0]];
}

Math.modulus=function(vector)
{
	var sqrd=0;
	for(var i=0;i<vector.length;i++)
	{
		sqrd+=vector[i]*vector[i];
	}
	return Math.sqrt(sqrd);
}