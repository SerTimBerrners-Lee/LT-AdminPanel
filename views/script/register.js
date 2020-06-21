$(document).ready(function() {

    showHide = false;
    $('#process-data').hide();

    $('.content-two').hide()

    $('#btn-sign').on('click', function() {
        sign()
    })
    $('#btn-reg').on('click', function() {
        reg()
    })

    $('.btn-show-hide').on('click', function() {
        showReg()
    })

    function sign() {
        $('#process-data').show()
        let login = $('#sign-in-login').val()
        let password = $('#sign-in-password').val()
        console.log('SIGN', login, password)
        $.ajax({
            url: '/',
            method: 'post',
            data: 
                {
                    sign: true,
                    login: login,
                    password: password
                },
            success: function (data) {
                $('#process-data').hide()
                if(data.type == 'error') {
                    alertError(data.message)
                    
                } else if(data.type == 'success') {
                    document.location.reload(true);
                }
                console.log(data)
            }
        })
    }

    function reg() {
        $('#process-data').show()
        let login = $('#reg-in-login').val();
        let password = $('#reg-in-password').val()
        let email = $('#reg-in-email').val()
        console.log('REG', login, password)
        $.ajax({
            url: '/',
            method: 'post',
            data: 
                { 
                    registration: true,
                    login: login,
                    password: password,
                    email: email
                },
            success: function (data) {
                $('#process-data').hide()
                if(data.type == 'error') {
                    alertError(data.message)
                    
                } else if(data.type == 'success') {
                    alertSuccess(data.message)
                }
            }
        })
    }


    function showReg() {
        
        if(showHide) {
            $('.content-two').hide()
            $('.content-one').show()
            showHide = false
        } else {
            $('.content-one').hide()
            $('.content-two').show()
            showHide = true
        }
    }
})