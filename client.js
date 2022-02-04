let interval;
let con;

function start() {
    clearInterval(interval);
    const ws = new WebSocket('ws://localhost:8080');

    window.onbeforeunload = function(e) {
        ws.disconnect();
    };

    ws.onerror = function (error) {
        console.log('Connect Error: ' + error.toString());
    }

    ws.onopen = function() {
        con = true;
        console.log('Connected.');
    };

    ws.onclose = function() {
        con = false;
        console.log('Disconnected.');
    };

    ws.onmessage = function (message){
    let data = JSON.parse(message.data);
    for(let elem in data.neighbours) {
        if(data.neighbours[elem].state==="yes")
            dataColor[data.id][elem].color = "green";
        else if(data.neighbours[elem].state==="no")
            dataColor[data.id][elem].color = "red";
        else return 0;
    }
    connect();
}

    interval = setInterval(function () {
        if (!con) {
            start();
        }
    }, 5000)
}

start()