import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus, cancelMyOrder } from '../controllers/orderController.js';

const router = Router();
router.post('/', protect, createOrder);
router.get('/me', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);
router.patch('/:id/cancel', protect, cancelMyOrder);

export default router;
