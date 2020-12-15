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
	PING         : "ping",
	PONG         : "pong",
	ADD_ALL      : "add_all",
	ADD_PLAYER   : "add_player",
	REMOVE_PLAYER: "remove_player",
	KEYDOWN      : "keydown",
	KEYUP        : "keyup",
	POSITION	 : "position"
};

module.exports = {CollisionGroup, CollisionMask, NetworkEvent};