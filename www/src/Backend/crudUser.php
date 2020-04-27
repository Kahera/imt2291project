<?php

require_once '../vendor/autoload.php';
require_once "classes/DB.php";
require_once "classes/User.php";

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
  die(); // Abort further execution
}

// Signup pressed
if (isset($_POST['signup'])) {
  $user = new User($db);

  // Makes sure session variables is set if user is logged in, to load correct version of page
  if ($user->loggedIn()) {
    $twig->addGlobal('session', $_SESSION);
  }
  echo $twig->render('registerUser.html');
}



//Search for user
if (isset($_POST['emailSearch'])) {
  $user = new User($db);
  $data['email'] = $_POST['email'];

  $result = $user->getUserByEmail($data);

  echo $twig->render("adminPage.html", array('user' => $result));
}



//Remove existing admin
if (isset($_POST['removeAdmin'])) {
  $user = new User($db);

  $data['uid'] = $_POST['uid'];
  $data['userType'] = 'admin';
  $data['validate'] = 0;

  $msg = $user->updateUser($data);

  echo $twig->render("adminPage.html", array('msg' => $msg['msg']));
}
