document.getElementById("create-form").onsubmit = (event) => {
    event.preventDefault();

    prenom_user = document.getElementById("prenom-input").value;
    nom_user = document.getElementById("nom-input").value;
    age_user = document.getElementById("age-input").value;
    mail_user = document.getElementById("mail-input").value;
    mdp_user = document.getElementById("mdp-input").value;
    confirm_mdp_user = document.getElementById("confirm-mdp-input").value;
    if (mdp_user != confirm_mdp_user){
        console.log("error");
        exit();
    }

    // Cookies.set("login", userLogin);
    console.log(mail_user, mdp_user);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "php/request.php/user"); // TODO
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("Authorization", "Basic "+btoa(mail_user+":"+mdp_user));
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
        //Récupérer les données du site
        Cookies.set("token", xhr.responseText);
    };
    xhr.send("first_name="+prenom_user+"&name_user="+nom_user+"&date_birth="+age_user);
    document.getElementById("login-input").value = "";
    document.getElementById("password-input").value = "";
    
}