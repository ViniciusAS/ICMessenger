
angular.module('icmessenger.messages', [])

.service('MessageService', function() {

  // STARTING STUFF begin
      var socket = io('http://31.220.22.185:2474');

      var startedCallback = NaN;
      this.start = function( name, image, callback ){
          startedCallback = callback;
          console.log("starting");
          socket.emit( 'start', { name:name, image:image });
      };
      socket.on('started',function(){
          if ( startedCallback == NaN )
            return;
        console.log("started");
          startedCallback();
      });
  // starting stuff end



  // GET MESSAGES start
      var getMessagesCallback = NaN;
      this.getMessages = function(callback){
          getMessagesCallback = callback;
          socket.emit( 'getMessages' );
      };
      socket.on('receiveMessages',function(data){
          if ( getMessagesCallback == NaN )
            return;
          getMessagesCallback( data );
      });
  // get messages end



  // RECEIVE MESSAGES begin
      var receiveMessagesCallback = NaN;
      this.receiveMessages = function(callback){
          receiveMessagesCallback = callback;
      };
      socket.on('newMessage',function(message){
          if ( receiveMessagesCallback == NaN )
            return;
          receiveMessagesCallback(message);
      });
  // receive messages end



  // SEND MESSAGE begin
      var sendMessageCallback = NaN;
      this.sendMessage = function( message, callback ){
          sendMessageCallback = callback;
          socket.emit( 'newMessage', message );
      };
      socket.on('messageSent',function(data){
          if ( sendMessageCallback == NaN )
            return;
          sendMessageCallback(data.sent);
          sendMessageCallback = NaN;
      });
  // send message end



  return this;
});
