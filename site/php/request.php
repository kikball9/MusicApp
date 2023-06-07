<?php

use function PHPSTORM_META\type;

require "mydatabase.php";

//Authentification via l'email et le mot de passe
function authenticate($db){
    //Récupère le login/mdp via le header Authorization
    if (isset($_SERVER["PHP_AUTH_USER"]) && isset($_SERVER["PHP_AUTH_PW"])){
        $username = $_SERVER["PHP_AUTH_USER"];
        $password = $_SERVER["PHP_AUTH_PW"];
        //Vérifie que le couple login/mdp corresponde à une entrée dans la table users
        if (!$db->checkUser($username, $password)){
            header('HTTP/1.1 401 Unauthorized');
            exit;
        }
        else {
            //Créer un token pour l'utilisateur et lui renvoie si le couple login/mdp correspond à une entrée dans la table users
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
        exit;
    }
}

//Verification du Token
function verifyToken($db){
    //Récupération du token dans le header authorization
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

//Upload un fichier (pas eu le temps de l'implémenter)
function uploadImg($srcName, $destName){
    $ext= substr($_FILES[$srcName]["name"], strpos($_FILES[$srcName]["name"], "."));
    if ($ext == ".jpg" || $ext == ".jpeg" || $ext == ".png" || $ext == ".gif"){
        $src = $_FILES[$srcName]["tmp_name"];
        $imgPath = '/var/www/projet/html/assets/img/'.$destName.$ext;
    }
    else {
        return false;
    }
    if (move_uploaded_file($src, $imgPath)){
        return true;
    }
    return false;
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
    if (isset($_SERVER["PHP_AUTH_USER"]) && isset($_SERVER["PHP_AUTH_PW"]) && isset($_POST["first_name"]) && isset($_POST["name_user"]) && isset($_POST["date_birth"])){ //&& isset($_FILES["myFile"])){
        $imgPath = "none";
        //Récupération d'une image upload (pas eu le temps)
        /*
        $img_path = uploadImg("myFile", explode("@", $email)[0].time());
        if (!$img_path){
            header('HTTP/1.1 400 Bad Request');
        }*/

        //Verification champs email et date
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $_POST["date_birth"])){
            $dateArray = explode("-", $_POST["date_birth"]);
            $email = $_SERVER["PHP_AUTH_USER"];
            $password = $_SERVER["PHP_AUTH_PW"];
            if (!checkdate(intval($dateArray[1]), intval($dateArray[2]), intval($dateArray[0])) || !filter_var($email, FILTER_VALIDATE_EMAIL)){
                header('HTTP/1.1 400 Bad Request');
            }
            else {
                //Ajout de l'utilisateur
                $myDbReq = $myDb->addUser($email, $password, $_POST["first_name"], $_POST["name_user"], $_POST["date_birth"], $imgPath);
                if(!$myDbReq){
                    header('HTTP/1.1 400 Bad Request');
                }
                else{
                    //Renvoie un token correspondant au nouvel utilisateur
                    $token = base64_encode(openssl_random_pseudo_bytes(12));
                    $myDb->addToken($email, $token);
                    header('Content-Type: text/html; charset=utf-8');
                    header('Cache-control: no-store, no-cache, must-revalidate');
                    header('Pragma: no-cache');
                    header('HTTP/1.1 201 Created');
                    echo $token;
                    exit;
                }
            }
        }
        else {
            header('HTTP/1.1 400 Bad Request');
        }
        
    }
    else{
        header('HTTP/1.1 400 Bad Request');
    }
}
else{
    //Vérifie que le token corresponde à un utilisateur
    $email = verifyToken($myDb);
    if (isset($_COOKIE["email"])){
        if($email != $_COOKIE["email"]){
            header('HTTP/1.1 401 Unauthorized');
            exit;
        }
    }
}
//Variables utilisée pour le contrôle des requêtes
$idTracksMax = $myDb->requestTracks($email)[sizeof($myDb->requestTracks($email))-1]["id_tracks"];

/*
Gestion de la base de données en fonction des requêtes de l'utilisateur:
*/
//Requête utilisé lors du chargement de la page web afin de vérifier si l'utilisateur est connecté
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
    $imgPath = "none";
    parse_str(file_get_contents('php://input'), $_PUT);
    if (isset($_PUT["password"]) && isset($_PUT["first_name"]) && isset($_PUT["name_user"]) && isset($_PUT["date_birth"])){
        //Vérification des champs email et date
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $_PUT["date_birth"])){
            $dateArray = explode("-", $_PUT["date_birth"]);
            if (!checkdate(intval($dateArray[1]), intval($dateArray[2]), intval($dateArray[0])) || !filter_var($email, FILTER_VALIDATE_EMAIL)){
                header('HTTP/1.1 400 Bad Request');
            }
            else {
                $myDbReq = $myDb->modifyUser($email, $_PUT["password"], $_PUT["first_name"], $_PUT["name_user"], $_PUT["date_birth"], $imgPath);
                if(!$myDbReq || $myDbReq == ""){
                    header('HTTP/1.1 400 Bad Request');
                }
                else{
                    header('Content-Type: text/html; charset=utf-8');
                    header('Cache-control: no-store, no-cache, must-revalidate');
                    header('Pragma: no-cache');
                    header('HTTP/1.1 200 OK');
                    echo json_encode(true);
                    exit;
                }
            }
        }
        else {
            header('HTTP/1.1 400 Bad Request');
            echo "f";
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
else if ($requestMethod == "PUT" && $requestRessource == "favorites"){
    parse_str(file_get_contents('php://input'), $_PUT);
    if (isset($_PUT["id_tracks"])){
        $myDbReq = $myDb->addFavorite($email, $_PUT["id_tracks"]);
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
    }
    else{
        header('HTTP/1.1 200 OK');
        echo json_encode($myDbReq);
    }
}
else if ($requestMethod == "GET" && $requestRessource == "track"){
    //Envoie une track en fonction de l'id utilisé
    if (isset($_GET["id_tracks"])){
        $myDbReq = $myDb->requestTrack($_GET["id_tracks"], $email);
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
        $myDbReq = $myDb->requestTracks($email);
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
    if (isset($_POST["name_playlist"]) ){//&& isset($_FILES["myFile"])){
        //Upload d'image (pas eu le temps de l'implémenter)
        /*
        $img_path = uploadImg("myFile", $_POST["name_playlist"]);;
        if(!$img_path){
            header('HTTP/1.1 400 Bad Request');
        }
        */
        $imgPath = "none";
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
        if ($myDbReq == ""){
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
        else if (!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }
}
else if ($requestMethod == "DELETE" && $requestRessource == "playlist" && $id != ""){
    //Supprime une playlist d'un utilisateur
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
    //Supprime une track d'une playlist
    else  {
        $myDbReq = $myDb->delTrackFromPlaylist($email, $id, $id2);
        if (!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }

}
else if($requestMethod == "GET" && $requestRessource == "artist"){
    //Envoie les informations d'un artiste
    if (isset($_GET["id_artist"])){
        $myDbReq = $myDb->requestArtist($email, $_GET["id_artist"]);
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
        $myDbReq = $myDb->requestArtists($email);
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
        $myDbReq = $myDb->requestAlbum($_GET["id_album"], $email);
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
        $myDbReq = $myDb->requestAlbums($email);
        if (!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }
}
//Met à jour la date d'écoute d'un morceau
else if ($requestMethod == "PUT" && $requestRessource == "play"){
    parse_str(file_get_contents('php://input'), $_PUT);
    if (isset($_PUT["id_tracks"])){
        $myDbReq = $myDb->updateListeningDate($email, $_PUT["id_tracks"]);
        if (!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }
    else {
        echo $_PUT["id_tracks"];
        header('HTTP/1.1 400 Bad Request');
    }
}
//Envoie les dernières musiques écoutés
else if ($requestMethod == "GET" && $requestRessource == "last_listened"){
    $myDbReq = $myDb->requestLastListened($email);
    if ($myDbReq ==  array()){
        header('HTTP/1.1 200 OK');
        echo json_encode($myDbReq);
    }
    else if (!$myDbReq){
        echo "aaa";
        header('HTTP/1.1 400 Bad Request');
    }
    else{
        header('HTTP/1.1 200 OK');
        echo json_encode($myDbReq);
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