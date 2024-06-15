const {MAIN_ROOM} = require("./constant");

function buildPath() {
    const room = Game.rooms[MAIN_ROOM];
    const sources = room.find(FIND_SOURCES);
    const controller = room.controller;
    sources.forEach(source => {
        const path = room.findPath(source.pos, controller.pos, {
            ignoreCreeps: true, // Ignores creeps in the pathfinding
            ignoreRoads: true, // Ignores existing roads to find the shortest path
            swampCost: 2
        });

        path.forEach(step => {
            room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
        });
    });
}

function createCreepBody({numWork = 0, numCarry = 0, numMove = 0,
                          numAttack = 0, numRangedAttack = 0, numHeal = 0,
                          numClaim = 0, numTough = 0} ) {
    const bodyParts = [];
    bodyParts.push(...Array(numWork).fill(WORK));
    bodyParts.push(...Array(numCarry).fill(CARRY));
    bodyParts.push(...Array(numMove).fill(MOVE));
    bodyParts.push(...Array(numAttack).fill(ATTACK));
    bodyParts.push(...Array(numRangedAttack).fill(RANGED_ATTACK));
    bodyParts.push(...Array(numHeal).fill(HEAL));
    bodyParts.push(...Array(numClaim).fill(CLAIM));
    bodyParts.push(...Array(numTough).fill(TOUGH));
    return bodyParts;
}

module.exports = {
    buildPath,
    createCreepBody
};

