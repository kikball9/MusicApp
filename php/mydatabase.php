<?php
  require_once('constants.php');

  class myDatabase{
    //Attribut
    private $myPDO;
    
    //Constructeur
    public function __construct(){
      try
    {
      $this->myPDO = new PDO('mysql:host='.DB_SERVER.';dbname='.DB_NAME.';charset=utf8', DB_USER, DB_PASSWORD);
    }
    catch (PDOException $exception)
    {
      error_log('Connection error: '.$exception->getMessage());
      header('HTTP/1.1 503 Service Unavailable');
      exit;
    }
    }
    //Vérifie que l'email et le password correspondent à un utilisateur
    public function checkUser($email, $password){
    try
    {
      $request = 'SELECT * FROM users WHERE email=:email AND password=SHA1(:password)';
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam (':email', $email, PDO::PARAM_STR, 50);
      $statement->bindParam (':password', $password, PDO::PARAM_STR, 40);
      $statement->execute();
      $result = $statement->fetch();
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    if (!$result)
      return false;
    return true;
  }

  //Ajoute un token d'identification à un utilisateur
  public function addToken($email, $token){
    try
    { 
      $request = 'UPDATE users SET token=:token WHERE email=:email';
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam(':email', $email, PDO::PARAM_STR, 50);
      $statement->bindParam(':token', $token, PDO::PARAM_STR, 20);
      $statement->execute();
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    return true;
  }

  //Vérifie que le token corresponde bien à un utilisateur
  public function verifyToken($token)
  {
    try
    {
      $request = 'SELECT email FROM users WHERE token=:token';
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam (':token', $token, PDO::PARAM_STR, 20);
      $statement->execute();
      $result = $statement->fetch();
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    if (!$result)
      return false;
    return $result['email'];
  }
  
  //Récupere les informations d'un utilisateur
  public function requestUsers($email){
    try{
      $request = "SELECT email, first_name, name_user, date_birth, img_path AS src FROM users WHERE email=:email";
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam(":email", $email, PDO::PARAM_STR, 50);
      $statement->execute();
      $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    return $result;
  }

  //Ajoute un utilisateur
  public function addUser($email, $password, $first_name, $name_user, $date_birth, $img_path){
    try{
      $request = "INSERT INTO users(email, password, first_name, name_user, date_birth, img_path) VALUES(:email, SHA1(:password), :first_name, :name_user, :date_birth, :img_path)";
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam(":email", $email, PDO::PARAM_STR, 50);
      $statement->bindParam(":password", $password, PDO::PARAM_STR, 50);
      $statement->bindParam(":first_name", $first_name, PDO::PARAM_STR, 50);
      $statement->bindParam(":name_user", $name_user, PDO::PARAM_STR, 50);
      $statement->bindParam(":date_birth", $date_birth, PDO::PARAM_STR, 50);
      $statement->bindParam(":img_path", $img_path, PDO::PARAM_STR, 50);
      $statement->execute();
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    return true;
  }

  //Modifier un utilisateur (sauf l'email)
  //NOT DONE
  public function modifyUser($email, $password, $first_name, $name_user, $date_birth, $img){
    try{
      $request = "UPDATE users SET password=SHA1(:password), first_name=:first_name, name_user=:name_user, date_birth=:date_birth, img_path=:img_path WHERE email=:email";
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam(":email", $email, PDO::PARAM_STR, 50);
      $statement->bindParam(":password", $password, PDO::PARAM_STR, 50);
      $statement->bindParam(":first_name", $first_name, PDO::PARAM_STR, 50);
      $statement->bindParam(":name_user", $name_user, PDO::PARAM_STR, 50);
      $statement->bindParam(":date_birth", $date_birth, PDO::PARAM_STR, 50);
      $statement->bindParam(":img_path", $img, PDO::PARAM_STR, 50);
      $statement->execute();
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    return true;
  }

  //supprimer un utilisateur
  public function delUser($email){
    $playlistToDelete = $this->requestPlaylists($email);
    $favs = $this->requestFavorites($email);
    for ($i=0;$i<sizeof($playlistToDelete);$i++){
      echo $playlistToDelete[$i]["id_playlist"];
      $this->delPlaylist($email, $playlistToDelete[$i][0]["id_playlist"]);
      $this->delFavorite($email, $favs[$i]["id_favorite"]);
    }
    try
    {
      $request = 'DELETE FROM users WHERE email=:email';
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam (':email', $email, PDO::PARAM_STR, 50);
      $statement->execute();
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    return true;
  }

  //Récupérer les musiques favorites d"un utilisateur
  public function requestFavorites($email){
      try
      {
        $request = 'SELECT tracks.id_tracks, name_tracks, duration, track_path, tracks.id_album, tracks.id_artist, date_listened, album.img_path AS album_img, artist.name_artist FROM tracks, users_tracks, album, artist WHERE tracks.id_tracks IN (SELECT users_tracks.id_tracks FROM users_tracks WHERE email=:email AND is_favorite=TRUE) AND tracks.id_tracks=users_tracks.id_tracks AND tracks.id_album=album.id_album AND tracks.id_artist=artist.id_artist AND email=:email';
        $statement = $this->myPDO->prepare($request);
        $statement->bindParam (':email', $email, PDO::PARAM_STR, 50);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
      }
      catch (PDOException $exception)
      {
        error_log('Request error: '.$exception->getMessage());
        return false;
      }
      if (!$result)
        return false;
      return $result;

  }

  //Ajouter une musique aux favoris d'un utilisateur
  public function addFavorite($email, $id_tracks){
    //$currentFavorites = $this->requestFavorites($email);
    try{
      $request = "SELECT id_tracks, is_favorite FROM users_tracks WHERE email=:email AND id_tracks=:id_tracks";
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam(":email", $email, PDO::PARAM_STR, 50);
      $statement->bindParam(":id_tracks", $id_tracks, PDO::PARAM_STR, 50);
      $statement->execute();
      $result = $statement->fetch(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    if($result != ""){
      try{
        $request = "UPDATE users_tracks SET is_favorite=TRUE WHERE email=:email AND id_tracks=:id_tracks";
        $statement = $this->myPDO->prepare($request);
        $statement->bindParam(":email", $email, PDO::PARAM_STR, 50);
        $statement->bindParam(":id_tracks", $id_tracks, PDO::PARAM_STR, 50);
        $statement->execute();
      }
      catch (PDOException $exception)
      {
        error_log('Request error: '.$exception->getMessage());
        return false;
      }
      return true;
    }
    else {
      try{
        $request = "INSERT INTO users_tracks(email, id_tracks, is_favorite) VALUES(:email, :id_tracks, TRUE)";
        $statement = $this->myPDO->prepare($request);
        $statement->bindParam(":email", $email, PDO::PARAM_STR, 50);
        $statement->bindParam(":id_tracks", $id_tracks, PDO::PARAM_STR, 50);
        $statement->execute();
        $statement->fetchAll(PDO::FETCH_ASSOC);
      }
      catch (PDOException $exception)
      {
        error_log('Request error: '.$exception->getMessage());
        return false;
      }
      return true;
    }
  }

  //Supprime une musique des favories d'un utilisateur
  public function delFavorite($email, $id_tracks){
    $favs = $this->requestFavorites($email);
    $myBool = false;
    if (!$favs){
      return false;
    }
    else{
      for ($i=0;$i<sizeof($favs);$i++){
        if ($favs[$i]["id_tracks"] == $id_tracks){
          $myBool = true;
        }
      }
      if (!$myBool){
        return false;
      }
    }
    try
    {
      $request = 'UPDATE users_tracks SET is_favorite=FALSE WHERE id_tracks=:id_tracks AND email=:email';
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam (':email', $email, PDO::PARAM_STR, 50);
      $statement->bindParam (':id_tracks', $id_tracks, PDO::PARAM_INT, 50);
      $statement->execute();
      $statement->fetch(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    return true;
  }
  //Récupere un morceau
  public function requestTrack($id_tracks, $email){
    try{
      $request = "SELECT tracks.id_tracks, name_tracks, duration, track_path, date_listened, is_favorite, id_album, id_artist FROM tracks, users_tracks WHERE tracks.id_tracks=:id_tracks AND tracks.id_tracks=users_tracks.id_tracks AND email=:email";//"SELECT id_tracks, name_tracks, date_listened, duration, track_path, name_album, name_artist FROM tracks, album, artist WHERE tracks.id_artist=artist.id_artist AND tracks.id_album=album.id_album AND id_tracks=:id_tracks";
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam(":id_tracks", $id_tracks, PDO::PARAM_STR, 50);
      $statement->bindParam(":email", $email, PDO::PARAM_STR, 50);
      $statement->execute();
      $result = $statement->fetch(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    if ($result == ""){
      try{
        $request = "SELECT tracks.id_tracks, name_tracks, duration, track_path, id_album, id_artist FROM tracks WHERE tracks.id_tracks=:id_tracks";//"SELECT id_tracks, name_tracks, date_listened, duration, track_path, name_album, name_artist FROM tracks, album, artist WHERE tracks.id_artist=artist.id_artist AND tracks.id_album=album.id_album AND id_tracks=:id_tracks";
        $statement = $this->myPDO->prepare($request);
        $statement->bindParam(":id_tracks", $id_tracks, PDO::PARAM_STR, 50);
        $statement->execute();
        $result = $statement->fetch(PDO::FETCH_ASSOC);
      }
      catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    }
    return $result;
  }
  //Récupère toutes les musiques
  public function requestTracks($email){
    try{
      $request = "SELECT tracks.id_tracks FROM tracks";//"SELECT id_tracks, name_tracks, date_listened, duration, track_path, name_album, name_artist FROM tracks, album, artist WHERE tracks.id_artist=artist.id_artist AND tracks.id_album=album.id_album";
      $statement = $this->myPDO->prepare($request);
      $statement->execute();
      $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    $myReturn = array();
    for ($i=0;$i<sizeof($result);$i++){
      array_push($myReturn, $this->requestTrack($result[$i]["id_tracks"], $email));
    }
    return $myReturn;
  }

  //Créer une playlist pour un utilisateur
  public function addPlaylist($email, $name_playlist, $img_path){
    try{
      $request = "INSERT INTO playlist(name_playlist, date_creation, img_path, email) VALUES(:name_playlist, now(), :img_path, :email)";
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam(":name_playlist", $name_playlist, PDO::PARAM_STR, 50);
      $statement->bindParam(":img_path", $img_path, PDO::PARAM_STR, 50);
      $statement->bindParam(":email", $email, PDO::PARAM_STR, 50);
      $statement->execute();
      $statement->fetch(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    return true;
  }

  //Récupère une playlist d'un utilisateur
  public function requestPlaylist($email, $id_playlist){
    
    try{
      $request = "SELECT id_playlist, name_playlist, date_creation FROM playlist WHERE id_playlist=:id_playlist AND email=:email";
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam(":id_playlist", $id_playlist, PDO::PARAM_STR, 50);
      $statement->bindParam(":email", $email, PDO::PARAM_STR, 50);
      $statement->execute();
      $result = $statement->fetch(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    if ($result == ""){
      return $result;
    }

    $myReturn["playlist-info"] = $result;
    try{
      $request = "SELECT img_path FROM album, tracks, playlist_tracks WHERE album.id_album=tracks.id_album AND tracks.id_tracks=playlist_tracks.id_tracks AND playlist_tracks.id_playlist=:id_playlist";
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam(":id_playlist", $id_playlist, PDO::PARAM_STR, 50);
      $statement->execute();
      $result = $statement->fetch(PDO::FETCH_ASSOC);

    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    if ($result == ""){
      $myReturn["playlist-info"]["img_path"] = "assets/img/album.jpeg";
    }
    else {
      $myReturn["playlist-info"]["img_path"] = $result["img_path"];

    }
    try{
      $request = "SELECT id_tracks, date_add FROM playlist_tracks WHERE id_playlist=:id_playlist";
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam(":id_playlist", $id_playlist, PDO::PARAM_STR, 50);
      $statement->execute();
      $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    $tracksInPlaylist = array();
    //echo var_dump($result);
    for ($i=0;$i<sizeof($result);$i++){
      array_push($tracksInPlaylist, $this->requestTrack($result[$i]["id_tracks"], $email));
      $tracksInPlaylist[$i]["date_add"] = $result[$i]["date_add"];
    }
    $myReturn["playlist-tracks"] = $tracksInPlaylist;
    return $myReturn;
  }

  //Récupère les playlists d'un utilisateur
  public function requestPlaylists($email){
    try{
      $request = "SELECT id_playlist FROM playlist WHERE email=:email";
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam(":email", $email, PDO::PARAM_STR, 50);
      $statement->execute();
      $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    if ($result == "" || !$result){
      return "";
    }
    $userPlaylistsId = array();
    for ($i=0;$i<sizeof($result);$i++){
      array_push($userPlaylistsId, $result[$i]["id_playlist"]);
    }
    $myReturn = array();
    for ($i=0;$i<sizeof($userPlaylistsId);$i++){
      array_push($myReturn, $this->requestPlaylist($email, $userPlaylistsId[$i]));
    }
    return $myReturn;
  }

  //Supprime une playlist en fonction de son id
  public function delPlaylist($email, $id_playlist){
    $playlists = $this->requestPlaylist($email, $id_playlist);
    if (!$playlists){
      return false;
    }
    try
      {
      $request = 'DELETE FROM playlist_tracks WHERE id_playlist=:id_playlist';
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam (':id_playlist', $id_playlist, PDO::PARAM_STR, 50);
      $statement->execute();
      $statement->fetch(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    try
      {
      $request = 'DELETE FROM playlist WHERE id_playlist=:id_playlist';
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam (':id_playlist', $id_playlist, PDO::PARAM_STR, 50);
      $statement->execute();
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    return true;
  }
  //Ajoute une track à une playlist
  public function addTrack2Playlist($id_playlist, $id_tracks){
    try{
      $request = "INSERT INTO playlist_tracks(id_tracks, id_playlist, date_add) VALUES(:id_tracks, :id_playlist, now())";
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam (':id_tracks', $id_tracks, PDO::PARAM_INT, 50);
      $statement->bindParam (':id_playlist', $id_playlist, PDO::PARAM_INT, 50);
      $statement->execute();
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    return true;
  }

  public function delTrackFromPlaylist($email, $id_playlist, $id_tracks){    
    try{
      $request = "DELETE FROM playlist_tracks WHERE id_tracks=:id_tracks AND id_playlist=:id_playlist AND id_playlist IN (SELECT id_playlist FROM playlist WHERE email=:email)";
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam (':id_tracks', $id_tracks, PDO::PARAM_INT, 50);
      $statement->bindParam (':id_playlist', $id_playlist, PDO::PARAM_INT, 50);
      $statement->bindParam (':email', $email, PDO::PARAM_STR, 50);
      $statement->execute();
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      echo $exception->getMessage();
      return false;
    }
    return true;
  }
  public function requestArtist($email, $id_artist){
    try{
      $request = "SELECT * FROM artist WHERE id_artist=:id_artist";
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam (':id_artist', $id_artist, PDO::PARAM_INT, 50);
      $statement->execute();
      $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    if ($result == ""){
      return $result;
    }
    $myReturn["artist-infos"] = $result;
    $albums = $this->requestAlbums($email);
    $albumsOfArtist = array();
    for ($i=0;$i<sizeof($albums);$i++){
      if ($albums[$i]["album-infos"][0]["id_artist"] == $id_artist){
        array_push($albumsOfArtist, $albums[$i]);
      }
    }
    $myReturn["artist-albums"] = $albumsOfArtist;
    return $myReturn;
  }

  public function requestArtists($email){
    try{
      $request = "SELECT id_artist FROM artist";
      $statement = $this->myPDO->prepare($request);
      $statement->execute();
      $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    if ($result == ""){
      return "";
    }
    $myReturn = array();
    for ($i=0;$i<sizeof($result);$i++){
      array_push($myReturn, $this->requestArtist($email, $result[$i]["id_artist"]));
    }
    return $myReturn;
  }

  public function requestAlbum($id_album, $email){
    try{
      $request = "SELECT album.id_album, name_album, date_published, img_path, id_artist, style FROM album, is_style WHERE album.id_album=:id_album AND album.id_album = is_style.id_album";//"SELECT album.id_album, name_album, date_published, album.img_path, name_artist, style FROM album, artist, is_style WHERE album.id_album = is_style.id_album AND album.id_artist = artist.id_artist AND  album.id_album = :id_album";
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam (':id_album', $id_album, PDO::PARAM_INT, 50);
      $statement->execute();
      $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    $myReturn["album-infos"] = $result;
    $allTracks = $this->requestTracks($email);
    $tracksInAlbum = array();
    for ($i=0;$i<sizeof($allTracks);$i++){
      if ($allTracks[$i]["id_album"] == $id_album){
        array_push($tracksInAlbum, $allTracks[$i]);
      }
    }
    $myReturn["album-tracks"] = $tracksInAlbum;
    
    return $myReturn;
  }

  public function requestAlbums($email){
    try{
      $request = "SELECT id_album FROM album";//"SELECT album.id_album, name_album, date_published, album.img_path, name_artist, style FROM album, artist, is_style WHERE album.id_album = is_style.id_album AND album.id_artist=artist.id_artist";
      $statement = $this->myPDO->prepare($request);
      $statement->execute();
      $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    $myReturn = array();
    for ($i=0;$i<sizeof($result);$i++){
      array_push($myReturn, $this->requestAlbum($result[$i]["id_album"], $email));
    }
    return $myReturn;
  }

  //Mets à jour la date d'écoute d'un morceau
  public function updateListeningDate($email, $id_tracks){
    try{
      $request = "SELECT id_tracks FROM users_tracks WHERE email=:email AND id_tracks=:id_tracks";
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam(":email", $email, PDO::PARAM_STR, 50);
      $statement->bindParam(":id_tracks", $id_tracks, PDO::PARAM_STR, 50);
      $statement->execute();
      $result = $statement->fetch(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    if($result != ""){
      try{
        $request = "UPDATE users_tracks SET date_listened=now() WHERE email=:email AND id_tracks=:id_tracks";
        $statement = $this->myPDO->prepare($request);
        $statement->bindParam(":email", $email, PDO::PARAM_STR, 50);
        $statement->bindParam(":id_tracks", $id_tracks, PDO::PARAM_STR, 50);
        $statement->execute();
      }
      catch (PDOException $exception)
      {
        error_log('Request error: '.$exception->getMessage());
        return false;
      }
    }
    else {
      try{
        $request = "INSERT INTO users_tracks(email, id_tracks, date_listened) VALUES(:email, :id_tracks, now())";
        $statement = $this->myPDO->prepare($request);
        $statement->bindParam(":email", $email, PDO::PARAM_STR, 50);
        $statement->bindParam(":id_tracks", $id_tracks, PDO::PARAM_STR, 50);
        $statement->execute();
      }
      catch (PDOException $exception)
      {
        error_log('Request error: '.$exception->getMessage());
        return false;
      }
    }
    return true;
  }

  public function requestLastListened($email){
    try{
      $request = "SELECT tracks.id_tracks, name_tracks, duration, track_path, tracks.id_album, tracks.id_artist, date_listened, album.img_path AS img_album, name_artist  FROM tracks, users_tracks, album, artist WHERE tracks.id_tracks=users_tracks.id_tracks AND email=:email AND tracks.id_album=album.id_album AND tracks.id_artist=artist.id_artist ORDER BY date_listened DESC";
        $statement = $this->myPDO->prepare($request);
        $statement->bindParam(":email", $email, PDO::PARAM_STR, 50);
        $statement->execute();
        $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
      {
        error_log('Request error: '.$exception->getMessage());
        return false;
      }
    return $result;

  }

  }

?>
