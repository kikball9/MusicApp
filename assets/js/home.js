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
            document.getElementById("home-page-last-listened-container").innerHTML += '\
            <li value="'+last_listened[i]["id_tracks"]+'" class="track-bar" class="list-group-item m-2 w-50 p-0 d-flex p-0 m-0 text-white"> \
                <div class="m-auto w-100 d-flex">\
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
                </div>/\
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

function displayAddPlaylist(myPlaylists){
    document.getElementById("add_playlist_page").style.display = "block";
    if (myPlaylists.length == 0){
        document.getElementById("home-page-playlist-container").innerHTML = "<h3 class='text-white'>Pas de playlist créée</h3>";
    }
    else {
        document.getElementById("home-page-playlist-container").innerHTML = "";
    }
    for (var i=0;i<myPlaylists.length;i++){
        document.getElementById("home-page-playlist-container").innerHTML += '<li value="'+myPlaylists[i]["playlist-info"]["id_playlist"]+'" class="album" class="list-group-item text-white p-0 d-flex m-2"> \
        <div onmouseover="this.style.cursor=\'pointer\'" onclick="displayPagePlaylist('+myPlaylists[i]["playlist-info"]["id_playlist"]+');"> \
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
    ajaxRequest("GET", "php/request.php/playlist", displayAddPlaylist);
}

function hideHome(){
    document.getElementById("last_listen_page").style.display = "none";
    document.getElementById("liked_titles_page").style.display = "none";
    document.getElementById("add_playlist_page").style.display = "none";
}

function hideHeaderFooter(){
    document.getElementsByTagName("header")[0].style.display = "none";
    document.getElementsByTagName("footer")[0].style.display = "none";
}

function displayHeaderFooter(){
    document.getElementsByTagName("header")[0].style.display = "block";
    document.getElementsByTagName("footer")[0].style.display = "block";
}

function hideEverything(){
    document.getElementById("login_page").style.display = "none";
    document.getElementById("signin_page").style.display = "none";
    hideHome();
    document.getElementById("account_page").style.display = "none";
    document.getElementById("album_page").style.display = "none";
    document.getElementById("artist_page").style.display = "none";
    document.getElementById("track_page").style.display = "none";
    document.getElementById("research-div").style.display = "none";
    document.getElementById("playlist_page").style.display = "none"
    hideHeaderFooter();
}

function displayFavs(){
    hideEverything();
    displayHeaderFooter();
    ajaxRequest("GET", "php/request.php/favorites", displayLikedTracks);
}

function researchTrack(allTracks){
    var trackFind = false;
    document.getElementById("research-div").innerHTML += "<h1 class='text-white'>Titres:</h1>"
    for(var i=0;i<allTracks.length;i++){
        if (myResearch == allTracks[i]["name_tracks"]){
            document.getElementById("research-div").innerHTML += '\
            <li onclick="displayPageTrack('+allTracks[i]["id_tracks"]+')" onmouseover="this.style.cursor=\'pointer\'" value="'+allTracks[i]["id_tracks"]+'" class="track-bar list-group-item m-2 w-50 p-0 d-flex p-0 m-0 text-white"> \
            <img class="img-small" src="'+allTracks[i]["img_album"]+'" alt="album_img"> \
            <div class="text-center title p-1 text-white"> \
                <ul class="m-0  list-inline" style="list-style: none;"> \
                    <li class="list-inline-item">'+allTracks[i]["name_tracks"]+'</li> \
                    <i class="bi bi-dot"></i> \
                    <li class="list-inline-item">'+allTracks[i]["name_artist"]+'</li> \
                    <i class="bi bi-dot"></i> \
                    <li class="list-inline-item">'+sec2min(allTracks[i]["duration"])+'</li> \
                </ul> \
            </div> \
            <button class="btn"> \
                <i class="bi bi-heart heart icon-btn" aria-hidden="true"></i> \
            </button> \
            <button class="btn"> \
                <i class="bi bi-three-dots-vertical three-dot"></i> \
            </button> \
          </li>';
          trackFind = true
        }
    }
    if (!trackFind){
        document.getElementById("research-div").innerHTML += "<h3 class='text-white'>Aucun titre trouvé</h3>"
    }
}

function researchArtist(allArtists){
    var artistFind = false;
    document.getElementById("research-div").innerHTML += "<h1 class='text-white'>Artistes:</h1>"
    for(var i=0;i<allArtists.length;i++){
        if (myResearch == allArtists[i]["artist-infos"][0]["name_artist"]){
            document.getElementById("research-div").innerHTML += '<div onclick="displayPageArtist('+allArtists[i]["artist-infos"][0]["id_artist"]+');" onmouseover="this.style.cursor=\'pointer\'" style="border-radius: 25px;" class="container bg-gradient text-white d-flex align-items-center list-group-item"> \
            <img src="'+allArtists[i]["artist-infos"][0]["img_path"]+'" alt="album_img" class="img-large"> \
            <div class="w-100" style="margin-left: 1.5rem;"> \
                <p class="title-detail artist-title" class="mb-0">'+allArtists[i]["artist-infos"][0]["name_artist"]+'</p> \
                <div class="d-flex  align-items-center list-group-item"> \
                    <small id="type_artist" class="m-0"> \
                        '+allArtists[i]["artist-infos"][0]["type_artist"]+' \
                    </small> \
                </div> \
            </div> \
        </div>';
        artistFind =true;
        }
    }
    if (!artistFind){
        document.getElementById("research-div").innerHTML += "<h3 class='text-white'>Aucun artiste trouvé</h3>"
    }
}

function researchAlbum(allAlbums){
    var date, newDate;
    var albumFind = false;
    document.getElementById("research-div").innerHTML += "<h1 class='text-white'>Albums:</h1>"
    for(var i=0;i<allAlbums.length;i++){
        if (myResearch == allAlbums[i]["album-infos"][0]["name_album"]){
            date= allAlbums[i]["album-infos"][0]["date_published"].split(' ')[0].split("-");
            newDate = date[2]+"/"+date[1]+"/"+date[0];
            document.getElementById("research-div").innerHTML += '<div onclick="displayPageAlbum('+allAlbums[i]["album-infos"][0]["id_album"]+')" onmouseover="this.style.cursor=\'pointer\'" style="border-radius: 25px;" class="container bg-gradient text-white d-flex align-items-center list-group-item mb-5"> \
            <img src="'+allAlbums[i]["album-infos"][0]["img_path"]+'" alt="album_img" class="img-large"> \
            <div class="w-100" style="margin-left: 1.5rem;"> \
                <p  class="title-detail">'+allAlbums[i]["album-infos"][0]["name_album"]+'</p> \
                <div class="d-flex  align-items-center list-group-item"> \
                    <img  src="'+allAlbums[i]["album-infos"][0]["artist_img"]+'" alt="artist_img" class="img-small" style="clip-path: ellipse(50% 50%); height: 200px; width: 200px;"> \
                    <small class="w-100 m-lg-4"> \
                        <ul class="m-0  list-inline" style="list-style: none;"> \
                            <li class="list-inline-item">'+allAlbums[i]["album-infos"][0]["name_artist"]+'</li> \
                            <i class="bi bi-dot"></i> \
                            <li class="list-inline-item">'+allAlbums[i]["album-infos"][0]["style"]+'</li> \
                            <i class="bi bi-dot"></i> \
                            <li class="list-inline-item">'+newDate+'</li> \
                        </ul> \
                    </small> \
                    </div> \
                </div> \
            </div>';
            albumFind = true;
        }
    }
    if (!albumFind){
        document.getElementById("research-div").innerHTML += "<h3 class='text-white'>Aucun album trouvé</h3>"
    }
}

/* Creation nouvelle playlist */
document.getElementById("create-playlist-form").onsubmit = (event)=>{
    event.preventDefault();
    ajaxRequest("POST", "php/request.php/playlist", ()=>{ajaxRequest("GET", "php/request.php/playlist", displayAddPlaylist);}, "name_playlist="+document.getElementById("playlist-input").value)
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

document.getElementById("playlist-btn").onclick = ()=>{
    hideEverything();
    displayHeaderFooter();
    ajaxRequest("GET", "php/request.php/playlist", displayAddPlaylist);

}

/*Barre de recherche du header*/
document.getElementById("search-form").onsubmit = (event)=>{
    event.preventDefault();
    hideEverything();
    displayHeaderFooter();
    document.getElementById("research-div").innerHTML = "";
    document.getElementById("research-div").style.display = "block";
    titreCheck = document.getElementById("titre-checkbox").checked;
    artistCheck = document.getElementById("artist-checkbox").checked;
    albumCheck = document.getElementById("album-checkbox").checked;
    myResearch = document.getElementById("header-research-input").value;
    if(titreCheck){
        ajaxRequest("GET", "php/request.php/track", researchTrack);
    }
    if (artistCheck){
        ajaxRequest("GET", "php/request.php/artist", researchArtist);
    }
    if (albumCheck){
        ajaxRequest("GET", "php/request.php/album", researchAlbum);
    }


}