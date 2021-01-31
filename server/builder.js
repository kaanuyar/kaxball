let Ball = require("./ball.js");
let Materials = require("./materials.js");
let Plane = require("./plane.js");
let Player = require("./player.js");
let World = require("./world.js");
let Box = require("./box.js");
let Goalpost = require("./goalpost.js");

class Builder {
	constructor() {
		this.player_start_positions = [[-15, 0], [15, 0], [-15, 10], [15, 10], [-15, -10], [15, -10]];
	}
	
	create_world() {
		let world = new World({
			gravity: [0, 0]
		});
		return world;
	}
	
	create_materials(world) {
		let materials = new Materials();
		materials.load_contact_materials(world);
		
		return materials;
	}
	
	create_player(materials, client_id, start_index, display_name, keyboard) {
		let start_position = this.player_start_positions[start_index];
		
		let player = new Player({
			name: display_name,
			keyboard: keyboard,
			client_id: client_id,
			start_position: start_position,
			start_velocity: [0.0, 0.0],
			radius: 2,
			sensor_radius: 3,
			mass: 1,
			damping: 0.9,
			material: materials.player_material
		});
		
		return player;
	}
	
	create_ball(materials, world) {
		let ball = new Ball({
			start_position: [0.0, 0.0],
			start_velocity: [0.0, 0.0],
			radius: 1.5,
			mass: 0.5,
			damping: 0.6,
			world: world,
			material: materials.ball_material
		});
		
		return ball;
	}
	
	create_boundaries(materials) {
		let boundariesPos   = [[30,0], [-30,-0], [0,-20], [0, 20]];
		let boundariesAngle = [Math.PI/2, 3*Math.PI/2, 0, Math.PI];
		let boundaries_arr  = [];
		
		for(let i = 0; i < boundariesPos.length; i++) {
			let boundary = new Plane({
				start_position: boundariesPos[i],
				angle: boundariesAngle[i],
				material: materials.boundary_material
			});
			boundaries_arr.push(boundary);
		}
		
		return boundaries_arr;
	}
	
	create_boxes(materials) {
		let boxes_pos = [[28, 10], [28, -10], [-28, 10], [-28, -10], [0, 18], [0, -18]];
		let boxes_width = [6, 6, 6, 6, 62, 62];
		let boxes_height = [10, 10, 10, 10, 6, 6];
		let boxes_arr = [];
		
		for(let i = 0; i < boxes_pos.length; i++) {
			let box = new Box({
				start_position: boxes_pos[i],
				angle: 0,
				width: boxes_width[i],
				height: boxes_height[i],
				material: materials.box_material
			});
			boxes_arr.push(box);
		}
		
		return boxes_arr;
	}
	
	create_goalposts(materials, world) {
		let goalposts_pos = [[30, 0], [-30, 0]];
		let goalposts_arr = [];
		
		for(let i = 0; i < goalposts_pos.length; i++) {
			let goalpost = new Goalpost({
				world: world,
				start_position: goalposts_pos[i],
				width: 2,
				height: 10,
				angle: 0,
				material: materials.box_material
			});
			goalposts_arr.push(goalpost);
		}
		
		return goalposts_arr;
	}
	
}

module.exports = Builder;