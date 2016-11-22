const PORT = 2474;

// dependencies
var io = require('socket.io').listen( PORT );

var messages = [];
io.use(function(socket, next) {
  console.log("SocketIO > Connected socket "+socket.id);
  next();

  var userData;
  socket.on('start', function(data){
      userData = data;
      if ( userData.name == undefined ){
          userData.nome = "";
          userData.image = "";
      }
      console.log("User started with: "+userData.name);
      socket.emit('started',{});
  });
  socket.on('disconnect', function () {
      console.log('SocketIO > Disconnected socket ' + socket.id);
  });

  // GET MESSAGES
  socket.on('getMessages',function(){
      socket.emit('receiveMessages', messages);
  });


  // SENd MESSAGES service
  //socket.emit('newMessage',messageData);
  socket.on('newMessage',function(data){
      var message = {
          name : userData.name,
          image : userData.image,
          message : data
      };
      messages.push(message);
      if ( messages.length > 50 )
        messages.shift();
      console.log("New message from "+message.name+": "+data);
      socket.broadcast.emit('newMessage',message);
      socket.emit('messageSent',{sent:true});
  });

});
