import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middleware/auth.js';
import { readFileStore, writeFileStore } from '../utils/fileStore.js';

const router = Router();

// Create request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { recipientId, message } = req.body;

    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient ID is required' });
    }

    const store = await readFileStore();

    // Check if request already exists
    const existingRequest = store.requests.find(
      (r: any) => r.senderId === req.userId && r.recipientId === recipientId && r.status === 'pending'
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    const request = {
      id: uuidv4(),
      senderId: req.userId!,
      recipientId,
      status: 'pending',
      message: message || '',
      createdAt: new Date().toISOString(),
    };

    store.requests.push(request);
    await writeFileStore(store);

    res.status(201).json({ request });
  } catch (error) {
    console.error('Create request error:', error);
    res.status(500).json({ message: 'Failed to create request' });
  }
});

// List requests
router.get('/', authMiddleware, async (req, res) => {
  try {
    const store = await readFileStore();

    // Get all requests where user is sender or recipient
    const requests = store.requests.filter(
      (r: any) => r.senderId === req.userId || r.recipientId === req.userId
    );

    // Attach profile information
    const requestsWithProfiles = requests.map((r: any) => {
      const senderProfile = store.profiles.find((p: any) => p.userId === r.senderId);
      const recipientProfile = store.profiles.find((p: any) => p.userId === r.recipientId);
      return {
        ...r,
        senderProfile,
        recipientProfile,
      };
    });

    res.json({ success: true, requests: requestsWithProfiles });
  } catch (error) {
    console.error('List requests error:', error);
    res.status(500).json({ message: 'Failed to list requests' });
  }
});

// Respond to request
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const store = await readFileStore();
    const request = store.requests.find((r: any) => r.id === req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.recipientId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    request.status = status;
    await writeFileStore(store);

    res.json({ request });
  } catch (error) {
    console.error('Respond request error:', error);
    res.status(500).json({ message: 'Failed to respond to request' });
  }
});

// Cancel request
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const store = await readFileStore();
    const requestIndex = store.requests.findIndex((r: any) => r.id === req.params.id);

    if (requestIndex === -1) {
      return res.status(404).json({ message: 'Request not found' });
    }

    const request = store.requests[requestIndex];

    if (request.senderId !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    store.requests.splice(requestIndex, 1);
    await writeFileStore(store);

    res.json({ message: 'Request cancelled' });
  } catch (error) {
    console.error('Cancel request error:', error);
    res.status(500).json({ message: 'Failed to cancel request' });
  }
});

export default router;
