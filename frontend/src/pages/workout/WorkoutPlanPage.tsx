import { useState } from 'react';
import {
  Container,
  Title,
  Paper,
  Button,
  Group,
  Text,
  Stack,
  Card,
  ActionIcon,
  Modal,
  Textarea,
  Select,
  Tabs,
  MultiSelect,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';

// Types for workout plans
// @ts-ignore
enum WorkoutType {
  PushAndPull1 = 'PushAndPull1',
  PushAndPull2 = 'PushAndPull2',
  Legs1 = 'Legs1',
  Legs2 = 'Legs2',
  Abs = 'Abs',
}

// @ts-ignore
enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
}

interface Exercise {
  id: string;
  name: string;
  categoryId: string;
}

interface WorkoutPlan {
  id: string;
  type: WorkoutType;
  day: DayOfWeek;
  description: string;
  exerciseIds: string[];
}

// Form values for workout plan creation/editing
interface WorkoutPlanFormValues {
  type: WorkoutType;
  day: DayOfWeek;
  description: string;
  exerciseIds: string[];
}

export function WorkoutPlanPage() {
  // Mock data for exercises
  const exercises: Exercise[] = [
    { id: '1', name: 'Bench Press', categoryId: '1' },
    { id: '2', name: 'Deadlift', categoryId: '2' },
    { id: '3', name: 'Squat', categoryId: '3' },
    { id: '4', name: 'Pull-ups', categoryId: '2' },
    { id: '5', name: 'Push-ups', categoryId: '1' },
    { id: '6', name: 'Leg Press', categoryId: '3' },
    { id: '7', name: 'Bicep Curls', categoryId: '4' },
    { id: '8', name: 'Tricep Extensions', categoryId: '4' },
    { id: '9', name: 'Shoulder Press', categoryId: '5' },
    { id: '10', name: 'Crunches', categoryId: '6' },
    { id: '11', name: 'Planks', categoryId: '6' },
    { id: '12', name: 'Russian Twists', categoryId: '6' },
  ];

  // Mock data for workout plans
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([
    {
      id: '1',
      type: WorkoutType.PushAndPull1,
      day: DayOfWeek.Monday,
      description: 'Focus on chest and back with heavy weights',
      exerciseIds: ['1', '2', '4', '5'],
    },
    {
      id: '2',
      type: WorkoutType.Legs1,
      day: DayOfWeek.Wednesday,
      description: 'Leg day with emphasis on squats',
      exerciseIds: ['3', '6'],
    },
    {
      id: '3',
      type: WorkoutType.PushAndPull2,
      day: DayOfWeek.Friday,
      description: 'Focus on shoulders and arms',
      exerciseIds: ['7', '8', '9'],
    },
    {
      id: '4',
      type: WorkoutType.Abs,
      day: DayOfWeek.Saturday,
      description: 'Core workout',
      exerciseIds: ['10', '11', '12'],
    },
  ]);

  const [activeTab, setActiveTab] = useState<string | null>('all');
  const [editingPlan, setEditingPlan] = useState<WorkoutPlan | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<WorkoutPlanFormValues>({
    initialValues: {
      type: WorkoutType.PushAndPull1,
      day: DayOfWeek.Monday,
      description: '',
      exerciseIds: [],
    },
    validate: {
      description: (value) => {
        return value.trim().length === 0 ? 'Description is required' : null;
      },
      exerciseIds: (value) => {
        return value.length === 0 ? 'At least one exercise is required' : null;
      },
    },
  });

  const handleOpenModal = (plan?: WorkoutPlan) => {
    if (plan) {
      setEditingPlan(plan);
      form.setValues({
        type: plan.type,
        day: plan.day,
        description: plan.description,
        exerciseIds: plan.exerciseIds,
      });
    } else {
      setEditingPlan(null);
      form.reset();
    }
    open();
  };

  const handleSubmit = (values: WorkoutPlanFormValues) => {
    const newPlan: WorkoutPlan = {
      id: editingPlan ? editingPlan.id : Date.now().toString(),
      ...values,
    };

    if (editingPlan) {
      // Update existing plan
      setWorkoutPlans(
        workoutPlans.map((plan) => {
          return plan.id === editingPlan.id ? newPlan : plan;
        }),
      );
    } else {
      // Add new plan
      setWorkoutPlans([...workoutPlans, newPlan]);
    }

    close();
  };

  const handleDeletePlan = (id: string) => {
    setWorkoutPlans(
      workoutPlans.filter((plan) => {
        return plan.id !== id;
      }),
    );
  };

  const getExerciseName = (id: string) => {
    const exercise = exercises.find((ex) => {
      return ex.id === id;
    });
    return exercise ? exercise.name : 'Unknown Exercise';
  };

  const getFilteredPlans = () => {
    if (activeTab === 'all') return workoutPlans;
    return workoutPlans.filter((plan) => {
      return plan.type === activeTab;
    });
  };

  const workoutTypeOptions = [
    { value: WorkoutType.PushAndPull1, label: 'Push and Pull 1' },
    { value: WorkoutType.PushAndPull2, label: 'Push and Pull 2' },
    { value: WorkoutType.Legs1, label: 'Legs 1' },
    { value: WorkoutType.Legs2, label: 'Legs 2' },
    { value: WorkoutType.Abs, label: 'Abs' },
  ];

  const dayOptions = [
    { value: DayOfWeek.Monday, label: 'Monday' },
    { value: DayOfWeek.Tuesday, label: 'Tuesday' },
    { value: DayOfWeek.Wednesday, label: 'Wednesday' },
    { value: DayOfWeek.Thursday, label: 'Thursday' },
    { value: DayOfWeek.Friday, label: 'Friday' },
    { value: DayOfWeek.Saturday, label: 'Saturday' },
    { value: DayOfWeek.Sunday, label: 'Sunday' },
  ];

  const exerciseOptions = exercises.map((exercise) => {
    return {
      value: exercise.id,
      label: exercise.name,
    };
  });

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Group justify="space-between" mb="xl">
          <Title order={1}>Workout Plans</Title>
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={() => {
              return handleOpenModal();
            }}
          >
            Add Workout Plan
          </Button>
        </Group>

        <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
          <Tabs.List>
            <Tabs.Tab value="all">All Plans</Tabs.Tab>
            <Tabs.Tab value={WorkoutType.PushAndPull1}>
              Push and Pull 1
            </Tabs.Tab>
            <Tabs.Tab value={WorkoutType.PushAndPull2}>
              Push and Pull 2
            </Tabs.Tab>
            <Tabs.Tab value={WorkoutType.Legs1}>Legs 1</Tabs.Tab>
            <Tabs.Tab value={WorkoutType.Legs2}>Legs 2</Tabs.Tab>
            <Tabs.Tab value={WorkoutType.Abs}>Abs</Tabs.Tab>
          </Tabs.List>
        </Tabs>

        {getFilteredPlans().length === 0 ? (
          <Text c="dimmed" ta="center">
            No workout plans found.
          </Text>
        ) : (
          <Stack gap="md">
            {getFilteredPlans().map((plan) => {
              return (
                <Card key={plan.id} withBorder shadow="sm" padding="md">
                  <Group justify="space-between">
                    <div>
                      <Title order={3}>
                        {
                          workoutTypeOptions.find((opt) => {
                            return opt.value === plan.type;
                          })?.label
                        }
                      </Title>
                      <Text size="sm" c="dimmed">
                        Day: {plan.day}
                      </Text>
                    </div>
                    <Group>
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => {
                          return handleOpenModal(plan);
                        }}
                      >
                        <IconEdit size="1rem" />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => {
                          return handleDeletePlan(plan.id);
                        }}
                      >
                        <IconTrash size="1rem" />
                      </ActionIcon>
                    </Group>
                  </Group>

                  <Text mt="xs">{plan.description}</Text>

                  <Divider my="sm" />

                  <Title order={4} mb="xs">
                    Exercises
                  </Title>
                  <Stack gap="xs">
                    {plan.exerciseIds.map((exId) => {
                      return <Text key={exId}>• {getExerciseName(exId)}</Text>;
                    })}
                  </Stack>
                </Card>
              );
            })}
          </Stack>
        )}
      </Paper>

      <Modal
        opened={opened}
        onClose={close}
        title={editingPlan ? 'Edit Workout Plan' : 'Add New Workout Plan'}
        centered
        size="lg"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Select
              label="Workout Type"
              placeholder="Select workout type"
              data={workoutTypeOptions}
              required
              {...form.getInputProps('type')}
            />

            <Select
              label="Day of Week"
              placeholder="Select day"
              data={dayOptions}
              required
              {...form.getInputProps('day')}
            />

            <Textarea
              label="Description"
              placeholder="Workout plan description"
              required
              {...form.getInputProps('description')}
            />

            <MultiSelect
              label="Exercises"
              placeholder="Select exercises"
              data={exerciseOptions}
              required
              searchable
              {...form.getInputProps('exerciseIds')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={close}>
                Cancel
              </Button>
              <Button type="submit">{editingPlan ? 'Update' : 'Add'}</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
