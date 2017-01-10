/* This script and many more are available free online at
The JavaScript Source!! http://javascript.internet.com
Created by: Simon Willison | http://simon.incutio.com/ */
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}

addLoadEvent(nameOfSomeFunctionToRunOnPageLoad);
addLoadEvent(function() {
  functionHere();
});
