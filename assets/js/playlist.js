var idPlaylist;

function sec2min(sec){
    return Math.trunc(sec/60)+":"+sec%60;
}

function displayTrack(myTrack){
    // console.log(myTrack["name_tracks"]);
    
    document.getElementById("track-container").innerHTML += '\
            <li onclick="displayPageTrack('+myTrack["id_tracks"]+')" onmouseover="this.style.cursor=\'pointer\'" value="'+myTrack["id_tracks"]+'" class="track-bar list-group-item m-2 w-50 p-0 d-flex p-0 m-0 text-white" style="border: none;"> \
                <div id="A" onclick="handleAClick()" class="m-auto w-100 d-flex"> \
                <img id="album-img'+myTrack["id_tracks"]+'" class="img-small" src="" alt="album_img"> \
                <div class="btn play-btn"> \
                    <i id="target" class="bi bi-play-fill heart"></i> \
                </div> \
                <div class="text-center title p-1 text-white"> \
                    <ul class="m-0  list-inline" style="list-style: none;"> \
                        <li class="list-inline-item">'+myTrack["name_tracks"]+'</li> \
                        <i class="bi bi-dot"></i> \
                        <li id="artist-name'+myTrack["id_tracks"]+'" class="list-inline-item"></li> \
                        <i class="bi bi-dot"></i> \
                        <li class="list-inline-item">'+sec2min(myTrack["duration"])+'</li> \
                    </ul> \
                </div> \
                <button id="btn-liked" onclick="handleLikedClick(event)" class="btn"> \
                    <i class="bi bi-heart heart icon-btn" aria-hidden="true"></i> \
                </button> \
                <button id="btn-delete" onclick="handleDeleteClick(event)" class="btn"> \
                    <i class="bi bi-x-lg heart icon-btn"></i> \
                </button> \
                <button id="btn-info" onclick="handleInfoClick(event)" class="btn"> \
                    <i class="bi bi-info-circle heart icon-btn"></i> \
                </button> \
                </div> \
            </li>';

    ajaxRequest("GET", "php/request.php/album?id_album="+myTrack["id_album"], (myAlbum) => {
        console.log(myAlbum["album-infos"][0]["img_path"]);
        document.getElementById("album-img"+myTrack["id_tracks"]).setAttribute("src", myAlbum["album-infos"][0]["img_path"]); 
    });
    ajaxRequest("GET", "php/request.php/artist?id_artist="+myTrack["id_artist"], (myArtist) => {
        console.log(myArtist["artist-infos"][0]["name_artist"]);
        document.getElementById("artist-name"+myTrack["id_tracks"]).innerHTML = myArtist["artist-infos"][0]["name_artist"];
    });
}

function displayPlaylist(myPlaylist){

    // console.log(myPlaylist["playlist-info"]["img_path"]);

    document.getElementById("playlist-img").setAttribute("src", myPlaylist["playlist-info"]["img_path"]);
    document.getElementById("playlist-name").innerHTML = myPlaylist["playlist-info"]["name_playlist"];
    
    var date= myPlaylist["playlist-info"]["date_creation"].split(' ')[0].split("-");
    var newDate = date[2]+"/"+date[1]+"/"+date[0];
    document.getElementById("playlist-date-published").innerHTML = newDate;

    for(var i=0; i<myPlaylist["playlist-tracks"].length; i++){
        ajaxRequest("GET", "php/request.php/track?id_tracks="+myPlaylist["playlist-tracks"][i]["id_tracks"], displayTrack);
    }
}

function displayUser(myUser){
    
    console.log(myUser[0]);

    if(myUser[0]["src"] != "none"){
        document.getElementById("user-img").setAttribute("src", myUser[0]["src"]);    
    }
    document.getElementById("user-email").innerHTML = myUser[0]["email"]; 
}



function displayPagePlaylist(id_playlist){
    idPlaylist = id_playlist;
    hideEverything();
    displayHeaderFooter();
    
    document.getElementById("playlist_page").style.display = "block";
    document.getElementById("track-container").innerHTML = "";

    ajaxRequest("GET", "php/request.php/user", displayUser);
    ajaxRequest("GET", "php/request.php/playlist?id_playlist="+id_playlist, displayPlaylist);

    // Delete playlist
    document.getElementById("del-playlist-btn").addEventListener("click", () => {
        ajaxRequest("DELETE", "php/request.php/playlist/"+idPlaylist, ()=> {});
        displayPageHome();
    });
}