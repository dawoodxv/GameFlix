// Update loadGame function
function loadGame(gameName) {
  const gameContainer = document.getElementById("game-container");
  gameContainer.innerHTML = "";

  // Create a div for the canvas
  const canvasContainer = document.createElement("div");
  canvasContainer.id = "canvas-container";
  canvasContainer.className = "canvas-container"; // Add a class for styling

  // Append the canvas container to the "game-container"
  gameContainer.appendChild(canvasContainer);

  // Load the selected game dynamically
  const script = document.createElement("script");
  script.src = `${gameName}.js`;

  script.onload = function () {
    console.log(`${gameName}.js has been loaded.`);

    // Call the initialization function for the loaded game
    window[`initialize${capitalizeFirstLetter(gameName)}Game`]();

    // Append the canvas element to the canvas container
    const canvas = document.querySelector(".p5Canvas");
    canvasContainer.appendChild(canvas);
  };

  script.onerror = function () {
    console.error(`Error loading ${gameName}.js.`);
  };

  document.head.appendChild(script);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
