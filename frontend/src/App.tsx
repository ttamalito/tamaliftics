import { Routes, Route } from 'react-router';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/home/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { DietPage } from './pages/diet/DietPage';
import { WeightPage } from './pages/weight/WeightPage';
import { ExerciseCategoriesPage } from './pages/exercise/ExerciseCategoriesPage';
import { ExercisesPage } from './pages/exercise/ExercisesPage';
import { WorkoutPlanPage } from './pages/workout/WorkoutPlanPage';
import { ROOT_ROUTES } from './routes/routes';

function App() {
  return (
    <Routes>
      <Route path={ROOT_ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROOT_ROUTES.SIGNUP} element={<SignupPage />} />

      <Route element={<AppLayout />}>
        <Route path={ROOT_ROUTES.HOME} element={<HomePage />} />
        <Route path={ROOT_ROUTES.DIET} element={<DietPage />} />
        <Route path={ROOT_ROUTES.WEIGHT} element={<WeightPage />} />
        <Route path={ROOT_ROUTES.EXERCISE_CATEGORIES} element={<ExerciseCategoriesPage />} />
        <Route path={ROOT_ROUTES.EXERCISES} element={<ExercisesPage />} />
        <Route path={ROOT_ROUTES.WORKOUT_PLAN} element={<WorkoutPlanPage />} />
      </Route>
    </Routes>
  );
}

export default App;
