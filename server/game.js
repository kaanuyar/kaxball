let Ball = require("./ball.js");
let Materials = require("./materials.js");
let Plane = require("./plane.js");
let Player = require("./player.js");
let World = require("./world.js");
let {CollisionGroup, CollisionMask, NetworkEvent} = require("./enums.js");
let {performance} = require("perf_hooks");

class Game {
	constructor(client_manager) {
		this.client_manager = client_manager;
		this.w = 600;
		this.h = 400;
		this.zoom = 10;
		this.last_time = 0;
		
		this.start_positions = [[-15, 0], [15, 0], [-15, 10], [15, 10]];
		this.world = null;
		this.ball = null;
		this.materials = null;
		this.objects = [];
		
		this.create_world();
		setInterval(this.animate.bind(this), 1000 / 60);
	}
	
	create_world() {
		this.world = new World({
			gravity: [0, 0]
		});
		this.materials = new Materials();
		this.materials.load_contact_materials(this.world);
		
		this.ball = this.create_ball();
		this.create_planes();
		this.create_boundaries();
	
	}
	
	create_player(start_position, display_name, keyboard) {
		let player = new Player({
			name: display_name,
			world: this.world,
			keyboard: keyboard,
			start_position: start_position,
			start_velocity: [0.0, 0.0],
			radius: 2.5,
			mass: 1,
			damping: 0.9,
			material: this.materials.player_material,
			collision_group: CollisionGroup.PLAYER,
			collision_mask: CollisionMask.PLAYER
		});
		
		this.world.add_body(player);
		this.objects.push(player);
		
		return player;
	}
	
	create_ball() {
		let ball = new Ball({
			start_position: [0.0, 0.0],
			start_velocity: [0.0, 0.0],
			radius: 2.0,
			mass: 0.5,
			damping: 0.6,
			world: this.world,
			material: this.materials.ball_material,
			collision_group: CollisionGroup.BALL,
			collision_mask: CollisionMask.BALL
		});
		
		this.world.add_body(ball);
		this.objects.push(ball);
		
		return ball;
	}
	
	create_planes() {
		let planesPos   = [[25,0], [-25,-0], [0,-15], [0, 15]];
		let planesAngle = [Math.PI/2, 3*Math.PI/2, 0, Math.PI];
		
		for(let i = 0; i < planesPos.length; i++) {
			let plane = new Plane({
				start_position: planesPos[i],
				angle: planesAngle[i],
				material: this.materials.plane_material,
				collision_group: CollisionGroup.PLANE,
				collision_mask: CollisionMask.PLANE
			});
			this.world.add_body(plane);
			this.objects.push(plane);
		}
	}
	
	create_boundaries() {
		let boundariesPos   = [[30,0], [-30,-0], [0,-20], [0, 20]];
		let boundariesAngle = [Math.PI/2, 3*Math.PI/2, 0, Math.PI];
		
		for(let i = 0; i < boundariesPos.length; i++) {
			let boundary = new Plane({
				start_position: boundariesPos[i],
				angle: boundariesAngle[i],
				material: this.materials.boundary_material,
				collision_group: CollisionGroup.BOUNDARY,
				collision_mask: CollisionMask.BOUNDARY
			});
			this.world.add_body(boundary);
		}
	}
	
	animate() {		
		let time = performance.now();
		let timeStep = 1/30;
		let maxSubSteps = 5;

		let dt = this.last_time ? (time - this.last_time) / 1000 : 0;
		dt = Math.min(1/10, dt);
		this.last_time = time;
		
		this.update(dt);
		this.world.step(timeStep, dt, maxSubSteps);
		// send world positions
		this.client_manager.dispatch_message(this.position_msg());
	}
	
	update(delta_time) {
		for(let i = 0; i < this.objects.length; i++)
			this.objects[i].update(delta_time);
	}
	
	remove_object(object) {
		this.objects = this.objects.filter((e) => { return e !== object });
		this.world.remove_body(object);
	}
	
	position_msg() {
		let players_arr = [];
		for(let object of this.objects) {
			if(object.shape.collisionGroup == CollisionGroup.PLAYER){
				let client_id = this.client_manager.find_client_id_by_player(object);
				players_arr.push({client_id: client_id, x: object.body.interpolatedPosition[0], y: object.body.interpolatedPosition[1]});
			}
		}
		let position_msg = {
			event: NetworkEvent.POSITION,
			ball: {x: this.ball.body.interpolatedPosition[0], y: this.ball.body.interpolatedPosition[1]}, 
			players: players_arr
		};
		
		return JSON.stringify(position_msg);
	}
}

module.exports = Game;
	
	
