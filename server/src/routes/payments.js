import express from 'express';
import { db } from '../utils/firebase.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all payments
router.get('/', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const snapshot = await db.collection('payments').orderBy('createdAt', 'desc').get();
    const payments = [];
    
    // In Firestore, we might need to fetch customer details separately or denormalize
    for (const doc of snapshot.docs) {
      const paymentData = doc.data();
      const customerDoc = await db.collection('customers').doc(paymentData.customerId).get();
      payments.push({
        id: doc.id,
        ...paymentData,
        customer: customerDoc.exists ? customerDoc.data() : null
      });
    }
    
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get customer payment history
router.get('/customer/:customerId', protect, async (req, res) => {
  const { customerId } = req.params;

  try {
    const snapshot = await db.collection('payments')
      .where('customerId', '==', customerId)
      .get();
    
    let payments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Sort in memory instead to avoid composite index requirements
    payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Record a payment
router.post('/', protect, async (req, res) => {
  const { customerId, amount, method, transactionId } = req.body;

  try {
    const newPayment = {
      customerId,
      amount,
      method,
      transactionId,
      status: 'SUCCESS',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('payments').add(newPayment);

    // Update customer status to PAID
    await db.collection('customers').doc(customerId).update({ 
      status: 'PAID', 
      updatedAt: new Date().toISOString() 
    });

    res.status(201).json({ id: docRef.id, ...newPayment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Record a quick payment (unprotected)
router.post('/quick', async (req, res) => {
  const { customerId, amount, method, transactionId } = req.body;

  try {
    const newPayment = {
      customerId,
      amount,
      method,
      transactionId,
      status: 'SUCCESS',
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('payments').add(newPayment);

    await db.collection('customers').doc(customerId).update({ 
      status: 'PAID', 
      updatedAt: new Date().toISOString() 
    });

    res.status(201).json({ id: docRef.id, ...newPayment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
