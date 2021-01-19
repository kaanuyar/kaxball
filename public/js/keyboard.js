class Keyboard {
	constructor(connection) {
		this.connection = connection;
		this.buttons = {};
		this.init_buttons();
		
		document.onkeydown = (event) => this.onkeydown(event);
		document.onkeyup   = (event) => this.onkeyup(event);
	}
	
	onkeydown(event) {
		if(event.repeat)
			return;
		
		if(this.connection.client_id != null)
			this.connection.send_keydown(event.keyCode);
	}
	
	onkeyup(event) {
		if(event.repeat)
			return;
		
		if(this.connection.client_id != null)
			this.connection.send_keyup(event.keyCode);
	}
	
	// not used right now
	init_buttons() {
		this.buttons.space  = 0;
		this.buttons.up 	= 0;
		this.buttons.down 	= 0;
		this.buttons.right 	= 0;
		this.buttons.left 	= 0;
	}
	
	keycode_to_button(keycode, value) {
		switch(keycode) 
		{
			case 32: this.buttons.space = value; break;
			case 87: this.buttons.up 	= value; break;
			case 83: this.buttons.down 	= value; break;
			case 68: this.buttons.right = value; break;
			case 65: this.buttons.left 	= value; break;
		}
	}
}