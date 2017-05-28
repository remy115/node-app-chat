const path=require('path');
const publicPath=path.join(__dirname,'../','public/');
const http=require('http');
const socketIO=require('socket.io');
const port=process.env.PORT || 3000;
const express=require('express');

const {messageGenerator}=require('./utils/message.js');

var app=express();
const server=http.createServer(app);
var io=socketIO(server);

io.on('connect',(socket)=>{
    console.log('New user connected!');


    socket.emit('newMessage',messageGenerator('Admin','Welcome to the chat app!'));
    socket.broadcast.emit('newMessage',messageGenerator('Admin','New user joined'));

    socket.on('disconnect',()=>{
        console.log('Client has disconnected!');
    });

    socket.on('createMessage',(data,callback)=>{
        console.log('createMessage',data);
        callback('From server: received!');
        io.emit('newMessage',messageGenerator(data.from,data.text));
    });

    socket.on('createLocationMessage',(data)=>{
        // io.emit('newMessage',messageGenerator('Admin',`${data.latitude}, ${data.longitude}`));
        io.emit('newLocationMessage',{latitude:data.latitude,longitude:data.longitude});
    });

});
 
app.use(express.static(publicPath));


server.listen(port,()=>{
    console.log(`Server listen on port ${port}`);
});
