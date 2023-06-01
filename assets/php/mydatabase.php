<?php
/**
 * @Author: Thibault Napoléon <Imothep>
 * @Company: ISEN Yncréa Ouest
 * @Email: thibault.napoleon@isen-ouest.yncrea.fr
 * @Created Date: 22-Jan-2018 - 13:57:23
 * @Last Modified: 12-Dec-2019 - 14:35:38
 */

  require_once('constants.php');

  class myDatabase{

    private $myPDO;
    
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
    return $result['login'];
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
      $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    return true;
  }

  //Modifie un utilisateur
  public function modifyUser($email, $password, $first_name, $name_user, $date_birth, $img){
    try{
      $request = "UPDATE users SET password=:password, first_naem=:first_name, name_user=:name_user, date_birth=:date_birth, img_path=:img_path WHERE email=:email";
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam(":email", $email, PDO::PARAM_STR, 50);
      $statement->bindParam(":password", $password, PDO::PARAM_STR, 50);
      $statement->bindParam(":first_name", $first_name, PDO::PARAM_STR, 50);
      $statement->bindParam(":name_user", $name_user, PDO::PARAM_STR, 50);
      $statement->bindParam(":date_birth", $date_birth, PDO::PARAM_STR, 50);
      $statement->bindParam(":img_path", $img, PDO::PARAM_STR, 50);
      $result = $statement->fetchAll(PDO::FETCH_ASSOC);
    }
    catch (PDOException $exception)
    {
      error_log('Request error: '.$exception->getMessage());
      return false;
    }
    return true;
  }

  public function delUser($email){
    try
    {
      $request = 'DELETE FROM users WHERE email=:email';
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam (':email', $email, PDO::PARAM_STR, 50);
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
    
    try
      {
      $request = 'DELETE FROM favorites_tracks WHERE email=:email';
      $statement = $this->myPDO->prepare($request);
      $statement->bindParam (':email', $email, PDO::PARAM_STR, 50);
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

  public function requestFavorites($email){
      try
      {
        $request = 'SELECT id_tracks FROM favorites_tracks WHERE email=:email';
        $statement = $this->myPDO->prepare($request);
        $statement->bindParam (':email', $email, PDO::PARAM_STR, 50);
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
      $favorites = array();
      for ($i=0;$i<sizeof($result);$i++){         
        try
        {
          $request = 'SELECT id_tracks, name_tracks, date_listened, duration, track_path, id_album, id_artist FROM tracks WHERE id_tracks=:id_tracks';
          $statement = $this->myPDO->prepare($request);
          $statement->bindParam (':id_tracks', $id_tracks, PDO::PARAM_STR, 50);
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
        array_push($favorites, $result);
      }
      return $favorites;

  }
  }
  

?>
