<?php

require_once "Classes/DB.php";
require_once "Classes/Video.php";

session_start();
$header = API::header_init();
$db = DB::getDBConnection();

// Create empty video
$video = new Video($db);

// Set rating values
$data['vid'] = $_POST['vid'];
$data['uid'] = $_SESSION['uid'];
$data['rating'] = $_POST['rating'];

// Update video
$video->rateVideo($data);

// Render video page
echo json_encode("Rating updated!");
