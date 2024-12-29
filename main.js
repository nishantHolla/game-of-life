const DOM_CANVAS = document.querySelector("canvas");
const DOM_ACTION_BOX = document.querySelector("#action-box");
const DOM_GENERATION_COUNT = document.querySelector("#generation-count");
const DOM_POPULATION_COUNT = document.querySelector("#population-count");
const DOM_PLAY_BUTTON = document.querySelector("#play-button");

const COLOR_CANVAS_BG = [255, 255, 255];
const COLOR_CANVAS_FG = [0, 0, 0];
const COLOR_CELL_ALIVE = [0, 0, 0];

const COLUMNS = 27;
const ROWS = 15;
const CELL_SIZE = 60;

const FRAME_RATE = 10

const GAME = {
  grid: new Array(COLUMNS),
  generation: 0,
  population: 0,
  isPlaying: false
}

function getCanvasSize() {
  return [COLUMNS * CELL_SIZE, ROWS * CELL_SIZE];
}

function initGrid(grid) {
  for (let i=0; i<COLUMNS; i++) {
    GAME.grid[i] = new Array(ROWS);
    for (let j=0; j<ROWS; j++) {
      GAME.grid[i][j] = 0;
    }
  }
}

function drawGrid() {
  stroke(...COLOR_CANVAS_FG);
  strokeWeight(4);

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

function setup() {
  frameRate(FRAME_RATE);
  createCanvas(...getCanvasSize(), P2D, DOM_CANVAS);
  initGrid();
  updatePlay(false);

  DOM_PLAY_BUTTON.addEventListener('click', () => {updatePlay(true)})
}

function draw() {
  background(...COLOR_CANVAS_BG);

  drawGrid();
  drawCells();

  updateGeneration();
  updatePopulation();

  if (GAME.isPlaying) {
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
