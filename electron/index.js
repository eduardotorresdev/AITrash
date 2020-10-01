var app = require('express')();
const cors = require('cors');
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

io.on('connection', (client) => {
    console.info('### Conectado ###');
    require('./server/world')(client);

    client.on('disconnect', () => {
        Object.keys(require.cache).forEach(function (key) {
            delete require.cache[key];
        });
    });
});

http.listen(3001, () => {
    console.log('listening on *:3001');
});

module.exports = {
    io: io
}