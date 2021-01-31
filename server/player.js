let p2 = require("p2");
let {CollisionGroup, CollisionMask} = require("./enums.js");

class Player {
	constructor(props) {
		this.keyboard = props.keyboard;
		this.name = props.name || "default_name";
		this.client_id = props.client_id;
		this.force = 55;
		this.max_velocity = 20;
		this.kick_cooldown = 0;
		
		this.body = null;
		this.shape = null;
		this.sensor_shape = null;
		
		this.init(props);
	}
	
	init(props) {
		this.shape = new p2.Circle({ 
			radius: props.radius,
			material: props.material,
			collisionGroup: CollisionGroup.PLAYER,
			collisionMask: CollisionMask.PLAYER
		});
		this.sensor_shape = new p2.Circle({
			radius: props.sensor_radius,
			collisionGroup: CollisionGroup.SENSOR,
			collisionMask: CollisionMask.SENSOR,
			sensor: true
		});
		this.body = new p2.Body({
			mass: props.mass, 
			position: props.start_position, 
			velocity: props.start_velocity, 
			damping: props.damping
		});
		this.body.addShape(this.shape);
		this.body.addShape(this.sensor_shape);
	}
	
	update(delta_time) {
		this.decrease_kick_cooldown();
		this.apply_force(delta_time);
		this.constrain_velocity(this.max_velocity);
	}
	
	keydown_press(keycode) {
		this.keyboard.keycode_to_button(keycode, 1);
	}
	
	keyup_press(keycode) {
		this.keyboard.keycode_to_button(keycode, 0);
	}
	
	set_position_velocity(position, velocity) {
		this.body.position[0] = position[0];
		this.body.position[1] = position[1];
		
		this.body.velocity[0] = velocity[0];
		this.body.velocity[1] = velocity[1];
	}
	
	kick_available() {
		if(this.keyboard.buttons.space == 1 && this.kick_cooldown == 0)
			return true;
		else
			return false;
	}
	
	decrease_kick_cooldown() {
		if(this.kick_cooldown > 0)
			this.kick_cooldown -= 1;
	}
	
	increase_kick_cooldown() {
		this.kick_cooldown += 10;
	}
	
	apply_force(delta_time) {
		let buttons = this.keyboard.buttons;
		let force = this.force;
		
		if((buttons.up || buttons.down) && (buttons.right || buttons.left))
			force = Math.sqrt(Math.pow(force, 2) / 2);
		
		force = force * delta_time;
		if(buttons.right) 
			this.body.applyImpulse([force, 0]);
		else if(buttons.left)
			this.body.applyImpulse([-force, 0]);
		
		if(buttons.up)
			this.body.applyImpulse([0, force]);
		else if(buttons.down)
			this.body.applyImpulse([0, -force]);
	}
	
	constrain_velocity(maxVelocity) {
        let angle, currVelocitySqr, vx, vy;
        vx = this.body.velocity[0];
        vy = this.body.velocity[1];
        currVelocitySqr = vx * vx + vy * vy;
        if (currVelocitySqr > maxVelocity * maxVelocity) {
            angle = Math.atan2(vy, vx);
            vx = Math.cos(angle) * maxVelocity;
            vy = Math.sin(angle) * maxVelocity;
            this.body.velocity[0] = vx;
            this.body.velocity[1] = vy;
        }
    }
}

module.exports = Player;