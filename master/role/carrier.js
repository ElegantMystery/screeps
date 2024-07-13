const { storeEnergy, collectDroppedEnergy, getDroppedEnergy, collectEnergyFromStorage, getEnergyFromStorageLink, collectEnergyFromStorageLink,
    collectDroppedMineral,
    storeMineral,} = require('creep.functions');
const {getDroppedMineral} = require("room.functions");

const carrier = {
    run: function (creep) {
        if (!creep.memory.collecting && creep.store.getUsedCapacity() === 0) {
            creep.memory.collecting = true;
        }
        if (creep.memory.collecting && creep.store.getFreeCapacity() === 0) {
            creep.memory.collecting = false;
        }
        if (creep.memory.collecting) {
            if( !collectEnergyFromStorageLink(creep) &&
                !collectDroppedMineral(creep) &&
                !collectDroppedEnergy(creep)) {
                collectEnergyFromStorage(creep);
            }
        } else {
            for(const resourceType in creep.store) {
                if(resourceType !== RESOURCE_ENERGY) {
                    const amount = creep.store[resourceType];
                    if(amount > 0) {
                        storeMineral(creep);
                        break;
                    }
                }else {
                    storeEnergy(creep);
                    break;
                }
            }
        }
    }
};

module.exports = carrier;