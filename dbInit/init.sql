/* Main tables */
CREATE TABLE `user` (
  `uid` BIGINT(8) NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(128) NOT NULL,
  `password` VARCHAR(128) NOT NULL,
  `userType` ENUM('admin', 'teacher', 'student') DEFAULT "student" NOT NULL,
  `validated` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`uid`)
) ENGINE = InnoDB CHARSET = utf8 COLLATE utf8_bin;

CREATE TABLE `video` (
  `vid` BIGINT(8) NOT NULL AUTO_INCREMENT,
  `ownerid` BIGINT(8),
  `title` VARCHAR(64) NOT NULL,
  `description` VARCHAR(64) NOT NULL,
  `lecturer` VARCHAR(64) NOT NULL, 
  `theme` VARCHAR(64) NOT NULL,
  `subject` VARCHAR(64) NOT NULL,
  `avgRating` int NOT NULL DEFAULT 0,
  `noVotes` int NOT NULL DEFAULT 0,
  `videofile` LONGBLOB NOT NULL,
  `vmime` VARCHAR(16) NOT NULL,
  `vsize` int NOT NULL,
  `thumbnailfile` LONGBLOB,
  `tmime` VARCHAR(16),
  `tsize` int,
  `subtitles` text DEFAULT NULL,
  PRIMARY KEY (`vid`), 
  FOREIGN KEY (`ownerid`) REFERENCES user(`uid`) ON DELETE SET NULL
) ENGINE = InnoDB CHARSET = utf8 COLLATE utf8_bin;

CREATE TABLE `playlist` (
`pid` BIGINT(8) NOT NULL AUTO_INCREMENT,
`ownerid` BIGINT(8) NOT NULL,
`subject` VARCHAR(64) NOT NULL,
`title` VARCHAR(64) NOT NULL,
`theme` VARCHAR(64) NOT NULL,
`description` VARCHAR(64) NOT NULL,
PRIMARY KEY (`pid`),
FOREIGN KEY (`ownerid`) REFERENCES user(`uid`)
) ENGINE = InnoDB CHARSET = utf8 COLLATE utf8_bin;

/* Extra video tables */
CREATE TABLE `videoRating` (
`video` BIGINT(8) NOT NULL,
`user` BIGINT(8),
`rating` TINYINT(1),
FOREIGN KEY (`user`) REFERENCES user(`uid`) ON DELETE SET NULL,
FOREIGN KEY(`video`) REFERENCES video(`vid`) ON DELETE CASCADE
) ENGINE = InnoDB CHARSET = utf8 COLLATE utf8_bin;

CREATE TABLE `videoComment` (
`cid` BIGINT(8) NOT NULL AUTO_INCREMENT,
`video` BIGINT(8) NOT NULL,
`user` BIGINT(8),
`comment` VARCHAR(20000),
PRIMARY KEY (`cid`),
FOREIGN KEY (`user`) REFERENCES user(`uid`) ON DELETE SET NULL,
FOREIGN KEY(`video`) REFERENCES video(`vid`) ON DELETE CASCADE
) ENGINE = InnoDB CHARSET = utf8 COLLATE utf8_bin;

/* Extra playlist tables */
CREATE TABLE `playlistVideo` (
`pid` BIGINT(8) NOT NULL,
`vid` BIGINT(8) NOT NULL, 
`position` BIGINT(8) NOT NULL,
PRIMARY KEY (`pid`, `vid`), 
FOREIGN KEY (`pid`) REFERENCES playlist(`pid`) ON DELETE CASCADE,
FOREIGN KEY (`vid`) REFERENCES video(`vid`) ON DELETE CASCADE
) ENGINE = InnoDB CHARSET = utf8 COLLATE utf8_bin;

CREATE TABLE `subscription` (
`playlist` BIGINT(8) NOT NULL,
`user` BIGINT(8) NOT NULL,
FOREIGN KEY (`user`) REFERENCES user(`uid`) ON DELETE CASCADE,
FOREIGN KEY(`playlist`) REFERENCES playlist(`pid`) ON DELETE CASCADE
) ENGINE = InnoDB CHARSET = utf8 COLLATE utf8_bin;

/* Insert an admin user */
INSERT INTO user (email, password, userType, validated) VALUES 
('admin@admin.no', '$2y$10$Jjj1AJlo6vgSL8npLxqcNO2NZXAvB4FWujQ7NYQ3pugvVXzAGxegy', 'admin', 1), 
('teacher@teacher.no', '$2y$10$Jjj1AJlo6vgSL8npLxqcNO2NZXAvB4FWujQ7NYQ3pugvVXzAGxegy', 'teacher', 1), 
('teacher2@teacher.no', '$2y$10$Jjj1AJlo6vgSL8npLxqcNO2NZXAvB4FWujQ7NYQ3pugvVXzAGxegy', 'teacher', 0), 
('student@student.no', '$2y$10$Jjj1AJlo6vgSL8npLxqcNO2NZXAvB4FWujQ7NYQ3pugvVXzAGxegy', 'student', 0);