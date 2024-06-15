const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleCarrier = require('role.carrier');
const roleRepairman = require('role.repairman');
const roleRescuer = require('role.rescuer');
const roleMiner = require('role.miner');

const runTower = require('tower')

const { SPAWN_NAME } = require('./constant');
const { checkHarvesterBySourceId } = require('./creep.functions');
const { createCreepBody } = require('./util');
const {manageLink, getMineralAmount} = require("./room.functions");

module.exports.loop = function () {
    const room = Game.spawns[SPAWN_NAME].room;
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder');
    const carriers = _.filter(Game.creeps, (creep) => creep.memory.role === 'carrier');
    const repairmen = _.filter(Game.creeps, (creep) => creep.memory.role === 'repairman');
    const rescuers = _.filter(Game.creeps, (creep) => creep.memory.role === 'rescuer');
    const miners = _.filter(Game.creeps, (creep) => creep.memory.role === 'miner');

    for(var nameInMemory in Memory.creeps) {
        if(!Game.creeps[nameInMemory]) {
            delete Memory.creeps[nameInMemory];
        }
    }
    if((harvesters.length < 1 || carriers < 1) && rescuers < 1) {
        const newName = 'Rescuer' + Game.time;
        Game.spawns[SPAWN_NAME].spawnCreep(createCreepBody({numWork: 1, numMove: 1, numCarry: 1}), newName,
            {memory: {role: 'rescuer'}});
    }

    if(carriers.length < 2) {
        const newName = 'Carrier' + Game.time;
        Game.spawns[SPAWN_NAME].spawnCreep(createCreepBody({numCarry: 9, numMove: 9}), newName,
            {memory: {role: 'carrier'}});
    }

    if(harvesters.length < 2) {
        const newName = 'Harvester' + Game.time;
        const sources = Game.spawns[SPAWN_NAME].room.find(FIND_SOURCES);
        if(checkHarvesterBySourceId(SPAWN_NAME, sources[0].id)) {
            Game.spawns[SPAWN_NAME].spawnCreep(createCreepBody({numWork: 7, numMove: 2}), newName,
                {memory: {role: 'harvester', sourceId: sources[1].id}});
        }else {
            Game.spawns[SPAWN_NAME].spawnCreep(createCreepBody({numWork: 7, numMove: 2}), newName,
                {memory: {role: 'harvester', sourceId: sources[0].id}});
        }
    }

    if(upgraders.length < 2) {
        const newName = 'Upgrader' + Game.time;
        Game.spawns[SPAWN_NAME].spawnCreep(createCreepBody({numWork: 8, numCarry: 4, numMove: 4}), newName,
            {memory: {role: 'upgrader'}});
    }

    if(builders.length < 0) {
        const newName = 'Builder' + Game.time;
        Game.spawns[SPAWN_NAME].spawnCreep(createCreepBody({numWork: 8, numCarry: 4, numMove: 4}), newName,
            {memory: {role: 'builder'}});
    }

    if(miners.length < 1 && getMineralAmount(room)) {
        const newName = 'Miner' + Game.time;
        Game.spawns[SPAWN_NAME].spawnCreep(createCreepBody({numWork: 8, numCarry: 4, numMove: 4}), newName,
            {memory: {role: 'miner'}});
    }


    if(repairmen.length < 0) {
        const newName = 'Repairman' + Game.time;
        Game.spawns[SPAWN_NAME].spawnCreep(createCreepBody({numWork: 8, numCarry: 4, numMove: 4}), newName,
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
        if(creep.memory.role === 'miner') {
            roleMiner.run(creep);
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

    //manageLink();
}