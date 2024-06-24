function runTower(tower) {
    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

    if(closestHostile) {
        tower.attack(closestHostile)
    }else {
        healStructures(tower);
    }
}

function findStructuresInHealRange(tower) {
    const healRange = 50;

    return tower.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return tower.pos.getRangeTo(structure) <= healRange &&
                structure.structureType !== STRUCTURE_WALL &&
                ((structure.structureType === STRUCTURE_RAMPART && structure.hits < structure.hitsMax / 100)
                    || (structure.structureType !== STRUCTURE_RAMPART && structure.hits < structure.hitsMax));
        }
    });
}

function healStructures(tower) {
    if (tower.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
        const structuresToHeal = findStructuresInHealRange(tower);
        if (structuresToHeal.length > 0) {
            structuresToHeal.sort((a, b) => a.hits - b.hits);
            tower.repair(structuresToHeal[0]);
        }
    }
}

module.exports = runTower;
