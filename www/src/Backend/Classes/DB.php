<?php

class DB {
  private static $db=null;
  private $dsn = 'mysql:dbname=imt2291_proj1;host=db';
  private $user = 'admin';
  private $password = 'user';
  private $dbh = null;

  private function __construct() {
    try {
        $this->dbh = new PDO($this->dsn, $this->user, $this->password);
    } catch (PDOException $e) {
        // TODO: Ikke bruk dette i produksjon!
        echo 'Connection failed: ' . $e->getMessage();
    }
  }

  public static function getDBConnection() {
      if (DB::$db==null) {
        DB::$db = new self();
      }
      return DB::$db->dbh;
  }
}
