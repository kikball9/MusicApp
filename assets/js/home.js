var idAlbum;
var idTrack;

function sec2min(sec){
    return Math.trunc(sec/60)+":"+sec%60;
}

function displayLastListened(last_listened){
    document.getElementById("last_listen_page").style.display = "block";
    if (last_listened.length == 0){
        document.getElementById("home-page-last-listened-container").innerHTML = "<h3 class='text-white'>Aucun titres écouté</h3>";

    }
    else {
        document.getElementById("home-page-last-listened-container").innerHTML = "";
    }
    for (var i=0;i<last_listened.length;i++){
        if (i <= 9){
            document.getElementById("home-page-last-listened-container").innerHTML += '<li value="'+last_listened[i]["id_tracks"]+'" class="track-bar" class="list-group-item m-2 w-50 p-0 d-flex p-0 m-0 text-white"> \
            <img class="img-small" src="'+last_listened[i]["img_album"]+'" alt="album_img"> \
            <div class="text-center title p-1 text-white"> \
                <ul class="m-0  list-inline" style="list-style: none;"> \
                    <li class="list-inline-item">'+last_listened[i]["name_tracks"]+'</li> \
                    <i class="bi bi-dot"></i> \
                    <li class="list-inline-item">'+last_listened[i]["name_artist"]+'</li> \
                    <i class="bi bi-dot"></i> \
                    <li class="list-inline-item">'+sec2min(last_listened[i]["duration"])+'</li> \
                </ul> \
            </div> \
            <button class="btn"> \
                <i class="bi bi-heart heart icon-btn" aria-hidden="true"></i> \
            </button> \
            <button class="btn"> \
                <i class="bi bi-three-dots-vertical three-dot"></i> \
            </button> \
        </li>';
        }
    }
}

function displayLikedTracks(likedTracks){
    document.getElementById("liked_titles_page").style.display = "block";
    if (likedTracks.length == 0){
        document.getElementById("home-page-liked-container").innerHTML = "<h3 class='text-white'>Aucun titres aimé</h3>";
    } 
    else {
        document.getElementById("home-page-liked-container").innerHTML = ""
    }
    for (var i=0;i<likedTracks.length;i++){
        document.getElementById("home-page-liked-container").innerHTML += '<li values="'+likedTracks[i]["id_tracks"]+'" class="track-bar" class="list-group-item m-2 w-50 p-0 d-flex p-0 m-0 text-white"> \
        <img class="img-small" src="'+likedTracks[i]["album_img"]+'" alt="album_img"> \
        <div class="text-center title p-1 text-white"> \
            <ul class="m-0  list-inline" style="list-style: none;"> \
                <li class="list-inline-item">'+likedTracks[i]["name_tracks"]+'</li> \
                <i class="bi bi-dot"></i> \
                <li class="list-inline-item">'+likedTracks[i]["name_artist"]+'</li> \
                <i class="bi bi-dot"></i> \
                <li class="list-inline-item">'+sec2min(likedTracks[i]["duration"])+'</li> \
            </ul> \
        </div> \
        <button class="btn"> \
            <i class="bi bi-suit-heart-fill filled-heart icon-btn" aria-hidden="true"></i> \
        </button> \
        <button class="btn"> \
            <i class="bi bi-three-dots-vertical three-dot"></i> \
        </button> \
    </li>'
    }

}

function displayPlaylist(myPlaylists){
    document.getElementById("add_playlist_page").style.display = "block";
    if (myPlaylists.length == 0){
        document.getElementById("home-page-playlist-container").innerHTML = "<h3 class='text-white'>Pas de playlist créée</h3>";
    }
    else {
        document.getElementById("home-page-playlist-container").innerHTML = "";
    }
    for (var i=0;i<myPlaylists.length;i++){
        document.getElementById("home-page-playlist-container").innerHTML += '<li value="'+myPlaylists[i]["playlist-info"]["id_playlist"]+'" class="album" class="list-group-item text-white p-0 d-flex m-2"> \
        <div> \
            <img src="'+myPlaylists[i]["playlist-info"]["img_path"]+'" alt="album_img" class="img-large"> \
            <div class="album-title" class="text-center">'+myPlaylists[i]["playlist-info"]["name_playlist"]+'</div> \
        </div> \
      </li>';
    }
}

function displayPageHome(){
    hideEverything();
    displayHeaderFooter();
    ajaxRequest("GET", "php/request.php/last_listened", displayLastListened);
    ajaxRequest("GET", "php/request.php/favorites", displayLikedTracks);
    ajaxRequest("GET", "php/request.php/playlist", displayPlaylist);
}

function hideHome(){
    document.getElementById("last_listen_page").style.display = "none";
    document.getElementById("liked_titles_page").style.display = "none";
    document.getElementById("add_playlist_page").style.display = "none";
}

function hideHeaderFooter(){
    document.getElementsByTagName("header")[0].style.display = "none";
    document.getElementsByTagName("footer")[0].style.display = "none";
    console.log("ji suis pas");
}

function displayHeaderFooter(){
    document.getElementsByTagName("header")[0].style.display = "block";
    document.getElementsByTagName("footer")[0].style.display = "block";
    console.log("ji suis");
    document.getElementById("home_page").style.top = (window.innerHeight*0.05+document.getElementsByTagName("header")[0].clientHeight+10)+"px";
}

function hideEverything(){
    document.getElementById("login_page").style.display = "none";
    document.getElementById("signin_page").style.display = "none";
    hideHome();
    document.getElementById("account_page").style.display = "none";
    document.getElementById("album_page").style.display = "none";
    document.getElementById("artist_page").style.display = "none";
    document.getElementById("track_page").style.display = "none";
    hideHeaderFooter();
}

function displayFavs(){
    hideEverything();
    displayHeaderFooter();
    ajaxRequest("GET", "php/request.php/favorites", displayLikedTracks);
}

/* Creation nouvelle playlist */
document.getElementById("create-playlist-form").onsubmit = (event)=>{
    event.preventDefault();
    ajaxRequest("POST", "php/request.php/playlist", ()=>{return;}, "name_playlist="+document.getElementById("playlist-input").value)
    ajaxRequest("GET", "php/request.php/playlist", displayPlaylist);
}
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

/*Bouttons du header*/
document.getElementById("account-btn").onclick = ()=>{
    displayAccount();
}

document.getElementById("favs-btn").onclick = ()=>{
    displayFavs();
}

document.getElementById("home-btn").onclick = ()=>{
    displayPageHome();
}
