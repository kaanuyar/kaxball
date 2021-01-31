let p2 = require("p2");
let {CollisionGroup, CollisionMask, GoalEvent} = require("./enums.js");

class Goalpost {
	constructor(props) {
		this.body = null;
		this.shape = null;
		
		// 0 for no goal, -1 for red team, 1 for blue team
		this.goal = GoalEvent.NONE;
		
		this.init(props);
	}
	
	init(props) {
		this.shape = new p2.Box({
			material: props.material,
			width: props.width,
			height: props.height,
			collisionGroup: CollisionGroup.BOX,
			collisionMask: CollisionMask.BOX
        });
        this.body = new p2.Body({
			position: props.start_position,
			angle: props.angle,
			type: p2.Body.STATIC
        });
		this.body.addShape(this.shape);
		
		props.world.register_begin_contact(this.begin_contact_callback.bind(this), this);
		props.world.register_end_contact(this.end_contact_callback.bind(this), this);
	}
	
	update(delta_time) {
		
	}
	
	begin_contact_callback(evt) {
		if(this.body.interpolatedPosition[0] < 0)
			this.goal = GoalEvent.RED_TEAM;
		else if(this.body.interpolatedPosition[0] > 0)
			this.goal = GoalEvent.BLUE_TEAM;
	}
	
	end_contact_callback(evt) {
		this.goal = GoalEvent.NONE;
	}
	
	goal_occurred() {
		let goal = this.goal;
		this.goal = GoalEvent.NONE;
		
		return goal;
	}
	
}

module.exports = Goalpost;