<?php

require_once '../vendor/autoload.php';
require_once "classes/DB.php";
require_once "classes/User.php";
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

$user = new User($db);

// Check if user is logged in, render different pages based on that
if ($user->loggedIn()) {
  $twig->addGlobal('session', $_SESSION);

  // Get subscribed playlists to render
  $playlist = new Playlist($db);
  $subscriptions = $playlist->getSubscriptions($_SESSION['uid']);

  echo $twig->render('home.html', array('subscriptions' => $subscriptions));
} else {
  echo $twig->render('index.html');
}
