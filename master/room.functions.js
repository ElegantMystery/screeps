const {STORAGE_LINK} = require('constant');
function manageLink() {
    const senderLink = Game.getObjectById("");
    const receiverLink = Game.getObjectById(STORAGE_LINK);

    if (senderLink.store.getUsedCapacity() > 0 && receiverLink.store.getFreeCapacity() > 0) {
        senderLink.transferEnergy(receiverLink);
    }
}

function getMineralAmount(room) {
    const mineral =  room.find(FIND_MINERALS)[0];
    return mineral.mineralAmount > 0;
}
module.exports = {
    manageLink,
    getMineralAmount
}
