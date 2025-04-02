// Import Firebase 
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase, ref, push, onValue, query, orderByChild, remove } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Initial References
const message = document.querySelector('.guess-msg') 
const guessAmount = document.querySelector('[data-amount]')
const result = document.querySelector('.result')
const letterInput = document.querySelector('.letter')
const word = document.querySelector('.word')
const score = document.querySelector('[data-score]')
const guessBtn = document.querySelector('.btn')
const playAgainBtn = document.querySelector('.play-again')
const nextLevelBtn = document.querySelector('.next-level')
const keypad = document.querySelectorAll('.keypad-row .num:not(.backspace):not(.return)')
let randomWord = "",
randomHint = "";
let solvedWords = []

let unloadConfirmed = false 

window.addEventListener('beforeunload', (event) => {
	if (score.innerText > 0 && !unloadConfirmed) {
		event.preventDefault()
		event.returnValue = "Are you sure you want to leave? Your progress will be lost."
		unloadConfirmed = true
	}
})

let confirmationShow = false

const links = document.querySelectorAll('a')
links.forEach(link => {
	link.addEventListener('click', (e) => {
		if (score.innerText > 0 && !confirmationShow) {
			confirmationShow = true
			const userConfirmed = confirm('You have unsaved progress. Are you sure you want to leave?')
			if (!userConfirmed) {
				e.preventDefault()
				confirmationShow = false
			}
		}
	})
})

window.onload = function () {
	localStorage.setItem('score', 0)
	score.innerText = "0"
	fetchWordCategories()

	if (sessionStorage.getItem("lastPage") !== "leaderboard") {
        fetchWordCategories();  // Only fetch if not coming from the leaderboard
    }
}

const navContainer = document.querySelector('.off-canvas-nav ul')
const openMenu = document.querySelector('.burger-menu img.open')
const closeMenu = document.querySelector('.burger-menu img.close')
const body = document.body

openMenu.addEventListener('click', function () {
	navContainer.classList.add('active')
	openMenu.style.display = 'none'
	closeMenu.style.display = 'block'
	body.style.overflow = 'hidden'
})

closeMenu.addEventListener('click', function () {
	navContainer.classList.remove('active')
	closeMenu.style.display = 'none'
	openMenu.style.display = 'block'
	body.style.overflow = ''
})

let wordCategories = {}

const fetchWordCategories = async () => {
	try {
		const response = await fetch('https://harriselvin.github.io/word-finder-api/data/data.json')
		if (!response.ok) {
			throw new Error("failed to fetch data")
		}
		wordCategories = await response.json()
		
		init()
	} catch (error) {
		console.error("Error fetching word categories: ", error);
		alert("Failed to load word categories. Please check your internet connection.")
	}
}

// Generate random value
const generateRandomValue = (array) =>  array.length ? Math.floor(Math.random() * array.length) : 0

// Initial Function
const init = () => {
	const selectedCategory = localStorage.getItem('selectedCategory') || 'general'
	if (!wordCategories[selectedCategory]) {
		console.error("Category not found: ", selectedCategory);
		return
	}

	resetUI()

	const words =Object.keys(wordCategories[selectedCategory])

	let storedScore = localStorage.getItem('score') || 0
	score.innerText = storedScore
	
	// Get remaining words (not yet solved)
	let remainingWords = words.filter(word => !solvedWords.includes(word))

	if (remainingWords.length === 0) {
		solvedWords = []
		remainingWords = [...words]
	}

	const randomIndex = generateRandomValue(remainingWords)
	randomWord = remainingWords[randomIndex]
	randomHint = wordCategories[selectedCategory][randomWord]
	
	word.innerHTML = "_ ".repeat(randomWord.length)
	message.innerText = randomHint

	resetKeypad()
	resetGuessButton()
	
	displayWord()
}

// Reset UI elements (word, guesses, etc.)
const resetUI = () => {
	word.innerHTML = '';
	guessAmount.innerHTML = '';
	result.innerText = '';
	letterInput.value = '';
	remainingGuesses = maxGuesses;
};

// Reset the keypad buttons
const resetKeypad = () => {
	keypad.forEach((key) => {
		key.disabled = false;
		key.style.scale = 1;
		key.style.opacity = 1;
		key.style.cursor = "pointer";
	});
};

// Reset the guess button
const resetGuessButton = () => {
	guessBtn.disabled = false;
};

// Saves category in localStorage
function saveCategory(category) {
	localStorage.setItem('selectedCategory', category)
}

document.querySelectorAll('.category-btn').forEach(button => {
	button.addEventListener('click', (e) => {
		const category = e.target.dataset.category;
		const currentCategory = localStorage.getItem('selectedCategory');
		
		// Prevent reloading if the same category is selected
        if (category === currentCategory) return; 
        
        if (score.innerText > 0) {
            const userConfirmed = confirm('You have unsaved progress. Are you sure you want to change the category?');
            if (!userConfirmed) return; // Stop the category change if canceled
        }

        // Save the new category and reload
        localStorage.setItem('selectedCategory', category);
		solvedWords = []

		window.location.reload();
        init()
		loadCategory()
	})
})

// Load words from the selected category
function loadCategory() {
	const selectedCategory = localStorage.getItem('selectedCategory') || 'general'

	let words = Object.keys(wordCategories[selectedCategory])

	if (wordCategories[selectedCategory]) {
		words.length = 0
		words.push(...Object.keys(wordCategories[selectedCategory]))
		init()
	} else {
		console.error('Category not found: ', selectedCategory);
	}
}

document.querySelector('.leaderboard-link').addEventListener('click', () => {
	sessionStorage.setItem("lastPage", "leaderboard");
	window.location.href = "leaderboard.html";
})

window.addEventListener("pageshow", function (event) {
    if (sessionStorage.getItem("lastPage") === "leaderboard") {
        sessionStorage.removeItem("lastPage");  // Clear after returning
        window.location.reload(); // Ensure fresh state
    }
});

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
	if (!playerName || score === null) {
		console.error("Error: Invalid player name or score!");
		return
	}

	let selectedCategory = localStorage.getItem("selectedCategory") || "Unknown"; 

	push(ref(db, "leaderboard"), {
		name: playerName,
		score: score,
		category: selectedCategory,
		timestamp: new Date().getTime()
	}).then(() => {
		console.log("Score saved successfully!");
		displayLeaderboard()
	}).catch(error => {
		console.error("Error saving score: ", error);
	})

}

const addUpScore = () => {
	let currentScore = parseInt(localStorage.getItem('score')) || 0
	currentScore += 1
	localStorage.setItem('score', currentScore)
	score.innerText = currentScore
}

const resetScore = () => {
	localStorage.removeItem('score')
	score.innerText = "0"
}

const addScore = () => {
	let playerName = prompt('Enter your name for the leaderboard:')
	if (playerName) {
		addUpScore()
		let playerScore = parseInt(score.innerText);
		saveScore(playerName, playerScore)
	}
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

	scheduleScoreRemoval(newEntry.timestamp)
	displayLeaderboard()
}

const scheduleScoreRemoval = (timestamp) => {
	const currentTime = new Date().getTime()
	const timeUntilRemoval = (timestamp + (24 * 60 * 60 * 1000)) - currentTime

	if (timeUntilRemoval > 0) {
		setTimeout(() => {
			removeOldScores()
		}, timeUntilRemoval)
	}
}

const removeOldScores = () => {
	const leaderboardRef = ref(db, "leaderboard")
	const oneDayAgo = new Date().getTime() - (24 * 60 * 60 * 1000);

	onValue(leaderboardRef, (snapshot) => {
		const leaderboardData = snapshot.val()
		if (leaderboardData) {
			Object.entries(leaderboardData).forEach(([key, entry]) => {
				if (entry.timestamp && entry.timestamp < oneDayAgo) {
					const entryRef = ref(db, `leaderboard/${key}`)
					remove(entryRef)
						.then(() => console.log(`Remove score for ${entry.name}`))
						.catch(error => console.error("Error removing score: ", error))
				}
			})
		}
	}, { onlyOnce: true })
}

document.addEventListener("DOMContentLoaded", () => {
	displayLeaderboard()
	setTimeout(() => {
		removeOldScores()
	}, 2000)
})

const displayLeaderboard = () => {
	const leaderboardRef = query(ref(db, "leaderboard"), orderByChild("score"))

	onValue(leaderboardRef, (snapshot) => {
		const leaderboardData = snapshot.val()
		const leaderboardArray = leaderboardData ? Object.values(leaderboardData) : []

		leaderboardArray.sort((a, b) => b.score - a.score)

		const topTen = leaderboardArray.slice(0, 10)

		const leaderboardElement = document.getElementById("leaderboard")
		leaderboardElement.innerHTML = ""

		topTen.forEach((entry, index) => {
			let entryElement = document.createElement("tr")
			entryElement.innerHTML = `
				<td>${index + 1}</td>
				<td><strong>${entry.name}</strong</td>
				<td>${entry.score}</td>
				<td>${entry.category}</td>`
			leaderboardElement.appendChild(entryElement)
		})
	})
}

setInterval(removeOldScores, 3600000)

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
				key.style.cursor = "auto";
			}
		}
	})
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
		addScore()
		resetScore()
	}

	// Check win conditions
	if (currentWordState.join('') === randomWord) {
		result.innerText = "You win!"
		solvedWords.push(randomWord)
		guessBtn.disabled = true
		nextLevel()
		addUpScore()
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
})
