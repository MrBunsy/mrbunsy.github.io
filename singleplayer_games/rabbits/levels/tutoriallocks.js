function loadtutorial4()
{
//levelmessage("<b>Tutorial 4 - Locks and Keys</b><br><br>In the gap in the blocks there is a <b>lock</b> which will only let bunnies through once it has been opened.  To open a lock, bunnies must walk over the top of all the the <b>keys</b> linked to that lock.  Use your arrows to direct the bunnies over the key and through the lock.");

new lock(2,3,1); 
new key(2,1,false,0); 
new warren(2,4,0,false); 
new hutch(0,0,[false],[false],[false],4,2,20); 
new fakelock(3,3,0); 
new fakelock(3,4,0); 
new fakelock(1,3,0); 
new fakelock(1,4,0); 
gridcols=5;gridrows=5;gridsize=120;gridsides=4;
new tool(0,0,3); 
rabbitsWillWait=true;




}
loadtutorial4();
finishloading();