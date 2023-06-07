var idAlbum;

function sec2min(sec){
    return Math.trunc(sec/60)+":"+sec%60;
}

function handlePlayClick(event, idTrack) {
    event.stopPropagation();
    ajaxRequest("GET", "php/request.php/track?id_tracks="+idTrack, (track)=>{
        document.getElementById("footerSource").setAttribute("source", track["track_path"]);
        document.getElementById("audioSource").play();
    })
    ajaxRequest("PUT", "php/request.php/play", ()=>{return;}, "id_tracks="+idTrack);
}

function handleLikedClick(event, idTrack) {
    event.stopPropagation();
    ajaxRequest("GET", "php/request.php/track?id_tracks="+idTrack, (track)=>{
        if (track["is_favorite"] != 1){
            ajaxRequest("PUT", "php/request.php/favorites", ()=>{return;}, "id_tracks="+track["id_tracks"]);
        }
        else {
            ajaxRequest("DELETE", "php/request.php/favorites/"+track["id_tracks"], ()=>{return;})
        }
    });
    
    
}

function handleAddPlaylistClick(event, idTrack){
    event.stopPropagation();
    if (document.getElementById("playlistAddSelect-"+idTrack).style.display == "none"){
        ajaxRequest("GET", "php/request.php/playlist", (playlist)=>{
            document.getElementById("playlistAddSelect-"+idTrack).innerHTML = "";
            document.getElementById("playlistAddSelect-"+idTrack).style.display = "block";
            document.getElementById("labelAddPlaylist-"+idTrack).style.display = "block";
            for (var i=0;i<playlist.length;i++){
                document.getElementById("playlistAddSelect-"+idTrack).innerHTML += "<option value='"+playlist[i]["playlist-info"]["id_playlist"]+"'>"+playlist[i]["playlist-info"]["name_playlist"]+"</option>";
            }
            document.getElementById("playlistAddSelect-"+idTrack).onclick = (event)=>{
                event.stopPropagation();
            }
            document.getElementById("playlistAddSelect-"+idTrack).onchange = ()=>{
                ajaxRequest("POST", "php/request.php/playlist", ()=>{return;}, "id_tracks="+idTrack+"&id_playlist="+document.getElementById("playlistAddSelect-"+idTrack).value);
                document.getElementById("playlistAddSelect-"+idTrack).style.display = "none";
                document.getElementById("labelAddPlaylist-"+idTrack).style.display = "none";
            }
        })
    }
    else {
        document.getElementById("playlistAddSelect-"+idTrack).style.display = "none";
        document.getElementById("labelAddPlaylist-"+idTrack).style.display = "none";
    }
}

function handleInfoClick(event, idTrack){
    event.stopPropagation();
    displayPageTrack(idTrack);
}

function displayOneTrack(containerElem, jsonTrack){
    var likeBtn, buffer;
    if (typeof jsonTrack["is_favorite"] !== 'undefined'){
        if (jsonTrack["is_favorite"] == 1){
            buffer = '<i class=\"bi bi-heart heart icon-btn\" aria-hidden=\"true\">'
            likeBtn = '<button id="A_liked-" onclick="handleLikedClick(event, '+jsonTrack["id_tracks"]+');" class="btn"> \
            <i class="bi bi-suit-heart-fill filled-heart icon-btn" aria-hidden="true"></i> \
          </button>';
          console.log("b");
        }
        else{
            likeBtn = '<button id="A_liked" onclick="handleLikedClick(event,'+jsonTrack['id_tracks']+');" class="btn"> \
                    <i class="bi bi-heart heart icon-btn" aria-hidden="true"></i> \
                  </button>'
        }
    }
    else{
        likeBtn = '<button id="A_liked" onclick="handleLikedClick(event,'+jsonTrack['id_tracks']+');" class="btn"> \
                <i class="bi bi-heart heart icon-btn" aria-hidden="true"></i> \
              </button>'
    }
    
    //<i class=\"bi bi-suit-heart-fill filled-heart icon-btn\" aria-hidden=\"true\">        
    containerElem.innerHTML += '\
      <li class="track-bar list-group-item m-2 w-50 p-0 d-flex p-0 m-0 text-white" style="border: none;"> \
            <div id="A" onclick="handlePlayClick(event, '+jsonTrack["id_tracks"]+')" class="m-auto w-100 d-flex"> \
              <img class="img-small" src="'+jsonTrack["img_album"]+'" alt="album_img"> \
              <div class="btn play-btn"> \
                <i id="target" class="bi bi-play-fill heart"></i> \
              </div> \
              <div class="text-center title p-1 text-white"> \
                <ul class="m-0  list-inline" style="list-style: none;"> \
                  <li class="list-inline-item">'+jsonTrack["name_tracks"]+'</li> \
                  <i class="bi bi-dot"></i> \
                  <li class="list-inline-item">'+jsonTrack["name_artist"]+'</li> \
                  <i class="bi bi-dot"></i> \
                  <li class="list-inline-item">'+sec2min(jsonTrack["duration"])+'</li> \
                </ul> \
              </div> \
              '+likeBtn+' \
                <button class="btn" onclick="handleAddPlaylistClick(event, '+jsonTrack["id_tracks"]+');"> \
                    <i class="bi bi-plus heart icon-btn"></i> \
                </button> \
                    \
                </div> \
                <button class="btn" onclick="handleInfoClick(event, '+jsonTrack["id_tracks"]+')"> \
                  <i class="bi bi-info-circle heart icon-btn"></i> \
                </button> \
            </div> \
          </li>\
          <label class="text-white" id="labelAddPlaylist-'+jsonTrack["id_tracks"]+'" style="display: none;" for="addPlaylistForm-'+jsonTrack["id_tracks"]+'">Ajouter à une playlist:</label>\
          <select name="addPlaylistForm-'+jsonTrack["id_tracks"]+'" style="position: relative;display: none;left:20vw;" id="playlistAddSelect-'+jsonTrack["id_tracks"]+'">\
                        \
            </select>';
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
        displayOneTrack(document.getElementById("album-page-track-container"), myAlbum["album-tracks"][i])
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

function displayPageAlbum(id_album){
    hideEverything();
    displayHeaderFooter();
    document.getElementById("album_page").style.display = "block";
    ajaxRequest("GET", "php/request.php/album?id_album="+id_album, displayAlbum);
}