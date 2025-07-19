import { useState, useCallback, useMemo, useEffect } from 'react';
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
  TextInput,
  Textarea,
  Select,
  Tabs,
  Grid,
  NumberInput,
  Box,
  LoadingOverlay,
  Drawer,
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
import { notifications } from '@mantine/notifications';
import {
  ICreateExerciseDto,
  IGetExerciseCategoryDto,
  IGetExerciseDto,
  ICreateExerciseTrackPointDto,
  IUpdateExerciseTrackPointDto,
  IGetExerciseTrackPointDto,
  GetExerciseCategoryDto,
} from '@clients';
import {
  usePostExercise,
  useGetAllExercises,
} from '@hooks/requests/exerciseRequests';
import { useGetAllExerciseCategories } from '@hooks/requests/exerciseCategoryRequests';
import {
  usePostExerciseTrackPoint,
  usePutExerciseTrackPoint,
  useGetTrackPointsForExercise,
  useDeleteExerciseTrackPoint,
} from '@hooks/requests/exerciseTrackPointRequests';

// Types for exercises
interface ExerciseTrackPoint {
  id: string;
  date: Date;
  reps: number;
  sets: number;
  weight: number;
  description?: string;
}

// This interface is no longer needed as we're using IGetExerciseDto from @clients

// Form values for exercise creation/editing is now using ICreateExerciseDto from @clients

// We're using ICreateExerciseTrackPointDto and IUpdateExerciseTrackPointDto from @clients

export function ExercisesPage() {
  // State for categories
  const [categories, setCategories] = useState<IGetExerciseCategoryDto[]>([]);
  const [, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // State for exercises
  const [exercises, setExercises] = useState<IGetExerciseDto[]>([]);
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const [exercisesError, setExercisesError] = useState<string | null>(null);
  const [selectedExercise, setSelectedExercise] =
    useState<IGetExerciseDto | null>(null);
  const [editingExercise, setEditingExercise] =
    useState<IGetExerciseDto | null>(null);

  const [
    exerciseModalOpened,
    { open: openExerciseModal, close: closeExerciseModal },
  ] = useDisclosure(false);
  const [
    trackPointModalOpened,
    { open: openTrackPointModal, close: closeTrackPointModal },
  ] = useDisclosure(false);

  // State for track points
  const [trackPoints, setTrackPoints] = useState<IGetExerciseTrackPointDto[]>(
    [],
  );
  const [trackPointsLoading, setTrackPointsLoading] = useState(false);
  const [trackPointsError, setTrackPointsError] = useState<string | null>(null);

  // API hooks
  const [getAllExerciseCategories] = useGetAllExerciseCategories();
  const [getAllExercises] = useGetAllExercises();
  const [createTrackPoint] = usePostExerciseTrackPoint();
  const [updateTrackPoint] = usePutExerciseTrackPoint();
  const [getTrackPointsForExercise] = useGetTrackPointsForExercise();
  const [deleteTrackPoint] = useDeleteExerciseTrackPoint();

  // Fetch all categories
  const fetchCategories = useCallback(async () => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    try {
      const response = await getAllExerciseCategories();
      if (response?.data) {
        setCategories(response.data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch exercise categories';
      setCategoriesError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

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

  // Fetch track points for the selected exercise
  const fetchTrackPoints = useCallback(async (exerciseId: string) => {
    setTrackPointsLoading(true);
    setTrackPointsError(null);
    try {
      const response = await getTrackPointsForExercise(exerciseId);
      if (response?.data) {
        setTrackPoints(response.data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch track points';
      setTrackPointsError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setTrackPointsLoading(false);
    }
  }, []);

  // Fetch categories and exercises on component mount
  useEffect(() => {
    fetchCategories();
    fetchExercises();
  }, []);

  // Fetch track points when an exercise is selected
  useEffect(() => {
    if (selectedExercise) {
      fetchTrackPoints(selectedExercise.id!);
    } else {
      setTrackPoints([]);
    }
  }, [selectedExercise]);

  const [editingTrackPoint, setEditingTrackPoint] =
    useState<ExerciseTrackPoint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API hooks
  const [createExercise] = usePostExercise();

  const exerciseForm = useForm<ICreateExerciseDto>({
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

  // Form for creating new track points
  const createTrackPointForm = useForm<ICreateExerciseTrackPointDto>({
    initialValues: {
      date: new Date(),
      repsCount: 0,
      setsCount: 0,
      weight: 0,
      description: '',
      exerciseId: '',
    },
    validate: {
      date: (value) => {
        return value ? null : 'Date is required';
      },
      repsCount: (value) => {
        return value <= 0 ? 'Reps must be greater than 0' : null;
      },
      setsCount: (value) => {
        return value <= 0 ? 'Sets must be greater than 0' : null;
      },
      weight: (value) => {
        return value && value < 0 ? 'Weight cannot be negative' : null;
      },
      exerciseId: (value) => {
        return value ? null : 'Exercise ID is required';
      },
    },
  });

  // Form for updating existing track points
  const updateTrackPointForm = useForm<IUpdateExerciseTrackPointDto>({
    initialValues: {
      id: '',
      date: new Date(),
      repsCount: 0,
      setsCount: 0,
      weight: 0,
      description: '',
      exerciseId: '',
    },
    validate: {
      id: (value) => {
        return value ? null : 'ID is required';
      },
      date: (value) => {
        return value ? null : 'Date is required';
      },
      repsCount: (value) => {
        return value !== undefined && value <= 0
          ? 'Reps must be greater than 0'
          : null;
      },
      setsCount: (value) => {
        return value !== undefined && value <= 0
          ? 'Sets must be greater than 0'
          : null;
      },
      weight: (value) => {
        return value !== undefined && value < 0
          ? 'Weight cannot be negative'
          : null;
      },
    },
  });

  const handleOpenExerciseModal = useCallback(
    (exercise?: IGetExerciseDto) => {
      if (exercise) {
        setEditingExercise(exercise);
        exerciseForm.setValues({
          name: exercise.name || '',
          description: exercise.description || '',
          categoryId: exercise.category?.id || '',
        });
      } else {
        setEditingExercise(null);
        exerciseForm.reset();
      }
      openExerciseModal();
    },
    [exerciseForm, openExerciseModal],
  );

  const handleSubmitExercise = useCallback(
    async (values: ICreateExerciseDto) => {
      setLoading(true);
      setError(null);

      try {
        if (editingExercise) {
          // Update existing exercise (not implemented in this example)
          // Would use a putExercise hook here

          // Note: This is a simplified implementation since we're not actually saving to the backend
          // In a real implementation, you would use an API call to update the exercise

          const selectedCategory = categories.find((cat) => {
            return cat.id === values.categoryId;
          });

          const newExercise: IGetExerciseDto = {
            ...editingExercise,
            name: values.name,
            description: values.description,
            category: selectedCategory as GetExerciseCategoryDto,
          };

          setExercises(
            exercises.map((ex) => {
              return ex.id === editingExercise.id ? newExercise : ex;
            }),
          );

          if (selectedExercise && selectedExercise.id === editingExercise.id) {
            setSelectedExercise(newExercise);
          }

          notifications.show({
            title: 'Success',
            message: 'Exercise updated successfully',
            color: 'green',
          });
        } else {
          // Create new exercise using the API
          const response = await createExercise(values);

          if (response?.data) {
            // After successful creation, fetch all exercises to get the updated list
            fetchExercises();

            notifications.show({
              title: 'Success',
              message: 'Exercise created successfully',
              color: 'green',
            });
          }
        }

        // Reset form and close modal
        exerciseForm.reset();
        closeExerciseModal();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to save exercise';
        setError(errorMessage);
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    },
    [
      createExercise,
      editingExercise,
      exercises,
      selectedExercise,
      closeExerciseModal,
      exerciseForm,
      categories,
      fetchExercises,
    ],
  );

  const handleDeleteExercise = useCallback(
    (id: string) => {
      // Note: This is a simplified implementation since we're not actually saving to the backend
      // In a real implementation, you would use an API call to delete the exercise

      setExercises(
        exercises.filter((ex) => {
          return ex.id !== id;
        }),
      );
      if (selectedExercise && selectedExercise.id === id) {
        setSelectedExercise(null);
      }

      // In a real implementation, you would refresh the data after the API call
      // fetchExercises();
    },
    [exercises, selectedExercise],
  );

  const handleOpenTrackPointModal = useCallback(
    (trackPoint?: any) => {
      if (!selectedExercise) return;

      if (trackPoint) {
        // Editing an existing track point
        setEditingTrackPoint(trackPoint);
        updateTrackPointForm.setValues({
          id: trackPoint.id,
          date: new Date(trackPoint.date),
          repsCount: trackPoint.repsCount,
          setsCount: trackPoint.setsCount,
          weight: trackPoint.weight || 0,
          description: trackPoint.description || '',
          exerciseId: selectedExercise.id,
        });
      } else {
        // Creating a new track point
        setEditingTrackPoint(null);
        createTrackPointForm.setValues({
          date: new Date(),
          repsCount: 0,
          setsCount: 0,
          weight: 0,
          description: '',
          exerciseId: selectedExercise.id,
        });
      }
      openTrackPointModal();
    },
    [
      selectedExercise,
      createTrackPointForm,
      updateTrackPointForm,
      openTrackPointModal,
    ],
  );

  const handleCreateTrackPoint = useCallback(
    async (values: ICreateExerciseTrackPointDto) => {
      if (!selectedExercise) return;

      setLoading(true);
      setError(null);

      try {
        // Call API to create a new track point
        const response = await createTrackPoint(values);

        if (response?.data) {
          // After successful creation, fetch the updated track points
          fetchTrackPoints(selectedExercise.id!);

          notifications.show({
            title: 'Success',
            message: 'Track point created successfully',
            color: 'green',
          });
        }

        // Reset form and close modal
        createTrackPointForm.reset();
        closeTrackPointModal();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to create track point';
        setError(errorMessage);
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    },
    [
      selectedExercise,
      createTrackPoint,
      fetchTrackPoints,
      createTrackPointForm,
      closeTrackPointModal,
    ],
  );

  const handleUpdateTrackPoint = useCallback(
    async (values: IUpdateExerciseTrackPointDto) => {
      if (!selectedExercise) return;

      setLoading(true);
      setError(null);

      try {
        // Call API to update the track point
        const response = await updateTrackPoint(values);

        if (response?.data) {
          // After successful update, fetch the updated track points
          fetchTrackPoints(selectedExercise.id!);

          notifications.show({
            title: 'Success',
            message: 'Track point updated successfully',
            color: 'green',
          });
        }

        // Reset form and close modal
        updateTrackPointForm.reset();
        closeTrackPointModal();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to update track point';
        setError(errorMessage);
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    },
    [
      selectedExercise,
      updateTrackPoint,
      fetchTrackPoints,
      updateTrackPointForm,
      closeTrackPointModal,
    ],
  );

  const handleDeleteTrackPoint = useCallback(
    async (id: string) => {
      if (!selectedExercise) return;

      setLoading(true);
      setError(null);

      try {
        // Call API to delete the track point
        const response = await deleteTrackPoint(id);

        if (response) {
          // After successful deletion, fetch the updated track points
          fetchTrackPoints(selectedExercise.id!);

          notifications.show({
            title: 'Success',
            message: 'Track point deleted successfully',
            color: 'green',
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to delete track point';
        setError(errorMessage);
        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    },
    [selectedExercise, deleteTrackPoint, fetchTrackPoints],
  );

  const getCategoryName = useCallback((category?: IGetExerciseCategoryDto) => {
    return category?.name || 'Unknown';
  }, []);

  // Prepare chart data for the selected exercise
  const prepareChartData = useCallback(() => {
    if (trackPoints.length === 0) return { repsData: [], weightData: [] };

    const sortedTrackPoints = [...trackPoints].sort((a, b) => {
      return new Date(a.date!).getTime() - new Date(b.date!).getTime();
    });

    const repsData = sortedTrackPoints.map((tp) => {
      return {
        date: new Date(tp.date!).toLocaleDateString(),
        reps: tp.repsCount! * tp.setsCount!, // Total reps across all sets
      };
    });

    const weightData = sortedTrackPoints.map((tp) => {
      return {
        date: new Date(tp.date!).toLocaleDateString(),
        weight: tp.weight,
      };
    });

    return { repsData, weightData };
  }, [trackPoints]);

  const { repsData, weightData } = prepareChartData();

  // Memoize the exercises list
  const exercisesList = useMemo(() => {
    return (
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
                  selectedExercise?.id === exercise.id ? '#f0f0f0' : undefined,
              }}
            >
              <Group justify="space-between">
                <div>
                  <Title order={3}>{exercise.name}</Title>
                  <Text size="sm" c="dimmed">
                    Category: {getCategoryName(exercise.category)}
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
                      handleDeleteExercise(exercise.id!);
                    }}
                  >
                    <IconTrash size="1rem" />
                  </ActionIcon>
                </Group>
              </Group>
              <Text mt="xs">{exercise.description}</Text>
              <Text size="sm" mt="md">
                <b>Track Points:</b> {exercise.trackPoints?.length || 0}
              </Text>
            </Card>
          );
        })}
      </Stack>
    );
  }, [
    exercises,
    selectedExercise,
    getCategoryName,
    handleOpenExerciseModal,
    handleDeleteExercise,
  ]);

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder mb="xl" pos="relative">
        <LoadingOverlay visible={loading || exercisesLoading} />
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

        {exercisesLoading && exercises.length === 0 ? (
          <Text c="dimmed" ta="center">
            Loading exercises...
          </Text>
        ) : exercises.length === 0 ? (
          <Text c="dimmed" ta="center">
            No exercises added yet.
          </Text>
        ) : (
          exercisesList
        )}

        {(error || exercisesError) && (
          <Paper shadow="md" p="md" radius="md" withBorder mt="md" bg="red.1">
            <Text c="red">{error || exercisesError}</Text>
          </Paper>
        )}
      </Paper>

      {selectedExercise && (
        <Paper shadow="md" p="xl" radius="md" withBorder>
          <Group justify="space-between" mb="xl">
            <div>
              <Title order={2}>{selectedExercise.name}</Title>
              <Text size="sm">
                Category: {getCategoryName(selectedExercise.category)}
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

            <Tabs.Panel value="trackPoints" pt="md" pos="relative">
              <LoadingOverlay visible={trackPointsLoading} />

              {/* Show error if there is one */}
              {trackPointsError && (
                <Paper
                  shadow="md"
                  p="md"
                  radius="md"
                  withBorder
                  mb="md"
                  bg="red.1"
                >
                  <Text c="red">{trackPointsError}</Text>
                </Paper>
              )}

              {/* Check if there are any track points */}
              {!trackPointsLoading && trackPoints.length === 0 ? (
                <Text c="dimmed" ta="center">
                  No track points added yet.
                </Text>
              ) : (
                <Stack gap="md">
                  {[...trackPoints]
                    .sort((a, b) => {
                      return (
                        new Date(b.date!).getTime() -
                        new Date(a.date!).getTime()
                      );
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
                              {new Date(trackPoint.date!).toLocaleDateString()}
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
                                  return handleDeleteTrackPoint(trackPoint.id!);
                                }}
                              >
                                <IconTrash size="1rem" />
                              </ActionIcon>
                            </Group>
                          </Group>

                          <Group mt="md">
                            <Text size="sm">
                              <b>Sets:</b> {trackPoint.setsCount}
                            </Text>
                            <Text size="sm">
                              <b>Reps:</b> {trackPoint.repsCount}
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
      <Drawer
        opened={exerciseModalOpened}
        onClose={closeExerciseModal}
        title={editingExercise ? 'Edit Exercise' : 'Add New Exercise'}
      >
        <form onSubmit={exerciseForm.onSubmit(handleSubmitExercise)}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Exercise name"
              required
              key={exerciseForm.key('name')}
              {...exerciseForm.getInputProps('name')}
            />

            <Textarea
              label="Description"
              placeholder="Exercise description"
              key={exerciseForm.key('description')}
              {...exerciseForm.getInputProps('description')}
            />

            <Select
              label="Category"
              placeholder="Select category"
              data={categories.map((cat) => {
                return { value: cat.id!, label: cat.name! };
              })}
              required
              //loading={categoriesLoading}
              key={exerciseForm.key('categoryId')}
              {...exerciseForm.getInputProps('categoryId')}
            />

            {categoriesError && (
              <Text size="sm" c="red">
                Error loading categories: {categoriesError}
              </Text>
            )}

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
      </Drawer>

      {/* Track Point Modal */}
      <Drawer
        opened={trackPointModalOpened}
        onClose={closeTrackPointModal}
        title={editingTrackPoint ? 'Edit Track Point' : 'Add New Track Point'}
      >
        {editingTrackPoint ? (
          <form
            onSubmit={updateTrackPointForm.onSubmit(handleUpdateTrackPoint)}
          >
            <Stack>
              <DatePickerInput
                label="Date"
                placeholder="Select date"
                required
                key={updateTrackPointForm.key('date')}
                {...updateTrackPointForm.getInputProps('date')}
              />

              <Group grow>
                <NumberInput
                  label="Sets"
                  placeholder="Number of sets"
                  min={1}
                  required
                  key={updateTrackPointForm.key('setsCount')}
                  {...updateTrackPointForm.getInputProps('setsCount')}
                />

                <NumberInput
                  label="Reps"
                  placeholder="Reps per set"
                  min={1}
                  required
                  key={updateTrackPointForm.key('repsCount')}
                  {...updateTrackPointForm.getInputProps('repsCount')}
                />
              </Group>

              <NumberInput
                label="Weight (kg)"
                placeholder="Weight used"
                min={0}
                step={0.5}
                required
                key={updateTrackPointForm.key('weight')}
                {...updateTrackPointForm.getInputProps('weight')}
              />

              <Textarea
                label="Notes"
                placeholder="Optional notes"
                key={updateTrackPointForm.key('description')}
                {...updateTrackPointForm.getInputProps('description')}
              />

              <Group justify="flex-end" mt="md">
                <Button variant="subtle" onClick={closeTrackPointModal}>
                  Cancel
                </Button>
                <Button type="submit">Update</Button>
              </Group>
            </Stack>
          </form>
        ) : (
          <form
            onSubmit={createTrackPointForm.onSubmit(handleCreateTrackPoint)}
          >
            <Stack>
              <DatePickerInput
                label="Date"
                placeholder="Select date"
                required
                key={createTrackPointForm.key('date')}
                {...createTrackPointForm.getInputProps('date')}
              />

              <Group grow>
                <NumberInput
                  label="Sets"
                  placeholder="Number of sets"
                  min={1}
                  required
                  key={createTrackPointForm.key('setsCount')}
                  {...createTrackPointForm.getInputProps('setsCount')}
                />

                <NumberInput
                  label="Reps"
                  placeholder="Reps per set"
                  min={1}
                  required
                  key={createTrackPointForm.key('repsCount')}
                  {...createTrackPointForm.getInputProps('repsCount')}
                />
              </Group>

              <NumberInput
                label="Weight (kg)"
                placeholder="Weight used"
                min={0}
                step={0.5}
                required
                key={createTrackPointForm.key('weight')}
                {...createTrackPointForm.getInputProps('weight')}
              />

              <Textarea
                label="Notes"
                placeholder="Optional notes"
                key={createTrackPointForm.key('description')}
                {...createTrackPointForm.getInputProps('description')}
              />

              <Group justify="flex-end" mt="md">
                <Button variant="subtle" onClick={closeTrackPointModal}>
                  Cancel
                </Button>
                <Button type="submit">Add</Button>
              </Group>
            </Stack>
          </form>
        )}
      </Drawer>
    </Container>
  );
}
