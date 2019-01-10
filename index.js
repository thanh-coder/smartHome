const express = require("express");
const session = require('express-session');
const app = express();
const path = require('path');
let JsonDB = require('node-json-db')
const PORT = 3484;									//Ð?t d?a ch? Port du?c m? ra d? t?o ra chuong trình m?ng Socket Server
const mongoose = require('mongoose');

const routes = require('./routes/index.route');

const userModel = require('./model/user.model');
const fakeData = require('./model/fakeData.model');
				//#include thu vi?n socketio
 
var ip = require('ip');
var ledStatus = [false,false];
								// Cho socket server (chuong trình m?ng) l?ng nghe ? port 3484
console.log("Server nodejs chay tai dia chi: " + ip.address() + ":" + PORT)

const port = process.env.PORT || 3484;
// const ip = process.env.IP || '127.0.0.1';
// const  = process.env.IP || '192.168.43.144';
console.log(ip);
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;



mongoose.connect('mongodb://localhost/arduino',{ useNewUrlParser: true })
.then((data)=>{
 console.log("ket noi db thanh cong")
})
.catch((err)=>{
  console.log("ket noi that bai " + err )
})

var data1;
app.set("view engine","pug");
app.set("views","./views");

app.use(session( {secret: 'lmintsecret', resave: true, saveUninitialized: false} ));
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);

// chứng thực người dùng bằng phương pháp local
passport.use(new localStrategy(
  async (username, password, done) => {
    const user = await userModel.findOne({ username: username });
    if(user && user.password == password) { return done(null, user) }
    else { return done(null, false) }       
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  userModel.findById(id)
    .then((user) => { done(null, user) })
    .catch((err) => console.log(err));
});






const db  = new JsonDB("temps", true, true) // Create a database to save temperature data, included temp value and time
const db2  = new JsonDB("status", true, true) // Create a database to save relay status




// program

const addData = (data) => {
  try{
      let value = parseFloat(data.temp) // Get float data
      let now = new Date()
      let key = now.getDate()+"/"+(now.getMonth()+1)+"/"+now.getFullYear()+" "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds();
      db.push('/temp[]', {
          time: key,
          value: value
      })
  } catch (error) {
      console.log(error)
  }
}






const getData1 = async () => {
  let key = []
  let value = []
  let value1 = []
  //cái get data là cái fake dât này à
  var result = await fakeData.find().exec()
    for (var i = 0; i <result.length; i++) {
      let info = result[i]
      key.push(info.date)
      value.push(info.temp)
      value1.push(info.hum);
    
  }
  //console.log(key);
  return {
    key,
    value,
    value1
}
}

const getData = () => {
  let key = []
  let value = []
  let values = db.getData("/temp")
  console.log('value_info',values);
  for (i = 0; i < values.length; i++) {
      let info = values[i]
      key.push(info.time)
      value.push(info.value)
  }
  return {
      key: key,
      value: value
  }
}

app.post('/getData', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  
getData1().then(data => {
      //console.log('data1:',data)
   res.send(JSON.stringify(data))

})
.catch(err => console.log(err))
   // res.send(JSON.stringify(data))
})
const server = require("http").Server(app); 
// const io = require("socket.io");

// const socketIO = require('./socket.io/socket-io')(server);
const io = require('socket.io').listen(server);
var listActive = [];
var listMess = [];
var time;

io.sockets.on("connection", function (socket) {
  // check client kết nối thì báo
  

  console.log("Client connected");
  /****************** Node MCU 1 **********************/

 
// Khi nhận được sự kiện bấm nút trên web thay đổi trạng thái của led thì chuyển tiếp cho client khác.
     // Nếu wemos điều khiển đèn bắt được sự kiện này. Nó sẽ lập tức thay đổi màu, trạng thái của bóng đèn
  socket.on('led-change', function(data) {

    socket.broadcast.emit('LED', data);
    console.log('Change led status'.gray);
  
});

socket.on('LED_STATUS', function(status) {
  //Nh?n du?c thì in ra thôi hihi.
  console.log("recv LED", status)
})

socket.on('PIR', function(status) {
  //Nh?n du?c thì in ra thôi hihi.
  console.log("recv PIR", status)
  socket.broadcast.emit("PIR", status);

})


socket.on('GAS', function(status) {
  console.log("recv GAS", status)
  socket.broadcast.emit("GAS", status);

})

  // nhận sự kiện từ arduino 


socket.on('DHT', function(data) {
  console.log("recv DHT", data)

  socket.broadcast.emit("DHT11", data);

})

socket.on('DHT11', function(data) {
  console.log("recv DHT11:",data)

  var fakedata = new fakeData({
    temp:data.temperature,
    hum :data.humidity
  })
  fakedata.save()
  .then(res =>{
     console.log("luu database:",res)
     fakeData.find().count()
     .then(count => {
       if(count>=50){
         fakeData.remove({}).then(ok => console.log("xoa record"))
       }
     })
  })
  .catch(err => console.log(err))
})
 
  socket.on("fan-change", function (data) {
    socket.broadcast.emit("MOTOR", data);
  });

  socket.on("MOTOR_STATUS", function (data) {
console.log("motor recei:",data)
 });
  
  socket.on("setTime1", function (data) {
    time1 = data;
    io.sockets.emit("sycnTime1", data);
    console.log(time1);
    console.log(data.sgio);
    console.log(data.sphut);
    // chia chuỗi json thành các chuỗi json đơn cho nodeMCU
    socket.broadcast.emit("startTime1", { "sgio": data.sgio });
    socket.broadcast.emit("startTime2", { "sphut": data.sphut });

  });
  socket.on("setTime2", function (data) {
    time2 = data;
    io.sockets.emit("sycnTime2", data);
    console.log(time2);
    // chia chuỗi json thành các chuỗi json đơn cho nodeMCU
    socket.broadcast.emit("endTime1", { "egio": data.egio });
    socket.broadcast.emit("endTime2", { "ephut": data.ephut });
  });
  // lấy giá trị textnode thẻ p khi set giờ đồng bộ các client 
  socket.on("allTime", function (data) {
    io.sockets.emit("allTime", data);
  });
});

server.listen(port);