const { delay } = require('./helpers');

module.exports = (World) => {
    const onEdge = (x, y) => {
        if (x <= 0) {
            return 'overleft';
        } else if (x >= 19) {
            return 'overright';
        } else if (y <= 0) {
            return 'overup';
        } else if (y >= 19) {
            return 'overdown';
        }
        return 'Inside';
    }
    const move = (direction, robot) => {
        switch (direction) {
            case "left":
                if (onEdge(robot.x, robot.y) === 'overleft') return 'overleft';
                robot.x--;
                break;
            case "right":
                if (onEdge(robot.x, robot.y) === 'overright') return 'overright';
                robot.x++;
                break;
            case "up":
                if (onEdge(robot.x, robot.y) === 'overup') return 'overup';
                robot.y--;
                break;
            case "down":
                if (onEdge(robot.x, robot.y) === 'overdown') return 'overdown';
                robot.y++;
                break;
            default:
                break;
        }
    }

    const Cleaner = {
        x: 0,
        y: 0,
        hasTrash: null,
        trashOnField: () => {
            if (World.trashes[Cleaner.y][Cleaner.x] !== null) {
                return true;
            }
            return false;
        },
        trashOnSide: () => {
            let trashFounded = [];
            if (Cleaner.y - 1 >= 0 && World.trashes[Cleaner.y - 1][Cleaner.x] !== null) {
                trashFounded.push({
                    x: Cleaner.y - 1,
                    y: Cleaner.y,
                    type: World.trashes[Cleaner.y - 1][Cleaner.x]
                })
            }
            if (Cleaner.y + 1 <= 19 && World.trashes[Cleaner.y + 1][Cleaner.x] !== null) {
                trashFounded.push({
                    x: Cleaner.x,
                    y: Cleaner.y + 1,
                    type: World.trashes[Cleaner.y + 1][Cleaner.x]
                })
            }
            if (Cleaner.x - 1 >= 0 && World.trashes[Cleaner.y][Cleaner.x - 1] !== null) {
                trashFounded.push({
                    x: Cleaner.x - 1,
                    y: Cleaner.y,
                    type: World.trashes[Cleaner.y][Cleaner.x - 1]
                })
            }
            if (Cleaner.x + 1 <= 19 && World.trashes[Cleaner.y][Cleaner.x + 1] !== null) {
                trashFounded.push({
                    x: Cleaner.x + 1,
                    y: Cleaner.y,
                    type: World.trashes[Cleaner.y][Cleaner.x + 1]
                })
            }
            return trashFounded;
        },
        move,
        trashCanNearest: () => {
            let dist0x = Cleaner.x - 0;
            let dist1x = Cleaner.x - 19;

            dist0x = Math.abs(dist0x);
            dist1x = Math.abs(dist1x);

            if (dist1x > dist0x) {
                return "left"
            }

            return "right";
        }
    };

    const trashCanLeft = [];
    const trashCanRight = [];

    const Purger = {
        x: 19,
        y: 0,
        hasTrash: null,
        move
    };
    Purger.getTrash = async (side) => {
        addTask(side);
    }

    const addTask = (() => {
        let pending = Promise.resolve();

        const run = async (side) => {
            try {
                await pending;
            } finally {
                return executeGet(side);
            }
        }

        return (side) => (pending = run(side))
    })();

    const executeGet = async (side) => {
        console.log('XEUIFASOFASDF');
        if (side === 'left') {
            while (Purger.x !== 0 || Purger.y !== 11) {
                if (Purger.x !== 0) {
                    Purger.move('left', Purger);
                } else {
                    Purger.y > 11 ? Purger.move('up', Purger) : Purger.move('down', Purger)
                }
                World.updatePurger();
                await delay(1000, World.speed);
            }
            Purger.hasTrash = trashCanLeft.shift();
            await delay(300, 1);
            while (Purger.y !== 19) {
                Purger.move('down', Purger);
                World.updatePurger();
                await delay(1000, World.speed);
            }
            if (Purger.hasTrash === 'O') {
                Purger.hasTrash = null;
            } else {
                while (Purger.x !== 19) {
                    Purger.move('right', Purger);
                    World.updatePurger();
                    await delay(1000, World.speed);
                }
                Purger.hasTrash = null;
            }
        } else {
            while (Purger.x !== 19 || Purger.y !== 11) {
                if (Purger.x !== 19) {
                    Purger.move('right', Purger);
                } else {
                    Purger.y > 11 ? Purger.move('up', Purger) : Purger.move('down', Purger)
                }
                World.updatePurger();
                await delay(1000, World.speed);
            }
            Purger.hasTrash = trashCanRight.shift();
            await delay(300, 1);
            while (Purger.y !== 19) {
                Purger.move('down', Purger);
                World.updatePurger();
                await delay(1000, World.speed);
            }
            if (Purger.hasTrash === 'R') {
                Purger.hasTrash = null;
            } else {
                while (Purger.x !== 0) {
                    Purger.move('left', Purger);
                    World.updatePurger();
                    await delay(1000, World.speed);
                }
                Purger.hasTrash = null;
            }
        }
    }

    return module.exports = {
        Cleaner,
        Purger,
        trashCanLeft,
        trashCanRight
    }
};