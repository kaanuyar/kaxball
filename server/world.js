let p2 = require("p2");

class World {
	constructor(props) {
		this.world = new p2.World({gravity: props.gravity});
		this.begin_contact_callbacks = [];
		this.end_contact_callbacks = [];
		
		this.object_by_id = {};
		
		this.init();
	}
	
	init() {
		this.add_event_listener("beginContact", this.begin_contact_callbacks);
		this.add_event_listener("endContact", this.end_contact_callbacks);
	}
	
	add_event_listener(event_name, registered_callbacks) {
		this.world.on(event_name, (evt) => {
			evt.objA = this.object_by_id[evt.bodyA.id] ? this.object_by_id[evt.bodyA.id] : null;
			evt.objB = this.object_by_id[evt.bodyB.id] ? this.object_by_id[evt.bodyB.id] : null;
			
			for(let i = 0; i < registered_callbacks.length; i++) {
				let callback_func = registered_callbacks[i][0];
				let bind_value = registered_callbacks[i][1];
				
				if(evt.bodyA == bind_value.body || evt.bodyB == bind_value.body) {				
					let callback_bind = callback_func.bind(bind_value);
					callback_bind(evt);	
				}
			}
		});
	}
	
	register_begin_contact(callback_func, bind_value) {
		this.begin_contact_callbacks.push([callback_func, bind_value]);
	}
	
	register_end_contact(callback_func, bind_value) {
		this.end_contact_callbacks.push([callback_func, bind_value]);
	}
	
	add_body(object) {
		this.world.addBody(object.body);
		this.object_by_id[object.body.id] = object;
	}
	
	remove_body(object) {
		this.world.removeBody(object.body);
		delete this.object_by_id[object.body.id];
	}
	
	step(timeStep, dt, maxSubSteps) {
		this.world.step(timeStep, dt, maxSubSteps);
	}
	
	add_contact_material(contact_material) {
		this.world.addContactMaterial(contact_material);
	}
	
	set_default_contact_material(contact_material) {
		this.world.defaultContactMaterial = contact_material;
	}
	
	default_material() {
		return this.world.defaultMaterial;
	}
}

module.exports = World;