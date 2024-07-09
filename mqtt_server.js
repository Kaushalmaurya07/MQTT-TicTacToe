const aedes = require('aedes')();
const http = require('http');
const websocket = require('ws');

// Create aedes MQTT broker
const mqttPort = 1883;
const wsPort = 3000;

// MQTT server
const mqttServer = require('net').createServer(aedes.handle);
mqttServer.listen(mqttPort, function () {
    console.log(`MQTT server started and listening on port ${mqttPort}`);
});

// WebSocket server
const httpServer = http.createServer();
const wsServer = new websocket.Server({ server: httpServer });

wsServer.on('connection', function (ws) {
    const stream = websocket.createWebSocketStream(ws);
    aedes.handle(stream);
});

httpServer.listen(wsPort, function () {
    console.log(`WebSocket server started and listening on port ${wsPort}`);
});

aedes.on('client', function (client) {
    console.log(`Client Connected: ${client ? client.id : client} to broker ${aedes.id}`);
});

aedes.on('clientDisconnect', function (client) {
    console.log(`Client Disconnected: ${client ? client.id : client} from broker ${aedes.id}`);
});

aedes.on('publish', function (packet, client) {
    console.log(`Client ${client ? client.id : 'BROKER_' + aedes.id} has published ${packet.payload.toString()} on ${packet.topic}`);
});
