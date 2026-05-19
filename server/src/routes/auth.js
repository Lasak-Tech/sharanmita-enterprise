import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../utils/firebase.js';

const router = express.Router();

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, phone, password, role } = req.body;

  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    if (!snapshot.empty) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    if (phone && phone !== 'N/A') {
      const phoneSnapshot = await usersRef.where('phone', '==', phone).get();
      if (!phoneSnapshot.empty) {
        return res.status(400).json({ message: 'User with this phone number already exists' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || 'CUSTOMER',
      createdAt: new Date().toISOString()
    };

    const docRef = await usersRef.add(newUser);

    res.status(201).json({
      _id: docRef.id,
      name,
      email,
      role: newUser.role,
      token: generateToken(docRef.id, newUser.role)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, phone, password } = req.body;

  try {
    const usersRef = db.collection('users');
    let snapshot;
    
    if (email) {
      snapshot = await usersRef.where('email', '==', email).get();
    } else if (phone) {
      snapshot = await usersRef.where('phone', '==', phone).get();
    }

    if (!snapshot || snapshot.empty) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    if (await bcrypt.compare(password, user.password)) {
      res.json({
        _id: userDoc.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(userDoc.id, user.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Change user password (Admin)
// @route   PATCH /api/auth/change-password
router.patch('/change-password', async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (snapshot.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const userDocId = snapshot.docs[0].id;
    
    await usersRef.doc(userDocId).update({ password: hashedPassword });
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Reset/Set password via phone (Simulated OTP flow)
// @route   PATCH /api/auth/reset-password
router.patch('/reset-password', async (req, res) => {
  const { phone, newPassword } = req.body;
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('phone', '==', phone).get();
    
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No account found with this phone number' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const userDocId = snapshot.docs[0].id;
    
    await usersRef.doc(userDocId).update({ password: hashedPassword });
    res.json({ message: 'Password successfully set. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user role
// @route   PATCH /api/auth/update-role
router.patch('/update-role', async (req, res) => {
  const { email, role } = req.body;
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (snapshot.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDocId = snapshot.docs[0].id;
    await usersRef.doc(userDocId).update({ role });
    res.json({ message: `User role updated to ${role} successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all users
// @route   GET /api/auth/users
router.get('/users', async (req, res) => {
  try {
    const snapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a user
// @route   DELETE /api/auth/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    await db.collection('users').doc(req.params.id).delete();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
