$(document).ready(function(){
    getUsers()
    document.getElementById("contentUserRow")
    .addEventListener('wheel', function(event) {
        if (event.deltaMode == event.DOM_DELTA_PIXEL) {
        var modifier = 1;
        // иные режимы возможны в Firefox
        } else if (event.deltaMode == event.DOM_DELTA_LINE) {
        var modifier = parseInt(getComputedStyle(this).lineHeight);
        } else if (event.deltaMode == event.DOM_DELTA_PAGE) {
        var modifier = this.clientHeight;
        }
        if (event.deltaY != 0) {
        // замена вертикальной прокрутки горизонтальной
        this.scrollLeft += modifier * event.deltaY;
        event.preventDefault();
        }
    });
})

function getUsers(){
    $.ajax({
        url: "/api/users",
        type: "GET",
        contentType: "application/json",
        success: function (users) {
            pagination(users);
            searchToLogin(users)
        }
    }); 
}

function echoRows(arr, paginate) {
    let x = paginate*10;
    let y = 10*paginate;
    let pag = x + y;

    $("table tbody").empty();

    var rows = "";
    $.each(arr, (index, user) =>{
        //добавляем полученные элементы в таблицу
        if(index < pag && index > pag - 21) {
            rows += row(user);
        }
    });

    $("table tbody").append(rows);
}

function pagination(arr = []){
    let ul = $('#paginate');
    ul.empty();
    var num = 1;

    ul.append('<li class="page-item"><a class="page-link" href="#" tabindex="-1" aria-disabled="false">Previous</a> </li>');

    for(let i = 0; i <= arr.length; i = i+20) {
        ul.append('<li class="page-item"><a class="page-link" tabindex="'+ num +'" href="#">'+ num +'</a></li>');
        num++;
    }

    ul.append('<li class="page-item"><a class="page-link" tabindex="" href="#">Next</a></li>');

    ul.children().on('click', e => { 
        let index = Number(e.target.getAttribute('tabindex'));
        if(index == -1 || index == 0) {
            incrimentPageIndex(index)
        } else {
            startActive(index, ul, arr)
        }
    }); 

    startActive(1, ul, arr);

function incrimentPageIndex(increment) {
    ul.children().each((index, el) => {
        if(el.className == 'page-item active') {
            if(increment == 0 && index < ul.children().length -2) {
                startActive(index + 1, ul, arr)
                console.log('+1')
                return false
            } else if(increment == -1  && index > ul.children().length - ul.children().length + 1){
                startActive(index -1, ul, arr)
                console.log('-1')
                return false
            }
        }
    })
}
}

function startActive(indexActive, ul, arr) {
    ul.children().each((index, el) => {
        el.className = 'page-item'
        if(index == indexActive) {
            el.className = 'page-item active'
            echoRows(arr, indexActive)
        }
    })
    actionUsers();
}

function searchToLogin(arr){ 
    let loginSearch = $('#loginSearch');
    loginSearch.on('change', (el) => {
        let login = el.target.value;
        $.each(arr, (index, el) => {
            if(login.toLowerCase() == el.user_login.toLowerCase()){
                let rows = row(el)
                $("table tbody").empty();
                $("table tbody").append(rows);
                actionUsers()
                return true;
            } else if(login == ''){
                let ul =  $('#paginate');
                ul.children().each((index, el) => {
                    if(el.className == 'page-item active') {
                        let numberIndex = Number(el.querySelector('a').getAttribute('tabindex'))
                        startActive(numberIndex, ul, arr);
                        actionUsers()
                        return false;
                    }
                })
                return false
            }
        })
    })
}

function actionUsers(){
    $('.writeUser').on('click', (e) => {
        console.log('write')
        let rows = e.currentTarget.parentNode.parentNode;
        let id = rows.getAttribute('data-rowid');
        console.log(id);
        contenteditable(rows);

        writeAndcallback(id, e.currentTarget.parentNode)

    });

    $('.delitUser').click((e) => {
        console.log('delit')
        let rows = e.currentTarget.parentNode.parentNode;
        let id = rows.getAttribute('data-rowid');
        
        checkDelit(id, rows);
    })
}

function writeAndcallback(id, el) {
    let content = el.innerHTML;
    el.innerHTML = '<span class="checkWrite"> <i class="fas fa-check-circle ml-2"></i> </span><span class="cancellation"> <i class="fas fa-window-close ml-2"></i> </span>';
    $('.checkWrite').on('click', (e) => {
        el.innerHTML = content;
        let data = el.parentNode.querySelectorAll('.writes');
        contenteditable(el.parentNode, false)
        writeUser(id, data)
        actionUsers();
    });
    $('.cancellation').on('click', (e) => {
        el.innerHTML = content;
        contenteditable(el.parentNode, false)
        actionUsers()
    });
}

function contenteditable(rows, bool = true) {
    rows.querySelectorAll('.writes').forEach((e) => {
        e.setAttribute('contenteditable', bool);
    });
}

function checkDelit(id, rows) {
    let random = Math.floor(Math.random(1999) * 1999);
    let check = prompt(`Чтобы удалить пользователя введите: ${random}`);

    check == random ? delitUserRow(id, rows) : alert('Неправильное число');
}

var row = function (user) {
    return "<tr data-rowid='" + user.ID + "'><td>"+ '<span class="delitUser"><i style="cursor: pointer" class="fas fa-trash-alt ml-2"></i></span><span class="writeUser"> <i style="cursor: pointer" class="fas fa-pencil-alt ml-2"></i></span>' +"</td> <td>" + user.ID + "</td>" +
           "<td class='writes'>" + user.display_name + "</td> <td class='writes'>" + user.user_email + "</td>" +
           "<td class='writes'>" + user.user_discription + "</td> <td class='writes'>" + user.user_ball +  "</td>" +
           "<td class='writes'>" + user.user_login + "</td> <td class='writes'> <a href='"+ user.user_url  +"'>" + user.user_url + "</a></td>" +
            "</tr>";
}

function delitUserRow(id, rows) {
    $.ajax({
        url: `/api/users/${id}`,
        type: 'DELETE',
        contentType: 'application/json',
        success: function(data) {
            rows.innerHTML = '';
            console.log(data);
        }
    })
}

function writeUser(id, dataUpload) {
    let email = dataUpload[1].innerText;
    let discription = dataUpload[2].innerText;
    let ball = dataUpload[3].innerText;
    let name = dataUpload[0].innerText;
    let login = dataUpload[4].innerText;
    let url = dataUpload[5].innerText;

    $.ajax({
        url: '/api/users/s',
        contentType: "application/x-www-form-urlencoded",
        method: "PUT",
        data: { 
                discription: discription,
                ball: ball,
                id: id
            },
        success: function(data) {
            console.log(data);
        }
    })
}