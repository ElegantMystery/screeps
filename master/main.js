const roleHarvester = require('harvester');
const roleUpgrader = require('upgrader');
const roleBuilder = require('builder');
const roleCarrier = require('carrier');
const roleRepairman = require('repairman');
const roleRescuer = require('rescuer');
const roleMiner = require('miner');
const roleRemoteHaverster = require('remoteHarvester');
const roleScout = require('scout');
const roleFactoryCarrier = require('factoryCarrier');
const creepManager = require('creepManager');

const runTower = require('tower')

const {  EAST_NEIGHBOR_LINK, STORAGE_LINK,CREEP_ROLE, SPAWN_NAME, WEST_NEIGHBOR_ROOM_NAME, EAST_NEIGHBOR_ROOM_NAME} = require('./constant');
const { manageLink, manageFactory, placeSellOrder, sellToOrder, resetOrderSaleFlag, resetOrderPlacedFlag, controlClaim} = require("./room.functions");

module.exports.loop = function () {
    const myRooms = _.filter(Game.rooms, (room) => room.controller && room.controller.my);
    for(let nameInMemory in Memory.creeps) {
        if(!Game.creeps[nameInMemory]) {
            delete Memory.creeps[nameInMemory];
        }
    }

    myRooms.forEach((room) => {
        const spawn = room.find(FIND_MY_SPAWNS)[0];
        if(spawn) {
            creepManager(spawn);
        }
        const towers = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType === STRUCTURE_TOWER &&
                    structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });

        for(let tower of towers) {
            runTower(tower);
        }
    });


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
        if(creep.memory.role === CREEP_ROLE["REMOTE_HARVESTER"]) {
            roleRemoteHaverster.run(creep);
        }
        if(creep.memory.role === 'scout') {
            roleScout.run(creep);
        }
        if(creep.memory.role === 'factoryCarrier') {
            roleFactoryCarrier.run(creep, RESOURCE_LEMERGIUM_BAR);
        }
    }

    manageLink(EAST_NEIGHBOR_LINK, STORAGE_LINK);

    manageFactory(RESOURCE_LEMERGIUM_BAR);

    //placeSellOrder(RESOURCE_LEMERGIUM_BAR, 175, 10000);

    // resetOrderPlacedFlag();

    // sellToOrder("666f7d27edbe34001246874f", 350, MAIN_ROOM_NAME);

    // resetOrderSaleFlag();

    // creepManager(Game.spawns[SPAWN_NAME]);

    //controlClaim(Game.spawns[SPAWN_NAME], 'E36S58');
}