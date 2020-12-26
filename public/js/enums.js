const NetworkEvent = {
	PING         : 1,
	PONG         : 2,
	ADD_ALL      : 3,
	ADD_PLAYER   : 4,
	REMOVE_PLAYER: 5,
	KEYDOWN      : 6,
	KEYUP        : 7,
	SET_POSITION : 8
};

const GameEvent = {
	CREATE_SELF_PLAYER  : 1,
	CREATE_REMOTE_PLAYER: 2,
	RESTART_FIELD  		: 3,
	REMOVE_OBJECT		: 4,
	SET_POSITION		: 5
};