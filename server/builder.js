let Ball = require("./ball.js");
let Materials = require("./materials.js");
let Plane = require("./plane.js");
let Player = require("./player.js");
let World = require("./world.js");
let {CollisionGroup, CollisionMask, NetworkEvent} = require("./enums.js");

class Builder {
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
	
	create_player(materials, client_id, start_position, display_name, keyboard) {
		let player = new Player({
			name: display_name,
			keyboard: keyboard,
			client_id: client_id,
			start_position: start_position,
			start_velocity: [0.0, 0.0],
			radius: 2.5,
			mass: 1,
			damping: 0.9,
			material: materials.player_material,
			collision_group: CollisionGroup.PLAYER,
			collision_mask: CollisionMask.PLAYER
		});
		
		return player;
	}
	
	create_ball(materials, world) {
		let ball = new Ball({
			start_position: [0.0, 0.0],
			start_velocity: [0.0, 0.0],
			radius: 2.0,
			mass: 0.5,
			damping: 0.6,
			world: world,
			material: materials.ball_material,
			collision_group: CollisionGroup.BALL,
			collision_mask: CollisionMask.BALL
		});
		
		return ball;
	}
	
	create_planes(materials) {
		let planes_pos   = [[25,0], [-25,-0], [0,-15], [0, 15]];
		let planes_angle = [Math.PI/2, 3*Math.PI/2, 0, Math.PI];
		let planes_arr   = [];
		
		for(let i = 0; i < planes_pos.length; i++) {
			let plane = new Plane({
				start_position: planes_pos[i],
				angle: planes_angle[i],
				material: materials.plane_material,
				collision_group: CollisionGroup.PLANE,
				collision_mask: CollisionMask.PLANE
			});
			planes_arr.push(plane);
		}
		
		return planes_arr;
	}
	
	create_boundaries(materials) {
		let boundariesPos   = [[30,0], [-30,-0], [0,-20], [0, 20]];
		let boundariesAngle = [Math.PI/2, 3*Math.PI/2, 0, Math.PI];
		let boundaries_arr  = [];
		
		for(let i = 0; i < boundariesPos.length; i++) {
			let boundary = new Plane({
				start_position: boundariesPos[i],
				angle: boundariesAngle[i],
				material: materials.boundary_material,
				collision_group: CollisionGroup.BOUNDARY,
				collision_mask: CollisionMask.BOUNDARY
			});
			boundaries_arr.push(boundary);
		}
		
		return boundaries_arr;
	}
}

module.exports = Builder;