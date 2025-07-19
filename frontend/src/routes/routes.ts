export const routes = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DIET: '/diet',
  WEIGHT: '/weight',
  EXERCISE_CATEGORIES: '/exercise-categories',
  EXERCISES: '/exercises',
  WORKOUT_PLAN: '/workout-plan',
};

export const PROTECTED_ROUTES = [
  routes.DIET,
  routes.WEIGHT,
  routes.EXERCISE_CATEGORIES,
  routes.EXERCISES,
  routes.WORKOUT_PLAN,
];
