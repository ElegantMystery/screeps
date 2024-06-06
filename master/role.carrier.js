const { SPAWN_NAME } = require('./constant');

var roleCarrier = {
    run: function(creep) {
        if(!creep.memory.collecting && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.collecting = true;
        }
        if(creep.memory.collecting && creep.store.getFreeCapacity() == 0) {
            creep.memory.collecting = false;
        }
        if(creep.memory.collecting) {
            var droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
                filter: (resource) => resource.resourceType == RESOURCE_ENERGY
            });

            if(droppedEnergy.length > 0) {
                droppedEnergy.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
                var closestEnergy = droppedEnergy[0];

                if (creep.pickup(closestEnergy) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(closestEnergy, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        } else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN ||
                            structure.structureType == STRUCTURE_CONTAINER ||
                            structure.structureType == STRUCTURE_EXTENSION) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            if (targets.length > 0) {
                // Sort targets by proximity (the closest first)
                targets.sort((a, b) => {
                    const typePriorityA = a.structureType == STRUCTURE_SPAWN ? 0 : 1;
                    const typePriorityB = b.structureType == STRUCTURE_SPAWN ? 0 : 1;

                    if (typePriorityA == typePriorityB) {
                        return creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b);
                    } else {
                        return typePriorityA - typePriorityB;
                    }
                });
                var target = targets[0];

                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleCarrier;