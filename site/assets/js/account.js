// Affichage dynamique des informations de l'utilisateur dans la section Account
function fetchUserInfos(user){

    // affichage des informations de l'utilisateur
    document.getElementById("name-user").innerHTML = user[0]["name_user"];
    document.getElementById("first-name-user").innerHTML = user[0]["first_name"];
    document.getElementById("email-user").innerHTML = user[0]["email"];
    document.getElementById("img-user").setAttribute("src", "assets/img/profil-icon.png");
    // affichage des informations de l'utilisateur dans le formulaire
    document.getElementById("name-edit-input").setAttribute("placeholder", user[0]["name_user"]);
    document.getElementById("firstname-edit-input").setAttribute("placeholder", user[0]["first_name"]);
    document.getElementById("age-edit-input").value = user[0]["date_birth"].substr(0,10);
}

// Affichage de la section Account
function displayAccount(){
    hideEverything()
    displayHeaderFooter();
    // Rend la section Account visible
    document.getElementById("account_page").style.display = "block";

    ajaxRequest("GET", "php/request.php/user", fetchUserInfos);
}

// Modification des informations de l'utilisateur
document.getElementById("user-edit-form").onsubmit = (event) => {

    // évite de déclencher l'évènement du bouton parent
    event.preventDefault();

    // récupération des valeurs des champs
    prenom_user = document.getElementById("name-edit-input").value;
    nom_user = document.getElementById("firstname-edit-input").value;
    age_user = document.getElementById("age-edit-input").value;
    pwd = document.getElementById("account-pwd-input").value;
    confirm_pwd = document.getElementById("account-confirm-pwd-input").value;
    
    // si les mots de passe sont différents
    if (pwd != confirm_pwd){
        alert("Mots de passe différents !");
    }else{
        // modification des informations de l'utilisateur dans la BDD
        ajaxRequest("PUT", "php/request.php/user", ()=>{ajaxRequest("GET", "php/request.php/user", fetchUserInfos);}, "password="+pwd+"&first_name="+prenom_user+"&name_user="+nom_user+"&date_birth="+age_user);
        alert("Changement effectué");
    }
}

// Suppression du compte utilisateur
document.getElementById("del-account-btn").addEventListener("click", () => {
    // supprime le compte utilisateur de la BDD
    ajaxRequest("DELETE", "php/request.php/user", ()=> {return;});
    alert("Compte utilisateur supprimé");
    // affichage de la section Login
    document.getElementById("home_page").style.display = "none";
    document.getElementById("login_page").style.display = "block";
});