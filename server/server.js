const path=require('path');
const publicPath=path.join(__dirname,'../','public/');
const http=require('http');
const socketIO=require('socket.io');
const port=process.env.PORT || 3000;
const express=require('express');

var app=express();
const server=http.createServer(app);
var io=socketIO(server);

io.on('connect',(socket)=>{
    console.log('New user connected!');


    socket.emit('newMessage',{
        from:'Admin',
        text:'Welcome to the chat app!',
        createdAt:new Date().getTime()
    });
    socket.broadcast.emit('newMessage',{
        from:'Admin',
        text:'New user joined',
        createdAt:new Date().getTime()
    });

    socket.on('disconnect',()=>{
        console.log('Client has disconnected!');
    });

    socket.on('createMessage',(data)=>{
        data.createdAt=new Date().getTime();
        console.log('createMessage',data);
        io.emit('newMessage',{
            to:data.to,
            text:data.text,
            createdAt:data.createdAt
        });
    });

});
 
app.use(express.static(publicPath));


server.listen(port,()=>{
    console.log(`Server listen on port ${port}`);
});
