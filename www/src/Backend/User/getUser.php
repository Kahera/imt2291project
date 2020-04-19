<?php

require_once "classes/DB.php";
require_once "classes/User.php";

session_start();
$header = API::header_init();
$db = DB::getDBConnection();

$user = new User($dbh);

if (isset($_SESSION['uid'])) {
    $data['uid'] = $_SESSION['uid'];
    $data = $user->getUserByID($data);

    echo json_encode($data);
}
