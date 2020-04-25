<?php

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Credentials: true");

require_once "classes/API.php";
require_once "classes/DB.php";
require_once "classes/User.php";

session_start();
$db = DB::getDBConnection();


// Create playlist object
$playlist = new Playlist($db);

$data['pid'] = $_POST['pid'];
$data['uid'] = $_SESSION['uid'];

// Get playlist
$playlist->unsubscribePlaylist($data);

// Get playlists
$subscriptions = $playlist->getSubscriptions($_SESSION['uid']);

// Return subscriptions
echo json_encode($subscriptions);
