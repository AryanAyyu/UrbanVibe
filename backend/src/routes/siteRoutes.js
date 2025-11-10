import { Router } from 'express';
import { contact } from '../controllers/siteController.js';

const router = Router();
router.post('/contact', contact);

export default router;
