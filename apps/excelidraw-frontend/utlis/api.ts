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

export interface createRoomData{
  name:string;
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
};
