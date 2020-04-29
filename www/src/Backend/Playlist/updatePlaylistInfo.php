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

// Set values
$data['pid'] = $_POST['pid'];

// Check which fields are set with $_POST 
if ($_POST['title'] != null || trim($_POST['title']) != '') {
    $data['title'] = $_POST['title'];
}
if ($_POST['description'] != null || trim($_POST['description']) != '') {
    $data['description'] = $_POST['description'];
}
if ($_POST['theme'] != null || trim($_POST['theme']) != '') {
    $data['theme'] = $_POST['theme'];
}
if ($_POST['subject'] != null || trim($_POST['subject']) != '') {
    $data['subject'] = $_POST['subject'];
}

// Update playlist
$result = $playlist->editPlaylist($data);

// Respond
echo json_encode($result);
