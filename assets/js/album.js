var idAlbum;

function sec2min(sec){
    return Math.trunc(sec/60)+":"+sec%60;
}

function displayAlbumWithAllInfos(myArtist){
    artistName = myArtist["artist-infos"][0]["name_artist"];
    var myAlbum;
    for (var i=0;i<myArtist["artist-albums"].length;i++){
        if (myArtist["artist-albums"][i]["album-infos"][0]["id_album"] == idAlbum){
            myAlbum = myArtist["artist-albums"][i];
        }
    }
}

function displayAlbum(myAlbum){
    document.getElementById("album-album-style").innerHTML = myAlbum["album-infos"][0]["style"];
    var date= myAlbum["album-infos"][0]["date_published"].split(' ')[0].split("-");
    var newDate = date[2]+"/"+date[1]+"/"+date[0];
    document.getElementById("album-date-published").innerHTML = newDate;
    document.getElementById("album-page-album-image").setAttribute("src", myAlbum["album-infos"][0]["img_path"]);
    document.getElementById("album-page-album-title").innerHTML = myAlbum["album-infos"][0]["name_album"];
    document.getElementById("album-page-track-container").innerHTML = "";
    for (var i=0;i<myAlbum["album-tracks"].length;i++){
        document.getElementById("album-page-track-container").innerHTML += '\
        <li onclick="displayPageTrack('+myAlbum["album-tracks"][i]["id_tracks"]+')" onmouseover="this.style.cursor=\'pointer\'" value="'+myAlbum["album-tracks"][i]["id_tracks"]+'" class="track-bar list-group-item m-2 w-50 p-0 d-flex p-0 m-0 text-white"> \
        <img class="img-small" src="'+myAlbum["album-infos"][0]["img_path"]+'" alt="album_img"> \
        <div class="text-center title p-1 text-white"> \
            <ul class="m-0  list-inline" style="list-style: none;"> \
                <li class="list-inline-item">'+myAlbum["album-tracks"][i]["name_tracks"]+'</li> \
                <i class="bi bi-dot"></i> \
                <li class="list-inline-item">'+myAlbum["album-infos"][0]["name_artist"]+'</li> \
                <i class="bi bi-dot"></i> \
                <li class="list-inline-item">'+sec2min(myAlbum["album-tracks"][0]["duration"])+'</li> \
            </ul> \
        </div> \
        <button class="btn"> \
            <i class="bi bi-heart heart icon-btn" aria-hidden="true"></i> \
        </button> \
        <button class="btn"> \
            <i class="bi bi-three-dots-vertical three-dot"></i> \
        </button> \
      </li>';
    }
    document.getElementById("album-artist-name").innerHTML = myAlbum["album-infos"][0]["name_artist"];
    document.getElementById("album-page-artist-image").setAttribute("src", myAlbum["album-infos"][0]["artist_img"])
    document.getElementById("album-artist-name").onmouseover = ()=>{
        document.getElementById("album-artist-name").style.cursor = "pointer";
    }
    document.getElementById("album-artist-name").onclick = ()=>{
        displayPageArtist(myAlbum["album-infos"][0]["id_artist"])
    }
    document.getElementById("album-page-artist-image").onmouseover = ()=>{
        document.getElementById("album-page-artist-image").style.cursor = "pointer";
    }
    document.getElementById("album-page-artist-image").onclick = ()=>{
        displayPageArtist(myAlbum["album-infos"][0]["id_artist"])
    }


}

function displayPageAlbum(id_album, hide = true){
    hideEverything();
    displayHeaderFooter();
    document.getElementById("album_page").style.display = "block";
    ajaxRequest("GET", "php/request.php/album?id_album="+id_album, displayAlbum);
}