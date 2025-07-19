import { useState } from 'react';
import { Link } from 'react-router';
import { routes } from '@routes';
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
import { IconAt, IconLock } from '@tabler/icons-react';

interface LoginFormValues {
  username: string;
  password: string;
}

export function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => {
        return value.trim().length === 0 ? 'Username is required' : null;
      },
      password: (value) => {
        return value.length === 0 ? 'Password is required' : null;
      },
    },
  });

  const handleSubmit = (values: LoginFormValues) => {
    console.log(values);
    setError(null);
    try {
      //await login(values.username, values.password);
    } catch (error) {
      setError('Invalid username or password' + error);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center">Welcome to Tamaliftics!</Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Log in to your account to continue
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Username"
              placeholder="Your username"
              leftSection={<IconAt size="1rem" />}
              required
              {...form.getInputProps('username')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              leftSection={<IconLock size="1rem" />}
              required
              {...form.getInputProps('password')}
            />
          </Stack>

          {error && (
            <Text c="red" size="sm" mt="sm">
              {error}
            </Text>
          )}

          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </form>

        <Divider label="Or" labelPosition="center" my="lg" />

        <Group justify="center" mt="md">
          <Text size="sm">
            Don't have an account?{' '}
            <Anchor component={Link} to={routes.SIGNUP} fw={700}>
              Sign up
            </Anchor>
          </Text>
        </Group>
      </Paper>
    </Container>
  );
}
