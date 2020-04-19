<?php

require_once "classes/API.php";
require_once "classes/DB.php";
require_once "classes/Playlist.php";

session_start();
$header = API::header_init();
$db = DB::getDBConnection();

//Create playlist object
$playlist = new Playlist($db);

//Get playlists
$playlists = $playlist->getPlaylists();

//Return playlists
echo json_encode($playlists);
