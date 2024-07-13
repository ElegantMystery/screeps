const claimer = {

    run: function(creep, targetRoomName) {
        if (!creep.memory.claiming && creep.room.controller && !creep.room.controller.my) {
            if (creep.claimController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            // Move to target room if not yet there
            if (creep.room.name !== targetRoomName) {
                const exitDir = Game.map.findExit(creep.room, targetRoomName);
                const exit = creep.pos.findClosestByRange(exitDir);
                creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = claimer;