var express = require('express');
var app = express();
var _findIndex = require('lodash/findIndex') // npm install lodash --save
var server = require('http').Server(app);
var port = (process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 6969);
var io = require('socket.io')(server);
server.listen(port, () => console.log('Server running in port ' + port));

var userOnline = []; //danh sách user dang online
var userList = [];
io.on('connection', function(socket) {
    console.log(socket.id + ': connected');
    if(userList.length == 0) {
        userList.push({id: socket.id, name: "Thinh"});
        io.to(socket.id).emit('name', "Thinh"); //gui cho socket client nhat name
    } else if(userList.length == 1 && userList[0].name == "Thinh") {
        userList.push({id: socket.id, name: "Hung"});
        io.to(socket.id).emit('name', "Hung"); //gui cho socket client nhat name
    } else {
        userList.push({id: socket.id, name: "Thinh"});
        io.to(socket.id).emit('name', "Thinh"); //gui cho socket client nhat name
    }
    io.to(socket.id).emit('id', socket.id); //gui cho socket client nhat id
    
    //lắng nghe khi người dùng thoát
    socket.on('disconnect', function() {
        console.log(socket.id + ': disconnected');
        $index = _findIndex(userList, ['id', socket.id]);
        userList.splice($index, 1);
        // userOnline.splice($index, 1);
        // io.sockets.emit('updateUesrList', userOnline);
    })
    //lắng nghe khi có người gửi tin nhắn
    socket.on('newMessage', data => {
        //gửi lại tin nhắn cho tất cả các user dang online
        let name = "unknow";
        for(let i =0; i< userList.length; i++) {
            if(userList[i].id == data.id) {
                name = userList[i].name; 
            }
        } 
        console.log("name, socket.id: ", name + "   " + data.id)
        io.sockets.emit('newMessage', {
            id: socket.id,
            data: data.message,
            name: name
        });
    })
    //lắng nghe khi có người login
    socket.on('login', data => {
        // kiểm tra xem tên đã tồn tại hay chưa
        if (userOnline.indexOf(data) >= 0) {
            socket.emit('loginFail'); //nếu tồn tại rồi thì gửi socket fail
        } else {
            // nếu chưa tồn tại thì gửi socket login thành công
            socket.emit('loginSuccess', data);
            userOnline.push({
                id: socket.id,
                name: data
            })
            io.sockets.emit('updateUesrList', userOnline);// gửi danh sách user dang online
        }
    })

});

app.get('/', (req, res) => {
    res.send("Home page. Server running okay.");
})