'use strict';

function ajaxRequest(type, url, callback, data=null){
    // Create XML HTTP request.
    let xhr = new XMLHttpRequest();
    xhr.open(type, url);
    xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');

    // Add onload function.
    xhr.onload = () => {
        switch (xhr.status) {
            case 200:
            case 201: 
                callback(xhr.responseText);
                break;
            default: 
                callback(xhr.status);
                break;
        }
    };

    // Send XML HTTP request.
    xhr.send(data);
}


function displayTimestamp(timestamp){
    // console.log(response);
    document.getElementById('timestamp').innerHTML = '<i class="fas fa-clock"></i> ' + timestamp;
}


function httpErrors(errorCode){

    let message = {
        400: "Requête incorrecte",
        401: "Authenthifiez-vous",
        403: "Accès refusé",
        404: "Page non trouvée",
        500: "Erreur du serveur",
        503: "Service temporairement indisponible"
    }

    for(let code in message){
        if(code == errorCode){
            $('#errors').show();
            document.getElementById('errors').innerHTML = code + ": " + message[code];
        }
    }
}


setInterval(ajaxRequest, 1000, 'GET','http://communicationweb/TP1-AJAX/php/timestamp.php',displayTimestamp);
setInterval(ajaxRequest, 1000, 'GET','http://communicationweb/TP1-AJAX/php/errors.php',httpErrors);