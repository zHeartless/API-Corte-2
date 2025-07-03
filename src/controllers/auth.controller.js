// src/controllers/auth.controller.js

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs'; // Asegúrate de que User.validPassword() use bcrypt
import User from '../models/user.model.js'; // Asegúrate de que esta ruta sea correcta
import RefreshToken from '../models/refreshToken.model.js'; // Asegúrate de que esta ruta sea correcta

dotenv.config();

const generateAccessToken = (user) =>
  jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '900s',
  });

const generateRefreshToken = async (user) => {
  const token = uuidv4() + uuidv4();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7); // Expira en 7 días
  await RefreshToken.create({ token, expiryDate, UserId: user.id });
  return token;
};

export const register = async (req, res) => {
  try {
    const { username, password, role } = req.body; // 'role' es opcional, si no lo envías, puedes darle un valor por defecto

    // NUEVA VALIDACIÓN: Asegurar que se envíen usuario y contraseña
    if (!username || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña son requeridos para el registro.' });
    }

    // NUEVA VALIDACIÓN: Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso. Por favor, elige otro.' });
    }

    // Tu código actual asume que el hashing de la contraseña se maneja en el modelo User,
    // por ejemplo, con un hook `beforeCreate` o un método `setPassword`.
    // Si no es así, necesitarías hashear la contraseña aquí antes de `User.create`.
    const user = await User.create({ username, password, role: role || 'user' }); // Asignar un rol por defecto si no se proporciona

    // CAMBIO EN LA RESPUESTA DE ÉXITO DE REGISTRO
    res.status(201).json({
      message: '¡Registro exitoso! Ahora puedes iniciar sesión.', // Mensaje amigable
      user: {
        id: user.id,
        username: user.username,
        role: user.role, // Incluir el rol si es relevante
      },
    });
  } catch (err) {
    // Mejorar el manejo de errores:
    console.error('Error al registrar usuario:', err); // Log para depuración
    if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'El nombre de usuario ya existe.' });
    }
    res.status(500).json({ message: 'Error interno del servidor al registrarse. Inténtalo de nuevo más tarde.' });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // NUEVA VALIDACIÓN: Asegurar que se envíen usuario y contraseña
    if (!username || !password) {
        return res.status(400).json({ message: 'Usuario y contraseña son requeridos para iniciar sesión.' });
    }

    const user = await User.findOne({ where: { username } });

    // CAMBIO EN EL MENSAJE DE CREDENCIALES INVÁLIDAS
    // Asumo que user.validPassword() compara la contraseña hasheada
    if (!user || !(await user.validPassword(password))) {
      return res.status(401).json({ message: 'Credenciales inválidas. Verifica tu usuario y contraseña.' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    // CAMBIO EN LA RESPUESTA DE ÉXITO DE INICIO DE SESIÓN
    res.json({
      message: `¡Bienvenido, ${user.username}!`, // Mensaje amigable con el nombre de usuario
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        role: user.role, // Incluir el rol si es relevante
      },
    });
  } catch (err) {
    // Mejorar el manejo de errores:
    console.error('Error al iniciar sesión:', err); // Log para depuración
    res.status(500).json({ message: 'Error interno del servidor al iniciar sesión. Inténtalo de nuevo más tarde.' });
  }
};

export const refresh = async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ message: 'Refresh token missing' });
  try {
    const stored = await RefreshToken.findOne({ where: { token } });
    if (!stored || stored.expiryDate < new Date())
      return res.status(403).json({ message: 'Refresh token invalid or expired' });

    const user = await User.findByPk(stored.UserId);
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!(await user.validPassword(oldPassword)))
      return res.status(400).json({ message: 'Incorrect current password' });
    // Asegúrate de que tu modelo User tenga un método para hashear la nueva contraseña
    user.password = newPassword; // Esto asumirá que tu modelo tiene un setter que hashea la contraseña
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// **ESTA FUNCIÓN ES EXTREMADAMENTE INSEGURA Y SOLO PARA DEMOSTRACIÓN**
// **NO LA USES EN UN ENTORNO REAL.**
export const retrievePasswordInsecurely = async (req, res) => {
    try {
        const { username } = req.query; // Esperamos el usuario como query parameter
        if (!username) {
            return res.status(400).json({ message: 'Se requiere el nombre de usuario.' });
        }

        const user = await User.findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        // NO podemos devolver la contraseña real hasheada.
        // Para que la demo del frontend muestre *algo*, simularemos una contraseña temporal.
        // En un sistema real, NUNCA HARÍAMOS ESTO.

        return res.status(200).json({
            message: 'En un sistema real, se enviaría un enlace de restablecimiento seguro.',
            password: 'temporal_demo_password' // Esto es una SIMULACIÓN. No es la contraseña real.
        });

    } catch (error) {
        console.error('Error al recuperar contraseña de forma insegura:', error);
        res.status(500).json({ message: 'Error interno del servidor.' });
    }
};