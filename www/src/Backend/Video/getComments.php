<?php

require_once "../Classes/DB.php";
require_once "../Classes/Video.php";
require_once "../Classes/API.php";

session_start();
$header = API::header_init();
$db = DB::getDBConnection();


//Create new video object
$video = new Video($db);


//Get avgRating
$data['vid'] = $_POST['vid'];
$comments = $video->getComments($vid);

//Return result
echo json_encode($comments);
