<?php

require_once '../vendor/autoload.php';
require_once "classes/DB.php";
require_once "classes/User.php";
require_once "classes/Video.php";
require_once "classes/Playlist.php";

session_start();

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Credentials: true");

$db = DB::getDBConnection();

if ($db == null) {
    echo $twig->render('error.html', array('msg' => 'Unable to connect to the database!'));
    die(); //Abort further execution
}

// "Listen" for upload video
if (isset($_POST['title'])) {
    // Check for error uploading video
    if ($_FILES['videofile']['error'] > 0) {
        echo $twig->render('error.html', array('msg' => $_FILES['videofile']['error']));
    } else {
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

        // Add video
        $tmp = $video->addVideo($data);

        // Get users videos
        $results = $video->getVideosByOwner($_SESSION['uid']);

        // Reload page
        echo $twig->render('videoEdit.html', array('msg' => $tmp['msg'], 'results' => $results));
    }
}
