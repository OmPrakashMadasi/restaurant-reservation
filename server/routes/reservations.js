// routes/reservations.js
import express from 'express';
import Reservation from '../models/Reservation.js';
import Table from '../models/Table.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all tables (PUBLIC for customers)
router.get('/tables', protect, async (req, res) => {
  try {
    const tables = await Table.find({ isAvailable: true })
      .sort({ capacity: 1 })
      .lean();
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Create new reservation (CUSTOMER ONLY)
// @route   POST /api/reservations
router.post('/', protect, async (req, res) => {
  try {
    const { date, timeSlot, guests, tableId, notes } = req.body;

    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (reservationDate < today) {
      return res.status(400).json({ error: 'Cannot book past dates' });
    }
    
    // 1. Find the table
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    
    // 2. Check capacity
    if (guests > table.capacity) {
      return res.status(400).json({ 
        error: `This table seats ${table.capacity} guests. You selected ${guests}. Please choose a larger table.`
      });
    }
    
    
    // 3. Create reservation - MongoDB unique index auto-prevents double booking!
    const reservation = new Reservation({
      user: req.user._id,
      table: tableId,
      date,
      timeSlot,
      guests,
      notes
    });
    
    const saved = await reservation.save();
    await saved.populate('table user', 'name capacity email');
    
    res.status(201).json(saved);
    
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ 
        error: 'Table already booked for that time. Pick another slot.' 
      });
    }
    res.status(500).json({ error: error.message });
  }
});

// @desc    Get my reservations (CUSTOMER)
// @route   GET /api/reservations/my
router.get('/my', protect, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('table', 'name capacity')
      .sort({ date: 1, timeSlot: 1 })
      .lean();
    
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Cancel my reservation (CUSTOMER)
// @route   DELETE /api/reservations/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const reservation = await Reservation.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reservation cancelled' });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
