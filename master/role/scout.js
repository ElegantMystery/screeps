const { EAST_NEIGHBOR_ROOM_NAME } = require("constant");

const scout = {
    run: function(creep) {
        const targetRoom = creep.memory.targetRoom; // replace with the room you need to scout
        if (creep.room.name !== targetRoom) {
            const exitDir = Game.map.findExit(creep.room, targetRoom);
            const exit = creep.pos.findClosestByRange(exitDir);
            creep.moveTo(exit);
        } else {
            creep.moveTo(25, 25); // Stay in the room center to maintain visibility
        }
    }
};

module.exports = scout;