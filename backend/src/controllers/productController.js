import Product from '../models/Product.js';
import Order from '../models/Order.js';

export const getProducts = async (req, res) => {
  try {
    const { q, category, sort, brand, min, max, featured, limit } = req.query;
    const filter = {};

    if (q) filter.name = { $regex: q, $options: 'i' };
    if (category) {
      const esc = String(category).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.category = { $regex: `^${esc}$`, $options: 'i' };
    }
    if (brand) filter.brand = brand;
    if (min || max) filter.price = { ...(min ? { $gte: Number(min) } : {}), ...(max ? { $lte: Number(max) } : {}) };
    if (typeof featured !== 'undefined') filter.featured = featured === 'true';
    let query = Product.find(filter);
    if (sort) {
      const map = { newest: '-createdAt', price_asc: 'price', price_desc: '-price' };
      query = query.sort(map[sort] || '-createdAt');
    } else {
      query = query.sort('-createdAt');
    }
    if (limit) query = query.limit(Number(limit));
    const products = await query;
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const rateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { value, orderId } = req.body;
    if (!value || value < 1 || value > 5) return res.status(400).json({ message: 'Rating value must be between 1 and 5' });
    if (!orderId) return res.status(400).json({ message: 'orderId is required to rate' });
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (req.user.id === 'admin') return res.status(403).json({ message: 'You can only rate products you have purchased' });

    // Ensure the order belongs to user, is delivered, and includes this product
    const order = await Order.findOne({ _id: orderId, userId: req.user.id, orderStatus: 'delivered', 'products.product': id });
    if (!order) return res.status(403).json({ message: 'You can only rate delivered orders that include this product' });

    // Allow different rating per order: update if same user+orderId already rated, else add new
    const existing = product.ratings.find(r => String(r.user) === String(userId) && String(r.orderId) === String(orderId));
    if (existing) {
      return res.status(400).json({ message: 'You have already rated this order for this product' });
    }
    product.ratings.push({ user: userId, orderId, value });

    const total = product.ratings.reduce((a, r) => a + r.value, 0);
    product.ratingCount = product.ratings.length;
    product.ratingAverage = product.ratingCount ? (total / product.ratingCount) : 0;

    await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const canRateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user?._id) return res.status(401).json({ canRate: false, message: 'Unauthorized' });
    if (req.user.id === 'admin') return res.json({ canRate: false });
    const exists = await Order.exists({ userId: req.user.id, 'products.product': id });
    res.json({ canRate: !!exists });
  } catch (e) {
    res.status(500).json({ canRate: false, message: e.message });
  }
};
