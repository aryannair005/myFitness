document.addEventListener('DOMContentLoaded', function() {
    const calorieForm = document.getElementById('calorieForm');
    const activityInputs = document.querySelectorAll('input[name="activityLevel"]');
    
    // Make activity level selection more user-friendly
    activityInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Remove active class from all options
            document.querySelectorAll('.activity-option').forEach(option => {
                option.classList.remove('active');
            });
            
            // Add active class to selected option
            if (this.checked) {
                this.closest('.activity-option').classList.add('active');
            }
        });
        
        // Initialize active state for pre-selected option
        if (input.checked) {
            input.closest('.activity-option').classList.add('active');
        }
    });
    
    // Form submission handling
    if (calorieForm) {
        calorieForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate form
            const age = document.getElementById('age').value;
            const height = document.getElementById('height').value;
            const weight = document.getElementById('weight').value;
            const gender = document.querySelector('input[name="gender"]:checked');
            const activityLevel = document.querySelector('input[name="activityLevel"]:checked');
            
            if (!age || !height || !weight || !gender || !activityLevel) {
                alert('Please fill in all required fields');
                return false;
            }
            
            // If validation passes, submit the form
            this.submit();
        });
    }
});
