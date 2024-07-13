const { SPAWN_NAME } = require('constant');
const {collectDroppedEnergy} = require("creep.functions");

var upgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.upgrading = false;
        }
        if(!creep.memory.upgrading && creep.store.getFreeCapacity() === 0) {
            creep.memory.upgrading = true;
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter : (structure) => {
                    return (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) &&
                        structure.store[RESOURCE_ENERGY] > 0;
                }
            });

            targets.sort((a,b) => a.pos.getRangeTo(creep.room.controller) - b.pos.getRangeTo(creep.room.controller));

            if(targets.length > 0) {
                if(creep.withdraw(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }else {
                collectDroppedEnergy(creep);
            }
        }
    }
};

module.exports = upgrader;
