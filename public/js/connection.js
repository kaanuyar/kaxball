class Connection {
	constructor(display_name, game) {
		this.game = game;
		this.socket = null;
		
		this.connected_objects = {};
		this.player_id = null;
		this.ping_interval = 30000;
		
		this.init(display_name);
	}
	
	init(display_name) {
		let websocket_protocol = (window.location.protocol == "http:") ? "ws://" : "wss://";
		this.socket = new WebSocket(websocket_protocol + "localhost/ws/?display_name=" + display_name);
		
		setTimeout(this.send_ping.bind(this), this.ping_interval);
		
		this.socket.addEventListener("message", (event) => {
			let json = JSON.parse(event.data);
			
			switch(json.event) {
				case NetworkEvent.PONG:
					console.log("pong received");
					break;
				case NetworkEvent.ADD_PLAYER:
					this.game.ball.restart_position();
					for (let [client_id, object] of Object.entries(this.connected_objects)) 
						object.restart_position();
					
					let obj_count = Object.keys(this.connected_objects).length;
					let player = this.game.create_player(this.game.start_positions[obj_count], json.display_name, new RemoteKeyboard());
					this.connected_objects[json.client_id] = player;
					break;
				case NetworkEvent.REMOVE_PLAYER:
					this.game.ball.restart_position();
					for (let [client_id, object] of Object.entries(this.connected_objects)) 
						object.restart_position();
					
					this.game.remove_object(this.connected_objects[json.client_id]);
					delete this.connected_objects[json.client_id];
					break;
				case NetworkEvent.ADD_ALL:
					this.player_id = json.self_id;
					let players = json.players;
					players.sort((first, second) => { return first.client_id - second.client_id; });
					
					for(let i = 0; i < players.length; i++) {
						let keyboard = (this.player_id == players[i].client_id) ? new PlayerKeyboard(this) : new RemoteKeyboard();
						let player = this.game.create_player(this.game.start_positions[i], players[i].display_name, keyboard);
						this.connected_objects[players[i].client_id] = player;
					}
					break;
				case NetworkEvent.POSITION:
					this.game.ball.position[0] = json.ball.x;
					this.game.ball.position[1] = json.ball.y;
					for(let i = 0; i < json.players.length; i++) {
						this.connected_objects[json.players[i].client_id].position[0] = json.players[i].x;
						this.connected_objects[json.players[i].client_id].position[1] = json.players[i].y;
					}
					break;
				default:
					console.log("unknown event", json);
					break;
			}
		});
	}
	
	send_keydown(keycode) {
		if(this.socket.readyState != WebSocket.CLOSED) {
			let keydown_message = JSON.stringify({event: NetworkEvent.KEYDOWN, keycode: keycode, client_id: this.player_id});
			this.socket.send(keydown_message);
		}
	}
	
	send_keyup(keycode) {
		if(this.socket.readyState != WebSocket.CLOSED) {
			let keyup_message = JSON.stringify({event: NetworkEvent.KEYUP, keycode: keycode, client_id: this.player_id});
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
}