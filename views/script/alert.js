const alertError = (text = 'Error') => {
    $('#alert-start-top').append('<div class="alert alert-danger" role="alert" ><i class="fas fa-times" style="cursor: pointer;" data-dismiss="alert" aria-label="Close"></i> <b> ' + text + ' </b> </div>')
 }
const alertSuccess = (text = 'Successful!') => {
     $('#alert-start-top').append('<div class="alert alert-success" role="alert" ><i class="fas fa-times" style="cursor: pointer;" data-dismiss="alert" aria-label="Close"></i> <b> ' + text + ' </b> </div>')
 }

 
 