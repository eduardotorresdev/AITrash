const delay = async (time, modifier) => {
    await new Promise(r => setTimeout(r, time / modifier));
}

module.exports = { delay };