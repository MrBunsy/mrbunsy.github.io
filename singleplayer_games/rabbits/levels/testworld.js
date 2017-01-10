function loadtestworld()
{
gridcols=10;
gridrows=10;
gridsize=40;
gridsides=6;

worldsize=[Math.ceil(gridcols*gridsize*1.732+gridsize*1.732/2),Math.ceil(gridrows*gridsize*1.5 +gridsize/2)];


//entity(col,row,type,bodycolour,facing,enabled,earcolour,carry,update,count)
new entity(3,3,0,[false,2],5,true,false,false,2,20)

new entity(7,7,1,false,5,true,false,false,false,0)

new entity(9,9,3,false,5,true,false,false,false,0)

new entity(5,6,2,2,4,true,false,false,0)
new entity(5,7,2,false,3,true,false,false,0)

}
loadtestworld();
finishloading();