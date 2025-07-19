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
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';

// Types for exercise categories
interface ExerciseCategory {
  id: string;
  name: string;
  description: string;
}

// Form values for category creation/editing
interface CategoryFormValues {
  name: string;
  description: string;
}

export function ExerciseCategoriesPage() {
  // Mock data for exercise categories
  const [categories, setCategories] = useState<ExerciseCategory[]>([
    { id: '1', name: 'Chest', description: 'Exercises targeting chest muscles' },
    { id: '2', name: 'Back', description: 'Exercises targeting back muscles' },
    { id: '3', name: 'Legs', description: 'Exercises targeting leg muscles' },
    { id: '4', name: 'Arms', description: 'Exercises targeting arm muscles' },
    { id: '5', name: 'Shoulders', description: 'Exercises targeting shoulder muscles' },
    { id: '6', name: 'Core', description: 'Exercises targeting core muscles' },
    { id: '7', name: 'Cardio', description: 'Cardiovascular exercises' },
  ]);

  const [editingCategory, setEditingCategory] = useState<ExerciseCategory | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<CategoryFormValues>({
    initialValues: {
      name: '',
      description: '',
    },
    validate: {
      name: (value) => (value.trim().length === 0 ? 'Name is required' : null),
    },
  });

  const handleOpenModal = (category?: ExerciseCategory) => {
    if (category) {
      setEditingCategory(category);
      form.setValues({
        name: category.name,
        description: category.description,
      });
    } else {
      setEditingCategory(null);
      form.reset();
    }
    open();
  };

  const handleSubmit = (values: CategoryFormValues) => {
    const newCategory: ExerciseCategory = {
      id: editingCategory ? editingCategory.id : Date.now().toString(),
      ...values,
    };

    if (editingCategory) {
      // Update existing category
      setCategories(categories.map((cat) => (cat.id === editingCategory.id ? newCategory : cat)));
    } else {
      // Add new category
      setCategories([...categories, newCategory]);
    }

    close();
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Group justify="space-between" mb="xl">
          <Title order={1}>Exercise Categories</Title>
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={() => handleOpenModal()}
          >
            Add Category
          </Button>
        </Group>

        {categories.length === 0 ? (
          <Text c="dimmed" ta="center">No exercise categories added yet.</Text>
        ) : (
          <Stack gap="md">
            {categories.map((category) => (
              <Card key={category.id} withBorder shadow="sm" padding="md">
                <Group justify="space-between">
                  <Title order={3}>{category.name}</Title>
                  <Group>
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => handleOpenModal(category)}
                    >
                      <IconEdit size="1rem" />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <IconTrash size="1rem" />
                    </ActionIcon>
                  </Group>
                </Group>
                <Text mt="xs">{category.description}</Text>
              </Card>
            ))}
          </Stack>
        )}
      </Paper>

      <Modal
        opened={opened}
        onClose={close}
        title={editingCategory ? "Edit Category" : "Add New Category"}
        centered
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
              <Button variant="subtle" onClick={close}>Cancel</Button>
              <Button type="submit">{editingCategory ? "Update" : "Add"}</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}