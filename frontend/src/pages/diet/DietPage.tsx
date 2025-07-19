import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Container,
  Title,
  Tabs,
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

// Meal type enum to match backend
enum MealType {
  BREAKFAST = 'BREAKFAST',
  LUNCH = 'LUNCH',
  DINNER = 'DINNER',
  SNACKS = 'SNACKS',
}

export function DietPage() {
  // State for diets and dishes
  const [diets, setDiets] = useState<IGetDietDto[]>([]);
  const [dishes, setDishes] = useState<IGetDishDto[]>([]);
  const [currentDiet, setCurrentDiet] = useState<IGetDietDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<string | null>('breakfast');
  const [editingDish, setEditingDish] = useState<IGetDishDto | null>(null);
  const [editingMeal, setEditingMeal] = useState<IGetMealDto | null>(null);
  // This is used in the renderMealSection function
  const [, setCurrentMealType] = useState<MealType>(MealType.BREAKFAST);
  // const [currentMealId, setCurrentMealId] = useState<string | undefined>(
  //   undefined,
  // );
  const currentMealIdRef = useRef<string | undefined>(undefined);

  // Memoized values
  const dietOptions = useMemo(() => {
    return diets.map((diet) => {
      return {
        value: diet.id!,
        label: diet.name!,
      };
    });
  }, [diets]);

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
    (mealType: MealType, dish?: IGetDishDto) => {
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
    (mealType: MealType, meal?: IGetMealDto) => {
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

  // Render dishes for a specific meal type
  const renderMealSection = useCallback(
    (mealType: MealType) => {
      // Find meals of this type in the current diet
      const mealsOfType =
        currentDiet?.meals?.filter((meal) => {
          // @ts-ignore
          return meal.type === mealType;
        }) || [];
      let currentTabValue;

      switch (activeTab) {
        case 'breakfast': {
          currentTabValue = GetMealDtoType.BREAKFAST;
          break;
        }
        case 'lunch': {
          currentTabValue = GetMealDtoType.LUNCH;
          break;
        }
        case 'dinner': {
          currentTabValue = GetMealDtoType.DINNER;
          break;
        }
        case 'snacks': {
          currentTabValue = GetMealDtoType.SNACKS;
          break;
        }
        default: {
          currentTabValue = GetMealDtoType.BREAKFAST;
        }
      }

      console.log('Meal Type');
      console.log(mealType);
      //const mealId = mealsOfType.length === 1 ? mealsOfType[0].id : undefined;
      console.log(mealsOfType);
      console.log('these are the meals');

      console.log('Current diet');
      console.log(currentDiet?.meals);

      const mealId = currentDiet?.meals?.find((meal) => {
        return meal.type === currentTabValue;
      })?.id;
      console.log('Meal ID');
      console.log(mealId);
      currentMealIdRef.current = mealId;

      // Get all dishes from these meals
      const mealDishes = dishes.filter((dish) => {
        return dish.type === mealType;
      });

      const mealName = mealType.charAt(0) + mealType.slice(1).toLowerCase();

      return (
        <Stack>
          <Group justify="space-between">
            <Title order={3}>{mealName}</Title>
            <Group>
              <Button
                leftSection={<IconPlus size="1rem" />}
                onClick={() => {
                  return handleOpenMealModal(mealType);
                }}
              >
                Add Meal
              </Button>
              <Button
                leftSection={<IconPlus size="1rem" />}
                onClick={() => {
                  return handleOpenDishModal(mealType);
                }}
              >
                Add Dish
              </Button>
            </Group>
          </Group>

          {/* Display meals of this type */}
          {mealsOfType.length === 1 && (
            <Stack gap="md">
              {mealsOfType.map((meal) => {
                return (
                  <Card key={meal.id} withBorder shadow="sm" padding="md">
                    <Group justify="space-between">
                      <Title order={4}>
                        {mealName} #{meal?.id?.substring(0, 4)}
                      </Title>
                      <Group>
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => {
                            return handleOpenMealModal(mealType, meal);
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
                                await removeMealFromDiet(
                                  currentDiet.id,
                                  meal.id!,
                                );
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
                  </Card>
                );
              })}
            </Stack>
          )}

          {mealDishes.length === 0 ? (
            <Text c="dimmed">No dishes added yet.</Text>
          ) : (
            <Stack gap="md">
              {mealDishes.map((dish) => {
                return (
                  <Card key={dish.id} withBorder shadow="sm" padding="md">
                    <Group justify="space-between">
                      <Title order={4}>{dish.name}</Title>
                      <Group>
                        <ActionIcon
                          variant="subtle"
                          color="blue"
                          onClick={() => {
                            return handleOpenDishModal(mealType, dish);
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

                              // Find the meal this dish belongs to
                              const meal = currentDiet?.meals?.find((m) => {
                                return m.dishes?.some((d) => {
                                  return d.id === dish.id;
                                });
                              });

                              if (meal?.id) {
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
          )}
        </Stack>
      );
    },
    [
      currentDiet,
      currentMealIdRef,
      dishes,
      handleOpenMealModal,
      handleOpenDishModal,
      setLoading,
      removeMealFromDiet,
      deleteMeal,
      fetchDietDetails,
      setError,
      removeDishFromMeal,
      deleteDish,
      setDishes,
    ],
  );

  return (
    <Container size="lg" py="xl">
      {loading && <LoadingOverlay visible />}

      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Group justify={'space-between'} mb="xl">
          <Title order={1}>Diet Management</Title>
          <Group>
            {diets.length > 0 && (
              <Select
                label="Select Diet"
                placeholder="Choose a diet"
                data={dietOptions}
                value={currentDiet?.id || null}
                onChange={(value) => {
                  const selected = diets.find((diet) => {
                    return diet.id === value;
                  });
                  if (selected) {
                    setCurrentDiet(selected);
                  }
                }}
                w={200}
              />
            )}
            <Button
              leftSection={<IconPlus size="1rem" />}
              onClick={() => {
                return handleOpenDietModal();
              }}
            >
              Create Diet
            </Button>
          </Group>
        </Group>

        {error && (
          <Text c="red" mb="md">
            {error}
          </Text>
        )}

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="breakfast">Breakfast</Tabs.Tab>
            <Tabs.Tab value="lunch">Lunch</Tabs.Tab>
            <Tabs.Tab value="dinner">Dinner</Tabs.Tab>
            <Tabs.Tab value="snacks">Snacks</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="breakfast" pt="md">
            {renderMealSection(MealType.BREAKFAST)}
          </Tabs.Panel>

          <Tabs.Panel value="lunch" pt="md">
            {renderMealSection(MealType.LUNCH)}
          </Tabs.Panel>

          <Tabs.Panel value="dinner" pt="md">
            {renderMealSection(MealType.DINNER)}
          </Tabs.Panel>

          <Tabs.Panel value="snacks" pt="md">
            {renderMealSection(MealType.SNACKS)}
          </Tabs.Panel>
        </Tabs>
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
