if (typeof SpaceshipGame === "undefined") {
  class SpaceshipGame {
    constructor() {
      // Global constants
      this.WIDTH = 600;
      this.HEIGHT = 300;
      this.CENTER_X = this.WIDTH / 2;
      this.CENTER_Y = this.HEIGHT / 2;
      this.SHIP_SPEED = (this.WIDTH * 3) / 1500;
      this.TURN_ANGLE = 0.02;
      this.ARM_LENGTH = this.HEIGHT;

      // Global variables to draw the ship
      this.shipNoseX;
      this.shipNoseY;
      this.directionAngle;
      this.shipLength;
      this.shipAngle;
      this.shipCenterX;
      this.shipCenterY;
      this.shipPointSize;

      // Global variables to move the ship
      this.shipMoving = true;
      this.spacePressed = true;
      this.velocityX;
      this.velocityY;

      // Global variables for the obstacle
      this.obstacleAngle = Math.random() * Math.PI * 2;
      this.turnSpeed = 0.005;

      // Global variables for the target
      this.level = 1;
      this.targetLength = this.HEIGHT / 3;
      this.targetX = this.WIDTH - 5 / 3;
      this.targetUpperY = Math.random() * (this.HEIGHT - this.targetLength);
      this.targetLowerY = this.targetUpperY + this.targetLength;
    }

    setup() {
      // Create a p5Canvas
      const canvas = createCanvas(this.WIDTH, this.HEIGHT);
      canvas.class("p5Canvas"); // Add a class to identify the canvas

      // Append the p5Canvas to the "canvas-container" div
      const canvasContainer = document.querySelector(".canvas-container");
      canvasContainer.appendChild(canvas.elt);

      // Rest of the setup function
      this.shipNoseX = this.CENTER_X / 5;
      this.shipNoseY = this.CENTER_Y;
      this.directionAngle = radians(180);
      this.shipLength = (this.WIDTH * 3) / 50;
      this.shipAngle = radians(15);
      this.shipPointSize = this.WIDTH / 150;
    }

    draw() {
      background(0, 0, 130);
      this.drawShip();
      this.moveShip();
      if (this.shipMoving) {
        this.resetShip();
        this.shipMoving = false;
      }
      this.drawObstacle();
      this.turnObstacle();
      this.checkCollision();
      this.drawTarget();
      this.drawLevel();
      this.increaseLevel();
    }

    drawShip() {
      const shipRightX =
        this.shipNoseX +
        this.shipLength * Math.cos(this.directionAngle + this.shipAngle);
      const shipRightY =
        this.shipNoseY -
        this.shipLength * Math.sin(this.directionAngle + this.shipAngle);
      const shipLeftX =
        this.shipNoseX +
        this.shipLength * Math.cos(this.directionAngle - this.shipAngle);
      const shipLeftY =
        this.shipNoseY -
        this.shipLength * Math.sin(this.directionAngle - this.shipAngle);

      stroke(1);
      strokeWeight(1);
      fill(255, 255, 0);
      triangle(
        this.shipNoseX,
        this.shipNoseY,
        shipRightX,
        shipRightY,
        shipLeftX,
        shipLeftY
      );

      this.shipCenterX = (this.shipNoseX + shipRightX + shipLeftX) / 3;
      this.shipCenterY = (this.shipNoseY + shipRightY + shipLeftY) / 3;

      fill(0);
      ellipse(
        this.shipCenterX,
        this.shipCenterY,
        this.shipPointSize,
        this.shipPointSize
      );
    }

    moveShip() {
      if (this.spacePressed) {
        this.velocityX = this.SHIP_SPEED * Math.cos(this.directionAngle);
        this.velocityY = this.SHIP_SPEED * Math.sin(this.directionAngle);
        this.shipNoseX += -1 * this.velocityX;
        this.shipNoseY += this.velocityY;
      }
      if (
        this.shipNoseX >= this.WIDTH ||
        this.shipNoseX <= 0 ||
        this.shipNoseY >= this.HEIGHT ||
        this.shipNoseY <= 0
      ) {
        this.resetShip();
      }
      if (keyIsPressed && (key === "A" || key === "a")) {
        this.directionAngle += this.TURN_ANGLE;
      } else if (keyIsPressed && (key === "D" || key === "d")) {
        this.directionAngle -= this.TURN_ANGLE;
      }
    }

    keyPressed() {
      if (key == " ") {
        this.spacePressed = true;
      }
    }

    resetShip() {
      this.shipNoseX = this.CENTER_X / 5;
      this.shipNoseY = this.CENTER_Y;
      this.directionAngle = radians(180);
      this.spacePressed = false;
      this.targetUpperY = Math.random() * (this.HEIGHT - this.targetLength);
      this.targetLowerY = this.targetUpperY + this.targetLength;
    }

    drawObstacle() {
      stroke(255, 0, 0);
      strokeWeight(10);
      const lineEnd1X =
        this.CENTER_X +
        (this.ARM_LENGTH / 2) * Math.cos(TWO_PI - this.obstacleAngle);
      const lineEnd1Y =
        this.CENTER_Y +
        (this.ARM_LENGTH / 2) * Math.sin(TWO_PI + this.obstacleAngle);
      const lineEnd2X =
        this.CENTER_X -
        (this.ARM_LENGTH / 2) * Math.cos(TWO_PI - this.obstacleAngle);
      const lineEnd2Y =
        this.CENTER_Y -
        (this.ARM_LENGTH / 2) * Math.sin(TWO_PI + this.obstacleAngle);
      line(lineEnd1X, lineEnd1Y, lineEnd2X, lineEnd2Y);
    }

    turnObstacle() {
      this.obstacleAngle += this.turnSpeed;
    }

    checkCollision() {
      const distanceDifference = dist(
        this.shipCenterX,
        this.shipCenterY,
        this.CENTER_X,
        this.CENTER_Y
      );
      let angleDifference = Math.atan2(
        this.shipCenterY - this.CENTER_Y,
        this.shipCenterX - this.CENTER_X
      );
      if (angleDifference < 0) {
        angleDifference += Math.PI;
      }
      this.obstacleAngle = this.obstacleAngle % Math.PI;

      if (
        distanceDifference <= 15 ||
        (distanceDifference <= this.ARM_LENGTH / 2 &&
          Math.abs(angleDifference - this.obstacleAngle) <= 0.3)
      ) {
        this.resetShip();
      }
    }

    drawTarget() {
      stroke("#34F753");
      strokeWeight(10);
      line(this.targetX, this.targetUpperY, this.targetX, this.targetLowerY);
    }

    drawLevel() {
      textSize(20);
      fill(255);
      const printLevel = "Current level: " + this.level;
      text(printLevel, 30, textAscent() + 10);
    }

    increaseLevel() {
      let enteredTarget = false;

      if (
        this.shipNoseX >= this.targetX &&
        this.shipNoseY >= this.targetUpperY &&
        this.shipNoseY <= this.targetLowerY &&
        !this.shipMoving &&
        !enteredTarget
      ) {
        enteredTarget = true;

        this.level = this.level + 1;
        this.turnSpeed += this.turnSpeed / 5;
        this.targetLength -= this.HEIGHT / 30;
        this.targetLength = Math.max(this.targetLength, this.HEIGHT / 30);
      } else if (this.shipNoseX < this.targetX) {
        enteredTarget = false;
      }
    }
  }

  // Initialize SpaceshipGame
  function initializeSpaceshipGame() {
    // Create an instance of the SpaceshipGame
    const sGame = new SpaceshipGame();

    // Set up the game
    sGame.setup();

    // Add the draw function to the global scope
    window.draw = function () {
      sGame.draw();
    };

    // Add the keyPressed function to the global scope
    window.keyPressed = function () {
      sGame.keyPressed();
    };
  }

  // Listen for the load event and call the initialization function
  window.addEventListener("load", initializeSpaceshipGame);
}
