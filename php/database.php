<?php
/**
 * @Author: Thibault Napoléon <Imothep>
 * @Company: ISEN Yncréa Ouest
 * @Email: thibault.napoleon@isen-ouest.yncrea.fr
 * @Created Date: 22-Jan-2018 - 13:57:23
 * @Last Modified: 12-Dec-2019 - 14:35:38
 */

  require_once('constants.php');

  //----------------------------------------------------------------------------
  //--- dbConnect --------------------------------------------------------------
  //----------------------------------------------------------------------------
  // Create the connection to the database.
  // \return False on error and the database otherwise.
  function dbConnect()
  {
    try
    {
      $db = new PDO('mysql:host='.DB_SERVER.';dbname='.DB_NAME.';charset=utf8',
        DB_USER, DB_PASSWORD);
    }
    catch (PDOException $exception)
    {
      error_log('Connection error: '.$exception->getMessage());
      return false;
    }
    return $db;
  }

  //----------------------------------------------------------------------------
  //--- dbCheckUser ------------------------------------------------------------
  //----------------------------------------------------------------------------
  // Check login/password of a user.
  // \param db The connected database.
  // \param login The login to check.
  // \param password The password to check.
  // \return True on success, false otherwise.
  function dbCheckUser($db, $login, $password)
  {
    try
    {
      $request = 'SELECT * FROM users WHERE login=:login AND
        password=SHA1(:password)';
      $statement = $db->prepare($request);
      $statement->bindParam (':login', $login, PDO::PARAM_STR, 20);
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

  //----------------------------------------------------------------------------
  //--- dbAddToken -------------------------------------------------------------
  //----------------------------------------------------------------------------
  // Add a token to the database.
  // \param db The connected database.
  // \param login The login assocciated with the token.
  // \param token The token to add.
  // \return True on success, false otherwise.
  function dbAddToken($db, $login, $token)
  {
    try
    {
      $request = 'UPDATE users SET token=:token WHERE login=:login';
      $statement = $db->prepare($request);
      $statement->bindParam(':login', $login, PDO::PARAM_STR, 20);
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

  //----------------------------------------------------------------------------
  //--- dbVerifyToken ----------------------------------------------------------
  //----------------------------------------------------------------------------
  // Verify a user token.
  // \param db The connected database.
  // \param token The token to check.
  // \return Login on success, false otherwise.
  function dbVerifyToken($db, $token)
  {
    try
    {
      $request = 'SELECT login FROM users WHERE token=:token';
      $statement = $db->prepare($request);
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
?>
