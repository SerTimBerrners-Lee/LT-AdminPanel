
$(document).ready(function() {

    // Здесь делаем запрос на сервер чтобы получить популярность секций и их наименование 
    $.ajax({
        url: '/api/get-statistic-section',
        type: 'get',
        success: function(data) {
            let sectionName = [];
            let popular = [];
        
            let promis = new Promise((resolve, reject) => {
                Object.values(data).map((el, index, arr) => {
                    sectionName.push(el.name);
                    popular.push(el.popular);
                    if(index === arr.length -1) resolve()
                })
            })
            
            promis.then(() => {
                twoFieltCanvas(sectionName, popular)
            }) 
        }
    })
    
    $.ajax({
        type: 'get',
        url: '/api/get-statistic/users',
        success: function(data) {
           oneFieltCanvas(data.length)
        }
    })
})




var ctx = document.getElementById('myChart').getContext('2d');
var ctxs = document.getElementById('myCharts').getContext('2d');

var oneFieltCanvas = (users = 1) => {
    var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Март', '-' ],
                datasets: [{
                label: 'Количество посещений',
                data: [0, users],
                backgroundColor: [
                    'rgb(115,134,213, 0.2)'
                ],
                borderColor: [
                    'rgba(115,134,213, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });
}


var twoFieltCanvas = (sectionName, popular) => {

    var myDoughnutChart = new Chart(ctxs, {
        type: 'doughnut',
        data: {
            labels: [...sectionName],
                datasets: [{
                data: [...popular],
                backgroundColor: [
                    'rgb(115,134,213, 1)',
                    'rgb(255,205,86, 1)',
                    'rgb(255,99,132, 1)',
                    'rgb(57,230,57, 1)',
                    'rgb(255,120,0, 1)',
                    'rgb(106,72,215, 1)',
                    'rgb(255,65,65, 1)',
                    'rgb(91,247,64, 1)',
                    'rgb(225,182,65, 1)',
                     'rgb(115,134,213, 1)',
                    'rgb(255,205,86, 1)',
                    'rgb(255,99,132, 1)',
                    'rgb(57,230,57, 1)',
                    'rgb(255,120,0, 1)',
                    'rgb(106,72,215, 1)',
                    'rgb(255,65,65, 1)',
                    'rgb(91,247,64, 1)',
                    'rgb(225,182,65, 1)',

                ],
                borderColor: [
                    'rgba(115,134,213, 1)'
                ],
                borderWidth: 1
            }]
        },
        options:  {
            scales: {
                yAxes: [{
                    stacked: true
                }]
            }
        }
    });
    
}