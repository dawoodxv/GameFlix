if (typeof SpaceshipGame === "undefined") {
  class MinesweeperGame {
    constructor() {
      // Global constants
      this.CELLSIZE = 50;
      this.NUM_ROWS = 10;
      this.NUM_COLS = 12;
      this.TRIANGLE_MARGIN = this.CELLSIZE / 10;
      this.LINE_MARGIN = this.CELLSIZE / 3;
      this.CIRCLE_SIZE = this.CELLSIZE / 5;
      this.WHITE = 250;
      this.BLACK = 0;
      this.RED = "#F20F0F";
      this.BLUE = "#0F1BF2";
      this.YELLOW = "#F1F20F";
      this.GREY = "#C6C6C0";

      // Global variables
      this.cellX;
      this.cellY;
      this.mineCol;
      this.mineRow;
      this.rowNumber;
      this.colNumber;
      this.NUM_MINES = 50;
      this.mineX = [];
      this.mineY = [];
      this.numOfMines = 20;
      this.numMines;
      this.NUM_GUESSES = this.NUM_ROWS * this.NUM_COLS - this.numOfMines;
      this.guessX = [];
      this.guessY = [];
      this.values = [];
      this.numGuesses = 0;
      this.guessFound;
      this.gameWon = false;
      this.stillRunning = true;
      this.score = 0;
      this.youLost;
      this.youWon;
      this.playAgain = "TO PLAY AGAIN PRESS N";
    }

    setup() {
      // Create a p5Canvas
      const canvas = createCanvas(600, 500);
      canvas.class("p5Canvas"); // Add a class to identify the canvas

      const canvasContainer = document.querySelector(".canvas-container");
      canvasContainer.appendChild(canvas.elt);
      this.generateMines(this.mineX, this.mineY, this.numOfMines);
    }

    draw() {
      background(this.GREY);
      this.drawGrid(this.NUM_COLS, this.NUM_ROWS, this.CELLSIZE);
      this.drawNums(this.guessX, this.guessY, this.values, this.numGuesses);

      this.youLost = "GAME OVER! YOU LOST WITH A SCORE OF " + this.score + "!";
      this.youWon = "GAME OVER! YOU WON WITH A SCORE OF " + this.score + "!";

      if (!this.stillRunning) {
        this.drawMines(this.mineX, this.mineY, this.numOfMines);

        if (this.gameWon) {
          textSize(20);
          fill(this.BLACK);
          let textX = (width - textWidth(this.youWon)) / 2;
          let textY = height / 2;
          text(this.youWon, textX, textY);
        } else {
          textSize(20);
          fill(this.BLACK);
          let textX = (width - textWidth(this.youLost)) / 2;
          let textY = height / 2;
          text(this.youLost, textX, textY);
        }

        textSize(20);
        fill(this.BLACK);
        let playAgainX = (width - textWidth(this.playAgain)) / 2;
        let playAgainY = (height + textDescent()) / 2 + this.CELLSIZE;
        text(this.playAgain, playAgainX, playAgainY);
      }
    }

    gameOverText(text) {
      textSize(20);
      fill(this.BLACK);
      let textX = (width - textWidth(text)) / 2;
      let textY = (height + textDescent()) / 2;
      text(text, textX, textY);
    }

    mouseClicked() {
      this.rowNumber = floor(mouseY / this.CELLSIZE);
      this.colNumber = floor(mouseX / this.CELLSIZE);
      this.guessFound = this.search(
        this.mineX,
        this.mineY,
        this.numOfMines,
        this.colNumber,
        this.rowNumber
      );

      if (this.guessFound) {
        this.stillRunning = false;
      } else {
        this.numGuesses = this.insertGuesses(
          this.guessX,
          this.guessY,
          this.values,
          this.numGuesses,
          this.colNumber,
          this.rowNumber
        );

        if (this.numGuesses === this.NUM_GUESSES) {
          this.gameWon = true;
        }
        this.score++;
      }
    }

    keyPressed() {
      if (!this.stillRunning && (key === "N" || key === "n")) {
        this.stillRunning = true;
        this.gameWon = false;
        this.numOfMines = this.numOfMines + 3;
        this.numMines = 0;
        this.numGuesses = 0;
        this.score = 0;
        this.generateMines(this.mineX, this.mineY, this.numOfMines);
      }
    }

    insertGuesses(x, y, value, n, col, row) {
      if (this.search(x, y, n, col, row)) {
        return n;
      }

      x[n] = col;
      y[n] = row;
      let num = 0;

      for (let column = this.colNumber - 1; column < col + 2; column++) {
        for (let roww = this.rowNumber - 1; roww < row + 2; roww++) {
          if (
            column >= 0 &&
            roww >= 0 &&
            !(column === col && roww === row) &&
            this.search(this.mineX, this.mineY, this.numOfMines, column, roww)
          ) {
            num++;
          }
        }
      }

      value[n] = num;
      return n + 1;
    }

    generateMines(x, y, n) {
      for (let i = 0; i < n; i++) {
        do {
          this.mineCol = floor(random(0, this.NUM_COLS));
          this.mineRow = floor(random(0, this.NUM_ROWS));
        } while (this.search(x, y, i, this.mineCol, this.mineRow));
        this.insert(x, y, i, this.mineCol, this.mineRow);
      }
    }

    insert(x, y, n, col, row) {
      if (this.search(x, y, n, col, row)) {
        return n;
      }

      x[n] = col;
      y[n] = row;
      return n + 1;
    }

    search(x, y, n, col, row) {
      let matched = false;

      for (let i = 0; i < n; i++) {
        if (col === x[i] && row === y[i]) {
          matched = true;
        }
      }

      return matched;
    }

    drawGrid(numCols, numRows, size) {
      for (let i = 0; i < numCols; i++) {
        this.cellX = size * i;
        for (let j = 0; j < numRows; j++) {
          this.cellY = size * j;
          fill(this.GREY);
          rect(this.cellX, this.cellY, size, size);
        }
      }
    }

    drawMines(col, row, size) {
      for (let i = 0; i < size; i++) {
        this.drawMine(col[i], row[i]);
      }
    }

    drawNums(col, row, value, size) {
      for (let i = 0; i < size; i++) {
        this.drawNum(col[i], row[i], value[i]);
      }
    }

    drawMine(col, row) {
      this.cellX = this.CELLSIZE * col;
      this.cellY = this.CELLSIZE * row;
      let triangleX1 = this.cellX + this.CELLSIZE / 2;
      let triangleX2 = this.cellX + this.TRIANGLE_MARGIN;
      let triangleX3 = this.cellX + this.CELLSIZE - this.TRIANGLE_MARGIN;
      let triangleY1 = this.cellY + this.TRIANGLE_MARGIN;
      let triangleY2 = this.cellY + this.CELLSIZE - this.TRIANGLE_MARGIN;
      let triangleY3 = this.cellY + this.CELLSIZE - this.TRIANGLE_MARGIN;
      let circleX = this.cellX + this.CELLSIZE / 2;
      let circleY = this.cellY + this.CELLSIZE / 2;
      let lineLeftX = this.cellX + this.LINE_MARGIN;
      let lineRightX = this.cellX + this.CELLSIZE - this.LINE_MARGIN;
      let lineY = this.cellY + this.CELLSIZE - this.LINE_MARGIN;
      fill(this.WHITE);
      rect(this.cellX, this.cellY, this.CELLSIZE, this.CELLSIZE);
      fill(this.RED);
      triangle(
        triangleX1,
        triangleY1,
        triangleX2,
        triangleY2,
        triangleX3,
        triangleY3
      );
      fill(this.YELLOW);
      ellipse(circleX, circleY, this.CIRCLE_SIZE, this.CIRCLE_SIZE);
      fill(this.BLACK);
      strokeWeight(5);
      line(lineLeftX, lineY, lineRightX, lineY);
      strokeWeight(1);
    }

    drawNum(col, row, n) {
      // Local variables for the X and Y coordinates of the cells
      this.cellX = this.CELLSIZE * col;
      this.cellY = this.CELLSIZE * row;

      // Local variables for the numbers position and the number
      let fontSize = min(40, this.CELLSIZE * 0.8); // Ensure font size fits in the cell
      textSize(fontSize);

      let num = str(n);

      // Calculate the exact center of the cell
      let centerX = this.cellX + this.CELLSIZE / 2;
      let centerY = this.cellY + this.CELLSIZE / 2;

      // Calculate the starting position for the text
      let numX = centerX - textWidth(num) / 2;
      let numY = centerY + textWidth(num) / 2;

      // Draw cell
      fill(this.WHITE);
      rect(this.cellX, this.cellY, this.CELLSIZE, this.CELLSIZE);

      // Draw the numbers inside the cell
      fill(this.BLUE);
      text(num, numX, numY);
    }
  }

  // Initialize MinesweeperGame
  function initializeMinesweeperGame() {
    // Create an instance of the MinesweeperGame
    const mGame = new MinesweeperGame();

    // Set up the game
    mGame.setup();

    // Add the draw function to the global scope
    window.draw = function () {
      mGame.draw();
    };

    // Add the mouseClicked function to the global scope
    window.mouseClicked = function () {
      mGame.mouseClicked();
    };

    // Add the keyPressed function to the global scope
    window.keyPressed = function () {
      mGame.keyPressed();
    };
  }

  // Listen for the load event and call the initialization function
  window.addEventListener("load", initializeMinesweeperGame);
}
