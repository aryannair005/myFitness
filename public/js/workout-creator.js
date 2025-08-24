const commonExercises = [
    'Push-ups', 'Incline Push-ups', 'Decline Push-ups', 'Diamond Push-ups',
    'Bench Press', 'Incline Bench Press', 'Decline Bench Press',
    'Dumble Press','Incline Dumble Press','Decline Dumble Press',
    'Chest Flys','Cable Fly', 'Dips', 'Tricep Dips','Triceps Rope Pushdowns','Tricep Overhead Extension', 'Shoulder Press', 'Overhead Press',
    'Arnold Press', 'Lateral Raises', 'Front Raises',

    // Upper body - Pull
    'Pull-ups', 'Chin-ups', 'Wide-grip Pull-ups', 'Lat Pulldowns',
    'Rows', 'Barbell Rows', 'Dumbbell Rows', 'Face Pulls', 'Shrugs',
    'Bicep Curls', 'Hammer Curls', 'Concentration Curls','Rear Delt fly',

    // Lower body
    'Squats', 'Front Squats', 'Overhead Squats', 'Bulgarian Split Squats',
    'Deadlifts', 'Sumo Deadlifts', 'Romanian Deadlifts','Rdl','Leg Curl',
    'Lunges', 'Side Lunges', 'Step-ups',
    'Leg Press', 'Leg Extensions', 'Hamstring Curls',
    'Calf Raises', 'Glute Bridges', 'Hip Thrusts',

    // Core
    'Planks', 'Side Planks', 'Reverse Planks', 'Russian Twists',
    'Sit-ups', 'Crunches', 'Leg Raises', 'Hanging Leg Raises',
    'Flutter Kicks', 'V-Ups', 'Bicycle Crunches', 'Mountain Climbers',

    // Full body / Functional
    'Burpees', 'Jumping Jacks', 'Bear Crawls', 'Inchworms',
    'Farmer Carries', 'Turkish Get-Ups',

    // Cardio
    'Running', 'Sprinting', 'Jogging', 'Cycling',
    'Jump Rope', 'Rowing Machine', 'Elliptical', 'Stair Climbing',
    'Swimming', 'Box Jumps', 'High Knees', 'Butt Kicks',

    // Olympic / Powerlifting
    'Clean and Jerk', 'Snatch', 'Power Clean', 'Push Press'
];

let exerciseCount = 0;

function addExercise() {
    exerciseCount++;
    const exerciseHtml = `
        <div class="exercise-input-group" id="exercise-${exerciseCount}">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6>Exercise ${exerciseCount}</h6>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeExercise(${exerciseCount})">
                    Remove
                </button>
            </div>
            
            <div class="row">
                <div class="col-md-12 mb-3">
                    <label class="form-label">Exercise Name</label>
                    <div class="position-relative">
                        <input type="text" class="form-control exercise-name-input" 
                               name="exercises[${exerciseCount}][name]" 
                               placeholder="Type or select exercise..."
                               autocomplete="off"
                               oninput="showSuggestions(this, ${exerciseCount})"
                               onfocus="showSuggestions(this, ${exerciseCount})"
                               required>
                        <div id="suggestions-${exerciseCount}" class="exercise-suggestions" style="display: none;">
                        </div>
                    </div>
                </div>
                
                <div class="col-md-3">
                    <label class="form-label">Sets</label>
                    <input type="number" class="form-control" name="exercises[${exerciseCount}][sets]" value="3" min="1">
                </div>
                
                <div class="col-md-3">
                    <label class="form-label">Reps</label>
                    <input type="number" class="form-control" name="exercises[${exerciseCount}][reps]" value="10" min="1">
                </div>
                
                <div class="col-md-3">
                    <label class="form-label">Weight (kg)</label>
                    <input type="number" class="form-control" name="exercises[${exerciseCount}][weight]" value="0" min="0" step="0.5">
                </div>
                
                <div class="col-md-3">
                    <label class="form-label">Rest (seconds)</label>
                    <input type="number" class="form-control" name="exercises[${exerciseCount}][restTime]" value="60" min="0">
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('exercisesList').insertAdjacentHTML('beforeend', exerciseHtml);
}

function removeExercise(id) {
    const element = document.getElementById(`exercise-${id}`);
    if (element) {
        element.remove();
    }
}

function showSuggestions(input, exerciseId) {
    const suggestionsDiv = document.getElementById(`suggestions-${exerciseId}`);
    const inputValue = input.value.toLowerCase();
    
    if (inputValue.length === 0) {
        suggestionsDiv.style.display = 'none';
        return;
    }
    
    const filteredExercises = commonExercises.filter(exercise => 
        exercise.toLowerCase().includes(inputValue)
    );
    
    if (filteredExercises.length === 0) {
        suggestionsDiv.style.display = 'none';
        return;
    }
    
    let suggestionsHtml = '';
    filteredExercises.slice(0, 8).forEach(exercise => {
        suggestionsHtml += `
            <div class="suggestion-item" onclick="selectExercise('${exercise}', ${exerciseId})">
                ${exercise}
            </div>
        `;
    });
    
    suggestionsDiv.innerHTML = suggestionsHtml;
    suggestionsDiv.style.display = 'block';
}

function selectExercise(exerciseName, exerciseId) {
    const input = document.querySelector(`#exercise-${exerciseId} .exercise-name-input`);
    const suggestionsDiv = document.getElementById(`suggestions-${exerciseId}`);
    
    input.value = exerciseName;
    suggestionsDiv.style.display = 'none';
}

// Hide suggestions when clicking outside
document.addEventListener('click', function(event) {
    const suggestions = document.querySelectorAll('.exercise-suggestions');
    suggestions.forEach(suggestion => {
        if (!suggestion.contains(event.target) && !event.target.classList.contains('exercise-name-input')) {
            suggestion.style.display = 'none';
        }
    });
});

// Add first exercise by default
document.addEventListener('DOMContentLoaded', function() {
    addExercise();
});