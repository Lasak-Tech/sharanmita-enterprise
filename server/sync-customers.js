import { db } from './src/utils/firebase.js';
import bcrypt from 'bcryptjs';

const sync = async () => {
  const snapshot = await db.collection('customers').get();
  const usersRef = db.collection('users');
  const hashedPassword = await bcrypt.hash('password123', 10);
  let count = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!data.email && !data.phone) continue;
    
    let existing;
    if (data.email) {
      existing = await usersRef.where('email', '==', data.email).get();
    } else {
      existing = await usersRef.where('phone', '==', data.phone).get();
    }
    
    if (existing.empty) {
      await usersRef.add({
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        password: hashedPassword,
        role: 'CUSTOMER',
        createdAt: new Date().toISOString()
      });
      count++;
      console.log('Added auth user:', data.name);
    }
  }
  console.log(`Done. Created ${count} users.`);
  process.exit(0);
};

sync();
