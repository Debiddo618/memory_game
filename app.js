const cardContainer = document.querySelector(".card-container");
const openModalBtn = document.querySelector(".rule-button");
const closeModalBtn = document.querySelector(".close-modal");
const restartBtn = document.querySelector(".restart-button");
const pauseBtn = document.querySelector(".pause-button");
const modal = document.querySelector(".modal");
const modalContainer = document.querySelector(".modal-container");

// display variables
const correctEl = document.getElementById("correct-number");
const wrongEl = document.getElementById("wrong-number");
const timeEl = document.getElementById("time");
const messageEl = document.getElementById("message");

// let selectedCards = [];
let correct = 0;
let wrong = 0;
let timeUp = false;
let timePaused = false;
let timeInterval;
let animationInterval;
let restart = false;
let seconds = 0;
let winner = false;
let loser = false;
let firstSelect = null;
let secondSelect = null;

const testArr = [
  ["cat", "dog", "pig", "cow"],
  ["cat", "dog", "pig", "cow"],
  ["bat", "rat", "horse", "goat"],
  ["bat", "rat", "horse", "goat"],
];

// initializing the card container
function initializeContainer() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const card = document.createElement("div");
      card.classList.add("card");
      card.id = testArr[i][j];

      const innerCard = document.createElement("div");
      innerCard.classList.add("inner-card");
      innerCard.classList.add("not-found");
      innerCard.id = testArr[i][j];

      const frontCard = document.createElement("div");
      frontCard.classList.add("front-card");
      frontCard.innerText = "Front of the card";
      frontCard.id = testArr[i][j];

      const backCard = document.createElement("div");
      backCard.classList.add("back-card");
      backCard.innerText = testArr[i][j];
      backCard.id = testArr[i][j];

      innerCard.append(frontCard);
      innerCard.append(backCard);

      card.append(innerCard);
      card.addEventListener("click", handleClick);
      cardContainer.appendChild(card);
    }
  }
  timerCountDown(300);
}

// handle click
function handleClick(event) {
  selectCards(event);
  if (secondSelect !== null) {
    setTimeout(() => {
      checkCards(event);
    }, "1000");
  }
  // updateMessage();
}

// select the card and save it in firstSelect and secondSelect
function selectCards(event) {
  if (!winner && !loser && !timePaused) {
    if (
      (firstSelect === null || secondSelect === null) &&
      !event.target.classList.contains("selected") &&
      !event.target.classList.contains("removed")
    ) {
      if (firstSelect === null) {
        firstSelect = event.target;
      } else {
        if (secondSelect == null) {
          secondSelect = event.target;
        }
      }
      event.target.classList.add("selected");
      event.target.parentNode.classList.add("selected");
      event.target.nextElementSibling.classList.add("selected");
    }
    message = "Select another card";
    // checkCards(event);
  }
}

// 2. check if the cards, matches
function checkCards(event) {
  if (firstSelect !== null && secondSelect !== null && !timePaused) {
    if (
      firstSelect.parentNode.classList.contains("not-found") &&
      secondSelect.parentNode.classList.contains("not-found")
    ) {
      if (firstSelect.id === secondSelect.id) {
        firstSelect.classList.remove("selected");
        firstSelect.classList.add("removed");
        firstSelect.parentNode.classList.remove("not-found");
        secondSelect.classList.remove("selected");
        secondSelect.classList.add("removed");
        secondSelect.parentNode.classList.remove("not-found");
        message = "Nice!";
        correct++;
      } else {
        if (firstSelect.id !== secondSelect.id) {
          firstSelect.classList.remove("selected");
          secondSelect.classList.remove("selected");
          const firstInner = firstSelect.parentNode;
          const secondInner = secondSelect.parentNode;
          firstInner.classList.remove("selected");
          secondInner.classList.remove("selected");
          message = "Incorrect Match!";
          wrong++;
        }
      }
    }

    checkWinLose();
    updateMessage(event);
    firstSelect = null;
    secondSelect = null;
  }
}

// 3. check win condition
function checkWinLose() {
  if (correct === 8) {
    winner = true;
    message = "Congratulations, Yon won!";
  }
  if (wrong === 5) {
    let delay = 1000;
    const cardsEl = document.querySelectorAll(".inner-card.not-found");
    console.log(cardsEl);
    cardsEl.forEach((card) => {
      setTimeout(() => {
        card.classList.add("selected");
      }, delay);
      delay += 500;
    });
    loser = true;
    message = "You Loss!";
  }
}

// 4. update message
function updateMessage() {
  wrongEl.innerText = wrong;
  correctEl.innerText = correct;
  messageEl.innerText = message;
}

// restart game
function restartGame() {
  cardContainer.innerHTML = "";
  firstSelect = secondSelect = null;
  correct = wrong = 0;
  winner = loser = false;
  message = "Pick two cards";
  timePaused = false;
  pauseBtn.innerHTML = "Pause Game";
  initializeContainer();
  updateMessage();
}

// timer count down
function timerCountDown(gameTime) {
  if (!winner && !loser) {
    seconds = gameTime;
    function tick() {
      let time = document.getElementById("time");
      seconds--;
      time.innerHTML = secondsToMinutesAndSeconds(seconds);
      if (seconds > 0) {
        if (!winner && !loser && !timePaused) {
          clearInterval(timeInterval);
          timeInterval = setTimeout(tick, 1000);
        }
      } else {
        message = "Time is up! You Loss!";
        loser = true;
        timeUp = true;
        updateMessage();
      }
    }
    tick();
  }
}

// pauseGame
function pauseGame() {
  if (!timePaused) {
    timePaused = true;
    pauseBtn.innerHTML = "Resume Game";
  } else {
    timePaused = false;
    pauseBtn.innerHTML = "Pause Game";
    timerCountDown(seconds);
  }
}

// seconds to minutes converter
function secondsToMinutesAndSeconds(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainderSeconds = seconds % 60;
  return remainderSeconds < 10
    ? minutes + ":0" + remainderSeconds
    : minutes + ":" + remainderSeconds;
}

// event listeners
openModalBtn.addEventListener("click", () => {
  modal.style.display = "flex";
  modalContainer.style.display = "flex";
  if (!timePaused) {
    pauseGame();
  }
});
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
  modalContainer.style.display = "none";
  pauseGame();
});
restartBtn.addEventListener("click", restartGame);
pauseBtn.addEventListener("click", pauseGame);

initializeContainer();
