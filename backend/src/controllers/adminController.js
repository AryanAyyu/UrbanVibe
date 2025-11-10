import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

export const addProduct = async (req, res) => {
  try {
    const { name, price, category, brand, description, stock, size, color, imageUrls } = req.body;
    const sizes = Array.isArray(size) ? size : (size ? String(size).split(',').map((s) => s.trim()) : []);

    const images = [];
    if (imageUrls) {
      const urls = String(imageUrls)
        .split(',')
        .map((u) => u.trim())
        .filter((u) => !!u);
      images.push(...urls);
    }
    if (req.files?.length) {
      for (const file of req.files) {
        const uploaded = await cloudinary.uploader.upload(file.path, { folder: 'urbanvibe/products' });
        images.push(uploaded.secure_url);
      }
    }

    const product = await Product.create({ name, price, category, brand, description, stock, size: sizes, images, color });
    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.size) updates.size = Array.isArray(updates.size) ? updates.size : String(updates.size).split(',').map((s) => s.trim());

    const newImages = [];
    if (updates.imageUrls) {
      const urls = String(updates.imageUrls)
        .split(',')
        .map((u) => u.trim())
        .filter((u) => !!u);
      newImages.push(...urls);
      delete updates.imageUrls;
    }
    if (req.files?.length) {
      for (const file of req.files) {
        const uploaded = await cloudinary.uploader.upload(file.path, { folder: 'urbanvibe/products' });
        newImages.push(uploaded.secure_url);
      }
    }
    if (newImages.length) updates.$push = { images: { $each: newImages } };

    const product = await Product.findByIdAndUpdate(id, updates, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

export const setFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;
    if (typeof featured === 'undefined') return res.status(400).json({ message: 'featured is required' });
    if (featured === true || featured === 'true') {
      const count = await Product.countDocuments({ featured: true });
      if (count >= 4) return res.status(400).json({ message: '4 featured products are already selected' });
    }
    const product = await Product.findByIdAndUpdate(id, { featured: featured === true || featured === 'true' }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
