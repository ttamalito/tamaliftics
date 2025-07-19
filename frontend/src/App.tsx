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
import { routes } from '@routes';

function App() {
  return (
    <Routes>
      <Route path={routes.LOGIN} element={<LoginPage />} />
      <Route path={routes.SIGNUP} element={<SignupPage />} />

      <Route element={<AppLayout />}>
        <Route path={routes.HOME} element={<HomePage />} />
        <Route path={routes.DIET} element={<DietPage />} />
        <Route path={routes.WEIGHT} element={<WeightPage />} />
        <Route
          path={routes.EXERCISE_CATEGORIES}
          element={<ExerciseCategoriesPage />}
        />
        <Route path={routes.EXERCISES} element={<ExercisesPage />} />
        <Route path={routes.WORKOUT_PLAN} element={<WorkoutPlanPage />} />
      </Route>
    </Routes>
  );
}

export default App;
