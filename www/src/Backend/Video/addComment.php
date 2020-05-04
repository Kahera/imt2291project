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
require_once "../Classes/Video.php";

session_start();
$db = DB::getDBConnection();
$video = new Video($db);

//Get comment info
$data['video'] = $_POST['vid'];
$data['comment'] = $_POST['comment'];

$res = $video->newComment($data);

//Return response
echo json_encode($res);
