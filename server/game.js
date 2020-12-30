let Builder = require("./builder.js");
let RemoteKeyboard = require("./remote_keyboard");
let {CollisionGroup, CollisionMask, NetworkEvent, GameEvent} = require("./enums.js");
let {performance} = require("perf_hooks");

class Game {
	constructor(client_manager) {
		this.client_manager = client_manager;
		this.w = 600;
		this.h = 400;
		this.zoom = 10;
		this.last_time = 0;
		this.frame_count = 0;
		
		this.start_positions = [[-15, 0], [15, 0], [-15, 10], [15, 10], [-15, -10], [15, -10]];
		this.builder = new Builder();
		this.world = null;
		this.ball = null;
		this.materials = null;
		this.objects = [];
		
		this.create_env();
		setInterval(this.animate.bind(this), 1000 / 60);
	}
	
	create_env() {
		this.world = this.builder.create_world();
		this.materials = this.builder.create_materials(this.world);
		
		this.ball = this.builder.create_ball(this.materials, this.world);
		this.world.add_body(this.ball);
		this.objects.push(this.ball);
		
		let planes = this.builder.create_planes(this.materials);
		for(let plane of planes) {
			this.world.add_body(plane);
			this.objects.push(plane);
		}
		
		let boundaries = this.builder.create_boundaries(this.materials);
		for(let boundary of boundaries)
			this.world.add_body(boundary);
		
		let boxes = this.builder.create_boxes(this.materials, this.world);
		for(let box of boxes) {
			this.world.add_body(box);
			this.objects.push(box);
		}
	}
	
	create_player(client_id, display_name, keyboard) {
		let start_index    = this.create_player_arr().length;
		let start_position = this.start_positions[start_index];
		let player = this.builder.create_player(this.materials, client_id, start_position, display_name, keyboard);
		this.world.add_body(player);
		this.objects.push(player);
	}
	
	process_messages() {
		for(let client of this.client_manager.get_all_clients())
			this.process_client_messsages(client);
		
		if(this.client_manager.recently_deleted_client != null) {
			this.process_client_messsages(this.client_manager.recently_deleted_client);
			this.client_manager.recently_deleted_client = null;
		}
		
		// maybe change box class all together? inheritance?
		for(let box of this.create_boxes_arr()) {
			let goal_occurred = box.goal_occurred();
			if(goal_occurred) {
				this.restart_field();
				this.client_manager.dispatch_message(this.goal_msg(goal_occurred));
			}
		}
	}
	
	process_client_messsages(client) {		
		while(client.pending_messages.length > 0) {
			let game_event = client.pending_messages.shift();
			
			switch(game_event[0]) {
				case GameEvent.CREATE_REMOTE_PLAYER: 
					this.create_remote_player(game_event[1], game_event[2]);
					break;
				case GameEvent.REMOVE_CLIENT_ID:
					this.remove_client_id(game_event[1]);
					break;
				case GameEvent.KEYDOWN_PRESS:
					this.client_keydown_press(game_event[1], game_event[2]);
					break;
				case GameEvent.KEYUP_PRESS:
					this.client_keyup_press(game_event[1], game_event[2]);
					break;
				case GameEvent.RESTART_FIELD:
					this.restart_field();
					break;
				default: 
					console.log("unknown game event");
					break;
			}
		}
	}
	
	// add when theres no player dont loop over probably clearinterval?
	animate() {		
		let time = performance.now();
		let timeStep = 1/30;
		let maxSubSteps = 5;

		let dt = this.last_time ? (time - this.last_time) / 1000 : 0;
		dt = Math.min(1/10, dt);
		this.last_time = time;
		
		this.process_messages();
		this.update(dt);
		this.world.step(timeStep, dt, maxSubSteps);
		// 15 tick for now
		if(this.frame_count % 4 == 0)
			this.client_manager.dispatch_message(this.position_msg());
		this.frame_count += 1;
	}
	
	update(delta_time) {
		for(let i = 0; i < this.objects.length; i++)
			this.objects[i].update(delta_time);
	}
	
	render() {
		this.ctx.clearRect(0, 0, this.w, this.h);
		this.ctx.lineWidth = 0.25;

		this.ctx.save();
		this.ctx.translate(this.w/2, this.h/2);
		this.ctx.scale(this.zoom, -this.zoom);

		for(let i = 0; i < this.objects.length; i++)
			this.objects[i].render(this.ctx);

		this.ctx.restore();
	}
	
	/////////////////////////////////////////
	// CLIENT INTERFACE
	/////////////////////////////////////////
	
	create_remote_player(client_id, display_name) {
		this.create_player(client_id, display_name, new RemoteKeyboard());
	}
	
	client_keydown_press(client_id, keycode) {
		let player = this.get_player_by_client_id(client_id);
		player.keydown_press(keycode);
	}
	
	client_keyup_press(client_id, keycode) {
		let player = this.get_player_by_client_id(client_id);
		player.keyup_press(keycode);
	}
	
	restart_field() {
		let player_arr = this.create_player_arr();
		this.ball.set_position_velocity([0, 0], [0, 0]);
		
		for(let i = 0; i < player_arr.length; i++) 
			player_arr[i].set_position_velocity(this.start_positions[i], [0, 0]);
	}
	
	remove_object(object) {
		this.objects = this.objects.filter((e) => { return e !== object });
		this.world.remove_body(object);
	}
	
	remove_client_id(client_id) {
		let object = this.get_player_by_client_id(client_id);
		this.remove_object(object);
	}
	
	/////////////////////////////////////////
	// HELPER FUNCTIONS
	/////////////////////////////////////////
	
	create_player_arr() {
		let player_arr = [];
		for(let object of this.objects){
			if(object.shape.collisionGroup == CollisionGroup.PLAYER)
				player_arr.push(object);
		}
		player_arr.sort((a, b) => a.client_id - b.client_id);
		
		return player_arr;
	}
	
	create_boxes_arr() {
		let boxes_arr = [];
		for(let object of this.objects) {
			if(object.shape.collisionGroup == CollisionGroup.BOX)
				boxes_arr.push(object);
		}
		return boxes_arr;
	}
	
	get_player_by_client_id(client_id) {
		for(let object of this.objects) {
			if(object.shape.collisionGroup == CollisionGroup.PLAYER && object.client_id == client_id)
				return object;
		}
	}
	
	position_msg() {
		let players_arr = [];
		for(let object of this.objects) {
			if(object.shape.collisionGroup == CollisionGroup.PLAYER) {
				players_arr.push({
					client_id: object.client_id, 
					x: +object.body.interpolatedPosition[0].toFixed(4), 
					y: +object.body.interpolatedPosition[1].toFixed(4)
				});
			}
		}
		
		let position_msg = {
			event: NetworkEvent.SET_POSITION,
			ball: {
				x: +this.ball.body.interpolatedPosition[0].toFixed(4), 
				y: +this.ball.body.interpolatedPosition[1].toFixed(4)
			}, 
			players: players_arr
		};
		
		return JSON.stringify(position_msg);
	}
	
	goal_msg(team) {
		let goal_msg = {event: NetworkEvent.GOAL, team: team};
		return JSON.stringify(goal_msg);
	}
}

module.exports = Game;
	
	
