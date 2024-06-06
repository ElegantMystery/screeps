var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder')
var roleCarrier = require('role.carrier')
var roleRepairman = require('role.repairman')

const { SPAWN_NAME } = require('./constant');

module.exports.loop = function () {
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var carriers = _.filter(Game.creeps, (creep) => creep.memory.role == 'carrier');
    var repairmen = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairman');

    for(var nameInMemory in Memory.creeps) {
        if(!Game.creeps[nameInMemory]) {
            delete Memory.creeps[nameInMemory];
        }
    }

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns[SPAWN_NAME].spawnCreep([WORK,WORK,MOVE], newName,
            {memory: {role: 'harvester'}});
    }

    if(upgraders.length < 1) {
        var newName = 'Upgrader' + Game.time;
        console.log('Spawning new upgrader: ' + newName);
        Game.spawns[SPAWN_NAME].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'upgrader'}});
    }

    if(builders.length < 2) {
        var newName = 'Builder' + Game.time;
        console.log('Spawning new builder: ' + newName);
        Game.spawns[SPAWN_NAME].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'builder'}});
    }

    if(carriers.length < 2) {
        var newName = 'Carrier' + Game.time;
        console.log('Spawning new carrier: ' + newName);
        Game.spawns[SPAWN_NAME].spawnCreep([CARRY,MOVE, MOVE], newName,
            {memory: {role: 'carrier'}});
    }

    if(repairmen.length < 1) {
        var newName = 'Repairman' + Game.time;
        console.log('Spawning new repairman: ' + newName);
        Game.spawns[SPAWN_NAME].spawnCreep([CARRY,WORK, MOVE], newName,
            {memory: {role: 'repairman'}});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'carrier') {
            roleCarrier.run(creep);
        }
        if(creep.memory.role == 'repairman') {
            roleRepairman.run(creep);
        }
    }
}