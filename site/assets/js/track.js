var idTrack;
var idArtist;
var idAlbum;

function displayTrackInfos(track){
    document.getElementById("artist-page-album-container").innerHTML = "";
    for (var i =0;i<track.length;i++){
        if (track[i]["album-infos"][0]["id_artist"] == idArtist){
            document.getElementById("artist-page-album-container").innerHTML += '\
                <li value="'+track[i]["album-infos"][0]["id_album"]+'" class="list-group-item text-white p-0 d-flex m-2 album"> \
                    <div> \
                        <img src="'+track[i]["album-infos"][0]["img_path"]+'" alt="album_img" class="img-large"> \
                        <div class="album-title text-center">'+track[i]["album-infos"][0]["name_album"]+'</div> \
                    </div> \
                </li>';
        }
    }
    document.getElementById("track-name").innerHTML = track["name_tracks"];
    document.getElementById("track-duration").innerHTML = sec2min(track["duration"]);
}


function displayArtistInfos(artists){
    
    for(var i=0; i<artists.length; i++){
        for(var j=0; j<artists[i]["artist-albums"].length; j++){
            for(var k=0; k<artists[i]["artist-albums"][j]["album-tracks"].length; k++){
                if(artists[i]["artist-albums"][j]["album-tracks"][k]["id_tracks"] == idTrack){
                    idArtist = artists[i]["artist-infos"][0]["id_artist"];
                    document.getElementById("artist-name").innerHTML = artists[i]["artist-infos"][0]["name_artist"];
                    var idMonArtist = artists[i]["artist-infos"][0]["id_artist"];
                    document.getElementById("track-img").setAttribute("src", artists[i]["artist-infos"][0]["img_path"]);
                    document.getElementById("track-img").onmouseover = ()=>{
                        document.getElementById("track-img").style.cursor = "pointer";
                    }
                    document.getElementById("track-img").onclick = ()=>{
                        displayPageArtist(idMonArtist);
                    }
                    document.getElementById("artist-name").onmouseover = ()=>{
                        document.getElementById("artist-name").style.cursor = "pointer";
                    }
                    document.getElementById("artist-name").onclick = ()=>{
                        displayPageArtist(idMonArtist);
                    }
                }
            }
        }
    }
    // console.log(idArtist);
    ajaxRequest("GET", "php/request.php/artist?id_artist="+idArtist, displayAlbumInfos)
}

function displayAlbumInfos(myAlbum){

    document.getElementById("track-album-page-container").innerHTML = "";

    for(var i=0; i<myAlbum["artist-albums"].length; i++){
        // console.log("Album: ", myAlbum["artist-albums"][i]["album-infos"][0]["name_album"]);
        for(var j=0; j<myAlbum["artist-albums"][i]["album-tracks"].length; j++){

            // Si l'id d'un morceau correspond à un morceau d'un album
            if(myAlbum["artist-albums"][i]["album-tracks"][j]["id_tracks"] == idTrack){
                idAlbum = myAlbum["artist-albums"][i]["album-infos"][0]["id_album"];
                console.log("id album find");
                document.getElementById("album-img").setAttribute("src", myAlbum["artist-albums"][i]["album-infos"][0]["img_path"]);
                document.getElementById("album-img").setAttribute("onmouseover", "this.style.cursor = 'pointer';")
                document.getElementById("album-img").onclick = ()=>{
                    displayPageAlbum(idAlbum);
                }
                document.getElementById("album-name").innerHTML = myAlbum["artist-albums"][i]["album-infos"][0]["name_album"];
                document.getElementById("album-name").onmouseover = ()=>{
                    document.getElementById("album-name").style.cursor = "pointer";
                }
                document.getElementById("album-name").onclick = ()=>{
                    displayPageAlbum(idAlbum);
                }
            }
        }
    }

    for(var i=0; i<myAlbum["artist-albums"].length; i++){
        for(var j=0; j<myAlbum["artist-albums"][i]["album-tracks"].length; j++){

            // Si l'id d'album d'un morceau correspond à celui de l'album voulu 
            if(myAlbum["artist-albums"][i]["album-tracks"][j]["id_album"] == idAlbum){
                displayOneTrack(document.getElementById("track-album-page-container"), myAlbum["artist-albums"][i]["album-tracks"][j]);
            }
        }
    }
    document.getElementById("album-artist-name").onmouseover = ()=>{
        document.getElementById("").style.cursor = "pointer";
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

function displayPageTrack(id_track){
    hideEverything();
    displayHeaderFooter();
    document.getElementById("track_page").style.display = "block";
    idTrack = id_track;
    // ajaxRequest("GET", "php/request.php/album?id_album="+id_album, () => {return;});
    
    ajaxRequest("GET", "php/request.php/artist", displayArtistInfos)
    // console.log(idArtist);
    // ajaxRequest("GET", "php/request.php/album", displayAlbumInfos);
    ajaxRequest("GET", "php/request.php/track?id_tracks="+id_track, displayTrackInfos)
}

// Bouton play track
// function handleDivHover() {
//     var targetIcon = document.getElementsByClassName("play-btn");
//     // targetIcon.style.display = "inline-block";
// }

// function handleDivLeave() {
//     // var targetIcon = document.getElementById("target");
//     var targetIcon = document.getElementsByClassName("play-btn");
//     // targetIcon.style.display = "none";
// }

var trackBar = document.querySelector('.track-bar');
var playBtn = document.querySelector('.play-btn');

trackBar.addEventListener('mouseover', function() {
    playBtn.style.visibility = 'visible';
});

trackBar.addEventListener('mouseout', function() {
    playBtn.style.visibility = 'hidden';
});

// Bouton scroll option
function toggleDropdown() {
    var buttonContainer = document.getElementById("buttonContainer");
    buttonContainer.classList.toggle("active");
}

function closeDropdown() {
    var buttonContainer = document.getElementById("buttonContainer");
    buttonContainer.classList.remove("active");
}