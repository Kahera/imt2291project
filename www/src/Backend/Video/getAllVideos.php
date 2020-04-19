<?php

//require_once "classes/API.php";
require_once "classes/DB.php";
require_once "classes/Video.php";

session_start();
//$header = API::header_init();
$db = DB::getDBConnection();

$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Credentials: true");

//Create playlist object
$video = new Video($db);

//Get playlists
$videos = $video->getVideos();

//Return playlists
echo json_encode($videos);
