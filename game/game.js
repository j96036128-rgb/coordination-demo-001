(() => {
  'use strict';

  const GAME_DURATION = 30;
  const SPAWN_INTERVAL = 800;
  const FALL_DURATION = 4000;

  let score = 0;
  let timeLeft = GAME_DURATION;
  let gameActive = false;
  let spawnTimer = null;
  let countdownTimer = null;

  const playArea = document.getElementById('play-area');
  const scoreDisplay = document.getElementById('score');
  const timerDisplay = document.getElementById('timer');
  const startScreen = document.getElementById('start-screen');
  const endScreen = document.getElementById('end-screen');
  const finalScoreDisplay = document.getElementById('final-score');
  const startButton = document.getElementById('start-button');
  const restartButton = document.getElementById('restart-button');

  function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
  }

  function updateTimer() {
    timerDisplay.textContent = `Time: ${timeLeft}`;
  }

  function startGame() {
    score = 0;
    timeLeft = GAME_DURATION;
    gameActive = true;

    updateScore();
    updateTimer();

    startScreen.classList.add('hidden');
    endScreen.classList.add('hidden');

    spawnTimer = setInterval(spawnObject, SPAWN_INTERVAL);
    countdownTimer = setInterval(() => {
      timeLeft--;
      updateTimer();
      if (timeLeft <= 0) endGame();
    }, 1000);
  }

  function endGame() {
    gameActive = false;

    clearInterval(spawnTimer);
    clearInterval(countdownTimer);

    document.querySelectorAll('.object').forEach(o => o.remove());

    finalScoreDisplay.textContent = score;
    endScreen.classList.remove('hidden');
  }

  function spawnObject() {
    if (!gameActive) return;

    const obj = document.createElement('div');
    obj.className = 'object';

    const maxX = playArea.clientWidth - 40;
    obj.style.left = `${Math.random() * maxX}px`;
    obj.style.top = '-40px';

    obj.addEventListener('click', () => {
      if (!gameActive) return;
      score++;
      updateScore();
      obj.remove();
    });

    playArea.appendChild(obj);

    const startTime = performance.now();

    function fall(now) {
      const progress = (now - startTime) / FALL_DURATION;
      if (progress < 1 && obj.parentNode && gameActive) {
        obj.style.top = `${progress * playArea.clientHeight}px`;
        requestAnimationFrame(fall);
      } else {
        obj.remove();
      }
    }

    requestAnimationFrame(fall);
  }

  startButton.addEventListener('click', startGame);
  restartButton.addEventListener('click', startGame);
})();