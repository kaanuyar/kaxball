class Player {
	constructor(props) {
		this.name = props.name;
		this.client_id = props.client_id;
		this.team_color = props.team_color;
		this.collision_group = props.collision_group;
		
		this.position = props.start_position.slice();
		this.radius = props.radius;
		this.sensor_radius = props.sensor_radius;
		
		this.position_buffer = [];
		this.update_tick = 20;
	}
	
	update(delta_time) {
		this.interpolate();
	}
	
	render(ctx) {
		let x = this.position[0];
		let y = this.position[1];
		let radius = this.radius;
		let sensor_radius = this.sensor_radius;
		
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = 0.30;
		ctx.strokeStyle = this.team_color;
		ctx.arc(x, y, radius, 0, 2 * Math.PI);
		ctx.stroke();
		
		ctx.beginPath();
		ctx.globalAlpha = 0.05;
		ctx.strokeStyle = "black";
		ctx.arc(x, y, sensor_radius, 0, 2 * Math.PI);
		ctx.stroke();
		
		ctx.scale(1, -1);
		ctx.globalAlpha = 0.5;
		ctx.font = "2px Georgia";
		ctx.textAlign = "center";
		ctx.fillText(this.name, x, -(y - 2 * radius));
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
	
	set_team_color(team_color) {
		this.team_color = team_color;
	}
}