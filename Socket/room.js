module.exports = (io, socket) => {
    const joinRoom = (data) => {
        socket.join(data);
    }

    const leaveRoom = (data) => {
        socket.leave(data);
    }

    socket.on("join_room", joinRoom);

    socket.on("leave_room", leaveRoom);
}