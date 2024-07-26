// Word & Hints Object
const options = {
    aroma: "Pleasing smell",
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
const message = document.querySelector('.guess-msg') 
const guessAmount = document.querySelector('[data-amount]')
const result = document.querySelector('.result')
const letterInput = document.querySelector('.letter')
const playAgainBtn = document.querySelector('.play-again')
const startBtn = document.querySelector('.start')
const word = document.querySelector('.word')
const words = Object.keys(options)
let randomWord = "",
randomHint = "";
let winCount = 0,
lossCount = 0;

// Generate random value
const generateRandomValue = (array) => Math.floor(Math.random() * array.length)

// console.log(generateRandomValue);

// Block buttons 
const blocker = () => {
    let lettersButtons = document.querySelectorAll('letters')

    stopGame()
}

// Start Game
startBtn.addEventListener("click", () => {
    controls.classList.add("hide")
    init()
})

// Stop Game
const stopGame = () => {
    controls.classList.remove("hide")
}

// Generate Word Function
const generateWord = () => {}

// Initial Function
const init = () => {
    winCount = 0
    lossCount = 0
    randomWord = 0
    word.innerText = "Hello"
    randomHint = 0
    message.innerText = "Hi"
    userInpSection.innerText = ""
    letterContainer.classList.add("hide")
    letterContainer.innerText = ""
    generateWord()
}

// For creating letter buttons 
for(let i = 65; i < 91; i++) {
    let buttons = document.createElement("button")
    button.classList.add("letters")
}

// Number to ASCII[A-Z]
button.innerText = String.fromCharCode(i)

letterContainer.appendChild(button)

