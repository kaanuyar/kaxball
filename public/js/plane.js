class Plane {
	constructor(props) {
		this.position = props.start_position.slice();
		this.angle = props.angle;
		this.collision_group = props.collision_group;
		this.length = 60;
	}
	
	update(delta_time) {
		
	}
	
	render(ctx) {
		let x = this.position[0];
		let y = this.position[1];
		let angle = this.angle;
		let length = this.length;
		
		ctx.save();
		ctx.beginPath();
		ctx.translate(x, y);
		ctx.rotate(angle);
		
		ctx.moveTo(-(length / 2), 0);
		ctx.lineTo( (length / 2), 0);
		ctx.stroke();
		ctx.restore();
	}
}