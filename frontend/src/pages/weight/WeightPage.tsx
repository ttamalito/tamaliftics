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
  Grid,
  TextInput,
  NumberInput,
  Select,
  Tabs,
  Box,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconPlus, IconChartLine } from '@tabler/icons-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Types for weight tracking
interface DailyWeight {
  id: string;
  date: Date;
  weight: number;
  notes?: string;
}

interface WeeklyWeight {
  weekStartDate: Date;
  weekEndDate: Date;
  averageWeight: number;
}

// Form values for weight entry
interface WeightFormValues {
  date: Date;
  weight: number;
  notes?: string;
}

export function WeightPage() {
  // Mock data for daily weights
  const [dailyWeights, setDailyWeights] = useState<DailyWeight[]>([
    { id: '1', date: new Date(2025, 6, 1), weight: 70.5, notes: 'Morning weight' },
    { id: '2', date: new Date(2025, 6, 2), weight: 70.3, notes: 'After workout' },
    { id: '3', date: new Date(2025, 6, 3), weight: 70.2, notes: 'Before breakfast' },
    { id: '4', date: new Date(2025, 6, 4), weight: 70.0, notes: 'Morning weight' },
    { id: '5', date: new Date(2025, 6, 5), weight: 69.8, notes: 'Morning weight' },
    { id: '6', date: new Date(2025, 6, 6), weight: 69.7, notes: 'After cardio' },
    { id: '7', date: new Date(2025, 6, 7), weight: 69.5, notes: 'Morning weight' },
  ]);

  // Calculate weekly weights based on daily weights
  const calculateWeeklyWeights = (): WeeklyWeight[] => {
    if (dailyWeights.length === 0) return [];

    // Group weights by week
    const weekMap = new Map<string, DailyWeight[]>();
    
    dailyWeights.forEach(weight => {
      const date = new Date(weight.date);
      // Get the start of the week (Sunday)
      const day = date.getDay();
      const diff = date.getDate() - day;
      const weekStart = new Date(date);
      weekStart.setDate(diff);
      weekStart.setHours(0, 0, 0, 0);
      
      const weekKey = weekStart.toISOString();
      
      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, []);
      }
      
      weekMap.get(weekKey)?.push(weight);
    });

    // Calculate average weight for each week
    const weeklyWeights: WeeklyWeight[] = [];
    
    weekMap.forEach((weights, weekKey) => {
      const weekStart = new Date(weekKey);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const totalWeight = weights.reduce((sum, weight) => sum + weight.weight, 0);
      const averageWeight = totalWeight / weights.length;
      
      weeklyWeights.push({
        weekStartDate: weekStart,
        weekEndDate: weekEnd,
        averageWeight: parseFloat(averageWeight.toFixed(1)),
      });
    });
    
    // Sort by date
    return weeklyWeights.sort((a, b) => a.weekStartDate.getTime() - b.weekStartDate.getTime());
  };

  const weeklyWeights = calculateWeeklyWeights();

  // Prepare data for charts
  const chartData = weeklyWeights.map(week => ({
    week: `${week.weekStartDate.toLocaleDateString()} - ${week.weekEndDate.toLocaleDateString()}`,
    weight: week.averageWeight,
  }));

  const dailyChartData = dailyWeights
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(day => ({
      date: day.date.toLocaleDateString(),
      weight: day.weight,
    }));

  // Form for adding new weight entries
  const form = useForm<WeightFormValues>({
    initialValues: {
      date: new Date(),
      weight: 0,
      notes: '',
    },
    validate: {
      date: (value) => (value ? null : 'Date is required'),
      weight: (value) => (value <= 0 ? 'Weight must be greater than 0' : null),
    },
  });

  const handleSubmit = (values: WeightFormValues) => {
    const newWeight: DailyWeight = {
      id: Date.now().toString(),
      date: values.date,
      weight: values.weight,
      notes: values.notes,
    };

    setDailyWeights([...dailyWeights, newWeight]);
    form.reset();
  };

  // Filter options for chart display
  const [timeRange, setTimeRange] = useState<string>('year');
  const [activeTab, setActiveTab] = useState<string | null>('weekly');

  // Filter data based on selected time range
  const filterDataByTimeRange = (data: any[], dateKey: string) => {
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (timeRange) {
      case 'month':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        cutoffDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'all':
      default:
        return data;
    }
    
    return data.filter(item => {
      const itemDate = typeof item[dateKey] === 'string' 
        ? new Date(item[dateKey].split(' ')[0]) 
        : new Date(item[dateKey]);
      return itemDate >= cutoffDate;
    });
  };

  const filteredWeeklyData = filterDataByTimeRange(chartData, 'week');
  const filteredDailyData = filterDataByTimeRange(dailyChartData, 'date');

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder mb="xl">
        <Title order={1} mb="xl">Weight Tracking</Title>
        
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid>
            <Grid.Col span={{ base: 12, md: 4 }}>
              <DatePickerInput
                label="Date"
                placeholder="Select date"
                required
                {...form.getInputProps('date')}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <NumberInput
                label="Weight (kg)"
                placeholder="Enter weight"
                precision={1}
                min={0}
                step={0.1}
                required
                {...form.getInputProps('weight')}
              />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <TextInput
                label="Notes"
                placeholder="Optional notes"
                {...form.getInputProps('notes')}
              />
            </Grid.Col>
          </Grid>
          
          <Group justify="flex-end" mt="md">
            <Button type="submit" leftSection={<IconPlus size="1rem" />}>
              Add Weight Entry
            </Button>
          </Group>
        </form>
      </Paper>
      
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Group justify="space-between" mb="xl">
          <Title order={2}>Weight Progress</Title>
          
          <Select
            value={timeRange}
            onChange={(value) => setTimeRange(value || 'year')}
            data={[
              { value: 'month', label: 'Last Month' },
              { value: 'quarter', label: 'Last 3 Months' },
              { value: 'year', label: 'Last Year' },
              { value: 'all', label: 'All Time' },
            ]}
            placeholder="Select time range"
          />
        </Group>
        
        <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
          <Tabs.List>
            <Tabs.Tab value="weekly" leftSection={<IconChartLine size="1rem" />}>
              Weekly Average
            </Tabs.Tab>
            <Tabs.Tab value="daily" leftSection={<IconChartLine size="1rem" />}>
              Daily Weights
            </Tabs.Tab>
          </Tabs.List>
          
          <Tabs.Panel value="weekly" pt="md">
            {filteredWeeklyData.length > 0 ? (
              <Box h={400}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={filteredWeeklyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name="Weekly Average Weight (kg)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Text c="dimmed" ta="center">No weekly weight data available.</Text>
            )}
          </Tabs.Panel>
          
          <Tabs.Panel value="daily" pt="md">
            {filteredDailyData.length > 0 ? (
              <Box h={400}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={filteredDailyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#82ca9d"
                      activeDot={{ r: 8 }}
                      name="Daily Weight (kg)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Text c="dimmed" ta="center">No daily weight data available.</Text>
            )}
          </Tabs.Panel>
        </Tabs>
        
        <Title order={3} mb="md">Recent Weight Entries</Title>
        <Stack gap="md">
          {dailyWeights.length > 0 ? (
            dailyWeights
              .sort((a, b) => b.date.getTime() - a.date.getTime())
              .slice(0, 7)
              .map((entry) => (
                <Card key={entry.id} withBorder shadow="sm" padding="md">
                  <Group justify="space-between">
                    <Text fw={500}>{entry.date.toLocaleDateString()}</Text>
                    <Text fw={700}>{entry.weight} kg</Text>
                  </Group>
                  {entry.notes && <Text size="sm" c="dimmed" mt="xs">{entry.notes}</Text>}
                </Card>
              ))
          ) : (
            <Text c="dimmed">No weight entries yet.</Text>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}