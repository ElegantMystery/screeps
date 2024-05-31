const { SPAWN_NAME } = require('./constant');

var roleHarvester = {

    run: function(creep) {

        if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0]);
            }
        }
        else {
            if(creep.transfer(Game.spawns[SPAWN_NAME], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns[SPAWN_NAME]);
            }
        }
    }
};

module.exports = roleHarvester;