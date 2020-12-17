class Game {
	constructor(canvas_id, display_name) {
		this.canvas = document.getElementById(canvas_id);
		this.ctx = this.canvas.getContext("2d");
		this.w = this.canvas.width;
		this.h = this.canvas.height;
		this.zoom = 10;
		this.last_time = 0;
		this.display_name = display_name;
		
		this.start_positions = [[-15, 0], [15, 0], [-15, 10], [15, 10], [-15, -10], [15, -10]];
		this.connection = new Connection(this.display_name, this);
		this.builder = new Builder();
		this.ball = null;
		this.objects = [];
		
		this.create_env();
		window.requestAnimationFrame(this.animate.bind(this));
	}
	
	create_env() {
		this.ball = this.builder.create_ball();
		this.objects.push(this.ball);
		
		let planes_arr = this.builder.create_planes();
		for(let plane of planes_arr)
			this.objects.push(plane);
	}
	
	create_self_player(client_id, start_index, display_name, connection) {
		return this.create_player(client_id, start_index, display_name, new PlayerKeyboard(connection));
	}
	
	create_remote_player(client_id, start_index, display_name) {
		return this.create_player(client_id, start_index, display_name, new RemoteKeyboard());
	}
	
	create_player(client_id, start_index, display_name, keyboard) {
		let start_position = this.start_positions[start_index];
		let player = this.builder.create_player(client_id, start_position, display_name, keyboard);
		this.objects.push(player);
		
		return player;
	}
	
	animate(time) {
		window.requestAnimationFrame(this.animate.bind(this));
		//this.update();
		this.render();
	}
	
	update(delta_time) {
		for(let i = 0; i < this.objects.length; i++)
			this.objects[i].update(delta_time);
	}
	
	render() {
		this.ctx.clearRect(0, 0, this.w, this.h);
		this.ctx.lineWidth = 0.25;

		this.ctx.save();
		this.ctx.translate(this.w/2, this.h/2);
		this.ctx.scale(this.zoom, -this.zoom);

		for(let i = 0; i < this.objects.length; i++)
			this.objects[i].render(this.ctx);

		this.ctx.restore();
	}
	
	remove_object(object) {
		this.objects = this.objects.filter((e) => { return e !== object });
	}
	
	restart_field(connected_objects) {
		this.ball.set_position([0, 0]);
		let index = 0;
		for(let object of connected_objects) {
			object.set_position(this.start_positions[index]);
			index++;
		}
	}
}
	
	
	
