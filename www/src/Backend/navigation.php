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

//--------------From signup sheet--------------
// Cancel from signup sheet
if (isset($_POST['cancelSignup'])) {
    echo $twig->render('index.html');
}

// Logout from signup sheet
if (isset($_POST['logoutSignup'])) {
    // Log user out
    $user = new User($db);
    $user->logout();

    // Re-render page
    echo $twig->render('registerUser.html');
}

//--------------From home page--------------
// Search page
if (isset($_POST['videoHome'])) {
    echo $twig->render('videoHome.html');
}

//- - - - Teachers - - - -
// Edit video page 
if (isset($_POST['manageVideos'])) {
    $video = new Video($db);

    //Get videos by ownerid
    $videos = $video->getVideosByOwner($_SESSION['uid']);

    echo $twig->render("videoEdit.html", array('results' => $videos, 'msg' => $msg));
}

// Edit playlist page 
if (isset($_POST['managePlaylists'])) {
    $playlist = new Playlist($db);

    //Get videos by ownerid
    $playlists = $playlist->getPlayListByOwner($_SESSION['uid']);

    echo $twig->render("playlistEdit.html", array('results' => $playlists));
}

//- - - - Admins - - - -
// Edit permissions page
if (isset($_POST['managePermissions'])) {
    $user = new User($db);

    //Get unvalidated teachers
    $data['userType'] = 'teacher';
    $data['validated'] = 0;
    $newTeachers = $user->getUsersByTypeAndValidation($data);

    //Get admins
    $data['userType'] = 'admin';
    $data['validated'] = 1;
    $admins = $user->getUsersByTypeAndValidation($data);

    echo $twig->render("adminPage.html", array('newTeachers' => $newTeachers, 'admins' => $admins));
}

//--------------From navbar--------------
if (isset($_POST['home'])) {
    $user = new User($db);

    if ($user->loggedIn()) {
        $playlist = new Playlist($db);
        $subscriptions = $playlist->getSubscriptions($_SESSION['uid']);

        echo $twig->render('home.html', array('subscriptions' => $subscriptions));
    } else {
        echo $twig->render('index.html');
    }
}
