var socket22=io();

function scrollToBottom() {
    var messagesDiv=$('#messages-display');
    var newMessage=messagesDiv.children('li:last-child');

    var scrollHeight=messagesDiv.prop('scrollHeight');
    var scrollTop=messagesDiv.prop('scrollTop');
    var clientHeight=messagesDiv.prop('clientHeight');
    var newMsgHeight=newMessage.innerHeight();
    var lastMsgHeight=newMessage.prev().innerHeight();

    if(scrollTop+clientHeight+newMsgHeight+lastMsgHeight >= scrollHeight) {
        // console.log('scroll!');
        messagesDiv.scrollTop(scrollHeight);
    }

}

function emitMessage(from,text) {
    var objMsg={from,text};
    socket22.emit('createMessage',objMsg,function(data) {
        // console.log('Acknoledgment from server: ',data);
        $('#message').val('');
    });
} // f1

function addMessage(params) {
    var from=params.from;
    var text=params.text;
    var templateId=params.templateId || 'message-template'
    templateId='#'+templateId;
    var formattedTime=moment(params.createdAt).format('H:mm');
    // var msgHtml=`<li>${from} [${formattedTime}]: ${text}</li>`;
    var template=$(templateId).html();
    var msgHtml=Mustache.render(template,{
        from,
        createdAt:formattedTime,
        text
    });
    $('#messages-display').append(msgHtml);
    scrollToBottom();
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
    // var lnk=`<a href="https://www.google.com/maps?q=${latitude},${longitude}">Location</a>`;
    var lnk=`https://www.google.com/maps?q=${latitude},${longitude}`;
    addMessage({from:'Admin',text:lnk,templateId:'location-message-template'});
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
