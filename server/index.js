const WebSocket = require("ws");
const jsonWorker = require('./src/script.js');

const wss = new WebSocket.Server({ port: 8008 });
const datapath = './src/data';

wss.on("connection", ws => {
    let ip = ws._socket.remoteAddress.split(':')[3];

    jsonWorker.appendJson(datapath, ip, { "online": true });

    function sendData(data) {
        ws.send(JSON.stringify(data));
    }

    // load player
    const allPlayers = jsonWorker.readJson(datapath);
    /* if ( 'x' in allPlayers[ip] ) {
        sendData({
            "ip": ip,
            "x": allPlayers[ip].x,
            "y": allPlayers[ip].y
        });
    } else {
        sendData({
            "ip": ip
        });
    } */
    sendData({
        "ip": ip,
        "x": allPlayers[ip].x,
        "y": allPlayers[ip].y,
        "cash": allPlayers[ip].cash
    });
    

    function sendAllPlayers() {
        sendData({
            "location": 0,
            "data": jsonWorker.readJson(datapath)
        });
        setTimeout(() => sendAllPlayers(), 100);
    }

    sendAllPlayers();

    ws.on("message", data => {
        data = JSON.parse(data);

        // receive player location
        if ("location" in data) {
            jsonWorker.appendJson(datapath, ip, { "online": true, 'x': data['x'], 'y': data['y'] });
        }

        // receive player message
        else if ("message" in data) {
            jsonWorker.appendJson(datapath, ip, { 'message': data['message'] });
            // Broadcast to all clients
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        "noise": data['message']
                    }));
                }
            });
        }

        // send noise
        else if ("noise" in data) {
            // Broadcast to all clients
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        "noise": 0
                    }));
                }
            });
        }
    })

    ws.on("close", () => {
        jsonWorker.appendJson(datapath, ip, { "online": false });
    })
})
