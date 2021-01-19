let {NetworkEvent} = require("./enums.js");

class Client {
	constructor(client_manager, socket, display_name) {
		this.client_manager = client_manager;
		this.client_id = this.client_manager.add_client(this);
		this.socket = socket;
		this.display_name = display_name;
		this.pending_messages = [];
		
		this.socket_on_connection();
	}
	
	socket_on_connection() {
		console.log(this.display_name, "entered");
		this.socket.on("message", this.socket_on_message.bind(this));
		this.socket.on("close", this.socket_on_close.bind(this));
		
		this.pending_messages.push(JSON.parse(this.add_player_msg()));
		this.socket.send(this.add_all_msg());
		this.client_manager.dispatch_message(this.add_player_msg(), this);
	}
	
	socket_on_message(message) {
		let payload = JSON.parse(message);
		
		if(payload.event == NetworkEvent.PING) {
			let reply = JSON.stringify({event: NetworkEvent.PONG});
			this.socket.send(reply);
			return;
		}
		
		this.pending_messages.push(payload);
	}
	
	socket_on_close() {
		console.log(this.display_name, "left");
		
		this.pending_messages.push(JSON.parse(this.remove_player_msg()));
		this.client_manager.delete_client(this);
		this.client_manager.dispatch_message(this.remove_player_msg(), this);
	}
	
	add_all_msg() {
		let clients = this.client_manager.get_all_clients();
		let clients_info = [];
		for(let client of clients)
			clients_info.push({client_id: client.client_id, display_name: client.display_name});
		
		let add_all_msg = {
			event: NetworkEvent.ADD_ALL, 
			self_id: this.client_id, 
			players: clients_info
		};
		return JSON.stringify(add_all_msg);
	}
	
	add_player_msg() {
		let add_player_msg = {
			event: NetworkEvent.ADD_PLAYER, 
			client_id: this.client_id, 
			display_name: this.display_name
		};
		return JSON.stringify(add_player_msg);
	}
	
	remove_player_msg() {
		let remove_player_msg = {
			event: NetworkEvent.REMOVE_PLAYER, 
			client_id: this.client_id, 
			display_name: this.display_name
		};
		return JSON.stringify(remove_player_msg);
	}
}

module.exports = Client;