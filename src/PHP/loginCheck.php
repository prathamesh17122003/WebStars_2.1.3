<?php
    session_start();
    if ($_SESSION['loggedin'] != true || isset($_SESSION['loggedin'])) {
        $message = array(
            "login" => "success",
            "username" => $email
        );
        echo json_encode($message);
    }
    else{
        $message = array(
            "login" => "denied",
            "message" => "No user logged",
        );
        echo json_encode($message);
    }
?>