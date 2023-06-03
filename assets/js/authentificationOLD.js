document.getElementById("auth-form").onsubmit = (event) => {
    var userLogin, userPassword, xhr;
    event.preventDefault();
    userLogin = document.getElementById("login-input").value;
    userPassword = document.getElementById("password-input").value;

    Cookies.set("login", userLogin);
    xhr = new XMLHttpRequest();
    xhr.open("GET", "php/request.php/authenticate");
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("Authorization", "Basic "+btoa(userLogin+":"+userPassword));
    xhr.onload = () => {
        switch (xhr.status){
            case 200:
            case 201:
                //Cacher l'auth et afficher le reste
                console.log("login success !");

                document.getElementById("home_page").style.display = "block";
                document.getElementById("login_page").style.display = "none";
                document.getElementById("signin_page").style.display = "none";

                
                break;
            default:

                document.getElementById("bad_pwd").style.display = "block";

                httpErrors(xhr.status);
                console.log("login fail");
        }
    };
    xhr.onloadend = () => {
        Cookies.set("token", xhr.responseText);
        //Récupérer les données du site
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
            //Cacher l'auth et afficher le reste
            document.getElementById("home_page").style.display = "block";
            document.getElementById("login_page").style.display = "none";
            document.getElementById("signin_page").style.display = "none";
        }
    }
    xhr.send();
}
