import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Table name is required'],
    unique: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: [true, 'Table capacity is required'],
    min: [1, 'Capacity must be at least 1'],
    max: [8, 'Capacity cannot exceed 8']
  },
  restaurantId: {
    type: String,
    default: 'main-restaurant',
    index: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, { 
  timestamps: true 
});

// Index for quick lookups
tableSchema.index({ capacity: 1, isAvailable: 1 });

export default mongoose.model('Table', tableSchema);
