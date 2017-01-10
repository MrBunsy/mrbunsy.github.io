function loadtestworld()
{
gridcols=9;
gridrows=9;
gridsize=40;
gridsides=6;

//entity(col,row,type,bodycolour,facing,enabled,earcolour,carry,update,count)
//new entity(3,3,0,[false,2],5,true,false,false,2,20)

//hutch(col,row,bodycolour,earcolour,carrying,facing,freq,total)
new hutch(4,0,[0,1,2,3],[3,2,1,0],[2,3,0,1],5,2,20);

//(col,row,rabbittype,specific,barriertype)
new barrier(3,4,3,1,0);
new barrier(4,4,1,1,0);
new barrier(6,4,1,1,1);
new barrier(7,4,2,1,1);

//warren(col,row)
//warren(col,row,warrentype,specific)
//new warren(2,3,1,2);

//new warren(2,6,2,3);

//new warren(2,3,3,1);

new warren(0,7,0,0);

new block(5,4,0)

//arrow(col,row,facing,arrowtype,specific)
new arrow(5,7,4,1,2,false,true);
//new entity(7,7,1,false,5,true,false,false,false,0)
/*
new entity(9,9,3,false,5,true,false,false,false,0)

new entity(5,6,2,2,4,true,false,false,0)
new entity(5,7,2,false,3,true,false,false,0)
*/

new tool(0,0,5);
new tool(1,2,5);
new tool(2,3,5);
new tool(3,0,5);
new tool(3,1,5);
new tool(3,2,5);
new tool(3,3,5);
}
loadtestworld();
finishloading();