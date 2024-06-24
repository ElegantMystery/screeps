const { MAIN_ROOM_FACTORY } = require('constant');
const { collectEnergyFromStorage } = require('creep.functions');

const roleFactoryCarrier = {
    run: function(creep, commodityType) {
        const factory = Game.getObjectById(MAIN_ROOM_FACTORY);
        const components = COMMODITIES[commodityType].components;

        // Check if the creep is carrying anything that is not needed
        for (const resourceType in creep.store) {
            if (!components[resourceType] || creep.store[resourceType] > components[resourceType]) {
                // If carrying excess or unwanted resources, drop them off at storage
                if (creep.transfer(creep.room.storage, resourceType) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage, { visualizePathStyle: { stroke: '#ffffff' } });
                    return; // Early return to process one resource at a time
                }
            }
        }

        // Process each required component for the commodity
        for(const resourceType in components) {
            const neededAmount = components[resourceType] - (factory.store[resourceType] || 0);
            if(neededAmount > 0) {
                if (creep.store[resourceType] > 0) {
                    // Transfer it to the factory
                    if (creep.transfer(factory, resourceType) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(factory, { visualizePathStyle: { stroke: '#ffaa00' } });
                    }
                } else {
                    // Pick up the resource from storage or terminal
                    if (creep.withdraw(creep.room.storage, resourceType, neededAmount) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.storage, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                }
                return; // Handle one resource per tick
            }
        }
    }
};

module.exports = roleFactoryCarrier;