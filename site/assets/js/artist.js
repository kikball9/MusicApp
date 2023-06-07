// Affichage dynamique des informations d'un artiste dans la section Artist
function displayArtist(artist){
    albums = artist["artist-albums"];

    // affiche les informations de l'artiste
    document.getElementById("artist-title").innerHTML = artist["artist-infos"][0]["name_artist"];
    document.getElementById("type_artist").innerHTML = artist["artist-infos"][0]["type_artist"];
    document.getElementById("artistImg").setAttribute("src", artist["artist-infos"][0]["img_path"]);
    document.getElementById("artist-page-album-container").innerHTML = "";

    // affiche les albums de l'artiste
    for (var i =0;i<albums.length;i++){

        document.getElementById("artist-page-album-container").innerHTML += '\
        <li onclick="displayPageAlbum('+albums[i]["album-infos"][0]["id_album"]+')" onmouseover="this.style.cursor=\'pointer\'" value="'+albums[i]["album-infos"][0]["id_album"]+'" class="list-group-item text-white p-0 d-flex m-2 album"> \
        <div> \
            <img src="'+albums[i]["album-infos"][0]["img_path"]+'" alt="album_img" class="img-large"> \
            <div class="album-title text-center">'+albums[i]["album-infos"][0]["name_album"]+'</div> \
        </div> \
        </li>';
    }
}

// Affichage de la section Artist
function displayPageArtist(id_artist){
    
    // affiche uniquement Header, Footer et la section Artist 
    hideEverything();
    displayHeaderFooter();
    document.getElementById("artist_page").style.display = "block";

    ajaxRequest("GET", "php/request.php/artist?id_artist="+id_artist, displayArtist)
}