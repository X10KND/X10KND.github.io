let range = [];
let currentIndex = 0;

document.getElementById('generate').addEventListener('click', () => {
    const min = parseInt(document.getElementById('min').value);
    const max = parseInt(document.getElementById('max').value);
    const display = document.getElementById('number-display');

    if (isNaN(min) || isNaN(max) || min >= max) {
        alert('Please enter valid min and max values (min < max)');
        return;
    }

    if (range.length === 0) {
        // Initialize range
        range = [];
        for (let i = min; i <= max; i++) {
            range.push(i);
        }

        // Shuffle the array using Fisher-Yates algorithm
        for (let i = range.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [range[i], range[j]] = [range[j], range[i]];
        }

        currentIndex = 0;
    }

    if (currentIndex < range.length) {
        display.textContent = range[currentIndex];
        currentIndex++;
    } else {
        alert('All numbers have been generated. Please reset to start over.');
    }
});

document.getElementById('reset').addEventListener('click', () => {
    range = [];
    currentIndex = 0;
    document.getElementById('number-display').textContent = '-';
    document.getElementById('min').value = '';
    document.getElementById('max').value = '';
});
