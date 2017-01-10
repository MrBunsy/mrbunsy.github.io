/**
 * @author Luke
 *
 * New collison response class - decided to follow the collison detection and make this entirely abstract
 * IE - it has no idea of the rest of the physics engine, you hand it a hyperthetical situation and it returns a result
 *
 */
var ResponseClass = function()
{

	var thisObject = this;
	
	//always the same arguments
	//pin is here because ideally I'd one day like pins to be implemented properly, for time being I think they're going to be springs
	this.rigidBodyAndRigidBody = function(relativePos, r1, v1, m1, a1, mI1, canMove1, pin1, contactPoint, contactNormal, r2, v2, m2, a2, mI2, canMove2, pin2, e)
	{
		//var newV1 = [0, 0, 0];
		//var newV2 = [0, 0, 0];
		
		if(!canMove2)
		{
			v2=[0,0,0];
		}
		
		//displacement from centre of mass of shape a to contact point
		var r_ap=contactPoint;
		
		//if(pin1)
		
		//displacement from centre of mass of shape b to contact point
		var r_bp=[contactPoint[0]-relativePos[0] , contactPoint[1]-relativePos[1]];
		//velocity of the contact point on shape a
		//v_ap1 = v_a1 + ω_a1 × r_ap 
		//ω x r = (0, 0, ω) × (rx, ry, 0) = (−ω ry, ω rx, 0)
		var v_ap1=[v1[0] -v1[2]*r_ap[1] , v1[1] + v1[2]*r_ap[0]];
		//and for shape b
		var v_bp1=[v2[0] -v2[2]*r_bp[1] , v2[1] + v2[2]*r_bp[0]];
		
		//relative velocities of colliding points
		var v_ab1=[v_ap1[0] - v_bp1[0] , v_ap1[1] - v_bp1[1]];
		
		var velative_normal_velocity = Math.dotProduct(v_ab1, contactNormal);
		
		
		
		
		
		
		//j = ( −(1 + e) vab1 · n ) / ( 1⁄ma + 1⁄mb + (rap × n)2 ⁄ Ia + (rbp × n)2 ⁄ Ib )
		
		var r_apCrossN = Math.crossProduct(r_ap , contactNormal);
		var r_bpCrossN = Math.crossProduct(r_bp , contactNormal);
		var impulse = ( -(1 + e)*Math.dotProduct(v_ab1,contactNormal) ) / ( 1/m1 + 1/m2 + Math.dotProduct(r_apCrossN, r_apCrossN)/mI1 +  Math.dotProduct(r_bpCrossN, r_bpCrossN)/mI2 );
		
		
		if(!canMove2)
		{
			//j = (−(1 + e) vab1 · n) / ( 1⁄ma + (rap × n)2 ⁄ Ia )
			impulse = ( -(1 + e)*Math.dotProduct(v_ab1,contactNormal) ) / ( 1/m1 + Math.dotProduct(r_apCrossN, r_apCrossN)/mI1);
		}
		
		//v_a2 = v_a1 + j n / m_a
		//v_b2 = v_b1 − j n / m_b
		//ω_a2 = ω_a1 + (r_ap × j n) / I_a
		//ω_b2 = ω_b1 − (r_bp × j n) / I_b
		//I = moment of inertia
		
		var newV1 = [v1[0] + impulse*contactNormal[0]/m1 , v1[1] + impulse*contactNormal[1]/m1 , v1[2] + impulse*Math.crossProduct(r_ap, contactNormal)[2]/mI1];
		
		//this seems to resolve a bug elsewhere with a NaN velocity.  I presume at some point physics tries to set a v on a static object?
		var newV2=[0,0,0];
		if (canMove2) 
		{
			var newV2 = [v2[0] - impulse * contactNormal[0] / m2, v2[1] - impulse * contactNormal[1] / m2, v2[2] - impulse * Math.crossProduct(r_bp, contactNormal)[2] / mI2];
		}
		//this results in circles colliding with the border/other circles and not spinning as a result.  I *think* this is because in RL if a ball collides, it compresses slightlly first so the contact point is somewhere where there will be a rotational component
		
		//NOTE: energy conservation: vab2 · n = −e vab1 · n
		//alert([Math.dotProduct([newV1[0],newV1[1]],contactNormal),-e*Math.dotProduct([v_ab1[0],v_ab1[1]],contactNormal)]);
		//alert([v1,newV1])
		
		return {
			"v1": newV1,
			"v2": newV2
		}
	}
	
	this.collideTwoShapes = function(shape1, newPos, newV, shape2, contactPoint, contactNormal)
	{
		var relativePos = [shape2.pos[0] - newPos[0], shape2.pos[1] - newPos[1]];
		//newPos[2] is the new angle
		return thisObject.rigidBodyAndRigidBody(relativePos, shape1.d, newV, shape1.mass, newPos[2], shape1.mI, shape1.canMove, shape1.pin ,contactPoint, contactNormal, shape2.d, shape2.v, shape2.mass, shape2.pos[2], shape2.mI, shape2.canMove, shape2.pin, shape1.e*shape2.e);
	}
}
