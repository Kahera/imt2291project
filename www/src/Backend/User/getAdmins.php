<?php

require_once "../Classes/DB.php";
require_once "../Classes/User.php";
require_once "../Classes/API.php";

session_start();
$header = API::header_init();
$db = DB::getDBConnection();


//Create new user object
$user = new User($db);

//Get admins
$data['userType'] = 'admin';
$data['validated'] = 1;
$admins = $user->getUsersByTypeAndValidation($data);

//Return result
echo json_encode($admins);
