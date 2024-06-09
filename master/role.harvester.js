var roleHarvester = {

    run: function(creep) {
        const source = Game.getObjectById(creep.memory.sourceId);
        if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
};

module.exports = roleHarvester;