$(document).ready(function() {
    $.ajax({
        url: '/get-weapon-list',
        type: 'get',
        success: function(data) {
            let promis = new Promise((resolve, reject) => {
                data.forEach((el, index, arr) => {
                    el['title'] = el.weaponName;
                    el['parametr'] = el.weaponCol;
                    el['type'] = 'weapon';
                    appendItem(el, '#list-weapon');
                    if(index === arr.length - 1) resolve()
                })  
            })

            promis.then(() => handler()).catch(() => console.log('Список пуст'))
        } 
    })
    $.ajax({
        url: '/get-location-list',
        type: 'get',
        success: function(data) {
            let promise = new Promise((resolve, reject) => {
                data.forEach((el, index, arr) => {
                    el['title'] = el.locationName;
                    el['parametr'] = el.locationParametr;
                   
                    el['type'] = 'location';
                    appendItem(el, '#list-location');
                    if(index === arr.length - 1) resolve()
                })
            })
            promise.then(() => handler()).catch(() => console.log('Список пуст'))
        } 
    })
    
    // Добавляем новыйраздел
    $('#add-weapon-item').on('click', function() {
        let weaponName = $('#add-weapon-name-input').val()
        let weaponCol = $('#add-weapon-col-input').val()
        weaponName = weaponName.replace(/\s{2,}/g, ' ');
        if(weaponName.length < 2) {
            return alertError('Слишком маленький заголовок у раздела');
        } 
        
        $.ajax({ 
            url: '/add-weapon-item',
            type: 'post',
            data: 
                { 
                    weaponName: weaponName,
                    weaponCol : weaponCol
                },
            success: function (data) {
                let arr = [];
                arr['title'] = data.weaponName;
                arr['parametr'] = data.weaponCol;
                arr['id'] = data.id;
                arr['type'] = 'weapon';
                appendItem(arr, '#list-weapon');
                $('#add-weapon-name-input').val('')
                $('#add-weapon-col-input').val('')
                handler()
            }
        })
    }) 

    $('#add-location-item').on('click', function() {
        let locationName = $('#add-location-name-input').val()
        let locationParametr = $('#add-location-parametr-input').val()
        locationName = locationName.replace(/\s{2,}/g, ' ');
        if(locationName.length < 2) {
            return alertError('Слишком маленький заголовок у раздела');
        } 
        
        $.ajax({ 
            url: '/add-location-item',
            type: 'post',
            data: 
                { 
                    locationName: locationName,
                    locationParametr : locationParametr
                },
            success: function (data) {
                let arr = [];
                arr['title'] = data.locationName;
                arr['parametr'] = data.locationParametr;
                arr['id'] = data.id;
                arr['type'] = 'location';
                appendItem(arr, '#list-location');
                $('#add-location-name-input').val('')
                $('#add-location-parametr-input').val('')
                handler()
            }
        })
    }) 

    $('#delete-statistic-shop').on('click', function() {
        $.ajax({
            url: '/delete-statistics/shops',
            type: 'put',
            success: function(data) {
                alertSuccess('Статистика магазина успешно обнулена')
            }
        })
    })

    $.ajax({
        url:'/api/get-post/scale/',
        type: 'get',
        success: function(data) {
            let post = data[0];
            $('#inputLGEx').val(post.title)
            $('#form22').val(post.text)
        }
    })

    $('#scale-rename-upload').on('click', function() {
        let title = $('#inputLGEx').val();
        let text = $('#form22').val();

        $.ajax({
            url: '/update/post/scale',
            type: 'put',
            data: {
                title: title,
                text: text
            },
            success: function(data) {
                alertSuccess(data)
            }
        })
    })

    let imagesArrTurnir = [];

    $('#fileTurnir').on('change', function () {
        let image = $('#fileTurnir')
        let reader = new FileReader();
        reader.onload = function(e) {
            $('#appendFileTurnir')
            .append(`<img src="${e.target.result}" style="width:100px; height: 80px; margin: 10px;">`) 
        }
        reader.readAsDataURL(image[0].files[0])
        imagesArrTurnir.push(image[0].files[0])
    })

    $.ajax({
        url: '/api/get/restore-sectionturnir',
        type: 'get',
        success: function(data) {
            let dat = JSON.parse(data.articles);
            $('#inputTurnirTitle').val(dat.title); 
            $('#formTexterraTurnir').val(dat.text);
        }

    })

    $('#add-section-articles').on('click', function() {
        let title = $('#inputTurnirTitle').val();
        let text = $('#formTexterraTurnir').val();

        let data = new FormData();
        data.append('title', title)
        data.append('text', text)

        if(imagesArrTurnir) {
            imagesArrTurnir.forEach((el, index) => {
                data.append(`image${index}`, el, `product${Math.floor(Math.random(1, 99) * 9)}${el.name.replace(/ /g,'121')}`)
            })
        }

        setTimeout(() => {

            $.ajax({
                url: '/restore-sectionturnir',
                type: 'post',
                data:  data,
                processData: false,
                contentType: false,
                success: function(data) {
                    if(data.type !== 'error') {
                        alertSuccess(data);
                        console.log(data)
                    } else {
                        alertError(data.message)
                    }
                }
            })
        })
    })  

    // Статья поездки 


    let imagesArrPoezdki = [];

    $('#filePoezdki').on('change', function () {
        let image = $('#filePoezdki')
        let reader = new FileReader();
        reader.onload = function(e) {
            $('#appendFilePoezdki')
            .append(`<img src="${e.target.result}" style="width:100px; height: 80px; margin: 10px;">`) 
        }
        reader.readAsDataURL(image[0].files[0])
        imagesArrPoezdki.push(image[0].files[0])
    })

     $.ajax({
         url: '/api/get/restore-section/poezdci',
         type: 'get',
         success: function(data) {
             let dat = JSON.parse(data.articles);
             $('#inputPoezdkiTitle').val(dat.title); 
             $('#formTexterraPoezdki').val(dat.text);
         }
     })

    $('#add-section-articles-poezdki').on('click', function() {
        let title = $('#inputPoezdkiTitle').val();
        let text = $('#formTexterraPoezdki').val();

        let data = new FormData();
        data.append('title', title)
        data.append('text', text)

        if(imagesArrPoezdki) {
            imagesArrPoezdki.forEach((el, index) => {
                data.append(`image${index}`, el, `product${Math.floor(Math.random(1, 99) * 9)}${el.name.replace(/ /g,'121')}`)
            })
        }

        setTimeout(() => {

            $.ajax({
                url: '/restore-section/poezdki',
                type: 'post',
                data:  data,
                processData: false,
                contentType: false,
                success: function(data) {
                    if(data.type !== 'error') {
                        alertSuccess(data);
                        console.log(data)
                    } else {
                        alertError(data.message)
                    }
                }
            })
        })
    })  

})



var deleteWeapon = (li, id) => {
    $.ajax({
        url: `/delete-weapon/${id}`,
        type: 'delete',
        success: function(data) {
            li.hide();
        } 
    })
}

var deleteLocation = (li, id) => {
    $.ajax({
        url: `/delete-location/${id}`,
        type: 'delete',
        success: function(data) {
            li.hide();
        } 
    })
}

var handler = () => {
    $('.delete-weapon-item').on('click', function(e) {
        let li = $(e.currentTarget).parent();
        let id = li.children('input').val();
        deleteWeapon(li, id);
    })

    $('.delete-location-item').on('click', function(e) {
        let li = $(e.currentTarget).parent();
        let id = li.children('input').val();
        deleteLocation(li, id);
    })
}

var appendItem = (data, appendTo) => {
    let typeItem = data.type == 'weapon' ? 'delete-weapon-item' : 'delete-location-item'

    $(`${appendTo} > ul`)
    .append(`<li class="list-group-item">
        <div>
        <span class="title-li-item">  ${data.title} </span> 
         <p> ${data.parametr} </p>
         </div>
        <input type="hidden" value="${data.id}" >
        <span class="${typeItem}">
        <i class="fas fa-minus-circle"> </i>
        </span>
    </li>`)
}