class RemoteKeyboard {
	constructor() {
		this.buttons = {};
		this.init_buttons();
	}
	
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