class Connection {
	constructor(display_name) {
		this.socket = null;
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
		payload.timestamp = window.performance.now();
		this.pending_messages.push(payload);
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
}