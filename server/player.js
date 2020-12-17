let p2 = require("p2");

class Player {
	constructor(props) {
		this.start_position = props.start_position;
		this.start_velocity = props.start_velocity;
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
		//console.log(this.body.velocity[0], this.body.velocity[1]);
	}
	
	render(ctx) {
		ctx.beginPath();
		let x = this.body.interpolatedPosition[0];
		let y = this.body.interpolatedPosition[1];
		let radius = this.shape.radius;
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.stroke();
		
		ctx.save();
		ctx.scale(1, -1);
		ctx.globalAlpha = 0.5;
		ctx.font = "2px Georgia";
		ctx.textAlign = "center";
		ctx.fillText(this.name, x, -(y - 2 * this.shape.radius));
		ctx.globalAlpha = 1;
		ctx.restore();
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