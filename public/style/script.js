
// Загружает список активных боев 
function loadActiveBattle(arr) {
    $('#pills-active').load('src/battle.html .div-container-active-battle', (e) => {
        $('.div-active-battle').mouseover((e) => {
            e.currentTarget.style.height = 'auto';
            let parent = e.currentTarget.parentNode;
            parent.querySelector('.date-time-battle').style.display = 'block';
            
        });
            
        $('.div-active-battle').mouseout((e) => {
            e.currentTarget.style.height = '300px';
            let parent = e.currentTarget.parentNode;
            parent.querySelector('.date-time-battle').style.display = 'none';
            
        });
            setTimeout(() => toltipInit())
    })
}

function toltipInit() {
    $('[data-toggle="tooltip"]').tooltip()
}

function getStatistic(){
    $.ajax({
        url: "/api/statistic",
        type: "GET",
        contentType: "application/json",
        success: function(data) {
            console.log("STATISTIC" + data)
            $('#v-pills-home').text(data);
        }
    })
}
// Функция загрузки выбыбраного файла на сервер 
function uploadStatisticMembers() {
    // Получаю доступ к кнопкам 
    let loadToSereverFile = document.getElementById('load-to-server-file');
    let checkTable = document.getElementById('checkTable');
    let deleteStatistic = document.getElementById('delete-users-statistical');

    // Получаю доступ к вводу
    urlInput = document.getElementById('basic-url');
    fileInput = document.getElementById('fileElem');
    numberSheet = document.getElementById('sheet-number');
    sheetRows = document.getElementById('sheet-rows');

    // Create let file for storage file
    file = {
        type: '',
        data: '',
        sheet: 0,
        rows: [],
        emptys: true
    };

    // Проверяю изменения в добавлении файла
    fileInput.addEventListener('change', function(e){
        console.log('change INput File')
        file.data = e.currentTarget.files[0];
        file.type = 'file';
        file.emptys = false;
        createIconFile(file)
        urlInput.value = '';
    })
    
    // Проверяю изменения в добавлении адресса 
    urlInput.addEventListener('change', function(){
        console.log('change Input Url')
        // Делаю проверку если что-то есть ищу id и добавляю иконку 
        if(urlInput.value.length > 5) {
            file.data = urlInput.value;
            file.type = 'url';
            file.emptys = false;
            createIconFile(file)
        }
    })

    // Функция клика по галочки.
    loadToSereverFile.addEventListener('click', function(){
        // Передаем данные на сервер
        if(!file.emptys) {
            ajaxToStatisticLoad(file);
        } else {
            alertError('Данные не выбраны')
        }  
        deleteIconToFile(file)
    })

    // Функция клика для проверки на сервере.
    checkTable.addEventListener('click', function(){
        // Проверяем данные на сервере 
        numberSheet.value == '' ? file.sheet = 0 : file.sheet = numberSheet.value;

        if(sheetRows.value == '') {
            alertError('Введите столбцы для обработки')
            return 
        } else if(sheetRows.value.split(':').length < 2){
            alertError('Неправильный формат ввода столбцов')
            return
        }

        file.rows = sheetRows.value.split(':');

        if(file.sheet < 0) {
            alertError('Страница не может быть с отрецательным значением')
        } else {
            ajaxToStatisticReload(file.sheet, file.rows);
        }
    })

    function createIconFile(file) {
        let iconExel = '<i class="fas fa-file-excel" style="width: 100; height: 100"></i>';
        let iconDelete = '<i id="iconDeleteToFile" style="cursor: pointer" class="fas fa-times"></i>';

        if(!file.emptys) {
            document.getElementById('typeFileLoad').innerHTML = '<div>' + iconExel + iconDelete + '</div>';
        } else {
            setTimeout(() => deleteIconToFile(file));
        }

        setTimeout(() => deleteIconToFile(file));
    }

    function deleteIconToFile(file) {
        document.getElementById('iconDeleteToFile').addEventListener('click', function() {
            document.getElementById('typeFileLoad').innerHTML = '';
            file.emptys = true;
            urlInput.value = '';
            inputFile = '';
        });
    }

    deleteStatistic.addEventListener('click', function(){
        $.ajax({
            url: '/api/users/statistics/',
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
        }, 9000)
    }else {
        progress.style.width = '0%'
    }

}

console.log('SCRIPT ---------------------------------------')

function ajaxToStatisticReload(sheet, rows) {
    console.log('LOAD')
    $.ajax({
        url: '/api/users/statistic/reload',
        method: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {sheet: sheet, rowsX: rows[0], rowsY: rows[1]},
        beforeSend: function(){
            progressBar(1)
        },
        success: function(data) {
            console.log(data, 'test');
            if(data.type == 'error' && data.message == 1) {
                alertError(data.data)
                progressBar(0)
            } else if(data.type == 'success') {
                alertSuccess(data.data)
                progressBar(2)
            }
        },
        error: function() {
            alertError('Произошла ощибка обновления данных пользователей')
            progressBar(0)
        }
    })
}

function ajaxToStatisticLoad(file) {
    if(file.type == 'url') {
        console.log(file.type, file.data)
        $.ajax({
            url: '/api/users/statistic',
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            data: { type: file.type, data: file.data },
            success: function(data) {
                if(data.type == 'success') {
                    alertSuccess(data.data)
                } else if(data.type == 'error' && data.message == 1){
                    alertError(data.data)
                } else if(data.type == 'error' && data.message == 2) {
                    console.error(data.data)
                } else {
                    alertError('Файл не загружен')
                }
            }, 
            error: function(err) {
                alertError('Ощибка соеденения с сервером')
            }
        })
    } else {
        let formData = new FormData;
        formData.append('data', file.data);
        console.log(formData)
        alertError('Загрузка по кнопке не доступна, используйте загрузку по ссылке.')
    }
}

// -------------------------------------------------------------------------
function getBattle(){
    $.ajax({
        url: "/api/battle",
        type: "GET",
        contentType: "application/json",
        success: function(data) {
            console.log("BATTLE" + data)
            loadActiveBattle(data)
        }
    })
}

function getPush(){
    $.ajax({
        url: "/api/push",
        type: "GET",
        contentType: "application/json",
        success: function(data) {
            
            $('#v-pills-push').text(data);
        }
    })
}