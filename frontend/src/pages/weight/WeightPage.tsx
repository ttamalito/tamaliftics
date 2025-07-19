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
  Grid,
  TextInput,
  NumberInput,
  Select,
  Tabs,
  Box,
  LoadingOverlay,
  ActionIcon,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import {
  IconPlus,
  IconChartLine,
  IconEdit,
  IconTrash,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
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
import {
  ICreateDailyWeightDto,
  IUpdateDailyWeightDto,
  IGetDailyWeightDto,
  IGetWeeklyWeightDto,
} from '@clients';
import {
  usePostDailyWeight,
  usePutDailyWeight,
  //useGetDailyWeightById,
  useGetAllDailyWeights,
  useGetDailyWeightsBetweenDates,
  useDeleteDailyWeight,
} from '@hooks/requests/dailyWeightRequests';
import {
  //useGetWeeklyWeightById,
  useGetAllWeeklyWeights,
  useGetWeeklyWeightsByYear,
  useGetWeeklyWeightsBetweenDates,
  useGetWeeklyWeightForDate,
} from '@hooks/requests/weeklyWeightRequests';

export function WeightPage() {
  // State for weight data
  const [dailyWeights, setDailyWeights] = useState<IGetDailyWeightDto[]>([]);
  const [weeklyWeights, setWeeklyWeights] = useState<IGetWeeklyWeightDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingWeight, setEditingWeight] = useState<IGetDailyWeightDto | null>(
    null,
  );

  // API hooks
  const [createDailyWeight] = usePostDailyWeight();
  const [updateDailyWeight] = usePutDailyWeight();
  //const [getDailyWeightById] = useGetDailyWeightById();
  const [getAllDailyWeights] = useGetAllDailyWeights();
  const [getDailyWeightsBetweenDates] = useGetDailyWeightsBetweenDates();
  const [deleteDailyWeight] = useDeleteDailyWeight();

  //const [getWeeklyWeightById] = useGetWeeklyWeightById();
  const [getAllWeeklyWeights] = useGetAllWeeklyWeights();
  const [getWeeklyWeightsByYear] = useGetWeeklyWeightsByYear();
  const [getWeeklyWeightsBetweenDates] = useGetWeeklyWeightsBetweenDates();
  const [getWeeklyWeightForDate] = useGetWeeklyWeightForDate();

  // Fetch data on component mount
  useEffect(() => {
    fetchDailyWeights();
    fetchWeeklyWeights();
  }, []);

  // Fetch all daily weights
  const fetchDailyWeights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllDailyWeights();
      if (response?.data) {
        setDailyWeights(response.data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch daily weights';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch daily weight by ID
  // const fetchDailyWeightById = useCallback(async (id: string) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await getDailyWeightById(id);
  //     if (response?.data) {
  //       // Since this returns a single weight, we'll put it in an array
  //       setDailyWeights([response.data]);
  //       notifications.show({
  //         title: 'Success',
  //         message: 'Daily weight fetched successfully',
  //         color: 'green',
  //       });
  //     }
  //   } catch (error) {
  //     const errorMessage =
  //       error instanceof Error ? error.message : 'Failed to fetch daily weight';
  //     setError(errorMessage);
  //     notifications.show({
  //       title: 'Error',
  //       message: errorMessage,
  //       color: 'red',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // Fetch daily weights between dates
  const fetchDailyWeightsBetweenDates = useCallback(
    async (startDate: string, endDate: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getDailyWeightsBetweenDates(startDate, endDate);
        if (response?.data) {
          setDailyWeights(response.data);
          notifications.show({
            title: 'Success',
            message: 'Daily weights fetched successfully',
            color: 'green',
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to fetch daily weights between dates';
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
    [],
  );

  // Fetch all weekly weights
  const fetchWeeklyWeights = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllWeeklyWeights();
      if (response?.data) {
        setWeeklyWeights(response.data);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch weekly weights';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch weekly weights by year
  const fetchWeeklyWeightsByYear = useCallback(async (year: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getWeeklyWeightsByYear(year);
      if (response?.data) {
        setWeeklyWeights(response.data);
        notifications.show({
          title: 'Success',
          message: `Weekly weights for ${year} fetched successfully`,
          color: 'green',
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Failed to fetch weekly weights for year ${year}`;
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch weekly weights between dates
  const fetchWeeklyWeightsBetweenDates = useCallback(
    async (startDate: string, endDate: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await getWeeklyWeightsBetweenDates(startDate, endDate);
        if (response?.data) {
          setWeeklyWeights(response.data);
          notifications.show({
            title: 'Success',
            message: 'Weekly weights fetched successfully',
            color: 'green',
          });
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to fetch weekly weights between dates';
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
    [],
  );

  // Fetch weekly weight for a specific date
  const fetchWeeklyWeightForDate = useCallback(async (date: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getWeeklyWeightForDate(date);
      if (response?.data) {
        // Since this returns a single weight, we'll put it in an array
        setWeeklyWeights([response.data]);
        notifications.show({
          title: 'Success',
          message: 'Weekly weight fetched successfully',
          color: 'green',
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch weekly weight for date';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch weekly weight by ID

  // @ts-ignore
  // const fetchWeeklyWeightById = useCallback(async (id: string) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await getWeeklyWeightById(id);
  //     if (response?.data) {
  //       // Since this returns a single weight, we'll put it in an array
  //       setWeeklyWeights([response.data]);
  //       notifications.show({
  //         title: 'Success',
  //         message: 'Weekly weight fetched successfully',
  //         color: 'green',
  //       });
  //     }
  //   } catch (error) {
  //     const errorMessage =
  //       error instanceof Error
  //         ? error.message
  //         : 'Failed to fetch weekly weight';
  //     setError(errorMessage);
  //     notifications.show({
  //       title: 'Error',
  //       message: errorMessage,
  //       color: 'red',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);

  // Prepare data for charts using useMemo to optimize
  const chartData = useMemo(() => {
    return weeklyWeights.map((week) => {
      return {
        week: `${new Date(week.weekStartDate).toLocaleDateString()} - ${new Date(week.weekEndDate).toLocaleDateString()}`,
        weight: week.averageWeight,
      };
    });
  }, [weeklyWeights]);

  const dailyChartData = useMemo(() => {
    return dailyWeights
      .sort((a, b) => {
        return new Date(a.date!).getTime() - new Date(b.date!).getTime();
      })
      .map((day) => {
        return {
          date: new Date(day.date!).toLocaleDateString(),
          weight: day.weight,
        };
      });
  }, [dailyWeights]);

  // Form for adding/editing weight entries
  const form = useForm<ICreateDailyWeightDto>({
    initialValues: {
      date: new Date(),
      weight: 0,
      notes: '',
    },
    validate: {
      date: (value) => {
        return value ? null : 'Date is required';
      },
      weight: (value) => {
        return value && value <= 0 ? 'Weight must be greater than 0' : null;
      },
    },
  });

  // Handle editing a weight entry
  const handleEditWeight = useCallback(
    (weight: IGetDailyWeightDto) => {
      setEditingWeight(weight);
      form.setValues({
        date: new Date(weight.date!),
        weight: weight.weight,
        notes: weight.notes || '',
      });
    },
    [form],
  );

  // Handle deleting a weight entry
  const handleDeleteWeight = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        const response = await deleteDailyWeight(id);
        if (response) {
          // Remove the deleted weight from the local state
          setDailyWeights((prevWeights) => {
            return prevWeights.filter((w) => {
              return w.id !== id;
            });
          });
          notifications.show({
            title: 'Success',
            message: 'Weight entry deleted successfully',
            color: 'green',
          });
          // Refresh data
          fetchDailyWeights();
          fetchWeeklyWeights();
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to delete weight entry';
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
    [fetchDailyWeights, fetchWeeklyWeights],
  );

  // Handle form submission (create or update)
  const handleSubmit = useCallback(
    async (values: ICreateDailyWeightDto) => {
      setLoading(true);
      setError(null);
      try {
        let response;

        if (editingWeight) {
          // Update existing weight entry
          const updateData: IUpdateDailyWeightDto = {
            id: editingWeight.id!,
            ...values,
          };
          response = await updateDailyWeight(updateData);

          if (response?.data) {
            notifications.show({
              title: 'Success',
              message: 'Weight entry updated successfully',
              color: 'green',
            });
          }
        } else {
          // Create new weight entry
          response = await createDailyWeight(values);

          if (response?.data) {
            notifications.show({
              title: 'Success',
              message: 'Weight entry created successfully',
              color: 'green',
            });
          }
        }

        // Reset form and editing state
        form.reset();
        setEditingWeight(null);

        // Refresh data
        fetchDailyWeights();
        fetchWeeklyWeights();
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to save weight entry';
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
    [editingWeight, form, fetchDailyWeights, fetchWeeklyWeights],
  );

  // State for advanced filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [specificDate, setSpecificDate] = useState<Date | null>(null);

  // Filter options for chart display
  const [timeRange, setTimeRange] = useState<string>('year');
  const [activeTab, setActiveTab] = useState<string | null>('weekly');

  // Handle applying advanced filters
  const handleApplyYearFilter = useCallback(() => {
    if (selectedYear) {
      fetchWeeklyWeightsByYear(selectedYear);
    }
  }, [selectedYear, fetchWeeklyWeightsByYear]);

  const handleApplyDateRangeFilter = useCallback(() => {
    if (dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].toISOString().split('T')[0];
      const endDate = dateRange[1].toISOString().split('T')[0];

      if (activeTab === 'weekly') {
        fetchWeeklyWeightsBetweenDates(startDate, endDate);
      } else {
        fetchDailyWeightsBetweenDates(startDate, endDate);
      }
    }
  }, [
    dateRange,
    activeTab,
    fetchWeeklyWeightsBetweenDates,
    fetchDailyWeightsBetweenDates,
  ]);

  const handleApplySpecificDateFilter = useCallback(() => {
    if (specificDate) {
      const dateStr = specificDate.toISOString().split('T')[0];

      if (activeTab === 'weekly') {
        fetchWeeklyWeightForDate(dateStr);
      } else {
        // For daily weights, we can use the ID if we know it, or fetch by date range with same start/end date
        fetchDailyWeightsBetweenDates(dateStr, dateStr);
      }
    }
  }, [
    specificDate,
    activeTab,
    fetchWeeklyWeightForDate,
    fetchDailyWeightsBetweenDates,
  ]);

  // Reset filters and fetch all data
  const handleResetFilters = useCallback(() => {
    setSelectedYear(new Date().getFullYear());
    setDateRange([null, null]);
    setSpecificDate(null);
    fetchDailyWeights();
    fetchWeeklyWeights();
  }, [fetchDailyWeights, fetchWeeklyWeights]);

  // Filter data based on selected time range
  const filterDataByTimeRange = (data: any[], dateKey: string) => {
    const now = new Date();
    const cutoffDate = new Date();

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

    return data.filter((item) => {
      const itemDate =
        typeof item[dateKey] === 'string'
          ? new Date(item[dateKey].split(' ')[0])
          : new Date(item[dateKey]);
      return itemDate >= cutoffDate;
    });
  };

  const filteredWeeklyData = filterDataByTimeRange(chartData, 'week');
  const filteredDailyData = filterDataByTimeRange(dailyChartData, 'date');

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder mb="xl" pos="relative">
        <LoadingOverlay visible={loading} />
        <Title order={1} mb="xl">
          Weight Tracking
        </Title>

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
            {editingWeight ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    return setEditingWeight(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" color="blue">
                  Update Weight Entry
                </Button>
              </>
            ) : (
              <Button type="submit" leftSection={<IconPlus size="1rem" />}>
                Add Weight Entry
              </Button>
            )}
          </Group>
        </form>
      </Paper>

      <Paper shadow="md" p="xl" radius="md" withBorder pos="relative">
        <LoadingOverlay visible={loading} />
        <Group justify="space-between" mb="xl">
          <Title order={2}>Weight Progress</Title>

          <Group>
            <Button
              variant="outline"
              onClick={() => {
                return setShowAdvancedFilters(!showAdvancedFilters);
              }}
            >
              {showAdvancedFilters
                ? 'Hide Advanced Filters'
                : 'Show Advanced Filters'}
            </Button>
            <Select
              value={timeRange}
              onChange={(value) => {
                return setTimeRange(value || 'year');
              }}
              data={[
                { value: 'month', label: 'Last Month' },
                { value: 'quarter', label: 'Last 3 Months' },
                { value: 'year', label: 'Last Year' },
                { value: 'all', label: 'All Time' },
              ]}
              placeholder="Select time range"
            />
          </Group>
        </Group>

        {showAdvancedFilters && (
          <Paper p="md" mb="xl" withBorder>
            <Stack>
              <Title order={4}>Advanced Filters</Title>

              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <NumberInput
                    label="Filter by Year"
                    placeholder="Enter year"
                    value={selectedYear}
                    onChange={(value) => {
                      return setSelectedYear(
                        Number(value) || new Date().getFullYear(),
                      );
                    }}
                    min={2000}
                    max={new Date().getFullYear()}
                  />
                  <Button mt="sm" onClick={handleApplyYearFilter} fullWidth>
                    Get Weekly Weights by Year
                  </Button>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <DatePickerInput
                    type="range"
                    label="Filter by Date Range"
                    placeholder="Select date range"
                    value={dateRange}
                    onChange={setDateRange}
                  />
                  <Button
                    mt="sm"
                    onClick={handleApplyDateRangeFilter}
                    fullWidth
                  >
                    Get Weights by Date Range
                  </Button>
                </Grid.Col>

                <Grid.Col span={{ base: 12, md: 4 }}>
                  <DatePickerInput
                    label="Filter by Specific Date"
                    placeholder="Select date"
                    value={specificDate}
                    onChange={setSpecificDate}
                  />
                  <Button
                    mt="sm"
                    onClick={handleApplySpecificDateFilter}
                    fullWidth
                  >
                    Get Weight for Date
                  </Button>
                </Grid.Col>
              </Grid>

              <Button variant="outline" onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </Stack>
          </Paper>
        )}

        <Tabs value={activeTab} onChange={setActiveTab} mb="xl">
          <Tabs.List>
            <Tabs.Tab
              value="weekly"
              leftSection={<IconChartLine size="1rem" />}
            >
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
              <Text c="dimmed" ta="center">
                No weekly weight data available.
              </Text>
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
              <Text c="dimmed" ta="center">
                No daily weight data available.
              </Text>
            )}
          </Tabs.Panel>
        </Tabs>

        <Title order={3} mb="md">
          Recent Weight Entries
        </Title>
        <Stack gap="md">
          {dailyWeights.length > 0 ? (
            dailyWeights
              .sort((a, b) => {
                return (
                  new Date(b.date!).getTime() - new Date(a.date!).getTime()
                );
              })
              .slice(0, 7)
              .map((entry) => {
                return (
                  <Card key={entry.id} withBorder shadow="sm" padding="md">
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>
                          {new Date(
                            entry.date?.toString() ?? '01/01/2001',
                          ).toLocaleDateString()}
                        </Text>
                        {entry.notes && (
                          <Text size="sm" c="dimmed" mt="xs">
                            {entry.notes}
                          </Text>
                        )}
                      </div>
                      <Group>
                        <Text fw={700}>{entry.weight} kg</Text>
                        <ActionIcon
                          color="blue"
                          onClick={() => {
                            return handleEditWeight(entry);
                          }}
                          aria-label="Edit weight entry"
                        >
                          <IconEdit size="1rem" />
                        </ActionIcon>
                        <ActionIcon
                          color="red"
                          onClick={() => {
                            return handleDeleteWeight(entry.id!);
                          }}
                          aria-label="Delete weight entry"
                        >
                          <IconTrash size="1rem" />
                        </ActionIcon>
                      </Group>
                    </Group>
                  </Card>
                );
              })
          ) : (
            <Text c="dimmed">No weight entries yet.</Text>
          )}
        </Stack>
      </Paper>

      {error && (
        <Paper shadow="md" p="md" radius="md" withBorder mt="md" bg="red.1">
          <Text c="red">{error}</Text>
        </Paper>
      )}
    </Container>
  );
}
