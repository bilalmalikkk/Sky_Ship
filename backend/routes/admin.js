import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import Customer from '../models/Customer.js';
import Shipment from '../models/Shipment.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const customerCount = await Customer.countDocuments();
    const shipmentCount = await Shipment.countDocuments();
    
    const recentUsers = await User.find()
      .select('name email role createdAt lastLogin')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const recentCustomers = await Customer.find()
      .select('name company status createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const recentShipments = await Shipment.find()
      .populate('customer', 'name company')
      .select('trackingNumber status createdAt')
      .sort({ createdAt: -1 })
      .limit(5);
    
    const userStats = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    
    const customerStats = await Customer.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const shipmentStats = await Shipment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    res.json({
      counts: {
        users: userCount,
        customers: customerCount,
        shipments: shipmentCount
      },
      recent: {
        users: recentUsers,
        customers: recentCustomers,
        shipments: recentShipments
      },
      stats: {
        users: userStats,
        customers: customerStats,
        shipments: shipmentStats
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    
    let query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id', [
  body('name').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('role').optional().isIn(['admin', 'manager', 'employee']),
  body('isActive').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/users/:id/reset-password', [
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.password = req.body.newPassword;
    await user.save();
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/system/stats', async (req, res) => {
  try {
    const totalRevenue = await Shipment.aggregate([
      { $group: { _id: null, total: { $sum: '$shippingCost' } } }
    ]);
    
    const monthlyStats = await Shipment.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$shippingCost' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);
    
    const topCustomers = await Shipment.aggregate([
      {
        $group: {
          _id: '$customer',
          totalShipments: { $sum: 1 },
          totalRevenue: { $sum: '$shippingCost' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'customers',
          localField: '_id',
          foreignField: '_id',
          as: 'customerInfo'
        }
      }
    ]);
    
    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      monthlyStats,
      topCustomers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
