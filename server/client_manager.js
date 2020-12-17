let WebSocket = require("ws");

class ClientManager {
	constructor() {
		this.clients = {};
		this.index = 0;
	}
	
	add_client(client) {
		this.clients[this.index] = client;
		this.index += 1;
		
		return this.index - 1;
	}
	
	delete_client(client) {
		for(let client_id of Object.keys(this.clients)) {
			if(this.clients[client_id] === client)
				delete this.clients[client_id];
		}
	}
	
	dispatch_message(message, client = null) {
		for(let client_id of Object.keys(this.clients)) {
			if (this.clients[client_id] !== client && this.clients[client_id].socket.readyState === WebSocket.OPEN)
				this.clients[client_id].socket.send(message);
		}
	}
	
	get_all_clients() {
		let clients_arr = [];
		for(let client_id of Object.keys(this.clients)) {
			clients_arr.push(this.clients[client_id]);
		}
		return clients_arr;
	}
}

module.exports = ClientManager;