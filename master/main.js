const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder')
const roleCarrier = require('role.carrier');
const roleRepairman = require('role.repairman')
const roleRescuer = require('role.rescuer')

const runTower = require('tower')

const { SPAWN_NAME } = require('./constant');

module.exports.loop = function () {
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    const carriers = _.filter(Game.creeps, (creep) => creep.memory.role === 'carrier');
    const repairmen = _.filter(Game.creeps, (creep) => creep.memory.role === 'repairman');
    const rescuers = _.filter(Game.creeps, (creep) => creep.memory.role === 'rescuer');

    for(var nameInMemory in Memory.creeps) {
        if(!Game.creeps[nameInMemory]) {
            delete Memory.creeps[nameInMemory];
        }
    }
    if((harvesters.length < 1 || carriers < 1) && rescuers < 1) {
        const newName = 'Rescuer' + Game.time;
        //console.log('Spawning new carrier: ' + newName);
        Game.spawns[SPAWN_NAME].spawnCreep([CARRY,WORK,MOVE], newName,
            {memory: {role: 'rescuer'}});
    }

    if(harvesters.length < 2) {
        const newName = 'Harvester' + Game.time;
        const sources = Game.spawns[SPAWN_NAME].room.find(FIND_SOURCES);
        if(checkHarvesterBySourceId(SPAWN_NAME, sources[0].id)) {
            Game.spawns[SPAWN_NAME].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE], newName,
                {memory: {role: 'harvester', sourceId: sources[1].id}});
        }else {
            Game.spawns[SPAWN_NAME].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE], newName,
                {memory: {role: 'harvester', sourceId: sources[0].id}});
        }
    }

    if(carriers.length < 2) {
        const newName = 'Carrier' + Game.time;
        //console.log('Spawning new carrier: ' + newName);
        Game.spawns[SPAWN_NAME].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName,
            {memory: {role: 'carrier'}});
    }

    if(upgraders.length < 2) {
        const newName = 'Upgrader' + Game.time;
        //console.log('Spawning new upgrader: ' + newName);
        Game.spawns[SPAWN_NAME].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName,
            {memory: {role: 'upgrader'}});
    }

    if(builders.length < 1) {
        const newName = 'Builder' + Game.time;
        //console.log('Spawning new builder: ' + newName);
        Game.spawns[SPAWN_NAME].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE], newName,
            {memory: {role: 'builder'}});
    }


    if(repairmen.length < 1) {
        const newName = 'Repairman' + Game.time;
        //console.log('Spawning new repairman: ' + newName);
        Game.spawns[SPAWN_NAME].spawnCreep([CARRY,CARRY,WORK,WORK, MOVE], newName,
            {memory: {role: 'repairman'}});
    }

    for(let name in Game.creeps) {
        const creep = Game.creeps[name];
        if(creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role === 'carrier') {
            roleCarrier.run(creep);
        }
        if(creep.memory.role === 'repairman') {
            roleRepairman.run(creep);
        }
        if(creep.memory.role === 'rescuer') {
            roleRescuer.run(creep);
        }
    }

    const towers = Game.spawns[SPAWN_NAME].room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType === STRUCTURE_TOWER &&
                   structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
        }
    });

    for(let tower of towers) {
        runTower(tower);
    }
}

function checkHarvesterBySourceId(spawnName, sourceId) {
    const creeps = Game.spawns[spawnName].room.find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return creep.memory.role === 'harvester' && creep.memory.sourceId === sourceId;
        }
    });

    return creeps.length > 0;
}