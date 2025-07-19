import { useState, useCallback, useEffect, useMemo } from 'react';
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
  Drawer,
  Textarea,
  Select,
  MultiSelect,
  Divider,
  LoadingOverlay,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import {
  IGetExerciseDto,
  IGetWorkoutPlanDto,
  ICreateWorkoutPlanDto,
  IUpdateWorkoutPlanDto,
  GetWorkoutPlanDtoType,
  CreateWorkoutPlanDtoDay,
  CreateWorkoutPlanDtoType,
  UpdateWorkoutPlanDtoType,
  UpdateWorkoutPlanDtoDay,
  GetWorkoutPlanDtoDay,
} from '@clients';
import { useGetAllExercises } from '@hooks/requests/exerciseRequests';
import {
  useGetAllWorkoutPlans,
  useDeleteWorkoutPlan,
  usePostWorkoutPlan,
  usePutWorkoutPlan,
} from '@hooks/requests/workoutPlanRequests';

export function WorkoutPlanPage() {
  // State for exercises
  const [exercises, setExercises] = useState<IGetExerciseDto[]>([]);
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const [exercisesError, setExercisesError] = useState<string | null>(null);

  // State for workout plans
  const [workoutPlans, setWorkoutPlans] = useState<IGetWorkoutPlanDto[]>([]);
  const [workoutPlansLoading, setWorkoutPlansLoading] = useState(false);
  const [workoutPlansError, setWorkoutPlansError] = useState<string | null>(
    null,
  );

  // API hooks
  const [getAllExercises] = useGetAllExercises();
  const [getAllWorkoutPlans] = useGetAllWorkoutPlans();
  const [deleteWorkoutPlan] = useDeleteWorkoutPlan();
  const [createWorkoutPlan] = usePostWorkoutPlan();
  const [updateWorkoutPlan] = usePutWorkoutPlan();

  // Fetch all exercises
  const fetchExercises = useCallback(async () => {
    setExercisesLoading(true);
    setExercisesError(null);
    try {
      const response = await getAllExercises();
      if (response?.data) {
        setExercises(response.data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch exercises';
      setExercisesError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setExercisesLoading(false);
    }
  }, []);

  // Fetch all workout plans
  const fetchWorkoutPlans = useCallback(async () => {
    setWorkoutPlansLoading(true);
    setWorkoutPlansError(null);
    try {
      const response = await getAllWorkoutPlans();
      if (response?.data) {
        setWorkoutPlans(response.data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch workout plans';
      setWorkoutPlansError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setWorkoutPlansLoading(false);
    }
  }, []);

  // Fetch exercises and workout plans when component mounts
  useEffect(() => {
    fetchExercises();
    fetchWorkoutPlans();
  }, []);

  const [editingPlan, setEditingPlan] = useState<IGetWorkoutPlanDto | null>(
    null,
  );
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<ICreateWorkoutPlanDto>({
    validate: {
      description: (value) => {
        return value?.trim().length === 0 ? 'Description is required' : null;
      },
      exerciseIds: (value) => {
        return value?.length === 0 ? 'At least one exercise is required' : null;
      },
    },
  });

  const handleOpenModal = useCallback(
    (plan?: IGetWorkoutPlanDto) => {
      if (plan) {
        setEditingPlan(plan);
        // @ts-ignore

        form.setValues({
          // @ts-ignore
          type: plan.type as GetWorkoutPlanDtoType,
          // @ts-ignore
          day: plan.day as unknown as GetWorkoutPlanDtoDay,
          description: plan.description || '',
          exerciseIds:
            plan.exercises?.map((ex) => {
              return ex.id || '';
            }) || [],
        });
      } else {
        setEditingPlan(null);
        form.reset();
      }
      open();
    },
    [form],
  );

  const handleSubmit = useCallback(async (values: IUpdateWorkoutPlanDto) => {
    try {
      if (editingPlan) {
        // Update existing plan
        const updateData: IUpdateWorkoutPlanDto = {
          id: editingPlan.id!,
          type: values.type as unknown as UpdateWorkoutPlanDtoType,
          day: values.day as unknown as UpdateWorkoutPlanDtoDay,
          description: values.description,
          exerciseIds: values.exerciseIds,
        };

        await updateWorkoutPlan(updateData);

        notifications.show({
          title: 'Success',
          message: 'Workout plan updated successfully',
          color: 'green',
        });
      } else {
        // Create new plan
        const createData: ICreateWorkoutPlanDto = {
          type: values.type as unknown as CreateWorkoutPlanDtoType,
          day: values.day as unknown as CreateWorkoutPlanDtoDay,
          description: values.description,
          exerciseIds: values.exerciseIds,
        };

        await createWorkoutPlan(createData);

        notifications.show({
          title: 'Success',
          message: 'Workout plan created successfully',
          color: 'green',
        });
      }

      // After successful creation/update, fetch all workout plans to get the updated list
      fetchWorkoutPlans();
      close();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save workout plan';
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    }
  }, []);

  const handleDeletePlan = useCallback(async (id: string) => {
    try {
      // Call API to delete the workout plan
      await deleteWorkoutPlan(id);

      // After successful deletion, fetch all workout plans to get the updated list
      fetchWorkoutPlans();

      notifications.show({
        title: 'Success',
        message: 'Workout plan deleted successfully',
        color: 'green',
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to delete workout plan';
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    }
  }, []);

  const workoutTypeOptions = [
    {
      value: GetWorkoutPlanDtoType.PUSH_AND_PULL_1,
      label: 'Push and Pull 1',
    },
    {
      value: GetWorkoutPlanDtoType.PUSH_AND_PULL_2,
      label: 'Push and Pull 2',
    },
    {
      value: GetWorkoutPlanDtoType.LEGS_1,
      label: 'Legs 1',
    },
    {
      value: GetWorkoutPlanDtoType.LEGS_2,
      label: 'Legs 2',
    },
    { value: GetWorkoutPlanDtoType.ABS, label: 'Abs' },
  ];

  const dayOptions = [
    { value: CreateWorkoutPlanDtoDay.MONDAY, label: 'Monday' },
    { value: CreateWorkoutPlanDtoDay.TUESDAY, label: 'Tuesday' },
    { value: CreateWorkoutPlanDtoDay.WEDNESDAY, label: 'Wednesday' },
    { value: CreateWorkoutPlanDtoDay.THURSDAY, label: 'Thursday' },
    { value: CreateWorkoutPlanDtoDay.FRIDAY, label: 'Friday' },
    { value: CreateWorkoutPlanDtoDay.SATURDAY, label: 'Saturday' },
    { value: CreateWorkoutPlanDtoDay.SUNDAY, label: 'Sunday' },
  ];

  const exerciseOptions = useMemo(() => {
    return exercises.map((exercise) => {
      return {
        value: exercise.id!,
        label: exercise.name!,
      };
    });
  }, [exercises]);

  // @ts-ignore
  // @ts-ignore
  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder pos="relative">
        <LoadingOverlay visible={exercisesLoading || workoutPlansLoading} />
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

        {exercisesError && (
          <Paper shadow="md" p="md" radius="md" withBorder mb="md" bg="red.1">
            <Text c="red">{exercisesError}</Text>
          </Paper>
        )}

        {workoutPlansError && (
          <Paper shadow="md" p="md" radius="md" withBorder mb="md" bg="red.1">
            <Text c="red">{workoutPlansError}</Text>
          </Paper>
        )}

        <Title order={2} mb="md">
          All Plans
        </Title>

        {useMemo(() => {
          return workoutPlans.length === 0 ? (
            <Text c="dimmed" ta="center">
              {workoutPlansLoading
                ? 'Loading workout plans...'
                : 'No workout plans found.'}
            </Text>
          ) : (
            <Stack gap="md">
              {workoutPlans.map((plan) => {
                return (
                  <Card key={plan.id} withBorder shadow="sm" padding="md">
                    <Group justify="space-between">
                      <div>
                        <Title order={3}>
                          {workoutTypeOptions.find((opt) => {
                            return opt.value === plan.type;
                          })?.label || plan.type}
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
                            return handleDeletePlan(plan.id || '');
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
                      {plan.exercises &&
                        plan.exercises.map((exercise) => {
                          return (
                            <Text key={exercise.id}>• {exercise.name}</Text>
                          );
                        })}
                    </Stack>
                  </Card>
                );
              })}
            </Stack>
          );
        }, [workoutPlans])}
      </Paper>

      <Drawer
        opened={opened}
        onClose={close}
        title={editingPlan ? 'Edit Workout Plan' : 'Add New Workout Plan'}
        size="lg"
      >
        <form
          onSubmit={
            // @ts-ignore
            form.onSubmit(handleSubmit)
          }
        >
          <Stack>
            <Select
              label="Workout Type"
              placeholder="Select workout type"
              data={workoutTypeOptions}
              required
              key={form.key('type')}
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
              //loading={exercisesLoading}
              {...form.getInputProps('exerciseIds')}
            />

            {exercisesError && (
              <Text size="sm" c="red">
                Error loading exercises: {exercisesError}
              </Text>
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={close}>
                Cancel
              </Button>
              <Button type="submit">{editingPlan ? 'Update' : 'Add'}</Button>
            </Group>
          </Stack>
        </form>
      </Drawer>
    </Container>
  );
}
