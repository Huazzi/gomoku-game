// Game state variables
let isBlack = true;
let cheeks = [];
let canvas;
let ctx;

function play() {
  // Initialize canvas
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  // Clear previous game state
  ctx.clearRect(0, 0, 600, 600);
  initializeBoard();
  drawBoard();
  setupEventListeners();
}

function initializeBoard() {
  // Reset game state
  isBlack = true;
  cheeks = Array(15).fill().map(() => Array(15).fill(0));
  updatePlayerTurn();
}

function drawBoard() {
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;

  // Draw horizontal lines
  for (let i = 0; i < 15; i++) {
    ctx.beginPath();
    ctx.moveTo(20, 20 + i * 40);
    ctx.lineTo(580, 20 + i * 40);
    ctx.stroke();
    ctx.closePath();
  }

  // Draw vertical lines
  for (let i = 0; i < 15; i++) {
    ctx.beginPath();
    ctx.moveTo(20 + i * 40, 20);
    ctx.lineTo(20 + i * 40, 580);
    ctx.stroke();
    ctx.closePath();
  }
}

function setupEventListeners() {
  canvas.onclick = handleClick;
}

function handleClick(e) {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.clientX - rect.left;
  const clientY = e.clientY - rect.top;

  // Calculate grid position
  const x = Math.round((clientX - 20) / 40) * 40 + 20;
  const y = Math.round((clientY - 20) / 40) * 40 + 20;

  // Convert to array indices
  const cheeksX = (x - 20) / 40;
  const cheeksY = (y - 20) / 40;

  // Validate move
  if (cheeks[cheeksY][cheeksX] || cheeksX < 0 || cheeksX > 14 || cheeksY < 0 || cheeksY > 14) {
    return;
  }

  // Place stone
  placePiece(x, y, cheeksX, cheeksY);

  // Check win condition
  setTimeout(() => {
    if (isWin(cheeksX, cheeksY)) {
      const winner = isBlack ? '黑棋' : '白棋';
      const con = confirm(`${winner} 赢了! 重新开始新的一局?`);
      if (con) {
        play();
      }
    } else {
      // Switch turns
      isBlack = !isBlack;
      updatePlayerTurn();
    }
  }, 0);
}

function placePiece(x, y, cheeksX, cheeksY) {
  cheeks[cheeksY][cheeksX] = isBlack ? 1 : 2;

  ctx.beginPath();
  ctx.arc(x, y, 18, 0, 2 * Math.PI);
  ctx.fillStyle = isBlack ? 'black' : 'white';
  ctx.fill();
  if (!isBlack) {
    ctx.strokeStyle = 'black';
    ctx.stroke();
  }
  ctx.closePath();
}

function updatePlayerTurn() {
  document.getElementById('player-turn').textContent = isBlack ? '黑棋' : '白棋';
}

function isWin(x, y) {
  const flag = isBlack ? 1 : 2;
  return up_down(x, y, flag) ||
    left_right(x, y, flag) ||
    lu_rd(x, y, flag) ||
    ru_ld(x, y, flag);
}

function up_down(x, y, flag) {
  let num = 1;
  // Check upward
  for (let i = 1; i < 5; i++) {
    let tempY = y - i;
    if (tempY < 0 || cheeks[tempY][x] !== flag) break;
    num++;
  }
  // Check downward
  for (let i = 1; i < 5; i++) {
    let tempY = y + i;
    if (tempY > 14 || cheeks[tempY][x] !== flag) break;
    num++;
  }
  return num >= 5;
}

function left_right(x, y, flag) {
  let num = 1;
  // Check left
  for (let i = 1; i < 5; i++) {
    let tempX = x - i;
    if (tempX < 0 || cheeks[y][tempX] !== flag) break;
    num++;
  }
  // Check right
  for (let i = 1; i < 5; i++) {
    let tempX = x + i;
    if (tempX > 14 || cheeks[y][tempX] !== flag) break;
    num++;
  }
  return num >= 5;
}

function lu_rd(x, y, flag) {
  let num = 1;
  // Check left-up
  for (let i = 1; i < 5; i++) {
    let tempX = x - i;
    let tempY = y - i;
    if (tempX < 0 || tempY < 0 || cheeks[tempY][tempX] !== flag) break;
    num++;
  }
  // Check right-down
  for (let i = 1; i < 5; i++) {
    let tempX = x + i;
    let tempY = y + i;
    if (tempX > 14 || tempY > 14 || cheeks[tempY][tempX] !== flag) break;
    num++;
  }
  return num >= 5;
}

function ru_ld(x, y, flag) {
  let num = 1;
  // Check right-up
  for (let i = 1; i < 5; i++) {
    let tempX = x + i;
    let tempY = y - i;
    if (tempX > 14 || tempY < 0 || cheeks[tempY][tempX] !== flag) break;
    num++;
  }
  // Check left-down
  for (let i = 1; i < 5; i++) {
    let tempX = x - i;
    let tempY = y + i;
    if (tempX < 0 || tempY > 14 || cheeks[tempY][tempX] !== flag) break;
    num++;
  }
  return num >= 5;
}

// Initialize game when page loads
window.onload = play;