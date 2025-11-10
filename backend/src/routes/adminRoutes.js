import { Router } from 'express';
import multer from 'multer';
import { protect, adminOnly } from '../middleware/auth.js';
import { addProduct, updateProduct, deleteProduct, setFeatured } from '../controllers/adminController.js';

const router = Router();
const upload = multer({ dest: 'tmp/' });

router.post('/product', protect, adminOnly, upload.array('images', 5), addProduct);
router.put('/product/:id', protect, adminOnly, upload.array('images', 5), updateProduct);
router.delete('/product/:id', protect, adminOnly, deleteProduct);
router.patch('/product/:id/featured', protect, adminOnly, setFeatured);

export default router;
