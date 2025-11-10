import { Router } from 'express';
import { getProducts, getProductById, rateProduct, canRateProduct } from '../controllers/productController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id/rate', protect, rateProduct);
router.get('/:id/can-rate', protect, canRateProduct);

export default router;
