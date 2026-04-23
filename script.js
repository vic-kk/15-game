const square = document.getElementById("square");
const newGame = document.getElementById("newGame");
let WAIT_ANIMATION = false;

const getBricksArray = () => [...square?.childNodes];

const beginNewGame = () => {
  let tiles = Array.from({length: 15}, (_, i) => i + 1);
  tiles.push('');
  
  const shuffleMoves = 200;
  let emptyIndex = 15;
  for (let i = 0; i < shuffleMoves; i++) {
    const neighbors = [];
    const row = Math.floor(emptyIndex / 4);
    const col = emptyIndex % 4;
    
    if (row > 0) neighbors.push(emptyIndex - 4); // верх
    if (row < 3) neighbors.push(emptyIndex + 4); // низ
    if (col > 0) neighbors.push(emptyIndex - 1); // лево
    if (col < 3) neighbors.push(emptyIndex + 1); // право
    
    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    [tiles[emptyIndex], tiles[randomNeighbor]] = [tiles[randomNeighbor], tiles[emptyIndex]];
    emptyIndex = randomNeighbor;
  }
  
  const randomPositions = tiles.map((tile, index) => `<b data-brick-id=${index}>${tile}</b>`);
  square.innerHTML = randomPositions.join('');
};

const checkWinner = () => {
  const bricks = getBricksArray();
  for (var i = bricks.length - 1; i > 0; i--) {
    if (i != bricks[i - 1].innerHTML) break;
    if (i == 1) alert("Congrats! You won the game!");
  };
};

const findDirection = (from_id, to_id) => {
  if (from_id % 4 == to_id % 4) { // in column
    if (from_id - 4 == to_id) return "up";
    if (from_id + 4 == to_id) return "down";
  };
  if (~~(from_id / 4) == ~~(to_id / 4)) { // in row
    if ((from_id % 4) - 1 == to_id % 4) return "left";
    if ((from_id % 4) + 1 == to_id % 4) return "right";
  };
  return null;
}

const moveBrick = (from_id, to_id, direction) => {
  if (!direction) return;
  WAIT_ANIMATION = true;
  const bricks = getBricksArray();
  const delay = getComputedStyle(bricks[from_id]).transitionDuration.replace(/[a-z]/,'') * 1000;
  bricks[from_id].classList.add(`--${direction}`);
  setTimeout(() => {
    bricks[to_id].innerHTML = bricks[from_id].innerHTML;
    bricks[from_id].classList.remove(`--${direction}`);
    bricks[from_id].innerHTML = '';
    WAIT_ANIMATION = false;
    checkWinner();
  }, delay);
};

const fieldClickHandler = ({ target: { dataset: clickedDataset } } = e) => {
  if (WAIT_ANIMATION) return;
  if (!clickedDataset.hasOwnProperty('brickId')) return;
  const clicked_id = Number(clickedDataset.brickId);
  const null_id = Number(getBricksArray().find(brick => brick.innerHTML === '').dataset.brickId);
  const moveDirection = findDirection(clicked_id, null_id);
  if (moveDirection) moveBrick(clicked_id, null_id, moveDirection);
};

newGame.onclick = beginNewGame;
square.onclick = fieldClickHandler;
beginNewGame();
