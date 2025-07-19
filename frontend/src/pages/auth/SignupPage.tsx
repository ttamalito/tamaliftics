import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router';
import { ROOT_ROUTES } from '../../routes/routes';
import {
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Container,
  Button,
  Text,
  Anchor,
  Group,
  Divider,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconLock, IconUser, IconMail } from '@tabler/icons-react';

interface SignupFormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export function SignupPage() {
  const { signup, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    },
    validate: {
      username: (value) => {
        return value.trim().length === 0 ? 'Username is required' : null;
      },
      email: (value) => {
        return /^\S+@\S+$/.test(value) ? null : 'Invalid email';
      },
      password: (value) => {
        return value.length < 6
          ? 'Password must be at least 6 characters'
          : null;
      },
      confirmPassword: (value, values) => {
        return value !== values.password ? 'Passwords do not match' : null;
      },
    },
  });

  const handleSubmit = async (values: SignupFormValues) => {
    setError(null);
    try {
      await signup(
        values.username,
        values.password,
        values.email,
        values.firstName || undefined,
        values.lastName || undefined,
      );
    } catch (error) {
      setError('Username or email already exists' + error);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Create an account</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Sign up to start tracking your fitness journey
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Username"
              placeholder="Your username"
              leftSection={<IconUser size="1rem" />}
              required
              {...form.getInputProps('username')}
            />

            <TextInput
              label="Email"
              placeholder="Your email"
              leftSection={<IconMail size="1rem" />}
              required
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              leftSection={<IconLock size="1rem" />}
              required
              {...form.getInputProps('password')}
            />

            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              leftSection={<IconLock size="1rem" />}
              required
              {...form.getInputProps('confirmPassword')}
            />

            <Group grow>
              <TextInput
                label="First Name"
                placeholder="Your first name"
                {...form.getInputProps('firstName')}
              />

              <TextInput
                label="Last Name"
                placeholder="Your last name"
                {...form.getInputProps('lastName')}
              />
            </Group>
          </Stack>

          {error && (
            <Text c="red" size="sm" mt="sm">
              {error}
            </Text>
          )}

          <Button fullWidth mt="xl" type="submit" loading={isLoading}>
            Sign up
          </Button>
        </form>

        <Divider label="Or" labelPosition="center" my="lg" />

        <Group justify="center" mt="md">
          <Text size="sm">
            Already have an account?{' '}
            <Anchor component={Link} to={ROOT_ROUTES.LOGIN} fw={700}>
              Sign in
            </Anchor>
          </Text>
        </Group>
      </Paper>
    </Container>
  );
}
