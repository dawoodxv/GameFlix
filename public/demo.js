class DemoGame {
  constructor() {
    // Global constants
    this.WIDTH = 700;
    this.HEIGHT = 600;
    this.TARGET_X = (this.WIDTH * 4) / 7;
    this.TARGET_Y = this.HEIGHT / 6;
    this.NUM_OF_WELLS = 7;
    this.WELL_SIZE = this.HEIGHT / 15;
    this.WELL_SPACING = this.WELL_SIZE / 5;
    this.WELL_LEFT = this.WIDTH / 15;
    this.WELL_RIGHT =
      this.WELL_LEFT + this.WELL_SIZE * 7 + this.WELL_SPACING * 6;
    this.SCORE_LABEL_X = (this.WIDTH * 2) / 5;
    this.SCORE_LABEL_Y = (this.HEIGHT * 17) / 20;
    this.SCORE_LABEL_WIDTH = this.WIDTH / 4;
    this.SCORE_LABEL_HEIGHT = this.HEIGHT / 18;
    this.TEXT_SIZE = this.HEIGHT / 30;
    this.NUM_OF_COLS = 8;
    this.NUM_OF_ROWS = 12;
    this.GRID_WIDTH = (this.WIDTH * 7) / 20;
    this.GRID_HEIGHT = (this.HEIGHT * 3) / 5;
    this.GRID_X = this.WIDTH / 10;
    this.GRID_Y = this.HEIGHT / 6;
    this.CELL_SIZE = this.GRID_WIDTH / 8;
    this.CIRCLE_SIZE = this.GRID_WIDTH / 12;
    this.RED_COLOR = [209, 32, 32];
    this.BLUE_COLOR = [81, 93, 216];
    this.GREEN_COLOR = [33, 175, 32];
    this.YELLOW_COLOR = [245, 239, 116];
    this.ORANGE_COLOR = [245, 146, 25];
    this.PURPLE_COLOR = [178, 25, 245];
    this.WHITE_COLOR = [255, 255, 255];
    this.GREY_COLOR = [125, 125, 125];

    // Local variables
    this.wellX = 0;
    this.wellY = 0;
    this.cellX;
    this.cellY;
    this.rowCircleX = this.GRID_X - this.CELL_SIZE / 2;
    this.rowCircleY;
    this.columnCircleX;
    this.columnCircleY = this.GRID_Y - this.CELL_SIZE / 2;
    this.cellSelected = -1;
    this.colSelected = -1;
    this.rowSelected = -1;
    this.rowSelectorSelected = -1;
    this.colSelectorSelected = -1;
    this.colorSelected;
    this.wellSelected;
    this.numMoves = 0;
    this.targetImage = String(Math.floor(Math.random() * 4));
  }

  preload() {
  }

  setup() {
  }

  draw() {
  
  }

  drawColouringGrid(numCols, numRows, cellSize, xOffset, yOffset) {
    for (let i = 0; i < numCols; i++) {
      this.cellX = cellSize * i;
      for (let j = 0; j < numRows; j++) {
        this.cellY = cellSize * j;
        stroke(this.GREY_COLOR);
        noFill();
        rect(this.cellX + xOffset, this.cellY + yOffset, cellSize, cellSize);
      }
    }

    this.colSelected = this.cellSelected % numCols;
    this.rowSelected = Math.floor(this.cellSelected / numCols);

    for (let i = 0; i < numCols; i++) {
      this.cellX = cellSize * i;
      for (let j = 0; j < numRows; j++) {
        this.cellY = cellSize * j;
        if (this.colSelected === i && this.rowSelected === j) {
          stroke(this.RED_COLOR);
          noFill();
          rect(this.cellX + xOffset, this.cellY + yOffset, cellSize, cellSize);
        }
      }
    }
  }

  drawTarget(x, y) {
    image(this.targetImage, x, y);
  }

  drawScoreLabel(x, y, labelWidth, labelHeight, labelSize) {
    fill(this.WHITE_COLOR);
    stroke(this.GREY_COLOR);
    rect(x, y, labelWidth, labelHeight);

    let scoreLabel = "Num moves: " + this.numMoves;
    let scoreLabelX = x + (labelWidth - textWidth(scoreLabel)) / 2;
    let scoreLabelY = y + (labelHeight + textAscent()) / 4;

    fill(0);
    textSize(labelSize);
    text(scoreLabel, scoreLabelX, scoreLabelY);
  }

  drawRowSelectors(x, y, circleSize, numRows, cellSize, gridY) {
    for (let i = 0; i < numRows; i++) {
      y = gridY + cellSize / 2 + cellSize * i;
      noFill();
      stroke(this.GREY_COLOR);
      circle(x, y, circleSize);

      if (i === this.rowSelectorSelected) {
        stroke(this.RED_COLOR);
        circle(x, y, circleSize);
      }
    }
  }

  drawColumnSelectors(x, y, circleSize, numCols, cellSize, gridX) {
    for (let i = 0; i < numCols; i++) {
      x = gridX + cellSize / 2 + cellSize * i;
      noFill();
      stroke(this.GREY_COLOR);
      circle(x, y, circleSize);

      if (i === this.colSelectorSelected) {
        stroke(this.RED_COLOR);
        circle(x, y, circleSize);
      }
    }
  }

  mouseClicked() {
    if (
      mouseY > this.GRID_Y &&
      mouseY < this.GRID_Y + this.GRID_HEIGHT &&
      mouseX > this.GRID_X &&
      mouseX < this.GRID_X + this.GRID_WIDTH
    ) {
      this.cellSelected = this.checkCellNumber(
        mouseX - this.GRID_X,
        mouseY - this.GRID_Y
      );
    }

    if (
      mouseY > this.GRID_Y &&
      mouseY < this.GRID_Y + this.GRID_HEIGHT &&
      mouseX < this.GRID_X &&
      mouseX > this.GRID_X - this.CELL_SIZE
    ) {
      this.rowSelectorSelected = this.checkRowSelectorSelected(
        mouseY - this.GRID_Y
      );
    }

    if (
      mouseY < this.GRID_Y &&
      mouseY > this.GRID_Y - this.CELL_SIZE &&
      mouseX > this.GRID_X &&
      mouseX < this.GRID_X + this.GRID_WIDTH
    ) {
      this.colSelectorSelected = this.checkColumnSelectorSelected(
        mouseX - this.GRID_X
      );
    }

    if (
      mouseX > this.WELL_LEFT &&
      mouseX < this.WELL_RIGHT &&
      mouseY < this.WELL_SIZE
    ) {
      this.numMoves++;
      this.checkColorSelection(mouseX - this.WELL_LEFT);
      this.applyColorCell(this.cellSelected, this.colorSelected);
      this.applyColorColumn(
        this.cellX,
        this.cellY,
        this.colorSelected,
        this.CELL_SIZE,
        this.GRID_HEIGHT,
        this.NUM_OF_COLS,
        this.GRID_X,
        this.GRID_Y
      );
      this.applyColorRow(
        this.cellX,
        this.cellY,
        this.colorSelected,
        240,
        this.CELL_SIZE,
        this.NUM_OF_ROWS,
        this.GRID_X,
        this.GRID_Y
      );
      this.cellSelected = -1;
      this.rowSelectorSelected = -1;
      this.colSelectorSelected = -1;
    }
  }

  checkCellNumber(x, y) {
    this.colSelected = Math.floor(x / this.CELL_SIZE);
    this.rowSelected = Math.floor(y / this.CELL_SIZE);
    let cellNumber = this.colSelected + this.rowSelected * this.NUM_OF_COLS;
    if (this.cellSelected === cellNumber) {
      cellNumber = -1;
    }
    return cellNumber;
  }

  checkRowSelectorSelected(y) {
    let rowNumber = Math.floor(y / this.CELL_SIZE);
    if (this.rowSelectorSelected === rowNumber) {
      rowNumber = -1;
    }
    return rowNumber;
  }

  checkColumnSelectorSelected(x) {
    let colNumber = Math.floor(x / this.CELL_SIZE);
    if (this.colSelectorSelected === colNumber) {
      colNumber = -1;
    }
    return colNumber;
  }

  checkColorSelection(x) {
    this.wellSelected = Math.floor(x / (this.WELL_SIZE + this.WELL_SPACING));
    switch (this.wellSelected) {
      case 0:
        this.colorSelected = this.RED_COLOR;
        break;
      case 1:
        this.colorSelected = this.BLUE_COLOR;
        break;
      case 2:
        this.colorSelected = this.GREEN_COLOR;
        break;
      case 3:
        this.colorSelected = this.YELLOW_COLOR;
        break;
      case 4:
        this.colorSelected = this.ORANGE_COLOR;
        break;
      case 5:
        this.colorSelected = this.PURPLE_COLOR;
        break;
      case 6:
        this.colorSelected = this.WHITE_COLOR;
        break;
    }
  }

  applyColorCell(cell, fillColor) {
    this.colSelected = cell % this.NUM_OF_COLS;
    this.rowSelected = Math.floor(cell / this.NUM_OF_COLS);

    for (let i = 0; i < this.NUM_OF_COLS; i++) {
      this.cellX = this.CELL_SIZE * i;
      for (let j = 0; j < this.NUM_OF_ROWS; j++) {
        this.cellY = this.CELL_SIZE * j;
        if (this.colSelected === i && this.rowSelected === j) {
          fill(fillColor);
          stroke(this.GREY_COLOR[0], this.GREY_COLOR[1], this.GREY_COLOR[2]);
          rect(
            this.cellX + this.GRID_X,
            this.cellY + this.GRID_Y,
            this.CELL_SIZE,
            this.CELL_SIZE
          );
        }
      }
    }
  }

  applyColorColumn(
    colX,
    colY,
    fillColor,
    rectWidth,
    rectHeight,
    numCols,
    xOffset,
    yOffset
  ) {
    for (let i = 0; i < numCols; i++) {
      colX = rectWidth * i;
      colY = 0;
      if (this.colSelectorSelected === i) {
        fill(fillColor);
        rect(colX + xOffset, colY + yOffset, rectWidth, rectHeight);
      }
    }
  }

  applyColorRow(
    rowX,
    rowY,
    fillColor,
    rectWidth,
    rectHeight,
    numRows,
    xOffset,
    yOffset
  ) {
    for (let i = 0; i < numRows; i++) {
      rowY = rectHeight * i;
      rowX = 0;
      if (this.rowSelectorSelected === i) {
        fill(fillColor);
        rect(rowX + xOffset, rowY + yOffset, rectWidth, rectHeight);
      }
    }
  }
}

// Create an instance of the PuzzleGame
const pGame = new DemoGame();

// Preload the target image
window.preload = function () {
  pGame.preload();
};

// Set up the game
window.setup = function () {
  pGame.setup();
};

// Add the draw function to the global scope
window.draw = function () {
  pGame.draw();
};

// Add the mouseClicked function to the global scope
window.mouseClicked = function () {
  pGame.mouseClicked();
};