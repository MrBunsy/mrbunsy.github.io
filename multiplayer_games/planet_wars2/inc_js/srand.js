var Random = 
{
 seed : 12345,
 //Returns a random number between 0 and 1
 next : function(lower,upper)
 {
  var maxi = Math.pow(2,32);
  this.seed = (134775813 * (this.seed + 1))
     % maxi;
  var num = (this.seed) / maxi;
  if(typeof lower!='undefined')
  {
   var range = upper - lower;
   num *= range;
   num += lower;
  }
  return num;
 }
}



var sRand = {
	seed : 99996,
	next : function() {
		var rand_max = 65536; //2 bytes
		var rand = 0; //where the put the bits
		for (var i=0; i<16; i++) { //get the random no, bit by bit, for 2 bytes
			this.seed = this.getBit(this.seed);
			rand <<= 1; //make space
			rand |= (this.seed & 1); //add the new bit to the end
		}
		//rand &= rand_max; //shave to size
		return rand / rand_max; //and down to 0-0.999999
	},
	getBit : function(bitSeed) {
		var IB1 = 1;
		var IB2 = 2;
		var IB5 = 16;
		var IB18 = 131072;
		var MASK = IB1+IB2+IB5;
		
		if (bitSeed & IB18)
			bitSeed = ((bitSeed ^ MASK) << 1) | IB1;
		else
			bitSeed <<= 1;
		return bitSeed;
	}
}