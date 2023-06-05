/* Creation nouvelle playlist */
document.getElementById("btn-create-playlist").addEventListener("click", () => {
    document.getElementById("create-playlist-form").style.display = "block";
    document.getElementById("create-playlist").style.display = "none";
});

document.getElementById("playlist-created-btn").addEventListener("click", () => {
    document.getElementById("create-playlist-form").style.display = "none";
    document.getElementById("create-playlist").style.display = "block";
});

document.getElementById("playlist-cancel-btn").addEventListener("click", () => {
    document.getElementById("create-playlist-form").style.display = "none";
    document.getElementById("create-playlist").style.display = "block";
});