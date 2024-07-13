const { STORAGE_LINK } = require('constant');

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
    }else {
        collectDroppedEnergy(creep);
    }
}

function collectEnergyFromStorageLink(creep) {
    const link = Game.getObjectById(STORAGE_LINK);
    if(link.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && creep.withdraw(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(link, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
    return link.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
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
    let result = false;
    const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (resource) => resource.resourceType === RESOURCE_ENERGY
    });

    if(droppedEnergy.length > 0) {
        droppedEnergy.sort((a, b) => b.energy - a.energy);
        const closestEnergy = droppedEnergy[0];
        if(closestEnergy.amount > creep.store.getFreeCapacity() / 2) {
            result = true;
            if (creep.pickup(closestEnergy) === ERR_NOT_IN_RANGE) {
                creep.moveTo(closestEnergy, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
    return result;
}


function collectDroppedMineral(creep) {
    let result = false;
    const droppedMinerals = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: (resource) => resource.resourceType !== RESOURCE_ENERGY
    });
    if(droppedMinerals.length > 0) {
        result = true;
        if (creep.pickup(droppedMinerals[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(droppedMinerals[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
    return result;
}

function collectCommodityFromFactory(creep, commodityType) {
    const factory = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_FACTORY
    });

    if(creep.withdraw(factory[0], commodityType) === ERR_NOT_IN_RANGE) {
        creep.moveTo(factory[0], {visualizePathStyle: {stroke: '#ffaa00'}});
    }
}

function storeCommodityToTerminal(creep, commodityType) {
    const terminal = creep.room.terminal;
    if (creep.transfer(terminal, commodityType) === ERR_NOT_IN_RANGE) {
        creep.moveTo(terminal , {visualizePathStyle: {stroke: '#143ab7'}});
    }
}

function storeEnergy(creep) {
    const targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_SPAWN ||
                    structure.structureType === STRUCTURE_CONTAINER ||
                    structure.structureType === STRUCTURE_EXTENSION ||
                    structure.structureType === STRUCTURE_STORAGE ||
                    (structure.structureType === STRUCTURE_TERMINAL  && structure.store.getUsedCapacity(RESOURCE_ENERGY) < 1000) ||
                    structure === Game.getObjectById('666769b480326ac5879d580a')||
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
                [STRUCTURE_TERMINAL]: 3,
                [STRUCTURE_CONTAINER]: 4,
                [STRUCTURE_STORAGE]: 4
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
            creep.moveTo(target, {visualizePathStyle: {stroke: '#143ab7'}, reusePath: 50});
        }
    }
}

function storeMineral(creep) {
    const target = creep.room.storage;
    if (creep.transfer(target, _.findKey(creep.store)) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#1dc52b'}});
    }
}


function borderPosition(creep) {
    return creep.pos.x === 0 || creep.pos.y === 0 || creep.pos.x === 49 || creep.pos.y === 49;
}

function storeLink(creep, id) {
    const link = Game.getObjectById(id);
    if (creep.transfer(link, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(link, {visualizePathStyle: {stroke: '#143ab7'}});
    }
}


module.exports = {
    collectEnergyFromStorage,
    buildStructure,
    storeEnergy,
    collectDroppedEnergy,
    collectEnergyFromStorageLink,
    storeMineral,
    borderPosition,
    collectDroppedMineral,
    storeLink,
    collectCommodityFromFactory,
    storeCommodityToTerminal
};