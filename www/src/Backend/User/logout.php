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

$res = [];
if (isset($_SESSION['uid'])) {
    session_destroy();
    unset($_SESSION['uid']);
    $res['msg'] = 'OK';
    $res['uid'] = -1;
    $res['email'] = null;
    $res['userType'] = null;
} else {
    $res['msg'] = 'Not logged in';
}

echo json_encode($res);
