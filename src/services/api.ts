export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  address?: string;
  gotra?: string;
  nakshatra?: string;
  preferredDeity?: string;
  notes?: string;
  totalBookings: number;
  totalOrders: number;
  totalSpend: number;
  status: 'active' | 'inactive' | 'vip';
  createdAt: string;
  updatedAt: string;
}

export interface ClientProfileResponse {
  success: boolean;
  client: Client;
  bookings: any[];
  orders: any[];
}

export const clientApi = {
  // Fetch all clients
  async getClients(search?: string, city?: string): Promise<Client[]> {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (city) params.append('city', city);
      const url = `/api/clients${params.toString() ? `?${params.toString()}` : ''}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch clients');
      const data = await res.json();
      return data.clients || [];
    } catch (error) {
      console.warn('API error fetching clients, checking fallback:', error);
      const saved = localStorage.getItem('pooja_seve_clients_fallback');
      return saved ? JSON.parse(saved) : [];
    }
  },

  // Get single client profile with history
  async getClientById(id: string): Promise<ClientProfileResponse | null> {
    try {
      const res = await fetch(`/api/clients/${id}`);
      if (!res.ok) throw new Error('Failed to fetch client details');
      return await res.json();
    } catch (error) {
      console.error('Error fetching client by ID:', error);
      return null;
    }
  },

  // Create or upsert client
  async saveClient(client: Partial<Client>): Promise<Client | null> {
    try {
      const res = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(client),
      });
      if (!res.ok) throw new Error('Failed to save client');
      const data = await res.json();
      return data.client;
    } catch (error) {
      console.error('Error saving client:', error);
      return null;
    }
  },

  // Update client
  async updateClient(id: string, updates: Partial<Client>): Promise<Client | null> {
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error('Failed to update client');
      const data = await res.json();
      return data.client;
    } catch (error) {
      console.error('Error updating client:', error);
      return null;
    }
  },

  // Delete client
  async deleteClient(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (error) {
      console.error('Error deleting client:', error);
      return false;
    }
  },

  // Create booking and auto-link/upsert client
  async submitBooking(bookingData: any): Promise<any> {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });
      if (!res.ok) throw new Error('Failed to submit booking');
      return await res.json();
    } catch (error) {
      console.error('Error submitting booking to backend:', error);
      return null;
    }
  },

  // Submit order and auto-link/upsert client
  async submitOrder(orderData: any): Promise<any> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error('Failed to submit order');
      return await res.json();
    } catch (error) {
      console.error('Error submitting order to backend:', error);
      return null;
    }
  },
};

export const databaseApi = {
  async getStatus(): Promise<{
    success: boolean;
    isConnected: boolean;
    uriConfigured: boolean;
    dbName: string;
    counts: { clients: number; bookings: number; orders: number; payments: number };
    lastError?: string;
  }> {
    try {
      const res = await fetch('/api/database/status');
      return await res.json();
    } catch (e: any) {
      return {
        success: false,
        isConnected: false,
        uriConfigured: false,
        dbName: 'Local Mode',
        counts: { clients: 0, bookings: 0, orders: 0, payments: 0 },
        lastError: e?.message,
      };
    }
  },

  async connect(uri: string): Promise<{ success: boolean; message: string; dbName?: string; synced?: any; error?: string }> {
    try {
      const res = await fetch('/api/database/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uri }),
      });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e?.message || 'Connection failed', error: e?.message };
    }
  },

  async sync(): Promise<{ success: boolean; message: string; synced?: any }> {
    try {
      const res = await fetch('/api/database/sync', { method: 'POST' });
      return await res.json();
    } catch (e: any) {
      return { success: false, message: e?.message || 'Sync failed' };
    }
  },
};

export const paymentApi = {
  async createOrder(amount: number, receipt?: string): Promise<{
    success: boolean;
    orderId?: string;
    amount?: number;
    currency?: string;
  }> {
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, receipt }),
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async verifyPayment(paymentData: {
    orderId: string;
    transactionId: string;
    gateway?: string;
    method?: string;
    amount: number;
    utrNumber?: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
  }): Promise<{ success: boolean; payment?: any }> {
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData),
      });
      return await res.json();
    } catch (e) {
      return { success: false };
    }
  },

  async getPayments(): Promise<any[]> {
    try {
      const res = await fetch('/api/payments');
      const data = await res.json();
      return data.payments || [];
    } catch (e) {
      return [];
    }
  },
};

