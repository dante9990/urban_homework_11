const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    console.log('Новый юзер подключился');

    ws.send(JSON.stringify({
        type: 'system',
        name: 'Admin',
        content: 'Welcome to the chat'
    }))

    ws.on('message', function incoming(message) {
        let parsedMessage;
        try {
            parsedMessage = JSON.parse(message);
            console.log(`Получено сообщение: ${parsedMessage}`);
        } catch (error) {
            console.log(`Получено неккоректное сообщение`);
            return;
        }
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(parsedMessage))
            }
        })
    })

    ws.on('close', function close() {
        console.log(`Юзер отключился`);
    })
})

console.log('WebSocket сервер запущен на порту 8080');
