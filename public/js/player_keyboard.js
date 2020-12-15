class PlayerKeyboard {
	constructor(connection) {
		this.connection = connection;
		this.buttons = {};
		this.init_buttons();
		
		document.onkeydown = (event) => this.onkeydown(event);
		document.onkeyup   = (event) => this.onkeyup(event);
	}
	
	init_buttons() {
		this.buttons.space  = 0;
		this.buttons.up 	= 0;
		this.buttons.down 	= 0;
		this.buttons.right 	= 0;
		this.buttons.left 	= 0;
	}
	
	onkeydown(event) {
		if(event.repeat)
			return;
		
		this.connection.send_keydown(event.keyCode);
		//this.keycode_to_button(event.keyCode, 1);
	}
	
	onkeyup(event) {
		if(event.repeat)
			return;
		
		this.connection.send_keyup(event.keyCode);
		//this.keycode_to_button(event.keyCode, 0);
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