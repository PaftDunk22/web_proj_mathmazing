CREATE TABLE puzzles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    type VARCHAR(20) NOT NULL,
    solution VARCHAR(255) NOT NULL 
);

INSERT INTO puzzles (name, solution)
VALUES ('Max Product Puzzle', '[[6,3,1,5,4,2],[5,4,2,6,3,1]]');

INSERT INTO puzzles (name, solution)
VALUES (
  'Magic Square Puzzle',
  '[[4,9,2,3,5,7,8,1,6],[2,7,6,9,5,1,4,3,8],[6,1,8,7,5,3,2,9,4],[8,3,4,1,5,9,6,7,2],[2,9,4,7,5,3,6,1,8],[4,3,8,9,5,1,2,7,6],[6,7,2,1,5,9,8,3,4],[8,1,6,3,5,7,4,9,2]]'
);

INSERT INTO puzzles (name, solution)
VALUES ('Fibonacci Puzzle', '[1,1,2,3,5,8,13,21,34]');

