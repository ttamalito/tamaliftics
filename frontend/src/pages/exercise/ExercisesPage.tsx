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
  TextInput,
  Textarea,
  Select,
  Tabs,
  Grid,
  NumberInput,
  Box,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconChartLine,
} from '@tabler/icons-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Types for exercises
interface ExerciseCategory {
  id: string;
  name: string;
}

interface ExerciseTrackPoint {
  id: string;
  date: Date;
  reps: number;
  sets: number;
  weight: number;
  description?: string;
}

interface Exercise {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  trackPoints: ExerciseTrackPoint[];
}

// Form values for exercise creation/editing
interface ExerciseFormValues {
  name: string;
  description: string;
  categoryId: string;
}

// Form values for track point creation
interface TrackPointFormValues {
  date: Date;
  reps: number;
  sets: number;
  weight: number;
  description: string;
}

export function ExercisesPage() {
  // Mock data for categories
  const categories: ExerciseCategory[] = [
    { id: '1', name: 'Chest' },
    { id: '2', name: 'Back' },
    { id: '3', name: 'Legs' },
    { id: '4', name: 'Arms' },
    { id: '5', name: 'Shoulders' },
    { id: '6', name: 'Core' },
    { id: '7', name: 'Cardio' },
  ];

  // Mock data for exercises
  const [exercises, setExercises] = useState<Exercise[]>([
    {
      id: '1',
      name: 'Bench Press',
      description: 'Barbell bench press for chest development',
      categoryId: '1',
      trackPoints: [
        {
          id: '1',
          date: new Date(2025, 6, 1),
          reps: 10,
          sets: 3,
          weight: 80,
          description: 'Felt strong',
        },
        {
          id: '2',
          date: new Date(2025, 6, 8),
          reps: 10,
          sets: 3,
          weight: 85,
          description: 'Increased weight',
        },
        {
          id: '3',
          date: new Date(2025, 6, 15),
          reps: 8,
          sets: 4,
          weight: 90,
          description: 'Harder but good',
        },
      ],
    },
    {
      id: '2',
      name: 'Deadlift',
      description: 'Barbell deadlift for back and overall strength',
      categoryId: '2',
      trackPoints: [
        {
          id: '1',
          date: new Date(2025, 6, 2),
          reps: 8,
          sets: 3,
          weight: 120,
          description: 'Good form',
        },
        {
          id: '2',
          date: new Date(2025, 6, 9),
          reps: 8,
          sets: 3,
          weight: 125,
          description: 'Felt heavy',
        },
        {
          id: '3',
          date: new Date(2025, 6, 16),
          reps: 6,
          sets: 4,
          weight: 130,
          description: 'New PR',
        },
      ],
    },
    {
      id: '3',
      name: 'Squat',
      description: 'Barbell squat for leg development',
      categoryId: '3',
      trackPoints: [
        {
          id: '1',
          date: new Date(2025, 6, 3),
          reps: 10,
          sets: 3,
          weight: 100,
          description: 'Good depth',
        },
        {
          id: '2',
          date: new Date(2025, 6, 10),
          reps: 10,
          sets: 3,
          weight: 105,
          description: 'Increased weight',
        },
        {
          id: '3',
          date: new Date(2025, 6, 17),
          reps: 8,
          sets: 4,
          weight: 110,
          description: 'Challenging',
        },
      ],
    },
  ]);

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editingTrackPoint, setEditingTrackPoint] =
    useState<ExerciseTrackPoint | null>(null);

  const [
    exerciseModalOpened,
    { open: openExerciseModal, close: closeExerciseModal },
  ] = useDisclosure(false);
  const [
    trackPointModalOpened,
    { open: openTrackPointModal, close: closeTrackPointModal },
  ] = useDisclosure(false);

  const exerciseForm = useForm<ExerciseFormValues>({
    initialValues: {
      name: '',
      description: '',
      categoryId: '',
    },
    validate: {
      name: (value) => {
        return value.trim().length === 0 ? 'Name is required' : null;
      },
      categoryId: (value) => {
        return value ? null : 'Category is required';
      },
    },
  });

  const trackPointForm = useForm<TrackPointFormValues>({
    initialValues: {
      date: new Date(),
      reps: 0,
      sets: 0,
      weight: 0,
      description: '',
    },
    validate: {
      date: (value) => {
        return value ? null : 'Date is required';
      },
      reps: (value) => {
        return value <= 0 ? 'Reps must be greater than 0' : null;
      },
      sets: (value) => {
        return value <= 0 ? 'Sets must be greater than 0' : null;
      },
      weight: (value) => {
        return value < 0 ? 'Weight cannot be negative' : null;
      },
    },
  });

  const handleOpenExerciseModal = (exercise?: Exercise) => {
    if (exercise) {
      setEditingExercise(exercise);
      exerciseForm.setValues({
        name: exercise.name,
        description: exercise.description,
        categoryId: exercise.categoryId,
      });
    } else {
      setEditingExercise(null);
      exerciseForm.reset();
    }
    openExerciseModal();
  };

  const handleSubmitExercise = (values: ExerciseFormValues) => {
    const newExercise: Exercise = {
      id: editingExercise ? editingExercise.id : Date.now().toString(),
      ...values,
      trackPoints: editingExercise ? editingExercise.trackPoints : [],
    };

    if (editingExercise) {
      // Update existing exercise
      setExercises(
        exercises.map((ex) => {
          return ex.id === editingExercise.id ? newExercise : ex;
        }),
      );
      if (selectedExercise && selectedExercise.id === editingExercise.id) {
        setSelectedExercise(newExercise);
      }
    } else {
      // Add new exercise
      setExercises([...exercises, newExercise]);
    }

    closeExerciseModal();
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(
      exercises.filter((ex) => {
        return ex.id !== id;
      }),
    );
    if (selectedExercise && selectedExercise.id === id) {
      setSelectedExercise(null);
    }
  };

  const handleOpenTrackPointModal = (trackPoint?: ExerciseTrackPoint) => {
    if (!selectedExercise) return;

    if (trackPoint) {
      setEditingTrackPoint(trackPoint);
      trackPointForm.setValues({
        date: trackPoint.date,
        reps: trackPoint.reps,
        sets: trackPoint.sets,
        weight: trackPoint.weight,
        description: trackPoint.description || '',
      });
    } else {
      setEditingTrackPoint(null);
      trackPointForm.reset();
    }
    openTrackPointModal();
  };

  const handleSubmitTrackPoint = (values: TrackPointFormValues) => {
    if (!selectedExercise) return;

    const newTrackPoint: ExerciseTrackPoint = {
      id: editingTrackPoint ? editingTrackPoint.id : Date.now().toString(),
      ...values,
    };

    const updatedExercise = { ...selectedExercise };

    if (editingTrackPoint) {
      // Update existing track point
      updatedExercise.trackPoints = updatedExercise.trackPoints.map((tp) => {
        return tp.id === editingTrackPoint.id ? newTrackPoint : tp;
      });
    } else {
      // Add new track point
      updatedExercise.trackPoints = [
        ...updatedExercise.trackPoints,
        newTrackPoint,
      ];
    }

    setExercises(
      exercises.map((ex) => {
        return ex.id === selectedExercise.id ? updatedExercise : ex;
      }),
    );
    setSelectedExercise(updatedExercise);

    closeTrackPointModal();
  };

  const handleDeleteTrackPoint = (id: string) => {
    if (!selectedExercise) return;

    const updatedExercise = { ...selectedExercise };
    updatedExercise.trackPoints = updatedExercise.trackPoints.filter((tp) => {
      return tp.id !== id;
    });

    setExercises(
      exercises.map((ex) => {
        return ex.id === selectedExercise.id ? updatedExercise : ex;
      }),
    );
    setSelectedExercise(updatedExercise);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => {
      return cat.id === categoryId;
    });
    return category ? category.name : 'Unknown';
  };

  // Prepare chart data for the selected exercise
  const prepareChartData = () => {
    if (!selectedExercise) return { repsData: [], weightData: [] };

    const sortedTrackPoints = [...selectedExercise.trackPoints].sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });

    const repsData = sortedTrackPoints.map((tp) => {
      return {
        date: tp.date.toLocaleDateString(),
        reps: tp.reps * tp.sets, // Total reps across all sets
      };
    });

    const weightData = sortedTrackPoints.map((tp) => {
      return {
        date: tp.date.toLocaleDateString(),
        weight: tp.weight,
      };
    });

    return { repsData, weightData };
  };

  const { repsData, weightData } = prepareChartData();

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder mb="xl">
        <Group justify="space-between" mb="xl">
          <Title order={1}>Exercises</Title>
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={() => {
              return handleOpenExerciseModal();
            }}
          >
            Add Exercise
          </Button>
        </Group>

        {exercises.length === 0 ? (
          <Text c="dimmed" ta="center">
            No exercises added yet.
          </Text>
        ) : (
          <Stack gap="md">
            {exercises.map((exercise) => {
              return (
                <Card
                  key={exercise.id}
                  withBorder
                  shadow="sm"
                  padding="md"
                  onClick={() => {
                    return setSelectedExercise(exercise);
                  }}
                  style={{
                    cursor: 'pointer',
                    backgroundColor:
                      selectedExercise?.id === exercise.id
                        ? '#f0f0f0'
                        : undefined,
                  }}
                >
                  <Group justify="space-between">
                    <div>
                      <Title order={3}>{exercise.name}</Title>
                      <Text size="sm" c="dimmed">
                        Category: {getCategoryName(exercise.categoryId)}
                      </Text>
                    </div>
                    <Group>
                      <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenExerciseModal(exercise);
                        }}
                      >
                        <IconEdit size="1rem" />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteExercise(exercise.id);
                        }}
                      >
                        <IconTrash size="1rem" />
                      </ActionIcon>
                    </Group>
                  </Group>
                  <Text mt="xs">{exercise.description}</Text>
                  <Text size="sm" mt="md">
                    <b>Track Points:</b> {exercise.trackPoints.length}
                  </Text>
                </Card>
              );
            })}
          </Stack>
        )}
      </Paper>

      {selectedExercise && (
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <Group justify="space-between" mb="xl">
            <div>
              <Title order={2}>{selectedExercise.name}</Title>
              <Text size="sm">
                Category: {getCategoryName(selectedExercise.categoryId)}
              </Text>
            </div>
            <Button
              leftSection={<IconPlus size="1rem" />}
              onClick={() => {
                return handleOpenTrackPointModal();
              }}
            >
              Add Track Point
            </Button>
          </Group>

          <Text mb="xl">{selectedExercise.description}</Text>

          <Tabs defaultValue="trackPoints">
            <Tabs.List>
              <Tabs.Tab value="trackPoints">Track Points</Tabs.Tab>
              <Tabs.Tab
                value="charts"
                leftSection={<IconChartLine size="1rem" />}
              >
                Progress Charts
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="trackPoints" pt="md">
              {selectedExercise.trackPoints.length === 0 ? (
                <Text c="dimmed" ta="center">
                  No track points added yet.
                </Text>
              ) : (
                <Stack gap="md">
                  {[...selectedExercise.trackPoints]
                    .sort((a, b) => {
                      return b.date.getTime() - a.date.getTime();
                    })
                    .map((trackPoint) => {
                      return (
                        <Card
                          key={trackPoint.id}
                          withBorder
                          shadow="sm"
                          padding="md"
                        >
                          <Group justify="space-between">
                            <Text fw={500}>
                              {trackPoint.date.toLocaleDateString()}
                            </Text>
                            <Group>
                              <ActionIcon
                                variant="subtle"
                                color="blue"
                                onClick={() => {
                                  return handleOpenTrackPointModal(trackPoint);
                                }}
                              >
                                <IconEdit size="1rem" />
                              </ActionIcon>
                              <ActionIcon
                                variant="subtle"
                                color="red"
                                onClick={() => {
                                  return handleDeleteTrackPoint(trackPoint.id);
                                }}
                              >
                                <IconTrash size="1rem" />
                              </ActionIcon>
                            </Group>
                          </Group>

                          <Group mt="md">
                            <Text size="sm">
                              <b>Sets:</b> {trackPoint.sets}
                            </Text>
                            <Text size="sm">
                              <b>Reps:</b> {trackPoint.reps}
                            </Text>
                            <Text size="sm">
                              <b>Weight:</b> {trackPoint.weight} kg
                            </Text>
                          </Group>

                          {trackPoint.description && (
                            <Text size="sm" mt="xs">
                              {trackPoint.description}
                            </Text>
                          )}
                        </Card>
                      );
                    })}
                </Stack>
              )}
            </Tabs.Panel>

            <Tabs.Panel value="charts" pt="md">
              <Grid>
                <Grid.Col span={12}>
                  <Title order={3} ta="center" mb="md">
                    Total Reps Progress
                  </Title>
                  {repsData.length > 0 ? (
                    <Box h={300}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={repsData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="reps"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                            name="Total Reps"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Text c="dimmed" ta="center">
                      Not enough data for chart.
                    </Text>
                  )}
                </Grid.Col>

                <Grid.Col span={12} mt="xl">
                  <Title order={3} ta="center" mb="md">
                    Weight Progress
                  </Title>
                  {weightData.length > 0 ? (
                    <Box h={300}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={weightData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="weight"
                            stroke="#82ca9d"
                            activeDot={{ r: 8 }}
                            name="Weight (kg)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Text c="dimmed" ta="center">
                      Not enough data for chart.
                    </Text>
                  )}
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
          </Tabs>
        </Paper>
      )}

      {/* Exercise Modal */}
      <Modal
        opened={exerciseModalOpened}
        onClose={closeExerciseModal}
        title={editingExercise ? 'Edit Exercise' : 'Add New Exercise'}
        centered
      >
        <form onSubmit={exerciseForm.onSubmit(handleSubmitExercise)}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Exercise name"
              required
              {...exerciseForm.getInputProps('name')}
            />

            <Textarea
              label="Description"
              placeholder="Exercise description"
              {...exerciseForm.getInputProps('description')}
            />

            <Select
              label="Category"
              placeholder="Select category"
              data={categories.map((cat) => {
                return { value: cat.id, label: cat.name };
              })}
              required
              {...exerciseForm.getInputProps('categoryId')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={closeExerciseModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingExercise ? 'Update' : 'Add'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Track Point Modal */}
      <Modal
        opened={trackPointModalOpened}
        onClose={closeTrackPointModal}
        title={editingTrackPoint ? 'Edit Track Point' : 'Add New Track Point'}
        centered
      >
        <form onSubmit={trackPointForm.onSubmit(handleSubmitTrackPoint)}>
          <Stack>
            <DatePickerInput
              label="Date"
              placeholder="Select date"
              required
              {...trackPointForm.getInputProps('date')}
            />

            <Group grow>
              <NumberInput
                label="Sets"
                placeholder="Number of sets"
                min={1}
                required
                {...trackPointForm.getInputProps('sets')}
              />

              <NumberInput
                label="Reps"
                placeholder="Reps per set"
                min={1}
                required
                {...trackPointForm.getInputProps('reps')}
              />
            </Group>

            <NumberInput
              label="Weight (kg)"
              placeholder="Weight used"
              //precision={1}
              min={0}
              step={0.5}
              required
              {...trackPointForm.getInputProps('weight')}
            />

            <Textarea
              label="Notes"
              placeholder="Optional notes"
              {...trackPointForm.getInputProps('description')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={closeTrackPointModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTrackPoint ? 'Update' : 'Add'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
