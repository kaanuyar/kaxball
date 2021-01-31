let p2 = require("p2");
let {CollisionGroup, CollisionMask} = require("./enums.js");

class Plane {
	constructor(props) {
		this.shape = null;
		this.body = null;
		
		this.init(props);
	}
	
	init(props) {
		this.shape = new p2.Plane({
			material: props.material,
			collisionGroup: CollisionGroup.BOUNDARY,
			collisionMask: CollisionMask.BOUNDARY
		});
		this.body = new p2.Body({
			position: props.start_position,
			angle: props.angle,
			type: p2.Body.STATIC
		});
		this.body.addShape(this.shape);
	}
	
	update(delta_time) {
		
	}
}

module.exports = Plane;