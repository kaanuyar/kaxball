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

let RemoteKeyboard = require("./remote_keyboard");

class Client {
	constructor(game, client_manager, socket, display_name) {
		this.game = game;
		this.client_manager = client_manager;
		this.client_id = this.client_manager.add_client(this);
		this.socket = socket;
		this.display_name = display_name;
		
		this.player = null;
		
		this.init();
	}
	
	init() {
		this.socket.on("message", this.socket_on_message.bind(this));
		this.socket.on("close", this.socket_on_close.bind(this));
		
		// add player to game
		this.game_add_player();
		// add_all msg to client
		this.socket.send(this.add_all_msg());
		// dispatch add_player msg to other clients
		this.client_manager.dispatch_message(this.add_player_msg(), this);
	}
	
	socket_on_message(message) {
		let payload = JSON.parse(message);
		
		switch(payload.event) {
			case NetworkEvent.PING:
				let reply = JSON.stringify({event: NetworkEvent.PONG});
				this.socket.send(reply);
				break;
			case NetworkEvent.KEYUP:
				//this.client_manager.dispatch_message(message);
				this.client_manager.clients[payload.client_id].player.keyboard.keycode_to_button(payload.keycode, 0);
				break;
			case NetworkEvent.KEYDOWN:
				//this.client_manager.dispatch_message(message);
				this.client_manager.clients[payload.client_id].player.keyboard.keycode_to_button(payload.keycode, 1);
				break;
			default:
				console.log("unknown event");
				break;
		}	
	}
	
	socket_on_close() {
		console.log("websocket connection closed");
		// remove player from game
		this.game_remove_player();
		// dispatch remove_player msg to other clients
		this.client_manager.dispatch_message(this.remove_player_msg(), this);
		this.client_manager.delete_client(this);
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
		let clients = this.client_manager.get_all_clients();
		this.game.ball.restart_position();
		for(let client of clients) {
			if(client !== this)
				client.player.restart_position();
		}	
		
		let obj_count = clients.length;
		let player = this.game.create_player(this.game.start_positions[obj_count], this.display_name, new RemoteKeyboard());
		this.player = player;
	}
	
	game_remove_player() {
		let clients = this.client_manager.get_all_clients();
		this.game.ball.restart_position();
		for(let client of clients)
			client.player.restart_position();
		
		this.game.remove_object(this.client_manager.clients[this.client_id].player);
	}
}

module.exports = Client;