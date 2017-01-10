/* 
 * Copyright Luke Wallin 2012
 */

//http://stackoverflow.com/questions/966225/how-to-create-a-two-dimensional-array-in-javascript
//to create a 2d array easily
function createArray(length) {
    var a = new Array(length || 0);

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0; i < length; i++) {
            a[i] = createArray.apply(this, args);
        }
    }

    return a;
}