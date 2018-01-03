const express = require('express');
const WebSocket = require('ws');

const manager = require('./gameManager');

const app = express();
app.use(express.static('public')); // serve everything from public
const listener = app.listen(3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

const wss = new WebSocket.Server({ server: listener });

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    try {
      manager(ws, JSON.parse(msg));
    } catch (error) {
      console.log(error);
    }
  });
});
