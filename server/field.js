let Builder = require("./builder.js");
let Keyboard = require("./keyboard");
let {CollisionGroup, NetworkEvent} = require("./enums.js");

class Field {
	constructor() {
		this.world = null;
		this.ball = null;
		this.goalposts = null;
		this.materials = null;
		this.builder = null;
		this.objects = [];
		
		this.create_env();
	}
	
	create_env() {
		this.builder = new Builder();
		
		this.world = this.builder.create_world();
		this.materials = this.builder.create_materials(this.world);
		
		this.ball = this.builder.create_ball(this.materials, this.world);
		this.add_object(this.ball);
		
		this.goalposts = this.builder.create_goalposts(this.materials, this.world);
		for(let goalpost of this.goalposts)
			this.add_object(goalpost);
		
		let boxes = this.builder.create_boxes(this.materials);
		for(let box of boxes)
			this.add_object(box);
		
		let boundaries = this.builder.create_boundaries(this.materials);
		for(let boundary of boundaries)
			this.add_object(boundary);
	}
	
	goal_occurred() {
		for(let goalpost of this.goalposts) {
			let goal_occurred = goalpost.goal_occurred();
			if(goal_occurred) {
				this.restart_field();
				return goal_occurred;
			}
		}
	}
	
	create_player(client_id, display_name) {
		let start_index = this.create_player_arr().length;
		let keyboard = new Keyboard();
		
		let player = this.builder.create_player(this.materials, client_id, start_index, display_name, keyboard);
		this.add_object(player);
	}
	
	restart_field() {
		let player_arr = this.create_player_arr();
		let start_positions = this.builder.player_start_positions;
		this.ball.set_position_velocity([0, 0], [0, 0]);
		
		for(let i = 0; i < player_arr.length; i++) 
			player_arr[i].set_position_velocity(start_positions[i], [0, 0]);
	}
	
	client_keydown_press(client_id, keycode) {
		let player = this.get_player_by_client_id(client_id);
		player.keydown_press(keycode);
	}
	
	client_keyup_press(client_id, keycode) {
		let player = this.get_player_by_client_id(client_id);
		player.keyup_press(keycode);
	}
	
	add_object(object) {
		this.objects.push(object);
		this.world.add_body(object);
	}
	
	remove_object(object) {
		this.objects = this.objects.filter((e) => { return e !== object });
		this.world.remove_body(object);
	}
	
	remove_client_id(client_id) {
		let object = this.get_player_by_client_id(client_id);
		this.remove_object(object);
	}
	
	create_player_arr() {
		let player_arr = [];
		for(let object of this.objects){
			if(object.shape.collisionGroup == CollisionGroup.PLAYER)
				player_arr.push(object);
		}
		player_arr.sort((a, b) => a.client_id - b.client_id);
		
		return player_arr;
	}
	
	get_player_by_client_id(client_id) {
		for(let object of this.objects) {
			if(object.shape.collisionGroup == CollisionGroup.PLAYER && object.client_id == client_id)
				return object;
		}
	}
}

module.exports = Field;