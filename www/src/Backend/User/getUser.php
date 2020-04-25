<?php

require_once "../Classes/DB.php";
require_once "../Classes/User.php";

session_start();
$header = API::header_init();
$db = DB::getDBConnection();

$user = new User($dbh);

if (isset($_SESSION['uid'])) {
    $data['uid'] = $_SESSION['uid'];
    $data = $user->getUserByID($data);

    echo json_encode($data);
}
