<?php

require_once "classes/DB.php";
require_once "classes/User.php";

session_start();
$header = API::header_init();
$db = DB::getDBConnection();


//- - - - Admin view - - - -
// Edit permissions page
$user = new User($db);

//Get unvalidated teachers
$data['userType'] = 'teacher';
$data['validated'] = 0;
$newTeachers = $user->getUsersByTypeAndValidation($data);

echo json_encode($newTeachers);
