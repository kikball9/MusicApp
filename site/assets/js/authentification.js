document.getElementById("auth-form").onsubmit = (event) => {
    var userLogin, userPassword, xhr;
    event.preventDefault();
    userLogin = document.getElementById("login-input").value;
    userPassword = document.getElementById("password-input").value;

    xhr = new XMLHttpRequest();
    xhr.open("GET", "php/request.php/authenticate");
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("Authorization", "Basic "+btoa(userLogin+":"+userPassword));
    xhr.onload = () => {
        switch (xhr.status){
            case 200:
            case 201:
                Cookies.set("token", xhr.responseText);
                // affiche la section Home
                displayPageHome();
                break;
            default:
                // si mdp incorrect
                document.getElementById("bad_pwd").style.display = "block";

                httpErrors(xhr.status);
        }
    };
    xhr.onloadend = () => {
        //Récupérer les données du site
        Cookies.set("email", userLogin);
        Cookies.set("token", xhr.responseText);
    };
    xhr.send();
    document.getElementById("login-input").value = userLogin;
    document.getElementById("password-input").value = "";
    
}

if (typeof Cookies.get("token") !== 'undefined'){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "php/request.php");
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get("token"));
    xhr.onloadend = () => {
        if (xhr.status == 200){
            // affiche la section Home
            displayPageHome();
        }
        else {
            // masque le Header/Footer
            hideHeaderFooter();
        }
    }
    xhr.send();
}
else {
    hideHeaderFooter();
}