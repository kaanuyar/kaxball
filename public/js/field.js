class Field {
	constructor() {
		this.ball = null;
		this.scoreboard = null;
		this.builder = null;
		this.objects = [];
		
		this.create_env();
	}
	
	create_env() {	
		this.builder = new Builder();
	
		this.scoreboard = this.builder.create_scoreboard();
		this.objects.push(this.scoreboard);
		
		let boxes_arr = this.builder.create_boxes();
		for(let box of boxes_arr)
			this.objects.push(box);
		
		this.ball = this.builder.create_ball();
		this.objects.push(this.ball);
	}
	
	create_player(client_id, display_name) {
		let start_index = Object.keys(this.create_player_map()).length;
		let team_color = start_index % 2 == 0 ? "red" : "blue";
		
		let player = this.builder.create_player(client_id, start_index, display_name, team_color);
		this.objects.push(player);
	}
	
	restart_field() {
		let player_map = this.create_player_map();
		let start_positions = this.builder.player_start_positions;
		this.ball.set_position([0, 0]);
		let index = 0;
		for(let client_id of Object.keys(player_map)) {
			let team_color = index % 2 == 0 ? "red" : "blue";
			player_map[client_id].set_position(start_positions[index]);
			player_map[client_id].set_team_color(team_color);
			index++;
		}
	}
	
	// acayip kotu lag var, alternatif method dene pls
	set_position_buffers(ball_position, player_positions) {
		let player_map = this.create_player_map();
		let timestamp = window.performance.now();
		
		this.ball.position_buffer.push([timestamp, ball_position[0], ball_position[1]]);
		for(let client_id of Object.keys(player_positions)) {
			let position = player_positions[client_id];
			player_map[client_id].position_buffer.push([timestamp, position[0], position[1]]);
		}
	}
	
	create_player_map() {
		let player_map = {};
		for(let object of this.objects) {
			if(object.collision_group == CollisionGroup.PLAYER)
				player_map[object.client_id] = object;
		}
		
		return player_map;
	}
	
	get_player_by_client_id(client_id) {
		for(let object of this.objects) {
			if(object.collision_group == CollisionGroup.PLAYER && object.client_id == client_id)
				return object;
		}
	}
	
	remove_object(object) {
		this.objects = this.objects.filter((e) => { return e !== object });
	}
	
	remove_client_id(client_id) {
		let object = this.get_player_by_client_id(client_id);
		this.objects = this.objects.filter((e) => { return e !== object });
	}
}