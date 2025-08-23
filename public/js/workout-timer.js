let workoutTimer = null;
let restTimer = null;
let totalSeconds = 0;
let currentExerciseIndex = 0;
let currentSet = 1;
let isResting = false;
let isPaused = false;

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const completeBtn = document.getElementById('completeBtn');
const timerDisplay = document.getElementById('workoutTimer');
const currentExerciseName = document.getElementById('currentExerciseName');
const exerciseInfo = document.getElementById('exerciseInfo');
const restTimerDiv = document.getElementById('restTimer');
const restTimeDisplay = document.getElementById('restTimeDisplay');
const progressBar = document.getElementById('exerciseProgress');

function startWorkout() {
    if (isPaused) {
        resumeWorkout();
        return;
    }
    
    workoutTimer = setInterval(() => {
        totalSeconds++;
        updateTimerDisplay();
    }, 1000);
    
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    
    if (workout.exercises.length > 0) {
        showCurrentExercise();
    }
}

function pauseWorkout() {
    if (workoutTimer) {
        clearInterval(workoutTimer);
        workoutTimer = null;
    }
    if (restTimer) {
        clearInterval(restTimer);
        restTimer = null;
    }
    
    isPaused = true;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.textContent = 'Resume';
}

function resumeWorkout() {
    startWorkout();
    isPaused = false;
    startBtn.textContent = 'Start';
}

function resetWorkout() {
    if (workoutTimer) {
        clearInterval(workoutTimer);
        workoutTimer = null;
    }
    if (restTimer) {
        clearInterval(restTimer);
        restTimer = null;
    }
    
    totalSeconds = 0;
    currentExerciseIndex = 0;
    currentSet = 1;
    isResting = false;
    isPaused = false;
    
    updateTimerDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    startBtn.textContent = 'Start';
    
    currentExerciseName.textContent = 'Ready to start';
    exerciseInfo.innerHTML = '<p class="mb-1">Get ready to start your workout!</p>';
    restTimerDiv.style.display = 'none';
    updateProgressBar(0);
    
    // Reset exercise cards
    document.querySelectorAll('.exercise-card').forEach(card => {
        card.classList.remove('active', 'completed');
    });
}

function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function showCurrentExercise() {
    if (currentExerciseIndex >= workout.exercises.length) {
        completeWorkout();
        return;
    }
    
    const exercise = workout.exercises[currentExerciseIndex];
    currentExerciseName.textContent = exercise.name;
    
    // Update exercise cards
    document.querySelectorAll('.exercise-card').forEach((card, index) => {
        card.classList.remove('active', 'completed');
        if (index === currentExerciseIndex) {
            card.classList.add('active');
        } else if (index < currentExerciseIndex) {
            card.classList.add('completed');
        }
    });
    
    if (isResting) {
        showRestTimer(exercise.restTime);
    } else {
        exerciseInfo.innerHTML = `
            <p class="mb-1"><strong>Set ${currentSet} of ${exercise.sets}</strong></p>
            <p class="mb-1">${exercise.reps} reps ${exercise.weight > 0 ? '@ ' + exercise.weight + 'kg' : ''}</p>
            <button class="btn btn-success" onclick="completeSet()">Set Complete</button>
        `;
        restTimerDiv.style.display = 'none';
    }
    
    updateProgressBar();
}

function completeSet() {
    const exercise = workout.exercises[currentExerciseIndex];
    
    if (currentSet >= exercise.sets) {
        // Move to next exercise
        currentExerciseIndex++;
        currentSet = 1;
        showCurrentExercise();
    } else {
        // Start rest period
        currentSet++;
        isResting = true;
        showCurrentExercise();
    }
}

function showRestTimer(restTime) {
    let timeLeft = restTime;
    restTimeDisplay.textContent = timeLeft;
    restTimerDiv.style.display = 'block';
    exerciseInfo.innerHTML = '<p class="mb-1">Rest between sets</p>';
    
    restTimer = setInterval(() => {
        timeLeft--;
        restTimeDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            skipRest();
        }
    }, 1000);
}

function skipRest() {
    if (restTimer) {
        clearInterval(restTimer);
        restTimer = null;
    }
    
    isResting = false;
    showCurrentExercise();
}

function updateProgressBar() {
    if (workout.exercises.length === 0) return;
    
    const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
    const completedSets = workout.exercises.slice(0, currentExerciseIndex)
        .reduce((sum, ex) => sum + ex.sets, 0) + (currentSet - 1);
    
    const progress = (completedSets / totalSets) * 100;
    progressBar.style.width = progress + '%';
}

function completeWorkout() {
    if (workoutTimer) {
        clearInterval(workoutTimer);
    }
    if (restTimer) {
        clearInterval(restTimer);
    }
    
    document.getElementById('totalTimeInput').value = totalSeconds;
    
    if (confirm('Are you sure you want to complete this workout?')) {
        document.getElementById('completeForm').submit();
    }
}

// Event listeners
startBtn.addEventListener('click', startWorkout);
pauseBtn.addEventListener('click', pauseWorkout);
resetBtn.addEventListener('click', resetWorkout);

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateTimerDisplay();
    if (workout.exercises.length > 0) {
        updateProgressBar();
    }
});