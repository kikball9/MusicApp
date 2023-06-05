
function displayAlbum(myAlbum){
    ajaxRequest("GET", "php/request.php/artist?id_artist="+myAlbum["album-infos"][0]["id_artist"], (artist)=>{document.getElementById("album-artist-name").innerHTML = artist[0]["name_artist"]})
    document.getElementById("album-album-style").innerHTML = myAlbum["album-infos"][0]["style"];
    var date= myAlbum["album-infos"][0]["date_published"].split("-");
    var newDate = date[2]+"/"+date[1]+"/"+date[0];
    document.getElementById("album-date-published").innerHTML = newDate;
}

function displayPageAlbum(id_album){
    ajaxRequest("GET", "php/request.php/album?id_album="+id_album, displayAlbum);
}