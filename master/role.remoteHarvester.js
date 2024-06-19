const { storeEnergy, borderPosition } = require("creep.functions")
const { SPAWN_NAME, EAST_NEIGHBOR_LINK } = require('./constant');
const {storeLink} = require("./creep.functions");

const roleRemoteHarvester = {
    run: function (creep) {
        const source = Game.getObjectById(creep.memory.sourceId);

        if (!creep.memory.collecting && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.collecting = true;
        }
        if (creep.memory.collecting && creep.store.getFreeCapacity() === 0) {
            creep.memory.collecting = false;
        }

        if (creep.memory.collecting) {
            if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }else {
            const targetRoom = Game.spawns[SPAWN_NAME].room;

            if(creep.room.name !== targetRoom.name) {
                const exitDir = Game.map.findExit(creep.room, targetRoom);
                const exit = creep.pos.findClosestByRange(exitDir);
                creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffaa00'}, reusePath: 10});
            }else if(creep.room.name === targetRoom.name && borderPosition(creep)) {
                creep.moveTo(25,25);
            }else {
                storeLink(creep, EAST_NEIGHBOR_LINK);
            }
        }
    }
};

module.exports = roleRemoteHarvester