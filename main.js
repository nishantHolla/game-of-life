const DOM_CANVAS = document.querySelector("canvas");
const DOM_ACTION_BOX = document.querySelector("#action-box");
const DOM_GENERATION_COUNT = document.querySelector("#generation-count");
const DOM_POPULATION_COUNT = document.querySelector("#population-count");
const DOM_PLAY_BUTTON = document.querySelector("#play-button");
const DOM_RESET_BUTTON = document.querySelector("#reset-button");
const DOM_SPEED_SLIDER = document.querySelector("#speed-slider");
const DOM_SAVE_TO_FILE = document.querySelector("#save-to-file-button");
const DOM_LOAD_FROM_FILE = document.querySelector("#load-from-file-button");
const DOM_LOAD_FROM_FILE_INPUT = document.querySelector("#load-from-file-input");

const COLOR_CANVAS_BG = [255, 255, 255];
const COLOR_CANVAS_FG = [0, 0, 0];
const COLOR_CELL_ALIVE = [0, 0, 0];

const BASE = 5;
const COLUMNS = 63;
const ROWS = 33;
const CELL_SIZE = 30;

const FRAME_RATE = parseInt(DOM_SPEED_SLIDER.value);

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

function updateFrameRate(value) {
  if (value > 0 && value < 101) {
    frameRate(value);
  }
}

function saveToFile() {
  let text = `${GAME.generation} ${GAME.population}\n`;

  let count = 0;
  let buffer = '';

  for (let i=0; i<ROWS; i++) {
    for (let j=0; j<COLUMNS; j++) {
      count++;
      buffer += String(GAME.grid[j][i]);
      if (count == BASE) {
        text += parseInt(buffer, 2).toString(Math.pow(2, BASE));
        count = 0;
        buffer = '';
      }
    }
  }

  const blob = new Blob([text], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `GameOfLife-${Date.now()}.txt`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function loadFromString(content) {
  const line1 = content[0].split(' ');
  const generation = parseInt(line1[0]);
  const population = parseInt(line1[1]);
  const state = content[1];

  if (isNaN(generation) || isNaN(population) || !state || state.length != 415) {
    alert("File format is incorrect");
  }
  else {
    GAME.population = population;
    GAME.generation = generation;
  }

  let row = 0;
  let col = 0;

  for (let i=0; i<state.length; i++) {
    let binaryString = parseInt(state[i], Math.pow(2, BASE)).toString(2);
    while (binaryString.length < BASE) {
      binaryString = '0' + binaryString;
    }
    for (let j=0; j<BASE; j++) {
      GAME.grid[col][row] = parseInt(binaryString[j]);
      col++;
      if (col == COLUMNS) {
        row++;
        col = 0;
      }
    }
  }

}

function loadFromFile(file) {
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result.split('\n');
    loadFromString(content);
  }
  reader.readAsText(file);
}

function setup() {
  GAME.grid = initGrid();
  createCanvas(...getCanvasSize(), P2D, DOM_CANVAS);
  updateFrameRate(FRAME_RATE);
  updatePlay(false);

  DOM_PLAY_BUTTON.addEventListener('click', () => {updatePlay(true)})
  DOM_RESET_BUTTON.addEventListener('click', () => {resetGame()})
  DOM_SPEED_SLIDER.addEventListener('change', (e) => {updateFrameRate(parseInt(e.target.value))})
  DOM_SAVE_TO_FILE.addEventListener('click', () => {saveToFile()})
  DOM_LOAD_FROM_FILE.addEventListener('click', () => {DOM_LOAD_FROM_FILE_INPUT.click()})
  DOM_LOAD_FROM_FILE_INPUT.addEventListener('change', (e) => {
    loadFromFile(e.target.files[0])}
  )
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
