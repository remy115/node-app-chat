class Users {
    constructor() {
        this.users=[];
    }
    addUser(id,name,room) {
        var user={id,name,room};
        var found;
        this.users=this.users.map((elem)=>{
            if(elem.name === user.name) {
                found=true;
                return user;
            }
            return elem;
        });
        if( ! found)
            this.users.push(user);
        return user;
    }
    removeUser(id) {
        var removedUser;
        this.users=this.users.filter((user)=>{
            if(user.id === id) {
                removedUser=user;
                return false;
            }
            return true;
        });
        return removedUser;
    }

    getUser(id) {
        var selectedUser=this.users.find(user=>user.id===id);
        return selectedUser;
    }

    getUserList(room) {
        var users=this.users.filter(user=>user.room===room);
        var namesArray=users.map(user=>user.name);
        return namesArray;
    }
    emitUserList(user,io,list) {
        var list=this.getUserList(user.room);
        io.to(user.room).emit('updateUserList',list);
    }
}

module.exports={Users};