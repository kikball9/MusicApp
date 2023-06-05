var idArtist;

function displayAlbumInfos(albums){
    document.getElementById("artist-page-album-container").innerHTML = "";
    for (var i =0;i<albums.length;i++){
        if (albums[i]["album-infos"][0]["id_artist"] == idArtist){
            document.getElementById("artist-page-album-container").innerHTML += '<li value="'+albums[i]["album-infos"][0]["id_album"]+'" class="list-group-item text-white p-0 d-flex m-2 album"> \
            <div> \
                <img src="'+albums[i]["album-infos"][0]["img_path"]+'" alt="album_img" class="img-large"> \
                <div class="album-title text-center">'+albums[i]["album-infos"][0]["name_album"]+'</div> \
            </div> \
          </li>';
        }
    }
}

function displayArtistInfos(artist){
    document.getElementById("artist-title").innerHTML = artist[0]["name_artist"];
    document.getElementById("type_artist").innerHTML = artist[0]["type_artist"];
    document.getElementById("artistImg").setAttribute("src", artist[0]["img_path"]);
}

function displayPageArtist(id_artist){
    idArtist = id_artist;
    ajaxRequest("GET", "php/request.php/album", displayAlbumInfos);
    ajaxRequest("GET", "php/request.php/artist?id_artist="+id_artist, displayArtistInfos)
}

