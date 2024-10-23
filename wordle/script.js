// script.js
import wordList from './words.js';  // './' is necessary for relative imports

document.addEventListener('DOMContentLoaded', () => {
    loadWordList().then(startGame);
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
        alert('Guess length must be ' + wordLength + ' letters.');
        return;
    }

    if (!checkWordInFile(currentGuess)) {
        alert('Ist kein wort');
        return;
    }

    const row = document.getElementsByClassName('grid-row')[currentAttempt];
    const tiles = row.getElementsByClassName('tile');

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
    if (currentGuess === secretWord) {
        alert('Congratulations! You guessed the word!');
        endGame();
    } else if (currentAttempt === maxAttempts) {
        alert(`Game over! The word was: ${secretWord}`);
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
    document.getElementById('submit-guess').disabled = true;
    document.removeEventListener('keydown', handleKeyPress);
}

function checkWordInFile(word) {
    console.log("checking word:", word)
    loadWordList()
    const isInFile = sortedWords.includes(word.toLowerCase());// Output: true/false
    console.log("checking result:", isInFile)
    return isInFile;
}


let sortedWords = [];

function loadWordList() {
    sortedWords= wordList.words;
}
