let {NetworkEvent} = require("./enums.js");

class FieldManager {
	static process_network_event(network_event, field) {
		switch(network_event.event) {
			case NetworkEvent.PONG:
				break;
			case NetworkEvent.ADD_PLAYER: 
				field.create_player(network_event.client_id, network_event.display_name);
				field.restart_field();
				break;
			case NetworkEvent.REMOVE_PLAYER:
				field.remove_client_id(network_event.client_id);
				field.restart_field();
				break;
			case NetworkEvent.KEYDOWN:
				field.client_keydown_press(network_event.client_id, network_event.keycode);
				break;
			case NetworkEvent.KEYUP:
				field.client_keyup_press(network_event.client_id, network_event.keycode);
				break;
			default: 
				console.log("unknown network event");
				break;
		}
	}
	
	static create_position_msg(field) {
		let players_arr = field.create_player_arr();
		let players = [];
		for(let player of players_arr) {
			players.push({
				client_id: player.client_id, 
				x: +player.body.interpolatedPosition[0].toFixed(4), 
				y: +player.body.interpolatedPosition[1].toFixed(4)
			});
		}
		
		let ball = {
			x: +field.ball.body.interpolatedPosition[0].toFixed(4), 
			y: +field.ball.body.interpolatedPosition[1].toFixed(4)
		}
		
		let position_msg = {
			event: NetworkEvent.SET_POSITION,
			ball: ball, 
			players: players
		};
		
		return JSON.stringify(position_msg);
	}
	
	static create_goal_msg(team) {
		let goal_msg = {event: NetworkEvent.GOAL, team: team};
		return JSON.stringify(goal_msg);
	}
}

module.exports = FieldManager;