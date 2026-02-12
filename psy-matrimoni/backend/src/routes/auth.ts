import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { readFileStore, writeFileStore } from '../utils/fileStore.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mindmatch-secret-key';

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const store = await readFileStore();
    
    // Check if user exists
    if (store.users.find((u: any) => u.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const user = {
      id: userId,
      email,
      password: hashedPassword,
      name,
      createdAt: new Date().toISOString(),
    };

    store.users.push(user);
    await writeFileStore(store);

    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name, profileComplete: false },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const store = await readFileStore();
    const user = store.users.find((u: any) => u.email === email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Check if profile exists
    const profile = store.profiles.find((p: any) => p.userId === user.id);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profileComplete: !!profile,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

export default router;
