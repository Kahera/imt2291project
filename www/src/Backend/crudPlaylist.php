<?php

require_once '../vendor/autoload.php';
require_once "classes/DB.php";
require_once "classes/Playlist.php";
require_once "classes/Video.php";

session_start();

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Credentials: true");


$db = DB::getDBConnection();

//- - - - CRUD - - - -
// "Listen" for show playlist
if (isset($_GET['pid'])) {
    // Create video object
    $video = new Video($db);

    // Get correct video & comments
    $results = $video->getVideosByPlaylist($_GET['pid']);

    // Render playlist page
    //TODO: Render correct page
    echo $twig->render('playlistView.html', array('playlistResults' => $results));
}

if (isset($_POST['createPlaylist'])) {
    // Check for error uploading thumbnail
    if ($_FILES['videofile']['error'] > 0) {
        echo $twig->render('error.html', array('msg' => $_FILES['videofile']['error']));
    } else {
        $playlist = new Playlist($db);

        $data['title'] = $_POST['title'];
        $data['owner'] = $_SESSION['uid'];
        $data['description'] = $_POST['description'];
        $data['subject'] = $_POST['subject'];
        $data['theme'] = $_POST['theme'];
        $data['thumbnail'] = $FILES['thumbnail']['tmp_name'];

        // Add playlist
        $playlist->newPlaylist($data);

        // Get playlist
        $results = $playlist->getPlayListByOwner($_SESSION['uid']);
        // Render edit page
        echo $twig->render('playlistEdit.html', array('results' => $results));
    }
}

// "Listen" for edit playlist
if (isset($_POST['editPlaylist'])) {
    // Create playlist object
    $playlist = new Playlist($db);

    // Get playlist
    $results = $playlist->getPlayListByOwner($_SESSION['uid']);

    // Render edit page
    echo $twig->render('playlistEdit.html', array('results' => $results));
}

if (isset($_POST['editPlaylistVideos'])) {
    //Create empty objects
    $playlist = new Playlist($db);
    $video = new Video($db);

    //Get videos in playlist
    $videos = $video->getVideosByPlaylist($_POST['pid']);

    echo $twig->render('playlistSingleView.html', array('videos' => $videos, 'pid' => $_POST['pid']));
}

if (isset($_POST['update'])) {
    // Create playlist object
    $playlist = new Playlist($db);

    // Set values
    $data['pid'] = $_POST['pid'];

    // Check which fields are set with $_POST 
    if ($_POST['owner'] != null || trim($_POST['owner']) != '') {
        echo 'wat';
        $data['owner'] = $_POST['owner'];
    }
    if ($_POST['title'] != null || trim($_POST['title']) != '') {
        $data['title'] = $_POST['title'];
    }
    if ($_POST['description'] != null || trim($_POST['description']) != '') {
        $data['description'] = $_POST['description'];
    }
    if ($_POST['theme'] != null || trim($_POST['theme']) != '') {
        $data['theme'] = $_POST['theme'];
    }
    if ($_POST['subject'] != null || trim($_POST['subject']) != '') {
        $data['subject'] = $_POST['subject'];
    }

    // Update playlist
    $playlist->editPlaylist($data);

    // Get playlists
    $results = $playlist->getPlayListByOwner($_SESSION['uid']);

    // Render edit page
    echo $twig->render('playlistEdit.html', array('results' => $results));
}

if (isset($_POST['updatePlaylistOrder'])) {
    // Create playlist object
    $playlist = new Playlist($db);
    $video = new Video($db);

    $index = $playlist->getPlaylistLength($_POST['pid']) - 1;

    // Check data values
    if ($_POST['order'] < 0) {
        $data['newPosition'] = 0;
    } else if ($_POST['order'] > $index) {
        $data['newPosition'] = $index;
    } else {
        $data['newPosition'] = $_POST['order'];
    }

    $data['pid'] = $_POST['pid'];
    $data['vid'] = $_POST['vid'];
    $data['oldPosition'] = $playlist->getOldPlaylistPosition($_POST['pid'], $_POST['vid']);

    $playlist->updatePlaylistOrder($data);

    //Get videos in playlist
    $videos = $video->getVideosByPlaylist($_POST['pid']);

    echo $twig->render('playlistSingleView.html', array('videos' => $videos, 'pid' => $_POST['pid']));
}

if (isset($_POST['addToPlaylist'])) {
    // Create playlist object
    $playlist = new Playlist($db);
    $video = new Video($db);

    $data['pid'] = $_POST['pid'];
    $data['vid'] = $_POST['vid'];

    $playlist->addVideoToPlaylist($data);

    // Get videos and playlists
    $videos = $video->getVideos();
    $playlists = $playlist->getPlaylists();
    if ($_SESSION['userType'] != 'student') {
        $playlistsOwned = $playlist->getPlaylistIdsByOwner($_SESSION['uid']);
    }

    //Render page with all results
    echo $twig->render("videoHome.html", array('videoResults' => $videos, 'playlistResults' => $playlists, 'playlistOwned' => $playlistsOwned));
}

if (isset($_POST['removeVideoFromPlaylist'])) {
    // Create playlist object
    $playlist = new Playlist($db);
    $video = new Video($db);

    $data['pid'] = $_POST['pid'];
    $data['vid'] = $_POST['vid'];

    $playlist->removeVideoFromPlaylist($data);

    //Get videos in playlist
    $videos = $video->getVideosByPlaylist($_POST['pid']);

    echo $twig->render('playlistSingleView.html', array('videos' => $videos, 'pid' => $_POST['pid']));
}

if (isset($_POST['deletePlaylist'])) {
    // Create playlist object
    $playlist = new Playlist($db);

    // Get playlist
    $playlist->deletePlaylist($_POST['pid']);

    // Get playlists
    $results = $playlist->getPlayListByOwner($_SESSION['uid']);

    // Render edit page
    echo $twig->render('playlistEdit.html', array('results' => $results));
}
