let p2 = require("p2");
let {CollisionGroup, CollisionMask} = require("./enums.js");

class Ball {
	constructor(props) {
		this.shape = null;
		this.body = null;
		
		this.kick_force = 1500;
		this.contacted_players = [];
		
		this.init(props);
	}
	
	init(props) {
		this.shape = new p2.Circle({ 
			radius: props.radius,
			material: props.material,
			collisionGroup: CollisionGroup.BALL,
			collisionMask: CollisionMask.BALL
		});
		this.body = new p2.Body({
			mass: props.mass, 
			position: props.start_position, 
			velocity: props.start_velocity, 
			damping: props.damping
		});
		this.body.addShape(this.shape);
		
		props.world.register_begin_contact(this.begin_contact_callback.bind(this), this);
		props.world.register_end_contact(this.end_contact_callback.bind(this), this);
	}
	
	update(delta_time) {
		for(let player of this.contacted_players) {
			if(player.kick_available())
				this.kick(player, delta_time);
		}
	}
	
	set_position_velocity(position, velocity) {
		this.body.position[0] = position[0];
		this.body.position[1] = position[1];
		
		this.body.velocity[0] = velocity[0];
		this.body.velocity[1] = velocity[1];
	}
	
	begin_contact_callback(evt) {
		if(evt.shapeA.collisionGroup == CollisionGroup.SENSOR || 
		   evt.shapeB.collisionGroup == CollisionGroup.SENSOR) {
			let contacted_player = evt.objA == this ? evt.objB : evt.objA;
			this.contacted_players.push(contacted_player);
		}
	}
	
	end_contact_callback(evt) {		
		if(evt.shapeA.collisionGroup == CollisionGroup.SENSOR || 
		   evt.shapeB.collisionGroup == CollisionGroup.SENSOR) {
			let contacted_player = evt.objA == this ? evt.objB : evt.objA;
			this.contacted_players = this.contacted_players.filter((e) => { return e !== contacted_player });
		}
	}
	
	kick(player, delta_time) {		
		let p1 = player.body;
		let p2 = this.body;
		
		let x = p2.interpolatedPosition[0] - p1.interpolatedPosition[0];
		let y = p2.interpolatedPosition[1] - p1.interpolatedPosition[1];
		let angle = Math.atan2(y, x);

		//this.body.applyForce([Math.cos(angle) * this.kick_force, Math.sin(angle) * this.kick_force]);
		let force = this.kick_force * delta_time;
		console.log(force, delta_time);
		this.body.applyImpulse([Math.cos(angle) * force, Math.sin(angle) * force]);	
		player.increase_kick_cooldown();
	}
}

module.exports = Ball;