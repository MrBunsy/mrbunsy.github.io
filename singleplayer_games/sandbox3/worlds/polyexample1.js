function loadpolyexample1()
{
//polygon(state,name,x,y,Xs,Ys,mass,colour,type,vx,vy,vw,fx,fy,fw,hard,filled,visible,gametype,elastic)
new polygon(1,'savedborderpoly',0,-50,[50,500,600,100],[50,100,500,600],100,'black',1,0,0,0,0,0,0,true,false,true,3,1);
new polygon(1,'savedotherpoly',0,0,[50,300,200,200],[500,400,200,100],100,'black',1,0,0,0,0,0,0,true,false,true,3,1);
new entity(1,'savedball',250,100,50,50,50,'red',0,0,0,0,0,true,false,0,true,1,1,'','');
new entity(1,'savedball2',400,100,50,50,50,'green',0,0,0,0,0,true,false,0,true,1,1,'','');

gravityY=200;
friction=5; 
document.getElementById('smallworld').checked=false;
}
loadpolyexample1();
finishloading();