import express from 'express';
import { body, validationResult } from 'express-validator';
import Shipment from '../models/Shipment.js';
import Customer from '../models/Customer.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type, search } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (type) {
      query.type = type;
    }
    
    if (search) {
      query.$or = [
        { trackingNumber: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const shipments = await Shipment.find(query)
      .populate('customer', 'name email company')
      .populate('assignedTo', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
    
    const total = await Shipment.countDocuments(query);
    
    res.json({
      shipments,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/tracking/:trackingNumber', async (req, res) => {
  try {
    const shipment = await Shipment.findOne({ 
      trackingNumber: req.params.trackingNumber 
    }).populate('customer', 'name company');
    
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id)
      .populate('customer', 'name email company phone address')
      .populate('assignedTo', 'name email');
    
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    
    res.json(shipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', [
  body('trackingNumber').notEmpty().withMessage('Tracking number is required'),
  body('customer').isMongoId().withMessage('Valid customer ID is required'),
  body('origin').isObject().withMessage('Origin address is required'),
  body('destination').isObject().withMessage('Destination address is required'),
  body('weight').isNumeric().withMessage('Weight must be a number'),
  body('shippingCost').isNumeric().withMessage('Shipping cost must be a number'),
  body('type').optional().isIn(['express', 'standard', 'economy']),
  body('estimatedDelivery').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const customerExists = await Customer.findById(req.body.customer);
    if (!customerExists) {
      return res.status(400).json({ message: 'Customer not found' });
    }
    
    const trackingExists = await Shipment.findOne({ 
      trackingNumber: req.body.trackingNumber 
    });
    if (trackingExists) {
      return res.status(400).json({ message: 'Tracking number already exists' });
    }
    
    const shipmentData = {
      ...req.body,
      assignedTo: req.user._id,
      trackingHistory: [{
        status: 'pending',
        location: req.body.origin.city || 'Origin',
        description: 'Shipment created'
      }]
    };
    
    const shipment = await Shipment.create(shipmentData);
    
    const populatedShipment = await Shipment.findById(shipment._id)
      .populate('customer', 'name email company')
      .populate('assignedTo', 'name email');
    
    res.status(201).json(populatedShipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', [
  body('status').optional().isIn(['pending', 'in-transit', 'delivered', 'cancelled', 'returned']),
  body('type').optional().isIn(['express', 'standard', 'economy']),
  body('estimatedDelivery').optional().isISO8601(),
  body('actualDelivery').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const shipment = await Shipment.findById(req.params.id);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    
    if (req.body.status && req.body.status !== shipment.status) {
      shipment.trackingHistory.push({
        status: req.body.status,
        location: req.body.location || 'Unknown',
        description: req.body.description || `Status updated to ${req.body.status}`
      });
    }
    
    Object.assign(shipment, req.body);
    await shipment.save();
    
    const updatedShipment = await Shipment.findById(shipment._id)
      .populate('customer', 'name email company')
      .populate('assignedTo', 'name email');
    
    res.json(updatedShipment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', authorize('admin', 'manager'), async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndDelete(req.params.id);
    
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    
    res.json({ message: 'Shipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/stats/overview', async (req, res) => {
  try {
    const stats = await Shipment.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          inTransit: { $sum: { $cond: [{ $eq: ['$status', 'in-transit'] }, 1, 0] } },
          delivered: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
          cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
          totalRevenue: { $sum: '$shippingCost' }
        }
      }
    ]);
    
    const typeStats = await Shipment.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      overview: stats[0] || { 
        total: 0, 
        pending: 0, 
        inTransit: 0, 
        delivered: 0, 
        cancelled: 0, 
        totalRevenue: 0 
      },
      types: typeStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
