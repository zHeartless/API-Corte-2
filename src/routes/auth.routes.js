// src/routes/auth.routes.js

import { Router } from 'express';
// Importa todas las funciones del controlador de autenticación, incluyendo la nueva
import { register, login, refresh, changePassword, retrievePasswordInsecurely } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js'; // Asumo que `verifyToken` es tu middleware de autenticación

const router = Router();

// Rutas de autenticación existentes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

// La ruta para cambiar contraseña protegida por el middleware
router.post('/change-password', verifyToken, changePassword);

// **NUEVA RUTA para la función de recuperación de contraseña (¡ADVERTENCIA DE SEGURIDAD!)**
// Esta ruta no está protegida, ya que se asume que un usuario sin sesión querría usarla.
// De nuevo, recuerda que retrievePasswordInsecurely es altamente insegura y solo para demostración.
router.get('/retrieve-password', retrievePasswordInsecurely);

export default router;