var idPlaylist;

function sec2min(sec){
    return Math.trunc(sec/60)+":"+sec%60;
}

function displayTrack(myTrack){
    // console.log(myTrack["name_tracks"]);
    
    document.getElementById("track-container").innerHTML += '\
    <li onmouseover="this.style.cursor=\'pointer\'" onclick="displayPageTrack('+myTrack["id_tracks"]+')" value="'+myTrack["id_tracks"]+'" class="track-bar list-group-item m-2 w-50 p-0 d-flex p-0 m-0 text-white"> \
        <div class="m-auto w-100 d-flex">\
            <img id="album-img'+myTrack["id_tracks"]+'" class="img-small" src="" alt="album_img"> \
            <div class="text-center title p-1 text-white"> \
                <ul class="m-0  list-inline" style="list-style: none;"> \
                    <li class="list-inline-item">'+myTrack["name_tracks"]+'</li> \
                    <i class="bi bi-dot"></i> \
                    <li id="artist-name'+myTrack["id_tracks"]+'" class="list-inline-item"></li> \
                    <i class="bi bi-dot"></i> \
                    <li class="list-inline-item">'+sec2min(myTrack["duration"])+'</li> \
                </ul> \
            </div> \
            <button class="btn"> \
                <i class="bi bi-heart heart icon-btn" aria-hidden="true"></i> \
            </button> \
            <button class="btn"> \
                <i class="bi bi-three-dots-vertical three-dot"></i> \
            </button> \
        </div> \
    </li>';

    ajaxRequest("GET", "php/request.php/album?id_album="+myTrack["id_album"], (myAlbum) => {
        document.getElementById("album-img"+myTrack["id_tracks"]).setAttribute("src", myAlbum["album-infos"][0]["img_path"]); 
    });
    ajaxRequest("GET", "php/request.php/artist?id_artist="+myTrack["id_artist"], (myArtist) => {
        document.getElementById("artist-name"+myTrack["id_tracks"]).innerHTML =  myArtist["artist-infos"][0]["name_artist"];
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
    hideEverything();
    displayHeaderFooter();
    document.getElementById("playlist_page").style.display = "block";
    document.getElementById("track-container").innerHTML = "";
    ajaxRequest("GET", "php/request.php/user", displayUser);
    ajaxRequest("GET", "php/request.php/playlist?id_playlist="+id_playlist, displayPlaylist);
    // ajaxRequest("GET", "php/request.php/track?id_tracks=6", displayTrack);
    // ajaxRequest("GET", "php/request.php/album?id_album=2", displayAlbum);
}


// document.getElementById("track-container").innerHTML += '\
//     <li value="'+myTrack["id_tracks"]+'" class="track-bar list-group-item m-2 w-50 p-0 d-flex p-0 m-0 text-white"> \
//         <img class="img-small" src="'+myTrack[""]+'" alt="album_img"> \
//         <div class="text-center title p-1 text-white"> \
//             <ul class="m-0  list-inline" style="list-style: none;"> \
//                 <li class="list-inline-item">'+myAlbum["artist-albums"][i]["album-tracks"][j]["name_tracks"]+'</li> \
//                 <i class="bi bi-dot"></i> \
//                 <li class="list-inline-item">'+myAlbum["artist-infos"][0]["name_artist"]+'</li> \
//                 <i class="bi bi-dot"></i> \
//                 <li class="list-inline-item">'+sec2min(myAlbum["artist-albums"][i]["album-tracks"][j]["duration"])+'</li> \
//             </ul> \
//         </div> \
//         <button class="btn"> \
//             <i class="bi bi-heart heart icon-btn" aria-hidden="true"></i> \
//         </button> \
//         <button class="btn"> \
//             <i class="bi bi-three-dots-vertical three-dot"></i> \
//         </button> \
//     </li>';