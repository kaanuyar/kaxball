class Plane {
	constructor(props) {
		this.position = props.start_position.slice();
		this.angle = props.angle;
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
		ctx.translate(-x, -y);
		
		ctx.moveTo(x - (length / 2), y);
		ctx.lineTo(x + (length / 2), y);
		ctx.stroke();
		ctx.restore();
	}
}