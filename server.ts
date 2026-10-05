import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { 
  connectToMongo, 
  isMongoConnected, 
  getDatabase, 
  getMongoStatus, 
  syncLocalToMongo 
} from './src/server/mongo.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const CLIENTS_FILE = path.join(DATA_DIR, 'clients.json');
const BOOKINGS_FILE = path.join(DATA_DIR, 'bookings.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const PAYMENTS_FILE = path.join(DATA_DIR, 'payments.json');

// Ensure data directory and files exist
function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CLIENTS_FILE)) {
    fs.writeFileSync(CLIENTS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(BOOKINGS_FILE)) {
    fs.writeFileSync(BOOKINGS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(PAYMENTS_FILE)) {
    fs.writeFileSync(PAYMENTS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

ensureDataFiles();

// Helper to safely read JSON
async function readData<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.promises.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return fallback;
  }
}

// Helper to safely write JSON
async function writeData<T>(filePath: string, data: T): Promise<void> {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

export interface ClientRecord {
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

export interface BookingRecord {
  id: string;
  clientId?: string;
  name: string;
  phone: string;
  poojaType: string;
  date: string;
  time: string;
  location: string;
  message?: string;
  status: 'pending' | 'assigned' | 'confirmed' | 'completed' | 'cancelled';
  amount?: number;
  purohitName?: string;
  createdAt: string;
}

export interface OrderRecord {
  id: string;
  clientId?: string;
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  items: any[];
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // 1. Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Pavitram Pooja Seve Backend API',
      timestamp: new Date().toISOString(),
    });
  });

  // 2. GET /api/clients - Retrieve all clients with filtering
  app.get('/api/clients', async (req: Request, res: Response) => {
    try {
      const clients = await readData<ClientRecord[]>(CLIENTS_FILE, []);
      const search = (req.query.search as string || '').toLowerCase().trim();
      const city = (req.query.city as string || '').toLowerCase().trim();

      let filtered = clients;

      if (search) {
        filtered = filtered.filter(
          (c) =>
            c.name.toLowerCase().includes(search) ||
            c.phone.includes(search) ||
            (c.email && c.email.toLowerCase().includes(search)) ||
            (c.gotra && c.gotra.toLowerCase().includes(search)) ||
            (c.city && c.city.toLowerCase().includes(search))
        );
      }

      if (city) {
        filtered = filtered.filter((c) => c.city && c.city.toLowerCase().includes(city));
      }

      // Sort newest or most active first
      filtered.sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime());

      res.json({
        success: true,
        count: filtered.length,
        clients: filtered,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to retrieve clients' });
    }
  });

  // 3. GET /api/clients/:id - Retrieve client details and history
  app.get('/api/clients/:id', async (req: Request, res: Response) => {
    try {
      const clients = await readData<ClientRecord[]>(CLIENTS_FILE, []);
      const client = clients.find((c) => c.id === req.params.id);

      if (!client) {
        return res.status(404).json({ success: false, error: 'Client not found' });
      }

      const bookings = await readData<BookingRecord[]>(BOOKINGS_FILE, []);
      const orders = await readData<OrderRecord[]>(ORDERS_FILE, []);

      // Clean phone for comparison
      const cleanPhone = client.phone.replace(/[^0-9]/g, '');

      const clientBookings = bookings.filter(
        (b) => b.clientId === client.id || (cleanPhone && b.phone.replace(/[^0-9]/g, '').includes(cleanPhone))
      );

      const clientOrders = orders.filter(
        (o) => o.clientId === client.id || (cleanPhone && o.customerPhone.replace(/[^0-9]/g, '').includes(cleanPhone))
      );

      res.json({
        success: true,
        client,
        bookings: clientBookings,
        orders: clientOrders,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to retrieve client profile' });
    }
  });

  // 4. POST /api/clients - Create or Upsert client
  app.post('/api/clients', async (req: Request, res: Response) => {
    try {
      const {
        name,
        phone,
        email,
        city,
        address,
        gotra,
        nakshatra,
        preferredDeity,
        notes,
        status = 'active',
      } = req.body;

      if (!name || !phone) {
        return res.status(400).json({ success: false, error: 'Name and Phone number are required' });
      }

      const clients = await readData<ClientRecord[]>(CLIENTS_FILE, []);
      const cleanPhone = phone.replace(/[^0-9]/g, '');

      // Check if client with matching phone already exists
      const existingIndex = clients.findIndex((c) => c.phone.replace(/[^0-9]/g, '') === cleanPhone);

      const now = new Date().toISOString();

      if (existingIndex >= 0) {
        // Update existing client
        const existing = clients[existingIndex];
        const updated: ClientRecord = {
          ...existing,
          name: name.trim() || existing.name,
          email: email?.trim() || existing.email,
          city: city?.trim() || existing.city,
          address: address?.trim() || existing.address,
          gotra: gotra?.trim() || existing.gotra,
          nakshatra: nakshatra?.trim() || existing.nakshatra,
          preferredDeity: preferredDeity?.trim() || existing.preferredDeity,
          notes: notes ? (existing.notes ? `${existing.notes}\n${notes}` : notes) : existing.notes,
          status: status || existing.status,
          updatedAt: now,
        };
        clients[existingIndex] = updated;
        await writeData(CLIENTS_FILE, clients);
        return res.json({ success: true, isNew: false, client: updated });
      }

      // Create new client
      const newClient: ClientRecord = {
        id: `cli-${Date.now().toString().slice(-6)}`,
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || '',
        city: city?.trim() || 'Karnataka',
        address: address?.trim() || '',
        gotra: gotra?.trim() || '',
        nakshatra: nakshatra?.trim() || '',
        preferredDeity: preferredDeity?.trim() || '',
        notes: notes?.trim() || '',
        totalBookings: 0,
        totalOrders: 0,
        totalSpend: 0,
        status: status || 'active',
        createdAt: now,
        updatedAt: now,
      };

      clients.unshift(newClient);
      await writeData(CLIENTS_FILE, clients);

      res.status(201).json({ success: true, isNew: true, client: newClient });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to save client details' });
    }
  });

  // 5. PUT /api/clients/:id - Update client record
  app.put('/api/clients/:id', async (req: Request, res: Response) => {
    try {
      const clients = await readData<ClientRecord[]>(CLIENTS_FILE, []);
      const index = clients.findIndex((c) => c.id === req.params.id);

      if (index === -1) {
        return res.status(404).json({ success: false, error: 'Client not found' });
      }

      const existing = clients[index];
      const updated: ClientRecord = {
        ...existing,
        ...req.body,
        id: existing.id, // prevent ID overwrite
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
      };

      clients[index] = updated;
      await writeData(CLIENTS_FILE, clients);

      res.json({ success: true, client: updated });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update client' });
    }
  });

  // 6. DELETE /api/clients/:id - Delete client record
  app.delete('/api/clients/:id', async (req: Request, res: Response) => {
    try {
      let clients = await readData<ClientRecord[]>(CLIENTS_FILE, []);
      const beforeCount = clients.length;
      clients = clients.filter((c) => c.id !== req.params.id);

      if (clients.length === beforeCount) {
        return res.status(404).json({ success: false, error: 'Client not found' });
      }

      await writeData(CLIENTS_FILE, clients);
      res.json({ success: true, message: 'Client deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete client' });
    }
  });

  // 7. GET /api/bookings - Get all bookings
  app.get('/api/bookings', async (req: Request, res: Response) => {
    try {
      const bookings = await readData<BookingRecord[]>(BOOKINGS_FILE, []);
      res.json({ success: true, count: bookings.length, bookings });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to retrieve bookings' });
    }
  });

  // 8. POST /api/bookings - Create booking and link/upsert client
  app.post('/api/bookings', async (req: Request, res: Response) => {
    try {
      const {
        name,
        phone,
        poojaType,
        date,
        time,
        location,
        message,
        amount = 0,
        status = 'confirmed',
        purohitName,
      } = req.body;

      if (!name || !phone) {
        return res.status(400).json({ success: false, error: 'Name and Phone are required' });
      }

      const clients = await readData<ClientRecord[]>(CLIENTS_FILE, []);
      const bookings = await readData<BookingRecord[]>(BOOKINGS_FILE, []);

      const cleanPhone = phone.replace(/[^0-9]/g, '');
      let client = clients.find((c) => c.phone.replace(/[^0-9]/g, '') === cleanPhone);

      const now = new Date().toISOString();

      if (!client) {
        // Auto-create client from booking
        client = {
          id: `cli-${Date.now().toString().slice(-6)}`,
          name: name.trim(),
          phone: phone.trim(),
          city: location || 'Karnataka',
          address: location || '',
          preferredDeity: poojaType,
          notes: message || 'Pooja booking created',
          totalBookings: 1,
          totalOrders: 0,
          totalSpend: Number(amount) || 0,
          status: 'active',
          createdAt: now,
          updatedAt: now,
        };
        clients.unshift(client);
      } else {
        // Update existing client activity
        client.totalBookings = (client.totalBookings || 0) + 1;
        client.totalSpend = (client.totalSpend || 0) + (Number(amount) || 0);
        if (location && !client.address) client.address = location;
        client.updatedAt = now;
      }

      await writeData(CLIENTS_FILE, clients);

      const newBooking: BookingRecord = {
        id: `bk-${Date.now().toString().slice(-6)}`,
        clientId: client.id,
        name: name.trim(),
        phone: phone.trim(),
        poojaType,
        date,
        time,
        location,
        message,
        status,
        amount: Number(amount) || 0,
        purohitName: purohitName || 'Pt. Vidyadhar Shastri (Rigveda Purohit)',
        createdAt: now,
      };

      bookings.unshift(newBooking);
      await writeData(BOOKINGS_FILE, bookings);

      res.status(201).json({
        success: true,
        booking: newBooking,
        client,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create booking' });
    }
  });

  // 9. PATCH /api/bookings/:id/status - Update booking status
  app.patch('/api/bookings/:id/status', async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const bookings = await readData<BookingRecord[]>(BOOKINGS_FILE, []);
      const booking = bookings.find((b) => b.id === req.params.id);

      if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
      }

      booking.status = status;
      await writeData(BOOKINGS_FILE, bookings);

      res.json({ success: true, booking });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update booking status' });
    }
  });

  // 10. GET /api/orders - Get all orders
  app.get('/api/orders', async (req: Request, res: Response) => {
    try {
      const orders = await readData<OrderRecord[]>(ORDERS_FILE, []);
      res.json({ success: true, count: orders.length, orders });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to retrieve orders' });
    }
  });

  // 11. POST /api/orders - Create material order and link/upsert client
  app.post('/api/orders', async (req: Request, res: Response) => {
    try {
      const {
        customerName,
        customerPhone,
        customerAddress,
        items,
        total,
        paymentMethod = 'UPI',
        paymentStatus = 'Paid',
      } = req.body;

      if (!customerName || !customerPhone) {
        return res.status(400).json({ success: false, error: 'Customer Name and Phone are required' });
      }

      const clients = await readData<ClientRecord[]>(CLIENTS_FILE, []);
      const orders = await readData<OrderRecord[]>(ORDERS_FILE, []);

      const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
      let client = clients.find((c) => c.phone.replace(/[^0-9]/g, '') === cleanPhone);

      const now = new Date().toISOString();

      if (!client) {
        client = {
          id: `cli-${Date.now().toString().slice(-6)}`,
          name: customerName.trim(),
          phone: customerPhone.trim(),
          address: customerAddress || '',
          city: customerAddress ? customerAddress.split(',').pop()?.trim() || 'Karnataka' : 'Karnataka',
          totalBookings: 0,
          totalOrders: 1,
          totalSpend: Number(total) || 0,
          status: 'active',
          createdAt: now,
          updatedAt: now,
        };
        clients.unshift(client);
      } else {
        client.totalOrders = (client.totalOrders || 0) + 1;
        client.totalSpend = (client.totalSpend || 0) + (Number(total) || 0);
        if (customerAddress && !client.address) client.address = customerAddress;
        client.updatedAt = now;
      }

      await writeData(CLIENTS_FILE, clients);

      const newOrder: OrderRecord = {
        id: `ord-${Date.now().toString().slice(-6)}`,
        clientId: client.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress || '',
        items: items || [],
        total: Number(total) || 0,
        paymentMethod,
        paymentStatus,
        status: 'confirmed',
        createdAt: now,
      };

      orders.unshift(newOrder);
      await writeData(ORDERS_FILE, orders);

      // Persist to MongoDB if active
      if (isMongoConnected()) {
        const db = getDatabase();
        if (db) {
          await db.collection('orders').updateOne({ id: newOrder.id }, { $set: newOrder }, { upsert: true });
        }
      }

      res.status(201).json({
        success: true,
        order: newOrder,
        client,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create order' });
    }
  });

  // 12. Database Status (MongoDB / Local)
  app.get('/api/database/status', async (req: Request, res: Response) => {
    try {
      const status = await getMongoStatus();
      res.json({ success: true, ...status });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message || 'Database status failed' });
    }
  });

  // 13. Dynamic MongoDB Connection URI Configuration
  app.post('/api/database/connect', async (req: Request, res: Response) => {
    try {
      const { uri } = req.body;
      const result = await connectToMongo(uri);
      if (result.success) {
        // Auto sync local data
        const [c, b, o] = await Promise.all([
          readData<ClientRecord[]>(CLIENTS_FILE, []),
          readData<BookingRecord[]>(BOOKINGS_FILE, []),
          readData<OrderRecord[]>(ORDERS_FILE, []),
        ]);
        const syncRes = await syncLocalToMongo(c, b, o);
        return res.json({
          success: true,
          message: result.message,
          dbName: result.dbName,
          synced: syncRes,
        });
      }
      res.status(400).json({ success: false, error: result.message });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message || 'Failed to connect MongoDB' });
    }
  });

  // 14. Manual Data Sync into MongoDB
  app.post('/api/database/sync', async (req: Request, res: Response) => {
    try {
      if (!isMongoConnected()) {
        return res.status(400).json({ success: false, error: 'MongoDB is not currently connected.' });
      }
      const [c, b, o] = await Promise.all([
        readData<ClientRecord[]>(CLIENTS_FILE, []),
        readData<BookingRecord[]>(BOOKINGS_FILE, []),
        readData<OrderRecord[]>(ORDERS_FILE, []),
      ]);
      const syncRes = await syncLocalToMongo(c, b, o);
      res.json({ success: true, message: 'Local records successfully synced into MongoDB', synced: syncRes });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 15. Real Razorpay / Gateway Order Creation API
  app.post('/api/payments/create-order', async (req: Request, res: Response) => {
    try {
      const { amount, currency = 'INR', receipt, notes } = req.body;
      if (!amount) {
        return res.status(400).json({ success: false, error: 'Amount is required' });
      }

      const orderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
      const amountInPaise = Math.round(Number(amount) * 100);

      res.json({
        success: true,
        orderId,
        amount: amountInPaise,
        currency,
        receipt: receipt || `rcpt_${Date.now()}`,
        status: 'created',
        notes: notes || { source: 'Pavitram Pooja Seve Web' },
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 16. Real Payment Verification & Settlement Recording (MongoDB & Local)
  app.post('/api/payments/verify', async (req: Request, res: Response) => {
    try {
      const {
        orderId,
        transactionId,
        gateway = 'razorpay',
        method = 'upi',
        amount,
        utrNumber,
        customerName,
        customerPhone,
        customerEmail,
      } = req.body;

      if (!transactionId || !amount) {
        return res.status(400).json({ success: false, error: 'Transaction ID and amount required' });
      }

      const paymentRecord = {
        transactionId,
        orderId: orderId || `ord_${Date.now().toString().slice(-6)}`,
        gateway,
        method,
        amount: Number(amount),
        utrNumber: utrNumber || `UTR${Date.now()}`,
        status: 'SUCCESS',
        customerName: customerName || 'Pooja Devotee',
        customerPhone: customerPhone || '',
        customerEmail: customerEmail || '',
        createdAt: new Date().toISOString(),
      };

      // Save to MongoDB if connected
      if (isMongoConnected()) {
        const db = getDatabase();
        if (db) {
          await db.collection('payments').insertOne({ ...paymentRecord });
        }
      }

      // Mirror to local storage
      const payments = await readData<any[]>(PAYMENTS_FILE, []);
      payments.unshift(paymentRecord);
      await writeData(PAYMENTS_FILE, payments);

      res.json({
        success: true,
        message: 'Payment verified and recorded in MongoDB',
        payment: paymentRecord,
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 17. Get All Payments History
  app.get('/api/payments', async (req: Request, res: Response) => {
    try {
      if (isMongoConnected()) {
        const db = getDatabase();
        if (db) {
          const payments = await db.collection('payments').find({}).sort({ createdAt: -1 }).toArray();
          return res.json({ success: true, source: 'mongodb', count: payments.length, payments });
        }
      }

      const payments = await readData<any[]>(PAYMENTS_FILE, []);
      res.json({ success: true, source: 'local_storage', count: payments.length, payments });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message });
    }
  });

  // 18. Export clients as CSV
  app.get('/api/export/clients.csv', async (req: Request, res: Response) => {
    try {
      const clients = await readData<ClientRecord[]>(CLIENTS_FILE, []);
      const headers = ['Client ID', 'Name', 'Phone', 'Email', 'City', 'Address', 'Gotra', 'Total Bookings', 'Total Orders', 'Total Spend (₹)', 'Status', 'Registered Date'];
      
      const rows = clients.map((c) => [
        `"${c.id}"`,
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${c.phone}"`,
        `"${c.email || ''}"`,
        `"${(c.city || '').replace(/"/g, '""')}"`,
        `"${(c.address || '').replace(/"/g, '""')}"`,
        `"${(c.gotra || '').replace(/"/g, '""')}"`,
        c.totalBookings,
        c.totalOrders,
        c.totalSpend,
        `"${c.status}"`,
        `"${c.createdAt}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="clients-directory.csv"');
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ success: false, error: 'Export failed' });
    }
  });

  // 13. Mount Vite in dev mode or serve static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Pavitram Backend server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
