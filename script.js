const gameContainer = document.getElementById('game');
const startButton = document.getElementById('start-game');
const score = document.getElementById('score');
const bestScore = document.getElementById('best-score');

const COLORS = [ 'red', 'blue', 'green', 'orange', 'purple', 'red', 'blue', 'green', 'orange', 'purple' ];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
	let counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		let index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
	for (let color of colorArray) {
		// create a new div
		const newDiv = document.createElement('div');

		// give it a class attribute for the value we are looping over
		newDiv.classList.add(color);

		// call a function handleCardClick when a div is clicked on
		newDiv.addEventListener('click', handleCardClick);

		// append the div to the element with an id of game
		gameContainer.append(newDiv);
	}
}

// remove the cards from the page
function removeCards() {
	const cards = gameContainer.querySelectorAll('div');
	for (let card of cards) {
		card.remove();
	}
}

let clickCount = 0;
let twoCards = false;
let scoreCounter = 0;
// TODO: Implement this function!
function handleCardClick(event) {
	// Make sure that we only click on cards that have not been revealed
	// Make sure that we cannot click on a card if two mismatched cards have been revealed
	if (!twoCards && !event.target.classList.contains('revealed') && !event.target.classList.contains('matched')) {
		//reveal the card
		event.target.style.backgroundColor = event.target.classList;
		event.target.classList.add('revealed');
		clickCount++;
		//update the counters, and compare the two cards
		if (clickCount >= 2) {
			scoreCounter++;
			compareCards();
			clickCount = 0;
		}
	}
	score.innerText = scoreCounter;
}

//compare two cards to see if they match
function compareCards() {
	const pair = document.querySelectorAll('.revealed');
	pair[0].classList.remove('revealed');
	pair[1].classList.remove('revealed');
	// if the cards match, add matched to the html class attribute, otherwise hide the cards again after 1 second
	if (pair[0].classList.value === pair[1].classList.value) {
		pair[0].classList.add('matched');
		pair[1].classList.add('matched');
	} else {
		twoCards = true;
		setTimeout(function() {
			twoCards = false;
			pair[0].style.backgroundColor = 'white';
			pair[1].style.backgroundColor = 'white';
		}, 1000);
	}
}

// check to see if all 10 cards have been matched
function isGameComplete() {
	const cards = gameContainer.querySelectorAll('.matched');
	return cards.length === 10;
}

// if the new score is better than the previous best score, update the best score and push to local storage
function updateBestScore() {
	if (!parseInt(bestScore.innerText) || parseInt(score.innerText) < parseInt(bestScore.innerText)) {
		bestScore.innerText = score.innerText;
		localStorage.setItem('best score', bestScore.innerText);
	}
}

// when the DOM loads
//load the best score from local storage
if (localStorage.getItem('best score')) {
	bestScore.innerText = localStorage.getItem('best score');
}

// code to run when the reset button is clicked.
// update the best score, reset counters, remove the old cards, reshuffle the colors, and add the new cards
startButton.addEventListener('click', function() {
	if (isGameComplete()) {
		updateBestScore();
	}
	score.innerText = 0;
	scoreCounter = 0;
	startButton.innerText = 'Restart Game!';
	removeCards();
	shuffledColors = shuffle(COLORS);
	createDivsForColors(shuffledColors);
});
