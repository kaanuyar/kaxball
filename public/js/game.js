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
		this.connection = new Connection(this.display_name);
		this.builder = new Builder();
		this.ball = null;
		this.scoreboard = null;
		this.objects = [];
		
		this.create_env();
		window.requestAnimationFrame(this.animate.bind(this));
	}
	
	create_env() {	
		// change it later, maybe in builder class instead?
		this.scoreboard = new Scoreboard(0, 18);
		this.objects.push(this.scoreboard);
		
		let planes_arr = this.builder.create_planes();
		for(let plane of planes_arr)
			this.objects.push(plane);
		
		let boxes_arr = this.builder.create_boxes();
		for(let box of boxes_arr)
			this.objects.push(box);
		
		this.ball = this.builder.create_ball();
		this.objects.push(this.ball);
	}
	
	create_player(client_id, display_name, keyboard) {
		let start_index    = Object.keys(this.connection.connected_objects).length;
		let start_position = this.start_positions[start_index];
		let team_color = start_index % 2 == 0 ? "red" : "blue";
		
		let player = this.builder.create_player(client_id, start_position, display_name, team_color, keyboard);
		this.objects.push(player);
		
		return player;
	}
	
	process_messages() {
		while(this.connection.pending_messages.length > 0) {
			let game_event = this.connection.pending_messages.shift();
			
			switch(game_event[0]) {
				case GameEvent.CREATE_REMOTE_PLAYER: 
					let remote_player = this.create_remote_player(game_event[1], game_event[2]);
					this.connection.connected_objects[remote_player.client_id] = remote_player;
					break;
				case GameEvent.CREATE_SELF_PLAYER:
					let self_player = this.create_self_player(game_event[1], game_event[2]);
					this.connection.connected_objects[self_player.client_id] = self_player;
					break;
				case GameEvent.REMOVE_CLIENT_ID:
					this.remove_client_id(game_event[1]);
					delete this.connection.connected_objects[game_event[1]];
					break;
				case GameEvent.SET_POSITION:
					this.set_position_buffers(game_event[1], game_event[2]);
					break;
				case GameEvent.RESTART_FIELD:
					this.restart_field();
					this.scoreboard.restart_board();
					break;
				case GameEvent.GOAL:
					this.scoreboard.increment_score(game_event[1]);
					break;
				default: 
					console.log("unknown game event");
					break;
			}
				
		}
	}
	
	animate(time) {
		window.requestAnimationFrame(this.animate.bind(this));
		this.process_messages();
		this.update();
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
	
	/////////////////////////////////////////
	// CLIENT INTERFACE
	/////////////////////////////////////////
	
	create_self_player(client_id, display_name) {
		return this.create_player(client_id, display_name, new PlayerKeyboard(this.connection));
	}
	
	create_remote_player(client_id, display_name) {
		return this.create_player(client_id, display_name, new RemoteKeyboard());
	}
	
	restart_field() {
		let connected_objects = this.connection.connected_objects;
		this.ball.set_position([0, 0]);
		let index = 0;
		for(let client_id of Object.keys(connected_objects)) {
			connected_objects[client_id].set_position(this.start_positions[index]);
			// prototype-yu
			let team_color = index % 2 == 0 ? "red" : "blue";
			connected_objects[client_id].set_team_color(team_color);
			index++;
		}
	}
	
	set_position_buffers(ball_position, player_positions) {
		let connected_objects = this.connection.connected_objects;
		let timestamp = window.performance.now();
		
		this.ball.position_buffer.push([timestamp, ball_position[0], ball_position[1]]);
		for(let client_id of Object.keys(player_positions)) {
			let position = player_positions[client_id];
			connected_objects[client_id].position_buffer.push([timestamp, position[0], position[1]]);
		}
	}
	
	remove_object(object) {
		this.objects = this.objects.filter((e) => { return e !== object });
	}
	
	remove_client_id(client_id) {
		let object = this.connection.connected_objects[client_id];
		this.objects = this.objects.filter((e) => { return e !== object });
	}
}
	
	
	
