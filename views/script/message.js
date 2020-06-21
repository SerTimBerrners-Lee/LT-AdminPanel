$(document).ready(function() {
    $.ajax({
        url: '/api/list-product-message',
        type: 'get',
        success: function(data) {
            appends(data)
        }
    })
})

$('#pills-confirmation-tab').on('click', function() {
    $('#pills-confirmation').empty()
    $.ajax({
        url: '/api/changes-user/all',
        type: 'get',
        success: function(data) {
            data.forEach((el, index, arr) => {
                appengConfirmation(el)
            })
        }
    })
})

let appends = (data) => {
    data.forEach((el, index, arr) => {
        appendProducts(el)  
    })
}


$('#pills-active-product').on('click', '.delete-message-products', function(e) {
    let id = $(e.currentTarget).parent().parent().parent().find('input').val()
    $.ajax({
        url: `/api/delete-product-message/${id}`,
        type: 'delete',
        success: function(data) {
            $(e.currentTarget).parent().parent().parent().remove()
        }
    })
})

let appendProducts = (el) => {
    let purchase = JSON.parse(el.purchase);
    $('#pills-active-product').append(
        `
        <div class="row p-5">
       <div class="col p-3 puls-product"  style="background-color: #efefef;box-shadow: 10px 10px 10px 5px rgb(109,127,204)">
       <input type="hidden" value=${el.id} />
       <div class="text">
        <h3> ID пользователя </h3>
        <p> ${el.id_user} </p> 
    </div>
    <div class="text">
        <h3> Login </h3>
        <p> ${el.login_user} </p> 
        </div>
        <div class="text">
        <h3> Время создания </h3>
        <p> ${el.time.split('T')[0]} / ${el.time.split('T')[1].split('.')[0]} </p> 
        </div>

        <div class="conetnts_product">
            <div class="slider">   
            ${Object.values(purchase).map((el, index, arr) => {
                return (`<div>
                    <div style="display: flex; justify-content: center;">
                    <img class="image__products__slider" src="${location.href + el.image}" />
                    </div>
                    <div style="text-align: center;"> ${el.name} </div>
                    <div style="text-align: center;"> ${el.price} Баллов </div> 
                    </div>`);
                
            })}
               
        </div>
            
        </div>
        <div class="conetnts_product">
        <img class="image__style__products" src="${location.href + el.qrcode}" />
        </div>

        </div>   
        <div class="col-2" style="margin-left: 10px; margin-top: 5%">
            <div class="row m-1 mb-4">
            <span  class="delete-message-products">
                <i class="fas fa-trash-alt" data-toggle="tooltip" data-placement="left" title="Удалить" style="color:rgb(109,127,204); cursor:  pointer; width: 35px; height: 35px;" onmouseover="this.style.width='50px';" onmouseout="this.style.width='35px';"> </i>
            </span>
                </div>
        </div>
        </div>
                `
    )

    $('.slider').bxSlider({
        mode: 'fade'
    });
}

$('#pills-confirmation').on('click', '.save-change-users', function(e) {
    let id = $(e.currentTarget).parent().find('.input_user_id').val()
    let parent = $(e.currentTarget).parent().parent().parent()
    let login = $(parent).find('.changes_login_user').text().trim()
    let discription = $(parent).find('.changes_discription_user').text().trim()
    let postId = $(e.currentTarget).parent().find('.input_post_id').val()

    $.ajax({
        url: '/api/changes-user/true',
        type: 'post',
        data: {
            login,
            discription,
            id,
            postId
        },
        success: function(data) {
            console.log(data)
            $(parent).empty()
            alertSuccess('Данные пользователя успешно изменены')
        }
    })
})

$('#pills-confirmation').on('click', '.delete-change-users', function(e) {
    let postId = $(e.currentTarget).parent().find('.input_post_id').val()
    let parent = $(e.currentTarget).parent().parent().parent()
    console.log(postId)
    $.ajax({
        url: '/api/changes-user/false', 
        type: 'delete', 
        data: {
            postId
        },
        success: function(data) {
            $(parent).empty();
        }
    })
})


let appengConfirmation = (data) => {
    $('#pills-confirmation').append(`
    <div class="row p-5">
    <div class="col p-3" style="box-shadow: 10px 10px 10px 5px rgb(109,127,204)">
        <form>
            <div class="form-row">
                <div class="form-group col-md-6">
                    <h4> Было </h4>
                </div>
                <div class="form-group col-md-6">
                    <h4> Стало </h4>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group col-md-6"> Позывной:
                    <p style="text-decoration: line-through;"> ${data.other_login} </p>
                </div>
                <div class="form-group col-md-6"> Позывной:
                    <p class="changes_login_user"> ${data.login} </p>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group col-md-6">Описание:
                    <p style="text-decoration: line-through;"> ${data.other_discription} </p>
                </div>
                <div class="form-group col-md-6"> Описание:
                    <p class="changes_discription_user"> ${data.discription} </p>
                </div>
            </div>
                
        </form>
    </div>
    <div class="col-2" style="margin-left: 10px; margin-top: 5%">
            <div class="row m-1 mb-4">
            <input type="hidden" class="input_user_id" value='${data.user_id}' />
            <input type="hidden" class="input_post_id" value='${data.id}' />
                <span class="save-change-users">
                <i class="fas fa-check-square" data-toggle="tooltip" data-placement="left" title="Подтвердить" style="color:rgb(109,127,204); cursor:  pointer; width: 35px; height: 35px;" onmouseover="this.style.width='50px';" onmouseout="this.style.width='35px';"></i>
                </span>
                <hr />
                <span class="delete-change-users">
                <i class="fas fa-trash-alt" data-toggle="tooltip" data-placement="left" title="Отклонить" style=" cursor:  pointer; width: 35px; height: 35px;" onmouseover="this.style.width='50px';" onmouseout="this.style.width='35px';"></i>
                </span>
                </div>
    </div>
</div>
    `)
}

