<?php

use function PHPSTORM_META\type;

require "mydatabase.php";

//Authentification via l'email et le mot de passe
function authenticate($db){
    if (isset($_SERVER["PHP_AUTH_USER"]) && isset($_SERVER["PHP_AUTH_PW"])){
        $username = $_SERVER["PHP_AUTH_USER"];
        $password = $_SERVER["PHP_AUTH_PW"];
        if (!$db->checkUser($username, $password)){
            header('HTTP/1.1 401 Unauthorized');
            exit;
        }
        else {
            $token = base64_encode(openssl_random_pseudo_bytes(12));
            $db->addToken($username, $token);
            header('Content-Type: text/html; charset=utf-8');
            header('Cache-control: no-store, no-cache, must-revalidate');
            header('Pragma: no-cache');

            header('HTTP/1.1 200 OK');
            echo $token;
            exit;
        }
    }
    else {
        header('HTTP/1.1 401 Unauthorized');
        echo "c";
        exit;
    }
}

//Verification du Token
function verifyToken($db){
    $headers = getallheaders();
    $token = $headers["Authorization"];
    if (preg_match("/Bearer (.*)/", $token, $tab)){
        $token = $tab[1];
        $email = $db->verifyToken($token);
        if (!$email){
            header('HTTP/1.1 401 Unauthorized');
            exit;
        }
        return $email;
    }
    else{
        header('HTTP/1.1 401 Unauthorized');
        exit;
    }
}

//Création de l'objet représentant la base de données
$myDb = new myDatabase;
//Acquisition des informations de la requête contenuent dans son URL
$requestMethod = $_SERVER['REQUEST_METHOD'];
$request = substr($_SERVER['PATH_INFO'], 1);
$request = explode('/', $request);
$requestRessource = array_shift($request);
$id = array_shift($request);
$id2 = array_shift($request);
if ($id == ''){
  $id = NULL;
  $id2 = NULL;
}
else {
    if($id2 == ""){
        $id2 = NULL;
    }
}

//Obtention de l'identité de l'utilisateur via une connexion par mot de passe/token ou la creation d'un compte
if ($requestRessource == "authenticate"){
    authenticate($myDb);
}
//Création d'un utilisateur
else if ($requestMethod == "POST" && $requestRessource == "user"){
    if (isset($_POST["email"]) && isset($_POST["password"]) && isset($_POST["first_name"]) && isset($_POST["name_user"]) && isset($_POST["date_birth"]) && isset($_FILES["myFile"])){
        //Upload de l'image de l'utilisateur
        $extFile = substr($_FILES["myFile"]["name"], strpos($_FILES["myFile"]["name"], "."));
        $imgPath;
        if ($ext == ".jpg" || $ext == ".jpeg" || $ext == ".png" || $ext == ".gif"){
            $src = $_FILES["myFile"]["tmp_name"];
            $imgPath = '/var/www/projet/html/assets/img/'.explode("@", $email)[0].time().$ext;
        }
        else {
            header('HTTP/1.1 400 Bad Request (only .jpg, .jpeg, .png, .gif extensions)');
        }
        if (!move_uploaded_file($src, $imgPath)){
            header('HTTP/1.1 400 Bad Request');

        }
        //Verification champs email et date
        if (!preg_match("^[0-9]{4}-[0-1][0-9]-[0-3][0-9]$", $_POST["date_birth"]) || !filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)){
            header('HTTP/1.1 400 Bad Request');
        }
        $myDbReq = $myDb->addUser($_POST["email"], $_POST["password"], $_POST["first_name"], $_POST["name_user"], $_POST["date_birth"], $imgPath);
        if(!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 201 Created');
            echo json_encode($myDbReq);
        }
    }
    else{
        header('HTTP/1.1 400 Bad Request');
    }
}
else{
    $email = verifyToken($myDb);
    if (isset($_COOKIE["email"])){
        if($email != $_COOKIE["email"]){
            header('HTTP/1.1 401 Unauthorized');
            exit;
        }
    }
}
//Variables utilisées pour le contrôle des requêtes
$idTracksMax = $myDb->requestTracks()[sizeof($myDb->requestTracks())-1]["id_tracks"];

/*
Gestion de la base de données en fonction des requêtes de l'utilisateur:
*/

if($requestMethod == "GET" && $requestRessource == ""){
    header("HTTP/1.1 200 OK");
}
//Envoie les données d'un utilisateurs
else if ($requestMethod == "GET" && $requestRessource == "user"){
    $myDbReq = $myDb->requestUsers($email);
    if ($myDbReq == ""){
        header('HTTP/1.1 200 OK');
        echo json_encode("");
    }
    else if (!$myDbReq){
        header('HTTP/1.1 400 Bad Request');
    }
    else{
        header('HTTP/1.1 200 OK');
        echo json_encode($myDbReq);
    }
}
//Mofification d'un utilisateur
else if ($requestMethod == "PUT" && $requestRessource == "user"){
    parse_str(file_get_contents('php://input'), $_PUT);
    if (isset($_PUT["password"]) && isset($_PUT["first_name"]) && isset($_PUT["name_user"]) && isset($_PUT["date_birth"]) && isset($_PUT["img"])){
        //Upload de l'image de l'utilisateur
        $extFile = substr($_FILES["myFile"]["name"], strpos($_FILES["myFile"]["name"], "."));
        $imgPath;
        if ($ext == ".jpg" || $ext == ".jpeg" || $ext == ".png" || $ext == ".gif"){
            $src = $_FILES["myFile"]["tmp_name"];
            $imgPath = '/var/www/projet/html/assets/imgInDb/'.explode("@", $email)[0].time().$ext;
        }
        else {
            header('HTTP/1.1 400 Bad Request (only .jpg, .jpeg, .png, .gif extensions)');
        }
        if (!move_uploaded_file($src, $imgPath)){
            header('HTTP/1.1 400 Bad Request');

        }
        //Verification champs email et date
        if (!preg_match("^[0-9]{4}-[0-1][0-9]-[0-3][0-9]$", $_PUT["date_birth"]) || !filter_var($_PUT["email"], FILTER_VALIDATE_EMAIL)){
            header('HTTP/1.1 400 Bad Request');
        }
        $myDbReq = $myDb->modifyUser($email, $_PUT["password"], $_PUT["first_name"], $_PUT["name_user"], $_PUT["date_birth"], $imgPath);
        if(!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }
    else{
        header('HTTP/1.1 400 Bad Request');
    }
}
//Suppression d'un utilisateur
else if ($requestMethod == "DELETE" && $requestRessource == "user"){
    $myDbReq = $myDb->delUser($email);
    if(!$myDbReq){
        header('HTTP/1.1 400 Bad Request');
    }
    else{
        header('HTTP/1.1 200 OK');
        echo json_encode($myDbReq);
    }
}
//Envoie des musiques favories d'un utilisateur
else if ($requestMethod == "GET" && $requestRessource == "favorites"){
    $myDbReq = $myDb->requestFavorites($email);
    if ($myDbReq == ""){
        header('HTTP/1.1 200 OK');
        echo json_encode("");
    }
    else if(!$myDbReq){
        header('HTTP/1.1 400 Bad Request');
    }
    else{
        header('HTTP/1.1 200 OK');
        echo json_encode($myDbReq);
    }
}
//Ajout d'une musique favorie d'un utilisateur
else if ($requestMethod == "POST" && $requestRessource == "favorites"){
    if (isset($_POST["id_tracks"])){
        $myDbReq = $myDb->addFavorite($email, $_POST["id_tracks"]);
        if(!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }
    else{
        header('HTTP/1.1 400 Bad Request');
        echo json_encode($myDbReq);
    }
}
//Supprime une musique des favories d'un utilisateur
else if ($requestMethod == "DELETE" && $requestRessource == "favorites" && intval($id) > 0 && intval($id) <= $idTracksMax){
    $myDbReq = $myDb->delFavorite($email, $id);
    if (!$myDbReq){
        header('HTTP/1.1 400 Bad Request');
        echo "e";
    }
    else{
        header('HTTP/1.1 200 OK');
        echo json_encode($myDbReq);
    }
}
else if ($requestMethod == "GET" && $requestRessource == "track"){
    //Envoie une track en fonction de l'id utilisé
    if (isset($_GET["id_tracks"])){
        $myDbReq = $myDb->requestTrack($_GET["id_tracks"]);
        if (!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }
    //Envoie toutes les tracks
    else{
        $myDbReq = $myDb->requestTracks();
        if (!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }
}
else if ($requestMethod == "POST" && $requestRessource == "playlist"){
    //Ajout d'une playlist
    if (isset($_POST["img"]) && isset($_POST["name_playlist"]) && isset($_FILES["myFile"])){
        //Upload de l'image pour la playlist
        $extFile = substr($_FILES["myFile"]["name"], strpos($_FILES["myFile"]["name"], "."));
        $imgPath;
        if ($ext == ".jpg" || $ext == ".jpeg" || $ext == ".png" || $ext == ".gif"){
            $src = $_FILES["myFile"]["tmp_name"];
            $imgPath = '/var/www/projet/html/assets/imgInDb/'.$_POST["name_playlist"].$ext;
        }
        else {
            header('HTTP/1.1 400 Bad Request (only .jpg, .jpeg, .png, .gif extensions)');
        }
        if (!move_uploaded_file($src, $imgPath)){
            header('HTTP/1.1 400 Bad Request');

        }
        
        $myDbReq = $myDb->addPlaylist($email, $_POST["name_playlist"], $imgPath);
        if (!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }
    //Ajout d'un morceau à une playlist
    else if(isset($_POST["id_tracks"]) && isset($_POST["id_playlist"])){
        //Vérifie que la playliste appartienne à l'utilisateur
        $myDbReq = $myDb->requestPlaylist($email, $_POST["id_playlist"]);
        if (!$myDbReq || $myDbReq == array()){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            $myDbReq = $myDb->addTrack2Playlist($_POST["id_playlist"], $_POST["id_tracks"]);
            if (!$myDbReq){
                header('HTTP/1.1 400 Bad Request');
            }
            else{
                header('HTTP/1.1 200 OK');
                echo json_encode($myDbReq);
            }
        }
    }
    else{
        header('HTTP/1.1 400 Bad Request');

    }
}
//Récupere une playlist
else if ($requestMethod == "GET" && $requestRessource == "playlist"){
    if(isset($_GET["id_playlist"])){
        $myDbReq = $myDb->requestPlaylist($email, $_GET["id_playlist"]);
        if (!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }
    else{
        $myDbReq = $myDb->requestPlaylists($email);
        if (!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }
}
//Supprime une playlist d'un utilisateur
else if ($requestMethod == "DELETE" && $requestRessource == "playlist" && $id != ""){
    if ($id2 == ""){
        $myDbReq = $myDb->delPlaylist($email, $id);
        if (!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }
    else  {
        //Vérifie que la playlist appartienne à l'utilisateur
        $myDbReq = $myDb->requestPlaylist($email, $id);
        if (!$myDbReq || $myDbReq == array()){
            header('HTTP/1.1 400 Bad Request');
        }
        else {
            $myDbReq = $myDb->delTrackFromPlaylist($id, $id2);
            if (!$myDbReq){
                header('HTTP/1.1 400 Bad Request');
            }
            else{
                header('HTTP/1.1 200 OK');
                echo json_encode($myDbReq);
            }
        }
    }

}
else if($requestMethod == "GET" && $requestRessource == "artist"){
    //Envoie les informations d'un artiste
    if (isset($_GET["id_artist"])){
        $myDbReq = $myDb->requestArtist($_GET["id_artist"]);
        if (!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }
    //Envoie les informations de tous les artistes
    else {
        $myDbReq = $myDb->requestArtists();
        if (!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }
}
else if($requestMethod == "GET" && $requestRessource == "album"){
    //Envoie les informations d'un album
    if (isset($_GET["id_album"])){
        $myDbReq = $myDb->requestAlbum($_GET["id_album"]);
        if (!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }
    //Envoie les informations de tous les albums
    else {
        $myDbReq = $myDb->requestAlbums();
        if (!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }
}
//Si la requête ne correspond à aucun cas traité
else{
    header('HTTP/1.1 400 Bad Request');
}

//headers
header('Content-Type: text/x-json; charset=utf-8');
header('Cache-control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
?>