// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    setupActivitySelection();
    setupFormValidation();
});

// Make activity level selection look nice
function setupActivitySelection() {
    const activityInputs = document.querySelectorAll('input[name="activityLevel"]');
    
    activityInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Remove highlight from all options
            document.querySelectorAll('.activity-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            // Highlight selected option
            if (this.checked) {
                this.closest('.activity-option').classList.add('selected');
            }
        });
        
        // Highlight already selected option on page load
        if (input.checked) {
            input.closest('.activity-option').classList.add('selected');
        }
    });
}

// Validate form before submission
function setupFormValidation() {
    const form = document.getElementById('calorieForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            if (!validateForm()) {
                e.preventDefault();
                return false;
            }
        });
    }
}

// Check if all required fields are filled
function validateForm() {
    const age = document.getElementById('age').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const activity = document.querySelector('input[name="activityLevel"]:checked');
    
    // Check each field
    if (!age) {
        showError('Please enter your age');
        return false;
    }
    
    if (!height) {
        showError('Please enter your height');
        return false;
    }
    
    if (!weight) {
        showError('Please enter your weight');
        return false;
    }
    
    if (!gender) {
        showError('Please select your gender');
        return false;
    }
    
    if (!activity) {
        showError('Please select your activity level');
        return false;
    }
    
    // Check if values are reasonable
    if (age < 13 || age > 120) {
        showError('Age must be between 13 and 120');
        return false;
    }
    
    if (height < 100 || height > 250) {
        showError('Height must be between 100 and 250 cm');
        return false;
    }
    
    if (weight < 30 || weight > 300) {
        showError('Weight must be between 30 and 300 kg');
        return false;
    }
    
    return true;
}

// Show error message
function showError(message) {
    alert(message);
}

// Preview calories while typing (optional enhancement)
function previewCalories() {
    const age = document.getElementById('age').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const activity = document.querySelector('input[name="activityLevel"]:checked');
    
    // Only calculate if all fields are filled
    if (age && height && weight && gender && activity) {
        // Simple BMR calculation
        let bmr;
        if (gender.value === 'male') {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        } else {
            bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        }
        
        const activityMultiplier = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very_active': 1.9
        };
        
        const maintenance = Math.round(bmr * activityMultiplier[activity.value]);
        
        // Show preview (if preview element exists)
        const preview = document.getElementById('caloriePreview');
        if (preview) {
            preview.innerHTML = `
                <div class="alert alert-info">
                    <strong>Preview:</strong> ~${maintenance} calories/day for maintenance
                </div>
            `;
        }
    }
}