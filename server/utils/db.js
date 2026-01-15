import mongoose from 'mongoose';
import Table from '../models/Table.js';
import { seedTables } from '../seed/seedTables.js'; // we'll make this next

const connectDB = async () => {
  try {
    // Replace with your Atlas string or use .env
    const connStr = process.env.MONGODB_URI || 'your-mongodb-atlas-string-here';
    
    await mongoose.connect(connStr, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB connected');
    
    // Seed tables only once
    await seedTables();
    
  } catch (error) {
    console.error('❌ DB connection error:', error.message);
    process.exit(1);
  }
};

// Handle connection close on app termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB disconnected');
  process.exit(0);
});

export default connectDB;
