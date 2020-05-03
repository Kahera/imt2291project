<?php

require_once "../Classes/DB.php";
require_once "../Classes/Video.php";

session_start();
$db = DB::getDBConnection();

//Create playlist object
$video = new Video($db);

//Get playlists
$result = $video->getVideoThumbnailById($_GET['vid']);

//Return playlists
$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: " . $result['vmime']);
header("Content-Length: " . $result['vsize']);

echo $result['thumbnailfile'];
