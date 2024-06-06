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

module.exports.buildPath = buildPath;

