const { storeEnergy, collectEnergyFromStorage } = require('./creep.functions')

const roleRescuer = {
    run: function(creep) {
        if (!creep.memory.collecting && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.collecting = true;
        }
        if (creep.memory.collecting && creep.store.getFreeCapacity() === 0) {
            creep.memory.collecting = false;
        }
        if (creep.memory.collecting) {
            collectEnergyFromStorage(creep);
        }else {
            storeEnergy(creep);
        }
    }
};

module.exports = roleRescuer