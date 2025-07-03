
import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { verifyToken, verifyRole } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyToken); // todas protegidas

router.get('/', verifyRole(['user', 'admin']), getProducts);
router.post('/', verifyRole(['admin']), createProduct);
router.get('/:id', verifyRole(['user', 'admin']), getProduct);
router.put('/:id', verifyRole(['admin']), updateProduct);
router.delete('/:id', verifyRole(['admin']), deleteProduct);

export default router;
