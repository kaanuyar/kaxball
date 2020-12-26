const CollisionGroup = {
	PLAYER  : Math.pow(2, 1),
	BALL    : Math.pow(2, 2),
	PLANE   : Math.pow(2, 3),
	BOUNDARY: Math.pow(2, 4),
};

const CollisionMask = {
	PLAYER  : CollisionGroup.PLAYER | CollisionGroup.BALL | CollisionGroup.BOUNDARY,
	BALL    : CollisionGroup.PLAYER | CollisionGroup.PLANE,
	PLANE   : CollisionGroup.BALL,
	BOUNDARY: CollisionGroup.PLAYER
};

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
	SET_POSITION		: 5,
	REMOVE_CLIENT_ID	: 6,
	KEYDOWN_PRESS		: 7,
	KEYUP_PRESS			: 8
};

module.exports = {CollisionGroup, CollisionMask, NetworkEvent, GameEvent};