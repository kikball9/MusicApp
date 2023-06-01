document.getElementById("auth-form").onsubmit = (event) => {
    var userLogin, userPassword, xhr;
    event.preventDefault();
    userLogin = document.getElementById("login-input").value;
    userPassword = document.getElementById("password-input").value;
    Cookies.set("login", userLogin);
    xhr = new XMLHttpRequest();
    xhr.open("GET", "assets/php/request.php/authenticate");
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("Authorization", "Basic "+btoa(userLogin+":"+userPassword));
    xhr.onload = () => {
        switch (xhr.status){
            case 200:
            case 201:
                Cookies.set("token", xhr.responseText);
                //Cacher l'auth et afficher le reste
                console.log("login success");
                break;
            default:
                httpErrors(xhr.status);
                console.log("login fail");

        }
    };
    xhr.onloadend = () => {
        login = Cookies.get("login");
        //ajaxRequest("GET", "assets/php/request.php/photos/", loadPhotos);
    };
    xhr.send();
    document.getElementById("login-input").value = "";
    document.getElementById("password-input").value = "";
    
}
if (typeof Cookies.get("token") !== 'undefined'){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "assets/php/request.php");
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("Authorization", "Bearer " + Cookies.get("token"));
    xhr.onloadend = () => {
        if (xhr.status == 200){
            //Cacher l'auth et afficher le reste
    
        }
    }
    xhr.send();
}
