<?php

require_once "classes/DB.php";
require_once "classes/User.php";

session_start();
$header = API::header_init();
$db = DB::getDBConnection();


// "Listens" for posted register form
$user = new User($db);

$email = $_POST['email'];
$password = $_POST['password'];
$password2 = $_POST['password_repeat'];

// Check if user already exists
$data['email'] = $email;
$found = $user->getUserByEmail($data);

// If user exists: error message
if ($found) {
    $msg = $email . " already exists!";
    echo json_encode($msg);

    // If user doesn't exist: continue
} else {
    // Check if passwords match
    if (!strcmp($password, $password2)) { //strcmp returns 0 if matches

        // Set teacher if checkbox is ticked, otherwise set student
        $userType = (isset($_POST['isTeacher'])) ? "teacher" : "student";

        // Create new user
        $userData['email'] = $email;
        $userData['password'] = password_hash($password, PASSWORD_DEFAULT);
        if (isset($_POST['userType'])) {
            $userData['userType'] = $userType;
        }
        $tmp = $user->createUser($userData);

        if ($tmp['errorMessage'] != 'OK') { //If user is not created
            //Print error message
            echo json_encode($tmp);
        } else { //If user is created
            $tmp['msg'] = 'User registered!';
            echo json_encode($tmp);
        }
    } else { // Error msg if passwords don't match
        echo json_encode("Passwords doesn't match, try again.");
    }
}
