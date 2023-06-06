/* DELETE USER ACCOUNT */
document.getElementById("del-account-btn").addEventListener("click", () => {
    ajaxRequest("DELETE", "../php/request.php/user", ()=> {return;});
    document.getElementById("home_page").style.display = "none";
});

/* USER INFORMATION */
ajaxRequest("GET", "../php/request.php/user", (user)=> {
    if(user[0]["src"] != "none") document.getElementById("img-user").setAttribute("src", user[0]["src"])
    document.getElementById("name-user").innerHTML = user[0]["name_user"];
    document.getElementById("first-name-user").innerHTML = user[0]["first_name"];
    document.getElementById("email-user").innerHTML = user[0]["email"];

    document.getElementById("name-edit-input").setAttribute("placeholder", user[0]["name_user"]);
    document.getElementById("firstname-edit-input").setAttribute("placeholder", user[0]["first_name"]);
    document.getElementById("age-edit-input").value = user[0]["date_birth"].substr(0,10);
})

// EDIT USER INFORMATION
document.getElementById("user-edit-form").onsubmit = (event) => {

    event.preventDefault();

    prenom_user = document.getElementById("name-edit-input").value;
    nom_user = document.getElementById("firstname-edit-input").value;
    age_user = document.getElementById("age-edit-input").value;

    // Cookies.set("login", userLogin);
    // Cookies.set("login", mail_user);
    // console.log("info: ",mail_user, mdp_user);
    
    // var xhr = new XMLHttpRequest();
    
    // xhr.open("PUT", "php/request.php/user"); 
    // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    // // xhr.setRequestHeader("Authorization", "Basic "+btoa(mail_user+":"+mdp_user));

    // xhr.onload = () => {
    //     switch (xhr.status){
    //         case 200:
    //         case 201:
    //             //Cacher l'auth et afficher le reste
    //             console.log("success !");
    //             break;
    //         default:
    //             httpErrors(xhr.status);
    //     }
    // };
    // // xhr.onloadend = () => {
    // //     //Récupérer les données du site
    // //     // Cookies.set("email", mail_user);
    // //     // Cookies.set("token", xhr.responseText);
    // // };
    // xhr.send("first_name="+prenom_user+"&name_user="+nom_user+"&date_birth="+age_user);
}