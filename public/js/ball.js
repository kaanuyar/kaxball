class Ball {
	constructor(props) {
		this.position = props.start_position.slice();
		this.radius = props.radius;
	}
	
	update(delta_time) {
		
	}
	
	render(ctx) {
		ctx.beginPath();
		let x = this.position[0];
		let y = this.position[1];
		let radius = this.radius;
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.stroke();
	}
	
	set_position(position) {
		this.position[0] = position[0];
		this.position[1] = position[1];
	}
}