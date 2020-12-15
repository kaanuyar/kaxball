let express 	  = require("express");
let http 		  = require("http");
let url 		  = require("url");
let WebSocket 	  = require("ws");
let Client 		  = require("./client.js");
let ClientManager = require("./client_manager.js");
let Game 		  = require("./game.js");

class Server {
	constructor() {
		this.app 			= express();
		this.server 		= http.createServer(this.app);
		this.wss 			= new WebSocket.Server({server: this.server, path: "/ws/"});
		this.client_manager = new ClientManager();
		this.game 			= new Game(this.client_manager);
		
		this.init();
	}
	
	init() {
		this.app.use("/", express.static("public"));
		this.wss.on("connection", this.socket_on_connection.bind(this));

		this.server.listen(80);
	}
	
	socket_on_connection(socket, req) {
		let params = url.parse(req.url, true).query;
		let display_name = params.display_name ? params.display_name : "no_name";
		
		console.log("websocket connection opened");
		let client = new Client(this.game, this.client_manager, socket, display_name);
	}
}

let server = new Server();

// for debug
module.exports = server;