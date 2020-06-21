$(document).ready(function() {

    $.ajax({
        url: '/api/push',
        type: 'get',
        success: function(data){
            data.forEach((e) => {
                $('#pills-active').append(messageAdd(e))
            })
            if(data.length > 1){
                $('.delete-all-complite-battl').show()
            }
        }
    })

    document.getElementById('save-message').addEventListener('click', function() {
        let name = $('#name').val();
        let message = $('#message').val();
        $.ajax({
            url: '/api/push', 
            type: 'post',
            data: {name: name, message: message},
            success: function(data){
                console.log(data)
                addMessage(data)
            }
        })
    });
    // При наведении ищем значки
    $('#pills-tabContent').on('mouseenter', '.blockMessageRow', function() {
        $(this).find('.delete-battl').on('click', function() {
            let parent = $(this).parent().parent().parent().parent()
            let id = Number(parent.find('.id-message').val());
            $.ajax({
                url: `api/push/${id}`,
                type: 'delete',
                success: function(data) {
                    parent.empty()
                }
            })
        })
        $(this).find('.reload-battl').on('click', function() {
            console.log('reload-battl')
            // let parent = $(this).parent().parent().parent().parent()
            // let id = parent.find('.hidden-input-id').val();
            // $.ajax({
            //     url:   `/api/battle/${id}`,
            //     type: 'delete',
            //     success: function(data) {
            //         console.log(data)
            //         parent.empty()
            //     }
            // })
        })
    }).on('mouseleave', '.blockBattleRow', function() {
    })

    $('.delete-all-complite-battl').on('click', function() {
        $.ajax({
            url: '/api/push',
            type: 'delete',
            success: function(data) {
                if(data.type == 'success'){
                    alertSuccess(data.data)
                    $('#pills-active').empty()
                }
            }
        })
    })
})


function addMessage(data) {
    data['id'] = data.resId
    data['message'] = data.mess
    $('#pills-active').prepend(messageAdd(data))
    alertSuccess('Уведомление отправлено')
    $('#name').val('');
    $('#message').val('');
    if($('#pills-active').children().length > 1) {
         $('.delete-all-complite-battl').show()
    }
}

var messageAdd = (data) => {
    return `<div class="blockMessageRow">
            <div class="row p-5 ">
            <div class="col p-3" style="box-shadow: 10px 0px 10px 0px rgb(21,28,38);">
                <form>
                    <div class="form-row ">
                        <div class="form-group col">
                            <label for="name"> Заголовок </label>
                            <input type="text" name="nameLocation" placeholder="${data.name}" class="form-control name" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col">
                            <label for="messge"> Сообщение </label>
                            <textarea class="form-control message" placeholder="${data.message}" name="discription"/>
                         </div>
                  </div>
                </form>
            </div>        
            <div class="col-2" style="margin-left: 10px; margin-top: 5%">
                <div class="row m-1 mb-4">
                <i class="fas fa-trash-alt delete-battl" data-toggle="tooltip" data-placement="left" title="Удалить навсегда" style="color: rgb(21,28,38); cursor:  pointer; width: 35px; height: 35px;" onmouseover="this.style.width='50px';" onmouseout="this.style.width='35px';"></i>
                </div>
            </div>
            <input class="id-message" value="${data.id}" type="hidden">
            </div>
            `
} 

{/* <div class="row m-1 mb-4">
<i class="fas  fa-sync-alt reload-battl" data-toggle="tooltip" data-placement="left" title="Сделать Активным" style="color:dimgrey; cursor: pointer; width: 35px; height: 35px;"  onmouseover="this.style.width='50px';" onmouseout="this.style.width='35px';"></i>
</div> */}