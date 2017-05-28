var socket22=io();

function emitMessage(from,text) {
    var objMsg={from,text};
    socket22.emit('createMessage',objMsg,function(data) {
        console.log('Acknoledgment from server: ',data);
        $('#message').val('');
    });
} // f1

function addMessage(params) {
    var from=params.from;
    var text=params.text;
    var formattedTime=moment(params.createdAt).format('H:mm');
    var msgHtml=`<li>${from} [${formattedTime}]: ${text}</li>`;
    $('#messages-display').append(msgHtml);
}

socket22.on('connect',()=>{
    console.log('Connected to the server!');
    // f1();
});


socket22.on('disconnect',()=>{
    console.log('Disconnected from the server!');
});

socket22.on('newMessage',function(data) {
    console.log('New Message arrived!',data);
    addMessage(data);
});

socket22.on('newLocationMessage',function(data) {
    var latitude=data.latitude;
    var longitude=data.longitude;
    var lnk=`<a href="https://www.google.com/maps?q=${latitude},${longitude}">Location</a>`;
    addMessage({from:'Admin',text:lnk});
});


/* socket22.emit('createMessage',{
    from:'client',
    text:'emitting from client!'
},function(data) {
    console.log('server acknoledgment',data);
}); */


$('#message-form').on('submit',function(evt) {
    evt.preventDefault();
    var msg=$('#message').val();
    emitMessage('User1',msg);
});

var locationButton=$('#send-location');
locationButton.on('click',function(evt) {
    if( ! navigator.geolocation) {
        return alert('Geolocation not support by your browser!');
    }
    var originalText=locationButton.text();
    locationButton.prop('disabled',true).text('Sending location...');

    navigator.geolocation.getCurrentPosition(function(position) {
        locationButton.prop('disabled',false).text(originalText);
        console.log(position);
        socket22.emit('createLocationMessage',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        });
    },function(err) {
        locationButton.prop('disabled',false).text(originalText);
        alert('unable to fetch location',err);
    });
});
