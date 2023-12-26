function loadGame(gameName) {
  const gameContainer = document.getElementById("game-container");
  gameContainer.innerHTML = "";

  // Create a div for the canvas
  const canvasContainer = document.createElement("div");
  canvasContainer.id = "canvas-container";
  canvasContainer.className = "canvas-container";

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

function handleRouting() {
  const path = window.location.pathname;

  if (path === "/puzzle") {
    loadGame("puzzle");
  } else if (path === "/minesweeper") {
    loadGame("minesweeper");
  } else if (path === "/spaceship") {
    loadGame("spaceship");
  }
}

// Call handleRouting when the page loads
window.addEventListener("load", handleRouting);

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle("dark-mode");

  // Check if dark mode is enabled and store the preference
  const darkModeEnabled = body.classList.contains("dark-mode");
  localStorage.setItem("darkModeEnabled", darkModeEnabled);
}

function applyUserPreference() {
  const savedDarkMode = localStorage.getItem("darkModeEnabled");
  const body = document.body;

  if (savedDarkMode && savedDarkMode === "true") {
    body.classList.add("dark-mode");
  } else {
    body.classList.remove("dark-mode");
  }

  // Update the state of the toggle button
  const darkModeToggle = document.getElementById("darkModeToggle");
  darkModeToggle.checked = body.classList.contains("dark-mode");
}

window.addEventListener("load", applyUserPreference);