class Player {
	constructor(props) {
		this.keyboard = props.keyboard;
		this.name = props.name;
		this.client_id = props.client_id;
		
		this.position = props.start_position.slice();
		this.radius = props.radius;
		
		this.position_buffer = [];
		// change this probably
		this.update_tick = 15;
	}
	
	update(delta_time) {
		this.interpolate();
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
	
	interpolate() {
		let now = window.performance.now();
		let render_timestamp = now - (1000.0 / this.update_tick);
		let buffer = this.position_buffer;
		
		while(buffer.length >= 2 && buffer[1][0] <= render_timestamp) {
			buffer.shift();
		}
		
		if(buffer.length >= 2 && buffer[0][0] <= render_timestamp && render_timestamp <= buffer[1][0]) {
			let x0 = buffer[0][1];
			let x1 = buffer[1][1];
			let y0 = buffer[0][2];
			let y1 = buffer[1][2];
			
			let t0 = buffer[0][0];
			let t1 = buffer[1][0];
			
			let delta_x = x0 + (x1 - x0) * (render_timestamp - t0) / (t1 - t0);
			let delta_y = y0 + (y1 - y0) * (render_timestamp - t0) / (t1 - t0);
			
			this.set_position([delta_x, delta_y]);
		}
	}
	
	set_position(position) {
		this.position[0] = position[0];
		this.position[1] = position[1];
	}
}