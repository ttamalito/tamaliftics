import { useState } from 'react';
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
  Modal,
  TextInput,
  NumberInput,
  Textarea,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';

// Types for diet management
interface Dish {
  id: string;
  name: string;
  description: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
}

interface DietItem {
  id: string;
  name: string;
  dishes: Dish[];
}

interface Diet {
  breakfast: DietItem;
  lunch: DietItem;
  dinner: DietItem;
  snacks: DietItem;
}

// Form values for dish creation/editing
interface DishFormValues {
  name: string;
  description: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
}

export function DietPage() {
  // Mock initial data
  const [diet, setDiet] = useState<Diet>({
    breakfast: { id: '1', name: 'Breakfast', dishes: [] },
    lunch: { id: '2', name: 'Lunch', dishes: [] },
    dinner: { id: '3', name: 'Dinner', dishes: [] },
    snacks: { id: '4', name: 'Snacks', dishes: [] },
  });

  const [activeTab, setActiveTab] = useState<string | null>('breakfast');
  const [editingDish, setEditingDish] = useState<Dish | null>(null);
  const [currentDietItem, setCurrentDietItem] = useState<keyof Diet>('breakfast');
  
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<DishFormValues>({
    initialValues: {
      name: '',
      description: '',
      calories: 0,
      carbs: 0,
      fat: 0,
      protein: 0,
    },
    validate: {
      name: (value) => (value.trim().length === 0 ? 'Name is required' : null),
      calories: (value) => (value < 0 ? 'Calories cannot be negative' : null),
      carbs: (value) => (value < 0 ? 'Carbs cannot be negative' : null),
      fat: (value) => (value < 0 ? 'Fat cannot be negative' : null),
      protein: (value) => (value < 0 ? 'Protein cannot be negative' : null),
    },
  });

  const handleOpenModal = (dietItem: keyof Diet, dish?: Dish) => {
    setCurrentDietItem(dietItem);
    if (dish) {
      setEditingDish(dish);
      form.setValues({
        name: dish.name,
        description: dish.description,
        calories: dish.calories,
        carbs: dish.carbs,
        fat: dish.fat,
        protein: dish.protein,
      });
    } else {
      setEditingDish(null);
      form.reset();
    }
    open();
  };

  const handleSubmit = (values: DishFormValues) => {
    const newDish: Dish = {
      id: editingDish ? editingDish.id : Date.now().toString(),
      ...values,
    };

    setDiet((prevDiet) => {
      const updatedDietItem = { ...prevDiet[currentDietItem] };
      
      if (editingDish) {
        // Update existing dish
        updatedDietItem.dishes = updatedDietItem.dishes.map((dish) =>
          dish.id === editingDish.id ? newDish : dish
        );
      } else {
        // Add new dish
        updatedDietItem.dishes = [...updatedDietItem.dishes, newDish];
      }
      
      return {
        ...prevDiet,
        [currentDietItem]: updatedDietItem,
      };
    });
    
    close();
  };

  const handleDeleteDish = (dietItem: keyof Diet, dishId: string) => {
    setDiet((prevDiet) => {
      const updatedDietItem = { ...prevDiet[dietItem] };
      updatedDietItem.dishes = updatedDietItem.dishes.filter((dish) => dish.id !== dishId);
      
      return {
        ...prevDiet,
        [dietItem]: updatedDietItem,
      };
    });
  };

  const renderDietItem = (dietItem: DietItem, key: keyof Diet) => {
    return (
      <Stack>
        <Group justify="space-between">
          <Title order={3}>{dietItem.name}</Title>
          <Button
            leftSection={<IconPlus size="1rem" />}
            onClick={() => handleOpenModal(key)}
          >
            Add Dish
          </Button>
        </Group>

        {dietItem.dishes.length === 0 ? (
          <Text c="dimmed">No dishes added yet.</Text>
        ) : (
          <Stack gap="md">
            {dietItem.dishes.map((dish) => (
              <Card key={dish.id} withBorder shadow="sm" padding="md">
                <Group justify="space-between">
                  <Title order={4}>{dish.name}</Title>
                  <Group>
                    <ActionIcon
                      variant="subtle"
                      color="blue"
                      onClick={() => handleOpenModal(key, dish)}
                    >
                      <IconEdit size="1rem" />
                    </ActionIcon>
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => handleDeleteDish(key, dish.id)}
                    >
                      <IconTrash size="1rem" />
                    </ActionIcon>
                  </Group>
                </Group>
                
                <Text size="sm" mt="xs">{dish.description}</Text>
                
                <Group mt="md">
                  <Text size="sm"><b>Calories:</b> {dish.calories}</Text>
                  <Text size="sm"><b>Carbs:</b> {dish.carbs}g</Text>
                  <Text size="sm"><b>Fat:</b> {dish.fat}g</Text>
                  <Text size="sm"><b>Protein:</b> {dish.protein}g</Text>
                </Group>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    );
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Title order={1} mb="xl">Diet Management</Title>
        
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="breakfast">Breakfast</Tabs.Tab>
            <Tabs.Tab value="lunch">Lunch</Tabs.Tab>
            <Tabs.Tab value="dinner">Dinner</Tabs.Tab>
            <Tabs.Tab value="snacks">Snacks</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="breakfast" pt="md">
            {renderDietItem(diet.breakfast, 'breakfast')}
          </Tabs.Panel>
          
          <Tabs.Panel value="lunch" pt="md">
            {renderDietItem(diet.lunch, 'lunch')}
          </Tabs.Panel>
          
          <Tabs.Panel value="dinner" pt="md">
            {renderDietItem(diet.dinner, 'dinner')}
          </Tabs.Panel>
          
          <Tabs.Panel value="snacks" pt="md">
            {renderDietItem(diet.snacks, 'snacks')}
          </Tabs.Panel>
        </Tabs>
      </Paper>

      <Modal
        opened={opened}
        onClose={close}
        title={editingDish ? "Edit Dish" : "Add New Dish"}
        centered
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Dish name"
              required
              {...form.getInputProps('name')}
            />
            
            <Textarea
              label="Description"
              placeholder="Dish description"
              {...form.getInputProps('description')}
            />
            
            <NumberInput
              label="Calories"
              placeholder="Calories"
              min={0}
              required
              {...form.getInputProps('calories')}
            />
            
            <Group grow>
              <NumberInput
                label="Carbs (g)"
                placeholder="Carbs"
                min={0}
                required
                {...form.getInputProps('carbs')}
              />
              
              <NumberInput
                label="Fat (g)"
                placeholder="Fat"
                min={0}
                required
                {...form.getInputProps('fat')}
              />
              
              <NumberInput
                label="Protein (g)"
                placeholder="Protein"
                min={0}
                required
                {...form.getInputProps('protein')}
              />
            </Group>
            
            <Group justify="flex-end" mt="md">
              <Button variant="subtle" onClick={close}>Cancel</Button>
              <Button type="submit">{editingDish ? "Update" : "Add"}</Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}