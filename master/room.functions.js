function manageLink(senderId, receiverId) {
    const senderLink = Game.getObjectById(senderId);
    const receiverLink = Game.getObjectById(receiverId);

    if (senderLink.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && receiverLink.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
        senderLink.transferEnergy(receiverLink);
    }
}

function getMineralAmount(room) {
    const mineral =  room.find(FIND_MINERALS)[0];
    return mineral.mineralAmount > 0;
}

function checkHarvesterBySourceId(roomName, memoryRole, sourceId) {
    const creeps = Game.rooms[roomName].find(FIND_MY_CREEPS, {
        filter: (creep) => {
            return creep.memory.role === memoryRole && creep.memory.sourceId === sourceId;
        }
    });

    return creeps.length > 0;
}

function findResourceByRoom(roomName) {
    const room = Game.rooms[roomName];
    return room.find(FIND_SOURCES);
}
module.exports = {
    manageLink,
    getMineralAmount,
    checkHarvesterBySourceId,
    findResourceByRoom
}
