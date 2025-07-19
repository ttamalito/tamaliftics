import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Paper,
} from '@mantine/core';
import { Link } from 'react-router';
import { ROOT_ROUTES } from '@routes';
import { useAuth } from '@hooks/useAuth.ts';

export function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Stack gap="xl">
          <Title order={1} ta="center">
            Welcome to Tamaliftics
          </Title>

          <Text size="lg" ta="center">
            Your personal fitness tracking application to help you achieve your
            health and fitness goals.
          </Text>

          {!isAuthenticated && (
            <Group justify="center" gap="md">
              <Button
                component={Link}
                to={ROOT_ROUTES.LOGIN}
                size="lg"
                variant="outline"
              >
                Login
              </Button>
              <Button component={Link} to={ROOT_ROUTES.SIGNUP} size="lg">
                Sign Up
              </Button>
            </Group>
          )}

          {isAuthenticated && (
            <Stack gap="md">
              <Title order={3} ta="center">
                Quick Links
              </Title>

              <Group grow>
                <Button component={Link} to={ROOT_ROUTES.DIET} variant="light">
                  Manage Diet
                </Button>
                <Button
                  component={Link}
                  to={ROOT_ROUTES.WEIGHT}
                  variant="light"
                >
                  Track Weight
                </Button>
              </Group>

              <Group grow>
                <Button
                  component={Link}
                  to={ROOT_ROUTES.EXERCISES}
                  variant="light"
                >
                  Track Exercises
                </Button>
                <Button
                  component={Link}
                  to={ROOT_ROUTES.WORKOUT_PLAN}
                  variant="light"
                >
                  Workout Plans
                </Button>
              </Group>
            </Stack>
          )}

          <Stack gap="lg">
            <Title order={2} ta="center">
              Features
            </Title>

            <Group grow align="flex-start">
              <Paper p="md" withBorder>
                <Stack>
                  <Title order={4}>Diet Management</Title>
                  <Text>
                    Create and manage your diet plan with detailed nutritional
                    information.
                  </Text>
                </Stack>
              </Paper>

              <Paper p="md" withBorder>
                <Stack>
                  <Title order={4}>Weight Tracking</Title>
                  <Text>
                    Track your weight progress over time with detailed charts
                    and analytics.
                  </Text>
                </Stack>
              </Paper>
            </Group>

            <Group grow align="flex-start">
              <Paper p="md" withBorder>
                <Stack>
                  <Title order={4}>Exercise Tracking</Title>
                  <Text>
                    Define exercises and track your progress with detailed
                    performance metrics.
                  </Text>
                </Stack>
              </Paper>

              <Paper p="md" withBorder>
                <Stack>
                  <Title order={4}>Workout Plans</Title>
                  <Text>
                    Create customized workout plans to organize your fitness
                    routine.
                  </Text>
                </Stack>
              </Paper>
            </Group>
          </Stack>
        </Stack>
      </Paper>
    </Container>
  );
}
