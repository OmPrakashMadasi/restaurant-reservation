import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  table: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Reservation date is required']
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required'],
    enum: ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30']
  },
  guests: {
    type: Number,
    required: [true, 'Number of guests is required'],
    min: [1, 'At least 1 guest'],
    max: [12, 'Max 12 guests']
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: 200
  }
}, { 
  timestamps: true 
});

// CRITICAL: Prevent double booking same table/date/time
reservationSchema.index({ 
  table: 1, 
  date: 1, 
  timeSlot: 1 
}, { unique: true });

// Quick lookup for customer reservations
reservationSchema.index({ user: 1, date: -1 });

export default mongoose.model('Reservation', reservationSchema);
