var InitializeRelay = (socketAddr, messageCallback) => {
    const socket = new WebSocket("ws://127.0.0.1:7602");

    socket.addEventListener("message", messageCallback);
};