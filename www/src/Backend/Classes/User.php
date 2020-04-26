<?php

/**
 * User class handles all user related tasks. When created the constructor
 * will check the $_POST and $_SESSION and $_COOKIE variables to handle
 * login/logout and session management tasks.
 * This class is also used for all user management.
 */
class User
{
  private $uid = -1;
  private $userData = [];
  private $db = null;

  /**
   * Handles login/logout through the $_POST superglobal, handles session
   * managment trough the $_SESSION and $_COOKIE superglobals.
   *
   * @param PDO $db stores a reference to this PDO connection object,
   * used for all database interaction.
   */
  public function __construct($db)
  {
    $this->db = $db;

    //TODO: Check if this is needed with the new login/out functions
    /*
    if (isset($_POST['email'])) {
      $this->login($_POST['email'], $_POST['password']);
    } else if (isset($_POST['logout'])) {
      unset($_SESSION['uid']);
    } else if (isset($_SESSION['uid'])) {
      $this->uid = $_SESSION['uid'];
    }
    */
  }

  //------------------------------LOGIN--------------------------------------
  public function loggedIn()
  {
    return isset($_SESSION['uid']);
    //$this->uid > -1;
  }

  /**
   * Utility function used to log in a user. Sets the $_SESSION variables to the
   * values of the user, if a user exists with the given email/password.
   *
   * @param  String $email the email for the user that attempts to log in
   * @param  String $password   the password for the user that attempts to log in
   * @return Array        element status='OK' on success, status='FAIL' on failure.
   *                      If login failed, errorMessage contains a message indicating
   *                      if it was a bad email or a bad password.
   */
  public function login($email, $password)
  {
    $sql = 'SELECT * FROM user WHERE email=?';
    $sth = $this->db->prepare($sql);
    $sth->execute(array($email));

    $result = $sth->fetch(PDO::FETCH_ASSOC);

    if ($result['uid'] > 0) {
      if (password_verify($password, $result['password'])) {
        // Set user data with fetched data
        $this->userData = $this->setUserData($result);
        $this->setSessionData($result);

        //Return OK
        $result['msg'] = 'OK';
      } else {
        //Return bad password
        $result['msg'] = 'Wrong password';
      }
    } else {
      //Return bad user
      $result['msg'] = 'No such user';
    }

    return $result;
  }

  /**
   * Utility function to log out a user, unsets variables and session
   */
  public function logout()
  {
    unset($this->userData);
    $_SESSION = array();
  }

  //------------------------------CRUD--------------------------------------
  /**
   * Adds a user to the database, all information about the user to created
   * should be in the $userData array.
   * Returns an array with status and inforamtion about the user that was added.
   *
   * @param Array $userData must include the elements:
   *              email: the email for the user to create
   *              pwd: the original pwd given by the user, will be hashed
   *              userType: 'student', 'teacher', 'admin', default is 'student'
   * @return Array with status=OK and id=id of the newly created user on success,
   *              if no user can be created status will be set to FAIL and
   *              errorMessage wihh contain an error message describing the error.
   */
  public function createUser($userData)
  {
    // Create data array to send to database
    $sqlData = array($userData['email'], $userData['password']);
    //Note that password gets hashed before it gets sent here

    $sql = 'INSERT INTO user (email, password';
    $sqlValues = ') VALUES (?, ?';

    // Optional field
    if (isset($userData['userType'])) {
      $sql .= ', userType';
      array_push($sqlData, $userData['userType']);
      $sqlValues .= ', ?';
    }
    //Finish creating SQL statement
    $sqlValues .= ')';
    $sql .= $sqlValues;

    //Prepare and execute statement
    $sth = $this->db->prepare($sql);
    $sth->execute($sqlData);

    // Query should create one new row
    if ($sth->rowCount() == 1) {
      $tmp['status'] = 'OK';
      $tmp['uid'] = $this->db->lastInsertId();
    } else {
      $tmp['status'] = 'FAIL';
      $tmp['errorMessage'] = 'Could not create user';
    }
    if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
      $tmp['errorMessage'] = $this->db->errorInfo()[2];
    }
    return $tmp;
  }

  public function getUserByEmail($data)
  {
    $sql = 'SELECT * FROM user WHERE email=?';
    $sth = $this->db->prepare($sql);
    $sth->execute(array($data['email']));

    //Should return one row
    if ($sth->rowCount() == 1) {
      $result = $sth->fetch();
      $result['status'] = 'OK';
    } else {
      $result['status'] = 'FAIL';
      $result['errorMessage'] = 'Could not get user';
    }
    if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
      $tmp['errorMessage'] = $this->db->errorInfo()[2];
    }
    return $result;
  }

  public function getUserByID($data)
  {
    $sql = 'SELECT * FROM user WHERE uid=?';
    $sth = $this->db->prepare($sql);
    $sth->execute(array($data['uid']));

    //Should return one row
    if ($sth->rowCount() == 1) {
      $result = $sth->fetch();
      $result['msg'] = 'OK';
    } else {
      $result['msg'] = 'Could not get user';
    }
    if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
      $result['msg'] = $this->db->errorInfo()[2];
    }
    return $result;
  }

  public function getUsersByTypeAndValidation($data)
  {
    $sql = 'SELECT * FROM user WHERE userType=? AND validated=?';
    $sth = $this->db->prepare($sql);
    $sth->execute(array($data['userType'], $data['validated']));

    if ($sth->rowCount() > 0) {
      $results = $sth->fetchAll();
      $results['msg'] = 'OK';
    } else {
      $results['msg'] = "No users fit the criteria.";
    }
    if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
      $result['msg'] = $this->db->errorInfo()[2];
    }

    return $results;
  }

  /**
   * Update user function
   * @param String $uid: for user to update
   * @param String $userType: for setting new userType
   * @param Int $validate: for setting validated/not
   */
  public function updateUser($data)
  {
    if ($data['userType'] == 'teacher') {
      $sql = null;
      if ($data['validate'] == 1) { //If validate: set validated
        $sql = "UPDATE user SET validated=1, userType='teacher' WHERE uid=?";
      } else { // If not actually teacher, set userType to student
        $sql = "UPDATE user SET validated=0, userType='student' WHERE uid=?";
      }
    } else if ($data['userType'] == 'admin') { //Set admin
      if ($data['validate'] == 1) {
        $sql = "UPDATE user SET validated=1, userType='admin' WHERE uid=?";
      } else {
        //Setting admin to teacher, will then show up in the teacher validation,
        //if not validated there the user will be set to student type
        $sql = "UPDATE user SET validated=0, userType='teacher' WHERE uid=?";
      }
    }

    $sth = $this->db->prepare($sql);
    $sth->execute(array($data['uid']));

    // Query should return one row
    if ($sth->rowCount() == 1) {
      $tmp['msg'] = 'User updated.';
      $tmp['status'] = 'OK';
    } else {
      $tmp['msg'] = 'Could not update user permissions.';
    }
    if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
      $tmp['msg'] = $this->db->errorInfo()[2];
    }

    return $tmp;
  }

  public function deleteUser($uid)
  {
    //Prepare and execute SQL
    $sql = 'DELETE FROM user WHERE uid=?';
    $sth = $this->db->prepare($sql);
    $sth->execute(array($uid));

    //Check that it's actually removed
    if ($sth->rowCount() == 1) {
      $tmp['status'] = 'OK';
      $tmp['id'] = $this->db->lastInsertId();
    } else {
      $tmp['status'] = 'FAIL';
      $tmp['errorMessage'] = 'Could not delete user';
      $tmp['errorInfo'] = $sth->errorInfo();
    }
    return $tmp;
  }

  //------------------------------Utility--------------------------------------
  private function setUserData($data)
  {
    $temp['uid'] = $data['uid'];
    $temp['email'] = $data['email'];
    $temp['userType'] = $data['userType'];
    $temp['validated'] = $data['validated'];

    return $temp;
  }

  private function setSessionData($data)
  {
    $_SESSION['uid'] = $data['uid'];
    $_SESSION['email'] = $data['email'];
    $_SESSION['userType'] = $data['userType'];
    $_SESSION['validated'] = $data['validated'];
  }
}
