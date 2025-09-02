CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  password VARCHAR(255),
  puzzle1_completed BOOLEAN DEFAULT FALSE,
  puzzle2_completed BOOLEAN DEFAULT FALSE,
  puzzle3_completed BOOLEAN DEFAULT FALSE
);