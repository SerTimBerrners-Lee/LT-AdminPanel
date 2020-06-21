$(document).ready(function(){
    // Tootltip
    $('[data-toggle="tooltip"]').tooltip('disable')
    $('.toast').toast('show')
    // Title and Content
    titleDiv = $('#title-div');
    contentDiv = $('#content-div')
    // Donwload index page
    getContent('/index', 'Статистика приложения')
    //  Active menu
    activate($('#menu-ul-nav').children()[0])

    // Menu OnClick
    $('#home-page-li').on('click', function(){
        [...$('#menu-ul-nav').children()].forEach((e) => {
            if($(e).attr('data-active')){
                $(e).attr('data-active', 'false')
                $(e).css({ 'background': 'none' })
            } 
        })
        activate($(this))
        getContent('/index', 'Статистика приложения')
    }) 
    $('#list-users-page-li').on('click', function(){
        [...$('#menu-ul-nav').children()].forEach((e) => {
            if($(e).attr('data-active')){
                $(e).attr('data-active', 'false')
                $(e).css({ 'background': 'none' })
            } 
        })
        activate($(this))
        getContent('/list-users', 'Список пользователей')
    })
    $('#battl-page-li').on('click', function(){
        [...$('#menu-ul-nav').children()].forEach((e) => {
            if($(e).attr('data-active')){
                $(e).attr('data-active', 'false')
                $(e).css({ 'background': 'none' })
            } 
        })
        activate($(this))
        getContent('/battl', 'Расписание Боёв')
    })
    $('#push-page-li').on('click', function(){
        [...$('#menu-ul-nav').children()].forEach((e) => {
            if($(e).attr('data-active')){
                $(e).attr('data-active', 'false')
                $(e).css({ 'background': 'none' })
            } 
        })
        activate($(this))
        getContent('/push', 'Push-Уведомления')
    })
    $('#statistic-page-li').on('click', function() {
        [...$('#menu-ul-nav').children()].forEach((e) => {
            if($(e).attr('data-active')){
                $(e).attr('data-active', 'false')
                $(e).css({ 'background': 'none' })
            } 
        })
        activate($(this))
        getContent('/statistic', 'Статистика пользователей')
    })
    $('#message-page-li').on('click', function(){
        [...$('#menu-ul-nav').children()].forEach((e) => {
            if($(e).attr('data-active')){
                $(e).attr('data-active', 'false')
                $(e).css({ 'background': 'none' })
            } 
        })
        activate($(this))
        getContent('/message', 'Сообщения')
    })
    $('#store-page-li').on('click', function(){
        [...$('#menu-ul-nav').children()].forEach((e) => {
            if($(e).attr('data-active')){
                $(e).attr('data-active', 'false')
                $(e).css({ 'background': 'none' })
            } 
        })
        activate($(this))
        getContent('/store', 'Магазин')
    })
    $('#docs-page-li').on('click', function(){
        [...$('#menu-ul-nav').children()].forEach((e) => {
            if($(e).attr('data-active')){
                $(e).attr('data-active', 'false')
                $(e).css({ 'background': 'none' })
            } 
        })
        activate($(this))
        getContent('/docs', 'Настройки')
    })

})


function activate(e) {
    $(e).attr('data-active', 'true')
    $(e).css({ 'background': 'rgba(0, 0, 0, 0.1)' })
}

// Делаем запрос на сервер 
function getContent(url, title) {
    titleDiv.empty()
    contentDiv.empty()
    $.ajax({
        url: url,
        type: 'GET',
        success: function(data){
            titleDiv.append(title)
            contentDiv.append(data)
        } 
    })
}