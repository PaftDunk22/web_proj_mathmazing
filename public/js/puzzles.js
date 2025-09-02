let puzzle1_done = false;
let puzzle2_done = false;
let puzzle3_done = false;

async function getPuzzleSolution(puzzleId) {
    const res = await fetch(`/puzzles/${puzzleId}`);
    const puzzle = await res.json();
    return JSON.parse(puzzle.solution);
}

let p1_solution, magic_solutions, fib_solution;

Promise.all([
  getPuzzleSolution(1),
  getPuzzleSolution(2),
  getPuzzleSolution(3)
]).then(([p1, magic, fib]) => {
  p1_solution = p1;
  magic_solutions = magic;
  fib_solution = fib;
});


function markPuzzleCompleted(puzzleId) {
    fetch('/puzzles/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ puzzleId })
    }).then(res => res.json())
      .then(data => {
          if (!data.success) console.error('Failed to mark puzzle as completed');
      });
}

fetch('/puzzles/status')
  .then(res => res.json())
  .then(status => {
      if (status.puzzle1_completed) {
          puzzle1_done = true;
          document.getElementById('p1-feedback').textContent = "✅ Already completed!";
      }
      if (status.puzzle2_completed) {
          puzzle2_done = true;
          document.getElementById('magic-feedback').textContent = "✅ Already completed!";
      }
      if (status.puzzle3_completed) {
          puzzle3_done = true;
          document.getElementById('fib-feedback').textContent = "✅ Already completed!";
      }
      checkCompletion();
  })
  .catch(err => console.error('Error fetching puzzle status:', err));

//puzzle1
function updateP1Result() {
    const slots = document.querySelectorAll('#p1-container .number-slot');
    const leftDigits = [...slots].slice(0,3).map(s => s.textContent !== '_' ? s.textContent : '0');
    const rightDigits = [...slots].slice(3,6).map(s => s.textContent !== '_' ? s.textContent : '0');
    const leftNum = parseInt(leftDigits.join('')) || 0;
    const rightNum = parseInt(rightDigits.join('')) || 0;

    document.getElementById('p1-result').textContent = `${leftNum} * ${rightNum} = ${leftNum * rightNum}`;

    const currentCombo = [...slots].map(s => parseInt(s.textContent) || 0);

    // Check if currentCombo matches any valid solution
    const isCorrect = p1_solution.some(sol => JSON.stringify(sol) === JSON.stringify(currentCombo));

    if (isCorrect) {
        document.getElementById('p1-feedback').textContent = "✅ Correct! Maximum product reached!";
        if (!puzzle1_done) markPuzzleCompleted(1);
        puzzle1_done = true;
        checkCompletion();
    } else {
        document.getElementById('p1-feedback').textContent = '';
        puzzle1_done = false;
    }
}

function handleP1DragAndDrop() {
    const numbers = document.querySelectorAll('#p1-numbers .number');
    const slots = document.querySelectorAll('#p1-container .number-slot');

    numbers.forEach(num => {
        num.addEventListener('dragstart', e => {
            if (!num.classList.contains('used')) {
                e.dataTransfer.setData('text/plain', e.target.textContent);
            } else {
                e.preventDefault();
            }
        });
    });

    slots.forEach(slot => {
        slot.addEventListener('dragover', e => e.preventDefault());
        slot.addEventListener('drop', e => {
            e.preventDefault();
            const value = e.dataTransfer.getData('text/plain');

            if (slot.textContent !== '_' && slot.textContent !== '') {
                const oldNum = slot.textContent;
                document.querySelectorAll('#p1-numbers .number').forEach(n => {
                    if (n.textContent === oldNum) n.classList.remove('used');
                });
            }

            slots.forEach(s => {
                if (s !== slot && s.textContent === value) s.textContent = '_';
            });

            slot.textContent = value;
            document.querySelectorAll('#p1-numbers .number').forEach(n => {
                if (n.textContent === value) n.classList.add('used');
            });

            updateP1Result();
        });

        slot.addEventListener('click', () => {
            if (slot.textContent !== '_' && slot.textContent !== '') {
                const oldNum = slot.textContent;
                slot.textContent = '_';
                document.querySelectorAll('#p1-numbers .number').forEach(n => {
                    if (n.textContent === oldNum) n.classList.remove('used');
                });
                updateP1Result();
            }
        });
    });
}

handleP1DragAndDrop();

//puzzle2

function updateMagicSquare() {
    const slots = document.querySelectorAll('#magic-square .number-slot');

    if ([...slots].some(s => s.textContent === '_' || s.textContent === '')) {
        document.getElementById('magic-feedback').textContent = '';
        puzzle2_done = false;
        return;
    }

    const current = [...slots].map(s => parseInt(s.textContent));
    const isCorrect = magic_solutions.some(sol => JSON.stringify(sol) === JSON.stringify(current));

    if (isCorrect) {
        document.getElementById('magic-feedback').textContent = "✅ Magic square completed!";
        if (!puzzle2_done) markPuzzleCompleted(2);
        puzzle2_done = true;
        checkCompletion();
    } else {
        document.getElementById('magic-feedback').textContent = '';
        puzzle2_done = false;
    }
}

function handleMagicDragAndDrop() {
    const numbers = document.querySelectorAll('#magic-numbers .number');
    const slots = document.querySelectorAll('#magic-square .number-slot');

    numbers.forEach(num => {
        num.addEventListener('dragstart', e => {
            if (!num.classList.contains('used')) {
                e.dataTransfer.setData('text/plain', e.target.textContent);
            } else {
                e.preventDefault();
            }
        });
    });

    slots.forEach(slot => {
        slot.addEventListener('dragover', e => e.preventDefault());
        slot.addEventListener('drop', e => {
            e.preventDefault();
            const value = e.dataTransfer.getData('text/plain');

            if (slot.textContent !== '_' && slot.textContent !== '') {
                const oldNum = slot.textContent;
                document.querySelectorAll('#magic-numbers .number').forEach(n => {
                    if (n.textContent === oldNum) n.classList.remove('used');
                });
            }

            slots.forEach(s => {
                if (s !== slot && s.textContent === value) s.textContent = '_';
            });

            slot.textContent = value;
            document.querySelectorAll('#magic-numbers .number').forEach(n => {
                if (n.textContent === value) n.classList.add('used');
            });

            updateMagicSquare();
        });

        slot.addEventListener('click', () => {
            if (slot.textContent !== '_' && slot.textContent !== '') {
                const oldNum = slot.textContent;
                slot.textContent = '_';
                document.querySelectorAll('#magic-numbers .number').forEach(n => {
                    if (n.textContent === oldNum) n.classList.remove('used');
                });
                updateMagicSquare();
            }
        });
    });
}

handleMagicDragAndDrop();

//puzzle3

function updateFibResult() {
    const slots = document.querySelectorAll('#fib-sequence .number-slot');
    const currentSeq = [...slots].map(s => {
        const val = s.textContent;
        return val === '_' ? 0 : parseInt(val);
    });

    if ([...slots].every(s => s.textContent !== '_')) {
        let correct = true;
        for (let i = 0; i < fib_solution.length; i++) {
            if (currentSeq[i] !== fib_solution[i]) correct = false;
        }

        if (correct) {
            document.getElementById('fib-feedback').textContent = "✅ Correct! Fibonacci sequence complete!";
            if (!puzzle3_done) markPuzzleCompleted(3);
            puzzle3_done = true;
            checkCompletion();
        } else {
            document.getElementById('fib-feedback').textContent = "❌ Not correct yet!";
            puzzle3_done = false;
        }
    } else {
        document.getElementById('fib-feedback').textContent = '';
        puzzle3_done = false;
    }
}

function handleFibDragAndDrop() {
    const numbers = document.querySelectorAll('#fib-numbers .number');
    const slots = document.querySelectorAll('#fib-sequence .number-slot');

    numbers.forEach(num => {
        num.addEventListener('dragstart', e => {
            if (!num.classList.contains('used')) {
                e.dataTransfer.setData('text/plain', e.target.textContent);
            } else {
                e.preventDefault();
            }
        });
    });

    slots.forEach(slot => {
        if (slot.textContent === '_') {
            slot.addEventListener('dragover', e => e.preventDefault());
            slot.addEventListener('drop', e => {
                e.preventDefault();
                const value = e.dataTransfer.getData('text/plain');

                slots.forEach(s => {
                    if (s !== slot && s.textContent === value) s.textContent = '_';
                });

                slot.textContent = value;
                document.querySelectorAll('#fib-numbers .number').forEach(n => {
                    if (n.textContent === value) n.classList.add('used');
                });

                updateFibResult();
            });

            slot.addEventListener('click', () => {
                if (slot.textContent !== '_' && slot.textContent !== '') {
                    const oldNum = slot.textContent;
                    slot.textContent = '_';
                    document.querySelectorAll('#fib-numbers .number').forEach(n => {
                        if (n.textContent === oldNum) n.classList.remove('used');
                    });
                    updateFibResult();
                }
            });
        }
    });
}

handleFibDragAndDrop();

function checkCompletion() {
    if (puzzle1_done && puzzle2_done && puzzle3_done) {
        const link = document.querySelector('#center-link a');
        link.className = 'unlocked-link';
        link.textContent = '🎉 Click here!';
        link.href = '/finalpage';
    }
}

