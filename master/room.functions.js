const { MAIN_ROOM_FACTORY } = require('constant');
const {MAIN_ROOM_NAME} = require("./constant");
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

function getDroppedMineral(room) {
    const droppedMinerals = room.find(FIND_DROPPED_RESOURCES, {
        filter: (resource) => resource.resourceType !== RESOURCE_ENERGY
    });
    return droppedMinerals.length > 0;
}

function findResourceByRoom(roomName) {
    const room = Game.rooms[roomName];
    return room.find(FIND_SOURCES);
}

function manageFactory(commodityType) {
    const factory = Game.getObjectById(MAIN_ROOM_FACTORY);
    if(canProduce(factory, commodityType)) {
        factory.produce(commodityType);
    }
}

function canProduce(factory, commodityType) {
    if (factory.cooldown > 0) {
        return false;
    }

    const recipe = COMMODITIES[commodityType];
    for (const component in recipe.components) {
        if (factory.store.getUsedCapacity(component) < recipe.components[component]) {
            return false;
        }
    }
    return true;
}

function getCommodityInFactory(roomName, commodityType) {
    const room = Game.rooms[roomName];
    const factory = room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType === STRUCTURE_FACTORY
    });
    return factory[0].store.getUsedCapacity(commodityType) > 0;
}

function placeSellOrder(commodityType, price, amount) {
    if(!Memory.orderPlaced) {
        const result = Game.market.createOrder({
            type: ORDER_SELL,
            resourceType: commodityType,
            price: price,
            totalAmount: amount,
            roomName: MAIN_ROOM_NAME
        });

        if(result === OK) {
            console.log("Sell order of " + commodityType + ": " + amount + " of price of " + price + " successful");
            Memory.orderPlaced = true;
        }else {
            console.log("Fail to create sell order: " + result);
        }
    }
}

function resetOrderPlacedFlag() {
    Memory.orderPlaced = false;
    console.log('Order placed flag reset.');
}

function sellToOrder(orderId, amount, roomName) {
    if (Memory.hasSoldOrder) {
        console.log('Order has already been processed.');
        return;
    }

    const order = Game.market.getOrderById(orderId);
    if (!order) {
        console.log('Order not found.');
        return;
    }

    const terminal = Game.rooms[roomName].terminal;
    if (!terminal) {
        console.log('Terminal not found in room:', roomName);
        return;
    }

    // Check if the terminal has enough of the resource and energy
    const resourceAmount = terminal.store[order.resourceType] || 0;
    const energyAmount = terminal.store[RESOURCE_ENERGY] || 0;
    const transactionCost = Game.market.calcTransactionCost(amount, roomName, order.roomName);

    if (resourceAmount >= amount && energyAmount >= transactionCost) {
        const result = Game.market.deal(orderId, amount, roomName);
        if (result === OK) {
            console.log(`Successfully sold ${amount} of ${order.resourceType} to order in room ${order.roomName}.`);
            Memory.hasSoldOrder = true;
        } else {
            console.log('Failed to sell:', result);
        }
    } else {
        console.log('Not enough resources or energy to complete the transaction.');
        console.log(`Required: ${amount} ${order.resourceType}, Available: ${resourceAmount}`);
        console.log(`Required Energy: ${transactionCost}, Available Energy: ${energyAmount}`);
    }
}

function resetOrderSaleFlag() {
    Memory.hasSoldOrder = false;
    console.log('Order sale flag reset.');
}

module.exports = {
    manageLink,
    getMineralAmount,
    checkHarvesterBySourceId,
    findResourceByRoom,
    getDroppedMineral,
    manageFactory,
    getCommodityInFactory,
    placeSellOrder,
    sellToOrder,
    resetOrderSaleFlag,
    resetOrderPlacedFlag
}
