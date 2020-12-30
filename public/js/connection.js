class Connection {
	constructor(display_name) {
		this.socket = null;
		
		this.connected_objects = {};
		this.pending_messages = [];
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
			case NetworkEvent.GOAL:
				this.pending_messages.push([GameEvent.GOAL, payload.team]);
				break;
			default:
				console.log("unknown network event", payload);
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
		
		this.pending_messages.push([GameEvent.SET_POSITION, ball_position, player_positions]);
	}
	
	add_all(payload) {
		let players = payload.players;
		players.sort((a, b) => a.client_id - b.client_id);
		
		for(let i = 0; i < players.length; i++) {
			if(this.client_id == players[i].client_id)
				this.pending_messages.push([GameEvent.CREATE_SELF_PLAYER, this.client_id, players[i].display_name]);
			else
				this.pending_messages.push([GameEvent.CREATE_REMOTE_PLAYER, players[i].client_id, players[i].display_name]);
		}
	}
	
	add_player(payload) {		
		this.pending_messages.push([GameEvent.CREATE_REMOTE_PLAYER, payload.client_id, payload.display_name]);
		this.pending_messages.push([GameEvent.RESTART_FIELD]);
	}
	
	remove_player(payload) {
		//console.log(this.connected_objects[payload.client_id]);
		//this.pending_messages.push([GameEvent.REMOVE_OBJECT, this.connected_objects[payload.client_id]]);
		this.pending_messages.push([GameEvent.REMOVE_CLIENT_ID, payload.client_id]);
		this.pending_messages.push([GameEvent.RESTART_FIELD]);
	}
}