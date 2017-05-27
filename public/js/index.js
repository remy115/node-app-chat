var socket22=io();

function f1() {

} // f1

socket22.on('connect',()=>{
    console.log('Connected to the server!');
    f1();
});


socket22.on('disconnect',()=>{
    console.log('Disconnected from the server!');
});

socket22.on('newMessage',function(data) {
    console.log('New Message arrived!',data);
});