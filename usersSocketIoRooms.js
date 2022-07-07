const usersRoom = [];

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = usersRoom.find(user => user.id === id);
    if (existingUser) {
        usersRoom.map(u=> u.id === id ? u.room = room : null)
        return existingUser
    }
    const user = { id, name, room }
    usersRoom.push(user);
    return { user }
}
const removeUser = (id) => {
    const indexuser = usersRoom.findIndex(user => user.id === id)
    if (indexuser !== -1) {       
        return usersRoom.splice(indexuser, 1)[0]
    }
    
}
const getUser = (id) => {
    return usersRoom.find(user => user.id === id)
}
const getUsers = () => {
    return usersRoom
}
const getUserInRooms = (room) => {
    usersRoom.filter(user => user.room === room)
}

module.exports = { addUser, removeUser, getUser, getUsers, getUserInRooms, usersRoom };