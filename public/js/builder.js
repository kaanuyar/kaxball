class Builder {
	constructor() {
		this.player_start_positions = [[-15, 0], [15, 0], [-15, 10], [15, 10], [-15, -10], [15, -10]];
	}
	
	create_player(client_id, start_index, display_name, team_color) {
		let start_position = this.player_start_positions[start_index];
		
		let player = new Player({
			name: display_name,
			client_id: client_id,
			team_color: team_color,
			start_position: start_position,
			radius: 2.5,
			collision_group: CollisionGroup.PLAYER
		});
		
		return player;
	}
	
	create_ball() {
		let ball = new Ball({
			start_position: [0.0, 0.0],
			radius: 2.0,
			collision_group: CollisionGroup.BALL
		});
		return ball;
	}
	
	// not used right now
	create_planes() {
		let planes_pos   = [[0,-15], [0, 15]];
		let planes_angle = [0, Math.PI];
		let planes_arr  = [];
		for(let i = 0; i < planes_pos.length; i++) {
			let plane = new Plane({
				start_position: planes_pos[i],
				angle: planes_angle[i],
				collision_group: CollisionGroup.PLANE
			});
			planes_arr.push(plane);
		}
		
		return planes_arr;
	}
	
	create_boxes() {
		let boxes_pos = [[30, 0], [-30, 0], [28, 10], [28, -10], [-28, 10], [-28, -10], [0, 18], [0, -18]];
		let boxes_width = [2, 2, 6, 6, 6, 6, 62, 62];
		let boxes_height = [10, 10, 10, 10, 10, 10, 6, 6];
		let boxes_arr = [];
		
		for(let i = 0; i < boxes_pos.length; i++) {
			let box = new Box({
				start_position: boxes_pos[i],
				angle: 0,
				width: boxes_width[i],
				height: boxes_height[i],
				collision_group: CollisionGroup.BOX
			});
			boxes_arr.push(box);
		}
		
		return boxes_arr;
	}
	
	create_scoreboard() {
		let scoreboard = new Scoreboard({
			position: [0, 18],
			collision_group: CollisionGroup.NONE
		});
		
		return scoreboard;
	}
}