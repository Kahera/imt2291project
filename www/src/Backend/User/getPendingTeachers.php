<?php

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


//- - - - Admin view - - - -
// Edit permissions page
$user = new User($db);

//Get unvalidated teachers
$data['userType'] = 'teacher';
$data['validated'] = 0;
$newTeachers = $user->getUsersByTypeAndValidation($data);

echo json_encode($newTeachers);
