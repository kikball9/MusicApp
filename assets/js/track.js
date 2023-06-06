var idTrack;
var idArtist;

function sec2min(sec){
    return Math.trunc(sec/60)+":"+sec%60;
}

function displayTrackInfos(track){
    document.getElementById("artist-page-album-container").innerHTML = "";
    for (var i =0;i<track.length;i++){
        if (track[i]["album-infos"][0]["id_artist"] == idArtist){
            document.getElementById("artist-page-album-container").innerHTML += '<li value="'+track[i]["album-infos"][0]["id_album"]+'" class="list-group-item text-white p-0 d-flex m-2 album"> \
            <div> \
                <img src="'+track[i]["album-infos"][0]["img_path"]+'" alt="album_img" class="img-large"> \
                <div class="album-title text-center">'+track[i]["album-infos"][0]["name_album"]+'</div> \
            </div> \
          </li>';
        }
    }
}

function displayTrackInfos(track){
    document.getElementById("track-name").innerHTML = track["name_tracks"];
    document.getElementById("track-img").innerHTML = track["track_path"];
    document.getElementById("track-duration").innerHTML = sec2min(track["duration"]);
    // document.getElementById("artistImg").setAttribute("src", track["artist-infos"][0]["img_path"]);
}

function displayArtistInfos(artists){
    
    for(var i=0; i<artists.length; i++){
        for(var j=0; j<artists[i]["artist-albums"].length; j++){
            for(var k=0; k<artists[i]["artist-albums"][j]["album-tracks"].length; k++){
                if(artists[i]["artist-albums"][j]["album-tracks"][k]["id_tracks"] == idTrack){
                    idArtist = artists[i]["artist-infos"][0]["id_artist"];

                    document.getElementById("track-name").innerHTML = artists[i]["artist-infos"][0]["name_artist"];
                    document.getElementById("track-img").setAttribute("src", artists[i]["artist-infos"][0]["img_path"]);
                }
            }
        }
    }
}

function displayPageTrack(id_track){
    idTrack = id_track;
    // ajaxRequest("GET", "php/request.php/album", displayAlbumInfos);
    ajaxRequest("GET", "php/request.php/artist", displayArtistInfos)
    ajaxRequest("GET", "php/request.php/track?id_tracks="+id_track, displayTrackInfos)
}