class Builder {
	create_player(client_id, start_position, display_name, keyboard) {
		let player = new Player({
			name: display_name,
			client_id: client_id,
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
		let planes_pos   = [[25,0], [-25,-0], [0,-15], [0, 15]];
		let planes_angle = [Math.PI/2, 3*Math.PI/2, 0, Math.PI];
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

}