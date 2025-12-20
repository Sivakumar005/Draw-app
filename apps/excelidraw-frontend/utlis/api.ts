// utils/api.ts
import axios from 'axios';
import { tokenStorage } from './auth';

const HTTP_BACKEND = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export interface SignUpData {
  username: string;
  password: string;
  name: string;
}

export interface SignInData {
  username: string;
  password: string;
}

export interface createRoomData {
  name: string;
}

export interface joinRoomData {
  roomId: number;
}

export const authAPI = {
  SignUp: async (data: SignUpData) => {
    try {
      const response = await axios.post(`${HTTP_BACKEND}/signup`, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  SignIn: async (data: SignInData) => {
    try {
      const response = await axios.post(`${HTTP_BACKEND}/signin`, data, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const RoomAPI = {
  createRoom: async (data: createRoomData) => {
    try {
      const token = tokenStorage.get();

      const response = await axios.post(
        `${HTTP_BACKEND}/create-room`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getRooms: async () => {
    try {
      const token = tokenStorage.get();
      const response = await axios.get(`${HTTP_BACKEND}/dashboard`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      console.log("Available rooms from dashboard:", response.data);
      return response.data;
    } catch (err: any) {
      console.error("Failed to fetch rooms:", err.message);
      throw err;
    }
  },
  
  joinRoom: async (data: joinRoomData) => {
    try {
      const token = tokenStorage.get();
      
      // Detailed logging
      console.log("=== JOIN ROOM DEBUG ===");
      console.log("1. Input data:", data);
      console.log("2. Data type:", typeof data.roomId);
      console.log("3. Backend URL:", `${HTTP_BACKEND}/join-room`);
      console.log("4. Token:", token ? "Present" : "Missing");
      console.log("5. Request payload:", JSON.stringify(data));
      
      const response = await axios.post(`${HTTP_BACKEND}/join-room`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      
      console.log("6. Response:", response.data);
      console.log("======================");
      
      return response.data;
    } catch (err: any) {
      console.error("=== JOIN ROOM ERROR ===");
      console.error("Status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      console.error("Error message:", err.message);
      console.error("Full error:", err);
      console.error("======================");
      throw err; 
    }
  }
};