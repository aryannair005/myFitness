const Joi = require('joi');

// User validation schemas
const authValidation = {
    register: Joi.object({
        username: Joi.string().min(3).max(30).required()
            .messages({
                'string.empty': 'Username is required',
                'string.min': 'Username must be at least 3 characters long',
                'string.max': 'Username cannot exceed 30 characters'
            }),
        email: Joi.string().email().required()
            .messages({
                'string.email': 'Please enter a valid email address',
                'string.empty': 'Email is required'
            }),
        password: Joi.string().min(6).required()
            .messages({
                'string.min': 'Password must be at least 6 characters long',
                'string.empty': 'Password is required'
            })
    }),
    
    login: Joi.object({
        email: Joi.string().email().required()
            .messages({
                'string.email': 'Please enter a valid email address',
                'string.empty': 'Email is required'
            }),
        password: Joi.string().required()
            .messages({ 'string.empty': 'Password is required' })
    })
};

// Food entry validation
const foodValidation = {
    // For adding a new food entry
    addEntry: Joi.object({
        meal: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack').required()
            .messages({
                'any.only': 'Invalid meal type',
                'string.empty': 'Meal type is required'
            }),
        date: Joi.date().required()
            .messages({
                'date.base': 'Invalid date format',
                'any.required': 'Date is required'
            }),
        foodId: Joi.string().required()
            .messages({ 'string.empty': 'Food ID is required' }),
        foodName: Joi.string().min(2).required()
            .messages({
                'string.empty': 'Food name is required',
                'string.min': 'Food name must be at least 2 characters long'
            }),
        servingId: Joi.string().required()
            .messages({ 'string.empty': 'Serving ID is required' }),
        servingDescription: Joi.string().required()
            .messages({ 'string.empty': 'Serving description is required' }),
        numberOfServings: Joi.number().min(0.1).required()
            .messages({
                'number.base': 'Number of servings must be a number',
                'number.min': 'Number of servings must be at least 0.1',
                'any.required': 'Number of servings is required'
            }),
        calories: Joi.number().min(0).required()
            .messages({
                'number.base': 'Calories must be a number',
                'number.min': 'Calories cannot be negative',
                'any.required': 'Calories is required'
            }),
        carbs: Joi.number().min(0).required()
            .messages({
                'number.base': 'Carbs must be a number',
                'number.min': 'Carbs cannot be negative',
                'any.required': 'Carbs is required'
            }),
        protein: Joi.number().min(0).required()
            .messages({
                'number.base': 'Protein must be a number',
                'number.min': 'Protein cannot be negative',
                'any.required': 'Protein is required'
            }),
        fat: Joi.number().min(0).required()
            .messages({
                'number.base': 'Fat must be a number',
                'number.min': 'Fat cannot be negative',
                'any.required': 'Fat is required'
            }),
        fiber: Joi.number().min(0).default(0)
            .messages({
                'number.base': 'Fiber must be a number',
                'number.min': 'Fiber cannot be negative'
            }),
        sugar: Joi.number().min(0).default(0)
            .messages({
                'number.base': 'Sugar must be a number',
                'number.min': 'Sugar cannot be negative'
            }),
        sodium: Joi.number().min(0).default(0)
            .messages({
                'number.base': 'Sodium must be a number',
                'number.min': 'Sodium cannot be negative'
            })
    }),

    // For updating an existing food entry
    updateEntry: Joi.object({
        meal: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack'),
        date: Joi.date(),
        foodName: Joi.string().min(2),
        servingDescription: Joi.string(),
        numberOfServings: Joi.number().min(0.1),
        calories: Joi.number().min(0),
        carbs: Joi.number().min(0),
        protein: Joi.number().min(0),
        fat: Joi.number().min(0),
        fiber: Joi.number().min(0),
        sugar: Joi.number().min(0),
        sodium: Joi.number().min(0)
    }).min(1),

    // For API search queries
    searchQuery: Joi.object({
        q: Joi.string().min(2).required()
            .messages({
                'string.empty': 'Search query is required',
                'string.min': 'Search query must be at least 2 characters long',
                'any.required': 'Search query is required'
            })
    }),

    // For date parameters
    dateParam: Joi.object({
        date: Joi.date().required()
            .messages({
                'date.base': 'Invalid date format',
                'any.required': 'Date parameter is required'
            })
    }),

    // For ID parameters
    idParam: Joi.object({
        id: Joi.string().length(24).hex().required()
            .messages({
                'string.length': 'Invalid ID format',
                'string.hex': 'Invalid ID format',
                'any.required': 'ID is required'
            })
    }),

    // For meal parameter
    mealParam: Joi.object({
        meal: Joi.string().valid('breakfast', 'lunch', 'dinner', 'snack').required()
            .messages({
                'any.only': 'Invalid meal type',
                'string.empty': 'Meal type is required',
                'any.required': 'Meal type is required'
            })
    }),
    
    // For weekly summary queries
    weeklyQuery: Joi.object({
        startDate: Joi.date(),
        endDate: Joi.date()
    })
};

// Workout validation
const workoutValidation = {
    create: Joi.object({
        name: Joi.string().min(3).required()
            .messages({
                'string.empty': 'Workout name is required',
                'string.min': 'Workout name must be at least 3 characters long'
            }),
        description: Joi.string().allow(''),
        exercises: Joi.array().items(
            Joi.object({
                name: Joi.string().required()
                    .messages({ 'string.empty': 'Exercise name is required' }),
                sets: Joi.number().integer().min(1).required()
                    .messages({
                        'number.base': 'Sets must be a number',
                        'number.min': 'At least 1 set is required',
                        'any.required': 'Sets are required'
                    }),
                reps: Joi.alternatives().try(
                    Joi.number().integer().min(1),
                    Joi.string().pattern(/^\d+-\d+$/)
                ).required()
                .messages({
                    'alternatives.match': 'Reps must be a number or range (e.g., 8-12)',
                    'any.required': 'Reps are required'
                }),
                weight: Joi.number().min(0)
                    .messages({
                        'number.base': 'Weight must be a number',
                        'number.min': 'Weight cannot be negative'
                    }),
                rest: Joi.number().integer().min(0)
                    .messages({
                        'number.base': 'Rest time must be a number',
                        'number.min': 'Rest time cannot be negative'
                    }),
                notes: Joi.string().allow('')
            })
        ).min(1).required()
            .messages({
                'array.min': 'At least one exercise is required',
                'any.required': 'Exercises are required'
            })
    }),
    
    update: Joi.object({
        name: Joi.string().min(3)
            .messages({
                'string.empty': 'Workout name cannot be empty',
                'string.min': 'Workout name must be at least 3 characters long'
            }),
        description: Joi.string().allow(''),
        exercises: Joi.array().items(
            Joi.object({
                name: Joi.string(),
                sets: Joi.number().integer().min(1),
                reps: Joi.alternatives().try(
                    Joi.number().integer().min(1),
                    Joi.string().pattern(/^\d+-\d+$/)
                ),
                weight: Joi.number().min(0),
                rest: Joi.number().integer().min(0),
                notes: Joi.string().allow(''),
                completed: Joi.boolean()
            })
        ).min(1)
    }).min(1),
    
    // For URL parameters
    params: Joi.object({
        id: Joi.string().length(24).hex().required()
            .messages({
                'string.length': 'Invalid workout ID format',
                'string.hex': 'Invalid workout ID format',
                'any.required': 'Workout ID is required'
            })
    }).options({ allowUnknown: true }),
    
    completeWorkout: Joi.object({
        duration: Joi.number().integer().min(1).required()
            .messages({
                'number.base': 'Duration must be a number',
                'number.min': 'Duration must be at least 1 minute',
                'any.required': 'Duration is required'
            }),
        notes: Joi.string().allow(''),
        rating: Joi.number().min(1).max(5)
            .messages({
                'number.min': 'Rating must be at least 1',
                'number.max': 'Rating cannot be more than 5'
            })
    }),
    
    logExercise: Joi.object({
        exerciseId: Joi.string().required()
            .messages({ 'string.empty': 'Exercise ID is required' }),
        sets: Joi.array().items(
            Joi.object({
                reps: Joi.number().integer().min(0).required()
                    .messages({
                        'number.base': 'Reps must be a number',
                        'number.min': 'Reps cannot be negative',
                        'any.required': 'Reps are required'
                    }),
                weight: Joi.number().min(0)
                    .messages({
                        'number.base': 'Weight must be a number',
                        'number.min': 'Weight cannot be negative'
                    }),
                completed: Joi.boolean().default(true)
            })
        ).min(1).required()
            .messages({
                'array.min': 'At least one set is required',
                'any.required': 'Sets are required'
            })
    })
};

// Plan validation
// Calorie profile validation
const calorieValidation = {
    calculate: Joi.object({
        age: Joi.number().integer().min(13).max(120).required()
            .messages({
                'number.base': 'Age must be a number',
                'number.min': 'You must be at least 13 years old',
                'number.max': 'Please enter a valid age',
                'any.required': 'Age is required'
            }),
        gender: Joi.string().valid('male', 'female', 'other').required()
            .messages({
                'any.only': 'Please select a valid gender',
                'any.required': 'Gender is required'
            }),
        height: Joi.number().min(100).max(300).required()
            .messages({
                'number.base': 'Height must be a number',
                'number.min': 'Height must be at least 100cm',
                'number.max': 'Height cannot exceed 300cm',
                'any.required': 'Height is required'
            }),
        weight: Joi.number().min(20).max(500).required()
            .messages({
                'number.base': 'Weight must be a number',
                'number.min': 'Weight must be at least 20kg',
                'number.max': 'Weight cannot exceed 500kg',
                'any.required': 'Weight is required'
            }),
        activityLevel: Joi.string().valid('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extra_active').required()
            .messages({
                'any.only': 'Please select a valid activity level',
                'any.required': 'Activity level is required'
            })
    }),
    
    update: Joi.object({
        weight: Joi.number().min(20).max(500).required()
            .messages({
                'number.base': 'Weight must be a number',
                'number.min': 'Weight must be at least 20kg',
                'number.max': 'Weight cannot exceed 500kg',
                'any.required': 'Weight is required'
            })
    })
};

// Plan validation
const planValidation = {
    // Plan CRUD validations
    create: Joi.object({
        name: Joi.string().min(3).required()
            .messages({
                'string.empty': 'Plan name is required',
                'string.min': 'Plan name must be at least 3 characters long'
            }),
        description: Joi.string().allow(''),
        workouts: Joi.array().items(Joi.string().length(24)).min(1).required(),
        isPublic: Joi.boolean().default(false)
    })
};

// Middleware to validate request body
function validate(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.reduce((acc, detail) => {
                const key = detail.path[0];
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(detail.message);
                return acc;
            }, {});
            
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }
        next();
    };
}

// Middleware to validate request parameters
function validateParams(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.params);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid parameters',
                errors: error.details.map(detail => ({
                    field: detail.path[0],
                    message: detail.message
                }))
            });
        }
        next();
    };
}

// Middleware to validate query parameters
function validateQuery(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.query);
        if (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid query parameters',
                errors: error.details.map(detail => ({
                    field: detail.path[0],
                    message: detail.message
                }))
            });
        }
        next();
    };
}

module.exports = {
    auth: authValidation,
    food: foodValidation,
    workout: workoutValidation,
    calorie: calorieValidation,
    plan: {
        ...planValidation,
        // Plan listing and viewing validations
        list: Joi.object({
            category: Joi.string().valid(
                'push_pull_legs', 'upper_lower', 'full_body', 'bro_split', 
                'cardio', 'strength', 'hiit', 'bodyweight'
            ),
            difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced'),
            equipment: Joi.string()
        }),
        getById: Joi.object({
            id: Joi.string().length(24).hex().required()
        }),
        getByCategory: Joi.object({
            category: Joi.string().valid(
                'push_pull_legs', 'upper_lower', 'full_body', 'bro_split', 
                'cardio', 'strength', 'hiit', 'bodyweight'
            ).required()
        }),
        getExercise: Joi.object({
            id: Joi.string().length(24).hex().required()
        }),
        copyPlan: Joi.object({
            id: Joi.string().length(24).hex().required()
        }),
        browseExercises: Joi.object({
            muscle: Joi.string(),
            equipment: Joi.string(),
            difficulty: Joi.string().valid('beginner', 'intermediate', 'advanced')
        })
    },
    validate: validate,
    validateParams: validateParams,
    validateQuery: validateQuery
};
