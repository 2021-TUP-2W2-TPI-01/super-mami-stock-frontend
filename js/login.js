import {POST} from './api.js';

$(document).ready(function(){

    $('#btnIngresar').click(function (){

        let username = $('#txtUsername').val();
        let password = $('#txtPassword').val();

        login(username, password);
    });


    $('#txtPassword').on('keyup', function(event){

        if (event.which == 13 || event.keyCode == 13) {
            $('#btnIngresar').click();
        }

    }) ;
    
});


async function login (username, password)
{
    let bodyRequest = {
        'usuario' : username,
        'password' : password
    }
    
    const response = await POST('/login/', bodyRequest);
        
    if (response.success) {

        createSession(response.data);
        loginSession();

    }
    else {
        
    }

}
