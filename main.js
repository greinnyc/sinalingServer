var app = require('http').createServer();
var io = require('socket.io')(app);
var _ = require('lodash');

app.listen(8080);
    var users = [];
io.on('connect', function (socket) {
    socketId = socket.id;//id de usuario
//    
//    
    //evento que se dispara cuando un usuario de loguea
    socket.on('login',function(data){
            var socketId = socket.id;//id de usuario
            var user = new Object();//se crea el objeto usuario
            user.username = data.username;
            user.room = data.room;
            user.status = "connect";
            user.socketId = socketId;
            users.push(user);//se agrega a la lista de usuarios
            socket.join(user.room);//se agrega el usuario a la sala indicada
    });
    //evento que se ejecuta cuando se desconecta un usuario
    socket.on('disconnect', function(){
        //borra el usuario desconectado de users
        _.remove(users, {socketId:socket.id});
    });
    
    //emite la invitacion a todos los monitores sin distinguir su status
    socket.on('invitation',function(data){
        console.log('invitation',data);
        user =_.find(users,data);
        io.to('monitor').emit('calibration',user);//invitaciona  cada monitor
    });
 
    //emite cuando un usuario acepta la invitacion
    socket.on('accepted',function(data){
        console.log('accepted',data);
        connectUser =_.find(users,{'username':data.connectUser});
        //emite a un usuario en especifico
        io.to(`${connectUser.socketId}`).emit('userAccepted', data.user);
    });
    
    
    socket.on('rejectecd',function(data){
        //revisa si quedan usuarios por aceptar la invitacion
    });
    
    socket.on('offer',function(data){
        console.log("data",data);
        connectUser =_.find(users,{'username':data.connectUser});
        io.to(`${connectUser.socketId}`).emit('offer', data);
    });
    
    socket.on('answer',function(data){
        connectUser =_.find(users,{'username':data.connectUser});
        io.to(`${connectUser.socketId}`).emit('answer', data);
    });
    
    socket.on('candidate',function(data){
        console.log('candidate',data);
        connectUser =_.find(users,{'username':data.connectUser});
        io.to(`${connectUser.socketId}`).emit('candidate', data);
    });
    
});