
module.exports = function (io) {
    const Recycle = "R";
    const Organic = "O";
    const World = {
        trashes: [],
        quantity: 0,
        speed: 1,
        architecture: null
    };
    const Robots = require('./cast')(World);

    World.update = () => {
        let exportable = {};
        exportable.Cleaner = Robots.Cleaner;
        exportable.World = { trashes: World.trashes, quantity: World.quantity };
        io.emit('worldChanged', JSON.stringify(exportable));
    }

    World.updatePurger = () => {
        io.emit('purgerChanged', JSON.stringify(Robots.Purger));
    }

    World.finalizar = () => {
        io.emit('finalizado');
    }

    const trashGenerator = () => {
        const trashType = [Recycle, Organic];
        return trashType.sort(() => Math.random() - 0.5)[0];
    }

    const createWorld = () => {
        World.trashes = Array.from({
            length: 20
        }, () => Array(20).fill(null));

        const exceptI = [0, 19, 0, 19, 0, 19];
        const exceptJ = [0, 0, 11, 11, 19, 19];
        while (World.quantity < 40) {
            const x = Math.floor(Math.sqrt(Math.random() * 400));
            const y = Math.floor(Math.sqrt(Math.random() * 400));
            if (World.trashes[y][x] !== null || exceptI.indexOf(y) + exceptJ.indexOf(x) >= 0) {
                continue;
            }
            World.trashes[y][x] = trashGenerator();
            World.quantity++;
        }
        World.update();
    }

    createWorld();

    io.on('newSpeed', (value) => {
        World.speed = value;
    })

    io.on('newArchitecture', (value) => {
        switch (value) {
            case 'simple':
                World.architecture = require('./simpleAgent');
                break;
            case 'models':
                World.architecture = require('./modelsAgent');
                break;
            case 'goals':
                World.architecture = require('./goalsAgent');
                break;
            case 'utility':
                World.architecture = require('./utilityAgent');
                break;
            default:
                World.architecture = null;
        }
    })

    io.on('start', () => {
        if (World.quantity === 0) {
            createWorld();
        }
        World.architecture(World);
    })
}