function collectEnergyFromStorage(creep) {
    const targets = creep.room.find(FIND_STRUCTURES, {
        filter : (structure) => {
            return (structure.structureType === STRUCTURE_CONTAINER || structure.structureType === STRUCTURE_STORAGE) &&
                structure.store[RESOURCE_ENERGY] > 0;
        }
    });
    targets.sort((a,b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
    if(targets.length > 0) {
        if(creep.withdraw(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
}

function buildStructure(creep) {
    const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if(target) {
        if(creep.build(target) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
}

function collectDroppedEnergy(creep) {
    const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (resource) => resource.resourceType === RESOURCE_ENERGY
    });

    if(droppedEnergy.length > 0) {
        droppedEnergy.sort((a, b) => b.energy - a.energy);
        const closestEnergy = droppedEnergy[0];

        if (creep.pickup(closestEnergy) === ERR_NOT_IN_RANGE) {
            creep.moveTo(closestEnergy, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
}

function getDroppedEnergy(creep) {
    const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (resource) => resource.resourceType === RESOURCE_ENERGY
    });

    if(droppedEnergy.length > 0) {
        droppedEnergy.sort((a, b) => b.energy - a.energy);
    }
    return droppedEnergy[0];
}

function storeEnergy(creep) {
    const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_SPAWN ||
                    structure.structureType === STRUCTURE_CONTAINER ||
                    structure.structureType === STRUCTURE_EXTENSION ||
                    structure.structureType === STRUCTURE_STORAGE ||
                    // Only tower below 70% energy will be refilled
                    (structure.structureType === STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 300)) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });

    if (targets.length > 0) {
        // Sort targets by proximity (the closest first)
        targets.sort((a, b) => {
            const priorityMap = {
                [STRUCTURE_SPAWN]: 1,
                [STRUCTURE_EXTENSION]: 2,
                [STRUCTURE_TOWER]: 3,
                [STRUCTURE_CONTAINER]: 4,
                [STRUCTURE_STORAGE]: 5
            }
            const priorityA = priorityMap[a.structureType];
            const priorityB = priorityMap[b.structureType];

            if (priorityA === priorityB) {
                return creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b);
            } else {
                return priorityA - priorityB;
            }
        });
        const target = targets[0];

        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    }
}


module.exports = {
    collectEnergyFromStorage,
    buildStructure,
    storeEnergy,
    collectDroppedEnergy,
    getDroppedEnergy
};