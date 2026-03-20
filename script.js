const square = document.getElementById("square");
const newGame = document.getElementById("newGame");
let WAIT_ANIMATION = false;

const getBricksArray = () => [...square?.childNodes];

const beginNewGame = () => {
  // Создаем и перемешиваем массив
  let tiles = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  // Проверяем разрешимость
  let inv = 0;
  for (let i = 0; i < 16; i++) {
      if (tiles[i] === 0) continue;
      for (let j = i + 1; j < 16; j++) {
          if (tiles[j] === 0) continue;
          if (tiles[i] > tiles[j]) inv++;
      }
  }
    
  const emptyRow = 4 - Math.floor(tiles.indexOf(0) / 4);
  
  // Если неразрешима - меняем две первые фишки
  if ((inv + emptyRow) % 2 !== 0) {
      let first = tiles.findIndex(x => x !== 0);
      let second = tiles.findIndex((x, idx) => x !== 0 && idx > first);
      [tiles[first], tiles[second]] = [tiles[second], tiles[first]];
  }
  
  const bricks = [];
  while (tiles.length > 0) {
    const brick = tiles.splice(0, 1).at(0);
    bricks.push(`<b data-brick-id=${bricks.length}>${brick || ''}</b>`);
  }
  square.innerHTML = bricks.join('');
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
