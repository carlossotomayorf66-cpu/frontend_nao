import { create } from 'zustand';
import api from '../services/api';

export interface Client {
  id?: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface ClientState {
  clients: Client[];
  isLoading: boolean;
  fetchClients: () => Promise<void>;
  addClient: (client: Client) => Promise<void>;
  updateClient: (id: number, client: Client) => Promise<void>;
  deleteClient: (id: number) => Promise<void>;
}

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  isLoading: false,
  fetchClients: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/clients');
      set({ clients: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error(error);
    }
  },
  addClient: async (client) => {
    await api.post('/clients', client);
    get().fetchClients();
  },
  updateClient: async (id, client) => {
    await api.put(`/clients/${id}`, client);
    get().fetchClients();
  },
  deleteClient: async (id) => {
    await api.delete(`/clients/${id}`);
    get().fetchClients();
  },
}));
