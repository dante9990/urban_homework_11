const chat = document.querySelector('.chatbox');
const messageForm = document.querySelector('.chat__form');
const messageName = document.getElementById('name');
const messageInput = document.getElementById('message');

const socket = new WebSocket('ws://localhost:8080');

socket.onopen = (e) => {
    console.log('Соединение установлено');
}

socket.onmessage = (e) => {
    const message = JSON.parse(e.data);
    const messageEl = document.createElement('div')
    messageEl.classList.add('chat__message')

    if (message.type === 'system') {
        messageEl.classList.add('system__message')
    }

    messageEl.innerHTML = `
        <span>${message.name}:</span>
        <span>${message.content}</span>`;
    chat.appendChild(messageEl);
    chat.scrollTop = chat.scrollHeight;
}

socket.onclose = (e) => {
    if (e.wasClean) {
        console.log(`Соединение закрыто чисто, код=${e.code} причина=${e.reason}`);
    } else {
        console.log('Соединение прервано');
    }
}

socket.onerror = (error) => {
    console.log(`Ошибка ${error.message}`);
};

messageForm.onsubmit = (e) => {
    e.preventDefault();
    if (messageInput.value) {
        const message = {
            type: 'user',
            name: messageName.value || 'аноним',
            content: messageInput.value
        };
        socket.send(JSON.stringify(message));
        messageInput.value = '';
    }
};