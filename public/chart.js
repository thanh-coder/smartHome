// bieu do 1
window.onload = function () {
    var dataPoints = [], dataPoints2 = [];

    const fakeTemp = document.querySelector('#chartContainer span').textContent.split(',');
    for(i of fakeTemp) {
        dataPoints.push({y: Number(i)});
    }
    var chart = new CanvasJS.Chart("chartContainer", {
        title: {
            text: "Dynamic Data",
            fontFamily: "Roboto",
            fontWeight: 300,
            margin: 20
        },
        data: [{
            type: "spline",
            dataPoints: dataPoints
        }
        ]
    });

    const fakeHumi = document.querySelector('#chartContainer2 span').textContent.split(',');
    for(j of fakeHumi) {
        dataPoints2.push({y: Number(j)});
    }
    var chart2 = new CanvasJS.Chart("chartContainer2", {
        title: {
            text: "Dynamic Data",
            fontFamily: "Roboto",
            fontWeight: 300,
            margin: 20
        },
        data: [{
            type: "spline",
            dataPoints: dataPoints2
        }
        ]
    });

    chart.render();
    chart2.render();

    var yVal = 15, updateCount = 0;
    var updateChart = function () {
        // yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
        // updateCount++;
        yVal = parseInt(document.getElementById("temperature").textContent);
        dataPoints.push({
            y: yVal
        });
        chart.options.title.text = "Biểu đồ nhiệt độ"; //+ updateCount
        chart.render();
    };

    var yVal2 = 15, updateCount = 0;
    var updateChart2 = function () {
        // yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
        // updateCount++;
        yVal2 = parseInt(document.getElementById("humidity").textContent);
        dataPoints2.push({
            y: yVal2
        });
        chart2.options.title.text = "Biểu đồ độ ẩm"; //+ updateCount
        chart2.render();
    };
    // update chart every second
    setInterval(function () { updateChart(); updateChart2()  }, 2000);
}	
