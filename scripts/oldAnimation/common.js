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