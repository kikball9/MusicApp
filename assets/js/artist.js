var myArtistInfos;
var idArtist;

function displayAlbumInfos(albums){
    document.getElementById("album-container").innerHTML = "";
    for (var i =0;i<albums.length;i++){
        if (albums[i]["album-infos"][0]["id_artist"] == idArtist){
            document.getElementById("album-container").innerHTML += '<li class="list-group-item text-white p-0 d-flex m-2 album"> \
            <div> \
                <img src="assets/img/album.jpeg" alt="album_img" class="img-large"> \
                <div value="'+albums[i]["album-infos"][0]["id_album"]+'" class="album-title text-center">'+albums[i]["album-infos"][0]["name_album"]+'</div> \
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

