const WebSocket = require('ws');
const fs = require('fs')
let portWS = 8080;

const server = new WebSocket.WebSocketServer({port:portWS});

console.log((new Date()) + ' Server is listening on port ' + portWS);

try
{
    server.on('connection', function (ws){

        console.log((new Date()) + ' Connection accepted.');

        fs.readFile('./data.json', 'utf8', function (err, data) {
                if (err)  console.log(`Error reading JSON: ${err}`);
                else ws.send(data)
            }
        )

        ws.on('close', function () {
            console.log((new Date()) + ' disconnected.');
        });
    })
}
catch (e) {
    console.log(e);
}