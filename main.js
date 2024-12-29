const DOM_CANVAS = document.querySelector("canvas");
const DOM_ACTION_BOX = document.querySelector("#action-box");

const COLOR_CANVAS_BG = [255, 255, 255];
const COLOR_CANVAS_FG = [0, 0, 0];

const COLUMNS = 27;
const ROWS = 15;
const CELL_SIZE = 60;

let GRID[COLUMNS][ROWS];

function getCanvasSize() {
  return [COLUMNS * CELL_SIZE, ROWS * CELL_SIZE];
}

function initGrid(grid) {
  for (let i=0; i<COLUMNS; i++) {
    for (let j=0; j<ROWS; j++) {
      GRID[i][j] = 0;
    }
  }
}

function drawGrid() {
  stroke(...COLOR_CANVAS_FG);

  for (let i=0; i<COLUMNS + 1; i++) {
    line(CELL_SIZE * i, 0, CELL_SIZE * i, CELL_SIZE * ROWS);
  }

  for (let j=0; j<ROWS + 1; j++) {
    line(0, CELL_SIZE * j, CELL_SIZE * COLUMNS, CELL_SIZE * j);
  }
}

function setup() {
  createCanvas(...getCanvasSize(), P2D, DOM_CANVAS);
  initGrid();
}

function draw() {
  background(...COLOR_CANVAS_BG);
  drawGrid();
}

function windowResized() {
  resizeCanvas(...getCanvasSize());
}
