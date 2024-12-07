const { WebSocketServer } = require('ws')
const uuid = require('uuid');

function peerProxy(httpServer){
    //websocket object
    const wws = new WebSocketServer({ noServer: true});

    //updgrade from http to websocket
    httpServer.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, function done(ws) {
          wss.emit('connection', ws, request);
        });
    });

    // keep track of the connections 
    let connections = [];

    wss.on('connection', (ws) => {
        const connection = { id: uuid.v4(), alive: true, ws: ws };
        connections.push(connection);
    
    //forward message to everone but the sender (modify to just 
    //send to connected user if connected user is in connections)
    ws.on('message', function message(data) {
        connections.forEach((c) => {
          if (c.id !== connection.id) {
            c.ws.send(data);
          }
        });
      });
  
    // Remove the closed connection so we don't try to forward anymore
    ws.on('close', () => {
        const pos = connections.findIndex((o, i) => o.id === connection.id);

        if (pos >= 0) {
        connections.splice(pos, 1);
        }
    });

    // Respond to pong messages by marking the connection alive
    ws.on('pong', () => {
        connection.alive = true;
    });
    });

    // Keep active connections alive
    setInterval(() => {
    connections.forEach((c) => {
        // Kill any connection that didn't respond to the ping last time
        if (!c.alive) {
        c.ws.terminate();
        } else {
        c.alive = false;
        c.ws.ping();
        }
    });
    }, 10000);
    }

    module.exports = { peerProxy };
