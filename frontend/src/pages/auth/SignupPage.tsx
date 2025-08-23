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
import { IconLock, IconUser, IconMail } from '@tabler/icons-react';
import { ISignupRequestDto } from '@clients';
import { usePostSignup } from '@requests/authRequests.ts';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router';
import classes from './SignupPage.module.css';

export function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [signup] = usePostSignup();
  const navigate = useNavigate();

  const form = useForm<ISignupRequestDto>({
    // validate: {
    //   username: (value) => {
    //     return value?.trim().length === 0 ? 'Username is required' : null;
    //   },
    //   email: (value) => {
    //     return /^\S+@\S+$/.test(value ?? '') ? null : 'Invalid email';
    //   },
    //   password: (value) => {
    //     return value && value.length < 6
    //       ? 'Password must be at least 6 characters'
    //       : null;
    //   },
    //   confirmPassword: (value, values) => {
    //     return value !== values.password ? 'Passwords do not match' : null;
    //   },
    // },
  });

  const handleSubmit = (values: ISignupRequestDto) => {
    setError(null);
    try {
      console.log(values);
      signup(values)
        .then(() => {
          // onLogin({
          //   username: values.username,
          //   password: values.password,
          // }).then((response) => {
          //   console.log(response);
          // });
          notifications.show({
            title: 'Success',
            message: 'Account created successfully',
            color: 'green',
          });
          navigate(routes.HOME, { replace: true });
        })
        .catch((err) => {
          console.log(err);
          setError(err.message);
        });
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
      <Text
        className={classes['go-back-anchor']}
        c="dimmed"
        size="sm"
        ta="center"
        mt={5}
        onClick={() => {
          navigate(routes.HOME);
        }}
      >
        Go back Home
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Username"
              placeholder="Your username"
              leftSection={<IconUser size="1rem" />}
              required
              key={form.key('username')}
              {...form.getInputProps('username')}
            />

            <TextInput
              label="Email"
              placeholder="Your email"
              leftSection={<IconMail size="1rem" />}
              required
              key={form.key('email')}
              {...form.getInputProps('email')}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              leftSection={<IconLock size="1rem" />}
              required
              key={form.key('password')}
              {...form.getInputProps('password')}
            />

            {/*<PasswordInput*/}
            {/*  label="Confirm Password"*/}
            {/*  placeholder="Confirm your password"*/}
            {/*  leftSection={<IconLock size="1rem" />}*/}
            {/*  required*/}
            {/*  key={form.key('')}*/}
            {/*  {...form.getInputProps('confirmPassword')}*/}
            {/*/>*/}

            <Group grow>
              <TextInput
                label="First Name"
                placeholder="Your first name"
                key={form.key('firstName')}
                {...form.getInputProps('firstName')}
              />

              <TextInput
                label="Last Name"
                placeholder="Your last name"
                key={form.key('lastName')}
                {...form.getInputProps('lastName')}
              />
            </Group>
          </Stack>

          {error && (
            <Text c="red" size="sm" mt="sm">
              {error}
            </Text>
          )}

          <Button fullWidth mt="xl" type="submit">
            Sign up
          </Button>
        </form>

        <Divider label="Or" labelPosition="center" my="lg" />

        <Group justify="center" mt="md">
          <Text size="sm">
            Already have an account?{' '}
            <Anchor component={Link} to={routes.LOGIN} fw={700}>
              Sign in
            </Anchor>
          </Text>
        </Group>
      </Paper>
    </Container>
  );
}
