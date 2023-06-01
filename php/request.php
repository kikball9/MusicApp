<?php

use function PHPSTORM_META\type;

require "mydatabase.php";

function authenticate($db){
    if (isset($_SERVER["PHP_AUTH_USER"]) && isset($_SERVER["PHP_AUTH_PW"])){
        if (!$db->checkUser($_SERVER["PHP_AUTH_USER"], $_SERVER["PHP_AUTH_PW"])){
            header('HTTP/1.1 401 Unauthorized');
            exit;
        }
        else {
            $token = base64_encode(openssl_random_pseudo_bytes(12));
            $db->addToken($_SERVER["PHP_AUTH_USER"], $token);
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

$myDb = new myDatabase;
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
    $email = verifyToken($myDb);
    if (isset($_COOKIE["email"])){
        if($email != $_COOKIE["email"]){
            header('HTTP/1.1 401 Unauthorized');
            exit;
        }
    }
}
if($requestMethod == "GET" && $requestRessource == ""){
    header("HTTP/1.1 200 OK");
}
//Récupérer les utilisateurs
else if ($requestMethod == "GET" && $requestRessource == "user"){
    $myDbReq = $myDb->requestUsers($email);
    if (!$myDbReq){
        header('HTTP/1.1 400 Bad Request');
    }
    else{
        header('HTTP/1.1 200 OK');
        echo json_encode($myDbReq);
    }
}
else if ($requestMethod == "POST" && $requestRessource == "user"){
    if (isset($_POST["email"]) && isset($_POST["password"]) && isset($_POST["first_name"]) && isset($_POST["name_user"]) && isset($_POST["date_birth"]) && isset($_POST["img_path"])){
        $myDbReq = $myDb->addUser($_POST["email"], $_POST["password"], $_POST["first_name"], $_POST["name_user"], $_POST["date_birth"], $_POST["img_path"]);
        if(!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }
}
else if ($requestMethod == "PUT" && $requestRessource == "user"){
    parse_str(file_get_contents('php://input'), $_PUT);
    if (isset($_PUT["password"]) && isset($_PUT["first_name"]) && isset($_PUT["name_user"]) && isset($_PUT["date_birth"]) && isset($_PUT["img"])){
        $myDbReq = $myDb->modifyUser($email, $_PUT["password"], $_PUT["first_name"], $_PUT["name_user"], $_PUT["date_birth"], $_PUT["img"]);
        if(!$myDbReq){
            header('HTTP/1.1 400 Bad Request');
        }
        else{
            header('HTTP/1.1 200 OK');
            echo json_encode($myDbReq);
        }
    }
}
else if ($requestMethod == "DELETE" && $requestRessource == "user"){
    $myDbReq = $myDb->delUser($email);
    if(!$email){
        header('HTTP/1.1 400 Bad Request');
    }
    else{
        header('HTTP/1.1 200 OK');
        echo json_encode($myDbReq);
    }
}
else if ($requestMethod == "GET" && $requestRessource == "favorites" && $id == ""){
    $myDbReq = $myDb->requestFavorites($email);
    if(!$email){
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


header('Content-Type: text/x-json; charset=utf-8');
header('Cache-control: no-store, no-cache, must-revalidate');
header('Pragma: no-cache');
?>