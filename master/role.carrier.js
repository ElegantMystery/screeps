const { storeEnergy, collectDroppedEnergy, getDroppedEnergy, collectEnergyFromStorage, getEnergyFromStorageLink, collectEnergyFromStorageLink,} = require('./creep.functions');

const roleCarrier = {
    run: function (creep) {
        if (!creep.memory.collecting && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.collecting = true;
        }
        if (creep.memory.collecting && creep.store.getFreeCapacity() === 0) {
            creep.memory.collecting = false;
        }
        if (creep.memory.collecting) {
            if(getEnergyFromStorageLink(creep)) {
                collectEnergyFromStorageLink(creep);
            }else if(getDroppedEnergy(creep)) {
                collectDroppedEnergy(creep);
            }else {
                collectEnergyFromStorage(creep);
            }
        } else {
            storeEnergy(creep);
        }
    }
};

module.exports = roleCarrier;