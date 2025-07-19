import { useState, useEffect, useCallback, useMemo } from 'react';
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
  TextInput,
  Textarea,
  LoadingOverlay,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import {
  ICreateExerciseCategoryDto,
  IUpdateExerciseCategoryDto,
  IGetExerciseCategoryDto,
} from '@clients';
import {
  usePostExerciseCategory,
  usePutExerciseCategory,
  useGetAllExerciseCategories,
  useDeleteExerciseCategory,
} from '@hooks/requests/exerciseCategoryRequests';

export function ExerciseCategoriesPage() {
  // State for exercise categories
  const [categories, setCategories] = useState<IGetExerciseCategoryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] =
    useState<IGetExerciseCategoryDto | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  // API hooks
  const [createExerciseCategory] = usePostExerciseCategory();
  const [updateExerciseCategory] = usePutExerciseCategory();
  const [getAllExerciseCategories] = useGetAllExerciseCategories();
  const [deleteExerciseCategory] = useDeleteExerciseCategory();

  // Form for adding/editing categories
  const form = useForm<ICreateExerciseCategoryDto>({
    initialValues: {
      name: '',
      description: '',
    },
    validate: {
      name: (value) => {
        return value.trim().length === 0 ? 'Name is required' : null;
      },
    },
  });

  // Fetch all categories on component mount
  useEffect(() => {
    fetchAllCategories();
  }, []);

  // Fetch all categories
  const fetchAllCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
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
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, [getAllExerciseCategories]);

  // Handle opening the modal for adding/editing
  const handleOpenModal = useCallback(
    (category?: IGetExerciseCategoryDto) => {
      if (category) {
        setEditingCategory(category);
        form.setValues({
          name: category.name || '',
          description: category.description || '',
        });
      } else {
        setEditingCategory(null);
        form.reset();
      }
      open();
    },
    [form, open],
  );

  // Handle form submission (create or update)
  const handleSubmit = useCallback(
    async (values: ICreateExerciseCategoryDto) => {
      setLoading(true);
      setError(null);
      try {
        let response;

        if (editingCategory) {
          // Update existing category
          const updateData: IUpdateExerciseCategoryDto = {
            id: editingCategory.id!,
            ...values,
          };
          response = await updateExerciseCategory(updateData);

          if (response?.data) {
            notifications.show({
              title: 'Success',
              message: 'Exercise category updated successfully',
              color: 'green',
            });
          }
        } else {
          // Create new category
          response = await createExerciseCategory(values);

          if (response?.data) {
            notifications.show({
              title: 'Success',
              message: 'Exercise category created successfully',
              color: 'green',
            });
          }
        }

        // Reset form and editing state
        form.reset();
        setEditingCategory(null);
        close();

        // Refresh data
        fetchAllCategories();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to save exercise category';
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
      editingCategory,
      form,
      close,
      createExerciseCategory,
      updateExerciseCategory,
      fetchAllCategories,
    ],
  );

  // Handle deleting a category
  const handleDeleteCategory = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await deleteExerciseCategory(id);
        if (response) {
          notifications.show({
            title: 'Success',
            message: 'Exercise category deleted successfully',
            color: 'green',
          });
          // Refresh data
          fetchAllCategories();
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to delete exercise category';
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
    [deleteExerciseCategory, fetchAllCategories],
  );

  // Memoize the categories list
  const categoriesList = useMemo(() => {
    return (
      <Stack gap="md">
        {categories.map((category) => {
          return (
            <Card key={category.id} withBorder shadow="sm" padding="md">
              <Group justify="space-between">
                <Title order={3}>{category.name}</Title>
                <Group>
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => {
                      return handleOpenModal(category);
                    }}
                    aria-label="Edit category"
                  >
                    <IconEdit size="1rem" />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => {
                      return handleDeleteCategory(category.id!);
                    }}
                    aria-label="Delete category"
                  >
                    <IconTrash size="1rem" />
                  </ActionIcon>
                </Group>
              </Group>
              <Text mt="xs">{category.description}</Text>
            </Card>
          );
        })}
      </Stack>
    );
  }, [categories, handleOpenModal, handleDeleteCategory]);

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder pos="relative">
        <LoadingOverlay visible={loading} />
        <Group justify="space-between" mb="xl">
          <Title order={1}>Exercise Categories</Title>
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={() => {
              return handleOpenModal();
            }}
          >
            Add Category
          </Button>
        </Group>

        {categories.length === 0 ? (
          <Text c="dimmed" ta="center">
            No exercise categories added yet.
          </Text>
        ) : (
          categoriesList
        )}

        {error && (
          <Paper shadow="md" p="md" radius="md" withBorder mt="md" bg="red.1">
            <Text c="red">{error}</Text>
          </Paper>
        )}
      </Paper>

      <Drawer
        opened={opened}
        onClose={close}
        title={editingCategory ? 'Edit Category' : 'Add New Category'}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Category name"
              required
              {...form.getInputProps('name')}
            />

            <Textarea
              label="Description"
              placeholder="Category description"
              {...form.getInputProps('description')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={close}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCategory ? 'Update' : 'Add'}
              </Button>
            </Group>
          </Stack>
        </form>
      </Drawer>
    </Container>
  );
}
