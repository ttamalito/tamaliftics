import { Outlet, Link, useLocation } from 'react-router';
import { useAuth } from '@hooks/useAuth.ts';
import { ROOT_ROUTES } from '@routes';
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Button,
  Title,
  Avatar,
  Menu,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconHome,
  IconSalad,
  IconWeight,
  IconBarbell,
  IconCategory,
  IconCalendarStats,
  IconLogout,
  IconUser,
} from '@tabler/icons-react';

export function AppLayout() {
  const [opened, { toggle }] = useDisclosure();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { label: 'Home', icon: <IconHome size="1rem" />, to: ROOT_ROUTES.HOME },
    { label: 'Diet', icon: <IconSalad size="1rem" />, to: ROOT_ROUTES.DIET },
    {
      label: 'Weight Tracking',
      icon: <IconWeight size="1rem" />,
      to: ROOT_ROUTES.WEIGHT,
    },
    {
      label: 'Exercise Categories',
      icon: <IconCategory size="1rem" />,
      to: ROOT_ROUTES.EXERCISE_CATEGORIES,
    },
    {
      label: 'Exercises',
      icon: <IconBarbell size="1rem" />,
      to: ROOT_ROUTES.EXERCISES,
    },
    {
      label: 'Workout Plan',
      icon: <IconCalendarStats size="1rem" />,
      to: ROOT_ROUTES.WORKOUT_PLAN,
    },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Title order={3}>Tamaliftics</Title>
          </Group>

          {isAuthenticated ? (
            <Menu position="bottom-end" withArrow>
              <Menu.Target>
                <Avatar color="blue" radius="xl" style={{ cursor: 'pointer' }}>
                  <IconUser size={rem(24)} />
                </Avatar>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconLogout size={rem(14)} />}
                  onClick={logout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Group>
              <Button component={Link} to={ROOT_ROUTES.LOGIN} variant="subtle">
                Login
              </Button>
              <Button component={Link} to={ROOT_ROUTES.SIGNUP}>
                Sign Up
              </Button>
            </Group>
          )}
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {navItems.map((item) => {
          return (
            <NavLink
              key={item.to}
              label={item.label}
              leftSection={item.icon}
              component={Link}
              to={item.to}
              active={location.pathname === item.to}
            />
          );
        })}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
