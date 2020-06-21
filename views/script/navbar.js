$(document).ready(function () {
    var bools = true;
    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').toggleClass('active');
        if(bools) {
            $('.text-li').hide('')
            $('.li-menu').css({'padding':'0px', 'font-weight': 'bolder'}).attr('class', 'm-3 mt-5 li-menu')
            $('.i-li').css({'width':'21px', 'height':'21px', 'text-align': 'center'})
            $('[data-toggle="tooltip"]').tooltip('enable')
            bools = false
        } else {
            $('.li-menu').css({'padding':'15px', 'font-weight': 'lighter'}).attr('class', 'm-3 li-menu')
            $('.text-li').show('')
            $('.i-li').css({'width':'15px', 'height':'15px'})
            $('[data-toggle="tooltip"]').tooltip('disable')
            bools = true
        }
    });

    $('.li-menu').on('mouseenter', function() {
        if(!bools) {
            $(this).css({ 'background': 'none' })
        } else {
            $(this).css({ 'background': 'rgba(0, 0, 0, 0.1)' }) 
        }
    }).on('mouseleave', function(){  
        let bol = $(this).attr('data-active')
        if(bol == 'false') {    
            $(this).css({ 'background': 'none' })
        } 
    })
    
});
