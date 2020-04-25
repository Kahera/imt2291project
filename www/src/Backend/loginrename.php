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

try {
    $db = DB::getDBConnection();
} catch (Exception $e) {
    //respond(500, 'Unable to connect to the database.');
}

// "Listens" for posted form
if (isset($_POST['login'])) {
    $email = $_POST['email'];
    $password = $_POST['password'];

    $user = new User($db);

    // Try to log on
    $status = $user->login($email, $password);
    $twig->addGlobal('session', $_SESSION);

    // Check if status for login is OK
    if ($status['status'] == 'OK') {
        $playlist = new Playlist($db);
        $subscriptions = $playlist->getSubscriptions($_SESSION['uid']);
    } else {
    }
}

if (isset($_POST['logout'])) {
    $user = new User($db);
    $user->logout();

    echo $twig->render("index.html");
}
