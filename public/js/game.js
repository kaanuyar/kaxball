class Game {
	constructor(canvas_id, display_name) {
		this.canvas = document.getElementById(canvas_id);
		this.ctx = this.canvas.getContext("2d");
		this.w = this.canvas.width;
		this.h = this.canvas.height;
		this.zoom = 10;
		this.last_time = 0;
		this.display_name = display_name;
		
		this.start_positions = [[-15, 0], [15, 0], [-15, 10], [15, 10]];
		this.ball = null;
		this.connection = null;
		this.objects = [];
		
		this.create_world();
		window.requestAnimationFrame(this.animate.bind(this));
	}
	
	create_world() {
		this.connection = new Connection(this.display_name, this);
		
		this.ball = this.create_ball();
		this.create_planes();
		this.create_boundaries();
		
		// for offline mode
		//this.player = this.create_player(this.start_positions[0], this.display_name, new PlayerKeyboard(this.connection));
	}
	
	create_player(start_position, display_name, keyboard) {
		let player = new Player({
			name: display_name,
			keyboard: keyboard,
			start_position: start_position,
			radius: 2.5
		});
		this.objects.push(player);
		
		return player;
	}
	
	create_ball() {
		let ball = new Ball({
			start_position: [0.0, 0.0],
			radius: 2.0
		});
		this.objects.push(ball);
		
		return ball;
	}
	
	create_planes() {
		let planesPos   = [[25,0], [-25,-0], [0,-15], [0, 15]];
		let planesAngle = [Math.PI/2, 3*Math.PI/2, 0, Math.PI];
		
		for(let i = 0; i < planesPos.length; i++) {
			let plane = new Plane({
				start_position: planesPos[i],
				angle: planesAngle[i]
			});
			this.objects.push(plane);
		}
	}
	
	create_boundaries() {
		let boundariesPos   = [[30,0], [-30,-0], [0,-20], [0, 20]];
		let boundariesAngle = [Math.PI/2, 3*Math.PI/2, 0, Math.PI];
		
		for(let i = 0; i < boundariesPos.length; i++) {
			let boundary = new Plane({
				start_position: boundariesPos[i],
				angle: boundariesAngle[i]
			});
		}
	}
	
	animate(time) {
		window.requestAnimationFrame(this.animate.bind(this));
		//this.update();
		this.render();
	}
	
	update(delta_time) {
		for(let i = 0; i < this.objects.length; i++)
			this.objects[i].update(delta_time);
	}
	
	render() {
		this.ctx.clearRect(0, 0, this.w, this.h);
		this.ctx.lineWidth = 0.25;

		this.ctx.save();
		this.ctx.translate(this.w/2, this.h/2);
		this.ctx.scale(this.zoom, -this.zoom);

		for(let i = 0; i < this.objects.length; i++)
			this.objects[i].render(this.ctx);

		this.ctx.restore();
	}
	
	remove_object(object) {
		this.objects = this.objects.filter((e) => { return e !== object });
	}
}
	
	
	
