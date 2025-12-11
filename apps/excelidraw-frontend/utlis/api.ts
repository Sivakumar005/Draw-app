// utils/api.ts
import axios from 'axios';
import { tokenStorage } from './auth';
import { headers } from 'next/headers';

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
      })
      console.log("Token being sent:", tokenStorage.get());
      return response.data;
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
      throw err;
    }
  }
};
