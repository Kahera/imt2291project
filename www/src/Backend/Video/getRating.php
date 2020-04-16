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
$videoRating = $video->getVideoAvgRating($data);

//Return result
echo json_encode($admins);
