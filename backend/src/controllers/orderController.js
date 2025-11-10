import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  try {
    const { products, totalAmount, address } = req.body;
    const order = await Order.create({ userId: req.user.id, products, totalAmount, address });
    res.status(201).json(order);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const cancelMyOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, userId: req.user.id });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }
    order.orderStatus = 'cancelled';
    await order.save();
    const populated = await Order.findById(order._id)
      .populate('products.product', 'name _id');
    res.json(populated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    if (req.user.id === 'admin') {
      return res.json([])
    }
    const orders = await Order.find({ userId: req.user.id })
      .sort('-createdAt')
      .populate('products.product', 'name _id');
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .sort('-createdAt')
      .populate('userId', 'name email')
      .populate('products.product', 'name _id');
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'status is required' });
    const allowed = ['pending', 'accepted', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const order = await Order.findByIdAndUpdate(id, { orderStatus: status }, { new: true })
      .populate('userId', 'name email')
      .populate('products.product', 'name');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
