let {performance} = require("perf_hooks");
let Field = require("./field.js");
let FieldManager = require("./field_manager.js");

class GameLoop {
	constructor(client_manager) {
		this.client_manager = client_manager;
		this.field = new Field();
		
		this.update_rate = 1/60;
		this.step_rate = 1/30;
		this.message_rate = 1/30;
		
		this.last_time = 0;
		this.frame_count = 0;
		
		setInterval(this.loop.bind(this), 1000 * this.update_rate);
	}
	
	loop() {		
		if(Object.keys(this.client_manager.clients).length == 0)
			return;
		
		let time = performance.now();
		let timeStep = this.step_rate;
		let maxSubSteps = 5;

		let dt = this.last_time ? (time - this.last_time) / 1000 : 0;
		dt = Math.min(1/10, dt);
		this.last_time = time;
		
		this.process_messages();
		this.update(dt);
		this.field.world.step(timeStep, dt, maxSubSteps);
		
		if(this.frame_count % (this.message_rate * 60) == 0)
			this.client_manager.dispatch_message(FieldManager.create_position_msg(this.field));
		
		this.frame_count += 1;
	}
	
	process_messages() {
		for(let client of this.client_manager.get_all_clients())
			this.process_client_messsages(client);
		
		if(this.client_manager.recently_deleted_client != null) {
			this.process_client_messsages(this.client_manager.recently_deleted_client);
			this.client_manager.recently_deleted_client = null;
		}
		
		// put somewhere else
		let goal_occurred = this.field.goal_occurred();
		if(goal_occurred)
			this.client_manager.dispatch_message(FieldManager.create_goal_msg(goal_occurred));
	}
	
	process_client_messsages(client) {		
		while(client.pending_messages.length > 0) {
			let network_event = client.pending_messages.shift();
			FieldManager.process_network_event(network_event, this.field);
		}
	}
	
	update(delta_time) {
		for(let i = 0; i < this.field.objects.length; i++)
			this.field.objects[i].update(delta_time);
	}
}

module.exports = GameLoop;