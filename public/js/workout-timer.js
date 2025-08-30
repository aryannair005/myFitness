// Timer variables
let workoutTimer = null;
let restTimer = null;
let totalSeconds = 0;
let currentExercise = 0;
let currentSet = 1;
let isResting = false;
let isPaused = false;

// Get DOM elements
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const timerDisplay = document.getElementById('workoutTimer');
const exerciseName = document.getElementById('currentExerciseName');
const exerciseInfo = document.getElementById('exerciseInfo');
const restDisplay = document.getElementById('restTimer');
const restTimeLeft = document.getElementById('restTimeDisplay');
const progressBar = document.getElementById('exerciseProgress');

// Start the workout
function startWorkout() {
    if (isPaused) {
        // Resume paused workout
        resumeWorkout();
        return;
    }
    
    // Start main timer
    workoutTimer = setInterval(() => {
        totalSeconds++;
        updateTimer();
    }, 1000);
    
    // Update buttons
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    // Show first exercise
    if (workout.exercises.length > 0) {
        showCurrentExercise();
    }
}

// Pause the workout
function pauseWorkout() {
    // Stop timers
    if (workoutTimer) clearInterval(workoutTimer);
    if (restTimer) clearInterval(restTimer);
    
    workoutTimer = null;
    restTimer = null;
    isPaused = true;
    
    // Update buttons
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.textContent = 'Resume';
}

// Resume paused workout
function resumeWorkout() {
    startWorkout();
    isPaused = false;
    startBtn.textContent = 'Start';
}

// Reset workout to beginning
function resetWorkout() {
    // Stop all timers
    if (workoutTimer) clearInterval(workoutTimer);
    if (restTimer) clearInterval(restTimer);
    
    // Reset variables
    workoutTimer = null;
    restTimer = null;
    totalSeconds = 0;
    currentExercise = 0;
    currentSet = 1;
    isResting = false;
    isPaused = false;
    
    // Reset display
    updateTimer();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.textContent = 'Start';
    
    exerciseName.textContent = 'Ready to start';
    exerciseInfo.innerHTML = '<p>Click Start to begin your workout!</p>';
    restDisplay.style.display = 'none';
    updateProgress(0);
    
    // Reset exercise cards
    document.querySelectorAll('.exercise-card').forEach(card => {
        card.classList.remove('active', 'completed');
    });
}

// Update timer display
function updateTimer() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerDisplay.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Show current exercise info
function showCurrentExercise() {
    // Check if workout is done
    if (currentExercise >= workout.exercises.length) {
        finishWorkout();
        return;
    }
    
    const exercise = workout.exercises[currentExercise];
    exerciseName.textContent = exercise.name;
    
    // Update exercise cards visual state
    updateExerciseCards();
    
    if (isResting) {
        startRestTimer(exercise.restTime);
    } else {
        showExerciseDetails(exercise);
    }
    
    updateProgress();
}

// Show exercise details (sets, reps, weight)
function showExerciseDetails(exercise) {
    const weightText = exercise.weight > 0 ? ` @ ${exercise.weight}kg` : '';
    
    exerciseInfo.innerHTML = `
        <p><strong>Set ${currentSet} of ${exercise.sets}</strong></p>
        <p>${exercise.reps} reps${weightText}</p>
        <button class="btn btn-success" onclick="finishSet()">Complete Set</button>
    `;
    
    restDisplay.style.display = 'none';
}

// Complete current set
function finishSet() {
    const exercise = workout.exercises[currentExercise];
    
    if (currentSet >= exercise.sets) {
        // Move to next exercise
        currentExercise++;
        currentSet = 1;
        showCurrentExercise();
    } else {
        // Start rest period
        currentSet++;
        isResting = true;
        showCurrentExercise();
    }
}

// Start rest timer between sets
function startRestTimer(restTime) {
    let timeLeft = restTime;
    restTimeLeft.textContent = timeLeft;
    restDisplay.style.display = 'block';
    exerciseInfo.innerHTML = '<p>Rest between sets</p>';
    
    restTimer = setInterval(() => {
        timeLeft--;
        restTimeLeft.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            finishRest();
        }
    }, 1000);
}

// Finish rest period
function finishRest() {
    if (restTimer) {
        clearInterval(restTimer);
        restTimer = null;
    }
    
    isResting = false;
    showCurrentExercise();
}

// Update exercise cards visual state
function updateExerciseCards() {
    document.querySelectorAll('.exercise-card').forEach((card, index) => {
        card.classList.remove('active', 'completed');
        
        if (index === currentExercise) {
            card.classList.add('active');
        } else if (index < currentExercise) {
            card.classList.add('completed');
        }
    });
}

// Update progress bar
function updateProgress() {
    if (workout.exercises.length === 0) return;
    
    const totalSets = workout.exercises.reduce((total, ex) => total + ex.sets, 0);
    const completedSets = workout.exercises.slice(0, currentExercise)
        .reduce((total, ex) => total + ex.sets, 0) + (currentSet - 1);
    
    const progress = (completedSets / totalSets) * 100;
    progressBar.style.width = progress + '%';
}

// Finish the entire workout
function finishWorkout() {
    // Stop all timers
    if (workoutTimer) clearInterval(workoutTimer);
    if (restTimer) clearInterval(restTimer);
    
    // Set total time in hidden form
    document.getElementById('totalTimeInput').value = totalSeconds;
    
    // Ask user to confirm
    if (confirm('Workout complete! Save your progress?')) {
        document.getElementById('completeForm').submit();
    }
}

// Set up button events
document.addEventListener('DOMContentLoaded', function() {
    // Button clicks
    startBtn.addEventListener('click', startWorkout);
    pauseBtn.addEventListener('click', pauseWorkout);
    resetBtn.addEventListener('click', resetWorkout);
    
    // Initialize display
    updateTimer();
    if (workout.exercises.length > 0) {
        updateProgress();
    }
});