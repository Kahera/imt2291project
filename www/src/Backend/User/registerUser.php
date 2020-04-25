<?php

$http_origin = $_SERVER['HTTP_ORIGIN'];

if ($http_origin == "http://www" || $http_origin == "http://localhost:8080") {
    header("Access-Control-Allow-Origin: $http_origin");
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin");
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Credentials: true");

require_once "../Classes/DB.php";
require_once "../Classes/User.php";
session_start();
$db = DB::getDBConnection();

$user = new User($db);

$email = $_POST['email'];
$password = $_POST['password'];
$password2 = $_POST['password_repeat'];


// Check if user already exists
$data['email'] = $email;
$found = $user->getUserByEmail($data);


// If user exists: error message
if ($found['uid'] > 0) {
    $res['msg'] = $email . " already exists.";

    // If user doesn't exist: continue
} else {
    // Check if passwords match
    if (!strcmp($password, $password2)) { //strcmp returns 0 if matches

        // Set teacher if checkbox is ticked, otherwise set student
        $userType = (isset($_POST['chk_lecturer'])) ? "teacher" : "student";

        // Create new user
        $userData['email'] = $email;
        $userData['password'] = password_hash($password, PASSWORD_DEFAULT);
        $userData['userType'] = $userType;
        $tmp = $user->createUser($userData);

        if ($tmp['status'] == 'OK') {
            $res['msg'] = "User created - log in!";
        } else {
            $res['msg'] = $tmp['errorMessage'];
        }
    } else { // Error msg if passwords don't match
        $res['msg'] = "Passwords doesn't match, try again.";
    }
}
echo json_encode($res);
