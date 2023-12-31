/* ------------------------------------------
VARIABLES
------------------------------------------ */

// First page elements
const startPage = document.querySelector(".start-section");
const startButton = document.querySelector(".start-button");

// Second page elements
const breathingSection = document.querySelector(".breathing-section");
const instruction = document.querySelector(".instruction");
const timer = document.querySelector(".timer");
const stopButton = document.querySelector(".stop-button");
const movingElement = document.querySelector(".moving-element");

// Slider values
const inhaleSlider = document.getElementById("inhale-slider");
const holdSlider = document.getElementById("hold-slider");
const exhaleSlider = document.getElementById("exhale-slider");
const relaxSlider = document.getElementById("relax-slider");

// Logic
const instructions = ["Inhale...", "Hold...", "Exhale...", "Relax..."];
const sliders = [inhaleSlider, holdSlider, exhaleSlider, relaxSlider];
let currentIndex = 0;
let startTime = null;
let currentTime = inhaleSlider.value; // Initial timer
let currentDirection = "right"; // Initial direction
let startPositionY = 0; // Initial Y position
let startPositionX = 0; // Initial X position

// Call the function to to generate slider values
generateSliderValues("inhale-slider");
generateSliderValues("exhale-slider");
generateSliderValues("hold-slider");
generateSliderValues("relax-slider");

/* ------------------------------------------
FUNCTIONS
------------------------------------------ */

// Function to generate slider values based on the attributes of input element
function generateSliderValues(inputId) {
  const sliderValuesContainer = document.getElementById(inputId + "-values"); // Container for slider values
  const sliderInput = document.getElementById(inputId); // Input element

  const min = parseInt(sliderInput.getAttribute("min"));
  const max = parseInt(sliderInput.getAttribute("max"));

  // Loop to create and inject slider values
  for (let i = min; i <= max; i++) {
    const sliderValueDiv = document.createElement("div");
    sliderValueDiv.textContent = i + "s";
    sliderValuesContainer.appendChild(sliderValueDiv);
  }
}

// Function to start the breathing cycle
function startBreathingCycle() {
  // Fill in 1s delay
  instruction.innerText = `Ready?`;
  currentTime = inhaleSlider.value; // User-defined value

  // Start the first breathing cycle
  updateInstructionAndTimer();

  // After a 1s delay, start the first movement of the element along the box
  setTimeout(() => {
    moveElement();
  }, 1000);
}

// Function to update instruction and timer every second
function updateInstructionAndTimer() {
  const currentInstruction = instructions[currentIndex];
  const currentSlider = sliders[currentIndex];
  const sliderValue = currentSlider.value;

  // Check if the slider value is greater than 0 before updating the instruction and timer
  if (sliderValue > 0) {
    // Update the timer element every second
    let countdown = sliderValue;
    const countdownInterval = setInterval(() => {
      // Update the instruction text
      instruction.innerText = `${currentInstruction}`;
      timer.innerText = countdown;
      countdown--;

      if (countdown <= 0) {
        clearInterval(countdownInterval);
        currentIndex = (currentIndex + 1) % sliders.length;
        // Start the next phase
        updateInstructionAndTimer();
      }
    }, 1000);
  } else {
    // If the slider value is 0, skip the phase and move on to the next one
    currentIndex = (currentIndex + 1) % sliders.length;
    updateInstructionAndTimer();
  }
}

// Function to move the element based on the direction and time
function moveElement() {
  const distance = 240; // Width and height of the square

  if (!startTime) {
    startTime = performance.now();
  }

  // Calculate the animation progress as a value between 0 and 1
  const progress = (performance.now() - startTime) / (currentTime * 1000);

  // If the animation is not complete
  if (progress < 1) {
    // Calculate the target position based on the current direction
    let targetX, targetY;

    switch (currentDirection) {
      case "right":
        targetX = distance;
        targetY = startPositionY;
        break;
      case "bottom":
        targetX = startPositionX;
        targetY = distance;
        break;
      case "left":
        targetX = 0;
        targetY = startPositionY;
        break;
      case "top":
        targetX = startPositionX;
        targetY = 0;
        break;
    }

    // Update the current position based on the progress
    currentPositionX = startPositionX + (targetX - startPositionX) * progress;
    currentPositionY = startPositionY + (targetY - startPositionY) * progress;

    // Update the element's position
    movingElement.style.transform = `translate(${currentPositionX}px, ${currentPositionY}px)`;

    // Continue the animation
    requestAnimationFrame(moveElement);

    // If the animation is complete, reset start time and update direction and time for  next phase
  } else {
    startTime = null;

    switch (currentDirection) {
      case "right":
        currentDirection = "bottom";
        currentTime = holdSlider.value;
        startPositionX = distance;
        break;
      case "bottom":
        currentDirection = "left";
        currentTime = exhaleSlider.value;
        startPositionY = distance;
        break;
      case "left":
        currentDirection = "top";
        currentTime = relaxSlider.value;
        startPositionX = 0;
        break;
      case "top":
        currentDirection = "right";
        currentTime = inhaleSlider.value;
        startPositionY = 0;
        break;
    }

    // Continue the animation for the next phase
    requestAnimationFrame(moveElement);
  }
}

/* ------------------------------------------
EVENTS
------------------------------------------ */

// Pressing the start button
startButton.addEventListener("click", () => {
  // Hide
  startPage.classList.add("hidden");

  // Display
  breathingSection.classList.remove("hidden");

  // Start the breathing cycle
  startBreathingCycle();
});

// Reloads the page
stopButton.addEventListener("click", function () {
  location.reload();
});
