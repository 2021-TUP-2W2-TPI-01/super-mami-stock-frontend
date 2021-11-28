const wsURL = "https://ws-stockeanding.herokuapp.com";

connectServer();

function connectServer() {
    const socket = io(wsURL);
    
    socket.emit('join room', `user:${user_info_username()}`);
    socket.emit('join room', `role:${user_info_tipo_rol()}`);

    socket.on("notifications", (notification) => {
        newNotification(notification.body, notification.date);
    });
    
}