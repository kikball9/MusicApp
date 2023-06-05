/* DELETE COMPTE */
document.getElementById("del-account-btn").addEventListener("click", () => {
    ajaxRequest("DELETE", "../php/request.php/user", ()=> {return;});
    document.getElementById("home_page").style.display = "none";
});