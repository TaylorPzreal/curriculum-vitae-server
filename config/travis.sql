#  - mysql -e 'CREATE DATABASE IF NOT EXISTS honeymorning DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci'
#  - mysql -e 'USE honeymorning'
#  - mysql -e 'CREATE TABLE IF NOT EXISTS blog ( id int(11) NOT NULL, titleId VARCHAR(45) DEFAULT NULL, title VARCHAR(255) DEFAULT NULL, author VARCHAR(45) DEFAULT NULL, logo VARCHAR(255) DEFAULT NULL, visites INT(11) DEFAULT NULL, detail MEDIUMTEXT DEFAULT NULL)'
#  - mysql -e 'ALTER TABLE blog ADD PRIMARY KEY (id)' 
#  - mysql -e 'ALTER TABLE blog MODIFY id INT(11) NOT NULL AUTO_INCREMENT'

# Create database
CREATE DATABASE IF NOT EXISTS honeymorning DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE honeymorning;

CREATE TABLE IF NOT EXISTS blog ( id int(11) NOT NULL, titleId VARCHAR(45) DEFAULT NULL, title VARCHAR(255) DEFAULT NULL, author VARCHAR(45) DEFAULT NULL, logo VARCHAR(255) DEFAULT NULL, visites INT(11) DEFAULT NULL, detail MEDIUMTEXT DEFAULT NULL);
