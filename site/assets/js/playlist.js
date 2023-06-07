var idPlaylist;

function sec2min(sec){
    return Math.trunc(sec/60)+":"+sec%60;
}

function displayPlaylist(myPlaylist){

    document.getElementById("playlist-img").setAttribute("src", myPlaylist["playlist-info"]["img_path"]);
    document.getElementById("playlist-name").innerHTML = myPlaylist["playlist-info"]["name_playlist"];
    
    var date= myPlaylist["playlist-info"]["date_creation"].split(' ')[0].split("-");
    var newDate = date[2]+"/"+date[1]+"/"+date[0];
    document.getElementById("playlist-date-published").innerHTML = newDate;

    for(var i=0; i<myPlaylist["playlist-tracks"].length; i++){
        displayOneTrack(document.getElementById("track-container"), myPlaylist["playlist-tracks"][i], true, myPlaylist["playlist-info"]["id_playlist"]);
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