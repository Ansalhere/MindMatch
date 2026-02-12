import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// If SUPABASE is configured we will use it; else if POSTGRES_URL is set we use Postgres; otherwise fallback to JSON file store.
const STORE_FILE = path.join(process.cwd(), 'data', 'requests.json');

async function readFileStore() {
  if (!fs.existsSync(path.dirname(STORE_FILE))) fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
  if (!fs.existsSync(STORE_FILE)) fs.writeFileSync(STORE_FILE, JSON.stringify([]));
  try { return JSON.parse(fs.readFileSync(STORE_FILE, 'utf8')); } catch (e) { return []; }
}

async function writeFileStore(data: any[]) {
  if (!fs.existsSync(path.dirname(STORE_FILE))) fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
  fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2));
}

// Helper: use Supabase client when configured
const { supabaseClient } = require('../services/supabase');
const POSTGRES_URL = process.env.POSTGRES_URL;
let pgClient = null;
if (POSTGRES_URL) {
  const { Client } = require('pg');
  pgClient = new Client({ connectionString: POSTGRES_URL });
  pgClient.connect().catch(() => {});
}

// Create a request (send interest)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { to, toName } = req.body;
    if (!to) return res.status(400).json({ message: 'Missing "to" field' });

    const token = req.headers.authorization?.split(' ')[1];
    const from = token ? token.split('-')[0] : 'demo';

    // Supabase path
    if (supabaseClient) {
      const payload = { id: Date.now(), from: String(from), to: Number(to), to_name: toName || null, status: 'sent', created_at: new Date().toISOString() };
      const { error } = await supabaseClient.from('requests').insert(payload);
      if (error) return res.status(500).json({ message: 'Failed to create request', error: error.message || error });
      return res.status(201).json({ success: true, request: payload });
    }

    // Postgres path
    if (pgClient) {
      const id = Date.now();
      await pgClient.query('INSERT INTO public.requests(id, "from", "to", to_name, status, created_at) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING', [id, String(from), Number(to), toName || null, 'sent', new Date().toISOString()]);
      return res.status(201).json({ success: true, request: { id, from, to, toName, status: 'sent', createdAt: new Date().toISOString() } });
    }

    // SQLite path
    try {
      const { getDb, ensureSqliteSchema } = require('../lib/sqlite');
      ensureSqliteSchema();
      const db = getDb();
      const id = Date.now();
      const stmt = db.prepare('INSERT OR IGNORE INTO requests(id, "from", "to", to_name, status, created_at) VALUES(?,?,?,?,?,?)');
      stmt.run(id, String(from), Number(to), toName || null, 'sent', new Date().toISOString());
      return res.status(201).json({ success: true, request: { id, from, to, toName, status: 'sent', createdAt: new Date().toISOString() } });
    } catch (sqliteErr) {
      // Fallback file-store
      const requests = await readFileStore();
      if (requests.find((r: any) => r.to === Number(to) && r.from === from && r.status === 'sent')) {
        return res.status(409).json({ message: 'Request already exists' });
      }

      const newReq = { id: Date.now(), from, to: Number(to), toName: toName || `Profile ${to}`, status: 'sent', createdAt: new Date().toISOString() };
      requests.unshift(newReq);
      await writeFileStore(requests);
      return res.status(201).json({ success: true, request: newReq });
    }
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to create request', error: error.message });
  }
});

// List requests (incoming + outgoing) - optional ?userId
router.get('/', async (req: Request, res: Response) => {
  try {
    const q = req.query.userId as string | undefined;
    const token = req.headers.authorization?.split(' ')[1];
    const me = q || (token ? token.split('-')[0] : 'demo');
    const requests = await readFileStore();
    const filtered = requests.filter((r: any) => String(r.to) === String(me) || String(r.from) === String(me));
    return res.json({ success: true, requests: filtered });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to list requests', error: error.message });
  }
});

// Cancel / delete request
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];
    const me = token ? token.split('-')[0] : 'demo';
    let requests = await readFileStore();
    const existing = requests.find((r: any) => String(r.id) === String(id));
    if (!existing) return res.status(404).json({ message: 'Not found' });
    // only sender can cancel in demo
    if (String(existing.from) !== String(me) && me !== 'admin') {
      return res.status(403).json({ message: 'Not allowed' });
    }
    requests = requests.filter((r: any) => String(r.id) !== String(id));
    await writeFileStore(requests);
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to delete request', error: error.message });
  }
});

// Respond to request (accept/reject) — demo-only
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // accept | reject
    if (!['accept', 'reject'].includes(action)) return res.status(400).json({ message: 'Invalid action' });
    const requests = await readFileStore();
    const idx = requests.findIndex((r: any) => String(r.id) === String(id));
    if (idx === -1) return res.status(404).json({ message: 'Not found' });
    requests[idx].status = action === 'accept' ? 'accepted' : 'rejected';
    requests[idx].updatedAt = new Date().toISOString();
    await writeFileStore(requests);
    return res.json({ success: true, request: requests[idx] });
  } catch (error: any) {
    return res.status(500).json({ message: 'Failed to update request', error: error.message });
  }
});

export default router;
