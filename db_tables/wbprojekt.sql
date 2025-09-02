CREATE USER 'admin'@'localhost' IDENTIFIED BY 'admin';
CREATE DATABASE wbprojekt;
GRANT ALL PRIVILEGES ON wbprojekt.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;