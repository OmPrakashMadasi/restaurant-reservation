import Table from '../models/Table.js';

export const seedTables = async () => {
  try {
    const count = await Table.countDocuments();
    
    if (count === 0) {
      console.log('🌱 Seeding tables...');
      
      const tables = [
        { name: 'Table 1 (Window)', capacity: 2 },
        { name: 'Table 2', capacity: 2 },
        { name: 'Table 3', capacity: 4 },
        { name: 'Table 4 (Corner)', capacity: 4 },
        { name: 'Table 5', capacity: 4 },
        { name: 'Table 6', capacity: 6 },
        { name: 'Table 7 (Booth)', capacity: 6 },
        { name: 'Table 8 (Large)', capacity: 8 }
      ];
      
      await Table.insertMany(tables);
      console.log('✅ 8 tables seeded!');
    } else {
      console.log(`ℹ️  ${count} tables already exist`);
    }
  } catch (error) {
    console.error('❌ Seed error:', error.message);
  }
};
