const{ CREEP_ROLE, MAIN_ROOM_NAME } = require('constant');
const {checkHarvesterBySourceId, findResourceByRoom} = require("room.functions");
const {EAST_NEIGHBOR_ROOM_NAME, WEST_NEIGHBOR_ROOM_NAME} = require("constant");

module.exports = function (spawn) {
    const roomName = spawn.room.name;
    const room = spawn.room;
    const capacity = spawn.room.energyCapacityAvailable;
    const creeps = room.find(FIND_MY_CREEPS);
    const controlLevel = room.controller.level;
    const creepsNeed = initializeCreepCount(controlLevel, roomName);
    const currentCreeps = {
        HARVESTER : _.filter(creeps, (creep) => creep.memory.role === CREEP_ROLE['HARVESTER'] && creep.room === room).length,
        CARRIER : _.filter(creeps, (creep) => creep.memory.role === CREEP_ROLE['CARRIER'] && creep.room === room).length,
        BUILDER : _.filter(creeps, (creep) => creep.memory.role === CREEP_ROLE['BUILDER'] && creep.room === room).length,
        UPGRADER : _.filter(creeps, (creep) => creep.memory.role === CREEP_ROLE['UPGRADER'] && creep.room === room).length,
        MINER : _.filter(creeps, (creep) => creep.memory.role === CREEP_ROLE['MINER'] && creep.room === room).length,
        FACTORY_CARRIER : _.filter(creeps, (creep) => creep.memory.role === CREEP_ROLE['FACTORY_CARRIER'] && creep.room === room).length,
        SCOUT : _.filter(Game.creeps, (creep) => creep.memory.role === CREEP_ROLE['SCOUT']).length,
        REMOTE_HARVESTER : _.filter(Game.creeps, (creep) => creep.memory.role === CREEP_ROLE['REMOTE_HARVESTER']).length
    }

    if(currentCreeps["CARRIER"] === 0 && currentCreeps["HARVESTER"] === 0) {
        let newName = "TempCarrier" + Game.time;
        let bodyPart = [MOVE,MOVE,MOVE,CARRY,CARRY,CARRY];
        spawn.spawnCreep(bodyPart, newName, {memory: {role: CREEP_ROLE["CARRIER"]}});
    }else {
        Object.keys(currentCreeps).forEach(role =>  {
            if(currentCreeps[role] >= creepsNeed[CREEP_ROLE[role]]) {
                return;
            }
            let newName, bodyPart;
            switch(role) {
                case 'HARVESTER':
                    newName = 'Harvester' + Game.time;
                    bodyPart = createCreepBody(capacity, role, controlLevel);
                    let sources = spawn.room.find(FIND_SOURCES);
                    if(checkHarvesterBySourceId(roomName, CREEP_ROLE['HARVESTER'], sources[0].id)) {
                        spawn.spawnCreep(bodyPart, newName, {memory: {role: CREEP_ROLE['HARVESTER'], sourceId: sources[1].id}});
                    }else {
                        spawn.spawnCreep(bodyPart, newName, {memory: {role: CREEP_ROLE['HARVESTER'], sourceId: sources[0].id}});
                    }
                    break;
                case 'CARRIER':
                    newName = 'Carrier' + Game.time;
                    bodyPart = createCreepBody(capacity, role, controlLevel);
                    spawn.spawnCreep(bodyPart, newName, {memory : {role: CREEP_ROLE['CARRIER']}});
                    break;
                case 'UPGRADER':
                    newName = 'Upgrader' + Game.time;
                    bodyPart = createCreepBody(capacity, role, controlLevel);
                    spawn.spawnCreep(bodyPart, newName, {memory : {role: CREEP_ROLE['UPGRADER']}});
                    break;
                case 'BUILDER':
                    if(room.find(FIND_CONSTRUCTION_SITES).length > 0) {
                        newName = 'Builder' + Game.time;
                        bodyPart = createCreepBody(capacity, role, controlLevel);
                        spawn.spawnCreep(bodyPart, newName, {memory : {role: CREEP_ROLE['BUILDER']}});
                    }
                    break;
                case 'MINER':
                    let mineral = room.find(FIND_MINERALS)[0];
                    let extractor = mineral.pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: { structureType: STRUCTURE_EXTRACTOR }
                    })[0];
                    if(room.find(FIND_MINERALS)[0].mineralAmount > 0 && extractor) {
                        newName = 'Miner' + Game.time;
                        bodyPart = createCreepBody(capacity, role, controlLevel);
                        spawn.spawnCreep(bodyPart, newName, {memory : {role: CREEP_ROLE['MINER']}});
                    }
                    break;
                case 'FACTORY_CARRIER':
                    let factory = room.find(FIND_STRUCTURES, {
                        filter: (structure) => structure.structureType === STRUCTURE_FACTORY
                    })[0];
                    if(factory && room.storage && room.storage.store[RESOURCE_LEMERGIUM] > 40000) {
                        newName = 'FactoryCarrier' + Game.time;
                        bodyPart = createCreepBody(capacity, role, controlLevel);
                        spawn.spawnCreep(bodyPart, newName, {memory : {role: CREEP_ROLE['FACTORY_CARRIER']}});
                    }
                    break;
                case 'SCOUT':
                    let roomNames = [WEST_NEIGHBOR_ROOM_NAME, EAST_NEIGHBOR_ROOM_NAME];
                    for(let roomName of roomNames) {
                        if(!Game.rooms[roomName]) {
                            newName = 'Scout' + Game.time;
                            bodyPart = createCreepBody(capacity, role, controlLevel);
                            spawn.spawnCreep(bodyPart, newName, {memory : {role: CREEP_ROLE['SCOUT'], targetRoom: roomName}});
                        }
                    }
                    break;
                case 'REMOTE_HARVESTER':
                    let remoteSources = findResourceByRoom(EAST_NEIGHBOR_ROOM_NAME);
                    if(remoteSources) {
                        newName = 'RemoteHarvester' + Game.time;
                        bodyPart = createCreepBody(capacity, role, controlLevel);
                        if(checkHarvesterBySourceId(EAST_NEIGHBOR_ROOM_NAME, CREEP_ROLE['REMOTE_HARVESTER'], remoteSources[0].id)) {
                            spawn.spawnCreep(bodyPart, newName, {memory: {role: CREEP_ROLE['REMOTE_HARVESTER'], sourceId: remoteSources[1].id}});
                        }else {
                            spawn.spawnCreep(bodyPart, newName, {memory: {role: CREEP_ROLE["REMOTE_HARVESTER"], sourceId: remoteSources[0].id}});
                        }
                    }
                    break;
            }
        });
    }
}

// Initialize all creeps count to 0
function initializeCreepCount(controlLevel, roomName) {
    let creepsNeed = {};
    for(const roleKey in CREEP_ROLE) {
        creepsNeed[CREEP_ROLE[roleKey]] = 0;
    }

    if(controlLevel >= 0) {
        creepsNeed[CREEP_ROLE["HARVESTER"]] += 1;
        creepsNeed[CREEP_ROLE["UPGRADER"]] += 1;
    }
    if(controlLevel >= 2) {
        creepsNeed[CREEP_ROLE["CARRIER"]] += 1;
        creepsNeed[CREEP_ROLE["BUILDER"]] += 1;
        creepsNeed[CREEP_ROLE["HARVESTER"]] += 1;
    }
    if(controlLevel >= 3) {
        creepsNeed[CREEP_ROLE["CARRIER"]] += 1;
    }
    if(controlLevel >= 4) {
        //creepsNeed[CREEP_ROLE["UPGRADER"]] += 1;
    }
    if(controlLevel >= 6) {
        creepsNeed[CREEP_ROLE["MINER"]] += 1;
    }
    if(controlLevel >= 7) {
        creepsNeed[CREEP_ROLE["UPGRADER"]] += 1;
        creepsNeed[CREEP_ROLE["FACTORY_CARRIER"]] += 1;
    }
    if(roomName === MAIN_ROOM_NAME) {
        creepsNeed[CREEP_ROLE["REMOTE_HARVESTER"]] += 2;
        creepsNeed[CREEP_ROLE["SCOUT"]] += 2;
    }
    return creepsNeed;
}

function createCreepBody(capacity, role, controlLevel) {
    let bodyPart = [];
    let cost = 0;
    switch (role) {
        case 'HARVESTER':
            bodyPart.push(MOVE);
            cost += BODYPART_COST[MOVE];
            bodyPart.push(MOVE);
            cost += BODYPART_COST[MOVE];
            while(cost <= capacity - BODYPART_COST[WORK] && cost < 800) {
                bodyPart.push(WORK);
                cost += BODYPART_COST[WORK];
            }
            break;
        case 'FACTORY_CARRIER':
        case 'CARRIER':
            while(cost <= capacity - BODYPART_COST[MOVE] - BODYPART_COST[CARRY] && cost < 1000) {
                bodyPart.push(CARRY);
                cost += BODYPART_COST[CARRY];
                bodyPart.push(MOVE);
                cost += BODYPART_COST[MOVE];
            }
            break;
        case 'SCOUT':
            for(let i = 0; i < 4; i++) {
                bodyPart.push(MOVE);
            }
            break;
        case 'RESCUER':
            bodyPart.push(WORK);
            bodyPart.push(MOVE);
            bodyPart.push(CARRY);
            break;
        default:
            let m = 0;
            if(controlLevel >= 7) {
                while((300 * (m + 1) <= (capacity / 3)) && (4 * (m + 1) <= 50)) {
                    m++;
                }
            }else {
                while((300 * (m + 1) <= capacity) && (4 * (m + 1) <= 50)) {
                    m++;
                }
            }


            const numWork = 2 * m;
            const numMove = m;
            const numCarry = m;

            for(let i = 0; i < numWork; i++) {
                bodyPart.push(WORK);
            }
            for(let i = 0; i < numMove; i++) {
                bodyPart.push(MOVE);
            }
            for(let i = 0; i < numCarry; i++) {
                bodyPart.push(CARRY);
            }
            break;
    }
    return bodyPart;
}

/*
  Control level 1: 300
  Control level 2: 550
  Control level 3: 800
  Control level 4: 1300
  Control level 5: 1800
  Control level 6: 2300
  Control level 7: 5300
  Control level 8: 12300
 */