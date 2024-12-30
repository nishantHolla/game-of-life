const DOM_CANVAS = document.querySelector("canvas");
const DOM_ACTION_BOX = document.querySelector("#action-box");
const DOM_GENERATION_COUNT = document.querySelector("#generation-count");
const DOM_POPULATION_COUNT = document.querySelector("#population-count");
const DOM_PLAY_BUTTON = document.querySelector("#play-button");
const DOM_RESET_BUTTON = document.querySelector("#reset-button");

const COLOR_CANVAS_BG = [255, 255, 255];
const COLOR_CANVAS_FG = [0, 0, 0];
const COLOR_CELL_ALIVE = [0, 0, 0];

const COLUMNS = 63;
const ROWS = 33;
const CELL_SIZE = 30;

const FRAME_RATE = 10

const GAME = {
  grid: null,
  generation: 0,
  population: 0,
  isPlaying: false
}

function getCanvasSize() {
  return [COLUMNS * CELL_SIZE, ROWS * CELL_SIZE];
}

function initGrid() {
  let grid = new Array(COLUMNS);
  for (let i=0; i<COLUMNS; i++) {
    grid[i] = new Array(ROWS);
    for (let j=0; j<ROWS; j++) {
      grid[i][j] = 0;
    }
  }

  return grid;
}

function drawGrid() {
  stroke(...COLOR_CANVAS_FG);
  strokeWeight(1);

  for (let i=0; i<COLUMNS + 1; i++) {
    line(CELL_SIZE * i, 0, CELL_SIZE * i, CELL_SIZE * ROWS);
  }

  for (let j=0; j<ROWS + 1; j++) {
    line(0, CELL_SIZE * j, CELL_SIZE * COLUMNS, CELL_SIZE * j);
  }
}

function drawCells() {
  stroke(...COLOR_CELL_ALIVE);
  fill(...COLOR_CELL_ALIVE);

  for (let i=0; i<COLUMNS; i++) {
    for (let j=0; j<ROWS; j++) {
      if (GAME.grid[i][j]) {
        rect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function updateGeneration() {
  DOM_GENERATION_COUNT.innerText = `Generation: ${GAME.generation}`;
}

function updatePopulation() {
  DOM_POPULATION_COUNT.innerText = `Population: ${GAME.population}`;
}

function updatePlay(toggle) {
  if (toggle) {
    GAME.isPlaying = !GAME.isPlaying;
  }

  if (GAME.isPlaying) {
    DOM_PLAY_BUTTON.innerText = "Pause";
  }
  else {
    DOM_PLAY_BUTTON.innerText = "Play";
  }
}

function resetGame() {
  GAME.isPlaying = false;
  GAME.population = 0;
  GAME.generation = 0;
  GAME.grid = initGrid();
}

function getNeighbourCount(x, y) {
  let count = 0;

  for (let i=-1; i<2; i++) {
    for (let j=-1; j<2; j++) {
      if ((!i && !j) || x+i < 0 || y+j < 0 || x+i >= COLUMNS || y+j >= ROWS) {
        continue;
      }
      if (GAME.grid[x+i][y+j]) {
        count++;
      }
    }
  }

  return count;
}

function updateGrid() {
  let newGrid = initGrid();

  for (let i=0; i<COLUMNS; i++) {
    for (let j=0; j<ROWS; j++) {
      let count = getNeighbourCount(i, j);
      if (GAME.grid[i][j]) {
        newGrid[i][j] = (count > 3 || count < 2) ? 0 : 1;
        if (newGrid[i][j] ^ GAME.grid[i][j]) {
          GAME.population += newGrid[i][j] ? 1 : -1;
        }
      }
      else {
        newGrid[i][j] = count === 3 ? 1 : 0;
        if (newGrid[i][j] ^ GAME.grid[i][j]) {
          GAME.population += newGrid[i][j] ? 1 : -1;
        }
      }
    }
  }

  GAME.grid = newGrid;
}

function setup() {
  GAME.grid = initGrid();
  frameRate(FRAME_RATE);
  createCanvas(...getCanvasSize(), P2D, DOM_CANVAS);
  updatePlay(false);

  DOM_PLAY_BUTTON.addEventListener('click', () => {updatePlay(true)})
  DOM_RESET_BUTTON.addEventListener('click', () => {resetGame()})
}

function draw() {
  background(...COLOR_CANVAS_BG);

  drawGrid();
  drawCells();

  updateGeneration();
  updatePopulation();

  if (GAME.isPlaying) {
    updateGrid();
    GAME.generation++;
  }
}

function windowResized() {
  resizeCanvas(...getCanvasSize());
}

function mouseClicked() {
  let col = floor(mouseX / CELL_SIZE);
  let row = floor(mouseY / CELL_SIZE);

  if (col < 0 || row < 0 || GAME.isPlaying || GAME.generation !== 0) {
    return;
  }

  if (GAME.grid[col][row]) {
    GAME.grid[col][row] = 0;
    GAME.population--;
  }
  else {
    GAME.grid[col][row] = 1;
    GAME.population++;
  }
}
