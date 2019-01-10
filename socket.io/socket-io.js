var listActive = [];
var listMess = [];
var time;

const io = require("socket.io");

module.exports = function (server) {
  io(server).on("connection", function (socket) {
    // check client kết nối thì báo
    console.log("Client connected");
    /****************** Node MCU 1 **********************/
    // io.sockets.emit("sync", listActive);
    // io.sockets.emit("messFan", listMess);
    // nhận tín hiệu từ web client sau đó phát về arduino
    // đồng thời client web cũng lấy xử lý đồng bộ
    socket.on("s-on", function (data) {
      console.log(data);
      var kt = data.slice(data.indexOf('o'), data.length);
      var rm = data.slice(0, data.indexOf('o'));
      socket.broadcast.emit("ctr", { "tinhieu": data });
      var flag_data = 0;// điều kiện để thêm id vào mảng
      if (kt == "on") { // nếu client web muốn bật thiết bị
        for (i in listActive) {
          if (i == data) flag_data++;
        }
      }
      else {
        // ngược lại nếu client web mún tắt thiết bị thì loại bỏ phần tử trong mảng
        listActive.splice(listActive.indexOf(rm += "on"), 1);
      }
      // nếu đk ok và client web mún bật thiệt bị thì add id vào mảng
      // để khi có client web mới vào ta dựa vảo mảng này để add class active
      // hiển thị đúng trạng thái mở với các client web đang hoạt động.
      if (flag_data == 0 && kt == "on") listActive.push(data);
      console.log(listActive);
    });
    //nhận tín hiệu quạt on - off
    socket.on("fan-auto-on", function (data) {
      socket.broadcast.emit("fan-on", data);
      if (listMess.indexOf("fan") == -1) {
        listMess.push(data.sfan);
      }
    });

// tắt tín hiệu quạt
    socket.on("fan-auto-off", function (data) {
      socket.broadcast.emit("fan-off", data);
      listMess.splice(listMess.indexOf("fan"), 1);
    });
 
    //nhan tin hieu den on-off
    socket.on("flight-auto-on", function (data) {
      socket.broadcast.emit("flight-on", data);
      if (listMess.indexOf("flight") == -1) {
        listMess.push(data.sflight);
      }    });
 

    socket.on("flight-auto-off", function (data) {
      socket.broadcast.emit("flight-off", data);
      listMess.splice(listMess.indexOf("flight"), 1);
    });

    // nhận sự kiện từ arduino 
    socket.on("test", function (data) {
      console.log(data);

    });
    socket.on("test2", function (data) {
      console.log(data);

    });

    // nhận nhiệt độ độ ẩm từ cảm biến gửi client web
    socket.on("h", function (data) {
      io.sockets.emit("h-status", data);
    });
    socket.on("t", function (data) {
      io.sockets.emit("t-status", data);
    });

    /****************** Node MCU 2*********************/
    socket.on("test1", function (data) {
      console.log(data);

    });
    socket.on("rain", function (data) {
      socket.broadcast.emit("srain", data);
    });
    socket.on("fire", function (data) {
      socket.broadcast.emit("sfire", data);
    });
    socket.on("thief", function (data) {
      socket.broadcast.emit("trom", data);
    });

    // xử lý set thời gian từ clien web

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
}