const { Cleaner, trashCanLeft, trashCanRight, Purger } = require('./cast');
const { delay } = require('./helpers');

function distance(p, q) {
    var dx = Math.abs(p.x - q.x);
    var dy = Math.abs(p.y - q.y);
    var dist = Math.sqrt(dx * dx + dy * dy);
    return dist;
}

module.exports = async (World) => {
    let side = 'right';
    let perceptions = [];
    let lastPos = { x: 11, y: 11 };
    while (World.quantity > 0 || Cleaner.hasTrash !== null) {
        if (Cleaner.hasTrash === null) {
            if (Cleaner.trashOnField()) {
                lastPos = { x: Cleaner.x, y: Cleaner.y }
                let trashes = Cleaner.trashOnSide();
                if (trashes.length > 0) {
                    trashes.forEach((value) => {
                        if (!perceptions.find(p => p.x === value.x && p.y === value.y)) {
                            perceptions.push(value);
                        }
                    });
                }
                Cleaner.hasTrash = World.trashes[Cleaner.y][Cleaner.x]
                World.trashes[Cleaner.y][Cleaner.x] = null;
                World.quantity--;
            } else {
                let trashes = Cleaner.trashOnSide();
                if (trashes.length === 0) {
                    if (side === 'right') {
                        if (Cleaner.move('right', Cleaner) === 'overright') {
                            if (Cleaner.move('down', Cleaner) === 'overdown') {
                                await Cleaner.moveToPos({ x: 0, y: 0 }, Cleaner);
                                side = 'right';
                            } else {
                                side = 'left';
                            }
                        }
                    } else {
                        if (Cleaner.move('left', Cleaner) === 'overleft') {
                            if (Cleaner.move('down', Cleaner) === 'overdown') {
                                await Cleaner.moveToPos({ x: 0, y: 0 }, Cleaner);
                                side = 'right';
                            };
                            side = 'right';
                        }
                    }
                } else {
                    if (trashes.length > 1) {
                        (trashes.slice(1)).forEach((value) => {
                            if (!perceptions.find(p => p.x === value.x && p.y === value.y)) {
                                perceptions.push(value);
                            }
                        })
                        trashes.sort((a, b) => {
                            if (a === 'O' && b === 'R') {
                                return 1;
                            }
                            if (a === 'R' && b === 'O') {
                                return -1;
                            }
                            return 0;
                        })
                    }
                    if (trashes[0].x > Cleaner.x) {
                        Cleaner.move('right', Cleaner)
                    } else if (trashes[0].y > Cleaner.y) {
                        Cleaner.move('down', Cleaner)
                    } else if (trashes[0].x < Cleaner.x) {
                        Cleaner.move('left', Cleaner)
                    } else if (trashes[0].y < Cleaner.y) {
                        Cleaner.move('up', Cleaner)
                    }
                }
            }
        } else if (Cleaner.hasTrash !== null) {
            const trashCan = Cleaner.trashCanNearest();
            let trashes = Cleaner.trashOnSide();
            if (trashes.length > 0) {
                trashes.forEach((value) => {
                    if (!perceptions.find(p => p.x === value.x && p.y === value.y)) {
                        perceptions.push(value);
                    }
                })
            }
            if (Cleaner.y !== 11) {
                Cleaner.y > 11 ? Cleaner.move('up', Cleaner) : Cleaner.move('down', Cleaner)
            } else {
                if (trashCan === 'left') {
                    if (Cleaner.x !== 0) {
                        Cleaner.move('left', Cleaner);

                    } else {
                        trashCanLeft.push(Cleaner.hasTrash);
                        Cleaner.hasTrash = null;
                        Purger.getTrash('left');
                        if (perceptions.length > 0) {
                            perceptions.sort((a, b) => {
                                if ((a.type === 'O' && b.type === 'R') || distance(Cleaner, a) > distance(Cleaner, b)) {
                                    return 1;
                                }
                                if ((a.type === 'O' && b.type === 'R') || distance(Cleaner, a) < distance(Cleaner, b)) {
                                    return -1;
                                }
                                return 0;
                            })
                            let aux = perceptions.shift()
                            await Cleaner.moveToPos(aux, Cleaner);
                            continue;
                        }

                        await Cleaner.moveToPos(lastPos, Cleaner);
                    }
                } else {
                    if (Cleaner.x !== 19) {
                        Cleaner.move('right', Cleaner);
                    } else {
                        trashCanRight.push(Cleaner.hasTrash);
                        Cleaner.hasTrash = null;
                        Purger.getTrash('right');
                        if (perceptions.length > 0) {
                            perceptions.sort((a, b) => {
                                if ((a.type === 'O' && b.type === 'R') || distance(Cleaner, a) > distance(Cleaner, b)) {
                                    return 1;
                                }
                                if ((a.type === 'O' && b.type === 'R') || distance(Cleaner, a) < distance(Cleaner, b)) {
                                    return -1;
                                }
                                return 0;
                            })

                            let aux = perceptions.shift()
                            await Cleaner.moveToPos(aux, Cleaner);
                            continue;
                        }
                        await Cleaner.moveToPos(lastPos, Cleaner);
                    }
                }
                side = 'right';
            }
        }
        World.update();
        await delay(1000, World.speed);
    }
    World.finalizar();
}
