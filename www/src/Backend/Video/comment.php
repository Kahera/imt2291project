<?php

require_once "classes/DB.php";
require_once "classes/Video.php";

session_start();
$header = API::header_init();
$db = DB::getDBConnection();

$video = new Video($db);

//Get comment info
$data['video'] = $_POST['vid'];
$data['user'] = $_POST['uid'];
$data['comment'] = $_POST['comment'];

$video->newComment($data);
