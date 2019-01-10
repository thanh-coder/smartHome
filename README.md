Em làm theo cách 2 thì làm sao để server chỉ gửi event "fetch-timeout" cho riêng thằng client đang request tới ạ, còn các clients khác thì ko nhận đc
khi bắt sự kiện từ Client, có 2 cách để emit lại cho sender:
- Socket.emit () cái này là socket từ server
- socket.on('eventName', (client) => {}) cái client này chính là thằng client mà gửi event này tới Server. lấy client này emit lại. client.emit('fetch-timeout')

  var fakedata = new fakeData({
    temp:data.temperature,
    hum :data.humidity
  })

  chart.data.labels = key.slice(-30)
	chart.data.datasets[0].data = data.slice(-30)
    
  chart.data.labels = key.slice(-30)
	chart.data.datasets[0].data = data.slice(-30)

      a=a + 1;
  res.setHeader('Content-Type', 'application/json');
  fakeData.find().exec()
  .then(result => {
    res.send(JSON.stringify(result[a]));
  
  })
  .catch(err => console.log('co loi' + err))

        socket.emit('get-led-status');

  socket.on('led-status', function(data) {
        console.log('led-status');
        console.log(data);
        ledStatus = data.status;
        if (data.status) {
            console.log(ledStatus);
            console.log('ledStatus true');
            $('#status .icon-group:nth-child(4)').addClass('active');
        } else {
            console.log(ledStatus);
            console.log('ledStatus false');
            console.log(ledStatus);
        }
    });

    
  //khi vừa kết nối đến server web client sẽ gửi sự kiện để lấy trạng thái ban đầu của led
  socket.on('get-led-status', function() {
    var data = {
        status: "",
        color: ""
    };
    socket.emit('led-status', data);
});

mongoose.connect('mongodb://localhost/arduino',{ useNewUrlParser: true })
.then((data)=>{
 console.log("ket noi db thanh cong")
})
.catch((err)=>{
  console.log("ket noi that bai " + err )
})

http://programmerblog.net/send-sms-using-nodejs/