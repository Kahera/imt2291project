<?php

class Playlist
{
    public $db = null;

    public function __construct($db)
    {
        $this->db = $db;
    }

    //------------------------------CRUD--------------------------------------
    public function newPlaylist($data)
    {
        //Create statement and execute
        $sql = 'INSERT INTO playlist (title, ownerid, description, subject, theme, thumbnailfile) VALUES (?, ?, ?, ?, ?, ?)';
        $sth = $this->db->prepare($sql);
        $sth->execute(array($data['title'], $data['owner'], $data['description'], $data['subject'], $data['theme'], $data['thumbnail']));

        //Query should create one new row
        if ($sth->rowCount() == 1) {
            $tmp['status'] = 'OK';
            $tmp['pid'] = $this->db->lastInsertId();
        } else {
            $tmp['status'] = 'FAIL';
            $tmp['errorMessage'] = 'Could not create new playlist';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['errorMessage'] = $this->db->errorInfo()[2];
        }

        return $tmp;
    }

    public function getPlaylistById($pid)
    {
        $sql = "SELECT * FROM playlist WHERE pid=?";
        $sth = $this->db->prepare($sql);
        $sth->execute(array($pid));

        if ($sth->rowCount() == 1) {
            $result = $sth->fetch();
            $tmp['status'] = 'OK';
        } else {
            $tmp['status'] = 'FAIL';
            $tmp['errorMessage'] = 'Could not get playlist';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['errorMessage'] = $this->db->errorInfo()[2];
        }
        return $result;
    }

    public function getPlaylists()
    {
        $sql = 'SELECT * FROM playlist';
        $sth = $this->db->prepare($sql);
        $sth->execute();

        if ($sth->rowCount() > 0) {
            $results = $sth->fetchAll();
        } else {
            $results['rows'] = 0;
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['errorMessage'] = $this->db->errorInfo()[2];
        }
        return $results;
    }

    public function getPlayListByOwner($uid)
    {
        //Make and prepare statement
        $sql = 'SELECT * FROM playlist WHERE ownerid=?';
        $sth = $this->db->prepare($sql);

        //Execute statement
        $sth->execute(array($uid));

        //Check results
        if ($sth->rowCount() > 0) {
            $results = $sth->fetchAll();
        } else {
            $results = null;
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['errorMessage'] = $this->db->errorInfo()[2];
        }
        return $results;
    }

    public function getPlaylistIdsByOwner($uid)
    {
        //Make and prepare statement
        $sql = 'SELECT pid, title FROM playlist WHERE ownerid=?';
        $sth = $this->db->prepare($sql);

        //Execute statement
        $sth->execute(array($uid));

        //Check results
        if ($sth->rowCount() > 0) {
            $results = $sth->fetchAll();
        } else {
            $results = null;
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['errorMessage'] = $this->db->errorInfo()[2];
        }
        return $results;
    }

    public function getSubscriptions($uid)
    {
        //Make and prepare statement
        $sql = 'SELECT * FROM subscription INNER JOIN playlist ON subscription.playlist = playlist.pid WHERE user=?';
        $sth = $this->db->prepare($sql);

        //Execute statement
        $sth->execute(array($uid));

        //Check results
        if ($sth->rowCount() > 0) {
            $results = $sth->fetchAll();
        } else {
            $results = null;
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['errorMessage'] = $this->db->errorInfo()[2];
        }
        return $results;
    }

    public function editPlaylist($data)
    {
        //Make and prepare statement for inserting
        $sql = "UPDATE playlist SET ";
        $sqlData = array();
        $sqlArray = array();

        // Check which fields are set and add to SQL and array
        if (isset($data['owner'])) {
            array_push($sqlArray, 'ownerid=?');
            array_push($sqlData, $data['ownerid']);
        }
        if (isset($data['title'])) {
            array_push($sqlArray, 'title=?');
            array_push($sqlData, $data['title']);
        }
        if (isset($data['description'])) {
            array_push($sqlArray, 'description=?');
            array_push($sqlData, $data['description']);
        }
        if (isset($data['theme'])) {
            array_push($sqlArray, 'theme=?');
            array_push($sqlData, $data['theme']);
        }
        if (isset($data['subject'])) {
            array_push($sqlArray, 'subject=?');
            array_push($sqlData, $data['subject']);
        }

        $sql .= implode(", ", $sqlArray);
        array_push($sqlData, $data['pid']);

        //Finish creating SQL statement and prepare
        $sql .= " WHERE pid=?";
        $sth = $this->db->prepare($sql);

        //Execute statement
        $sth->execute($sqlData);

        //Check that it was uploaded correctly
        if ($sth->rowCount() == 1) {
            $tmp['msg'] = 'Playlist upated. ';
        } else {
            $tmp['msg'] = 'Could not update playlist data. ';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['msg'] = $this->db->errorInfo()[2];
        }
        return $tmp;
    }

    public function updatePlaylistOrder($data)
    {
        //TODO: Check that new position isn't lower than 0 or higher than count()
        //First adjust position values for all videos affected by the swap

        if ($data['oldPosition'] < $data['newPosition']) {
            $sql = 'UPDATE playlistVideo SET position = position-1 WHERE pid=? AND position >=? AND position <=?';
        } else {
            $sql = 'UPDATE playlistVideo SET position = position+1 WHERE pid=? AND position <=? AND position >=?';
        }
        $sth = $this->db->prepare($sql);
        $sth->execute(array($data['pid'], $data['oldPosition'], $data['newPosition']));

        //Then update the video that has new position set
        $sql = 'UPDATE playlistVideo SET position=? WHERE pid=? AND vid=?';
        $sth = $this->db->prepare($sql);
        $sth->execute(array($data['newPosition'], $data['pid'], $data['vid']));

        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['errorMessage'] = $this->db->errorInfo()[2];
        }
        //Not checking return here as it could return any amount of rows
        return $tmp;
    }

    public function deletePlaylist($pid)
    {
        //First delete playlist
        //Create statement and execute
        $sql = 'DELETE FROM playlist WHERE pid=?';
        $sth = $this->db->prepare($sql);
        $sth->execute(array($pid));

        // Query should create one new row
        if ($sth->rowCount() == 1) {
            $tmp['status'] = 'OK';
        } else {
            $tmp['status'] = 'FAIL';
            $tmp['errorMessage'] = 'Could not delete playlist';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['errorMessage'] = $this->db->errorInfo()[2];
        }

        //Then delete all subscriptions to playlist
        //Create statement and execute
        $sql = 'DELETE FROM subscription WHERE pid=?';
        $sth = $this->db->prepare($sql);
        $sth->execute(array($pid));

        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['errorMessage'] = $this->db->errorInfo()[2];
        }
        //Not checking return here as it could return any amount of rows
        return $tmp;
    }


    //------------------------------ADD/DELETE VIDEOS TO/FROM PLAYLIST--------------------------------------
    public function addVideoToPlaylist($data)
    {
        //Get count of videos currently in playlist
        $sql = 'SELECT * FROM playlistVideo WHERE pid=?';
        $sth = $this->db->prepare($sql);
        $sth->execute(array($data['pid']));
        $count = $sth->rowCount();

        //Create statement and execute
        $sql = 'INSERT INTO playlistVideo (pid, vid, position) VALUES (?, ?, ?)';
        $sth = $this->db->prepare($sql);
        $sth->execute(array($data['pid'], $data['vid'], $count));

        // Query should create one new row
        if ($sth->rowCount() == 1) {
            $tmp['msg'] = 'Video added to playlist';
        } else {
            $tmp['msg'] = 'Could not add video to playlist';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['msg'] = $this->db->errorInfo()[2];
        }

        return $tmp;
    }

    public function removeVideoFromPlaylist($data)
    {
        //Create statement and execute
        $sql = 'DELETE FROM playlistVideo WHERE pid=? AND vid=?';
        $sth = $this->db->prepare($sql);
        $sth->execute(array($data['pid'], $data['vid']));

        // Query should return one row
        if ($sth->rowCount() == 1) {
            $tmp['msg'] = 'OK';
        } else {
            $tmp['msg'] = 'Could remove video from playlist';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['msg'] .= $this->db->errorInfo()[2];
        }

        return $tmp;
    }

    //------------------------------SUBSCRIPTiONS--------------------------------------
    public function subscribePlaylist($data)
    {
        //Create statement and execute
        $sql = 'INSERT INTO subscription (user, playlist) VALUES (?, ?)';
        $sth = $this->db->prepare($sql);
        $sth->execute(array($data['uid'], $data['pid']));

        // Query should return one row
        if ($sth->rowCount() == 1) {
            $tmp['status'] = 'OK';
        } else {
            $tmp['status'] = 'FAIL';
            $tmp['errorMessage'] = 'Could not subscribe to playlist';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['errorMessage'] = $this->db->errorInfo()[2];
        }

        return $tmp;
    }

    public function unsubscribePlaylist($data)
    {
        //Create statement and execute
        $sql = 'DELETE FROM subscription WHERE uid=? AND pid=?';
        $sth = $this->db->prepare($sql);
        $sth->execute(array($data['uid'], $data['pid']));

        // Query should return one row
        if ($sth->rowCount() == 1) {
            $tmp['status'] = 'OK';
        } else {
            $tmp['status'] = 'FAIL';
            $tmp['errorMessage'] = 'Could not unsubscribe from playlist';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['errorMessage'] = $this->db->errorInfo()[2];
        }

        return $tmp;
    }

    //------------------------------SEARCH--------------------------------------
    public function searchPlaylist($data)
    {
        //Create statement and execute
        $sql = 'SELECT * FROM playlists WHERE ' . $data['searchType'] . 'LIKE ' . $data['searchTerm'];
        $sth = $this->db->prepare($sql);
        $sth->execute();
        $playlists = $sth->fetchAll();

        return $playlists;
    }

    //------------------------------UTILITY--------------------------------------
    public function getPlaylistLength($pid)
    {
        // Create statement and execute
        $sql = 'SELECT * FROM playlistVideo WHERE pid=?';
        $sth = $this->db->prepare($sql);
        $sth->execute(array($pid));
        $count = $sth->rowCount();

        return $count;
    }

    public function getOldPlaylistPosition($pid, $vid)
    {
        // Create statement and execute
        $sql = 'SELECT position FROM playlistVideo WHERE pid=? AND vid=?';
        $sth = $this->db->prepare($sql);
        $sth->execute(array($pid, $vid));

        // Get value
        $data = $sth->fetch();
        $position = $data['position'];

        return $position;
    }
}
