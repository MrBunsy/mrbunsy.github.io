/* 
 * Copyright Luke Wallin 2012
 * 
 * largely stolen from Jama:
 * 
 * @author The MathWorks, Inc. and the National Institute of Standards and Technology.
    @version 5 August 1998
 */


//going to need:
//multiply
//add
//identity
//set
//

var Matrix = function(m,n){
    //m= number of rows
    //n= number of cols
    
    
    // ------------ constuctor ------------
    
    this.n=n;
    this.m=m;
    
    this.A = new Array(this.m);
    
    for (var i = 0; i < this.m; i++) {
        this.A[i] = new Array(this.n);
        for(var j=0;j<this.n;j++){
            //initialise to zeros
            this.A[i][j]=0;
        }
    }
    
    this.get = function(i, j) {
      return this.A[i][j];
   }
    
    this.setA=function(A){
        this.A=A;
    }
    
    this.multiplyByDouble = function(s){
        var X = new Matrix(this.m,this.n);
      var C = X.getArray();
      for (var i = 0; i < this.m; i++) {
         for (var j = 0; j < this.n; j++) {
//            X.set(i, j, s*this.A[i][j]);
                C[i][j] = s*this.A[i][j];
         }
      }
      return X;
    }
    
    this.multiplyByMatrix = function(B) {
        if (B.m != this.n) {
            throw "Matrix inner dimensions must agree.";
        }
        var X = new Matrix(this.m,B.n);
        var C = X.getArray();
        var Bcolj = new Array(this.n);
        for (var j = 0; j < B.n; j++) {
            for (var k = 0; k < this.n; k++) {
                Bcolj[k] = B.A[k][j];
            }
            for (var i = 0; i < this.m; i++) {
                var Arowi = this.A[i];
                var s = 0;
                for (var k = 0; k < this.n; k++) {
                    s += Arowi[k]*Bcolj[k];
                }
                C[i][j] = s;
            }
        }
        return X;
    }
   
    this.getArray=function(){
//        var Acopy= new Array(this.n);
//       
//        for (var i = 0; i < this.n; i++) {
//            Acopy[i] = this.A[i].slice(0);
//        }
//    
//        return Acopy;
        return this.A;
    }
   
    this.addMatrix=function (B){
        this.checkMatrixDimensions(B);
        var X = new Matrix(this.m,this.n);
        var C = X.getArray();
        for (var i = 0; i < this.m; i++) {
            for (var j = 0; j < this.n; j++) {
                C[i][j] = this.A[i][j] + B.A[i][j];
            }
        }
        return X;
    }
    
    this.checkMatrixDimensions =function(B) {
      if (B.m != this.m || B.n != this.n) {
         throw "Matrix dimensions must agree.";
      }
   }
   
   this.set=function(i,j,a){
       this.A[i][j] = a;
   }
}

//should work like a static method
Matrix.identity=function(n){
    var I = new Matrix(n,n);
    
    for(var i=0;i<n;i++){
        I.set(i,i,1);
    }
    
    return I;
}