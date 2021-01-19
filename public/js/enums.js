const CollisionGroup = {
	PLAYER  : Math.pow(2, 1),
	BALL    : Math.pow(2, 2),
	PLANE   : Math.pow(2, 3),
	BOUNDARY: Math.pow(2, 4),
	BOX		: Math.pow(2, 5),
	NONE	: Math.pow(2, 6)
};

const NetworkEvent = {
	PING         : 1,
	PONG         : 2,
	ADD_ALL      : 3,
	ADD_PLAYER   : 4,
	REMOVE_PLAYER: 5,
	KEYDOWN      : 6,
	KEYUP        : 7,
	SET_POSITION : 8,
	GOAL		 : 9
};