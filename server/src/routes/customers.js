import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import * as xlsx from 'xlsx';
import { db } from '../utils/firebase.js';
import { protect, authorize } from '../middleware/auth.js';
import bcrypt from 'bcryptjs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// @desc    Get all customers
router.get('/', protect, authorize('ADMIN', 'EMPLOYEE'), async (req, res) => {
  try {
    const snapshot = await db.collection('customers').orderBy('createdAt', 'desc').get();
    const customers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Lookup customer by serial number (Open Route)
router.get('/lookup/:serialNumber', async (req, res) => {
  try {
    const serialNumber = String(req.params.serialNumber).replace(/['"]/g, '').trim();
    // Search by Serial Number (cableId), Account No (customerExternalId), or VC Number
    let snapshot = await db.collection('customers').where('cableId', '==', serialNumber).get();
    
    if (snapshot.empty) {
      snapshot = await db.collection('customers').where('customerExternalId', '==', serialNumber).get();
    }

    if (snapshot.empty) {
      snapshot = await db.collection('customers').where('vcNumber', '==', serialNumber).get();
    }
    
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No record found for this serial number' });
    }
    
    const doc = snapshot.docs[0];
    const data = doc.data();
    
    res.json({
      id: doc.id,
      name: data.name,
      cableId: data.cableId,
      phone: data.phone,
      monthlyAmount: data.monthlyAmount || 0,
      status: data.status,
      dueDate: data.dueDate,
      vcNumber: data.vcNumber,
      accountNo: data.customerExternalId
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get current customer profile
router.get('/me', protect, authorize('CUSTOMER'), async (req, res) => {
  try {
    const authUserDoc = await db.collection('users').doc(req.user.id).get();
    if (!authUserDoc.exists) {
      return res.status(404).json({ message: 'Auth user not found' });
    }
    const user = authUserDoc.data();

    const usersRef = db.collection('customers');
    let snapshot;
    
    if (user.email) {
      snapshot = await usersRef.where('email', '==', user.email).get();
    } 
    if (!snapshot || snapshot.empty) {
      if (user.phone) {
        snapshot = await usersRef.where('phone', '==', user.phone).get();
      }
    }

    if (!snapshot || snapshot.empty) {
      return res.status(404).json({ message: 'Customer record not found' });
    }

    const doc = snapshot.docs[0];
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a single customer
router.post('/', protect, authorize('ADMIN'), async (req, res) => {
  const { name, phone, email, cableId, monthlyAmount, dueDate, password } = req.body;
  try {
    // Also create auth user
    const usersRef = db.collection('users');
    const existingUser = await usersRef.where('email', '==', email).get();
    if (existingUser.empty) {
      const hashedPassword = await bcrypt.hash(password || 'password123', 10);
      await usersRef.add({
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'CUSTOMER',
        createdAt: new Date().toISOString()
      });
    }

    const customerData = {
      name,
      phone,
      email,
      cableId,
      monthlyAmount: parseFloat(monthlyAmount),
      status: 'UNPAID',
      dueDate: new Date(dueDate || Date.now()).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('customers').add(customerData);
    res.status(201).json({ id: docRef.id, ...customerData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding customer' });
  }
});

// @desc    Upload customers from Excel
router.post('/upload', protect, authorize('ADMIN'), upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload an Excel file' });
  }

  try {
    const defaultPassword = await bcrypt.hash('password123', 10);
    const filePath = path.resolve(req.file.path);
    const fileBuffer = fs.readFileSync(filePath);
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    if (!data || data.length === 0) {
      return res.status(400).json({ message: 'The uploaded file is empty or has no readable data.' });
    }

    let batch = db.batch();
    let count = 0;
    const customersRef = db.collection('customers');
    const usersRef = db.collection('users');

    for (const row of data) {
      // Robust header mapping
      const serialNumber = String(
        row['Serial Number'] || 
        row['cableId'] || 
        row['Cable ID'] || 
        row['STB Number'] || 
        row['Serial No'] || 
        ''
      ).trim();

      if (!serialNumber) continue;

      const customerData = {
        customerExternalId: String(row['Account No'] || row['customerExternalId'] || row['Customer ID'] || row['Account Number'] || '').trim(),
        lcoCustomerId: String(row['LCO Customer ID'] || row['LCO ID'] || '').trim(),
        name: row['Name'] || row['Customer Name'] || 'Unknown',
        email: row['Email'] || row['email'] || '',
        phone: String(row['Mobile No'] || row['phone'] || row['Phone Number'] || row['Mobile'] || '').trim(),
        address: row['Address'] || row['Location'] || '',
        cableId: serialNumber,
        vcNumber: String(row['VC Number'] || row['VC No'] || '').trim(),
        packageName: String(row['Package(s)'] || row['Package'] || row['Plan'] || ''),
        monthlyAmount: parseFloat(String(row['Monthly Amount'] || row['amount'] || row['Monthly Rent'] || row['Rent'] || row['Bill Amount'] || row['Total Amount'] || row['Balance'] || 0).replace(/[^0-9.]/g, '')) || 0,
        status: (row['Status'] || row['status'] || row['Payment Status'])?.toUpperCase() === 'PAID' ? 'PAID' : 'UNPAID',
        dueDate: new Date(row['Due Date'] || row['Expiry Date'] || Date.now()).toISOString(),
        createdAtDate: row['Created Date'] || null,
        updatedAt: new Date().toISOString()
      };

      const docId = serialNumber.replace(/[\/\s.]/g, '_');
      const docRef = customersRef.doc(docId);
      batch.set(docRef, { ...customerData, createdAt: new Date().toISOString() }, { merge: true });
      count++;

      // Firestore batch limit is 500
      if (count >= 500) {
        await batch.commit();
        batch = db.batch();
        count = 0;
      }

      // Create auth account if missing (non-blocking for batch)
      let existingUser;
      if (customerData.email) {
        existingUser = await usersRef.where('email', '==', customerData.email).get();
      } else if (customerData.phone) {
        existingUser = await usersRef.where('phone', '==', customerData.phone).get();
      }
      
      if (existingUser && existingUser.empty) {
        const newUserRef = usersRef.doc();
        batch.set(newUserRef, {
          name: customerData.name,
          email: customerData.email || null,
          phone: customerData.phone || null,
          password: defaultPassword,
          role: 'CUSTOMER',
          createdAt: new Date().toISOString()
        });
        count++;
        
        if (count >= 500) {
          await batch.commit();
          batch = db.batch();
          count = 0;
        }
      }
    }

    if (count > 0) {
      await batch.commit();
    }
    res.status(201).json({ message: `${data.length} customers processed successfully`, count: data.length });
  } catch (error) {
    console.error('UPLOAD ERROR:', error);
    // Log to a file we can check if needed
    fs.appendFileSync('error.log', `${new Date().toISOString()} - ${error.stack}\n`);
    res.status(500).json({ message: `Error processing file: ${error.message}` });
  }
});

// @desc    Update customer payment status
router.patch('/:id/status', protect, authorize('ADMIN', 'EMPLOYEE'), async (req, res) => {
  const { status } = req.body;
  try {
    await db.collection('customers').doc(req.params.id).update({ status, updatedAt: new Date().toISOString() });
    res.json({ id: req.params.id, status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a customer
router.delete('/:id', protect, authorize('ADMIN'), async (req, res) => {
  try {
    const customerDoc = await db.collection('customers').doc(req.params.id).get();
    if (!customerDoc.exists) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const customer = customerDoc.data();

    // Also delete associated auth user if exists
    if (customer.email || customer.phone) {
      const usersRef = db.collection('users');
      let userSnap;
      if (customer.email) {
        userSnap = await usersRef.where('email', '==', customer.email).get();
      } else {
        userSnap = await usersRef.where('phone', '==', customer.phone).get();
      }
      
      if (!userSnap.empty) {
        await usersRef.doc(userSnap.docs[0].id).delete();
      }
    }

    await db.collection('customers').doc(req.params.id).delete();
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get stats for dashboard
router.get('/stats', protect, authorize('ADMIN', 'EMPLOYEE'), async (req, res) => {
  try {
    const snapshot = await db.collection('customers').get();
    let totalCustomers = 0;
    let paidCustomers = 0;
    let unpaidCustomers = 0;
    let revenue = 0;

    snapshot.forEach(doc => {
      const data = doc.data();
      totalCustomers++;
      if (data.status === 'PAID') {
        paidCustomers++;
        revenue += data.monthlyAmount || 0;
      } else {
        unpaidCustomers++;
      }
    });

    res.json({
      totalCustomers,
      paidCustomers,
      unpaidCustomers,
      revenue
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
