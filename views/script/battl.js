

$(document).ready(function() {
    // 
    toltipInit()
    // При загрузки страницы выводим список активных боев в блок
    $.ajax({
        url: '/api/battle/true',
        type: 'get',
        success: function(data) {
            appendActiveBattl(data);
        }
    }) 

    var example = flatpickr('#dataBattle');

    flatpickr('#dataBattle',{
        dateFormat: 'Y-m-d',
        altFormat: "F j, Y",
    })
    // получию время    
   var time = '';
    $('#timeBattle').mdtimepicker().on('timechanged', function(e) {
            time = e.time.split('.')[0]
    })
    $('#timeBattle').mdtimepicker({
        timeFormat:'hh:mm:ss',
        hourPadding:false,
    })
    // Вклыдка с завершенными боями 
    $('#pills-completed-tab').on('click', function() {
        $('.delete-all-complite-battl').show()
        $.ajax({
            url: '/api/battle/false', 
            type: 'GET',
            success: function(data) {
                appendCompliteBattl(data)
                $('.example-getting-started').multiselect({
                    includeSelectAllOption: true,
                })

            }  
        })
    })
    // Вкладка с активными боями
    $('#pills-active-tab').on('click', function() {
        $('.delete-all-complite-battl').hide()
        $.ajax({
            url: '/api/battle/true',
            type: 'get',
            success: function(data) {
                $('#pills-active').empty();
                appendActiveBattl(data);
            }
        })
    })

    // Удалить все не активные бои
    $('.delete-all-complite-battl').on('click', function() {
        $.ajax({
            url: '/api/battle/delete/all',
            type: 'delete',
            success: function(data){
                if(data.type == 'success'){
                    alertSuccess(data.data)
                    $('#pills-completed').empty()
                }
            }
        })
    })
    // Добавляем оружие в масив
    var weapon = new Object();
    $.ajax({
        url: '/get-weapon-list',
        type: 'get',
        success: function(data) {
            data.forEach((el, index, arr) => {
                let promis = new Promise((resolve, reject) => {
                    $('#example-getting-started').append(`
                        <option value="${el.weaponCol}"> ${el.weaponName} </option>  
                    `)
                    if(index === arr.length -1) resolve()
                })

                promis.then(() => {
                    $('#example-getting-started').multiselect({
                        includeSelectAllOption: true,
                    }).on('change', (el) => {
                        weapon = [];
                        el.currentTarget.selectedOptions.forEach((e, index, arr) =>  {
                            let w = $(e).text().replace(/ /g, '') 
                            weapon[w] = Number($(e).val()); 
                        })
                    })
                }).then(() => {
                        $('button.multiselect').removeClass('btn-default')

                })
                
            })
        }
    })
    // Получаем список локаций
    $.ajax({
        url: '/get-location-list',
        type: 'get',
        success: function(data) {
            addLocationToBatl(data);
            data.forEach((el, index, arr) => {
                $('#selectAddress').append(`
                    <option value="${el.locationParametr}"> ${el.locationName} </option>
                `)
            })
        }
    })

    // Добавляем новый бой.
    $('#save-battl').on('click', function(){
        var location_name = $('#inputNameLocation').val()
        var date = $('#dataBattle').val()

        let locationParametr = $('#selectAddress').val()
        let phone = $('#inputPhone').val().length < 3 ? '+79507592524' :  $('#inputPhone').val();
        let discription = $('#inputDiscription').val()
        let col_places = $('#colPlaces').val();
        
        let promis = new Promise((resolve, reject) => {
            [...$('#selectAddress')[0]].forEach((el) => {
                if($(el).val() == locationParametr) resolve($(el).text())
            })
        })

        promis.then((el) => {
            location_adress = el
        }).then(() => {
            $.ajax({
                url: '/api/battle',
                type: 'post',
                data: {
                    location_name: location_name,
                    date: date,
                    time: time,
                    location_adress: location_adress,
                    locationParametr: locationParametr,
                    phone: phone,
                    discription: discription,
                    col_places: col_places,
                    weapon: JSON.stringify({...weapon})
                },
                success: function(data){
                    appendActiveBattl(data)
                    alertSuccess('Бой добавлен')
                    $('.example-getting-started').multiselect({
                        includeSelectAllOption: true,
                    })
                }
            })
        })
    })
})
// При наведениии мышью
$('#pills-tabContent').on('mouseenter', '.blockBattleRow', function() {
    toltipInit()
    $(this).find('.data-hidden').show()
    $(this).find('.save-battl').on('click', function() {
        let parent = $(this).parent().parent().parent().parent()
        let id = parent.find('.hidden-input-id').val();
        changeBatle(parent, id)
    })
    $(this).find('.no-active').on('click', function() {
        let parent = $(this).parent().parent().parent().parent()
        let id = parent.find('.hidden-input-id').val();
        disableBatle(parent, id)
    })
    $(this).find('.delete-battl').on('click', function() {
        let parent = $(this).parent().parent().parent().parent()
        let id = parent.find('.hidden-input-id').val();
        $.ajax({
            url:  `/api/battle/${id}`,
            type: 'delete',
            success: function(data) {
                parent.empty()
            }
        })
    })
    $(this).find('.reload-battl').on('click', function() {
        let parent = $(this).parent().parent().parent().parent()
        let id = parent.find('.hidden-input-id').val();
        $.ajax({
            url: `/api/battle/${id}/false`,
            type: 'put',
            success: function(data){
                parent.empty()
            }
        })
    })
}).on('mouseleave', '.blockBattleRow', function() {
    $(this).find('.data-hidden').hide()
    $('.save-battl').off();
    $('.no-active').off();
    $('.delete-battl').off();
    $('.reload-battl').off();
})

function selectedAddEvent(parent) {
    let arrs = [];
    let ul = $(parent).find('ul');
    return new Promise((resolve, reject) => {
        [...$(ul).children()].forEach((el, index, arr) => {
            if(index > 0) {
                let val = Number($(el).find('.typeColWeapon').val())
                arrs.push(val)
                if(index === arr.length - 1) resolve(arrs)
            }
        })
    })
}
function disableBatle(parent, id) {
    $.ajax({
        url: `/api/battle/${id}/true`,
        type: 'put',
        success: function(data){
            $(parent).empty()
        }
    })
}
//Изменяем батл
function changeBatle(el, id) {
    let weaponClass = [];

    // Изменяем значение OPTION у SELECT
    selectedAddEvent(el).then((valInput) => {
        let promis = new Promise((resolve, reject) => {
            valInput.forEach((e, index, arr) => {
                let select = $(el).find('.example-getting-started');
                select[0].options[index].value = valInput[index];
                if(index === arr.length - 1) resolve(select);
            })
        })
        // Добавляем значения в массив
        promis.then((select) => {
            let proms = new Promise((resolve, reject) => {
                select[0].selectedOptions.forEach((option, index, arr) =>  { 
                    let text = $(option).text().replace(/\s+/g,'');
                    weaponClass[text] = Number($(option).val())
                    if(index === arr.length -1 ) resolve()
                })
            })

            proms.then(() => {
                changeBatlSend(el, weaponClass, id)
            })
        })
    })
}
function changeBatlSend(el, weapon, id) {
    let location_name = $(el).find('.inputNameLocation').val();
    let date = $(el).find('.dataBattle').val();
    let time = $(el).find('.timeBattle').val()
    let locationParametr = $(el).find('.selectAddress').val();
    let location_adress = $(el).find('.selectAddress')[0].selectedOptions[0].text.replace(/\s+/g,'');
    let phone = $(el).find('.inputPhone').val();
    let discription = $(el).find('.inputDiscription').attr('placeholder');
    let col_places = $(el).find('.colPlaces').val();
    let current_places = $(el).find('.current_places').val();
    $.ajax({
        url: `/api/update-batle/${id}`,
        type: 'put',
        data: {
            location_name: location_name,
            date: date,
            time: time, 
            locationParametr: locationParametr,
            location_adress: location_adress,
            phone: phone,
            discription: discription,
            col_places: Number(col_places),
            current_places: Number(current_places),
            weapon: JSON.stringify({...weapon})
        },
        success: function(data) {
            if(data.type == 'success') {
                alertSuccess(data.message)
            }
        }
    })
}

function toltipInit() {
    $('[data-toggle="tooltip"]').tooltip('disable')
}

function appendActiveBattl(data){
    let activeBlock = $('#pills-active');
    if(Array.isArray(data)) {
        let promise  = new Promise((resolve, reject) => {
            list = []
            idIsList = []
            data.forEach((e, index, arr) => {
                activeBlock.append(layoutBattlForm(e))
                if(index === arr.length -1 ) resolve()
            })
        })
        promise.then(() => {
            $('.example-getting-started').multiselect({
                includeSelectAllOption: true,
            })
            addEditableToList()
            addListeners()
        })
    } else {
        activeBlock.prepend(layoutBattlForm(data))
    }
}

function addListeners() {
    $('button.plus').on('click', function(e) {
        e.preventDefault();
        $(this).parent().find('.current_places').trigger('change');
    })
    $('button.minus').on('click', function(e) {
        e.preventDefault();
        $(this).parent().find('.current_places').trigger('change');
    })
    $('.current_places').on('change', function() {
        let parent = $(this).parent().parent().parent();
        let id = parent.find('.hidden-input-id').val();
        let colPlaces = $(parent).find('.colPlaces').val()
        if(Number($(this).val()) >= Number(colPlaces)) {
            return disableBatle(parent, id)
        }
    })
    
}

function appendCompliteBattl(data){
    let compliteBlock = $('#pills-completed');
    compliteBlock.empty()
    data.forEach((e) => {
        compliteBlock.append(layoutBattlForm(e))
    })
}

var layoutBattlForm = (data) => {
let iconsActive = `
                    <div class="row m-1 mb-4">
                    <i class="fas fa-check-square save-battl" data-toggle="tooltip" data-placement="left" title="Сохранить изменения" style="color: rgb(109,127,204); cursor:  pointer; width: 35px; height: 35px;" onmouseover="this.style.width='50px';" onmouseout="this.style.width='35px';"></i>
                    </div>
                    <div class="row m-1 mb-4">
                    <i class="fas fa-minus-square no-active" data-toggle="tooltip" data-placement="left" title="Сделать не активной" style="color:dimgrey; cursor: pointer; width: 35px; height: 35px;"  onmouseover="this.style.width='50px';" onmouseout="this.style.width='35px';"></i>
                    </div>
                `;
 
let iconsComplited = `
                    <div class="row m-1 mb-4">
                    <i class="fas fa-trash-alt delete-battl" data-toggle="tooltip" data-placement="left" title="Удалить навсегда" style="color: rgb(21,28,38); cursor:  pointer; width: 35px; height: 35px;" onmouseover="this.style.width='50px';" onmouseout="this.style.width='35px';"></i>
                    </div>
                    <div class="row m-1 mb-4">
                    <i class="fas  fa-sync-alt reload-battl" data-toggle="tooltip" data-placement="left" title="Сделать Активным" style="color:dimgrey; cursor: pointer; width: 35px; height: 35px;"  onmouseover="this.style.width='50px';" onmouseout="this.style.width='35px';"></i>
                    </div>
                        `; 
return  `<div class="blockBattleRow">
        <div class="row mt-5 p-3" style="box-shadow: 10px 0px 10px 0px ${data.active ? 'rgb(109,127,204)' :  'rgb(21,28,38)'}">
            <div class="col" >
                <form>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label> Имя локации</label> 
                            <input type="text" name="nameLocation" style="box-shadow: 5px 0px 5px 0px ${data.active ? 'rgb(109,127,204)' :  'rgb(21,28,38)'}" value="${data.location_name}" class="form-control inputNameLocation"/>
                        </div>
                        <div class="form-group col-md-3">
                            <label> Дата проведения</label>
                            <input type="date"  value="${data.date}" style="box-shadow: 5px 0px 5px 0px ${data.active ? 'rgb(109,127,204)' :  'rgb(21,28,38)'}"  name="date" class="form-control dataBattle"/>
                        </div>
                        <div class="form-group col-md-3">
                            <label> Время проведения </label>
                            <input type="time"  value="${data.time}" style="box-shadow: 5px 0px 5px 0px ${data.active ? 'rgb(109,127,204)' :  'rgb(21,28,38)'}"  name="time" class="form-control timeBattle" />
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-6">
                            <label> Адрес локации </label>
                            <select class="form-control selectAddress" name="selectAddress" style="box-shadow: 5px 0px 5px 0px ${data.active ? 'rgb(109,127,204)' :  'rgb(21,28,38)'}">
                                <option value="${data.locationParametr}">  ${data.location_adress} </option>
                            </select>
                        </div>
                        <div class="form-group col-md-6">
                            <label> Телефон для связи </label>
                            <input type="text" name="phone" style="box-shadow: 5px 0px 5px 0px ${data.active ? 'rgb(109,127,204)' :  'rgb(21,28,38)'}"  value="${data.phone}" class="form-control inputPhone" placeholder="8-900-000-00-00"/>
                        </div>
                    </div>
                     <div class="form-row">
                        <div class="form-group col-md-6">
                            <label for="inputDiscription">Описание </label>
                            <textarea class="form-control inputDiscription"  style="box-shadow: 5px 0px 5px 0px ${data.active ? 'rgb(109,127,204)' :  'rgb(21,28,38)'}" placeholder="${data.discription}" name="discription" />
                        </div>
                        <div class="form-group col-md-6">
                            <label> Кол-во мест </label>
                            <div class="def-number-input number-input safari_only">
                                <button onclick="this.parentNode.querySelector('input[type=number]').stepDown()" class="minus"></button>
                                <input class="quantity colPlaces" min="0"  name="quantity" value="${data.col_places}" type="number">
                                <button onclick="this.parentNode.querySelector('input[type=number]').stepUp()" class="plus"></button>
                            </div>
                        </div>
                    </div>
                </form>

            </div>
            <div class="col-2" style="margin-left: 10px; margin-top: 5%">
                    ${ data.active ? iconsActive : iconsComplited }
            </div>
        </div>
       <div class="data-hidden" style="display: none">
       <h4>Дата создания: ${data.date_create.split('T')[0]}</h4>
        <label> Мест занято: </label>
        <div class="def-number-input number-input safari_only">
            <button onclick="this.parentNode.querySelector('input[type=number]').stepDown()" class="minus"></button>
            <input class="quantity current_places" min="0" name="quantity" value="${data.current_places ? data.current_places : 0}" type="number">
            <button onclick="this.parentNode.querySelector('input[type=number]').stepUp()" class="plus"></button>
        </div>
        <div class="form-row">
        <h4>Ники игроков: </h4>
            <div class="form-group col-md-6">
            </div>
            <div class="form-group col-md-6">
            ${data.login_player ? Object.entries(JSON.parse(data.login_player)).map((el, index, arr) => {

                return `<p> ${el[0]}  ${Object.entries(el[1]).map((el, inde)=> {
                    if(inde === 1) return `  Оружие:  <span>${el[1]}</span></p>`
                })} `
            }) : 'Пусто'}
            </div>
        </div>
        <div class="form-row">
            <div class="form-group col-md-6 selector-block"> 
                <select class="example-getting-started" multiple="multiple">
                    ${Object.keys(JSON.parse(data.weaponList)).map((el, index, arr) => {
                        if(index === arr.length -1 ) addInputToSelect(data.id, data.weaponList)
                        return `<option value="${el}" selected>
                            ${el}  </option>`
                    })}
                </select>
            </div>
        </div>
       <input class="hidden-input-id" type="hidden" value="${data.id}">
       </div> 
    </div>`
}

let list = [];
let idIsList = [];
function addInputToSelect(id, weaponList){
    list.push(JSON.parse(weaponList));
    idIsList.push(id)
}
// Ищем выпадающий список и добавляем к нему количество оружия 
function addEditableToList() {
    let hidden = $('.hidden-input-id');
    let parent;
    idIsList.forEach((e, index) => {
        [...$(hidden)].forEach((el) => {
            if($(el).val() == e) {
                parent = $(el).parent();
                let select = parent.find('.multiselect-container');
                let liArr = $(select).find('li.active');
                Object.values(list).map((lis, i, ars) => {
                    if(index == i) {
                        Object.values(lis).map((obj, dex)  => {
                            $(liArr[dex+1]).find('label.checkbox').append(`
                            <input type="number" class="form-control typeColWeapon" value="${obj}"/>`)
                        })                 
                    }
                })   
            }
        })
    })
}
// 

function addLocationToBatl(LIST_LOCATION) {
    LIST_LOCATION.forEach((el, index, arr) => {
        if($('.selectAddress').val() !== el.locationParametr) {
            $('.selectAddress').append(`
                <option value="${el.locationParametr}"> ${el.locationName} </option>
            `)
        }
    })
}