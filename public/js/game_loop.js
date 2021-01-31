class GameLoop {
	constructor(canvas_id, display_name) {
		this.canvas = document.getElementById(canvas_id);
		this.ctx = this.canvas.getContext("2d");
		this.w = this.canvas.width;
		this.h = this.canvas.height;
		this.zoom = 10;
		this.last_time = 0;
		
		this.connection = new Connection(display_name);
		this.field = new Field();
		this.keyboard = new Keyboard(this.connection);
		
		window.requestAnimationFrame(this.loop.bind(this));
	}
	
	loop(time) {
		window.requestAnimationFrame(this.loop.bind(this));
		
		let dt = this.last_time ? (time - this.last_time) / 1000 : 0;
		dt = Math.min(1/10, dt);
		this.last_time = time;
		
		this.process_messages();
		this.update(dt);
		this.render();
	}
	
	process_messages() {
		while(this.connection.pending_messages.length > 0) {
			let network_event = this.connection.pending_messages.shift();
			FieldManager.process_network_event(network_event, this.field, this.connection);
		}
	}
	
	update(delta_time) {
		for(let i = 0; i < this.field.objects.length; i++)
			this.field.objects[i].update(delta_time);
	}
	
	render() {
		this.ctx.clearRect(0, 0, this.w, this.h);
		this.ctx.lineWidth = 0.25;

		this.ctx.save();
		this.ctx.translate(this.w/2, this.h/2);
		this.ctx.scale(this.zoom, -this.zoom);

		for(let i = 0; i < this.field.objects.length; i++)
			this.field.objects[i].render(this.ctx);

		this.ctx.restore();
	}
	
}