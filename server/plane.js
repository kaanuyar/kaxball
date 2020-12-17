let p2 = require("p2");

class Plane {
	constructor(props) {
		this.shape = null;
		this.body = null;
		this.length = 60;
		
		this.init(props);
	}
	
	init(props) {
		this.shape = new p2.Plane({
			material: props.material
		});
		this.body = new p2.Body({
			position: props.start_position,
			angle: props.angle,
			type: p2.Body.STATIC
		});
		this.body.addShape(this.shape);
		
		this.shape.collisionGroup = props.collision_group;
		this.shape.collisionMask  = props.collision_mask;
	}
	
	update(delta_time) {
		
	}
	
	render(ctx) {
		let x = this.body.interpolatedPosition[0];
		let y = this.body.interpolatedPosition[1];
		let angle = this.body.angle;
		let length = this.length;
		
		ctx.save();
		ctx.beginPath();
		ctx.translate(x, y);
		ctx.rotate(angle);
		ctx.translate(-x, -y);
		
		ctx.moveTo(x - (length / 2), y);
		ctx.lineTo(x + (length / 2), y);
		ctx.stroke();
		ctx.restore();
	}
}

module.exports = Plane;