import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    brand: { type: String },
    description: { type: String },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    size: [{ type: String }],
    color: { type: String },
    featured: { type: Boolean, default: false },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        value: { type: Number, min: 1, max: 5 },
      },
    ],
    ratingAverage: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);
