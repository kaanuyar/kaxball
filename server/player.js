let p2 = require("p2");

// after everything is over maybe create a base circle class that player and ball will have
class Player {
	constructor(props) {
		this.keyboard = props.keyboard;
		this.name = props.name || "default_name";
		this.client_id = props.client_id;
		this.force = 50;
		this.max_velocity = 20;
		this.shape = null;
		this.body = null;
		
		this.init(props);
	}
	
	init(props) {
		this.shape = new p2.Circle({ 
			radius: props.radius,
			material: props.material
		});
		this.body = new p2.Body({
			mass: props.mass, 
			position: props.start_position, 
			velocity: props.start_velocity, 
			damping: props.damping
		});
		this.body.addShape(this.shape);
		
		this.shape.collisionGroup = props.collision_group;
		this.shape.collisionMask  = props.collision_mask;
	}
	
	update(delta_time) {
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
		return this.keyboard.buttons.space;
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