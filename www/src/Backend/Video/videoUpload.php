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

// Create empty video
$video = new Video($db);

// Set video values
$data['owner'] = $_SESSION['uid'];
$data['title'] = $_POST['title'];
$data['description'] = $_POST['description'];
$data['lecturer'] = $_POST['lecturer'];
$data['theme'] = $_POST['theme'];
$data['subject'] = $_POST['subject'];
$data['videofile'] = $_FILES['videofile']['tmp_name'];

//Add video
$tmp = $video->addVideo($data);

echo json_encode($tmp);
