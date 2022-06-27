module.exports = (io, socket) => {
    const sendRoomMessage = (data) => {
        socket.to(data.room).emit("receive_message", data);
    }

    const sendPrivateMessage = (data) => {
        console.log(data);
        const sendUserSocket = onlineUsers.get(data.to);
        socket.to(sendUserSocket).emit("receive_private_message", data);
    }

    socket.on("send_message", sendRoomMessage);
    socket.on("send_private_message", sendPrivateMessage);
}