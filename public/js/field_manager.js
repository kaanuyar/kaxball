class FieldManager {
	static process_network_event(network_event, field, connection) {
		switch(network_event.event) {
			// put pong event inside of connection
			case NetworkEvent.PONG:
				break;
			case NetworkEvent.ADD_ALL:
				connection.client_id = network_event.self_id;
				FieldManager.field_add_all(network_event, field);
				break;
			case NetworkEvent.ADD_PLAYER:
				FieldManager.field_add_player(network_event, field);
				break;
			case NetworkEvent.REMOVE_PLAYER:		
				FieldManager.field_remove_player(network_event, field);
				break;
			case NetworkEvent.SET_POSITION:
				FieldManager.field_set_position(network_event, field);
				break;
			case NetworkEvent.GOAL:
				field.scoreboard.increment_score(network_event.team);
				break;
			default:
				console.log("unknown network event", network_event);
				break;
		}
	}
	
	static field_set_position(network_event, field) {
		let players = network_event.players;
		let ball_position = [network_event.ball.x, network_event.ball.y];
		let player_positions = {};
		for(let i = 0; i < players.length; i++)
			player_positions[players[i].client_id] = [players[i].x, players[i].y];
		
		field.set_position_buffers(ball_position, player_positions);
	}
	
	static field_add_all(network_event, field) {
		let players = network_event.players;
		players.sort((a, b) => a.client_id - b.client_id);
		
		for(let i = 0; i < players.length; i++)
			field.create_player(players[i].client_id, players[i].display_name);
	}
	
	// ugly, try to find a new way to restart_field 
	static field_add_player(network_event, field) {		
		field.create_player(network_event.client_id, network_event.display_name);
		field.restart_field();
		field.scoreboard.restart_board();
	}
	
	static field_remove_player(network_event, field) {
		field.remove_client_id(network_event.client_id);
		field.restart_field();
		field.scoreboard.restart_board();
	}
}