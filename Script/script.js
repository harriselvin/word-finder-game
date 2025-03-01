// Word & Hints Object
const options = {
    aroma: "A pleasing smell",
    pepper: "Salt's partner",
    halt: "put a stop to",
    jump: "Rise suddenly",
    shuffle: "Mix cards up",
    combine: "Add; Mix",
    chaos: "Total disorder",
    labyrinth: "Maze",
    disturb: "Interrupt; Upset",
    shift: "Move; Period of water",
    machine: "Device or appliance"
}

// Initial References
const container = document.querySelector('.container')
const message = document.querySelector('.guess-msg') 
const guessAmount = document.querySelector('[data-amount]')
const result = document.querySelector('.result')
const letterInput = document.querySelector('.letter')
const word = document.querySelector('.word')
const score = document.querySelector('[data-score]')
const guessBtn = document.querySelector('.btn')
const playAgainBtn = document.querySelector('.play-again')
const nextLevelBtn = document.querySelector('.next-level')
const startSec = document.querySelector('.start-sec')
const startBtn = document.querySelector('.start-game')
const backspace = document.querySelector('.backspace')
const enterKey = document.querySelector('.return')
const keypad = document.querySelectorAll('.keypad-row .num:not(.shift):not(.backspace):not(.return):not(.comma):not(.emoji):not(.dot)')
const words = Object.keys(options)
let randomWord = "",
randomHint = "";
let winCount = 0,
lossCount = 0;

// Generate random value
const generateRandomValue = (array) => Math.floor(Math.random() * array.length)

// Initial Function
const init = () => {
    winCount = 0
    lossCount = 0
    const randomIndex = generateRandomValue(words)
    randomWord = words[randomIndex]
    randomHint = options[randomWord]
    message.innerText = randomHint
    displayWord()


     // Reset keypad buttons (enable all keys)
     keypad.forEach((key) => {
        key.disabled = false;
        key.style.scale = 1;
        key.style.opacity = 1;
    });

    // Reset guess button
    guessBtn.disabled = false;
}

// Start Game
startBtn.addEventListener("click", () => {
    // startBtn.classList.add("hide")
    startSec.style.display = "none"
    
    container.style.display = "block"
    init()
})

// Generate Word Function
let currentWordState = []

const displayWord = () => {
    currentWordState = randomWord.split('').map(() => '_')
    word.innerText = currentWordState.join('')
}

const maxGuesses = 10
let remainingGuesses = maxGuesses

const nextLevels = () => {
    if (remainingGuesses > 0) {
        init()
    }
}

const playAgain = () => {
    playAgainBtn.classList.remove('hide')
    
    playAgainBtn.addEventListener('click', () => {
        playAgainBtn.classList.add('hide')
        nextLevels()
    })
}

const nextLevel = () => {
    nextLevelBtn.classList.remove('hide')
    
    nextLevelBtn.addEventListener('click', () => {
        nextLevelBtn.classList.add('hide')
        result.innerText = ''
        nextLevels()
    })
}

const addScore = () => {
    score.innerText = parseInt(score.innerText) + 1
}

// Key click events
keypad.forEach((key) => {
    key.addEventListener('click', () => {
        const keyText = key.dataset.key || key.innerText.replace(/\d+$/, '').toLowerCase()

        if (letterInput.value.length < letterInput.maxLength) {
            letterInput.value += keyText
            guessBtn.click()

            if (keyText !== "enter" && keyText !== "backspace") {
                key.disabled = true
                key.style.scale = .95;
                key.style.opacity = .5;
            }
        }
    })
})

// Key events
letterInput.addEventListener('focus', () => toggleCasing(true))
letterInput.addEventListener('blur', () => toggleCasing(false))
backspace.addEventListener('click', () => {
    letterInput.value = letterInput.value.slice(0, -1)
})
enterKey.addEventListener('click', () => {
    guessBtn.click()
})

// Event listener for Guess button
guessBtn.addEventListener('click', () => {
    const guessedLetter = letterInput.value.toLowerCase().trim()

    // Validate input: only allow single alphabetic characters
    if (!/^[a-z]$/.test(guessedLetter)) {
        result.innerText = "Please enter valid letter."
        letterInput.value = ''
        return
    }

     // Check if the guessed letter is in the word
    if (randomWord.includes(guessedLetter)) {
        randomWord.split('').forEach((char, index) => {
            if (char === guessedLetter) currentWordState[index] = char
        })
        word.innerText = currentWordState.join(' ')
    } else {
        remainingGuesses--;
        if (remainingGuesses === 1) {
            guessAmount.innerHTML = `<b class="hint-num">${remainingGuesses}</b> guess`
        } else {
            guessAmount.innerHTML = `<b class="hint-num">${remainingGuesses}</b> guesses`
        }
    }

    // Disable the button if guesses are up
    if (remainingGuesses <= 0) {
        remainingGuesses = 0
        result.innerText = `Game Over! The word was: ${randomWord}`
        guessBtn.disabled = true
        playAgain()
    }

    // Check win conditions
    if (currentWordState.join('') === randomWord) {
        result.innerText = "You win!"
        guessBtn.disabled = true
        nextLevel()
    } 

    letterInput.value = ''
})

// Event listener for Play Again button
playAgainBtn.addEventListener('click', () => {
    remainingGuesses = maxGuesses
    currentWordState = Array(randomWord.length).fill('_')
    word.innerText = currentWordState.join(' ')
    guessAmount.innerHTML = `<b class="hint-num">${remainingGuesses}</b> guesses`
    result.innerText = ''
    letterInput.value = ''
    score.innerText = 0

    // Enable the button again
    guessBtn.disabled = false
})

// Event listener for Next Level button
nextLevelBtn.addEventListener('click', () => {
    result.innerText = ''
    letterInput.value = ''

    // Enable the button again
    guessBtn.disabled = false
    addScore()
})
