class Box {
	constructor(props) {
		this.position = props.start_position.slice();
		this.angle = props.angle;
		this.width = props.width;
		this.height = props.height;
		this.collision_group = props.collision_group;
	}
	
	update(delta_time) {
		
	}
	
	render(ctx) {
        var x = this.position[0];
        let y = this.position[1];
		
        ctx.save();
		ctx.beginPath();
        ctx.translate(x, y);
        ctx.rotate(this.angle);
        //ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);
		ctx.rect(-this.width/2, -this.height/2, this.width, this.height);
		ctx.stroke();
        ctx.restore();
	}
}