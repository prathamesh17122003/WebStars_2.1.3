
<?php
    
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Headers: Content-Type');

    header('Content-Type: application/json');
    require "./connection.php";
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                // Read raw POST data
                $json_data = file_get_contents("php://input");

                // Decode JSON data
                $data = json_decode($json_data, true);
                if (isset($data['name'])) {
                    $name = $data['name'];
                    $email = $data['username'];
                    $password = $data['password'];   
                    $search = "Select * from log_details where email = '$email'";
                    $result = mysqli_query($conn, $search);
                    $num = mysqli_num_rows($result);
                    if ($num != 0) {
                        $message = array(
                            "login" => "denied",
                            "message" => "The account already exists.",
                            "username" => $email
                        );
                        echo json_encode($message);
                    }
                    else {
                        $hash = password_hash("$password", PASSWORD_DEFAULT);
                        $sql = "INSERT INTO `log_details` (`name`,`email`, `password`) VALUES ('$name','$email', '$hash')";
                        mysqli_query($conn, $sql);
                        $message = array(
                            "login" => "success",
                            "username" => $email
                        );
                        echo json_encode($message);
                    }
                }
                else if($data['username']){

                    $email = $data["username"];
                    $password = $data["password"];
                    
                    // Your existing authentication logic goes here
                    $sql = "Select * from log_details where email = '$email'";
                    $result = mysqli_query($conn, $sql);
                    $num = mysqli_num_rows($result);
                    if ($num == 1) {
                        $row = mysqli_fetch_assoc($result);
                        if (password_verify($password, $row['password'])) {
                            session_start();
                            $_SESSION['login'] = true;
                            $_SESSION['loggedin'] = true;
                            $_SESSION['id'] = $row['id'];
                            $message = array(
                                "login" => "success",
                                "username" => $email
                            );
                            echo json_encode($message);
                        }
                        else{
                            $message = array(
                                "login" => "denied",
                                "message" => "Wrong Password",
                                "username" => $email
                            );
                            echo json_encode($message);
                        }
                    }
                    else{
                        $message = array(
                            "login" => "denied",
                            "message" => "No such account",
                            "username" => $email
                        );
                        echo json_encode($message);
                    }
                }
            }
            
        ?>