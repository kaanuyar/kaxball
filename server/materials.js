let p2 = require("p2");

class Materials {
	constructor() {
		this.player_material   = new p2.Material();
		this.plane_material    = new p2.Material();
		this.ball_material     = new p2.Material();
		this.boundary_material = new p2.Material();
	}
	
	load_contact_materials(world) {
		let world_default_contact = new p2.ContactMaterial(world.default_material(), world.default_material(), {
			restitution: 1,
			stiffness: Number.MAX_VALUE,
			friction: 0
		});
		
		let player_player_contact = new p2.ContactMaterial(this.player_material, this.player_material, {
			restitution: 0.1
		});
		
		let player_ball_contact = new p2.ContactMaterial(this.player_material, this.ball_material, {
			restitution: 0.1
		});
		
		let player_boundary_contact = new p2.ContactMaterial(this.player_material, this.boundary_material, {
			restitution: 0.1
		});
		
		let ball_plane_contact = new p2.ContactMaterial(this.ball_material, this.plane_material, {
			restitution: 0.9,
			//stiffness: 1e3, // for 60 tick
			stiffness: 5e2, // for 30 tick
		});
		
		world.set_default_contact_material(world_default_contact);
		world.add_contact_material(player_player_contact);
		world.add_contact_material(player_ball_contact);
		world.add_contact_material(player_boundary_contact);
		world.add_contact_material(ball_plane_contact);
	}
}

module.exports = Materials;