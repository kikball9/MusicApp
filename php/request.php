<?php

use function PHPSTORM_META\type;

require "database.php";

function authenticate($db){
    if (isset($_SERVER["PHP_AUTH_USER"]) && isset($_SERVER["PHP_AUTH_PW"])){
        if (!dbCheckUser($db, $_SERVER["PHP_AUTH_USER"], $_SERVER["PHP_AUTH_PW"])){
            header('HTTP/1.1 401 Unauthorized');
            exit;
        }
        else {
            $token = base64_encode(openssl_random_pseudo_bytes(12));
            dbAddToken($db, $_SERVER["PHP_AUTH_USER"], $token);
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

function verifyToken($db){
    $headers = getallheaders();
    $token = $headers["Authorization"];
    if (preg_match("/Bearer (.*)/", $token, $tab)){
        $token = $tab[1];
        $login = dbVerifyToken($db, $token);
        if (!$login){
            header('HTTP/1.1 401 Unauthorized');
            exit;
        }
        return $login;
    }
    else{
        header('HTTP/1.1 401 Unauthorized');
        exit;
    }
}

$myDb = dbConnect();
if (!$myDb){
    header('HTTP/1.1 503 Service Unavailable');
    exit();
}
$requestMethod = $_SERVER['REQUEST_METHOD'];
$request = substr($_SERVER['PATH_INFO'], 1);
$request = explode('/', $request);
$requestRessource = array_shift($request);
// Check id.
$id = array_shift($request);
if ($id == '')
  $id = NULL;

if ($requestRessource == "authenticate"){
    authenticate($myDb);
}
else {
    if (isset($_COOKIE["login"])){
        $login = verifyToken($myDb);
        if($login != $_COOKIE["login"]){
            header('HTTP/1.1 401 Unauthorized');
            exit;

        }
    }
    else{
        $login = verifyToken($myDb);
    }

}
if($requestMethod == "GET" && $requestRessource == ""){
    header("HTTP/1.1 200 OK");
}
else{
    header('HTTP/1.1 400 Bad Request');
}


header('Content-Type: text/x-json; charset=utf-8');
header('Cache-control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
?>