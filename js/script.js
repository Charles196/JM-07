const cardsEasy = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D'];
const cardsHard = ['A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'F', 'F', 'G', 'G', 'H', 'H'];
let shuffledCards = [];
let firstCard = null;
let secondCard = null;
let moves = 0;
let playerName = "";
let difficulty = "easy";
let matchCount = 0;

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('restart-game').addEventListener('click', startGame);

function startGame() {
    playerName = document.getElementById('player-name').value;
    if (!playerName) {
        alert("Por favor, insira o nome do jogador.");
        return;
    }

    difficulty = document.getElementById('difficulty').value;
    shuffledCards = shuffle(difficulty === 'easy' ? cardsEasy : cardsHard);

    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    shuffledCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.value = card;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });

    document.getElementById('game-over').classList.add('hidden');
    matchCount = 0;
    moves = 0;
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function flipCard(event) {
    const card = event.target;
    if (card.classList.contains('flipped') || firstCard && secondCard) return;

    card.innerText = card.dataset.value;
    card.classList.add('flipped');

    if (!firstCard) {
        firstCard = card;
    } else {
        secondCard = card;
        checkForMatch();
    }
}

function checkForMatch() {
    moves++;
    if (firstCard.dataset.value === secondCard.dataset.value) {
        matchCount++;
        resetCards(true);
        if (matchCount === shuffledCards.length / 2) {
            endGame();
        }
    } else {
        setTimeout(() => {
            resetCards(false);
        }, 1000);
    }
}

function resetCards(matched) {
    if (!matched) {
        firstCard.innerText = '';
        secondCard.innerText = '';
    }
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');
    firstCard = null;
    secondCard = null;
}

function endGame() {
    const playerInfo = document.getElementById('player-info');
    playerInfo.innerText = `Parabéns, ${playerName}! Você terminou o jogo em ${moves} movimentos.`;

    saveRanking(playerName, moves);
    displayRanking();

    document.getElementById('game-over').classList.remove('hidden');
}

function saveRanking(name, score) {
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.push({ name, score });
    localStorage.setItem('ranking', JSON.stringify(ranking));
}

function displayRanking() {
    const rankingList = document.getElementById('ranking');
    rankingList.innerHTML = '';
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
    ranking.sort((a, b) => a.score - b.score);
    ranking.forEach((player, index) => {
        const li = document.createElement('li');
        li.innerText = `${index + 1}. ${player.name} - ${player.score} movimentos`;
        rankingList.appendChild(li);
    });
}
