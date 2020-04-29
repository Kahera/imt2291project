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
require_once "../Classes/Playlist.php";

session_start();
$db = DB::getDBConnection();

//Create playlist object
$playlist = new Playlist($db);

$index = $playlist->getPlaylistLength($_POST['pid']) - 1;
$order = $_POST['order'] - 1;

// Check data values
if ($order < 0) {
    $data['newPosition'] = 0;
} else if ($order > $index) {
    $data['newPosition'] = $index;
} else {
    $data['newPosition'] = $order;
}

$data['pid'] = $_POST['pid'];
$data['vid'] = $_POST['vid'];
$data['oldPosition'] = $playlist->getOldPlaylistPosition($_POST['pid'], $_POST['vid']);

$result = $playlist->updatePlaylistOrder($data);

echo json_encode($result);
