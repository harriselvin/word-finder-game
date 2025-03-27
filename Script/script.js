// Word & Hints Object
const wordCategories = {
    general: {
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
        machine: "Device or appliance",
        paris: "capital of France"
    },
    biblical: {
        genesis: "Beginning",
        exodus: "Going out",
        leviticus: "Relating to the Levites",
        numbers: "Counting",
        deuteronomy: "Second law",
        joshua: "God is salvation",
        judges: "Leaders",
        ruth: "Compassionate",
        samuel: "Asked of God",
        kings: "Rulers",
    },
    science: {
        carbon: "Element",
        oxygen: "Gas",
        uranium: "Radioactive element",
        atom: "Smallest unit of matter",
        gravity: "Force pulling objects down",
        energy: "Capacity to do work",
        molecule: "Two or more atoms bonded",
        H20: "chemical symbol for water",
    },
    sports: {
        basketball: "Team sport with hoop",
        soccer: "Team sport with ball",
        tennis: "Racket sport",
        golf: "Club sport",
        football: "Team sport with ball",
        dribble: "Move the ball skillfully",
        penalty: "A punishment in sports",
        referee: "Official in a game",
        sprint: "Short burst of running",
    },
    movies: {
        starwars: "Space fantasy series",
        thehobbit: "Fantasy adventure series",
        thelordoftherings: "Fantasy adventure series",
        thehungergames: "Dystopian adventure series",
        actor: "Performer in films",
        director: "Controls the movie",
        sequel: "A follow-up movie",
        script: "Text of the movie",
    }
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
// const startSec = document.querySelector('.start-sec')
// const startBtn = document.querySelector('.start-game')
// const backspace = document.querySelector('.backspace')
// const enterKey = document.querySelector('.return')
const keypad = document.querySelectorAll('.keypad-row .num:not(.shift):not(.backspace):not(.return):not(.comma):not(.emoji):not(.dot)')
let randomWord = "",
randomHint = "";
let winCount = 0,
lossCount = 0;
// Load words from the selected category
let solvedWords = []
let selectedCategory = "general" //, "science", "movies", "biblical", "sports"; 
const words = Object.keys(wordCategories[selectedCategory])

// Generate random value
const generateRandomValue = (array) =>  array.length ? Math.floor(Math.random() * array.length) : 0

// Initial Function
const init = () => {
    winCount = 0
    lossCount = 0
    score.innerText = "0"
    
    // Get remaining words (not yet solved)
    let remainingWords = words.filter(word => !solvedWords.includes(word))

    if (remainingWords.length === 0) {
        solvedWords = []
        remainingWords = [...words]
    }

    const randomIndex = generateRandomValue(remainingWords)
    randomWord = remainingWords[randomIndex]
    const storedCategory = localStorage.getItem('selectedCategory') || 'general'
    randomHint = wordCategories[storedCategory][randomWord]

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

// Saves category in localStorage
function saveCategory(category) {
    localStorage.setItem('selectedCategory', category)
}

// Load words from the selected category
function loadCategory() {
    const selectedCategory = localStorage.getItem('selectedCategory') || 'general'

    if (wordCategories[selectedCategory]) {
        words.length = 0
        words.push(...Object.keys(wordCategories[selectedCategory]))

        console.log('Loaded Category:', selectedCategory);
        console.log('Words in category:', words);
        // displayWord(selectedCategory)
        init()
    } else {
        console.error('Category not found: ', selectedCategory);
    }
}

// Generate Word Function
let currentWordState = []

const displayWord = () => {
    currentWordState = randomWord.split('').map(char => (char === " " ? " " : '_'))
    word.innerText = currentWordState.join('')
}

document.addEventListener('DOMContentLoaded', loadCategory)

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

const saveScore = (playerName, score) => {
    if (!playerName) {
        console.error("Error: playerName is undefined!");
        return
    }

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    let selectedCategory = localStorage.getItem("selectedCategory") || "Unknown"; 

    // Add new score
    leaderboard.push({ 
        name: playerName, 
        score: score, 
        category: selectedCategory 
    });

    // Save back to local storage
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard))

    console.log(localStorage.getItem("leaderboard"));

    displayLeaderboard()
}

const addUpScore = () => {
    score.innerText = parseInt(score.innerText) + 1
}

const addScore = () => {
    let playerName = prompt('Enter your name for the leaderboard:')
    if (playerName) {
        let playerScore = parseInt(score.innerText);
        saveScore(playerName, playerScore)
    }

    addUpScore()
}

const addLeaderboardEntry = (username, score) => {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || []
    
    const newEntry = {
        username: username,
        score: score,
        timestamp: new Date().getTime()
    }

    leaderboard.push(newEntry)

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard))
    
    console.log(new Date().getTime());

    removeScoreByTimestamp(newEntry.timestamp)
    
}

const scheduleScoreRemoval = (timestamp) => {
    currentTime = new Date().getTime()
    const timeUntilRemoval = (timestamp + (2 * 60 * 1000)) - currentTime

    if (timeUntilRemoval > 0) {
        setTimeout(() => {
            removeScoreByTimestamp(timestamp)
        }, timeUntilRemoval)
    }
}

const removeScoreByTimestamp = (timestamp) => {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    // const oneDayAgo = new Date().getTime() - (2 * 60 * 1000); // 1 day (24 * 60 * 60 * 1000)

    leaderboard = leaderboard.filter(entry => entry.timestamp !== timestamp)

    localStorage.setItem("leaderboard", JSON.stringify(leaderboard))
    
    console.log(`score with timestamp: ${timestamp} removed.`);
    displayLeaderboard()
}

document.addEventListener("DOMContentLoaded", () => {
    displayLeaderboard()
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || []
    leaderboard.forEach(entry => scheduleScoreRemoval(entry.timestamp))
    // removeScoreByTimestamp()
})

const displayLeaderboard = () => {
    console.log(localStorage.getItem("leaderboard"));

    let leaderboardDiv = document.getElementById("leaderboard")
    if (!leaderboardDiv) {
        console.warn("Error: leaderboard element not found!");
        return;
    }

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    leaderboard.sort((a, b) => b.score - a.score)

    if (!Array.isArray(leaderboard)) {
        leaderboard = []
    }

    let leaderboardHTML = '<tr class="table-head"><th>Player</th><th>Score</th><th>Category</th></tr>';

    leaderboard.forEach(entry => { 
        leaderboardHTML += `
            <tr class="table-body">
                <td>${entry.name}</td>
                <td>${entry.score}</td>
                <td>${entry.category}</td>
            </tr>
        `
    })

    leaderboardDiv.innerHTML = leaderboardHTML;
    console.log("Leaderboard refreshed!");
}

document.addEventListener("DOMContentLoaded", function() {
    displayLeaderboard()
})

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
// letterInput.addEventListener('focus', () => toggleCasing(true))
// letterInput.addEventListener('blur', () => toggleCasing(false))
// backspace.addEventListener('click', () => {
//     letterInput.value = letterInput.value.slice(0, -1)
// })
// enterKey.addEventListener('click', () => {
//     guessBtn.click()
// })

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
        addScore()
    }

    // Check win conditions
    if (currentWordState.join('') === randomWord) {
        result.innerText = "You win!"
        solvedWords.push(randomWord)
        guessBtn.disabled = true
        nextLevel()
    } 

    letterInput.value = ''
})

// Event listener for Play Again button
playAgainBtn.addEventListener('click', () => {
    remainingGuesses = maxGuesses
    solvedWords = []
    currentWordState = Array(randomWord.length).fill('_')
    word.innerText = currentWordState.join(' ')
    guessAmount.innerHTML = `<b class="hint-num">${remainingGuesses}</b> guesses`
    result.innerText = ''
    letterInput.value = ''
    score.innerText = 0

    // Enable the button again
    guessBtn.disabled = false

    init()
})

// Event listener for Next Level button
nextLevelBtn.addEventListener('click', () => {
    result.innerText = ''
    letterInput.value = ''

    // Enable the button again
    guessBtn.disabled = false
    addUpScore()
})
