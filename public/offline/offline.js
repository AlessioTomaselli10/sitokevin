const pen = document.getElementById('pen');
const obstacle = document.getElementById('obstacle');
const bonus = document.getElementById('bonus');
const scoreDisplay = document.getElementById('score');

let gameActive = false;
let score = 0;

function jump() {
  if (!gameActive) return;
  if (pen.classList.contains('jump')) return;
  pen.classList.add('jump');
  setTimeout(() => pen.classList.remove('jump'), 600);
}

function startGameIfNeeded() {
  if (!gameActive) {
    gameActive = true;
    score = 0;
    scoreDisplay.textContent = 'Fatturato: €0';
    gameLoop();
  }
}

function moveElement(element, speed, onComplete) {
  let rightPos = -150;

  const minBottomElem = 10;
  const maxBottomElem = 110;
  const randomBottom = Math.floor(Math.random() * (maxBottomElem - minBottomElem + 1)) + minBottomElem;
  element.style.bottom = randomBottom + 'px';

  element.style.right = rightPos + 'px';
  element.classList.remove('hidden');

  function frame() {
    if (!gameActive) {
      element.classList.add('hidden');
      return;
    }
    rightPos += speed;
    element.style.right = rightPos + 'px';

    if (rightPos > window.innerWidth + 150) {
      element.classList.add('hidden');
      onComplete && onComplete();
      return;
    }

    if (checkCollision(element)) {
      if (element === obstacle) {
        gameOver();
      } else if (element === bonus) {
        score += 1000;
        scoreDisplay.textContent = `Fatturato: €${score.toLocaleString('it-IT')}`;
        element.classList.add('hidden');
        onComplete && onComplete();
        return;
      }
    }

    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function checkCollision(element) {
  const penRect = pen.getBoundingClientRect();
  const elemRect = element.getBoundingClientRect();

  const horizontalOverlap = penRect.right > elemRect.left + 10 && penRect.left < elemRect.right - 10;
  const verticalOverlap = penRect.bottom > elemRect.top + 10 && penRect.top < elemRect.bottom - 10;

  return horizontalOverlap && verticalOverlap;
}

function gameOver() {
  gameActive = false;
  alert(`Gioco finito! Il tuo fatturato finale è €${score.toLocaleString('it-IT')}`);
  location.reload();
}

function gameLoop() {
  if (!gameActive) return;

  moveElement(obstacle, 2, () => {
    setTimeout(() => {
      if (!gameActive) return;
      if (Math.random() < 0.5) {
        moveElement(bonus, 2, () => gameLoop());
      } else {
        gameLoop();
      }
    }, Math.random() * 800 + 800);
  });
}

// INPUT: tastiera + touch
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    startGameIfNeeded();
    jump();
  }
}, { passive: false });

// tap ovunque nell’area di gioco
const gameArea = document.getElementById('game-area') || document;
gameArea.addEventListener('touchstart', (e) => {
  // Evita lo scroll-zoom su mobile durante il touch
  e.preventDefault();
  startGameIfNeeded();
  jump();
}, { passive: false });

gameArea.addEventListener('mousedown', (e) => {
  startGameIfNeeded();
  jump();
});
