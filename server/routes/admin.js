// routes/admin.js
import express from 'express';
import Reservation from '../models/Reservation.js';
import Table from '../models/Table.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get ALL reservations (ADMIN ONLY)
// @route   GET /api/admin/reservations
router.get('/reservations', protect, admin, async (req, res) => {
  try {
    const { date } = req.query;
    
    let query = {};
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }
    
    const reservations = await Reservation.find(query)
      .populate('table user', 'name capacity email')
      .sort({ date: 1, timeSlot: 1 })
      .lean();
    
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Get all tables (ADMIN)
// @route   GET /api/admin/tables
router.get('/tables', protect, admin, async (req, res) => {
  try {
    const tables = await Table.find()
      .sort({ capacity: 1 })
      .lean();
    
    res.json(tables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Get all tables (ADMIN)
// @route   GET /api/admin/tables
router.post('/tables', protect, admin, async (req, res) => {
  try {
    const { name, capacity, restaurantId } = req.body;
    
    // Check if table name already exists
    const tableExists = await Table.findOne({ name });
    if (tableExists) {
      return res.status(400).json({ error: 'Table name already exists' });
    }
    
    const table = await Table.create({
      name,
      capacity,
      restaurantId: restaurantId || 'main-restaurant',
      isAvailable: true
    });
    
    res.status(201).json(table);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Update table (ADMIN)
// @route   PATCH /api/admin/tables/:id
router.patch('/tables/:id', protect, admin, async (req, res) => {
  try {
    const { name, capacity, isAvailable } = req.body;
    
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    
    // Check if new name conflicts with existing table
    if (name && name !== table.name) {
      const nameExists = await Table.findOne({ name });
      if (nameExists) {
        return res.status(400).json({ error: 'Table name already exists' });
      }
    }
    
    const updated = await Table.findByIdAndUpdate(
      req.params.id,
      { name, capacity, isAvailable },
      { new: true, runValidators: true }
    );
    
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Delete table (ADMIN)
// @route   DELETE /api/admin/tables/:id
router.delete('/tables/:id', protect, admin, async (req, res) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) {
      return res.status(404).json({ error: 'Table not found' });
    }
    
    // Check if table has active reservations
    const activeReservations = await Reservation.countDocuments({
      table: req.params.id,
      status: 'confirmed',
      date: { $gte: new Date() }
    });
    
    if (activeReservations > 0) {
      return res.status(400).json({ 
        error: `Cannot delete table with ${activeReservations} active reservation(s)` 
      });
    }
    
    await Table.findByIdAndDelete(req.params.id);
    res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// @desc    Update/cancel any reservation (ADMIN SUPERPOWER)
// @route   PATCH /api/admin/reservations/:id
router.patch('/reservations/:id', protect, admin, async (req, res) => {
  try {
    const updates = req.body;
    
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    // Capacity check if guests changed
    if (updates.guests && updates.table) {
      const table = await Table.findById(updates.table);
      if (table && updates.guests > table.capacity) {
        return res.status(400).json({ 
          error: `Table only seats ${table.capacity}` 
        });
      }
    }
    
    const updated = await Reservation.findByIdAndUpdate(
      req.params.id, 
      updates, 
      { new: true, runValidators: true }
    ).populate('table user', 'name capacity email');
    
    res.json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ 
        error: 'Table already booked for that time' 
      });
    }
    res.status(500).json({ error: error.message });
  }
});

// @desc    Cancel any reservation (ADMIN)
// @route   DELETE /api/admin/reservations/:id
router.delete('/reservations/:id', protect, admin, async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ message: 'Reservation cancelled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
