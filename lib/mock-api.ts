// Mock API implementation for when the real API is unavailable
import { MeetingMinutes, MeetingMinutesFormData } from './api';

// In-memory storage for mock data
let mockMeetingMinutes: MeetingMinutes[] = [];
let nextId = 1;

export const mockMeetingMinutesApi = {
  // Get all meeting minutes
  getMeetingMinutes: async (): Promise<MeetingMinutes[]> => {
    console.log('Using mock API to get meeting minutes');
    return [...mockMeetingMinutes];
  },

  // Get meeting minutes by ID
  getMeetingMinutesById: async (id: number | string): Promise<MeetingMinutes> => {
    console.log(`Using mock API to get meeting minutes with ID ${id}`);
    const minutes = mockMeetingMinutes.find(m => m.id === Number(id));
    
    if (!minutes) {
      throw new Error(`Meeting minutes with ID ${id} not found`);
    }
    
    return { ...minutes };
  },

  // Create meeting minutes
  createMeetingMinutes: async (data: MeetingMinutesFormData): Promise<MeetingMinutes> => {
    console.log('Using mock API to create meeting minutes:', data);
    
    // Create a new meeting minutes object
    const newMinutes: MeetingMinutes = {
      id: nextId++,
      title: data.title,
      description: data.description || '',
      date: data.date,
      document_url: data.document_url || '',
      event_id: data.event_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Add to mock storage
    mockMeetingMinutes.push(newMinutes);
    
    // Save to localStorage for persistence
    saveToLocalStorage();
    
    return { ...newMinutes };
  },

  // Update meeting minutes
  updateMeetingMinutes: async (id: number | string, data: Partial<MeetingMinutesFormData>): Promise<MeetingMinutes> => {
    console.log(`Using mock API to update meeting minutes with ID ${id}:`, data);
    
    const index = mockMeetingMinutes.findIndex(m => m.id === Number(id));
    
    if (index === -1) {
      throw new Error(`Meeting minutes with ID ${id} not found`);
    }
    
    // Update the meeting minutes
    const updatedMinutes = {
      ...mockMeetingMinutes[index],
      ...data,
      updated_at: new Date().toISOString()
    };
    
    mockMeetingMinutes[index] = updatedMinutes;
    
    // Save to localStorage for persistence
    saveToLocalStorage();
    
    return { ...updatedMinutes };
  },

  // Delete meeting minutes
  deleteMeetingMinutes: async (id: number | string): Promise<void> => {
    console.log(`Using mock API to delete meeting minutes with ID ${id}`);
    
    const index = mockMeetingMinutes.findIndex(m => m.id === Number(id));
    
    if (index === -1) {
      throw new Error(`Meeting minutes with ID ${id} not found`);
    }
    
    // Remove from mock storage
    mockMeetingMinutes.splice(index, 1);
    
    // Save to localStorage for persistence
    saveToLocalStorage();
  }
};

// Helper functions for localStorage persistence
function saveToLocalStorage() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('mockMeetingMinutes', JSON.stringify(mockMeetingMinutes));
    } catch (error) {
      console.error('Error saving mock meeting minutes to localStorage:', error);
    }
  }
}

function loadFromLocalStorage() {
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem('mockMeetingMinutes');
      if (data) {
        mockMeetingMinutes = JSON.parse(data);
        // Find the highest ID to set nextId
        nextId = Math.max(0, ...mockMeetingMinutes.map(m => m.id)) + 1;
      }
    } catch (error) {
      console.error('Error loading mock meeting minutes from localStorage:', error);
    }
  }
}

// Initialize by loading from localStorage
if (typeof window !== 'undefined') {
  // Only run in browser environment
  loadFromLocalStorage();
}
