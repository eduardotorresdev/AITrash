const Cleaner = {
    x: 10,
    y: 0,
    full: false
};

const Purger = {
    x: 10,
    y: 19,
    full: false
};

const Recycler = (matriz) => {
    matriz[0][19] = null;
}

const Igniter = (matriz) => {
    matriz[19][19] = null;
}

module.exports = {
    Cleaner,
    Purger,
    Recycler,
    Igniter
};