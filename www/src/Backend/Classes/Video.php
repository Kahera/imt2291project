<?php
require_once "DB.php";

class Video
{
    public $db = null;

    public function __construct($db)
    {
        $this->db = $db;
    }

    //------------------------------CRUD--------------------------------------
    public function addVideo($data)
    {
        $tmp = [];
        if (is_uploaded_file($_FILES['videofile']['tmp_name'])) {
            // Create data array to send to database
            $sqlData = array($data['owner'], $data['title'], $data['description'], $data['lecturer'], $data['theme'], $data['subject']);

            //Insert initial values
            $sql = 'INSERT INTO video (ownerid, title, description, lecturer, theme, subject, videofile, vmime, vsize';
            $sqlValues = ') VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?';

            //Get files
            $videofile = file_get_contents($_FILES['videofile']['tmp_name']);
            $vsize = $_FILES['videofile']['size'];
            $vmime = $_FILES['videofile']['type'];
            array_push($sqlData, $videofile);
            array_push($sqlData, $vmime);
            array_push($sqlData, $vsize);

            // Optional fields
            if (is_uploaded_file($_FILES['thumbnailfile']['tmp_name'])) {
                $thumbnailfile = file_get_contents($_FILES['thumbnailfile']['tmp_name']);
                $tsize = $_FILES['thumbnailfile']['size'];
                $tmime = $_FILES['thumbnailfile']['type'];
                array_push($sqlData, $thumbnailfile);
                array_push($sqlData, $tmime);
                array_push($sqlData, $tsize);

                $sql .= ', thumbnailfile, tmime, tsize';
                $sqlValues .= ', ?, ?, ?';
            }
            if (is_uploaded_file($_FILES['subtitles']['tmp_name'])) {
                $subtitles = file_get_contents($_FILES['subtitles']['tmp_name']);
                array_push($sqlData, $subtitles);
                $sql .= ', subtitles';
                $sqlValues .= ', ?';
            }

            //Finish creating SQL statement
            $sqlValues .= ')';
            $sql .= $sqlValues;

            //Make and prepare statement for inserting
            $sth = $this->db->prepare($sql);

            //Execute statement
            $sth->execute($sqlData);

            //Unset file variables to free memory
            unset($videofile);
            unset($thumbnailfile);
            unset($subtitles);

            //Check that it was uploaded correctly
            if ($sth->rowCount() == 1) {
                $tmp['msg'] = 'OK';
            } else {
                $tmp['msg'] = "I failed.";
            }
            if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
                $tmp['msg'] = $this->db->errorInfo()[2];
            }
        } else {
            $tmp['msg'] = "Could not retrieve uploaded files. The file might be too large.";
        }
        return $tmp;
    }

    public function getVideoFileById($vid)
    {
        $sql = "SELECT videofile, vmime, vsize FROM video WHERE vid=?";
        $sth = $this->db->prepare($sql);
        $sth->execute(array($vid));

        if ($sth->rowCount() == 1) {
            $result = $sth->fetch();
            $result['msg'] = 'OK';
        } else {
            $result['msg'] = 'Could not get video';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $result['msg'] = $this->db->errorInfo()[2];
        }
        return $result;
    }


    public function getVideoInfoById($vid)
    {
        $sql = "SELECT vid, ownerid, title, description, lecturer, theme, subject, avgRating FROM video WHERE vid=?";
        $sth = $this->db->prepare($sql);
        $sth->execute(array($vid));

        if ($sth->rowCount() == 1) {
            $result = $sth->fetch();
            $result['msg'] = 'OK';
        } else {
            $result['msg'] = 'Could not get video';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $result['msg'] = $this->db->errorInfo()[2];
        }
        return $result;
    }

    public function getVideoThumbnailById($vid)
    {
        $sql = "SELECT thumbnailfile, tmime, tsize FROM video WHERE vid=?";
        $sth = $this->db->prepare($sql);
        $sth->execute(array($vid));

        if ($sth->rowCount() == 1) {
            $result = $sth->fetch();
            $result['msg'] = 'OK';
        } else {
            $result['msg'] = 'Could not get video';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $result['msg'] = $this->db->errorInfo()[2];
        }
        return $result;
    }

    public function getVideoSubtitlesById($vid)
    {
        $sql = "SELECT subtitles FROM video WHERE vid=?";
        $sth = $this->db->prepare($sql);
        $sth->execute(array($vid));

        if ($sth->rowCount() == 1) {
            $result = $sth->fetch();
            $result['msg'] = 'OK';
        } else {
            $result['msg'] = 'Could not get video';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $result['msg'] = $this->db->errorInfo()[2];
        }
        return $result;
    }

    public function getVideosInfo()
    {
        $sql = 'SELECT vid, title, description, lecturer, theme, subject, avgRating FROM video';
        $sth = $this->db->prepare($sql);
        $sth->execute();

        if ($sth->rowCount() > 0) {
            $results = $sth->fetchAll();
            $results['msg'] = "OK";
        } else {
            $results['msg'] = "No videos to get.";
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $results['msg'] = $this->db->errorInfo()[2];
        }
        return $results;
    }

    public function getVideosByOwner($uid)
    {
        //Make and prepare statement
        $sql = 'SELECT vid, title, description, lecturer, theme, subject, avgRating FROM video WHERE ownerid=?';
        $sth = $this->db->prepare($sql);

        //Execute statement
        $sth->execute(array($uid));

        //Check
        if ($sth->rowCount() > 0) {
            $results = $sth->fetchAll();
            $results['msg'] = "OK";
        } else {
            $results['msg'] = "No videos to get.";
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $results['msg'] = $this->db->errorInfo()[2];
        }
        return $results;
    }

    public function getVideosByPlaylist($pid)
    {
        //Make and prepare statement
        $sql = 'SELECT video.vid, ownerid, title, description, lecturer, theme, subject, avgRating FROM video INNER JOIN playlistVideo ON video.vid = playlistVideo.vid WHERE playlistVideo.pid=? ORDER BY position';
        $sth = $this->db->prepare($sql);

        //Execute statement
        $sth->execute(array($pid));

        //Check
        if ($sth->rowCount() > 0) {
            $results = $sth->fetchAll();
            $results['msg'] = "OK";
        } else {
            $results['msg'] = "No videos to get.";
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $results['msg'] = $this->db->errorInfo()[2];
        }
        return $results;
    }

    public function getVideosBySubscription($uid)
    {
        //Make and prepare statement
        $sql = 'SELECT video.title, video.description, video.lecturer, video.theme, video.subject, video.avgRating FROM video INNER JOIN playlistVideo ON video.vid = playlistVideo.vid INNER JOIN subscription ON subscription.playlist = playlistVideo.pid WHERE subscription.user=?';
        $sth = $this->db->prepare($sql);

        //Execute statement
        $sth->execute(array($uid));

        //Check
        if ($sth->rowCount() > 0) {
            $results = $sth->fetchAll();
            $results['msg'] = "OK";
        } else {
            $results['msg'] = "No videos to get.";
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $results['msg'] = $this->db->errorInfo()[2];
        }
        return $results;
    }


    public function updateVideo($data)
    {
        //Make and prepare statement for inserting
        $sql = "UPDATE video SET ";
        $sqlArray = array();
        $sqlData = array();

        // Check which fields are set and add to SQL and array
        if (isset($data['title'])) {
            array_push($sqlArray, 'title=?');
            array_push($sqlData, $data['title']);
        }
        if (isset($data['description'])) {
            array_push($sqlArray, 'description=?');
            array_push($sqlData, $data['description']);
        }
        if (isset($data['lecturer'])) {
            array_push($sqlArray, 'lecturer=?');
            array_push($sqlData, $data['lecturer']);
        }
        if (isset($data['theme'])) {
            array_push($sqlArray, 'theme=?');
            array_push($sqlData, $data['theme']);
        }
        if (isset($data['subject'])) {
            array_push($sqlArray, 'subject=?');
            array_push($sqlData, $data['subject']);
        }
        if (is_uploaded_file($_FILES['thumbnailfile']['tmp_name'])) {
            $thumbnailfile = file_get_contents($_FILES['thumbnailfile']['tmp_name']);
            $tsize = $_FILES['thumbnailfile']['size'];
            $tmime = $_FILES['thumbnailfile']['type'];
            array_push($sqlData, $thumbnailfile);
            array_push($sqlData, $tmime);
            array_push($sqlData, $tsize);

            array_push($sqlArray, 'thumbnailfile=?');
            array_push($sqlArray, 'tmime=?');
            array_push($sqlArray, 'tsize=?');
        }
        if (is_uploaded_file($_FILES['subtitles']['tmp_name'])) {
            $subtitles = file_get_contents($_FILES['subtitles']['tmp_name']);
            array_push($sqlData, $subtitles);
            array_push($sqlArray, 'subtitles=?');
        }

        $sql .= implode(", ", $sqlArray);
        array_push($sqlData, $data['vid']);

        //Finish creating SQL statement and prepare
        $sql .= "WHERE vid=?";
        $sth = $this->db->prepare($sql);

        //Execute statement
        $sth->execute($sqlData);

        //Check that it was uploaded correctly
        if ($sth->rowCount() == 1) {
            $tmp['msg'] = 'OK';
        } else {
            $tmp['msg'] = 'Could not update video data';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['msg'] = $this->db->errorInfo()[2];
        }

        return $tmp;
    }

    public function deleteVideo($vid)
    {
        //Prepare and execute SQL
        $sql = 'DELETE FROM video WHERE vid =?';
        $sth = $this->db->prepare($sql);
        $sth->execute(array($vid));

        //Check that it's actually removed
        if ($sth->rowCount() == 1) {
            $tmp['msg'] = 'OK';
        } else {
            $tmp['msg'] = 'Could not delete user';
            $tmp['msg'] = $sth->errorInfo();
        }
        return $tmp;
    }

    //-----------------------------RATING------------------------------------

    //- - - - main rating function - - - - 
    /**
     * @param Array data must contain 
     * @param Int vid: the ID of the video that is rated
     * @param Int uid: the ID of the user that is rating
     * @param Int rating: the rating that is given
     */
    public function rateVideo($data)
    {
        echo "uid: " . $data['uid'] . "    vid: " . $data['vid'];

        //Check if user has already rated this video
        //Make and prepare statement for inserting
        $sql = "SELECT * FROM videoRating WHERE user=? AND video=?";
        $sth = $this->db->prepare($sql);

        //Execute statement
        $sth->execute(array($data['uid'], $data['vid']));

        //Check if vote is given already or not
        //Already rated: update existing
        if ($sth->rowCount() >= 1) {
            //Get old raing
            $usersOldRating = $sth->fetch();

            //Only do something if the ratings are different
            if ($usersOldRating['rating'] != $data['rating']) {
                //Get video
                $videoRatings = $this->getVideoRatings($data);

                //Update rating via utility function
                $tmp = $this->updateRating($data, $videoRatings, $usersOldRating['rating']);
            }

            //Not already rated: insert rating
        } else {
            //Get video
            $video = $this->getVideoRatings($data);

            //Update rating via utility function
            $tmp = $this->newRating($data, $video);
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['errorMessage'] = $this->db->errorInfo()[2];
        }
        return $tmp;
    }

    // - - - - Utility rating functions - - - -
    /**
     * Utility function for adding a new rating
     * @param Array data: must contain vid, uid and rating
     * @param Array video: must contain video object
     */
    private function newRating($data, $video)
    {
        //Make and prepare statement for inserting new rating in videoRating
        $sql = 'INSERT INTO videoRating (video, user, rating) VALUES (?, ?, ?)';
        $sth = $this->db->prepare($sql);

        //Execute statement
        $sth->execute(array($data['vid'], $data['uid'], $data['rating']));

        //Check that it was uploaded correctly
        if ($sth->rowCount() == 1) {
            $tmp['status'] = 'OK';
        } else {
            $tmp['status'] = 'FAIL';
            $tmp['errorMessage'] = 'Could not add new rating';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['errorMessage'] = $this->db->errorInfo()[2];
        }

        //Calculate new values
        $newNoVotes = $video['noVotes'] + 1;
        $oldTotalRating = $video['noVotes'] * $video['avgRating'];
        $newTotalRating = $oldTotalRating + $data['rating'];
        $newAvgRating = $newTotalRating / $newNoVotes;

        //Make and prepare statement for updating video
        $sql = 'UPDATE video SET avgRating=?, noVotes=? WHERE vid=?';
        $sth = $this->db->prepare($sql);

        //Execute statement
        $sth->execute(array($newAvgRating, $newNoVotes, $data['vid']));

        //Check that it was uploaded correctly
        if ($sth->rowCount() == 1) {
            $tmp['status'] = 'OK';
        } else {
            $tmp['status'] = 'FAIL';
            $tmp['errorMessage'] = 'Could not add new rating';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['errorMessage'] = $this->db->errorInfo()[2];
        }

        return $tmp;
    }

    /**
     * Utility function for updating existing rating
     * @param Array data: must contain vid, uid and rating
     * @param Array video: must contain video object
     * @param Array oldVote: must contain videoRating
     */
    private function updateRating($data, $videoRatings, $usersOldRating)
    {
        //Get old total rating
        $oldTotalRating = $videoRatings['avgRating'] * $videoRatings['noVotes'];

        //Calculate new total rating
        $oldTotalRating -= $usersOldRating;
        if ($oldTotalRating < 0) {
            $oldTotalRating = 0;
        }

        $newTotalRating = $oldTotalRating + $data['rating'];

        //Calculate new avg
        if ($videoRatings['noVotes'] <= 0) {
            $newAvgRating = $newTotalRating;
        } else {
            $newAvgRating = $newTotalRating / $videoRatings['noVotes'];
        }

        //Push new info to database
        //Update users videoRatings first
        $sql = "UPDATE videoRating SET rating=? WHERE video=? AND user=?";
        $sth = $this->db->prepare($sql);

        $sth->execute(array($data['rating'], $data['vid'], $data['uid']));

        //Check that it's actually updated
        if ($sth->rowCount() == 1) {
            $tmp['status'] = 'OK';
        } else {
            $tmp['status'] = 'FAIL';
            $tmp['errorMessage'] = 'Could not update rating';
            $tmp['errorInfo'] = $sth->errorInfo();
        }

        //Then update video
        $sql = "UPDATE video SET avgRating=? WHERE vid=?";
        $sth = $this->db->prepare($sql);

        $sth->execute(array($newAvgRating, $data['vid']));

        //Check that it's actually updated
        if ($sth->rowCount() == 1) {
            $tmp['status'] = 'OK';
        } else {
            $tmp['status'] = 'FAIL';
            $tmp['errorMessage'] = 'Could not update video';
            $tmp['errorInfo'] = $sth->errorInfo();
        }
        return $tmp;
    }

    /**
     * Utility function for getting existing rating on a video
     * @param Array data: must contain vid
     */
    private function getVideoRatings($data)
    {
        //Get video - this is needed for both updating and inserting new
        $sql = "SELECT avgRating, noVotes FROM video WHERE vid=?";
        $sth = $this->db->prepare($sql);
        $sth->execute(array($data['vid']));

        //Check that it was gotten correctly
        if ($sth->rowCount() == 1) {
            //Get old score and return
            $video = $sth->fetch(PDO::FETCH_ASSOC);
            return $video;

            //Couldn't get correctly: error
        } else {
            $tmp['status'] = 'FAIL';
            $tmp['errorMessage'] = 'Could not get old rating';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['errorMessage'] = $this->db->errorInfo()[2];
        }
        return $tmp;
    }

    public function getVideoAvgRating($data)
    {
        //Get video - this is needed for both updating and inserting new
        $sql = "SELECT avgRating FROM video WHERE vid=?";
        $sth = $this->db->prepare($sql);
        $sth->execute(array($data['vid']));

        //Check that it was gotten correctly
        if ($sth->rowCount() == 1) {
            //Get old score and return
            $videoRating = $sth->fetch(PDO::FETCH_ASSOC);
            return $videoRating;

            //Couldn't get correctly: error
        } else {
            $tmp['status'] = 'FAIL';
            $tmp['errorMessage'] = 'Could not get old rating';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['errorMessage'] = $this->db->errorInfo()[2];
        }
        return $tmp;
    }

    //-----------------------------COMMENTS------------------------------------
    public function newComment($data)
    {
        //Make and prepare statement
        $sql = 'INSERT INTO videoComment (video, user, comment) VALUES (?, ?, ?)';
        $sth = $this->db->prepare($sql);

        //Execute statement
        $sth->execute(array($data['video'], $_SESSION['uid'], $data['comment']));

        //Check that it was uploaded correctly
        if ($sth->rowCount() == 1) {
            $tmp['msg'] = 'OK';
        } else {
            $tmp['msg'] = 'Could not add new comment';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['msg'] .= $this->db->errorInfo()[2];
        }
        return $tmp;
    }

    public function getComments($vid)
    {
        //Make and prepare statement
        $sql = 'SELECT user, comment, user.email FROM videoComment INNER JOIN user ON videoComment.user = user.uid WHERE video=?';
        $sth = $this->db->prepare($sql);

        //Execute statement
        $sth->execute(array($vid));

        //Check that it was uploaded correctly
        if ($sth->rowCount() > 0) {
            $tmp = $sth->fetchAll();
            $tmp['msg'] = 'OK';
        } else if ($sth->rowCount() == 0) {
            $tmp['msg'] = 'No comments yet.';
        } else {
            $tmp['msg'] = 'Could not get comments.';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $tmp['msg'] .= $this->db->errorInfo()[2];
        }

        return $tmp;
    }

    //-----------------------------SEARCH------------------------------------
    public function searchVideo($data)
    {
        //Get search term with % around for likeness-search
        $searchTerm = "'%" . $data['searchTerm'] . "%'";

        //Create statement and execute
        $sql = 'SELECT vid, title, description, lecturer, theme, subject, avgRating FROM video WHERE title LIKE ' . $searchTerm . ' OR description LIKE ' . $searchTerm . ' OR lecturer LIKE ' . $searchTerm . ' OR theme LIKE ' . $searchTerm . ' OR subject LIKE ' . $searchTerm;

        //Looks like this when built
        //SELECT * FROM video WHERE title LIKE '%x%' OR description LIKE '%x%' OR lecturer LIKE '%x%' OR theme LIKE '%x%' OR subject LIKE '%x%'

        //Prepare and execute
        $sth = $this->db->prepare($sql);
        $sth->execute();

        //Check that it was uploaded correctly
        if ($sth->rowCount() > 0) {
            $videos = $sth->fetchAll();
            $videos['msg'] = 'OK';
        } else if ($sth->rowCount() == 0) {
            $videos['msg'] = 'No matches.';
        } else {
            $videos['msg'] = 'Could not get searches.';
        }
        if ($this->db->errorInfo()[1] != 0) { // Error in SQL?
            $videos['msg'] .= $this->db->errorInfo()[2];
        }

        return $videos;
    }
}
