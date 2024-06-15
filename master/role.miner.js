const { getMineralType } = require('./creep.functions');
const { storeMineral } = require('creep.functions')

const roleMiner = {
    run: function(creep) {
        // Find the mineral source in the room
        if (!creep.memory.mineralId) {
            const mineral = creep.room.find(FIND_MINERALS)[0];
            creep.memory.mineralId = mineral.id;
        }

        if (!creep.memory.collecting && creep.store[RESOURCE_LEMERGIUM] === 0) {
            creep.memory.collecting = true;
        }
        if (creep.memory.collecting && creep.store.getFreeCapacity() === 0) {
            creep.memory.collecting = false;
        }
        if(creep.memory.collecting) {
            const mineral = Game.getObjectById(creep.memory.mineralId);

            // Check if there is an extractor and it's not on cooldown
            const extractor = mineral.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: { structureType: STRUCTURE_EXTRACTOR }
            })[0];
            if (extractor && !extractor.cooldown) {
                // Mine the mineral if the creep is next to it
                if (creep.pos.isNearTo(mineral)) {
                    creep.harvest(mineral);
                } else {
                    // Move to the mineral if not nearby
                    creep.moveTo(mineral, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }else {
            storeMineral(creep, RESOURCE_LEMERGIUM);
        }
    }
};

module.exports = roleMiner;
