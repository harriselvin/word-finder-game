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
		paris: "Capital of France",
		blink: 'Quick eye movement',
		glimpse: 'A brief look',
		echo: 'Repeated sound',
		swift: 'Fast; Quick',
		puzzle: 'Mystery; Brain teaser',
		glow: "Soft light",
		haste: "Quick action",
		pluck: "Pull sharply",
		stumble: "Trip or lose balance",
		whisper: "Speak softly",
		timber: "Wood for building",
		twist: "Bend or turn",
		vault: "Arched structure or leap",
		breeze: "Gentle wind",
		creek: "Small stream"
	},
	biblical: {
		genesis: "Beginning",
		exodus: "Going out",
		leviticus: "Relating to the Levites",
		numbers: "Counting",
		deuteronomy: "Second law",
		joshua: "God is salvation",
		judges: "Leaders (similar)",
		ruth: "Compassionate",
		samuel: "Asked of God",
		kings: "Rulers (similar)",
		psalms: "Song and prayers",
		proverbs: "Wise sayings",
		lamentations: "Expressions of sorrow",
		solomon: "Wise king",
		apostle: "Messenger of Christ",
		david: "heart after God's own heart",
		revelation: "End-time prophecy",
		acts: "Early church events",
		revival: "Spiritual awakening",
		miracle: "Supernatural event",
		elijah: "Prophet who called fire",
		elisha: "Prophet with double portion",
		gideon: "Judge with 300 men",
		paul: "Apostle to the Gentiles",
		peter: "The rock; Disciple",
		jonah: "Swallowed by a great fish",
		daniel: "Prophet in the lion’s den",
		noah: "Built the ark",
		joseph: "Dream interpreter",
		miriam: "Sister of Moses"
	},
	science: {
		carbon: "Element",
		oxygen: "Gas",
		uranium: "Radioactive element",
		atom: "Smallest unit of matter",
		gravity: "Force pulling objects down",
		energy: "Capacity to do work",
		molecule: "Two or more atoms bonded",
		neutron: "Neutral particle",
		photosynthesis: "Plant energy process",
		voltage: "Electrical potential",
		fusion: "Joining atoms",
		protein: "Essential body nutrient",
		plasma: "State of matter",
		quark: "Fundamental particle",
		enzyme: "Biological catalyst",
		telescope: "Device to see far",
		meteor: "Shooting star",
		eclipse: "Sun or moon covered",
		circuit: "Path for electricity",
		altitude: "Height above ground",
		osmosis: "Water movement in cells",
		vaccine: "Disease prevention shot"
	},
	sports: {
		basketball: "Team sport with hoop",
		soccer: "Team sport where you kick a ball around",
		tennis: "Racket sport",
		golf: "Club sport",
		football: "Team sport with ball",
		dribble: "Move the ball skillfully",
		penalty: "A punishment in sports",
		referee: "Official in a game",
		sprint: "Short burst of running",
		marathon: "Long-distance race",
		pitcher: "Baseball thrower",
		goalkeeper: "Defends the goal",
		judo: "Japanese martial arts",
		overtime: "Extra game time",
		hurdle: "Obstacle in running",
		knockout: "Instant fight win",
		serve: "Start in tennis",
		strike: "Bowling or baseball term",
		dunk: "Basketball slam",
		relay: "Team running race",
		pitch: "Soccer or baseball field",
		match: "Game between opponents",
		helm: "Leader in a team",
		parry: "Fencing block"
	},
	movies: {
		starwars: "Space fantasy series",
		thehobbit: "Fantasy adventure series",
		thelordoftherings: "Fantasy adventure series",
		thehungergames: "Dystopian adventure series",
		actor: "Performer in films",
		director: "Controls or leads the movie",
		sequel: "A follow-up movie",
		script: "Text of the movie",
		trilogy: "Three-part series",
		cameo: "Brief guest appearance",
		soundtrack: "Movie music",
		stunt: "Dangerous movie act",
		reboot: "Revived movie series",
		protagonist: "Main character",
		villain: "Antagonist or bad guy",
		montage: "Sequence of quick shots",
		blockbuster: "Huge hit movie",
		cinematography: "Art of movie visuals",
		trailer: "Movie preview",
		screenplay: "Written script",
		extra: "Background actor",
		cliffhanger: "Tense unresolved ending"
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
const keypad = document.querySelectorAll('.keypad-row .num:not(.backspace):not(.return)')
let randomWord = "",
randomHint = "";
let winCount = 0,
lossCount = 0;
let solvedWords = []
let selectedCategory = "general" 
const words = Object.keys(wordCategories[selectedCategory])

window.addEventListener('beforeunload', (event) => {
	if (score.innerText > 0) {
		event.preventDefault()
		event.returnValue = "Are you sure you want to leave? Your progress will be lost."
	}
})

window.onload = function () {
	localStorage.setItem('score', 0)
	score.innerText = "0"
}

// Generate random value
const generateRandomValue = (array) =>  array.length ? Math.floor(Math.random() * array.length) : 0

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

// Initial Function
const init = () => {
	winCount = 0
	lossCount = 0

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
	const storedCategory = localStorage.getItem('selectedCategory') || 'general'
	randomHint = wordCategories[storedCategory][randomWord]

	message.innerText = randomHint
	displayWord()


	// Reset keypad buttons (enable all keys)
	keypad.forEach((key) => {
		key.disabled = false;
		key.style.scale = 1;
		key.style.opacity = 1;
		key.style.cursor = "pointer";
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
		console.error("Error: Invalid player name or score!");
		return
	}

	let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
	let selectedCategory = localStorage.getItem("selectedCategory") || "Unknown"; 

	// Add new score
	leaderboard.push({ 
		name: playerName, 
		score: score, 
		category: selectedCategory ,
		timestamp: new Date().getTime()
	});

	// Save back to local storage
	localStorage.setItem("leaderboard", JSON.stringify(leaderboard))
	console.log(localStorage.getItem("leaderboard"));

	displayLeaderboard()
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
	
	console.log(`Added score at: ${newEntry.timestamp}`);

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
	let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
	const oneDayAgo = new Date().getTime() - (24 * 60 * 60 * 1000);

	leaderboard = leaderboard.filter(entry => entry.timestamp && entry.timestamp > oneDayAgo)

	localStorage.setItem("leaderboard", JSON.stringify(leaderboard))
	
	console.log(`Old scores removed. Current leaderboard: `, leaderboard);
	displayLeaderboard()
}

document.addEventListener("DOMContentLoaded", () => {
	displayLeaderboard()
	setTimeout(() => {
		removeOldScores()
	}, 2000)
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

	leaderboard = leaderboard.slice(0, 10)

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
	// addUpScore()
})
