/* USER INFORMATION */

function fetchUserInfos(user){
    if(user[0]["src"] != "none") document.getElementById("img-user").setAttribute("src", user[0]["src"])
    document.getElementById("name-user").innerHTML = user[0]["name_user"];
    document.getElementById("first-name-user").innerHTML = user[0]["first_name"];
    document.getElementById("email-user").innerHTML = user[0]["email"];

    document.getElementById("name-edit-input").setAttribute("placeholder", user[0]["name_user"]);
    document.getElementById("firstname-edit-input").setAttribute("placeholder", user[0]["first_name"]);
    document.getElementById("age-edit-input").value = user[0]["date_birth"].substr(0,10);
}

function displayAccount(){
    hideEverything()
    displayHeaderFooter();
    document.getElementById("account_page").style.display = "block";
    ajaxRequest("GET", "php/request.php/user", fetchUserInfos);
}

// EDIT USER INFORMATION
document.getElementById("user-edit-form").onsubmit = (event) => {

    event.preventDefault();

    prenom_user = document.getElementById("name-edit-input").value;
    nom_user = document.getElementById("firstname-edit-input").value;
    age_user = document.getElementById("age-edit-input").value;
    pwd = document.getElementById("account-pwd-input").value;
    confirm_pwd = document.getElementById("account-confirm-pwd-input").value;
    if (pwd != confirm_pwd){
        console.log("Error");
    }
    else {
        ajaxRequest("PUT", "php/request.php/user", ()=>{ajaxRequest("GET", "php/request.php/user", fetchUserInfos);}, "password="+pwd+"&first_name="+prenom_user+"&name_user="+nom_user+"&date_birth="+age_user);
        console.log("Changement effectué");
    }
}

/* DELETE USER ACCOUNT */
document.getElementById("del-account-btn").addEventListener("click", () => {
    ajaxRequest("DELETE", "php/request.php/user", ()=> {return;});
    document.getElementById("home_page").style.display = "none";
});