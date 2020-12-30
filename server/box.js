let p2 = require("p2");

class Box {
	constructor(props) {
		this.shape = null;
		this.body  = null;
		// 0 for no goal, -1 for red team, 1 for blue team
		// make a enum later on, not bother now
		this.goal = 0;
		
		this.init(props);
	}
	
	init(props) {
		this.shape = new p2.Box({
			material: props.material,
			width: props.width,
			height: props.height,
			sensor: props.sensor
        });
        this.body = new p2.Body({
			position: props.start_position,
			angle: props.angle,
			type: p2.Body.STATIC
        });
		this.body.addShape(this.shape);
		
		this.shape.collisionGroup = props.collision_group;
		this.shape.collisionMask  = props.collision_mask;
		
		if(props.sensor) {
			props.world.register_begin_contact(this.begin_contact_callback.bind(this), this);
			props.world.register_end_contact(this.end_contact_callback.bind(this), this);
		}
	}
	
	update(delta_time) {
		
	}
	
	render(ctx) {
        let x = this.body.interpolatedPosition[0];
        let y = this.body.interpolatedPosition[1];
        ctx.save();
		ctx.beginPath();
		
        ctx.translate(x, y);
        ctx.rotate(this.body.angle);
        //ctx.fillRect(-this.shape.width/2, -this.shape.height/2, this.shape.width, this.shape.height);
		ctx.rect(-this.shape.width/2, -this.shape.height/2, this.shape.width, this.shape.height);
		ctx.stroke();
        ctx.restore();
	}
	
	begin_contact_callback(evt) {
		if(this.body.interpolatedPosition[0] < 0)
			this.goal = -1;
		else if(this.body.interpolatedPosition[0] > 0)
			this.goal = 1;
	}
	
	end_contact_callback(evt) {
		this.goal = 0;
	}
	
	goal_occurred() {
		let goal = this.goal;
		this.goal = 0;
		
		return goal;
	}
}

module.exports = Box;