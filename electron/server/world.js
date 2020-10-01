
module.exports = function (io) {
    const Robots = require('./cast');
    const Recycle = "R";
    const Organic = "O"
    const World = {
        trashes: Array.from({
            length: 20
        }, () => Array(20).fill(null)),
        quantity: 0,
        speed: 1
    };

    World.toString = () => {
        let exportable = {};
        exportable.Cleaner = Robots.Cleaner;
        exportable.Purger = Robots.Purger;
        exportable.World = { trashes: World.trashes, quantity: World.quantity };
        return JSON.stringify(exportable);
    }

    const trashGenerator = () => {
        const trashType = [Recycle, Organic];
        return trashType.sort(() => Math.random() - 0.5)[0];
    }

    const createWorld = () => {
        const exceptI = [0, 19, 0, 19, 0, 19];
        const exceptJ = [0, 0, 11, 11, 19, 19];

        while (World.quantity < 40) {
            const i = Math.floor(Math.sqrt(Math.random() * 400));
            const j = Math.floor(Math.sqrt(Math.random() * 400));
            if (exceptI.indexOf(i) + exceptJ.indexOf(j) >= 0) {
                continue;
            }
            World.trashes[i][j] = trashGenerator();
            World.quantity++;
        }

        io.emit('worldChanged', World.toString());
    }

    createWorld();

    io.on('newSpeed', (value) => {
        World.speed = value;
    })
}