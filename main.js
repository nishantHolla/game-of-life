const DOM_CANVAS = document.querySelector("canvas");
const DOM_ACTION_BOX = document.querySelector("#action-box");

const COLOR_CANVAS_BG = [255, 255, 255];
const COLOR_CANVAS_FG = [0, 0, 0];
const COLOR_CELL_ALIVE = [0, 0, 0];

const COLUMNS = 27;
const ROWS = 15;
const CELL_SIZE = 60;

let GRID = new Array(COLUMNS);

function getCanvasSize() {
  return [COLUMNS * CELL_SIZE, ROWS * CELL_SIZE];
}

function initGrid(grid) {
  for (let i=0; i<COLUMNS; i++) {
    GRID[i] = new Array(ROWS);
    for (let j=0; j<ROWS; j++) {
      GRID[i][j] = 0;
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
      if (GRID[i][j]) {
        rect(i * CELL_SIZE, j * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function setup() {
  createCanvas(...getCanvasSize(), P2D, DOM_CANVAS);
  initGrid();
}

function draw() {
  background(...COLOR_CANVAS_BG);
  drawGrid();
  drawCells();
}

function windowResized() {
  resizeCanvas(...getCanvasSize());
}

function mouseClicked() {
  let col = floor(mouseX / CELL_SIZE);
  let row = floor(mouseY / CELL_SIZE);

  GRID[col][row] = GRID[col][row] === 1 ? 0 : 1;
}
