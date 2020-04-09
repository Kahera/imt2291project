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

// "Listens" for posted register form
if (isset($_POST['register'])) {
  $user = new User($db);

  $email = $_POST['email'];
  $password = $_POST['password'];
  $password2 = $_POST['password_repeat'];

  // Check if user already exists
  $sql = 'SELECT * FROM user WHERE email=?';
  $sth = $db->prepare($sql);
  $sth->execute(array($email));
  $user = $sth->fetch();

  // If user exists: error message
  if ($user) {
    $msg = $email . " already exists!";
    echo $twig->render('registerUser.html', array('msg' => $msg));

    // If user doesn't exist: continue
  } else {
    // Check if passwords match
    if (!strcmp($password, $password2)) { //strcmp returns 0 if matches

      // Set teacher if checkbox is ticked, otherwise set student
      $userType = (isset($_POST['isTeacher'])) ? "teacher" : "student";

      // Create new user
      $user = new User($db);
      $userData['email'] = $email;
      $userData['password'] = password_hash($password, PASSWORD_DEFAULT);
      if (isset($_POST['userType'])) {
        $userData['userType'] = $userType;
      }
      $tmp = $user->createUser($userData);

      if ($tmp['errorMessage'] != 'OK') { //If user is not created
        //Print error message
        echo $twig->render('registerUser.html', array('msg' => $tmp['errorMessage']));
      } else { //If user is created
        echo $twig->render('index.html', array('msg' => 'Success! Now log in:'));
      }
    } else { // Error msg if passwords don't match
      echo "Passwords doesn't match, try again.";
    }
  }
}

//Search for user
if (isset($_POST['emailSearch'])) {
  $user = new User($db);
  $data['email'] = $_POST['email'];

  $result = $user->getUserByEmail($data);

  echo $twig->render("adminPage.html", array('user' => $result));
}

//------------------------------User validation/rejection--------------------------------------
//Validate teacher
if (isset($_POST['validateTeacher'])) {
  $user = new User($db);

  $data['uid'] = $_POST['uid'];
  $data['userType'] = $_POST['userType'];
  $data['validate'] = 1;

  $msg = $user->updateUser($data);

  echo $twig->render("adminPage.html", array('msg' => $msg['msg']));
}

//Reject teacher
if (isset($_POST['rejectTeacher'])) {
  $user = new User($db);

  $data['uid'] = $_POST['uid'];
  $data['userType'] = 'teacher';
  $data['validate'] = 0;

  $msg = $user->updateUser($data);

  echo $twig->render("adminPage.html", array('msg' => $msg['msg']));
}

//Set new user as admin
if (isset($_POST['setAdmin'])) {
  $user = new User($db);

  $data['uid'] = $_POST['uid'];
  $data['userType'] = 'admin';
  $data['validate'] = 1;

  $msg = $user->updateUser($data);

  echo $twig->render("adminPage.html", array('msg' => $msg['msg']));
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
