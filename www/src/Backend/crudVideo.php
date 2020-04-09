<?php

require_once '../vendor/autoload.php';
require_once "classes/DB.php";
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

//- - - - Video specific navigation - - - -
// "Listen" for go to video home
if (isset($_POST['videoHome'])) {
    // Create empty video
    $video = new Video($db);

    // Get correct video
    $results = $video->getVideos();

    if ($_SESSION['userType'])

        // Render video homepage
        echo $twig->render('videoHome.html', array('results' => $results));
}

//- - - - CRUD - - - -
// "Listen" for show video
if (isset($_POST['seeVideo'])) {
    // Create empty video
    $video = new Video($db);

    // Get correct video & comments
    $videoResult = $video->getVideo($_POST['vid']);
    $commentResults = $video->getComments($_POST['vid']);

    // Render video page
    echo $twig->render('videoView.html', array('video' => $videoResult, 'comments' => $commentResults));
}


// "Listen" for search video
if (isset($_POST['searchFor'])) {
    // Create empty video and playlist
    $video = new Video($db);
    $playlist = new Playlist($db);

    // Set search values
    $data['searchType'] = $_POST['search'];
    $data['searchTerm'] = $_POST['searchterm'];

    // Get videos
    $videos = $video->searchVideo($data);
    $playlists = $playlist->searchPlaylist($data);

    // Reload page with results
    echo $twig->render('videoHome.html', array('playlistResults' => $playlists, 'videoResults' => $videos));
}


// "Listen" for show all videos
if (isset($_POST['seeAll'])) {
    // Create empty video and playlist
    $video = new Video($db);
    $playlist = new Playlist($db);

    // Get videos and playlists
    $videos = $video->getVideos();
    $playlists = $playlist->getPlaylists();
    if ($_SESSION['userType'] != 'student') {
        $playlistsOwned = $playlist->getPlaylistIdsByOwner($_SESSION['uid']);
    }

    //Render page with all results
    echo $twig->render("videoHome.html", array('videoResults' => $videos, 'playlistResults' => $playlists, 'playlistOwned' => $playlistsOwned));
}


// "Listen" for edit video
if (isset($_POST['edit'])) {
    // Create empty video
    $video = new Video($db);

    //Set video values
    $data['vid'] = $_POST['vid'];
    $data['owner'] = $_SESSION['uid'];
    $data['title'] = $_POST['title'];
    $data['description'] = $_POST['description'];
    $data['lecturer'] = $_POST['lecturer'];
    $data['theme'] = $_POST['theme'];
    $data['subject'] = $_POST['subject'];

    // Delete video
    $video->updateVideo($data);

    //Get updated object
    $updated = $video->getVideo($data['vid']);

    echo $twig->render("videoHome.html", array('video' => $updated));
}

// "Listen" for delete video
if (isset($_POST['delete'])) {
    // Create empty video
    $video = new Video($db);

    // Set video id to delete
    $vid = $_POST['vid'];

    // Delete video
    $video->deleteVideo($vid);

    // Reload videos page
    echo $twig->render("videoHome.html", array('msg' => 'Video deleted', 'results' => $results));
}

//- - - - Other video related stuff - - - -
// "Listen" for new rating
if (isset($_POST['rating'])) {
    // Create empty video
    $video = new Video($db);

    // Set rating values
    $data['vid'] = $_POST['vid'];
    $data['uid'] = $_SESSION['uid'];
    $data['rating'] = $_POST['rating'];

    // Update video
    $video->rateVideo($data);

    // Get correct video & comments
    $videoResult = $video->getVideo($_POST['vid']);
    $commentResults = $video->getComments($_POST['vid']);

    // Render video page
    echo $twig->render('videoView.html', array('video' => $videoResult, 'comments' => $commentResults));
}


if (isset($_POST['addComment'])) {
    $video = new Video($db);

    $data['vid'] = $_POST['vid'];
    $data['comment'] = $_POST['comment'];

    //Add comment
    $video->newComment($data);

    // Get correct video & comments
    $videoResult = $video->getVideo($_POST['vid']);
    $commentResults = $video->getComments($_POST['vid']);

    // Render video page
    echo $twig->render('videoView.html', array('video' => $videoResult, 'comments' => $commentResults));
}
