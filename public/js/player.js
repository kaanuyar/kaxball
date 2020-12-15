class Player {
	constructor(props) {
		this.keyboard = props.keyboard;
		this.name = props.name;
		
		this.position = props.start_position;
		this.radius = props.radius;
		
		this.start_position = [];
		this.start_position[0] = this.position[0];
		this.start_position[1] = this.position[1];
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
		
		ctx.save();
		ctx.scale(1, -1);
		ctx.globalAlpha = 0.5;
		ctx.font = "2px Georgia";
		ctx.textAlign = "center";
		ctx.fillText(this.name, x, -(y - 2 * radius));
		ctx.globalAlpha = 1;
		ctx.restore();
	}
	
	restart_position() {
		this.position[0] = this.start_position[0];
		this.position[1] = this.start_position[1];
	}
}