const { Cleaner, trashCanLeft, trashCanRight, Purger } = require('./cast');
const { delay } = require('./helpers');

module.exports = async (World) => {
    let side = 'right';
    while (World.quantity > 0) {
        if (Cleaner.hasTrash === null) {
            if (Cleaner.trashOnField()) {
                Cleaner.hasTrash = World.trashes[Cleaner.y][Cleaner.x]
                World.trashes[Cleaner.y][Cleaner.x] = null;
                World.quantity--;
            } else {
                let trashes = Cleaner.trashOnSide();
                if (trashes.length === 0) {
                    if (side === 'right') {
                        if (Cleaner.move('right', Cleaner) === 'overright') {
                            Cleaner.move('down', Cleaner)
                            side = 'left';
                        }
                    } else {
                        if (Cleaner.move('left', Cleaner) === 'overleft') {
                            Cleaner.move('down', Cleaner)
                            side = 'right';
                        }
                    }
                } else {
                    trashes.sort((a, b) => {
                        if (a === 'O' && b === 'R') {
                            return 1;
                        }
                        return 0;
                    })
                    console.log(trashes);
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
                        while (Cleaner.y !== 0) {
                            Cleaner.move('up', Cleaner);
                            World.update();
                            await delay(1000, World.speed);
                        }
                        side = 'right';
                    }
                } else {
                    if (Cleaner.x !== 19) {
                        Cleaner.move('right', Cleaner);
                    } else {
                        trashCanRight.push(Cleaner.hasTrash);
                        Cleaner.hasTrash = null;
                        Purger.getTrash('right');
                        while (Cleaner.x !== 0 || Cleaner.y !== 0) {
                            if (Cleaner.y !== 0) {
                                Cleaner.move('up', Cleaner);
                            } else {
                                Cleaner.move('left', Cleaner);
                            }
                            World.update();
                            await delay(1000, World.speed);
                        }
                        side = 'right';
                    }
                }
            }
        }
        World.update();
        await delay(1000, World.speed);
    }
    World.finalizar();
}
