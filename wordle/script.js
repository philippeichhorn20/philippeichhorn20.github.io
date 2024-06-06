// script.js
document.addEventListener('DOMContentLoaded', startGame);
document.addEventListener('keydown', handleKeyPress);

wordLength = 5;
const maxAttempts = 5;
let secretWord = '';
let currentAttempt = 0;
let currentGuess = '';
let currentTileIndex = 0;
let totalWordCount = 15300;

function startGame() {
    secretWord = generateSecretWord();
    currentAttempt = 0;
    currentGuess = '';
    currentTileIndex = 0;
    document.getElementById('game-board').innerHTML = '';
    document.getElementById('keyboard').innerHTML = '';
    createKeyboard();

    for (let i = 0; i < maxAttempts; i++) {
        const row = document.createElement('div');
        row.className = 'grid-row';
        for (let j = 0; j < wordLength; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            row.appendChild(tile);
        }
        document.getElementById('game-board').appendChild(row);
    }

    document.getElementById('submit-guess').disabled = false;
}

function generateSecretWord() {
    const words = [
        'Apfel',
        'Banane',
        'Kartoffel',
        'Tomate',
        'Gurke',
        'Tisch',
        'Stuhl',
        'Fenster',
        'Tür',
        'Hund',
        'Katze',
        'Maus',
        'Elefant',
        'Löwe',
        'Tiger',
        'Fisch',
        'Vogel',
        'Fliege',
        'Schlange',
        'Spinne',
        'Biene',
        'Wolke',
        'Sonne',
        'Regen',
        'rennen',
        'springen',
        'spielen',
        'tanzen',
        'fliegen',
        'schwimmen',
        'kochen',
        'lachen',
        'weinen',
        'trinken',
        'essen',
        'fröhlich',
        'traurig',
        'glücklich',
        'müde',
        'schnell',
        'langsam',
        'hell',
        'dunkel',
        'groß',
        'klein',
        'dick',
        'dünn',
        'schön',
        'hässlich'
    ];    word = words[Math.floor(Math.random() * words.length)];
    wordLength = word.length;
    return word;
}

function submitGuess() {
    if (currentGuess.length !== wordLength) {
        alert('Guess length must be 5 letters.');
        return;
    }if(!checkWordInFile(currentGuess)){
        alert('Ist kein wort');
        return;
    }

    const row = document.getElementsByClassName('grid-row')[currentAttempt];
    const tiles = row.getElementsByClassName('tile');
    const keyboardKeys = document.getElementsByClassName('key');

    for (let i = 0; i < currentGuess.length; i++) {
        tiles[i].textContent = currentGuess[i];
        if (currentGuess[i] === secretWord[i]) {
            tiles[i].classList.add('correct');
            updateKeyboard(currentGuess[i], 'correct');
        } else if (secretWord.includes(currentGuess[i])) {
            tiles[i].classList.add('present');
            updateKeyboard(currentGuess[i], 'present');
        } else {
            tiles[i].classList.add('absent');
            updateKeyboard(currentGuess[i], 'absent');
        }
    }

    currentAttempt++;
    currentGuess = '';
    currentTileIndex = 0;

    if (currentGuess === secretWord) {
        alert('Congratulations! You guessed the word!');
        endGame();
    } else if (currentAttempt === maxAttempts) {
        alert(`Game over! The word was: ${secretWord}`);
        endGame();
    }
}

function updateKeyboard(letter, status) {
    const key = document.getElementById(`key-${letter}`);
    if (key) {
        key.className = `key ${status}`;
    }
}

function createKeyboard() {
    const keyboardContainer = document.getElementById('keyboard');
    const letters = 'abcdefghijklmnopqrstuvwxyz';

    for (let i = 0; i < letters.length; i++) {
        const key = document.createElement('div');
        key.className = 'key';
        key.id = `key-${letters[i]}`;
        key.textContent = letters[i];
        keyboardContainer.appendChild(key);
    }
}

function handleKeyPress(event) {
    const key = event.key.toLowerCase();
    if (/^[a-z]$/.test(key) && currentTileIndex < wordLength) {
        const row = document.getElementsByClassName('grid-row')[currentAttempt];
        const tile = row.getElementsByClassName('tile')[currentTileIndex];
        tile.textContent = key;
        currentGuess += key;
        currentTileIndex++;
    } else if (key === 'backspace' && currentTileIndex > 0) {
        currentTileIndex--;
        const row = document.getElementsByClassName('grid-row')[currentAttempt];
        const tile = row.getElementsByClassName('tile')[currentTileIndex];
        tile.textContent = '';
        currentGuess = currentGuess.slice(0, -1);
    }else if (key === 'enter') {
        submitGuess();
    }
}

function endGame() {
    document.getElementById('submit-guess').disabled = true;
    document.removeEventListener('keydown', handleKeyPress);
}

function checkWordInFile(word) {
    // Send an AJAX request to load the file content
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'sorted_words.txt', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                // File content loaded successfully
                const fileContent = xhr.responseText;
                const sortedWords = fileContent.split('\n');

                // Perform a linear search to check if the word exists
                const wordFound = sortedWords.includes(word);
                console.log(`The word '${word}' is ${wordFound ? 'found' : 'not found'} in the file.`);
            } else {
                console.error('Failed to load file.');
            }
        }
    };
    xhr.send();
}