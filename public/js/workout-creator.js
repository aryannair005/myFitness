const exercises  = [
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


let exerciseNumber = 0;

// Add new exercise to workout
function addExercise() {
    exerciseNumber++;
    
    const exerciseHtml = `
        <div class="exercise-group border p-3 mb-3" id="exercise-${exerciseNumber}">
            <!-- Exercise header -->
            <div class="d-flex justify-content-between mb-3">
                <h6>Exercise ${exerciseNumber}</h6>
                <button type="button" class="btn btn-sm btn-outline-danger" 
                        onclick="removeExercise(${exerciseNumber})">
                    Remove
                </button>
            </div>
            
            <!-- Exercise name with suggestions -->
            <div class="mb-3">
                <label class="form-label">Exercise Name</label>
                <div class="position-relative">
                    <input type="text" class="form-control" 
                           name="exercises[${exerciseNumber}][name]" 
                           placeholder="Start typing exercise name..."
                           oninput="showSuggestions(this, ${exerciseNumber})"
                           required>
                    <div id="suggestions-${exerciseNumber}" class="suggestions-box"></div>
                </div>
            </div>
            
            <!-- Exercise details -->
            <div class="row">
                <div class="col-3">
                    <label class="form-label">Sets</label>
                    <input type="number" class="form-control" 
                           name="exercises[${exerciseNumber}][sets]" 
                           value="3" min="1">
                </div>
                <div class="col-3">
                    <label class="form-label">Reps</label>
                    <input type="number" class="form-control" 
                           name="exercises[${exerciseNumber}][reps]" 
                           value="10" min="1">
                </div>
                <div class="col-3">
                    <label class="form-label">Weight (kg)</label>
                    <input type="number" class="form-control" 
                           name="exercises[${exerciseNumber}][weight]" 
                           value="0" min="0" step="0.5">
                </div>
                <div class="col-3">
                    <label class="form-label">Rest (sec)</label>
                    <input type="number" class="form-control" 
                           name="exercises[${exerciseNumber}][restTime]" 
                           value="60" min="0">
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('exercisesList').insertAdjacentHTML('beforeend', exerciseHtml);
}

// Remove exercise from workout
function removeExercise(id) {
    const exerciseElement = document.getElementById(`exercise-${id}`);
    if (exerciseElement) {
        exerciseElement.remove();
    }
}

// Show exercise suggestions when user types
function showSuggestions(input, exerciseId) {
    const suggestionsBox = document.getElementById(`suggestions-${exerciseId}`);
    const searchText = input.value.toLowerCase();
    
    // Hide suggestions if input is empty
    if (searchText.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }
    
    // Find matching exercises
    const matches = exercises.filter(exercise => 
        exercise.toLowerCase().includes(searchText)
    );
    
    if (matches.length === 0) {
        suggestionsBox.style.display = 'none';
        return;
    }
    
    // Show first 5 matches
    let suggestionsHtml = '';
    matches.slice(0, 5).forEach(exercise => {
        suggestionsHtml += `
            <div class="suggestion-item" onclick="selectExercise('${exercise}', ${exerciseId})">
                ${exercise}
            </div>
        `;
    });
    
    suggestionsBox.innerHTML = suggestionsHtml;
    suggestionsBox.style.display = 'block';
}

// Select exercise from suggestions
function selectExercise(exerciseName, exerciseId) {
    const input = document.querySelector(`#exercise-${exerciseId} input[name*="[name]"]`);
    const suggestionsBox = document.getElementById(`suggestions-${exerciseId}`);
    
    input.value = exerciseName;
    suggestionsBox.style.display = 'none';
}

// Hide suggestions when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.matches('.form-control')) {
        document.querySelectorAll('.suggestions-box').forEach(box => {
            box.style.display = 'none';
        });
    }
});

// Add first exercise when page loads
document.addEventListener('DOMContentLoaded', function() {
    addExercise();
});