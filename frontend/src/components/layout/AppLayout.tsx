import { Outlet, Link, useLocation } from 'react-router';
import { routes } from '@routes';
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Title,
  Avatar,
  Menu,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconHome,
  IconSalad,
  IconWeight,
  IconBarbell,
  IconCategory,
  IconCalendarStats,
  IconUser,
} from '@tabler/icons-react';
import { useAuth } from '@hooks/useAuth.tsx';

export function AppLayout() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const { onLogout } = useAuth();

  const navItems = [
    { label: 'Home', icon: <IconHome size="1rem" />, to: routes.DIET },
    { label: 'Diet', icon: <IconSalad size="1rem" />, to: routes.DIET },
    {
      label: 'Weight Tracking',
      icon: <IconWeight size="1rem" />,
      to: routes.WEIGHT,
    },
    {
      label: 'Exercise Categories',
      icon: <IconCategory size="1rem" />,
      to: routes.EXERCISE_CATEGORIES,
    },
    {
      label: 'Exercises',
      icon: <IconBarbell size="1rem" />,
      to: routes.EXERCISES,
    },
    {
      label: 'Workout Plan',
      icon: <IconCalendarStats size="1rem" />,
      to: routes.WORKOUT_PLAN,
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
          {
            <Menu position="bottom-end" withArrow>
              <Menu.Target>
                <Avatar color="blue" radius="xl" style={{ cursor: 'pointer' }}>
                  <IconUser size={24} />
                </Avatar>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={onLogout}>Logout</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          }
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
