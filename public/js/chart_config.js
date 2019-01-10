 $(document).ready(function(){

var ctx = $("#myChart");
var ctx2 = $("#myChart2");
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: '°C',
            data: [],
            borderWidth: 1,
            fill: false,
            borderColor: "#4bc0c0"
        }]
    },
    options: {
       	responsive: true,
       	title: {
	      display: true,
	      text: 'Bản đồ theo dõi nhiệt độ thời gian thực'
	    },
	    layout: {
            padding: {
                left: 50,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
var myChart2 = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: '%',
            data: [],
            borderWidth: 1,
            fill: false,
            borderColor: "#4bc0c0"
        }]
    },
    options: {
       	responsive: true,
       	title: {
	      display: true,
	      text: 'Bản đồ theo dõi độ ẩm thời gian thực'
	    },
	    layout: {
            padding: {
                left: 50,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});
// $(document).ready(() => {
	$.ajax({
		url: '/getData',
		type: "POST",
		success: (res) => {
			setTimeout(() => {
				hideLoading()
			}, 4000)
            console.log(res);
			updateChart(myChart, res.key, res.value);
			updateChart2(myChart2, res.key, res.value);
		},
		error: (err) => {
			console.log(err)
		}
	})
	setInterval(() => {
		$.ajax({
		url: '/getData',
		type: "POST",
		success: (res) => {
			hideLoading()
			updateChart(myChart, res.key, res.value)
			updateChart2(myChart2, res.key, res.value)
		},
		error: (err) => {
			console.log(err)
		}
	})
	}, 5000)
// })

const updateChart = (chart, key, data) => {
	chart.data.labels = key.slice(-30)
	chart.data.datasets[0].data = data.slice(-30)
	chart.update()
}
const hideLoading = () => {
	$('.loading').hide();
}
 })