$(document).ready(function(){
    var socket = io.connect('http://127.0.0.1:3484');
    socket.on('connect', function(){
        socket.emit('get-led-status');
    })

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
    var led = [false, false]
    //bấm nút để cho đèn sáng
    $('#control .button-group input#san').change(function (event) {
        console.log("nut duoc nhan")
        var data;
        if ($(this).prop('checked')) {
           led[0]=true;
           led[1]=true;
            
            data = {"led": led};
            $('#status .icon-group .den ion-icon[name="bulb"]').addClass("active")
            $('#control .button-group p.textden').html("bật đèn")

        } else {
            led[0]=false;
            led[1]=false;
            data = {"led": led};
            $('#status .icon-group .den ion-icon[name="bulb"]').removeClass("active")
            $('#control .button-group p.textden').html("tắt đèn")


        }
    
        socket.emit('led-change', data);
    });

    // bấm nút để cho quạt chạy
    $('#control .button-group  input#ngu1').change(function (event) {
        console.log("nut duoc nhan")
        var data;
        if ($(this).prop('checked')) {
            data = {"fan": 1};
            $('#status .icon-group .quat ion-icon[name="aperture"]').addClass("active")
            $('#control .button-group p.textquat').html("bật quạt")

        } else {
            data = {"fan": 0};
            $('#status .icon-group .quat ion-icon[name="aperture"]').removeClass("active")
            $('#control .button-group p.textquat').html("tắt quạt")


        }
    
        socket.emit('fan-change', data);
    });
    // bấm nút để báo cháy
    $('#control .button-group  input#ngu2').change(function (event) {
        console.log("nut duoc nhan")
        var data;
        if ($(this).prop('checked')) {
            data = {status: 1};
            $('#status .icon-group .chay ion-icon[name="bonfire"]').addClass("active")
            $('#control .button-group p.textgas').html("có khí gas")

        } else {
            data = {status: 0};
            $('#status .icon-group .chay ion-icon[name="bonfire"]').removeClass("active")
            $('#control .button-group p.textgas').html("không gas")


        }
    
        socket.emit('fan-change', data);
    });

    //bấm nút chống trộm
    $('#control .button-group  input#bep').change(function (event) {
        console.log("nut duoc nhan")
        var data;
        if ($(this).prop('checked')) {
            data = {status: 1};
            $('#status .icon-group .trom ion-icon[name="walk"]').addClass("active")
            $('#control .button-group p.textpir').html("bật chống trộm")
        } else {
            data = {status: 0};
            $('#status .icon-group .trom ion-icon[name="walk"]').removeClass("active")
            $('#control .button-group p.textpir').html("tắt chống trộm")


        }
    
        socket.emit('fan-change', data);
    });

    socket.on('DHT11',function(data){
        $('span#temperature').html(data.temperature);
        $('span#humidity').html(data.humidity);

        console.log(data);
    })

    socket.on('PIR',function(data){
     
         if(data.pir==1){
            $('#status .icon-group .trom ion-icon[name="walk"]').addClass("active")
            $('#control .button-group  input#bep').prop('checked',true);
            $('#control .button-group p.textpir').html("bật chống trộm")



         }
         else{
            $('#status .icon-group .trom ion-icon[name="walk"]').removeClass("active")
            $('#control .button-group  input#bep').prop('checked',false);
            $('#control .button-group p.textpir').html("tắt chống trộm")



         }
        console.log(data);
    })

    socket.on('GAS',function(data){
        if(data.gas==0){
            console.log("nhan duoc khi ga")
            $('#status .icon-group .chay ion-icon[name="bonfire"]').addClass("active")
            $('#control .button-group  input#ngu2').prop('checked',true);
            $('#control .button-group p.textgas').html("có khí gas")


        }
        else{
            console.log("khong nhan duoc gas")
            $('#status .icon-group .chay ion-icon[name="bonfire"]').removeClass("active")
            $('#control .button-group  input#ngu2').prop('checked',false);
            $('#control .button-group p.textgas').html("không gas")




        }

        console.log(data);
    })
    

})