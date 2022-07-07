const socketUserConnect = [];

const saveUser = ({ id, name, socketId }) => {
    name = name.trim().toLowerCase();
    id = id.trim().toLowerCase();

    const existingUser = socketUserConnect.find(user => user.id === id);
    if (existingUser) {
        socketUserConnect.map(u=> u.id === id ? u.socketId = socketId:null)
        return existingUser
    }
    const user = { id, name, socketId }
    socketUserConnect.push(user);
    return { user }
}

const deleteUser = (id) => {
    const indexuser = socketUserConnect.findIndex(user => user.id === id)
    if (indexuser !== -1) {
        return users.splice(indexuser, 1)[0]
    }

}

const fetchUser = (id) => {
    return socketUserConnect.find(user => user.id === id)
}

module.exports = {saveUser, deleteUser, fetchUser, socketUserConnect}