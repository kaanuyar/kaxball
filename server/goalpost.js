class Goalpost {
	constructor(props) {
		this.box = props.box;
		this.body = this.box.body;
		this.shape = this.box.shape;
		
		// 0 for no goal, -1 for red team, 1 for blue team
		// make a enum later on, dont bother now
		this.goal = 0;
		
		props.world.register_begin_contact(this.begin_contact_callback.bind(this), this);
		props.world.register_end_contact(this.end_contact_callback.bind(this), this);
	}
	
	update(delta_time) {
		this.box.update(delta_time);
	}
	
	begin_contact_callback(evt) {
		if(this.body.interpolatedPosition[0] < 0)
			this.goal = -1;
		else if(this.body.interpolatedPosition[0] > 0)
			this.goal = 1;
	}
	
	end_contact_callback(evt) {
		this.goal = 0;
	}
	
	goal_occurred() {
		let goal = this.goal;
		this.goal = 0;
		
		return goal;
	}
	
}

module.exports = Goalpost;