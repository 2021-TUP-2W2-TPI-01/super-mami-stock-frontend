var storage = window.sessionStorage;

if (window.location.pathname !== '/login.html' && window.location.pathname !== '/SMS/login.html' && window.location.pathname !== '/SMS')
{
    validateSession();
}
else
{
    storage.clear()
}

function validateSession()
{
    if (typeof storage.token === 'undefined' || storage.token == null || storage.token == '')
    {
        logoutSession();
    }    
}

function createSession(user_info)
{
    storage.nombre = user_info.nombre;
    storage.apellido = user_info.apellido;
    storage.username = user_info.username;
    storage.tipo_rol = user_info.tipo_rol;
    storage.email = user_info.email;
    storage.token = user_info.token;
}

function logoutSession()
{
    window.location = 'login.html';
}

function loginSession()
{
    window.location = 'index.html';
}

var user_info_nombre = () => storage.nombre;
var user_info_apellido = () => storage.apellido;
var user_info_username = () => storage.username;
var user_info_tipo_rol = () => storage.tipo_rol;
var user_info_email = () => storage.email;