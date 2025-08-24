const mongoose = require('mongoose');
const Exercise = require("./models/Exercise.js");
const WorkoutPlan = require('./models/WorkoutPlan.js');
require('dotenv').config();

// Sample exercises data
const sampleExercises = [
  // Chest Exercises
  {
    name: "Push-ups",
    description: "A classic bodyweight exercise that targets the chest, shoulders, and triceps. Perfect for building upper body strength and can be modified for all fitness levels.",
    instructions: [
      "Start in a plank position with hands slightly wider than shoulder-width apart",
      "Keep your body in a straight line from head to heels",
      "Lower your chest toward the ground by bending your elbows",
      "Push back up to the starting position",
      "Keep your core engaged throughout the movement"
    ],
    muscleGroups: ["chest", "shoulders", "triceps"],
    equipment: "bodyweight",
    difficulty: "beginner",
    tips: [
      "Keep your core tight to maintain proper form",
      "Don't let your hips sag or pike up",
      "Control the descent - don't drop down quickly",
      "Modify by doing knee push-ups if needed"
    ],
    variations: [
      { name: "Incline Push-ups", description: "Place hands on an elevated surface to make it easier" },
      { name: "Decline Push-ups", description: "Place feet on an elevated surface for increased difficulty" },
      { name: "Diamond Push-ups", description: "Place hands in a diamond shape to target triceps more" }
    ]
  },
  {
    name: "Bench Press",
    description: "The king of chest exercises. A compound movement that primarily targets the chest while also working the shoulders and triceps.",
    instructions: [
      "Lie flat on a bench with feet firmly planted on the ground",
      "Grip the barbell slightly wider than shoulder-width",
      "Unrack the bar and position it over your chest",
      "Lower the bar to your chest with control",
      "Press the bar back up to full arm extension"
    ],
    muscleGroups: ["chest", "shoulders", "triceps"],
    equipment: "barbell",
    difficulty: "intermediate",
    tips: [
      "Keep your shoulder blades pulled back and down",
      "Maintain a slight arch in your lower back",
      "Don't bounce the bar off your chest",
      "Use a spotter for heavy weights"
    ],
    variations: [
      { name: "Incline Bench Press", description: "Perform on an inclined bench to target upper chest" },
      { name: "Dumbbell Bench Press", description: "Use dumbbells for greater range of motion" }
    ]
  },

  // Back Exercises
  {
    name: "Pull-ups",
    description: "One of the most effective upper body exercises. Targets the latissimus dorsi, rhomboids, and biceps while building functional strength.",
    instructions: [
      "Hang from a pull-up bar with palms facing away",
      "Start with arms fully extended",
      "Pull your body up until your chin clears the bar",
      "Lower yourself back down with control",
      "Keep your core engaged throughout"
    ],
    muscleGroups: ["back", "biceps"],
    equipment: "bodyweight",
    difficulty: "intermediate",
    tips: [
      "Don't swing or use momentum",
      "Focus on pulling with your back muscles, not just arms",
      "Use assistance bands or machine if you can't do full pull-ups yet",
      "Control the negative (lowering) portion"
    ],
    variations: [
      { name: "Chin-ups", description: "Use an underhand grip to target biceps more" },
      { name: "Wide-grip Pull-ups", description: "Use a wider grip to target outer lats" }
    ]
  },
  {
    name: "Bent-over Rows",
    description: "An excellent compound exercise for building back thickness and strength. Targets the middle traps, rhomboids, and rear delts.",
    instructions: [
      "Hold a barbell with an overhand grip",
      "Hinge at the hips and lean forward about 45 degrees",
      "Keep your back straight and core braced",
      "Pull the bar to your lower chest/upper abdomen",
      "Lower the bar back down with control"
    ],
    muscleGroups: ["back", "biceps"],
    equipment: "barbell",
    difficulty: "intermediate",
    tips: [
      "Keep your torso stable - don't rock back and forth",
      "Squeeze your shoulder blades together at the top",
      "Don't let the bar drift away from your body",
      "Start with lighter weight to perfect your form"
    ]
  },

  // Leg Exercises
  {
    name: "Squats",
    description: "The king of all exercises. A fundamental movement pattern that targets the entire lower body and core.",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Keep your chest up and core braced",
      "Lower down as if sitting back into a chair",
      "Go down until thighs are parallel to the ground",
      "Drive through your heels to return to standing"
    ],
    muscleGroups: ["quadriceps", "glutes", "hamstrings"],
    equipment: "bodyweight",
    difficulty: "beginner",
    tips: [
      "Keep your knees in line with your toes",
      "Don't let your knees cave inward",
      "Keep most of your weight on your heels",
      "Practice the movement pattern before adding weight"
    ],
    variations: [
      { name: "Goblet Squats", description: "Hold a weight at chest level for added resistance" },
      { name: "Jump Squats", description: "Add explosive power by jumping at the top" }
    ]
  },
  {
    name: "Deadlifts",
    description: "One of the most effective full-body exercises. Primarily targets the posterior chain including glutes, hamstrings, and back.",
    instructions: [
      "Stand with feet hip-width apart, bar over mid-foot",
      "Hinge at hips and bend knees to grip the bar",
      "Keep your back straight and chest up",
      "Drive through heels and extend hips to lift the bar",
      "Stand tall, then reverse the movement to lower"
    ],
    muscleGroups: ["hamstrings", "glutes", "back"],
    equipment: "barbell",
    difficulty: "advanced",
    tips: [
      "Keep the bar close to your body throughout the movement",
      "Don't round your back",
      "Drive your hips forward at the top",
      "Master the hip hinge movement pattern first"
    ]
  },

  // Shoulder Exercises
  {
    name: "Shoulder Press",
    description: "A fundamental pressing movement that builds shoulder strength and stability. Can be performed seated or standing.",
    instructions: [
      "Hold dumbbells at shoulder height with palms facing forward",
      "Keep your core braced and back straight",
      "Press the weights directly overhead",
      "Lower back to starting position with control",
      "Don't arch your back excessively"
    ],
    muscleGroups: ["shoulders", "triceps"],
    equipment: "dumbbells",
    difficulty: "beginner",
    tips: [
      "Don't press the weights in front of or behind your head",
      "Keep your core engaged to protect your lower back",
      "Use a full range of motion",
      "Start with lighter weights to perfect form"
    ]
  },

  // Core Exercises
  {
    name: "Planks",
    description: "An isometric core exercise that builds stability and endurance in the entire midsection.",
    instructions: [
      "Start in a push-up position but rest on your forearms",
      "Keep your body in a straight line from head to heels",
      "Engage your core and hold the position",
      "Don't let your hips sag or pike up",
      "Breathe normally while holding"
    ],
    muscleGroups: ["core", "abs"],
    equipment: "bodyweight",
    difficulty: "beginner",
    tips: [
      "Focus on quality over quantity - perfect form is key",
      "Start with shorter holds and build up time gradually",
      "Keep your head in neutral position",
      "Squeeze your glutes to help maintain position"
    ],
    variations: [
      { name: "Side Planks", description: "Target obliques by planking on your side" },
      { name: "Plank Up-Downs", description: "Add movement by going from forearms to hands" }
    ]
  },

  // Arms Exercises
  {
    name: "Bicep Curls",
    description: "A classic isolation exercise for building bicep strength and size. Perfect for targeting the front of the arms.",
    instructions: [
      "Stand with dumbbells at your sides, palms facing forward",
      "Keep your elbows close to your torso",
      "Curl the weights up towards your shoulders",
      "Squeeze at the top, then lower slowly",
      "Don't swing or use momentum"
    ],
    muscleGroups: ["biceps"],
    equipment: "dumbbells",
    difficulty: "beginner",
    tips: [
      "Control the weight on the way down",
      "Don't let your elbows drift forward",
      "Focus on the squeeze at the top",
      "Use a weight that allows perfect form"
    ]
  },
  {
    name: "Tricep Dips",
    description: "An effective bodyweight exercise for building tricep strength using parallel bars or a bench.",
    instructions: [
      "Grip parallel bars or bench edge with hands shoulder-width apart",
      "Support your body weight with arms extended",
      "Lower your body by bending your elbows",
      "Go down until you feel a stretch in your chest",
      "Push back up to the starting position"
    ],
    muscleGroups: ["triceps", "shoulders"],
    equipment: "bodyweight",
    difficulty: "intermediate",
    tips: [
      "Keep your torso upright",
      "Don't go too low if you feel shoulder discomfort",
      "Use assistance or bent knees to modify difficulty",
      "Focus on controlled movement"
    ]
  }
];

// Sample workout plans
const sampleWorkoutPlans = [
  // Push Pull Legs
  {
    name: "Push Day - Chest, Shoulders & Triceps",
    description: "A comprehensive push workout targeting all pushing muscles. Great for building upper body pressing strength and muscle mass.",
    category: "push_pull_legs",
    targetMuscles: ["chest", "shoulders", "triceps"],
    difficulty: "intermediate",
    duration: 60,
    equipment: "gym",
    exercises: [], // Will be populated after exercises are created
    tags: ["mass", "strength", "upper body"]
  },
  {
    name: "Pull Day - Back & Biceps",
    description: "Focus on all pulling movements to build a strong, wide back and defined biceps. Perfect complement to push day.",
    category: "push_pull_legs",
    targetMuscles: ["back", "biceps"],
    difficulty: "intermediate",
    duration: 55,
    equipment: "gym",
    exercises: [],
    tags: ["back", "biceps", "pulling"]
  },
  {
    name: "Leg Day - Quads, Glutes & Hamstrings",
    description: "Complete lower body workout targeting all major leg muscles. Build strength and size in your legs.",
    category: "push_pull_legs",
    targetMuscles: ["quadriceps", "glutes", "hamstrings"],
    difficulty: "intermediate",
    duration: 65,
    equipment: "gym",
    exercises: [],
    tags: ["legs", "lower body", "strength"]
  },

  // Full Body
  {
    name: "Full Body Beginner",
    description: "Perfect starter workout hitting all major muscle groups. Ideal for beginners or those returning to fitness.",
    category: "full_body",
    targetMuscles: ["chest", "back", "legs", "shoulders"],
    difficulty: "beginner",
    duration: 45,
    equipment: "gym",
    exercises: [],
    tags: ["beginner", "full body", "starter"]
  },
  {
    name: "Bodyweight Full Body",
    description: "Complete workout using only your bodyweight. Perfect for home workouts or when you don't have access to equipment.",
    category: "bodyweight",
    targetMuscles: ["chest", "back", "legs", "core"],
    difficulty: "beginner",
    duration: 30,
    equipment: "bodyweight",
    exercises: [],
    tags: ["bodyweight", "home", "no equipment"]
  },

  // Strength Training
  {
    name: "Strength Foundations",
    description: "Focus on the big compound movements to build overall strength. Master the fundamentals of strength training.",
    category: "strength",
    targetMuscles: ["chest", "back", "legs"],
    difficulty: "intermediate",
    duration: 70,
    equipment: "gym",
    exercises: [],
    tags: ["strength", "compound", "powerlifting"]
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitness-tracker');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Exercise.deleteMany({});
    await WorkoutPlan.deleteMany({});
    console.log('Cleared existing data');

    // Insert exercises
    const insertedExercises = await Exercise.insertMany(sampleExercises);
    console.log(`Inserted ${insertedExercises.length} exercises`);

    // Create a map of exercise names to IDs for easy lookup
    const exerciseMap = {};
    insertedExercises.forEach(exercise => {
      exerciseMap[exercise.name] = exercise._id;
    });

    // Define workout plan exercises with references to actual exercise IDs
    const workoutPlanExercises = {
      "Push Day - Chest, Shoulders & Triceps": [
        { exerciseId: exerciseMap["Bench Press"], sets: 4, reps: "8-10", weight: "heavy", restTime: 90 },
        { exerciseId: exerciseMap["Shoulder Press"], sets: 3, reps: "10-12", weight: "moderate", restTime: 60 },
        { exerciseId: exerciseMap["Push-ups"], sets: 3, reps: "12-15", weight: "bodyweight", restTime: 45 }
      ],
      "Pull Day - Back & Biceps": [
        { exerciseId: exerciseMap["Pull-ups"], sets: 4, reps: "6-10", weight: "bodyweight", restTime: 90 },
        { exerciseId: exerciseMap["Bent-over Rows"], sets: 4, reps: "8-10", weight: "heavy", restTime: 90 },
        { exerciseId: exerciseMap["Bicep Curls"], sets: 3, reps: "12-15", weight: "moderate", restTime: 45 }
      ],
      "Leg Day - Quads, Glutes & Hamstrings": [
        { exerciseId: exerciseMap["Squats"], sets: 4, reps: "10-12", weight: "moderate", restTime: 90 },
        { exerciseId: exerciseMap["Deadlifts"], sets: 3, reps: "6-8", weight: "heavy", restTime: 120 }
      ],
      "Full Body Beginner": [
        { exerciseId: exerciseMap["Squats"], sets: 3, reps: "10-12", weight: "bodyweight", restTime: 60 },
        { exerciseId: exerciseMap["Push-ups"], sets: 3, reps: "8-12", weight: "bodyweight", restTime: 60 },
        { exerciseId: exerciseMap["Bent-over Rows"], sets: 3, reps: "10-12", weight: "light", restTime: 60 },
        { exerciseId: exerciseMap["Planks"], sets: 3, reps: "30-60 sec", weight: "bodyweight", restTime: 45 }
      ],
      "Bodyweight Full Body": [
        { exerciseId: exerciseMap["Push-ups"], sets: 3, reps: "8-15", weight: "bodyweight", restTime: 45 },
        { exerciseId: exerciseMap["Squats"], sets: 3, reps: "15-20", weight: "bodyweight", restTime: 45 },
        { exerciseId: exerciseMap["Planks"], sets: 3, reps: "30-60 sec", weight: "bodyweight", restTime: 30 },
        { exerciseId: exerciseMap["Tricep Dips"], sets: 2, reps: "8-12", weight: "bodyweight", restTime: 45 }
      ],
      "Strength Foundations": [
        { exerciseId: exerciseMap["Squats"], sets: 5, reps: "5", weight: "heavy", restTime: 180 },
        { exerciseId: exerciseMap["Bench Press"], sets: 5, reps: "5", weight: "heavy", restTime: 180 },
        { exerciseId: exerciseMap["Deadlifts"], sets: 3, reps: "5", weight: "heavy", restTime: 180 }
      ]
    };

    // Update workout plans with exercise references
    const updatedWorkoutPlans = sampleWorkoutPlans.map(plan => {
      return {
        ...plan,
        exercises: workoutPlanExercises[plan.name] || []
      };
    });

    // Insert workout plans
    const insertedPlans = await WorkoutPlan.insertMany(updatedWorkoutPlans);
    console.log(`Inserted ${insertedPlans.length} workout plans`);

    console.log('Database seeded successfully!');
    
    // Log summary
    console.log('\n=== SEEDING SUMMARY ===');
    console.log(`✅ ${insertedExercises.length} exercises created`);
    console.log(`✅ ${insertedPlans.length} workout plans created`);
    console.log('\nExercises by muscle group:');
    
    const muscleGroups = {};
    insertedExercises.forEach(exercise => {
      exercise.muscleGroups.forEach(muscle => {
        if (!muscleGroups[muscle]) muscleGroups[muscle] = 0;
        muscleGroups[muscle]++;
      });
    });
    
    Object.entries(muscleGroups).forEach(([muscle, count]) => {
      console.log(`  ${muscle}: ${count} exercises`);
    });

    console.log('\nWorkout plans by category:');
    const categories = {};
    insertedPlans.forEach(plan => {
      if (!categories[plan.category]) categories[plan.category] = 0;
      categories[plan.category]++;
    });
    
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} plans`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleExercises, sampleWorkoutPlans };