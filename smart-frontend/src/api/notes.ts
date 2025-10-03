import { Note, Tag } from '../types/notes';
import { api } from './api.ts';

export const notesApi = {
  getAllNotes: async (params?: { 
    subject?: string; 
    topic?: string; 
    tags?: string[];
    search?: string;
    ordering?: string;
  }) => {
    const response = await api.get('/api/notes/', { params });
    return response.data;
  },

  getNoteById: async (id: number) => {
    const response = await api.get(`/api/notes/${id}/`);
    return response.data;
  },

  createNote: async (noteData: FormData) => {
    const response = await api.post('/api/notes/', noteData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateNote: async (id: number, noteData: FormData) => {
    const response = await api.patch(`/api/notes/${id}/`, noteData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteNote: async (id: number) => {
    await api.delete(`/api/notes/${id}/`);
  },

  voteNote: async (id: number, value: 1 | -1) => {
    const response = await api.post(`/api/notes/${id}/vote/`, { value });
    return response.data;
  },

  getAllTags: async () => {
    const response = await api.get('/api/tags/');
    return response.data as Tag[];
  },
};