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
        $sql = 'INSERT INTO playlist (title, ownerid, description, subject, theme) VALUES (?, ?, ?, ?, ?)';
        $sth = $this->db->prepare($sql);
        $sth->execute(array($data['title'], $data['owner'], $data['description'], $data['subject'], $data['theme']));

        //Query should create one new row
        if ($sth->rowCount() == 1) {
            $result['msg'] = 'OK';
        } else {
            $result['msg'] = 'Could not create new playlist';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $result['msg'] = $this->db->errorInfo()[2];
        }
        return $result;
    }

    public function getPlaylistById($pid)
    {
        $sql = "SELECT * FROM playlist WHERE pid=?";
        $sth = $this->db->prepare($sql);
        $sth->execute(array($pid));

        if ($sth->rowCount() == 1) {
            $result = $sth->fetch();
            $result['msg'] = 'OK';
        } else {
            $result['msg'] = 'Could not get playlist';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $result['msg'] = $this->db->errorInfo()[2];
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
            $results['msg'] = 'OK';
        } else {
            $results['msg'] = "No playlists to show.";
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $results['msg'] = $this->db->errorInfo()[2];
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
            $results['msg'] = 'OK';
        } else {
            $results['msg'] = "No playlists to get";
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $results['msg'] = $this->db->errorInfo()[2];
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
            $tmp = $sth->fetchAll();
            $tmp['msg'] = "OK";
        } else {
            $tmp['msg'] = "No subscriptions for user.";
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['msg'] = $this->db->errorInfo()[2];
        }
        return $tmp;
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
            $tmp['msg'] = 'OK';
        } else {
            $tmp['msg'] = 'Could not update playlist data.';
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

        if ($sth->rowCount() > 0) {
            $tmp['msg'] = 'OK';
        } else {
            $tmp['msg'] = 'Could not update playlist data. ';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['msg'] = $this->db->errorInfo()[2];
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
            $tmp['msg'] = 'OK';
        } else {
            $tmp['msg'] = 'Could not delete playlist';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['msg'] = $this->db->errorInfo()[2];
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
            $tmp['msg'] = 'OK';
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
            $tmp['msg'] = 'OK';
        } else {
            $tmp['msg'] = 'Could not subscribe to playlist';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['msg'] = $this->db->errorInfo()[2];
        }

        return $tmp;
    }

    public function unsubscribePlaylist($data)
    {
        //Create statement and execute
        $sql = 'DELETE FROM subscription WHERE user=? AND playlist=?';
        $sth = $this->db->prepare($sql);
        $sth->execute(array($data['uid'], $data['pid']));

        //Query should return one row
        if ($sth->rowCount() == 1) {
            $tmp['msg'] = 'OK';
        } else {
            $tmp['msg'] = 'Could not unsubscribe from playlist';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['msg'] = $this->db->errorInfo()[2];
        }

        return $tmp;
    }

    public function checkSubsciption($data)
    {
        $sql = "SELECT * FROM subscription WHERE user=? AND playlist=?";
        $sth = $this->db->prepare($sql);
        $sth->execute(array($data['uid'], $data['pid']));

        if ($sth->rowCount() > 0) {
            return true;
        } else {
            return false;
        }
    }

    //------------------------------SEARCH--------------------------------------
    public function searchPlaylist($data)
    {
        //Get search term with % around for likeness-search
        $searchTerm = "'%" . $data['searchTerm'] . "%'";

        //Create statement and execute
        $sql = 'SELECT * FROM playlist WHERE title LIKE ' . $searchTerm . ' OR description LIKE ' . $searchTerm . ' OR theme LIKE ' . $searchTerm . ' OR subject LIKE ' . $searchTerm;

        //Looks like this when built
        //SELECT * FROM video WHERE title LIKE '%x%' OR description LIKE '%x%' OR theme LIKE '%x%' OR subject LIKE '%x%'

        //Prepare and execute
        $sth = $this->db->prepare($sql);
        $sth->execute();

        //Check that it was uploaded correctly
        if ($sth->rowCount() > 0) {
            $playlists = $sth->fetchAll();
            $playlists['msg'] = 'OK';
        } else if ($sth->rowCount() == 0) {
            $playlists['msg'] = 'No matches.';
        } else {
            $playlists['msg'] = 'Could not get searches.';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $playlists['msg'] .= $this->db->errorInfo()[2];
        }

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
