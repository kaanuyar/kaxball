const NetworkEvent = {
	PING         : 1,
	PONG         : 2,
	ADD_ALL      : 3,
	ADD_PLAYER   : 4,
	REMOVE_PLAYER: 5,
	KEYDOWN      : 6,
	KEYUP        : 7,
	SET_POSITION : 8
};

class Connection {
	constructor(display_name, game) {
		this.game = game;
		this.socket = null;
		
		this.connected_objects = {};
		this.client_id = null;
		this.ping_interval = 30000;
		
		this.init(display_name);
	}
	
	init(display_name) {
		let websocket_protocol = (window.location.protocol == "http:") ? "ws://" : "wss://";
		this.socket = new WebSocket(websocket_protocol + "kaxball.gigalixirapp.com/ws/?display_name=" + display_name);
		
		setTimeout(this.send_ping.bind(this), this.ping_interval);
		this.socket.addEventListener("message", this.socket_on_message.bind(this));
	}
	
	socket_on_message(message) {
		let payload = JSON.parse(message.data);
		switch(payload.event) {
			case NetworkEvent.PONG:
				console.log("pong received");
				break;
			case NetworkEvent.ADD_ALL:
				this.client_id = payload.self_id;
				this.add_all(payload);
				break;
			case NetworkEvent.ADD_PLAYER:
				this.add_player(payload);
				break;
			case NetworkEvent.REMOVE_PLAYER:		
				this.remove_player(payload);
				break;
			case NetworkEvent.SET_POSITION:
				this.set_position(payload);
				break;
			default:
				console.log("unknown event", payload);
				break;
		}
	}
	
	send_keydown(keycode) {
		if(this.socket.readyState != WebSocket.CLOSED) {
			let keydown_object = {
				event: NetworkEvent.KEYDOWN, 
				keycode: keycode, 
				client_id: this.client_id
			};
			let keydown_message = JSON.stringify(keydown_object);
			this.socket.send(keydown_message);
		}
	}
	
	send_keyup(keycode) {
		if(this.socket.readyState != WebSocket.CLOSED) {
			let keyup_object = {
				event: NetworkEvent.KEYUP, 
				keycode: keycode, 
				client_id: this.client_id
			};
			let keyup_message = JSON.stringify(keyup_object);
			this.socket.send(keyup_message);
		}
	}
	
	send_ping() {
		if(this.socket.readyState != WebSocket.CLOSED) {
			let ping_message = JSON.stringify({event: NetworkEvent.PING});
			this.socket.send(ping_message);
			setTimeout(this.send_ping.bind(this), this.ping_interval);
		}
	}
	
	set_position(payload) {
		let ball_position = [payload.ball.x, payload.ball.y];
		let player_positions = {};
		for(let i = 0; i < payload.players.length; i++)
			player_positions[payload.players[i].client_id] = [payload.players[i].x, payload.players[i].y];
		
		//this.game.set_field_positions(this.connected_objects, ball_position, player_positions);
		this.game.set_position_buffers(this.connected_objects, ball_position, player_positions);
	}
	
	add_all(payload) {
		let players = payload.players;
		players.sort((a, b) => a.client_id - b.client_id);
		
		for(let i = 0; i < players.length; i++) {
			let start_index = Object.keys(this.connected_objects).length;
			let player = null;
			if(this.client_id == players[i].client_id)
				player = this.game.create_self_player(this.client_id, start_index, players[i].display_name, this);
			else
				player = this.game.create_remote_player(players[i].client_id, start_index, players[i].display_name);
			
			this.connected_objects[players[i].client_id] = player;
		}
	}
	
	add_player(payload) {
		let start_index = Object.keys(this.connected_objects).length;
		let player = this.game.create_remote_player(payload.client_id, start_index, payload.display_name);
		this.connected_objects[payload.client_id] = player;
		
		this.game.restart_field(this.connected_objects);
	}
	
	remove_player(payload) {
		this.game.remove_object(this.connected_objects[payload.client_id]);
		delete this.connected_objects[payload.client_id];
		
		this.game.restart_field(this.connected_objects);
	}
}