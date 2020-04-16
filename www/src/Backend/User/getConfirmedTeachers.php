<?php

require_once "classes/DB.php";
require_once "classes/User.php";

session_start();
$header = API::header_init();
$db = DB::getDBConnection();


//Create new user object
$user = new User($db);

//Get validated teachers
$data['userType'] = 'teacher';
$data['validated'] = 1;
$newTeachers = $user->getUsersByTypeAndValidation($data);

//Return result
echo json_encode($newTeachers);
