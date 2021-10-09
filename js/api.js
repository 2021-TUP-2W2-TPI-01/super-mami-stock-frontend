
import '../js/session.js';

const apiURL = 'http://26.100.251.19/api';
const authType = 'Token';
const dataType = 'JSON';

var getAuthorization = () => typeof storage.token !== 'undefined' ? `${authType} ${storage.token}` : '';

var getHeaders = () => {
    let headers = {};

    if (getAuthorization() !== '')
    {
        headers.Authorization = getAuthorization();
    }
    

    return headers;
}


async function GET(path) {

    let response = {};
    
    try {
        await $.ajax({
            url: `${apiURL}${path}`,
            type: 'GET',
            headers: getHeaders(),
            datatype: dataType,
            statusCode: {

                200: function (data) {

                    response.statusCode = 200;
                    response.success = true;
                    response.data = data;
                },
                401: function (data) {

                    response.statusCode = 401;
                    response.success = false;
                    response.data = data;

                },
                500: function (data) {

                    response.statusCode = 500;
                    response.success = false;
                    response.data = data;
                }

            }
        });
    }
    catch(error) {

        response.statusCode = 0;
        response.success = false;
        response.data = null;

    }

    return response;
}


async function POST(path, bodyRequest) {

    let response = {};
    
    try {
        await $.ajax({
            url: `${apiURL}${path}`,
            type: 'POST',
            headers: getHeaders(),
            data: bodyRequest,
            datatype: dataType,
            statusCode: {

                200: function (data) {

                    response.statusCode = 200;
                    response.success = true;
                    response.data = data;
                },
                401: function (data) {

                    response.statusCode = 401;
                    response.success = false;
                    response.data = data;

                },
                500: function (data) {

                    response.statusCode = 500;
                    response.success = false;
                    response.data = data;
                }

            }
        });
    }
    catch (error) {
        response.statusCode = 0;
        response.success = false;
        response.data = null
    }

    return response;
}


async function PUT(path, bodyRequest) {

    let response = {};
    
    try {
        await $.ajax({
            url: `${apiURL}${path}`,
            type: 'PUT',
            headers: getHeaders(),
            data: bodyRequest,
            datatype: dataType,
            statusCode: {

                200: function (data) {

                    response.statusCode = 200;
                    response.success = true;
                    response.data = data;
                },
                401: function (data) {

                    response.statusCode = 401;
                    response.success = false;
                    response.data = data;

                },
                500: function (data) {

                    response.statusCode = 500;
                    response.success = false;
                    response.data = data;
                }

            }
        });
    }
    catch (error) {
        response.statusCode = 0;
        response.success = false;
        response.data = null
    }

    return response;
}


async function DELETE(path) {

    let response = {};
    
    try {
        await $.ajax({
            url: `${apiURL}${path}`,
            type: 'DELETE',
            headers: getHeaders(),
            datatype: dataType,
            statusCode: {

                200: function (data) {

                    response.statusCode = 200;
                    response.success = true;
                    response.data = data;
                },
                401: function (data) {

                    response.statusCode = 401;
                    response.success = false;
                    response.data = data;

                },
                500: function (data) {

                    response.statusCode = 500;
                    response.success = false;
                    response.data = data;
                }

            }
        });
    }
    catch(error) {

        response.statusCode = 0;
        response.success = false;
        response.data = null;

    }

    return response;
}

export {GET,POST,PUT,DELETE};