$(document).ready(function() {
    // Script to store
    $.ajax({
        url: '/api/get-section-store',
        type: 'get',
        success: function(data) {
            let promis = new Promise((resolve, reject) => {
                data.forEach((el, index, arr) => {
                    appendSection(el);
                    addSelecteon(el)
                    if(index === arr.length -1) resolve()
                });
            })
        
            promis.then(() => {
                sumProductLoad()
            })        
        }
    })

    // Добавляем секцию 
    $('#add-section-item').on('click', function() {
        let sectionName = $('#add-section-input').val()
        sectionName = sectionName.replace(/\s{2,}/g, ' ');
        if(sectionName.length < 2) {
            return alertError('Слишком маленький заголовок у раздела');
        }
        $.ajax({
            url: '/add-section-store',
            type: 'post',
            data: { name : sectionName},
            success: function (data) {
                let arr = [];
                arr['name'] = data.name;
                arr['id'] = data.data.insertId;
                appendSection(arr);
                addSelecteon(arr)
                $('#add-section-input').val('')
            }
        })
    })
    $('#list-section-store').on('click', '.delete-section-item svg path',  e =>  {
        let li = $(e.target).parent().parent().parent();
        let id = li.children('input').val();
        deleteSection(li, id)
    })

    $('body').on('click', '.close', function() {
        $('.close').parent().parent().parent().remove();
    })

    $('.delete-section-item').on('click', function() {
        let li = $(e.target).parent();
        let id = li.children('input').val();
        deleteSection(li, id);
    })

    $('#list-section-store ul').on('click', function (e) {
        if($(e.target).attr('class') == 'title-li-item') {
            let name = $(e.target).text();
            let id = $(e.target).parent().children('input').val();
            $.ajax({
                url: `/api/get-product-list${id}`,
                type: 'get',
                success: function(data) {
                    data['name'] = name;
                    appendProduct(data)
                }
            })
        }
    })

    // Сохраняем новый товар 

    $('#save-product').on('click', function() {
        let price = $('#priceProduct').val();
        let name = $('#nameProduct').val();
        let discription = $('#inputDiscriptionProduct').val();
        let section_id = $('#section-section').val();
        let parametr = $('#parametrProduct').val().length < 3 ? 0 : $('#parametrProduct').val();
        let data = new FormData();
        data.append('price', price)
        data.append('name', name)
        data.append('discription', discription)
        data.append('section_id', section_id)
        data.append('parametr', parametr)
        
        if(imagesArr) {
            imagesArr.forEach((el, index) => {
                data.append(`image${index}`, el, `product${Math.floor(Math.random(1, 99) * 19999 * 9889)}${el.name.replace(/ /g,'121')}`)
            })
        }

        if(name == ''  || price == ''){
            return alertError('Цена и Наименование должны быть добавлены')
            
        } else if(section_id == null) {
            return alertError('Добавьте категорию')
        }
        
        $.ajax({
            url: '/add-product-store',
            type: 'post',
            data:  data,
            processData: false,
            contentType: false,
            success: function(data) {
                if(data.type && data.type == 'error') {
                    clearFields();
                    return alertError(data.message);
                }
                alertSuccess(data);
                clearFields();
            }
        })
    })  
})

var sumProductLoad = () => {
    $.ajax({
        url: '/get-col-product-to-store',
        type: 'get',
        success: function(data) {
            data.forEach((el, index, arr) => {
                [...$('#list-section').children()].forEach(li => {
                    if(Number($(li).find('input').val()) == Number(el.section_id)) {
                        let span = $(li).find('.bangle-laser').text();
                        $(li).find('.bangle-laser').text(Number(span) + 1);
                    }
                })
            })
        }
    })
}

var clearFields = () => {
    $('#priceProduct').val('');
    $('#nameProduct').val('');
    $('#inputDiscriptionProduct').val('');
    $('#parametrProduct').val('');
    $('#appendImage').empty();
    imagesArr = [];
}

var imagesArr = [];

$('#file-upload').on('change', function () {
    let image = $('#file-upload')
    let reader = new FileReader();
    reader.onload = function(e) {
        $('#appendImage')
        .append(`<img src="${e.target.result}" style="width:100px; height: 80px; margin: 10px;">`) 
    }
    reader.readAsDataURL(image[0].files[0])
    imagesArr.push(image[0].files[0])
})

var deleteSection = (li, id) => {
    $.ajax({
        url: `/delete-section-store${id}`,
        type: 'get',
        success: function(data) {
            li.hide();
        } 
    })
}


var appendSection = (data) => {
    $('#list-section-store > ul')
    .append(`<li class="list-group-item animated fadeInRightBig hoverable">
        <p class="title-li-item">  ${data.name}
        <span class="badge bangle-laser badge-pill">0</span> </p> 
        <input type="hidden" value="${data.id}" >
        <span class="delete-section-item">
        <i class="fas fa-minus-circle"> </i>
        </span>
    </li>`)

}

var addSelecteon = (data) => {
    $('#section-section').append(`
        <option value="${data.id}"> ${data.name} </option>
    `)
}

// Выводит список продуктов 


var appendProduct = (data) => {

    $('#wrapper-store').append(`
        <div class="wrapper-absolute-product ">
            <div class="card">
                <div class="card-body">
                <button type="button" class="btn close btn-outline-danger waves-effect"> <i class="fas fa-times"></i></button>   
                    
                    <button class="btn aqua-gradient">${data.name} </button> 
                </div>
            </div>
            
            <div class="wrapper-store-content"></div>
        </div>
    `)
    window.scrollTo(0,0)

    let promis = new Promise((resolve, reject) => {
        data.forEach((el, index, arr) => {
            let photoArr = el.photo.split(' +|+ ')
            wrapperStoreAppend(el, photoArr)
            if(index === arr.length -1) resolve()
        })
    })

    promis.then(() => {
        initProducts();
    })
}

var sliders = (photo) => {
    return  `<div class="" style="width: 100%; height: 200px; background: url(${location.origin + photo}) no-repeat 50%;    
    background-size: contain;"></div>`;
}

var wrapperStoreAppend = (data, photoArr) => {
    if(data.discription.length > 80) {
        let bigText = data.discription.substring(90)
        var text = data.discription.substring(0, 90) + `<p data-bool='0' class="show-hide-text-discription"> ... показать </p><span style="display: none;" class="get-text">${bigText}</span>`
    } else {
        var text = data.discription;
    }
    $('.wrapper-store-content').append(`
    <div class="append-item-product hoverable"> 
    <div class="photo-product-list">
        <div class="slider ">
            ${photoArr.map(photo => {
                return `<div> ${sliders(photo)} </div>`
            }).join('')}
        </div>
    
    </div>
    <div> 
    <span> ID: </span>
    <span class="id-prodect-item">${data.id} </span>
    </div>
    <div>
    <span> Цена: </span>
    <span> ${data.price} </span>
    </div>
    <div>
    <span> Наименование:  </span>
    <span>${data.name} </span>
    </div>
    <div>
    <span> Описание: </span>
    <span>${text} </span>
    </div>
    <div>
    <span> Параметры: </span>
    <span>${data.parametr} </span>
    </div>
    <div>
    <button type="button" class="delete-product-by-id btn btn-danger">Удалить</button>
    </div>
    
     </div>
    `)
}


var initProducts = () => {
    $('.slider').bxSlider({
        mode: 'fade'
    });
    $('.delete-product-by-id').on('click', (e) => {
        let parent = $(e.target).parent().parent();
        let id = $(parent).find('.id-prodect-item').text();

        $.ajax({
            url: `/delete-product${id}`,
            type: 'get',
            success: function(data) {
                if(data.type == 'success') {
                    parent.remove();
                }
            }
        });

    });
    $('.show-hide-text-discription').on('click', (e) => {
        let parent = $(e.target).parent();
        let bool = Number($(e.target).attr('data-bool'));
        if(bool){
            $(parent).find('.get-text').hide()
            $(e.target).text(' ... показать ')
            $(e.target).attr('data-bool', '0')
        } else {
            $(parent).find('.get-text').show()
            $(e.target).text(' ... скрыть ')
            $(e.target).attr('data-bool', '1')
        }
    })
}