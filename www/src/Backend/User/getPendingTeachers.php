<?php

require_once "../Classes/DB.php";
require_once "../Classes/User.php";

session_start();
$header = API::header_init();
$db = DB::getDBConnection();


//Create new user object
$user = new User($db);

//Get unvalidated teachers
$data['userType'] = 'teacher';
$data['validated'] = 0;
$newTeachers = $user->getUsersByTypeAndValidation($data);

//Return result
echo json_encode($newTeachers);
