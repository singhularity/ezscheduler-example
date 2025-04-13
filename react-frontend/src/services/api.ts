import axios from 'axios';
import type { Schedule } from 'ezscheduler';

const API_URL = '/api/schedules';

// Mock data for when the API is not available
const mockSchedules: Array<Schedule & { id: string }> = [
  {
    id: 'schedule-1',
    scheduleName: 'Weekly Team Meeting',
    timeZone: 'America/New_York',
    scheduleDetails: []
  },
  {
    id: 'schedule-2',
    scheduleName: 'Client Consultations',
    timeZone: 'America/Chicago',
    scheduleDetails: []
  },
  {
    id: 'schedule-3',
    scheduleName: 'Product Demo',
    timeZone: 'America/Los_Angeles',
    scheduleDetails: []
  }
];

// Fetch all schedules
export const fetchSchedules = async (): Promise<{ id: string; name: string }[]> => {
  try {
    const response = await axios.get(API_URL);
    return response.data.map((schedule: any) => ({
      id: schedule.id,
      name: schedule.name || schedule.scheduleName
    }));
  } catch (error) {
    console.error('Error fetching schedules:', error);
    // Return mock data when the API is not available
    console.log('Using mock schedule data');
    return mockSchedules.map(schedule => ({
      id: schedule.id,
      name: schedule.scheduleName
    }));
  }
};

// Get a specific schedule by ID
export const getSchedule = async (id: string): Promise<Schedule> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching schedule ${id}:`, error);
    // Return mock data when the API is not available
    console.log('Using mock schedule data for ID:', id);
    const mockSchedule = mockSchedules.find(schedule => schedule.id === id);
    if (mockSchedule) {
      return mockSchedule;
    }
    throw new Error(`Schedule with ID ${id} not found`);
  }
};

// Save a schedule (create or update)
export const saveSchedule = async (schedule: Schedule): Promise<Schedule> => {
  try {
    let response;
    
    if (schedule.id) {
      // Update existing schedule
      response = await axios.put(`${API_URL}/${schedule.id}`, schedule);
    } else {
      // Create new schedule
      response = await axios.post(API_URL, schedule);
    }
    
    return response.data;
  } catch (error) {
    console.error('Error saving schedule:', error);
    // Handle mock data when API is not available
    console.log('Using mock data for saving schedule');
    
    // Create a copy of the schedule with an ID if it doesn't have one
    const savedSchedule = { ...schedule };
    if (!savedSchedule.id) {
      savedSchedule.id = 'schedule-' + Date.now();
    }
    
    // Update mockSchedules array for future reference
    const existingIndex = mockSchedules.findIndex(s => s.id === savedSchedule.id);
    if (existingIndex >= 0) {
      mockSchedules[existingIndex] = savedSchedule as (Schedule & { id: string });
    } else {
      mockSchedules.push(savedSchedule as (Schedule & { id: string }));
    }
    
    return savedSchedule;
  }
};

// Delete a schedule
export const deleteSchedule = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting schedule ${id}:`, error);
    // Handle mock data when API is not available
    console.log('Using mock data for deleting schedule:', id);
    
    // Remove the schedule from the mockSchedules array
    const index = mockSchedules.findIndex(schedule => schedule.id === id);
    if (index !== -1) {
      mockSchedules.splice(index, 1);
    }
  }
};
