var idAlbum;

// Converti des secondes en minutes
function sec2min(sec){
    return Math.trunc(sec/60)+":"+sec%60;
}

// Gestion évènement sur le bouton "lecture" d'un morceau
function handlePlayClick(event, idTrack, fromHome = false) {
    
    // évite de déclencher l'évènement du bouton parent
    event.stopPropagation();

    // lance la lecture du morceau
    ajaxRequest("GET", "php/request.php/track?id_tracks="+idTrack, (track)=>{
        document.getElementById("footerSource").setAttribute("src", track["track_path"]);
        document.getElementById("audioSource").load();
        document.getElementById("audioSource").play();
    })
    // ajoute le morceau dans la liste des derniers morceaux écoutés
    ajaxRequest("PUT", "php/request.php/play", ()=>{
        // rafraichissement de la section Home
        if (fromHome){
            displayPageHome();
        }
    }, "id_tracks="+idTrack);
}

// Gestion évènement sur le bouton "aimé" d'un morceau
function handleLikedClick(event, idTrack, idButton, fromHome = false) {

    event.stopPropagation();
    // gestion d'un morceau liked/unliked
    ajaxRequest("GET", "php/request.php/track?id_tracks="+idTrack, (track)=>{
        // si le morceau est liked
        if (track["is_favorite"] != 1){
            // ajout du morceau aux favories de l'utilisateur
            ajaxRequest("PUT", "php/request.php/favorites", ()=>{return;}, "id_tracks="+track["id_tracks"]);
            // morceau liked => icone coeur remplit
            document.getElementById(idButton) .innerHTML = '<i class="bi bi-suit-heart-fill filled-heart icon-btn" aria-hidden="true">';
            if (fromHome){
                displayPageHome();
            }
        }
        // si le morceau est unliked
        else {
            // suppression du morceau aux favories de l'utilisateur 
            ajaxRequest("DELETE", "php/request.php/favorites/"+track["id_tracks"], ()=>{return;})
            // morceau unliked => icone coeur vide
            document.getElementById(idButton).innerHTML = '<i class="bi bi-heart heart icon-btn" aria-hidden="true"></i>';
            if (fromHome){
                displayPageHome();
            }
        }
    });
}

<<<<<<< HEAD
// Gestion évènement sur le bouton "ajouter à une playlist" d'un morceau
function handleAddPlaylistClick(event, idTrack, idPlaylist = null){

=======
function handleAddPlaylistClick(event, containerId, idTrack, idPlaylist = null){
>>>>>>> 5a1c1d3cc1b6398fdd471c0275268672ff01d4c6
    event.stopPropagation();
    
    // si un morceau est retiré de la playlist
    if (idPlaylist != null){
        // suppresion du morceau dans la playlist
        ajaxRequest("DELETE", "php/request.php/playlist/"+idPlaylist+"/"+idTrack);
        // affichage section Playlist
        displayPagePlaylist(idPlaylist);
    }
<<<<<<< HEAD
    // si le scroll options du bouton "ajouter à playlist" ne sont pas affichées 
    else if (document.getElementById("playlistAddSelect-"+idTrack).style.display == "none"){
        // affichage des noms de playlist dans le scroll option du bouton
        ajaxRequest("GET", "php/request.php/playlist", (playlist)=>{
            document.getElementById("playlistAddSelect-"+idTrack).innerHTML = "";
            document.getElementById("playlistAddSelect-"+idTrack).style.display = "block";
            document.getElementById("labelAddPlaylist-"+idTrack).style.display = "block";
            document.getElementById("playlistAddSelect-"+idTrack).innerHTML += "<option value='0'>--Séléctionner une playlist--</option>";
            // affichage des noms de playlist pour chaque playlist de l'utilisateur
=======
    else if (document.getElementById("playlistAddSelect-"+idTrack+'-'+containerId).style.display == "none"){
        ajaxRequest("GET", "php/request.php/playlist", (playlist)=>{
            document.getElementById("playlistAddSelect-"+idTrack+'-'+containerId).innerHTML = "";
            document.getElementById("playlistAddSelect-"+idTrack+'-'+containerId).style.display = "block";
            document.getElementById("labelAddPlaylist-"+idTrack+'-'+containerId).style.display = "block";
            document.getElementById("playlistAddSelect-"+idTrack+'-'+containerId).innerHTML += "<option value='0'>--Séléctionner une playlist--</option>";
>>>>>>> 5a1c1d3cc1b6398fdd471c0275268672ff01d4c6
            for (var i=0;i<playlist.length;i++){
                document.getElementById("playlistAddSelect-"+idTrack+'-'+containerId).innerHTML += "<option value='"+playlist[i]["playlist-info"]["id_playlist"]+"'>"+playlist[i]["playlist-info"]["name_playlist"]+"</option>";
            }
<<<<<<< HEAD
            // évite de déclencher l'évènement du bouton parent
            document.getElementById("playlistAddSelect-"+idTrack).onclick = (event)=>{
                event.stopPropagation();
            }
            document.getElementById("playlistAddSelect-"+idTrack).onchange = ()=>{
                // ajouter le morceau à la playlist
                ajaxRequest("POST", "php/request.php/playlist", ()=>{return;}, "id_tracks="+idTrack+"&id_playlist="+document.getElementById("playlistAddSelect-"+idTrack).value);
                // masque le scroll option lorsqu'on clique en dehors de celui-ci
                document.getElementById("playlistAddSelect-"+idTrack).style.display = "none";
                document.getElementById("labelAddPlaylist-"+idTrack).style.display = "none";
=======
            document.getElementById("playlistAddSelect-"+idTrack+'-'+containerId).onclick = (event)=>{
                event.stopPropagation();
            }
            document.getElementById("playlistAddSelect-"+idTrack+'-'+containerId).onchange = ()=>{
                ajaxRequest("POST", "php/request.php/playlist", ()=>{return;}, "id_tracks="+idTrack+"&id_playlist="+document.getElementById("playlistAddSelect-"+idTrack+'-'+containerId).value);
                document.getElementById("playlistAddSelect-"+idTrack+'-'+containerId).style.display = "none";
                document.getElementById("labelAddPlaylist-"+idTrack+'-'+containerId).style.display = "none";
>>>>>>> 5a1c1d3cc1b6398fdd471c0275268672ff01d4c6
            }
        })
    }
    else {
<<<<<<< HEAD
        // masque le scroll option lorsqu'on clique en dehors de celui-ci
        document.getElementById("playlistAddSelect-"+idTrack).style.display = "none";
        document.getElementById("labelAddPlaylist-"+idTrack).style.display = "none";
=======
        document.getElementById("playlistAddSelect-"+idTrack+'-'+containerId).style.display = "none";
        document.getElementById("labelAddPlaylist-"+idTrack+'-'+containerId).style.display = "none";
>>>>>>> 5a1c1d3cc1b6398fdd471c0275268672ff01d4c6
    }
}

// Gestion évènement sur le bouton "détail" d'un morceau
function handleInfoClick(event, idTrack){
    event.stopPropagation();
    // affiche la section Track
    displayPageTrack(idTrack);
}

// Affiche un morceau en fonction de sa section
function displayOneTrack(containerElem, jsonTrack, fromPlaylistDisplay = false, playlistId, fromHome = false){
    
    var likeBtn, buffer, selectAndLabel, addOrRemoveButton;

    // si le morceau n'est pas dans la playlist
    if (!fromPlaylistDisplay){
<<<<<<< HEAD
        selectAndLabel = '\
            <label class="text-white" id="labelAddPlaylist-'+jsonTrack["id_tracks"]+'" style="display: none;" for="addPlaylistForm-'+jsonTrack["id_tracks"]+'">Ajouter à une playlist:</label>\
            <select name="addPlaylistForm-'+jsonTrack["id_tracks"]+'" style="position: relative;display: none;left:20vw;" id="playlistAddSelect-'+jsonTrack["id_tracks"]+'"></select>';
            addOrRemoveButton = '\
            <button class="btn" onclick="handleAddPlaylistClick(event, '+jsonTrack["id_tracks"]+')"> \
                <i class="bi bi-plus heart icon-btn"></i> \
            </button>';
    // si le morceau est dans la playlist
    }else{
        selectAndLabel = "";
        addOrRemoveButton = '\
            <button class="btn" onclick="handleAddPlaylistClick(event, '+jsonTrack["id_tracks"]+', '+playlistId+')"> \
                <i class="bi bi-dash heart icon-btn"></i> \
            </button>';
=======
        selectAndLabel = '<label class="text-white" id="labelAddPlaylist-'+jsonTrack["id_tracks"]+'-'+containerElem.id+'" style="display: none;" for="addPlaylistForm-'+jsonTrack["id_tracks"]+'-'+containerElem.id+'">Ajouter à une playlist:</label>\
        <select name="addPlaylistForm-'+jsonTrack["id_tracks"]+'" style="position: relative;display: none;left:20vw;" id="playlistAddSelect-'+jsonTrack["id_tracks"]+'-'+containerElem.id+'">\
                      \
          </select>';
          addOrRemoveButton = '<button class="btn" onclick="handleAddPlaylistClick(event, \''+containerElem.id+'\','+jsonTrack["id_tracks"]+');"> \
          <i class="bi bi-plus heart icon-btn"></i> \
      </button>';
    }
    else {
        selectAndLabel = "";
        addOrRemoveButton = '<button class="btn" onclick="handleAddPlaylistClick(event, \''+containerElem.id+'\', '+jsonTrack["id_tracks"]+', '+playlistId+');"> \
          <i class="bi bi-dash heart icon-btn"></i> \
      </button>';
>>>>>>> 5a1c1d3cc1b6398fdd471c0275268672ff01d4c6
    }

    if (typeof jsonTrack["is_favorite"] !== 'undefined'){
        // si le morceau est dans les favories de l'utilisateur
        if (jsonTrack["is_favorite"] == 1){
            buffer = '<i class=\"bi bi-heart heart icon-btn\" aria-hidden=\"true\">'
            likeBtn = '\
                <button id="likeBtn-'+jsonTrack["id_tracks"]+'-'+containerElem.id+'" onclick="handleLikedClick(event, '+jsonTrack["id_tracks"]+', \'likeBtn-'+jsonTrack["id_tracks"]+'-'+containerElem.id+'\', '+fromHome+');" class="btn"> \
                    <i class="bi bi-suit-heart-fill filled-heart icon-btn" aria-hidden="true"></i> \
                </button>';
        // si le morceau n'est pas dans les favories de l'utilisateur
        }else{
            likeBtn = '\
                <button id="likeBtn-'+jsonTrack["id_tracks"]+'-'+containerElem.id+'" onclick="handleLikedClick(event,'+jsonTrack['id_tracks']+', \'likeBtn-'+jsonTrack["id_tracks"]+'-'+containerElem.id+'\', '+fromHome+');" class="btn"> \
                    <i class="bi bi-heart heart icon-btn" aria-hidden="true"></i> \
                </button>'
        }
    }else{
        likeBtn = '\
            <button id="likeBtn-'+jsonTrack["id_tracks"]+'-'+containerElem.id+'" onclick="handleLikedClick(event,'+jsonTrack['id_tracks']+', \'likeBtn-'+jsonTrack["id_tracks"]+'-'+containerElem.id+'\', '+fromHome+');" class="btn"> \
                <i class="bi bi-heart heart icon-btn" aria-hidden="true"></i> \
            </button>'
    }

    // ajout du morceau
    containerElem.innerHTML += '\
      <li class="track-bar list-group-item m-2 w-50 p-0 d-flex p-0 m-0 text-white" style="border: none;"> \
            <div id="A" onclick="handlePlayClick(event, '+jsonTrack["id_tracks"]+', '+fromHome+');)" class="m-auto w-100 d-flex"> \
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
                '+addOrRemoveButton+' \
                    \
                </div> \
                <button class="btn" onclick="handleInfoClick(event, '+jsonTrack["id_tracks"]+')"> \
                  <i class="bi bi-info-circle heart icon-btn"></i> \
                </button> \
            </div> \
          </li> \
          '+selectAndLabel;
}

// Affichage dynamique des informations d'un album dans la section Album
function displayAlbum(myAlbum){

    var date= myAlbum["album-infos"][0]["date_published"].split(' ')[0].split("-");
    var newDate = date[2]+"/"+date[1]+"/"+date[0];

    // affichage des informations de l'album
    document.getElementById("album-album-style").innerHTML = myAlbum["album-infos"][0]["style"];
    document.getElementById("album-date-published").innerHTML = newDate;
    document.getElementById("album-page-album-image").setAttribute("src", myAlbum["album-infos"][0]["img_path"]);
    document.getElementById("album-page-album-title").innerHTML = myAlbum["album-infos"][0]["name_album"];
    document.getElementById("album-page-track-container").innerHTML = "";

    // affichage des morceaux de l'album
    for (var i=0;i<myAlbum["album-tracks"].length;i++){
        displayOneTrack(document.getElementById("album-page-track-container"), myAlbum["album-tracks"][i])
    }

    // afficage des informations de l'artiste de l'album
    document.getElementById("album-artist-name").innerHTML = myAlbum["album-infos"][0]["name_artist"];
    document.getElementById("album-page-artist-image").setAttribute("src", myAlbum["album-infos"][0]["artist_img"])

    // gestion des boutons pour afficher la section Artist
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

// Affichage de la section Album
function displayPageAlbum(id_album){
    hideEverything();
    displayHeaderFooter();
    // Rend la section Album visible
    document.getElementById("album_page").style.display = "block";

    ajaxRequest("GET", "php/request.php/album?id_album="+id_album, displayAlbum);
}