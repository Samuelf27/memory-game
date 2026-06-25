const EMOJIS = ['🚀', '🎨', '🎮', '🍕', '🐱', '🌵', '⚡', '🎸'];
const TOTAL_PAIRS = EMOJIS.length;

const $ = (id) => document.getElementById(id);
const board = $('board');

let first = null, second = null;
let lock = false;
let moves = 0, matched = 0;
let seconds = 0, timer = null, started = false;

const shuffle = (arr) => arr.map(v => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(p => p[1]);

function startTimer() {
  if (started) return;
  started = true;
  timer = setInterval(() => { seconds++; $('time').textContent = `${seconds}s`; }, 1000);
}

function build() {
  clearInterval(timer);
  first = second = null; lock = false;
  moves = matched = seconds = 0; started = false;
  $('moves').textContent = '0';
  $('time').textContent = '0s';
  $('pairs').textContent = `0/${TOTAL_PAIRS}`;
  $('win').classList.add('hidden');

  const deck = shuffle([...EMOJIS, ...EMOJIS]);
  board.innerHTML = deck.map((e, i) => `
    <div class="card" data-emoji="${e}" data-i="${i}">
      <div class="card__inner">
        <div class="card__face card__back">❓</div>
        <div class="card__face card__front">${e}</div>
      </div>
    </div>`).join('');

  board.querySelectorAll('.card').forEach(c => c.addEventListener('click', () => flip(c)));
}

function flip(card) {
  if (lock || card.classList.contains('flipped') || card.classList.contains('matched')) return;
  startTimer();
  card.classList.add('flipped');

  if (!first) { first = card; return; }
  second = card;
  moves++;
  $('moves').textContent = moves;

  if (first.dataset.emoji === second.dataset.emoji) {
    first.classList.add('matched'); second.classList.add('matched');
    matched++;
    $('pairs').textContent = `${matched}/${TOTAL_PAIRS}`;
    first = second = null;
    if (matched === TOTAL_PAIRS) win();
  } else {
    lock = true;
    setTimeout(() => {
      first.classList.remove('flipped'); second.classList.remove('flipped');
      first = second = null; lock = false;
    }, 800);
  }
}

function win() {
  clearInterval(timer);
  $('winMoves').textContent = moves;
  $('winTime').textContent = `${seconds}s`;
  setTimeout(() => $('win').classList.remove('hidden'), 500);
}

$('restart').addEventListener('click', build);
$('playAgain').addEventListener('click', build);

build();
