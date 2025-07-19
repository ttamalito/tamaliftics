export const ROOT_ROUTES = {
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
  ROOT_ROUTES.DIET,
  ROOT_ROUTES.WEIGHT,
  ROOT_ROUTES.EXERCISE_CATEGORIES,
  ROOT_ROUTES.EXERCISES,
  ROOT_ROUTES.WORKOUT_PLAN,
];
