<?php

require_once "../Classes/DB.php";
require_once "../Classes/Video.php";

session_start();
$header = API::header_init();
$db = DB::getDBConnection();

$video = new Video($db);

//Get comment info
$data['video'] = $_POST['vid'];
$data['user'] = $_POST['uid'];
$data['comment'] = $_POST['comment'];

$video->newComment($data);
