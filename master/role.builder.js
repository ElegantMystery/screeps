const { SPAWN_NAME } = require('./constant');
const { collectEnergyFromStorage, buildStructure } = require('./creep.functions');

const roleBuilder = {
    run: function(creep) {
        if(creep.memory.building && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.building = false;
        }
        if(!creep.memory.building && creep.store.getFreeCapacity() === 0) {
            creep.memory.building = true;
        }
        if (!creep.memory.building) {
            collectEnergyFromStorage(creep);
        } else {
           buildStructure(creep);
        }
    }
};

module.exports = roleBuilder;