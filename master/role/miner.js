const { MAIN_ROOM_NAME } = require('constant')
const { storeMineral,  collectDroppedMineral, collectCommodityFromFactory, storeCommodityToTerminal } = require('creep.functions')
const { getDroppedMineral, getCommodityInFactory } = require('room.functions')

const miner = {
    run: function(creep) {
        // Find the mineral source in the room
        if (!creep.memory.mineralId) {
            const mineral = creep.room.find(FIND_MINERALS)[0];
            creep.memory.mineralId = mineral.id;
        }
        const mineral = Game.getObjectById(creep.memory.mineralId);
        if (!creep.memory.collecting && creep.store[RESOURCE_LEMERGIUM] === 0) {
            creep.memory.collecting = true;
        }
        if ((creep.memory.collecting && creep.store.getFreeCapacity() === 0) || (mineral && mineral.mineralAmount === 0)) {
            creep.memory.collecting = false;
        }
        if(mineral.mineralAmount > 0) {
            if(creep.memory.collecting) {
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
                storeMineral(creep);
            }
        }else {
            if(creep.store[RESOURCE_LEMERGIUM] > 0) {
                storeMineral(creep);
            }else {
                if(getCommodityInFactory(MAIN_ROOM_NAME)) {
                    if(creep.store.getFreeCapacity(RESOURCE_LEMERGIUM_BAR) > 0) {
                        collectCommodityFromFactory(creep, RESOURCE_LEMERGIUM_BAR);
                    }else {
                        storeCommodityToTerminal(creep, RESOURCE_LEMERGIUM_BAR);
                    }
                }
            }
        }

    }
};

module.exports = miner;
