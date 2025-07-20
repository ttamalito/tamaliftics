import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  NumberInput,
  Textarea,
  LoadingOverlay,
  Drawer,
  Select,
  Accordion,
  Box,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import {
  ICreateDietDto,
  IUpdateDietDto,
  IGetDietDto,
  ICreateDishDto,
  IGetDishDto,
  IGetMealDto,
  ICreateMealDto,
  CreateMealDtoType,
  IUpdateDishDto,
  IUpdateMealDto,
  GetMealDtoType,
} from '@clients';
import {
  usePostDiet,
  usePutDiet,
  useGetAllDiets,
  useGetDietById,
  usePostAddMealToDiet,
  useDeleteRemoveMealFromDiet,
  useDeleteDiet,
} from '@requests/dietRequests.ts';
import {
  usePostMeal,
  usePutMeal,
  useDeleteMeal,
  usePostAddDishToMeal,
  useDeleteRemoveDishFromMeal,
} from '@requests/mealRequests.ts';
import {
  usePostDish,
  usePutDish,
  useDeleteDish,
} from '@requests/dishRequests.ts';
import { AxiosResponse } from 'axios';

export function DietPage() {
  // State for diets and dishes
  const [diets, setDiets] = useState<IGetDietDto[]>([]);
  const [dishes, setDishes] = useState<IGetDishDto[]>([]);
  const [currentDiet, setCurrentDiet] = useState<IGetDietDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingDish, setEditingDish] = useState<IGetDishDto | null>(null);
  const [editingMeal, setEditingMeal] = useState<IGetMealDto | null>(null);
  const [, setCurrentMealType] = useState<GetMealDtoType>(
    GetMealDtoType.BREAKFAST,
  );
  const currentMealIdRef = useRef<string | undefined>(undefined);

  const mealTypeOptions = useMemo(() => {
    return Object.values(CreateMealDtoType).map((type) => {
      return {
        value: type,
        label: type.charAt(0) + type.slice(1).toLowerCase(),
      };
    });
  }, []);

  const dishOptions = useMemo(() => {
    return dishes.map((dish) => {
      return {
        value: dish.id!,
        label: dish.name!,
      };
    });
  }, [dishes]);

  // Modal states
  const [dishModalOpened, { open: openDishModal, close: closeDishModal }] =
    useDisclosure(false);
  const [dietModalOpened, { open: openDietModal, close: closeDietModal }] =
    useDisclosure(false);
  const [mealModalOpened, { open: openMealModal, close: closeMealModal }] =
    useDisclosure(false);

  // API hooks
  // Diet hooks
  const [getAllDiets] = useGetAllDiets();
  const [getDietById] = useGetDietById();
  const [createDiet] = usePostDiet();
  const [updateDiet] = usePutDiet();
  const [addMealToDiet] = usePostAddMealToDiet();
  const [removeMealFromDiet] = useDeleteRemoveMealFromDiet();
  const [deleteDiet] = useDeleteDiet();

  // Meal hooks
  const [createMeal] = usePostMeal();
  const [updateMeal] = usePutMeal();
  const [deleteMeal] = useDeleteMeal();
  const [addDishToMeal] = usePostAddDishToMeal();
  const [removeDishFromMeal] = useDeleteRemoveDishFromMeal();

  // Dish hooks
  const [createDish] = usePostDish();
  const [updateDish] = usePutDish();
  const [deleteDish] = useDeleteDish();

  // Fetch diets on component mount
  useEffect(() => {
    fetchDiets();
  }, []);

  // Fetch diet details when a diet is selected
  useEffect(() => {
    if (currentDiet?.id) {
      fetchDietDetails(currentDiet.id);
    }
  }, [currentDiet?.id]);

  // Fetch all diets
  const fetchDiets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllDiets();
      if (response?.data) {
        console.log(response.data);
        setDiets(response.data);
        if (response.data.length > 0) {
          setCurrentDiet(response.data[0]);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch diets';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [getAllDiets, setDiets, setCurrentDiet, setLoading, setError]);

  // Fetch diet details by ID and extract dishes
  const fetchDietDetails = useCallback(
    async (dietId: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getDietById(dietId);
        if (response?.data) {
          // Extract all dishes from all meals
          const allDishes: IGetDishDto[] = [];
          if (response.data.meals && response.data.meals.length > 0) {
            response.data.meals.forEach((meal: IGetMealDto) => {
              if (meal.dishes && meal.dishes.length > 0) {
                // Add meal type to each dish for filtering
                const dishesWithType = meal.dishes.map((dish: IGetDishDto) => {
                  return {
                    ...dish,
                    type: meal.type,
                  };
                });
                allDishes.push(...dishesWithType);
              }
            });
          }
          setDishes(allDishes);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to fetch diet details';
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
    [getDietById, setDishes, setLoading, setError],
  );

  // Form for dish creation/editing
  const dishForm = useForm<ICreateDishDto>({
    // initialValues: {
    //   name: '',
    //   description: '',
    //   calories: 0,
    //   carbs: 0,
    //   fat: 0,
    //   protein: 0,
    // },
    validate: {
      name: (value) => {
        return value?.trim().length === 0 ? 'Name is required' : null;
      },
      calories: (value) => {
        return value && value < 0 ? 'Calories cannot be negative' : null;
      },
      carbs: (value) => {
        return value && value < 0 ? 'Carbs cannot be negative' : null;
      },
      fat: (value) => {
        return value && value < 0 ? 'Fat cannot be negative' : null;
      },
      protein: (value) => {
        return value && value < 0 ? 'Protein cannot be negative' : null;
      },
    },
  });

  // Form for meal creation/editing
  const mealForm = useForm<ICreateMealDto>({
    initialValues: {
      type: CreateMealDtoType.BREAKFAST,
      dishIds: [],
    },
    validate: {
      type: (value) => {
        return !value ? 'Meal type is required' : null;
      },
    },
  });

  // Form for diet creation/editing
  const dietForm = useForm<ICreateDietDto>({
    initialValues: {
      name: '',
      description: '',
    },
    validate: {
      name: (value) => {
        return value?.trim().length === 0 ? 'Name is required' : null;
      },
    },
  });

  // Handle opening dish modal
  const handleOpenDishModal = useCallback(
    (mealType: GetMealDtoType, dish?: IGetDishDto) => {
      setCurrentMealType(mealType);
      if (dish) {
        setEditingDish(dish);
        dishForm.setValues({
          name: dish.name || '',
          description: dish.description || '',
          calories: dish.calories || 0,
          carbs: dish.carbs || 0,
          fat: dish.fat || 0,
          protein: dish.protein || 0,
        });
      } else {
        setEditingDish(null);
        dishForm.reset();
      }
      openDishModal();
    },
    [setCurrentMealType, setEditingDish, dishForm, openDishModal],
  );

  // Handle opening meal modal
  const handleOpenMealModal = useCallback(
    (mealType: GetMealDtoType, meal?: IGetMealDto) => {
      setCurrentMealType(mealType);
      if (meal) {
        setEditingMeal(meal);
        mealForm.setValues({
          type:
            (meal.type as unknown as CreateMealDtoType) ||
            CreateMealDtoType.BREAKFAST,
          dishIds:
            meal.dishes?.map((dish) => {
              return dish.id!;
            }) || [],
        });
      } else {
        setEditingMeal(null);
        mealForm.setValues({
          type: mealType as unknown as CreateMealDtoType,
          dishIds: [],
        });
      }
      openMealModal();
    },
    [setCurrentMealType, setEditingMeal, mealForm, openMealModal],
  );

  // Handle opening diet modal
  const handleOpenDietModal = useCallback(
    (diet?: IGetDietDto) => {
      if (diet) {
        setCurrentDiet(diet);
        dietForm.setValues({
          name: diet.name || '',
          description: diet.description || '',
        });
      } else {
        setCurrentDiet(null);
        dietForm.reset();
      }
      openDietModal();
    },
    [dietForm, openDietModal],
  );

  // Handle creating or updating a dish
  const handleDishSubmit = useCallback(
    async (values: ICreateDishDto) => {
      setLoading(true);
      setError(null);
      try {
        let response: AxiosResponse<any, any> | undefined;

        if (editingDish) {
          // Update existing dish
          const updateData: IUpdateDishDto = {
            id: editingDish.id!,
            ...values,
          };
          response = await updateDish(updateData);

          if (response?.data) {
            // Update the dish in the local state
            setDishes((prevDishes) => {
              return prevDishes.map((dish) => {
                return dish.id === editingDish.id ? response?.data : dish;
              });
            });

            notifications.show({
              title: 'Success',
              message: 'Dish updated successfully',
              color: 'green',
            });
          }
        } else {
          // Create new dish
          response = await createDish({
            ...values,
            mealId: currentMealIdRef.current ?? '',
          });
          console.log(response);

          if (response?.data) {
            // Add the new dish to the local state
            setDishes((prevDishes) => {
              return [...prevDishes, response?.data];
            });

            notifications.show({
              title: 'Success',
              message: 'Dish created successfully',
              color: 'green',
            });
          }
        }

        closeDishModal();

        // Refresh the diet details to get the updated dishes
        if (currentDiet?.id) {
          fetchDietDetails(currentDiet.id);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to save dish';
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
      setLoading,
      setError,
      editingDish,
      updateDish,
      setDishes,
      createDish,
      currentMealIdRef,
      closeDishModal,
      currentDiet,
      fetchDietDetails,
    ],
  );

  // Handle creating or updating a meal
  const handleMealSubmit = useCallback(
    async (values: ICreateMealDto) => {
      setLoading(true);
      setError(null);
      try {
        let response;

        if (editingMeal) {
          // Update existing meal
          const updateData: {
            id: string;
            type: CreateMealDtoType;
            dishIds?: string[];
          } = {
            id: editingMeal.id! || '',
            ...values,
          };
          // @ts-ignore
          response = await updateMeal(updateData as IUpdateMealDto); // TODO: Fix this

          if (response?.data) {
            notifications.show({
              title: 'Success',
              message: 'Meal updated successfully',
              color: 'green',
            });
          }
        } else {
          // Create new meal
          response = await createMeal(values);

          if (response?.data && currentDiet?.id) {
            // Add the new meal to the current diet
            await addMealToDiet(currentDiet.id, response.data.id);

            notifications.show({
              title: 'Success',
              message: 'Meal created and added to diet successfully',
              color: 'green',
            });
          } else if (response?.data) {
            notifications.show({
              title: 'Success',
              message: 'Meal created successfully',
              color: 'green',
            });
          }
        }

        closeMealModal();

        // Refresh the diet details
        if (currentDiet?.id) {
          fetchDietDetails(currentDiet.id);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to save meal';
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
      setLoading,
      setError,
      editingMeal,
      updateMeal,
      createMeal,
      currentDiet,
      addMealToDiet,
      closeMealModal,
      fetchDietDetails,
    ],
  );

  // Handle creating or updating a diet
  const handleDietSubmit = useCallback(
    async (values: ICreateDietDto) => {
      setLoading(true);
      setError(null);
      try {
        if (currentDiet) {
          // Update existing diet
          const updateData: IUpdateDietDto = {
            id: currentDiet.id || '',
            ...values,
          };
          await updateDiet(updateData);
          notifications.show({
            title: 'Success',
            message: 'Diet updated successfully',
            color: 'green',
          });
        } else {
          // Create new diet
          await createDiet(values);
          notifications.show({
            title: 'Success',
            message: 'Diet created successfully',
            color: 'green',
          });
        }
        closeDietModal();
        fetchDiets(); // Refresh diets after update
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to save diet';
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
      setLoading,
      setError,
      currentDiet,
      updateDiet,
      createDiet,
      closeDietModal,
      fetchDiets,
    ],
  );

  // Handle deleting a diet
  const handleDeleteDiet = useCallback(
    async (dietId: string) => {
      setLoading(true);
      setError(null);
      try {
        await deleteDiet(dietId);

        notifications.show({
          title: 'Success',
          message: 'Diet deleted successfully',
          color: 'green',
        });

        // Refresh diets after deletion
        fetchDiets();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to delete diet';
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
    [setLoading, setError, deleteDiet, fetchDiets],
  );

  // Render dishes for a specific meal
  const renderDishes = useCallback(
    (meal: IGetMealDto) => {
      if (!meal.dishes || meal.dishes.length === 0) {
        return <Text c="dimmed">No dishes added yet.</Text>;
      }

      return (
        <Stack gap="md">
          {meal.dishes.map((dish) => {
            return (
              <Card key={dish.id} withBorder shadow="sm" padding="md">
                <Group justify="space-between">
                  <Title order={4}>{dish.name}</Title>
                  <Group>
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => {
                        return handleOpenDishModal(meal.type!, dish);
                      }}
                    >
                      <IconEdit size="1rem" />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={async () => {
                        try {
                          setLoading(true);

                          if (meal.id) {
                            // First remove the dish from the meal
                            await removeDishFromMeal(meal.id, dish.id!);
                          }

                          // Then delete the dish
                          await deleteDish(dish.id!);

                          // Update local state
                          setDishes((prevDishes) => {
                            return prevDishes.filter((d) => {
                              return d.id !== dish.id;
                            });
                          });

                          notifications.show({
                            title: 'Success',
                            message: 'Dish deleted successfully',
                            color: 'green',
                          });

                          // Refresh the diet details
                          if (currentDiet?.id) {
                            fetchDietDetails(currentDiet.id);
                          }
                        } catch (error) {
                          const errorMessage =
                            error instanceof Error
                              ? error.message
                              : 'Failed to delete dish';
                          setError(errorMessage);
                          notifications.show({
                            title: 'Error',
                            message: errorMessage,
                            color: 'red',
                          });
                        } finally {
                          setLoading(false);
                        }
                      }}
                    >
                      <IconTrash size="1rem" />
                    </ActionIcon>
                  </Group>
                </Group>

                <Text size="sm" mt="xs">
                  {dish.description}
                </Text>

                <Group mt="md">
                  <Text size="sm">
                    <b>Calories:</b> {dish.calories}
                  </Text>
                  <Text size="sm">
                    <b>Carbs:</b> {dish.carbs}g
                  </Text>
                  <Text size="sm">
                    <b>Fat:</b> {dish.fat}g
                  </Text>
                  <Text size="sm">
                    <b>Protein:</b> {dish.protein}g
                  </Text>
                </Group>
              </Card>
            );
          })}
        </Stack>
      );
    },
    [
      currentDiet,
      setDishes,
      handleOpenDishModal,
      setLoading,
      removeDishFromMeal,
      deleteDish,
      fetchDietDetails,
      setError,
    ],
  );

  // Render a meal with its dishes
  const renderMeal = useCallback(
    (meal: IGetMealDto) => {
      const mealType = meal.type;
      const mealName = mealType?.toString() ?? '';

      return (
        <Card key={meal.id} withBorder shadow="sm" padding="md">
          <Group justify="space-between">
            <Title order={4}>
              {mealName} #{meal?.id?.substring(0, 4)}
            </Title>
            <Group>
              <Button
                leftSection={<IconPlus size="1rem" />}
                onClick={() => {
                  currentMealIdRef.current = meal.id;
                  return handleOpenDishModal(mealType!);
                }}
              >
                Add Dish
              </Button>
              <ActionIcon
                variant="subtle"
                color="blue"
                onClick={() => {
                  return handleOpenMealModal(mealType!, meal);
                }}
              >
                <IconEdit size="1rem" />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={async () => {
                  try {
                    setLoading(true);

                    if (currentDiet?.id) {
                      // First remove the meal from the diet
                      await removeMealFromDiet(currentDiet.id, meal.id!);
                    }

                    // Then delete the meal
                    await deleteMeal(meal.id!);

                    notifications.show({
                      title: 'Success',
                      message: 'Meal deleted successfully',
                      color: 'green',
                    });

                    // Refresh the diet details
                    if (currentDiet?.id) {
                      fetchDietDetails(currentDiet.id);
                    }
                  } catch (error) {
                    const errorMessage =
                      error instanceof Error
                        ? error.message
                        : 'Failed to delete meal';
                    setError(errorMessage);
                    notifications.show({
                      title: 'Error',
                      message: errorMessage,
                      color: 'red',
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <IconTrash size="1rem" />
              </ActionIcon>
            </Group>
          </Group>

          {/* Display nutritional info */}
          <Group mt="md">
            <Text size="sm">
              <b>Calories:</b> {meal.totalCalories || 0}
            </Text>
            <Text size="sm">
              <b>Carbs:</b> {meal.totalCarbs || 0}g
            </Text>
            <Text size="sm">
              <b>Fat:</b> {meal.totalFat || 0}g
            </Text>
            <Text size="sm">
              <b>Protein:</b> {meal.totalProtein || 0}g
            </Text>
          </Group>

          {/* Display dishes */}
          <Box mt="md">
            <Title order={5} mb="sm">
              Dishes
            </Title>
            {renderDishes(meal)}
          </Box>
        </Card>
      );
    },
    [
      currentDiet,
      currentMealIdRef,
      handleOpenMealModal,
      handleOpenDishModal,
      setLoading,
      removeMealFromDiet,
      deleteMeal,
      fetchDietDetails,
      setError,
      renderDishes,
    ],
  );

  return (
    <Container size="lg" py="xl">
      {loading && <LoadingOverlay visible />}

      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Group justify={'space-between'} mb="xl">
          <Title order={1}>Diet Management</Title>
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={() => {
              return handleOpenDietModal();
            }}
          >
            Create Diet
          </Button>
        </Group>

        {error && (
          <Text c="red" mb="md">
            {error}
          </Text>
        )}

        {diets.length === 0 ? (
          <Text c="dimmed">
            No diets available. Create a diet to get started.
          </Text>
        ) : (
          <Accordion>
            {diets.map((diet) => {
              return (
                <Accordion.Item key={diet.id} value={diet.id || ''}>
                  <Accordion.Control>
                    <Group justify="space-between">
                      <Title order={3}>{diet.name}</Title>
                      <Group>
                        <Text size="sm">{diet.description}</Text>
                        <ActionIcon
                          variant="subtle"
                          color="red"
                          onClick={(event) => {
                            // Stop propagation to prevent accordion from toggling
                            event.stopPropagation();
                            handleDeleteDiet(diet.id || '');
                          }}
                        >
                          <IconTrash size="1rem" />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="md">
                      <Group justify="space-between">
                        <Text>Meals in this diet</Text>
                        <Group>
                          {Object.values(GetMealDtoType).map((mealType) => {
                            return (
                              <Button
                                key={mealType}
                                leftSection={<IconPlus size="1rem" />}
                                onClick={() => {
                                  setCurrentDiet(diet);
                                  setCurrentMealType(mealType);
                                  handleOpenMealModal(mealType);
                                }}
                              >
                                Add{' '}
                                {mealType?.charAt(0) +
                                  mealType?.slice(1).toLowerCase()}
                              </Button>
                            );
                          })}
                        </Group>
                      </Group>

                      {diet.meals && diet.meals.length > 0 ? (
                        <Stack gap="lg">
                          {diet.meals.map((meal) => {
                            return renderMeal(meal);
                          })}
                        </Stack>
                      ) : (
                        <Text c="dimmed">No meals added to this diet yet.</Text>
                      )}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              );
            })}
          </Accordion>
        )}
      </Paper>

      {/* Dish Modal */}
      <Drawer
        opened={dishModalOpened}
        onClose={closeDishModal}
        title={editingDish ? 'Edit Dish' : 'Add New Dish'}
      >
        <form onSubmit={dishForm.onSubmit(handleDishSubmit)}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Dish name"
              required
              key={dishForm.key('name')}
              {...dishForm.getInputProps('name')}
            />

            <Textarea
              label="Description"
              placeholder="Dish description"
              key={dishForm.key('description')}
              {...dishForm.getInputProps('description')}
            />

            <NumberInput
              label="Calories"
              placeholder="Calories"
              min={0}
              required
              key={dishForm.key('calories')}
              {...dishForm.getInputProps('calories')}
            />

            <Group grow>
              <NumberInput
                label="Carbs (g)"
                placeholder="Carbs"
                min={0}
                required
                key={dishForm.key('carbs')}
                {...dishForm.getInputProps('carbs')}
              />

              <NumberInput
                label="Fat (g)"
                placeholder="Fat"
                min={0}
                required
                key={dishForm.key('fat')}
                {...dishForm.getInputProps('fat')}
              />

              <NumberInput
                label="Protein (g)"
                placeholder="Protein"
                min={0}
                required
                key={dishForm.key('protein')}
                {...dishForm.getInputProps('protein')}
              />
            </Group>

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={closeDishModal}>
                Cancel
              </Button>
              <Button type="submit">{editingDish ? 'Update' : 'Add'}</Button>
            </Group>
          </Stack>
        </form>
      </Drawer>

      {/* Diet Modal */}
      <Drawer
        opened={dietModalOpened}
        onClose={closeDietModal}
        title={currentDiet ? 'Edit Diet' : 'Create Diet'}
      >
        <form onSubmit={dietForm.onSubmit(handleDietSubmit)}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Diet name"
              required
              key={dietForm.key('name')}
              {...dietForm.getInputProps('name')}
            />

            <Textarea
              label="Description"
              placeholder="Diet description"
              key={dietForm.key('description')}
              {...dietForm.getInputProps('description')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={closeDietModal}>
                Cancel
              </Button>
              <Button type="submit">{currentDiet ? 'Update' : 'Create'}</Button>
            </Group>
          </Stack>
        </form>
      </Drawer>

      {/* Meal Modal */}
      <Drawer
        opened={mealModalOpened}
        onClose={closeMealModal}
        title={editingMeal ? 'Edit Meal' : 'Add New Meal'}
        position={'left'}
        //offset={100}
      >
        <form onSubmit={mealForm.onSubmit(handleMealSubmit)}>
          <Stack>
            <Select
              label="Meal Type"
              placeholder="Select meal type"
              required
              data={mealTypeOptions}
              key={mealForm.key('type')}
              {...mealForm.getInputProps('type')}
            />

            {/* If we have available dishes, show a multi-select */}
            {dishes.length > 0 && (
              <Select
                label="Add Dish"
                placeholder="Select a dish to add"
                data={dishOptions}
                onChange={(value) => {
                  if (value && editingMeal?.id) {
                    // Add dish to meal
                    addDishToMeal(editingMeal.id, value)
                      .then(() => {
                        notifications.show({
                          title: 'Success',
                          message: 'Dish added to meal successfully',
                          color: 'green',
                        });

                        // Refresh the diet details
                        if (currentDiet?.id) {
                          fetchDietDetails(currentDiet.id);
                        }
                      })
                      .catch((error) => {
                        const errorMessage =
                          error instanceof Error
                            ? error.message
                            : 'Failed to add dish to meal';
                        setError(errorMessage);
                        notifications.show({
                          title: 'Error',
                          message: errorMessage,
                          color: 'red',
                        });
                      });
                  }
                }}
              />
            )}

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={closeMealModal}>
                Cancel
              </Button>
              <Button type="submit">{editingMeal ? 'Update' : 'Add'}</Button>
            </Group>
          </Stack>
        </form>
      </Drawer>
    </Container>
  );
}
