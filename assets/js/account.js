/* DELETE USER ACCOUNT */
document.getElementById("del-account-btn").addEventListener("click", () => {
    ajaxRequest("DELETE", "../php/request.php/user", ()=> {return;});
    document.getElementById("home_page").style.display = "none";
});

/* USER INFORMATION */
ajaxRequest("GET", "../php/request.php/user", ()=> {return;});