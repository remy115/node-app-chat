const path=require('path');
const publicPath=path.join(__dirname,'../','public/');
const http=require('http');
const socketIO=require('socket.io');
const port=process.env.PORT || 3000;
const express=require('express');

const {messageGenerator}=require('./utils/message.js');
const {isRealString}=require('./utils/validation');
const {Users}=require('./utils/users');

var app=express();
const server=http.createServer(app);
var io=socketIO(server);
var users=new Users();

io.on('connect',(socket)=>{
    console.log('New user connected!');


    

    socket.on('disconnect',()=>{
        console.log('Client has disconnected!');
        var removedUser=users.removeUser(socket.id);
        users.emitUserList(removedUser,io);
        io.to(removedUser.room).emit('newMessage',messageGenerator('Admin',`${removedUser.name} has left the room!`));
    });

    socket.on('join',(params,callback)=>{
        if( ! isRealString(params.name) || ! isRealString(params.room)) {
            return callback('Name and room are required!');
        }

        socket.join(params.room);
        var addedUser=users.addUser(socket.id,params.name,params.room);
        // console.log('USERLIST',users.users,'addedUser',addedUser);
        users.emitUserList(addedUser,io);

        socket.emit('newMessage',messageGenerator('Admin','Welcome to the chat app!'));
        socket.broadcast.to(params.room).emit('newMessage',messageGenerator('Admin',`${params.name} has joined!`));


        callback();
    });

    socket.on('createMessage',(data,callback)=>{
        var user=users.getUser(socket.id);
        // console.log('createMessage',data);
        callback('From server: received!');
        io.to(user.room).emit('newMessage',messageGenerator(user.name,data.text));
    });

    socket.on('createLocationMessage',(data)=>{
        var user=users.getUser(socket.id);
        // io.emit('newMessage',messageGenerator('Admin',`${data.latitude}, ${data.longitude}`));
        io.to(user.room).emit('newLocationMessage',{from:user.name,latitude:data.latitude,longitude:data.longitude});
    });

});
 
app.use(express.static(publicPath));


server.listen(port,()=>{
    console.log(`Server listen on port ${port}`);
});
