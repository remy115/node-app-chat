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

    socket.on('disconnect',()=>{
        console.log('Client has disconnected!');
    });

});
 
app.use(express.static(publicPath));


server.listen(port,()=>{
    console.log(`Server listen on port ${port}`);
});
