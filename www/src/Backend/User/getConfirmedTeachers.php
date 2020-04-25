<?php

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


//Create new user object
$user = new User($db);

//Get validated teachers
$data['userType'] = 'teacher';
$data['validated'] = 1;
$newTeachers = $user->getUsersByTypeAndValidation($data);

//Return result
echo json_encode($newTeachers);
