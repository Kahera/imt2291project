<?php

require_once "classes/API.php";
require_once "classes/DB.php";
require_once "classes/User.php";

session_start();
$header = API::header_init();
$db = DB::getDBConnection();


//Create playlist object
$playlist = new Playlist($db);

$data['pid'] = $_POST['pid'];
$data['uid'] = $_SESSION['uid'];

//Subscribe to playlist
$playlist->subscribePlaylist($data);

//Get playlist subscriptions
$subscriptions = $playlist->getSubscriptions($_SESSION['uid']);

//Return subscriptions
echo json_encode($subscriptions);
