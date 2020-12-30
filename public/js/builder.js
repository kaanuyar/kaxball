class Builder {
	create_player(client_id, start_position, display_name, team_color, keyboard) {
		let player = new Player({
			name: display_name,
			client_id: client_id,
			team_color: team_color,
			keyboard: keyboard,
			start_position: start_position,
			radius: 2.5
		});
		return player;
	}
	
	create_ball() {
		let ball = new Ball({
			start_position: [0.0, 0.0],
			radius: 2.0
		});
		return ball;
	}
	
	create_planes() {
		//let planes_pos   = [[25,0], [-25,-0], [0,-15], [0, 15]];
		let planes_pos   = [[0,-15], [0, 15]];
		//let planes_angle = [Math.PI/2, 3*Math.PI/2, 0, Math.PI];
		let planes_angle = [0, Math.PI];
		let planes_arr  = [];
		for(let i = 0; i < planes_pos.length; i++) {
			let plane = new Plane({
				start_position: planes_pos[i],
				angle: planes_angle[i]
			});
			planes_arr.push(plane);
		}
		
		return planes_arr;
	}
	
	create_boxes() {
		let boxes_pos = [[30, 0], [-30, 0], [27.5, 10], [27.5, -10], [-27.5, 10], [-27.5, -10]];
		let boxes_width = [2, 2, 5, 5, 5, 5];
		let boxes_arr = [];
		
		for(let i = 0; i < boxes_pos.length; i++) {
			let box = new Box({
				start_position: boxes_pos[i],
				angle: 0,
				width: boxes_width[i],
				height: 10
			});
			boxes_arr.push(box);
		}
		
		return boxes_arr;
	}
}