const express = require('express');
const router = express.Router();
const dbConnection = require('../dbConnection');

router.get('/status', (req, res) => {
    const userId = req.session.userId;
    if (!userId) return res.status(401).send('Not logged in');

    dbConnection.query(
        'SELECT puzzle1_completed, puzzle2_completed, puzzle3_completed FROM users WHERE id = ?',
        [userId],
        (err, results) => {
            if (err) return res.status(500).send('Database error');
            if (results.length === 0) return res.status(404).send('User not found');

            res.json(results[0]);
        }
    );
});

router.get('/:id', (req, res) => {
    const puzzleId = req.params.id;

    dbConnection.query(
        'SELECT id, name, solution FROM puzzles WHERE id = ?',
        [puzzleId],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Puzzle not found' });
            }

            const puzzle = {
                id: results[0].id,
                name: results[0].name,
                solution: results[0].solution
            };
            res.json(puzzle);
        }
    );
});


router.post('/attempt', (req, res) => {
    const { puzzleId, answer } = req.body;
    const userId = req.session.userId;

    if (!userId) return res.status(401).send('Please log in to submit puzzles.');

    dbConnection.query(
        'SELECT solution FROM puzzles WHERE id = ?',
        [puzzleId],
        (err, results) => {
            if (err) return res.status(500).send('Database error');
            if (results.length === 0) return res.status(404).send('Puzzle not found');

            const correctSolution = results[0].solution;

            if (answer === correctSolution) {
                dbConnection.query(
                    `UPDATE users SET puzzle${puzzleId}_completed = TRUE WHERE id = ?`,
                    [userId],
                    (updateErr) => {
                        if (updateErr) return res.status(500).send('Database error');
                        res.send({ success: true, message: 'Correct!' });
                    }
                );
            } else {
                res.send({ success: false, message: 'Try again!' });
            }
        }
    );
});

router.post('/complete', (req, res) => {
    const userId = req.session.userId;
    const { puzzleId } = req.body;

    if (!userId) return res.status(401).json({ error: 'Not logged in' });

    dbConnection.query(
        `UPDATE users SET puzzle${puzzleId}_completed = TRUE WHERE id = ?`,
        [userId],
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ success: true });
        }
    );
});


module.exports = router;
