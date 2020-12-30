class Scoreboard {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		
		this.red_score = 0;
		this.blue_score = 0;
	}
	
	update(delta_time) {
		
	}
	
	render(ctx) {
		let scoreboard_text = "red: " + this.red_score + " blue: " + this.blue_score;
		
		ctx.save();
		ctx.scale(1, -1);
		ctx.globalAlpha = 0.5;
		ctx.font = "2px Georgia";
		ctx.textAlign = "center";
		ctx.fillText(scoreboard_text, this.x, -this.y);
		ctx.restore();
	} 
	
	restart_board() {
		this.red_score = 0;
		this.blue_score = 0;
	}
	
	increment_score(team) {
		if(team < 0)
			this.blue_score += 1;
		else if(team > 0)
			this.red_score += 1;
	}
}