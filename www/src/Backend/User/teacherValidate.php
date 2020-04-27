<?php

$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Credentials: true");

require_once "../Classes/DB.php";
require_once "../Classes/User.php";

session_start();
$db = DB::getDBConnection();


//Create new user object
$user = new User($db);

$data['uid'] = $_POST['uid'];
$data['userType'] = 'teacher';
$data['validate'] = 1;

$msg = $user->updateUser($data);

echo json_encode($msg);
