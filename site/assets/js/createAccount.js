// Submit du formulaire de création de compte pressé
document.getElementById("create-form").onsubmit = (event) => {
    
    // évite de déclencher l'évènement du bouton parent
    event.preventDefault();

    // récupération des valeurs des champs du formulaire
    prenom_user = document.getElementById("prenom-input").value;
    nom_user = document.getElementById("nom-input").value;
    age_user = document.getElementById("age-input").value;
    mail_user = document.getElementById("mail-input").value;
    mdp_user = document.getElementById("mdp-input").value;
    confirm_mdp_user = document.getElementById("confirm-mdp-input").value;


    if (mdp_user != confirm_mdp_user){
        alert("Mots de passe différents !");
        exit();
    }

    var xhr = new XMLHttpRequest();

    // création du nouveau compte utilisateur dans la BDD
    xhr.open("POST", "php/request.php/user"); 
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader("Authorization", "Basic "+btoa(mail_user+":"+mdp_user));
    xhr.onload = () => {
        switch (xhr.status){
            case 200:
            case 201:
                // affiche la section Home
                displayPageHome();                
                break;
            default:
                document.getElementById("bad_pwd").style.display = "block";
                httpErrors(xhr.status);
        }
    };
    xhr.onloadend = () => {
        // récupérer les données du site
        Cookies.set("email", mail_user);
        Cookies.set("token", xhr.responseText);
        displayPageHome();
    };

    xhr.send("first_name="+prenom_user+"&name_user="+nom_user+"&date_birth="+age_user);
    document.getElementById("login-input").value = "";
    document.getElementById("password-input").value = "";
}

// Evenements sur les boutons création de compte
document.getElementById("create-account-btn").addEventListener("click", () => {
    document.getElementById("login_page").style.display = "none";
    document.getElementById("signin_page").style.display = "block";
});

document.getElementById("connect-btn").addEventListener("click", () => {
    document.getElementById("login_page").style.display = "block";
    document.getElementById("signin_page").style.display = "none";
});