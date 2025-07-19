export const constants = {
  // Auth
  login: 'login',
  signup: 'signup',
  auth: 'auth',
  delete: 'delete',
  ping: 'ping',
  users: 'users',

  // Daily Weights
  dailyWeights: 'daily-weights',
  range: 'range',

  // Diets
  diets: 'diets',
  search: 'search',
  meals: 'meals',

  // Dishes
  dishes: 'dishes',

  // Exercise Categories
  exerciseCategories: 'exercise-categories',

  // Exercises
  exercises: 'exercises',
  category: 'category',

  // Exercise Track Points
  exerciseTrackPoints: 'exercise-track-points',
  exercise: 'exercise',
  dateRange: 'date-range',

  // Meals

  // Weekly Weights
  weeklyWeights: 'weekly-weights',
  year: 'year',
  date: 'date',

  // Workout Plans
  workoutPlans: 'workout-plans',
  day: 'day',
};

export const routes = {
  //Auth Controller
  auth: {
    login: `${constants.auth}/${constants.login}`,
    signup: `${constants.auth}/${constants.signup}`,
    ping: `${constants.auth}/${constants.ping}`,
    deleteUser: (username: string) => {
      return `${constants.auth}/${constants.delete}/${constants.users}/${username}`;
    },
  },

  //Daily Weight Controller
  dailyWeights: {
    base: constants.dailyWeights,
    getById: (id: string) => {
      return `${constants.dailyWeights}/${id}`;
    },
    getAll: constants.dailyWeights,
    getRange: `${constants.dailyWeights}/${constants.range}`,
    create: constants.dailyWeights,
    update: constants.dailyWeights,
    delete: (id: string) => {
      return `${constants.dailyWeights}/${id}`;
    },
  },

  //Diet Controller
  diets: {
    base: constants.diets,
    getById: (id: string) => {
      return `${constants.diets}/${id}`;
    },
    getAll: constants.diets,
    search: `${constants.diets}/${constants.search}`,
    create: constants.diets,
    update: constants.diets,
    delete: (id: string) => {
      return `${constants.diets}/${id}`;
    },
    addMeal: (dietId: string, mealId: string) => {
      return `${constants.diets}/${dietId}/${constants.meals}/${mealId}`;
    },
    removeMeal: (dietId: string, mealId: string) => {
      return `${constants.diets}/${dietId}/${constants.meals}/${mealId}`;
    },
  },

  //Dish Controller
  dishes: {
    base: constants.dishes,
    getById: (id: string) => {
      return `${constants.dishes}/${id}`;
    },
    getAll: constants.dishes,
    search: `${constants.dishes}/${constants.search}`,
    create: constants.dishes,
    update: constants.dishes,
    delete: (id: string) => {
      return `${constants.dishes}/${id}`;
    },
  },

  //Exercise Category Controller
  exerciseCategories: {
    base: constants.exerciseCategories,
    getById: (id: string) => {
      return `${constants.exerciseCategories}/${id}`;
    },
    getAll: constants.exerciseCategories,
    search: `${constants.exerciseCategories}/${constants.search}`,
    create: constants.exerciseCategories,
    update: constants.exerciseCategories,
    delete: (id: string) => {
      return `${constants.exerciseCategories}/${id}`;
    },
  },

  //Exercise Controller
  exercises: {
    base: constants.exercises,
    getById: (id: string) => {
      return `${constants.exercises}/${id}`;
    },
    getAll: constants.exercises,
    getByCategory: (categoryId: string) => {
      return `${constants.exercises}/${constants.category}/${categoryId}`;
    },
    search: `${constants.exercises}/${constants.search}`,
    create: constants.exercises,
    update: constants.exercises,
    delete: (id: string) => {
      return `${constants.exercises}/${id}`;
    },
  },

  //Exercise Track Point Controller
  exerciseTrackPoints: {
    base: constants.exerciseTrackPoints,
    getById: (id: string) => {
      return `${constants.exerciseTrackPoints}/${id}`;
    },
    getForExercise: (exerciseId: string) => {
      return `${constants.exerciseTrackPoints}/${constants.exercise}/${exerciseId}`;
    },
    getForExercises: `${constants.exerciseTrackPoints}/${constants.exercises}`,
    getForExerciseDateRange: (exerciseId: string) => {
      return `${constants.exerciseTrackPoints}/${constants.exercise}/${exerciseId}/${constants.dateRange}`;
    },
    create: constants.exerciseTrackPoints,
    update: constants.exerciseTrackPoints,
    delete: (id: string) => {
      return `${constants.exerciseTrackPoints}/${id}`;
    },
  },

  //Meal Controller
  meals: {
    base: constants.meals,
    getById: (id: string) => {
      return `${constants.meals}/${id}`;
    },
    getAll: constants.meals,
    create: constants.meals,
    update: constants.meals,
    delete: (id: string) => {
      return `${constants.meals}/${id}`;
    },
    addDish: (mealId: string, dishId: string) => {
      return `${constants.meals}/${mealId}/${constants.dishes}/${dishId}`;
    },
    removeDish: (mealId: string, dishId: string) => {
      return `${constants.meals}/${mealId}/${constants.dishes}/${dishId}`;
    },
  },

  //Weekly Weight Controller
  weeklyWeights: {
    base: constants.weeklyWeights,
    getById: (id: string) => {
      return `${constants.weeklyWeights}/${id}`;
    },
    getAll: constants.weeklyWeights,
    getByYear: (year: number) => {
      return `${constants.weeklyWeights}/${constants.year}/${year}`;
    },
    getRange: `${constants.weeklyWeights}/${constants.range}`,
    getForDate: `${constants.weeklyWeights}/${constants.date}`,
  },

  //Workout Plan Controller
  workoutPlans: {
    base: constants.workoutPlans,
    getById: (id: string) => {
      return `${constants.workoutPlans}/${id}`;
    },
    getAll: constants.workoutPlans,
    getByDay: (day: string) => {
      return `${constants.workoutPlans}/${constants.day}/${day}`;
    },
    create: constants.workoutPlans,
    update: constants.workoutPlans,
    delete: (id: string) => {
      return `${constants.workoutPlans}/${id}`;
    },
    addExercise: (planId: string, exerciseId: string) => {
      return `${constants.workoutPlans}/${planId}/${constants.exercises}/${exerciseId}`;
    },
    removeExercise: (planId: string, exerciseId: string) => {
      return `${constants.workoutPlans}/${planId}/${constants.exercises}/${exerciseId}`;
    },
  },
};
