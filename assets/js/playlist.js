var idPlaylist;

function sec2min(sec){
    return Math.trunc(sec/60)+":"+sec%60;
}

function displayTrack(myTrack){
    // console.log(myTrack["name_tracks"]);
    
    displayOneTrack(document.getElementById("track-container"), myTrack);

    /*ajaxRequest("GET", "php/request.php/album?id_album="+myTrack["id_album"], (myAlbum) => {
        document.getElementById("album-img"+myTrack["id_tracks"]).setAttribute("src", myAlbum["album-infos"][0]["img_path"]); 
    });
    ajaxRequest("GET", "php/request.php/artist?id_artist="+myTrack["id_artist"], (myArtist) => {
        document.getElementById("artist-name"+myTrack["id_tracks"]).innerHTML =  myArtist["artist-infos"][0]["name_artist"];
    });*/
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