$(document).ready(function() {
    uploadStatisticMembers()

    $('.loadersers').hide()
    $('#reload-statistic-batl-user').on('click', () => {
        $('.loadersers').show()
        $.ajax({
            url: '/reload-statistic-batl-user',
            type: 'get',
            success: (data) => {
                console.log(data)
                alertSuccess(data)
                $('.loadersers').hide()

            }
        })

    })
    
    $('#balls-statistic-batl-click').click(function() {
        $('.loadersers').show();
        
        let url = $('#balls-statistic-batl').val();
        $.ajax({
            url: '/reload-batl/statistic/balls/url',
            type: 'post',
            data: { url },
            success: (data) => {
               setTimeout(() => {
                    if(data.type == 'success') {
                        alertSuccess(data.data)
                        console.log(data)
                        $('.loadersers').hide()
                        $('#balls-statistic-batl').val('');
                   } else if(data.type == 'error') {
                       alertError(data.data)
                       console.log(data)
                        $('.loadersers').hide()
                        $('#balls-statistic-batl').val('');    
                   }
                 
               }, 3000)
            }
        })
    })
})

// Функция загрузки выбыбраного файла на сервер 
function uploadStatisticMembers() {
    // Получаю доступ к кнопкам 
    let loadToSereverFile = document.getElementById('load-to-server-file');
    let checkTable = document.getElementById('checkTable');
    let deleteStatistic = document.getElementById('delete-users-statistical');

    // Получаю доступ к вводу
    urlInput = document.getElementById('basic-url');
    numberSheet = $('#sheet-number')[0];
    sheetRows = $('#sheet-rows')[0];

    let file;

    // Проверяю изменения в добавлении адресса 
    urlInput.addEventListener('change', function(){
        // Делаю проверку если что-то есть ищу id и добавляю иконку 
        if(urlInput.value.length > 5) {
            file = urlInput.value;
            createIconFile(file)
        }
    })

    // Функция клика по галочки.
    loadToSereverFile.addEventListener('click', function(){
        // Передаем данные на сервер
        if(file) {
            ajaxToStatisticLoad(file);
        } else {
            alertError('Данные не выбраны')
        }  
        deleteIconToFile(file)
    })

    // Функция клика для проверки на сервере.
    checkTable.addEventListener('click', function(){
        // Проверяем данные на сервере 
        if($(sheetRows).val().length < 2) {
            alertError('Введите столбцы для обработки')
            return 
        } else if($(sheetRows).val().trim().split(':').length < 2){
            alertError('Неправильный формат ввода столбцов')
            return
        }

        //file.rows = sheetRows.value.split(':');

        if(Number($(numberSheet).val()) < 0) {
            alertError('Страница не может быть с отрецательным значением')
        } else {
            ajaxToStatisticReload(Number($(numberSheet).val()), $(sheetRows).val().trim().split(':'));
        }
    })

    function createIconFile(file) {
        let iconExel = '<i class="fas fa-file-excel" style="width: 100; height: 100"></i>';
        let iconDelete = '<i id="iconDeleteToFile" style="cursor: pointer" class="fas fa-times"></i>';

        if(file) {
            document.getElementById('typeFileLoad').innerHTML = '<div>' + iconExel + iconDelete + '</div>';
        } else {
            setTimeout(() => deleteIconToFile());
        }

        setTimeout(() => deleteIconToFile());
    }

    function deleteIconToFile() {
        document.getElementById('iconDeleteToFile').addEventListener('click', function() {
            document.getElementById('typeFileLoad').innerHTML = '';
        });
    }

    deleteStatistic.addEventListener('click', function(){
        $.ajax({
            url: '/api/users/statistics/delete',
            type: 'GET',
            success: function(data){
                if(data.type == 'error') {
                    if(data.message == 1) {
                        alertError(data.data)
                    }
                } else if(data.type == 'success') {
                    alertSuccess(data.data)
                }
            } })
    })
    
}

function progressBar(status) {
    let progress = document.getElementById('progress');
    if(status == 0) {
        progress.style.width = '0%'
    } else if(status == 1) {
        // В процессе загрузки
        ins = 5;
        timeInter = setInterval(() => {
                progress.style.width = ins +'%';
                ins++
        }, 100);
    } else if(status == 2) {
        clearInterval(timeInter);
        ins = 5
        progress.style.width = '100%'
        setTimeout(() => {
            progress.style.width = '0%'
        }, 4000)
    }else {
        progress.style.width = '0%'
    }

}
// Обновляем статистику 
function ajaxToStatisticReload(sheet, rows) {
    $.ajax({
        url: '/api/users/statistic/reload',
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {sheet, rowsX: rows[0], rowsY: rows[1]},
        beforeSend: function(){
            progressBar(1)
        },
        success: function(data) {
            if(data.type == 'error' && data.message == 1) {
                alertError(data.data)
                progressBar(0)
            } else {
                alertSuccess(data)
                progressBar(2)
            }
        },
        error: function() {
            alertError('Произошла ощибка обновления данных пользователей')
            progressBar(0)
        }
    })
}

// Загружаем статистику 
function ajaxToStatisticLoad(file) {
    $.ajax({
        url: '/api/users/statistic',
        method: 'POST',
        data: { url: file},
        success: function(data) {
            if(data.type == 'success') {
                alertSuccess(data.data)
            } else if(data.type == 'error'){
                alertError(data.data)
            } else {
                alertError('Файл не загружен')
            }
        }, 
        error: function(err) {
            alertError('Ощибка соеденения с сервером')
        }
    })
}


