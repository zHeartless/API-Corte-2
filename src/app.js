
import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static('public'));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Comprobación de salud
app.get('/', (_req, res) => res.json({ message: 'API OK' }));

// Sincroniza modelos y arranca servidor
const PORT = process.env.PORT || 4000;
(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('DB & models sync OK');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Unable to connect to DB:', error);
  }
})();
