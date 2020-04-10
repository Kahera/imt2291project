<?php

function respond(int $statusCode, $data)
{
    http_response_code($statusCode);

    if ($statusCode >= 400) {
        echo $data;
    } else {
        if (!is_array($data)) {
            if (!is_string($data)) {
                throw new Exception("Something went wrong.");
            } else {
                $data = ['msg' => $data];
            }
        }
        echo json_encode($data);
    }
    die();
}
