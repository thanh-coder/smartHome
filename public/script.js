var socket = io("http://192.168.1.200:3000");
var sycnTimeValue1;
var sycnTimeValue2;
//xử lý đồng bộ tín hiệu điều khiến client web mới kết nối id+on
socket.on("sync", function (data) {
    for (i in data) {
        var xxx = data[i].slice(0, data[i].indexOf('o'));
        document.getElementById(xxx).checked = true;
    }
});

// đợi html load xong mới làm cái này
document.addEventListener("DOMContentLoaded", function () {
    // code moi
    var setHour = document.querySelectorAll(".setHour");
    var setMinute = document.querySelectorAll(".setMinute");
    var submitButton = document.getElementById("set");

    var controlButton = document.querySelectorAll('#control input[type="checkbox"]');
    for (x of controlButton) {
        x.onchange = function () {
            if (this.checked) { socket.emit("s-on", this.getAttribute("id") + "on") }
            else { socket.emit("s-on", this.getAttribute("id") + "off") }
        }
    }

    submitButton.onclick = function () {

    }

    for (x of setHour) {
        x.addEventListener("keyup", function () {
            if (this.value > 23 || this.value < 0) {
                if (this.value > 23) { this.value = "" }
                else if (this.value < 0) { this.value = "" }
            }
            if(this.value > 0 && this.value.startsWith("0")) {
                this.value = Number(this.value);
            }
        });
    }

    for (y of setMinute) {
        y.addEventListener("keyup", function () {
            if (this.value > 59 || this.value < 0) {
                if (this.value > 59) { this.value = "" }
                else if (this.value < 0) { this.value = "" }
            }
            if(this.value > 0 && this.value.startsWith("0")) {
                this.value = Number(this.value);
            }
        });
    }



    // code cu
    // var x = document.querySelectorAll(".control");
    // for (i of x) {
    //     //duyệt từng phần tử trong mảng
    //     i.addEventListener("click", function () {
    //         //thêm sự kiện click
    //         this.classList.toggle("active");
    //         //thêm class active
    //         var c = this.getAttribute("id");
    //         // nếu phần tử i có class active + on ngược lại + off
    //         //phân biệt dựa trên id để  server gửi tín hiệu bật hoặc tắt với id không trùng
    //         socket.emit("s-on", (this.classList[1] == 'active') ? c + "on" : c + "off");

    //     });
    // }


    // xy ly dong bo time
    var setTime = document.querySelector("#set");
    setTime.addEventListener("click", function () {
        var sgio = document.getElementById("sgio").value;
        var sphut = document.getElementById("sphut").value;
        var egio = document.getElementById("egio").value;
        var ephut = document.getElementById("ephut").value;
        if (sgio != "" && sphut != "" && ephut != "" && ephut != "") {
            socket.emit("setTime1", { "sgio": sgio, "sphut": sphut });
            socket.emit("setTime2", { "egio": egio, "ephut": ephut });
            document.getElementById("sgio").value = "";
            document.getElementById("sphut").value = "";
            document.getElementById("egio").value = "";
            document.getElementById("ephut").value = "";
        }
        else {
            document.getElementById("timeSet").innerHTML = "Ô giờ phút không được trống";
        }

    });

});

// gui set time len server dong bo cac client
socket.on("sycnTime1", function (data) {
    var val = "Bắt đầu: " + data.sgio + ":" + data.sphut;
    sycnTimeValue1 = val;
});
socket.on("sycnTime2", function (data) {
    var val = " Kết thúc: " + data.egio + ":" + data.ephut;
    sycnTimeValue2 = val;
    if (sycnTimeValue1 != "" && sycnTimeValue2 != "") {
        
        document.getElementById("timeSet").innerHTML = sycnTimeValue1 + sycnTimeValue2;
    }
});

// đồng bộ thời gian setTime khi client mới kết nối vào
setInterval(function () {
    var tagPtimeSetId = document.getElementById("timeSet").textContent;
    if (tagPtimeSetId.length > 16 && tagPtimeSetId.indexOf('Ô') == -1) {
        socket.emit("allTime", tagPtimeSetId);
    }
    socket.on("allTime", function (data) {
        document.getElementById("timeSet").innerHTML = data;
    });
}, 2000);


//xử lý đồng bộ các client khi nhấn nút
socket.on("ctr", function (data) {
    //lấy giá trị chuổi json server phát
    var d = data.tinhieu;
    // cắt chuỗi để lấy lại ID ban đầu + on hoặc off
    var getID = d.slice(0, d.indexOf('o'));
    // nếu bỏ id mà còn chuỗi on thì các client có id trên đều add class active
    if (d.slice(d.indexOf('o'), d.length) == "on") {
        // document.getElementById(getID).classList.add("active");
        document.getElementById(getID).checked = true;
    }
    // ngược lại bỏ class active ra
    else {
        // document.getElementById(getID).classList.remove("active");
        document.getElementById(getID).checked = false;
    }
});

//xử lý đồng bộ các nút thông báo
socket.on("fan-on", function (data) {
    var fan = document.querySelector("#fan span");
    fan.innerHTML = "Quạt manual";
    fan.classList.remove("active");
    fan.checked = false;
});
socket.on("fan-off", function (data) {
    var fan = document.querySelector("#fan span");
    fan.innerHTML = "Quạt Auto";
    fan.classList.add("active");
    fan.checked = true;
});
socket.on("messFan", function (data) {
    for (i in data) {
        if (data[i] == "quat") {
            // document.getElementById("fan").classList.remove("active");
            document.getElementById("fan").checked = true;
        }
    }
});

// lắng nghe sự kiên lấy nhiệt độ độ ẩm từ arduino gửi lên server
socket.on("h-status", function (data) {
    var hud = parseInt(data.giatri);
    document.getElementById("humidity").innerHTML = "Đ.ẩm: " + hud.toFixed(0) + "%";
});
socket.on("t-status", function (data) {
    var temp = parseInt(data.giatri);
    document.getElementById("temperature").innerHTML = "N.độ: " + temp.toFixed(0) + "&degC";
});

/* NODE MCU 2*/
socket.on("srain", function (data) {
    if (data.srain == "yes") {
        var xxx = document.getElementById("rain");
        xxx.classList.add("active");
        xxx.innerHTML = "Có mưa";
    }
    else {
        var xxx = document.getElementById("rain");
        xxx.classList.remove("active");
        xxx.innerHTML = "Không mưa";
    }

});
socket.on("sfire", function (data) {
    if (data.chay == "yes") {
        var xxx = document.getElementById("fire");
        xxx.classList.add("active");
        xxx.innerHTML = "Có lửa";
    }
    else {
        var xxx = document.getElementById("fire");
        xxx.classList.remove("active");
        xxx.innerHTML = "Không lửa";
    }
});
socket.on("trom", function (data) {
    if (data.trom == "yes") {
        var xxx = document.getElementById("thief");
        xxx.classList.add("active");
        xxx.innerHTML = "Có trộm";
    }
    else {
        var xxx = document.getElementById("thief");
        xxx.classList.remove("active");
        xxx.innerHTML = "Không trộm ";
    }
});