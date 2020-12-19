const NetworkEvent = {
	ADD_PLAYER:    "add_player",
	ADD_ALL:       "add_all",
	REMOVE_PLAYER: "remove_player",
	PING:          "ping",
	PONG:          "pong",
	KEYDOWN:	   "keydown",
	KEYUP:		   "keyup",
	POSITION:      "position"
};

class Client {
	constructor(game, client_manager, socket, display_name) {
		this.game = game;
		this.client_manager = client_manager;
		this.client_id = this.client_manager.add_client(this);
		this.socket = socket;
		this.display_name = display_name;
		
		this.socket_on_connection();
	}
	
	socket_on_connection() {
		console.log("display_name:", this.display_name, "entered");
		this.socket.on("message", this.socket_on_message.bind(this));
		this.socket.on("close", this.socket_on_close.bind(this));
		
		this.game_add_player();
		this.socket.send(this.add_all_msg());
		this.client_manager.dispatch_message(this.add_player_msg(), this);
	}
	
	socket_on_message(message) {
		let payload = JSON.parse(message);
		
		switch(payload.event) {
			case NetworkEvent.PING:
				let reply = JSON.stringify({event: NetworkEvent.PONG});
				this.socket.send(reply);
				break;
			case NetworkEvent.KEYDOWN:
				this.game.get_player_by_client_id(this.client_id).keyboard.keycode_to_button(payload.keycode, 1);
				break;
			case NetworkEvent.KEYUP:
				this.game.get_player_by_client_id(this.client_id).keyboard.keycode_to_button(payload.keycode, 0);
				break;
			default:
				console.log("unknown event");
				break;
		}	
	}
	
	socket_on_close() {
		console.log("display_name:", this.display_name, "left");
		
		this.game_remove_player();
		this.client_manager.delete_client(this);
		this.client_manager.dispatch_message(this.remove_player_msg(), this);
	}
	
	add_all_msg() {
		let clients = this.client_manager.get_all_clients();
		let clients_info = [];
		for(let client of clients)
			clients_info.push({client_id: client.client_id, display_name: client.display_name});
		
		let add_all_msg = {event: NetworkEvent.ADD_ALL, self_id: this.client_id, players: clients_info};
		return JSON.stringify(add_all_msg);
	}
	
	add_player_msg() {
		let add_player_msg = {event: NetworkEvent.ADD_PLAYER, client_id: this.client_id, display_name: this.display_name};
		return JSON.stringify(add_player_msg);
	}
	
	remove_player_msg() {
		let remove_player_msg = {event: NetworkEvent.REMOVE_PLAYER, client_id: this.client_id, display_name: this.display_name};
		return JSON.stringify(remove_player_msg);
	}
	
	game_add_player() {
		this.game.create_remote_player(this.client_id, this.display_name);
		this.game.restart_field();
	}
	
	game_remove_player() {
		this.game.remove_object(this.game.get_player_by_client_id(this.client_id));
		this.game.restart_field();
	}
}

module.exports = Client;