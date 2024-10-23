// script.js
import {wordList} from './words.js';  // './' is necessary for relative imports

document.addEventListener('DOMContentLoaded', () => {
    loadWordList();
    startGame();
});
document.addEventListener('keydown', handleKeyPress);


let wordLength = 5;
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

    // document.getElementById('submit-guess').disabled = false;
}

function generateSecretWord() {
    const words = [
        'schön',
        'Sonne'
    ];    
    let word = words[Math.floor(Math.random() * words.length)];
    wordLength = word.length;
    word = word.toLowerCase()
    return word;
}

function submitGuess() {
    if (currentGuess.length !== wordLength) {
        alert('Guess length must be ' + wordLength + ' letters.');
        return;
    }

    if (!checkWordInFile(currentGuess)) {
        alert('Ist kein wort');
        return;
    }

    const row = document.getElementsByClassName('grid-row')[currentAttempt];
    const tiles = row.getElementsByClassName('tile');

    let secretWordCopy = secretWord.split('');  // Copy of secret word to mark used letters
    let guessStatus = Array(currentGuess.length).fill('');  // Status for each letter in the guess

    // First pass: Mark correct letters
    for (let i = 0; i < currentGuess.length; i++) {
        tiles[i].textContent = currentGuess[i];
        if (currentGuess[i] === secretWord[i]) {
            tiles[i].classList.add('correct');
            updateKeyboard(currentGuess[i], 'correct');
            guessStatus[i] = 'correct';
            secretWordCopy[i] = null;  // Mark this letter as "used"
        }
    }

    // Second pass: Mark present and absent letters
    for (let i = 0; i < currentGuess.length; i++) {
        if (guessStatus[i] === '') {  // Skip already correct letters
            if (secretWordCopy.includes(currentGuess[i])) {
                tiles[i].classList.add('present');
                updateKeyboard(currentGuess[i], 'present');
                guessStatus[i] = 'present';

                // Mark the first occurrence of this letter as used
                secretWordCopy[secretWordCopy.indexOf(currentGuess[i])] = null;
            } else {
                tiles[i].classList.add('absent');
                updateKeyboard(currentGuess[i], 'absent');
                guessStatus[i] = 'absent';
            }
        }
    }


    currentAttempt++;
    if (currentGuess === secretWord) {
        endGame();
    } else if (currentAttempt === maxAttempts) {
        alert(`Game over! Das Wort war: ${secretWord}`);
        endGame();
    }

    currentGuess = '';
    currentTileIndex = 0;
}


function updateKeyboard(letter, status) {
    const key = document.getElementById(`key-${letter}`);
    if (key) {
        key.className = `key ${status}`;
    }
}

function createKeyboard() {
    const keyboardContainer = document.getElementById('keyboard');
    const letters = 'qwertzuiopüasdfghjklöäyxcvbnm';

    for (let i = 0; i < letters.length; i++) {
        const key = document.createElement('div');
        key.className = 'key';
        key.id = `key-${letters[i]}`;
        key.textContent = letters[i];
         // Add click event listener
        key.addEventListener('click', () => {
            handleKey(key.textContent);
        });
        keyboardContainer.appendChild(key);
    }
    const key = document.createElement('div');
    key.className = 'enter';
    key.id = `enter`;
    key.textContent = 'enter';
     // Add click event listener
    key.addEventListener('click', () => {
        handleKey(key.textContent);
    });
    keyboardContainer.appendChild(key);
}

function handleKeyPress(event) {
    const key = event.key.toLowerCase();
    handleKey(key);
}

function handleKey(key){
    if (/^[a-züäö]$/.test(key) && currentTileIndex < wordLength) {
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
    // document.getElementById('submit-guess').disabled = true;
    document.removeEventListener('keydown', handleKeyPress);
}

function checkWordInFile(word) {
    console.log("checking word:", word)
    const isInFile = sortedWords.includes(word.toLowerCase());// Output: true/false
    console.log("checking result:", isInFile)
    return isInFile;
}


let sortedWords = [];

function loadWordList() {
    sortedWords = wordList.words.map(word => word.toLowerCase());
}
