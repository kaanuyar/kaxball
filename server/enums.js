const CollisionGroup = {
	PLAYER  : Math.pow(2, 1),
	BALL    : Math.pow(2, 2),
	BOUNDARY: Math.pow(2, 3),
	BOX		: Math.pow(2, 4),
	SENSOR	: Math.pow(2, 5)
};

const CollisionMask = {
	PLAYER  : CollisionGroup.PLAYER | CollisionGroup.BALL | CollisionGroup.BOUNDARY,
	BALL    : CollisionGroup.PLAYER | CollisionGroup.BOX | CollisionGroup.SENSOR,
	BOUNDARY: CollisionGroup.PLAYER,
	BOX		: CollisionGroup.BALL,
	SENSOR	: CollisionGroup.BALL
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

const GoalEvent = {
	NONE		:  0,
	RED_TEAM	: -1,
	BLUE_TEAM	:  1
}

module.exports = {CollisionGroup, CollisionMask, NetworkEvent, GoalEvent};